import { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, PhoneOff, Volume2, Brain, ChevronRight, RotateCcw, Download, X, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

// ─── Theme ───────────────────────────────────────────────────────────────────
const Y = "#FFE500";
const B = "#0A0A0A";
const W = "#FFFFFF";
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };
const BEBAS: React.CSSProperties = { fontFamily: "'Bebas Neue', cursive" };

// ─── Types ───────────────────────────────────────────────────────────────────
type Phase = "setup" | "prereqs" | "interview" | "analyzing" | "report";
type OrbState = "idle" | "speaking" | "listening" | "processing";

interface ChatMsg { role: "user" | "assistant"; content: string }
interface ReportData {
  score: number; verdict: string; summary: string;
  strengths: string[]; weaknesses: string[]; recommendations: string[];
  question_breakdown: { question: string; answer_summary: string; rating: string; feedback: string }[];
}

// ─── Constants ───────────────────────────────────────────────────────────────
const ROLES = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "AI Engineer"];
const PREREQS: Record<string, string[]> = {
  "AI Engineer":          ["Student or recent graduate?", "Any AI/ML projects or coursework you have done?", "Which ML frameworks have you used?"],
  "Frontend Developer":   ["Student or recent graduate?", "Any frontend projects you have built?", "Which frameworks have you worked with?"],
  "Backend Developer":    ["Student or recent graduate?", "Any backend projects or APIs you have built?", "Which databases or backend frameworks have you used?"],
  "Full Stack Developer": ["Student or recent graduate?", "Any full-stack projects you have built?", "Which tech stack do you prefer?"],
};
const INTERVIEW_DURATION = 600;

// ─── Verdict colour ───────────────────────────────────────────────────────────
const verdictColor = (v: string) =>
  v === "EXCELLENT" ? "#059669" : v === "GOOD" ? "#0284C7" : v === "AVERAGE" ? "#D97706" : "#DC2626";

// ─── AIOrb ───────────────────────────────────────────────────────────────────
const AIOrb = ({ state }: { state: OrbState }) => {
  const glowColor =
    state === "speaking"   ? "rgba(124,58,237,0.45)"
    : state === "listening" ? "rgba(99,102,241,0.35)"
    : "rgba(124,58,237,0.12)";

  return (
    <div style={{ position: "relative", width: 200, height: 200, margin: "0 auto", flexShrink: 0 }}>
      <style>{`
        @keyframes orbRing   { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(2.2);opacity:0} }
        @keyframes orbBreath { 0%,100%{transform:scale(1)} 50%{transform:scale(1.07)} }
        @keyframes orbPop    { 0%,100%{transform:scale(1);opacity:.85} 50%{transform:scale(.93);opacity:1} }
        @keyframes micPulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
        @keyframes spinSlow  { to{transform:rotate(360deg)} }
      `}</style>

      {/* expanding rings — speaking only */}
      {state === "speaking" && [0, 0.55, 1.1].map((delay, i) => (
        <div key={i} style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          border: "2px solid rgba(124,58,237,0.5)",
          animation: `orbRing 1.8s ${delay}s ease-out infinite`,
        }} />
      ))}

      {/* halo */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        transition: "background 0.4s",
      }} />

      {/* core */}
      <div style={{
        position: "absolute", inset: "25px",
        borderRadius: "50%",
        background: "radial-gradient(circle at 38% 35%, #fff 0%, #f5f3ff 45%, #ede9fe 80%, #ddd6fe 100%)",
        boxShadow: state === "speaking"
          ? "0 0 40px rgba(124,58,237,0.55), 0 0 15px rgba(124,58,237,0.35)"
          : state === "listening"
          ? "0 0 25px rgba(99,102,241,0.4)"
          : "0 0 20px rgba(124,58,237,0.15)",
        animation: state === "listening"  ? "orbBreath 3s ease-in-out infinite"
                 : state === "processing" ? "orbPop .9s ease-in-out infinite"
                 : undefined,
        transition: "box-shadow 0.4s",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {state === "speaking" && <Volume2 size={34} color="#7C3AED" />}
        {state === "listening" && (
          <Mic size={34} color="#4F46E5"
            style={{ animation: "micPulse 1.5s ease-in-out infinite" }} />
        )}
        {state === "processing" && (
          <Brain size={34} color="#7C3AED"
            style={{ animation: "spinSlow 1.2s linear infinite" }} />
        )}
        {state === "idle" && <Brain size={34} color="#7C3AED" />}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
interface MockInterviewProps { onExit: () => void }

const MockInterview = ({ onExit }: MockInterviewProps) => {
  // ── Credits ──────────────────────────────────────────────────────────────
  const [credits, setCredits]         = useState<number | null>(null);
  const [creditsError, setCreditsError] = useState(false);
  const [creditsLoading, setCreditsLoading] = useState(true);

  useEffect(() => {
    api.mockInterview.getCredits()
      .then(r => { setCredits(r.credits); setCreditsError(false); })
      .catch(() => setCreditsError(true))
      .finally(() => setCreditsLoading(false));
  }, []);

  // ── Core state ───────────────────────────────────────────────────────────
  const [phase,          setPhase]          = useState<Phase>("setup");
  const [selectedRole,   setSelectedRole]   = useState("");
  const [prereqAnswers,  setPrereqAnswers]  = useState(["", "", ""]);
  const [prereqStep,     setPrereqStep]     = useState(0);
  const [candidateInfo,  setCandidateInfo]  = useState("");
  const [messages,       setMessages]       = useState<ChatMsg[]>([]);
  const [currentQ,       setCurrentQ]       = useState("");
  const [currentEval,    setCurrentEval]    = useState("");
  const [qNum,           setQNum]           = useState(0);
  const [orbState,       setOrbState]       = useState<OrbState>("idle");
  const [transcript,     setTranscript]     = useState("");
  const [interim,        setInterim]        = useState("");
  const [micActive,      setMicActive]      = useState(true);
  const [timeLeft,       setTimeLeft]       = useState(INTERVIEW_DURATION);
  const [report,         setReport]         = useState<ReportData | null>(null);
  const [history,        setHistory]        = useState<{ role: "ai" | "user"; text: string }[]>([]);
  const [showTranscript, setShowTranscript] = useState(false);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const transcriptRef  = useRef("");
  const dgTokenRef     = useRef("");
  const wsRef          = useRef<WebSocket | null>(null);
  const audioCtxRef    = useRef<AudioContext | null>(null);
  const processorRef   = useRef<ScriptProcessorNode | null>(null);
  const streamRef      = useRef<MediaStream | null>(null);
  const audioElRef     = useRef<HTMLAudioElement | null>(null);
  const micActiveRef   = useRef(true);
  const isProcessRef   = useRef(false);
  const handleSubmitRef = useRef<(() => void) | null>(null);
  const endCallRef     = useRef<(() => void) | null>(null);
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const txEndRef       = useRef<HTMLDivElement>(null);

  const addToHistory = useCallback((role: "ai" | "user", text: string) => {
    setHistory(h => [...h, { role, text }]);
  }, []);

  // ── Keep refs in sync ────────────────────────────────────────────────────
  useEffect(() => { micActiveRef.current = micActive; }, [micActive]);

  // ── Auto-scroll transcript ───────────────────────────────────────────────
  useEffect(() => { txEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [history, interim]);

  // ── Timer ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "interview") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setTimeLeft(INTERVIEW_DURATION);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          endCallRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  // ── STT: stopListening ───────────────────────────────────────────────────
  const stopListening = useCallback(() => {
    wsRef.current?.close();        wsRef.current = null;
    processorRef.current?.disconnect(); processorRef.current = null;
    audioCtxRef.current?.close();  audioCtxRef.current = null;
    streamRef.current?.getTracks().forEach(t => t.stop()); streamRef.current = null;
    setOrbState("idle");
    setInterim("");
  }, []);

  // ── TTS: stopSpeaking ────────────────────────────────────────────────────
  const stopSpeaking = useCallback(() => {
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current = null;
    }
    setOrbState("idle");
  }, []);

  // ── TTS: speak ───────────────────────────────────────────────────────────
  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setOrbState("speaking");
    try {
      const res = await api.mockInterview.tts(text);
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioElRef.current = audio;
      await new Promise<void>(resolve => {
        audio.onended = () => { URL.revokeObjectURL(url); resolve(); };
        audio.onerror = () => { URL.revokeObjectURL(url); resolve(); };
        audio.play().catch(() => resolve());
      });
    } catch { /* TTS failure non-fatal — question shown on screen */ }
    finally {
      setOrbState("idle");
      audioElRef.current = null;
    }
  }, []);

  // ── Forward-declare submitAnswer so we can reference it in startListening ─
  // We wire this up via ref after definition below

  // ── STT: startListening ──────────────────────────────────────────────────
  const startListening = useCallback(async () => {
    if (!dgTokenRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const sr = audioCtx.sampleRate;

      const ws = new WebSocket(
        `wss://api.deepgram.com/v1/listen` +
        `?model=nova-2&encoding=linear16&sample_rate=${sr}` +
        `&interim_results=true&smart_format=true&punctuate=true` +
        `&utterance_end_ms=3000&vad_events=true`,
        ["token", dgTokenRef.current]
      );
      wsRef.current = ws;

      let autoFired = false;
      let silenceStart = 0;

      const tryAutoSubmit = () => {
        if (!autoFired && transcriptRef.current.trim() && !isProcessRef.current) {
          autoFired = true;
          handleSubmitRef.current?.();
        }
      };

      ws.onopen = () => setOrbState("listening");
      ws.onmessage = (ev) => {
        const data = JSON.parse(ev.data);
        if (data.type === "Results") {
          const alt = data.channel?.alternatives?.[0];
          if (alt?.transcript) {
            if (data.is_final) {
              transcriptRef.current += (transcriptRef.current ? " " : "") + alt.transcript;
              setTranscript(transcriptRef.current);
              setInterim("");
            } else {
              setInterim(alt.transcript);
            }
          }
        }
        if (data.type === "UtteranceEnd") tryAutoSubmit();
      };
      ws.onerror = () => {};
      ws.onclose = () => { if (orbState === "listening") setOrbState("idle"); };

      const source    = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        const int16 = new Int16Array(input.length);
        let sum = 0;
        for (let i = 0; i < input.length; i++) {
          int16[i] = Math.max(-32768, Math.min(32767, input[i] * 32768));
          sum += input[i] * input[i];
        }
        if (ws.readyState === WebSocket.OPEN) ws.send(int16.buffer);

        if (!autoFired && transcriptRef.current.trim()) {
          const rms = Math.sqrt(sum / input.length);
          if (rms < 0.008) {
            if (silenceStart === 0) silenceStart = Date.now();
            else if (Date.now() - silenceStart >= 3000) tryAutoSubmit();
          } else {
            silenceStart = 0;
          }
        }
      };

      source.connect(processor);
      processor.connect(audioCtx.destination);
    } catch {
      toast({ title: "Microphone access required", variant: "destructive" });
    }
  }, []);

  // ── submitAnswer ─────────────────────────────────────────────────────────
  const submitAnswer = useCallback(async () => {
    stopListening();
    const answer = transcriptRef.current.trim();
    if (!answer || isProcessRef.current) return;

    isProcessRef.current = true;
    setOrbState("processing");
    setInterim("");
    transcriptRef.current = "";
    setTranscript("");
    addToHistory("user", answer);

    const userMsg: ChatMsg = { role: "user", content: answer };
    const newMsgs = [...messages, userMsg];

    try {
      const resp = await api.mockInterview.chat({
        role: selectedRole,
        candidate_info: candidateInfo,
        messages: newMsgs,
      });

      const asstMsg: ChatMsg = { role: "assistant", content: JSON.stringify(resp) };
      const finalMsgs = [...newMsgs, asstMsg];
      setMessages(finalMsgs);
      if (resp.evaluation) setCurrentEval(resp.evaluation);

      if (resp.is_final) {
        await endCallWithMessages(finalMsgs);
      } else {
        setQNum(n => n + 1);
        setCurrentQ(resp.question);
        addToHistory("ai", resp.question);
        isProcessRef.current = false;
        const toSpeak = [resp.evaluation, resp.question].filter(Boolean).join(". ");
        await speak(toSpeak);
        if (micActiveRef.current) await startListening();
      }
    } catch {
      toast({ title: "Connection error — retrying...", variant: "destructive" });
      isProcessRef.current = false;
      setOrbState("idle");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, selectedRole, candidateInfo, addToHistory, speak, startListening, stopListening]);

  // ── endCallWithMessages ──────────────────────────────────────────────────
  const endCallWithMessages = useCallback(async (msgs: ChatMsg[]) => {
    if (timerRef.current) clearInterval(timerRef.current);
    stopListening();
    stopSpeaking();
    isProcessRef.current = true;
    setPhase("analyzing");

    try {
      const res = await api.mockInterview.analyze({
        role: selectedRole,
        candidate_info: candidateInfo,
        messages: msgs,
      }) as ReportData;
      setReport(res);
      setPhase("report");
    } catch {
      toast({ title: "Report generation failed", variant: "destructive" });
      setPhase("interview");
      isProcessRef.current = false;
    }
  }, [selectedRole, candidateInfo, stopListening, stopSpeaking]);

  const endCall = useCallback(() => {
    endCallWithMessages(messages);
  }, [endCallWithMessages, messages]);

  // ── Keep submit/endCall refs fresh ───────────────────────────────────────
  useEffect(() => { handleSubmitRef.current = submitAnswer; }, [submitAnswer]);
  useEffect(() => { endCallRef.current = endCall; }, [endCall]);

  // ── startInterview ───────────────────────────────────────────────────────
  const startInterview = useCallback(async (answers: string[]) => {
    const info = (PREREQS[selectedRole] || [])
      .map((q, i) => `${q}\n→ ${answers[i] || "N/A"}`)
      .join("\n\n");
    setCandidateInfo(info);

    // Fetch Deepgram token
    try {
      const t = await api.mockInterview.getDeepgramToken();
      dgTokenRef.current = t.token;
    } catch {
      toast({ title: "Could not connect to speech service", variant: "destructive" });
      return;
    }

    const firstQ = `Tell me about yourself — walk me through your background, any projects you have worked on, and what draws you to ${selectedRole}.`;
    const triggerMsg: ChatMsg = { role: "user",      content: "Start the interview." };
    const asstMsg: ChatMsg    = { role: "assistant", content: JSON.stringify({ evaluation: "", question: firstQ, is_final: false, final_report: null }) };

    setMessages([triggerMsg, asstMsg]);
    setCurrentQ(firstQ);
    setQNum(1);
    addToHistory("ai", firstQ);
    setPhase("interview");

    await speak(firstQ);
    if (micActiveRef.current) await startListening();
  }, [selectedRole, addToHistory, speak, startListening]);

  // ── Reset ────────────────────────────────────────────────────────────────
  const resetAll = () => {
    stopListening(); stopSpeaking();
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("setup"); setSelectedRole(""); setPrereqAnswers(["", "", ""]);
    setPrereqStep(0); setCandidateInfo(""); setMessages([]); setCurrentQ("");
    setCurrentEval(""); setQNum(0); setOrbState("idle"); setTranscript("");
    setInterim(""); setReport(null); setHistory([]);
    transcriptRef.current = ""; isProcessRef.current = false;
    // Refresh credits
    api.mockInterview.getCredits().then(r => setCredits(r.credits)).catch(() => {});
  };

  // ── PDF print ────────────────────────────────────────────────────────────
  const printReport = () => window.print();

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════

  if (creditsLoading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
        <div style={{ ...MONO, fontSize: 13, color: "#6B7280", letterSpacing: "0.1em" }}>LOADING...</div>
      </div>
    );
  }

  if (creditsError) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", gap: 16 }}>
        <AlertTriangle size={32} color="#D97706" />
        <div style={{ ...MONO, fontSize: 13, fontWeight: 700, color: B }}>COULD NOT LOAD CREDITS</div>
        <div style={{ ...MONO, fontSize: 11, color: "#6B7280", textAlign: "center", maxWidth: 320, lineHeight: 1.6 }}>
          Make sure you are logged in as a student and the server is reachable.
        </div>
        <button
          onClick={() => {
            setCreditsLoading(true);
            setCreditsError(false);
            api.mockInterview.getCredits()
              .then(r => { setCredits(r.credits); setCreditsError(false); })
              .catch(() => setCreditsError(true))
              .finally(() => setCreditsLoading(false));
          }}
          style={{ ...MONO, padding: "10px 24px", backgroundColor: B, color: Y, border: `2px solid ${B}`, fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", cursor: "pointer" }}
        >
          RETRY
        </button>
      </div>
    );
  }

  // ── SETUP ────────────────────────────────────────────────────────────────
  if (phase === "setup") {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 0 48px" }}>
        {/* Credit badge */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <div style={{ ...BEBAS, fontSize: 36, color: B, lineHeight: 1 }}>MOCK INTERVIEW</div>
            <div style={{ ...MONO, fontSize: 11, color: "#6B7280", letterSpacing: "0.12em", marginTop: 4 }}>
              AI-POWERED · VOICE INTERVIEW · PERSONALISED FEEDBACK
            </div>
          </div>
          <div style={{
            backgroundColor: credits === 0 ? "#FEF2F2" : "#F0FDF4",
            border: `2px solid ${credits === 0 ? "#DC2626" : "#16A34A"}`,
            padding: "8px 16px", textAlign: "center",
          }}>
            <div style={{ ...MONO, fontSize: 20, fontWeight: 800, color: credits === 0 ? "#DC2626" : "#16A34A" }}>
              {credits}/{5}
            </div>
            <div style={{ ...MONO, fontSize: 9, letterSpacing: "0.1em", color: credits === 0 ? "#DC2626" : "#16A34A" }}>
              CREDITS LEFT
            </div>
          </div>
        </div>

        {credits === 0 && (
          <div style={{ backgroundColor: "#FEF2F2", border: "2px solid #DC2626", padding: "16px 20px", marginBottom: 24, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <AlertTriangle size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ ...MONO, fontSize: 12, fontWeight: 700, color: "#DC2626", letterSpacing: "0.08em" }}>NO CREDITS REMAINING</div>
              <div style={{ ...MONO, fontSize: 11, color: "#6B7280", marginTop: 4, lineHeight: 1.6 }}>
                You've used all 5 mock interview credits. Contact your mentor to unlock more.
              </div>
            </div>
          </div>
        )}

        <div style={{ ...MONO, fontSize: 11, color: "#6B7280", letterSpacing: "0.12em", marginBottom: 12 }}>
          SELECT ROLE TO INTERVIEW FOR
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
          {ROLES.map(role => (
            <button key={role}
              onClick={() => setSelectedRole(role)}
              disabled={credits === 0}
              style={{
                padding: "18px 20px", textAlign: "left",
                backgroundColor: selectedRole === role ? B : W,
                color: selectedRole === role ? Y : B,
                border: `2px solid ${selectedRole === role ? B : "#E5E5E5"}`,
                boxShadow: selectedRole === role ? `4px 4px 0 ${Y}` : "none",
                cursor: credits === 0 ? "not-allowed" : "pointer",
                transition: "all 0.15s", opacity: credits === 0 ? 0.5 : 1,
                ...MONO,
              }}
              onMouseEnter={e => { if (credits !== 0 && selectedRole !== role) { (e.currentTarget as HTMLButtonElement).style.borderColor = B; (e.currentTarget as HTMLButtonElement).style.boxShadow = `3px 3px 0 ${B}`; } }}
              onMouseLeave={e => { if (selectedRole !== role) { (e.currentTarget as HTMLButtonElement).style.borderColor = "#E5E5E5"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; } }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em" }}>{role.toUpperCase()}</div>
            </button>
          ))}
        </div>

        <div style={{ backgroundColor: `${B}06`, border: `2px solid ${B}12`, padding: "16px 20px", marginBottom: 28 }}>
          <div style={{ ...MONO, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B, marginBottom: 10 }}>HOW IT WORKS</div>
          {[
            "1 credit is used each time you start and close an interview",
            "AI asks 8 questions personalised to your background",
            "10-minute interview with real-time voice transcription",
            "Detailed score + feedback report at the end",
          ].map((item, i) => (
            <div key={i} style={{ ...MONO, fontSize: 11, color: "#6B7280", marginBottom: 6, display: "flex", gap: 8 }}>
              <span style={{ color: Y, fontSize: 8, marginTop: 3 }}>▶</span>{item}
            </div>
          ))}
        </div>

        <button
          onClick={async () => {
            if (!selectedRole) { toast({ title: "Select a role first", variant: "destructive" }); return; }
            try {
              const r = await api.mockInterview.consumeCredit();
              setCredits(r.credits);
              setPhase("prereqs");
            } catch (err: unknown) {
              toast({ title: (err as Error).message || "No credits remaining", variant: "destructive" });
            }
          }}
          disabled={!selectedRole || credits === 0}
          style={{
            width: "100%", padding: "16px 0",
            backgroundColor: !selectedRole || credits === 0 ? "#E5E5E5" : B,
            color: !selectedRole || credits === 0 ? "#9CA3AF" : Y,
            border: `2px solid ${!selectedRole || credits === 0 ? "#E5E5E5" : B}`,
            boxShadow: !selectedRole || credits === 0 ? "none" : `4px 4px 0 ${Y}`,
            cursor: !selectedRole || credits === 0 ? "not-allowed" : "pointer",
            ...MONO, fontSize: 13, fontWeight: 800, letterSpacing: "0.12em", transition: "all 0.15s",
          }}
        >
          BEGIN PRE-SCREENING →
        </button>
        <div style={{ ...MONO, fontSize: 10, color: "#9CA3AF", marginTop: 10, textAlign: "center" }}>
          1 credit will be consumed when you proceed
        </div>
      </div>
    );
  }

  // ── PREREQS ──────────────────────────────────────────────────────────────
  if (phase === "prereqs") {
    const questions = PREREQS[selectedRole] || [];
    const progress  = ((prereqStep) / questions.length) * 100;
    return (
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 0 48px" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ ...MONO, fontSize: 10, color: "#6B7280", letterSpacing: "0.12em", marginBottom: 6 }}>
            PRE-SCREENING — {selectedRole.toUpperCase()}
          </div>
          <div style={{ height: 4, backgroundColor: "#E5E5E5", borderRadius: 2 }}>
            <div style={{ height: "100%", backgroundColor: Y, width: `${progress}%`, transition: "width 0.4s ease", borderRadius: 2, border: `1px solid ${B}` }} />
          </div>
          <div style={{ ...MONO, fontSize: 10, color: "#9CA3AF", marginTop: 6, textAlign: "right" }}>
            {prereqStep + 1} / {questions.length}
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ ...BEBAS, fontSize: 28, color: B, lineHeight: 1.1, marginBottom: 20 }}>
            {questions[prereqStep]}
          </div>
          <textarea
            autoFocus
            value={prereqAnswers[prereqStep]}
            onChange={e => setPrereqAnswers(a => { const n = [...a]; n[prereqStep] = e.target.value; return n; })}
            placeholder="Type your answer here..."
            rows={4}
            style={{
              width: "100%", padding: "14px 16px",
              border: `2px solid ${B}`, backgroundColor: W,
              ...MONO, fontSize: 13, color: B, outline: "none",
              resize: "vertical", boxSizing: "border-box", lineHeight: 1.6,
            }}
            onKeyDown={e => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                if (prereqStep < questions.length - 1) { setPrereqStep(s => s + 1); }
                else { startInterview(prereqAnswers); }
              }
            }}
          />
          <div style={{ ...MONO, fontSize: 10, color: "#9CA3AF", marginTop: 6 }}>Ctrl+Enter to continue</div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {prereqStep > 0 && (
            <button onClick={() => setPrereqStep(s => s - 1)}
              style={{ padding: "12px 24px", border: `2px solid ${B}`, backgroundColor: W, ...MONO, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer" }}>
              ← BACK
            </button>
          )}
          <button
            onClick={() => {
              if (prereqStep < questions.length - 1) setPrereqStep(s => s + 1);
              else startInterview(prereqAnswers);
            }}
            style={{
              flex: 1, padding: "14px 0",
              backgroundColor: B, color: Y, border: `2px solid ${B}`,
              boxShadow: `4px 4px 0 ${Y}`,
              ...MONO, fontSize: 13, fontWeight: 800, letterSpacing: "0.12em", cursor: "pointer",
            }}
          >
            {prereqStep < questions.length - 1 ? "NEXT →" : "START INTERVIEW →"}
          </button>
        </div>
      </div>
    );
  }

  // ── INTERVIEW ────────────────────────────────────────────────────────────
  if (phase === "interview") {
    const mm  = String(Math.floor(timeLeft / 60)).padStart(2, "0");
    const ss  = String(timeLeft % 60).padStart(2, "0");
    const urgentTimer = timeLeft < 60;
    const warnTimer   = timeLeft < 120;

    return (
      <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 24, position: "relative" }}>
        {/* Print CSS for report */}
        <style>{`
          @media print { body > *:not(#mock-report){ display:none!important } #mock-report{ display:block!important; position:static!important; width:100%!important } .no-print{ display:none!important } }
        `}</style>

        {/* LEFT — main interview panel */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Top bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ backgroundColor: B, color: Y, padding: "4px 12px", ...MONO, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em" }}>
                {selectedRole.toUpperCase()}
              </div>
              <div style={{ ...MONO, fontSize: 11, color: "#6B7280" }}>Q{qNum} / 9</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Timer */}
              <div style={{
                backgroundColor: urgentTimer ? "#FEF2F2" : warnTimer ? "#FFFBEB" : "#F5F3FF",
                border: `2px solid ${urgentTimer ? "#DC2626" : warnTimer ? "#D97706" : "#7C3AED"}`,
                padding: "6px 14px", display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ fontSize: 12 }}>⏱</span>
                <span style={{
                  ...MONO, fontSize: 14, fontWeight: 800,
                  color: urgentTimer ? "#DC2626" : warnTimer ? "#D97706" : "#7C3AED",
                  animation: urgentTimer ? "orbPop 1s ease-in-out infinite" : undefined,
                }}>{mm}:{ss}</span>
              </div>
              {/* Transcript toggle */}
              <button onClick={() => setShowTranscript(s => !s)}
                style={{ ...MONO, fontSize: 11, fontWeight: 700, padding: "6px 14px", border: `2px solid ${B}`, backgroundColor: showTranscript ? B : W, color: showTranscript ? Y : B, cursor: "pointer", letterSpacing: "0.08em" }}>
                TRANSCRIPT
              </button>
            </div>
          </div>

          {/* Orb */}
          <div style={{ marginBottom: 20 }}>
            <AIOrb state={orbState} />
          </div>

          {/* Orb state label */}
          <div style={{ ...MONO, fontSize: 11, color: "#9CA3AF", textAlign: "center", letterSpacing: "0.12em", marginBottom: 20, height: 16 }}>
            {orbState === "speaking"   ? "AI IS SPEAKING..." :
             orbState === "listening"  ? "LISTENING — SPEAK NOW" :
             orbState === "processing" ? "PROCESSING..." : "READY"}
          </div>

          {/* Current question */}
          <div style={{ backgroundColor: `${B}06`, border: `2px solid ${B}15`, padding: "16px 20px", marginBottom: 16 }}>
            <div style={{ ...MONO, fontSize: 10, color: "#9CA3AF", letterSpacing: "0.12em", marginBottom: 6 }}>CURRENT QUESTION</div>
            <div style={{ ...MONO, fontSize: 13, color: B, lineHeight: 1.7 }}>{currentQ || "Loading..."}</div>
          </div>

          {/* AI Evaluation banner */}
          {currentEval && (
            <div style={{ backgroundColor: "#FFFBEB", border: "2px solid #D97706", padding: "12px 16px", marginBottom: 16 }}>
              <div style={{ ...MONO, fontSize: 10, color: "#D97706", letterSpacing: "0.1em", marginBottom: 4 }}>AI FEEDBACK</div>
              <div style={{ ...MONO, fontSize: 12, color: B, lineHeight: 1.6 }}>{currentEval}</div>
            </div>
          )}

          {/* Live transcript */}
          {orbState === "listening" && (
            <div style={{ backgroundColor: W, border: `2px solid #4F46E5`, padding: "12px 16px", marginBottom: 16 }}>
              <div style={{ ...MONO, fontSize: 10, color: "#4F46E5", letterSpacing: "0.1em", marginBottom: 4 }}>LIVE TRANSCRIPT</div>
              <div style={{ ...MONO, fontSize: 13, color: B, lineHeight: 1.6 }}>
                {transcript}
                {interim && <span style={{ color: "#9CA3AF", fontStyle: "italic" }}> {interim}</span>}
              </div>
            </div>
          )}

          {/* Controls */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {/* Mic toggle */}
            <button
              onClick={async () => {
                const next = !micActive;
                setMicActive(next);
                micActiveRef.current = next;
                if (!next) {
                  stopListening();
                } else if (orbState !== "processing" && orbState !== "speaking") {
                  transcriptRef.current = "";
                  setTranscript("");
                  await startListening();
                }
              }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 20px", border: `2px solid ${B}`,
                backgroundColor: micActive ? W : "#FEF2F2",
                color: micActive ? B : "#DC2626",
                ...MONO, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {micActive ? <Mic size={16} /> : <MicOff size={16} />}
              {micActive ? "MIC ON" : "MIC OFF"}
            </button>

            {/* Manual submit */}
            <button
              onClick={submitAnswer}
              disabled={orbState === "processing" || orbState === "speaking"}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 20px", border: `2px solid ${B}`,
                backgroundColor: W, color: B,
                ...MONO, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
                cursor: orbState === "processing" || orbState === "speaking" ? "not-allowed" : "pointer",
                opacity: orbState === "processing" || orbState === "speaking" ? 0.5 : 1,
              }}
            >
              <ChevronRight size={16} /> SUBMIT ANSWER
            </button>

            {/* End call */}
            <button
              onClick={endCall}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "12px 20px", border: "2px solid #DC2626",
                backgroundColor: "#FEF2F2", color: "#DC2626",
                ...MONO, fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
                cursor: "pointer", marginLeft: "auto",
              }}
            >
              <PhoneOff size={16} /> END CALL
            </button>
          </div>
        </div>

        {/* RIGHT — transcript sidebar */}
        {showTranscript && (
          <div style={{
            width: 300, flexShrink: 0,
            border: `2px solid ${B}`, backgroundColor: W,
            display: "flex", flexDirection: "column", maxHeight: 600,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: `2px solid ${B}18` }}>
              <div style={{ ...MONO, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>CONVERSATION</div>
              <button onClick={() => setShowTranscript(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={14} color="#6B7280" />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
              {history.map((msg, i) => (
                <div key={i} style={{ display: "flex", flexDirection: msg.role === "ai" ? "row" : "row-reverse", gap: 8 }}>
                  <div style={{
                    maxWidth: "85%", padding: "8px 12px",
                    backgroundColor: msg.role === "ai" ? `${B}08` : B,
                    color: msg.role === "ai" ? B : W,
                    border: `1px solid ${msg.role === "ai" ? `${B}18` : B}`,
                    ...MONO, fontSize: 11, lineHeight: 1.6,
                  }}>{msg.text}</div>
                </div>
              ))}
              {interim && orbState === "listening" && (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ ...MONO, fontSize: 11, color: "#9CA3AF", fontStyle: "italic", padding: "4px 8px", border: "1px dashed #9CA3AF" }}>{interim}</div>
                </div>
              )}
              <div ref={txEndRef} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── ANALYZING ────────────────────────────────────────────────────────────
  if (phase === "analyzing") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 24 }}>
        <AIOrb state="processing" />
        <div style={{ ...BEBAS, fontSize: 36, color: B, letterSpacing: "0.05em" }}>ANALYSING INTERVIEW</div>
        <div style={{ ...MONO, fontSize: 12, color: "#6B7280", letterSpacing: "0.12em" }}>
          GENERATING YOUR PERSONALISED REPORT...
        </div>
      </div>
    );
  }

  // ── REPORT ───────────────────────────────────────────────────────────────
  if (phase === "report" && report) {
    const vc = verdictColor(report.verdict);
    return (
      <>
        <style>{`@media print{body>*:not(#mock-report){display:none!important}#mock-report{display:block!important;position:static!important;width:100%!important}.no-print{display:none!important}}`}</style>

        <div id="mock-report" style={{ maxWidth: 800, margin: "0 auto", paddingBottom: 48 }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ ...MONO, fontSize: 10, color: "#6B7280", letterSpacing: "0.12em", marginBottom: 4 }}>
                {selectedRole.toUpperCase()} · INTERVIEW COMPLETE
              </div>
              <div style={{ ...BEBAS, fontSize: 40, color: B, lineHeight: 0.95 }}>YOUR RESULTS</div>
            </div>
            <div style={{ display: "flex", gap: 10 }} className="no-print">
              <button onClick={printReport}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", border: `2px solid ${B}`, backgroundColor: W, ...MONO, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer" }}>
                <Download size={14} /> SAVE PDF
              </button>
              <button onClick={resetAll}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", border: `2px solid ${B}`, backgroundColor: B, color: Y, ...MONO, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer" }}>
                <RotateCcw size={14} /> NEW INTERVIEW
              </button>
              <button onClick={onExit}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", border: `2px solid #E5E5E5`, backgroundColor: W, ...MONO, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer" }}>
                <X size={14} /> EXIT
              </button>
            </div>
          </div>

          {/* Score hero */}
          <div style={{ display: "flex", gap: 20, marginBottom: 28, flexWrap: "wrap" }}>
            <div style={{ flex: "0 0 auto", backgroundColor: W, border: `3px solid ${B}`, boxShadow: `5px 5px 0 ${B}`, padding: "28px 40px", textAlign: "center" }}>
              <div style={{ ...BEBAS, fontSize: 72, color: vc, lineHeight: 1 }}>{report.score}</div>
              <div style={{ ...MONO, fontSize: 10, color: "#6B7280", letterSpacing: "0.1em" }}>OUT OF 10</div>
              <div style={{ marginTop: 10, backgroundColor: vc, color: W, padding: "4px 16px", ...MONO, fontSize: 11, fontWeight: 800, letterSpacing: "0.15em" }}>
                {report.verdict}
              </div>
            </div>
            <div style={{ flex: 1, backgroundColor: `${B}06`, border: `2px solid ${B}15`, padding: "20px 24px", display: "flex", alignItems: "center", minWidth: 200 }}>
              <p style={{ ...MONO, fontSize: 12, color: B, lineHeight: 1.8, margin: 0 }}>{report.summary}</p>
            </div>
          </div>

          {/* Three columns */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
            {[
              { title: "✓ STRENGTHS",        items: report.strengths,       bg: "#F0FDF4", border: "#16A34A", tc: "#16A34A" },
              { title: "✗ WEAKNESSES",       items: report.weaknesses,      bg: "#FEF2F2", border: "#DC2626", tc: "#DC2626" },
              { title: "→ RECOMMENDATIONS",  items: report.recommendations, bg: "#EFF6FF", border: "#0284C7", tc: "#0284C7" },
            ].map(({ title, items, bg, border, tc }) => (
              <div key={title} style={{ backgroundColor: bg, border: `2px solid ${border}`, padding: "16px 18px" }}>
                <div style={{ ...MONO, fontSize: 10, fontWeight: 700, color: tc, letterSpacing: "0.12em", marginBottom: 12 }}>{title}</div>
                {items.map((item, i) => (
                  <div key={i} style={{ ...MONO, fontSize: 11, color: B, marginBottom: 7, lineHeight: 1.5 }}>— {item}</div>
                ))}
              </div>
            ))}
          </div>

          {/* Question breakdown */}
          <div style={{ ...MONO, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: B, marginBottom: 16 }}>
            QUESTION BREAKDOWN
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {report.question_breakdown.map((qb, i) => {
              const rc = qb.rating === "Excellent" ? "#059669" : qb.rating === "Good" ? "#0284C7" : qb.rating === "Average" ? "#D97706" : "#DC2626";
              return (
                <div key={i} style={{ border: `2px solid ${B}15`, backgroundColor: W, padding: "16px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
                    <div style={{ ...MONO, fontSize: 12, fontWeight: 700, color: B, flex: 1 }}>Q{i + 1}: {qb.question}</div>
                    <div style={{ backgroundColor: rc, color: W, padding: "2px 10px", ...MONO, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", flexShrink: 0 }}>
                      {qb.rating.toUpperCase()}
                    </div>
                  </div>
                  <div style={{ ...MONO, fontSize: 11, color: "#6B7280", marginBottom: 6, lineHeight: 1.6 }}>
                    <span style={{ fontWeight: 700, color: B }}>Answer: </span>{qb.answer_summary}
                  </div>
                  <div style={{ ...MONO, fontSize: 11, color: "#6B7280", lineHeight: 1.6 }}>
                    <span style={{ fontWeight: 700, color: B }}>Feedback: </span>{qb.feedback}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Credits remaining */}
          <div style={{ marginTop: 28, padding: "14px 20px", backgroundColor: `${B}06`, border: `2px solid ${B}12`, display: "flex", justifyContent: "space-between", alignItems: "center" }} className="no-print">
            <div style={{ ...MONO, fontSize: 11, color: "#6B7280" }}>Credits remaining after this interview</div>
            <div style={{ ...MONO, fontSize: 16, fontWeight: 800, color: credits === 0 ? "#DC2626" : B }}>{credits} / 5</div>
          </div>
        </div>
      </>
    );
  }

  return null;
};

export default MockInterview;
