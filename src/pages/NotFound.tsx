import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Compass, ArrowUpRight, Home } from "lucide-react";

const Y    = "#FFE500";
const B    = "#0A0A0A";
const W    = "#FFFFFF";
const BG   = "#FAFAFA";
const MUTE = "#6B7280";

const BEBAS: React.CSSProperties = { fontFamily: "'Bebas Neue', cursive" };
const MONO:  React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };
const SANS:  React.CSSProperties = { fontFamily: "'Sora', system-ui, -apple-system, sans-serif" };

const REDIRECT_TO = "/";
const COUNTDOWN_SECS = 6;

const NotFound = () => {
  const location = useLocation();
  const [seconds, setSeconds] = useState(COUNTDOWN_SECS);
  const [paused, setPaused]   = useState(false);

  useEffect(() => {
    console.error("404 Error: route not found:", location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (paused) return;
    if (seconds <= 0) {
      window.location.href = REDIRECT_TO;
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, paused]);

  const progress = ((COUNTDOWN_SECS - seconds) / COUNTDOWN_SECS) * 100;

  return (
    <div style={{
      minHeight: "100vh", background: BG, position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
      ...SANS,
    }}>
      {/* ── Animated background grid ── */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${B}08 1px, transparent 1px), linear-gradient(90deg, ${B}08 1px, transparent 1px)`,
        backgroundSize: "44px 44px",
        maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        pointerEvents: "none",
      }} />

      {/* Floating yellow orbs */}
      <div aria-hidden style={{
        position: "absolute", top: "-80px", left: "-80px", width: "320px", height: "320px",
        background: `radial-gradient(circle, ${Y}55, transparent 65%)`,
        animation: "nf-float 9s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      <div aria-hidden style={{
        position: "absolute", bottom: "-100px", right: "-100px", width: "360px", height: "360px",
        background: `radial-gradient(circle, ${Y}33, transparent 70%)`,
        animation: "nf-float 11s ease-in-out infinite reverse",
        pointerEvents: "none",
      }} />

      {/* Floating tiny squares — sprinkles */}
      {[...Array(8)].map((_, i) => (
        <div key={i} aria-hidden style={{
          position: "absolute",
          top: `${10 + (i * 11)}%`,
          left: `${(i * 13 + 5) % 95}%`,
          width: i % 2 === 0 ? "8px" : "6px",
          height: i % 2 === 0 ? "8px" : "6px",
          background: i % 3 === 0 ? Y : B,
          borderRadius: i % 4 === 0 ? "50%" : "2px",
          opacity: 0.18 + (i % 3) * 0.1,
          animation: `nf-bob ${6 + (i % 4)}s ease-in-out ${i * 0.4}s infinite`,
          pointerEvents: "none",
        }} />
      ))}

      {/* ── Main card ── */}
      <div style={{
        position: "relative", zIndex: 1,
        background: W, border: `3px solid ${B}`, borderRadius: "20px",
        padding: "clamp(28px, 5vw, 56px) clamp(24px, 4vw, 56px)",
        boxShadow: `10px 10px 0 ${B}`,
        maxWidth: "640px", width: "100%", textAlign: "center",
      }}>
        {/* Tape pieces — playful */}
        <div aria-hidden style={{
          position: "absolute", top: "-14px", left: "20%",
          width: "70px", height: "26px",
          background: `${Y}CC`, transform: "rotate(-6deg)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }} />
        <div aria-hidden style={{
          position: "absolute", top: "-12px", right: "16%",
          width: "60px", height: "22px",
          background: `${Y}CC`, transform: "rotate(8deg)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }} />

        {/* Floating compass */}
        <div style={{
          width: "80px", height: "80px", margin: "0 auto 24px",
          borderRadius: "50%", background: B, border: `4px solid ${Y}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 8px 24px ${Y}66`,
          animation: "nf-spin-slow 14s linear infinite",
        }}>
          <Compass size={36} color={Y} strokeWidth={2.2} />
        </div>

        {/* HUGE 404 with stroke effect */}
        <h1 style={{
          ...BEBAS,
          fontSize: "clamp(96px, 18vw, 168px)",
          color: Y,
          WebkitTextStroke: `3px ${B}`,
          lineHeight: 0.9, letterSpacing: "0.02em",
          margin: "0 0 8px",
          textShadow: `6px 6px 0 ${B}`,
        }}>
          404
        </h1>

        <div style={{
          display: "inline-block", padding: "4px 12px",
          background: B, color: Y, ...MONO,
          fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em",
          marginBottom: "20px",
        }}>
          OFF THE MAP
        </div>

        <h2 style={{
          fontSize: "clamp(20px, 3.4vw, 28px)", fontWeight: 700,
          color: B, lineHeight: 1.25, letterSpacing: "-0.01em",
          marginBottom: "12px",
        }}>
          This page took a detour.
        </h2>
        <p style={{
          fontSize: "14px", color: MUTE, lineHeight: 1.65,
          maxWidth: "440px", margin: "0 auto 28px",
        }}>
          We couldn't find <code style={{ background: `${Y}33`, color: B, padding: "2px 6px", borderRadius: "4px", ...MONO, fontSize: "12.5px" }}>{location.pathname}</code>. Don't worry — we'll get you back on track.
        </p>

        {/* Auto-redirect countdown */}
        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          padding: "12px 16px", background: BG,
          border: `1.5px solid ${B}15`, borderRadius: "10px",
          marginBottom: "20px", justifyContent: "space-between", flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", textAlign: "left" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: B, color: Y, display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: "13px", ...MONO,
              flexShrink: 0,
            }}>
              {seconds}
            </div>
            <div style={{ fontSize: "12.5px", color: B, lineHeight: 1.4 }}>
              Redirecting to <strong>the home page</strong>…
            </div>
          </div>
          <button
            onClick={() => setPaused((p) => !p)}
            style={{
              padding: "6px 12px", background: paused ? B : "transparent",
              color: paused ? Y : B, border: `1.5px solid ${B}`,
              borderRadius: "7px", fontSize: "11px", fontWeight: 700,
              cursor: "pointer", ...MONO, letterSpacing: "0.06em",
            }}
          >
            {paused ? "RESUME" : "PAUSE"}
          </button>
          {/* progress bar */}
          <div style={{
            position: "relative", height: "3px", width: "100%", background: `${B}15`,
            borderRadius: "999px", overflow: "hidden", marginTop: "2px",
          }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: `${progress}%`, background: Y, transition: "width 1s linear",
            }} />
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <a href={REDIRECT_TO}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 22px", background: B, color: Y,
              border: `2px solid ${B}`, borderRadius: "8px",
              fontSize: "13px", fontWeight: 700, ...MONO, letterSpacing: "0.08em",
              textDecoration: "none", boxShadow: `4px 4px 0 ${Y}`, transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translate(-2px, -2px)"; e.currentTarget.style.boxShadow = `6px 6px 0 ${Y}`; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translate(0, 0)"; e.currentTarget.style.boxShadow = `4px 4px 0 ${Y}`; }}
          >
            GO TO UPSTRIDES.IN <ArrowUpRight size={14} />
          </a>
          <a href="/"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "12px 22px", background: W, color: B,
              border: `2px solid ${B}`, borderRadius: "8px",
              fontSize: "13px", fontWeight: 700, ...MONO, letterSpacing: "0.08em",
              textDecoration: "none", transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = Y; }}
            onMouseLeave={e => { e.currentTarget.style.background = W; }}
          >
            <Home size={14} /> HOME
          </a>
        </div>

        <p style={{ fontSize: "11px", color: MUTE, marginTop: "22px", ...MONO, letterSpacing: "0.08em" }}>
          ERR · ROUTE NOT FOUND
        </p>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes nf-float {
          0%, 100% { transform: translate(0, 0); }
          50%      { transform: translate(40px, 30px); }
        }
        @keyframes nf-bob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-14px); }
        }
        @keyframes nf-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
