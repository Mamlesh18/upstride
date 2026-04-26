import { useState, useEffect, useCallback } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}
import { useNavigate } from "react-router-dom";
import {
  FileText, Mail, Linkedin, ListChecks, FileCode, MessageSquare,
  Building2, Code2, LogOut, GraduationCap, Star, Database, Network,
  Cpu, MessageCircle, Lightbulb, Brain, Target, BookOpen, ArrowUpRight,
  Flame, Zap, Trophy, Eye, ShoppingCart, Server, Coffee,
  PlayCircle, Lock, CheckSquare, X, Send, Sparkles, Copy, Check, CalendarDays,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

// ─── Theme ───────────────────────────────────────────────────────────────────
const Y    = "#FFE500";   // yellow
const B    = "#0A0A0A";   // black
const W    = "#FFFFFF";   // white
const BG   = "#FAFAFA";   // page bg
const BORD = "#E5E5E5";   // border
const MUTE = "#6B7280";   // muted text
const SURF = "#FFFFFF";   // card surface

const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

// ─── Types ───────────────────────────────────────────────────────────────────
type ViewType = "recommended" | "training" | "placement" | "sessions" | "resume" | "leaderboard" | "schedule";

// ─── Resource Types ───────────────────────────────────────────────────────────
interface Resource { id: string; section: string; category: string; name: string; tagline: string; url: string; company_type?: string; sub_type?: string; emoji?: string; badge_label?: string; badge_accent?: boolean; }
interface ResourcesData {
  recommended: Resource[];
  training: { category: string; resources: Resource[] }[];
  placement: {
    service: { company: string; resources: Resource[] }[];
    product: Resource[];
  };
}

// ─── Icon mapper (no icons stored in DB) ────────────────────────────────────
function getIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("linkedin"))                          return Linkedin;
  if (n.includes("llm") || n.includes("chat"))        return MessageSquare;
  if (n.includes("mock") || n.includes("interview") && n.includes("guide")) return MessageCircle;
  if (n.includes("ai") || n.includes("machine") || n.includes("deep") || n.includes("neural")) return Brain;
  if (n.includes("vision"))                            return Eye;
  if (n.includes("mern") || n.includes("server") || n.includes("backend") && n.includes("java")) return Server;
  if (n.includes("java"))                              return Coffee;
  if (n.includes("sql") || n.includes("database") || n.includes("data")) return Database;
  if (n.includes("network"))                           return Network;
  if (n.includes("operating") || n.includes(" os "))  return Cpu;
  if (n.includes("system design"))                     return Network;
  if (n.includes("react") || n.includes("next") || n.includes("python") || n.includes("dsa") || n.includes("oops") || n.includes("open source")) return Code2;
  if (n.includes("resume") && (n.includes("builder") || n.includes("ai"))) return FileCode;
  if (n.includes("github") || n.includes("portfolio")) return FileCode;
  if (n.includes("project") || n.includes("idea"))    return Lightbulb;
  if (n.includes("graduate") || n.includes("graduation")) return GraduationCap;
  if (n.includes("marketing"))                         return ShoppingCart;
  if (n.includes("sales"))                             return Target;
  if (n.includes("email") || n.includes("cover"))     return Mail;
  if (n.includes("contact") || n.includes("database")) return ListChecks;
  if (n.includes("tcs") || n.includes("accenture") || n.includes("infosys") || n.includes("wipro")) return Building2;
  if (n.includes("aptitude"))                          return Brain;
  if (n.includes("technical"))                         return Target;
  return FileText;
}

const questionTypes = [
  { type: "Aptitude",            icon: Brain,  tagline: "The exact reasoning and aptitude patterns from their real test — built from actual interview reports." },
  { type: "DSA",                 icon: Code2,  tagline: "The data structure problems this company loves to set. Practice the right way, and walk in ready." },
  { type: "Technical Interview", icon: Target, tagline: "Real technical questions from actual candidates. Know what's coming before you walk in." },
];

// ─── Component ───────────────────────────────────────────────────────────────
interface Session { id: string; session_number: number; week: number; title: string; drive_link: string; description: string; unlocked: boolean; }

const Portal = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentView, setCurrentView]         = useState<ViewType>("recommended");
  const [sessions, setSessions]               = useState<Session[]>([]);
  const [sessionsInfo, setSessionsInfo]       = useState<{ weeks_completed: number; unlocked_count: number; days_enrolled: number } | null>(null);
  const [resourcesData, setResourcesData]     = useState<ResourcesData | null>(null);
  const [showFeedback, setShowFeedback]       = useState(false);
  const [feedbackForm, setFeedbackForm]       = useState({ type: "resource_request", message: "", resource_name: "" });
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [resumeCreds, setResumeCreds]         = useState<{ has_access: boolean; email: string; password: string } | null>(null);
  const [copied, setCopied]                   = useState<"email" | "password" | null>(null);
  interface LeaderboardEntry { rank: number; email: string; score: number; login_days: number; resource_opens: number; is_me: boolean; }
  interface LeaderboardData { week_label: string; leaderboard: LeaderboardEntry[]; my_rank: number | null; my_stats: { email: string; score: number; login_days: number; resource_opens: number } | null; }
  const [leaderboard, setLeaderboard]         = useState<LeaderboardData | null>(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  interface CalendarEntry { label: string; url: string; }
  interface ScheduleData { batch: string | null; calendars: CalendarEntry[]; }
  const [schedule, setSchedule]               = useState<ScheduleData | null>(null);
  const [activeCalendar, setActiveCalendar]   = useState(0);
  interface UpcomingEvent { title: string; description: string; start: string; all_day: boolean; countdown: string; urgency: "now" | "today" | "soon" | "week" | "later"; }
  const [upcomingEvents, setUpcomingEvents]   = useState<UpcomingEvent[]>([]);

  useEffect(() => {
    api.resources.getAll().then((r: unknown) => {
      const res = r as { data: ResourcesData };
      setResourcesData(res.data);
    }).catch(() => {});
  }, []);

  const loadSessions = useCallback(async () => {
    try {
      const r = await api.student.getSessions() as { data: { sessions: Session[]; weeks_completed: number; unlocked_count: number; days_enrolled: number } };
      setSessions(r.data.sessions);
      setSessionsInfo({ weeks_completed: r.data.weeks_completed, unlocked_count: r.data.unlocked_count, days_enrolled: r.data.days_enrolled });
    } catch { /* portal still works without sessions */ }
  }, []);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  useEffect(() => {
    api.student.getResumeEnhancer().then((r: unknown) => {
      const res = r as { data: { has_access: boolean; email: string; password: string } };
      setResumeCreds(res.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    api.student.getUpcomingEvents().then((r: unknown) => {
      const res = r as { data: { events: UpcomingEvent[] } };
      setUpcomingEvents(res.data.events);
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    ["token", "userRole", "userEmail", "userName", "mustChangePassword"].forEach(k => localStorage.removeItem(k));
    toast({ title: "Logged out", description: "You have been logged out successfully" });
    navigate("/login");
  };

  const submitFeedback = async () => {
    if (!feedbackForm.message.trim()) { toast({ title: "Please write a message", variant: "destructive" }); return; }
    setFeedbackLoading(true);
    try {
      await api.student.submitFeedback(feedbackForm);
      toast({ title: "Feedback sent!", description: "We'll review your request." });
      setShowFeedback(false);
      setFeedbackForm({ type: "resource_request", message: "", resource_name: "" });
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
    finally { setFeedbackLoading(false); }
  };

  const track = (resourceName: string) => {
    api.student.track("resource_view", resourceName).catch(() => {});
  };

  const switchView = (view: ViewType) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (view === "leaderboard" && !leaderboard) {
      setLeaderboardLoading(true);
      api.student.getLeaderboard().then((r: unknown) => {
        const res = r as { data: LeaderboardData };
        setLeaderboard(res.data);
      }).catch(() => {}).finally(() => setLeaderboardLoading(false));
    }
    if (view === "schedule" && !schedule) {
      api.student.getSchedule().then((r: unknown) => {
        const res = r as { data: ScheduleData };
        setSchedule(res.data);
        setActiveCalendar(0);
      }).catch(() => {});
    }
  };

  const copyToClipboard = (text: string, type: "email" | "password") => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const formatEventDate = (isoStr: string, allDay: boolean): string => {
    const dt = new Date(isoStr);
    if (allDay) return dt.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" });
    return dt.toLocaleString("en-IN", { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" });
  };

  const urgencyBg = (u: string) => (({ now: "#EF4444", today: "#F97316", soon: Y, week: "#3B82F6", later: "#9CA3AF" } as Record<string, string>)[u] ?? "#9CA3AF");
  const urgencyFg = (u: string) => u === "soon" ? B : W;
  const urgencyLabel = (u: string) => (({ now: "HAPPENING NOW", today: "TODAY", soon: "TOMORROW", week: "THIS WEEK", later: "UPCOMING" } as Record<string, string>)[u] ?? "UPCOMING");

  const extractMeetLink = (desc: string): string | null => {
    const m = desc.match(/https?:\/\/meet\.google\.com\/[\w-]+/);
    return m ? m[0] : null;
  };
  const cleanDescription = (desc: string): string =>
    desc
      .replace(/Join with Google Meet:?\s*https?:\/\/meet\.google\.com\/[\w-]+/gi, "")
      .replace(/Learn more about Meet at:?\s*https?:\/\/\S+/gi, "")
      .replace(/https?:\/\/meet\.google\.com\/[\w-]+/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();

  const tabs: { view: ViewType; label: string; icon: typeof Star; count: string }[] = [
    { view: "recommended", label: "Recommended", icon: Star,          count: `${resourcesData?.recommended.length ?? "—"}` },
    { view: "training",    label: "Training",    icon: GraduationCap, count: `${resourcesData ? resourcesData.training.reduce((a, c) => a + c.resources.length, 0) : "—"}` },
    { view: "placement",   label: "Placement",   icon: Building2,     count: `${resourcesData ? resourcesData.placement.service.length + resourcesData.placement.product.length : "—"}` },
    { view: "sessions",    label: "Sessions",    icon: PlayCircle,    count: "11" },
    ...(resumeCreds?.has_access ? [{ view: "resume" as ViewType, label: "Resume AI", icon: Sparkles, count: "✦" }] : []),
    { view: "leaderboard" as ViewType, label: "Leaderboard", icon: Trophy, count: "🏆" },
    { view: "schedule" as ViewType, label: "Schedule", icon: CalendarDays, count: "📅" },
  ];

  const cardHover = (e: React.MouseEvent<HTMLDivElement>, enter: boolean) => {
    const el = e.currentTarget as HTMLDivElement;
    el.style.borderColor = enter ? B     : BORD;
    el.style.transform   = enter ? "translateY(-3px)" : "translateY(0)";
    el.style.boxShadow   = enter ? `4px 4px 0 ${B}` : "0 1px 6px rgba(0,0,0,0.06)";
  };

  const card: React.CSSProperties = {
    backgroundColor: SURF,
    border: `2px solid ${BORD}`,
    borderRadius: "10px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, color: B, ...MONO }}>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: W, borderBottom: `2px solid ${BORD}` }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", flexShrink: 0 }} onClick={() => navigate("/")}>
            <img src="/upstride-logo.png" alt="Upstride" style={{ height: "28px", objectFit: "contain" }} />
            {!isMobile && <span style={{ fontSize: "16px", fontWeight: 700, color: B, letterSpacing: "0.05em" }}>UPSTRIDE</span>}
            <span style={{ fontSize: "10px", backgroundColor: Y, color: B, padding: "2px 8px", borderRadius: "3px", fontWeight: 700, letterSpacing: "0.12em", border: `1px solid ${B}` }}>
              PORTAL
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button onClick={() => navigate("/workspace")}
              style={{ display: "flex", alignItems: "center", gap: "6px", color: B, background: Y, border: `2px solid ${B}`, borderRadius: "6px", padding: isMobile ? "8px" : "7px 14px", cursor: "pointer", fontSize: "12px", fontWeight: 700, ...MONO }}>
              <CheckSquare size={14} />
              {!isMobile && "My Workspace"}
            </button>
            <button onClick={() => setShowFeedback(true)}
              style={{ display: "flex", alignItems: "center", gap: "6px", color: MUTE, background: "none", border: `2px solid ${BORD}`, borderRadius: "6px", padding: isMobile ? "8px" : "7px 14px", cursor: "pointer", fontSize: "12px", ...MONO }}>
              <MessageSquare size={14} />
              {!isMobile && "Request Resource"}
            </button>
            <button onClick={handleLogout}
              style={{ display: "flex", alignItems: "center", gap: "6px", color: MUTE, background: "none", border: `2px solid ${BORD}`, borderRadius: "6px", padding: isMobile ? "8px" : "7px 14px", cursor: "pointer", fontSize: "12px", ...MONO, transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#EF4444"; (e.currentTarget as HTMLButtonElement).style.color = "#EF4444"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = BORD; (e.currentTarget as HTMLButtonElement).style.color = MUTE; }}>
              <LogOut size={14} />
              {!isMobile && "Sign Out"}
            </button>
          </div>
        </div>
      </header>

      {/* ── TAB BAR ─────────────────────────────────────────────────────── */}
      <div style={{ position: "fixed", top: "60px", left: 0, right: 0, zIndex: 99, backgroundColor: W, borderBottom: `2px solid ${BORD}` }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 8px", display: "flex", gap: "0", overflowX: "auto", scrollbarWidth: "none" }}>
          {tabs.map(({ view, label, icon: Icon, count }) => (
            <button
              key={view}
              onClick={() => switchView(view)}
              style={{
                display: "flex", alignItems: "center", gap: isMobile ? "5px" : "8px",
                padding: isMobile ? "12px 10px" : "14px 20px",
                fontSize: isMobile ? "11px" : "12px", fontWeight: 600, letterSpacing: "0.05em",
                ...MONO,
                background: "none", border: "none", cursor: "pointer",
                color: currentView === view ? B : MUTE,
                borderBottom: `3px solid ${currentView === view ? Y : "transparent"}`,
                transition: "all 0.15s",
                whiteSpace: "nowrap" as const,
                flex: isMobile ? "1 1 0" : undefined,
                justifyContent: isMobile ? "center" : undefined,
              }}
              onMouseEnter={e => { if (currentView !== view) (e.currentTarget as HTMLButtonElement).style.color = B; }}
              onMouseLeave={e => { if (currentView !== view) (e.currentTarget as HTMLButtonElement).style.color = MUTE; }}
            >
              <Icon size={15} />
              {label}
              {!isMobile && (
                <span style={{ backgroundColor: currentView === view ? Y : `${B}10`, color: B, borderRadius: "4px", padding: "1px 7px", fontSize: "10px", fontWeight: 700, border: `1px solid ${currentView === view ? B : BORD}` }}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: `${isMobile ? "112px" : "120px"} ${isMobile ? "12px" : "24px"} 60px` }}>

        {/* ══ RECOMMENDED ════════════════════════════════════════════════ */}
        {currentView === "recommended" && (
          <div>

            {/* ── UPCOMING EVENTS ─────────────────────────────────────── */}
            {upcomingEvents.length > 0 && (
              <>
                <style>{`
                  @keyframes up-slide { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
                  @keyframes up-scan { 0%{top:-80px;opacity:.07} 100%{top:110%;opacity:0} }
                  @keyframes up-blink { 0%,100%{opacity:1} 50%{opacity:.15} }
                  @keyframes up-pulse { 0%{box-shadow:0 0 0 0 rgba(255,229,0,.5)} 70%{box-shadow:0 0 0 14px rgba(255,229,0,0)} 100%{box-shadow:0 0 0 0 rgba(255,229,0,0)} }
                `}</style>

                <div style={{ marginBottom: "48px", animation: "up-slide .45s cubic-bezier(.22,1,.36,1) both" }}>

                  {/* ── Hero card ───────────────────────────── */}
                  <div style={{ position: "relative", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr auto", background: B, border: `2px solid ${Y}`, overflow: "hidden", marginBottom: "8px" }}>

                    {/* dot-grid texture */}
                    <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${Y}18 1.2px, transparent 1.2px)`, backgroundSize: "22px 22px", pointerEvents: "none" }} />

                    {/* scan-line sweep */}
                    <div style={{ position: "absolute", left: 0, right: 0, height: "70px", background: `linear-gradient(transparent, ${Y}09, transparent)`, animation: "up-scan 4s linear infinite", pointerEvents: "none" }} />

                    {/* left: event info */}
                    <div style={{ padding: isMobile ? "22px 18px" : "32px 36px", position: "relative", zIndex: 1 }}>

                      {/* status bar */}
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
                        <div style={{
                          width: "9px", height: "9px", borderRadius: "50%",
                          background: urgencyBg(upcomingEvents[0].urgency),
                          animation: ["now","today"].includes(upcomingEvents[0].urgency) ? "up-blink 1.1s ease-in-out infinite" : "none",
                          flexShrink: 0,
                        }} />
                        <span style={{ fontSize: "9px", color: urgencyBg(upcomingEvents[0].urgency), fontWeight: 700, letterSpacing: "0.18em" }}>
                          {urgencyLabel(upcomingEvents[0].urgency)}
                        </span>
                        <div style={{ flex: 1, height: "1px", background: `${Y}18` }} />
                        <span style={{ fontSize: "9px", color: "#ffffff25", letterSpacing: "0.1em" }}>SESSION BRIEF</span>
                      </div>

                      {/* title */}
                      <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: isMobile ? "clamp(28px, 8vw, 44px)" : "clamp(36px, 4vw, 58px)", color: W, lineHeight: .95, letterSpacing: "0.02em", marginBottom: "18px", maxWidth: "560px" }}>
                        {upcomingEvents[0].title}
                      </h2>

                      {/* date */}
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#ffffff0d", border: "1px solid #ffffff14", padding: "6px 12px" }}>
                        <CalendarDays size={12} color={Y} />
                        <span style={{ fontSize: "11px", color: "#ffffff80", letterSpacing: "0.06em" }}>
                          {formatEventDate(upcomingEvents[0].start, upcomingEvents[0].all_day)}
                        </span>
                      </div>

                      {upcomingEvents[0].description && (() => {
                        const meetLink = extractMeetLink(upcomingEvents[0].description);
                        const cleanDesc = cleanDescription(upcomingEvents[0].description);
                        return (
                          <>
                            {cleanDesc && (
                              <p style={{ fontSize: "13px", color: "#ffffffa0", marginTop: "16px", lineHeight: 1.75, maxWidth: "480px" }}>
                                {cleanDesc.slice(0, 220)}
                              </p>
                            )}
                            {meetLink && (
                              <a
                                href={meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: "inline-flex", alignItems: "center", gap: "10px",
                                  marginTop: "22px",
                                  background: Y, color: B,
                                  padding: "14px 28px",
                                  fontSize: "14px", fontWeight: 700, letterSpacing: "0.1em",
                                  textDecoration: "none",
                                  border: `2px solid ${Y}`,
                                  fontFamily: "'IBM Plex Mono', monospace",
                                  transition: "all 0.15s",
                                }}
                                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = W; (e.currentTarget as HTMLAnchorElement).style.borderColor = W; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = Y; (e.currentTarget as HTMLAnchorElement).style.borderColor = Y; }}
                              >
                                <span style={{ fontSize: "16px" }}>🎥</span>
                                JOIN SESSION
                                <span style={{ fontSize: "18px", lineHeight: 1 }}>→</span>
                              </a>
                            )}
                          </>
                        );
                      })()}
                    </div>

                    {/* right: countdown block */}
                    <div style={{
                      background: urgencyBg(upcomingEvents[0].urgency),
                      minWidth: isMobile ? "auto" : "176px",
                      padding: isMobile ? "16px 18px" : "0 40px",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      gap: "4px",
                      animation: ["now","today"].includes(upcomingEvents[0].urgency) ? "up-pulse 2.2s ease-out infinite" : "none",
                      position: "relative", zIndex: 1,
                    }}>
                      <div style={{ fontSize: "9px", color: urgencyFg(upcomingEvents[0].urgency), opacity: .65, letterSpacing: "0.16em", marginBottom: "4px" }}>STARTS</div>
                      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: isMobile ? "52px" : "76px", color: urgencyFg(upcomingEvents[0].urgency), lineHeight: 1, letterSpacing: "0.02em", textAlign: "center" }}>
                        {upcomingEvents[0].countdown}
                      </div>
                      <div style={{ fontSize: "8px", color: urgencyFg(upcomingEvents[0].urgency), opacity: .55, letterSpacing: "0.14em" }}>FROM NOW</div>
                    </div>
                  </div>

                  {/* ── Queue strip ─────────────────────────── */}
                  {upcomingEvents.slice(1, 4).length > 0 && (
                    <div style={{ display: "flex", gap: "0", alignItems: "stretch" }}>

                      {/* vertical label */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 10px", background: B, border: `2px solid ${Y}`, borderRight: "none", flexShrink: 0 }}>
                        <span style={{ fontSize: "8px", color: Y, letterSpacing: "0.2em", fontWeight: 700, writingMode: "vertical-rl" as const, transform: "rotate(180deg)" }}>NEXT UP</span>
                      </div>

                      {/* event chips */}
                      <div style={{ flex: 1, display: "flex", gap: "2px", flexWrap: isMobile ? "wrap" : "nowrap" }}>
                        {upcomingEvents.slice(1, 4).map((evt, i) => (
                          <div key={i} style={{ flex: "1 1 150px", display: "flex", alignItems: "stretch", border: `2px solid ${BORD}`, borderLeft: `4px solid ${urgencyBg(evt.urgency)}`, background: W, overflow: "hidden" }}>
                            <div style={{ flex: 1, padding: "10px 14px" }}>
                              <div style={{ fontSize: "11px", fontWeight: 700, color: B, marginBottom: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{evt.title}</div>
                              <div style={{ fontSize: "10px", color: MUTE }}>{evt.countdown}</div>
                            </div>
                            <div style={{ background: urgencyBg(evt.urgency), width: "28px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <span style={{ fontSize: "7px", fontWeight: 700, color: urgencyFg(evt.urgency), letterSpacing: "0.12em", writingMode: "vertical-rl" as const, transform: "rotate(180deg)", opacity: .85 }}>
                                {evt.urgency.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            <div style={{ marginBottom: "36px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: Y, color: B, border: `2px solid ${B}`, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "16px" }}>
                <Flame size={13} /> HANDPICKED FOR MAXIMUM IMPACT
              </div>
              <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.02em" }}>
                Start Here.
              </h1>
              <p style={{ fontSize: "14px", color: MUTE, maxWidth: "480px", lineHeight: 1.7 }}>
                These 9 resources have the highest impact-to-effort ratio. Open one right now.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
              {(resourcesData?.recommended ?? []).map((doc) => {
                const DocIcon = getIcon(doc.name);
                return (
                  <div key={doc.id} style={card} onClick={() => { track(doc.name); window.open(doc.url, "_blank"); }} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
                    <div style={{ padding: "20px 20px 14px", borderBottom: `1px solid ${BORD}` }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: Y, border: `2px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <DocIcon size={17} color={B} />
                        </div>
                        {doc.badge_label && (
                          <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", padding: "3px 8px", backgroundColor: doc.badge_accent ? B : `${B}10`, color: doc.badge_accent ? Y : MUTE, border: `1px solid ${doc.badge_accent ? B : BORD}` }}>
                            {doc.badge_label}
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: "15px", fontWeight: 700, color: B, lineHeight: 1.3 }}>{doc.name}</h3>
                    </div>
                    <div style={{ padding: "14px 20px" }}>
                      <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, marginBottom: "14px" }}>{doc.tagline}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", color: B, fontSize: "12px", fontWeight: 700 }}>
                        Open & Study <ArrowUpRight size={14} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══ TRAINING ═══════════════════════════════════════════════════ */}
        {currentView === "training" && (
          <div>
            <div style={{ marginBottom: "36px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: Y, color: B, border: `2px solid ${B}`, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "16px" }}>
                <Zap size={13} /> COMPLETE LEARNING ARSENAL
              </div>
              <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.02em" }}>
                Your Arsenal.
              </h1>
              <p style={{ fontSize: "14px", color: MUTE, maxWidth: "500px", lineHeight: 1.7 }}>
                Every resource from day one to offer letter. Organized. Curated. Waiting.
              </p>
            </div>

            {(resourcesData?.training ?? []).map((cat, catIdx) => {
              const CatIcon = getIcon(cat.category);
              return (
                <div key={catIdx} style={{ marginBottom: "44px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px", backgroundColor: W, border: `2px solid ${B}`, borderLeft: `5px solid ${Y}`, marginBottom: "14px", boxShadow: `3px 3px 0 ${B}` }}>
                    <div style={{ width: "32px", height: "32px", backgroundColor: Y, border: `2px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <CatIcon size={16} color={B} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: "15px", fontWeight: 700, color: B, marginBottom: "2px" }}>{cat.category}</h2>
                    </div>
                    <span style={{ marginLeft: "auto", fontSize: "11px", color: MUTE, backgroundColor: BG, border: `1px solid ${BORD}`, borderRadius: "4px", padding: "3px 10px", flexShrink: 0 }}>
                      {cat.resources.length} resources
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
                    {cat.resources.map((res) => {
                      const ResIcon = getIcon(res.name);
                      return (
                        <div key={res.id} style={card} onClick={() => { track(res.name); window.open(res.url, "_blank"); }} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
                          <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${BORD}`, display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "30px", height: "30px", backgroundColor: Y, border: `2px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <ResIcon size={14} color={B} />
                            </div>
                            <h3 style={{ fontSize: "13px", fontWeight: 700, color: B, lineHeight: 1.3 }}>{res.name}</h3>
                          </div>
                          <div style={{ padding: "12px 16px" }}>
                            <p style={{ fontSize: "11px", color: MUTE, lineHeight: 1.7, marginBottom: "12px" }}>{res.tagline}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px", color: B, fontSize: "11px", fontWeight: 700 }}>
                              Access Resource <ArrowUpRight size={13} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ PLACEMENT ══════════════════════════════════════════════════ */}
        {currentView === "placement" && (
          <div>
            <div style={{ marginBottom: "36px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: Y, color: B, border: `2px solid ${B}`, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "16px" }}>
                <Trophy size={13} /> COMPANY-SPECIFIC PREPARATION
              </div>
              <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.02em" }}>
                Know Before You Walk In.
              </h1>
              <p style={{ fontSize: "14px", color: MUTE, maxWidth: "500px", lineHeight: 1.7 }}>
                17 companies. Their actual questions. Your unfair advantage — use it.
              </p>
            </div>

            {/* Service-based — one section per company, same style as training */}
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px", backgroundColor: W, border: `2px solid ${B}`, borderLeft: `5px solid ${Y}`, marginBottom: "28px", boxShadow: `3px 3px 0 ${B}` }}>
                <div style={{ width: "32px", height: "32px", backgroundColor: Y, border: `2px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Building2 size={16} color={B} />
                </div>
                <div>
                  <h2 style={{ fontSize: "15px", fontWeight: 700, color: B, marginBottom: "2px" }}>Service-Based IT Companies</h2>
                  <p style={{ fontSize: "12px", color: MUTE }}>Aptitude, DSA & technical questions from real interview reports</p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: "11px", color: MUTE, backgroundColor: BG, border: `1px solid ${BORD}`, borderRadius: "4px", padding: "3px 10px", flexShrink: 0 }}>
                  {resourcesData?.placement.service.length ?? 0} companies
                </span>
              </div>

              {(resourcesData?.placement.service ?? []).map((group) => (
                <div key={group.company} style={{ marginBottom: "36px" }}>
                  {/* Company header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 18px", backgroundColor: `${B}06`, border: `1px solid ${BORD}`, borderLeft: `4px solid ${B}`, marginBottom: "12px" }}>
                    <span style={{ fontSize: "18px" }}>🏢</span>
                    <h3 style={{ fontSize: "14px", fontWeight: 700, color: B }}>{group.company}</h3>
                    <span style={{ marginLeft: "auto", fontSize: "10px", color: MUTE, backgroundColor: W, border: `1px solid ${BORD}`, borderRadius: "4px", padding: "2px 8px", flexShrink: 0 }}>
                      {group.resources.length} resources
                    </span>
                  </div>

                  {/* Question type cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
                    {questionTypes.map((qt) => {
                      const res = group.resources.find(r => r.sub_type === qt.type);
                      if (!res?.url) return null;
                      return (
                        <div
                          key={qt.type}
                          style={card}
                          onClick={() => { track(qt.type); window.open(res.url, "_blank"); }}
                          onMouseEnter={e => cardHover(e, true)}
                          onMouseLeave={e => cardHover(e, false)}
                        >
                          <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${BORD}`, display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "30px", height: "30px", backgroundColor: Y, border: `2px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <qt.icon size={14} color={B} />
                            </div>
                            <h3 style={{ fontSize: "13px", fontWeight: 700, color: B, lineHeight: 1.3 }}>{qt.type}</h3>
                          </div>
                          <div style={{ padding: "12px 16px" }}>
                            <p style={{ fontSize: "11px", color: MUTE, lineHeight: 1.7, marginBottom: "12px" }}>{qt.tagline}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "5px", color: B, fontSize: "11px", fontWeight: 700 }}>
                              View Questions <ArrowUpRight size={13} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Product companies — same card style as training */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px", backgroundColor: W, border: `2px solid ${B}`, borderLeft: `5px solid ${Y}`, marginBottom: "14px", boxShadow: `3px 3px 0 ${B}` }}>
                <div style={{ width: "32px", height: "32px", backgroundColor: Y, border: `2px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={16} color={B} />
                </div>
                <div>
                  <h2 style={{ fontSize: "15px", fontWeight: 700, color: B, marginBottom: "2px" }}>Product & Startup Companies</h2>
                  <p style={{ fontSize: "12px", color: MUTE }}>These companies pay 2–3× market average. One focused prep can change your trajectory.</p>
                </div>
                <span style={{ marginLeft: "auto", fontSize: "11px", color: MUTE, backgroundColor: BG, border: `1px solid ${BORD}`, borderRadius: "4px", padding: "3px 10px", flexShrink: 0 }}>
                  {resourcesData?.placement.product.length ?? 0} companies
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
                {(resourcesData?.placement.product ?? []).filter(c => c.url).map((company) => (
                  <div
                    key={company.id}
                    style={card}
                    onClick={() => { track(company.name); window.open(company.url, "_blank"); }}
                    onMouseEnter={e => cardHover(e, true)}
                    onMouseLeave={e => cardHover(e, false)}
                  >
                    <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${BORD}`, display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "30px", height: "30px", backgroundColor: Y, border: `2px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "16px" }}>
                        {company.emoji ?? "🚀"}
                      </div>
                      <h3 style={{ fontSize: "13px", fontWeight: 700, color: B, lineHeight: 1.3 }}>{company.name}</h3>
                    </div>
                    <div style={{ padding: "12px 16px" }}>
                      <p style={{ fontSize: "11px", color: MUTE, lineHeight: 1.7, marginBottom: "12px" }}>{company.tagline}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", color: B, fontSize: "11px", fontWeight: 700 }}>
                        View Resources <ArrowUpRight size={13} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SESSIONS VIEW ──────────────────────────────────────────── */}
        {currentView === "sessions" && (
          <div style={{ maxWidth: "860px", margin: "0 auto", padding: isMobile ? "8px 0" : "32px 24px" }}>
            {sessionsInfo && (
              <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
                <div style={{ backgroundColor: Y, border: `2px solid ${B}`, borderRadius: "8px", padding: "12px 20px" }}>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: B }}>{sessionsInfo.days_enrolled}</div>
                  <div style={{ fontSize: "10px", color: B, letterSpacing: "0.1em" }}>DAYS ENROLLED</div>
                </div>
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "8px", padding: "12px 20px" }}>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: B }}>Week {sessionsInfo.weeks_completed}</div>
                  <div style={{ fontSize: "10px", color: MUTE, letterSpacing: "0.1em" }}>CURRENT WEEK</div>
                </div>
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "8px", padding: "12px 20px" }}>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: "#16A34A" }}>{sessionsInfo.unlocked_count} / 11</div>
                  <div style={{ fontSize: "10px", color: MUTE, letterSpacing: "0.1em" }}>SESSIONS UNLOCKED</div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {sessions.map(s => (
                <div key={s.id} style={{
                  backgroundColor: W,
                  border: `2px solid ${s.unlocked ? BORD : BORD}`,
                  borderLeft: `4px solid ${s.unlocked ? Y : BORD}`,
                  borderRadius: "10px",
                  padding: isMobile ? "14px 12px" : "18px 20px",
                  display: "flex",
                  flexDirection: isMobile ? "column" as const : "row" as const,
                  alignItems: isMobile ? "flex-start" : "center",
                  gap: isMobile ? "10px" : "16px",
                  opacity: s.unlocked ? 1 : 0.6,
                }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: s.unlocked ? B : `${B}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {s.unlocked ? <PlayCircle size={18} color={Y} /> : <Lock size={16} color={MUTE} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: MUTE, letterSpacing: "0.1em" }}>SESSION {s.session_number} · WEEK {s.week}</span>
                      {s.unlocked && <span style={{ fontSize: "9px", backgroundColor: "#DCFCE7", color: "#16A34A", padding: "1px 6px", borderRadius: "4px", fontWeight: 700 }}>UNLOCKED</span>}
                      {!s.unlocked && <span style={{ fontSize: "9px", backgroundColor: "#F3F4F6", color: MUTE, padding: "1px 6px", borderRadius: "4px", fontWeight: 700 }}>LOCKED</span>}
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: B }}>{s.title}</div>
                    {s.description && <div style={{ fontSize: "12px", color: MUTE, marginTop: "2px" }}>{s.description}</div>}
                  </div>
                  {s.unlocked && s.drive_link ? (
                    <a href={s.drive_link} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", backgroundColor: B, color: Y, borderRadius: "6px", fontSize: "11px", fontWeight: 700, textDecoration: "none", flexShrink: 0, ...MONO }}>
                      <PlayCircle size={13} /> WATCH
                    </a>
                  ) : s.unlocked ? (
                    <span style={{ fontSize: "11px", color: MUTE, padding: "8px 14px", border: `1px solid ${BORD}`, borderRadius: "6px" }}>Recording soon</span>
                  ) : (
                    <span style={{ fontSize: "11px", color: MUTE }}>Unlocks Week {s.week}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RESUME ENHANCER VIEW ────────────────────────────────────── */}
        {currentView === "resume" && resumeCreds?.has_access && (
          <div style={{ maxWidth: "680px", margin: "0 auto", padding: isMobile ? "20px 0" : "40px 24px" }}>
            {/* Hero card */}
            <div style={{ background: B, borderRadius: "12px", padding: "32px", marginBottom: "20px", border: `3px solid ${Y}`, boxShadow: `4px 4px 0 ${Y}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{ background: Y, borderRadius: "8px", padding: "10px", display: "flex", alignItems: "center" }}>
                  <Sparkles size={22} color={B} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: "#fff", letterSpacing: "0.04em", lineHeight: 1 }}>RESUME ENHANCER</div>
                  <div style={{ fontSize: "11px", color: "#ffffff80", marginTop: "3px" }}>AI-powered resume builder — exclusive access</div>
                </div>
              </div>

              <p style={{ fontSize: "13px", color: "#ffffffcc", lineHeight: 1.7, marginBottom: "28px" }}>
                Use these credentials to log in to the Resume Enhancer platform. Build an ATS-optimised resume, get AI feedback, and stand out from the crowd.
              </p>

              {/* Credentials */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
                {/* Email */}
                <div style={{ background: "#ffffff10", border: "1px solid #ffffff20", borderRadius: "8px", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                  <div>
                    <div style={{ fontSize: "10px", color: "#ffffff60", letterSpacing: "0.1em", marginBottom: "4px" }}>LOGIN EMAIL</div>
                    <div style={{ fontSize: "14px", color: "#fff", fontWeight: 600, ...MONO }}>{resumeCreds.email}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(resumeCreds.email, "email")}
                    style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", background: copied === "email" ? "#16A34A" : Y, border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 700, color: B, cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s", ...MONO }}
                  >
                    {copied === "email" ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>

                {/* Password */}
                <div style={{ background: "#ffffff10", border: "1px solid #ffffff20", borderRadius: "8px", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                  <div>
                    <div style={{ fontSize: "10px", color: "#ffffff60", letterSpacing: "0.1em", marginBottom: "4px" }}>PASSWORD</div>
                    <div style={{ fontSize: "14px", color: "#fff", fontWeight: 600, ...MONO }}>{resumeCreds.password}</div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(resumeCreds.password, "password")}
                    style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", background: copied === "password" ? "#16A34A" : Y, border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 700, color: B, cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s", ...MONO }}
                  >
                    {copied === "password" ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
              </div>

              {/* CTA */}
              <a
                href="https://upstride-students-portal-frontend.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "14px 28px", background: Y, color: B, borderRadius: "8px", textDecoration: "none", fontWeight: 700, fontSize: "14px", letterSpacing: "0.08em", ...MONO }}
              >
                <Sparkles size={16} /> OPEN RESUME ENHANCER →
              </a>
            </div>

            {/* Tips */}
            <div style={{ background: W, border: `2px solid ${BORD}`, borderRadius: "10px", padding: "20px 22px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: B, letterSpacing: "0.1em", marginBottom: "12px" }}>💡 HOW TO USE IT</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  "Copy the email and password above",
                  "Click 'Open Resume Enhancer' to go to the platform",
                  "Log in using the credentials shown",
                  "Upload your resume and let AI enhance it",
                  "Download your ATS-optimised version",
                ].map((tip, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{ minWidth: "20px", height: "20px", background: Y, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: B, flexShrink: 0 }}>{i + 1}</div>
                    <div style={{ fontSize: "12px", color: MUTE, lineHeight: 1.6 }}>{tip}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── LEADERBOARD VIEW ─────────────────────────────────────────── */}
        {currentView === "leaderboard" && (
          <div style={{ maxWidth: "700px", margin: "0 auto", padding: isMobile ? "16px 0" : "32px 24px" }}>

            {/* Header */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: isMobile ? "40px" : "56px", color: B, lineHeight: 0.9, letterSpacing: "0.02em", textAlign: "center" }}>
                WEEKLY<br /><span style={{ borderBottom: `4px solid ${Y}` }}>LEADERBOARD</span>
              </div>

              {/* Week pill + scoring chips */}
              <div style={{ marginTop: "18px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                {leaderboard && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: B, color: W, borderRadius: "999px", padding: "5px 14px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em" }}>
                    <span style={{ opacity: 0.6 }}>📅</span>
                    {leaderboard.week_label}
                    <span style={{ opacity: 0.4, margin: "0 2px" }}>·</span>
                    <span style={{ opacity: 0.6 }}>resets Monday</span>
                  </div>
                )}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", background: `${Y}30`, border: `1.5px solid ${Y}`, borderRadius: "8px", padding: "6px 14px" }}>
                    <span style={{ fontSize: "14px" }}>🔑</span>
                    <span style={{ fontSize: "11px", color: B, fontWeight: 600 }}>Login day</span>
                    <span style={{ fontSize: "13px", fontWeight: 800, color: B, fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>+3 pts</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", background: `${B}08`, border: `1.5px solid ${BORD}`, borderRadius: "8px", padding: "6px 14px" }}>
                    <span style={{ fontSize: "14px" }}>📚</span>
                    <span style={{ fontSize: "11px", color: B, fontWeight: 600 }}>Resource open</span>
                    <span style={{ fontSize: "13px", fontWeight: 800, color: B, fontFamily: "'Bebas Neue', cursive", letterSpacing: "0.05em" }}>+1 pt</span>
                  </div>
                </div>
              </div>
            </div>

            {leaderboardLoading ? (
              <div style={{ textAlign: "center", padding: "60px", color: MUTE }}>Loading leaderboard...</div>
            ) : !leaderboard || leaderboard.leaderboard.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 24px", border: `2px solid ${BORD}`, borderRadius: "12px", background: W }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>🏁</div>
                <div style={{ fontWeight: 700, color: B, marginBottom: "6px" }}>No activity yet this week</div>
                <div style={{ fontSize: "12px", color: MUTE }}>Open resources to earn points and appear here!</div>
              </div>
            ) : (
              <>
                {/* Top 3 podium */}
                {leaderboard.leaderboard.length >= 1 && (
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "8px", marginBottom: "24px" }}>
                    {[1, 0, 2].map(idx => {
                      const entry = leaderboard.leaderboard[idx];
                      if (!entry) return null;
                      const podiumH = idx === 0 ? "100px" : idx === 1 ? "130px" : "80px";
                      const medals = ["🥇", "🥈", "🥉"];
                      const medal = medals[idx === 0 ? 1 : idx === 1 ? 0 : 2];
                      const rank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
                      const bg = rank === 1 ? Y : rank === 2 ? "#e8e8e8" : "#f0d9c0";
                      return (
                        <div key={entry.rank} style={{ flex: 1, maxWidth: "200px", textAlign: "center" }}>
                          <div style={{ fontSize: "11px", color: entry.is_me ? "#7C3AED" : MUTE, fontWeight: entry.is_me ? 700 : 400, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {entry.is_me ? "👤 YOU" : entry.email.split("@")[0]}
                          </div>
                          <div style={{ fontSize: "18px", fontWeight: 700, color: B, marginBottom: "6px" }}>{entry.score} pts</div>
                          <div style={{ height: podiumH, background: bg, border: `2px solid ${B}`, borderRadius: "6px 6px 0 0", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "4px" }}>
                            <div style={{ fontSize: "28px" }}>{medal}</div>
                            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: B }}>#{rank}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Full list */}
                <div style={{ background: W, border: `2px solid ${BORD}`, borderRadius: "10px", overflow: "hidden" }}>
                  {leaderboard.leaderboard.map((entry, i) => {
                    const rankEmoji = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${entry.rank}`;
                    return (
                      <div key={entry.rank} style={{
                        display: "flex", alignItems: "center", gap: "14px", padding: "13px 18px",
                        borderBottom: i < leaderboard.leaderboard.length - 1 ? `1px solid ${BORD}` : "none",
                        background: entry.is_me ? `${Y}30` : i % 2 === 0 ? W : `${B}02`,
                      }}>
                        <div style={{ minWidth: "32px", textAlign: "center", fontFamily: "'Bebas Neue', cursive", fontSize: i < 3 ? "20px" : "15px", color: B }}>
                          {rankEmoji}
                        </div>
                        <div style={{ flex: 1, overflow: "hidden" }}>
                          <div style={{ fontSize: "13px", fontWeight: entry.is_me ? 700 : 600, color: entry.is_me ? "#7C3AED" : B, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {entry.email} {entry.is_me && <span style={{ fontSize: "10px", background: "#7C3AED", color: W, padding: "1px 6px", borderRadius: "8px", marginLeft: "4px" }}>YOU</span>}
                          </div>
                          <div style={{ display: "flex", gap: "12px", marginTop: "3px" }}>
                            <span style={{ fontSize: "10px", color: MUTE }}>🔑 {entry.login_days} login day{entry.login_days !== 1 ? "s" : ""}</span>
                            <span style={{ fontSize: "10px", color: MUTE }}>📚 {entry.resource_opens} resource{entry.resource_opens !== 1 ? "s" : ""}</span>
                          </div>
                        </div>
                        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: B, minWidth: "60px", textAlign: "right" }}>
                          {entry.score} <span style={{ fontSize: "11px", fontWeight: 400, color: MUTE }}>pts</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* My stats if not in top 20 */}
                {leaderboard.my_rank === null && leaderboard.my_stats && (
                  <div style={{ marginTop: "16px", padding: "14px 18px", background: `${Y}20`, border: `2px solid ${Y}`, borderRadius: "10px", display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ fontSize: "20px" }}>👤</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: B }}>YOUR STATS THIS WEEK</div>
                      <div style={{ fontSize: "11px", color: MUTE, marginTop: "2px" }}>
                        🔑 {leaderboard.my_stats.login_days} login days &nbsp;·&nbsp; 📚 {leaderboard.my_stats.resource_opens} resource opens
                      </div>
                    </div>
                    <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: B }}>{leaderboard.my_stats.score} pts</div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── SCHEDULE VIEW ────────────────────────────────────────────── */}
        {currentView === "schedule" && (
          <div style={{ maxWidth: "900px", margin: "0 auto", padding: isMobile ? "16px 0" : "32px 24px" }}>
            {/* Header */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: isMobile ? "36px" : "52px", color: B, lineHeight: 0.9, letterSpacing: "0.02em" }}>
                YOUR<br /><span style={{ borderBottom: `4px solid ${Y}` }}>SCHEDULE</span>
              </div>
              {schedule?.batch && (
                <div style={{ marginTop: "10px", display: "inline-flex", alignItems: "center", gap: "6px", background: B, color: W, borderRadius: "999px", padding: "5px 14px", fontSize: "11px", fontWeight: 600 }}>
                  <CalendarDays size={12} /> {schedule.batch}
                </div>
              )}
            </div>

            {!schedule ? (
              <div style={{ textAlign: "center", padding: "60px", color: MUTE }}>Loading...</div>
            ) : schedule.calendars.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 24px", border: `2px dashed ${BORD}`, borderRadius: "12px" }}>
                <CalendarDays size={36} style={{ marginBottom: "12px", opacity: 0.3 }} />
                <div style={{ fontWeight: 700, color: B, marginBottom: "6px" }}>No schedule set up yet</div>
                <div style={{ fontSize: "12px", color: MUTE }}>Your admin will add your batch calendar soon.</div>
              </div>
            ) : (
              <>
                {/* Calendar selector tabs */}
                {schedule.calendars.length > 1 && (
                  <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                    {schedule.calendars.map((cal, i) => (
                      <button key={i} onClick={() => setActiveCalendar(i)}
                        style={{ padding: "8px 18px", borderRadius: "8px", border: `2px solid ${activeCalendar === i ? B : BORD}`, background: activeCalendar === i ? B : W, color: activeCalendar === i ? Y : B, fontSize: "12px", fontWeight: 700, cursor: "pointer", ...MONO, transition: "all 0.15s" }}>
                        📅 {cal.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Calendar iframe */}
                <div style={{ background: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", boxShadow: `4px 4px 0 ${Y}` }}>
                  <div style={{ background: B, padding: "12px 18px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <CalendarDays size={16} color={Y} />
                    <span style={{ color: W, fontSize: "13px", fontWeight: 700, letterSpacing: "0.06em", ...MONO }}>
                      {schedule.calendars[activeCalendar]?.label?.toUpperCase()}
                    </span>
                  </div>
                  <iframe
                    src={schedule.calendars[activeCalendar]?.url}
                    style={{ width: "100%", height: isMobile ? "500px" : "680px", border: "none", display: "block" }}
                    title={schedule.calendars[activeCalendar]?.label}
                  />
                </div>

                <p style={{ fontSize: "11px", color: MUTE, marginTop: "10px", textAlign: "center" }}>
                  Events are managed by your admin. Add to your own calendar by clicking any event inside the calendar above.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── FEEDBACK MODAL ──────────────────────────────────────────────── */}
      {showFeedback && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px" }}>
          <div style={{ backgroundColor: W, border: `2px solid ${B}`, borderRadius: "12px", padding: "32px", width: "100%", maxWidth: "460px", boxShadow: `6px 6px 0 ${Y}`, ...MONO }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: B }}>Request a Resource</h3>
              <button onClick={() => setShowFeedback(false)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTE }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.1em", marginBottom: "6px" }}>TYPE</label>
                <select value={feedbackForm.type} onChange={e => setFeedbackForm(f => ({ ...f, type: e.target.value }))}
                  style={{ width: "100%", padding: "9px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none" }}>
                  <option value="resource_request">Resource Request</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="bug">Report an Issue</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.1em", marginBottom: "6px" }}>RESOURCE NAME (optional)</label>
                <input type="text" placeholder="e.g. Node.js Interview Questions"
                  value={feedbackForm.resource_name} onChange={e => setFeedbackForm(f => ({ ...f, resource_name: e.target.value }))}
                  style={{ width: "100%", padding: "9px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", boxSizing: "border-box" as const }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.1em", marginBottom: "6px" }}>MESSAGE</label>
                <textarea rows={4} placeholder="Describe what you need or what's missing..."
                  value={feedbackForm.message} onChange={e => setFeedbackForm(f => ({ ...f, message: e.target.value }))}
                  style={{ width: "100%", padding: "9px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", resize: "vertical", boxSizing: "border-box" as const }} />
              </div>
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                <button onClick={() => setShowFeedback(false)} style={{ padding: "9px 16px", backgroundColor: W, color: MUTE, border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "12px", cursor: "pointer", ...MONO }}>Cancel</button>
                <button onClick={submitFeedback} disabled={feedbackLoading}
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", backgroundColor: B, color: Y, border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: feedbackLoading ? "not-allowed" : "pointer", ...MONO }}>
                  <Send size={13} /> {feedbackLoading ? "Sending..." : "Send Request"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portal;
