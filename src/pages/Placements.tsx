import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LogOut, ArrowUpRight, ChevronLeft, ChevronRight, Briefcase, Building2, X, ExternalLink } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const Y    = "#FFE500";
const B    = "#0A0A0A";
const W    = "#FFFFFF";
const BG   = "#F5F5F5";
const BORD = "#E5E5E5";
const MUTE = "#6B7280";
const SURF = "#FFFFFF";
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

const CATEGORIES = ["All", "Software", "Frontend", "Backend", "Full Stack", "AI / ML", "Data", "DevOps", "Design", "Other"];

interface Job {
  id: string;
  role: string;
  company: string;
  description: string;
  apply_link: string;
  category: string;
  created_at: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

const Placements = () => {
  const navigate  = useNavigate();
  const userEmail   = localStorage.getItem("userEmail") ?? "";
  const userName    = localStorage.getItem("userName")  ?? "";
  const userRole    = localStorage.getItem("userRole")  ?? "";
  const displayName = userName.trim() || userEmail.split("@")[0] || "";

  const isLocked = userRole === "public_user";

  const [jobs, setJobs]           = useState<Job[]>([]);
  const [total, setTotal]         = useState(0);
  const [pages, setPages]         = useState(1);
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(false);
  const [search, setSearch]       = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory]   = useState("All");
  const [selected, setSelected]   = useState<Job | null>(null);

  // Lock screen form state (public_user)
  const [lockForm, setLockForm]         = useState({ name: "", email: "", phone: "" });
  const [lockSubmitting, setLockSubmitting] = useState(false);
  const [lockSubmitted, setLockSubmitted]   = useState(false);
  const [lockFocused, setLockFocused]       = useState<string | null>(null);

  const fetchJobs = useCallback(async (cat: string, q: string, p: number) => {
    setLoading(true);
    try {
      const res = await api.public.jobs({ category: cat === "All" ? "" : cat, search: q, page: p }) as {
        data: { jobs: Job[]; total: number; page: number; pages: number };
      };
      setJobs(res.data.jobs);
      setTotal(res.data.total);
      setPages(res.data.pages);
      setSelected(null);
    } catch { toast({ title: "Failed to load jobs", variant: "destructive" }); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchJobs(category, search, page); }, [category, search, page, fetchJobs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleCat = (cat: string) => { setCategory(cat); setPage(1); };

  const handleLogout = () => {
    ["token", "userRole", "userEmail", "userName", "mustChangePassword"].forEach(k => localStorage.removeItem(k));
    navigate("/login");
  };

  const card: React.CSSProperties = { backgroundColor: SURF, border: `2px solid ${BORD}`, borderRadius: "8px", cursor: "pointer", transition: "all 0.15s" };

  const handleLockApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lockForm.name || !lockForm.email || !lockForm.phone) {
      toast({ title: "All fields required", variant: "destructive" }); return;
    }
    setLockSubmitting(true);
    try {
      await api.public.apply(lockForm);
      setLockSubmitted(true);
    } catch (err: unknown) {
      toast({ title: "Submission failed", description: (err as Error).message, variant: "destructive" });
    } finally { setLockSubmitting(false); }
  };

  const lockInp = (name: string): React.CSSProperties => ({
    padding: "11px 14px",
    background: lockFocused === name ? "#ffffff18" : "#ffffff0d",
    border: `2px solid ${lockFocused === name ? Y : "#ffffff25"}`,
    borderRadius: "6px", fontSize: "13px", ...MONO,
    outline: "none", color: W, width: "100%", boxSizing: "border-box" as const,
    transition: "border-color 0.15s, background 0.15s",
  });

  /* ────────────────────────────────────────────────────────
     LOCKED VIEW — shown to public_user accounts
  ──────────────────────────────────────────────────────── */
  if (isLocked) {
    const TEASER_JOBS = [
      { role: "Frontend Developer Intern", company: "Google", cat: "Frontend" },
      { role: "ML Engineer Intern",        company: "OpenAI",    cat: "AI / ML"    },
      { role: "Full Stack Developer",      company: "Flipkart",  cat: "Full Stack" },
      { role: "Backend Intern",            company: "Razorpay",  cat: "Backend"    },
      { role: "UI/UX Design Intern",       company: "Adobe",     cat: "Design"     },
      { role: "Data Analyst Intern",       company: "Microsoft", cat: "Data"       },
    ];

    return (
      <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden", ...MONO }}>

        {/* ── Blurred teaser behind overlay ── */}
        <div style={{ filter: "blur(5px)", userSelect: "none", pointerEvents: "none", opacity: 0.6 }}>
          {/* Teaser header */}
          <div style={{ backgroundColor: W, borderBottom: `2px solid ${BORD}`, height: "60px", display: "flex", alignItems: "center", padding: "0 24px", gap: "10px" }}>
            <span style={{ fontSize: "15px", fontWeight: 700, letterSpacing: "0.06em" }}>Upstrides</span>
            <span style={{ fontSize: "9px", background: Y, color: B, padding: "2px 8px", border: `1px solid ${B}`, fontWeight: 700, letterSpacing: "0.12em" }}>PLACEMENTS</span>
            <div style={{ flex: 1, maxWidth: "400px", marginLeft: "16px", height: "36px", background: BORD, borderRadius: "6px" }} />
          </div>
          {/* Teaser category strip */}
          <div style={{ backgroundColor: W, borderBottom: `1px solid ${BORD}`, padding: "10px 24px", display: "flex", gap: "8px" }}>
            {CATEGORIES.slice(0, 6).map(c => (
              <div key={c} style={{ padding: "4px 14px", borderRadius: "999px", border: `2px solid ${c === "All" ? B : BORD}`, background: c === "All" ? B : W, color: c === "All" ? Y : MUTE, fontSize: "11px", fontWeight: 600 }}>{c}</div>
            ))}
          </div>
          {/* Teaser job cards */}
          <div style={{ maxWidth: "840px", margin: "28px auto", padding: "0 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {TEASER_JOBS.map((j, i) => (
              <div key={i} style={{ background: W, border: `2px solid ${BORD}`, borderRadius: "8px", padding: "16px 20px", borderLeft: `4px solid ${i < 2 ? Y : BORD}` }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: B, marginBottom: "5px" }}>{j.role}</div>
                <div style={{ fontSize: "12px", color: MUTE }}>{j.company} · {j.cat}</div>
                <div style={{ marginTop: "10px", height: "10px", background: BORD, borderRadius: "3px", width: "70%" }} />
                <div style={{ marginTop: "6px", height: "10px", background: BORD, borderRadius: "3px", width: "50%" }} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Lock overlay ── */}
        <div style={{ position: "fixed", inset: 0, background: "rgba(10,10,10,0.86)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: "16px" }}>
          <div style={{ background: B, border: `3px solid ${Y}`, borderRadius: "12px", padding: "clamp(20px, 5vw, 40px) clamp(18px, 5vw, 40px) 24px", maxWidth: "500px", width: "100%", boxShadow: `6px 6px 0 ${Y}`, maxHeight: "92vh", overflowY: "auto" }}>

            {/* Top badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${Y}22`, border: `1px solid ${Y}44`, borderRadius: "6px", padding: "5px 12px", marginBottom: "20px" }}>
              <span style={{ fontSize: "14px" }}>🔒</span>
              <span style={{ fontSize: "10px", fontWeight: 700, color: Y, letterSpacing: "0.16em" }}>FULL ACCESS LOCKED</span>
            </div>

            {/* Headline */}
            <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(30px, 5vw, 44px)", color: W, lineHeight: 0.95, marginBottom: "14px" }}>
              YOU'RE IN.<br /><span style={{ color: Y }}>BUT NOT YET INSIDE.</span>
            </h2>
            <p style={{ fontSize: "12px", color: "#ffffff80", lineHeight: 1.8, marginBottom: "22px" }}>
              You signed up — great first step. Submit your application below and our team will reach out within 24 hours to unlock your full Upstrides Program access.
            </p>

            {/* What's inside */}
            <div style={{ background: "#ffffff08", border: "1px solid #ffffff18", borderRadius: "10px", padding: "16px 18px", marginBottom: "24px" }}>
              <div style={{ fontSize: "9px", fontWeight: 700, color: Y, letterSpacing: "0.18em", marginBottom: "12px" }}>WHAT YOU'LL UNLOCK</div>
              {[
                { icon: "💼", text: "50+ real internship listings, updated weekly" },
                { icon: "📄", text: "Free Resume with 80+ ATS score, guaranteed" },
                { icon: "🎯", text: "Placement prep loopholes & shortlisting secrets" },
                { icon: "📧", text: "500+ company emails for direct cold outreach" },
                { icon: "🌐", text: "Custom portfolio + full LinkedIn profile overhaul" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: i < 4 ? "10px" : 0 }}>
                  <span style={{ fontSize: "14px", flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: "12px", color: "#ffffffcc", lineHeight: 1.5 }}>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Form or success */}
            {!lockSubmitted ? (
              <form onSubmit={handleLockApply} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                  type="text" placeholder="Your full name" value={lockForm.name} required
                  onChange={e => setLockForm(f => ({ ...f, name: e.target.value }))}
                  onFocus={() => setLockFocused("name")} onBlur={() => setLockFocused(null)}
                  style={lockInp("name")}
                />
                <input
                  type="tel" placeholder="+91 98765 43210" value={lockForm.phone} required
                  onChange={e => setLockForm(f => ({ ...f, phone: e.target.value }))}
                  onFocus={() => setLockFocused("phone")} onBlur={() => setLockFocused(null)}
                  style={lockInp("phone")}
                />
                <input
                  type="email" placeholder="you@example.com" value={lockForm.email} required
                  onChange={e => setLockForm(f => ({ ...f, email: e.target.value }))}
                  onFocus={() => setLockFocused("email")} onBlur={() => setLockFocused(null)}
                  style={lockInp("email")}
                />
                <button type="submit" disabled={lockSubmitting}
                  style={{ marginTop: "4px", padding: "14px", background: lockSubmitting ? `${Y}aa` : Y, color: B, border: `2px solid ${Y}`, borderRadius: "6px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em", cursor: lockSubmitting ? "not-allowed" : "pointer", ...MONO, transition: "all 0.15s" }}
                  onMouseEnter={e => { if (!lockSubmitting) (e.currentTarget as HTMLButtonElement).style.background = W; }}
                  onMouseLeave={e => { if (!lockSubmitting) (e.currentTarget as HTMLButtonElement).style.background = Y; }}>
                  {lockSubmitting ? "SUBMITTING..." : "APPLY TO UNLOCK →"}
                </button>
                <p style={{ fontSize: "10px", color: "#ffffff35", textAlign: "center" }}>No spam. We only reach out about the program.</p>
              </form>
            ) : (
              <div style={{ textAlign: "center", padding: "24px 0 16px" }}>
                <div style={{ width: "56px", height: "56px", background: Y, border: `2px solid ${B}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "24px" }}>✓</div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "30px", color: Y, letterSpacing: "0.04em", marginBottom: "10px" }}>APPLICATION SENT!</div>
                <p style={{ fontSize: "12px", color: "#ffffff80", lineHeight: 1.8 }}>
                  Our team will review your application and reach out within 24–48 hours to unlock your access.
                </p>
              </div>
            )}

            {/* Cancel / back */}
            <div style={{ marginTop: "20px", borderTop: "1px solid #ffffff14", paddingTop: "16px", display: "flex", gap: "10px" }}>
              <button onClick={() => navigate("/")}
                style={{ flex: 1, padding: "11px", background: "transparent", color: "#ffffffaa", border: "1px solid #ffffff25", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer", ...MONO, transition: "all 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#ffffff60"; (e.currentTarget as HTMLButtonElement).style.color = W; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#ffffff25"; (e.currentTarget as HTMLButtonElement).style.color = "#ffffffaa"; }}>
                ← Back to Home
              </button>
              <button onClick={handleLogout}
                style={{ padding: "11px 16px", background: "transparent", color: "#ffffff40", border: "1px solid #ffffff15", borderRadius: "6px", fontSize: "11px", cursor: "pointer", ...MONO, transition: "color 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#EF4444"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#ffffff40"; }}>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, color: B, ...MONO }}>

      {/* ── HEADER ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 100, backgroundColor: W, borderBottom: `2px solid ${BORD}` }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: "16px", height: "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", flexShrink: 0 }} onClick={() => navigate("/")}>
            <img src="/upstride-logo.png" alt="Upstrides" style={{ height: "26px", objectFit: "contain" }} />
            <span style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "0.06em" }}>Upstrides</span>
            <span style={{ fontSize: "9px", background: Y, color: B, padding: "2px 7px", border: `1px solid ${B}`, fontWeight: 700, letterSpacing: "0.12em" }}>PLACEMENTS</span>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} style={{ flex: 1, display: "flex", maxWidth: "520px", gap: "0" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <Search size={15} color={MUTE} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search role or company..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                style={{ width: "100%", padding: "9px 12px 9px 38px", border: `2px solid ${BORD}`, borderRight: "none", borderRadius: "6px 0 0 6px", fontSize: "13px", ...MONO, outline: "none", boxSizing: "border-box" as const }}
              />
            </div>
            <button type="submit" style={{ padding: "9px 18px", background: B, color: Y, border: `2px solid ${B}`, borderRadius: "0 6px 6px 0", fontSize: "12px", fontWeight: 700, cursor: "pointer", ...MONO, whiteSpace: "nowrap" }}>
              SEARCH
            </button>
          </form>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
       
            <button onClick={() => navigate("/apply")} style={{ padding: "7px 14px", background: W, color: B, border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "11px", fontWeight: 700, cursor: "pointer", ...MONO }}>
              Join Program
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <div style={{ width: "28px", height: "28px", background: B, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: Y, ...MONO }}>{displayName.charAt(0).toUpperCase()}</span>
              </div>
              <span style={{ fontSize: "12px", fontWeight: 600, color: B, ...MONO, maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</span>
            </div>
            <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "7px 12px", background: "none", color: MUTE, border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "11px", cursor: "pointer", ...MONO }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#EF4444"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#EF4444"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = MUTE; (e.currentTarget as HTMLButtonElement).style.borderColor = BORD; }}>
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>

        {/* Category filter strip */}
        <div style={{ borderTop: `1px solid ${BORD}`, backgroundColor: W }}>
          <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "8px 20px", display: "flex", gap: "4px", overflowX: "auto", scrollbarWidth: "none" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => handleCat(cat)} style={{
                padding: "5px 14px", borderRadius: "999px", border: `2px solid ${category === cat ? B : BORD}`,
                background: category === cat ? B : W, color: category === cat ? Y : B,
                fontSize: "11px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", ...MONO, transition: "all 0.12s",
              }}>
                {cat}
              </button>
            ))}
            {search && (
              <button onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }} style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 12px", borderRadius: "999px", border: `2px solid #EF4444`, background: "#FEF2F2", color: "#EF4444", fontSize: "11px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", ...MONO }}>
                <X size={11} /> Clear: "{search}"
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px", display: "grid", gridTemplateColumns: selected ? "380px 1fr" : "1fr", gap: "16px", alignItems: "start" }}>

        {/* ── JOB LIST ── */}
        <div>
          {/* Count */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
            <span style={{ fontSize: "12px", color: MUTE }}>
              {loading ? "Loading..." : `${total.toLocaleString()} internship${total !== 1 ? "s" : ""} found`}
            </span>
            {pages > 1 && (
              <span style={{ fontSize: "11px", color: MUTE }}>Page {page} of {pages}</span>
            )}
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ ...card, padding: "18px", cursor: "default" }}>
                  <div style={{ height: "14px", background: BORD, borderRadius: "4px", marginBottom: "10px", width: "60%" }} />
                  <div style={{ height: "12px", background: BORD, borderRadius: "4px", width: "40%" }} />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: W, border: `2px solid ${BORD}`, borderRadius: "10px" }}>
              <Briefcase size={36} color={MUTE} style={{ marginBottom: "12px" }} />
              <div style={{ fontWeight: 700, color: B, marginBottom: "6px" }}>No internships found</div>
              <div style={{ fontSize: "12px", color: MUTE }}>Try a different category or search term</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {jobs.map(job => (
                <div
                  key={job.id}
                  onClick={() => setSelected(job)}
                  style={{
                    ...card,
                    borderColor: selected?.id === job.id ? B : BORD,
                    borderLeft: `4px solid ${selected?.id === job.id ? Y : BORD}`,
                    boxShadow: selected?.id === job.id ? `3px 3px 0 ${Y}` : "none",
                    padding: "16px 18px",
                  }}
                  onMouseEnter={e => { if (selected?.id !== job.id) (e.currentTarget as HTMLDivElement).style.borderColor = B; }}
                  onMouseLeave={e => { if (selected?.id !== job.id) (e.currentTarget as HTMLDivElement).style.borderColor = BORD; }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "8px" }}>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: B, marginBottom: "3px" }}>{job.role}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: MUTE }}>
                        <Building2 size={12} /> {job.company}
                      </div>
                    </div>
                    <span style={{ fontSize: "9px", background: `${B}0a`, color: MUTE, padding: "3px 8px", borderRadius: "4px", whiteSpace: "nowrap", flexShrink: 0, border: `1px solid ${BORD}` }}>
                      {job.category}
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: MUTE, lineHeight: 1.6, marginBottom: "10px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                    {job.description}
                  </div>
                  <div style={{ fontSize: "10px", color: MUTE }}>{timeAgo(job.created_at)}</div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "20px" }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ display: "flex", alignItems: "center", gap: "4px", padding: "7px 14px", background: W, border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "12px", cursor: page === 1 ? "not-allowed" : "pointer", color: page === 1 ? MUTE : B, ...MONO }}>
                <ChevronLeft size={14} /> Prev
              </button>
              {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                const start = Math.max(1, Math.min(page - 2, pages - 4));
                const p = start + i;
                return (
                  <button key={p} onClick={() => setPage(p)} style={{ width: "36px", height: "36px", border: `2px solid ${p === page ? B : BORD}`, background: p === page ? B : W, color: p === page ? Y : B, borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: "pointer", ...MONO }}>
                    {p}
                  </button>
                );
              })}
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                style={{ display: "flex", alignItems: "center", gap: "4px", padding: "7px 14px", background: W, border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "12px", cursor: page === pages ? "not-allowed" : "pointer", color: page === pages ? MUTE : B, ...MONO }}>
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* ── JOB DETAIL (right panel) ── */}
        {selected && (
          <div style={{ position: "sticky", top: "116px", background: W, border: `2px solid ${B}`, borderRadius: "10px", overflow: "hidden", boxShadow: `4px 4px 0 ${Y}` }}>
            {/* Detail header */}
            <div style={{ background: B, padding: "24px 28px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <span style={{ fontSize: "9px", background: Y, color: B, padding: "2px 8px", fontWeight: 700, letterSpacing: "0.12em" }}>{selected.category}</span>
                  <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(24px, 3vw, 34px)", color: W, lineHeight: 1, marginTop: "10px", letterSpacing: "0.02em" }}>
                    {selected.role}
                  </h2>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "#ffffff14", border: "1px solid #ffffff20", borderRadius: "6px", padding: "6px", cursor: "pointer", color: W, display: "flex", alignItems: "center", flexShrink: 0 }}>
                  <X size={16} />
                </button>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#ffffffaa" }}>
                <Building2 size={14} color={Y} />
                <span style={{ fontWeight: 600, color: W }}>{selected.company}</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span>{timeAgo(selected.created_at)}</span>
              </div>
            </div>

            {/* Detail body */}
            <div style={{ padding: "24px 28px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: MUTE, letterSpacing: "0.12em", marginBottom: "12px" }}>ABOUT THIS ROLE</div>
              <p style={{ fontSize: "13px", color: B, lineHeight: 1.8, whiteSpace: "pre-wrap", marginBottom: "28px" }}>
                {selected.description}
              </p>

              <a
                href={selected.apply_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", padding: "16px", background: Y, color: B, textDecoration: "none", fontWeight: 700, fontSize: "14px", letterSpacing: "0.1em", border: `2px solid ${B}`, borderRadius: "6px", ...MONO, boxSizing: "border-box" as const }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = B; (e.currentTarget as HTMLAnchorElement).style.color = Y; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = Y; (e.currentTarget as HTMLAnchorElement).style.color = B; }}
              >
                <ExternalLink size={16} /> APPLY NOW →
              </a>

              <div style={{ marginTop: "16px", padding: "14px 16px", background: BG, border: `1px solid ${BORD}`, borderRadius: "6px" }}>
                <div style={{ fontSize: "11px", color: MUTE, lineHeight: 1.6 }}>
                  You'll be redirected to the company's official application page. Make sure your resume is updated before applying.
                </div>
                <button onClick={() => navigate("/apply")} style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: B, fontSize: "11px", fontWeight: 700, cursor: "pointer", textDecoration: "underline", ...MONO }}>
                  <ArrowUpRight size={12} /> Want full Upstrides Program access?
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Placements;
