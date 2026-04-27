import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Mail, Eye, EyeOff, ShieldCheck, User, Phone, Briefcase } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

const Y = "#FFE500";
const B = "#0A0A0A";
const W = "#FFFFFF";
const BG = "#FAFAFA";
const BORD = "#E5E5E5";
const MUTE = "#6B7280";
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

const Login = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (token) routeByRole(role);
  }, []);

  const routeByRole = (role: string | null) => {
    if (role === "super_admin") navigate("/admin");
    else if (role === "project_manager") navigate("/projects");
    else if (role === "sales_person") navigate("/sales");
    else if (role === "public_user") navigate("/placements");
    else navigate("/portal");
  };

  const storeAuth = (res: { access_token: string; user: Record<string, unknown> }) => {
    localStorage.setItem("token", res.access_token);
    localStorage.setItem("userRole", res.user.role as string);
    localStorage.setItem("userEmail", res.user.email as string);
    localStorage.setItem("userName", res.user.name as string);
    localStorage.setItem("mustChangePassword", String(res.user.must_change_password ?? false));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Missing fields", description: "Enter email and password", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.auth.login(email, password);
      storeAuth(res);
      toast({ title: "Welcome back!", description: `${res.user.name}` });
      if (res.user.must_change_password) navigate("/change-password");
      else routeByRole(res.user.role as string);
    } catch (err: unknown) {
      toast({ title: "Login failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !password) {
      toast({ title: "Missing fields", description: "All fields are required", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Weak password", description: "Minimum 6 characters", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.auth.signup({ name, email, phone, password });
      storeAuth(res);
      toast({ title: "Account created!", description: "Welcome to Upstrides Placements" });
      navigate("/placements");
    } catch (err: unknown) {
      toast({ title: "Signup failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "12px 16px 12px 44px",
    backgroundColor: W,
    border: `2px solid ${focused === field ? B : BORD}`,
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
    { value: "30+", label: "Internships Secured" },
    { value: "6+", label: "Colleges Visited" },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, display: "flex", ...MONO }}>
      <div className="hidden lg:flex" style={{ width: "44%", backgroundColor: B, flexDirection: "column", justifyContent: "space-between", padding: "48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: "120px", height: "120px", backgroundColor: Y }} />

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "56px", position: "relative", zIndex: 1 }}>
            <img src="/upstride-logo.png" alt="Upstrides" style={{ height: "36px", filter: "brightness(0) invert(1)" }} />
            <span style={{ fontSize: "20px", fontWeight: 700, color: W, letterSpacing: "0.08em" }}>Upstrides</span>
          </div>

          <div style={{ opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(24px)", transition: "all 0.6s 0.1s ease" }}>
            <div style={{ display: "inline-block", backgroundColor: Y, color: B, padding: "5px 12px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "24px" }}>
              {tab === "signup" ? "PLACEMENTS" : "STUDENT PORTAL"}
            </div>
            <h1 style={{ fontSize: "clamp(30px, 3vw, 44px)", fontWeight: 700, color: W, lineHeight: 1.15, marginBottom: "20px", letterSpacing: "-0.02em" }}>
              {tab === "signup" ? (
                <>Find your<br />next<br /><span style={{ color: Y }}>internship.</span></>
              ) : (
                <>Your career<br />resources,<br /><span style={{ color: Y }}>all in one place.</span></>
              )}
            </h1>
            <p style={{ fontSize: "14px", color: `${W}99`, lineHeight: 1.8, maxWidth: "340px" }}>
              {tab === "signup"
                ? "Sign up for free to browse internship openings curated for students like you."
                : "Access curated training materials, placement prep, company-specific resources, and mentorship guides."}
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", backgroundColor: `${W}22`, opacity: mounted ? 1 : 0, transition: "all 0.6s 0.3s ease" }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{ backgroundColor: `${W}08`, padding: "20px 16px", textAlign: "center", border: `1px solid ${W}15` }}>
              <div style={{ fontSize: "26px", fontWeight: 700, color: Y, marginBottom: "4px" }}>{value}</div>
              <div style={{ fontSize: "10px", color: `${W}77`, letterSpacing: "0.1em", lineHeight: 1.4 }}>{label.toUpperCase()}</div>
            </div>
          ))}
        </div>

        <div style={{ borderLeft: `3px solid ${Y}`, paddingLeft: "20px", opacity: mounted ? 1 : 0, transition: "all 0.6s 0.5s ease" }}>
          <p style={{ fontSize: "13px", color: `${W}88`, lineHeight: 1.8, fontStyle: "italic" }}>
            "The gap between where you are and where you want to be is just information."
          </p>
          <span style={{ fontSize: "11px", color: Y, fontWeight: 600, letterSpacing: "0.1em" }}>- Upstrides Team</span>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 24px", position: "relative", backgroundColor: BG }}>
        <div style={{ position: "absolute", top: "24px", left: "24px" }}>
          <button
            onClick={() => navigate("/")}
            style={{ display: "flex", alignItems: "center", gap: "8px", color: MUTE, background: "none", border: "none", cursor: "pointer", fontSize: "13px", ...MONO }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = B; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = MUTE; }}
          >
            <ArrowLeft size={16} /> Back to home
          </button>
        </div>

        <div style={{ width: "100%", maxWidth: "420px", backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", padding: "40px", boxShadow: "0 4px 24px rgba(0,0,0,0.07)", opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "all 0.5s 0.2s ease" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "10px", backgroundColor: Y, border: `2px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `3px 3px 0 ${B}` }}>
              {tab === "signup" ? <Briefcase size={24} color={B} /> : <ShieldCheck size={24} color={B} />}
            </div>
          </div>

          <div style={{ display: "flex", border: `2px solid ${BORD}`, borderRadius: "8px", marginBottom: "28px", overflow: "hidden" }}>
            {(["login", "signup"] as const).map(item => (
              <button
                key={item}
                onClick={() => setTab(item)}
                style={{ flex: 1, padding: "10px", background: tab === item ? B : W, color: tab === item ? Y : MUTE, border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", ...MONO, transition: "all 0.15s" }}
              >
                {item === "login" ? "LOG IN" : "SIGN UP"}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <Field label="EMAIL ADDRESS">
                <Mail size={16} color={focused === "email" ? B : MUTE} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setFocused("email")} onBlur={() => setFocused(null)} style={inputStyle("email")} required />
              </Field>
              <Field label="PASSWORD">
                <Lock size={16} color={focused === "password" ? B : MUTE} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setFocused("password")} onBlur={() => setFocused(null)} style={{ ...inputStyle("password"), paddingRight: "44px" }} required />
                <PasswordToggle show={showPassword} setShow={setShowPassword} />
              </Field>
              <SubmitButton isLoading={isLoading} label="ACCESS PORTAL ->" loadingLabel="AUTHENTICATING..." />
            </form>
          ) : (
            <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Field label="FULL NAME">
                <User size={16} color={focused === "name" ? B : MUTE} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} style={inputStyle("name")} required />
              </Field>
              <Field label="PHONE NUMBER">
                <Phone size={16} color={focused === "phone" ? B : MUTE} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input type="tel" placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} onFocus={() => setFocused("phone")} onBlur={() => setFocused(null)} style={inputStyle("phone")} required />
              </Field>
              <Field label="EMAIL ADDRESS">
                <Mail size={16} color={focused === "signup-email" ? B : MUTE} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} onFocus={() => setFocused("signup-email")} onBlur={() => setFocused(null)} style={inputStyle("signup-email")} required />
              </Field>
              <Field label="PASSWORD">
                <Lock size={16} color={focused === "signup-password" ? B : MUTE} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setFocused("signup-password")} onBlur={() => setFocused(null)} style={{ ...inputStyle("signup-password"), paddingRight: "44px" }} required />
                <PasswordToggle show={showPassword} setShow={setShowPassword} />
              </Field>
              <SubmitButton isLoading={isLoading} label="CREATE ACCOUNT & BROWSE JOBS ->" loadingLabel="CREATING ACCOUNT..." />
              <p style={{ fontSize: "11px", color: MUTE, textAlign: "center", lineHeight: 1.6 }}>
                Already have an account?{" "}
                <button type="button" onClick={() => setTab("login")} style={{ color: B, background: "none", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "11px", ...MONO }}>Log in</button>
              </p>
            </form>
          )}
        </div>

        <p style={{ marginTop: "18px", fontSize: "11px", color: MUTE, textAlign: "center", maxWidth: "320px", lineHeight: 1.7 }}>
          By accessing the portal, you agree to our{" "}
          <button onClick={() => navigate("/terms")} style={{ color: B, background: "none", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700, ...MONO, textDecoration: "underline" }}>Terms</button>{" "}
          and{" "}
          <button onClick={() => navigate("/privacy-policy")} style={{ color: B, background: "none", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700, ...MONO, textDecoration: "underline" }}>Privacy Policy</button>
        </p>
      </div>
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "8px" }}>{label}</label>
    <div style={{ position: "relative" }}>{children}</div>
  </div>
);

const PasswordToggle = ({ show, setShow }: { show: boolean; setShow: (next: boolean) => void }) => (
  <button
    type="button"
    onClick={() => setShow(!show)}
    style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: MUTE, display: "flex", alignItems: "center" }}
  >
    {show ? <EyeOff size={16} /> : <Eye size={16} />}
  </button>
);

const SubmitButton = ({ isLoading, label, loadingLabel }: { isLoading: boolean; label: string; loadingLabel: string }) => (
  <button
    type="submit"
    disabled={isLoading}
    style={{ width: "100%", padding: "14px", backgroundColor: isLoading ? `${B}cc` : B, color: Y, border: `2px solid ${B}`, borderRadius: "6px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", ...MONO, cursor: isLoading ? "not-allowed" : "pointer", boxShadow: `3px 3px 0 ${Y}`, marginTop: "4px" }}
  >
    {isLoading ? loadingLabel : label}
  </button>
);

export default Login;
