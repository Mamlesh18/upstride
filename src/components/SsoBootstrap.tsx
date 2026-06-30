import { useEffect, useState } from "react";
import { Loader2, AlertTriangle, ExternalLink } from "lucide-react";
import { api } from "@/services/api";

const Y    = "#FFE500";
const B    = "#0A0A0A";
const BG   = "#FAFAFA";
const MUTE = "#6B7280";
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

/**
 * Catches a `?sso=<token>` query param on any landing URL, exchanges it
 * with our backend (which verifies it server-to-server against mamlesh.me),
 * stores the resulting Upstride JWT, and strips the `sso` param from the URL.
 *
 * Mount this once, INSIDE BrowserRouter, ABOVE the <Routes>. It runs only on
 * initial mount — by the time the rest of the app renders the URL is clean
 * and the user is authenticated.
 */
const SsoBootstrap = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<"checking" | "exchanging" | "ready" | "error">("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ssoToken = params.get("sso");
    if (!ssoToken) {
      setStatus("ready");
      return;
    }

    setStatus("exchanging");
    api.sso.exchange({ token: ssoToken, page: "" })
      .then((res) => {
        localStorage.setItem("token", res.access_token);
        localStorage.setItem("userRole", "sso");
        localStorage.setItem("userEmail", res.email);
        localStorage.setItem("userName", res.name);
        if (res.scope) localStorage.setItem("ssoScope", res.scope);
        else localStorage.removeItem("ssoScope");

        // Remove ?sso=… so the token can't be re-used or shared via URL.
        params.delete("sso");
        const newSearch = params.toString();
        const cleaned =
          window.location.pathname +
          (newSearch ? `?${newSearch}` : "") +
          window.location.hash;
        window.history.replaceState(null, "", cleaned);
        setStatus("ready");
      })
      .catch((err) => {
        setError((err as Error).message || "We couldn't verify your session.");
        setStatus("error");
      });
  }, []);

  if (status === "checking" || status === "exchanging") {
    return (
      <Centered>
        <Loader2 size={28} className="animate-spin" color={B} />
        <div style={{ marginTop: "14px", fontSize: "13px", color: MUTE, ...MONO, letterSpacing: "0.06em" }}>
          {status === "exchanging" ? "VERIFYING YOUR SESSION…" : "LOADING…"}
        </div>
      </Centered>
    );
  }

  if (status === "error") {
    return (
      <Centered>
        <AlertTriangle size={36} color="#EF4444" />
        <div style={{ marginTop: "16px", fontSize: "16px", fontWeight: 700, color: B }}>
          Session couldn't be verified
        </div>
        <div style={{ marginTop: "8px", fontSize: "13px", color: MUTE, maxWidth: "420px", textAlign: "center", lineHeight: 1.6 }}>
          {error || "Your access link has expired or is invalid. Please open the link again from your course portal."}
        </div>
        <a href="https://mamlesh-me.vercel.app/"
          style={{ marginTop: "20px", display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: B, color: Y, ...MONO, fontSize: "12px", fontWeight: 700, borderRadius: "8px", textDecoration: "none", letterSpacing: "0.08em" }}>
          BACK TO YOUR COURSE <ExternalLink size={12} />
        </a>
      </Centered>
    );
  }

  return <>{children}</>;
};

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "24px" }}>
      {children}
    </div>
  );
}

export default SsoBootstrap;
