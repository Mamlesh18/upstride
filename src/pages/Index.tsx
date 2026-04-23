import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp, Phone, CalendarDays } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const Y = "#FFE500";   // yellow
const B = "#0A0A0A";   // black
const W = "#FAFAFA";   // white

const BEBAS: React.CSSProperties = { fontFamily: "'Bebas Neue', cursive" };
const MONO: React.CSSProperties  = { fontFamily: "'IBM Plex Mono', monospace" };

const BORDER: React.CSSProperties  = { border: `3px solid ${B}` };
const SHADOW: React.CSSProperties  = { boxShadow: `5px 5px 0 ${B}` };
const SHADOW_Y: React.CSSProperties = { boxShadow: `5px 5px 0 ${Y}` };

// ─────────────────────────────────────────────────────────────────────────────
// HOOK: useInView
// ─────────────────────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const roadmapData = [
  {
    year: "FRESHER",
    icon: "🎯",
    focus:  ["Understand what you actually want", "Stop comparing yourself to others", "Learn one skill deeply, not many shallowly"],
    avoid:  ["Chasing every trend at once", "Fake projects on resume", "Waiting for placement season to start"],
    build:  ["LinkedIn profile that doesn't look like everyone else's", "First ugly project (that's fine)", "A daily communication habit"],
    mindset: "6 months to go from zero → first real opportunity",
  },
  {
    year: "1ST YEAR",
    icon: "🔨",
    focus:  ["DSA fundamentals", "Pick your lane: AI / Web / Data / Design", "Build your first real (not tutorial) project"],
    avoid:  ["Skipping fundamentals for frameworks", "Tutorial hell loops", "Overthinking instead of shipping"],
    build:  ["GitHub with actual commits", "Simple portfolio site", "First internship application (even if rejected)"],
    mindset: "Foundation year — don't rush it. Bad foundations collapse later.",
  },
  {
    year: "2ND YEAR",
    icon: "⚡",
    focus:  ["Domain deep-dive", "Open source contributions (even small ones)", "Hackathons — don't wait to be 'ready'"],
    avoid:  ["CGPA obsession over skill building", "Saying no to imperfect opportunities", "Working in isolation"],
    build:  ["2–3 domain-specific projects with real use cases", "Research paper or internship experience", "Online presence with proof of work"],
    mindset: "Execution year — stop planning. Shipping beats perfecting.",
  },
  {
    year: "3RD YEAR",
    icon: "🚀",
    focus:  ["Internship hunting (start early)", "Resume as positioning, not just listing", "Interview prep with real mock sessions"],
    avoid:  ["Mass-applying without research", "Ignoring soft skills and communication", "Last-minute cramming"],
    build:  ["Internship (paid or unpaid — both count)", "Strong recommendation letters", "Domain authority online"],
    mindset: "Conversion year — everything you built starts paying dividends.",
  },
  {
    year: "4TH YEAR",
    icon: "🏆",
    focus:  ["Full-time offer strategy", "Salary negotiation (most students don't)", "Brand yourself intentionally"],
    avoid:  ["Settling for the first offer out of fear", "Undervaluing yourself", "Stopping to learn after placement"],
    build:  ["Full-time role with real growth potential", "Professional network that actually knows you", "Side income or project running in parallel"],
    mindset: "Harvest year — own the narrative. You wrote this story.",
  },
];

const testimonials = [
  { name: "Shrusti", review: "The Experience Selling Bootcamp completely changed my perspective. Mock interviews and LinkedIn strategies helped me land my internship!", rating: 5, linkedin: "https://www.linkedin.com/in/shrusti-d-bhujange-834515382/" },
  { name: "Divya",   review: "'Resume vs Reality' was eye-opening. I got placed within a month of completing the bootcamp. The mentors showed me exactly what HR actually wants.", rating: 5, linkedin: "https://www.linkedin.com/in/divya-sood-8b205b374/" },
  { name: "Jessica", review: "Project ideation sessions were game-changers. I built a portfolio that actually stands out — not just another to-do app.", rating: 5, linkedin: "https://www.linkedin.com/in/jessica-c7684/" },
  { name: "Praneeth", review: "From time management to top 1% coder mindset — this covers everything. Guest talks were invaluable and very real.", rating: 5, linkedin: "https://www.linkedin.com/in/praneeth-v-p/" },
  { name: "Uwais",   review: "Best decision I made for my career. Got my full-time offer DURING the bootcamp itself. Couldn't believe it happened that fast.", rating: 5, linkedin: "https://www.linkedin.com/in/mohammed-uwais-58892132b/" },
];

const faqs = [
  {
    q: "What if I have zero skills?",
    a: "Perfect starting point. Upstride was built exactly for that. You don't need skills — you need a direction and a system. We give you both.",
  },
  {
    q: "Do I need to be from a top college?",
    a: "No. We've seen students from tier-3 colleges outperform IIT graduates because they had clarity and execution. Your college doesn't define you. Your actions do.",
  },
  {
    q: "What if I fail?",
    a: "You will. Multiple times. That's part of the system. What Upstride does is reduce the number of times you fail blindly — because most failures are avoidable with the right information.",
  },
  {
    q: "What exactly is BYOM?",
    a: "Bring Your Own Money. You decide what you pay. We don't believe financial capability should gatekeep career knowledge. If you can afford more, you pay more. If you can't, you still get in.",
  },
  {
    q: "Is this for any branch — not just CS?",
    a: "Yes. CS, ECE, Mechanical, Civil — doesn't matter. The principles of building a career are the same. Only the domain-specific content changes.",
  },
  {
    q: "How is this different from other courses?",
    a: "Most courses sell information. We sell transformation. The difference is accountability, personalization, and honest mentorship — not a certificate at the end.",
  },
];

const colleges = [
  "VIT Vellore", "SRM Ramapuram", "Saveetha University",
  "Kongunadu Arts & Science", "NBKRIST", "SRM AP",
  "Sathyabama University", "Amrita Chennai", "Vel Tech",
];

const achievements = [
  { stat: "250+", label: "Students Trained" },
  { stat: "30+",  label: "Internships & Full-Time Offers" },
  { stat: "5+",   label: "Hackathons Won" },
  { stat: "6+",   label: "Colleges Visited" },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [mobileMenuOpen, setMobileMenuOpen]   = useState(false);
  const [openFaq, setOpenFaq]                 = useState<number | null>(null);
  const [heroLoaded, setHeroLoaded]           = useState(false);
  const [phoneNumber, setPhoneNumber]         = useState("");
  const [isSubmitting, setIsSubmitting]       = useState(false);

  interface LiveEvent { id: string; title: string; location: string; date: string; description: string; image_data: string | null; image_type: string | null; }
  const [liveEvents, setLiveEvents]           = useState<LiveEvent[]>([]);

  useEffect(() => {
    api.events.getUpcoming().then((r: unknown) => {
      const res = r as { data: { events: LiveEvent[] } };
      setLiveEvents(res.data.events);
    }).catch(() => { /* silent — shows fallback */ });
  }, []);

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
          subject: "🔥 New Call Request - UPSTRIDE Homepage",
          from_name: "UPSTRIDE Website",
          to: "mamlesh.va06@gmail.com",
          phone: phoneNumber,
          message: `📞 NEW CALL REQUEST\nPhone: ${phoneNumber}\nDate: ${dateTime}\nSource: Homepage Hero`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: "You're on the list!", description: "Mamlesh will call you personally within 24 hours." });
        setPhoneNumber("");
      } else throw new Error();
    } catch {
      toast({ title: "Failed", description: "Please try again or email mamlesh@upstrides.in", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  const [nodeVisible, setNodeVisible]         = useState<boolean[]>(roadmapData.map(() => false));
  const [activeNode, setActiveNode]           = useState<number | null>(null);
  const nodeRefs                              = useRef<(HTMLDivElement | null)[]>([]);

  // Section in-view hooks
  const eventSec    = useInView(0.1);
  const roadmapSec  = useInView(0.05);
  const whatSec     = useInView(0.1);
  const teamSec     = useInView(0.1);
  const whySec      = useInView(0.1);
  const testSec     = useInView(0.1);
  const faqSec      = useInView(0.1);
  const achSec      = useInView(0.1);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Observe roadmap nodes individually
  useEffect(() => {
    const observers = nodeRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setNodeVisible(prev => { const n = [...prev]; n[i] = true; return n; });
          }
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  // Helpers
  const navBtn = (label: string, action: () => void, highlight = false) => (
    <button
      key={label}
      onClick={action}
      style={{
        padding: "16px 28px",
        fontWeight: 700,
        fontSize: "12px",
        letterSpacing: "0.15em",
        borderLeft: `3px solid ${B}`,
        background: highlight ? B : "transparent",
        color: highlight ? Y : B,
        cursor: "pointer",
        transition: "all 0.15s",
        ...MONO,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.backgroundColor = highlight ? W : B;
        el.style.color           = highlight ? B : Y;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.backgroundColor = highlight ? B : "transparent";
        el.style.color           = highlight ? Y : B;
      }}
    >
      {label}{highlight ? " →" : ""}
    </button>
  );

  const visibleCount = nodeVisible.filter(Boolean).length;

  return (
    <div style={{ ...MONO, backgroundColor: W, color: B, overflowX: "hidden" }}>

      {/* ================================================================
          HEADER
          ================================================================ */}
      <header style={{ backgroundColor: Y, position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000, borderBottom: `4px solid ${B}` }}>
        <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "stretch", maxWidth: "1400px", margin: "0 auto" }}>
          {/* Logo */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 24px", cursor: "pointer", borderRight: `3px solid ${B}` }}
            onClick={() => navigate("/")}
          >
            <img src="/upstride-logo.png" alt="Upstride" style={{ height: "36px", width: "36px", objectFit: "contain" }} />
            <span style={{ ...BEBAS, fontSize: "28px", letterSpacing: "0.1em", color: B }}>UPSTRIDE</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex" style={{ alignItems: "stretch" }}>
            {navBtn("PORTAL", () => navigate("/login"), true)}
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden"
            style={{ padding: "16px 20px", background: "transparent", border: "none", borderLeft: `3px solid ${B}`, cursor: "pointer" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} color={B} /> : <Menu size={24} color={B} />}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div style={{ borderTop: `3px solid ${B}` }}>
            <button onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
              style={{ display: "block", width: "100%", padding: "16px 24px", textAlign: "left", fontWeight: 700, fontSize: "12px", letterSpacing: "0.15em", backgroundColor: B, color: Y, cursor: "pointer", ...MONO }}
            >PORTAL →</button>
          </div>
        )}
      </header>

      {/* ================================================================
          HERO
          ================================================================ */}
      <section style={{ minHeight: "100vh", paddingTop: "80px", backgroundColor: W, position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}>
        {/* Grid BG */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${B}18 1px, transparent 1px), linear-gradient(90deg, ${B}18 1px, transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none" }} />

        {/* Floating yellow squares */}
        <div style={{ position: "absolute", top: "8%", right: "-80px", width: "340px", height: "340px", backgroundColor: Y, border: `4px solid ${B}`, animation: "brutBounce 5s ease-in-out infinite", opacity: 0.55, zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: "6%", left: "-60px", width: "180px", height: "180px", backgroundColor: Y, border: `4px solid ${B}`, animation: "brutBounce 7s ease-in-out infinite reverse", opacity: 0.35, zIndex: 0 }} />
        <div style={{ position: "absolute", top: "55%", right: "12%", width: "80px", height: "80px", backgroundColor: B, animation: "brutBounce 3.5s ease-in-out infinite 1s", zIndex: 0 }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 24px", position: "relative", zIndex: 1, width: "100%" }}>
          {/* Badge */}
          <div style={{ display: "inline-block", backgroundColor: B, color: Y, padding: "8px 18px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.25em", marginBottom: "28px", opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "translateY(0)" : "translateY(20px)", transition: "all 0.4s 0.1s ease", ...MONO }}>
            ★ INDIA'S 1ST BYOM PLATFORM ★
          </div>

          {/* Main headline — animated letters */}
          <h1 style={{ ...BEBAS, fontSize: "clamp(56px, 11vw, 152px)", lineHeight: 0.88, marginBottom: "20px", color: B }}>
            {"BRING YOUR".split("").map((ch, i) => (
              <span key={i} style={{ display: "inline-block", opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "translateY(0) rotate(0deg)" : "translateY(70px) rotate(-8deg)", transition: `all 0.45s ${i * 0.022}s cubic-bezier(0.34, 1.56, 0.64, 1)` }}>
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
            <br />
            {"OWN MONEY".split("").map((ch, i) => (
              <span key={i} style={{ display: "inline-block", color: Y, WebkitTextStroke: `3px ${B}`, opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "scale(1) rotate(0deg)" : "scale(0) rotate(20deg)", transition: `all 0.5s ${0.28 + i * 0.034}s cubic-bezier(0.34, 1.56, 0.64, 1)` }}>
                {ch === " " ? "\u00A0" : ch}
              </span>
            ))}
          </h1>

          {/* BYOM pill */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "14px", backgroundColor: Y, border: `4px solid ${B}`, ...SHADOW, padding: "14px 28px", marginBottom: "32px", opacity: heroLoaded ? 1 : 0, transition: "all 0.4s 0.75s ease" }}>
            <span style={{ ...BEBAS, fontSize: "52px", color: B, letterSpacing: "0.08em" }} className="brut-flicker">BYOM</span>
            <div style={{ width: "3px", height: "44px", backgroundColor: B }} />
            <span style={{ fontSize: "11px", fontWeight: 700, maxWidth: "220px", lineHeight: 1.5, letterSpacing: "0.05em" }}>
              STUDENTS PAY WHAT THEY'RE COMFORTABLE WITH.<br />
              BUILT FROM PASSION, NOT PROFIT.
            </span>
          </div>

          <p style={{ fontSize: "15px", maxWidth: "540px", lineHeight: 1.8, color: `${B}bb`, marginBottom: "44px", opacity: heroLoaded ? 1 : 0, transition: "all 0.4s 0.95s ease" }}>
            We're not a course factory. We're a mission — built from the frustration of watching capable students fail due to information gaps that should never exist in the first place.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", opacity: heroLoaded ? 1 : 0, transition: "all 0.4s 1.15s ease", marginBottom: "36px" }}>
            {[
              { label: "EXPLORE PROGRAMS →", bg: B, color: Y, shadow: SHADOW_Y, action: () => navigate("/programs") },
              { label: "ACCESS PORTAL",       bg: Y, color: B, shadow: SHADOW,   action: () => navigate("/login") },
            ].map(({ label, bg, color, shadow, action }) => (
              <button key={label} onClick={action}
                style={{ backgroundColor: bg, color, padding: "16px 32px", fontWeight: 700, fontSize: "13px", letterSpacing: "0.12em", border: `3px solid ${B}`, ...shadow, cursor: "pointer", transition: "all 0.15s", ...MONO }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(-3px,-3px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `8px 8px 0 ${bg === B ? Y : B}`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = shadow.boxShadow as string; }}
              >{label}</button>
            ))}
          </div>

          {/* Phone CTA */}
          <div style={{ opacity: heroLoaded ? 1 : 0, transition: "all 0.4s 1.3s ease", maxWidth: "540px" }}>
            <div style={{ backgroundColor: Y, border: `3px solid ${B}`, ...SHADOW, padding: "24px 28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <Phone size={18} color={B} />
                <span style={{ ...MONO, fontSize: "12px", fontWeight: 700, color: B, letterSpacing: "0.12em" }}>
                  MAMLESH WILL CALL YOU PERSONALLY
                </span>
              </div>
              <p style={{ ...MONO, fontSize: "13px", color: `${B}bb`, lineHeight: 1.6, marginBottom: "16px" }}>
                You're not just a lead — you're somebody now, and you matter to Upstride. Drop your number and Mamlesh will call you himself. No scripts. No sales pitch. Just a real conversation about your next move.
              </p>
              <form onSubmit={handlePhoneSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <input
                  type="tel"
                  placeholder="Your 10-digit number"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  disabled={isSubmitting}
                  style={{ flex: 1, minWidth: "180px", padding: "12px 16px", border: `2px solid ${B}`, backgroundColor: W, fontSize: "14px", ...MONO, outline: "none", color: B }}
                />
                <button
                  type="submit"
                  disabled={isSubmitting || phoneNumber.length !== 10}
                  style={{ padding: "12px 24px", backgroundColor: B, color: Y, border: `2px solid ${B}`, fontWeight: 700, fontSize: "13px", letterSpacing: "0.1em", ...MONO, cursor: phoneNumber.length === 10 && !isSubmitting ? "pointer" : "not-allowed", opacity: phoneNumber.length === 10 && !isSubmitting ? 1 : 0.6, transition: "all 0.15s" }}
                >
                  {isSubmitting ? "SENDING..." : "GET MY CALL →"}
                </button>
              </form>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "12px" }}>
                {["Founder calls personally", "Zero spam", "Within 24 hours"].map(t => (
                  <span key={t} style={{ ...MONO, fontSize: "11px", color: `${B}99`, display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ color: B, fontWeight: 700 }}>✓</span> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          MARQUEE BAND
          ================================================================ */}
      <div style={{ backgroundColor: B, borderTop: `4px solid ${B}`, borderBottom: `4px solid ${B}`, padding: "14px 0", overflow: "hidden" }}>
        <div className="brut-marquee" style={{ gap: "0" }}>
          {[...Array(2)].map((_, rep) => (
            <div key={rep} style={{ display: "flex", alignItems: "center", gap: "0" }}>
              {["BYOM", "●", "INDIA'S 1ST", "●", "CAREER CLARITY", "●", "NOT A COURSE", "●", "250+ STUDENTS", "●", "REAL RESULTS", "●", "UPSTRIDE", "●"].map((item, i) => (
                <span key={i} style={{ ...BEBAS, fontSize: "22px", color: i % 2 === 1 ? Y : W, padding: "0 24px", letterSpacing: "0.12em", whiteSpace: "nowrap" }}>{item}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================
          UPCOMING EVENTS (dynamic from MongoDB)
          ================================================================ */}
      {liveEvents.length > 0 && liveEvents.map((ev, i) => {
        const dateStr = (() => { try { return new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }); } catch { return ev.date; } })();
        const isFirst = i === 0;
        return (
          <section key={ev.id} ref={isFirst ? eventSec.ref : undefined} style={{ backgroundColor: B, padding: "100px 24px", overflow: "hidden", borderTop: i > 0 ? `2px solid ${Y}22` : "none" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "32px" : "60px", alignItems: "center" }}>

              {/* Left: Text */}
              <div style={{ opacity: 1, transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
                <div style={{ backgroundColor: Y, color: B, display: "inline-block", padding: "6px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "24px", ...MONO }}>
                  UPCOMING EVENT
                </div>
                <h2 style={{ ...BEBAS, fontSize: "clamp(36px, 6vw, 80px)", color: W, lineHeight: 0.92, marginBottom: "20px" }}>
                  UPSTRIDE IS<br />
                  <span style={{ color: Y }}>COMING TO</span><br />
                  {ev.location.toUpperCase()}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "28px" }}>
                  <div style={{ backgroundColor: Y, border: `3px solid ${Y}`, display: "inline-block", padding: "10px 20px", ...MONO }}>
                    <span style={{ fontWeight: 700, fontSize: "14px", color: B }}>📅 {dateStr.toUpperCase()}</span>
                  </div>
                  <a
                    href="https://jumbled-otter-c02.notion.site/74c1902d7b3a42a59ecb9dcca6cdf7e9?pvs=105"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "inline-block", backgroundColor: Y, color: B, padding: "10px 22px", fontWeight: 700, fontSize: "13px", letterSpacing: "0.1em", border: `3px solid ${Y}`, boxShadow: `4px 4px 0 ${Y}`, textDecoration: "none", ...MONO, transition: "transform 0.15s, box-shadow 0.15s" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translate(-2px,-2px)"; el.style.boxShadow = `6px 6px 0 ${Y}`; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translate(0,0)"; el.style.boxShadow = `4px 4px 0 ${Y}`; }}
                  >
                    REGISTER NOW →
                  </a>
                </div>
                {ev.title && (
                  <h3 style={{ ...BEBAS, fontSize: "clamp(22px, 3.5vw, 42px)", color: W, marginBottom: "16px", lineHeight: 1 }}>
                    "{ev.title}"
                  </h3>
                )}
                {ev.description && (
                  <p style={{ color: `${W}99`, fontSize: "14px", lineHeight: 1.8, maxWidth: "420px" }}>
                    {ev.description}
                  </p>
                )}
              </div>

              {/* Right: Image */}
              <div style={{ opacity: 1, transition: "all 0.6s 0.2s cubic-bezier(0.16,1,0.3,1)" }}>
                <div style={{ border: `4px solid ${Y}`, boxShadow: `-8px 8px 0 ${Y}`, position: "relative", overflow: "hidden" }}>
                  {ev.image_data ? (
                    <img src={`data:${ev.image_type};base64,${ev.image_data}`} alt={ev.title}
                      style={{ width: "100%", display: "block", objectFit: "contain", backgroundColor: B }} />
                  ) : (
                    <div style={{ width: "100%", aspectRatio: "4/3", backgroundColor: `${Y}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CalendarDays size={64} color={Y} />
                    </div>
                  )}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 20px", backgroundColor: `${B}dd` }}>
                    <span style={{ ...BEBAS, color: Y, fontSize: "18px", letterSpacing: "0.1em" }}>
                      {ev.location.toUpperCase()} — {dateStr.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </section>
        );
      })}

      {/* ================================================================
          ROADMAP TO UPSKILL
          ================================================================ */}
      <section ref={roadmapSec.ref} style={{ backgroundColor: W, padding: "100px 24px", position: "relative", overflow: "hidden" }}>
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "80px", opacity: roadmapSec.inView ? 1 : 0, transform: roadmapSec.inView ? "translateY(0)" : "translateY(40px)", transition: "all 0.5s ease" }}>
          <div style={{ backgroundColor: B, color: Y, display: "inline-block", padding: "8px 20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "20px", ...MONO }}>
            THE ROADMAP
          </div>
          <h2 style={{ ...BEBAS, fontSize: "clamp(48px, 9vw, 120px)", color: B, lineHeight: 0.9 }}>
            ROADMAP TO<br /><span style={{ color: Y, WebkitTextStroke: `3px ${B}` }}>UPSKILL</span>
          </h2>
          <p style={{ ...MONO, fontSize: "14px", color: `${B}99`, maxWidth: "500px", margin: "20px auto 0", lineHeight: 1.7 }}>
            A year-by-year execution guide. Not generic advice. Built from watching hundreds of students succeed and fail.
          </p>
        </div>

        {/* Timeline */}
        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
          {/* Vertical line */}
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "4px", backgroundColor: `${B}22`, transform: "translateX(-50%)" }} className="hidden md:block" />
          <div
            style={{ position: "absolute", left: "50%", top: 0, width: "4px", backgroundColor: Y, border: `2px solid ${B}`, transform: "translateX(-50%)", height: `${(visibleCount / roadmapData.length) * 100}%`, transition: "height 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}
            className="hidden md:block"
          />

          {/* Nodes */}
          {roadmapData.map((item, i) => {
            const isLeft = i % 2 === 0;
            const visible = nodeVisible[i];
            return (
              <div
                key={i}
                ref={el => { nodeRefs.current[i] = el; }}
                style={{ display: "flex", flexDirection: isMobile ? "column" : (isLeft ? "row" : "row-reverse"), gap: isMobile ? "0" : "40px", marginBottom: "60px", alignItems: "flex-start", opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : `translateX(${isLeft ? "-60px" : "60px"})`, transition: `all 0.6s ${i * 0.1}s cubic-bezier(0.16, 1, 0.3, 1)` }}
              >
                {/* Card */}
                <div
                  style={{ flex: 1, backgroundColor: activeNode === i ? Y : W, border: `3px solid ${B}`, ...SHADOW, padding: "28px", cursor: "pointer", transition: "all 0.2s" }}
                  onClick={() => setActiveNode(activeNode === i ? null : i)}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translate(-3px,-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `8px 8px 0 ${B}`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `5px 5px 0 ${B}`; }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <span style={{ ...BEBAS, fontSize: "36px", color: B }}>{item.icon} {item.year}</span>
                    {activeNode === i ? <ChevronUp size={20} color={B} /> : <ChevronDown size={20} color={B} />}
                  </div>
                  <div style={{ backgroundColor: B, color: Y, display: "inline-block", padding: "4px 12px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "12px", ...MONO }}>
                    {item.mindset}
                  </div>

                  {activeNode === i && (
                    <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: "16px" }}>
                      {[
                        { title: "✅ FOCUS ON", items: item.focus, bg: B, fg: Y },
                        { title: "❌ AVOID",    items: item.avoid, bg: Y, fg: B },
                        { title: "🔨 BUILD",    items: item.build, bg: W, fg: B },
                      ].map(({ title, items, bg, fg }) => (
                        <div key={title} style={{ backgroundColor: bg, border: `2px solid ${B}`, padding: "14px" }}>
                          <div style={{ ...MONO, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", color: fg, marginBottom: "10px" }}>{title}</div>
                          {items.map((item, j) => (
                            <div key={j} style={{ ...MONO, fontSize: "11px", color: fg, marginBottom: "6px", lineHeight: 1.5 }}>— {item}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Center dot */}
                <div className="hidden md:flex" style={{ flexShrink: 0, width: "24px", alignItems: "flex-start", justifyContent: "center", paddingTop: "16px" }}>
                  <div style={{ width: "20px", height: "20px", backgroundColor: visible ? Y : `${B}33`, border: `3px solid ${B}`, transition: "all 0.4s", transform: visible ? "scale(1)" : "scale(0)" }} />
                </div>

                {/* Spacer for opposite side */}
                <div style={{ flex: 1 }} className="hidden md:block" />
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================================
          WHAT WE DO + ACHIEVEMENTS
          ================================================================ */}
      <section ref={whatSec.ref} style={{ backgroundColor: Y, padding: "100px 24px", borderTop: `4px solid ${B}`, borderBottom: `4px solid ${B}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ opacity: whatSec.inView ? 1 : 0, transform: whatSec.inView ? "translateY(0)" : "translateY(40px)", transition: "all 0.5s ease", marginBottom: "60px" }}>
            <div style={{ backgroundColor: B, color: Y, display: "inline-block", padding: "8px 20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "20px", ...MONO }}>
              WHAT WE DO
            </div>
            <h2 style={{ ...BEBAS, fontSize: "clamp(48px, 8vw, 110px)", color: B, lineHeight: 0.9, maxWidth: "800px" }}>
              WE DON'T SELL<br />COURSES.<br /><span style={{ WebkitTextStroke: `3px ${B}`, color: Y }}>WE SELL</span><br />EXPERIENCE.
            </h2>
            <p style={{ ...MONO, fontSize: "15px", color: `${B}cc`, maxWidth: "560px", lineHeight: 1.8, marginTop: "24px" }}>
              Upstride exists to close the gap between what colleges teach and what companies actually need. We do this through mentorship, community, and a model where your financial situation doesn't decide your future.
            </p>
          </div>

          {/* Achievements grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            {achievements.map((a, i) => (
              <div
                key={i}
                style={{ backgroundColor: W, border: `3px solid ${B}`, ...SHADOW, padding: "32px 28px", opacity: whatSec.inView ? 1 : 0, transform: whatSec.inView ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)", transition: `all 0.5s ${i * 0.08}s cubic-bezier(0.34, 1.56, 0.64, 1)`, cursor: "default" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translate(-3px,-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `8px 8px 0 ${B}`; (e.currentTarget as HTMLDivElement).style.backgroundColor = B; (e.currentTarget as HTMLDivElement).style.color = Y; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `5px 5px 0 ${B}`; (e.currentTarget as HTMLDivElement).style.backgroundColor = W; (e.currentTarget as HTMLDivElement).style.color = B; }}
              >
                <div style={{ ...BEBAS, fontSize: "64px", color: "inherit", lineHeight: 1 }}>{a.stat}</div>
                <div style={{ ...MONO, fontSize: "12px", fontWeight: 600, letterSpacing: "0.1em", color: "inherit", marginTop: "8px" }}>{a.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          RECOGNITIONS
          ================================================================ */}
      <section ref={achSec.ref} style={{ backgroundColor: W, padding: "80px 24px", borderBottom: `4px solid ${B}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px", opacity: achSec.inView ? 1 : 0, transform: achSec.inView ? "translateY(0)" : "translateY(30px)", transition: "all 0.5s ease" }}>
            <h3 style={{ ...BEBAS, fontSize: "clamp(32px, 5vw, 64px)", color: B }}>RECOGNIZED BY</h3>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0", border: `3px solid ${B}` }}>
            {[
              { name: "VIT", src: "/vit.jpg" },
              { name: "Saveetha", src: "/saveetha.gif" },
              { name: "Kongunadu", src: "/kongunadu.png" },
              { name: "SRM AP", src: "/srm-ap.png" },
              { name: "SRM IST", src: "/srm-ist-logo.jpg" },
              { name: "NBKRIST", src: "/NBKRIST_logo.png" },
            ].map((r, i) => (
              <div
                key={i}
                style={{ flex: "1 1 160px", borderRight: i < 5 ? `3px solid ${B}` : "none", borderBottom: `3px solid ${B}`, padding: "28px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", opacity: achSec.inView ? 1 : 0, transition: `all 0.4s ${i * 0.07}s ease`, backgroundColor: W }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = Y; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.backgroundColor = W; }}
              >
                <img src={r.src} alt={r.name} style={{ height: "50px", objectFit: "contain", filter: "grayscale(100%)", mixBlendMode: "multiply" }} />
                <span style={{ ...MONO, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", color: B }}>{r.name.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          MEET THE TEAM — MAMLESH
          ================================================================ */}
      <section ref={teamSec.ref} style={{ backgroundColor: B, padding: "100px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "16px", opacity: teamSec.inView ? 1 : 0, transition: "all 0.4s ease" }}>
            <div style={{ backgroundColor: Y, color: B, display: "inline-block", padding: "8px 20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", ...MONO }}>MEET THE FOUNDER</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "32px" : "60px", alignItems: "center" }}>
            {/* Left: Portrait */}
            <div style={{ opacity: teamSec.inView ? 1 : 0, transform: teamSec.inView ? "translateX(0)" : "translateX(-60px)", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
              <div style={{ border: `4px solid ${Y}`, ...{ boxShadow: `8px 8px 0 ${Y}` }, position: "relative", backgroundColor: `${Y}22` }}>
                <img src="/Profile_Picture_Mamlesh.png" alt="Mamlesh" style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", objectPosition: "top", display: "block" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: Y, padding: "14px 20px", borderTop: `4px solid ${Y}` }}>
                  <span style={{ ...BEBAS, fontSize: "32px", color: B }}>MAMLESH</span>
                </div>
              </div>
            </div>

            {/* Right: Info */}
            <div style={{ opacity: teamSec.inView ? 1 : 0, transform: teamSec.inView ? "translateX(0)" : "translateX(60px)", transition: "all 0.6s 0.2s cubic-bezier(0.16,1,0.3,1)" }}>
              <h2 style={{ ...BEBAS, fontSize: "clamp(56px, 8vw, 100px)", color: W, lineHeight: 0.88, marginBottom: "32px" }}>
                THE GUY<br />BEHIND<br /><span style={{ color: Y }}>ALL OF<br />THIS.</span>
              </h2>

              {/* Stats newspaper style */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", border: `3px solid ${Y}`, marginBottom: "32px" }}>
                {[
                  { stat: "10x", label: "Internships" },
                  { stat: "4x",  label: "Research Papers" },
                  { stat: "2x",  label: "Patents Filed" },
                  { stat: "1x",  label: "Singapore Consultancy Lead" },
                ].map(({ stat, label }, i) => (
                  <div key={i} style={{ padding: "20px", borderRight: i % 2 === 0 ? `2px solid ${Y}` : "none", borderBottom: i < 2 ? `2px solid ${Y}` : "none" }}>
                    <div style={{ ...BEBAS, fontSize: "44px", color: Y }}>{stat}</div>
                    <div style={{ ...MONO, fontSize: "11px", color: `${W}aa`, letterSpacing: "0.1em" }}>{label.toUpperCase()}</div>
                  </div>
                ))}
              </div>

              <p style={{ ...MONO, fontSize: "13px", color: `${W}bb`, lineHeight: 1.8 }}>
                AI Team Lead at a Singapore-based consultancy. Business owner. Multiple-time researcher. The kind of student most colleges never produce — not because of talent, but because of access to the right information at the right time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          WHY AM I DOING THIS — Personal Letter
          ================================================================ */}
      <section ref={whySec.ref} style={{ backgroundColor: Y, padding: "100px 24px", borderTop: `4px solid ${B}`, borderBottom: `4px solid ${B}` }}>
        <div style={{ maxWidth: "780px", margin: "0 auto" }}>
          <div style={{ opacity: whySec.inView ? 1 : 0, transform: whySec.inView ? "translateY(0)" : "translateY(40px)", transition: "all 0.5s ease" }}>
            <div style={{ backgroundColor: B, color: Y, display: "inline-block", padding: "6px 14px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "32px", ...MONO }}>
              A PERSONAL NOTE
            </div>
          </div>

          <div
            style={{ backgroundColor: W, border: `4px solid ${B}`, ...SHADOW, padding: "40px 48px", opacity: whySec.inView ? 1 : 0, transform: whySec.inView ? "rotate(0deg)" : "rotate(-2deg)", transition: "all 0.6s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
          >
            {/* Pin effect */}
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: Y, border: `3px solid ${B}`, margin: "0 auto 24px", ...SHADOW }} />

            <h2 style={{ ...BEBAS, fontSize: "clamp(36px, 5vw, 64px)", color: B, lineHeight: 1, marginBottom: "28px" }}>
              WHY AM I<br />DOING THIS?
            </h2>

            <div style={{ ...MONO, fontSize: "14px", lineHeight: 1.9, color: `${B}dd` }}>
              <p style={{ marginBottom: "20px" }}>
                Not too long ago, I was the student who had potential but no clarity. I watched people around me get opportunities not because they were smarter — but because they knew things I didn't.
              </p>
              <p style={{ marginBottom: "20px" }}>
                I figured it out eventually. But I wasted time I didn't need to waste. Made mistakes that were completely avoidable. Missed opportunities because nobody told me they existed.
              </p>
              <p style={{ marginBottom: "20px" }}>
                Most students don't figure it out in time. That gap — between knowing and not knowing — is why Upstride exists.
              </p>
              <p style={{ fontWeight: 700, color: B }}>
                This isn't a business first. It's a mission first. The business part just makes it sustainable.
              </p>
            </div>

            <div style={{ borderTop: `2px solid ${B}`, marginTop: "28px", paddingTop: "20px", display: "flex", justifyContent: "flex-end" }}>
              <span style={{ ...BEBAS, fontSize: "28px", color: B }}>— Mamlesh</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          TESTIMONIALS
          ================================================================ */}
      <section ref={testSec.ref} style={{ backgroundColor: W, padding: "100px 24px", borderBottom: `4px solid ${B}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px", opacity: testSec.inView ? 1 : 0, transform: testSec.inView ? "translateY(0)" : "translateY(30px)", transition: "all 0.5s ease" }}>
            <div style={{ backgroundColor: B, color: Y, display: "inline-block", padding: "8px 20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "20px", ...MONO }}>WHAT STUDENTS SAY</div>
            <h2 style={{ ...BEBAS, fontSize: "clamp(44px, 7vw, 96px)", color: B, lineHeight: 0.9 }}>
              REAL WORDS.<br /><span style={{ color: Y, WebkitTextStroke: `3px ${B}` }}>REAL PEOPLE.</span>
            </h2>
          </div>

          {/* Brutalist testimonial grid — intentionally uneven */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {testimonials.map((t, i) => {
              const rotations = ["-1deg", "1.5deg", "-0.5deg", "1deg", "-1.5deg"];
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: i % 3 === 0 ? B : i % 3 === 1 ? Y : W,
                    color:           i % 3 === 0 ? W : B,
                    border: `3px solid ${B}`,
                    ...SHADOW,
                    padding: "28px",
                    transform: `rotate(${rotations[i]})`,
                    opacity: testSec.inView ? 1 : 0,
                    transition: `all 0.5s ${i * 0.1}s cubic-bezier(0.34, 1.56, 0.64, 1)`,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "rotate(0deg) translate(-3px,-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `8px 8px 0 ${B}`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = `rotate(${rotations[i]})`; (e.currentTarget as HTMLDivElement).style.boxShadow = `5px 5px 0 ${B}`; }}
                >
                  {/* Stars */}
                  <div style={{ marginBottom: "12px" }}>
                    {"★".repeat(t.rating).split("").map((s, j) => (
                      <span key={j} style={{ color: i % 3 === 0 ? Y : B, fontSize: "16px" }}>{s}</span>
                    ))}
                  </div>
                  <p style={{ ...MONO, fontSize: "13px", lineHeight: 1.7, marginBottom: "20px" }}>
                    "{t.review}"
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ ...BEBAS, fontSize: "24px" }}>{t.name.toUpperCase()}</span>
                    <a href={t.linkedin} target="_blank" rel="noopener noreferrer"
                      style={{ ...MONO, fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textDecoration: "none", color: "inherit", opacity: 0.7 }}
                    >LI →</a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================
          FAQ
          ================================================================ */}
      <section ref={faqSec.ref} style={{ backgroundColor: B, padding: "100px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px", opacity: faqSec.inView ? 1 : 0, transform: faqSec.inView ? "translateY(0)" : "translateY(30px)", transition: "all 0.5s ease" }}>
            <div style={{ backgroundColor: Y, color: B, display: "inline-block", padding: "8px 20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "20px", ...MONO }}>
              THE REAL QUESTIONS
            </div>
            <h2 style={{ ...BEBAS, fontSize: "clamp(44px, 7vw, 96px)", color: W, lineHeight: 0.9 }}>
              YOU'RE<br />THINKING IT.<br /><span style={{ color: Y }}>WE'LL SAY IT.</span>
            </h2>
          </div>

          {/* FAQ items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderTop: i === 0 ? `3px solid ${Y}` : "none", borderBottom: `3px solid ${Y}`, borderLeft: `3px solid ${Y}`, borderRight: `3px solid ${Y}` }}>
                <button
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 28px", background: openFaq === i ? Y : "transparent", cursor: "pointer", transition: "background 0.15s", ...MONO }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span style={{ fontWeight: 700, fontSize: "14px", color: openFaq === i ? B : W, textAlign: "left", letterSpacing: "0.05em" }}>
                    {faq.q}
                  </span>
                  {openFaq === i
                    ? <ChevronUp size={20} color={B} style={{ flexShrink: 0 }} />
                    : <ChevronDown size={20} color={Y} style={{ flexShrink: 0 }} />
                  }
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 28px 24px", backgroundColor: `${Y}22` }}>
                    <p style={{ ...MONO, fontSize: "13px", color: `${W}cc`, lineHeight: 1.8 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          PRE-FOOTER — Giant UPSTRIDE
          ================================================================ */}
      <section style={{ backgroundColor: W, padding: "60px 0", borderBottom: `4px solid ${B}`, overflow: "hidden", position: "relative" }}>
        <div style={{ backgroundColor: Y, border: `4px solid ${B}`, display: "inline-block", padding: "8px 20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", margin: "0 24px 24px", ...MONO }}>
          JOIN THE MOVEMENT
        </div>
        <div style={{ overflow: "hidden", borderTop: `4px solid ${B}`, borderBottom: `4px solid ${B}` }}>
          <div style={{ ...BEBAS, fontSize: "clamp(80px, 18vw, 240px)", color: B, whiteSpace: "nowrap", lineHeight: 0.85, padding: "10px 40px", letterSpacing: "-0.02em" }}>
            UP<span style={{ color: Y, WebkitTextStroke: `4px ${B}` }}>STRIDE</span>
          </div>
        </div>
        <div style={{ padding: "32px 24px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/programs")}
            style={{ backgroundColor: B, color: Y, padding: "18px 40px", fontWeight: 700, fontSize: "14px", letterSpacing: "0.12em", border: `3px solid ${B}`, ...SHADOW_Y, cursor: "pointer", transition: "all 0.15s", ...MONO }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(-3px,-3px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `8px 8px 0 ${Y}`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `5px 5px 0 ${Y}`; }}
          >
            START YOUR JOURNEY →
          </button>
          <a
            href="mailto:mamlesh@upstrides.in"
            style={{ backgroundColor: Y, color: B, padding: "18px 40px", fontWeight: 700, fontSize: "14px", letterSpacing: "0.12em", border: `3px solid ${B}`, ...SHADOW, cursor: "pointer", transition: "all 0.15s", textDecoration: "none", display: "inline-block", ...MONO }}
          >
            CONTACT US
          </a>
        </div>
      </section>

      {/* ================================================================
          FOOTER — Large, Dense, Brutalist
          ================================================================ */}
      <footer style={{ backgroundColor: B, borderTop: `4px solid ${Y}`, padding: "80px 24px 40px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          {/* Top row */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? "28px" : "48px", marginBottom: "60px", borderBottom: `2px solid ${Y}44`, paddingBottom: "60px" }}>
            {/* Brand column */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <img src="/upstride-logo.png" alt="Upstride" style={{ height: "40px", filter: "brightness(0) invert(1)" }} />
                <span style={{ ...BEBAS, fontSize: "32px", color: W, letterSpacing: "0.1em" }}>UPSTRIDE</span>
              </div>
              <p style={{ ...MONO, fontSize: "12px", color: `${W}77`, lineHeight: 1.8, marginBottom: "20px" }}>
                India's 1st BYOM platform for student career transformation. MSME registered. Passion-first, not profit-first.
              </p>
              <div style={{ marginBottom: "12px" }}>
                <a href="mailto:mamlesh@upstrides.in" style={{ ...MONO, color: Y, fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>
                  mamlesh@upstrides.in
                </a>
              </div>
              <div>
                <a href="tel:+917358580180" style={{ ...MONO, color: Y, fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>
                  +91 7358580180
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <div style={{ ...BEBAS, fontSize: "20px", color: Y, letterSpacing: "0.1em", marginBottom: "20px", borderBottom: `2px solid ${Y}44`, paddingBottom: "8px" }}>NAVIGATE</div>
              {[
                { label: "Programs",       action: () => navigate("/programs") },
                { label: "Blogs",          action: () => navigate("/blogs") },
                { label: "Student Portal", action: () => navigate("/login") },
                { label: "Contact Us",     action: () => navigate("/contact") },
              ].map(({ label, action }) => (
                <button key={label} onClick={action}
                  style={{ display: "block", ...MONO, fontSize: "12px", color: `${W}99`, marginBottom: "10px", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", transition: "color 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = Y; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = `${W}99`; }}
                >{label}</button>
              ))}
            </div>

            {/* Legal */}
            <div>
              <div style={{ ...BEBAS, fontSize: "20px", color: Y, letterSpacing: "0.1em", marginBottom: "20px", borderBottom: `2px solid ${Y}44`, paddingBottom: "8px" }}>LEGAL</div>
              {[
                { label: "Privacy Policy",      path: "/privacy-policy" },
                { label: "Terms of Agreement",  path: "/terms" },
              ].map(({ label, path }) => (
                <button key={label} onClick={() => navigate(path)}
                  style={{ display: "block", ...MONO, fontSize: "12px", color: `${W}99`, marginBottom: "10px", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left", transition: "color 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = Y; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = `${W}99`; }}
                >{label}</button>
              ))}
            </div>

            {/* Colleges visited */}
            <div>
              <div style={{ ...BEBAS, fontSize: "20px", color: Y, letterSpacing: "0.1em", marginBottom: "20px", borderBottom: `2px solid ${Y}44`, paddingBottom: "8px" }}>COLLEGES VISITED</div>
              {colleges.map((college, i) => (
                <div key={i} style={{ ...MONO, fontSize: "11px", color: `${W}88`, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: Y, fontSize: "8px" }}>▶</span>
                  {college}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <span style={{ ...MONO, fontSize: "11px", color: `${W}55` }}>© 2026 UPSTRIDE. ALL RIGHTS RESERVED.</span>
            <span style={{ ...MONO, fontSize: "11px", color: `${W}55` }}>MSME REGISTERED · GOVERNMENT OF INDIA</span>
            <div style={{ display: "flex", gap: "16px" }}>
              {["VIT", "SRM", "SAVEETHA", "KONGUNADU"].map(c => (
                <span key={c} style={{ ...MONO, fontSize: "10px", color: `${W}44`, letterSpacing: "0.1em" }}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
