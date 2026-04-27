import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, ChevronUp, Phone, CalendarDays } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const Y = "#FFE500";
const B = "#0A0A0A";
const W = "#FAFAFA";

const BEBAS: React.CSSProperties = { fontFamily: "'Bebas Neue', cursive" };
const MONO: React.CSSProperties  = { fontFamily: "'IBM Plex Mono', monospace" };
const SANS: React.CSSProperties  = { fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" };
const SHADOW: React.CSSProperties  = { boxShadow: `5px 5px 0 ${B}` };
const SHADOW_Y: React.CSSProperties = { boxShadow: `5px 5px 0 ${Y}` };

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
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
const FEATURED_STUDENTS = [
  {
    name: "PRANEETH",
    image: "/praneeths.jpeg",
    achievement: "Placed to work on a funded project",
    quote: "Working on a funded project right out of college is something most students only dream about. Upstrides helped me get there faster than I expected.",
    highlight: "FUNDED PROJECT",
  },
  {
    name: "DIVYA",
    image: "/divya.jpg",
    achievement: "Placed in Central Government — AICTE",
    quote: "Landing a central government role straight out of college wasn't something I imagined. Upstrides helped me build the confidence and skills to actually get there.",
    highlight: "GOVT. PLACED",
  },
  {
    name: "VAMSI",
    image: "/vamsi-image.jpeg",
    achievement: "Summer internship at Accenture",
    quote: "Getting into Accenture as a summer intern felt like a big deal. The preparation and project work from Upstrides made it possible.",
    highlight: "ACCENTURE INTERN",
  },
];

const HOW_IT_WORKS = [
  {
    num: "01",
    title: "AI-first structured curriculum",
    sub: "Built for today, not five years ago.",
    body: "You won't sit through outdated theory. Every module is built around how teams actually work right now — AI tools, real interview patterns, and the skills companies are genuinely hiring for. You learn what matters, when it matters.",
  },
  {
    num: "02",
    title: "1:1 mentor support",
    sub: "Someone who's been where you want to go.",
    body: "Your mentor isn't just a teacher — they're someone working in the industry right now. They'll review your work, answer your real questions, and tell you the honest stuff that most advice columns skip. You won't feel stuck alone.",
  },
  {
    num: "03",
    title: "Projects, AI labs & evaluated practice",
    sub: "Build things. Get feedback. Repeat.",
    body: "You don't just watch and move on. Every module comes with a project that pushes you to actually apply what you learned. You get evaluated, you get feedback, and you get better — the way real work makes you better.",
  },
  {
    num: "04",
    title: "Upstride-built preparation tools",
    sub: "Practice like it's the real thing.",
    body: "From coding practice to AI mock interviews, the tools we use are built to replicate exactly what hiring looks like today. Nothing about the actual interview should feel new or scary. You've already done it.",
  },
  {
    num: "05",
    title: "A community that actually shows up",
    sub: "100+ students who get what you're going through.",
    body: "Regular check-ins, group sessions, and a network of 100+ students who are all building towards the same goal. The program ends — but the WhatsApp group, the referrals, and the friendships don't.",
  },
  {
    num: "06",
    title: "Learning never ends",
    sub: "You keep access. The industry keeps moving. You stay ahead.",
    body: "After the program, you still get live sessions, curriculum updates, and lifetime access to everything recorded. The world of AI moves fast — you won't get left behind just because the batch ended.",
  },
];

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


const faqs = [
  { q: "What if I have zero skills?", a: "Perfect starting point. Upstrides was built exactly for that. You don't need skills — you need a direction and a system. We give you both." },
  { q: "Do I need to be from a top college?", a: "No. We've seen students from tier-3 colleges outperform IIT graduates because they had clarity and execution. Your college doesn't define you. Your actions do." },
  { q: "What if I fail?", a: "You will. Multiple times. That's part of the system. What Upstrides does is reduce the number of times you fail blindly — because most failures are avoidable with the right information." },
  { q: "Is this for any branch — not just CS?", a: "Yes. CS, ECE, Mechanical, Civil — doesn't matter. The principles of building a career are the same. Only the domain-specific content changes." },
  { q: "How is this different from other courses?", a: "Most courses sell information. We sell transformation. The difference is accountability, personalization, and honest mentorship — not a certificate at the end." },
  { q: "How much does it cost?", a: "The program is priced based on your situation. We believe cost should never be the reason someone misses a career breakthrough. Apply and we'll work out the best path for you." },
];

const colleges = [
  "VIT Vellore", "SRM Ramapuram", "Saveetha University",
  "Kongunadu Arts & Science", "NBKRIST", "SRM AP",
  "Sathyabama University", "Amrita Chennai", "Vel Tech",
];

const achievements = [
  { stat: "118",  label: "Students Trained" },
  { stat: "43",   label: "Internships & Full-Time Offers" },
  { stat: "2",    label: "Hackathons Won" },
  { stat: "8+",   label: "Colleges Visited" },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const Index = () => {
  const navigate  = useNavigate();
  const isMobile  = useIsMobile();

  // Auth
  const isLoggedIn  = !!localStorage.getItem("token");
  const rawEmail    = localStorage.getItem("userEmail") ?? "";
  const rawName     = localStorage.getItem("userName")  ?? "";
  const displayName = rawName.trim() || rawEmail.split("@")[0] || "";

  const handleLogout = () => {
    ["token", "userRole", "userEmail", "userName", "mustChangePassword"].forEach(k => localStorage.removeItem(k));
    window.location.href = "/";
  };

  // UI state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq,    setOpenFaq]    = useState<number | null>(null);
  const [heroLoaded, setHeroLoaded] = useState(false);

  // Apply modal
  const [applyOpen, setApplyOpen]   = useState(false);
  const [applyForm, setApplyForm]   = useState({ name: "", email: "", phone: "" });
  const [applySubmitting, setApplySubmitting] = useState(false);
  const [applyDone, setApplyDone]   = useState(false);

  const openApply = () => setApplyOpen(true);
  const closeApply = () => {
    setApplyOpen(false);
    sessionStorage.setItem("apply_modal_dismissed", "1");
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.name.trim() || !applyForm.phone.trim()) {
      toast({ title: "Name and phone are required", variant: "destructive" });
      return;
    }
    setApplySubmitting(true);
    try {
      await api.public.apply({ name: applyForm.name, email: applyForm.email, phone: applyForm.phone });
      setApplyDone(true);
    } catch {
      toast({ title: "Submission failed. Please try again.", variant: "destructive" });
    } finally {
      setApplySubmitting(false);
    }
  };

  // Events
  interface LiveEvent { id: string; title: string; location: string; date: string; description: string; image_data: string | null; image_type: string | null; }
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);

  // HOW IT WORKS
  const [activeHow, setActiveHow]   = useState(0);
  const [howPhase,  setHowPhase]    = useState<"before" | "during" | "after">("before");
  const howSectionRef = useRef<HTMLElement>(null);

  // Roadmap
  const [nodeVisible, setNodeVisible] = useState<boolean[]>(roadmapData.map(() => false));
  const [activeNode,  setActiveNode]  = useState<number | null>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  // In-view hooks
  const studentSec  = useInView(0.1);
  const eventSec    = useInView(0.1);
  const mediaSec    = useInView(0.1);
  const roadmapSec  = useInView(0.05);
  const whatSec     = useInView(0.1);
  const achSec      = useInView(0.1);
  const faqSec      = useInView(0.1);

  // ── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => {
    api.events.getUpcoming().then((r: unknown) => {
      const res = r as { data: { events: LiveEvent[] } };
      setLiveEvents(res.data.events);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setHeroLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Auto-open apply modal after 20s (once per session)
  useEffect(() => {
    if (sessionStorage.getItem("apply_modal_dismissed")) return;
    const t = setTimeout(() => {
      if (!sessionStorage.getItem("apply_modal_dismissed")) setApplyOpen(true);
    }, 20000);
    return () => clearTimeout(t);
  }, []);

  // HOW IT WORKS
  useEffect(() => {
    const handleScroll = () => {
      const el = howSectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const stepHeight = window.innerHeight * 0.62;
      const scrolledIn = -rect.top;
      const index = Math.floor(scrolledIn / stepHeight);

      setActiveHow(Math.max(0, Math.min(HOW_IT_WORKS.length - 1, index)));

      if (rect.top > 0) {
        setHowPhase("before");
      } else if (rect.bottom <= window.innerHeight) {
        setHowPhase("after");
      } else {
        setHowPhase("during");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Roadmap node observers
  useEffect(() => {
    const observers = nodeRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting)
            setNodeVisible(prev => { const n = [...prev]; n[i] = true; return n; });
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  const visibleCount = nodeVisible.filter(Boolean).length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ ...MONO, backgroundColor: W, color: B, overflowX: "hidden", paddingBottom: "42px" }}>

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

          {/* Desktop nav — section anchors */}
          <div className="hidden md:flex" style={{ alignItems: "stretch" }}>
            {[
              { label: "Trust",            id: "trust" },
              { label: "Events",           id: "events" },
              { label: "What is Upstride?",id: "how" },
              { label: "Recognized by",    id: "recognized" },
            ].map(({ label, id }) => (
              <button key={id}
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                style={{ padding: "16px 20px", fontWeight: 700, fontSize: "11px", letterSpacing: "0.12em", borderLeft: `3px solid ${B}`, background: "transparent", color: B, cursor: "pointer", transition: "all 0.15s", ...MONO, whiteSpace: "nowrap" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = B; (e.currentTarget as HTMLButtonElement).style.color = Y; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = B; }}
              >{label}</button>
            ))}
            <button
              onClick={openApply}
              style={{ padding: "16px 28px", fontWeight: 700, fontSize: "12px", letterSpacing: "0.15em", borderLeft: `3px solid ${B}`, background: B, color: Y, cursor: "pointer", transition: "all 0.15s", ...MONO }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = W; (e.currentTarget as HTMLButtonElement).style.color = B; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = B; (e.currentTarget as HTMLButtonElement).style.color = Y; }}
            >APPLY NOW →</button>
            {isLoggedIn ? (
              <>
                <div style={{ display: "flex", alignItems: "center", padding: "0 16px", borderLeft: `3px solid ${B}`, ...MONO, fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.06em", whiteSpace: "nowrap" }}>
                  {displayName.toUpperCase()}
                </div>
                <button
                  onClick={handleLogout}
                  style={{ padding: "16px 20px", fontWeight: 700, fontSize: "11px", letterSpacing: "0.12em", borderLeft: `3px solid ${B}`, background: "transparent", color: B, cursor: "pointer", transition: "all 0.15s", ...MONO }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = B; (e.currentTarget as HTMLButtonElement).style.color = Y; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = B; }}
                >LOGOUT</button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                style={{ padding: "16px 20px", fontWeight: 700, fontSize: "11px", letterSpacing: "0.12em", borderLeft: `3px solid ${B}`, background: "transparent", color: B, cursor: "pointer", transition: "all 0.15s", ...MONO }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = B; (e.currentTarget as HTMLButtonElement).style.color = Y; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = B; }}
              >LOGIN</button>
            )}
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
            {[
              { label: "Trust",            id: "trust" },
              { label: "Events",           id: "events" },
              { label: "What is Upstride?",id: "how" },
              { label: "Recognized by",    id: "recognized" },
            ].map(({ label, id }) => (
              <button key={id}
                onClick={() => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }}
                style={{ display: "block", width: "100%", padding: "14px 24px", textAlign: "left", fontWeight: 700, fontSize: "12px", letterSpacing: "0.12em", background: "transparent", color: B, borderBottom: `1px solid ${B}18`, cursor: "pointer", ...MONO }}
              >{label}</button>
            ))}
            <button
              onClick={() => { openApply(); setMobileMenuOpen(false); }}
              style={{ display: "block", width: "100%", padding: "16px 24px", textAlign: "left", fontWeight: 700, fontSize: "12px", letterSpacing: "0.15em", background: B, color: Y, cursor: "pointer", ...MONO }}
            >APPLY NOW →</button>
            {isLoggedIn ? (
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                style={{ display: "block", width: "100%", padding: "14px 24px", textAlign: "left", fontWeight: 700, fontSize: "12px", letterSpacing: "0.12em", background: "transparent", color: B, borderBottom: `1px solid ${B}18`, borderTop: `1px solid ${B}18`, cursor: "pointer", ...MONO }}
              >LOGOUT ({displayName})</button>
            ) : (
              <button
                onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                style={{ display: "block", width: "100%", padding: "14px 24px", textAlign: "left", fontWeight: 700, fontSize: "12px", letterSpacing: "0.12em", background: "transparent", color: B, borderTop: `1px solid ${B}18`, cursor: "pointer", ...MONO }}
              >LOGIN</button>
            )}
          </div>
        )}
      </header>

      {/* ================================================================
          HERO — centered with floating yellow lights
          ================================================================ */}
      <section style={{
        height: "100vh",
        paddingTop: "80px",
        backgroundColor: W,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Subtle grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${B}10 1px, transparent 1px), linear-gradient(90deg, ${B}10 1px, transparent 1px)`, backgroundSize: "60px 60px", pointerEvents: "none" }} />

        {/* Floating yellow light orbs */}
        {([
          { w: 340, h: 340, top: "8%",  left: "-6%",  anim: "float-slow",   dur: "9s",  opacity: 0.28, blur: 80 },
          { w: 200, h: 200, top: "60%", left: "2%",   anim: "float-fast",   dur: "6s",  opacity: 0.2,  blur: 55 },
          { w: 280, h: 280, top: "5%",  right: "-4%", anim: "float-medium", dur: "11s", opacity: 0.22, blur: 70 },
          { w: 160, h: 160, top: "55%", right: "3%",  anim: "float-slow",   dur: "13s", opacity: 0.32, blur: 45 },
          { w: 120, h: 120, top: "30%", left: "10%",  anim: "float-fast",   dur: "7s",  opacity: 0.18, blur: 35 },
          { w: 90,  h: 90,  top: "25%", right: "12%", anim: "float-medium", dur: "8s",  opacity: 0.25, blur: 25 },
          { w: 60,  h: 60,  top: "80%", left: "30%",  anim: "float-fast",   dur: "5s",  opacity: 0.35, blur: 18 },
          { w: 50,  h: 50,  top: "15%", left: "45%",  anim: "float-slow",   dur: "10s", opacity: 0.3,  blur: 14 },
        ] as { w: number; h: number; top?: string; left?: string; right?: string; anim: string; dur: string; opacity: number; blur: number }[]).map((orb, i) => (
          <div key={i} style={{
            position: "absolute",
            width: orb.w,
            height: orb.h,
            borderRadius: "50%",
            backgroundColor: Y,
            filter: `blur(${orb.blur}px)`,
            opacity: orb.opacity,
            top: orb.top,
            left: orb.left,
            right: orb.right,
            animation: `${orb.anim} ${orb.dur} ease-in-out infinite`,
            animationDelay: `${i * 0.8}s`,
            pointerEvents: "none",
            zIndex: 0,
          }} />
        ))}

        <div style={{
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "0 32px",
          position: "relative",
          zIndex: 1,
          width: "100%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}>

          {/* Badge + Headline + Tagline */}
          <div>
            <div style={{
              display: "inline-block",
              backgroundColor: B, color: Y,
              padding: "7px 16px",
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.25em",
              marginBottom: "20px",
              opacity: heroLoaded ? 1 : 0,
              transform: heroLoaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.4s 0.1s ease",
              ...MONO,
            }}>
              ★ THE MARKET HAS ALREADY CHANGED ★
            </div>

            <h1 style={{ ...BEBAS, fontSize: isMobile ? "clamp(40px, 11vw, 68px)" : "clamp(56px, 6.8vw, 100px)", lineHeight: 0.91, marginBottom: "28px", color: B, letterSpacing: "0.01em" }}>
              {"BECOME THE PROFESSIONAL".split("").map((ch, i) => (
                <span key={i} style={{ display: "inline-block", minWidth: ch === " " ? "0.32em" : undefined, opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "translateY(0) rotate(0deg)" : "translateY(60px) rotate(-8deg)", transition: `all 0.45s ${i * 0.016}s cubic-bezier(0.34, 1.56, 0.64, 1)` }}>
                  {ch === " " ? "" : ch}
                </span>
              ))}
              <br />
              {"BUILT FOR THE NEXT DECADE".split("").map((ch, i) => (
                <span key={i} style={{ display: "inline-block", minWidth: ch === " " ? "0.32em" : undefined, color: Y, WebkitTextStroke: `2px ${B}`, opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "translateY(0)" : "translateY(50px)", transition: `all 0.48s ${0.3 + i * 0.014}s cubic-bezier(0.34, 1.56, 0.64, 1)` }}>
                  {ch === " " ? "" : ch}
                </span>
              ))}
              <br />
              {"IN AI.".split("").map((ch, i) => (
                <span key={i} style={{ display: "inline-block", minWidth: ch === " " ? "0.32em" : undefined, opacity: heroLoaded ? 1 : 0, transform: heroLoaded ? "translateY(0)" : "translateY(40px)", transition: `all 0.45s ${0.64 + i * 0.06}s cubic-bezier(0.34, 1.56, 0.64, 1)` }}>
                  {ch === " " ? "" : ch}
                </span>
              ))}
            </h1>

            <p style={{
              ...MONO,
              fontSize: "13px",
              fontWeight: 700,
              maxWidth: "540px",
              lineHeight: 1.75,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: B,
              opacity: heroLoaded ? 1 : 0,
              transition: "all 0.4s 1.0s ease",
              textAlign: "center",
              margin: "0 auto",
            }}>
              Join us to figure out what you want early. Learn AI in everything and everywhere. Build 10x faster.
            </p>
          </div>

        </div>
      </section>

      {/* ================================================================
          MARQUEE BAND
          ================================================================ */}
      <div style={{ backgroundColor: B, borderTop: `4px solid ${B}`, borderBottom: `4px solid ${B}`, padding: "14px 0", overflow: "hidden" }}>
        <div className="brut-marquee" style={{ gap: "0" }}>
          {[...Array(2)].map((_, rep) => (
            <div key={rep} style={{ display: "flex", alignItems: "center" }}>
              {["NEXT DECADE IN AI", "●", "INDIA'S 1ST", "●", "CAREER CLARITY", "●", "NOT A COURSE", "●", "250+ STUDENTS", "●", "REAL RESULTS", "●", "Upstrides", "●"].map((item, i) => (
                <span key={i} style={{ ...BEBAS, fontSize: "22px", color: i % 2 === 1 ? Y : W, padding: "0 24px", letterSpacing: "0.12em", whiteSpace: "nowrap" }}>{item}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================
          FEATURED STUDENTS — Praneeth, Divya, Vamsi
          ================================================================ */}
      <section id="trust" ref={studentSec.ref} style={{ backgroundColor: B, padding: "100px 24px", borderTop: `4px solid ${Y}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px", opacity: studentSec.inView ? 1 : 0, transform: studentSec.inView ? "translateY(0)" : "translateY(30px)", transition: "all 0.5s ease" }}>
            <div style={{ backgroundColor: Y, color: B, display: "inline-block", padding: "8px 20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "20px", ...MONO }}>
              REAL STUDENTS. REAL RESULTS.
            </div>
            <h2 style={{ ...BEBAS, fontSize: "clamp(44px, 7vw, 96px)", color: W, lineHeight: 0.9 }}>
              PROOF IT<br /><span style={{ color: Y }}>WORKS.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "24px" }}>
            {FEATURED_STUDENTS.map((student, i) => (
              <div
                key={i}
                style={{ opacity: studentSec.inView ? 1 : 0, transform: studentSec.inView ? "translateY(0) scale(1)" : "translateY(40px) scale(0.96)", transition: `all 0.6s ${i * 0.12}s cubic-bezier(0.34, 1.56, 0.64, 1)` }}
              >
                <div
                  style={{ backgroundColor: W, border: `3px solid ${Y}`, boxShadow: `6px 6px 0 ${Y}`, overflow: "hidden", transition: "all 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translate(-4px,-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `10px 10px 0 ${Y}`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `6px 6px 0 ${Y}`; }}
                >
                  <div style={{ position: "relative", overflow: "hidden", aspectRatio: "4/3" }}>
                    <img src={student.image} alt={student.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
                    <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: Y, color: B, padding: "5px 12px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", ...MONO, border: `2px solid ${B}` }}>
                      {student.highlight}
                    </div>
                  </div>
                  <div style={{ padding: "22px" }}>
                    <div style={{ ...BEBAS, fontSize: "28px", color: B, letterSpacing: "0.04em", marginBottom: "4px" }}>{student.name}</div>
                    <div style={{ ...MONO, fontSize: "10px", fontWeight: 700, color: "#6B7280", letterSpacing: "0.1em", marginBottom: "12px" }}>{student.achievement.toUpperCase()}</div>
                    <p style={{ ...SANS, fontSize: "14px", color: `${B}cc`, lineHeight: 1.7, borderLeft: `3px solid ${Y}`, paddingLeft: "12px" }}>
                      "{student.quote}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          UPCOMING EVENTS (dynamic from MongoDB)
          ================================================================ */}
      {liveEvents.length > 0 && liveEvents.map((ev, i) => {
        const dateStr = (() => { try { return new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }); } catch { return ev.date; } })();
        const isFirst = i === 0;
        return (
          <section key={ev.id} id={isFirst ? "events" : undefined} ref={isFirst ? eventSec.ref : undefined} style={{ backgroundColor: W, padding: "100px 24px", overflow: "hidden", borderTop: `4px solid ${B}` }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "32px" : "60px", alignItems: "center" }}>
              <div>
                <div style={{ backgroundColor: B, color: Y, display: "inline-block", padding: "6px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "24px", ...MONO }}>UPCOMING EVENT</div>
                <h2 style={{ ...BEBAS, fontSize: "clamp(36px, 6vw, 80px)", color: B, lineHeight: 0.92, marginBottom: "20px" }}>
                  Upstrides IS<br /><span style={{ color: Y, WebkitTextStroke: `2px ${B}` }}>COMING TO</span><br />{ev.location.toUpperCase()}
                </h2>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", marginBottom: "28px" }}>
                  <div style={{ backgroundColor: Y, border: `3px solid ${B}`, display: "inline-block", padding: "10px 20px", ...MONO }}>
                    <span style={{ fontWeight: 700, fontSize: "14px", color: B }}>📅 {dateStr.toUpperCase()}</span>
                  </div>
                  <a href="https://jumbled-otter-c02.notion.site/74c1902d7b3a42a59ecb9dcca6cdf7e9?pvs=105" target="_blank" rel="noopener noreferrer"
                    style={{ display: "inline-block", backgroundColor: B, color: Y, padding: "10px 22px", fontWeight: 700, fontSize: "13px", letterSpacing: "0.1em", border: `3px solid ${B}`, boxShadow: `4px 4px 0 ${B}`, textDecoration: "none", ...MONO, transition: "transform 0.15s, box-shadow 0.15s" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translate(-2px,-2px)"; el.style.boxShadow = `6px 6px 0 ${B}`; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.transform = "translate(0,0)"; el.style.boxShadow = `4px 4px 0 ${B}`; }}>
                    REGISTER NOW →
                  </a>
                </div>
                {ev.title && <h3 style={{ ...BEBAS, fontSize: "clamp(22px, 3.5vw, 42px)", color: B, marginBottom: "16px", lineHeight: 1 }}>"{ev.title}"</h3>}
                {ev.description && <p style={{ color: `${B}99`, fontSize: "14px", lineHeight: 1.8, maxWidth: "420px" }}>{ev.description}</p>}
              </div>
              <div>
                <div style={{ border: `4px solid ${B}`, boxShadow: `-8px 8px 0 ${B}`, position: "relative", overflow: "hidden" }}>
                  {ev.image_data ? (
                    <img src={`data:${ev.image_type};base64,${ev.image_data}`} alt={ev.title} style={{ width: "100%", display: "block", objectFit: "contain", backgroundColor: W }} />
                  ) : (
                    <div style={{ width: "100%", aspectRatio: "4/3", backgroundColor: `${B}08`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <CalendarDays size={64} color={B} />
                    </div>
                  )}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 20px", backgroundColor: `${B}dd` }}>
                    <span style={{ ...BEBAS, color: Y, fontSize: "18px", letterSpacing: "0.1em" }}>{ev.location.toUpperCase()} — {dateStr.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ================================================================
          MEDIA TRIFECTA — Video + Hackathon + Funded Project
          ================================================================ */}
      <section ref={mediaSec.ref} style={{ backgroundColor: B, padding: "100px 24px", borderTop: `4px solid ${Y}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px", opacity: mediaSec.inView ? 1 : 0, transform: mediaSec.inView ? "translateY(0)" : "translateY(30px)", transition: "all 0.5s ease" }}>
            <div style={{ backgroundColor: Y, color: B, display: "inline-block", padding: "8px 20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "20px", ...MONO }}>PROOF OF WORK</div>
            <h2 style={{ ...BEBAS, fontSize: "clamp(44px, 7vw, 96px)", color: W, lineHeight: 0.9 }}>
              WE DON'T JUST<br /><span style={{ color: Y }}>TALK ABOUT IT.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr", gap: "20px", alignItems: "stretch" }}>
            <div style={{ opacity: mediaSec.inView ? 1 : 0, transform: mediaSec.inView ? "translateX(0)" : "translateX(-40px)", transition: "all 0.6s cubic-bezier(0.16,1,0.3,1)" }}>
              <div style={{ border: `4px solid ${Y}`, boxShadow: `8px 8px 0 ${Y}`, height: "100%", overflow: "hidden", position: "relative", minHeight: "280px" }}>
                <video src="/upstride-video.mp4" controls playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", backgroundColor: B }} />
                <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: Y, color: B, padding: "5px 12px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", ...MONO, border: `2px solid ${B}` }}>▶ Upstrides IN ACTION</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px", opacity: mediaSec.inView ? 1 : 0, transform: mediaSec.inView ? "translateX(0)" : "translateX(40px)", transition: "all 0.6s 0.15s cubic-bezier(0.16,1,0.3,1)" }}>
              <div style={{ flex: 1, position: "relative", border: `4px solid ${Y}`, boxShadow: `6px 6px 0 ${Y}`, overflow: "hidden", minHeight: "160px" }}>
                <img src="/hackathon-won.jpg" alt="Hackathon Won" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${B}ee 0%, transparent 50%)` }} />
                <div style={{ position: "absolute", bottom: "12px", left: "12px", right: "12px" }}>
                  <div style={{ ...BEBAS, fontSize: "22px", color: Y, letterSpacing: "0.06em" }}>🏆 HACKATHON WINNERS</div>
                  <div style={{ ...MONO, fontSize: "10px", color: `${W}99`, marginTop: "2px" }}>Students winning, not just attending</div>
                </div>
              </div>
              <div style={{ flex: 1, position: "relative", border: `4px solid ${Y}`, boxShadow: `6px 6px 0 ${Y}`, overflow: "hidden", minHeight: "160px" }}>
                <img src="/funded-project.jpg" alt="Funded Project" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${B}ee 0%, transparent 50%)` }} />
                <div style={{ position: "absolute", bottom: "12px", left: "12px", right: "12px" }}>
                  <div style={{ ...BEBAS, fontSize: "22px", color: Y, letterSpacing: "0.06em" }}>💰 FUNDED PROJECT</div>
                  <div style={{ ...MONO, fontSize: "10px", color: `${W}99`, marginTop: "2px" }}>Real work, real backing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          HOW Upstrides WORKS
          Desktop uses a scroll placeholder plus a fixed panel while
          the section is active, so it pins cleanly and exits with no
          extra black tail.
          ================================================================ */}
      <section
        id="how"
        ref={howSectionRef}
        style={{
          backgroundColor: Y,
          borderTop: `4px solid ${B}`,
          height: isMobile ? "auto" : `${HOW_IT_WORKS.length * 62 + 100}vh`,
          position: "relative",
        }}
      >
        {/* ── Desktop: pinned viewport while scrolling through cards ── */}
        {!isMobile && (
          <div style={{
            position: howPhase === "during" ? "fixed" : "absolute",
            top: howPhase === "after" ? "auto" : 0,
            bottom: howPhase === "after" ? 0 : "auto",
            left: 0,
            right: 0,
            height: "100vh",
            zIndex: 5,
            backgroundColor: Y,
            pointerEvents: howPhase === "during" ? "auto" : "none",
          }}>
            <div style={{
            height: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "80px 24px 0",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "center",
          }}>
            {/* LEFT */}
            <div>
              <div style={{ backgroundColor: B, color: Y, display: "inline-block", padding: "8px 20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "24px", ...MONO }}>
                HOW Upstrides WORKS
              </div>
              <h2 style={{ ...BEBAS, fontSize: "clamp(48px, 5.5vw, 80px)", color: B, lineHeight: 0.88, marginBottom: "20px" }}>
                A SYSTEM,<br />NOT JUST<br /><span style={{ color: W, WebkitTextStroke: `2px ${B}` }}>CONTENT.</span>
              </h2>
              <p style={{ ...SANS, fontSize: "15px", color: `${B}cc`, lineHeight: 1.7, maxWidth: "420px", marginBottom: "44px" }}>
                This isn't an AI content library. It's a system built around AI-era progress — designed for people with ambition and limited time. Structure, people, practice, and accountability are built in so upskilling turns into capability, not content consumption.
              </p>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {HOW_IT_WORKS.map((_, i) => (
                  <div key={i} style={{
                    height: "8px",
                    borderRadius: "4px",
                    backgroundColor: i === activeHow ? B : `${B}30`,
                    width: i === activeHow ? "40px" : "8px",
                    transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  }} />
                ))}
              </div>
              <div style={{ ...MONO, fontSize: "10px", color: `${B}70`, letterSpacing: "0.12em", marginTop: "10px" }}>
                {String(activeHow + 1).padStart(2, "0")} / {String(HOW_IT_WORKS.length).padStart(2, "0")}
              </div>
            </div>

            {/* RIGHT — stacked cards, only activeHow visible */}
            <div style={{ position: "relative", height: "100%" }}>
              {HOW_IT_WORKS.map((item, i) => (
                <div key={i} style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  opacity: activeHow === i ? 1 : 0,
                  transform: activeHow === i
                    ? "translateX(0) rotate(0deg)"
                    : i < activeHow
                      ? "translateX(-50px) rotate(-2deg)"
                      : "translateX(60px) rotate(3deg)",
                  transition: "all 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  pointerEvents: activeHow === i ? "auto" : "none",
                }}>
                  <div style={{
                    width: "100%",
                    backgroundColor: W,
                    border: `4px solid ${B}`,
                    boxShadow: `6px 6px 0 ${B}`,
                    padding: "40px 32px",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translate(-3px,-3px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `10px 10px 0 ${B}`; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `6px 6px 0 ${B}`; }}
                  >
                    <div style={{ ...BEBAS, fontSize: "80px", color: Y, lineHeight: 0.85, marginBottom: "10px" }}>{item.num}</div>
                    <h3 style={{ ...BEBAS, fontSize: "clamp(24px, 2.6vw, 34px)", color: B, lineHeight: 1, marginBottom: "12px" }}>{item.title}</h3>
                    <p style={{ ...MONO, fontSize: "10px", color: "#6B7280", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "16px" }}>{item.sub.toUpperCase()}</p>
                    <p style={{ ...SANS, fontSize: "15px", color: `${B}cc`, lineHeight: 1.7 }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </div>
        )}

        {/* ── Mobile: stacked vertically ── */}
        {isMobile && (
          <div style={{ padding: "80px 24px" }}>
            <div style={{ backgroundColor: B, color: Y, display: "inline-block", padding: "8px 20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "24px", ...MONO }}>
              HOW Upstrides WORKS
            </div>
            <h2 style={{ ...BEBAS, fontSize: "clamp(48px, 12vw, 72px)", color: B, lineHeight: 0.88, marginBottom: "20px" }}>
              A SYSTEM,<br />NOT JUST<br /><span style={{ color: W, WebkitTextStroke: `2px ${B}` }}>CONTENT.</span>
            </h2>
            <p style={{ ...SANS, fontSize: "15px", color: `${B}cc`, lineHeight: 1.7, marginBottom: "48px" }}>
              This isn't an AI content library. It's a system built around AI-era progress — designed for people with ambition and limited time.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {HOW_IT_WORKS.map((item, i) => (
                <div key={i} style={{ backgroundColor: W, border: `4px solid ${B}`, boxShadow: `6px 6px 0 ${B}`, padding: "28px 24px" }}>
                  <div style={{ ...BEBAS, fontSize: "64px", color: Y, lineHeight: 0.85, marginBottom: "8px" }}>{item.num}</div>
                  <h3 style={{ ...BEBAS, fontSize: "26px", color: B, lineHeight: 1, marginBottom: "10px" }}>{item.title}</h3>
                  <p style={{ ...MONO, fontSize: "10px", color: "#6B7280", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "12px" }}>{item.sub.toUpperCase()}</p>
                  <p style={{ ...SANS, fontSize: "15px", color: `${B}cc`, lineHeight: 1.7 }}>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ================================================================
          ROADMAP TO UPSKILL
          ================================================================ */}
      <section ref={roadmapSec.ref} style={{ backgroundColor: W, padding: "100px 24px", position: "relative", overflow: "hidden", borderTop: `4px solid ${B}` }}>
        <div style={{ textAlign: "center", marginBottom: "80px", opacity: roadmapSec.inView ? 1 : 0, transform: roadmapSec.inView ? "translateY(0)" : "translateY(40px)", transition: "all 0.5s ease" }}>
          <div style={{ backgroundColor: B, color: Y, display: "inline-block", padding: "8px 20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "20px", ...MONO }}>THE ROADMAP</div>
          <h2 style={{ ...BEBAS, fontSize: "clamp(48px, 9vw, 120px)", color: B, lineHeight: 0.9 }}>
            ROADMAP TO<br /><span style={{ color: Y, WebkitTextStroke: `3px ${B}` }}>UPSKILL</span>
          </h2>
          <p style={{ ...MONO, fontSize: "14px", color: `${B}99`, maxWidth: "500px", margin: "20px auto 0", lineHeight: 1.7 }}>
            A year-by-year execution guide. Not generic advice. Built from watching hundreds of students succeed and fail.
          </p>
        </div>

        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
          <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "4px", backgroundColor: `${B}22`, transform: "translateX(-50%)" }} className="hidden md:block" />
          <div style={{ position: "absolute", left: "50%", top: 0, width: "4px", backgroundColor: Y, border: `2px solid ${B}`, transform: "translateX(-50%)", height: `${(visibleCount / roadmapData.length) * 100}%`, transition: "height 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }} className="hidden md:block" />

          {roadmapData.map((item, i) => {
            const isLeft  = i % 2 === 0;
            const visible = nodeVisible[i];
            return (
              <div key={i} ref={el => { nodeRefs.current[i] = el; }}
                style={{ display: "flex", flexDirection: isMobile ? "column" : (isLeft ? "row" : "row-reverse"), gap: isMobile ? "0" : "40px", marginBottom: "60px", alignItems: "flex-start", opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : `translateX(${isLeft ? "-60px" : "60px"})`, transition: `all 0.6s ${i * 0.1}s cubic-bezier(0.16, 1, 0.3, 1)` }}
              >
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
                  <div style={{ backgroundColor: B, color: Y, display: "inline-block", padding: "4px 12px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "12px", ...MONO }}>{item.mindset}</div>
                  {activeNode === i && (
                    <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: "16px" }}>
                      {[
                        { title: "✅ FOCUS ON", items: item.focus, bg: B, fg: Y },
                        { title: "❌ AVOID",    items: item.avoid, bg: Y, fg: B },
                        { title: "🔨 BUILD",    items: item.build, bg: W, fg: B },
                      ].map(({ title, items: its, bg, fg }) => (
                        <div key={title} style={{ backgroundColor: bg, border: `2px solid ${B}`, padding: "14px" }}>
                          <div style={{ ...MONO, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", color: fg, marginBottom: "10px" }}>{title}</div>
                          {its.map((it, j) => (
                            <div key={j} style={{ ...MONO, fontSize: "11px", color: fg, marginBottom: "6px", lineHeight: 1.5 }}>— {it}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="hidden md:flex" style={{ flexShrink: 0, width: "24px", alignItems: "flex-start", justifyContent: "center", paddingTop: "16px" }}>
                  <div style={{ width: "20px", height: "20px", backgroundColor: visible ? Y : `${B}33`, border: `3px solid ${B}`, transition: "all 0.4s", transform: visible ? "scale(1)" : "scale(0)" }} />
                </div>
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
            <div style={{ backgroundColor: B, color: Y, display: "inline-block", padding: "8px 20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "20px", ...MONO }}>WHAT WE DO</div>
            <h2 style={{ ...BEBAS, fontSize: "clamp(48px, 8vw, 110px)", color: B, lineHeight: 0.9, maxWidth: "800px" }}>
              WE DON'T SELL<br />COURSES.<br /><span style={{ WebkitTextStroke: `3px ${B}`, color: Y }}>WE SELL</span><br />EXPERIENCE.
            </h2>
            <p style={{ ...SANS, fontSize: "16px", color: `${B}cc`, maxWidth: "620px", lineHeight: 1.7, marginTop: "24px" }}>
              Upstrides exists to close the gap between what colleges teach and what companies actually need — through mentorship, community, and honest guidance.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            {achievements.map((a, i) => (
              <div key={i}
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
          COLLEGES REACHED
          ================================================================ */}
      <section id="recognized" ref={achSec.ref} style={{ backgroundColor: W, padding: "80px 24px", borderBottom: `4px solid ${B}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px", opacity: achSec.inView ? 1 : 0, transform: achSec.inView ? "translateY(0)" : "translateY(30px)", transition: "all 0.5s ease" }}>
            <div style={{ backgroundColor: B, color: Y, display: "inline-block", padding: "8px 20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "16px", ...MONO }}>COLLEGES WE'VE REACHED</div>
            <h3 style={{ ...BEBAS, fontSize: "clamp(32px, 5vw, 64px)", color: B }}>RECOGNIZED BY</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 0, border: `3px solid ${B}` }}>
            {[
              { name: "VIT",      src: "/vit.jpg" },
              { name: "VIT Chennai", src: "/vit-chennai.png" },
              { name: "Saveetha", src: "/saveetha.gif" },
              { name: "Kongunadu",src: "/kongunadu.png" },
              { name: "SRM AP",   src: "/srm-ap.png" },
              { name: "SRM IST",  src: "/srm-ist-logo.jpg" },
              { name: "NBKRIST",  src: "/NBKRIST_logo.png" },
              { name: "DGVC",     src: "/DGVC_LOGO.jpg" },
            ].map((r, i) => (
              <div key={i}
                style={{
                  borderRight: (i + 1) % (isMobile ? 2 : 4) === 0 ? "none" : `3px solid ${B}`,
                  borderBottom: i >= (isMobile ? 6 : 4) ? "none" : `3px solid ${B}`,
                  padding: "28px 20px",
                  minHeight: "132px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "12px",
                  opacity: achSec.inView ? 1 : 0,
                  transition: `all 0.4s ${i * 0.07}s ease`,
                  backgroundColor: W,
                }}
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
          FAQ
          ================================================================ */}
      <section ref={faqSec.ref} style={{ backgroundColor: W, padding: "100px 24px", borderBottom: `4px solid ${B}` }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px", opacity: faqSec.inView ? 1 : 0, transform: faqSec.inView ? "translateY(0)" : "translateY(30px)", transition: "all 0.5s ease" }}>
            <div style={{ backgroundColor: B, color: Y, display: "inline-block", padding: "8px 20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "20px", ...MONO }}>THE REAL QUESTIONS</div>
            <h2 style={{ ...BEBAS, fontSize: "clamp(44px, 7vw, 96px)", color: B, lineHeight: 0.9 }}>
              YOU'RE<br />THINKING IT.<br /><span style={{ color: Y, WebkitTextStroke: `3px ${B}` }}>WE'LL SAY IT.</span>
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ borderTop: i === 0 ? `3px solid ${B}` : "none", borderBottom: `3px solid ${B}`, borderLeft: `3px solid ${B}`, borderRight: `3px solid ${B}` }}>
                <button
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 28px", background: openFaq === i ? Y : W, cursor: "pointer", transition: "background 0.15s", ...MONO }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span style={{ fontWeight: 700, fontSize: "14px", color: B, textAlign: "left", letterSpacing: "0.05em" }}>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={20} color={B} style={{ flexShrink: 0 }} /> : <ChevronDown size={20} color={B} style={{ flexShrink: 0 }} />}
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 28px 24px", backgroundColor: `${Y}30` }}>
                    <p style={{ ...MONO, fontSize: "13px", color: `${B}cc`, lineHeight: 1.8 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          PRE-FOOTER
          ================================================================ */}
      <section style={{ backgroundColor: B, padding: "60px 0", borderBottom: `4px solid ${Y}`, overflow: "hidden" }}>
        <div style={{ backgroundColor: Y, display: "inline-block", padding: "8px 20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", margin: "0 24px 24px", ...MONO, color: B }}>
          JOIN THE MOVEMENT
        </div>
        <div style={{ overflow: "hidden", borderTop: `4px solid ${Y}`, borderBottom: `4px solid ${Y}` }}>
          <div style={{ ...BEBAS, fontSize: "clamp(80px, 18vw, 240px)", color: W, whiteSpace: "nowrap", lineHeight: 0.85, padding: "10px 40px", letterSpacing: "-0.02em" }}>
            UP<span style={{ color: Y }}>STRIDES</span>
          </div>
        </div>
        <div style={{ padding: "32px 24px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>
          <button onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
            style={{ backgroundColor: Y, color: B, padding: "18px 40px", fontWeight: 700, fontSize: "14px", letterSpacing: "0.12em", border: `3px solid ${Y}`, ...SHADOW_Y, cursor: "pointer", transition: "all 0.15s", ...MONO }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(-3px,-3px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `8px 8px 0 ${Y}`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `5px 5px 0 ${Y}`; }}
          >EXPLORE PROGRAMS →</button>
          <button onClick={openApply}
            style={{ backgroundColor: W, color: B, padding: "18px 40px", fontWeight: 700, fontSize: "14px", letterSpacing: "0.12em", border: `3px solid ${W}`, boxShadow: `5px 5px 0 ${W}`, cursor: "pointer", transition: "all 0.15s", ...MONO }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(-3px,-3px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translate(0,0)"; }}
          >APPLY NOW →</button>
        </div>
      </section>

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <footer style={{ backgroundColor: B, borderTop: `4px solid ${Y}`, padding: "80px 24px 40px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? "28px" : "48px", marginBottom: "60px", borderBottom: `2px solid ${Y}44`, paddingBottom: "60px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <img src="/upstride-logo.png" alt="Upstrides" style={{ height: "40px", filter: "brightness(0) invert(1)" }} />
                <span style={{ ...BEBAS, fontSize: "32px", color: W, letterSpacing: "0.1em" }}>Upstrides</span>
              </div>
              <p style={{ ...MONO, fontSize: "12px", color: `${W}77`, lineHeight: 1.8, marginBottom: "20px" }}>
                India's 1st platform for student career transformation. MSME registered. Passion-first, not profit-first.
              </p>
              <div style={{ marginBottom: "12px" }}>
                <a href="mailto:mamlesh@upstrides.in" style={{ ...MONO, color: Y, fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>mamlesh@upstrides.in</a>
              </div>
              <div>
                <a href="tel:+917358580180" style={{ ...MONO, color: Y, fontSize: "13px", fontWeight: 700, textDecoration: "none" }}>+91 7358580180</a>
              </div>
            </div>
            <div>
              <div style={{ ...BEBAS, fontSize: "20px", color: Y, letterSpacing: "0.1em", marginBottom: "20px", borderBottom: `2px solid ${Y}44`, paddingBottom: "8px" }}>NAVIGATE</div>
              {[
                { label: "Programs",   action: () => navigate("/programs") },
                { label: "Placements", action: () => navigate("/placements") },
                { label: "Apply Now",  action: () => openApply() },
                { label: "Contact Us", action: () => navigate("/contact") },
              ].map(({ label, action }) => (
                <button key={label} onClick={action}
                  style={{ display: "block", ...MONO, fontSize: "12px", color: `${W}99`, marginBottom: "10px", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = Y; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = `${W}99`; }}
                >{label}</button>
              ))}
            </div>
            <div>
              <div style={{ ...BEBAS, fontSize: "20px", color: Y, letterSpacing: "0.1em", marginBottom: "20px", borderBottom: `2px solid ${Y}44`, paddingBottom: "8px" }}>LEGAL</div>
              {[
                { label: "Privacy Policy",     path: "/privacy-policy" },
                { label: "Terms of Agreement", path: "/terms" },
              ].map(({ label, path }) => (
                <button key={label} onClick={() => navigate(path)}
                  style={{ display: "block", ...MONO, fontSize: "12px", color: `${W}99`, marginBottom: "10px", background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = Y; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = `${W}99`; }}
                >{label}</button>
              ))}
            </div>
            <div>
              <div style={{ ...BEBAS, fontSize: "20px", color: Y, letterSpacing: "0.1em", marginBottom: "20px", borderBottom: `2px solid ${Y}44`, paddingBottom: "8px" }}>COLLEGES VISITED</div>
              {colleges.map((college, i) => (
                <div key={i} style={{ ...MONO, fontSize: "11px", color: `${W}88`, marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: Y, fontSize: "8px" }}>▶</span>{college}
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <span style={{ ...MONO, fontSize: "11px", color: `${W}55` }}>© 2026 Upstrides. ALL RIGHTS RESERVED.</span>
            <span style={{ ...MONO, fontSize: "11px", color: `${W}55` }}>MSME REGISTERED · GOVERNMENT OF INDIA</span>
            <div style={{ display: "flex", gap: "16px" }}>
              {["VIT", "SRM", "SAVEETHA", "KONGUNADU"].map(c => (
                <span key={c} style={{ ...MONO, fontSize: "10px", color: `${W}44`, letterSpacing: "0.1em" }}>{c}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 3000,
          backgroundColor: Y,
          borderTop: `4px solid ${B}`,
          boxShadow: `0 -4px 0 ${B}22`,
          padding: "8px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <a
            href="tel:+917358580180"
            style={{
              ...MONO,
              color: B,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.02em",
              textDecoration: "none",
              textAlign: "center",
              lineHeight: 1.4,
            }}
          >
            Need help? Talk to us at 7358580180
          </a>
          <button
            onClick={openApply}
            style={{
              ...MONO,
              backgroundColor: "transparent",
              color: B,
              border: "none",
              padding: 0,
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.02em",
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: "3px",
            }}
          >
            Request a call
          </button>
        </div>
      </div>

      {/* ── Apply Now Modal ───────────────────────────────────────────────── */}
      {applyOpen && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            backgroundColor: "rgba(10,10,10,0.75)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeApply(); }}
        >
          <div
            style={{
              backgroundColor: W,
              border: `3px solid ${B}`,
              boxShadow: `8px 8px 0 ${Y}`,
              width: "100%",
              maxWidth: "440px",
              padding: "36px 32px",
              position: "relative",
            }}
          >
            {/* Close */}
            <button
              onClick={closeApply}
              style={{
                position: "absolute", top: "14px", right: "14px",
                background: "transparent", border: "none",
                cursor: "pointer", padding: 0, lineHeight: 1,
              }}
              aria-label="Close"
            >
              <X size={22} color={B} strokeWidth={2.5} />
            </button>

            {!applyDone ? (
              <>
                <p style={{ ...MONO, fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: B, opacity: 0.5, marginBottom: "6px" }}>
                  START YOUR JOURNEY
                </p>
                <h2 style={{ ...BEBAS, fontSize: "36px", color: B, lineHeight: 1, marginBottom: "24px" }}>
                  APPLY NOW
                </h2>

                <form onSubmit={handleApplySubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label style={{ ...MONO, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: B, display: "block", marginBottom: "6px" }}>
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={applyForm.name}
                      onChange={(e) => setApplyForm(f => ({ ...f, name: e.target.value }))}
                      required
                      style={{
                        ...MONO, width: "100%", padding: "10px 12px",
                        border: `2px solid ${B}`, backgroundColor: W,
                        fontSize: "14px", outline: "none", boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ ...MONO, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: B, display: "block", marginBottom: "6px" }}>
                      PHONE NUMBER *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={applyForm.phone}
                      onChange={(e) => setApplyForm(f => ({ ...f, phone: e.target.value }))}
                      required
                      style={{
                        ...MONO, width: "100%", padding: "10px 12px",
                        border: `2px solid ${B}`, backgroundColor: W,
                        fontSize: "14px", outline: "none", boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ ...MONO, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", color: B, display: "block", marginBottom: "6px" }}>
                      EMAIL (OPTIONAL)
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={applyForm.email}
                      onChange={(e) => setApplyForm(f => ({ ...f, email: e.target.value }))}
                      style={{
                        ...MONO, width: "100%", padding: "10px 12px",
                        border: `2px solid ${B}`, backgroundColor: W,
                        fontSize: "14px", outline: "none", boxSizing: "border-box",
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={applySubmitting}
                    style={{
                      ...MONO, marginTop: "8px",
                      backgroundColor: applySubmitting ? "#ccc" : Y,
                      color: B, border: `2px solid ${B}`,
                      padding: "13px 0", fontSize: "14px", fontWeight: 800,
                      letterSpacing: "0.08em", cursor: applySubmitting ? "not-allowed" : "pointer",
                      boxShadow: applySubmitting ? "none" : `4px 4px 0 ${B}`,
                      transition: "all 0.15s",
                    }}
                  >
                    {applySubmitting ? "SUBMITTING..." : "SUBMIT APPLICATION →"}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>&#10003;</div>
                <h2 style={{ ...BEBAS, fontSize: "36px", color: B, marginBottom: "10px" }}>YOU'RE IN!</h2>
                <p style={{ ...MONO, fontSize: "13px", color: B, opacity: 0.7, lineHeight: 1.6, marginBottom: "24px" }}>
                  We've received your application. Our team will reach out to you shortly.
                </p>
                <button
                  onClick={closeApply}
                  style={{
                    ...MONO, backgroundColor: Y, color: B,
                    border: `2px solid ${B}`, padding: "12px 32px",
                    fontSize: "13px", fontWeight: 800, letterSpacing: "0.08em",
                    cursor: "pointer", boxShadow: `4px 4px 0 ${B}`,
                  }}
                >
                  CLOSE
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Index;
