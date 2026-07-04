import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, CheckCircle, Sparkles, Users, Clock, ChevronDown } from "lucide-react";

// ─── Theme (matches the rest of the marketing site) ──────────────────────────
const Y    = "#FFE500";
const B    = "#0A0A0A";
const W    = "#FFFFFF";
const BG   = "#FAFAFA";
const BORD = "#E5E5E5";
const MUTE = "#6B7280";

const BEBAS: React.CSSProperties = { fontFamily: "'Bebas Neue', cursive" };
const MONO:  React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };
const SANS:  React.CSSProperties = { fontFamily: "'Geist', system-ui, -apple-system, sans-serif" };

// ─── The 10 sessions ─────────────────────────────────────────────────────────
type Track = "AI Engineering" | "Career";
interface Session {
  n: number;
  track: Track;
  title: string;
  blurb: string;
  points: string[];
}
const sessions: Session[] = [
  {
    n: 1, track: "AI Engineering",
    title: "Foundations & LLMs",
    blurb: "How LLMs actually work and the mental models you need to build with them.",
    points: ["LLM fundamentals", "Tokens & context windows", "Stochastic outputs", "Setting up your stack"],
  },
  {
    n: 2, track: "AI Engineering",
    title: "Prompt Engineering",
    blurb: "Design reliable prompts, get structured outputs, and avoid common failure modes.",
    points: ["Prompt patterns", "Few-shot & chain-of-thought", "Structured outputs", "Prompt failure modes"],
  },
  {
    n: 3, track: "AI Engineering",
    title: "Tool Calling & RAG",
    blurb: "Give models tools and ground them in your own data without hallucinations.",
    points: ["Tool / function calling", "RAG pipelines", "Hybrid search & re-ranking", "Reducing hallucinations"],
  },
  {
    n: 4, track: "AI Engineering",
    title: "Agents & Multi-Agent Systems",
    blurb: "Build agents that reason, plan, and act — then make them collaborate.",
    points: ["Observe-Think-Act", "ReAct & Plan-Execute", "Orchestrator + specialists", "Multi-agent coordination"],
  },
  {
    n: 5, track: "AI Engineering",
    title: "Memory, Evaluation & Guardrails",
    blurb: "Make your AI systems reliable, measurable, and safe.",
    points: ["Memory architecture", "Evals & LLM-as-judge", "Guardrails", "Regression harness"],
  },
  {
    n: 6, track: "AI Engineering",
    title: "Production, MCP & Deploy",
    blurb: "Ship it: production architecture, cost, observability, MCP, and deployment.",
    points: ["Production architecture", "Cost & observability", "MCP", "Deployment"],
  },
  {
    n: 7, track: "Career",
    title: "Recruiter-Ready Resume & Portfolio",
    blurb: "Build the assets that actually get you shortlisted.",
    points: ["80%+ ATS resume", "Portfolio website", "GitHub README", "Showcasing real work"],
  },
  {
    n: 8, track: "Career",
    title: "LinkedIn & Personal Brand",
    blurb: "A LinkedIn profile that gets replies, and a presence that compounds.",
    points: ["LinkedIn rewrite", "Content that lands", "Outreach messages", "Networking"],
  },
  {
    n: 9, track: "Career",
    title: "Interview Prep, DSA & Mock Interviews",
    blurb: "Get genuinely interview-ready with structured practice.",
    points: ["DSA prep tracks", "Domain question banks", "AI mock interviews", "Company question banks"],
  },
  {
    n: 10, track: "Career",
    title: "Placements, Cold Outreach & Referrals",
    blurb: "The playbook to actually land the role.",
    points: ["Placement playbook", "Cold emails that work", "Referrals from strangers", "Negotiation basics"],
  },
];

// ─── Concrete deliverables ("What do you get?") ──────────────────────────────
const deliverables = [
  { title: "A recruiter-ready resume",  desc: "A free resume scored 80+ on ATS — reviewed and optimised for you." },
  { title: "A portfolio to deploy",     desc: "A portfolio website that showcases your real projects, ready to go live." },
  { title: "A LinkedIn review",         desc: "A profile rewrite that makes recruiters stop and reach out." },
  { title: "A GitHub README template",  desc: "A polished README that makes your GitHub profile stand out." },
];

// ─── Career Compass™ inclusions ──────────────────────────────────────────────
const compass = [
  "Access to 25+ technical training resources with videos",
  "30+ company-based interview question sets",
  "20+ interview questions to practise",
  "12+ career resources — cold emails, messages, and resumes",
  "A free resume, portfolio, LinkedIn review, and GitHub README template",
];

// ─── FAQs ────────────────────────────────────────────────────────────────────
const faqs = [
  { q: "What will I actually be able to do after 30 days?",
    a: "Build and ship production-style AI systems — RAG, agents, multi-agent workflows — and walk away recruiter-ready with a strong resume, portfolio, LinkedIn, and GitHub." },
  { q: "When does the next cohort start?",
    a: "The next cohort kicks off on 1st August. We run a single live Weekday batch and seats are limited — once it is full, it is full." },
  { q: "Do I need prior AI experience?",
    a: "No. You need basic Python and basic system design. We start from foundations and go all the way to production." },
  { q: "Is there a refund policy?",
    a: "Yes — a 24-hour, no-questions-asked refund window from the time of payment. After 24 hours, or once you download the invoice/certificate, you become ineligible." },
  { q: "Will I get a certificate?",
    a: "Yes. After the cohort ends you can download a certificate of completion from the portal." },
  { q: "Can I share my account?",
    a: "No. Devices and browsers are tracked; anything suspicious and access is revoked with no refund." },
];

const Programs = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Razorpay hosted payment page. After the buyer pays, the page's post-payment
  // redirect (set in the Razorpay dashboard) should point at /welcome?onboarding=<token>
  // — the webhook creates the account and issues the token in parallel.
  const RAZORPAY_PAYMENT_URL = "https://rzp.io/rzp/de3kIhbF";
  const handleEnroll = () => {
    window.location.href = RAZORPAY_PAYMENT_URL;
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, ...SANS }}>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: Y, borderBottom: `4px solid ${B}` }}>
        <nav style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "stretch" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", cursor: "pointer" }} onClick={() => navigate("/")}>
            <img src="/upstride-logo.png" alt="Upstrides" style={{ height: "32px", objectFit: "contain" }} />
            <span style={{ ...BEBAS, fontSize: "24px", letterSpacing: "0.1em", color: B }}>Upstrides</span>
          </div>
          <div className="hidden md:flex" style={{ alignItems: "stretch" }}>
            {[
              { label: "← HOME",   action: () => navigate("/") },
              { label: "PORTAL →", action: () => navigate("/login"), highlight: true },
            ].map(({ label, action, highlight }) => (
              <button key={label} onClick={action}
                style={{ padding: "14px 24px", fontWeight: 700, fontSize: "12px", letterSpacing: "0.12em", borderLeft: `3px solid ${B}`, backgroundColor: highlight ? B : "transparent", color: highlight ? Y : B, cursor: "pointer", transition: "all 0.15s", ...MONO }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = highlight ? W : B; el.style.color = B; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.backgroundColor = highlight ? B : "transparent"; el.style.color = highlight ? Y : B; }}
              >{label}</button>
            ))}
          </div>
          <button className="md:hidden" style={{ padding: "12px 16px", background: "transparent", border: "none", borderLeft: `3px solid ${B}`, cursor: "pointer" }} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={22} color={B} /> : <Menu size={22} color={B} />}
          </button>
        </nav>
        {mobileMenuOpen && (
          <div style={{ borderTop: `3px solid ${B}` }}>
            <button onClick={() => navigate("/")} style={{ display: "block", width: "100%", padding: "14px 24px", textAlign: "left", fontWeight: 700, fontSize: "12px", letterSpacing: "0.12em", borderBottom: `2px solid ${B}`, background: "transparent", cursor: "pointer", ...MONO }}>← HOME</button>
            <button onClick={() => navigate("/login")} style={{ display: "block", width: "100%", padding: "14px 24px", textAlign: "left", fontWeight: 700, fontSize: "12px", letterSpacing: "0.12em", backgroundColor: B, color: Y, cursor: "pointer", ...MONO }}>PORTAL →</button>
          </div>
        )}
      </header>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: "80px", backgroundColor: W, borderBottom: `4px solid ${B}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "72px 24px 48px" }}>
          {/* Banner strip */}
          <div style={{ background: B, color: Y, padding: "10px 16px", ...MONO, fontSize: "11px", letterSpacing: "0.1em", marginBottom: "28px", border: `2px solid ${B}` }}>
            ⚠️ THE WEEKEND BATCH IS FULLY BOOKED — thank you for the incredible support. We are now running weekday classes only.
          </div>

          <div style={{ display: "inline-block", backgroundColor: Y, color: B, border: `2px solid ${B}`, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "20px", ...MONO }}>
            LIVE COHORT · WEEKDAY BATCH
          </div>
          <h1 style={{ ...BEBAS, fontSize: "clamp(56px, 11vw, 128px)", lineHeight: 0.9, color: B, marginBottom: "18px" }}>
            BECOME AN<br /><span style={{ color: Y, WebkitTextStroke: `3px ${B}` }}>AI ENGINEER</span><br />IN 30 DAYS
          </h1>
          <p style={{ fontSize: "17px", fontWeight: 500, color: B, marginBottom: "12px", maxWidth: "780px", lineHeight: 1.55 }}>
            One flagship cohort, built to be super practical and no-fluff — designed to make you great at building AI systems and landing the role you want.
          </p>
          <p style={{ fontSize: "14.5px", color: MUTE, maxWidth: "700px", lineHeight: 1.75, marginBottom: "32px" }}>
            A 30-day live cohort to build production-ready AI systems and become a recruiter-ready AI engineer — AI engineering, real projects, Career Compass™, and a lifetime resource library.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px", marginBottom: "32px", maxWidth: "780px" }}>
            {[
              { icon: Clock,     line: "30 days · 10 live sessions · hands-on agentic projects" },
              { icon: Sparkles,  line: "Career Compass: ATS resume, portfolio, LinkedIn, placements" },
              { icon: Users,     line: "Lifetime access to recordings and the resource portal" },
            ].map(({ icon: Icon, line }, i) => (
              <div key={i} style={{ background: BG, border: `2px solid ${B}`, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <div style={{ width: "28px", height: "28px", background: Y, border: `2px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={13} color={B} strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: "12.5px", color: B, lineHeight: 1.55 }}>{line}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            <button onClick={handleEnroll}
              style={{ padding: "14px 26px", backgroundColor: B, color: Y, border: `3px solid ${B}`, boxShadow: `5px 5px 0 ${Y}`, fontWeight: 800, fontSize: "13px", letterSpacing: "0.14em", ...MONO, cursor: "pointer", transition: "transform 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(-2px,-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `7px 7px 0 ${Y}`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `5px 5px 0 ${Y}`; }}
            >
              ENROLL NOW · ₹999
            </button>
            <button onClick={() => document.getElementById("sessions")?.scrollIntoView({ behavior: "smooth" })}
              style={{ padding: "14px 22px", background: "transparent", color: B, border: `2px solid ${B}`, fontWeight: 700, fontSize: "12.5px", letterSpacing: "0.14em", ...MONO, cursor: "pointer" }}>
              VIEW THE MASTERCLASS
            </button>
            <button onClick={() => navigate("/login")}
              style={{ padding: "10px 12px", background: "transparent", color: MUTE, border: "none", fontSize: "12.5px", cursor: "pointer", textDecoration: "underline" }}>
              Already enrolled? Log in →
            </button>
          </div>

          <p style={{ marginTop: "22px", fontSize: "12.5px", color: B, background: `${Y}55`, display: "inline-block", padding: "6px 12px", border: `2px solid ${B}`, ...MONO }}>
            AUGUST 2026 — WEEKDAY BATCH · Enrollments are open. The next cohort starts 1st August.
          </p>
        </div>
      </section>

      {/* ── THE 10 SESSIONS ──────────────────────────────────────────────── */}
      <section id="sessions" style={{ backgroundColor: BG, padding: "80px 24px", borderBottom: `4px solid ${B}`, scrollMarginTop: "80px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ display: "inline-block", backgroundColor: B, color: Y, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "20px", ...MONO }}>
              THE 10 SESSIONS
            </div>
            <h2 style={{ ...BEBAS, fontSize: "clamp(40px, 7vw, 80px)", color: B, lineHeight: 0.9, marginBottom: "14px" }}>
              6 AI ENGINEERING SESSIONS<br /><span style={{ color: Y, WebkitTextStroke: `2px ${B}` }}>4 CAREER SESSIONS</span>
            </h2>
            <p style={{ fontSize: "14px", color: MUTE, maxWidth: "560px", margin: "0 auto", lineHeight: 1.75 }}>
              Every session is live, hands-on, and no-fluff. You'll ship things, not just watch.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "18px" }}>
            {sessions.map((s) => {
              const isCareer = s.track === "Career";
              return (
                <div key={s.n}
                  style={{ backgroundColor: W, border: `2px solid ${B}`, boxShadow: `4px 4px 0 ${B}`, padding: "22px 24px", display: "flex", flexDirection: "column", gap: "10px", transition: "transform 0.15s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translate(-2px,-2px)"; el.style.boxShadow = `6px 6px 0 ${B}`; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translate(0,0)"; el.style.boxShadow = `4px 4px 0 ${B}`; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ background: isCareer ? B : Y, color: isCareer ? Y : B, border: `2px solid ${B}`, padding: "3px 10px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", ...MONO }}>
                      SESSION {s.n} · {s.track.toUpperCase()}
                    </span>
                  </div>
                  <h3 style={{ ...BEBAS, fontSize: "26px", color: B, lineHeight: 1, letterSpacing: "0.02em" }}>{s.title}</h3>
                  <p style={{ fontSize: "13px", color: MUTE, lineHeight: 1.7, borderLeft: `3px solid ${Y}`, paddingLeft: "10px", fontStyle: "italic" }}>
                    {s.blurb}
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", marginTop: "4px" }}>
                    {s.points.map((p) => (
                      <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                        <span style={{ color: B, fontSize: "11px", marginTop: "3px", flexShrink: 0 }}>▶</span>
                        <span style={{ fontSize: "12px", color: B, lineHeight: 1.5 }}>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <p style={{ marginTop: "36px", textAlign: "center", ...MONO, fontSize: "12px", color: `${B}99`, maxWidth: "620px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
            Our Weekend batch is full at the moment. Thank you for the huge support! Grab a spot in the Weekday batch.
          </p>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: B, padding: "80px 24px", borderBottom: `4px solid ${Y}` }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-block", backgroundColor: Y, color: B, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "18px", ...MONO }}>
            PRICING
          </div>
          <h2 style={{ ...BEBAS, fontSize: "clamp(40px, 7vw, 78px)", color: W, lineHeight: 0.9, marginBottom: "12px" }}>
            SEATS ARE <span style={{ color: Y }}>LIMITED.</span><br />LOCK YOURS.
          </h2>
          <p style={{ fontSize: "14px", color: `${W}99`, marginBottom: "36px" }}>Lock in your spot before the next cohort fills up.</p>

          <div style={{ background: W, color: B, border: `4px solid ${Y}`, boxShadow: `8px 8px 0 ${Y}`, padding: "34px", textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "18px" }}>
              <span style={{ background: Y, color: B, border: `2px solid ${B}`, padding: "3px 10px", fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.15em", ...MONO }}>
                EARLY BIRD · 80% OFF
              </span>
              <span style={{ fontSize: "11px", color: MUTE, ...MONO, letterSpacing: "0.08em" }}>LIVE COHORT</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "14px", marginBottom: "6px", flexWrap: "wrap" }}>
              <span style={{ ...BEBAS, fontSize: "72px", color: B, lineHeight: 1 }}>₹999</span>
              <span style={{ fontSize: "20px", color: MUTE, textDecoration: "line-through" }}>₹4,999</span>
            </div>
            <p style={{ fontSize: "12.5px", color: MUTE, marginBottom: "22px" }}>You save ₹4,000 · inclusive of all taxes</p>

            <div style={{ display: "grid", gap: "10px", marginBottom: "24px" }}>
              {[
                "All 10 live weekday sessions",
                "Community, network & doubt resolution",
                "Career Compass™ + lifetime resource library",
                "Lifetime recordings & certificate",
              ].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <CheckCircle size={16} color={B} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ fontSize: "13.5px", color: B, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>

            <button onClick={handleEnroll}
              style={{ width: "100%", padding: "16px", backgroundColor: B, color: Y, border: `3px solid ${B}`, fontWeight: 800, fontSize: "14px", letterSpacing: "0.16em", ...MONO, cursor: "pointer", boxShadow: `5px 5px 0 ${Y}`, transition: "transform 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(-2px,-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `7px 7px 0 ${Y}`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `5px 5px 0 ${Y}`; }}
            >
              ENROLL NOW →
            </button>
          </div>
        </div>
      </section>

      {/* ── WHAT DO YOU GET ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: Y, padding: "80px 24px", borderBottom: `4px solid ${B}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={{ display: "inline-block", background: B, color: Y, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "18px", ...MONO }}>
              WHAT DO YOU GET?
            </div>
            <h2 style={{ ...BEBAS, fontSize: "clamp(38px, 6vw, 72px)", color: B, lineHeight: 0.9, marginBottom: "10px" }}>
              REAL, TANGIBLE ASSETS<br /><span style={{ WebkitTextStroke: `2px ${B}`, color: Y }}>THAT GET YOU HIRED.</span>
            </h2>
            <p style={{ fontSize: "14px", color: `${B}99`, maxWidth: "560px", margin: "0 auto", lineHeight: 1.7 }}>
              Not slides. Not certificates you throw away. Actual assets you use in your next application tomorrow.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "18px" }}>
            {deliverables.map((d, i) => (
              <div key={i}
                style={{ background: W, border: `3px solid ${B}`, boxShadow: `5px 5px 0 ${B}`, padding: "24px", transition: "all 0.15s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translate(-3px,-3px)"; el.style.boxShadow = `8px 8px 0 ${B}`; el.style.background = B; el.style.color = W; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = "translate(0,0)"; el.style.boxShadow = `5px 5px 0 ${B}`; el.style.background = W; el.style.color = B; }}
              >
                <div style={{ background: Y, border: `2px solid ${B}`, display: "inline-flex", alignItems: "center", justifyContent: "center", width: "34px", height: "34px", marginBottom: "14px", color: B, fontWeight: 800, ...MONO, fontSize: "14px" }}>
                  {i + 1}
                </div>
                <h3 style={{ ...BEBAS, fontSize: "24px", color: "inherit", lineHeight: 1, marginBottom: "8px" }}>{d.title}</h3>
                <p style={{ fontSize: "12.5px", color: "inherit", opacity: 0.8, lineHeight: 1.7 }}>{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAREER COMPASS ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: W, padding: "80px 24px", borderBottom: `4px solid ${B}` }}>
        <div style={{ maxWidth: "980px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}
             className="grid-cols-1 md:grid-cols-2">
          <div>
            <div style={{ display: "inline-block", background: B, color: Y, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "18px", ...MONO }}>
              CAREER COMPASS™
            </div>
            <h2 style={{ ...BEBAS, fontSize: "clamp(38px, 6vw, 68px)", color: B, lineHeight: 0.9, marginBottom: "14px" }}>
              EVERYTHING <span style={{ color: Y, WebkitTextStroke: `2px ${B}` }}>OUTSIDE CODING</span> THAT GETS YOU HIRED.
            </h2>
            <p style={{ fontSize: "14px", color: MUTE, lineHeight: 1.75 }}>
              Included with the course. This is the library we built after helping hundreds of students actually land roles.
            </p>
          </div>
          <div>
            {compass.map((line) => (
              <div key={line} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 0", borderBottom: `1px solid ${BORD}` }}>
                <CheckCircle size={16} color={B} style={{ flexShrink: 0, marginTop: "3px" }} />
                <span style={{ fontSize: "13.5px", color: B, lineHeight: 1.55 }}>{line}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: B, padding: "80px 24px", borderBottom: `4px solid ${Y}` }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: Y, color: B, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "24px", ...MONO }}>
            WHERE OUR STUDENTS ARE NOW
          </div>
          <blockquote style={{ ...BEBAS, fontSize: "clamp(28px, 4.4vw, 44px)", color: W, lineHeight: 1.15, letterSpacing: "0.01em", margin: 0, marginBottom: "20px" }}>
            "This has to be the best <span style={{ color: Y }}>Masterclass</span> I ever attended with soo many resources."
          </blockquote>
          <div style={{ fontSize: "13px", color: `${W}bb`, letterSpacing: "0.1em", ...MONO }}>
            MAGDALEENA · 2ND YEAR STUDENT AT SRM · MULTIPLE INTERNSHIPS
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: BG, padding: "80px 24px", borderBottom: `4px solid ${B}` }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{ display: "inline-block", background: B, color: Y, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "18px", ...MONO }}>
              FAQ
            </div>
            <h2 style={{ ...BEBAS, fontSize: "clamp(38px, 6vw, 68px)", color: B, lineHeight: 0.9, marginBottom: "10px" }}>
              FREQUENTLY ASKED<br /><span style={{ color: Y, WebkitTextStroke: `2px ${B}` }}>QUESTIONS</span>
            </h2>
            <p style={{ fontSize: "13.5px", color: MUTE }}>Still have questions? Email me at <a href="mailto:mamlesh.va06@gmail.com" style={{ color: B, textDecoration: "underline" }}>mamlesh.va06@gmail.com</a>.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={i} style={{ background: W, border: `2px solid ${B}`, boxShadow: open ? `4px 4px 0 ${Y}` : "none" }}>
                  <button onClick={() => setOpenFaq(open ? null : i)}
                    style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", padding: "16px 20px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
                    <span style={{ fontSize: "14.5px", fontWeight: 700, color: B, letterSpacing: "-0.005em" }}>{f.q}</span>
                    <ChevronDown size={18} color={B} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
                  </button>
                  {open && (
                    <div style={{ padding: "0 20px 18px", fontSize: "13.5px", color: MUTE, lineHeight: 1.75, borderTop: `1px dashed ${BORD}`, marginTop: "-2px", paddingTop: "14px" }}>
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL ENROLL ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: Y, padding: "72px 24px", borderBottom: `4px solid ${B}` }}>
        <div style={{ maxWidth: "780px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ ...BEBAS, fontSize: "clamp(40px, 7vw, 80px)", color: B, lineHeight: 0.9, marginBottom: "16px" }}>
            30 DAYS TO<br />BECOME AN <span style={{ color: W, WebkitTextStroke: `3px ${B}` }}>AI ENGINEER.</span>
          </h2>
          <p style={{ fontSize: "14px", color: `${B}cc`, marginBottom: "28px" }}>
            Seats are limited. The Weekend batch is already full — grab a spot in the Weekday batch before it closes.
          </p>
          <button onClick={handleEnroll}
            style={{ padding: "16px 34px", backgroundColor: B, color: Y, border: `3px solid ${B}`, fontWeight: 800, fontSize: "14px", letterSpacing: "0.16em", ...MONO, cursor: "pointer", boxShadow: `6px 6px 0 ${W}`, transition: "transform 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(-2px,-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `8px 8px 0 ${W}`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `6px 6px 0 ${W}`; }}
          >
            ENROLL NOW · ₹999 →
          </button>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: B, borderTop: `4px solid ${Y}`, padding: "36px 24px", color: W }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/upstride-logo.png" alt="Upstrides" style={{ height: "24px", objectFit: "contain" }} />
            <span style={{ ...BEBAS, fontSize: "18px", letterSpacing: "0.12em" }}>Upstrides</span>
          </div>
          <span style={{ fontSize: "12px", color: `${W}77`, ...MONO }}>
            © {new Date().getFullYear()} Upstrides · <a href="mailto:mamlesh.va06@gmail.com" style={{ color: Y, textDecoration: "none" }}>mamlesh.va06@gmail.com</a>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Programs;
