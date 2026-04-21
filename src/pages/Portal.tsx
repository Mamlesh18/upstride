import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, Mail, Linkedin, ListChecks, FileCode, MessageSquare,
  Building2, Code2, LogOut, GraduationCap, Star, Database, Network,
  Cpu, MessageCircle, Lightbulb, Brain, Target, BookOpen, ArrowUpRight,
  Flame, Zap, Trophy, Eye, ShoppingCart, Server, Coffee,
  PlayCircle, Lock, CheckSquare, X, Send,
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
type ViewType = "recommended" | "training" | "placement" | "sessions";

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
  const [currentView, setCurrentView]         = useState<ViewType>("recommended");
  const [sessions, setSessions]               = useState<Session[]>([]);
  const [sessionsInfo, setSessionsInfo]       = useState<{ weeks_completed: number; unlocked_count: number; days_enrolled: number } | null>(null);
  const [resourcesData, setResourcesData]     = useState<ResourcesData | null>(null);
  const [showFeedback, setShowFeedback]       = useState(false);
  const [feedbackForm, setFeedbackForm]       = useState({ type: "resource_request", message: "", resource_name: "" });
  const [feedbackLoading, setFeedbackLoading] = useState(false);

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

  const switchView = (view: ViewType) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tabs: { view: ViewType; label: string; icon: typeof Star; count: string }[] = [
    { view: "recommended", label: "Recommended", icon: Star,          count: `${resourcesData?.recommended.length ?? "—"}` },
    { view: "training",    label: "Training",    icon: GraduationCap, count: `${resourcesData ? resourcesData.training.reduce((a, c) => a + c.resources.length, 0) : "—"}` },
    { view: "placement",   label: "Placement",   icon: Building2,     count: `${resourcesData ? resourcesData.placement.service.length + resourcesData.placement.product.length : "—"}` },
    { view: "sessions",    label: "Sessions",    icon: PlayCircle,    count: "11" },
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
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => navigate("/")}>
            <img src="/upstride-logo.png" alt="Upstride" style={{ height: "30px", objectFit: "contain" }} />
            <span style={{ fontSize: "16px", fontWeight: 700, color: B, letterSpacing: "0.05em" }}>UPSTRIDE</span>
            <span style={{ fontSize: "10px", backgroundColor: Y, color: B, padding: "2px 8px", borderRadius: "3px", fontWeight: 700, letterSpacing: "0.12em", border: `1px solid ${B}` }}>
              PORTAL
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button onClick={() => navigate("/workspace")}
              style={{ display: "flex", alignItems: "center", gap: "6px", color: B, background: Y, border: `2px solid ${B}`, borderRadius: "6px", padding: "7px 14px", cursor: "pointer", fontSize: "12px", fontWeight: 700, ...MONO }}>
              <CheckSquare size={14} /> My Workspace
            </button>
            <button onClick={() => setShowFeedback(true)}
              style={{ display: "flex", alignItems: "center", gap: "6px", color: MUTE, background: "none", border: `2px solid ${BORD}`, borderRadius: "6px", padding: "7px 14px", cursor: "pointer", fontSize: "12px", ...MONO }}>
              <MessageSquare size={14} /> Request Resource
            </button>
            <button onClick={handleLogout}
              style={{ display: "flex", alignItems: "center", gap: "8px", color: MUTE, background: "none", border: `2px solid ${BORD}`, borderRadius: "6px", padding: "7px 14px", cursor: "pointer", fontSize: "12px", ...MONO, transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#EF4444"; (e.currentTarget as HTMLButtonElement).style.color = "#EF4444"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = BORD; (e.currentTarget as HTMLButtonElement).style.color = MUTE; }}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ── TAB BAR ─────────────────────────────────────────────────────── */}
      <div style={{ position: "fixed", top: "60px", left: 0, right: 0, zIndex: 99, backgroundColor: W, borderBottom: `2px solid ${BORD}` }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px", display: "flex", gap: "4px", overflowX: "auto" }}>
          {tabs.map(({ view, label, icon: Icon, count }) => (
            <button
              key={view}
              onClick={() => switchView(view)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "14px 20px",
                fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em",
                ...MONO,
                background: "none", border: "none", cursor: "pointer",
                color: currentView === view ? B : MUTE,
                borderBottom: `3px solid ${currentView === view ? Y : "transparent"}`,
                transition: "all 0.15s",
                whiteSpace: "nowrap" as const,
              }}
              onMouseEnter={e => { if (currentView !== view) (e.currentTarget as HTMLButtonElement).style.color = B; }}
              onMouseLeave={e => { if (currentView !== view) (e.currentTarget as HTMLButtonElement).style.color = MUTE; }}
            >
              <Icon size={15} />
              {label}
              <span style={{ backgroundColor: currentView === view ? Y : `${B}10`, color: B, borderRadius: "4px", padding: "1px 7px", fontSize: "10px", fontWeight: 700, border: `1px solid ${currentView === view ? B : BORD}` }}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "120px 24px 60px" }}>

        {/* ══ RECOMMENDED ════════════════════════════════════════════════ */}
        {currentView === "recommended" && (
          <div>
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
                  <div key={doc.id} style={card} onClick={() => window.open(doc.url, "_blank")} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
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
                        <div key={res.id} style={card} onClick={() => window.open(res.url, "_blank")} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
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
                          onClick={() => window.open(res.url, "_blank")}
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
                    onClick={() => window.open(company.url, "_blank")}
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
          <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 24px" }}>
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
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
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
