import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import "@/styles/mamlesh-theme.css";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const redirectTo = params.get("redirect") || null;
  // ?welcome=1 → the buyer just paid; render the "set your password" mode.
  const welcomeMode = params.get("welcome") === "1" || params.get("enrolled") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
    if (token) routeByRole(role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const routeByRole = (role: string | null) => {
    if (redirectTo) { navigate(redirectTo); return; }
    if (role === "super_admin") navigate("/admin");
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
    setLoading(true);
    try {
      const res = await api.auth.login(email, password);
      storeAuth(res);
      toast({ title: "Welcome back!", description: `${res.user.name}` });
      if (res.user.must_change_password) navigate("/change-password");
      else routeByRole(res.user.role as string);
    } catch (err) {
      toast({ title: "Login failed", description: (err as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Missing fields", description: "Enter your email and a password", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await api.auth.completeSignup(email, password);
      storeAuth({ access_token: res.access_token, user: res.user as unknown as Record<string, unknown> });
      toast({ title: "You're in!", description: "Setup complete." });
      routeByRole(res.user.role);
    } catch (err) {
      const msg = (err as Error).message || "";
      if (msg.toLowerCase().includes("already set up")) {
        toast({ title: "You already have a password", description: "Please log in with the password you created." });
        navigate("/login", { replace: true });
        setPassword("");
        setConfirmPassword("");
      } else {
        toast({ title: "Couldn't complete setup", description: msg, variant: "destructive" });
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="mamlesh-site" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <nav className="nav">
        <div className="container nav-inner">
          <Link to="/" className="nav-brand">
            Mamlesh<span>.</span>
          </Link>
          <div className="nav-links">
            <Link to="/">← Back to site</Link>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "40px 36px",
            boxShadow: "0 20px 50px -28px rgba(30, 30, 30, 0.25)",
          }}>
            {welcomeMode ? (
              <>
                <div style={{
                  background: "var(--yellow-soft)",
                  border: "1px solid var(--yellow-border)",
                  borderRadius: "12px",
                  padding: "16px 18px",
                  marginBottom: 24,
                  display: "flex", gap: 12, alignItems: "flex-start",
                }}>
                  <Sparkles size={18} color="#b88600" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, color: "#8a6d00", fontSize: "0.9rem", marginBottom: 4 }}>
                      Payment received — welcome.
                    </div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.5 }}>
                      Enter the email you paid with and set a password. That's how you'll log in from now on.
                    </div>
                  </div>
                </div>

                <h1 style={{ fontFamily: "var(--heading)", fontSize: "1.7rem", marginBottom: 4 }}>
                  Finish setting up
                </h1>
                <p className="muted" style={{ marginBottom: 24, fontSize: "0.95rem" }}>
                  Choose a password so you can access your course.
                </p>

                <form onSubmit={handleCompleteSignup}>
                  <div className="field">
                    <label>Email you paid with</label>
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com" required autoFocus
                    />
                  </div>
                  <div className="field" style={{ position: "relative" }}>
                    <label>Create a password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters" required autoComplete="new-password"
                      style={{ paddingRight: 42 }}
                    />
                    <PasswordToggle show={showPassword} setShow={setShowPassword} />
                  </div>
                  <div className="field">
                    <label>Confirm password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Type it again" required autoComplete="new-password"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading}
                    style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
                    {loading ? "Setting up…" : "Set password & log in →"}
                  </button>
                </form>

                <button type="button" onClick={() => navigate("/login", { replace: true })}
                  style={{
                    display: "block", margin: "18px auto 0", background: "none", border: "none",
                    color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer",
                  }}
                >
                  Already have a password? Log in
                </button>
              </>
            ) : (
              <>
                <h1 style={{ fontFamily: "var(--heading)", fontSize: "1.8rem", marginBottom: 4 }}>
                  Welcome back
                </h1>
                <p className="muted" style={{ marginBottom: 28, fontSize: "0.95rem" }}>
                  Log in to your course portal.
                </p>

                <form onSubmit={handleLogin}>
                  <div className="field">
                    <label>Email address</label>
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com" required
                    />
                  </div>
                  <div className="field" style={{ position: "relative" }}>
                    <label>Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password" required
                      style={{ paddingRight: 42 }}
                    />
                    <PasswordToggle show={showPassword} setShow={setShowPassword} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: -8, marginBottom: 16 }}>
                    <button type="button" onClick={() => navigate("/forgot-password")}
                      style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", padding: 0 }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading}
                    style={{ width: "100%", justifyContent: "center" }}>
                    {loading ? "Signing in…" : "Log in →"}
                  </button>
                </form>
              </>
            )}
          </div>

          <p style={{ marginTop: 20, fontSize: "0.8rem", color: "var(--text-faint)", textAlign: "center", lineHeight: 1.7 }}>
            By logging in, you agree to our{" "}
            <Link to="/terms" className="link-blue">Terms</Link>{" "}and{" "}
            <Link to="/privacy-policy" className="link-blue">Privacy Policy</Link>.
          </p>
        </div>
      </main>
    </div>
  );
};

const PasswordToggle = ({ show, setShow }: { show: boolean; setShow: (v: boolean) => void }) => (
  <button
    type="button"
    onClick={() => setShow(!show)}
    style={{
      position: "absolute", right: 12, top: 36,
      background: "none", border: "none", cursor: "pointer",
      color: "var(--text-muted)", display: "flex", alignItems: "center", padding: 4,
    }}
    aria-label={show ? "Hide password" : "Show password"}
  >
    {show ? <EyeOff size={16} /> : <Eye size={16} />}
  </button>
);

export default Login;
