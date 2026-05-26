import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Compass as CompassIcon, ArrowLeft, X, Sparkles, RotateCw, ChevronDown, ChevronUp,
  TrendingUp, BookOpen, Loader2, MapPin, Target, Lightbulb, Layers, Flag, Clock, GitBranch,
  ExternalLink, Briefcase, Building2, Wrench, Trophy,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  api,
  type CompassMapResponse,
  type CompassRole,
  type CompassRecommendedLink,
  type CompassPhase,
  type CompassLinkType,
} from "@/services/api";

const Y = "#FFE500"; const B = "#0A0A0A"; const W = "#FFFFFF"; const BG = "#FAFAFA";
const BORD = "#E5E5E5"; const MUTE = "#6B7280";

// Use Sora as the primary readable font, monospace only for chrome / labels
const SANS: React.CSSProperties = { fontFamily: "'Sora', system-ui, -apple-system, sans-serif" };
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

const POPULAR_SKILLS = [
  "HTML", "CSS", "JavaScript", "React", "Node.js", "Python", "Java", "C", "C++",
  "SQL", "MongoDB", "Git", "Linux", "Docker", "AWS", "TypeScript", "Spring Boot",
  "Django", "Flask", "Tailwind", "Figma", "Excel", "Power BI", "Tableau",
];

const Compass = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "Student";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CompassMapResponse | null>(null);

  // Onboarding form
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [interests, setInterests] = useState("");
  const [generating, setGenerating] = useState(false);

  // Graph state
  const [expandedClusters, setExpandedClusters] = useState<Set<string>>(new Set());
  const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null);
  const [showRegenerate, setShowRegenerate] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.student.getCompass();
        setData(res);
        if (res?.map?.clusters?.length) setExpandedClusters(new Set([res.map.clusters[0].id]));
      } catch {
        setData({ skills_input: [], map: null });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addSkill = (raw: string) => {
    const v = raw.trim();
    if (!v) return;
    if (skills.some(s => s.toLowerCase() === v.toLowerCase())) return;
    if (skills.length >= 20) {
      toast({ title: "20 skills max", variant: "destructive" });
      return;
    }
    setSkills(s => [...s, v]);
    setSkillInput("");
  };
  const removeSkill = (s: string) => setSkills(arr => arr.filter(x => x !== s));
  const onSkillKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(skillInput); }
    else if (e.key === "Backspace" && !skillInput && skills.length > 0) setSkills(s => s.slice(0, -1));
  };

  const handleGenerate = async () => {
    if (skills.length === 0) { toast({ title: "Add some skills first", variant: "destructive" }); return; }
    setGenerating(true);
    try {
      const res = await api.student.generateCompass(skills, interests || undefined);
      setData(res);
      if (res?.map?.clusters?.length) setExpandedClusters(new Set([res.map.clusters[0].id]));
      setExpandedRoleId(null);
      setShowRegenerate(false);
      toast({ title: "Your Compass is ready" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to generate map";
      toast({ title: "Generation failed", description: msg, variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const handleStartOver = async () => {
    try { await api.student.deleteCompass(); } catch { /* ignore */ }
    setData({ skills_input: [], map: null });
    setSkills([]); setInterests(""); setExpandedClusters(new Set()); setExpandedRoleId(null);
    setShowRegenerate(false);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: BG, display: "flex", alignItems: "center", justifyContent: "center", ...SANS }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", color: MUTE, fontSize: "14px" }}>
          <Loader2 size={18} className="animate-spin" /> Loading your Compass…
        </div>
      </div>
    );
  }

  const hasMap = !!data?.map && data.map.clusters.length > 0;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, ...SANS }}>
      <style>{`
        @keyframes compass-fade-up { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }
        @keyframes compass-rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes compass-shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
        .compass-fade { animation: compass-fade-up 0.45s cubic-bezier(.22,1,.36,1) both; }
        .compass-shimmer { background: linear-gradient(90deg, rgba(255,229,0,0) 0%, rgba(255,229,0,0.18) 50%, rgba(255,229,0,0) 100%); background-size: 800px 100%; animation: compass-shimmer 2.4s linear infinite; }
        .spin-slow { animation: compass-rotate 60s linear infinite; }
      `}</style>

      {/* Top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: W, borderBottom: `1px solid ${BORD}`, padding: "12px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
        <button onClick={() => navigate("/portal")} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", cursor: "pointer", color: MUTE, fontSize: "13px", fontWeight: 600, padding: 0, ...SANS }}
          onMouseEnter={e => (e.currentTarget.style.color = B)} onMouseLeave={e => (e.currentTarget.style.color = MUTE)}>
          <ArrowLeft size={14} /> Back
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "4px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: B, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CompassIcon size={16} color={Y} />
          </div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: B, letterSpacing: "-0.01em", lineHeight: 1.1 }}>Compass</div>
            <div style={{ fontSize: "10px", color: MUTE, letterSpacing: "0.08em", ...MONO }}>YOUR CAREER GRAPH · 2026</div>
          </div>
        </div>
        <div style={{ flex: 1 }} />
        {hasMap && (
          <button onClick={() => setShowRegenerate(true)}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 14px", background: W, border: `1.5px solid ${BORD}`, borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: 600, color: B, ...SANS }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = B)} onMouseLeave={e => (e.currentTarget.style.borderColor = BORD)}>
            <RotateCw size={13} /> Regenerate
          </button>
        )}
      </div>

      {!hasMap && !showRegenerate && (
        <OnboardingView
          skills={skills} skillInput={skillInput} setSkillInput={setSkillInput} onSkillKey={onSkillKey}
          addSkill={addSkill} removeSkill={removeSkill} interests={interests} setInterests={setInterests}
          generating={generating} onGenerate={handleGenerate} userName={userName}
        />
      )}

      {showRegenerate && (
        <RegenerateView
          existingSkills={data?.skills_input ?? []} existingInterests={data?.interests ?? ""}
          skills={skills} setSkills={setSkills} skillInput={skillInput} setSkillInput={setSkillInput}
          onSkillKey={onSkillKey} addSkill={addSkill} removeSkill={removeSkill}
          interests={interests} setInterests={setInterests}
          generating={generating} onGenerate={handleGenerate} userName={userName}
          onCancel={() => setShowRegenerate(false)} onStartOver={handleStartOver}
        />
      )}

      {hasMap && !showRegenerate && (
        <GraphView
          data={data!}
          expandedClusters={expandedClusters}
          setExpandedClusters={setExpandedClusters}
          expandedRoleId={expandedRoleId}
          setExpandedRoleId={setExpandedRoleId}
          userName={userName}
        />
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  ONBOARDING (kept readable + tight)
// ════════════════════════════════════════════════════════════════════════════

interface OnboardProps {
  skills: string[]; skillInput: string; setSkillInput: (v: string) => void;
  onSkillKey: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  addSkill: (s: string) => void; removeSkill: (s: string) => void;
  interests: string; setInterests: (v: string) => void;
  generating: boolean; onGenerate: () => void; userName: string;
}

const OnboardingView = ({ skills, skillInput, setSkillInput, onSkillKey, addSkill, removeSkill, interests, setInterests, generating, onGenerate, userName }: OnboardProps) => (
  <div style={{ padding: "36px 24px 60px", maxWidth: "860px", margin: "0 auto" }} className="compass-fade">
    <div style={{ textAlign: "center", marginBottom: "32px" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: B, color: Y, padding: "5px 13px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", marginBottom: "16px", ...MONO }}>
        <Sparkles size={11} /> POWERED BY AI · 2026 MARKET
      </div>
      <h1 style={{ fontSize: "clamp(30px, 4.5vw, 48px)", fontWeight: 700, color: B, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "12px", ...SANS }}>
        Hey {userName.split(" ")[0]} — where are<br />you <span style={{ background: Y, padding: "0 8px" }}>headed?</span>
      </h1>
      <p style={{ fontSize: "15px", color: MUTE, maxWidth: "540px", margin: "0 auto", lineHeight: 1.65, ...SANS }}>
        Tell us what you already know. We'll draw your career graph — clusters, roles, combo paths like Full Stack — with exact roadmaps to land each one.
      </p>
    </div>

    <div style={{ background: W, border: `2px solid ${BORD}`, borderRadius: "16px", padding: "24px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
        <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: Y, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Target size={15} color={B} />
        </div>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: B, margin: 0, ...SANS }}>What skills do you know?</h2>
      </div>
      <p style={{ fontSize: "13px", color: MUTE, lineHeight: 1.55, marginBottom: "14px", ...SANS }}>
        Add anything — languages, frameworks, tools. Press <kbd style={{ background: "#F3F4F6", border: `1px solid ${BORD}`, padding: "1px 6px", borderRadius: "4px", fontSize: "11px", ...MONO }}>Enter</kbd> to add.
      </p>

      <div style={{ minHeight: "54px", padding: "8px 10px", border: `1.5px solid ${BORD}`, borderRadius: "10px", display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center", background: BG }}>
        {skills.map(s => (
          <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 10px", background: B, color: Y, borderRadius: "20px", fontSize: "12px", fontWeight: 600, ...SANS }}>
            {s}
            <button onClick={() => removeSkill(s)} style={{ display: "inline-flex", alignItems: "center", background: "transparent", border: "none", cursor: "pointer", color: Y, padding: 0 }}><X size={12} /></button>
          </span>
        ))}
        <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={onSkillKey}
          placeholder={skills.length === 0 ? "html, css, java, c, python…" : "add another…"}
          style={{ flex: 1, minWidth: "160px", border: "none", outline: "none", background: "transparent", padding: "6px 4px", fontSize: "13px", color: B, ...SANS }}
        />
      </div>

      <div style={{ marginTop: "12px" }}>
        <div style={{ fontSize: "10px", fontWeight: 700, color: MUTE, letterSpacing: "0.12em", marginBottom: "8px", ...MONO }}>POPULAR — TAP TO ADD</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {POPULAR_SKILLS.filter(s => !skills.some(x => x.toLowerCase() === s.toLowerCase())).slice(0, 14).map(s => (
            <button key={s} onClick={() => addSkill(s)}
              style={{ padding: "5px 11px", background: W, border: `1.5px solid ${BORD}`, borderRadius: "20px", fontSize: "11px", fontWeight: 600, color: MUTE, cursor: "pointer", ...SANS, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = B; e.currentTarget.style.color = B; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = BORD; e.currentTarget.style.color = MUTE; }}
            >+ {s}</button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <Lightbulb size={13} color={B} />
          <label style={{ fontSize: "12px", fontWeight: 700, color: B, ...SANS }}>What excites you? <span style={{ color: MUTE, fontWeight: 500 }}>(optional)</span></label>
        </div>
        <textarea value={interests} onChange={e => setInterests(e.target.value)}
          placeholder="e.g. I love building apps people use daily / I want to work on AI / I want a high-paying first job…"
          style={{ width: "100%", padding: "11px 14px", border: `1.5px solid ${BORD}`, borderRadius: "10px", background: BG, fontSize: "13px", color: B, resize: "none", height: "62px", outline: "none", boxSizing: "border-box", ...SANS, lineHeight: 1.55 }}
          onFocus={e => (e.target.style.borderColor = B)} onBlur={e => (e.target.style.borderColor = BORD)}
        />
      </div>

      <button onClick={onGenerate} disabled={generating || skills.length === 0}
        style={{ width: "100%", marginTop: "18px", padding: "14px", background: skills.length === 0 || generating ? "#E5E7EB" : B, color: skills.length === 0 || generating ? MUTE : Y, border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: 700, letterSpacing: "0.06em", cursor: skills.length === 0 || generating ? "not-allowed" : "pointer", ...SANS, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
        {generating ? (<><Loader2 size={16} className="animate-spin" /> CRAFTING YOUR GRAPH…</>) : (<><Sparkles size={16} /> GENERATE MY COMPASS →</>)}
      </button>
      {generating && (
        <div style={{ marginTop: "10px", height: "3px", borderRadius: "3px", overflow: "hidden", background: "#F3F4F6", position: "relative" }}>
          <div className="compass-shimmer" style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, transparent, ${Y}, transparent)` }} />
        </div>
      )}
    </div>

    <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" }}>
      {[
        { icon: MapPin, label: "Top-down graph", desc: "See every role unlocked by your skills" },
        { icon: GitBranch, label: "Combo paths", desc: "Frontend + Backend = Full Stack. Visible." },
        { icon: TrendingUp, label: "2026 market demand", desc: "Honest salary ranges + role demand" },
        { icon: BookOpen, label: "Step-by-step roadmaps", desc: "Click any role → 5–8 step plan with milestones" },
      ].map(({ icon: Icon, label, desc }) => (
        <div key={label} style={{ background: W, border: `1.5px solid ${BORD}`, borderRadius: "12px", padding: "14px" }}>
          <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "#FFFBEB", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
            <Icon size={15} color="#D97706" />
          </div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: B, marginBottom: "2px", ...SANS }}>{label}</div>
          <div style={{ fontSize: "12px", color: MUTE, lineHeight: 1.55, ...SANS }}>{desc}</div>
        </div>
      ))}
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════════════
//  REGENERATE
// ════════════════════════════════════════════════════════════════════════════

interface RegenProps extends OnboardProps {
  existingSkills: string[]; existingInterests: string;
  setSkills: (s: string[]) => void; onCancel: () => void; onStartOver: () => void;
}

const RegenerateView = (p: RegenProps) => {
  useEffect(() => {
    if (p.existingSkills.length > 0 && p.skills.length === 0) p.setSkills(p.existingSkills);
    if (p.existingInterests && !p.interests) p.setInterests(p.existingInterests);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div style={{ padding: "32px 24px 60px", maxWidth: "700px", margin: "0 auto" }} className="compass-fade">
      <div style={{ background: W, border: `2px solid ${BORD}`, borderRadius: "16px", padding: "24px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: B, marginBottom: "4px", letterSpacing: "-0.01em", ...SANS }}>Regenerate your Compass</h2>
        <p style={{ fontSize: "13px", color: MUTE, marginBottom: "16px", lineHeight: 1.55, ...SANS }}>Add, remove, or change skills. We'll generate a fresh graph for 2026.</p>
        <div style={{ minHeight: "54px", padding: "8px 10px", border: `1.5px solid ${BORD}`, borderRadius: "10px", display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center", background: BG }}>
          {p.skills.map(s => (
            <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 10px", background: B, color: Y, borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
              {s}<button onClick={() => p.removeSkill(s)} style={{ background: "transparent", border: "none", cursor: "pointer", color: Y, padding: 0, display: "inline-flex" }}><X size={12} /></button>
            </span>
          ))}
          <input value={p.skillInput} onChange={e => p.setSkillInput(e.target.value)} onKeyDown={p.onSkillKey} placeholder="add a skill…"
            style={{ flex: 1, minWidth: "140px", border: "none", outline: "none", background: "transparent", padding: "6px 4px", fontSize: "13px", color: B, ...SANS }}
          />
        </div>
        <textarea value={p.interests} onChange={e => p.setInterests(e.target.value)} placeholder="Optional — what you're aiming for…"
          style={{ width: "100%", marginTop: "14px", padding: "11px 14px", border: `1.5px solid ${BORD}`, borderRadius: "10px", background: BG, fontSize: "13px", color: B, resize: "none", height: "56px", outline: "none", boxSizing: "border-box", ...SANS, lineHeight: 1.55 }}
        />
        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
          <button onClick={p.onCancel} style={{ padding: "11px 16px", background: W, color: B, border: `1.5px solid ${BORD}`, borderRadius: "10px", fontSize: "12px", fontWeight: 600, cursor: "pointer", ...SANS }}>Cancel</button>
          <button onClick={p.onGenerate} disabled={p.generating || p.skills.length === 0}
            style={{ flex: 1, padding: "11px 16px", background: p.skills.length === 0 || p.generating ? "#E5E7EB" : B, color: p.skills.length === 0 || p.generating ? MUTE : Y, border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", cursor: p.skills.length === 0 || p.generating ? "not-allowed" : "pointer", ...SANS, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            {p.generating ? (<><Loader2 size={14} className="animate-spin" /> GENERATING…</>) : (<><Sparkles size={14} /> REGENERATE MAP</>)}
          </button>
        </div>
        <button onClick={p.onStartOver} style={{ width: "100%", marginTop: "10px", padding: "8px", background: "transparent", color: MUTE, border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 600, ...SANS, textDecoration: "underline" }}>
          Wipe and start fresh
        </button>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  GRAPH VIEW — top-down tree with INLINE roadmap expansion
// ════════════════════════════════════════════════════════════════════════════

interface GraphProps {
  data: CompassMapResponse;
  expandedClusters: Set<string>;
  setExpandedClusters: (s: Set<string>) => void;
  expandedRoleId: string | null;
  setExpandedRoleId: (id: string | null) => void;
  userName: string;
}

// ── Layout constants (tightened) ──
const PADDING_X = 32;
const YOU_Y = 40;
const SKILLS_Y = 140;
const CLUSTER_Y = 250;
const ROLES_START_Y = 380;

const SKILL_W = 96;
const CLUSTER_W = 210;
const CLUSTER_H = 124;
const ROLE_W = 268;
const ROLE_H = 86;
const ROLE_GAP = 14;            // gap between consecutive roles
const ROLE_ROW_H = ROLE_H + ROLE_GAP;
const ROADMAP_W = 380;
const ROADMAP_H = 540;          // generous so all step text + tabs are visible
const ROADMAP_GAP = 18;
const COMBO_W = 290;
const COMBO_H = 100;
const COMBO_GAP_TOP = 90;             // base gap when at least one cluster is expanded
const COMBO_GAP_COLLAPSED = 150;      // larger gap when nothing is expanded — visual breathing room

const GraphView = ({ data, expandedClusters, setExpandedClusters, expandedRoleId, setExpandedRoleId, userName }: GraphProps) => {
  const map = data.map!;
  const skills = data.skills_input;

  const toggleCluster = (id: string) => {
    const next = new Set(expandedClusters);
    if (next.has(id)) {
      next.delete(id);
      // also close any expanded role in this cluster
      const cluster = map.clusters.find(c => c.id === id);
      if (cluster?.roles.some(r => r.id === expandedRoleId)) setExpandedRoleId(null);
    } else {
      next.add(id);
    }
    setExpandedClusters(next);
  };

  // ── Drag-and-drop state ──
  type Offset = { dx: number; dy: number };
  const [nodeOffsets, setNodeOffsets] = useState<Record<string, Offset>>({});
  const dragState = useRef<{
    nodeId: string;
    startX: number;
    startY: number;
    startOffset: Offset;
    moved: boolean;
    elem: HTMLElement;
    pointerId: number;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const DRAG_THRESHOLD = 5;

  const ofs = useCallback((id: string): Offset => nodeOffsets[id] ?? { dx: 0, dy: 0 }, [nodeOffsets]);

  const onDragPointerDown = (nodeId: string) => (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return; // ignore inputs / interactive children
    // NOTE: do NOT setPointerCapture here — it would swallow the subsequent click event.
    // Capture is set lazily once we actually exceed DRAG_THRESHOLD.
    dragState.current = {
      nodeId,
      startX: e.clientX,
      startY: e.clientY,
      startOffset: ofs(nodeId),
      moved: false,
      elem: e.currentTarget as HTMLElement,
      pointerId: e.pointerId,
    };
  };

  const onDragPointerMove = (e: React.PointerEvent) => {
    const s = dragState.current;
    if (!s) return;
    const dx = e.clientX - s.startX;
    const dy = e.clientY - s.startY;
    if (!s.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      s.moved = true;
      // Capture only once we know it's a real drag, so clicks aren't intercepted.
      try { s.elem.setPointerCapture(s.pointerId); } catch { /* ignore */ }
    }
    if (s.moved) {
      setNodeOffsets(prev => ({ ...prev, [s.nodeId]: { dx: s.startOffset.dx + dx, dy: s.startOffset.dy + dy } }));
    }
  };

  const onDragPointerUp = () => {
    const s = dragState.current;
    if (s?.moved) {
      suppressClickRef.current = true;
      // Clear after the click event has had its chance to fire (and be suppressed)
      setTimeout(() => { suppressClickRef.current = false; }, 0);
    }
    dragState.current = null;
  };

  const safeClick = (cb: () => void) => () => {
    if (suppressClickRef.current) return;
    cb();
  };

  const resetLayout = () => setNodeOffsets({});

  // Layout: assign x,y to every node and figure out the canvas size
  const layout = useMemo(() => {
    const containerW = Math.max(1080, 270 * map.clusters.length, 100 * Math.max(skills.length, 1));

    const youX = containerW / 2;

    const skillPositions: Record<string, { x: number; y: number }> = {};
    const skillSpacing = containerW / (skills.length + 1);
    skills.forEach((s, i) => { skillPositions[s] = { x: skillSpacing * (i + 1), y: SKILLS_Y }; });

    const clusterPositions: Record<string, { x: number; y: number }> = {};
    const clusterSpacing = containerW / (map.clusters.length + 1);
    map.clusters.forEach((c, i) => { clusterPositions[c.id] = { x: clusterSpacing * (i + 1), y: CLUSTER_Y }; });

    // Roles — for each expanded cluster, stack roles vertically.
    // If a role is currently expanded for roadmap, inject extra vertical space after it.
    type Anchor = { roleId: string; x: number; y: number; sourceId: string; isCombo: boolean };
    const rolePositions: Record<string, { x: number; y: number; clusterId: string }> = {};
    let roleAnchor: Anchor | null = null;
    map.clusters.forEach((c) => {
      if (!expandedClusters.has(c.id)) return;
      const cx = clusterPositions[c.id].x;
      let yCursor = ROLES_START_Y;
      c.roles.forEach((r) => {
        rolePositions[r.id] = { x: cx, y: yCursor, clusterId: c.id };
        if (r.id === expandedRoleId) {
          roleAnchor = { roleId: r.id, x: cx, y: yCursor + ROLE_H / 2 + ROADMAP_GAP + ROADMAP_H / 2, sourceId: c.id, isCombo: false };
          yCursor += ROLE_ROW_H + ROADMAP_H + ROADMAP_GAP;
        } else {
          yCursor += ROLE_ROW_H;
        }
      });
    });

    // maxRoleRowY accounts for both cluster cards (when collapsed) and role rows
    let maxRoleRowY = CLUSTER_Y + CLUSTER_H / 2;
    Object.values(rolePositions).forEach(rp => { if (rp.y + ROLE_H / 2 > maxRoleRowY) maxRoleRowY = rp.y + ROLE_H / 2; });
    if (roleAnchor && (roleAnchor as Anchor).y + ROADMAP_H / 2 > maxRoleRowY) {
      maxRoleRowY = (roleAnchor as Anchor).y + ROADMAP_H / 2;
    }

    // Combo roles — below everything else, centered on contributing clusters.
    // If a combo role is currently expanded, inject vertical space after it.
    const comboPositions: Record<string, { x: number; y: number; contribs: string[]; color: string }> = {};
    const combos = map.combo_roles ?? [];
    const anyClusterExpanded = expandedClusters.size > 0;
    const comboGap = anyClusterExpanded ? COMBO_GAP_TOP : COMBO_GAP_COLLAPSED;
    const comboStartY = maxRoleRowY + comboGap;
    let comboAnchor: Anchor | null = null;
    let comboYCursor = comboStartY;
    combos.forEach((cr) => {
      const contribs = (cr.combination_of ?? []).filter(id => clusterPositions[id]);
      const avgX = contribs.length
        ? contribs.reduce((s, id) => s + clusterPositions[id].x, 0) / contribs.length
        : containerW / 2;
      const firstContrib = contribs[0];
      const cl = firstContrib ? map.clusters.find(c => c.id === firstContrib) : null;
      const color = cl?.color ?? "#A78BFA";
      comboPositions[cr.id] = { x: avgX, y: comboYCursor, contribs, color };
      if (cr.id === expandedRoleId) {
        comboAnchor = { roleId: cr.id, x: avgX, y: comboYCursor + COMBO_H / 2 + ROADMAP_GAP + ROADMAP_H / 2, sourceId: cr.id, isCombo: true };
        comboYCursor += COMBO_H + 18 + ROADMAP_H + ROADMAP_GAP;
      } else {
        comboYCursor += COMBO_H + 18;
      }
    });

    // Final anchor: either a role anchor OR a combo anchor (mutually exclusive — only one expandedRoleId)
    const roadmapAnchor: Anchor | null = roleAnchor ?? comboAnchor;

    let containerH = combos.length > 0 ? comboYCursor + 30 : maxRoleRowY + 30;
    if (roadmapAnchor && (roadmapAnchor as Anchor).y + ROADMAP_H / 2 + 30 > containerH) {
      containerH = (roadmapAnchor as Anchor).y + ROADMAP_H / 2 + 30;
    }

    return { containerW, containerH, youX, skillPositions, clusterPositions, rolePositions, comboPositions, roadmapAnchor };
  }, [map, skills, expandedClusters, expandedRoleId]);

  // SVG connection paths — offsets applied so lines follow dragged boxes
  const paths = useMemo(() => {
    const out: { d: string; stroke: string; dashed?: boolean; opacity?: number }[] = [];
    const off = (id: string) => nodeOffsets[id] ?? { dx: 0, dy: 0 };
    // YOU → every skill (skills not draggable)
    skills.forEach(s => {
      const sp = layout.skillPositions[s];
      if (!sp) return;
      out.push({ d: bezier(layout.youX, YOU_Y + 26, sp.x, sp.y - 16), stroke: Y, opacity: 0.45 });
    });
    // Skill → cluster (cluster end follows its offset)
    map.clusters.forEach(c => {
      const cp = layout.clusterPositions[c.id];
      const cO = off(c.id);
      c.matched_skills.forEach(ms => {
        const sk = skills.find(s => s.toLowerCase() === ms.toLowerCase());
        if (!sk) return;
        const sp = layout.skillPositions[sk];
        if (!sp) return;
        out.push({ d: bezier(sp.x, sp.y + 16, cp.x + cO.dx, cp.y + cO.dy - CLUSTER_H / 2), stroke: c.color, opacity: 0.55 });
      });
    });
    // Cluster → roles (both ends follow respective offsets)
    Object.entries(layout.rolePositions).forEach(([rId, rp]) => {
      const cl = map.clusters.find(c => c.id === rp.clusterId);
      if (!cl) return;
      const cp = layout.clusterPositions[cl.id];
      const cO = off(cl.id);
      const rO = off(rId);
      out.push({ d: bezier(cp.x + cO.dx, cp.y + cO.dy + CLUSTER_H / 2, rp.x + rO.dx, rp.y + rO.dy - ROLE_H / 2), stroke: cl.color, opacity: 0.4 });
    });
    // Role → roadmap (roadmap follows parent role/combo offset)
    if (layout.roadmapAnchor) {
      const anchor = layout.roadmapAnchor;
      const parentO = off(anchor.roleId);
      if (anchor.isCombo) {
        const cp = layout.comboPositions[anchor.sourceId];
        if (cp) {
          out.push({ d: bezier(cp.x + parentO.dx, cp.y + parentO.dy + COMBO_H / 2, anchor.x + parentO.dx, anchor.y + parentO.dy - ROADMAP_H / 2), stroke: cp.color, opacity: 0.75 });
        }
      } else {
        const rp = layout.rolePositions[anchor.roleId];
        const cl = map.clusters.find(c => c.id === anchor.sourceId);
        if (rp && cl) {
          out.push({ d: bezier(rp.x + parentO.dx, rp.y + parentO.dy + ROLE_H / 2, anchor.x + parentO.dx, anchor.y + parentO.dy - ROADMAP_H / 2), stroke: cl.color, opacity: 0.75 });
        }
      }
    }
    // Combo roles ← contributing clusters (dashed; both ends follow offsets)
    Object.entries(layout.comboPositions).forEach(([crId, pos]) => {
      const crO = off(crId);
      pos.contribs.forEach(cid => {
        const cl = map.clusters.find(c => c.id === cid);
        if (!cl) return;
        const cp = layout.clusterPositions[cid];
        const cO = off(cid);
        out.push({ d: bezier(cp.x + cO.dx, cp.y + cO.dy + CLUSTER_H / 2, pos.x + crO.dx, pos.y + crO.dy - COMBO_H / 2), stroke: cl.color, dashed: true, opacity: 0.65 });
      });
    });
    return out;
  }, [layout, map, skills, nodeOffsets]);

  const onRoleClick = (roleId: string) => {
    if (expandedRoleId === roleId) setExpandedRoleId(null);
    else setExpandedRoleId(roleId);
  };

  return (
    <div style={{ padding: "18px 0 50px", overflowX: "auto", overflowY: "visible" }} className="compass-fade">
      {/* Header strip */}
      <div style={{ padding: "0 28px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ display: "inline-block", background: B, color: Y, padding: "3px 11px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", marginBottom: "8px", ...MONO }}>YOUR CAREER GRAPH</div>
          <h1 style={{ fontSize: "clamp(20px, 2.6vw, 26px)", fontWeight: 700, color: B, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: "2px", ...SANS }}>
            {map.clusters.length} cluster{map.clusters.length === 1 ? "" : "s"} · {map.clusters.reduce((s, c) => s + c.roles.length, 0)} roles · {(map.combo_roles ?? []).length} combo paths
          </h1>
          <p style={{ fontSize: "13px", color: MUTE, lineHeight: 1.5, ...SANS }}>
            Tap a cluster to expand its roles. Click any role to see the roadmap below — click again to close. Drag any box to rearrange the graph.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button onClick={() => setExpandedClusters(new Set(map.clusters.map(c => c.id)))}
            style={{ padding: "7px 12px", background: W, border: `1.5px solid ${BORD}`, borderRadius: "8px", cursor: "pointer", fontSize: "11px", fontWeight: 600, color: B, ...SANS }}>
            Expand all
          </button>
          <button onClick={() => { setExpandedClusters(new Set()); setExpandedRoleId(null); }}
            style={{ padding: "7px 12px", background: W, border: `1.5px solid ${BORD}`, borderRadius: "8px", cursor: "pointer", fontSize: "11px", fontWeight: 600, color: B, ...SANS }}>
            Collapse all
          </button>
          {Object.keys(nodeOffsets).length > 0 && (
            <button onClick={resetLayout}
              title="Reset node positions"
              style={{ padding: "7px 12px", background: B, color: Y, border: `1.5px solid ${B}`, borderRadius: "8px", cursor: "pointer", fontSize: "11px", fontWeight: 700, ...SANS, display: "flex", alignItems: "center", gap: "5px" }}>
              <RotateCw size={12} /> Reset layout
            </button>
          )}
        </div>
      </div>

      {/* Graph canvas */}
      <div style={{ position: "relative", margin: "0 auto", width: layout.containerW, minWidth: layout.containerW, height: layout.containerH, paddingLeft: PADDING_X, paddingRight: PADDING_X }}>
        {/* SVG connection layer */}
        <svg width={layout.containerW} height={layout.containerH} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {paths.map((p, i) => (
            <path key={i} d={p.d} fill="none" stroke={p.stroke} strokeOpacity={p.opacity ?? 0.5} strokeWidth={p.dashed ? 1.6 : 1.8}
              strokeDasharray={p.dashed ? "5 5" : "none"} strokeLinecap="round" />
          ))}
        </svg>

        {/* YOU node */}
        <div style={absNode(layout.youX, YOU_Y, 110, 56)} className="compass-fade">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ position: "relative", width: "48px", height: "48px" }}>
              <div className="spin-slow" style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px dashed ${Y}` }} />
              <div style={{ position: "absolute", inset: "4px", borderRadius: "50%", background: B, display: "flex", alignItems: "center", justifyContent: "center", color: Y, fontSize: "13px", fontWeight: 700, boxShadow: `0 4px 16px ${Y}66`, ...SANS }}>
                {userName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
            </div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: B, marginTop: "4px", letterSpacing: "0.12em", ...MONO }}>YOU</div>
          </div>
        </div>

        {/* Skill nodes */}
        {skills.map(s => {
          const pos = layout.skillPositions[s];
          if (!pos) return null;
          return (
            <div key={s} style={absNode(pos.x, pos.y, SKILL_W, 32)} className="compass-fade">
              <div style={{ padding: "5px 11px", background: W, color: B, border: `1.5px solid ${BORD}`, borderRadius: "20px", fontSize: "12px", fontWeight: 600, textTransform: "capitalize", whiteSpace: "nowrap", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", ...SANS }}>
                <span style={{ color: Y, marginRight: "4px" }}>●</span>{s}
              </div>
            </div>
          );
        })}

        {/* Cluster nodes */}
        {map.clusters.map((c, idx) => {
          const pos = layout.clusterPositions[c.id];
          const expanded = expandedClusters.has(c.id);
          const cO = ofs(c.id);
          return (
            <div key={c.id}
              style={{ ...absNode(pos.x + cO.dx, pos.y + cO.dy, CLUSTER_W, CLUSTER_H), animationDelay: `${idx * 50}ms`, touchAction: "none" }}
              className="compass-fade"
              onPointerDown={onDragPointerDown(c.id)}
              onPointerMove={onDragPointerMove}
              onPointerUp={onDragPointerUp}
              onPointerCancel={onDragPointerUp}>
              <button onClick={safeClick(() => toggleCluster(c.id))}
                style={{ width: CLUSTER_W, height: CLUSTER_H, padding: "14px 14px 12px", textAlign: "left", borderRadius: "12px", background: expanded ? B : W, color: expanded ? W : B, border: `2px solid ${expanded ? B : BORD}`, cursor: "grab", transition: "all 0.2s cubic-bezier(.22,1,.36,1)", boxShadow: expanded ? `5px 5px 0 ${c.color}` : "0 3px 12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden", ...SANS }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: c.color }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                    <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: c.color, boxShadow: `0 0 0 4px ${c.color}30` }} />
                    {expanded ? <ChevronUp size={14} color={W} /> : <ChevronDown size={14} color={MUTE} />}
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 700, lineHeight: 1.3, letterSpacing: "-0.01em", marginBottom: "4px", color: expanded ? Y : B, wordBreak: "break-word" }}>{c.label}</div>
                  <div style={{ fontSize: "11.5px", color: expanded ? `${W}99` : MUTE, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", wordBreak: "break-word" }}>{c.tagline}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "10px", fontWeight: 700 }}>
                  <span style={{ color: c.color, ...MONO }}>{c.roles.length} ROLES</span>
                  <span style={{ color: expanded ? `${W}66` : MUTE, ...MONO }}>{c.matched_skills.length} match</span>
                </div>
              </button>
            </div>
          );
        })}

        {/* Role nodes */}
        {map.clusters.map(c => {
          if (!expandedClusters.has(c.id)) return null;
          return c.roles.map((r, idx) => {
            const pos = layout.rolePositions[r.id];
            if (!pos) return null;
            const isExp = expandedRoleId === r.id;
            const rO = ofs(r.id);
            return (
              <div key={r.id}
                style={{ ...absNode(pos.x + rO.dx, pos.y + rO.dy, ROLE_W, ROLE_H), animationDelay: `${idx * 30}ms`, touchAction: "none" }}
                className="compass-fade"
                onPointerDown={onDragPointerDown(r.id)}
                onPointerMove={onDragPointerMove}
                onPointerUp={onDragPointerUp}
                onPointerCancel={onDragPointerUp}>
                <button onClick={safeClick(() => onRoleClick(r.id))}
                  style={{ width: ROLE_W, height: ROLE_H, padding: "10px 14px", textAlign: "left", borderRadius: "10px", background: isExp ? B : W, color: isExp ? W : B, border: `1.5px solid ${isExp ? B : BORD}`, cursor: "grab", transition: "all 0.16s", boxShadow: isExp ? `0 6px 18px ${c.color}55` : "0 2px 8px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between", overflow: "hidden", ...SANS }}
                  onMouseEnter={e => { if (!isExp) { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 5px 14px ${c.color}33`; } }}
                  onMouseLeave={e => { if (!isExp) { e.currentTarget.style.borderColor = BORD; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; } }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", marginBottom: "4px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: c.color, flexShrink: 0, marginTop: "5px" }} />
                      <div style={{ fontSize: "13px", fontWeight: 700, color: isExp ? Y : B, lineHeight: 1.3, letterSpacing: "-0.005em", wordBreak: "break-word" }}>{r.title}</div>
                    </div>
                    <div style={{ fontSize: "11.5px", color: isExp ? `${W}99` : MUTE, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", wordBreak: "break-word" }}>{r.description}</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", fontSize: "10.5px", fontWeight: 700 }}>
                    <span style={{ color: c.color, ...MONO }}>{isExp ? "▲ CLOSE" : "▼ ROADMAP"}</span>
                  </div>
                </button>
              </div>
            );
          });
        })}

        {/* Inline roadmap card — anchored below the expanded role (works for cluster roles AND combo roles) */}
        {expandedRoleId && layout.roadmapAnchor && (() => {
          let role: CompassRole | null = null;
          let accent = Y;
          // Search cluster roles first
          for (const c of map.clusters) {
            const r = c.roles.find(x => x.id === expandedRoleId);
            if (r) { role = r; accent = c.color; break; }
          }
          // Then combo roles
          if (!role) {
            const cr = (map.combo_roles ?? []).find(x => x.id === expandedRoleId);
            if (cr) {
              role = cr;
              accent = layout.comboPositions[cr.id]?.color ?? "#A78BFA";
            }
          }
          if (!role) return null;
          const parentO = ofs(expandedRoleId);
          return (
            <div style={{ position: "absolute", left: layout.roadmapAnchor.x + parentO.dx - ROADMAP_W / 2, top: layout.roadmapAnchor.y + parentO.dy - ROADMAP_H / 2, width: ROADMAP_W, height: ROADMAP_H, zIndex: 5 }} className="compass-fade" key={role.id}>
              <InlineRoadmap role={role} accent={accent} onClose={() => setExpandedRoleId(null)} />
            </div>
          );
        })()}

        {/* Combo role nodes — white card with colored dashed border */}
        {(map.combo_roles ?? []).map((cr, idx) => {
          const pos = layout.comboPositions[cr.id];
          if (!pos) return null;
          const comboColor = pos.color;
          const isExp = expandedRoleId === cr.id;
          const crO = ofs(cr.id);
          return (
            <div key={cr.id}
              style={{ ...absNode(pos.x + crO.dx, pos.y + crO.dy, COMBO_W, COMBO_H), animationDelay: `${idx * 60 + 300}ms`, touchAction: "none" }}
              className="compass-fade"
              onPointerDown={onDragPointerDown(cr.id)}
              onPointerMove={onDragPointerMove}
              onPointerUp={onDragPointerUp}
              onPointerCancel={onDragPointerUp}>
              <button onClick={safeClick(() => onRoleClick(cr.id))}
                style={{ width: COMBO_W, height: COMBO_H, padding: "12px 14px", textAlign: "left", borderRadius: "12px", background: W, color: B, border: `2px dashed ${comboColor}`, cursor: "grab", transition: "all 0.18s", boxShadow: isExp ? `0 8px 26px ${comboColor}55` : `0 4px 14px ${comboColor}33`, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", ...SANS }}
                onMouseEnter={e => { if (!isExp) { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = `0 8px 22px ${comboColor}55`; } }}
                onMouseLeave={e => { if (!isExp) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 14px ${comboColor}33`; } }}>
                {/* color accent stripe */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${comboColor}, ${comboColor}66)` }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
                    <GitBranch size={11} color={comboColor} />
                    <span style={{ fontSize: "9px", fontWeight: 700, color: comboColor, letterSpacing: "0.12em", ...MONO }}>COMBO ROLE</span>
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: B, lineHeight: 1.25, letterSpacing: "-0.01em", marginBottom: "4px", wordBreak: "break-word" }}>{cr.title}</div>
                  <div style={{ fontSize: "11px", color: MUTE, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", wordBreak: "break-word" }}>{cr.description}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", fontSize: "10.5px", fontWeight: 700 }}>
                  <span style={{ color: comboColor, ...MONO }}>{isExp ? "▲ CLOSE" : "▼ ROADMAP"}</span>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ padding: "20px 32px 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "18px", flexWrap: "wrap" }}>
        {map.clusters.map(c => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: B, fontWeight: 500, ...SANS }}>
            <div style={{ width: "12px", height: "3px", background: c.color, borderRadius: "2px" }} />
            <span>{c.label}</span>
          </div>
        ))}
        {(map.combo_roles ?? []).length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: B, fontWeight: 500, ...SANS }}>
            <div style={{ width: "12px", borderTop: `2px dashed ${MUTE}` }} />
            <span>Combo role path</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  INLINE ROADMAP — tabbed card shown beneath the expanded role
//  Tabs: Roadmap (steps) · Projects (flagship builds) · Resources (portal links)
// ════════════════════════════════════════════════════════════════════════════

interface InlineRoadmapProps {
  role: CompassRole;
  accent: string;
  onClose: () => void;
}

// Phase color + label for the foundations → interview progression
const PHASE_META: Record<CompassPhase, { color: string; label: string }> = {
  foundations: { color: "#22C55E", label: "FOUNDATIONS" },
  core:        { color: "#3B82F6", label: "CORE" },
  advanced:    { color: "#A78BFA", label: "ADVANCED" },
  projects:    { color: "#FB923C", label: "PROJECTS" },
  interview:   { color: "#EF4444", label: "INTERVIEW" },
};

const phaseOf = (p: CompassPhase | undefined) => PHASE_META[p ?? "core"];

const LINK_TYPE_META: Record<CompassLinkType, { icon: typeof BookOpen; label: string; routeBase: (slug: string) => string }> = {
  course:      { icon: BookOpen, label: "Course",       routeBase: (s) => `/portal/${s}` },
  interview:   { icon: Target,   label: "Interview",    routeBase: (s) => `/portal/interviews/${s}` },
  career_kit:  { icon: Lightbulb, label: "Career Kit",   routeBase: (s) => `/portal/career-kit/${s}` },
  placement:   { icon: Building2, label: "Placement",    routeBase: (s) => `/portal/placements/${s}` },
};

interface LinkChipProps {
  link: CompassRecommendedLink;
  accent: string;
  size?: "sm" | "md";
}
const LinkChip = ({ link, accent, size = "sm" }: LinkChipProps) => {
  const navigate = useNavigate();
  const meta = LINK_TYPE_META[link.type];
  const Icon = meta.icon;
  const sm = size === "sm";
  return (
    <button
      onClick={() => navigate(meta.routeBase(link.slug))}
      title={link.note ?? `Open ${meta.label}: ${link.label}`}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: sm ? "5px 10px" : "8px 12px",
        background: W, color: B,
        border: `1.5px solid ${accent}`,
        borderRadius: "999px",
        fontSize: sm ? "11px" : "12px", fontWeight: 700, cursor: "pointer",
        boxShadow: `0 2px 6px ${accent}22`,
        transition: "all 0.15s", lineHeight: 1.25, textAlign: "left", maxWidth: "100%",
        ...SANS,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = `${accent}14`; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = W; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <Icon size={sm ? 11 : 13} color={accent} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: "9px", fontWeight: 700, color: accent, letterSpacing: "0.08em", ...MONO, flexShrink: 0 }}>{meta.label.toUpperCase()}</span>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link.label}</span>
      <ExternalLink size={sm ? 10 : 11} color={MUTE} style={{ flexShrink: 0, marginLeft: "2px" }} />
    </button>
  );
};

type TabKey = "roadmap" | "projects" | "resources";

const InlineRoadmap = ({ role, accent, onClose }: InlineRoadmapProps) => {
  const [tab, setTab] = useState<TabKey>("roadmap");
  const [step, setStep] = useState(0);
  const steps = role.roadmap ?? [];
  const projects = role.flagship_projects ?? [];
  const roleLinks = role.recommended_links ?? [];

  useEffect(() => { setStep(0); setTab("roadmap"); }, [role.id]);

  const current = steps[step];

  // Tab definitions — always render the tab bar so empty states are still discoverable
  const tabs: { key: TabKey; label: string; count: number; icon: typeof BookOpen }[] = [
    { key: "roadmap",   label: "Roadmap",  count: steps.length,    icon: Layers },
    { key: "projects",  label: "Projects", count: projects.length, icon: Briefcase },
    { key: "resources", label: "Links",    count: roleLinks.length, icon: ExternalLink },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: W, border: `2px solid ${accent}`, borderRadius: "12px", boxShadow: `0 12px 32px ${accent}55`, overflow: "hidden", display: "flex", flexDirection: "column", ...SANS }}>
      {/* Header */}
      <div style={{ background: B, padding: "12px 16px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: "9px", fontWeight: 700, color: accent, letterSpacing: "0.14em", marginBottom: "3px", ...MONO }}>
            {steps.length}-STEP ROADMAP · {projects.length} PROJECTS
          </div>
          <div style={{ fontSize: "15px", fontWeight: 700, color: Y, letterSpacing: "-0.01em", lineHeight: 1.25, wordBreak: "break-word" }}>{role.title}</div>
          {role.salary_range && (
            <div style={{ fontSize: "11px", color: `${W}AA`, fontWeight: 600, marginTop: "2px", ...MONO }}>{role.salary_range}</div>
          )}
        </div>
        <button onClick={onClose} style={{ background: "transparent", border: `1px solid ${W}30`, color: W, width: "28px", height: "28px", borderRadius: "7px", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
          onMouseEnter={e => (e.currentTarget.style.background = `${W}15`)}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}><X size={14} /></button>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: `1.5px solid ${BORD}`, background: BG, flexShrink: 0 }}>
        {tabs.map((t) => {
          const Ti = t.icon;
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                flex: 1, padding: "9px 8px", background: active ? W : "transparent",
                border: "none", borderBottom: active ? `2.5px solid ${accent}` : "2.5px solid transparent",
                marginBottom: "-1.5px",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
                color: active ? B : MUTE, fontSize: "11.5px", fontWeight: 700, ...SANS, transition: "all 0.15s",
              }}>
              <Ti size={12} />
              {t.label}
              <span style={{ padding: "1px 6px", background: active ? `${accent}22` : "#E5E7EB", color: active ? B : MUTE, borderRadius: "10px", fontSize: "9.5px", fontWeight: 700, ...MONO }}>{t.count}</span>
            </button>
          );
        })}
      </div>

      {/* TAB BODY */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {tab === "roadmap" && (
          steps.length === 0 ? (
            <div style={{ padding: "16px", fontSize: "12px", color: MUTE, lineHeight: 1.55 }}>
              No roadmap yet — try regenerating your Compass.
            </div>
          ) : (
            <>
              {/* Step dots */}
              <div style={{ padding: "10px 12px 6px", display: "flex", alignItems: "center", gap: "4px", overflowX: "auto", flexShrink: 0, borderBottom: `1px dashed ${BORD}` }}>
                {steps.map((s, i) => {
                  const ph = phaseOf(s.phase);
                  return (
                    <button key={i} onClick={() => setStep(i)} title={`Step ${i + 1} · ${ph.label}`}
                      style={{ flex: "0 0 auto", width: "26px", height: "26px", borderRadius: "50%", background: i === step ? ph.color : (i < step ? `${ph.color}55` : "#F3F4F6"), color: i === step ? W : (i < step ? B : MUTE), border: i === step ? `2px solid ${B}` : "none", cursor: "pointer", fontSize: "11px", fontWeight: 700, transition: "all 0.15s", ...MONO }}>
                      {i + 1}
                    </button>
                  );
                })}
                <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: Y, color: B, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: "4px", border: `2px solid ${B}` }} title="Hired!">
                  <Trophy size={12} />
                </div>
              </div>

              {/* Current step body */}
              <div style={{ padding: "12px 16px" }}>
                {(() => { const ph = phaseOf(current.phase); return (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ padding: "3px 8px", background: ph.color, color: W, borderRadius: "10px", fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.1em", ...MONO }}>{ph.label}</span>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: MUTE, letterSpacing: "0.1em", ...MONO }}>STEP {current.step} / {steps.length}</span>
                    </div>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "3px 9px", background: `${accent}22`, borderRadius: "10px", fontSize: "11px", fontWeight: 700, color: B }}>
                      <Clock size={11} color={accent} /> {current.duration}
                    </div>
                  </div>
                ); })()}
                <div style={{ fontSize: "15px", fontWeight: 700, color: B, lineHeight: 1.35, marginBottom: "12px", letterSpacing: "-0.005em", wordBreak: "break-word" }}>{current.title}</div>

                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: MUTE, letterSpacing: "0.1em", marginBottom: "6px", display: "flex", alignItems: "center", gap: "5px", ...MONO }}>
                    <Layers size={11} /> WHAT TO LEARN
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {current.skills.map(s => (
                      <span key={s} style={{ padding: "4px 10px", background: `${accent}18`, color: B, border: `1px solid ${accent}55`, borderRadius: "20px", fontSize: "11.5px", fontWeight: 600, lineHeight: 1.3, wordBreak: "break-word" }}>{s}</span>
                    ))}
                  </div>
                </div>

                <div style={{ padding: "11px 13px", background: BG, borderLeft: `3px solid ${accent}`, borderRadius: "0 8px 8px 0", marginBottom: "10px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: B, letterSpacing: "0.1em", marginBottom: "5px", display: "flex", alignItems: "center", gap: "5px", ...MONO }}>
                    <Flag size={11} color={accent} /> MILESTONE — BUILD THIS
                  </div>
                  <div style={{ fontSize: "12.5px", color: "#1F2937", lineHeight: 1.6, wordBreak: "break-word" }}>{current.milestone}</div>
                </div>

                {current.resource_hint && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", padding: "8px 10px", background: W, borderRadius: "7px", border: `1px dashed ${BORD}`, marginBottom: "10px" }}>
                    <BookOpen size={12} color={MUTE} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <div style={{ fontSize: "11.5px", color: "#374151", lineHeight: 1.55, wordBreak: "break-word" }}><strong style={{ color: B }}>Resource: </strong>{current.resource_hint}</div>
                  </div>
                )}

                {/* Step-level recommended links */}
                {current.recommended_links && current.recommended_links.length > 0 && (
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: 700, color: MUTE, letterSpacing: "0.1em", marginBottom: "6px", display: "flex", alignItems: "center", gap: "5px", ...MONO }}>
                      <ExternalLink size={11} /> OPEN ON UPSTRIDE
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {current.recommended_links.map((ln, i) => <LinkChip key={i} link={ln} accent={accent} size="sm" />)}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer nav */}
              <div style={{ padding: "10px 16px", borderTop: `1px solid ${BORD}`, display: "flex", justifyContent: "space-between", gap: "8px", background: BG, position: "sticky", bottom: 0, flexShrink: 0 }}>
                <button disabled={step === 0} onClick={() => setStep(s => Math.max(0, s - 1))}
                  style={{ padding: "7px 14px", background: step === 0 ? "transparent" : W, color: step === 0 ? "#CBD5E1" : B, border: `1.5px solid ${step === 0 ? "#E5E7EB" : BORD}`, borderRadius: "7px", fontSize: "12px", fontWeight: 600, cursor: step === 0 ? "not-allowed" : "pointer", ...SANS }}>
                  ← Prev
                </button>
                <div style={{ fontSize: "11px", color: MUTE, alignSelf: "center", fontWeight: 600 }}>{step + 1} / {steps.length}</div>
                <button disabled={step === steps.length - 1} onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
                  style={{ padding: "7px 14px", background: step === steps.length - 1 ? "#E5E7EB" : B, color: step === steps.length - 1 ? MUTE : Y, border: "none", borderRadius: "7px", fontSize: "12px", fontWeight: 700, cursor: step === steps.length - 1 ? "not-allowed" : "pointer", ...SANS }}>
                  Next →
                </button>
              </div>
            </>
          )
        )}

        {tab === "projects" && (
          <div style={{ padding: "14px 16px" }}>
            {projects.length === 0 ? (
              <div style={{ fontSize: "12px", color: MUTE, lineHeight: 1.55 }}>No flagship projects yet for this role.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {projects.map((p, i) => (
                  <div key={i} style={{ padding: "12px 14px", background: W, border: `1.5px solid ${BORD}`, borderRadius: "10px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                      <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: `${accent}22`, color: accent, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Wrench size={12} />
                      </div>
                      <div style={{ fontSize: "13.5px", fontWeight: 700, color: B, lineHeight: 1.3, flex: 1, minWidth: 0, wordBreak: "break-word" }}>{p.title}</div>
                    </div>
                    {(p.difficulty || p.duration) && (
                      <div style={{ display: "flex", gap: "5px", marginBottom: "6px", flexWrap: "wrap" }}>
                        {p.difficulty && <span style={{ padding: "2px 8px", background: `${accent}18`, color: B, borderRadius: "10px", fontSize: "10px", fontWeight: 700, ...MONO }}>{p.difficulty.toUpperCase()}</span>}
                        {p.duration && <span style={{ padding: "2px 8px", background: "#F3F4F6", color: MUTE, borderRadius: "10px", fontSize: "10px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "3px", ...MONO }}><Clock size={9} /> {p.duration}</span>}
                      </div>
                    )}
                    <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.55, marginBottom: "8px", wordBreak: "break-word" }}>{p.description}</div>
                    {p.inspiration && (
                      <div style={{ fontSize: "11px", color: MUTE, fontStyle: "italic", marginBottom: "8px", wordBreak: "break-word" }}>e.g. {p.inspiration}</div>
                    )}
                    {p.skills && p.skills.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {p.skills.map((s, j) => (
                          <span key={j} style={{ padding: "2px 8px", background: `${accent}10`, color: B, border: `1px solid ${accent}33`, borderRadius: "10px", fontSize: "10.5px", fontWeight: 600 }}>{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "resources" && (
          <div style={{ padding: "14px 16px" }}>
            {roleLinks.length === 0 ? (
              <div style={{ fontSize: "12px", color: MUTE, lineHeight: 1.55 }}>No portal links recommended for this role yet.</div>
            ) : (
              <div>
                <div style={{ fontSize: "10px", fontWeight: 700, color: MUTE, letterSpacing: "0.1em", marginBottom: "8px", ...MONO }}>UPSTRIDE RESOURCES FOR THIS ROLE</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {roleLinks.map((ln, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <LinkChip link={ln} accent={accent} size="md" />
                      {ln.note && <div style={{ fontSize: "11px", color: MUTE, lineHeight: 1.5, paddingLeft: "12px", borderLeft: `2px solid ${accent}33`, marginLeft: "4px" }}>{ln.note}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Helpers ──
const absNode = (x: number, y: number, w: number, h: number): React.CSSProperties => ({
  position: "absolute",
  left: x - w / 2,
  top: y - h / 2,
  width: w,
  height: h,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const bezier = (x1: number, y1: number, x2: number, y2: number): string => {
  const cpy1 = y1 + (y2 - y1) * 0.45;
  const cpy2 = y2 - (y2 - y1) * 0.45;
  return `M ${x1} ${y1} C ${x1} ${cpy1}, ${x2} ${cpy2}, ${x2} ${y2}`;
};

export default Compass;
