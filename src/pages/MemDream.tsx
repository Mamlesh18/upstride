import { Link } from "react-router-dom";
import PublicLayout from "@/components/mamlesh/PublicLayout";
import Seo from "@/components/mamlesh/Seo";

const REPO_URL = "https://github.com/Mamlesh18/MemDream";

const LIFECYCLE = [
  {
    tag: "ADD",
    desc: "A genuinely new fact — nothing else changes.",
  },
  {
    tag: "SUPERSEDE",
    desc: "Contradicts something stored. The old memory is kept, marked superseded, and points at its replacement.",
  },
  {
    tag: "MERGE",
    desc: "The same fact, said better. The old memory is kept, marked merged, and points at the canonical version.",
  },
  {
    tag: "NOOP",
    desc: "Adds nothing new — nothing changes, and the reason is recorded in the audit log.",
  },
];

const REQUEST_FLOW = [
  { label: "1. Your message", desc: "A user message arrives at the API (or an embedded call)." },
  { label: "2. Extraction (LLM)", desc: "Durable facts are pulled out; small talk is dropped." },
  { label: "3. Policy", desc: "Confidence / importance floors and sensitivity rules are applied." },
  { label: "4. Exact-duplicate check", desc: "A hash lookup — costs nothing if you repeat yourself." },
  { label: "5. Embed + find candidates", desc: "Similarity search scoped to this user only." },
  { label: "6. Decision (LLM)", desc: "ADD / SUPERSEDE / MERGE / NOOP is proposed." },
  { label: "7. Validation", desc: "Invented ids are dropped; permanent facts are protected." },
  { label: "8. State transition", desc: "The backend applies the transition — never the model." },
  { label: "9. Vector index + audit log", desc: "The change is indexed and written to the audit trail." },
];

const DREAM_FLOW = [
  { label: "1. Scheduler / API trigger", desc: "Background synthesis is kicked off, off the request path." },
  { label: "2. Candidate selection", desc: "~1,000 memories are deterministically narrowed to ~200." },
  { label: "3. Clustering", desc: "Candidates are grouped into roughly 20 clusters." },
  { label: "4. Synthesis (LLM)", desc: "One call per cluster looks for patterns none of the memories state individually." },
  { label: "5. Idempotency check", desc: "Source overlap, then semantic similarity, before anything is written." },
  { label: "6. Pattern memory + provenance", desc: "New pattern memories are written with edges back to their evidence." },
];

const FEATURES = [
  { title: "Long-term memory", desc: "Durable facts persist across sessions instead of living only in a context window." },
  { title: "Contradiction handling", desc: "New facts are reasoned about against what's already known, not just appended." },
  { title: "Memory superseding", desc: "Contradicted memories are retired in place and linked to what replaced them." },
  { title: "Memory merging", desc: "The same fact stated more precisely replaces the vaguer version — traceably." },
  { title: "Non-destructive history", desc: "Nothing is ever deleted; superseded and merged memories keep pointers forward." },
  { title: "Tenant-safe isolation", desc: "Every repository call takes a MemoryScope; the vector index is physically partitioned per client/bot/user." },
  { title: "Audit trail", desc: "Every operation writes an audit row, including NOOP, so 'why was nothing remembered?' has an answer." },
  { title: "Semantic retrieval", desc: "Search ranks and returns memories as ready-to-use context." },
  { title: "Background synthesis (Dream)", desc: "Patterns across many memories are written down with provenance, off the request path." },
  { title: "Embedded SDK", desc: "MemDream runs inside your process — no server, no worker, nothing to deploy." },
  { title: "Hosted SDK", desc: "DreamClient talks to a running MemDream instance shared by several agents." },
  { title: "Self-hosting", desc: "One API process and one database — MongoDB or PostgreSQL. No broker required." },
  { title: "Multiple LLM providers", desc: "Azure OpenAI, OpenAI, Groq, Ollama, Together, Fireworks, Gemini, Anthropic, or any OpenAI-compatible endpoint." },
  { title: "Multiple embedding providers", desc: "Azure OpenAI, OpenAI, Ollama, Gemini, or any OpenAI-compatible endpoint." },
  { title: "Vector store options", desc: "FAISS, in-memory, Qdrant, pgvector, Chroma, Pinecone, Milvus, or Azure AI Search." },
];

export default function MemDream() {
  return (
    <PublicLayout>
      <div className="container page">
        <Seo
          title="MemDream — a long-term memory layer for AI agents"
          description="MemDream is a self-maintaining long-term memory layer for AI agents: it reasons about contradictions, supersedes and merges memories, and synthesizes patterns in the background — with full audit history."
        />

        {/* Hero */}
        <header className="memdream-hero">
          <span className="badge">Open-source project</span>
          <h1>MemDream</h1>
          <p className="tagline">
            A self-maintaining long-term memory layer for AI agents. Instead of just
            appending facts to a vector store, MemDream reasons about each new fact
            against what's already known — and decides whether to add it, let it
            replace something, merge it in, or leave the record untouched.
          </p>
          <div className="memdream-hero-cta">
            <a className="btn btn-primary" href={REPO_URL} target="_blank" rel="noreferrer">
              View on GitHub
            </a>
            <Link className="btn btn-ghost" to="/memdream/docs">
              Read the docs
            </Link>
          </div>
        </header>

        {/* Overview */}
        <section className="section">
          <h2 className="cd-h2">What is MemDream?</h2>
          <p className="muted" style={{ maxWidth: 720 }}>
            Most "agent memory" is a vector database with an <code className="md-inline-code">add()</code> call —
            which works fine until a user contradicts themselves. Tell it <em>"I live in
            Chennai"</em>, then later <em>"I moved to Bangalore"</em>, and a plain vector
            store now holds both, answering with whichever is worded closer to the
            question. MemDream is built specifically around that problem: every
            incoming fact is reasoned about against what's already stored before it's
            written anywhere.
          </p>

          <h3 className="cd-h3" style={{ fontSize: "1.1rem", marginBottom: 14 }}>
            The memory lifecycle
          </h3>
          <div className="mm-lifecycle">
            {LIFECYCLE.map((l) => (
              <div className="mm-lifecycle-card" key={l.tag}>
                <span className="tag">{l.tag}</span>
                <p>{l.desc}</p>
              </div>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 16, maxWidth: 720 }}>
            <strong>Nothing is ever deleted.</strong> Superseded and merged memories are
            retained with pointers to whatever replaced them, so "where did they live
            before, and when did that change?" stays answerable forever.
          </p>
        </section>

        <section className="section">
          <h2 className="cd-h2">Dream, isolation, and auditability</h2>
          <div className="cd-getgrid">
            <div className="cd-getcard">
              <h3>Dream &amp; synthesis</h3>
              <p>
                In the background, Dream reads across many memories and writes down
                the patterns none of them state individually — each one linked back
                to the evidence it came from.
              </p>
            </div>
            <div className="cd-getcard">
              <h3>Tenant isolation</h3>
              <p>
                Every repository method takes a scope; there's no method that reads a
                memory without one. The vector index is partitioned per client, bot,
                and user, so cross-tenant retrieval isn't something a filtering bug
                can cause — it's unrepresentable.
              </p>
            </div>
            <div className="cd-getcard">
              <h3>Explainable &amp; auditable</h3>
              <p>
                Every operation writes an audit row — NOOP included — so "why was
                nothing remembered?" is a question that always has an answer.
              </p>
            </div>
            <div className="cd-getcard">
              <h3>LLM-assisted, not LLM-controlled</h3>
              <p>
                The model only returns a proposal. The backend intersects its target
                ids with what it was actually shown, clamps scores, and refuses to
                retire protected memories — the state transition itself is always
                applied by the backend, never the model.
              </p>
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="section">
          <h2 className="cd-h2">How it works</h2>
          <p className="muted" style={{ maxWidth: 720 }}>
            Cheap, deterministic checks run first; the expensive one runs last, on as
            little as possible.
          </p>

          <p className="flow-title">Request path</p>
          <div className="flow">
            {REQUEST_FLOW.map((s, i) => (
              <div key={s.label}>
                <div className="flow-step">
                  <span className="fs-label">{s.label}</span>
                  <p>{s.desc}</p>
                </div>
                {i < REQUEST_FLOW.length - 1 && <div className="flow-arrow">↓</div>}
              </div>
            ))}
          </div>

          <p className="flow-title">Background Dream flow</p>
          <div className="flow">
            {DREAM_FLOW.map((s, i) => (
              <div key={s.label}>
                <div className="flow-step">
                  <span className="fs-label">{s.label}</span>
                  <p>{s.desc}</p>
                </div>
                {i < DREAM_FLOW.length - 1 && <div className="flow-arrow">↓</div>}
              </div>
            ))}
          </div>
        </section>

        {/* Key features */}
        <section className="section">
          <h2 className="cd-h2">Key features</h2>
          <div className="cd-getgrid">
            {FEATURES.map((f, i) => (
              <div className="cd-getcard" key={f.title}>
                <span className="cd-getnum">{i + 1}</span>
                <h3>{f.title}</h3>
                <p className="muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SDK / usage */}
        <section className="section">
          <h2 className="cd-h2">SDK &amp; usage</h2>
          <p className="muted" style={{ maxWidth: 720 }}>
            There's one surface, two ways to reach it: <code className="md-inline-code">MemDream</code>{" "}
            runs embedded, inside your own process — no server, no worker, nothing to
            deploy. <code className="md-inline-code">DreamClient</code> talks to a running
            MemDream instance instead, so several agents (in any language, over
            HTTP) can share one deployment. Both expose the same method names,
            arguments and return types, so moving from a prototype to a deployed
            service is a one-line change.
          </p>

          <div className="mm-compare">
            <div className="md-pre-wrap">
              <pre className="md-pre">
                <code>{`from memdream import MemDream

mem = MemDream(user_id="alice")   # scope set once

mem.add("I moved to Bangalore.")
print(mem.search("Where does the user live?").as_context())
# - User lives in Bangalore.`}</code>
              </pre>
            </div>
            <div className="md-pre-wrap">
              <pre className="md-pre">
                <code>{`from memdream import DreamClient

client = DreamClient(
    base_url="http://localhost:8000",
    client_id="client_456",
    bot_id="bot_123",
    phone_number="+919999999999",
)

result = client.memory.add("I moved to Bangalore.")
print(result.action)                # SUPERSEDE
print(result.superseded_memory_ids) # ['mem_...']`}</code>
              </pre>
            </div>
          </div>

          <div className="md-table-wrap" style={{ marginTop: 20 }}>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>MemDream (embedded)</th>
                  <th>DreamClient (hosted)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Deploy</td>
                  <td>nothing</td>
                  <td>uvicorn, optionally a worker</td>
                </tr>
                <tr>
                  <td>Best for</td>
                  <td>scripts, notebooks, a single agent, getting started</td>
                  <td>several services, several languages, central control</td>
                </tr>
                <tr>
                  <td>Needs</td>
                  <td>the whole package</td>
                  <td><code className="md-inline-code">httpx</code></td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="muted" style={{ marginTop: 18 }}>
            Full method-by-method reference — constructors, <code className="md-inline-code">add</code>,{" "}
            <code className="md-inline-code">search</code>, <code className="md-inline-code">synthesize</code>, return
            types, and errors — is in the{" "}
            <Link className="link-accent" to="/memdream/docs?section=sdk">
              Python SDK docs
            </Link>
            .
          </p>
        </section>

        {/* Deployment */}
        <section className="section">
          <h2 className="cd-h2">Deployment</h2>
          <p className="muted" style={{ maxWidth: 720 }}>
            MemDream needs one API process and one database — MongoDB or
            PostgreSQL — and nothing else. There's no broker and no separate worker
            process; background synthesis runs inside the API by default. It ships
            with Docker Compose for a one-command start, or you can run it directly
            with Python (<code className="md-inline-code">uvicorn app.main:app</code>). LLM
            and embedding providers, the database, and every tunable are configured
            through environment variables.
          </p>
          <div className="memdream-hero-cta">
            <Link className="btn btn-primary" to="/memdream/docs?section=self-hosting">
              Read the self-hosting guide
            </Link>
            <a className="btn btn-ghost" href={REPO_URL} target="_blank" rel="noreferrer">
              GitHub repository
            </a>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
