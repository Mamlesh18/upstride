import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Mail, Eye, EyeOff, KeyRound, Info } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

const Y = "#FFE500"; const B = "#0A0A0A"; const W = "#FFFFFF"; const BG = "#FAFAFA";
const BORD = "#E5E5E5"; const MUTE = "#6B7280";
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

// Credential Management API typing (Chrome / Edge; gracefully degrades elsewhere)
interface PasswordCredentialData { id: string; password: string; name?: string }
type PasswordCredentialCtor = new (data: PasswordCredentialData) => Credential;
const getPasswordCredentialCtor = (): PasswordCredentialCtor | null => {
  const w = window as unknown as { PasswordCredential?: PasswordCredentialCtor };
  return w.PasswordCredential ?? null;
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState({ next: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const inputStyle = (name: string): React.CSSProperties => ({
    width: "100%", padding: "12px 16px 12px 44px",
    backgroundColor: W, border: `2px solid ${focused === name ? B : BORD}`,
    borderRadius: "6px", color: B, fontSize: "14px", ...MONO, outline: "none",
    transition: "border-color 0.15s", boxSizing: "border-box" as const,
  });

  const saveCredentialToBrowser = async (id: string, password: string, name: string) => {
    try {
      const Ctor = getPasswordCredentialCtor();
      if (Ctor && navigator.credentials) {
        const cred = new Ctor({ id, password, name });
        await navigator.credentials.store(cred);
      }
    } catch {
      // Silent — browser may not support Credential Management API or user declined
    }
  };

  const routeByRole = (role: string) => {
    if (role === "super_admin") navigate("/admin");
    else if (role === "project_manager") navigate("/projects");
    else if (role === "sales_person") navigate("/sales");
    else navigate("/portal");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !next || !confirm) {
      toast({ title: "Missing fields", description: "Fill all fields", variant: "destructive" });
      return;
    }
    if (next !== confirm) {
      toast({ title: "Mismatch", description: "New passwords don't match", variant: "destructive" });
      return;
    }
    if (next.length < 8) {
      toast({ title: "Too short", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Step 1 — reset password directly (backend checks email exists)
      await api.auth.forgotPassword(email, next);

      // Step 2 — log in with the new password to get a token
      const res = await api.auth.login(email, next);
      const userName = res.user.name as string;
      const role = res.user.role as string;
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", res.user.email as string);
      localStorage.setItem("userName", userName);
      localStorage.setItem("mustChangePassword", "false");

      // Step 3 — ask the browser to save the new credential
      await saveCredentialToBrowser(email, next, userName);

      toast({ title: "Password updated", description: "Signed in with your new password." });
      routeByRole(role);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reset password";
      toast({ title: "Reset failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const ToggleBtn = ({ field }: { field: keyof typeof show }) => (
    <button type="button" onClick={() => setShow(s => ({ ...s, [field]: !s[field] }))}
      style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: MUTE, display: "flex", alignItems: "center" }}>
      {show[field] ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", ...MONO }}>
      <div style={{ width: "100%", maxWidth: "460px" }}>
        <button onClick={() => navigate("/login")}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: MUTE, background: "none", border: "none", cursor: "pointer", fontSize: "13px", ...MONO, marginBottom: "16px", padding: 0 }}
          onMouseEnter={e => (e.currentTarget.style.color = B)}
          onMouseLeave={e => (e.currentTarget.style.color = MUTE)}
        >
          <ArrowLeft size={16} /> Back to login
        </button>

        <div style={{ width: "100%", backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", padding: "36px", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "10px", backgroundColor: Y, border: `2px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `3px 3px 0 ${B}` }}>
              <KeyRound size={24} color={B} />
            </div>
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: B, textAlign: "center", marginBottom: "6px" }}>Forgot Password</h2>
          <p style={{ fontSize: "13px", color: MUTE, textAlign: "center", marginBottom: "20px", lineHeight: 1.6 }}>
            Enter your email and set a new password below.
          </p>

          {/* Hint banner */}
          <div style={{ background: `${Y}22`, border: `1.5px solid ${Y}`, borderRadius: "8px", padding: "10px 12px", display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "24px" }}>
            <Info size={14} color={B} style={{ flexShrink: 0, marginTop: "2px" }} />
            <div style={{ fontSize: "12px", color: B, lineHeight: 1.6 }}>
              We'll check that this email belongs to a registered student and reset the password.
            </div>
          </div>

          <form onSubmit={handleSubmit} method="post" autoComplete="on" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Email — autocomplete="username" lets the browser save the credential */}
            <div>
              <label htmlFor="email" style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "8px" }}>EMAIL ADDRESS</label>
              <div style={{ position: "relative" }}>
                <Mail size={16} color={focused === "email" ? B : MUTE} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  id="email"
                  name="username"
                  type="email"
                  autoComplete="username"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  style={inputStyle("email")}
                  required
                />
              </div>
            </div>

            {/* New password — autocomplete="new-password" prompts browser to offer-save */}
            <div>
              <label htmlFor="new-pw" style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "8px" }}>NEW PASSWORD</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color={focused === "next" ? B : MUTE} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  id="new-pw"
                  name="new-password"
                  type={show.next ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  value={next}
                  onChange={e => setNext(e.target.value)}
                  onFocus={() => setFocused("next")}
                  onBlur={() => setFocused(null)}
                  style={{ ...inputStyle("next"), paddingRight: "44px" }}
                  required
                  minLength={8}
                />
                <ToggleBtn field="next" />
              </div>
            </div>

            {/* Confirm new password */}
            <div>
              <label htmlFor="confirm-pw" style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "8px" }}>CONFIRM NEW PASSWORD</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color={focused === "confirm" ? B : MUTE} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  id="confirm-pw"
                  name="confirm-password"
                  type={show.confirm ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat new password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  onFocus={() => setFocused("confirm")}
                  onBlur={() => setFocused(null)}
                  style={{ ...inputStyle("confirm"), paddingRight: "44px" }}
                  required
                  minLength={8}
                />
                <ToggleBtn field="confirm" />
              </div>
              {confirm && next !== confirm && (
                <div style={{ fontSize: "11px", color: "#DC2626", marginTop: "6px", fontWeight: 600 }}>
                  Passwords don't match
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}
              style={{ width: "100%", padding: "14px", backgroundColor: loading ? `${B}cc` : B, color: Y, border: `2px solid ${B}`, borderRadius: "6px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", ...MONO, cursor: loading ? "not-allowed" : "pointer", boxShadow: `3px 3px 0 ${Y}`, marginTop: "8px" }}>
              {loading ? "UPDATING..." : "RESET PASSWORD & SIGN IN →"}
            </button>
          </form>

          <p style={{ marginTop: "20px", fontSize: "11px", color: MUTE, textAlign: "center", lineHeight: 1.7 }}>
            Your new password will be saved to your browser so you can sign in faster next time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
