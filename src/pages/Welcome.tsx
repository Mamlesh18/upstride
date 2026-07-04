import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, Eye, EyeOff, AlertTriangle, Sparkles, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

const Y    = "#FFE500";
const B    = "#0A0A0A";
const W    = "#FFFFFF";
const BG   = "#FAFAFA";
const BORD = "#E5E5E5";
const MUTE = "#6B7280";

const BEBAS: React.CSSProperties = { fontFamily: "'Bebas Neue', cursive" };
const MONO:  React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };
const SANS:  React.CSSProperties = { fontFamily: "'Geist', system-ui, -apple-system, sans-serif" };

/**
 * Post-payment onboarding page.
 * Razorpay redirects the buyer to `/welcome?onboarding=<token>` (or they open
 * it manually from an email). We inspect the token to show their email,
 * they pick a password, and we drop them into /portal already logged in.
 */
const POLL_INTERVAL_MS = 2500;
const POLL_MAX_MS      = 60_000;   // give the webhook up to a minute

type Phase =
  | "checking"          // inspecting an onboarding token from the URL
  | "polling"           // no token yet, waiting on the webhook
  | "poll-timeout"      // still nothing after 60s
  | "already-onboarded" // this email already has a password — go to login
  | "form"              // ready to set a password
  | "saving"
  | "done"
  | "error";

const Welcome = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const initialToken     = useMemo(() => params.get("onboarding") || "", [params]);
  const enrolledFlag     = useMemo(() => !!params.get("enrolled"), [params]);
  const razorpayPayment  = useMemo(() => params.get("razorpay_payment_id") || "", [params]);
  const emailFromUrl     = useMemo(() => params.get("email") || "", [params]);

  const [phase, setPhase] = useState<Phase>(
    initialToken ? "checking" : (enrolledFlag ? "polling" : "error")
  );
  const [error, setError]   = useState("");
  const [email, setEmail]   = useState(emailFromUrl);
  const [name, setName]     = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow]     = useState(false);

  // Polling bookkeeping
  const [pollTicks, setPollTicks]         = useState(0);   // for progress bar + "ask email" nudge
  const [emailFallback, setEmailFallback] = useState(emailFromUrl);
  const pollAliveRef = useRef(true);

  // ─── Load a known token: inspect and jump to the form ───────────────────
  const inspectToken = async (t: string) => {
    try {
      const r = await api.auth.onboardingInspect(t);
      setEmail(r.email);
      setName(r.name || "");
      setPhase("form");
    } catch (err) {
      setError((err as Error).message || "This onboarding link is not valid.");
      setPhase("error");
    }
  };

  useEffect(() => {
    if (initialToken) {
      setPhase("checking");
      void inspectToken(initialToken);
    } else if (!enrolledFlag) {
      setError("This link is missing an onboarding token. Please open it from your payment confirmation.");
      setPhase("error");
    }
  }, [initialToken, enrolledFlag]);

  // ─── Polling: /welcome?enrolled=1 (optionally with razorpay_payment_id) ──
  useEffect(() => {
    if (phase !== "polling") return;
    pollAliveRef.current = true;
    const start = Date.now();

    const attempt = async (): Promise<void> => {
      if (!pollAliveRef.current) return;
      const elapsed = Date.now() - start;
      setPollTicks(Math.floor(elapsed / POLL_INTERVAL_MS));

      // If we still don't have any identifier at all, don't hit the server.
      const emailToTry = (emailFallback || emailFromUrl).trim().toLowerCase();
      const haveIdentifier = !!razorpayPayment || !!emailToTry;

      if (haveIdentifier) {
        try {
          const r = await api.auth.onboardingFind({
            payment_id: razorpayPayment || undefined,
            email: emailToTry || undefined,
          });
          if (r.token) {
            // Update URL so a refresh keeps working, then inspect + show form.
            setParams({ onboarding: r.token }, { replace: true });
            pollAliveRef.current = false;
            void inspectToken(r.token);
            return;
          }
        } catch (err) {
          const msg = ((err as Error).message || "").toLowerCase();
          if (msg.includes("already-onboarded")) {
            pollAliveRef.current = false;
            setPhase("already-onboarded");
            return;
          }
          if (msg.includes("expired")) {
            pollAliveRef.current = false;
            setError("Your onboarding link has expired. Please contact support so we can resend it.");
            setPhase("error");
            return;
          }
          // 404 (not-ready) — quietly keep polling
        }
      }

      if (elapsed >= POLL_MAX_MS) {
        pollAliveRef.current = false;
        setPhase("poll-timeout");
        return;
      }
      setTimeout(attempt, POLL_INTERVAL_MS);
    };

    void attempt();
    return () => { pollAliveRef.current = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, razorpayPayment, emailFallback]);

  const retryPolling = () => {
    setPollTicks(0);
    setPhase("polling");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setPhase("saving");
    try {
      const res = await api.auth.onboardingComplete({ token, password, email });
      // Log the student in immediately.
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("userRole", res.user.role);
      localStorage.setItem("userEmail", res.user.email);
      localStorage.setItem("userName", res.user.name);
      localStorage.setItem("mustChangePassword", "false");
      // Best-effort browser password save.
      try {
        // @ts-expect-error — Credential Management API isn't in every TS lib.
        if (window.PasswordCredential) {
          // @ts-expect-error
          const cred = new window.PasswordCredential({ id: email, password, name });
          if (navigator.credentials?.store) await navigator.credentials.store(cred);
        }
      } catch { /* ignore */ }
      setPhase("done");
      setTimeout(() => navigate("/portal", { replace: true }), 900);
    } catch (err) {
      toast({ title: "Couldn't set password", description: (err as Error).message, variant: "destructive" });
      setPhase("form");
    }
  };

  // ── UI ──
  if (phase === "checking") {
    return (
      <Centered>
        <Loader2 size={28} className="animate-spin" color={B} />
        <div style={{ marginTop: "14px", fontSize: "13px", color: MUTE, ...MONO, letterSpacing: "0.06em" }}>
          LOADING YOUR ONBOARDING…
        </div>
      </Centered>
    );
  }

  if (phase === "polling") {
    // Do we have a way to identify the buyer?
    // - razorpay_payment_id in URL (comes back from some Razorpay products) → auto-poll
    // - email in URL or already typed → auto-poll
    // - neither → show the email input as the PRIMARY CTA so they can type it in
    const haveIdentifier = !!razorpayPayment || !!emailFromUrl || !!emailFallback;
    const pct = Math.min(100, Math.round((pollTicks / (POLL_MAX_MS / POLL_INTERVAL_MS)) * 100));

    if (!haveIdentifier) {
      return (
        <Centered>
          <div style={{ maxWidth: "460px", width: "100%" }}>
            <div style={{ background: Y, color: B, border: `3px solid ${B}`, boxShadow: `6px 6px 0 ${B}`, padding: "22px 24px", marginBottom: "18px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", ...MONO, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", marginBottom: "12px" }}>
                <Sparkles size={13} /> PAYMENT RECEIVED
              </div>
              <h1 style={{ ...BEBAS, fontSize: "36px", lineHeight: 1, color: B, marginBottom: "8px", letterSpacing: "0.02em" }}>
                ONE LAST STEP.
              </h1>
              <p style={{ fontSize: "13.5px", color: `${B}cc`, lineHeight: 1.6, margin: 0 }}>
                Enter the email you paid with so we can find your new account.
              </p>
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); setPollTicks(0); }}
              style={{ background: W, border: `2px solid ${B}`, padding: "20px 22px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", color: B }}>
                <Mail size={15} />
                <span style={{ ...MONO, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em" }}>YOUR PAYMENT EMAIL</span>
              </div>
              <input
                type="email"
                value={emailFallback}
                onChange={(e) => setEmailFallback(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                autoFocus
                style={{ width: "100%", padding: "11px 12px", border: `1.5px solid ${BORD}`, borderRadius: "6px", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "12px" }}
                onFocus={e => (e.currentTarget.style.borderColor = B)}
                onBlur={e => (e.currentTarget.style.borderColor = BORD)}
              />
              <button type="submit"
                disabled={!emailFallback.includes("@")}
                style={{ width: "100%", padding: "12px", background: B, color: Y, border: `2px solid ${B}`, ...MONO, fontSize: "12.5px", fontWeight: 700, letterSpacing: "0.12em", cursor: emailFallback.includes("@") ? "pointer" : "not-allowed", opacity: emailFallback.includes("@") ? 1 : 0.55, boxShadow: `4px 4px 0 ${Y}` }}>
                FIND MY ACCOUNT →
              </button>
              <p style={{ marginTop: "10px", fontSize: "11.5px", color: MUTE, lineHeight: 1.55, textAlign: "center" }}>
                Use the same email you typed on the Razorpay payment page.
              </p>
            </form>
          </div>
        </Centered>
      );
    }

    // Have an identifier → showing progress
    return (
      <Centered>
        <div style={{ maxWidth: "460px", width: "100%" }}>
          <div style={{ background: Y, color: B, border: `3px solid ${B}`, boxShadow: `6px 6px 0 ${B}`, padding: "24px 26px", textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", ...MONO, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", marginBottom: "14px" }}>
              <Sparkles size={13} /> PAYMENT RECEIVED
            </div>
            <h1 style={{ ...BEBAS, fontSize: "38px", lineHeight: 1, color: B, marginBottom: "8px", letterSpacing: "0.02em" }}>
              GIVE US A FEW SECONDS…
            </h1>
            <p style={{ fontSize: "13.5px", color: `${B}cc`, lineHeight: 1.6, margin: 0 }}>
              We're finishing your account setup. This usually takes 10–20 seconds.
            </p>
            <div style={{ marginTop: "18px", position: "relative", height: "8px", background: `${B}22`, border: `2px solid ${B}`, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: B, transition: "width 0.4s ease" }} />
            </div>
            <div style={{ marginTop: "10px", ...MONO, fontSize: "11px", color: `${B}99`, letterSpacing: "0.08em" }}>
              {pct < 100 ? "SETTING UP YOUR PORTAL…" : "ALMOST THERE…"}
            </div>
          </div>
          <div style={{ marginTop: "14px", textAlign: "center", fontSize: "12px", color: MUTE }}>
            Don't refresh — we'll take you to the next step automatically.
          </div>
        </div>
      </Centered>
    );
  }

  if (phase === "poll-timeout") {
    return (
      <Centered>
        <AlertTriangle size={36} color={B} />
        <div style={{ marginTop: "16px", ...BEBAS, fontSize: "32px", color: B, letterSpacing: "0.02em", textAlign: "center" }}>
          STILL SETTING UP…
        </div>
        <div style={{ marginTop: "10px", fontSize: "13.5px", color: MUTE, maxWidth: "440px", textAlign: "center", lineHeight: 1.65 }}>
          Your payment succeeded but our system is taking longer than usual to finish. Try once more, or drop us a line — we'll set you up manually within the hour.
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); retryPolling(); }}
          style={{ marginTop: "20px", background: W, border: `2px solid ${B}`, padding: "18px 20px", maxWidth: "440px", width: "100%" }}
        >
          <label style={{ display: "block", fontSize: "10.5px", fontWeight: 700, color: MUTE, ...MONO, letterSpacing: "0.14em", marginBottom: "6px" }}>
            EMAIL YOU PAID WITH
          </label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <input
              type="email"
              value={emailFallback}
              onChange={(e) => setEmailFallback(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              style={{ flex: 1, minWidth: "200px", padding: "11px 12px", border: `1.5px solid ${BORD}`, borderRadius: "6px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              onFocus={e => (e.currentTarget.style.borderColor = B)}
              onBlur={e => (e.currentTarget.style.borderColor = BORD)}
            />
            <button type="submit"
              disabled={!emailFallback.includes("@")}
              style={{ padding: "11px 18px", background: B, color: Y, border: `2px solid ${B}`, ...MONO, fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", cursor: emailFallback.includes("@") ? "pointer" : "not-allowed", opacity: emailFallback.includes("@") ? 1 : 0.55 }}>
              TRY AGAIN
            </button>
          </div>
        </form>
        <a href="mailto:mamlesh.va06@gmail.com"
          style={{ marginTop: "16px", padding: "9px 16px", background: "transparent", color: B, border: `2px solid ${B}`, ...MONO, fontSize: "11.5px", fontWeight: 700, textDecoration: "none", letterSpacing: "0.1em" }}>
          EMAIL SUPPORT
        </a>
      </Centered>
    );
  }

  if (phase === "already-onboarded") {
    return (
      <Centered>
        <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: Y, border: `3px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `4px 4px 0 ${B}` }}>
          <CheckCircle2 size={28} color={B} strokeWidth={2.5} />
        </div>
        <div style={{ marginTop: "16px", ...BEBAS, fontSize: "34px", color: B, letterSpacing: "0.02em", textAlign: "center" }}>
          YOU ALREADY HAVE AN ACCOUNT
        </div>
        <div style={{ marginTop: "10px", fontSize: "13.5px", color: MUTE, maxWidth: "440px", textAlign: "center", lineHeight: 1.65 }}>
          Log in with the password you set the first time. Forgot it? Use the reset link on the login page.
        </div>
        <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          <a href="/login" style={{ padding: "10px 18px", background: B, color: Y, ...MONO, fontSize: "12px", fontWeight: 700, textDecoration: "none", letterSpacing: "0.08em", border: `2px solid ${B}`, boxShadow: `4px 4px 0 ${Y}` }}>
            GO TO LOGIN →
          </a>
          <a href="/forgot-password" style={{ padding: "10px 18px", background: W, color: B, ...MONO, fontSize: "12px", fontWeight: 700, textDecoration: "none", letterSpacing: "0.08em", border: `2px solid ${B}` }}>
            RESET PASSWORD
          </a>
        </div>
      </Centered>
    );
  }

  if (phase === "error") {
    return (
      <Centered>
        <AlertTriangle size={36} color="#EF4444" />
        <div style={{ marginTop: "16px", fontSize: "18px", fontWeight: 800, color: B, ...BEBAS, letterSpacing: "0.03em" }}>
          THIS LINK ISN'T VALID
        </div>
        <div style={{ marginTop: "8px", fontSize: "13px", color: MUTE, maxWidth: "440px", textAlign: "center", lineHeight: 1.6 }}>
          {error}
        </div>
        <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          <a href="/login" style={{ padding: "10px 18px", background: B, color: Y, ...MONO, fontSize: "12px", fontWeight: 700, textDecoration: "none", letterSpacing: "0.08em", border: `2px solid ${B}` }}>
            GO TO LOGIN
          </a>
          <a href="mailto:mamlesh.va06@gmail.com" style={{ padding: "10px 18px", background: W, color: B, ...MONO, fontSize: "12px", fontWeight: 700, textDecoration: "none", letterSpacing: "0.08em", border: `2px solid ${B}` }}>
            EMAIL SUPPORT
          </a>
        </div>
      </Centered>
    );
  }

  if (phase === "done") {
    return (
      <Centered>
        <div style={{ width: "68px", height: "68px", borderRadius: "50%", background: Y, border: `3px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `5px 5px 0 ${B}` }}>
          <CheckCircle2 size={32} color={B} strokeWidth={2.5} />
        </div>
        <div style={{ marginTop: "18px", ...BEBAS, fontSize: "36px", color: B, letterSpacing: "0.03em" }}>YOU'RE IN.</div>
        <div style={{ fontSize: "13.5px", color: MUTE, marginTop: "4px" }}>Taking you to the portal…</div>
      </Centered>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", ...SANS }}>
      <div style={{ maxWidth: "440px", width: "100%" }}>
        {/* Header card */}
        <div style={{ background: Y, color: B, border: `3px solid ${B}`, boxShadow: `6px 6px 0 ${B}`, padding: "20px 24px", marginBottom: "22px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", ...MONO, fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", marginBottom: "10px" }}>
            <Sparkles size={12} /> PAYMENT CONFIRMED
          </div>
          <h1 style={{ ...BEBAS, fontSize: "44px", lineHeight: 0.95, color: B, marginBottom: "8px" }}>
            WELCOME TO<br />UPSTRIDES.
          </h1>
          <p style={{ fontSize: "13.5px", color: `${B}cc`, lineHeight: 1.55, margin: 0 }}>
            One last step — set a password so you can log in whenever you want.
          </p>
        </div>

        {/* Form card */}
        <form onSubmit={submit} style={{ background: W, border: `2px solid ${B}`, padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "10.5px", fontWeight: 700, color: MUTE, ...MONO, letterSpacing: "0.14em", marginBottom: "6px" }}>
              YOUR EMAIL
            </label>
            <div style={{ padding: "10px 12px", background: BG, border: `1.5px solid ${BORD}`, borderRadius: "6px", fontSize: "14px", color: B, wordBreak: "break-all" }}>{email}</div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "10.5px", fontWeight: 700, color: MUTE, ...MONO, letterSpacing: "0.14em", marginBottom: "6px" }}>
              YOUR NAME
            </label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name"
              style={{ width: "100%", padding: "11px 12px", border: `1.5px solid ${BORD}`, borderRadius: "6px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              onFocus={e => (e.currentTarget.style.borderColor = B)}
              onBlur={e => (e.currentTarget.style.borderColor = BORD)}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "10.5px", fontWeight: 700, color: MUTE, ...MONO, letterSpacing: "0.14em", marginBottom: "6px" }}>
              CREATE A PASSWORD
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                style={{ width: "100%", padding: "11px 40px 11px 12px", border: `1.5px solid ${BORD}`, borderRadius: "6px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
                onFocus={e => (e.currentTarget.style.borderColor = B)}
                onBlur={e => (e.currentTarget.style.borderColor = BORD)}
              />
              <button type="button" onClick={() => setShow(s => !s)}
                style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: MUTE, display: "flex", padding: "6px" }}>
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "10.5px", fontWeight: 700, color: MUTE, ...MONO, letterSpacing: "0.14em", marginBottom: "6px" }}>
              CONFIRM PASSWORD
            </label>
            <input
              type={show ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Type it again"
              autoComplete="new-password"
              style={{ width: "100%", padding: "11px 12px", border: `1.5px solid ${confirmPassword && confirmPassword !== password ? "#EF4444" : BORD}`, borderRadius: "6px", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              onFocus={e => (e.currentTarget.style.borderColor = confirmPassword && confirmPassword !== password ? "#EF4444" : B)}
              onBlur={e => (e.currentTarget.style.borderColor = confirmPassword && confirmPassword !== password ? "#EF4444" : BORD)}
            />
            {confirmPassword && confirmPassword !== password && (
              <p style={{ marginTop: "6px", fontSize: "11.5px", color: "#EF4444" }}>Passwords don't match.</p>
            )}
          </div>

          <button type="submit" disabled={phase === "saving" || password.length < 8 || password !== confirmPassword}
            style={{
              marginTop: "6px", padding: "13px 16px", background: B, color: Y, border: `2px solid ${B}`,
              ...MONO, fontSize: "13px", fontWeight: 800, letterSpacing: "0.14em",
              cursor: phase === "saving" ? "not-allowed" : "pointer",
              opacity: phase === "saving" || password.length < 8 || password !== confirmPassword ? 0.55 : 1,
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
              boxShadow: `4px 4px 0 ${Y}`,
            }}>
            {phase === "saving" ? <><Loader2 size={14} className="animate-spin" /> SAVING…</> : <>SET PASSWORD & LOG IN →</>}
          </button>

          <p style={{ marginTop: "4px", fontSize: "11.5px", color: MUTE, textAlign: "center", lineHeight: 1.5 }}>
            You'll use <strong style={{ color: B }}>{email}</strong> and this password to log in from now on.
          </p>
        </form>
      </div>
    </div>
  );
};

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "24px", ...SANS }}>
      {children}
    </div>
  );
}

export default Welcome;
