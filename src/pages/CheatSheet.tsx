import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Code2, ChevronRight } from "lucide-react";
import { SHEETS, type Block, type Section, type AnimName } from "@/data/cheatSheet";

// ─── Dark palette (matches DSA Sheet) ──────────────────────────────────
const BG    = "#0B0D10";
const SURF   = "#15171C";
const SURF2  = "#1B1E24";
const BORD   = "#262A31";
const TXT     = "#E6E8EB";
const MUTE    = "#8B919A";
const Y       = "#FFE500";
const CODE_BG = "#0E1014";

const EASY = "#22C55E", MED = "#F59E0B", HARD = "#EF4444", BLUE = "#60A5FA", VIO = "#A78BFA";

const SANS: React.CSSProperties = { fontFamily: "'Sora', system-ui, -apple-system, sans-serif" };
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

function useIsMobile() {
  const [m, setM] = useState(() => window.innerWidth < 900);
  useEffect(() => {
    const on = () => setM(window.innerWidth < 900);
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return m;
}

const CheatSheet = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { topic } = useParams<{ topic: string }>();
  const key: "python" | "dsa" = topic === "dsa" ? "dsa" : "python";
  const sheet = SHEETS[key];

  const [active, setActive] = useState(sheet.sections[0]?.id ?? "");

  // reset active section when switching sheets
  useEffect(() => { setActive(sheet.sections[0]?.id ?? ""); }, [key, sheet.sections]);

  const goSection = (id: string) => {
    setActive(id);
    document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TXT, ...SANS }}>

      {/* ── Top bar ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: `${BG}E6`, backdropFilter: "blur(8px)", borderBottom: `1px solid ${BORD}`, padding: isMobile ? "12px 16px" : "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <button onClick={() => navigate("/upstrides-sheet")} style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", color: MUTE, cursor: "pointer", fontSize: "13px", ...MONO }}>
          <ArrowLeft size={15} /> SHEET
        </button>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <BookOpen size={16} color={Y} />
          <span style={{ fontWeight: 700 }}>Cheat Sheet</span>
        </div>
        {/* Python / DSA toggle */}
        <div style={{ display: "inline-flex", background: SURF, border: `1px solid ${BORD}`, borderRadius: "10px", padding: "3px" }}>
          {(["python", "dsa"] as const).map(k => (
            <button key={k} onClick={() => navigate(`/cheat-sheet/${k}`)}
              style={{ padding: "6px 12px", background: key === k ? Y : "transparent", color: key === k ? BG : MUTE, border: "none", borderRadius: "7px", cursor: "pointer", fontSize: "12px", fontWeight: 700, ...SANS, display: "inline-flex", alignItems: "center", gap: "5px" }}>
              <Code2 size={12} /> {SHEETS[k].label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: isMobile ? "20px 14px 70px" : "28px 28px 90px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "230px 1fr", gap: isMobile ? "16px" : "28px", alignItems: "start" }}>

        {/* ── Section nav ── */}
        {isMobile ? (
          <select value={active} onChange={e => goSection(e.target.value)}
            style={{ width: "100%", background: SURF, border: `1px solid ${BORD}`, borderRadius: "10px", padding: "11px 12px", color: TXT, fontSize: "13px", fontWeight: 600, ...SANS, outline: "none" }}>
            {sheet.sections.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        ) : (
          <nav style={{ position: "sticky", top: "78px", maxHeight: "calc(100vh - 100px)", overflowY: "auto", background: SURF, border: `1px solid ${BORD}`, borderRadius: "14px", padding: "10px" }}>
            <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", color: MUTE, ...MONO, padding: "6px 10px 10px" }}>
              {sheet.label.toUpperCase()} · {sheet.sections.length} TOPICS
            </div>
            {sheet.sections.map(s => {
              const on = active === s.id;
              return (
                <button key={s.id} onClick={() => goSection(s.id)}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: "8px", padding: "9px 10px", background: on ? `${Y}14` : "transparent", border: "none", borderLeft: `2px solid ${on ? Y : "transparent"}`, borderRadius: "6px", cursor: "pointer", textAlign: "left", color: on ? TXT : MUTE, fontSize: "12.5px", fontWeight: on ? 600 : 400, ...SANS, marginBottom: "1px" }}>
                  <ChevronRight size={12} color={on ? Y : "#3A3F47"} style={{ flexShrink: 0 }} />
                  <span style={{ lineHeight: 1.3 }}>{s.title}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* ── Content ── */}
        <main>
          {/* Hero */}
          <div style={{ marginBottom: "22px" }}>
            <div style={{ display: "inline-block", background: Y, color: BG, ...MONO, fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", padding: "4px 10px", borderRadius: "5px", marginBottom: "12px" }}>
              BEFORE YOU START CODING
            </div>
            <h1 style={{ fontSize: isMobile ? "26px" : "32px", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
              {sheet.label} <span style={{ color: Y }}>Cheat Sheet</span>
            </h1>
            <p style={{ fontSize: "13.5px", color: MUTE, lineHeight: 1.6, maxWidth: "640px", margin: 0 }}>{sheet.blurb}</p>
          </div>

          {sheet.sections.map(sec => (
            <SectionView key={sec.id} section={sec} onVisible={() => setActive(sec.id)} />
          ))}
        </main>
      </div>
    </div>
  );
};

// ─── One section ─────────────────────────────────────────────────────────────
function SectionView({ section, onVisible }: { section: Section; onVisible: () => void }) {
  useEffect(() => {
    const el = document.getElementById(`sec-${section.id}`);
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) onVisible(); }, { rootMargin: "-40% 0px -55% 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [section.id, onVisible]);

  return (
    <section id={`sec-${section.id}`} style={{ scrollMarginTop: "84px", marginBottom: "18px", background: SURF, border: `1px solid ${BORD}`, borderRadius: "14px", padding: "20px 22px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: 700, color: TXT, margin: "0 0 14px", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ width: "4px", height: "18px", background: Y, borderRadius: "2px" }} />
        {section.title}
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {section.blocks.map((b, i) => <BlockView key={i} b={b} />)}
      </div>
    </section>
  );
}

// ─── Block renderer ──────────────────────────────────────────────────────────
function BlockView({ b }: { b: Block }) {
  switch (b.k) {
    case "p":
      return <p style={{ fontSize: "13.5px", color: "#C9CDD3", lineHeight: 1.7, margin: 0 }}>{b.t}</p>;
    case "list":
      return (
        <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
          {b.items.map((it, i) => <li key={i} style={{ fontSize: "13px", color: "#C9CDD3", lineHeight: 1.6 }}>{it}</li>)}
        </ul>
      );
    case "code":
      return (
        <pre style={{ margin: 0, padding: "14px 16px", background: CODE_BG, border: `1px solid ${BORD}`, borderRadius: "10px", overflowX: "auto", fontSize: "12.5px", lineHeight: 1.6, ...MONO, color: "#E6E8EB" }}>
          <code>{b.t}</code>
        </pre>
      );
    case "note":
      return (
        <div style={{ display: "flex", gap: "10px", padding: "11px 14px", background: `${Y}0E`, border: `1px solid ${Y}33`, borderRadius: "10px" }}>
          <span style={{ color: Y, fontWeight: 700, fontSize: "13px" }}>💡</span>
          <span style={{ fontSize: "12.5px", color: "#D7DBE0", lineHeight: 1.6 }}>{b.t}</span>
        </div>
      );
    case "table":
      return (
        <div style={{ overflowX: "auto", border: `1px solid ${BORD}`, borderRadius: "10px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12.5px" }}>
            <thead>
              <tr style={{ background: SURF2 }}>
                {b.head.map((h, i) => (
                  <th key={i} style={{ textAlign: "left", padding: "9px 12px", color: Y, fontWeight: 700, ...MONO, fontSize: "11px", letterSpacing: "0.04em", borderBottom: `1px solid ${BORD}`, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, ri) => (
                <tr key={ri} style={{ borderTop: `1px solid ${BORD}` }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: "9px 12px", color: ci === 0 ? TXT : "#C9CDD3", fontWeight: ci === 0 ? 600 : 400, lineHeight: 1.5, fontFamily: ci === 0 ? "'IBM Plex Mono', monospace" : undefined }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "anim":
      return <Anim name={b.name} />;
    default:
      return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  ANIMATED DIAGRAMS (CSS keyframes + SVG — no external images)
// ═══════════════════════════════════════════════════════════════════════════
const KEYFRAMES = `
@keyframes cs-stack-push { 0% { transform: translateY(-46px); opacity: 0; } 18%,82% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-46px); opacity: 0; } }
@keyframes cs-queue-move { 0% { transform: translateX(150px); opacity: 0; } 12% { opacity: 1; } 50% { transform: translateX(0); opacity: 1; } 88% { opacity: 1; } 100% { transform: translateX(-150px); opacity: 0; } }
@keyframes cs-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(255,229,0,0.0); } 50% { box-shadow: 0 0 0 4px rgba(255,229,0,0.25); } }
@keyframes cs-ptr-move { 0%,100% { left: 0; } 25% { left: 60px; } 50% { left: 120px; } 75% { left: 180px; } }
@keyframes cs-bs-lo  { 0%,20% { left: 0%; } 40%,100% { left: 50%; } }
@keyframes cs-bs-hi  { 0%,40% { left: 100%; } 60%,100% { left: 75%; } }
@keyframes cs-fade  { 0%,30% { opacity: 1; } 60%,100% { opacity: 0.18; } }
@keyframes cs-grow  { from { transform: scaleY(0.2); } to { transform: scaleY(1); } }
`;

function Anim({ name }: { name: AnimName }) {
  const wrap: React.CSSProperties = {
    background: CODE_BG, border: `1px solid ${BORD}`, borderRadius: "12px",
    padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
  };
  const cap = (t: string) => <div style={{ fontSize: "11px", color: MUTE, ...MONO, letterSpacing: "0.06em", textAlign: "center" }}>{t}</div>;

  return (
    <div style={wrap}>
      <style>{KEYFRAMES}</style>
      {name === "bigo" && <BigOViz />}
      {name === "stack" && <StackViz />}
      {name === "queue" && <QueueViz />}
      {name === "deque" && <DequeViz />}
      {name === "linkedlist" && <LinkedListViz />}
      {name === "binarysearch" && <BinarySearchViz />}
      {name === "tree" && <TreeViz />}
      {name === "recursion" && <RecursionViz />}
      {name === "hash" && <HashViz />}
      {name === "bigo" && cap("Same input size n — wildly different growth")}
      {name === "stack" && cap("Push & pop happen at the TOP only (LIFO)")}
      {name === "queue" && cap("Enter at the back, leave from the front (FIFO)")}
      {name === "deque" && cap("Add / remove from BOTH ends in O(1)")}
      {name === "linkedlist" && cap("Follow next pointers to walk the list")}
      {name === "binarysearch" && cap("Each step throws away half the array")}
      {name === "tree" && cap("Root → children → leaves, no cycles")}
      {name === "recursion" && cap("Calls stack up, then resolve back down")}
      {name === "hash" && cap("key → hash() → slot → value, in O(1)")}
    </div>
  );
}

const box = (color: string): React.CSSProperties => ({
  width: "44px", height: "34px", borderRadius: "7px", background: `${color}22`,
  border: `1.5px solid ${color}`, color: TXT, display: "flex", alignItems: "center",
  justifyContent: "center", fontSize: "13px", fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0,
});

function BigOViz() {
  // simple growth bars for n=8
  const data: { label: string; h: number; c: string }[] = [
    { label: "O(1)", h: 8, c: EASY },
    { label: "O(log n)", h: 22, c: "#34D399" },
    { label: "O(n)", h: 48, c: BLUE },
    { label: "O(n log n)", h: 72, c: VIO },
    { label: "O(n²)", h: 100, c: MED },
    { label: "O(2ⁿ)", h: 120, c: HARD },
  ];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "14px", height: "140px", padding: "0 6px" }}>
      {data.map(d => (
        <div key={d.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "30px", height: `${d.h}px`, background: d.c, borderRadius: "5px 5px 0 0", transformOrigin: "bottom", animation: "cs-grow 0.7s ease both" }} />
          <span style={{ fontSize: "9.5px", color: MUTE, ...MONO, whiteSpace: "nowrap" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function StackViz() {
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column-reverse", alignItems: "center", gap: "6px", minHeight: "150px", justifyContent: "flex-start" }}>
      <div style={{ width: "70px", height: "8px", background: BORD, borderRadius: "3px" }} />
      {["A", "B", "C"].map((v, i) => (
        <div key={v} style={{ ...box(Y), width: "70px", background: `${Y}22`, borderColor: Y, color: Y }}>{v}</div>
      ))}
      {/* the pushing/popping plate */}
      <div style={{ position: "absolute", top: "-2px", ...box(EASY), width: "70px", background: `${EASY}22`, borderColor: EASY, color: EASY, animation: "cs-stack-push 3s ease-in-out infinite" }}>D</div>
      <div style={{ position: "absolute", right: "-58px", top: "8px", fontSize: "10px", color: MUTE, ...MONO }}>← top</div>
    </div>
  );
}

function QueueViz() {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "320px", height: "60px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", gap: "8px" }}>
        {["1", "2", "3"].map(v => <div key={v} style={box(BLUE)}>{v}</div>)}
      </div>
      <div style={{ position: "absolute", ...box(EASY), background: `${EASY}22`, borderColor: EASY, color: EASY, animation: "cs-queue-move 3s linear infinite" }}>4</div>
      <span style={{ position: "absolute", left: "2px", bottom: "-2px", fontSize: "9px", color: MUTE, ...MONO }}>front →</span>
      <span style={{ position: "absolute", right: "2px", bottom: "-2px", fontSize: "9px", color: MUTE, ...MONO }}>← back</span>
    </div>
  );
}

function DequeViz() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span style={{ fontSize: "16px", color: EASY, animation: "cs-pulse 2s infinite", borderRadius: "6px" }}>⇄</span>
      {["7", "3", "9", "1"].map(v => <div key={v} style={box(VIO)}>{v}</div>)}
      <span style={{ fontSize: "16px", color: EASY, animation: "cs-pulse 2s infinite", borderRadius: "6px" }}>⇄</span>
    </div>
  );
}

function LinkedListViz() {
  return (
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "0", paddingTop: "16px" }}>
      {[0, 1, 2, 3].map((i, idx) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <div style={box(BLUE)}>{[1, 2, 3, 4][idx]}</div>
          {idx < 3 ? <span style={{ color: MUTE, margin: "0 4px", fontSize: "16px" }}>→</span> : <span style={{ color: MUTE, marginLeft: "4px", fontSize: "12px", ...MONO }}>∅</span>}
        </div>
      ))}
      {/* travelling pointer */}
      <div style={{ position: "absolute", top: 0, left: 0, fontSize: "10px", color: Y, ...MONO, animation: "cs-ptr-move 3s ease-in-out infinite" }}>▼ cur</div>
    </div>
  );
}

function BinarySearchViz() {
  const nums = [1, 3, 5, 7, 9, 11, 13, 15];
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "340px" }}>
      <div style={{ display: "flex", gap: "4px", justifyContent: "center" }}>
        {nums.map((n, i) => (
          <div key={n} style={{ ...box(i < 4 ? MUTE : EASY), width: "32px", height: "30px", fontSize: "12px", animation: i < 4 ? "cs-fade 3s ease-in-out infinite" : undefined, borderColor: i === 5 ? Y : (i < 4 ? BORD : EASY), color: i === 5 ? Y : TXT }}>{n}</div>
        ))}
      </div>
      <div style={{ position: "relative", height: "16px", marginTop: "6px" }}>
        <span style={{ position: "absolute", fontSize: "9px", color: Y, ...MONO, animation: "cs-bs-lo 3s ease-in-out infinite" }}>lo</span>
        <span style={{ position: "absolute", fontSize: "9px", color: Y, ...MONO, animation: "cs-bs-hi 3s ease-in-out infinite" }}>hi</span>
      </div>
      <div style={{ textAlign: "center", fontSize: "10px", color: MUTE, ...MONO }}>target = 11</div>
    </div>
  );
}

function TreeViz() {
  const node = (x: number, y: number, v: string, c: string) => (
    <g>
      <circle cx={x} cy={y} r="16" fill={`${c}22`} stroke={c} strokeWidth="1.5" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill={TXT} fontFamily="'IBM Plex Mono', monospace">{v}</text>
    </g>
  );
  return (
    <svg width="240" height="150" viewBox="0 0 240 150">
      {/* edges */}
      <line x1="120" y1="34" x2="64" y2="80" stroke={BORD} strokeWidth="1.5" />
      <line x1="120" y1="34" x2="176" y2="80" stroke={BORD} strokeWidth="1.5" />
      <line x1="64" y1="96" x2="34" y2="128" stroke={BORD} strokeWidth="1.5" />
      <line x1="64" y1="96" x2="94" y2="128" stroke={BORD} strokeWidth="1.5" />
      <line x1="176" y1="96" x2="206" y2="128" stroke={BORD} strokeWidth="1.5" />
      {node(120, 26, "8", Y)}
      {node(64, 88, "3", BLUE)}
      {node(176, 88, "12", BLUE)}
      {node(34, 136, "1", EASY)}
      {node(94, 136, "5", EASY)}
      {node(206, 136, "15", EASY)}
      <text x="120" y="16" textAnchor="middle" fontSize="9" fill={MUTE} fontFamily="'IBM Plex Mono', monospace">root</text>
    </svg>
  );
}

function RecursionViz() {
  // call stack building up then resolving
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "center" }}>
      {["fact(3)", "fact(2)", "fact(1) ✓"].map((c, i) => (
        <div key={c} style={{
          width: `${190 - i * 28}px`, padding: "6px 0", textAlign: "center",
          background: i === 2 ? `${EASY}22` : `${VIO}1A`, border: `1.5px solid ${i === 2 ? EASY : VIO}`,
          borderRadius: "7px", color: i === 2 ? EASY : TXT, fontSize: "12px", fontWeight: 700, ...MONO,
          animation: "cs-grow 0.5s ease both", animationDelay: `${i * 0.25}s`,
        }}>{c}</div>
      ))}
      <div style={{ fontSize: "10px", color: MUTE, ...MONO, marginTop: "2px" }}>base case reached → unwinds back up</div>
    </div>
  );
}

function HashViz() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
      <div style={{ ...box(BLUE), width: "auto", padding: "0 12px" }}>"cat"</div>
      <span style={{ color: MUTE, fontSize: "11px", ...MONO }}>—hash()→</span>
      <div style={{ ...box(Y), background: `${Y}22`, borderColor: Y, color: Y, width: "40px" }}>3</div>
      <span style={{ color: MUTE, fontSize: "16px" }}>→</span>
      {/* buckets */}
      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "9px", color: MUTE, ...MONO, width: "10px" }}>{i}</span>
            <div style={{ width: "54px", height: "16px", borderRadius: "4px", border: `1px solid ${i === 3 ? Y : BORD}`, background: i === 3 ? `${Y}22` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: i === 3 ? Y : MUTE, ...MONO }}>
              {i === 3 ? "🐱" : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CheatSheet;
