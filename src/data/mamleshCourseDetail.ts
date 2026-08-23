export const COURSE_DETAIL = {
  id: "ai-masterclass",
  title: "Become an AI Engineer in 30 Days",
  promise:
    "Learn to build production-ready AI systems and become a recruiter-ready AI engineer in just 30 days.",
  format: "30 days · 10 live sessions · build real AI products",
  paymentUrl: "https://rzp.io/rzp/de3kIhbF",
  livePrice: 2499,
  originalPrice: 4999,
  enrollmentNote: "Enrollments are open - next cohort starts 1st August.",
  earlyBird: "Early-bird pricing ends soon — save now.",
  weekendMessage:
    "The weekend batch is fully booked. We are now running weekday classes only.",

  sessions: [
    { n: 1, track: "AI", title: "Foundations & LLMs", desc: "How LLMs actually work and the mental models you need to build with them.", topics: ["LLM fundamentals", "Tokens & context windows", "Stochastic outputs", "Setting up your stack"] },
    { n: 2, track: "AI", title: "Prompt Engineering", desc: "Design reliable prompts, get structured outputs, and avoid common failure modes.", topics: ["Prompt patterns", "Few-shot & chain-of-thought", "Structured outputs", "Prompt failure modes"] },
    { n: 3, track: "AI", title: "Tool Calling & RAG", desc: "Give models tools and ground them in your own data without hallucinations.", topics: ["Tool / function calling", "RAG pipelines", "Hybrid search & re-ranking", "Reducing hallucinations"] },
    { n: 4, track: "AI", title: "Agents & Multi-Agent Systems", desc: "Build agents that reason, plan, and act - then make them collaborate.", topics: ["Observe-Think-Act", "ReAct & Plan-Execute", "Orchestrator + specialists", "Multi-agent coordination"] },
    { n: 5, track: "AI", title: "Memory, Evaluation & Guardrails", desc: "Make your AI systems reliable, measurable, and safe.", topics: ["Memory architecture", "Evals & LLM-as-judge", "Guardrails", "Regression harness"] },
    { n: 6, track: "AI", title: "Production, MCP & Deploy", desc: "Ship it: production architecture, cost, observability, MCP, and deployment.", topics: ["Production architecture", "Cost & observability", "MCP", "Deployment"] },
    { n: 7, track: "Career", title: "Recruiter-Ready Resume & Portfolio", desc: "Build the assets that actually get you shortlisted.", topics: ["80%+ ATS resume", "Portfolio website", "GitHub README", "Showcasing real work"] },
    { n: 8, track: "Career", title: "LinkedIn & Personal Brand", desc: "A LinkedIn profile that gets replies, and a presence that compounds.", topics: ["LinkedIn rewrite", "Content that lands", "Outreach messages", "Networking"] },
    { n: 9, track: "Career", title: "Interview Prep, DSA & Mock Interviews", desc: "Get genuinely interview-ready with structured practice.", topics: ["DSA prep tracks", "Domain question banks", "AI mock interviews", "Company question banks"] },
    { n: 10, track: "Career", title: "Placements, Cold Outreach & Referrals", desc: "The playbook to actually land the role.", topics: ["Placement playbook", "Cold emails that work", "Referrals from strangers", "Negotiation basics"] },
  ],

  whatYouGet: [
    { title: "A recruiter-ready resume", desc: "A free resume scored 80+ on ATS - reviewed and optimised for you." },
    { title: "A portfolio to deploy", desc: "A portfolio website that showcases your real projects, ready to go live." },
    { title: "A LinkedIn review", desc: "A profile rewrite that makes recruiters stop and reach out." },
    { title: "A GitHub README template", desc: "A polished README that makes your GitHub profile stand out." },
  ],

  careerCompass: {
    tagline: "Everything outside coding that gets you hired - included with the course.",
    items: [
      "Access to 25+ technical training resources with videos",
      "30+ company-based interview question sets",
      "20+ interview questions to practise",
      "12+ career resources - cold emails, messages, and resumes",
      "A free resume, portfolio, LinkedIn review, and GitHub README template",
    ],
  },

  faqs: [
    { q: "What will I actually be able to do after 30 days?", a: "Build and ship production-style AI systems - RAG, agents, multi-agent workflows - and walk away recruiter-ready with a strong resume, portfolio, LinkedIn, and GitHub." },
    { q: "When does the next cohort start?", a: "The next cohort kicks off on 1st August. We run a single live Weekday batch and seats are limited - once it is full, it is full." },
    { q: "Do I need prior AI experience?", a: "No. You need basic Python and basic system design. We start from foundations and go all the way to production." },
    { q: "Is there a refund policy?", a: "Yes - a 24-hour, no-questions-asked refund window from the time of payment. After 24 hours, or once you download the invoice/certificate, you become ineligible." },
    { q: "Will I get a certificate?", a: "Yes. After the cohort ends you can download a certificate of completion from the portal." },
    { q: "Can I share my account?", a: "No. Devices and browsers are tracked; anything suspicious and access is revoked with no refund." },
  ],
};
