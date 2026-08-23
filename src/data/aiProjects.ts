// 24 real-world AI projects — each one solves an actual problem a company
// or team faces in production. Ordered basics → advanced (foundations → RAG
// → agents → multi-agent → MCP → guardrails/evals), grouped by domain.
//
// Difficulty levels:
//   1 = foundations (single API call, basic pipeline)
//   2 = intermediate (RAG / structured pipelines)
//   3 = advanced (agents, tool use, memory)
//   4 = production (multi-agent, MCP, guardrails, evals, deploy)

export type Domain =
  | "GenAI"
  | "Data Science"
  | "Machine Learning"
  | "Deep Learning"
  | "Computer Vision";

export interface AIProject {
  n: number;
  domain: Domain;
  level: 1 | 2 | 3 | 4;
  title: string;
  problem: string;      // the real-world pain point
  build: string;        // what you actually ship
  stack: string[];      // tools / libs / models
  outcome: string;      // what it proves
}

export const AI_PROJECTS: AIProject[] = [
  // ═════════════ GenAI track (10) — basics → RAG → agents → multi-agent → MCP → guardrails → evals ═════════════
  {
    n: 1, domain: "GenAI", level: 1,
    title: "Customer Support Reply Drafter",
    problem: "Support teams re-type the same replies for common queries. First-response time slips past SLA, agents burn out on repetition.",
    build: "A drafting assistant that reads the incoming ticket + the customer's past 5 messages and returns a ready-to-send reply in the brand voice, tone-controlled by a slider (empathetic ↔ direct).",
    stack: ["OpenAI/Anthropic API", "Prompt engineering", "Structured outputs", "FastAPI"],
    outcome: "Halved first-response time in a real support inbox.",
  },
  {
    n: 2, domain: "GenAI", level: 1,
    title: "Contract Clause Extractor",
    problem: "Legal ops teams spend hours pulling termination, liability, and payment clauses out of vendor contracts. It's slow and error-prone.",
    build: "A tool that ingests a PDF contract and returns a structured JSON of the 12 canonical clauses — with a confidence score and the source line for each.",
    stack: ["OpenAI function calling", "PDF parsing (pdfplumber)", "JSON schema", "Streamlit"],
    outcome: "Turned a 45-minute review into a 90-second one.",
  },
  {
    n: 3, domain: "GenAI", level: 2,
    title: "Internal Policy RAG",
    problem: "New employees ask HR/IT the same 200 questions in Slack. Answers live scattered across Notion, PDFs, and Confluence.",
    build: "A production RAG pipeline: crawl → chunk → embed → hybrid search (BM25 + vectors) → re-rank → answer. Always cites the source doc.",
    stack: ["LangChain", "FAISS/Qdrant", "BM25", "Cohere reranker", "Streamlit"],
    outcome: "One place employees actually get answers — with citations.",
  },
  {
    n: 4, domain: "GenAI", level: 2,
    title: "Recruiter-Ready Resume Rewriter",
    problem: "Candidates get rejected by ATS parsers before a human ever sees them. Most resumes score under 40% on ATS scans.",
    build: "Ingest resume + target JD → produce a rewritten resume optimized for ATS keywords, quantified bullets, and role-specific verbs. Score before/after.",
    stack: ["OpenAI", "Structured outputs", "ATS keyword extraction", "DOCX rendering"],
    outcome: "Ships an 80%+ ATS-scoring resume every time.",
  },
  {
    n: 5, domain: "GenAI", level: 3,
    title: "SQL-Speaking Analyst Agent",
    problem: "Product managers wait days for the data team to answer 'How many active users bought Plan B last week?' — questions that are just SQL.",
    build: "An agent that inspects the DB schema, writes SQL, runs it in a sandbox, self-corrects on error, and returns a chart + one-sentence explanation.",
    stack: ["LangChain SQL toolkit", "OpenAI", "DuckDB sandbox", "ReAct loop"],
    outcome: "PMs stop pinging the data team for basic questions.",
  },
  {
    n: 6, domain: "GenAI", level: 3,
    title: "Voice AI Appointment Booker",
    problem: "Clinics and salons miss 20-30% of calls after hours. Each missed call = lost revenue.",
    build: "A voice agent that answers the phone in real time — STT → intent → tool call to the booking API → TTS confirmation. Handles barge-in and DTMF.",
    stack: ["Deepgram STT/TTS", "OpenAI", "Twilio", "FastAPI websockets"],
    outcome: "24×7 coverage; every call captured.",
  },
  {
    n: 7, domain: "GenAI", level: 4,
    title: "Multi-Agent Research Team",
    problem: "Doing a solid competitor teardown takes an analyst two days: web search, doc reading, financial pull, synthesis.",
    build: "An orchestrator + 4 specialist agents (searcher, scraper, financial, synthesizer) collaborating via A2A. Produces a 3-page deck.",
    stack: ["LangGraph", "Plan-Execute pattern", "Tavily search", "Async orchestration"],
    outcome: "Two-day analyst task → 8 minutes.",
  },
  {
    n: 8, domain: "GenAI", level: 4,
    title: "MCP Server for Internal Tools",
    problem: "Each new AI product re-implements the same tool wrappers (Jira, Notion, Slack, GitHub). No reuse, no version discipline.",
    build: "One MCP server exposing your company's tools as standard MCP capabilities. Any Claude/GPT/agent client can plug in.",
    stack: ["MCP SDK", "Python", "OAuth", "JSON-RPC"],
    outcome: "One integration point, many consumers.",
  },
  {
    n: 9, domain: "GenAI", level: 4,
    title: "LLM Guardrail Layer",
    problem: "Your assistant sometimes leaks PII, gives medical advice, or drifts off-brand. Manual review can't scale.",
    build: "A middleware that runs input+output through a stack: PII detector → prompt-injection classifier → toxicity → topic policy → PII redactor. Blocks or rewrites.",
    stack: ["Presidio", "Llama Guard", "Regex + classifier ensemble", "FastAPI middleware"],
    outcome: "Assistant stays on-brand and compliant at 100k req/day.",
  },
  {
    n: 10, domain: "GenAI", level: 4,
    title: "LLM Regression Eval Harness",
    problem: "You upgrade the model, and 3 days later a customer notices the answers got worse. There's no way to know before shipping.",
    build: "An eval framework: fixture set of 200 prompts + expected outcomes + LLM-as-judge scoring + rubric metrics. Runs on every prompt/model change; fails the CI if quality drops.",
    stack: ["Braintrust/Ragas", "LLM-as-judge", "GitHub Actions", "Reports"],
    outcome: "Ship prompt changes with the confidence of a test suite.",
  },

  // ═════════════ Data Science track (5) — real analytics problems ═════════════
  {
    n: 11, domain: "Data Science", level: 1,
    title: "Cohort Retention Analyzer",
    problem: "Founders can't tell which cohort of signups actually stuck around. Aggregate MAU hides the answer.",
    build: "Ingest signup + activity events → build weekly retention curves per cohort → dashboard the drop-off week. Flag any cohort with >30% week-1 churn.",
    stack: ["Pandas", "SQL", "Plotly", "Streamlit"],
    outcome: "Turns 'MAU is up' into 'the July cohort is our best ever'.",
  },
  {
    n: 12, domain: "Data Science", level: 2,
    title: "Churn-Signal Feature Store",
    problem: "SaaS PMs know 'engaged users churn less' but nobody's actually built the feature. Support and CS act too late.",
    build: "Derive 25 leading indicators (login streak, feature-adoption slope, ticket-volume delta) from raw event logs. Score every user daily. Alert CS on decay.",
    stack: ["dbt", "PostgreSQL", "Airflow", "Great Expectations"],
    outcome: "CS calls the at-risk accounts before they cancel.",
  },
  {
    n: 13, domain: "Data Science", level: 2,
    title: "Ad-Spend Attribution Model",
    problem: "You spend on Google, Meta, and LinkedIn. Each dashboard claims credit for every conversion.",
    build: "Multi-touch attribution using Markov chains or Shapley values across the touchpoint sequence. Reallocate budget weekly with the actual causal signal.",
    stack: ["Python", "PyMC/NumPy", "BigQuery", "Metabase"],
    outcome: "Cut acquisition cost 20% by reallocating away from over-credited channels.",
  },
  {
    n: 14, domain: "Data Science", level: 3,
    title: "A/B Test Peeking Detector",
    problem: "Growth teams peek at running experiments and ship the 'winner' at p=0.06 on day 3. Half of those wins are noise.",
    build: "A test-analysis tool with proper stopping rules (sequential testing, always-valid p-values), and a review UI that shows the CI at every checkpoint.",
    stack: ["SciPy", "Statsforecast", "React + FastAPI"],
    outcome: "Stops shippers from claiming false wins.",
  },
  {
    n: 15, domain: "Data Science", level: 3,
    title: "Time-Series Anomaly Alerts",
    problem: "Ops team gets paged on 30 metrics with static thresholds. Half the pages are false alarms; the real one gets missed.",
    build: "Learn each metric's daily/weekly seasonality (Prophet/STL). Alert only when residual > 3σ AND breach lasts > N minutes. Auto-tune per metric.",
    stack: ["Prophet", "Statsmodels", "Prometheus", "PagerDuty"],
    outcome: "Cuts noisy pages ~80%; misses fewer real incidents.",
  },

  // ═════════════ Machine Learning track (4) — classical ML, real problems ═════════════
  {
    n: 16, domain: "Machine Learning", level: 1,
    title: "Loan Default Risk Scorer",
    problem: "Small NBFCs manually eyeball loan applications. Bad calls sink the portfolio; good applicants get rejected.",
    build: "Train a gradient-boosted model on historical loan outcomes; produce a probability of default + SHAP explanations per decision so credit officers see WHY.",
    stack: ["XGBoost", "SHAP", "scikit-learn", "FastAPI"],
    outcome: "Faster decisions and auditable rationale for every one.",
  },
  {
    n: 17, domain: "Machine Learning", level: 2,
    title: "Restaurant Demand Forecaster",
    problem: "Cloud kitchens over-prep 20% of ingredients or run out at peak. Both bleed margin.",
    build: "Forecast 30-minute demand per item using weather, day-of-week, promotions, and last-year seasonality. Route into a kitchen dashboard.",
    stack: ["LightGBM", "Prophet", "Redis", "Grafana"],
    outcome: "Slashes food waste; improves in-stock rate.",
  },
  {
    n: 18, domain: "Machine Learning", level: 2,
    title: "Fraud-Ring Detector",
    problem: "Payment fraud isn't lone actors — it's coordinated rings sharing devices, cards, and shipping addresses. Rules miss the pattern.",
    build: "Build a graph of accounts↔cards↔devices↔addresses. Run community detection + a supervised ring-scorer on the subgraph.",
    stack: ["NetworkX", "Neo4j", "PyG", "scikit-learn"],
    outcome: "Catches rings that per-account rules can't see.",
  },
  {
    n: 19, domain: "Machine Learning", level: 3,
    title: "Recommendation with Cold-Start Fallback",
    problem: "Streaming apps recommend nothing sensible to new users for the first week — the exact window when they decide to churn.",
    build: "Two-tower model for warm users + content-based fallback (embeddings of title/genre/tags) for cold users. A/B against most-popular.",
    stack: ["PyTorch", "TF Recommenders", "Feast", "MLflow"],
    outcome: "First-week engagement bumps for new signups.",
  },

  // ═════════════ Deep Learning track (3) — neural nets for real problems ═════════════
  {
    n: 20, domain: "Deep Learning", level: 2,
    title: "Call-Center Intent Classifier",
    problem: "Support IVR routes everyone to 'general enquiry' because keyword rules break on real speech.",
    build: "Fine-tune a transformer (DistilBERT/E5) on 5k labeled transcripts across 40 intents. Deploy at <100ms per utterance.",
    stack: ["HuggingFace Transformers", "PEFT/LoRA", "ONNX Runtime", "FastAPI"],
    outcome: "IVR routes 90%+ of calls correctly.",
  },
  {
    n: 21, domain: "Deep Learning", level: 3,
    title: "Real-Time ASR for Regional Accents",
    problem: "Off-the-shelf STT drops accuracy on Indian/African/SE-Asian accents — exactly the users voice-first apps are built for.",
    build: "Fine-tune Whisper on a curated regional-accent dataset. Ship as a streaming websocket API with sub-second latency and diarization.",
    stack: ["Whisper", "faster-whisper", "PyTorch", "CUDA", "websockets"],
    outcome: "Word-error rate drops 30%+ vs vanilla Whisper on the target accent.",
  },
  {
    n: 22, domain: "Deep Learning", level: 4,
    title: "Multimodal Product Q&A",
    problem: "E-commerce shoppers ask 'is this the same color as the one in this photo?' Support can't answer at scale.",
    build: "A CLIP-based system: encode the product catalog images + the user's uploaded photo → nearest-neighbor match → LLM writes the answer.",
    stack: ["CLIP/SigLIP", "FAISS", "OpenAI", "React upload UI"],
    outcome: "Answers photo-based product questions in <2s.",
  },

  // ═════════════ Computer Vision track (2) — real perception problems ═════════════
  {
    n: 23, domain: "Computer Vision", level: 3,
    title: "Warehouse Empty-Shelf Detector",
    problem: "In-store CCTV footage shows the moment a shelf goes empty, but no one is watching it live. Missed refill = missed sale.",
    build: "Fine-tune YOLOv8 on shelf images labeled full/partial/empty. Run against the RTSP feeds; ping the store manager when a shelf hits 'empty' > 5 min.",
    stack: ["YOLOv8", "OpenCV", "RTSP", "MQTT alerts"],
    outcome: "Catches out-of-stock inside 5 minutes, not the next audit.",
  },
  {
    n: 24, domain: "Computer Vision", level: 4,
    title: "Autonomous Ground-Monitoring Rover",
    problem: "Sugarcane / vineyard / poly-tunnel monitoring is dangerous and slow to do on foot. Diseases spread before manual audits catch them.",
    build: "A ROS-based ground rover: multi-camera perception, YOLOv8 disease detection, socket-streamed frames to a base server, autonomous nav with waypoints.",
    stack: ["ROS 2", "YOLOv8", "TensorRT", "Jetson", "socket streaming"],
    outcome: "Field patrolled 24×7; diseased plants flagged the same day.",
  },
];

export const DOMAIN_ACCENTS: Record<Domain, string> = {
  "GenAI": "#FFB000",
  "Data Science": "#3B82F6",
  "Machine Learning": "#22C55E",
  "Deep Learning": "#A855F7",
  "Computer Vision": "#EF4444",
};

export const LEVEL_LABEL: Record<AIProject["level"], string> = {
  1: "Foundations",
  2: "Intermediate",
  3: "Advanced",
  4: "Production",
};
