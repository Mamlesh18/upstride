import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ShieldCheck, Download,
  Heart, Sparkles, Users2, Compass, Wrench, Network, Boxes, BookOpen, Zap,
  FileText, Globe, Linkedin, Github, MessagesSquare, GraduationCap,
} from "lucide-react";

const Y      = "#FFE500";
const B      = "#0A0A0A";
const W      = "#FFFFFF";
const LB     = "#F5F5F5";
const BORD   = "#DDDDDD";
const MUTE   = "#666666";

const BEBAS: React.CSSProperties = { fontFamily: "'Bebas Neue', cursive" };
const MONO:  React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };
const SANS:  React.CSSProperties = { fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" };

// ─── Team ────────────────────────────────────────────────────────────────────
const TEAM = [
  { name: "PRANEETH", role: "Builder", image: "/praneeths.jpeg",   line: "Doesn't just teach — ships products with you." },
  { name: "DIVYA",    role: "Mentor",  image: "/divya.jpg",        line: "Placed in Central Govt. — knows the grind first-hand." },
  { name: "VAMSI",    role: "Builder", image: "/vamsi-image.jpeg", line: "Cracked Accenture summer — turned student into mentor." },
];

// ─── Why trust Upstrides — punchy one-liners ─────────────────────────────────
const WHY = [
  { icon: Heart,         text: "Because we care unlike your college." },
  { icon: Compass,       text: "We've been in your shoes — and we want to change it." },
  { icon: Sparkles,      text: "We help you add the value you actually want in your career." },
  { icon: Wrench,        text: "We help you land internships that actually matter." },
  { icon: Boxes,         text: "We help you figure out what you want to do." },
  { icon: Users2,        text: "We guide you. Real conversations, not slide decks." },
  { icon: Network,       text: "We connect you to people — alumni, hiring teams, builders." },
  { icon: Zap,           text: "We build products together — you'll ship, not just learn." },
  { icon: BookOpen,      text: "We share resources, openly. No paywalls behind paywalls." },
];

// ─── What we actually provide — concrete deliverables ────────────────────────
const PROVIDES = [
  { icon: FileText,        title: "ATS-ready Resume",       desc: "Built to clear automated filters & catch a recruiter's eye in 7 seconds." },
  { icon: Globe,           title: "Portfolio Website",      desc: "A live, deployed portfolio that actually stands out." },
  { icon: Linkedin,        title: "LinkedIn Restructure",   desc: "Full profile overhaul — headline, About, projects, the works." },
  { icon: Github,          title: "GitHub Template",        desc: "Pin-worthy repos with READMEs, demo GIFs, deploy links." },
  { icon: BookOpen,        title: "Every Resource You Need", desc: "Curated training + placement library — no random YouTube spiral." },
  { icon: MessagesSquare,  title: "Interview Preparation",  desc: "Mocks, real questions, role-specific drills." },
  { icon: GraduationCap,   title: "Confidence You Lack Now", desc: "Because college failed us — and we're here to help you." },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const fade = (s: { visible: boolean }): React.CSSProperties => ({
  opacity: s.visible ? 1 : 0,
  transform: s.visible ? "translateY(0)" : "translateY(20px)",
  transition: "opacity 0.6s ease, transform 0.6s ease",
});

const Payment = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const hero    = useInView();
  const why     = useInView();
  const team    = useInView();
  const provide = useInView();
  const pay     = useInView();

  return (
    <div style={{ minHeight: "100vh", background: W, color: B, ...SANS }}>

      {/* ── NAV ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: W, borderBottom: `2px solid ${B}`, padding: isMobile ? "12px 16px" : "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={() => navigate(-1)} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", cursor: "pointer", color: MUTE, fontSize: "13px", ...MONO }}>
          <ArrowLeft size={15} /> BACK
        </button>
        <span style={{ ...BEBAS, fontSize: "20px", letterSpacing: "0.06em" }}>UPSTRIDES <span style={{ color: Y, WebkitTextStroke: `1px ${B}` }}>PAYMENT</span></span>
        <a href="https://upstrides.in" style={{ fontSize: "12px", color: MUTE, textDecoration: "none", ...MONO }}>UPSTRIDES.IN ↗</a>
      </nav>

      {/* ── PAY HERE — QR ON TOP ── */}
      <section style={{ padding: isMobile ? "40px 16px 50px" : "56px 40px 72px", background: Y, borderBottom: `2px solid ${B}` }}>
        <div ref={pay.ref} style={{ maxWidth: "640px", margin: "0 auto", ...fade(pay) }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ display: "inline-block", background: B, color: Y, ...MONO, fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", padding: "5px 12px", marginBottom: "16px" }}>
              <ShieldCheck size={11} style={{ display: "inline", verticalAlign: "-2px", marginRight: "6px" }} /> SECURE UPI
            </div>
            <div style={{ ...BEBAS, fontSize: isMobile ? "44px" : "60px", letterSpacing: "0.02em", color: B, lineHeight: 0.95 }}>
              SCAN. <span style={{ color: W, WebkitTextStroke: `2px ${B}` }}>PAY. JOIN.</span>
            </div>
            <p style={{ color: B, fontSize: "13.5px", marginTop: "10px", lineHeight: 1.65, opacity: 0.8 }}>
              Scan the QR with any UPI app — GPay, PhonePe, Paytm, BHIM.
            </p>
          </div>

          <div style={{ background: W, border: `3px solid ${B}`, borderRadius: "16px", padding: isMobile ? "24px 20px" : "32px", boxShadow: `8px 8px 0 ${B}`, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ background: W, border: `2px solid ${B}`, borderRadius: "12px", padding: "14px", marginBottom: "16px" }}>
              <img src="/mamlesh-qr.png" alt="Upstrides UPI QR code"
                style={{ width: isMobile ? "240px" : "300px", height: isMobile ? "240px" : "300px", display: "block", objectFit: "contain" }} />
            </div>
            <a href="/mamlesh-qr.png" download="upstrides-upi-qr.png"
              style={{ fontSize: "11px", color: MUTE, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "5px", ...MONO, letterSpacing: "0.08em" }}>
              <Download size={11} /> SAVE QR
            </a>
          </div>
        </div>
      </section>

      {/* ── HERO ── */}
      <section style={{ background: B, color: W, padding: `${isMobile ? "70px 16px" : "100px 40px"}`, borderBottom: `2px solid ${B}`, position: "relative", overflow: "hidden" }}>
        {/* decor */}
        <div aria-hidden style={{ position: "absolute", top: "-80px", right: "-80px", width: "320px", height: "320px", background: `radial-gradient(circle, ${Y}33, transparent 65%)`, pointerEvents: "none" }} />
        <div ref={hero.ref} style={{ maxWidth: "1100px", margin: "0 auto", position: "relative", ...fade(hero) }}>
          <div style={{ display: "inline-block", background: Y, color: B, ...BEBAS, fontSize: "13px", letterSpacing: "0.15em", padding: "6px 14px", marginBottom: "24px" }}>
            INVEST IN YOURSELF
          </div>
          <h1 style={{ ...BEBAS, fontSize: isMobile ? "58px" : "104px", lineHeight: 0.9, letterSpacing: "0.02em", margin: 0, marginBottom: "20px" }}>
            BACK YOURSELF.<br /><span style={{ color: Y }}>WE'LL DO THE REST.</span>
          </h1>
          <p style={{ fontSize: isMobile ? "14px" : "16px", color: "#aaa", maxWidth: "620px", lineHeight: 1.75 }}>
            Pay once. Get the resume, the portfolio, the LinkedIn, the GitHub, the resources, the interview prep — and the confidence college never gave you.
          </p>
        </div>
      </section>

      {/* ── WHY TRUST UPSTRIDES ── */}
      <section style={{ padding: isMobile ? "60px 16px" : "80px 40px", borderBottom: `2px solid ${BORD}`, background: W }}>
        <div ref={why.ref} style={{ maxWidth: "1100px", margin: "0 auto", ...fade(why) }}>
          <div style={{ marginBottom: "44px" }}>
            <div style={{ ...BEBAS, fontSize: isMobile ? "44px" : "64px", letterSpacing: "0.02em" }}>
              WHY TRUST <span style={{ color: Y, WebkitTextStroke: `1px ${B}` }}>UPSTRIDES?</span>
            </div>
            <p style={{ color: MUTE, fontSize: "13.5px", marginTop: "8px", maxWidth: "560px", lineHeight: 1.65 }}>
              Because we're not selling certificates. We're young, we've been in your seat, and we want a change in <em>what</em> we learn — and that we learn what matters.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "14px" }}>
            {WHY.map((w, i) => {
              const I = w.icon;
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: "12px",
                  padding: "18px 18px",
                  background: LB,
                  border: `2px solid ${B}`,
                  borderLeft: `5px solid ${Y}`,
                  borderRadius: "10px",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translate(-2px, -2px)"; e.currentTarget.style.boxShadow = `4px 4px 0 ${B}`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ width: "32px", height: "32px", background: B, color: Y, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <I size={16} />
                  </div>
                  <p style={{ fontSize: "14px", color: B, lineHeight: 1.55, margin: 0, fontWeight: 500 }}>{w.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section style={{ padding: isMobile ? "60px 16px" : "80px 40px", background: B, color: W, borderBottom: `2px solid ${B}` }}>
        <div ref={team.ref} style={{ maxWidth: "1100px", margin: "0 auto", ...fade(team) }}>
          <div style={{ marginBottom: "44px" }}>
            <div style={{ ...BEBAS, fontSize: isMobile ? "44px" : "64px", letterSpacing: "0.02em" }}>
              THE PEOPLE <span style={{ color: Y }}>BEHIND IT.</span>
            </div>
            <p style={{ color: "#aaa", fontSize: "13.5px", marginTop: "8px", maxWidth: "560px", lineHeight: 1.65 }}>
              Three of us. Young, building, in the trenches — not preaching from a stage.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "20px" }}>
            {TEAM.map((m) => (
              <div key={m.name} style={{ background: "#111", border: `2px solid ${Y}`, borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div style={{ aspectRatio: "1 / 1", background: "#222", overflow: "hidden", borderBottom: `2px solid ${Y}` }}>
                  <img src={m.image} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                </div>
                <div style={{ padding: "16px 18px" }}>
                  <div style={{ ...BEBAS, fontSize: "28px", letterSpacing: "0.06em", color: Y, lineHeight: 1 }}>{m.name}</div>
                  <div style={{ fontSize: "11px", color: "#aaa", letterSpacing: "0.1em", marginTop: "4px", ...MONO }}>{m.role.toUpperCase()}</div>
                  <p style={{ fontSize: "13.5px", color: "#ddd", lineHeight: 1.65, marginTop: "10px" }}>{m.line}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE PROVIDE ── */}
      <section style={{ padding: isMobile ? "60px 16px" : "80px 40px", borderBottom: `2px solid ${BORD}`, background: LB }}>
        <div ref={provide.ref} style={{ maxWidth: "1100px", margin: "0 auto", ...fade(provide) }}>
          <div style={{ marginBottom: "44px" }}>
            <div style={{ ...BEBAS, fontSize: isMobile ? "44px" : "64px", letterSpacing: "0.02em" }}>
              WHAT YOU <span style={{ color: Y, WebkitTextStroke: `1px ${B}` }}>ACTUALLY GET.</span>
            </div>
            <p style={{ color: MUTE, fontSize: "13.5px", marginTop: "8px", maxWidth: "560px", lineHeight: 1.65 }}>
              Tangible deliverables — not vibes, not slide decks.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "14px" }}>
            {PROVIDES.map((p, i) => {
              const I = p.icon;
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: "16px",
                  padding: "20px 22px",
                  background: W,
                  border: `2px solid ${B}`,
                  borderRadius: "12px",
                  boxShadow: `4px 4px 0 ${B}`,
                  transition: "transform 0.2s ease",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translate(-2px, -2px)"; e.currentTarget.style.boxShadow = `6px 6px 0 ${Y}`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = `4px 4px 0 ${B}`; }}
                >
                  <div style={{ width: "44px", height: "44px", background: Y, color: B, border: `2px solid ${B}`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <I size={20} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "4px", lineHeight: 1.3 }}>{p.title}</div>
                    <p style={{ fontSize: "13.5px", color: MUTE, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <section style={{ padding: isMobile ? "60px 16px" : "80px 40px", background: B, color: W, textAlign: "center" }}>
        <p style={{ ...BEBAS, fontSize: isMobile ? "32px" : "48px", letterSpacing: "0.02em", margin: 0 }}>
          BECAUSE COLLEGE <span style={{ color: Y }}>FAILED US.</span><br /> LET US HELP YOU.
        </p>
        <p style={{ color: "#aaa", fontSize: "13px", marginTop: "16px", maxWidth: "560px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.7 }}>
          Questions? Email <a href="mailto:mamlesh@upstrides.in" style={{ color: Y, textDecoration: "none" }}>mamlesh@upstrides.in</a> or DM us on Instagram <a href="https://instagram.com/upstride.in" style={{ color: Y, textDecoration: "none" }}>@upstride.in</a>.
        </p>
      </section>
    </div>
  );
};

export default Payment;
