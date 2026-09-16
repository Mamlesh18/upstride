import { Link } from "react-router-dom";
import Seo from "@/components/mamlesh/Seo";
import MemDreamShell, { REPO_URL } from "@/components/memdream/MemDreamShell";
import Reveal from "@/components/memdream/Reveal";
import LifecycleDemo from "@/components/memdream/LifecycleDemo";
import CodeTabs from "@/components/memdream/CodeTabs";

const MARQUEE = [
  "Long-term memory",
  "Contradiction handling",
  "Supersede & merge",
  "Non-destructive history",
  "Tenant isolation",
  "Full audit trail",
  "Background synthesis",
  "Self-hostable",
  "9 LLM providers",
  "8 vector stores",
];

const LIFECYCLE = [
  {
    tag: "ADD",
    cls: "c-add",
    desc: "A genuinely new fact. Nothing else in the store changes.",
  },
  {
    tag: "SUPERSEDE",
    cls: "c-supersede",
    desc: "Contradicts something stored. The old memory is kept, marked superseded, and points at its replacement.",
  },
  {
    tag: "MERGE",
    cls: "c-merge",
    desc: "The same fact, said better. The old memory is kept, marked merged, and points at the canonical version.",
  },
  {
    tag: "NOOP",
    cls: "c-noop",
    desc: "Adds nothing new. Nothing changes — and the reason is written to the audit log anyway.",
  },
];

const REQUEST_FLOW = [
  { label: "Your message", desc: "A user message arrives at the API, or an embedded call.", tag: null },
  { label: "Extraction", desc: "Durable facts are pulled out; small talk is dropped.", tag: "LLM" },
  { label: "Policy", desc: "Confidence and importance floors, plus sensitivity rules, are applied.", tag: null },
  { label: "Exact-duplicate check", desc: "A hash lookup — repeating yourself costs nothing.", tag: null },
  { label: "Embed + find candidates", desc: "Similarity search, scoped to this user only.", tag: null },
  { label: "Decision", desc: "ADD / SUPERSEDE / MERGE / NOOP is proposed.", tag: "LLM" },
  { label: "Validation", desc: "Invented ids are dropped; permanent facts are protected.", tag: null },
  { label: "State transition", desc: "The backend applies the transition — never the model.", tag: null },
  { label: "Index + audit", desc: "The change is indexed and written to the audit trail.", tag: null },
];

const DREAM_FLOW = [
  { label: "Trigger", desc: "Scheduler or API kicks off synthesis, off the request path.", tag: null },
  { label: "Candidate selection", desc: "~1,000 memories are deterministically narrowed to ~200.", tag: null },
  { label: "Clustering", desc: "Candidates are grouped into roughly 20 clusters.", tag: null },
  { label: "Synthesis", desc: "One call per cluster looks for patterns no single memory states.", tag: "LLM" },
  { label: "Idempotency check", desc: "Source overlap, then semantic similarity, before anything is written.", tag: null },
  { label: "Pattern + provenance", desc: "Pattern memories are written with edges back to their evidence.", tag: null },
];

const GUARANTEES = [
  {
    title: "Tenant isolation is structural",
    body: "Every repository method takes a MemoryScope; there is no method that reads a memory without one. The vector index is physically partitioned per client, bot and user — cross-tenant retrieval isn't something a filtering bug can cause, it's unrepresentable.",
  },
  {
    title: "LLM-assisted, not LLM-controlled",
    body: "The model only returns a proposal. The backend intersects its target ids with what it was actually shown, clamps scores, and refuses to retire protected memories. The state transition itself is always applied by the backend.",
  },
  {
    title: "Nothing is ever deleted",
    body: "Superseded and merged memories are retained with pointers to whatever replaced them, so \"where did they live before, and when did that change?\" stays answerable forever.",
  },
  {
    title: "Every operation is explainable",
    body: "Every decision writes an audit row — NOOP included — so \"why was nothing remembered?\" is a question that always has an answer, months later.",
  },
];

const FEATURES = [
  { title: "Long-term memory", desc: "Durable facts persist across sessions instead of living only in a context window." },
  { title: "Contradiction handling", desc: "New facts are reasoned about against what's already known, not just appended." },
  { title: "Memory superseding", desc: "Contradicted memories are retired in place and linked to what replaced them." },
  { title: "Memory merging", desc: "The same fact stated more precisely replaces the vaguer version — traceably." },
  { title: "Semantic retrieval", desc: "Hybrid-ranked search returns memories as ready-to-use prompt context." },
  { title: "Time travel", desc: "Ask as_of a date and get only the memories that were true at that instant." },
  { title: "Background synthesis", desc: "Patterns across many memories are written down with provenance, off the request path." },
  { title: "Safe forgetting", desc: "A consolidation pass retires stale memories — a dry run by default, and never destructive." },
  { title: "Embedded SDK", desc: "MemDream runs inside your process. No server, no worker, nothing to deploy." },
  { title: "Hosted SDK", desc: "DreamClient talks to a running instance shared by several agents, in any language." },
  { title: "One process, one database", desc: "MongoDB or PostgreSQL. No broker, no cron container, no worker required." },
  { title: "Bring your own models", desc: "Azure OpenAI, OpenAI, Groq, Ollama, Together, Fireworks, Gemini, Anthropic, or any OpenAI-compatible endpoint." },
];

const CODE_TABS = [
  {
    label: "embedded.py",
    lang: "python",
    code: `from memdream import MemDream

mem = MemDream(user_id="user_123")        # scope set once

mem.add("Hi, I'm Priya. I live in Chennai.")
mem.add("I'm allergic to peanuts.")

result = mem.add("I live in Bangalore now.")
result.action                             # 'SUPERSEDE'
result.superseded_memory_ids              # ['mem_002e9cd0a9d94445bb4edad2']

print(mem.search("where does the user live?", latest_only=True).as_context())
# - User lives in Bangalore.`,
  },
  {
    label: "hosted.py",
    lang: "python",
    code: `from memdream import DreamClient

# Same methods, same arguments, same return types.
mem = DreamClient(
    "https://memory.example.com",
    api_key="sk_live_...",
    user_id="user_123",
)

mem.add("I live in Bangalore now.")
print(mem.search("where does the user live?", latest_only=True).as_context())`,
  },
  {
    label: "in an agent",
    lang: "python",
    code: `mem = MemDream()          # one instance per process — it holds pools

def handle(user_id: str, message: str) -> str:
    # 1. Recall before the model answers.
    memories = mem.search(message, latest_only=True, limit=8, user_id=user_id)

    reply = llm(
        system=f"What you know about this user:\\n{memories.as_context()}",
        user=message,
    )

    # 2. Remember after — the message is not context for itself.
    mem.add(message, user_id=user_id)
    return reply`,
  },
  {
    label: "curl",
    lang: "bash",
    code: `curl -X POST https://memory.example.com/v1/memories \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: sk_live_..." \\
  -d '{"userId": "user_123", "prompt": "I live in Bangalore now."}'

# { "action": "SUPERSEDE",
#   "memoryId": "mem_7c41d2a0…",
#   "supersededMemoryIds": ["mem_002e9cd0…"] }`,
  },
];

const DEPLOY_TABS = [
  {
    label: "docker compose",
    lang: "bash",
    code: `git clone https://github.com/Mamlesh18/MemDream.git
cd MemDream
cp .env.example .env          # add your provider credentials
docker compose up --build

# API on :8000, interactive docs at /docs, MongoDB on :27017`,
  },
  {
    label: "pip",
    lang: "bash",
    code: `pip install "memdream @ git+https://github.com/Mamlesh18/MemDream.git"

# Optional providers
pip install "memdream[gemini] @ git+https://github.com/Mamlesh18/MemDream.git"
pip install "memdream[postgres] @ git+https://github.com/Mamlesh18/MemDream.git"`,
  },
  {
    label: ".env",
    lang: "bash",
    code: `DREAM_MONGODB_URI=mongodb://localhost:27017
DREAM_MONGODB_DATABASE=memdream
DREAM_IDENTITY_SALT=a-long-random-string-you-never-change

DREAM_LLM_PROVIDER=openai
DREAM_EMBEDDING_PROVIDER=openai
OPENAI_API_KEY=sk-...`,
  },
];

function Pipe({
  title,
  meta,
  steps,
}: {
  title: string;
  meta: string;
  steps: { label: string; desc: string; tag: string | null }[];
}) {
  return (
    <Reveal className="mdm-pipe">
      <div className="mdm-pipe-head">
        <b>{title}</b>
        <span>{meta}</span>
      </div>
      <div className="mdm-pipe-body" style={{ position: "relative" }}>
        <span className="mdm-pulse" aria-hidden="true" />
        {steps.map((s, i) => (
          <div className="mdm-step" key={s.label}>
            <span className="mdm-step-n">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <b>
                {s.label}
                {s.tag && <span className="mdm-step-tag">{s.tag}</span>}
              </b>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

export default function MemDream() {
  return (
    <MemDreamShell>
      <Seo
        title="MemDream — a long-term memory layer for AI agents"
        description="MemDream is a self-maintaining long-term memory layer for AI agents: it reasons about contradictions, supersedes and merges memories, and synthesizes patterns in the background — with full audit history."
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <header className="mdm-hero">
        <div className="mdm-container">
          <span className="mdm-tagchip">
            <i /> Open source · Python · self-hostable
          </span>

          <h1 className="mdm-hero-title">
            <span className="mdm-word">
              <span>Memory</span>
            </span>
            <span className="mdm-word">
              <span className="mdm-outline">that reasons</span>
            </span>
          </h1>

          <p className="mdm-hero-sub">
            MemDream is a <b>self-maintaining long-term memory layer for AI agents</b>.
            Instead of appending facts to a vector store and hoping, it reasons about
            every new fact against what it already knows — then adds it, lets it
            replace something, merges it in, or leaves the record untouched.
          </p>

          <div className="mdm-hero-cta">
            <Link className="mdm-btn" to="/memdream/docs">
              Read the docs →
            </Link>
            <a className="mdm-btn mdm-btn-ghost" href={REPO_URL} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </div>

          <div className="mdm-hero-stats">
            <div className="mdm-stat">
              <b>4</b>
              <span>Decision outcomes</span>
            </div>
            <div className="mdm-stat">
              <b>0</b>
              <span>Memories ever deleted</span>
            </div>
            <div className="mdm-stat">
              <b>1+1</b>
              <span>Process + database</span>
            </div>
            <div className="mdm-stat">
              <b>100%</b>
              <span>Operations audited</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Marquee ──────────────────────────────────────────── */}
      <div className="mdm-marquee" aria-hidden="true">
        {[0, 1].map((dup) => (
          <div className="mdm-marquee-track" key={dup}>
            {MARQUEE.map((m) => (
              <span className="mdm-marquee-item" key={m}>
                {m}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* ── The problem + live demo ──────────────────────────── */}
      <section className="mdm-section">
        <div className="mdm-container">
          <Reveal>
            <span className="mdm-kicker">The problem</span>
            <h2 className="mdm-h2">
              A vector store <em>remembers everything</em>
              <br />
              and knows nothing
            </h2>
            <p className="mdm-lede">
              Most "agent memory" is a vector database with an <code className="md-inline-code">add()</code> call.
              That works right up until a user contradicts themselves. Tell it{" "}
              <em>"I live in Chennai"</em>, then later <em>"I moved to Bangalore"</em>, and a
              plain store now holds both — answering with whichever happens to be worded
              closer to the question. MemDream is built specifically around that moment.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <LifecycleDemo />
          </Reveal>
        </div>
      </section>

      {/* ── Lifecycle ────────────────────────────────────────── */}
      <section className="mdm-section mdm-section-tight">
        <div className="mdm-container">
          <Reveal>
            <span className="mdm-kicker">The lifecycle</span>
            <h2 className="mdm-h2">Four outcomes. Nothing else.</h2>
            <p className="mdm-lede">
              Every incoming fact resolves to exactly one of these, and the backend —
              not the model — applies it.
            </p>
          </Reveal>

          <Reveal delay={60} className="mdm-life">
            {LIFECYCLE.map((l, i) => (
              <div className={`mdm-life-card ${l.cls}`} key={l.tag}>
                <span className="mdm-life-n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{l.tag}</h3>
                <p>{l.desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Architecture ─────────────────────────────────────── */}
      <section className="mdm-section">
        <div className="mdm-container">
          <Reveal>
            <span className="mdm-kicker">Architecture</span>
            <h2 className="mdm-h2">Cheap checks first</h2>
            <p className="mdm-lede">
              The deterministic work runs first; the expensive model call runs last, on
              as little as possible. Repeating yourself never reaches an LLM at all.
            </p>
          </Reveal>

          <div className="mdm-pipes">
            <Pipe title="Request path" meta="synchronous" steps={REQUEST_FLOW} />
            <Pipe title="Dream — background" meta="off the request path" steps={DREAM_FLOW} />
          </div>
        </div>
      </section>

      {/* ── Guarantees ───────────────────────────────────────── */}
      <section className="mdm-section mdm-section-tight">
        <div className="mdm-container">
          <div className="mdm-split">
            <Reveal>
              <span className="mdm-kicker">Guarantees</span>
              <h2 className="mdm-h2">Boring where it counts</h2>
              <p className="mdm-lede">
                Memory is user data. The parts that must not go wrong are enforced by
                structure, not by a prompt.
              </p>
              <Link className="mdm-arrow" to="/memdream/docs/self-hosting">
                Self-hosting guide <span>→</span>
              </Link>
            </Reveal>

            <div>
              <ul className="mdm-checklist" style={{ marginTop: 0 }}>
                {GUARANTEES.map((g, i) => (
                  <Reveal as="li" key={g.title} delay={i * 70}>
                    <b>{g.title}.</b> {g.body}
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="mdm-section mdm-section-tight">
        <div className="mdm-container">
          <Reveal>
            <span className="mdm-kicker">Capabilities</span>
            <h2 className="mdm-h2">What you get</h2>
          </Reveal>

          <Reveal delay={60} className="mdm-features">
            {FEATURES.map((f, i) => (
              <div className="mdm-feat" key={f.title}>
                <span className="mdm-feat-n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── SDK ──────────────────────────────────────────────── */}
      <section className="mdm-section">
        <div className="mdm-container">
          <Reveal>
            <span className="mdm-kicker">SDK</span>
            <h2 className="mdm-h2">One surface, two ways in</h2>
            <p className="mdm-lede">
              <code className="md-inline-code">MemDream</code> runs embedded, inside your
              own process — no server, no worker, nothing to deploy.{" "}
              <code className="md-inline-code">DreamClient</code> talks to a running
              instance instead, so several services in several languages share one
              memory. Same method names, same arguments, same return types: moving from
              a prototype to a deployment is a one-line change.
            </p>
          </Reveal>

          <Reveal delay={60} style={{ marginTop: 32 }}>
            <CodeTabs tabs={CODE_TABS} />
          </Reveal>

          <Reveal delay={90} style={{ marginTop: 26 }}>
            <Link className="mdm-arrow" to="/memdream/docs/sdk">
              Full method reference <span>→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Deployment ───────────────────────────────────────── */}
      <section className="mdm-section mdm-section-tight">
        <div className="mdm-container">
          <div className="mdm-split">
            <Reveal>
              <span className="mdm-kicker">Deployment</span>
              <h2 className="mdm-h2">One process. One database.</h2>
              <p className="mdm-lede">
                No broker, no worker, no cron container. Remembering, recall and
                consolidation run synchronously inside the API; background synthesis
                runs in a bounded task pool in the same process. Providers, database and
                every tunable are environment variables.
              </p>
              <ul className="mdm-checklist">
                <li>
                  <b>Database.</b> MongoDB 6+, or PostgreSQL.
                </li>
                <li>
                  <b>Vector store.</b> FAISS on disk, in-memory, Qdrant, pgvector,
                  Chroma, Pinecone, Milvus or Azure AI Search.
                </li>
                <li>
                  <b>Auth.</b> Shared or client-bound API keys, rotatable without a
                  restart.
                </li>
                <li>
                  <b>Observability.</b> OTLP traces and metrics, per-request ids, durable
                  per-user token cost.
                </li>
              </ul>
            </Reveal>

            <Reveal delay={70}>
              <CodeTabs tabs={DEPLOY_TABS} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="mdm-section mdm-section-tight">
        <div className="mdm-container">
          <Reveal className="mdm-cta">
            <h2>Give your agent a past</h2>
            <p>
              Start embedded in a notebook, move to a hosted deployment when you need
              one. It's the same five methods either way.
            </p>
            <div className="mdm-hero-cta">
              <Link className="mdm-btn" to="/memdream/docs">
                Get started →
              </Link>
              <Link className="mdm-btn mdm-btn-ghost" to="/memdream/docs/api">
                API reference
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </MemDreamShell>
  );
}
