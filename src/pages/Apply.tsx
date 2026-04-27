import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Phone, Mail, CheckCircle, Zap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

const Y    = "#FFE500";
const B    = "#0A0A0A";
const W    = "#FFFFFF";
const BG   = "#FAFAFA";
const BORD = "#E5E5E5";
const MUTE = "#6B7280";
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

const BENEFITS = [
  { icon: "📈", text: "Your career value gets increased" },
  { icon: "📄", text: "Free Resume → 80+ ATS Score guaranteed" },
  { icon: "🌐", text: "Customised portfolio that stands out" },
  { icon: "💼", text: "LinkedIn review & complete profile overhaul" },
  { icon: "📚", text: "100+ curated resources (training + placement)" },
  { icon: "📧", text: "500+ company emails for cold outreach" },
  { icon: "🎯", text: "100+ placement preparation loopholes" },
  { icon: "🎬", text: "Value-adding videos from industry experts" },
  { icon: "🔑", text: "Loopholes on getting more shortlistings" },
];

const Apply = () => {
  const navigate = useNavigate();
  const [form, setForm]         = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused]   = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast({ title: "All fields required", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await api.public.apply(form);
      setSubmitted(true);
    } catch (err: unknown) {
      toast({ title: "Submission failed", description: (err as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const inp = (name: string): React.CSSProperties => ({
    width: "100%", padding: "12px 16px 12px 44px",
    border: `2px solid ${focused === name ? B : BORD}`,
    borderRadius: "6px", fontSize: "14px", ...MONO,
    outline: "none", transition: "border-color 0.15s",
    boxSizing: "border-box" as const, background: W, color: B,
  });

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: BG, display: "flex", alignItems: "center", justifyContent: "center", ...MONO, padding: "24px" }}>
        <div style={{ textAlign: "center", maxWidth: "480px" }}>
          <div style={{ width: "72px", height: "72px", background: Y, border: `3px solid ${B}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: `4px 4px 0 ${B}` }}>
            <CheckCircle size={32} color={B} />
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "40px", color: B, letterSpacing: "0.02em", marginBottom: "12px" }}>APPLICATION SENT!</h2>
          <p style={{ fontSize: "14px", color: MUTE, lineHeight: 1.8, marginBottom: "28px" }}>
            We've received your details. Our team will reach out to you within 24–48 hours to discuss the next steps.
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/placements")} style={{ padding: "12px 24px", background: B, color: Y, border: `2px solid ${B}`, borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: "pointer", ...MONO }}>
              Browse Internships →
            </button>
            <button onClick={() => navigate("/")} style={{ padding: "12px 24px", background: W, color: B, border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", cursor: "pointer", ...MONO }}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, ...MONO }}>

      {/* Back */}
      <div style={{ padding: "20px 24px" }}>
        <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: "8px", color: MUTE, background: "none", border: "none", cursor: "pointer", fontSize: "13px", ...MONO }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = B; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = MUTE; }}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 60px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }}>

        {/* ── LEFT: Benefits ── */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: Y, color: B, padding: "4px 12px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", marginBottom: "20px" }}>
            <Zap size={10} /> Upstrides PROGRAM
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(36px, 5vw, 58px)", color: B, lineHeight: 0.95, letterSpacing: "0.02em", marginBottom: "20px" }}>
            CHANGE THE WAY<br />YOU THINK ABOUT<br /><span style={{ color: Y, WebkitTextStroke: `2px ${B}` }}>YOUR CAREER.</span>
          </h1>
          <p style={{ fontSize: "14px", color: MUTE, lineHeight: 1.8, marginBottom: "32px", maxWidth: "440px" }}>
            Unlimited resources + real mentorship + placement strategy. Trust us — it's the unfair advantage you didn't know you needed.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {BENEFITS.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 16px", background: W, border: `2px solid ${BORD}`, borderRadius: "8px", borderLeft: `4px solid ${Y}` }}>
                <span style={{ fontSize: "18px", flexShrink: 0 }}>{b.icon}</span>
                <span style={{ fontSize: "13px", color: B, lineHeight: 1.5 }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: Form ── */}
        <div style={{ position: "sticky", top: "24px" }}>
          <div style={{ background: B, border: `3px solid ${Y}`, borderRadius: "12px", padding: "36px", boxShadow: `6px 6px 0 ${Y}` }}>
            <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: W, letterSpacing: "0.04em", marginBottom: "6px" }}>JOIN THE PROGRAM</h2>
            <p style={{ fontSize: "12px", color: "#ffffff70", marginBottom: "28px" }}>Fill this in and we'll reach out within 24 hours.</p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#ffffff60", letterSpacing: "0.12em", marginBottom: "7px" }}>FULL NAME</label>
                <div style={{ position: "relative" }}>
                  <User size={15} color={focused === "name" ? Y : "#ffffff40"} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                  <input type="text" placeholder="Your full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    onFocus={() => setFocused("name")} onBlur={() => setFocused(null)}
                    style={{ ...inp("name"), background: "#ffffff10", border: `2px solid ${focused === "name" ? Y : "#ffffff20"}`, color: W }} required />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#ffffff60", letterSpacing: "0.12em", marginBottom: "7px" }}>PHONE NUMBER</label>
                <div style={{ position: "relative" }}>
                  <Phone size={15} color={focused === "phone" ? Y : "#ffffff40"} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                  <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)}
                    style={{ ...inp("phone"), background: "#ffffff10", border: `2px solid ${focused === "phone" ? Y : "#ffffff20"}`, color: W }} required />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: "#ffffff60", letterSpacing: "0.12em", marginBottom: "7px" }}>EMAIL ADDRESS</label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} color={focused === "email" ? Y : "#ffffff40"} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                  <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                    style={{ ...inp("email"), background: "#ffffff10", border: `2px solid ${focused === "email" ? Y : "#ffffff20"}`, color: W }} required />
                </div>
              </div>

              <button type="submit" disabled={loading} style={{ width: "100%", padding: "16px", background: loading ? `${Y}cc` : Y, color: B, border: `2px solid ${Y}`, borderRadius: "6px", fontSize: "14px", fontWeight: 700, letterSpacing: "0.1em", cursor: loading ? "not-allowed" : "pointer", ...MONO, marginTop: "4px", transition: "all 0.15s" }}
                onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = W; }}
                onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = Y; }}>
                {loading ? "SUBMITTING..." : "APPLY FOR FREE →"}
              </button>

              <p style={{ fontSize: "10px", color: "#ffffff40", textAlign: "center", lineHeight: 1.6 }}>
                No spam. We'll only reach out about the program. Your data is safe with us.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apply;
