import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

const Y = "#FFE500"; const B = "#0A0A0A"; const W = "#FFFFFF"; const BG = "#FAFAFA";
const BORD = "#E5E5E5"; const MUTE = "#6B7280";
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

const ChangePassword = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const inputStyle = (name: string): React.CSSProperties => ({
    width: "100%", padding: "12px 16px 12px 44px",
    backgroundColor: W, border: `2px solid ${focused === name ? B : BORD}`,
    borderRadius: "6px", color: B, fontSize: "14px", ...MONO, outline: "none",
    transition: "border-color 0.15s", boxSizing: "border-box" as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      await api.auth.changePassword(current, next);
      localStorage.setItem("mustChangePassword", "false");
      toast({ title: "Password updated", description: "You can now access the portal" });
      const role = localStorage.getItem("userRole");
      if (role === "super_admin") navigate("/admin");
      else if (role === "project_manager") navigate("/projects");
      else if (role === "sales_person") navigate("/sales");
      else navigate("/portal");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change password";
      toast({ title: "Error", description: msg, variant: "destructive" });
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
      <div style={{ width: "100%", maxWidth: "440px", backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", padding: "40px", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "10px", backgroundColor: Y, border: `2px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `3px 3px 0 ${B}` }}>
            <KeyRound size={24} color={B} />
          </div>
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: B, textAlign: "center", marginBottom: "6px" }}>Set Your Password</h2>
        <p style={{ fontSize: "13px", color: MUTE, textAlign: "center", marginBottom: "32px" }}>First-time login — please create a secure password</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {[
            { label: "CURRENT PASSWORD", value: current, set: setCurrent, field: "current" as const, placeholder: "Enter temporary password" },
            { label: "NEW PASSWORD", value: next, set: setNext, field: "next" as const, placeholder: "Min. 8 characters" },
            { label: "CONFIRM NEW PASSWORD", value: confirm, set: setConfirm, field: "confirm" as const, placeholder: "Repeat new password" },
          ].map(({ label, value, set, field, placeholder }) => (
            <div key={field}>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "8px" }}>{label}</label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color={focused === field ? B : MUTE} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} />
                <input
                  type={show[field] ? "text" : "password"}
                  placeholder={placeholder}
                  value={value}
                  onChange={e => set(e.target.value)}
                  onFocus={() => setFocused(field)}
                  onBlur={() => setFocused(null)}
                  style={{ ...inputStyle(field), paddingRight: "44px" }}
                  required
                />
                <ToggleBtn field={field} />
              </div>
            </div>
          ))}

          <button type="submit" disabled={loading}
            style={{ width: "100%", padding: "14px", backgroundColor: loading ? `${B}cc` : B, color: Y, border: `2px solid ${B}`, borderRadius: "6px", fontSize: "13px", fontWeight: 700, letterSpacing: "0.12em", ...MONO, cursor: loading ? "not-allowed" : "pointer", boxShadow: `3px 3px 0 ${Y}`, marginTop: "4px" }}>
            {loading ? "SAVING..." : "SET PASSWORD & CONTINUE →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
