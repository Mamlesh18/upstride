import { useEffect, useState, useCallback } from "react";
import { Send, Copy, Check, Save, RefreshCw } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const Y    = "#FFE500";
const B    = "#0A0A0A";
const W    = "#FFFFFF";
const BG   = "#FAFAFA";
const BORD = "#E5E5E5";
const MUTE = "#6B7280";
const GREEN = "#22C55E";
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

interface Sess {
  id: string;
  order: number;
  topic: string;
  covered: string;
  task: string;
  why: string;
  updated_at: string | null;
}

interface Draft { topic: string; covered: string; task: string; why: string; }

// WhatsApp-flavoured formatter
function whatsappify(s: Sess): string {
  const parts: string[] = [];
  parts.push(`*Session ${s.order}: ${s.topic.trim() || "Untitled"}*`);
  if (s.covered.trim()) {
    parts.push("");
    parts.push("📝 *What we covered today*");
    parts.push(s.covered.trim());
  }
  if (s.task.trim()) {
    parts.push("");
    parts.push("🎯 *Your task*");
    parts.push(s.task.trim());
  }
  if (s.why.trim()) {
    parts.push("");
    parts.push("✨ *Why*");
    parts.push(s.why.trim());
  }
  return parts.join("\n");
}

export default function ClassMessagesTab() {
  const [sessions, setSessions] = useState<Sess[]>([]);
  const [loading, setLoading] = useState(true);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.admin.listTrainingSessions();
      const ss = r.data.sessions;
      setSessions(ss);
      const d: Record<string, Draft> = {};
      for (const s of ss) {
        d[s.id] = { topic: s.topic, covered: s.covered, task: s.task, why: s.why };
      }
      setDrafts(d);
    } catch (err) {
      toast({ title: "Couldn't load class messages", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const updateDraft = (id: string, field: keyof Draft, value: string) => {
    setDrafts(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const isDirty = (s: Sess) => {
    const d = drafts[s.id];
    if (!d) return false;
    return d.topic !== s.topic || d.covered !== s.covered || d.task !== s.task || d.why !== s.why;
  };

  const save = async (s: Sess) => {
    const d = drafts[s.id];
    if (!d) return;
    setSavingId(s.id);
    try {
      const r = await api.admin.updateTrainingSession(s.id, d);
      setSessions(prev => prev.map(x => x.id === s.id ? r.session : x));
      toast({ title: "Saved", description: `Session ${s.order} updated.` });
    } catch (err) {
      toast({ title: "Save failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSavingId(null);
    }
  };

  const copyToClipboard = async (s: Sess) => {
    const d = drafts[s.id] || { topic: s.topic, covered: s.covered, task: s.task, why: s.why };
    const merged: Sess = { ...s, ...d };
    const text = whatsappify(merged);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(s.id);
      setTimeout(() => setCopiedId(prev => (prev === s.id ? null : prev)), 2000);
      toast({ title: "Copied for WhatsApp", description: "Paste into your group chat." });
    } catch {
      toast({ title: "Couldn't copy", description: "Select the text manually instead.", variant: "destructive" });
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: B, margin: 0 }}>Class Messages</h2>
          <p style={{ fontSize: "12.5px", color: MUTE, marginTop: "4px", maxWidth: "640px", lineHeight: 1.5 }}>
            Ten training sessions, one editable message each. Edit, save, then "Copy for WhatsApp" — paste straight into your group.
          </p>
        </div>
        <button onClick={() => void load()} disabled={loading}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: W, border: `1.5px solid ${BORD}`, borderRadius: "8px", fontSize: "12px", fontWeight: 600, color: B, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1 }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: MUTE, fontSize: "13px" }}>Loading sessions…</div>
      ) : sessions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", border: `2px dashed ${BORD}`, borderRadius: "12px", color: MUTE }}>
          <Send size={32} style={{ opacity: 0.3, marginBottom: "8px" }} />
          <div style={{ fontWeight: 600, color: B }}>No sessions yet</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
          {sessions.map(s => {
            const d = drafts[s.id] || { topic: s.topic, covered: s.covered, task: s.task, why: s.why };
            const dirty = isDirty(s);
            const copied = copiedId === s.id;
            return (
              <div key={s.id} style={{ background: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", boxShadow: dirty ? `0 0 0 2px ${Y}55` : "0 1px 4px rgba(0,0,0,0.04)" }}>
                {/* Header */}
                <div style={{ padding: "14px 18px", borderBottom: `1px solid ${BORD}`, background: BG, display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <span style={{ width: "28px", height: "28px", borderRadius: "50%", background: B, color: Y, display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "13px", ...MONO, flexShrink: 0 }}>
                    {s.order}
                  </span>
                  <input
                    value={d.topic}
                    onChange={e => updateDraft(s.id, "topic", e.target.value)}
                    placeholder="Topic"
                    style={{ flex: 1, minWidth: "200px", border: "none", background: "transparent", fontSize: "15px", fontWeight: 700, color: B, outline: "none" }}
                  />
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => void save(s)} disabled={!dirty || savingId === s.id}
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: dirty ? B : "#F3F4F6", color: dirty ? Y : MUTE, border: "none", borderRadius: "7px", fontSize: "12px", fontWeight: 700, cursor: dirty && savingId !== s.id ? "pointer" : "not-allowed", ...MONO }}>
                      <Save size={13} /> {savingId === s.id ? "SAVING…" : "SAVE"}
                    </button>
                    <button onClick={() => void copyToClipboard(s)}
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", background: copied ? GREEN : Y, color: B, border: "none", borderRadius: "7px", fontSize: "12px", fontWeight: 700, cursor: "pointer", ...MONO }}>
                      {copied ? <><Check size={13} /> COPIED</> : <><Copy size={13} /> COPY FOR WHATSAPP</>}
                    </button>
                  </div>
                </div>

                {/* Three text areas */}
                <div style={{ padding: "16px 18px", display: "grid", gridTemplateColumns: "1fr", gap: "14px" }}>
                  <TextArea
                    label="What we covered today"
                    placeholder="A short paragraph students can read on WhatsApp — the one big idea from this session."
                    value={d.covered}
                    onChange={v => updateDraft(s.id, "covered", v)}
                  />
                  <TextArea
                    label="Your task"
                    placeholder="The specific thing you want them to do or send back before the next session."
                    value={d.task}
                    onChange={v => updateDraft(s.id, "task", v)}
                  />
                  <TextArea
                    label="Why"
                    placeholder="What they gain by doing it — the outcome, in their language."
                    value={d.why}
                    onChange={v => updateDraft(s.id, "why", v)}
                  />
                </div>

                {/* Preview */}
                <div style={{ padding: "10px 18px 16px" }}>
                  <details style={{ background: BG, border: `1px solid ${BORD}`, borderRadius: "8px", padding: "8px 12px" }}>
                    <summary style={{ cursor: "pointer", fontSize: "11px", fontWeight: 700, color: MUTE, ...MONO, letterSpacing: "0.08em" }}>
                      PREVIEW
                    </summary>
                    <pre style={{ marginTop: "10px", margin: 0, fontFamily: "inherit", fontSize: "13px", color: B, lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                      {whatsappify({ ...s, ...d })}
                    </pre>
                  </details>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: "10.5px", fontWeight: 700, color: MUTE, ...MONO, letterSpacing: "0.1em", marginBottom: "6px" }}>
        {label.toUpperCase()}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={Math.max(3, Math.min(8, value.split("\n").length + 1))}
        style={{
          width: "100%", padding: "10px 12px", border: `1.5px solid ${BORD}`, borderRadius: "8px",
          fontSize: "13.5px", lineHeight: 1.55, fontFamily: "inherit", color: B, background: W,
          resize: "vertical", outline: "none", boxSizing: "border-box",
        }}
        onFocus={e => (e.currentTarget.style.borderColor = B)}
        onBlur={e => (e.currentTarget.style.borderColor = BORD)}
      />
    </div>
  );
}
