import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

// ─── Theme ───────────────────────────────────────────────────────────────────
const Y    = "#FFE500";  // yellow
const B    = "#0A0A0A";  // black
const W    = "#FFFFFF";  // white
const BG   = "#FAFAFA";  // off-white page bg
const BORD = "#E5E5E5";  // light border
const MUTE = "#6B7280";  // muted text

const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail]               = useState("");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [focused, setFocused]           = useState<string | null>(null);
  const [mounted, setMounted]           = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (token) {
      if (role === "super_admin") navigate("/admin");
      else if (role === "project_manager") navigate("/projects");
      else navigate("/portal");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Missing fields", description: "Please enter both email and password", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await api.auth.login(email, password);
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("userRole", res.user.role as string);
      localStorage.setItem("userEmail", res.user.email as string);
      localStorage.setItem("userName", res.user.name as string);
      localStorage.setItem("mustChangePassword", String(res.user.must_change_password));

      toast({ title: "Access granted", description: `Welcome, ${res.user.name}!` });

      if (res.user.must_change_password) {
        navigate("/change-password");
      } else if (res.user.role === "super_admin") {
        navigate("/admin");
      } else if (res.user.role === "project_manager") {
        navigate("/projects");
      } else if (res.user.role === "sales_person") {
        navigate("/sales");
      } else {
        navigate("/portal");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      toast({ title: "Login failed", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = (name: string): React.CSSProperties => ({
    width: "100%",
    padding: "12px 16px 12px 44px",
    backgroundColor: W,
    border: `2px solid ${focused === name ? B : BORD}`,
    borderRadius: "6px",
    color: B,
    fontSize: "14px",
    ...MONO,
    outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box" as const,
  });

  const stats = [
    { value: "250+", label: "Students Trained" },
    { value: "30+",  label: "Internships Secured" },
    { value: "6+",   label: "Colleges Visited" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, display: "flex", ...MONO }}>

      {/* ── LEFT: Brand panel ──────────────────────────────────────── */}
      <div
        className="hidden lg:flex"
        style={{
          width: "44%",
          backgroundColor: B,
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Yellow accent square */}
        <div style={{ position: "absolute", top: 0, right: 0, width: "120px", height: "120px", backgroundColor: Y, borderBottomLeftRadius: "0" }} />

        {/* Logo */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "56px", position: "relative", zIndex: 1 }}>
            <img src="/upstride-logo.png" alt="Upstride" style={{ height: "36px", filter: "brightness(0) invert(1)" }} />
            <span style={{ fontSize: "20px", fontWeight: 700, color: W, letterSpacing: "0.08em" }}>UPSTRIDE</span>
          </div>

          <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)", transition: "all 0.6s 0.1s ease" }}>
            <div style={{ display: "inline-block", backgroundColor: Y, color: B, padding: "5px 12px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "24px" }}>
              STUDENT PORTAL
            </div>
            <h1 style={{ fontSize: "clamp(30px, 3vw, 44px)", fontWeight: 700, color: W, lineHeight: 1.15, marginBottom: "20px", letterSpacing: "-0.02em" }}>
              Your career<br />resources,<br />
              <span style={{ color: Y }}>all in one place.</span>
            </h1>
            <p style={{ fontSize: "14px", color: `${W}99`, lineHeight: 1.8, maxWidth: "340px" }}>
              Access curated training materials, placement prep, company-specific resources, and mentorship guides — built by people who've been through it.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", backgroundColor: `${W}22`, opacity: mounted ? 1 : 0, transition: "all 0.6s 0.3s ease" }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{ backgroundColor: `${W}08`, padding: "20px 16px", textAlign: "center", border: `1px solid ${W}15` }}>
              <div style={{ fontSize: "26px", fontWeight: 700, color: Y, marginBottom: "4px" }}>{value}</div>
              <div style={{ fontSize: "10px", color: `${W}77`, letterSpacing: "0.1em", lineHeight: 1.4 }}>{label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div style={{ borderLeft: `3px solid ${Y}`, paddingLeft: "20px", opacity: mounted ? 1 : 0, transition: "all 0.6s 0.5s ease" }}>
          <p style={{ fontSize: "13px", color: `${W}88`, lineHeight: 1.8, fontStyle: "italic" }}>
            "The gap between where you are and where you want to be is just information."
          </p>
          <span style={{ fontSize: "11px", color: Y, fontWeight: 600, letterSpacing: "0.1em" }}>— Mamlesh, Founder</span>
        </div>
      </div>

      {/* ── RIGHT: Form ────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 24px", position: "relative", backgroundColor: BG }}>
        {/* Back */}
        <div style={{ position: "absolute", top: "24px", left: "24px" }}>
          <button
            onClick={() => navigate("/")}
            style={{ display: "flex", alignItems: "center", gap: "8px", color: MUTE, background: "none", border: "none", cursor: "pointer", fontSize: "13px", ...MONO, transition: "color 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = B; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = MUTE; }}
          >
            <ArrowLeft size={16} /> Back to home
          </button>
        </div>

        {/* Card */}
        <div style={{
          width: "100%", maxWidth: "420px",
          backgroundColor: W,
          border: `2px solid ${BORD}`,
          borderRadius: "12px",
          padding: "40px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.5s 0.2s ease",
        }}>
          {/* Icon */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "10px", backgroundColor: Y, border: `2px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `3px 3px 0 ${B}` }}>
              <ShieldCheck size={24} color={B} />
            </div>
          </div>

          <h2 style={{ fontSize: "22px", fontWeight: 700, color: B, textAlign: "center", marginBottom: "6px", letterSpacing: "-0.01em" }}>
            Portal Access
          </h2>
          <p style={{ fontSize: "13px", color: MUTE, textAlign: "center", marginBottom: "32px" }}>
            Enter your credentials to continue
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "8px" }}>
                EMAIL ADDRESS
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={16} color={focused === "email" ? B : MUTE} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", transition: "color 0.15s" }} />
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  style={inputStyle("email")}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "8px" }}>
                PASSWORD
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color={focused === "password" ? B : MUTE} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", transition: "color 0.15s" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  style={{ ...inputStyle("password"), paddingRight: "44px" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: MUTE, display: "flex", alignItems: "center" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%", padding: "14px",
                backgroundColor: isLoading ? `${B}cc` : B,
                color: Y,
                border: `2px solid ${B}`,
                borderRadius: "6px",
                fontSize: "13px", fontWeight: 700,
                letterSpacing: "0.12em",
                ...MONO,
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.15s",
                marginTop: "4px",
                boxShadow: `3px 3px 0 ${Y}`,
              }}
              onMouseEnter={e => { if (!isLoading) { (e.currentTarget as HTMLButtonElement).style.transform = "translate(-2px,-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `5px 5px 0 ${Y}`; } }}
              onMouseLeave={e => { if (!isLoading) { (e.currentTarget as HTMLButtonElement).style.transform = "translate(0,0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `3px 3px 0 ${Y}`; } }}
            >
              {isLoading ? "AUTHENTICATING..." : "ACCESS PORTAL →"}
            </button>
          </form>

          {/* Footer */}
          <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: `1px solid ${BORD}`, textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: MUTE, marginBottom: "6px" }}>
              Don't have access? Contact your instructor
            </p>
            <a href="mailto:mamlesh@upstrides.in" style={{ fontSize: "12px", color: B, fontWeight: 700, textDecoration: "none" }}>
              mamlesh@upstrides.in
            </a>
          </div>
        </div>

        {/* Legal */}
        <p style={{ marginTop: "18px", fontSize: "11px", color: MUTE, textAlign: "center", maxWidth: "320px", lineHeight: 1.7 }}>
          By accessing the portal, you agree to our{" "}
          <button onClick={() => navigate("/terms")} style={{ color: B, background: "none", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700, ...MONO, textDecoration: "underline" }}>
            Terms
          </button>{" "}
          and{" "}
          <button onClick={() => navigate("/privacy-policy")} style={{ color: B, background: "none", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700, ...MONO, textDecoration: "underline" }}>
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
