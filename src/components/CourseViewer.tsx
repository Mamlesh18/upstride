import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, ExternalLink, CheckCircle2, Circle, Award, BookOpen, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "@/hooks/use-toast";

// ── Design tokens ─────────────────────────────────────────────────────────────
const B      = "#0A0A0A";
const W      = "#FFFFFF";
const BG     = "#F8FAFC";
const BORD   = "#E5E7EB";
const MUTE   = "#9CA3AF";
const GREEN  = "#22C55E";
const GREEN_FG  = "#15803d";
const GREEN_BG  = "#F0FDF4";
const SANS: React.CSSProperties = { fontFamily: "'Sora', system-ui, sans-serif" };
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

// ── Interfaces ────────────────────────────────────────────────────────────────
interface QAItem { question: string; answer: string; }
interface MCQItem { question: string; options: string[]; correct_index: number; }

interface Topic {
  id: string; title: string; content_type: string; video_url: string;
  duration: string; qa_items: QAItem[]; mcq_items: MCQItem[];
  difficulty: string; platform: string; order: number; completed: boolean;
}

interface CourseData {
  id: string; title: string; description: string; emoji: string;
  category: string; topics: Topic[];
  total_topics: number; completed_topics: number; progress_pct: number;
}

interface Props { courseId: string; studentName: string; studentEmail: string; onBack: () => void; }

// ── Helpers ───────────────────────────────────────────────────────────────────
function ensureUrl(url: string): string {
  const u = (url || "").trim();
  if (!u) return "";
  return u.startsWith("http://") || u.startsWith("https://") ? u : "https://" + u;
}

const difficultyColor = (d: string) =>
  d === "Easy"   ? { bg: "#DCFCE7", fg: "#16A34A" } :
  d === "Medium" ? { bg: "#FEF3C7", fg: "#D97706" } :
  d === "Hard"   ? { bg: "#FEE2E2", fg: "#DC2626" } :
  { bg: "#F3F4F6", fg: MUTE };

// ── Main component ────────────────────────────────────────────────────────────
export default function CourseViewer({ courseId, studentName, studentEmail, onBack }: Props) {
  const [course, setCourse]     = useState<CourseData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.courses.get(courseId) as { data: CourseData };
      setCourse(r.data);
    } catch (e: unknown) {
      toast({ title: "Error loading course", description: (e as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  }, [courseId]);

  useEffect(() => { load(); }, [load]);

  const toggle = async (topic: Topic) => {
    if (!course || toggling) return;
    setToggling(topic.id);
    try {
      const action = topic.completed ? api.courses.markIncomplete : api.courses.markComplete;
      const r = await action(courseId, topic.id) as { completed_topics: number; total_topics: number; progress_pct: number };
      setCourse(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          completed_topics: r.completed_topics,
          progress_pct: r.progress_pct,
          topics: prev.topics.map(t => t.id === topic.id ? { ...t, completed: !topic.completed } : t),
        };
      });
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally { setToggling(null); }
  };

  const openLink = async (topic: Topic) => {
    const url = ensureUrl(topic.video_url);
    if (!url) { toast({ title: "No link available", variant: "destructive" }); return; }
    window.open(url, "_blank", "noopener,noreferrer");
    if (!topic.completed) { await toggle(topic); }
  };

  const printCertificate = () => {
    if (!course) return;
    const displayName = studentName || studentEmail.split("@")[0] || "Student";
    const certWindow = window.open("", "_blank", "width=820,height=640");
    if (!certWindow) return;
    certWindow.document.write(`<!DOCTYPE html><html><head>
      <title>Certificate — ${course.title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;700&display=swap" rel="stylesheet">
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#fff;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'IBM Plex Mono',monospace}
        .cert{width:720px;padding:56px 64px;border:8px solid #0A0A0A;position:relative;overflow:hidden}
        .tl{position:absolute;top:0;left:0;width:80px;height:80px;background:#FFE500;clip-path:polygon(0 0,100% 0,0 100%)}
        .br{position:absolute;bottom:0;right:0;width:80px;height:80px;background:#FFE500;clip-path:polygon(100% 0,100% 100%,0 100%)}
        .ib{position:absolute;inset:20px;border:1.5px solid rgba(10,10,10,.1)}
        .con{text-align:center;position:relative;z-index:1}
        .bb{font-family:'Bebas Neue',cursive}
        .lbl{font-size:11px;letter-spacing:.3em;color:#6B7280;margin-bottom:8px}
        .title{font-size:52px;color:#0A0A0A;letter-spacing:.06em;line-height:1}
        .cl{font-size:12px;letter-spacing:.15em;color:#6B7280;margin:28px 0 8px}
        .name{font-size:44px;color:#0A0A0A;letter-spacing:.04em;border-bottom:4px solid #FFE500;display:inline-block;padding-bottom:8px;margin-bottom:24px}
        .sub{font-size:13px;color:#6B7280;margin-bottom:6px}
        .ct{font-size:32px;color:#0A0A0A;letter-spacing:.04em;margin-bottom:36px}
        .ft{display:flex;justify-content:space-around;margin-top:40px;padding-top:24px;border-top:1px solid #E5E5E5}
        .fv{font-size:18px;letter-spacing:.06em;color:#0A0A0A}
        .fs{font-size:9px;letter-spacing:.15em;color:#6B7280;margin-top:2px}
        @media print{body{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
      </style></head><body>
      <div class="cert"><div class="tl"></div><div class="br"></div><div class="ib"></div>
        <div class="con">
          <div class="lbl">UPSTRIDES</div>
          <div class="bb title">CERTIFICATE OF<br/>COMPLETION</div>
          <div class="cl">THIS IS TO CERTIFY THAT</div>
          <div class="bb name">${displayName.toUpperCase()}</div>
          <div class="sub">has successfully completed</div>
          <div class="bb ct">${course.title.toUpperCase()}</div>
          <div class="ft">
            <div><div class="bb fv">${course.total_topics} TOPICS</div><div class="fs">COMPLETED</div></div>
            <div><div class="bb fv">${new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}).toUpperCase()}</div><div class="fs">DATE OF COMPLETION</div></div>
            <div><div class="bb fv">UPSTRIDES</div><div class="fs">ISSUED BY</div></div>
          </div>
        </div>
      </div>
      <script>window.onload=function(){setTimeout(function(){window.print();},600);}<\/script>
    </body></html>`);
    certWindow.document.close();
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px", color: MUTE, ...SANS, gap: "10px" }}>
        <div style={{ width: "18px", height: "18px", border: `2px solid ${BORD}`, borderTopColor: B, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        Loading course...
      </div>
    );
  }
  if (!course) {
    return (
      <div style={{ textAlign: "center", padding: "48px", color: MUTE, ...SANS }}>
        <BookOpen size={40} style={{ marginBottom: "12px", opacity: 0.3 }} />
        <div style={{ fontWeight: 600, color: B, marginBottom: "8px" }}>Course not found</div>
        <button onClick={onBack} style={{ marginTop: "8px", padding: "9px 22px", background: B, color: W, border: "none", cursor: "pointer", ...SANS, fontWeight: 600, borderRadius: "6px" }}>
          ← Go Back
        </button>
      </div>
    );
  }

  const isComplete    = course.progress_pct === 100 && course.total_topics > 0;
  const isDSACourse   = course.topics.length > 0 && course.topics.every(t => t.content_type === "dsa");
  const isMCQCourse   = course.topics.length > 0 && course.topics.every(t => t.content_type === "mcq");
  const isArticleCourse = course.topics.length > 0 && course.topics.every(t => t.content_type === "article");
  const colLabel      = isDSACourse ? "DIFFICULTY" : isMCQCourse ? "QUESTIONS" : isArticleCourse ? "Q&A" : "DURATION";
  const catLabel      = ({ training: "COURSES", courses: "COURSES", placement: "PLACEMENTS", placements: "PLACEMENTS", interviews: "INTERVIEWS" } as Record<string, string>)[course.category] ?? course.category.toUpperCase();

  return (
    <div style={{ maxWidth: "920px", margin: "0 auto", ...SANS }}>

      {/* Back button */}
      <button onClick={onBack}
        style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: MUTE, background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 500, padding: 0, marginBottom: "28px", ...SANS, transition: "color 0.15s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = B; }}
        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = MUTE; }}>
        <ArrowLeft size={15} /> Back to Courses
      </button>

      {/* Course header ──────────────────────────────────────────────────── */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ marginBottom: "8px" }}>
          <span style={{ ...MONO, fontSize: "10px", fontWeight: 600, color: MUTE, letterSpacing: "0.14em" }}>{catLabel}</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "20px", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: "clamp(20px, 2.8vw, 28px)", fontWeight: 700, color: B, lineHeight: 1.25, marginBottom: "8px", ...SANS, letterSpacing: "-0.01em" }}>
              {course.title}
            </h1>
            {course.description && (
              <p style={{ fontSize: "14px", color: "#4B5563", lineHeight: 1.75, maxWidth: "580px", ...SANS, fontWeight: 400, margin: 0 }}>
                {course.description}
              </p>
            )}
          </div>
          {isComplete && (
            <button onClick={printCertificate}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 22px", background: B, color: W, border: "none", cursor: "pointer", fontSize: "13px", fontWeight: 600, ...SANS, borderRadius: "8px", flexShrink: 0, transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#1f1f1f"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = B; (e.currentTarget as HTMLButtonElement).style.transform = "none"; }}>
              <Award size={16} /> Get Certificate
            </button>
          )}
        </div>
      </div>

      {/* Progress card ───────────────────────────────────────────────────── */}
      <div style={{ background: W, border: `1px solid ${BORD}`, borderRadius: "12px", padding: "20px 24px", marginBottom: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: B, ...SANS, marginBottom: "3px" }}>
              {course.completed_topics} / {course.total_topics} completed
            </div>
            {isComplete ? (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: GREEN_FG, fontWeight: 500, ...SANS }}>
                <CheckCircle2 size={13} /> Course complete — download your certificate above.
              </div>
            ) : (
              <div style={{ fontSize: "12px", color: MUTE, ...SANS }}>
                {course.total_topics - course.completed_topics} topics remaining
              </div>
            )}
          </div>
          <div style={{ ...MONO, fontSize: "28px", fontWeight: 700, color: isComplete ? GREEN : B, lineHeight: 1 }}>
            {course.progress_pct}%
          </div>
        </div>
        <div style={{ height: "6px", background: "#F3F4F6", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${course.progress_pct}%`, background: isComplete ? GREEN : B, borderRadius: "3px", transition: "width 0.5s ease" }} />
        </div>
      </div>

      {/* Topic list ──────────────────────────────────────────────────────── */}
      {course.topics.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 24px", border: `1px dashed ${BORD}`, background: W, borderRadius: "12px", color: MUTE }}>
          <BookOpen size={36} style={{ marginBottom: "12px", opacity: 0.25 }} />
          <div style={{ fontWeight: 600, color: B, marginBottom: "4px", ...SANS }}>No topics yet</div>
          <div style={{ fontSize: "13px", ...SANS }}>Your admin will add topics to this course soon.</div>
        </div>
      ) : (
        <div style={{ background: W, border: `1px solid ${BORD}`, borderRadius: "12px", overflow: "hidden" }}>

          {/* Table header */}
          <div style={{ display: "grid", gridTemplateColumns: "52px 1fr 120px 60px", alignItems: "center", padding: "12px 20px", background: "#F9FAFB", borderBottom: `1px solid ${BORD}`, gap: "12px" }}>
            <div style={{ ...MONO, fontSize: "10px", fontWeight: 600, color: MUTE, letterSpacing: "0.12em" }}>#</div>
            <div style={{ ...MONO, fontSize: "10px", fontWeight: 600, color: MUTE, letterSpacing: "0.12em" }}>
              {isDSACourse ? "PROBLEM" : isMCQCourse ? "QUIZ" : "TOPIC"}
            </div>
            <div style={{ ...MONO, fontSize: "10px", fontWeight: 600, color: MUTE, letterSpacing: "0.12em" }}>{colLabel}</div>
            <div style={{ ...MONO, fontSize: "10px", fontWeight: 600, color: MUTE, letterSpacing: "0.12em", textAlign: "center" }}>DONE</div>
          </div>

          {/* Rows */}
          {course.topics.map((topic, idx) => {
            if (topic.content_type === "mcq") {
              return <MCQRow key={topic.id} topic={topic} idx={idx} toggling={toggling === topic.id} onToggle={() => toggle(topic)} />;
            }
            if (topic.content_type === "article") {
              return <ArticleRow key={topic.id} topic={topic} idx={idx} toggling={toggling === topic.id} onToggle={() => toggle(topic)} />;
            }
            return <TopicRow key={topic.id} topic={topic} idx={idx} toggling={toggling === topic.id} onToggle={() => toggle(topic)} onOpen={() => openLink(topic)} />;
          })}
        </div>
      )}
    </div>
  );
}

/* ─── Standard row (video / mixed / qa / dsa) ─────────────────────────────── */
function TopicRow({ topic, idx, toggling, onToggle, onOpen }: {
  topic: Topic; idx: number; toggling: boolean; onToggle: () => void; onOpen: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered]   = useState(false);
  const isDSA    = topic.content_type === "dsa";
  const hasVideo = (topic.content_type === "video" || topic.content_type === "mixed") && topic.video_url;
  const hasDSA   = isDSA && topic.video_url;
  const hasQA    = (topic.content_type === "qa" || topic.content_type === "mixed") && topic.qa_items?.length > 0;
  const dc       = difficultyColor(topic.difficulty);

  return (
    <div style={{ borderBottom: `1px solid ${BORD}` }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "grid", gridTemplateColumns: "52px 1fr 120px 60px",
          alignItems: "center", padding: "16px 20px", gap: "12px",
          background: topic.completed ? GREEN_BG : hovered ? "#FAFAFA" : W,
          borderLeft: `3px solid ${topic.completed ? GREEN : "transparent"}`,
          transition: "all 0.12s",
        }}>

        {/* Index */}
        <div style={{ ...MONO, fontSize: "12px", fontWeight: 600, color: topic.completed ? "#16A34A" : "#C9CDD4", textAlign: "center" }}>
          {String(idx + 1).padStart(2, "0")}
        </div>

        {/* Title + actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", minWidth: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "14px", fontWeight: 500, color: topic.completed ? GREEN_FG : B, lineHeight: 1.4, ...SANS }}>
              {topic.title}
            </div>
            {isDSA && topic.platform && (
              <div style={{ ...MONO, fontSize: "10px", color: MUTE, marginTop: "2px" }}>{topic.platform}</div>
            )}
            {hasQA && (
              <button onClick={() => setExpanded(e => !e)}
                style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: "#7C3AED", background: "none", border: "none", cursor: "pointer", ...MONO, fontSize: "11px", fontWeight: 600, padding: 0, marginTop: "5px" }}>
                {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                {topic.qa_items.length} Q&A — {expanded ? "hide" : "show"}
              </button>
            )}
          </div>
          {(hasVideo || hasDSA) && (
            <button onClick={onOpen}
              style={{
                display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 14px",
                background: topic.completed ? GREEN_BG : W,
                color: topic.completed ? GREEN_FG : B,
                border: `1.5px solid ${topic.completed ? "#22C55E50" : BORD}`,
                borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: 600,
                ...SANS, flexShrink: 0, transition: "all 0.12s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = topic.completed ? GREEN : B; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = topic.completed ? "#22C55E50" : BORD; }}>
              <ExternalLink size={12} />
              {isDSA ? (topic.completed ? "Revisit" : "Solve") : (topic.completed ? "Rewatch" : "Watch")}
            </button>
          )}
        </div>

        {/* Col info */}
        <div>
          {isDSA ? (
            topic.difficulty ? (
              <span style={{ ...MONO, fontSize: "10px", fontWeight: 700, color: dc.fg, background: dc.bg, padding: "3px 9px", borderRadius: "20px" }}>
                {topic.difficulty}
              </span>
            ) : null
          ) : topic.duration ? (
            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: MUTE, ...MONO, fontSize: "11px" }}>
              <Clock size={11} /> {topic.duration}
            </span>
          ) : null}
        </div>

        {/* Toggle */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={onToggle} disabled={toggling}
            style={{ background: "none", border: "none", cursor: toggling ? "wait" : "pointer", display: "flex", alignItems: "center", padding: "4px", opacity: toggling ? 0.5 : 1, transition: "transform 0.12s" }}
            onMouseEnter={e => { if (!toggling) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.12)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}>
            {topic.completed ? <CheckCircle2 size={22} color={GREEN} strokeWidth={2.5} /> : <Circle size={22} color="#D1D5DB" strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Q&A accordion */}
      {hasQA && expanded && (
        <div style={{ background: "#FAFAFA", borderTop: `1px solid ${BORD}`, padding: "20px 20px 20px 84px" }}>
          {topic.qa_items.map((item, i) => (
            <div key={i} style={{ marginBottom: i < topic.qa_items.length - 1 ? "18px" : 0, paddingBottom: i < topic.qa_items.length - 1 ? "18px" : 0, borderBottom: i < topic.qa_items.length - 1 ? `1px solid ${BORD}` : "none" }}>
              <div style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
                <span style={{ ...MONO, fontSize: "9px", color: "#7C3AED", background: "#EDE9FE", padding: "2px 6px", flexShrink: 0, lineHeight: "18px", borderRadius: "3px", fontWeight: 700 }}>Q{i + 1}</span>
                <div style={{ fontSize: "13px", fontWeight: 600, color: B, ...SANS, lineHeight: 1.5 }}>{item.question}</div>
              </div>
              <div style={{ fontSize: "13px", color: "#4B5563", lineHeight: 1.8, paddingLeft: "34px", ...SANS }}>{item.answer}</div>
            </div>
          ))}
          {!topic.completed && (
            <button onClick={onToggle}
              style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 18px", background: B, color: W, border: "none", cursor: "pointer", ...SANS, fontSize: "12px", fontWeight: 600, borderRadius: "6px" }}>
              <CheckCircle2 size={13} /> Mark as Read
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Article row ─────────────────────────────────────────────────────────── */
function ArticleRow({ topic, idx, toggling, onToggle }: {
  topic: Topic; idx: number; toggling: boolean; onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered]   = useState(false);
  const count = topic.qa_items?.length ?? 0;

  return (
    <div style={{ borderBottom: `1px solid ${BORD}` }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "grid", gridTemplateColumns: "52px 1fr 120px 60px",
          alignItems: "center", padding: "16px 20px", gap: "12px",
          background: topic.completed ? GREEN_BG : hovered ? "#FAFAFA" : W,
          borderLeft: `3px solid ${topic.completed ? GREEN : "transparent"}`,
          transition: "all 0.12s",
        }}>

        <div style={{ ...MONO, fontSize: "12px", fontWeight: 600, color: topic.completed ? "#16A34A" : "#C9CDD4", textAlign: "center" }}>
          {String(idx + 1).padStart(2, "0")}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "14px", fontWeight: 500, color: topic.completed ? GREEN_FG : B, lineHeight: 1.4, ...SANS }}>
              {topic.title}
            </div>
            <div style={{ ...MONO, fontSize: "10px", color: MUTE, marginTop: "2px" }}>{count} questions</div>
          </div>
          <button onClick={() => setExpanded(e => !e)}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 14px",
              background: expanded ? "#F9FAFB" : topic.completed ? GREEN_BG : B,
              color: expanded ? B : topic.completed ? GREEN_FG : W,
              border: `1.5px solid ${expanded ? BORD : topic.completed ? "#22C55E50" : B}`,
              borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: 600,
              ...SANS, flexShrink: 0, transition: "all 0.12s",
            }}>
            {expanded ? <ChevronUp size={13} /> : <BookOpen size={13} />}
            {expanded ? "Close" : topic.completed ? "Read again" : "Read"}
          </button>
        </div>

        <div style={{ ...MONO, fontSize: "11px", color: MUTE }}>{count} Q&A</div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={onToggle} disabled={toggling}
            style={{ background: "none", border: "none", cursor: toggling ? "wait" : "pointer", display: "flex", alignItems: "center", padding: "4px", opacity: toggling ? 0.5 : 1, transition: "transform 0.12s" }}
            onMouseEnter={e => { if (!toggling) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.12)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}>
            {topic.completed ? <CheckCircle2 size={22} color={GREEN} strokeWidth={2.5} /> : <Circle size={22} color="#D1D5DB" strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Article reading pane */}
      {expanded && (
        <div style={{ background: W, borderTop: `2px solid ${B}`, padding: "36px 40px 36px 84px" }}>
          {topic.qa_items.map((item, i) => (
            <div key={i} style={{ marginBottom: "32px", paddingBottom: i < topic.qa_items.length - 1 ? "32px" : 0, borderBottom: i < topic.qa_items.length - 1 ? `1px solid ${BORD}` : "none" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                <span style={{ ...MONO, fontSize: "9px", fontWeight: 700, color: MUTE, background: "#F3F4F6", padding: "4px 8px", flexShrink: 0, marginTop: "4px", letterSpacing: "0.1em", borderRadius: "4px" }}>
                  Q{i + 1}
                </span>
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: B, lineHeight: 1.45, margin: 0, ...SANS }}>
                  {item.question}
                </h3>
              </div>
              <div style={{ paddingLeft: "44px" }}>
                <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: "14px", color: "#374151", lineHeight: 1.95, whiteSpace: "pre-wrap" }}>
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
          {!topic.completed && (
            <div style={{ paddingLeft: "44px", paddingTop: "8px" }}>
              <button onClick={() => { onToggle(); setExpanded(false); }}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 24px", background: B, color: W, border: "none", cursor: "pointer", ...SANS, fontSize: "13px", fontWeight: 600, borderRadius: "8px" }}>
                <CheckCircle2 size={14} /> Mark as Complete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── MCQ row ─────────────────────────────────────────────────────────────── */
function MCQRow({ topic, idx, toggling, onToggle }: {
  topic: Topic; idx: number; toggling: boolean; onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered]   = useState(false);
  const [selected, setSelected] = useState<(number | null)[]>(() => topic.mcq_items.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const count    = topic.mcq_items?.length ?? 0;
  const score    = submitted ? topic.mcq_items.filter((q, i) => selected[i] === q.correct_index).length : 0;
  const allAnswered = selected.every(s => s !== null);

  const handleSubmit = async () => { setSubmitted(true); if (!topic.completed) { await onToggle(); } };
  const reset = () => { setSelected(topic.mcq_items.map(() => null)); setSubmitted(false); };

  return (
    <div style={{ borderBottom: `1px solid ${BORD}` }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "grid", gridTemplateColumns: "52px 1fr 120px 60px",
          alignItems: "center", padding: "16px 20px", gap: "12px",
          background: topic.completed ? GREEN_BG : hovered ? "#FAFAFA" : W,
          borderLeft: `3px solid ${topic.completed ? GREEN : "transparent"}`,
          transition: "all 0.12s",
        }}>

        <div style={{ ...MONO, fontSize: "12px", fontWeight: 600, color: topic.completed ? "#16A34A" : "#C9CDD4", textAlign: "center" }}>
          {String(idx + 1).padStart(2, "0")}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "14px", fontWeight: 500, color: topic.completed ? GREEN_FG : B, lineHeight: 1.4, ...SANS }}>
              {topic.title}
            </div>
            {submitted && (
              <div style={{ fontSize: "11px", color: score === count ? GREEN_FG : "#D97706", fontWeight: 600, marginTop: "3px", ...MONO }}>
                {score}/{count} correct
              </div>
            )}
          </div>
          <button onClick={() => setExpanded(e => !e)}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 14px",
              background: expanded ? "#F9FAFB" : topic.completed ? GREEN_BG : B,
              color: expanded ? B : topic.completed ? GREEN_FG : W,
              border: `1.5px solid ${expanded ? BORD : topic.completed ? "#22C55E50" : B}`,
              borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: 600,
              ...SANS, flexShrink: 0, transition: "all 0.12s",
            }}>
            {expanded ? <ChevronUp size={13} /> : null}
            {expanded ? "Close" : topic.completed ? "Retake" : "Start Quiz"}
          </button>
        </div>

        <div style={{ ...MONO, fontSize: "11px", color: MUTE }}>{count} questions</div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={onToggle} disabled={toggling}
            style={{ background: "none", border: "none", cursor: toggling ? "wait" : "pointer", display: "flex", alignItems: "center", padding: "4px", opacity: toggling ? 0.5 : 1, transition: "transform 0.12s" }}
            onMouseEnter={e => { if (!toggling) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.12)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}>
            {topic.completed ? <CheckCircle2 size={22} color={GREEN} strokeWidth={2.5} /> : <Circle size={22} color="#D1D5DB" strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Quiz pane */}
      {expanded && (
        <div style={{ background: BG, borderTop: `1px solid ${BORD}`, padding: "28px 32px" }}>
          {topic.mcq_items.map((q, qi) => {
            const isCorrect = submitted && selected[qi] === q.correct_index;
            const isWrong   = submitted && selected[qi] !== null && selected[qi] !== q.correct_index;
            return (
              <div key={qi} style={{ marginBottom: "20px", background: W, border: `1px solid ${submitted ? (isCorrect ? "#22C55E50" : isWrong ? "#EF444450" : BORD) : BORD}`, borderRadius: "10px", padding: "18px 20px" }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: B, marginBottom: "14px", lineHeight: 1.5, ...SANS }}>
                  <span style={{ ...MONO, fontSize: "10px", color: MUTE, marginRight: "8px" }}>Q{qi + 1}</span>
                  {q.question}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {q.options.map((opt, oi) => {
                    const isSelected    = selected[qi] === oi;
                    const isCorrectOpt  = submitted && oi === q.correct_index;
                    const isWrongOpt    = submitted && isSelected && oi !== q.correct_index;
                    return (
                      <label key={oi}
                        style={{
                          display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px",
                          border: `1.5px solid ${isCorrectOpt ? "#22C55E" : isWrongOpt ? "#EF4444" : isSelected ? B : BORD}`,
                          borderRadius: "8px", cursor: submitted ? "default" : "pointer",
                          background: isCorrectOpt ? "#F0FDF4" : isWrongOpt ? "#FFF1F2" : isSelected ? "#F8F8F8" : W,
                          transition: "all 0.1s",
                        }}>
                        <input
                          type="radio" name={`q-${topic.id}-${qi}`}
                          disabled={submitted} checked={isSelected}
                          onChange={() => { if (!submitted) setSelected(prev => { const n = [...prev]; n[qi] = oi; return n; }); }}
                          style={{ accentColor: B, width: "16px", height: "16px", flexShrink: 0 }}
                        />
                        <span style={{ fontSize: "13px", color: B, flex: 1, ...SANS }}>
                          {String.fromCharCode(65 + oi)}. {opt}
                        </span>
                        {isCorrectOpt && <span style={{ ...MONO, fontSize: "10px", fontWeight: 700, color: "#16A34A" }}>✓ Correct</span>}
                        {isWrongOpt   && <span style={{ ...MONO, fontSize: "10px", fontWeight: 700, color: "#DC2626" }}>✗ Wrong</span>}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {!submitted ? (
            <button onClick={handleSubmit} disabled={!allAnswered || toggling}
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "11px 26px", background: allAnswered ? B : "#E5E7EB", color: allAnswered ? W : MUTE, border: "none", cursor: allAnswered ? "pointer" : "not-allowed", ...SANS, fontSize: "13px", fontWeight: 600, borderRadius: "8px", transition: "all 0.15s" }}>
              <CheckCircle2 size={14} /> Submit Quiz
            </button>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", padding: "12px 20px", background: W, border: `1.5px solid ${score === count ? "#22C55E" : "#F59E0B"}`, borderRadius: "10px" }}>
                <span style={{ fontSize: "22px", fontWeight: 700, color: score === count ? GREEN_FG : "#D97706", ...MONO }}>{score}/{count}</span>
                <span style={{ fontSize: "13px", color: "#4B5563", ...SANS }}>{score === count ? "Perfect!" : score >= count / 2 ? "Good job!" : "Keep practising"}</span>
              </div>
              <button onClick={reset} style={{ padding: "10px 18px", background: W, border: `1.5px solid ${BORD}`, borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", ...SANS, color: B, transition: "border-color 0.12s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = B; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = BORD; }}>
                Retake
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
