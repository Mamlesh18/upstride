import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Loader2, AlertTriangle, ExternalLink } from "lucide-react";
import MockInterview from "./MockInterview";
import { api } from "@/services/api";

const Y    = "#FFE500";
const B    = "#0A0A0A";
const W    = "#FFFFFF";
const BG   = "#FAFAFA";
const MUTE = "#6B7280";
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

// Where to bounce unauthenticated visitors. Override at deploy time if needed.
const SSO_LOGIN_FALLBACK = "https://upstrides.in/";

/**
 * Standalone Mock Interview page.
 *
 * Two entry modes:
 *   1. A logged-in Upstrides student lands here via the normal portal nav.
 *      The existing token in localStorage is used. They get the full feature.
 *   2. A paid student from a partner platform is redirected to
 *      /mock-interview?sso=<external-token>. We POST that token to our backend's
 *      /api/sso/exchange (which verifies it server-to-server with the partner),
 *      get back our own short-lived JWT scoped ONLY to this page, and store it.
 *      The user can ONLY see this page — ProtectedRoute blocks every other route.
 */
const MockInterviewPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState<"checking" | "exchanging" | "ready" | "error" | "denied">("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    const ssoToken = searchParams.get("sso");

    // ── Mode 2: SSO handshake ──
    if (ssoToken) {
      setStatus("exchanging");
      api.sso.exchange({ token: ssoToken, page: "mock-interview" })
        .then((res) => {
          localStorage.setItem("token", res.access_token);
          localStorage.setItem("userRole", "sso");
          localStorage.setItem("userEmail", res.email);
          localStorage.setItem("userName", res.name);
          localStorage.setItem("ssoScope", res.scope);
          // Clean the token out of the URL so it can't be re-used or shared.
          setSearchParams({}, { replace: true });
          setStatus("ready");
        })
        .catch((err) => {
          setError((err as Error).message || "We couldn't verify your session.");
          setStatus("error");
        });
      return;
    }

    // ── Mode 1: an existing logged-in user (student or returning SSO) ──
    const token = localStorage.getItem("token");
    if (token) {
      const role = localStorage.getItem("userRole");
      const scope = localStorage.getItem("ssoScope");
      // SSO sessions are locked to their scope. If somehow stale, deny.
      if (role === "sso" && scope !== "mock-interview") {
        setStatus("denied");
        return;
      }
      setStatus("ready");
      return;
    }

    // No token, no SSO handoff → not for them.
    setStatus("denied");
  }, [searchParams, setSearchParams]);

  // When MockInterview "exits": SSO users go back to the partner site;
  // normal students drop back into the portal.
  const handleExit = () => {
    const role = localStorage.getItem("userRole");
    if (role === "sso") {
      window.location.href = SSO_LOGIN_FALLBACK;
    } else {
      window.location.href = "/portal";
    }
  };

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
        <div style={{ marginTop: "16px", fontSize: "16px", fontWeight: 700, color: B }}>Session couldn't be verified</div>
        <div style={{ marginTop: "8px", fontSize: "13px", color: MUTE, maxWidth: "420px", textAlign: "center", lineHeight: 1.6 }}>
          {error || "Your access link has expired or is invalid."}
        </div>
        <a href={SSO_LOGIN_FALLBACK}
          style={{ marginTop: "20px", display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: B, color: Y, ...MONO, fontSize: "12px", fontWeight: 700, borderRadius: "8px", textDecoration: "none", letterSpacing: "0.08em" }}>
          BACK TO YOUR COURSE <ExternalLink size={12} />
        </a>
      </Centered>
    );
  }

  if (status === "denied") {
    return (
      <Centered>
        <AlertTriangle size={36} color="#EF4444" />
        <div style={{ marginTop: "16px", fontSize: "16px", fontWeight: 700, color: B }}>Access required</div>
        <div style={{ marginTop: "8px", fontSize: "13px", color: MUTE, maxWidth: "420px", textAlign: "center", lineHeight: 1.6 }}>
          Open Mock Interview from your course portal — that's where your session starts.
        </div>
        <a href={SSO_LOGIN_FALLBACK}
          style={{ marginTop: "20px", display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 18px", background: B, color: Y, ...MONO, fontSize: "12px", fontWeight: 700, borderRadius: "8px", textDecoration: "none", letterSpacing: "0.08em" }}>
          GO TO COURSE <ExternalLink size={12} />
        </a>
      </Centered>
    );
  }

  return <MockInterview onExit={handleExit} />;
};

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "24px" }}>
      {children}
    </div>
  );
}

export default MockInterviewPage;
