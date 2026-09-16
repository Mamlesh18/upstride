import { useCallback, useEffect, useRef, useState } from "react";

type Action = "ADD" | "SUPERSEDE" | "MERGE" | "NOOP" | "PATTERN";
type MemState = "active" | "superseded" | "merged" | "pattern";

interface Mem {
  id: string;
  text: string;
  state: MemState;
}

interface Step {
  /** What the user says. `null` for the background Dream pass. */
  message: string | null;
  action: Action;
  /** Why MemDream decided that — the line the audit log would carry. */
  reason: string;
  /** The full store after this step, so a frame is never half-applied. */
  memories: Mem[];
}

const M = (id: string, text: string, state: MemState = "active"): Mem => ({ id, text, state });

/**
 * A scripted run of the real decision flow: the same Chennai → Bangalore
 * contradiction the docs open with, plus a NOOP, a MERGE and a synthesized
 * pattern. Every store snapshot is written out in full so a frame can never
 * render half-applied.
 */
const STEPS: Step[] = [
  {
    message: "Hi, I'm Priya. I live in Chennai.",
    action: "ADD",
    reason: "2 durable facts extracted — nothing stored contradicts them",
    memories: [M("mem_a1", "User's name is Priya."), M("mem_b2", "User lives in Chennai.")],
  },
  {
    message: "I'm allergic to peanuts.",
    action: "ADD",
    reason: "new constraint, no candidate above the similarity floor",
    memories: [
      M("mem_a1", "User's name is Priya."),
      M("mem_b2", "User lives in Chennai."),
      M("mem_c3", "User is allergic to peanuts."),
    ],
  },
  {
    message: "hey thanks!",
    action: "NOOP",
    reason: "greeting or acknowledgement — no model call, logged anyway",
    memories: [
      M("mem_a1", "User's name is Priya."),
      M("mem_b2", "User lives in Chennai."),
      M("mem_c3", "User is allergic to peanuts."),
    ],
  },
  {
    message: "Actually, I moved to Bangalore last week.",
    action: "SUPERSEDE",
    reason: "contradicts mem_b2 — old memory retired in place, not deleted",
    memories: [
      M("mem_a1", "User's name is Priya."),
      M("mem_b2", "User lives in Chennai.", "superseded"),
      M("mem_c3", "User is allergic to peanuts."),
      M("mem_d4", "User lives in Bangalore."),
    ],
  },
  {
    message: "I can't eat peanuts at all — not even traces.",
    action: "MERGE",
    reason: "same fact, stated more precisely — mem_c3 points at the canonical version",
    memories: [
      M("mem_a1", "User's name is Priya."),
      M("mem_b2", "User lives in Chennai.", "superseded"),
      M("mem_c3", "User is allergic to peanuts.", "merged"),
      M("mem_d4", "User lives in Bangalore."),
      M("mem_e5", "User is severely allergic to peanuts, including traces."),
    ],
  },
  {
    message: null,
    action: "PATTERN",
    reason: "synthesis found something no single memory states",
    memories: [
      M("mem_a1", "User's name is Priya."),
      M("mem_b2", "User lives in Chennai.", "superseded"),
      M("mem_c3", "User is allergic to peanuts.", "merged"),
      M("mem_d4", "User lives in Bangalore."),
      M("mem_e5", "User is severely allergic to peanuts, including traces."),
      M("pat_f6", "User needs strict allergen checks when ordering food.", "pattern"),
    ],
  },
];

const TYPE_MS = 26;      // per character
const DECIDE_MS = 900;   // pause between the message landing and the decision
const HOLD_MS = 2200;    // how long a finished step stays on screen

const badgeClass: Record<Action, string> = {
  ADD: "add",
  SUPERSEDE: "supersede",
  MERGE: "merge",
  NOOP: "noop",
  PATTERN: "pattern",
};

export default function LifecycleDemo() {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState("");
  const [decided, setDecided] = useState(false);
  const [active, setActive] = useState(false);
  const [runId, setRunId] = useState(0);

  const hostRef = useRef<HTMLDivElement>(null);
  const reducedRef = useRef(false);

  // Only animate while the demo is actually on screen.
  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = hostRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setActive(e.isIntersecting), {
      threshold: 0.2,
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Drive one step: type the message, decide, hold, advance.
  useEffect(() => {
    if (!active) return;
    const current = STEPS[step];
    const timers: number[] = [];

    // Reduced motion: no typewriter and no auto-advance — settle on the last
    // step, which shows the store with every outcome already applied.
    if (reducedRef.current) {
      if (step !== STEPS.length - 1) {
        setStep(STEPS.length - 1);
        return;
      }
      setTyped(current.message ?? "");
      setDecided(true);
      return;
    }

    setTyped("");
    setDecided(false);

    const text = current.message ?? "";
    let i = 0;
    const typer = window.setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) window.clearInterval(typer);
    }, TYPE_MS);

    const typeDuration = text.length * TYPE_MS;
    timers.push(window.setTimeout(() => setDecided(true), typeDuration + DECIDE_MS));
    timers.push(
      window.setTimeout(
        () => setStep((s) => (s + 1) % STEPS.length),
        typeDuration + DECIDE_MS + HOLD_MS
      )
    );

    return () => {
      window.clearInterval(typer);
      timers.forEach(window.clearTimeout);
    };
  }, [step, active, runId]);

  const replay = useCallback(() => {
    setStep(0);
    setRunId((r) => r + 1);
  }, []);

  const current = STEPS[step];
  // While a message is still being typed, the store shows the *previous*
  // snapshot — the decision has not been made yet.
  const memories = decided ? current.memories : step === 0 ? [] : STEPS[step - 1].memories;
  const isDream = current.message === null;

  return (
    <div className="mdm-demo" ref={hostRef}>
      <div className="mdm-demo-side">
        <div className="mdm-demo-head">
          <span>Incoming — step {step + 1}/{STEPS.length}</span>
          <button type="button" className="mdm-demo-replay" onClick={replay}>
            ↻ Replay
          </button>
        </div>

        <div className="mdm-chat">
          <div className="mdm-msg" key={`msg-${runId}-${step}`}>
            <small>{isDream ? "Scheduler — background dream" : "User message"}</small>
            {isDream ? (
              <span>Nightly synthesis pass over 6 active memories…</span>
            ) : (
              <span>
                {typed}
                {typed.length < (current.message?.length ?? 0) && (
                  <i className="mdm-caret" aria-hidden="true" />
                )}
              </span>
            )}
          </div>

          {decided && (
            <div className="mdm-msg" key={`dec-${runId}-${step}`}>
              <small>MemDream decision</small>
              <div className="mdm-mem-row" style={{ marginBottom: 8 }}>
                <span className={`mdm-badge ${badgeClass[current.action]}`}>
                  {current.action}
                </span>
              </div>
              <p style={{ margin: 0, color: "var(--ink-dim)", fontSize: "0.86rem" }}>
                {current.reason}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mdm-demo-side">
        <div className="mdm-demo-head">
          <span>Memory store — user_priya</span>
          <span>{memories.filter((m) => m.state === "active" || m.state === "pattern").length} active</span>
        </div>

        <div className="mdm-store">
          {memories.length === 0 ? (
            <div className="mdm-store-empty">empty</div>
          ) : (
            memories.map((m, i) => (
              <div
                key={m.id}
                className={`mdm-mem ${m.state === "superseded" || m.state === "merged" ? "is-superseded" : ""}`}
                style={{
                  animationDelay: `${i * 45}ms`,
                  borderLeftColor:
                    m.state === "pattern"
                      ? "var(--violet)"
                      : m.state === "superseded" || m.state === "merged"
                        ? "var(--red)"
                        : "var(--green)",
                }}
              >
                <div className="mdm-mem-row">
                  <span className={`mdm-badge ${m.state === "pattern" ? "pattern" : m.state === "active" ? "add" : "supersede"}`}>
                    {m.state}
                  </span>
                  <code>{m.id}</code>
                </div>
                <p>{m.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
