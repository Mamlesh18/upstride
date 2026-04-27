import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Menu, X, CheckCircle, Star, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// ─── Theme ────────────────────────────────────────────────────────────────────
const Y    = "#FFE500";
const B    = "#0A0A0A";
const W    = "#FFFFFF";
const BG   = "#FAFAFA";
const BORD = "#E5E5E5";
const MUTE = "#6B7280";

const BEBAS: React.CSSProperties = { fontFamily: "'Bebas Neue', cursive" };
const MONO: React.CSSProperties  = { fontFamily: "'IBM Plex Mono', monospace" };

// ─── Roadmap Data — 8 weeks / 2 months ───────────────────────────────────────
const roadmap = [
  {
    week: "WEEK 1",
    title: "REALITY CHECK",
    why: "Most students don't know what they're actually competing against. Before you can win, you need to see the board clearly.",
    what: [
      "What companies actually look for vs. what colleges teach",
      "Why 90% of applications never get opened",
      "Your honest skill gap — no sugarcoating",
      "Defining your lane: Tech / Data / Business / Design",
    ],
  },
  {
    week: "WEEK 2",
    title: "BUILD YOUR IDENTITY",
    why: "Your resume, LinkedIn, and GitHub are your silent salespeople. Right now, they're probably saying the wrong things.",
    what: [
      "Resume built for ATS — 80+ score guaranteed",
      "LinkedIn profile overhauled from top to bottom",
      "GitHub README customized to your story",
      "Personal brand positioning across every platform",
    ],
  },
  {
    week: "WEEK 3",
    title: "PROJECTS THAT PROVE YOU",
    why: "A degree tells them you completed a syllabus. A project tells them you can build something real. One matters more.",
    what: [
      "Selecting the right project for your target role",
      "How to present a project so it impresses in 10 seconds",
      "Custom portfolio site built and deployed",
      "GitHub contributions that show consistent activity",
    ],
  },
  {
    week: "WEEK 4",
    title: "THE OUTREACH SYSTEM",
    why: "Jobs are not found — they're reached for. 80% of roles are filled before they're posted. You need to be in rooms where the hiring happens.",
    what: [
      "Cold email templates that get replies from HR",
      "LinkedIn messaging strategy (the ones that actually work)",
      "How to reach decision-makers directly",
      "Building a referral pipeline from scratch",
    ],
  },
  {
    week: "WEEK 5",
    title: "CRACK THE INTERVIEW",
    why: "Preparation without structure leads to blanking out. Structure turns every round — HR, technical, managerial — into a conversation you control.",
    what: [
      "HR round: Tell me about yourself, that actually lands",
      "Technical: DSA patterns + company-specific prep",
      "Behavioural: STAR method for every scenario",
      "3 mock interviews with real feedback",
    ],
  },
  {
    week: "WEEK 6",
    title: "NEGOTIATE & CLOSE",
    why: "Getting an offer is step one. Knowing what you're worth — and asking for it — is the step most students skip and regret.",
    what: [
      "Salary negotiation — how to do it without losing the offer",
      "Evaluating an offer: base, growth, culture, optionality",
      "Counter-offer scripts that work",
      "Setting up your first 90-day success plan",
    ],
  },
  {
    week: "WEEK 7",
    title: "PLACEMENT BLITZ",
    why: "After 6 weeks of prep, you need volume with precision — not mass applying, but strategic targeting of companies that fit you.",
    what: [
      "Company-specific prep (TCS, Infosys, Wipro, Accenture, HCL, Cognizant)",
      "Product company strategy (Zepto, Swiggy, Zomato, Paytm)",
      "Tier-1 applications (Google, Deloitte, EY) — what actually works",
      "Application tracking + follow-up cadence",
    ],
  },
  {
    week: "WEEK 8",
    title: "LAUNCH & MOMENTUM",
    why: "The goal isn't just an offer — it's momentum. You need systems that keep working for you even after the program ends.",
    what: [
      "Offer received: what to do in the first 30 days",
      "Building your network so opportunities come to you",
      "Long-term career roadmap — where to go from here",
      "Lifetime access to the Upstrides portal and community",
    ],
  },
];

const portalHighlights = [
  "500+ cold email templates for every company type",
  "LinkedIn message scripts that get 40%+ reply rates",
  "Resume templates for 12 different roles",
  "Career roadmaps for Tech, Data, Business & Design",
  "Projects you should build — with guidance",
  "Open source contribution guide (first PR in 3 days)",
  "Interview question banks for 17 top companies",
  "Placement resources: TCS, Infosys, HCL, Wipro, Accenture, Cognizant, Zoho, EY, Deloitte, Capgemini, Swiggy, Zepto, Zomato, Paytm",
];

const guarantees = [
  {
    title: "80+ ATS Resume",
    desc: "We build your resume from scratch, tested against ATS systems. 80+ score guaranteed — or we rebuild it.",
    tag: "GUARANTEED",
  },
  {
    title: "Custom Portfolio, Deployed",
    desc: "A portfolio that's actually yours, live on the internet. Not a template. Built around your story and your projects.",
    tag: "DELIVERED",
  },
  {
    title: "LinkedIn Full Overhaul",
    desc: "We rewrite every section — headline, about, experience, skills. The kind of profile that makes recruiters reach out to you.",
    tag: "DELIVERED",
  },
  {
    title: "GitHub README Template",
    desc: "A customized GitHub profile README that shows you're serious before anyone reads a single line of your code.",
    tag: "DELIVERED",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
const Programs = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      toast({ title: "Invalid number", description: "Please enter a valid 10-digit phone number", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const dateTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "long" });
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: "f4edb229-9419-4f5c-a18f-8f67c1ec3082",
          subject: "🔥 New Call Request - Upstrides Programs Page",
          from_name: "Upstrides Website",
          to: "hello@upstrides.in",
          phone: phoneNumber,
          message: `📞 NEW CALL REQUEST\nPhone: ${phoneNumber}\nDate: ${dateTime}\nSource: Programs Page`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "You're on the list!", description: "WE WILL CALL YOU PERSONALLY within 24 hours." });
        setPhoneNumber("");
      } else throw new Error();
    } catch {
      toast({ title: "Failed", description: "Please try again or email hello@upstrides.in", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, ...MONO }}>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: Y, borderBottom: `4px solid ${B}` }}>
        <nav style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", justifyContent: "space-between", alignItems: "stretch" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", cursor: "pointer" }} onClick={() => navigate("/")}>
            <img src="/upstride-logo.png" alt="Upstrides" style={{ height: "32px", objectFit: "contain" }} />
            <span style={{ ...BEBAS, fontSize: "24px", letterSpacing: "0.1em", color: B }}>Upstrides</span>
          </div>
          <div className="hidden md:flex" style={{ alignItems: "stretch" }}>
            {[
              { label: "← HOME", action: () => navigate("/") },
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
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "80px 24px 60px" }}>
          <div style={{ display: "inline-block", backgroundColor: Y, color: B, border: `2px solid ${B}`, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "24px" }}>
            Upstrides PRESENTS
          </div>
          <h1 style={{ ...BEBAS, fontSize: "clamp(60px, 12vw, 140px)", lineHeight: 0.88, color: B, marginBottom: "20px" }}>
            THE CAREER<br /><span style={{ color: Y, WebkitTextStroke: `3px ${B}` }}>LAUNCHPAD</span>
          </h1>
          <p style={{ fontSize: "20px", fontWeight: 700, color: B, marginBottom: "12px", letterSpacing: "-0.01em" }}>
            2 Months. 8 Sessions. One complete transformation.
          </p>
          <p style={{ fontSize: "15px", color: MUTE, maxWidth: "600px", lineHeight: 1.8, marginBottom: "36px" }}>
            Six weeks from now, you could be fielding interview calls instead of sending applications into silence. 250+ students have done this before you. Now it's your turn.
          </p>

          {/* Phone CTA */}
          <div style={{ backgroundColor: Y, border: `3px solid ${B}`, boxShadow: `5px 5px 0 ${B}`, padding: "28px 32px", maxWidth: "560px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <Phone size={18} color={B} />
              <span style={{ fontSize: "12px", fontWeight: 700, color: B, letterSpacing: "0.12em" }}>WE WILL CALL YOU PERSONALLY</span>
            </div>
            <p style={{ fontSize: "13px", color: `${B}bb`, lineHeight: 1.6, marginBottom: "18px" }}>
              You're not just a lead — you're somebody, and you matter to Upstrides. Drop your number and we will call you. No scripts. No sales pitch. Just an honest conversation about your next move.
            </p>
            <form onSubmit={handlePhoneSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <input
                type="tel"
                placeholder="Your 10-digit number"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                disabled={isSubmitting}
                style={{ flex: 1, minWidth: "180px", padding: "13px 16px", border: `2px solid ${B}`, backgroundColor: W, fontSize: "14px", ...MONO, outline: "none", color: B }}
              />
              <button
                type="submit"
                disabled={isSubmitting || phoneNumber.length !== 10}
                style={{ padding: "13px 24px", backgroundColor: B, color: Y, border: `2px solid ${B}`, fontWeight: 700, fontSize: "13px", letterSpacing: "0.1em", ...MONO, cursor: phoneNumber.length === 10 && !isSubmitting ? "pointer" : "not-allowed", opacity: phoneNumber.length === 10 && !isSubmitting ? 1 : 0.6, transition: "all 0.15s" }}
              >
                {isSubmitting ? "SENDING..." : "GET MY CALL →"}
              </button>
            </form>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "12px" }}>
              {["We call personally", "Zero spam", "Within 24 hours"].map(t => (
                <span key={t} style={{ fontSize: "11px", color: `${B}99`, display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ color: B, fontWeight: 700 }}>✓</span> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ROADMAP ───────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: BG, padding: "80px 24px", borderBottom: `4px solid ${B}` }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <div style={{ display: "inline-block", backgroundColor: B, color: Y, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "20px" }}>THE 2-MONTH MAP</div>
            <h2 style={{ ...BEBAS, fontSize: "clamp(40px, 7vw, 80px)", color: B, lineHeight: 0.9, marginBottom: "16px" }}>
              WHAT HAPPENS<br /><span style={{ color: Y, WebkitTextStroke: `2px ${B}` }}>EACH SESSION</span>
            </h2>
            <p style={{ fontSize: "14px", color: MUTE, maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
              Every session exists for a specific reason. Nothing is filler. Everything builds toward one outcome: your first offer.
            </p>
          </div>

          {/* Vertical roadmap */}
          <div style={{ position: "relative" }}>
            {/* Spine line */}
            <div style={{ position: "absolute", left: "28px", top: "40px", bottom: "40px", width: "4px", backgroundColor: Y, border: `2px solid ${B}` }} className="hidden md:block" />

            {roadmap.map((session, i) => (
              <div
                key={i}
                style={{ display: "flex", gap: "32px", marginBottom: "24px", alignItems: "flex-start" }}
              >
                {/* Node */}
                <div className="hidden md:flex" style={{ flexShrink: 0, width: "60px", flexDirection: "column", alignItems: "center", paddingTop: "16px" }}>
                  <div style={{ width: "28px", height: "28px", backgroundColor: i % 2 === 0 ? Y : B, border: `3px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, position: "relative" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: i % 2 === 0 ? B : Y }}>{i + 1}</span>
                  </div>
                </div>

                {/* Card */}
                <div
                  style={{ flex: 1, backgroundColor: W, border: `2px solid ${B}`, boxShadow: `4px 4px 0 ${B}`, padding: "24px 28px", transition: "all 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translate(-2px,-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `6px 6px 0 ${B}`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `4px 4px 0 ${B}`; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                    <span style={{ backgroundColor: Y, color: B, border: `2px solid ${B}`, padding: "3px 10px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em" }}>{session.week}</span>
                    <h3 style={{ ...BEBAS, fontSize: "28px", color: B, lineHeight: 1 }}>{session.title}</h3>
                  </div>

                  {/* Why it exists */}
                  <p style={{ fontSize: "13px", color: MUTE, lineHeight: 1.7, marginBottom: "14px", borderLeft: `3px solid ${Y}`, paddingLeft: "12px", fontStyle: "italic" }}>
                    {session.why}
                  </p>

                  {/* What we cover */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }} className="grid-cols-1 sm:grid-cols-2">
                    {session.what.map((item, j) => (
                      <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                        <span style={{ color: B, fontSize: "12px", marginTop: "2px", flexShrink: 0 }}>▶</span>
                        <span style={{ fontSize: "12px", color: B, lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTAL ACCESS ─────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: B, padding: "80px 24px", borderBottom: `4px solid ${Y}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "start" }} className="grid-cols-1 md:grid-cols-2">
            <div>
              <div style={{ backgroundColor: Y, color: B, display: "inline-block", padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "20px" }}>
                WHAT YOU ALSO GET
              </div>
              <h2 style={{ ...BEBAS, fontSize: "clamp(40px, 6vw, 72px)", color: W, lineHeight: 0.9, marginBottom: "20px" }}>
                ACCESS TO THE<br /><span style={{ color: Y }}>PORTAL</span><br />500+ RESOURCES
              </h2>
              <p style={{ fontSize: "14px", color: `${W}99`, lineHeight: 1.8 }}>
                Every student in the program gets full portal access. This isn't a bonus — it's a career library built from years of helping students land real roles at real companies.
              </p>
            </div>

            <div>
              {portalHighlights.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 0", borderBottom: `1px solid ${W}18` }}>
                  <CheckCircle size={16} color={Y} style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span style={{ fontSize: "13px", color: `${W}dd`, lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT NO OTHER EDTECH DOES ─────────────────────────────────────── */}
      <section style={{ backgroundColor: Y, padding: "80px 24px", borderBottom: `4px solid ${B}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <div style={{ backgroundColor: B, color: Y, display: "inline-block", padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "20px" }}>
              SOMETHING NO OTHER EDTECH DOES
            </div>
            <h2 style={{ ...BEBAS, fontSize: "clamp(36px, 6vw, 72px)", color: B, lineHeight: 0.9, marginBottom: "16px" }}>
              WE DON'T JUST TEACH.<br />WE BUILD IT <span style={{ WebkitTextStroke: `2px ${B}`, color: Y }}>FOR YOU.</span>
            </h2>
            <p style={{ fontSize: "14px", color: `${B}99`, maxWidth: "520px", margin: "0 auto", lineHeight: 1.8 }}>
              Most programs give you information. We give you deliverables — actual assets you can use in your next application tomorrow.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            {guarantees.map((g, i) => (
              <div
                key={i}
                style={{ backgroundColor: W, border: `3px solid ${B}`, boxShadow: `5px 5px 0 ${B}`, padding: "28px", transition: "all 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translate(-3px,-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `8px 8px 0 ${B}`; (e.currentTarget as HTMLDivElement).style.backgroundColor = B; (e.currentTarget as HTMLDivElement).style.color = W; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `5px 5px 0 ${B}`; (e.currentTarget as HTMLDivElement).style.backgroundColor = W; (e.currentTarget as HTMLDivElement).style.color = B; }}
              >
                <div style={{ backgroundColor: Y, border: `2px solid ${B}`, display: "inline-block", padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "16px", color: B }}>
                  {g.tag}
                </div>
                <h3 style={{ ...BEBAS, fontSize: "26px", color: "inherit", lineHeight: 1, marginBottom: "10px" }}>{g.title}</h3>
                <p style={{ fontSize: "12px", color: "inherit", opacity: 0.75, lineHeight: 1.7 }}>{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: W, padding: "80px 24px", borderBottom: `4px solid ${B}` }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: Y, color: B, border: `2px solid ${B}`, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "24px" }}>
            <Star size={13} /> 250+ STUDENTS. 30+ OFFERS. ONE CONVERSATION.
          </div>
          <h2 style={{ ...BEBAS, fontSize: "clamp(44px, 8vw, 96px)", color: B, lineHeight: 0.88, marginBottom: "20px" }}>
            ONE CALL CAN<br /><span style={{ color: Y, WebkitTextStroke: `3px ${B}` }}>CHANGE</span><br />EVERYTHING.
          </h2>
          <p style={{ fontSize: "15px", color: MUTE, lineHeight: 1.8, marginBottom: "40px", maxWidth: "520px", margin: "0 auto 40px" }}>
            Drop your number. WE WILL CALL YOU PERSONALLY — no scripts, no pressure, no sales pitch. Just a real conversation about where you are and what the next 8 weeks could look like for you.
          </p>

          <div style={{ backgroundColor: Y, border: `3px solid ${B}`, boxShadow: `5px 5px 0 ${B}`, padding: "32px", maxWidth: "500px", margin: "0 auto" }}>
            <form onSubmit={handlePhoneSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
              <input
                type="tel"
                placeholder="Your 10-digit number"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                disabled={isSubmitting}
                style={{ flex: 1, minWidth: "180px", padding: "14px 16px", border: `2px solid ${B}`, backgroundColor: W, fontSize: "15px", ...MONO, outline: "none", color: B }}
              />
              <button
                type="submit"
                disabled={isSubmitting || phoneNumber.length !== 10}
                style={{ padding: "14px 28px", backgroundColor: B, color: Y, border: `2px solid ${B}`, fontWeight: 700, fontSize: "13px", letterSpacing: "0.1em", ...MONO, cursor: phoneNumber.length === 10 && !isSubmitting ? "pointer" : "not-allowed", opacity: phoneNumber.length === 10 && !isSubmitting ? 1 : 0.6 }}
              >
                {isSubmitting ? "SENDING..." : "GET MY CALL →"}
              </button>
            </form>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
              {["We call personally", "Zero spam", "Within 24 hours"].map(t => (
                <span key={t} style={{ fontSize: "11px", color: `${B}99`, display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ fontWeight: 700, color: B }}>✓</span> {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: B, borderTop: `4px solid ${Y}`, padding: "40px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src="/upstride-logo.png" alt="Upstrides" style={{ height: "28px", filter: "brightness(0) invert(1)" }} />
            <span style={{ ...BEBAS, fontSize: "22px", color: W, letterSpacing: "0.1em" }}>Upstrides</span>
          </div>
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            <a href="mailto:hello@upstrides.in" style={{ ...MONO, fontSize: "12px", color: Y, textDecoration: "none" }}>hello@upstrides.in</a>
            <span style={{ ...MONO, fontSize: "12px", color: `${W}55` }}>© 2026 Upstrides</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Programs;
