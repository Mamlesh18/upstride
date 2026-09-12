import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import "@/styles/mamlesh-theme.css";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

/**
 * Where students land after paying on Razorpay.
 *
 * Two modes on one page (tabs at the top):
 *   1. First time — sets the password on the account the webhook just created,
 *      then logs the user in and drops them into /portal.
 *   2. Forgot password — for an existing paid student who lost their password.
 *      Resets the password, then logs them in and drops them into /portal.
 *
 * The old /login?welcome=1 URL redirects here for backward compatibility.
 */

type Mode = "first_time" | "forgot";

const CourseAccess = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("first_time");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const storeAuth = (res: { access_token: string; user: Record<string, unknown> }) => {
    localStorage.setItem("token", res.access_token);
    localStorage.setItem("userRole", res.user.role as string);
    localStorage.setItem("userEmail", res.user.email as string);
    localStorage.setItem("userName", res.user.name as string);
    localStorage.setItem("mustChangePassword", String(res.user.must_change_password ?? false));
  };

  const validate = (): boolean => {
    if (!email.trim()) {
      toast({ title: "Enter your email", variant: "destructive" });
      return false;
    }
    if (password.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return false;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleFirstTime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.auth.completeSignup(email.trim(), password);
      storeAuth({ access_token: res.access_token, user: res.user as unknown as Record<string, unknown> });
      toast({ title: "You're in!", description: "Setup complete." });
      navigate("/portal");
    } catch (err) {
      const msg = (err as Error).message || "";
      // Already set up → nudge them to the forgot-password mode with the email pre-filled.
      if (msg.toLowerCase().includes("already set up")) {
        toast({
          title: "You already have a password",
          description: "Log in normally, or reset your password below.",
        });
        setMode("forgot");
        setPassword("");
        setConfirmPassword("");
      } else {
        toast({ title: "Couldn't complete setup", description: msg, variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // Reset the password on the server.
      await api.auth.forgotPassword(email.trim(), password);
      // Then log in with the new password so the student lands in the portal directly.
      const res = await api.auth.login(email.trim(), password);
      storeAuth(res);
      toast({ title: "Password reset", description: "You're logged in." });
      navigate("/portal");
    } catch (err) {
      toast({ title: "Couldn't reset password", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const isFirstTime = mode === "first_time";
  const submit = isFirstTime ? handleFirstTime : handleForgot;

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
        <div style={{ width: "100%", maxWidth: 460 }}>
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "32px 32px 36px",
            boxShadow: "0 20px 50px -28px rgba(30, 30, 30, 0.25)",
          }}>
            {/* Mode toggle */}
            <div style={{
              display: "flex",
              borderBottom: "1px solid var(--border)",
              marginBottom: 24,
              gap: 0,
            }}>
              <button
                type="button"
                onClick={() => { setMode("first_time"); setPassword(""); setConfirmPassword(""); }}
                style={tabStyle(isFirstTime)}
              >
                First time here
              </button>
              <button
                type="button"
                onClick={() => { setMode("forgot"); setPassword(""); setConfirmPassword(""); }}
                style={tabStyle(!isFirstTime)}
              >
                Forgot password
              </button>
            </div>

            {isFirstTime ? (
              <>
                <div style={{
                  background: "var(--yellow-soft)",
                  border: "1px solid var(--yellow-border)",
                  borderRadius: "12px",
                  padding: "16px 18px",
                  marginBottom: 22,
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

                <h1 style={{ fontFamily: "var(--heading)", fontSize: "1.6rem", marginBottom: 4 }}>
                  Set up your account
                </h1>
                <p className="muted" style={{ marginBottom: 22, fontSize: "0.92rem" }}>
                  Choose a password so you can access your course.
                </p>
              </>
            ) : (
              <>
                <h1 style={{ fontFamily: "var(--heading)", fontSize: "1.6rem", marginBottom: 4 }}>
                  Reset your password
                </h1>
                <p className="muted" style={{ marginBottom: 22, fontSize: "0.92rem" }}>
                  Enter your email and a new password. We'll log you straight in.
                </p>
              </>
            )}

            <form onSubmit={submit}>
              <div className="field">
                <label>{isFirstTime ? "Email you paid with" : "Email address"}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>
              <div className="field" style={{ position: "relative" }}>
                <label>{isFirstTime ? "Create a password" : "New password"}</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  autoComplete="new-password"
                  style={{ paddingRight: 42 }}
                />
                <PasswordToggle show={showPassword} setShow={setShowPassword} />
              </div>
              <div className="field">
                <label>Confirm password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Type it again"
                  required
                  autoComplete="new-password"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
              >
                {loading
                  ? (isFirstTime ? "Setting up…" : "Resetting…")
                  : (isFirstTime ? "Set password & log in →" : "Reset password & log in →")}
              </button>
            </form>

            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                display: "block",
                margin: "20px auto 0",
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Already have a password? Log in
            </button>
          </div>

          <p style={{ marginTop: 20, fontSize: "0.8rem", color: "var(--text-faint)", textAlign: "center", lineHeight: 1.7 }}>
            By continuing, you agree to our{" "}
            <Link to="/terms" className="link-blue">Terms</Link>{" "}and{" "}
            <Link to="/privacy-policy" className="link-blue">Privacy Policy</Link>.
          </p>
        </div>
      </main>
    </div>
  );
};

const tabStyle = (active: boolean): React.CSSProperties => ({
  flex: 1,
  padding: "12px 8px",
  background: "none",
  border: "none",
  borderBottom: active ? "2px solid var(--yellow)" : "2px solid transparent",
  color: active ? "var(--text)" : "var(--text-muted)",
  fontWeight: active ? 700 : 500,
  fontSize: "0.9rem",
  cursor: "pointer",
  marginBottom: "-1px",
  fontFamily: "inherit",
});

const PasswordToggle = ({ show, setShow }: { show: boolean; setShow: (v: boolean) => void }) => (
  <button
    type="button"
    onClick={() => setShow(!show)}
    style={{
      position: "absolute",
      right: 12,
      top: 36,
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "var(--text-muted)",
      display: "flex",
      alignItems: "center",
      padding: 4,
    }}
    aria-label={show ? "Hide password" : "Show password"}
  >
    {show ? <EyeOff size={16} /> : <Eye size={16} />}
  </button>
);

export default CourseAccess;
