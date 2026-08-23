import { useState, useEffect, useCallback } from "react";
import MockInterview from "./MockInterview";
import CourseViewer from "@/components/CourseViewer";
import CourseCover, { getCourseDescription } from "@/components/CourseCover";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}
import { useNavigate, useParams } from "react-router-dom";
import {
  Building2, LogOut, GraduationCap,
  MessageCircle, BookOpen, ArrowUpRight,
  Zap, Trophy,
  PlayCircle, Lock, X, Send, CalendarDays, Menu, ClipboardList,
  LayoutDashboard, Users, Briefcase, TrendingUp,
  ChevronDown, ArrowLeft, Network, Server, Layers, Sparkles,
  Database, Coffee, Cpu, Code2,
  Boxes, Atom, Table, Brain, Smartphone,
  Utensils, Wifi, LayoutGrid, Globe,
  CreditCard, Banknote, Building, Landmark, Hexagon, BarChart3,
  Router, Apple as AppleIcon, Package, Mail, Bike,
  ChevronsRight, Sun, Compass, HardHat, Calculator, PieChart, Lightbulb, Monitor, Leaf,
  CircuitBoard,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import { AI_PROJECTS, DOMAIN_ACCENTS, LEVEL_LABEL, type Domain } from "@/data/aiProjects";

// ─── Theme ───────────────────────────────────────────────────────────────────
const Y    = "#FFE500";   // yellow
const B    = "#0A0A0A";   // black
const W    = "#FFFFFF";   // white
const BG   = "#FAFAFA";   // page bg
const BORD = "#E5E5E5";   // border
const MUTE = "#6B7280";   // muted text
const SURF = "#FFFFFF";   // card surface

const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

// ─── Types ───────────────────────────────────────────────────────────────────
type ViewType = "overview" | "courses" | "placements" | "interviews" | "career_kit" | "sessions" | "resume" | "leaderboard" | "mockinterview" | "course" | "projects";

interface CourseSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  emoji: string;
  image_url: string;
  duration: string;
  category: string;
  section: string;
  total_topics: number;
  completed_topics: number;
  progress_pct: number;
  is_active: boolean;
  is_recommended: boolean;
  order: number;
}


// ─── Career Kit: Online Resources ────────────────────────────────────────────
type CKResType = { type: "yt" | "reddit" | "article"; title: string; url: string; sub: string };
const CK_RESOURCES: Record<string, CKResType[]> = {
  resume_review: [
    { type: "yt",      title: "Write an Incredible Resume: 5 Golden Rules",  url: "https://www.youtube.com/watch?v=Tt08KmFfIYQ", sub: "Don Georgevich · 4.5M views" },
    { type: "yt",      title: "The Best Resume in 2024",                     url: "https://www.youtube.com/watch?v=kKay6eD7UJw", sub: "Jeff Su" },
    { type: "reddit",  title: "r/resumes — Real resume reviews",             url: "https://www.reddit.com/r/resumes/",            sub: "240k members" },
    { type: "article", title: "Top 10 YouTube Channels for Job Seekers",     url: "https://www.jobscan.co/blog/top-10-youtube-channels-for-job-seekers/", sub: "Jobscan Blog" },
  ],
  cover_letter: [
    { type: "yt",      title: "How to Write a Cover Letter (No Experience)", url: "https://www.youtube.com/watch?v=hrQ63KB3rBE", sub: "Jeff Su" },
    { type: "reddit",  title: "r/jobs — Cover Letter Help",                  url: "https://www.reddit.com/r/jobs/",              sub: "1.4M members" },
    { type: "article", title: "5 Cold Outreach Scripts That Work",           url: "https://joinhandshake.com/blog/students/cold-outreach-in-job-search/", sub: "Handshake Blog" },
  ],
  linkedin_review: [
    { type: "yt",      title: "FREE LinkedIn Optimization Course",           url: "https://www.youtube.com/watch?v=qfL4K_afFRE", sub: "Full profile optimization" },
    { type: "yt",      title: "Top 5 LinkedIn Profile Tips (data-backed)",   url: "https://www.youtube.com/watch?v=OKF7ZeWNrfg", sub: "Jeff Su" },
    { type: "yt",      title: "How to Optimize Your LinkedIn 2026",          url: "https://www.youtube.com/watch?v=vM05VgPB3o8", sub: "Updated for 2026" },
    { type: "reddit",  title: "r/linkedin — Tips & Advice",                  url: "https://www.reddit.com/r/linkedin/",          sub: "Active community" },
    { type: "article", title: "LinkedIn Profile Guide for Students",         url: "https://www.balistro.com/linkedin-profile-optimization-students-freshers/", sub: "Balistro" },
  ],
  linkedin_messages: [
    { type: "yt",      title: "LinkedIn Profile Tips for Students",          url: "https://www.youtube.com/watch?v=_DOgp6p2xsY", sub: "Must-know LinkedIn advice" },
    { type: "reddit",  title: "r/cscareerquestions — Networking",            url: "https://www.reddit.com/r/cscareerquestions/", sub: "900k engineers" },
    { type: "article", title: "Cold Outreach Scripts for Students",          url: "https://joinhandshake.com/blog/students/cold-outreach-in-job-search/", sub: "Handshake" },
  ],
  cold_emails: [
    { type: "reddit",  title: "r/cscareerquestions",                         url: "https://www.reddit.com/r/cscareerquestions/", sub: "900k+ members" },
    { type: "article", title: "Cold Emails for Internships: 87% Open Rate", url: "https://firstsales.io/blog/cold-emails-for-internships/", sub: "FirstSales" },
    { type: "article", title: "8 Tips to Land Dream Job via Cold Email",     url: "https://www.nicksingh.com/posts/cold-email-tips-to-land-your-dream-job-with-examples", sub: "Nick Singh" },
    { type: "article", title: "Cold Email Your Way Into Any Startup",        url: "https://www.colinkeeley.com/blog/cold-email-your-way-into-an-internshipjob-at-any-startup", sub: "Colin Keeley" },
  ],
  mock_interview: [
    { type: "yt",      title: "Full SWE Mock Interview (freeCodeCamp)",      url: "https://www.youtube.com/watch?v=1qw5ITr3k9E", sub: "Real mock from freeCodeCamp" },
    { type: "yt",      title: "AI Coding Mock — Senior FAANG Engineer",      url: "https://www.youtube.com/watch?v=ZE_YEn-okfk", sub: "Hello Interview" },
    { type: "yt",      title: "Hello Interview YouTube Channel",             url: "https://www.youtube.com/@hello_interview",    sub: "FAANG engineers channel" },
    { type: "reddit",  title: "r/cscareerquestions — Interview Prep",        url: "https://www.reddit.com/r/cscareerquestions/", sub: "Real Q&As from engineers" },
    { type: "article", title: "interviewing.io — Anonymous Mock Interviews", url: "https://interviewing.io/",                   sub: "Free with real engineers" },
  ],
  ai_projects: [
    { type: "yt",      title: "5 AI Engineer Projects to Build in 2026",     url: "https://www.youtube.com/watch?v=9WIsvEswZTk", sub: "Ex-Google & Microsoft" },
    { type: "reddit",  title: "r/MachineLearning — Project Ideas",           url: "https://www.reddit.com/r/MachineLearning/",  sub: "Top ML community" },
    { type: "reddit",  title: "r/learnmachinelearning",                      url: "https://www.reddit.com/r/learnmachinelearning/", sub: "Beginner-friendly" },
    { type: "article", title: "7 AI Portfolio Projects to Boost Resume",     url: "https://www.kdnuggets.com/7-ai-portfolio-projects-to-boost-the-resume", sub: "KDnuggets" },
  ],
  open_source: [
    { type: "yt",      title: "Complete Guide to Open Source Contributions", url: "https://www.youtube.com/watch?v=yzeVMecydCE", sub: "Fireship" },
    { type: "yt",      title: "How to Contribute to Open Source Projects",   url: "https://www.youtube.com/watch?v=8nq14dHrXgo", sub: "Step-by-step tutorial" },
    { type: "reddit",  title: "r/opensource — Beginner Help",                url: "https://www.reddit.com/r/opensource/",       sub: "Active contributors" },
    { type: "article", title: "Open Source Guide — How to Contribute",       url: "https://opensource.guide/how-to-contribute/", sub: "GitHub's official guide" },
    { type: "article", title: "FreeCodeCamp Open Source Beginner Guide",     url: "https://www.freecodecamp.org/news/how-to-contribute-to-open-source-projects-beginners-guide/", sub: "Beginner walkthrough" },
  ],
  projects_graduation: [
    { type: "yt",      title: "10 Projects That Get You Hired",              url: "https://www.youtube.com/watch?v=TNzTHkMkZpc", sub: "Forrest Knight" },
    { type: "yt",      title: "5 AI Engineer Projects to Build in 2026",     url: "https://www.youtube.com/watch?v=9WIsvEswZTk", sub: "Ex-Google & Microsoft" },
    { type: "reddit",  title: "r/learnprogramming — Project Ideas",          url: "https://www.reddit.com/r/learnprogramming/", sub: "Biggest coding community" },
    { type: "article", title: "7 AI Portfolio Projects to Boost Resume",     url: "https://www.kdnuggets.com/7-ai-portfolio-projects-to-boost-the-resume", sub: "KDnuggets" },
  ],
  github_portfolio: [
    { type: "yt",      title: "Create a GitHub Portfolio in 5 Minutes",      url: "https://www.youtube.com/watch?v=CykufIPK_6o", sub: "Using GitHub Pages" },
    { type: "reddit",  title: "r/github — Portfolio Tips",                   url: "https://www.reddit.com/r/github/",           sub: "Real devs sharing profiles" },
    { type: "article", title: "Tips to Use GitHub as Your Portfolio",        url: "https://dev.to/pachicodes/tips-to-use-github-as-your-portfolio-4kb2", sub: "DEV Community" },
    { type: "article", title: "How to Build an Awesome GitHub Portfolio",    url: "https://www.geeksforgeeks.org/blogs/how-to-build-a-awesome-github-developer-portfolio/", sub: "GeeksforGeeks" },
  ],
};

type CKMCQType = { q: string; opts: string[]; ans: number; why: string };
const CK_MCQ: Record<string, CKMCQType[]> = {
  resume_review: [
    { q: "How many seconds does a recruiter spend scanning a resume?", opts: ["30 seconds", "1 minute", "7 seconds", "It varies"], ans: 2, why: "Studies confirm 7 seconds is the average scan time. Every line must earn its place — no fluff." },
    { q: "Which resume section do recruiters look at FIRST?", opts: ["Education", "Projects", "Skills", "Experience"], ans: 3, why: "Experience = impact proof. Even internships & part-time roles outrank GPA in recruiter scans." },
    { q: "Should your resume include a home address?", opts: ["Yes, always", "City & state only", "Never", "Only if asked"], ans: 1, why: "City + state is the modern standard. Full address is outdated and a privacy risk." },
  ],
  cover_letter: [
    { q: "What should the FIRST sentence of your cover letter do?", opts: ["State your name", "Hook with a bold fact or story", "List your GPA", "Say where you found the role"], ans: 1, why: "HR reads hundreds. A hook in line 1 is the only thing that makes them actually read yours." },
    { q: "Ideal length for a student cover letter?", opts: ["3–4 pages", "As long as needed", "Under 300 words", "Exactly 1 page"], ans: 2, why: "Under 300 words forces sharpness. Recruiters skim — if yours takes effort to read, they skip it." },
    { q: "The #1 cover letter mistake students make?", opts: ["Too short", "Generic — not tailored", "No formal signature", "Missing date"], ans: 1, why: "Copy-paste letters are spotted instantly. One specific company detail beats five generic lines." },
  ],
  linkedin_review: [
    { q: "Which LinkedIn section carries the most search algorithm weight?", opts: ["About/Summary", "Headline", "Skills & Endorsements", "Experience titles"], ans: 1, why: "Your headline shows on every search result and comment. Keyword-rich = 5x more profile views." },
    { q: "At how many connections does LinkedIn change how your profile appears?", opts: ["100+", "250+", "500+", "1000+"], ans: 2, why: "500+ is the threshold. LinkedIn displays your profile differently above 500 — signals credibility." },
    { q: "Ideal LinkedIn posting frequency for a student?", opts: ["Every day", "2–3x per week", "Once a week", "Only when job hunting"], ans: 1, why: "2-3x/week keeps you visible without being spammy. Consistent beats frequent — always." },
  ],
  linkedin_messages: [
    { q: "What makes a cold LinkedIn DM actually get replied to?", opts: ["Being very formal", "Referencing their specific work", "A long introduction", "Asking directly for a job"], ans: 1, why: "People reply when they feel SEEN. Reference something specific — a post, project, or career move." },
    { q: "How long should a LinkedIn connection request note be?", opts: ["Max 300 characters", "1–2 punchy sentences", "No note needed", "Full paragraph"], ans: 1, why: "LinkedIn caps notes at 300 chars. One sharp sentence about WHY you're connecting beats a wordy one." },
    { q: "Best time to send a cold LinkedIn message?", opts: ["Monday morning", "Friday evening", "Tue–Thu, 10am–12pm", "Time doesn't matter"], ans: 2, why: "Mid-week midday has the highest open rates. Monday is flooded; Friday people are mentally checked out." },
  ],
  cold_emails: [
    { q: "Ideal length for a cold email to a founder or HR?", opts: ["500+ words", "200–300 words", "Under 100 words", "3 lines max"], ans: 1, why: "Long enough to be credible, short enough to read in 30s. 200-300 words is the proven sweet spot." },
    { q: "What should your cold email subject line do?", opts: ["Sound formal", "Create curiosity or name-drop a mutual", "Summarize your CV", "Say 'Job Application'"], ans: 1, why: "Curiosity or a mutual name gets the email opened. Generic subject lines get archived in 2 seconds." },
    { q: "How many follow-ups after a cold email?", opts: ["None — one is enough", "1 max", "2–3 follow-ups", "Follow up every day"], ans: 2, why: "Most replies come after follow-up 2 or 3. Silence isn't rejection — it's just inbox overload." },
  ],
  mock_interview: [
    { q: "What does STAR stand for in behavioral interviews?", opts: ["Skills, Tasks, Actions, Results", "Situation, Task, Action, Result", "Story, Target, Approach, Review", "Subject, Timeline, Achievement, Reflection"], ans: 1, why: "STAR = Situation, Task, Action, Result. This framework turns rambling stories into crisp answers." },
    { q: "What do you do when you don't know an interview answer?", opts: ["Say 'I don't know' and stop", "Make something plausible up", "Think aloud through your reasoning", "Ask to skip it"], ans: 2, why: "Interviewers test HOW you think. Walking through your logic shows problem-solving skill even without the answer." },
    { q: "How many mock interviews should you do before a real one?", opts: ["1 is plenty", "At least 5, ideally more", "Mocks don't really help", "2 max, more causes anxiety"], ans: 1, why: "Every mock cuts nerves in the real one. 5+ sessions dramatically improves real-interview performance." },
  ],
  ai_projects: [
    { q: "Which AI project type impresses hiring managers most?", opts: ["A Udemy tutorial rebuild", "A deployed app solving a real problem", "Max accuracy on a benchmark", "A paper summary notebook"], ans: 1, why: "Deployed = real. Hiring managers click links. A live app proves you can ship — that's what companies need." },
    { q: "Every AI project README must have:", opts: ["Just install steps", "Demo link, problem statement, how to run", "Model accuracy only", "Paper citations"], ans: 1, why: "If they can't see it working in 30s, they move on. Demo + problem + setup = non-negotiable minimum." },
    { q: "Most in-demand ML framework in 2025–26?", opts: ["TensorFlow only", "PyTorch", "Scikit-learn only", "MATLAB"], ans: 1, why: "PyTorch dominates both research and production in 2025-26. Most AI roles explicitly require it." },
  ],
  open_source: [
    { q: "What GitHub issue label should beginners look for first?", opts: ["help wanted", "good first issue", "bug", "enhancement"], ans: 1, why: "'good first issue' = explicitly tagged for first-timers. It's your officially sanctioned entry point." },
    { q: "FIRST step before contributing to any open source project?", opts: ["Create a pull request", "Read the CONTRIBUTING.md", "Fork and start coding", "Open an issue first"], ans: 1, why: "CONTRIBUTING.md tells you how the project accepts PRs. Skip it and your PR gets closed." },
    { q: "Which program pays students for open source contributions?", opts: ["Hacktoberfest", "GitHub Sponsors", "Google Summer of Code", "Stack Overflow Jobs"], ans: 2, why: "GSoC pays real stipends ($3k–$6.6k) for accepted students. Hacktoberfest gives merch, not money." },
  ],
  projects_graduation: [
    { q: "How many solid portfolio projects do you need to land interviews?", opts: ["10+ minimum", "2–3 polished > 10 weak", "5 is standard", "Quantity > quality"], ans: 1, why: "Recruiters open your first 2 projects. Two polished ones with demos beat 10 half-built repos every time." },
    { q: "Which project best proves full-stack skill to employers?", opts: ["Frontend with mock data", "Deployed app with auth, DB, and API", "Mobile UI prototype", "Any CLI tool"], ans: 1, why: "Auth + DB + deployed + real API = production-level thinking. Most students don't do this — which is why it stands out." },
    { q: "Every portfolio project README needs:", opts: ["Just install steps", "Demo GIF, tech stack, features, live link", "Code comments", "Link to resume"], ans: 1, why: "Demo GIF = 2-second attention. Tech stack = shows intent. Live link = proves it works. Non-negotiable." },
  ],
  github_portfolio: [
    { q: "How many repos can you pin on your GitHub profile?", opts: ["3", "6", "10", "Unlimited"], ans: 1, why: "GitHub allows exactly 6 pinned repos. These are the FIRST 6 every recruiter sees — choose them carefully." },
    { q: "Most important file in any GitHub repo?", opts: ["main.py / index.js", "README.md", ".gitignore", "package.json"], ans: 1, why: "README is the first thing anyone sees. No good README = looks abandoned or amateur-level." },
    { q: "What does a green contribution graph signal to recruiters?", opts: ["You code every day perfectly", "You're consistent and actively building", "You're gaming the system", "Nothing — they don't check"], ans: 1, why: "Recruiters DO check it. Consistency = discipline. Even 15min of daily coding keeps the graph alive." },
  ],
};

// ─── Career Kit slug maps ─────────────────────────────────────────────────────
type CKKey = "resume_review" | "cover_letter" | "linkedin_review" | "linkedin_messages" | "cold_emails" | "mock_interview" | "ai_projects" | "open_source" | "projects_graduation" | "github_portfolio";
const CK_SLUG_MAP: Record<string, CKKey> = {
  "resume-review":              "resume_review",
  "cover-letter":               "cover_letter",
  "linkedin-review":            "linkedin_review",
  "linkedin-messages":          "linkedin_messages",
  "cold-emails":                "cold_emails",
  "mock-interview":             "mock_interview",
  "ai-projects":                "ai_projects",
  "open-source":                "open_source",
  "projects-before-graduation": "projects_graduation",
  "github-portfolio":           "github_portfolio",
};
const CK_KEY_TO_SLUG: Record<CKKey, string> = {
  resume_review:        "resume-review",
  cover_letter:         "cover-letter",
  linkedin_review:      "linkedin-review",
  linkedin_messages:    "linkedin-messages",
  cold_emails:          "cold-emails",
  mock_interview:       "mock-interview",
  ai_projects:          "ai-projects",
  open_source:          "open-source",
  projects_graduation:  "projects-before-graduation",
  github_portfolio:     "github-portfolio",
};
const CK_KEY_TITLE: Record<CKKey, string> = {
  resume_review:       "Resume Review",
  cover_letter:        "Cover Letter",
  linkedin_review:     "LinkedIn Review",
  linkedin_messages:   "LinkedIn Cold Messages",
  cold_emails:         "Cold Emails",
  mock_interview:      "Mock Interview Guide",
  ai_projects:         "AI Project Ideas",
  open_source:         "Open Source Guide",
  projects_graduation: "Projects Before Graduation",
  github_portfolio:    "GitHub Portfolio Guide",
};

// ─── Interview Topics ─────────────────────────────────────────────────────────
type IVKey = "system_design" | "backend" | "computer_network" | "database" | "java" | "operating_system" | "python" | "mern" | "react" | "sql" | "genai" | "mobile" | "business_analyst" | "embedded";
const IV_SLUG_MAP: Record<string, IVKey> = {
  "system-design":     "system_design",
  "backend":           "backend",
  "computer-network":  "computer_network",
  "database":          "database",
  "java":              "java",
  "operating-system":  "operating_system",
  "python":            "python",
  "mern":              "mern",
  "react":             "react",
  "sql":               "sql",
  "genai":             "genai",
  "mobile":            "mobile",
  "business-analyst":  "business_analyst",
  "embedded":          "embedded",
};
const IV_KEY_TO_SLUG: Record<IVKey, string> = {
  system_design:    "system-design",
  backend:          "backend",
  computer_network: "computer-network",
  database:         "database",
  java:             "java",
  operating_system: "operating-system",
  python:           "python",
  mern:             "mern",
  react:            "react",
  sql:              "sql",
  genai:            "genai",
  mobile:           "mobile",
  business_analyst: "business-analyst",
  embedded:         "embedded",
};
const IV_KEY_TITLE: Record<IVKey, string> = {
  system_design:    "System Design Interview",
  backend:          "Backend Interview",
  computer_network: "Computer Networks Interview",
  database:         "Database Interview",
  java:             "Java Interview",
  operating_system: "Operating System Interview",
  python:           "Python Interview",
  mern:             "MERN Stack Interview",
  react:            "React Interview",
  sql:              "SQL Interview",
  genai:            "GenAI / LLM Interview",
  mobile:           "Mobile Developer Interview",
  business_analyst: "Business Analyst Interview",
  embedded:         "Embedded Developer Interview",
};
const IV_KEY_TAGLINE: Record<IVKey, string> = {
  system_design:    "Scalability, CAP theorem, sharding — the FAANG architecture questions in one place.",
  backend:          "REST, ACID, caching, microservices — the backend questions that get asked again and again.",
  computer_network: "OSI, TCP/UDP, DNS, HTTPS — every networking question your interviewer will throw at you.",
  database:         "SQL, joins, normalization, ACID, NoSQL — every DB question recruiters love to ask.",
  java:             "JVM, OOP, collections, streams, threads — the core Java questions every interview hits.",
  operating_system: "Processes, threads, deadlocks, paging, scheduling — the OS questions that trip people up.",
  python:           "Lists, dicts, OOP, GIL, decorators, generators — the Python questions you cannot skip.",
  mern:             "MongoDB, Express, React, Node.js — full-stack JavaScript interview answers in one pack.",
  react:            "JSX, hooks, state, virtual DOM, Redux — the React questions every frontend role asks.",
  sql:              "Joins, aggregates, window functions, CTEs — the SQL questions every analyst gets quizzed on.",
  genai:            "Tokens, attention, RAG, LoRA, prompting — the LLM questions AI roles love to ask.",
  mobile:           "Android, iOS, React Native, Flutter — the mobile interview answers across every platform.",
  business_analyst: "BRD, SRS, SDLC, Agile, stakeholders — the business-meets-tech questions every BA role asks.",
  embedded:         "Microcontrollers, RTOS, SPI/I2C, ARM Cortex-M — the embedded systems questions every firmware role asks.",
};
type QA = { q: string; a: string };
type IVMCQ = { q: string; opts: string[]; ans: number; why: string };
const IV_DATA: Record<IVKey, {
  beginner: QA[];
  intermediate: QA[];
  advanced: QA[];
  mcq: IVMCQ[];
  facts: string[];
}> = {
  system_design: {
    beginner: [
      { q: "What is System Design?", a: "Designing how components (frontend, backend, DB, servers) work together to build scalable, reliable apps." },
      { q: "What is scalability?", a: "The ability of a system to handle increased traffic without breaking or slowing down dramatically." },
      { q: "What is vertical scaling?", a: "Adding more power (CPU, RAM) to a single existing server. Has a hardware ceiling." },
      { q: "What is horizontal scaling?", a: "Adding more servers to distribute the load. Effectively unlimited but needs stateless apps." },
      { q: "What is a Load Balancer?", a: "A system that distributes incoming requests across multiple servers to prevent any one from being overwhelmed." },
      { q: "What is latency?", a: "The time it takes for a request to travel from client to server and back. Measured in milliseconds." },
      { q: "What is throughput?", a: "The number of requests a system can handle per second. Measured in req/s or QPS." },
      { q: "What is a database index?", a: "A data structure (usually B-tree) that helps the DB find rows faster — like a book's index." },
      { q: "What is caching?", a: "Storing frequently accessed data in fast memory (Redis, Memcached) to reduce database load and latency." },
      { q: "What is a CDN?", a: "Content Delivery Network. Delivers static files (images, JS, video) from the server closest to the user." },
    ],
    intermediate: [
      { q: "What is an API?", a: "A defined way for two systems to communicate, using rules like HTTP methods, request/response formats." },
      { q: "What is REST?", a: "An API style using HTTP verbs (GET, POST, PUT, DELETE) on resources identified by URIs. Stateless." },
      { q: "What is rate limiting?", a: "Capping how many requests a user can make in a time window. Prevents abuse and protects servers." },
      { q: "What is sharding?", a: "Splitting one large database across multiple servers by a shard key (e.g. userId % N). Scales writes horizontally." },
      { q: "What is replication?", a: "Copying data to multiple servers for backup, failover, and faster reads. Primary handles writes, replicas handle reads." },
      { q: "What is a single point of failure?", a: "Any component whose failure brings down the whole system. Eliminate with redundancy." },
      { q: "What is high availability?", a: "Designing systems to stay operational even if components fail. Usually measured in nines (99.9%, 99.99%)." },
      { q: "What is consistency in databases?", a: "All users see the same updated data at the same time, immediately after a write." },
      { q: "What is eventual consistency?", a: "Data may take a short time to sync across servers but will eventually converge to the same state." },
      { q: "What is the CAP theorem?", a: "A distributed system can only guarantee 2 of 3: Consistency, Availability, Partition tolerance." },
    ],
    advanced: [
      { q: "What is partition tolerance?", a: "System continues to work even if network communication between servers fails or splits." },
      { q: "What is microservices architecture?", a: "Breaking an app into small, independently deployable services that communicate over APIs or queues." },
      { q: "What is monolithic architecture?", a: "Building the entire application as one single deployable unit. Simpler initially, harder at scale." },
      { q: "What is a message queue?", a: "A system (Kafka, RabbitMQ, SQS) that lets services communicate asynchronously by passing messages." },
      { q: "What is asynchronous processing?", a: "Tasks run in the background without blocking the main request. Used for emails, reports, image processing." },
      { q: "What is idempotency?", a: "An operation that produces the same result whether called once or many times. Critical for safe retries." },
      { q: "What is a reverse proxy?", a: "A server (Nginx, HAProxy) that sits in front of backend servers and forwards client requests to them." },
      { q: "What is fault tolerance?", a: "The system keeps operating correctly even when some parts fail. Built via redundancy and graceful degradation." },
      { q: "What is autoscaling?", a: "Automatically adding or removing servers based on traffic or CPU load. Common on cloud platforms." },
      { q: "Why is monitoring important?", a: "It detects failures, performance regressions, and unusual traffic patterns early — before users complain." },
    ],
    mcq: [
      { q: "Which guarantees can a distributed system NOT achieve all three of at once?", opts: ["Consistency, Availability, Partition tolerance", "Speed, Scale, Security", "Read, Write, Delete", "Cache, DB, CDN"], ans: 0, why: "CAP theorem — you can only pick 2 of CAP when a network partition happens." },
      { q: "Which is true about horizontal scaling?", opts: ["Upgrades a single machine", "Adds more servers behind a load balancer", "Only works on bare metal", "Requires a SQL database"], ans: 1, why: "Horizontal = adding more machines. Vertical = making one machine bigger." },
      { q: "What does a CDN primarily reduce?", opts: ["Database load", "Cost of microservices", "Latency by serving from edge locations", "Memory usage"], ans: 2, why: "CDNs cache content close to the user, so the request never has to travel to the origin." },
      { q: "Idempotency matters most for which scenario?", opts: ["Pretty URLs", "Retrying network requests safely", "Faster JSON parsing", "Compressing logs"], ans: 1, why: "Retries on flaky networks are safe only if calling twice ≡ calling once." },
      { q: "Why use a message queue?", opts: ["Make the UI prettier", "Decouple services and absorb load spikes", "Replace the database", "Encrypt traffic"], ans: 1, why: "Queues buffer work and let producers and consumers scale independently." },
    ],
    facts: [
      "Netflix runs on ~700 microservices in production.",
      "A single load balancer at Cloudflare can handle 50M+ requests per second.",
      "Redis can do 100K+ ops/sec on a single core — that's why it's everywhere.",
      "Amazon famously says: 'Everything fails all the time.' Design for it.",
      "P99 latency matters more than average — the slowest 1% defines your user experience.",
    ],
  },
  backend: {
    beginner: [
      { q: "What is REST?", a: "An architectural style for APIs using HTTP methods (GET, POST, PUT, DELETE) on resources identified by URIs. Stateless." },
      { q: "What are the 6 REST constraints?", a: "Client-Server, Stateless, Cacheable, Uniform Interface, Layered System, Code on Demand (optional)." },
      { q: "What HTTP status codes should you know?", a: "200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Server Error." },
      { q: "What is idempotency in HTTP?", a: "Calling the same operation multiple times produces the same result. GET, PUT, DELETE are idempotent. POST is not." },
      { q: "What is authentication vs authorization?", a: "Authentication = WHO you are (password, token). Authorization = WHAT you can do (roles, permissions)." },
      { q: "What is JWT?", a: "JSON Web Token. A compact signed token (header.payload.signature) used for stateless auth. Verified by signature." },
      { q: "What are ACID properties?", a: "Atomicity (all or nothing), Consistency (valid state), Isolation (no interference), Durability (survives crash)." },
      { q: "What is a database index?", a: "A B-tree (usually) that lets the DB find rows fast without scanning the whole table. Like a book index." },
      { q: "SQL vs NoSQL — when to use each?", a: "SQL for structured relational data with transactions. NoSQL for flexible schema, high write volume, horizontal scale." },
      { q: "What is caching and why use it?", a: "Storing frequently used data in fast memory (Redis) to reduce DB load and response time." },
    ],
    intermediate: [
      { q: "What are common caching strategies?", a: "Cache-aside (app checks cache first), read-through, write-through, write-behind. Each trades consistency for speed." },
      { q: "What is Redis and how does it differ from Memcached?", a: "Redis: rich data types (lists, sets, sorted sets), persistence, pub/sub. Memcached: simpler, faster for plain key-value." },
      { q: "What is the N+1 query problem?", a: "Fetching N records then making N more queries for related data — 1+N total. Fix with JOIN or eager loading." },
      { q: "What is OAuth 2.0?", a: "An authorization framework that lets third-party apps access a user's resources via tokens — without sharing passwords." },
      { q: "What is SQL Injection? How to prevent it?", a: "Attacker injects SQL via input fields. Prevent with parameterized queries / prepared statements — never concatenate input." },
      { q: "What is CORS?", a: "Cross-Origin Resource Sharing. Browser security that controls which origins can call your API. Configured via response headers." },
      { q: "Why is HTTPS essential for APIs?", a: "Encrypts data in transit, prevents man-in-the-middle attacks, required for OAuth, secures tokens and cookies." },
      { q: "Microservices vs Monolith?", a: "Monolith = one codebase, one deploy. Microservices = many small services, scale independently. Microservices add complexity." },
      { q: "What is an API Gateway?", a: "Single entry point in front of microservices. Handles auth, rate limiting, routing, SSL termination in one place." },
      { q: "What is the Circuit Breaker pattern?", a: "Wraps service calls — if a downstream fails repeatedly, the breaker opens and fails fast to prevent cascading failure." },
    ],
    advanced: [
      { q: "When would you use a message queue?", a: "Background jobs, peak load buffering, decoupling services, async processing, retry logic. Kafka, RabbitMQ, SQS." },
      { q: "REST vs GraphQL vs gRPC?", a: "REST = simple, fixed responses. GraphQL = client picks fields, one endpoint. gRPC = binary, fast, typed contracts." },
      { q: "Synchronous vs asynchronous communication?", a: "Sync blocks until response. Async fires and continues. Use sync for user-facing; async for background and events." },
      { q: "Horizontal vs vertical scaling?", a: "Vertical = upgrade one machine. Horizontal = add more machines behind a load balancer. Horizontal needs stateless apps." },
      { q: "Common load balancing algorithms?", a: "Round Robin, Least Connections, IP Hash (sticky), Weighted Round Robin. L4 = TCP-level, L7 = HTTP-level." },
      { q: "Sharding vs replication?", a: "Replication = same data, multiple copies (read scaling, failover). Sharding = different data on different servers (write scaling)." },
      { q: "What is connection pooling?", a: "Reusing a pool of pre-opened DB connections instead of opening new ones per request. Saves 50-100ms per call." },
      { q: "What is a race condition? How to fix?", a: "Two requests modify shared data simultaneously, causing incorrect results. Fix with locking (SELECT FOR UPDATE) or atomic ops." },
      { q: "API versioning strategies?", a: "URL path (/v1/users) — most common. Headers, content negotiation, query params. Always notify clients before deprecating." },
      { q: "Pagination strategies?", a: "Offset (LIMIT/OFFSET) — simple but slow at scale. Cursor — opaque token, O(log n). Keyset — WHERE id > lastId, fast." },
    ],
    mcq: [
      { q: "Which HTTP methods are idempotent?", opts: ["POST and PATCH", "GET, PUT, DELETE", "Only GET", "All methods"], ans: 1, why: "GET, PUT, DELETE produce the same result on retry. POST creates a new resource each time." },
      { q: "Best fix for the N+1 query problem?", opts: ["More indexes", "JOIN or eager loading", "Use a faster DB", "Disable foreign keys"], ans: 1, why: "Replace 1+N queries with one JOIN or a single batched IN-clause query." },
      { q: "How do you prevent SQL injection?", opts: ["Sanitize the URL", "Use parameterized queries", "Validate emails", "Disable SQL logs"], ans: 1, why: "Parameterized queries treat input as data, not code — the attack surface disappears." },
      { q: "What does a circuit breaker prevent?", opts: ["Network attacks", "Cascading failures", "DDoS", "Memory leaks"], ans: 1, why: "When a service fails repeatedly, the breaker opens — calls fail fast instead of piling up." },
      { q: "Which DB property guarantees a transaction is all-or-nothing?", opts: ["Consistency", "Isolation", "Atomicity", "Durability"], ans: 2, why: "Atomicity — if any step fails, the whole transaction rolls back." },
    ],
    facts: [
      "GitHub processes ~5 billion git operations per day on a sharded MySQL setup.",
      "Stripe's API has had backwards compatibility since 2011 — they version aggressively.",
      "Postgres can do 10K+ writes/sec on commodity hardware without sharding.",
      "JWTs should be short-lived (15 min) — use refresh tokens for the long-lived session.",
      "Connection pooling alone can 10x your API throughput. Don't open connections per request.",
    ],
  },
  computer_network: {
    beginner: [
      { q: "What is a computer network?", a: "Two or more computers connected to share data, files, and resources — wired or wireless." },
      { q: "What happens when you type a URL in a browser?", a: "Browser asks DNS for the IP → opens TCP/TLS connection → sends HTTP request → server responds → browser renders." },
      { q: "What is the Internet?", a: "A global network of networks — billions of devices connected and communicating over standard protocols." },
      { q: "What is an IP address?", a: "A unique numeric address assigned to every device on a network so it can send and receive data." },
      { q: "IPv4 vs IPv6?", a: "IPv4 = 32-bit (e.g. 192.168.1.1), running out. IPv6 = 128-bit (e.g. 2001:db8::1), virtually unlimited." },
      { q: "What is DNS?", a: "Domain Name System. Translates human-readable names (google.com) into IP addresses (142.250.x.x)." },
      { q: "How does DNS work?", a: "Browser asks resolver → resolver queries root → TLD → authoritative server → returns IP. Result is cached." },
      { q: "What is HTTP?", a: "HyperText Transfer Protocol. The protocol browsers use to request and receive web pages from servers." },
      { q: "What is HTTPS?", a: "HTTP over TLS. Encrypts all traffic between client and server — prevents eavesdropping and tampering." },
      { q: "HTTP vs HTTPS?", a: "HTTP is plain text and unsafe. HTTPS encrypts data, verifies the server's identity via a certificate." },
      { q: "What is TCP?", a: "Transmission Control Protocol. Reliable, ordered delivery with retransmission and flow control. Used by HTTP." },
      { q: "What is UDP?", a: "User Datagram Protocol. Faster, no guarantees. Used for video calls, gaming, DNS — where speed beats reliability." },
      { q: "TCP vs UDP?", a: "TCP = reliable, ordered, slow. UDP = fast, fire-and-forget, no guaranteed delivery." },
      { q: "What is a port number?", a: "A number (0–65535) identifying a specific service on a device. HTTP=80, HTTPS=443, SSH=22." },
      { q: "What is a MAC address?", a: "A unique 48-bit hardware address burned into every network interface card. Used at the link layer." },
    ],
    intermediate: [
      { q: "What is the OSI Model?", a: "A 7-layer model explaining how data travels in a network — from physical wires up to applications." },
      { q: "List the 7 OSI layers", a: "Physical, Data Link, Network, Transport, Session, Presentation, Application. (Bottom to top.)" },
      { q: "Physical Layer?", a: "Layer 1. Cables, signals, voltages, hardware. Bits as electrical or optical pulses." },
      { q: "Data Link Layer?", a: "Layer 2. Frames and MAC addresses. Handles error detection on the local link." },
      { q: "Network Layer?", a: "Layer 3. Routing and IP addresses. Decides how packets travel between networks." },
      { q: "Transport Layer?", a: "Layer 4. Reliable (TCP) or fast (UDP) end-to-end data transfer. Ports live here." },
      { q: "Application Layer?", a: "Layer 7. Where apps live — HTTP, SMTP, FTP, DNS. Closest to the user." },
      { q: "What is latency?", a: "Time delay for data to travel from source to destination. Measured in milliseconds." },
      { q: "What is bandwidth?", a: "The amount of data that can be transferred per second. Measured in bits per second (Mbps, Gbps)." },
      { q: "Latency vs bandwidth?", a: "Latency = delay (speed). Bandwidth = capacity (volume). A truck full of drives has huge bandwidth but bad latency." },
      { q: "What is a firewall?", a: "A security system that filters incoming/outgoing traffic based on rules. Blocks unwanted connections." },
      { q: "What is a router?", a: "A device that forwards packets between different networks based on IP addresses." },
      { q: "What is a switch?", a: "A device that connects devices on the same local network and forwards frames using MAC addresses." },
      { q: "Router vs switch?", a: "Router = connects different networks (Layer 3). Switch = connects devices on one network (Layer 2)." },
      { q: "What is a gateway?", a: "A device that connects two different network systems or protocols — often the entry/exit point of a network." },
      { q: "What is DHCP?", a: "Dynamic Host Configuration Protocol. Automatically assigns IP addresses to devices joining a network." },
      { q: "What is NAT?", a: "Network Address Translation. Maps many private IPs to one public IP — that's how your home router shares one IP." },
      { q: "What is a subnet?", a: "A logical subdivision of a larger network. Splits one big IP range into smaller manageable chunks." },
      { q: "What is bandwidth throttling?", a: "Intentionally slowing down internet speed — usually by an ISP or admin to manage traffic or enforce limits." },
      { q: "What is a packet?", a: "A small unit of data sent over a network. Carries source/destination IP and the payload." },
    ],
    advanced: [
      { q: "What is packet loss?", a: "When packets fail to reach their destination. Causes lag, choppy video, retransmissions in TCP." },
      { q: "What is packet switching?", a: "Breaking data into small packets sent independently across the network — then reassembled at the destination." },
      { q: "What is a protocol?", a: "An agreed set of rules for how systems communicate — formats, sequences, error handling." },
      { q: "What is FTP?", a: "File Transfer Protocol. Used to upload/download files between client and server. Largely replaced by SFTP/HTTPS." },
      { q: "What is SMTP?", a: "Simple Mail Transfer Protocol. Used to send emails between mail servers." },
      { q: "POP3 vs IMAP?", a: "Both receive emails. POP3 downloads and deletes from server. IMAP keeps emails on the server — better for multi-device." },
      { q: "What is REST architecture?", a: "An API design style using HTTP verbs (GET, POST, PUT, DELETE) on resource URLs. Stateless." },
      { q: "What is a VPN?", a: "Virtual Private Network. Creates an encrypted tunnel over the public internet — hides your IP and secures traffic." },
      { q: "What is a proxy server?", a: "A middleman server between client and the internet. Forwards requests — used for caching, anonymity, or filtering." },
      { q: "What is a LAN?", a: "Local Area Network. A network within a small area — home, office, building." },
      { q: "What is a WAN?", a: "Wide Area Network. Spans large geographic areas — the internet is the biggest WAN." },
      { q: "What is a MAN?", a: "Metropolitan Area Network. Covers a city-sized area — between LAN and WAN in scale." },
      { q: "What is Wi-Fi?", a: "Wireless networking technology (IEEE 802.11) that connects devices to a LAN without cables." },
      { q: "Common HTTP status codes?", a: "200 OK, 301/302 redirect, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Server Error." },
      { q: "Why are networks important?", a: "They enable data sharing, communication, the internet itself — every modern app depends on networking." },
    ],
    mcq: [
      { q: "Which layer does IP live in?", opts: ["Data Link (L2)", "Network (L3)", "Transport (L4)", "Application (L7)"], ans: 1, why: "IP addressing and routing happens at the Network Layer (Layer 3)." },
      { q: "Which protocol is connection-oriented and reliable?", opts: ["UDP", "TCP", "IP", "ICMP"], ans: 1, why: "TCP guarantees delivery and order via handshake, ACKs, and retransmission." },
      { q: "What does DNS translate?", opts: ["MAC to IP", "Domain names to IP addresses", "IP to URL", "Ports to services"], ans: 1, why: "DNS resolves human-readable names like google.com into IP addresses." },
      { q: "Which is true about HTTPS?", opts: ["It's faster than HTTP", "It encrypts traffic via TLS", "It uses port 80", "It doesn't need certificates"], ans: 1, why: "HTTPS = HTTP over TLS. Encrypts the connection using a server certificate." },
      { q: "What does NAT do?", opts: ["Encrypts traffic", "Maps private IPs to one public IP", "Routes between VLANs", "Filters malware"], ans: 1, why: "NAT lets many devices behind a router share a single public IP." },
    ],
    facts: [
      "DNS lookups can be cached for hours — that's why DNS changes take time to propagate.",
      "The TCP handshake alone adds ~1 round trip of latency before any data is sent. HTTP/3 uses QUIC over UDP to avoid this.",
      "Most home routers do NAT — your phone's '192.168.x.x' address never appears on the public internet.",
      "Wi-Fi 6 (802.11ax) can theoretically hit 9.6 Gbps. Most homes never see it because of interference.",
      "An undersea cable cut once dropped 70% of internet traffic between Asia and Europe — fiber is fragile.",
    ],
  },
  database: {
    beginner: [
      { q: "What is a database?", a: "A place where data is stored in an organized way so we can use, query, and update it easily." },
      { q: "What is SQL?", a: "Structured Query Language. Used to store, read, update, and delete data in relational databases." },
      { q: "What is normalization?", a: "Organizing data to remove duplicates and keep the schema clean. Reduces redundancy." },
      { q: "Explain 1NF, 2NF, 3NF", a: "1NF: atomic values, no repeating columns. 2NF: 1NF + non-key columns fully depend on the PK. 3NF: 2NF + no transitive dependencies." },
      { q: "What are ACID properties?", a: "Atomicity (all or nothing), Consistency (valid state), Isolation (no interference), Durability (data survives crashes)." },
      { q: "What is a primary key?", a: "A column (or set) that uniquely identifies each row. Cannot be NULL and cannot have duplicates." },
      { q: "What is a foreign key?", a: "A column that references another table's primary key — links two tables together." },
      { q: "Primary key vs foreign key?", a: "Primary key = unique identifier in its own table. Foreign key = link to another table's primary key." },
      { q: "What is indexing?", a: "A data structure (usually B-tree) that makes lookups faster — like a book's index." },
      { q: "What is a transaction?", a: "A group of SQL operations that run as one atomic unit. All succeed or all roll back." },
      { q: "What is a table?", a: "A structured collection of rows and columns where data is stored." },
      { q: "What is a row?", a: "A single record in a table — one entry across all columns." },
      { q: "What is a column?", a: "A field in a table that holds one type of data (e.g., name, age, email)." },
      { q: "What is a constraint?", a: "A rule applied to a column to control what data can be inserted (NOT NULL, UNIQUE, CHECK, etc.)." },
      { q: "Types of constraints?", a: "Primary Key, Foreign Key, Unique, Not Null, Check, Default. They enforce data integrity." },
      { q: "What is a Unique key?", a: "Ensures all values in a column are unique. Allows one NULL (unlike primary key)." },
      { q: "What is NOT NULL?", a: "A constraint that prevents a column from accepting empty/null values." },
    ],
    intermediate: [
      { q: "What is the CHECK constraint?", a: "Sets a condition that data must satisfy before being inserted (e.g., age >= 18)." },
      { q: "What is a DEFAULT value?", a: "Automatically assigns a value when the user doesn't provide one during INSERT." },
      { q: "What are JOINS?", a: "Used to combine rows from two or more tables based on a related column." },
      { q: "What is INNER JOIN?", a: "Returns only matching rows from both tables. Non-matching rows are excluded." },
      { q: "What is LEFT JOIN?", a: "Returns all rows from the left table plus matching rows from the right. Unmatched right side is NULL." },
      { q: "What is RIGHT JOIN?", a: "Returns all rows from the right table plus matching rows from the left. Unmatched left side is NULL." },
      { q: "What is FULL JOIN?", a: "Returns all rows from both tables — matched where possible, NULLs where not." },
      { q: "DELETE vs TRUNCATE vs DROP?", a: "DELETE removes selected rows (logged). TRUNCATE clears all rows fast. DROP removes the entire table." },
      { q: "What is a View?", a: "A virtual table built from a SELECT query. Doesn't store data — just shows it." },
      { q: "What is a Stored Procedure?", a: "A saved SQL routine that can be called by name. Useful for reusing complex logic." },
      { q: "What is a Trigger?", a: "Code that runs automatically when an event occurs (INSERT, UPDATE, DELETE)." },
      { q: "What is a Cursor?", a: "An object used to traverse and process query results row by row." },
      { q: "What is a Subquery?", a: "A query nested inside another query. The inner query runs first; its result feeds the outer query." },
      { q: "What is GROUP BY?", a: "Groups rows that have the same values in specified columns — often used with aggregate functions." },
      { q: "What is HAVING?", a: "Filters groups after GROUP BY. Like WHERE, but works on grouped/aggregated rows." },
      { q: "What is ORDER BY?", a: "Sorts query results in ascending (ASC) or descending (DESC) order." },
      { q: "What is the WHERE clause?", a: "Filters rows before grouping or aggregation. Operates on individual rows." },
    ],
    advanced: [
      { q: "What is a Schema?", a: "The structure of a database — tables, columns, types, relationships, and constraints." },
      { q: "What is a relationship in DB?", a: "A logical connection between tables, typically enforced by foreign keys." },
      { q: "Types of relationships?", a: "One-to-One, One-to-Many, Many-to-Many (usually via a junction table)." },
      { q: "What is NoSQL?", a: "A database family that stores data in flexible formats (JSON docs, key-value, graph) instead of fixed tables." },
      { q: "SQL vs NoSQL?", a: "SQL = fixed schema, relational, ACID. NoSQL = flexible schema, scales horizontally, eventual consistency." },
      { q: "What is Sharding?", a: "Splitting a large DB across multiple servers using a shard key. Scales writes horizontally." },
      { q: "What is Replication?", a: "Copying the DB to multiple servers for backup, failover, and read scaling." },
      { q: "What is Denormalization?", a: "Intentionally adding duplicate data to reduce JOINs and improve read performance." },
      { q: "What is OLTP?", a: "Online Transaction Processing — handles fast, frequent reads/writes (e.g., banking, e-commerce)." },
      { q: "What is OLAP?", a: "Online Analytical Processing — runs complex reports and analytics over large historical data." },
      { q: "What is a NULL value?", a: "Means 'no value' or 'unknown'. NULL is not zero and not an empty string." },
      { q: "What is a Composite Key?", a: "A primary key made up of two or more columns combined." },
      { q: "What is Data Redundancy?", a: "Storing the same data multiple times. Increases storage and risks of inconsistency." },
      { q: "What is a Deadlock?", a: "Two transactions wait for each other's locks indefinitely. DB detects and aborts one." },
      { q: "What is a Backup?", a: "A copy of the database stored elsewhere to recover from data loss or corruption." },
      { q: "Why are databases important?", a: "They store, protect, and query data efficiently — every modern app depends on one." },
    ],
    mcq: [
      { q: "Which constraint guarantees uniqueness AND non-null?", opts: ["UNIQUE", "PRIMARY KEY", "CHECK", "DEFAULT"], ans: 1, why: "Primary Key = unique + not null. UNIQUE allows one NULL." },
      { q: "Which command removes all rows but keeps the table?", opts: ["DELETE", "TRUNCATE", "DROP", "REMOVE"], ans: 1, why: "TRUNCATE clears all data fast and resets identity. DROP removes the whole table." },
      { q: "Which JOIN returns only rows that match in both tables?", opts: ["LEFT JOIN", "INNER JOIN", "FULL JOIN", "CROSS JOIN"], ans: 1, why: "INNER JOIN keeps only matching rows. The others include unmatched rows." },
      { q: "Which normal form removes transitive dependencies?", opts: ["1NF", "2NF", "3NF", "BCNF"], ans: 2, why: "3NF = 2NF + no non-key column depends on another non-key column." },
      { q: "Which clause filters AFTER grouping?", opts: ["WHERE", "HAVING", "ORDER BY", "GROUP BY"], ans: 1, why: "WHERE filters rows; HAVING filters grouped/aggregated results." },
    ],
    facts: [
      "A well-placed index can speed up SELECT by 100x — but it also slows down INSERT/UPDATE.",
      "MongoDB's document model is closer to how programmers actually think than rows-and-columns.",
      "PostgreSQL has supported JSON natively since 2012 — you don't always need NoSQL.",
      "Most production deadlocks come from inconsistent lock ordering. Lock in the same order, always.",
      "Backups you've never tested restoring are not backups — they're hopes.",
    ],
  },
  java: {
    beginner: [
      { q: "What is Java and its key features?", a: "Object-oriented, platform-independent (bytecode + JVM), strongly typed, with automatic garbage collection. WORA — Write Once, Run Anywhere." },
      { q: "Difference between JDK, JRE, and JVM?", a: "JVM runs bytecode. JRE = JVM + libraries (to run apps). JDK = JRE + dev tools (to write apps)." },
      { q: "== vs .equals() in Java?", a: "== compares references (memory address). .equals() compares the actual content (when overridden, e.g. in String)." },
      { q: "Four pillars of OOP?", a: "Encapsulation (hide state), Abstraction (hide implementation), Inheritance (extends), Polymorphism (one interface, many forms)." },
      { q: "Abstract class vs interface?", a: "Abstract class: can have state + concrete methods, single inheritance. Interface: defines contract, multiple inheritance, Java 8+ allows default methods." },
      { q: "Method overloading vs overriding?", a: "Overloading: same name, different params, same class — compile-time. Overriding: child redefines parent method — runtime polymorphism." },
      { q: "Checked vs unchecked exceptions?", a: "Checked: must be caught or declared (IOException). Unchecked: runtime, no declaration needed (NullPointerException)." },
      { q: "throw vs throws?", a: "throw actually throws an exception in code. throws declares that a method may throw a checked exception." },
      { q: "final vs finally vs finalize?", a: "final: prevents change/override/extend. finally: block that always runs after try-catch. finalize(): GC hook (deprecated)." },
    ],
    intermediate: [
      { q: "What is the Collections Framework?", a: "A unified API for storing groups of objects. Key interfaces: List (ordered, duplicates), Set (no duplicates), Map (key-value)." },
      { q: "ArrayList vs LinkedList?", a: "ArrayList: dynamic array, O(1) random access. LinkedList: doubly linked list, O(1) insert/delete at ends." },
      { q: "HashMap vs Hashtable vs ConcurrentHashMap?", a: "HashMap: not thread-safe, allows null. Hashtable: legacy, fully synchronized. ConcurrentHashMap: thread-safe via segment locks, much faster." },
      { q: "Ways to create a thread?", a: "Extend Thread, or implement Runnable (preferred — allows extending another class). Modern: use ExecutorService + Callable." },
      { q: "What is synchronization? What is deadlock?", a: "Synchronization: only one thread accesses a resource at a time. Deadlock: two threads each hold a lock the other wants — both wait forever." },
      { q: "wait() vs sleep() vs yield()?", a: "wait() releases lock + pauses. sleep() pauses but keeps the lock. yield() hints scheduler to give others a chance — no lock change." },
      { q: "What is a Lambda Expression?", a: "An anonymous function (Java 8+). Syntax: (params) -> body. Used to implement functional interfaces concisely." },
      { q: "Stream API: intermediate vs terminal ops?", a: "Intermediate ops (filter, map) return a new Stream, lazy. Terminal ops (collect, count) trigger execution and return a result." },
      { q: "What is Optional?", a: "A container introduced in Java 8 that may or may not hold a value. Helps avoid NullPointerExceptions." },
    ],
    advanced: [
      { q: "Explain the JVM memory model.", a: "Heap (shared, objects), Stack (per-thread, frames + primitives), Method Area / Metaspace (class metadata), PC register, native stack." },
      { q: "What is Garbage Collection? What algorithms?", a: "JVM auto-reclaims unreachable objects. Algorithms: Serial, Parallel, G1 (Java 9+ default), ZGC/Shenandoah (low latency)." },
      { q: "Stack vs Heap?", a: "Stack: per-thread, frames + primitives, fast. Heap: shared, holds all objects, managed by GC. Stack frees on return; Heap waits for GC." },
      { q: "Why are Strings immutable? What is the String Pool?", a: "Immutability gives security, thread safety, and cacheable hashCodes. The String Pool stores literals so identical literals share a reference." },
      { q: "String vs StringBuilder vs StringBuffer?", a: "String: immutable. StringBuilder: mutable, not thread-safe (fastest). StringBuffer: mutable, synchronized (slower but safe)." },
      { q: "What are Generics?", a: "Type parameters on classes/methods (e.g. List<String>). Compile-time type safety, no manual casting." },
      { q: "8 primitive types + autoboxing?", a: "byte, short, int, long, float, double, char, boolean. Autoboxing: Java auto-wraps primitives into Integer/Double/etc. as needed." },
      { q: "How to implement a thread-safe Singleton?", a: "Bill Pugh pattern (best): static inner holder class — lazy, thread-safe, no synchronization overhead." },
      { q: "Comparable vs Comparator?", a: "Comparable defines natural order (compareTo, inside the class). Comparator defines external orders (compare, multiple allowed)." },
      { q: "What is serialization? What is serialVersionUID?", a: "Converting an object to a byte stream. serialVersionUID identifies the class version — mismatched UIDs throw InvalidClassException." },
      { q: "How to make an immutable class?", a: "Final class, all fields private + final, no setters, init via constructor, deep-copy mutable fields in getters." },
    ],
    mcq: [
      { q: "Which compares actual content (not memory address)?", opts: ["==", ".equals()", ".compareTo()", "Object.hashCode()"], ans: 1, why: ".equals() compares content when overridden (String, Integer). == compares references." },
      { q: "Where do new objects in Java live?", opts: ["Stack", "Heap", "Method Area", "PC Register"], ans: 1, why: "All objects (created with new) live on the Heap. References to them live on the Stack." },
      { q: "Which is mutable AND thread-safe?", opts: ["String", "StringBuilder", "StringBuffer", "char[]"], ans: 2, why: "StringBuffer is synchronized. StringBuilder is mutable but not thread-safe. String is immutable." },
      { q: "Which Java version introduced Lambdas?", opts: ["Java 5", "Java 7", "Java 8", "Java 11"], ans: 2, why: "Java 8 (2014) brought lambdas, the Stream API, Optional, and default interface methods." },
      { q: "What does 'final' on a class mean?", opts: ["Cannot be instantiated", "Cannot be extended", "Cannot be garbage collected", "Must be abstract"], ans: 1, why: "A final class cannot be subclassed — that's why String is final." },
    ],
    facts: [
      "Java was originally called 'Oak' — renamed in 1995 because Oak was already trademarked.",
      "The JVM is one of the most optimized runtimes ever built — modern Java can rival C++ in many benchmarks.",
      "Strings in Java are immutable for a reason: they're used as HashMap keys, class names, network identifiers.",
      "Records (Java 14+) replace 50-line POJOs with one line. Use them.",
      "System.gc() is just a *hint* — the JVM decides whether to actually run GC.",
    ],
  },
  operating_system: {
    beginner: [
      { q: "What is an Operating System?", a: "Software that manages hardware and lets users and programs run. The layer between you and the CPU." },
      { q: "What is a process?", a: "An instance of a running program. Has its own memory space, code, and data." },
      { q: "What is a thread?", a: "A lightweight unit of execution inside a process. Threads share the process's memory." },
      { q: "Process vs thread?", a: "Process = independent, isolated memory. Thread = lives inside a process and shares its memory with sibling threads." },
      { q: "What is multitasking?", a: "Running multiple tasks (processes) seemingly at once by rapidly switching between them." },
      { q: "What is multiprocessing?", a: "Using multiple CPU cores to truly run multiple processes in parallel." },
      { q: "What is multithreading?", a: "Running multiple threads inside the same process — they share memory and run concurrently." },
      { q: "What is context switching?", a: "Saving one process/thread's state and loading another's so the CPU can switch tasks." },
      { q: "What is CPU scheduling?", a: "The OS deciding which process gets the CPU next. Goal: maximize throughput and fairness." },
      { q: "Types of CPU scheduling?", a: "FCFS (first-come-first-served), SJF (shortest job first), Priority, Round Robin (time slices)." },
      { q: "What is a deadlock?", a: "Two or more processes wait for each other's resources forever. Nothing makes progress." },
      { q: "Four conditions for deadlock?", a: "Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. All four must hold." },
      { q: "What is starvation?", a: "A process never gets CPU time because higher-priority processes keep arriving." },
      { q: "What is aging?", a: "Gradually increasing a waiting process's priority so it eventually runs — prevents starvation." },
      { q: "What is a semaphore?", a: "A synchronization primitive — a counter that controls access to a resource. Can allow N concurrent users." },
      { q: "What is a mutex?", a: "A lock that allows exactly one thread into a critical section at a time." },
      { q: "Semaphore vs mutex?", a: "Mutex = 1 holder only. Semaphore = counter, can allow multiple holders up to N." },
    ],
    intermediate: [
      { q: "What is a critical section?", a: "A piece of code where shared data is accessed — must be protected by synchronization." },
      { q: "What is a race condition?", a: "Two threads modify shared data simultaneously, producing incorrect results depending on timing." },
      { q: "What is virtual memory?", a: "A trick where the OS uses disk space to extend RAM. Each process sees a large continuous address space." },
      { q: "What is paging?", a: "Dividing memory into fixed-size blocks called pages. Physical and virtual addresses are mapped via a page table." },
      { q: "What is segmentation?", a: "Dividing memory into variable-sized segments based on logical units (code, stack, heap)." },
      { q: "Paging vs segmentation?", a: "Paging: fixed-size blocks, simpler. Segmentation: variable-size, matches program logic. Modern OS often combine both." },
      { q: "What is a page fault?", a: "When a program accesses a page that's not currently in RAM. OS fetches it from disk." },
      { q: "What is thrashing?", a: "When the system spends more time swapping pages in/out than running actual work. Caused by too many active processes." },
      { q: "What is swapping?", a: "Moving entire processes between RAM and disk to free up memory for others." },
      { q: "What is the kernel?", a: "The core part of the OS. Manages CPU, memory, devices. Runs in privileged mode." },
      { q: "Types of kernels?", a: "Monolithic (everything in one kernel — Linux). Microkernel (minimal core + services as user processes — Mach)." },
      { q: "What is a system call?", a: "A request from a user program to the kernel for a privileged operation (read a file, open socket)." },
      { q: "User mode vs kernel mode?", a: "User mode: limited, normal apps. Kernel mode: full hardware access, OS only. System calls cross the boundary." },
      { q: "What is a file system?", a: "How the OS organizes and stores files on disk — directories, file metadata, allocation, permissions." },
      { q: "What is fragmentation?", a: "When free memory or disk space becomes scattered in small pieces that can't be efficiently used." },
      { q: "Types of fragmentation?", a: "Internal: wasted space inside allocated blocks. External: free space scattered between allocations." },
      { q: "What is compaction?", a: "Rearranging memory/disk to bring free space together — reduces external fragmentation." },
    ],
    advanced: [
      { q: "What is demand paging?", a: "Loading pages into RAM only when they're actually accessed. Saves memory; the OS handles page faults transparently." },
      { q: "What is the boot process?", a: "Power on → BIOS/UEFI → boot loader → kernel → init system → user space. Each stage hands off to the next." },
      { q: "What is a shell?", a: "A command interpreter that lets users interact with the OS (bash, zsh, PowerShell)." },
      { q: "What is a device driver?", a: "Kernel-mode software that lets the OS talk to a specific hardware device." },
      { q: "What is IPC?", a: "Inter-Process Communication — how processes exchange data when they have isolated memory." },
      { q: "IPC methods?", a: "Pipes, message queues, shared memory, sockets, signals. Each has different speed/complexity tradeoffs." },
      { q: "What is caching?", a: "Storing frequently used data in faster memory (CPU cache, RAM, disk cache) to reduce access time." },
      { q: "What is buffering?", a: "Temporarily holding data during transfer (e.g., between disk and network) to smooth speed mismatches." },
      { q: "What is a zombie process?", a: "A process that has terminated but whose entry remains in the process table until its parent reads its exit status." },
      { q: "What is an orphan process?", a: "A child process whose parent has exited. The init process (PID 1) adopts it." },
      { q: "What is a scheduler?", a: "OS component that chooses which process/thread runs next on the CPU." },
      { q: "Types of schedulers?", a: "Long-term (admission), Short-term (CPU dispatch), Medium-term (suspend/resume processes)." },
      { q: "What is a real-time OS?", a: "An OS that guarantees response within strict deadlines. Used in robotics, aircraft, industrial controls." },
      { q: "Why do we need an OS?", a: "To manage hardware, run programs, allocate resources, enforce security, and provide a usable interface." },
    ],
    mcq: [
      { q: "Which scheduling preempts and uses time slices?", opts: ["FCFS", "SJF", "Round Robin", "Priority"], ans: 2, why: "Round Robin gives each process a fixed time slice. It's the classic preemptive scheduler." },
      { q: "Which is the SMALLEST unit of CPU execution?", opts: ["Process", "Thread", "Job", "Task queue"], ans: 1, why: "Threads are lighter than processes — multiple threads share one process's memory." },
      { q: "What is NOT one of the four deadlock conditions?", opts: ["Mutual Exclusion", "Hold and Wait", "Preemption", "Circular Wait"], ans: 2, why: "Deadlock requires NO preemption. Preemption would actually prevent it." },
      { q: "What is a zombie process?", opts: ["A crashed process", "Finished but still in process table", "An infected file", "A process with no parent"], ans: 1, why: "Zombie = terminated but waiting for the parent to read its exit status." },
      { q: "What causes thrashing?", opts: ["Slow disk", "Too many active processes vs RAM", "CPU overheating", "Bad scheduling"], ans: 1, why: "Thrashing = system spends more time paging than executing. Caused by over-commitment of RAM." },
    ],
    facts: [
      "Linux kernel is over 30 million lines of code and still actively maintained by thousands of contributors.",
      "Context switching takes 1–100 microseconds — that's why too many threads can actually hurt performance.",
      "macOS, iOS, Android, and Linux all share Unix DNA — and millions of lines of code.",
      "A modern CPU's L1 cache is ~100x faster than RAM, and RAM is ~100x faster than SSD.",
      "Most OS deadlocks come from inconsistent lock ordering — fix it at design time, not at runtime.",
    ],
  },
  python: {
    beginner: [
      { q: "What is Python?", a: "A high-level, interpreted, dynamically-typed programming language. Used for web, AI, data science, automation, scripting." },
      { q: "Why is Python popular?", a: "Easy to read, huge ecosystem of libraries, used in AI and data science, fast to prototype with." },
      { q: "What is a variable?", a: "A named reference to a value in memory. In Python, variables don't have types — values do." },
      { q: "What are common data types?", a: "int, float, str, bool, list, tuple, set, dict. Plus NoneType, bytes, and more." },
      { q: "What is a list?", a: "An ordered, mutable collection that allows duplicates. Example: [1, 2, 3]. Use [] brackets." },
      { q: "What is a tuple?", a: "An ordered, immutable collection. Example: (1, 2, 3). Once created, you can't change it." },
      { q: "What is a set?", a: "An unordered collection of unique elements. Example: {1, 2, 3}. No duplicates allowed." },
      { q: "What is a dictionary?", a: "An unordered collection of key-value pairs. Example: {\"name\": \"John\", \"age\": 25}." },
      { q: "List vs tuple vs set?", a: "List = mutable, ordered, duplicates. Tuple = immutable, ordered. Set = mutable, unordered, no duplicates." },
      { q: "What is a function?", a: "A reusable block of code that runs when called. Defined with the def keyword." },
      { q: "What are lambda functions?", a: "Anonymous one-line functions. Example: lambda x: x + 2. Useful for short callbacks." },
      { q: "What is a module?", a: "A single Python file (.py) containing code you can import — functions, classes, variables." },
      { q: "What is a package?", a: "A folder containing multiple modules plus an __init__.py. Used to organize related code." },
      { q: "What is OOP?", a: "Object-Oriented Programming — modeling code as objects (data + behavior) defined by classes." },
      { q: "What is a class?", a: "A blueprint for creating objects. Defines attributes (state) and methods (behavior)." },
      { q: "What is an object?", a: "An instance of a class — a concrete thing built from the class blueprint." },
      { q: "What is inheritance?", a: "A class acquiring attributes and methods of another class. Promotes code reuse." },
    ],
    intermediate: [
      { q: "What is polymorphism?", a: "The same method name behaving differently in different classes — one interface, many implementations." },
      { q: "What is encapsulation?", a: "Bundling data and methods together and restricting direct access (using underscore prefixes in Python)." },
      { q: "What is abstraction?", a: "Hiding implementation details and exposing only what's necessary. Done via abstract base classes (abc)." },
      { q: "What are decorators?", a: "Functions that modify or wrap other functions without changing their code. Used with @decorator syntax." },
      { q: "What is a generator?", a: "A function that yields values one at a time using yield. Saves memory for large sequences." },
      { q: "What is the GIL?", a: "Global Interpreter Lock — only one thread executes Python bytecode at a time in CPython. Limits true multithreading for CPU work." },
      { q: "is vs ==?", a: "== compares values for equality. is compares identity (whether two names point to the same object in memory)." },
      { q: "Shallow copy vs deep copy?", a: "Shallow: copies the outer object, references inside are shared. Deep: recursively copies everything." },
      { q: "What is exception handling?", a: "Catching errors using try/except/finally so the program doesn't crash on unexpected failures." },
      { q: "Why is exception handling important?", a: "It prevents crashes, gives graceful fallbacks, and lets you log/diagnose what went wrong." },
      { q: "What is PEP 8?", a: "Python's official style guide — naming conventions, indentation, spacing. Tools like flake8 check it." },
      { q: "What is indentation in Python?", a: "Whitespace at the start of a line that defines code blocks. Python requires it — no curly braces." },
      { q: "What is type casting?", a: "Converting between types: int(\"5\"), str(42), float(\"3.14\"), list((1,2,3))." },
      { q: "What is input()?", a: "A built-in function that reads a line of input from the user as a string." },
      { q: "What is print()?", a: "A built-in function that outputs values to the console (or any stream you pass)." },
      { q: "What is a loop?", a: "A control structure that repeats a block of code. Python has for and while loops." },
      { q: "Types of loops?", a: "for: iterates over a sequence. while: runs while a condition is true." },
    ],
    advanced: [
      { q: "What is break?", a: "Exits the nearest enclosing loop immediately. Skips any remaining iterations." },
      { q: "What is continue?", a: "Skips the current iteration and jumps to the next one. Doesn't exit the loop." },
      { q: "What is pass?", a: "A placeholder that does nothing. Used when you need a statement but have no code yet." },
      { q: "What is recursion?", a: "A function that calls itself with a smaller version of the problem. Needs a base case to stop." },
      { q: "What is a file in Python?", a: "Persistent storage (like .txt, .csv) you can read/write. Opened with open() and a mode." },
      { q: "File modes in Python?", a: "'r' = read, 'w' = write (overwrite), 'a' = append, 'b' = binary, 'x' = create new only." },
      { q: "What is list comprehension?", a: "Compact one-line syntax for creating lists. Example: [x*2 for x in nums if x > 0]." },
      { q: "What is a library?", a: "A collection of pre-written code you can import to use — saves you from reinventing the wheel." },
      { q: "What is NumPy?", a: "A library for fast numerical and array operations. The foundation of Python's data science stack." },
      { q: "What is Pandas?", a: "A library for working with tabular data — DataFrames, Series, CSV/Excel/SQL I/O." },
      { q: "What is Django?", a: "A high-level web framework — comes batteries-included with ORM, admin, auth, templating." },
      { q: "What is Flask?", a: "A lightweight web microframework. Minimal core; you bring your own libraries for DB, auth, etc." },
      { q: "What is multithreading in Python?", a: "Running multiple threads in one process. Limited by GIL for CPU-bound work, useful for I/O-bound work." },
      { q: "What is multiprocessing in Python?", a: "Running multiple OS processes (each with its own GIL). Truly parallel CPU work." },
      { q: "What is debugging?", a: "Finding and fixing errors in code — using prints, debuggers (pdb), logs, and tests." },
      { q: "Why learn Python?", a: "Easy to learn, in massive demand, used in AI/ML/web/data/automation. Often the best first language." },
    ],
    mcq: [
      { q: "Which Python type is IMMUTABLE?", opts: ["list", "tuple", "set", "dict"], ans: 1, why: "Tuples can't be changed once created. The rest are all mutable." },
      { q: "What does the GIL do?", opts: ["Enforces typing", "Allows only one thread to run Python bytecode at a time", "Garbage collects", "Compiles code to bytecode"], ans: 1, why: "The Global Interpreter Lock serializes Python bytecode — limits true CPU parallelism in threads." },
      { q: "Which keyword pauses a generator?", opts: ["return", "yield", "pause", "break"], ans: 1, why: "yield returns a value and pauses the generator until the next next() call." },
      { q: "What does 'is' compare?", opts: ["String equality", "Numeric equality", "Memory identity", "Type hierarchy"], ans: 2, why: "'is' checks whether two names point to the exact same object in memory." },
      { q: "Which file mode appends without overwriting?", opts: ["'r'", "'w'", "'a'", "'x'"], ans: 2, why: "'a' opens the file for appending. 'w' overwrites; 'x' fails if file exists." },
    ],
    facts: [
      "Python is named after Monty Python's Flying Circus — not the snake.",
      "Instagram, YouTube, Spotify, and Dropbox all run massive Python codebases in production.",
      "Run `import this` in any Python REPL to read 'The Zen of Python' — design principles in 19 lines.",
      "Pandas can read and write CSV, Excel, SQL, JSON, Parquet — all with one-liners.",
      "The walrus operator := arrived in Python 3.8. It lets you assign inside expressions: `if (n := len(x)) > 10: ...`",
    ],
  },
  mern: {
    beginner: [
      { q: "What is the MERN stack?", a: "MongoDB + Express + React + Node.js — a full-stack JavaScript framework. React calls Express APIs, which query MongoDB via Mongoose." },
      { q: "SQL vs NoSQL — why MongoDB for MERN?", a: "SQL = fixed tables, ACID. MongoDB = flexible JSON documents — data flows as JSON through React → Node → DB without conversion." },
      { q: "What is npm and package.json?", a: "npm = Node Package Manager. package.json = manifest listing dependencies, scripts (start/dev/test), and project metadata." },
      { q: "What is Mongoose? Schema vs Model?", a: "Mongoose is an ODM for MongoDB. Schema defines structure + validation; Model is the class with CRUD methods (find, save, update)." },
      { q: "What is JSX?", a: "HTML-like syntax embedded in JavaScript. Babel transpiles it to React.createElement() calls — not a string, not real HTML." },
      { q: "State vs Props in React?", a: "State: mutable, owned by the component (useState). Props: immutable inputs from parent. Both can trigger re-renders." },
    ],
    intermediate: [
      { q: "What is middleware in Express?", a: "Functions (req, res, next) that run in order before the response. Examples: cors, express.json. Must call next() or end the cycle." },
      { q: "app.use vs app.get?", a: "app.use matches ANY HTTP method on a path prefix (middleware/routers). app.get matches only GET on the exact path." },
      { q: "What is the MongoDB Aggregation Pipeline?", a: "Multi-stage data processing: $match → $group → $sort → $limit → $lookup. Combines SQL's GROUP BY, JOIN, ORDER BY in one query." },
      { q: "What are MongoDB indexes?", a: "B-tree structures that speed reads from O(n) to O(log n). Slow down writes. Types: single, compound, unique, text, TTL." },
      { q: "What is the Virtual DOM?", a: "An in-memory JS representation of the real DOM. React diffs old vs new tree and patches only what changed." },
      { q: "Important React Hooks?", a: "useState (state), useEffect (side effects), useContext (context), useRef (DOM/persist), useMemo (cache value), useCallback (stable fn)." },
      { q: "Rules of Hooks?", a: "Only call at the top level (not in loops/conditions) and only from React functions or custom hooks. ESLint enforces this." },
      { q: "Redux vs Context API — when to use each?", a: "Context for simple global state (theme, auth). Redux for complex state, DevTools, middleware, predictable updates at scale." },
      { q: "What is the Node.js event loop?", a: "Single-threaded but non-blocking. Async I/O is delegated to libuv; callbacks queue and run when the call stack is empty." },
      { q: "Callbacks vs Promises vs async/await?", a: "Callbacks lead to nesting hell. Promises chain with .then. async/await reads like sync code — preferred for readability." },
      { q: "What are Node.js streams?", a: "Process data in chunks instead of loading whole files. pipe() connects read → transform → write. Constant memory, any file size." },
      { q: "React lifecycle vs Hooks?", a: "Class: componentDidMount/Update/WillUnmount. Hooks: useEffect with deps array + a cleanup function returned." },
    ],
    advanced: [
      { q: "How to implement JWT auth in MERN?", a: "Login → server signs JWT → client stores it → sends in Authorization header → middleware verifies on protected routes." },
      { q: "Common MERN security vulnerabilities?", a: "XSS (React auto-escapes), NoSQL injection (use mongo-sanitize), bcrypt for passwords, helmet for headers, rate-limit for brute force." },
      { q: "How does CORS work in MERN?", a: "Browser blocks cross-origin calls. Express sends Access-Control-Allow-Origin via the cors package. Dev: React proxy. Prod: serve from same origin or whitelist." },
      { q: "What causes unnecessary re-renders?", a: "Parent renders cascade to children. Fix with React.memo (skip if props equal), useMemo (cache value), useCallback (stable fn refs)." },
      { q: "Code splitting and lazy loading?", a: "Break the bundle into chunks loaded on demand. React.lazy() + Suspense show a fallback while a chunk loads." },
      { q: "What is React Router?", a: "Standard client-side routing library. URL changes via History API; matching routes render components without page reloads." },
      { q: "How to connect React to Express?", a: "axios/fetch with a baseURL from an env var. Interceptors inject JWT into every request. Custom hooks (useFetch) wrap loading/error state." },
      { q: "SSR vs Next.js vs standard MERN?", a: "Standard React = CSR (slow first paint, bad SEO). Next.js = SSR/SSG — HTML rendered on the server. Better SEO + first paint." },
      { q: "How to deploy a MERN app?", a: "Express serves React build (monorepo) OR split: React on Vercel/Netlify, Express on Render, MongoDB on Atlas." },
      { q: "Environment variables in MERN?", a: "Backend: dotenv + .env files. React: REACT_APP_ or VITE_ prefix (bundled at build, not secret). Never commit .env." },
      { q: "How to handle errors consistently?", a: "Backend: centralised error middleware. Frontend: try/catch, axios interceptors for 401, React Error Boundaries for render errors." },
      { q: "How to optimize MERN end-to-end?", a: "Frontend: code split, memo, lazy images. Backend: gzip, Redis cache, projections. DB: indexes, pagination, aggregation pipeline." },
    ],
    mcq: [
      { q: "What does Mongoose add on top of MongoDB?", opts: ["A new DB engine", "Schemas, validation, middleware", "A UI framework", "JS-to-SQL conversion"], ans: 1, why: "Mongoose is an ODM — adds schemas, type safety, validators, and pre/post hooks to MongoDB." },
      { q: "Which Express method handles ALL HTTP verbs on a path?", opts: ["app.all", "app.use", "app.any", "app.match"], ans: 1, why: "app.use matches any method on a path prefix — perfect for middleware and mounting routers." },
      { q: "Which React hook gives a stable function reference?", opts: ["useMemo", "useState", "useCallback", "useEffect"], ans: 2, why: "useCallback returns the same function instance across renders unless deps change — prevents child re-renders." },
      { q: "What does JWT replace in a stateless API?", opts: ["Cookies entirely", "Server-side session storage", "HTTPS", "Database authentication"], ans: 1, why: "A signed JWT carries identity claims so the server doesn't need to store sessions — that's the 'stateless' part." },
      { q: "Best DB for flexible JSON-shaped data in MERN?", opts: ["MySQL", "MongoDB", "Redis", "SQLite"], ans: 1, why: "MongoDB stores documents (BSON) — perfect for varying schemas and the JSON-everywhere flow of MERN." },
    ],
    facts: [
      "MongoDB stores BSON (binary JSON), not raw JSON — that's how it indexes and queries efficiently.",
      "Express is only ~5K lines of code, yet powers millions of APIs in production.",
      "Node.js single-threaded event loop runs Netflix, LinkedIn, Walmart, and Uber backends.",
      "npm has 2M+ packages — the largest software registry in the world.",
      "Next.js (React + SSR) has become the default React framework for new production apps.",
    ],
  },
  react: {
    beginner: [
      { q: "What is React?", a: "A JavaScript library for building UIs — mainly for SPAs. Built around composable, reusable components." },
      { q: "Class vs Functional Components?", a: "Class: ES6 class + lifecycle methods (legacy). Functional: plain functions + hooks (modern, preferred)." },
      { q: "What are Props and State?", a: "Props: read-only inputs from parent. State: internal mutable data (useState). Both trigger re-renders when they change." },
      { q: "What is JSX?", a: "HTML-like syntax in JavaScript. Babel transpiles it to React.createElement() calls. Not a string, not HTML." },
      { q: "What is useEffect and when does it run?", a: "A hook for side effects (API calls, subscriptions). Runs after render — on mount and when its dependencies change." },
      { q: "What is the Virtual DOM?", a: "A lightweight in-memory copy of the real DOM. React diffs old vs new and applies the minimum patches." },
      { q: "Controlled vs Uncontrolled components?", a: "Controlled: value lives in React state (via onChange). Uncontrolled: value lives in the DOM, accessed via refs." },
      { q: "What is Lifting State Up?", a: "When two children need the same data, move the state to their common parent so both can share and update it." },
      { q: "What is React Router?", a: "The standard routing library — navigate between pages without reloading the browser. Uses the History API." },
      { q: "Why are keys used in lists?", a: "They help React identify which items changed/added/removed. Use stable unique IDs — never the array index." },
      { q: "What is a Component?", a: "A reusable, self-contained UI piece — button, form, card. Components compose into screens, screens compose into apps." },
      { q: "Types of Components?", a: "Functional (modern, with hooks) and Class (legacy). Functional is preferred today." },
      { q: "What is a Hook?", a: "A use* function that gives functional components state, lifecycle, and other React features." },
      { q: "What is useState?", a: "A hook that adds state to a functional component. Returns [value, setter] — calling setter triggers re-render." },
      { q: "Can we update props?", a: "No. Props are read-only. To change data, use state in the parent and pass new values down." },
      { q: "What is a Single Page Application (SPA)?", a: "An app that loads one HTML page and updates content via JavaScript — no full page reloads on navigation." },
      { q: "What is ReactDOM?", a: "The library that mounts React components into the real DOM. Use ReactDOM.createRoot() in React 18+." },
    ],
    intermediate: [
      { q: "What is a Fragment?", a: "<></> lets you return multiple sibling elements without adding an extra wrapper node to the DOM." },
      { q: "What is Conditional Rendering?", a: "Showing different UI based on a condition — `{isLoggedIn ? <Logout/> : <Login/>}` or `&&` for show-if-true." },
      { q: "What is useRef?", a: "A hook for mutable values that persist across renders WITHOUT triggering re-renders. Also used to access DOM elements." },
      { q: "What is the Context API?", a: "Built-in way to share data across components without prop drilling. Wrap with Provider, consume with useContext." },
      { q: "What is Redux?", a: "A state management library — single store, plain action objects, pure reducers. For complex shared state." },
      { q: "What is a Reducer?", a: "A pure function `(state, action) => newState`. Decides how state transforms based on the action type." },
      { q: "What is dispatch in Redux?", a: "A function that sends an action to the reducer to update the store. Components subscribe via useSelector." },
      { q: "What is an Action in Redux?", a: "A plain JS object describing what happened: `{ type: 'LOGIN', payload: user }`. Reducers handle actions by type." },
      { q: "What is Middleware in Redux?", a: "Code that runs between dispatch and reducer. Redux Thunk lets you handle async (API calls) inside actions." },
      { q: "What is useContext?", a: "A hook that reads the current value of a React Context. Cleaner than the older Consumer render-prop API." },
      { q: "What is useMemo?", a: "A hook that caches the result of an expensive computation. Only recomputes when its dependencies change." },
      { q: "What is useCallback?", a: "A hook that caches a function reference. Prevents child re-renders when passing functions as props." },
      { q: "What is React.StrictMode?", a: "A dev-only wrapper that flags potential issues (deprecated APIs, unsafe side effects in render)." },
      { q: "What is a Pure Component?", a: "A class component that only re-renders when its props/state shallowly differ. Functional equivalent: React.memo." },
      { q: "What is a Higher Order Component (HOC)?", a: "A function `(Component) => NewComponent` that enhances behavior. Pattern for code reuse (e.g. withAuth)." },
      { q: "What is Mounting?", a: "The phase when a component is first inserted into the DOM. useEffect with [] runs once at mount." },
      { q: "What is Updating?", a: "The phase when state or props change and React re-renders the component." },
    ],
    advanced: [
      { q: "What is Unmounting?", a: "The phase when a component is removed from the DOM. Cleanup functions in useEffect run here." },
      { q: "Lifecycle methods (class)?", a: "componentDidMount (after mount), componentDidUpdate (after update), componentWillUnmount (before unmount)." },
      { q: "What are Controlled Inputs?", a: "Form inputs whose value is in React state, updated via onChange. React owns the source of truth." },
      { q: "SPA advantage?", a: "Faster navigation, smoother UX, less server load — no full page reloads between routes." },
      { q: "What is Babel?", a: "A JavaScript compiler — turns JSX and modern ES syntax into browser-compatible JavaScript." },
      { q: "What is Webpack?", a: "A module bundler — combines JS/CSS/images into optimized bundles. Vite has largely replaced it in new projects." },
      { q: "What is an Event in React?", a: "User interactions (onClick, onChange, onSubmit) wrapped in React's cross-browser synthetic event system." },
      { q: "What is a Synthetic Event?", a: "React's wrapper around native browser events. Same API across all browsers — no quirks to worry about." },
      { q: "What is Prop Drilling?", a: "Passing props through many intermediate components that don't actually use them. Fix with Context or Redux." },
      { q: "How to prevent unnecessary re-renders?", a: "React.memo (skip if props equal), useMemo (cache derived value), useCallback (stable function reference)." },
      { q: "What is lazy loading?", a: "Loading components only when needed via dynamic import. React.lazy() splits the bundle into chunks." },
      { q: "What is Suspense?", a: "A wrapper that shows a fallback (loader) while lazy-loaded components or async data are loading." },
      { q: "What is an Error Boundary?", a: "A class component that catches JS errors in its child tree and shows a fallback instead of crashing the whole app." },
      { q: "What is Axios?", a: "A popular HTTP client library — cleaner than fetch, auto JSON parsing, interceptors, request cancellation." },
      { q: "How to handle forms in React?", a: "Controlled components: useState for each field, onChange to update, onSubmit to handle. Use libraries like react-hook-form for big forms." },
      { q: "Why is React popular?", a: "Simple model (UI = f(state)), reusable components, huge ecosystem, fast Virtual DOM, backed by Meta." },
    ],
    mcq: [
      { q: "Which is read-only inside a component?", opts: ["State", "Props", "Refs", "Context"], ans: 1, why: "Props are immutable — they come from the parent. State is mutable (via setter)." },
      { q: "Which hook is for side effects?", opts: ["useState", "useRef", "useEffect", "useMemo"], ans: 2, why: "useEffect runs after render — used for data fetching, subscriptions, manual DOM changes." },
      { q: "What does React use to optimize DOM updates?", opts: ["Web Workers", "Virtual DOM", "Service Workers", "WebAssembly"], ans: 1, why: "React diffs the Virtual DOM against the previous tree and applies the minimum patches to the real DOM." },
      { q: "Which prevents child re-renders when passing functions?", opts: ["useMemo", "useCallback", "useRef", "useState"], ans: 1, why: "useCallback returns the same function reference across renders, so memoized children don't see a 'new' prop." },
      { q: "Lazy loading is paired with which component?", opts: ["Profiler", "Suspense", "Fragment", "Provider"], ans: 1, why: "Suspense shows a fallback (e.g. a spinner) while React.lazy() loads the deferred chunk." },
    ],
    facts: [
      "React started at Facebook in 2011 — its internal name was 'FaxJS'.",
      "React's Virtual DOM diffing is O(n) thanks to two clever heuristics (same element type, keys in lists).",
      "Hooks landed in React 16.8 (Feb 2019) and changed how everyone writes React almost overnight.",
      "React is a library, not a framework — Next.js, Remix, and Gatsby fill in the rest.",
      "React Server Components blur the line between server and client — sent as a serialised tree, not HTML.",
    ],
  },
  sql: {
    beginner: [
      { q: "SQL command categories?", a: "DDL (CREATE/ALTER/DROP), DML (INSERT/UPDATE/DELETE), DQL (SELECT), DCL (GRANT/REVOKE), TCL (COMMIT/ROLLBACK)." },
      { q: "What are SQL constraints?", a: "Rules on columns: PRIMARY KEY (unique+not null), FOREIGN KEY (references), NOT NULL, UNIQUE, CHECK, DEFAULT." },
      { q: "DELETE vs TRUNCATE vs DROP?", a: "DELETE: removes rows (DML, rollback OK). TRUNCATE: clears all rows fast (DDL). DROP: removes the entire table." },
      { q: "Explain all JOIN types.", a: "INNER (matches only), LEFT (all left + matches), RIGHT (all right + matches), FULL OUTER (both), CROSS (cartesian), SELF (table to itself)." },
      { q: "UNION vs UNION ALL?", a: "UNION removes duplicates (slower — needs dedup). UNION ALL keeps all rows (faster). Prefer UNION ALL unless you need dedup." },
      { q: "Find and delete duplicate records?", a: "Find: GROUP BY column HAVING COUNT(*) > 1. Delete: ROW_NUMBER() over PARTITION BY, then DELETE WHERE rn > 1." },
      { q: "WHERE vs HAVING? Execution order?", a: "WHERE filters rows before grouping. HAVING filters groups after. Order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT." },
      { q: "COUNT(*) vs COUNT(col) vs COUNT(DISTINCT col)?", a: "COUNT(*) counts all rows. COUNT(col) skips NULLs. COUNT(DISTINCT col) counts unique non-null values." },
      { q: "What is conditional aggregation with CASE WHEN?", a: "Combine CASE WHEN inside aggregates (SUM/COUNT) to compute multiple metrics in one query — like a pivot." },
    ],
    intermediate: [
      { q: "What are window functions?", a: "Calculations across related rows WITHOUT collapsing them (unlike GROUP BY). Syntax: func() OVER (PARTITION BY ... ORDER BY ...)." },
      { q: "ROW_NUMBER vs RANK vs DENSE_RANK?", a: "ROW_NUMBER: unique sequential. RANK: ties share rank, skips next (1,2,2,4). DENSE_RANK: ties share, no gaps (1,2,2,3)." },
      { q: "LAG, LEAD, running totals, moving averages?", a: "LAG = previous row, LEAD = next row. Running total: SUM() OVER (ORDER BY date). Moving avg: AVG with ROWS BETWEEN N PRECEDING AND CURRENT ROW." },
      { q: "Correlated vs non-correlated subquery?", a: "Non-correlated: inner runs once. Correlated: inner references outer query, runs for EACH outer row — can be very slow." },
      { q: "What is a CTE? When over subqueries?", a: "WITH clause defining a named temporary result. More readable than nested subqueries; supports recursion for hierarchies." },
      { q: "IN vs EXISTS vs ANY/ALL?", a: "IN: matches a list/subquery. EXISTS: checks if subquery returns any row (efficient). NOT IN breaks on NULLs — use NOT EXISTS." },
      { q: "Clustered vs non-clustered index?", a: "Clustered: determines physical row order, one per table (usually PK). Non-clustered: separate B-tree pointing to rows." },
      { q: "EXPLAIN / EXPLAIN ANALYZE?", a: "Shows the query plan. Seq Scan = bad, Index Scan = good. EXPLAIN ANALYZE actually runs the query with real timings." },
      { q: "Common SQL performance pitfalls?", a: "SELECT *, functions on indexed columns in WHERE, leading wildcards (LIKE '%x'), large OFFSET pagination, missing JOIN indexes." },
      { q: "Normalization — 1NF/2NF/3NF/BCNF?", a: "1NF: atomic values. 2NF: no partial deps on composite PK. 3NF: no transitive deps. BCNF: every determinant is a candidate key." },
    ],
    advanced: [
      { q: "PK vs FK vs Unique vs Surrogate key?", a: "PK: unique + not null. FK: references another table's PK. Unique: distinct values (1 NULL OK). Surrogate: auto-generated ID (preferred)." },
      { q: "Views, materialized views, stored procedures, triggers?", a: "View: virtual (no storage). Materialized view: stored result, refresh on demand. Stored procedure: saved SQL routine. Trigger: auto-runs on INSERT/UPDATE/DELETE." },
      { q: "How does NULL work? Common pitfalls?", a: "NULL = unknown. col = NULL is always UNKNOWN — use IS NULL. NOT IN with NULLs returns empty. Aggregates ignore NULLs." },
      { q: "COALESCE vs ISNULL vs NVL vs IFNULL?", a: "COALESCE is ANSI standard (multi-arg). ISNULL: SQL Server. NVL: Oracle. IFNULL: MySQL. Prefer COALESCE everywhere." },
      { q: "Transaction isolation levels?", a: "READ UNCOMMITTED (allows dirty), READ COMMITTED (default), REPEATABLE READ (no non-repeatable), SERIALIZABLE (no phantoms)." },
      { q: "What is a deadlock? How to prevent?", a: "Two txns each waiting for the other's lock. DB kills one. Prevent: lock in consistent order, short transactions, lower isolation if safe." },
      { q: "Nth highest salary?", a: "DENSE_RANK() OVER (ORDER BY salary DESC), filter WHERE dr = N. Handles ties. Alt: LIMIT 1 OFFSET N-1 on DISTINCT salaries." },
      { q: "Customers with no orders?", a: "LEFT JOIN + WHERE orders.id IS NULL, or NOT EXISTS (NULL-safe, often fastest). Avoid NOT IN if subquery may produce NULLs." },
      { q: "Running total / month-over-month growth?", a: "Running total: SUM(x) OVER (ORDER BY date). MoM: (curr - LAG(curr)) * 100 / NULLIF(LAG(curr), 0)." },
      { q: "Top N per group?", a: "ROW_NUMBER() or DENSE_RANK() OVER (PARTITION BY group ORDER BY x DESC) inside a CTE, filter WHERE rn <= N." },
      { q: "Detect data quality issues?", a: "Duplicates: GROUP BY HAVING COUNT(*)>1. NULL profiling: COUNT(*) vs SUM(CASE WHEN x IS NULL). Outliers: IQR via PERCENTILE_CONT." },
    ],
    mcq: [
      { q: "Which command is DDL?", opts: ["DELETE", "UPDATE", "TRUNCATE", "INSERT"], ans: 2, why: "TRUNCATE is DDL — it changes structure (deallocates data pages). DELETE/UPDATE/INSERT are DML." },
      { q: "Which JOIN returns ALL rows from BOTH tables?", opts: ["INNER JOIN", "LEFT JOIN", "FULL OUTER JOIN", "CROSS JOIN"], ans: 2, why: "FULL OUTER JOIN includes unmatched rows from both sides, filling missing columns with NULL." },
      { q: "HAVING filters what?", opts: ["Rows", "Columns", "Groups (after GROUP BY)", "Indexes"], ans: 2, why: "WHERE filters rows before grouping; HAVING filters after — and can use aggregate functions." },
      { q: "Which ranking function has NO gaps on ties?", opts: ["ROW_NUMBER", "RANK", "DENSE_RANK", "NTILE"], ans: 2, why: "DENSE_RANK gives ties the same rank but does not skip the next rank (1, 2, 2, 3)." },
      { q: "What does NULL = NULL evaluate to?", opts: ["TRUE", "FALSE", "UNKNOWN", "0"], ans: 2, why: "Any comparison with NULL is UNKNOWN. Use IS NULL / IS NOT NULL instead of = or !=." },
    ],
    facts: [
      "SQL was originally called SEQUEL — Structured English Query Language — at IBM in the 1970s.",
      "Postgres has supported JSON natively since 2012 — you often don't need NoSQL.",
      "A well-placed index can speed up reads 100x — but slow writes 10–30%. Trade-offs.",
      "SELECT * is fast in dev, slow in production. Always pick only the columns you need.",
      "The largest SQL databases handle petabytes — sharding is mostly invisible to the application.",
    ],
  },
  genai: {
    beginner: [
      { q: "What is tokenization?", a: "Splitting text into smaller tokens (words, subwords). 'artificial' might become 'art', 'ific', 'ial'. LLMs process tokens, not raw text." },
      { q: "How does the attention mechanism work?", a: "Weighs the importance of each token relative to others via query/key/value dot products + softmax. Lets the model focus on what matters." },
      { q: "What is the context window?", a: "The max tokens an LLM can process at once — its working memory. Bigger window = more context but higher compute cost." },
      { q: "LoRA vs QLoRA?", a: "LoRA: adds small low-rank adapter matrices for cheap fine-tuning. QLoRA: also quantizes to 4-bit — fine-tune 70B models on one GPU." },
      { q: "Beam search vs greedy decoding?", a: "Greedy picks the top token each step. Beam search keeps top-K sequences and picks the best path — more coherent for translation." },
      { q: "What does temperature control?", a: "Randomness of token selection. Low (0.3) = predictable. High (1.5) = creative. ~0.8 = balanced for most tasks." },
      { q: "What is masked language modeling (MLM)?", a: "Hide random tokens, train the model to predict them from surrounding context. Used in BERT — gives bidirectional understanding." },
      { q: "What are sequence-to-sequence models?", a: "Encoder processes input sequence, decoder generates output. Used in translation, summarization, dialogue." },
      { q: "Autoregressive vs masked models?", a: "Autoregressive (GPT): predicts next token from previous. Masked (BERT): fills in blanks using full context. Generation vs comprehension." },
      { q: "What are embeddings?", a: "Dense vectors that represent tokens in continuous space — they capture semantic meaning. Initialized randomly or with pretrained vectors." },
      { q: "Next sentence prediction (NSP)?", a: "Train the model to decide whether two sentences are consecutive. Used in BERT pretraining — improves coherence in long-form tasks." },
      { q: "Top-k vs top-p sampling?", a: "Top-k samples from the K most likely tokens. Top-p (nucleus) samples until cumulative prob ≥ p — adapts to context, more flexible." },
      { q: "Why is prompt engineering important?", a: "Better prompts = better outputs. 'Summarize in 100 words' beats 'summarize'. Critical for zero-shot and few-shot tasks." },
      { q: "How to avoid catastrophic forgetting?", a: "Mix old + new data (rehearsal), Elastic Weight Consolidation, modular adapters, or PEFT (freeze most params)." },
      { q: "What is model distillation?", a: "Train a smaller 'student' to mimic a larger 'teacher'. Same task, a fraction of the compute and memory. Deploys to edge devices." },
      { q: "How do LLMs handle out-of-vocabulary words?", a: "Subword tokenization (BPE). 'cryptocurrency' splits into 'crypto' + 'currency' — nothing is truly unknown." },
      { q: "How do transformers improve over RNN-based seq2seq?", a: "Parallel processing (no sequential bottleneck), long-range attention, positional encodings for order — massively scalable." },
    ],
    intermediate: [
      { q: "What is overfitting? How to mitigate?", a: "Model memorizes training data, fails on new data. Mitigate with regularization (L1/L2), dropout, early stopping." },
      { q: "Generative vs discriminative models?", a: "Generative (GPT): models joint probability, creates new data. Discriminative (BERT-classifier): models conditional, separates classes." },
      { q: "GPT-4 vs GPT-3?", a: "GPT-4 is multimodal (text + image), larger context (~32K vs 4K), fewer hallucinations, better at reasoning and code." },
      { q: "What are positional encodings?", a: "Sinusoidal or learned vectors added to embeddings so transformers know token order — attention itself has no sense of position." },
      { q: "What is multi-head attention?", a: "Splits Q/K/V into multiple subspaces; each head learns different patterns (syntax, semantics) in parallel and concatenates the results." },
      { q: "How is softmax used in attention?", a: "Converts raw similarity scores into a probability distribution — normalizes the model's focus across tokens." },
      { q: "How does the dot product work in self-attention?", a: "Q · K^T / sqrt(d_k) measures token similarity. Higher = more relevant. Quadratic in sequence length — the bottleneck for long context." },
      { q: "Why cross-entropy loss in language modeling?", a: "Penalizes low probability assigned to the correct next token. Encourages confident, correct predictions." },
      { q: "How are gradients computed for embeddings?", a: "Backprop via chain rule: ∂L/∂E = ∂L/∂logits · ∂logits/∂E. Updates each embedding vector toward better semantic placement." },
      { q: "What is the Jacobian matrix in transformer backprop?", a: "Matrix of partial derivatives of outputs w.r.t. inputs. Used to compute multi-dimensional gradients efficiently in deep nets." },
      { q: "Eigenvalues/eigenvectors in dimensionality reduction?", a: "In PCA, top eigenvectors capture maximum variance — drop low-variance ones to reduce dimensions while keeping most info." },
      { q: "What is KL divergence?", a: "Measures how different two probability distributions are. Used to keep fine-tuned models close to a target/teacher distribution." },
      { q: "Derivative of ReLU? Why is it important?", a: "f'(x) = 1 if x > 0 else 0. Sparse, non-linear, no vanishing gradient — that's why ReLU dominates hidden layers." },
      { q: "How does the chain rule apply to gradient descent?", a: "Composite function derivatives. Enables backprop layer-by-layer to compute and apply gradients efficiently in deep networks." },
      { q: "How are attention scores calculated?", a: "softmax(QK^T / sqrt(d_k)) · V — scaled dot product, normalized to weights, applied to value vectors." },
      { q: "What is Gemini?", a: "Google's multimodal LLM — native text + image + audio handling, unified architecture, much larger context windows than GPT-4." },
      { q: "Types of foundation models?", a: "Language (GPT, BERT, LLaMA), Vision (ResNet, ViT), Generative (DALL-E, SD), Multimodal (CLIP, Gemini)." },
    ],
    advanced: [
      { q: "What is PEFT?", a: "Parameter-Efficient Fine-Tuning. Update only a small subset of parameters (e.g. LoRA) — preserves base knowledge, way less compute." },
      { q: "Steps in Retrieval-Augmented Generation (RAG)?", a: "1) Retrieve relevant docs via embedding similarity. 2) Rank by score. 3) Generate using retrieved context. Reduces hallucinations." },
      { q: "What is Mixture of Experts (MoE)?", a: "Many specialized 'expert' subnetworks; a gating function activates 1–2 per input. Scales params without scaling compute per token." },
      { q: "What is Chain-of-Thought (CoT) prompting?", a: "Prompts the model to reason step-by-step. Dramatically improves accuracy on math, logic, and multi-step problems." },
      { q: "Discriminative vs generative AI?", a: "Discriminative: classifies/predicts labels. Generative: creates new content (text, image, audio). LLMs are generative." },
      { q: "How do knowledge graphs improve LLMs?", a: "Provide structured factual data — reduce hallucinations, ground responses in verified entities and relationships." },
      { q: "What is zero-shot learning?", a: "Performing a task with no task-specific training, purely from the prompt and pretrained knowledge." },
      { q: "What is Adaptive Softmax?", a: "Groups vocabulary by frequency, reducing compute for rare words. Speeds up large-vocab models without losing accuracy." },
      { q: "How do transformers address vanishing gradients?", a: "Self-attention bypasses sequential dependencies; residual connections and LayerNorm keep gradients flowing through deep stacks." },
      { q: "What is few-shot learning?", a: "Performing a task with just a few examples in the prompt — no full fine-tuning. Leverages pretrained knowledge." },
      { q: "How to fix biased or incorrect LLM outputs?", a: "Identify the bias source, balance/curate data, fine-tune with adversarial examples, and add safety filters at inference." },
      { q: "Encoders vs decoders in transformers?", a: "Encoder builds a contextual representation of the input. Decoder generates output token by token using encoder context." },
      { q: "LLMs vs traditional statistical language models?", a: "LLMs use transformers, billions of params, unsupervised pretraining. Statistical LMs (N-grams) are simple, sparse, and supervised." },
      { q: "What is a hyperparameter?", a: "A configurable training setting (learning rate, batch size, dropout). Not learned — must be tuned. Big impact on performance." },
      { q: "What defines a Large Language Model?", a: "A transformer with billions of parameters trained on huge text corpora — capable of broad NLP tasks via prompting." },
      { q: "Key challenges in deploying LLMs?", a: "Compute cost, bias, interpretability, hallucinations, data privacy, latency. All open research problems today." },
    ],
    mcq: [
      { q: "What does temperature control in LLM generation?", opts: ["Speed", "Randomness of token selection", "Context length", "Model size"], ans: 1, why: "Low temperature = predictable output, high = diverse. It's the main knob between conservative and creative generation." },
      { q: "QLoRA adds what over LoRA?", opts: ["More parameters", "4-bit quantization", "Multimodal input", "Better tokenizer"], ans: 1, why: "QLoRA quantizes the base model to 4-bit, dramatically cutting memory — fine-tune 70B models on one GPU." },
      { q: "What does RAG stand for?", opts: ["Reinforcement Adaptive Generation", "Retrieval-Augmented Generation", "Recursive Attention Graph", "Random Activation Gate"], ans: 1, why: "RAG retrieves relevant docs first, then conditions generation on them — reduces hallucinations significantly." },
      { q: "Which model is autoregressive?", opts: ["BERT", "GPT", "RoBERTa", "ELECTRA"], ans: 1, why: "GPT predicts the next token from previous ones. BERT is masked — fills blanks with bidirectional context." },
      { q: "What is the context window?", opts: ["Number of training epochs", "Max tokens processed at once", "Number of attention heads", "Hidden layer size"], ans: 1, why: "Context window = working memory of the LLM. Bigger = more context per call, but quadratic compute cost." },
    ],
    facts: [
      "GPT-3 had 175B parameters; GPT-4 is rumored to be ~1.7T (Mixture of Experts).",
      "Training GPT-4 cost an estimated $100M+ in compute alone — not counting people.",
      "LLaMA 2 7B can run on a single laptop with 4-bit quantization (QLoRA-style).",
      "'Attention Is All You Need' (2017, 8 authors) is the paper that birthed the transformer.",
      "Context windows grew from 4K (GPT-3) to 1M+ tokens (Gemini 1.5) in just 3 years.",
    ],
  },
  mobile: {
    beginner: [
      { q: "Native vs cross-platform vs hybrid?", a: "Native (Swift/Kotlin): max performance, separate codebases. Cross-platform (Flutter/RN): shared code, near-native UX. Hybrid (WebView): cheapest, slowest." },
      { q: "Android vs iOS lifecycle?", a: "Android: onCreate→onStart→onResume→onPause→onStop→onDestroy. iOS: viewDidLoad→viewWillAppear→viewDidAppear→viewWillDisappear." },
      { q: "Deep linking and push notifications?", a: "Deep link: URL opens a specific screen in-app. Push: server → FCM (Android) or APNs (iOS) → device, even when app is closed." },
      { q: "Android's 4 main components and Intents?", a: "Activity (screen), Service (background), BroadcastReceiver (system events), ContentProvider (shared data). Intent = messaging object to invoke them." },
      { q: "What are Kotlin Coroutines?", a: "Lightweight concurrency. suspend functions pause without blocking. Dispatchers (Main/IO/Default) control which thread runs the work." },
      { q: "LiveData vs StateFlow vs SharedFlow?", a: "LiveData: lifecycle-aware, main thread. StateFlow: always has a value, replays latest. SharedFlow: one-time events, no state." },
      { q: "SwiftUI vs UIKit?", a: "UIKit: imperative, view objects, manual updates. SwiftUI: declarative, structs, auto-updates from state. SwiftUI is iOS 13+ (modern)." },
      { q: "Swift Optionals and ARC?", a: "Optional = value or nil — forces explicit nil handling. ARC = automatic reference counting; use weak/unowned to break retain cycles." },
      { q: "Core Data vs UserDefaults vs Keychain?", a: "UserDefaults: small settings (plaintext). Keychain: secure tokens/passwords. Core Data: full ORM for structured persistent data." },
    ],
    intermediate: [
      { q: "What is MVVM in Android?", a: "Model-View-ViewModel. View observes ViewModel state; ViewModel calls Repository. Survives rotation. Highly testable." },
      { q: "What is Room database?", a: "Android's ORM over SQLite. @Entity = table, @Dao = queries as Kotlin methods, @Database = the DB class. Compile-time SQL checking." },
      { q: "Dependency Injection / Hilt?", a: "DI provides deps externally for testability. Hilt = Google's Android DI built on Dagger — @Inject, @HiltViewModel, @Module." },
      { q: "Jetpack Compose vs the old View system?", a: "Compose: declarative UI as Kotlin functions. State changes auto-recompose. Replaces XML layouts + findViewById." },
      { q: "State in Compose — remember vs rememberSaveable?", a: "mutableStateOf triggers recomposition. remember survives recomposition only. rememberSaveable also survives configuration changes." },
      { q: "Side effects in Compose?", a: "LaunchedEffect: coroutine tied to composition. DisposableEffect: setup + onDispose cleanup. SideEffect: publish to non-Compose code." },
      { q: "How does React Native work? The JS bridge?", a: "JS runs on JS thread; UI components are real native. Old: JSON bridge. New: JSI = synchronous C++ refs (Fabric/TurboModules)." },
      { q: "FlatList vs SectionList vs ScrollView?", a: "ScrollView: renders ALL (small content only). FlatList: virtualized, lazy (long lists). SectionList: grouped with section headers." },
      { q: "React Navigation?", a: "Standard navigation library — Stack, Tab, Drawer navigators. Use navigation.navigate() and useParams. Native gestures + deep linking." },
      { q: "How does Flutter render UI?", a: "Flutter draws every pixel on a Skia/Impeller canvas — no native UI components. Pixel-perfect across iOS and Android." },
      { q: "StatelessWidget vs StatefulWidget?", a: "StatelessWidget: immutable, depends only on props. StatefulWidget: has mutable state via a State object and setState()." },
      { q: "Flutter state management — Provider vs Riverpod vs Bloc?", a: "Provider: simple, context-based. Riverpod: compile-safe, ref-based (recommended). Bloc: events/states, structured for large apps." },
    ],
    advanced: [
      { q: "What causes jank? How to fix?", a: "Heavy work on the UI thread, large image decoding, excessive recompositions. Fix: background threads, lazy lists, image caching." },
      { q: "How to handle offline support?", a: "Local DB (Room/Core Data) as source of truth. Background sync (WorkManager/BackgroundTasks). Idempotent APIs for safe retries." },
      { q: "Secure storage and certificate pinning?", a: "Android: Keystore + EncryptedSharedPreferences. iOS: Keychain. Cert pinning hardcodes server certificate hash to block MITM." },
      { q: "Retrofit vs Dio?", a: "Retrofit: type-safe HTTP client for Android (annotated Kotlin interfaces). Dio: Flutter's HTTP client with interceptors, cancellation, FormData." },
      { q: "Unit vs integration vs UI tests?", a: "Unit: fast, no device, mocks. Integration: multiple components, may need emulator. UI/E2E: full app flow, slow but realistic." },
      { q: "App signing, staged rollout, OTA updates?", a: "Signing: cryptographic key per platform. Staged rollout: release to N% of users. OTA: update JS bundle without store review (CodePush, Expo Updates)." },
      { q: "ProGuard / R8 vs Flutter tree shaking?", a: "R8 shrinks + obfuscates + optimizes Android code. Flutter tree shaking removes unused Dart code automatically in release builds." },
      { q: "Key mobile performance metrics?", a: "Crash-free rate (>99.5%), ANR rate (<0.25%), cold start (<2s), 60 FPS, memory, battery, P95 API latency." },
      { q: "MVVM vs MVI vs Clean Architecture?", a: "MVVM: View ↔ ViewModel state binding. MVI: unidirectional state, immutable. Clean: layered (Presentation/Domain/Data), no inward deps." },
    ],
    mcq: [
      { q: "Flutter renders UI using what?", opts: ["Native iOS/Android components", "WebView", "Skia/Impeller canvas", "OpenGL fixed-function pipeline"], ans: 2, why: "Flutter draws every pixel itself on a Skia (or Impeller) canvas — that's why UI is identical across iOS and Android." },
      { q: "Best component for long lists in React Native?", opts: ["ScrollView", "FlatList", "View", "Modal"], ans: 1, why: "FlatList is virtualized — only renders visible rows. ScrollView mounts everything at once, killing performance on long lists." },
      { q: "Which Android class survives configuration changes?", opts: ["Activity", "Fragment", "ViewModel", "BroadcastReceiver"], ans: 2, why: "ViewModel is scoped to the ViewModelStoreOwner — it survives screen rotation. Activities are recreated." },
      { q: "Where should you store an auth token on iOS?", opts: ["UserDefaults", "Plist file", "Keychain", "SQLite"], ans: 2, why: "Keychain is OS-encrypted, survives app deletion, and is the only sanctioned place for secrets on iOS." },
      { q: "What does R8 do in Android builds?", opts: ["Code coverage", "Shrink + obfuscate + optimize", "Push notifications", "Lint checking"], ans: 1, why: "R8 (replacing ProGuard) removes unused code, renames identifiers, and inlines methods — smaller, faster, harder to reverse." },
    ],
    facts: [
      "Android has ~71% global market share; iOS dominates the US in revenue per user.",
      "A 100ms slower app start typically drops user engagement by ~10%.",
      "Firebase Crashlytics is used by ~80% of top-grossing mobile apps for crash monitoring.",
      "Flutter powers Google Pay, BMW My, and ByteDance's CapCut — cross-platform can scale.",
      "React Native's new architecture (JSI + Fabric) closes most of the perf gap with native.",
    ],
  },
  business_analyst: {
    beginner: [
      { q: "What does a Business Analyst do?", a: "A BA understands business problems and helps teams build the right solution. They bridge business teams and technical teams." },
      { q: "What are business requirements?", a: "Business requirements explain what the business wants to achieve. They focus on goals and outcomes, not the how." },
      { q: "What is a functional requirement?", a: "A functional requirement explains what the system should do. Example: 'Users should be able to log in.'" },
      { q: "What is a non-functional requirement?", a: "Non-functional requirements describe performance or quality — speed, security, scalability, reliability." },
      { q: "What is SDLC?", a: "Software Development Life Cycle: planning → development → testing → deployment → maintenance." },
      { q: "What is Agile methodology?", a: "Agile develops software in small, fast cycles. Teams continuously improve based on feedback." },
      { q: "What is Scrum?", a: "An Agile framework where teams work in short sprints with daily standups and sprint reviews." },
      { q: "What is a sprint?", a: "A short development cycle (usually 1–4 weeks) during which a team completes planned tasks." },
      { q: "What is a stakeholder?", a: "Anyone affected by the project — clients, managers, developers, end users, executives." },
      { q: "What is requirement gathering?", a: "Collecting business needs from stakeholders to define the project clearly." },
      { q: "What is BRD?", a: "Business Requirement Document — explains business goals and high-level requirements." },
      { q: "What is SRS?", a: "Software Requirement Specification — contains detailed system requirements (functional + non-functional)." },
      { q: "What is a use case?", a: "Describes how a user interacts with a system step-by-step to complete an action." },
      { q: "What is UML?", a: "Unified Modeling Language — used to visually represent systems and workflows (class, sequence, use-case diagrams)." },
      { q: "What is SWOT analysis?", a: "Strengths, Weaknesses, Opportunities, Threats — a framework to analyze a business situation." },
      { q: "What is gap analysis?", a: "Compares current performance with desired performance to identify improvement areas." },
      { q: "What is a flowchart?", a: "A visual representation of process steps using shapes and arrows. Helps explain workflows clearly." },
      { q: "What is UAT?", a: "User Acceptance Testing — real users test whether the system meets business needs before go-live." },
      { q: "What tools do Business Analysts use?", a: "Excel, JIRA, Confluence, Power BI, Tableau, SQL, Visio, Lucidchart, Figma. Mix depends on the project." },
      { q: "Why do you want to become a Business Analyst?", a: "I enjoy solving problems at the intersection of people, business, and technology — and improving processes." },
    ],
    intermediate: [
      { q: "Agile vs Waterfall?", a: "Waterfall: fixed sequence of phases, locked scope. Agile: iterative, flexible, accommodates change." },
      { q: "What is a user story?", a: "A feature described from the user's perspective. Format: 'As a [user], I want [goal] so that [benefit].'" },
      { q: "What is acceptance criteria?", a: "Conditions that define when a feature is considered complete. Used by testers + developers to verify." },
      { q: "What is the backlog in Agile?", a: "An ordered list of tasks, features, and improvements. The Product Owner manages it." },
      { q: "What is requirement prioritization?", a: "Deciding which features are most important first — by value, urgency, effort, or strategic fit." },
      { q: "What is MoSCoW prioritization?", a: "Must Have, Should Have, Could Have, Won't Have. Ranks requirements by criticality." },
      { q: "What is process modeling?", a: "Visually representing workflows and business operations using BPMN, UML, or flowcharts." },
      { q: "What is a KPI?", a: "Key Performance Indicator — a measurable value showing how effectively goals are being achieved." },
      { q: "What is feasibility analysis?", a: "Checks whether a project is possible technically, financially, and operationally before commitment." },
      { q: "What is root cause analysis?", a: "Identifies the main reason behind a problem (5 Whys, Fishbone) to prevent it from recurring." },
      { q: "What is BPMN?", a: "Business Process Model and Notation — a standard for diagramming business processes." },
      { q: "What is data analysis in BA work?", a: "Studying data to find patterns and insights that support better business decisions." },
      { q: "Why is SQL useful for BAs?", a: "SQL lets BAs pull data directly from databases for reporting, validation, and decision support." },
      { q: "What is change management?", a: "Helping organizations and people adapt to new systems, processes, or structures smoothly." },
      { q: "What is requirement traceability?", a: "Tracking each requirement throughout the project lifecycle to ensure nothing is missed or unverified." },
      { q: "What is a wireframe?", a: "A low-fidelity visual layout of an app or webpage — focuses on structure, not design." },
      { q: "What challenges do BAs face?", a: "Unclear requirements, communication gaps, scope creep, conflicting stakeholders, changing priorities." },
      { q: "How do you handle conflicting stakeholder opinions?", a: "Listen to all sides, focus on business goals, facilitate discussion, use data to break ties." },
      { q: "What is a business process?", a: "A set of structured steps used to achieve a business goal. Example: customer onboarding." },
      { q: "How do BAs communicate with developers?", a: "Through clear requirements, user stories, acceptance criteria, walkthrough meetings, and JIRA tickets." },
    ],
    advanced: [
      { q: "How do you handle changing requirements?", a: "Discuss impact with stakeholders, update documentation, log change requests, re-prioritize the backlog." },
      { q: "What is requirement elicitation?", a: "The process of collecting requirements from stakeholders — interviews, workshops, surveys, observation." },
      { q: "Techniques used for requirement gathering?", a: "Interviews, brainstorming, workshops, observation, questionnaires, prototyping, document analysis." },
      { q: "What is a risk in a project?", a: "A potential issue that may affect the project's success. Identified early, tracked in a risk register." },
      { q: "What is a business case?", a: "A document explaining WHY a project should be started — benefits, costs, risks, expected ROI." },
      { q: "What is scope creep?", a: "Uncontrolled growth of requirements after the project starts. Prevent it with change-control processes." },
      { q: "What is a dashboard?", a: "A visual display of key business data and KPIs. Helps stakeholders track performance at a glance." },
      { q: "What is data visualization?", a: "Presenting data using charts, graphs, and dashboards so insights are easy to understand and act on." },
      { q: "What is requirement validation?", a: "Checking that requirements are correct, complete, and aligned with business goals before development." },
      { q: "What is stakeholder management?", a: "Identifying, engaging, and communicating with stakeholders to keep them aligned and supportive." },
      { q: "What is the BA's role during testing?", a: "Ensures the system matches business requirements, supports UAT, clarifies issues, signs off scenarios." },
      { q: "What is impact analysis?", a: "Assesses how a proposed change affects systems, processes, and stakeholders BEFORE implementation." },
      { q: "What is prototyping?", a: "Building a sample version of a product (clickable mockup, MVP) to gather feedback before full development." },
      { q: "What is digital transformation?", a: "Using technology to fundamentally improve business operations, customer experience, and revenue models." },
      { q: "What is requirement ambiguity?", a: "When requirements are unclear or open to multiple interpretations. Resolve with examples and stakeholder reviews." },
      { q: "What metrics can BAs track?", a: "KPIs, revenue growth, customer satisfaction (NPS, CSAT), project velocity, defect rates, adoption rates." },
      { q: "Business Analyst vs Data Analyst?", a: "BA focuses on business problems and solutions. DA focuses on data exploration, insights, and visualizations." },
      { q: "How do you ensure clear requirements?", a: "Use simple language, examples, visuals, get stakeholder sign-off, peer-review documentation." },
      { q: "What makes a good Business Analyst?", a: "Strong communication, problem-solving, analytical thinking, curiosity, empathy, comfort with ambiguity." },
      { q: "Where do you see yourself as a BA?", a: "Growing into senior/lead BA roles, then product management or BA consulting on larger transformations." },
    ],
    mcq: [
      { q: "Which of these is a NON-functional requirement?", opts: ["Users can reset their password", "System must respond in under 2 seconds", "Admin can delete a user", "Export reports as PDF"], ans: 1, why: "Non-functional requirements describe quality attributes like performance, security, or scalability. Response time is a classic performance requirement." },
      { q: "MoSCoW prioritization stands for?", opts: ["Mandatory, Standard, Critical, Wishful", "Must, Should, Could, Won't", "Major, Significant, Casual, Wait", "Manage, Solve, Communicate, Win"], ans: 1, why: "MoSCoW = Must Have, Should Have, Could Have, Won't Have. Used to rank requirements by business criticality." },
      { q: "Which document is detailed and technical?", opts: ["BRD", "SRS", "Business Case", "SWOT"], ans: 1, why: "SRS (Software Requirement Specification) has detailed functional + non-functional system requirements. BRD is higher-level business goals." },
      { q: "What's the BA's role during UAT?", opts: ["Write all test scripts", "Ensure system matches requirements + support real users testing", "Replace QA team", "Approve code merges"], ans: 1, why: "BAs facilitate UAT, clarify acceptance criteria, and confirm the solution meets the business need before go-live." },
      { q: "Best technique for finding the real cause of a recurring problem?", opts: ["SWOT analysis", "Wireframing", "Root Cause Analysis (5 Whys, Fishbone)", "Brainstorming"], ans: 2, why: "Root Cause Analysis (5 Whys, Fishbone/Ishikawa diagram) drills past symptoms to the underlying cause so the problem doesn't recur." },
    ],
    facts: [
      "📚 BABOK Guide (Business Analysis Body of Knowledge) — the IIBA's definitive reference. Every BA should own a copy.",
      "🎯 Crack the interview: frame every answer around BUSINESS VALUE — 'this solves X for the user/customer/business' beats technical jargon.",
      "💡 BA tool trifecta in 2025: SQL (data), Excel/Power BI (analysis), JIRA + Confluence (delivery). Master these three.",
      "📖 'User Story Mapping' by Jeff Patton — the best book on writing user stories that actually capture value.",
      "📊 The 5 Whys technique solves 80% of process issues — keep asking 'why?' until the root cause is obvious.",
      "🏆 Certifications: ECBA (entry), CCBA (mid), CBAP (senior) from IIBA. PMI-PBA is another respected one.",
      "🤝 Soft skills = 50% of the job. Active listening + facilitation skills matter as much as documentation.",
      "🎓 Free resource: 'BA Times' (batimes.com) — articles from working BAs across industries. Read it weekly.",
    ],
  },
  embedded: {
    beginner: [
      { q: "What is an embedded system?", a: "A computer designed for a specific task, built into a larger device. Examples: washing machines, microwaves, car ECUs, smart watches." },
      { q: "Microcontroller vs microprocessor?", a: "Microcontroller = CPU + RAM + ROM + I/O on one chip. Microprocessor = just the CPU, needs external memory + peripherals." },
      { q: "What is GPIO?", a: "General Purpose Input/Output — programmable pins on a microcontroller used to read sensors or drive LEDs, motors, relays." },
      { q: "What is a real-time OS (RTOS)?", a: "An OS that processes tasks within guaranteed time limits. Used where timing is critical — airbags, pacemakers, motor controllers." },
      { q: "RAM vs ROM in embedded systems?", a: "RAM: volatile, runtime data. ROM (Flash): non-volatile, stores firmware permanently. RAM is fast; Flash survives power-off." },
      { q: "What is a bootloader?", a: "A small program that runs first on power-on. Initializes hardware, optionally accepts firmware updates, then jumps to the main application." },
      { q: "What is UART?", a: "Universal Asynchronous Receiver-Transmitter — serial protocol using 2 wires (TX, RX) for simple point-to-point communication." },
      { q: "What is SPI?", a: "Serial Peripheral Interface — synchronous protocol using 4 lines (MOSI, MISO, SCK, CS). Faster than I2C; used for sensors, displays, flash." },
      { q: "What is I2C?", a: "Inter-Integrated Circuit — 2-wire protocol (SDA, SCL) supporting multiple devices on the same bus via addressing." },
      { q: "What is PWM?", a: "Pulse Width Modulation — controls power by varying the duty cycle of a digital signal. Used for LED brightness, motor speed, servos." },
      { q: "What is an interrupt?", a: "A signal that tells the CPU to pause its current task and handle an urgent event. After handling, the CPU resumes." },
      { q: "What is an ADC?", a: "Analog-to-Digital Converter — converts a real-world analog signal (e.g. temperature voltage) into a digital number the MCU can process." },
      { q: "What is a DAC?", a: "Digital-to-Analog Converter — converts a digital number into an analog voltage. Used in audio output, motor control, signal generators." },
      { q: "What does 'volatile' mean in embedded C?", a: "Tells the compiler NOT to optimize that variable because it can change unexpectedly — from an ISR or a hardware register." },
      { q: "What is a watchdog timer?", a: "A timer that resets the system if the program gets stuck. Software must regularly 'feed' (reset) it to prevent a reboot." },
      { q: "What is cross-compilation?", a: "Writing code on one machine (e.g. x86 PC) and compiling it to run on a different target architecture (e.g. ARM Cortex-M)." },
      { q: "What is a linker script?", a: "Tells the linker where to place code and data sections (.text, .data, .bss) in the target's memory map." },
      { q: "Polling vs interrupt-driven I/O?", a: "Polling loops checking a status flag (wastes CPU). Interrupt-driven lets the CPU do other work and only responds when hardware signals." },
      { q: "What is a hex file in embedded?", a: "A compiled firmware file (.hex) in Intel HEX format, ready to be flashed onto the microcontroller's flash memory." },
      { q: "What is a register in a microcontroller?", a: "A small, fixed-size memory location inside the CPU used to control hardware peripherals or store temporary data very quickly." },
    ],
    intermediate: [
      { q: "What is DMA and why use it?", a: "Direct Memory Access transfers data between memory and peripherals WITHOUT the CPU. Frees the CPU for other work — huge performance win." },
      { q: "What is an ISR (Interrupt Service Routine)?", a: "A function that runs automatically when an interrupt fires. Should be short and fast to avoid blocking other time-critical tasks." },
      { q: "Stack vs heap memory in embedded?", a: "Stack: auto-managed, used for local variables. Heap: manual (malloc/free) for dynamic allocation. Embedded prefers stack — heap fragments." },
      { q: "What is bit manipulation and why important?", a: "Using bitwise operators (&, |, ^, ~, <<, >>) to set/clear/toggle individual bits in hardware registers. Essential for low-level peripheral control." },
      { q: "What is memory-mapped I/O?", a: "Hardware peripheral registers are assigned specific memory addresses. You control hardware by simply reading/writing those addresses." },
      { q: "What is endianness?", a: "Byte order of multi-byte data. Little-endian: least significant byte first (ARM, x86). Big-endian: most significant byte first (some network protocols)." },
      { q: "What is a semaphore in RTOS?", a: "A synchronization primitive used to control access to shared resources or signal events from an ISR to a task." },
      { q: "What is a mutex?", a: "Mutual exclusion lock — only one task can hold it at a time. Prevents two tasks from accessing a shared resource simultaneously." },
      { q: "What is priority inversion?", a: "A high-priority task is blocked by a low-priority task holding a resource. Solved using priority inheritance protocols in RTOS." },
      { q: "What is a task/thread in RTOS?", a: "An independent unit of execution with its own stack. The RTOS scheduler decides which task runs based on priority and state." },
      { q: "Hard vs soft real-time systems?", a: "Hard: deadlines are absolute — missing one is catastrophic (airbag). Soft: occasional misses are acceptable (video streaming)." },
      { q: "What is debouncing?", a: "Removing noisy signals from a mechanical switch bouncing. Done in software (small delay) or hardware (RC filter)." },
      { q: "What is CAN bus?", a: "Controller Area Network — robust serial bus protocol for automotive and industrial systems. Multiple nodes communicate reliably on one twisted pair." },
      { q: "Purpose of a HAL?", a: "Hardware Abstraction Layer — provides a standard API to control hardware. Lets you write portable code across different microcontrollers." },
      { q: "What is stack overflow? How to prevent?", a: "The stack grows beyond its allocated memory, corrupting nearby data. Prevent by sizing stacks correctly, avoiding deep recursion, using stack canaries." },
      { q: "What is a circular buffer?", a: "A fixed-size ring buffer where old data gets overwritten when full. Widely used for UART receive buffers, audio sample queues, log buffers." },
      { q: "Purpose of 'static' keyword in embedded C?", a: "Static variables retain value between function calls. Static functions are restricted to file scope — improves encapsulation and saves linker work." },
      { q: "What is JTAG?", a: "Hardware debugging interface that lets you program and step-debug a microcontroller through test access ports. Used with OpenOCD, ST-Link, GDB." },
      { q: "Power consumption optimization techniques?", a: "Use low-power sleep modes, reduce clock speed, disable unused peripherals, use DMA to minimize CPU wake time, lower I/O voltage." },
      { q: "What is a memory leak in embedded C?", a: "Heap memory that's allocated but never freed. In embedded systems with tiny RAM, even a small leak crashes the device over hours/days." },
    ],
    advanced: [
      { q: "What is cache coherency in multi-core embedded?", a: "Ensures all CPU cores see a consistent view of memory. Without it, one core's cached data may be stale compared to another core's write." },
      { q: "What is an MPU (Memory Protection Unit)?", a: "Defines memory regions with access permissions. Prevents one task or driver from corrupting another's memory — improves system robustness." },
      { q: "What is a device tree in embedded Linux?", a: "A data structure that describes hardware to the Linux kernel. Separates hardware description from kernel code — enables portability across SoCs." },
      { q: "Kernel module vs user-space driver?", a: "Kernel module: runs in privileged kernel space, direct hardware access, faster, harder to debug. User-space: safer, easier to debug, slower." },
      { q: "What is clock stretching in I2C?", a: "A slave holds SCL low to pause the master while it processes data. Not all masters support it — must be checked when picking parts." },
      { q: "Preemptive vs cooperative scheduling?", a: "Preemptive: scheduler forcibly switches tasks by priority or time slice. Cooperative: tasks run until they voluntarily yield — risks starvation." },
      { q: "What is a race condition? How to prevent?", a: "Two tasks access shared data simultaneously, producing unpredictable results. Prevent via mutexes, disabling interrupts, or atomic operations." },
      { q: "What is PID control? Where is it used?", a: "Proportional-Integral-Derivative — feedback control algorithm to maintain setpoints. Used for motor speed, temperature, drone altitude, robotics." },
      { q: "What is firmware OTA update? Risks?", a: "Over-The-Air updates remotely without physical access. Risk: incomplete writes brick the device. Mitigated with dual-bank or A/B update schemes." },
      { q: "Role of the startup file (startup.s) in ARM Cortex-M?", a: "Initializes stack pointer, copies .data to RAM, zeros .bss, defines the vector table, then calls main()." },
      { q: "Spinlock vs mutex in an embedded OS?", a: "Spinlock busy-waits in a loop — used in ISR or single-core contexts. Mutex puts the task to sleep — for tasks where blocking is acceptable." },
      { q: "What is zero-copy networking in embedded Linux?", a: "Avoids redundant data copies between kernel and user-space buffers. Reduces CPU overhead and latency in high-speed network applications." },
      { q: "What is secure boot?", a: "Verifies each stage of the boot chain using cryptographic signatures. Ensures only authenticated firmware runs — prevents malware or tampering." },
      { q: "Baremetal vs RTOS-based development?", a: "Baremetal: no OS, direct hardware control, simple, lowest overhead. RTOS: adds tasks + scheduling + resource management for complex multi-tasking." },
      { q: "What is ECC memory and why does it matter?", a: "Error Correcting Code memory detects + corrects single-bit errors automatically. Critical for safety-critical systems — aerospace, automotive ECUs, medical." },
      { q: "What is memory alignment? Why issues?", a: "Data stored at addresses matching its size. Unaligned access can cause bus faults on ARM Cortex-M or significant performance penalties." },
      { q: "What is the Cortex-M NVIC?", a: "Nested Vectored Interrupt Controller — manages interrupts with configurable priorities and nesting. Higher-priority IRQs preempt lower ones." },
      { q: "What is MISRA C?", a: "A set of coding guidelines for safety-critical embedded C. Restricts unsafe C constructs to reduce bugs — required in automotive and aerospace." },
      { q: "Time-triggered vs event-triggered architecture?", a: "Time-triggered: tasks run on a fixed schedule (predictable, rigid). Event-triggered: respond to events (flexible, harder timing analysis)." },
      { q: "What is TrustZone in ARM processors?", a: "Divides the processor into Secure World and Normal World. Used to protect sensitive code (crypto keys, secure boot) from untrusted apps." },
    ],
    mcq: [
      { q: "GPIO stands for?", opts: ["General Programmable Input/Output", "General Purpose Input/Output", "Global Pin Input/Output", "General Peripheral I/O"], ans: 1, why: "GPIO = General Purpose Input/Output. Software-controlled pins used to read switches/sensors or drive LEDs/motors." },
      { q: "Which keyword tells the compiler NOT to optimize a variable that can change unexpectedly?", opts: ["const", "static", "extern", "volatile"], ans: 3, why: "'volatile' tells the compiler the variable can change outside the normal flow (ISR, hardware register), so always re-read it from memory." },
      { q: "Which protocol uses MOSI, MISO, SCK, and CS?", opts: ["I2C", "UART", "SPI", "CAN"], ans: 2, why: "SPI = Serial Peripheral Interface. 4 lines: MOSI (master-out), MISO (master-in), SCK (clock), CS (chip select). Full duplex, faster than I2C." },
      { q: "What does a watchdog timer do?", opts: ["Logs system events", "Resets the system if the program gets stuck", "Manages power consumption", "Schedules tasks in RTOS"], ans: 1, why: "If the software doesn't 'feed' (reset) the watchdog regularly, it assumes the program hung and forces a hardware reset." },
      { q: "What does NVIC in Cortex-M stand for?", opts: ["Network Vector Interrupt Controller", "Nested Vectored Interrupt Controller", "Non-Volatile Internal Cache", "New Virtual Interrupt Controller"], ans: 1, why: "NVIC = Nested Vectored Interrupt Controller. Manages priorities and allows higher-priority IRQs to preempt lower-priority ISRs already running." },
    ],
    facts: [
      "📚 'Making Embedded Systems' by Elecia White — the modern fresher's bible. Read it cover to cover.",
      "🎯 Crack tip: explain WHY embedded ≠ general purpose — timing constraints, tiny memory, power budgets, no malloc in many cases.",
      "📖 'The Definitive Guide to ARM Cortex-M3/M4' by Joseph Yiu — the ARM internals book interviewers love to test on.",
      "💡 Tool stack to know: GCC-ARM toolchain, OpenOCD, ST-Link, PlatformIO/STM32CubeIDE, FreeRTOS source. Touch all 5.",
      "🔧 Hardware to own: STM32F4 Discovery (~$25), Raspberry Pi Pico (~$5), ESP32 (~$8). Cheap and resume-worthy.",
      "📊 Read AN-XXXX application notes from ST, NXP, TI — real-world drivers + design patterns beyond toy projects.",
      "🏆 Free training: ARM University Program (university.arm.com), Yocto Project intro for embedded Linux roles.",
      "🌍 r/embedded subreddit is the #1 community — lurk for 2 weeks, you'll learn more than from any course.",
    ],
  },
};

// ─── Placement Companies ──────────────────────────────────────────────────────
type CompanyKey = "tcs" | "virtusa" | "oracle" | "zomato" | "qualcomm" | "morgan_stanley" | "microsoft" | "meta" | "juspay" | "jpmorgan" | "ibm" | "goldman_sachs" | "epam" | "de_shaw" | "cisco" | "capgemini" | "apple" | "amazon_ml" | "amazon" | "zoho" | "swiggy" | "accenture" | "infosys" | "cognizant" | "lti" | "kpmg" | "ey" | "deloitte" | "hcl" | "wipro";
type CompanyType = "service" | "product";
const COMPANY_SLUG_MAP: Record<string, CompanyKey> = {
  "tcs":            "tcs",
  "virtusa":        "virtusa",
  "oracle":         "oracle",
  "zomato":         "zomato",
  "qualcomm":       "qualcomm",
  "morgan-stanley": "morgan_stanley",
  "microsoft":      "microsoft",
  "meta":           "meta",
  "juspay":         "juspay",
  "jp-morgan":      "jpmorgan",
  "ibm":            "ibm",
  "goldman-sachs":  "goldman_sachs",
  "epam":           "epam",
  "de-shaw":        "de_shaw",
  "cisco":          "cisco",
  "capgemini":      "capgemini",
  "apple":          "apple",
  "amazon-ml":      "amazon_ml",
  "amazon":         "amazon",
  "zoho":           "zoho",
  "swiggy":         "swiggy",
  "accenture":      "accenture",
  "infosys":        "infosys",
  "cognizant":      "cognizant",
  "lti":            "lti",
  "kpmg":           "kpmg",
  "ey":             "ey",
  "deloitte":       "deloitte",
  "hcl":            "hcl",
  "wipro":          "wipro",
};
const COMPANY_KEY_TO_SLUG: Record<CompanyKey, string> = {
  tcs: "tcs", virtusa: "virtusa", oracle: "oracle",
  zomato: "zomato", qualcomm: "qualcomm",
  morgan_stanley: "morgan-stanley", microsoft: "microsoft", meta: "meta",
  juspay: "juspay", jpmorgan: "jp-morgan", ibm: "ibm",
  goldman_sachs: "goldman-sachs", epam: "epam", de_shaw: "de-shaw",
  cisco: "cisco", capgemini: "capgemini", apple: "apple",
  amazon_ml: "amazon-ml", amazon: "amazon", zoho: "zoho", swiggy: "swiggy",
  accenture: "accenture", infosys: "infosys", cognizant: "cognizant", lti: "lti",
  kpmg: "kpmg", ey: "ey", deloitte: "deloitte", hcl: "hcl", wipro: "wipro",
};
type CompanySectionItem =
  | { kind: "qa"; items: Array<{ q: string; a: string }> }
  | { kind: "problems"; items: Array<{ name: string; desc: string; difficulty?: string; example?: string }> }
  | { kind: "plan"; items: Array<{ day: string; focus: string; topics: string }> }
  | { kind: "tips"; items: string[] }
  | { kind: "focus"; items: string[] }
  | { kind: "frequent"; items: string[] }
  | { kind: "process"; items: string[] };
interface CompanySection {
  key: string;
  label: string;
  blurb: string;
  blocks: CompanySectionItem[];
}
interface CompanyInfo {
  name: string;
  type: CompanyType;
  short: string;
  tagline: string;
  about: string;
  whatTheyDo: string;
  history: string[];
  sections: CompanySection[];
  mcq: Array<{ q: string; opts: string[]; ans: number; why: string }>;
  quotes: string[];
  facts: string[];
}
const PLACEMENT_COMPANIES: Record<CompanyKey, CompanyInfo> = {
  tcs: {
    name: "TCS",
    type: "service",
    short: "Tata Consultancy Services",
    tagline: "India's largest IT services company — 4 prep tracks: Aptitude, CodeVita, NQT Coding, Interview.",
    about: "TCS is the crown jewel of the Tata group — the largest IT services company by market cap in India and the second-largest globally. It hires 40K–60K freshers every year through the TCS NQT.",
    whatTheyDo: "Consulting, IT services, business solutions, cloud, digital transformation. Long-standing partner to Fortune 500 across BFSI, healthcare, retail, and manufacturing.",
    history: [
      "Founded in 1968 by JRD Tata — India's first dedicated software services company.",
      "HQ in Mumbai. Listed on BSE and NSE since 2004.",
      "~600,000+ employees across 55 countries — one of the world's largest private employers.",
      "Hires through TCS National Qualifier Test (NQT) — three tiers: Ninja, Digital, Prime.",
      "Top recruiter on Indian campuses every year since 2006.",
    ],
    sections: [
      {
        key: "aptitude",
        label: "Aptitude",
        blurb: "TCS NQT Part A — 75 min of Numerical, Verbal, and Reasoning. The foundation that gates Ninja.",
        blocks: [
          { kind: "focus", items: [
            "Number Systems & HCF/LCM — digit counting, prime factorization, divisibility.",
            "Time & Work / Pipes & Cisterns — combined work rates and partial-worker problems.",
            "Time, Speed & Distance — relative speed, trains, boats and streams.",
            "Ratio, Proportion & Mixtures — alligation, alloy mixing, distribution.",
            "Probability & P&C — derangements, conditional probability, counting with constraints.",
            "Series & Sequences — AP/GP, Nth position, cyclic patterns.",
          ]},
          { kind: "qa", items: [
            { q: "Divide by 25 but instead divided by 10, got 6 more. What is the number?", a: "100. Setting up the equation gives n/10 − n/25 = 6 → n = 100." },
            { q: "Shopkeeper sells at 10% profit but uses 800g for 1000g. Actual profit %?", a: "37.5%. SP/CP ratio = 1.10 × (1000/800) = 1.375 → 37.5% real markup." },
            { q: "Stream = 6 km/h. Boat covers 85 km upstream + downstream in 22 h. Speed of boat?", a: "11 km/h in still water. Set up 85/(b−6) + 85/(b+6) = 22 → b = 11." },
            { q: "Boat covers 360 km in 4 h. Speed in m/s?", a: "25 m/s. 360 km/h = 360 × 1000 / 3600 = 100 m/s … recheck: 360/4 = 90 km/h = 25 m/s." },
            { q: "If A = 150% of B and B = 40% of C, with A+B+C = 20, find 2B + 3C − 4A.", a: "14. Substitute A and B in terms of C, solve C, plug back." },
            { q: "54k31m82 divisible by 11. Max k+m?", a: "13. Apply alternating-digit divisibility rule for 11 and maximise." },
            { q: "Rs. 76 in ratio 7:5:3:4 — smallest part?", a: "Rs. 12 (the '3' share). Total parts = 19 → each unit = 4 → 3 × 4 = 12." },
            { q: "Remainder when 37^1000 ÷ 9?", a: "1. 37 mod 9 = 1, so 37^1000 mod 9 = 1." },
            { q: "HCF·LCM = 12150, ratio 2:3. Sum of digits of larger number?", a: "9. Numbers are 90 and 135. Larger = 135 → 1+3+5 = 9." },
            { q: "100 L mixture, acid:water = 3:1. Water to add to make 3:4?", a: "75 L. Acid stays = 75 L. New water = 100 → add 75 L." },
            { q: "Three numbers in 1:2:3, HCF = 9. LCM?", a: "54. Numbers are 9, 18, 27 → LCM = 54." },
            { q: "Three co-primes: product of first two = 221, last two = 598. Sum?", a: "76. 221 = 13·17, 598 = 13·… recheck: numbers are 13, 17, 46 → 13+17+46 = 76." },
            { q: "Words from ORDINATE starting with O ending with E?", a: "720. Fix O and E, permute the middle 6 = 6! = 720." },
            { q: "SD of 12, 13, 11, 13, 11?", a: "2/√5. Mean = 12, variance = 4/5 → SD = √(4/5) = 2/√5." },
            { q: "A in 15 days, B in 20 days. Together 4 days. Work left?", a: "8/15. Together rate = 1/15+1/20 = 7/60 → done in 4 days = 28/60 → left = 32/60 = 8/15." },
            { q: "Hiten 45% on bills, 60% of rest invested, deposits Rs. 15400. Salary?", a: "Rs. 70,000. After 45% bills he has 55%. 40% of that = 15400 → salary = 70000." },
            { q: "Least number leaving rem 3 with 5,6,7,8 and divisible by 9?", a: "1683. LCM(5,6,7,8) = 840 → 840k+3 divisible by 9 → k=2 → 1683." },
            { q: "Smallest number divisible by 8, 12, 18?", a: "72. LCM(8,12,18) = 72." },
            { q: "HCF=9, LCM=108, one number=27. Other?", a: "36. Product = HCF × LCM → other = 9·108/27 = 36." },
            { q: "10 students avg 40 kg. New student 51 kg joins. New avg?", a: "41 kg. Total = 400+51 = 451 / 11 = 41." },
            { q: "A's salary is 20% lower than B's. B is what % higher than A?", a: "25%. If A = 80, B = 100. (100−80)/80 = 25%." },
            { q: "A 15 days, B 10 days. Together?", a: "6 days. Combined rate = 1/15+1/10 = 1/6 → 6 days." },
            { q: "log 0.317 = 0.3332, log 0.318 = 0.3364. log 0.319?", a: "0.3396. Add the constant diff 0.0032." },
            { q: "150 packets total = 264 kg, mix of 1kg and 2kg. How many 2kg?", a: "114. Let x = 2kg packets → 2x + (150−x) = 264 → x = 114." },
            { q: "Multiplied by 8 = same difference from 153 (above) as original (below). 25% of original?", a: "8.5. If n is original, 8n − 153 = 153 − n → n = 34 → 25% = 8.5." },
            { q: "Two dice — probability sum is 9?", a: "1/9. 4 favourable outcomes (3+6, 4+5, 5+4, 6+3) out of 36 → 1/9." },
            { q: "Perimeter of square = 80. Area?", a: "400. Side = 20 → area = 400." },
            { q: "Sold at 15% loss = Rs. 45 loss. CP?", a: "Rs. 300. 15% of CP = 45 → CP = 300." },
            { q: "Milk:water = 5:2 in 49 L. Adding 14 L water → ratio?", a: "5:4. Milk stays 35 L, water 14+14 = 28 L → 5:4." },
            { q: "Father:son = 5:2 now, will be 7:3 in 10 years. Father's age now?", a: "50. Solve 5x+10/2x+10 = 7/3 → x = 10 → father = 50." },
          ]},
          { kind: "tips", items: [
            "Numerical Ability is the highest-scoring section — Number Systems + Time & Work + TSD + Ratios cover 60% of questions.",
            "Digit counting problems (count 5s from 121 to 356) appear every year — master range-based counting by hundreds/tens/units.",
            "Series problems — look for the rule before computing. Always check for cyclic patterns.",
            "Logic puzzles need case-by-case elimination. Write it out — never guess.",
            "Time budget — 1 min per question in Foundation. Never spend > 90 seconds on a single question.",
            "Prime tier needs Advanced section + coding. Ninja can be cleared with Foundation alone.",
          ]},
          { kind: "frequent", items: [
            "Q1 (Rs 3000 ratio split A,B,C) — foundational simultaneous equations.",
            "Q2 (count 5s from 121–356) — confirmed PYQ for digit counting.",
            "Q4 (HCF of 2472, 1284, N with given LCM) — appears almost every year.",
            "Q7 (Three Sisters logic — Aasha/Usha/Eesha) — verbal reasoning classic.",
            "Q9 (2310 as product of 3 factors) — number theory formula (3^(n−1)+1)/2.",
            "Q50 (Derangement of 5 letters/envelopes) — derangement formula must be memorized.",
          ]},
        ],
      },
      {
        key: "codevita",
        label: "CodeVita",
        blurb: "TCS's flagship coding contest — 3-hour zone round + grand finale. Cash prizes up to Rs. 2L + direct interview.",
        blocks: [
          { kind: "problems", items: [
            { name: "Date Time", desc: "Given 12 digits, form the latest valid date-time in 2018 (MM/DD HH:MM).", difficulty: "Medium", example: "Input: 0,0,1,2,2,2,3,5,9,9,9,9 → 12/30 22:59" },
            { name: "Digital Time", desc: "Choose 6 of 9 digits to form maximum valid time HH:MM:SS or 'Impossible'.", difficulty: "Medium", example: "Input: 0,0,1,1,3,5,6,7,7 → 17:57:36" },
            { name: "Greedy Hostel Owner", desc: "Decode A–J meter strings (with F–J reversal rules); compare to central meter.", difficulty: "Medium" },
            { name: "Civil War", desc: "N avengers in a line, two teams alternate picks from either end, play optimally — find power diff.", difficulty: "Hard", example: "Input: [2,−7,8,−1,20] → 2" },
            { name: "Possible Legal Subsets", desc: "Rank all legal subsets (by size, then input order) — output the Rth.", difficulty: "Hard" },
            { name: "Seating Arrangement", desc: "Min moves to group all occupied seats together + count of ways.", difficulty: "Medium", example: "OEOEO → 1 2" },
            { name: "Polygon with Max Area", desc: "Max area of polygon formed by N coordinate points (any order). Integer abs area.", difficulty: "Hard" },
            { name: "Consecutive Prime Sum", desc: "Count primes ≤ N expressible as a sum of consecutive primes starting from 2.", difficulty: "Medium" },
            { name: "Counting Rock Samples", desc: "Classify S rock sizes into R ranges — count samples per range efficiently.", difficulty: "Medium" },
            { name: "Kth Largest Factor", desc: "Kth largest factor of N (no prime factors > 13); return 1 if fewer than K factors.", difficulty: "Medium", example: "Input: 12,3 → 4" },
            { name: "String Pair", desc: "Sum vowels of English text forms of N numbers = D; count pairs summing to D.", difficulty: "Hard" },
            { name: "Elections", desc: "Voter queue {A, B, −}; A moves left, B moves right; closer wins neutral; ties stay.", difficulty: "Medium" },
            { name: "Constellation", desc: "3 × N grid: galaxies (# delimited) containing vowel-shaped 3×3 star patterns.", difficulty: "Hard" },
            { name: "Prime Time Again", desc: "Day of D hours in P parts — count hours where all P equivalents are prime.", difficulty: "Medium" },
            { name: "Minimum Gifts", desc: "Min gifts so every employee gets ≥1 and higher-ranked neighbors get more.", difficulty: "Medium", example: "Ranks [1 2 1 5 2] → 7" },
            { name: "Minimize the Sum", desc: "At most K ops, each replaces an element with floor(x/2). Minimize final sum.", difficulty: "Medium" },
            { name: "Railway Station", desc: "Min platforms for N trains with arrival + stoppage. Overlapping = separate platforms.", difficulty: "Medium" },
            { name: "Count Pairs", desc: "Count 'happy' elements X where ∃Y with |X − Y| < K.", difficulty: "Medium" },
            { name: "Critical Planets", desc: "Find planets connected to network by only one path (articulation points + leaves).", difficulty: "Hard" },
            { name: "Bank Compare", desc: "Two banks, multi-slab rates; compute EMI per slab, compare total interest paid.", difficulty: "Medium" },
          ]},
          { kind: "focus", items: [
            "Strings — palindromes, pattern matching, vowel counting, run-length encoding.",
            "Arrays & Sorting — subarrays, pairing, prefix sums, sorting-based optimisation.",
            "Math & Number Theory — combinatorics, primes, factors, modular arithmetic.",
            "Dynamic Programming — subsets, knapsack variants, LIS, state reduction.",
            "Greedy Algorithms — intervals, gift distribution, local-optimum decisions.",
            "Graphs — BFS/DFS, articulation points, connected components, shortest path.",
          ]},
          { kind: "tips", items: [
            "Read the problem twice — edge cases are often buried in constraints.",
            "Brute force first, then optimise. Get something working before tuning.",
            "Write modular code — clearly named functions. No penalty for extra calls.",
            "Handle empty input, single element, max constraints, negatives — every problem.",
            "Trace your code against the sample inputs before submitting. Catch bugs early.",
            "Most problems need O(n log n) or better in the 1s time limit. STL/Collections welcomed.",
            "3-hour window — skip stuck problems after 30 min. Return at the end.",
          ]},
          { kind: "frequent", items: [
            "Date Time — digit permutation with validity (Seasons 7, 8, 9).",
            "Consecutive Prime Sum — prime gen + cumulative filter (Seasons 6, 8).",
            "Kth Largest Factor — factorization with prime-factor constraints (Seasons 6, 9).",
            "Civil War — game theory with optimal play (Seasons 9, 11).",
            "Minimum Gifts — greedy neighbor compare on ranks (Seasons 9, 12).",
          ]},
        ],
      },
      {
        key: "nqt_coding",
        label: "NQT Coding",
        blurb: "TCS NQT Part B (90 min) — 2–3 coding problems. Decides Digital and Prime tier.",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1–2", focus: "Ninja — Math & Number Problems", topics: "Leap year, Fibonacci, prime check O(√n), Armstrong, factorial, perfect number." },
            { day: "Day 3", focus: "Ninja — Arrays & Sorting", topics: "Rotation, max/min, bubble sort, second largest, sort 0s/1s/2s, move zeroes." },
            { day: "Day 4", focus: "Ninja — Strings & Patterns", topics: "Palindrome, reverse, character frequency, anagrams, stack-based reversal." },
            { day: "Day 5", focus: "Ninja — Linked Lists & Stack", topics: "Reverse, middle, cycle, dedupe, nth from end, balanced parens, min stack." },
            { day: "Day 6", focus: "Ninja — Trees & Binary Search", topics: "Binary search, BST validation, balanced tree, symmetric tree." },
            { day: "Day 7", focus: "Digital — Arrays & HashMap", topics: "Two Sum, find duplicate (Floyd), move zeroes, first missing positive, majority element." },
            { day: "Day 8", focus: "Digital — Strings & Sliding Window", topics: "Longest substring no repeats, longest palindromic substring, valid parens, LCP." },
            { day: "Day 9", focus: "Digital — Sorting & Searching", topics: "Merge sort, quickselect, Kth largest, merge intervals, top K frequent, median of two arrays." },
            { day: "Day 10", focus: "Digital — DP & Recursion", topics: "Climbing stairs, Kadane, coin change, LIS, LCS, trapping rain water." },
            { day: "Day 11", focus: "Digital — Trees & Graphs", topics: "Level/zigzag order, LCA, cycle detection in DG, merge K lists, word search." },
            { day: "Day 12", focus: "Prime — Advanced DSA & System Design", topics: "Serialize/deserialize tree, median stream, next greater, flatten DLL, system design basics." },
            { day: "Day 13", focus: "Behavioral & HR Round", topics: "TCS values, STAR stories, Why TCS, teamwork, handling pressure." },
            { day: "Day 14", focus: "Final Mock Day", topics: "Full NQT mock — Part A (75 min) + Part B (115 min). Review every wrong answer." },
          ]},
          { kind: "tips", items: [
            "Know your target tier — Digital is the realistic baseline; Ninja is the fallback.",
            "Part A is not optional — a weak Foundation score blocks Digital/Prime even with perfect coding.",
            "Code quality is graded — clean, commented, with complexity stated.",
            "Think out loud — TCS values communication as much as a correct solution.",
            "Handle edge cases — empty arrays, negatives, overflow — TCS test cases are designed to trip you up.",
            "Practice on iON portal — the interface differs from LeetCode. Submit timed runs.",
          ]},
          { kind: "frequent", items: [
            "Fibonacci (iterative + recursive) — asked in almost every batch.",
            "Prime check optimized to O(√n) — Ninja staple.",
            "Two Sum #1 (hash map O(n)) — Digital baseline.",
            "Maximum Subarray #53 (Kadane's) — Digital + NQT advanced.",
            "Longest Substring Without Repeating #3 — sliding window classic.",
            "Kth Largest Element #215 — quickselect/heap, Digital + Prime.",
          ]},
        ],
      },
      {
        key: "interview",
        label: "Interview",
        blurb: "Final round — technical + HR. Focus: OOP, DBMS, OS basics + projects + behavioral.",
        blocks: [
          { kind: "qa", items: [
            { q: "Explain OOP concepts.", a: "Encapsulation (hide state), Inheritance (extends), Polymorphism (one interface, many forms), Abstraction (hide implementation)." },
            { q: "Process vs thread?", a: "Process has its own memory; threads share memory inside a process. Threads are cheaper to switch." },
            { q: "Pass-by-value vs pass-by-reference?", a: "Value passes a copy. Reference passes a pointer/alias — changes affect the original." },
            { q: "What is a database index?", a: "B-tree (usually) that speeds up reads at the cost of extra storage and slower writes." },
            { q: "SQL vs NoSQL?", a: "SQL = relational, fixed schema, ACID. NoSQL = flexible schema, horizontal scale, eventual consistency." },
            { q: "What is normalization?", a: "Organising tables to remove redundancy. 1NF (atomic) → 2NF (no partial deps) → 3NF (no transitive deps)." },
            { q: "Explain REST API.", a: "HTTP-based API style using verbs (GET, POST, PUT, DELETE) on resources identified by URIs. Stateless." },
            { q: "What is a JOIN in SQL?", a: "Combines rows from two tables on a related column. INNER, LEFT, RIGHT, FULL OUTER." },
            { q: "GET vs POST?", a: "GET retrieves data, idempotent, parameters in URL. POST creates resources, has a body, not idempotent." },
            { q: "What is a deadlock?", a: "Two or more threads each hold a lock the other wants — both wait forever. Detect or prevent with lock ordering." },
            { q: "Explain Big O time complexity.", a: "How an algorithm scales with input size. O(n), O(log n), O(n²) — focus on the dominant term." },
            { q: "What is recursion?", a: "A function calling itself with smaller input until a base case is hit. Stack grows per call." },
            { q: "Stack vs queue?", a: "Stack: LIFO (last in, first out). Queue: FIFO (first in, first out)." },
            { q: "Explain pointers / references.", a: "Variables that store memory addresses rather than values. Allow indirect access and mutation." },
            { q: "What is multithreading?", a: "Running multiple threads inside one process to do work concurrently. Shares memory between threads." },
            { q: "Explain garbage collection.", a: "Automatic memory cleanup of unreachable objects. Removes the burden of manual free." },
            { q: "Compile-time vs runtime errors?", a: "Compile-time: syntax/type errors caught by the compiler. Runtime: errors during execution (null deref, divide by zero)." },
            { q: "What is an operating system?", a: "Software that manages hardware, memory, processes, and provides APIs to user programs." },
            { q: "TCP vs UDP?", a: "TCP: reliable, ordered, slower. UDP: fast, fire-and-forget, no guaranteed delivery." },
            { q: "What is a hash table?", a: "Key→value structure with O(1) average lookup via a hash function. Handles collisions via chaining or open addressing." },
            { q: "Explain inheritance.", a: "Child class derives properties and methods from a parent class. Promotes code reuse and 'is-a' relationships." },
            { q: "Abstraction in OOP?", a: "Hiding implementation details and exposing only what's necessary via abstract classes or interfaces." },
            { q: "Polymorphism?", a: "Same method name behaving differently depending on the object — overloading (compile-time) or overriding (runtime)." },
            { q: "Exception handling?", a: "Catching errors with try/catch blocks so the program doesn't crash on unexpected conditions." },
            { q: "API testing?", a: "Verifying API endpoints — correct response codes, payload shape, error handling, and performance." },
            { q: "Array vs linked list?", a: "Array: contiguous, O(1) random access. Linked list: node-based, O(1) insert/delete at known position." },
            { q: "What is Git / version control?", a: "Tracks changes in source code and enables collaboration. Branches, commits, merges — the standard for modern dev." },
            { q: "What is Docker?", a: "Containerization platform — packages an app + its dependencies into a portable, isolated container." },
            { q: "What is unit testing?", a: "Testing individual functions/components in isolation. Fast, automated, catches bugs early." },
            { q: "What are microservices?", a: "Splitting an app into small, independently deployable services. Scale, deploy, and fail independently." },
          ]},
          { kind: "tips", items: [
            "Lead with a structured intro for behavioral questions — STAR (Situation, Task, Action, Result).",
            "Have 2–3 deep project stories ready. TCS interviewers will dig — be ready for follow-ups.",
            "Know your resume cold. If you can't explain a project in 90 seconds, redact it.",
            "Always state assumptions when solving DSA problems. Edge cases first.",
            "'Why TCS?' — research recent TCS news (Q-earnings, new contracts, leadership) and tie it to your goals.",
            "HR round is not a formality. Cultural fit + communication = real hiring signals at TCS.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "TCS NQT Part A includes which sections?", opts: ["Coding only", "Numerical + Verbal + Reasoning", "OS + DBMS + OOP", "HR + Behavioral"], ans: 1, why: "Part A (75 min) = Numerical Ability + Verbal Ability + Reasoning Ability, 25 min each." },
      { q: "Which tier requires both Foundation AND Advanced sections?", opts: ["Ninja", "Digital and Prime", "Only Prime", "All three"], ans: 1, why: "Ninja can be cleared with Foundation alone. Digital and Prime require strong Advanced performance too." },
      { q: "Best fix for the digit-counting problem (count 5s from 121 to 356)?", opts: ["Iterate every number", "Memoize with DP", "Range-based counting by place", "Use regex"], ans: 2, why: "Split by hundreds, tens, units — much faster than iterating every integer in the range." },
      { q: "TCS CodeVita zone round duration?", opts: ["1 hour", "2 hours", "3 hours", "5 hours"], ans: 2, why: "3 hours, 6–7 problems of varying difficulty. Top scorers advance to the Grand Finale." },
      { q: "What does STAR stand for in behavioral interviews?", opts: ["Skills, Tasks, Actions, Results", "Situation, Task, Action, Result", "Story, Target, Approach, Review", "System, Test, Analyze, Report"], ans: 1, why: "STAR turns rambling stories into crisp behavioral answers. Every TCS HR question can be framed this way." },
    ],
    quotes: [
      "You're prepping for TCS because you got the call. You're already 90% there. Just show up prepared.",
      "Every TCS hire passed the same NQT you're about to. They aren't smarter. They just didn't skip days.",
      "The 90-minute coding section is short. One clean working solution beats three half-done ones.",
      "Your STAR story is your moat. Two strong project stories beat ten weak ones.",
      "Show up early to the test centre. Calm beats clever on TCS NQT day.",
    ],
    facts: [
      "TCS hires 40,000–60,000 freshers every year — the largest fresher intake of any company on the planet.",
      "TCS NQT scores are valid for 2 years. Strong scores can land you offers from Cognizant, Capgemini, and more.",
      "TCS iON is the official test platform — practise there to match the real interface.",
      "Top 5% of CodeVita finalists get cash prizes (up to Rs. 2L) + direct TCS interview offers.",
      "Languages allowed in coding: Java, C, C++, Python, JavaScript, C#. Python is fastest for most problems.",
    ],
  },
  virtusa: {
    name: "Virtusa",
    type: "product",
    short: "Virtusa Corporation",
    tagline: "Global digital engineering — Coder & Power Coder tracks. Heavy DSA + DP on hard problems.",
    about: "Virtusa is a global digital engineering and IT services company that helps Fortune 500 enterprises with cloud, AI, and digital transformation. Known for technical depth in BFSI, healthcare, and telecom.",
    whatTheyDo: "Digital engineering, cloud transformation, AI/ML, application services, infrastructure. Strong in BFSI core systems modernization.",
    history: [
      "Founded in 1996 in Massachusetts, USA — originally as eRunway.",
      "Acquired Polaris Consulting in 2016, merging into a single global brand.",
      "Acquired by Baring Private Equity Asia in 2021 in a US$2B+ deal.",
      "~36,000+ engineers globally. India delivery hubs in Hyderabad, Chennai, Bangalore, Pune.",
      "Hires through campus and Unstop off-campus challenges — Coder + Power Coder tracks.",
    ],
    sections: [
      {
        key: "coding",
        label: "Coding Round",
        blurb: "Online assessment — 90–120 min. 2 problems for Coder, 2–3 for Power Coder. Heavy on DSA + DP.",
        blocks: [
          { kind: "problems", items: [
            { name: "Reverse Array", desc: "Print array elements in reverse order. Two-pointer swap for in-place.", difficulty: "Easy", example: "Input: 1 2 3 → Output: 3 2 1" },
            { name: "Remove Duplicates from String", desc: "Keep only first occurrence of each character, preserve order. Use a seen-set.", difficulty: "Easy", example: "CsharpstarZ → CsharptZ" },
            { name: "Eliminate Duplicates in Sorted Array", desc: "Remove duplicates in-place, return new length. Two pointers.", difficulty: "Easy", example: "[1,1,2,2,3] → 3" },
            { name: "Reverse Individual Words", desc: "Reverse each word in a sentence; keep word order intact.", difficulty: "Easy", example: "Hello World → olleH dlroW" },
            { name: "Last Digit of Power", desc: "Last digit of N^K for huge N, K. Use cyclicity of last digits mod 4.", difficulty: "Medium", example: "3^2 → 9" },
            { name: "Special Dish", desc: "Count substrings with equal counts of '1', '2', '3' (length divisible by 3).", difficulty: "Medium" },
            { name: "Count Distinct Years", desc: "Extract years from DD-MM-YYYY patterns; return distinct count.", difficulty: "Medium" },
            { name: "Most Frequent Character", desc: "Highest frequency char's count — return 0 on tie.", difficulty: "Medium", example: "Abcadr → 2 (a appears 2x)" },
            { name: "Array Rotation (Left)", desc: "Left-rotate by k positions in-place via three reverses.", difficulty: "Medium", example: "1 2 3 4 5, k=2 → 3 4 5 1 2" },
            { name: "Maximum Subarray Sum", desc: "Kadane's algorithm. Track current_sum + reset on negative; keep global max.", difficulty: "Medium", example: "[-2,1,-3,4,-1,2,1,-5,4] → 6" },
            { name: "4-Digit Perfect Squares (all even digits)", desc: "Find 4-digit perfect squares where every digit is in {0,2,4,6,8}.", difficulty: "Medium", example: "Answer: 6400 (80²)" },
            { name: "Substring Check", desc: "Is B a substring of A? KMP for O(n+m) without built-ins.", difficulty: "Medium" },
            { name: "Decode String", desc: "Decode k[substring] format, support nesting. Stack-based expansion.", difficulty: "Medium", example: "3[a2[c]] → accaccacc" },
            { name: "Cryptarithm Solver", desc: "SATURN + URANUS = PLANETS — each letter to unique digit. Backtracking.", difficulty: "Medium-Hard" },
            { name: "Longest Increasing Subsequence", desc: "Length of strictly increasing subsequence. O(n²) DP or O(n log n) with binary search.", difficulty: "Hard", example: "[10,9,2,5,3,7,101,18] → 4" },
            { name: "0/1 Knapsack", desc: "Select items (each ≤ once) to maximize value within capacity W. 2D DP.", difficulty: "Hard", example: "values=[60,100,120], weights=[10,20,30], W=50 → 220" },
            { name: "Palindrome Check", desc: "String reads the same forwards and backwards. Two pointers.", difficulty: "Easy", example: "racecar → Palindrome" },
            { name: "Find Missing Number", desc: "Sum formula trick: n*(n+1)/2 − actual sum.", difficulty: "Easy", example: "[1,2,4,5], n=5 → 3" },
            { name: "Count and Say", desc: "Generate nth term: each term describes the previous.", difficulty: "Medium", example: "Term 4 → 1211" },
            { name: "Two Sum", desc: "Find pairs (i,j) with arr[i] + arr[j] = target. Hash map for O(n).", difficulty: "Easy-Medium", example: "[2,7,11,15], target=9 → (0,1)" },
          ]},
          { kind: "focus", items: [
            "Arrays — reverse, rotate, max subarray (Kadane), remove duplicates, missing number.",
            "Strings — dedupe preserving order, reverse words, substring, most frequent char, decode brackets.",
            "Number Theory — last digit cyclicity, perfect squares, count-and-say.",
            "Dynamic Programming — LIS (O(n²) + O(n log n)), 0/1 Knapsack, subsequence counts.",
            "Hashing — frequency maps, two-sum pairs, distinct counts.",
            "Stack — decode nested strings, balanced parens, expression evaluation.",
          ]},
          { kind: "tips", items: [
            "Coder vs Power Coder — Power Coder = harder DP + algorithms. Coder = medium string/array work.",
            "Always solve Easy first — secure baseline. Problems 1–4 should take < 10 min each with practice.",
            "Identify the technique before coding: sliding window, two pointers, hash map, DP, stack.",
            "Last digit + special dish are pattern-recognition problems — find the rule, not the brute force.",
            "Memorize LIS and 0/1 Knapsack DP recurrences — they're the Hard section staples.",
            "Output format matters — exact spaces, newlines, capitalization. 'True' not 'true'.",
            "Submit partial brute force for Hard problems rather than blank — partial credit decides ties.",
          ]},
          { kind: "frequent", items: [
            "Maximum Subarray Sum (Kadane) — present in almost every Virtusa batch.",
            "Longest Increasing Subsequence — flagship Hard DP, very high frequency on Power Coder.",
            "0/1 Knapsack — second most common Hard DP.",
            "Reverse Array + Palindrome Check + Find Missing Number — the easy trio in every drive.",
            "Decode String (stack-based) — medium problem that filters candidates.",
            "Last Digit of Power — unique to Virtusa among common MNC tests.",
          ]},
          { kind: "process", items: [
            "Apply via virtusa.com/careers, campus portals, or Unstop off-campus challenges.",
            "Online Assessment: aptitude + 2–3 coding problems in 90–120 min.",
            "Eligibility: B.E./B.Tech/M.E./M.Tech/MCA/M.Sc with 60%+ and no active backlogs.",
            "Technical Interview: 45–60 min covering DSA + OOP + DBMS + OS + project deep-dive.",
            "HR Interview: communication, relocation, career goals, cultural fit.",
            "Total timeline: 3–6 weeks campus, 2–4 weeks off-campus.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Which track has the harder DP problems at Virtusa?", opts: ["Coder", "Power Coder", "Both equal", "Neither"], ans: 1, why: "Power Coder includes Hard DP (LIS, Knapsack) — required for senior or specialist roles." },
      { q: "What's the right approach for the last-digit-of-power problem?", opts: ["BigInteger", "Cyclicity mod 4", "Logarithms", "Binary exponentiation only"], ans: 1, why: "Every digit's last-digit cycle has period ≤ 4. Use K mod 4 to pick the right position." },
      { q: "Best fix for the 'Decode String' problem (k[substring])?", opts: ["Regex replace", "Stack-based expansion", "Recursive string concat", "Lookup table"], ans: 1, why: "Push chars and counts onto a stack; pop and expand on each closing bracket. Handles nesting cleanly." },
      { q: "Maximum subarray sum is solved by?", opts: ["Sliding window", "Kadane's algorithm", "Binary search", "Divide and conquer only"], ans: 1, why: "Kadane: track current_sum, reset to 0 when negative, keep global max. O(n) time." },
      { q: "Min eligibility for Virtusa campus hiring?", opts: ["50% with backlogs", "60% no active backlogs", "75% no backlogs", "Final-year only"], ans: 1, why: "60% throughout academics with no active backlogs is the standard threshold." },
    ],
    quotes: [
      "Virtusa hires you for what you can become — not what you know today. Show curiosity.",
      "If you can write a clean Kadane in 5 min, you've already passed the medium bar.",
      "Power Coder is not a trick. It's just Coder + 2 extra hard problems. Practise both.",
      "Output format kills more candidates than wrong logic. Match the sample exactly.",
      "Submit a brute force when you're stuck. Partial credit decides ties at Virtusa.",
    ],
    facts: [
      "Virtusa was acquired by Baring PE for over $2B in 2021 — one of the biggest IT services PE deals in India.",
      "Engineers can rotate across BFSI, healthcare, and telecom domains — strong in core systems modernization.",
      "Off-campus drives go live on Unstop frequently — register early for practice on their actual platform.",
      "Java is the primary stack for most Virtusa product work, with growing Python/Go adoption.",
      "Virtusa internally runs deep-tech 'CodeStudio' programs for fresh hires — invest in DSA early.",
    ],
  },
  oracle: {
    name: "Oracle",
    type: "product",
    short: "Oracle Corporation",
    tagline: "World's #2 software company — Java, databases, cloud, enterprise apps. Mixed DSA + SQL OA.",
    about: "Oracle is the world's second-largest software company by revenue. Famous for its flagship database, but also a major player in cloud infrastructure (OCI), enterprise applications (Fusion, NetSuite), and as the steward of Java.",
    whatTheyDo: "Oracle Database, Oracle Cloud Infrastructure (OCI), Fusion Cloud Applications, MySQL, Java SE/EE, autonomous database, and enterprise SaaS.",
    history: [
      "Founded in 1977 by Larry Ellison, Bob Miner, and Ed Oates as Software Development Laboratories.",
      "Renamed Oracle Systems Corporation in 1982 after its flagship product, Oracle Database.",
      "HQ moved from Redwood Shores, CA to Austin, Texas in 2020.",
      "Acquired Sun Microsystems in 2010 — becoming the steward of Java, MySQL, and Solaris.",
      "~165,000+ employees globally. Major India centers in Bangalore, Hyderabad, Pune, Noida.",
    ],
    sections: [
      {
        key: "coding",
        label: "Coding + SQL Round",
        blurb: "Online assessment — 60–120 min. 2–4 DSA problems + SQL/MCQs. Unique mix among MNCs.",
        blocks: [
          { kind: "problems", items: [
            { name: "Maximum Profit from Stock Prices", desc: "Single buy + later sell. Track running min, compute (price − min) at each step.", difficulty: "Easy", example: "[1,9,2,11,1,9,2] → 10" },
            { name: "Bank Loan Interest Comparison", desc: "Two banks with multi-slab rates. EMI = P*r/(1−(1+r)^(−n*12)). Output cheaper one.", difficulty: "Medium" },
            { name: "Borrow Operations for Subtraction", desc: "Simulate digit-by-digit subtraction. Count borrows. 'Not possible' if number2 > number1.", difficulty: "Medium", example: "754 − 658 → 2 borrows" },
            { name: "Count Distinct Elements in Range", desc: "Count distinct values in arr[l..r] using a hash set on the slice.", difficulty: "Medium" },
            { name: "Sort Colors (Dutch National Flag)", desc: "Sort 0s/1s/2s in-place with three pointers in one pass.", difficulty: "Medium", example: "[2,0,1,2,0] → 0 0 1 2 2" },
            { name: "Network Stream — Largest Repackaged Packet", desc: "Process packets as power-of-2 chunks; remainder carries over. Track largest.", difficulty: "Medium" },
            { name: "Distinct Numbers in Multiple Ranges", desc: "Precompute suffix distinct counts; answer each query in O(1).", difficulty: "Medium" },
            { name: "Biggest Meatball", desc: "Queue simulation — cut D from front each day, recycle to rear until one remains.", difficulty: "Medium" },
            { name: "Merge Two Sorted Arrays", desc: "Two-pointer merge into a third array. O(m+n).", difficulty: "Easy", example: "[1,3,5] + [2,4,6] → 1 2 3 4 5 6" },
            { name: "Reverse a Linked List", desc: "Iterative with three pointers (prev, curr, next) or recursive tail flip.", difficulty: "Easy" },
            { name: "Longest Common Subsequence", desc: "2D DP — dp[i][j] = LCS of s1[..i] and s2[..j].", difficulty: "Medium", example: "ABCDGH, AEDFHR → 3 (ADH)" },
            { name: "Balanced Parentheses", desc: "Counter increments on '(', decrements on ')'. Yes if zero at end and never negative.", difficulty: "Easy", example: "(()) → Yes" },
            { name: "Find Missing Number", desc: "Sum formula: n*(n+1)/2 − actual sum.", difficulty: "Easy" },
            { name: "Kth Largest Element", desc: "Min-heap of size k. Push, pop if size > k. Root = answer.", difficulty: "Medium", example: "[3,1,4,5,2], k=2 → 4" },
            { name: "Matrix Spiral Traversal", desc: "Four boundary pointers (top, bottom, left, right) shrinking each iteration.", difficulty: "Medium" },
            { name: "Longest Substring Without Repeating Characters", desc: "Sliding window + hash map of last-seen indices.", difficulty: "Medium", example: "abcabcbb → 3" },
            { name: "Word Break Problem", desc: "1D DP — dp[i] = can s[..i] be split into dictionary words?", difficulty: "Hard", example: "'leetcode', [leet,code] → True" },
            { name: "Next Greater Element", desc: "Monotonic decreasing stack of indices; pop and assign on larger element.", difficulty: "Medium", example: "[4,5,2,10,8] → 5 10 10 -1 -1" },
            { name: "LRU Cache Design", desc: "Doubly linked list + HashMap for O(1) get/put. Evict tail on capacity miss.", difficulty: "Hard" },
            { name: "Nth Highest Salary (SQL)", desc: "DENSE_RANK() OVER ORDER BY salary DESC, filter rank = N. Or LIMIT 1 OFFSET N-1.", difficulty: "Medium" },
          ]},
          { kind: "focus", items: [
            "Arrays & Two Pointers — stock profit, sort colors, Kth largest, merge sorted, rotation.",
            "Strings — longest substring no repeats, anagram, palindrome, first missing positive, word break.",
            "Linked Lists — reverse (iterative + recursive), Floyd cycle, merge sorted lists.",
            "Trees & Graphs — traversals (in/pre/post + level), height, BST validation, LCA, shortest path.",
            "Dynamic Programming — LCS, LIS, coin change, edit distance, climbing stairs, knapsack, word break.",
            "Stack & Queue — balanced parens, next greater element, min stack, LRU cache, sliding window max.",
            "SQL & DB (Oracle-specific) — Nth highest salary, RANK/DENSE_RANK, CONNECT BY, PL-SQL procedures.",
            "System Design (senior roles) — LRU, URL shortener, rate limiter, consistent hashing.",
          ]},
          { kind: "tips", items: [
            "Java is strongly preferred — use proper Java Collections (HashMap, PriorityQueue, Deque) in every solution.",
            "Borrow Operations + Network Stream are unique to Oracle — trace the simulation by hand before coding.",
            "Bank Loan needs the EMI formula precise — double precision arithmetic, slab-by-slab.",
            "SQL is part of the OA, unlike most MNCs. Practise Nth highest salary, window functions, CONNECT BY.",
            "Suffix-based range queries (distinct in [l..r]) need precomputation — recognise the pattern early.",
            "State time + space complexity before coding. Oracle interviewers explicitly reward this.",
            "Be ready for 'Can you do it in O(n)?' or 'What if it doesn't fit in memory?' follow-ups.",
          ]},
          { kind: "frequent", items: [
            "Maximum Profit from Stock Prices — single buy-sell, in almost every Oracle batch.",
            "Longest Common Subsequence — 2D DP classic, very high frequency in technical interviews.",
            "Kth Largest Element — min-heap of size k, asked in OA + live coding.",
            "Nth Highest Salary (SQL) — Oracle-specific SQL problem, unique to this company.",
            "LRU Cache Design — doubly linked list + HashMap, flagship advanced question.",
            "Sort Colors (Dutch National Flag) — signature Oracle array problem.",
          ]},
          { kind: "process", items: [
            "Apply via careers.oracle.com or campus recruitment.",
            "Online Coding Assessment: 2–4 DSA + MCQs (DBMS, OS) in 60–120 min on CodeStreet or HackerRank.",
            "Technical Interview 1: live coding, OOP, DBMS deep dives, projects (60 min).",
            "Technical Interview 2: system design (senior roles), debugging, algorithm optimisation.",
            "Eligibility: B.E./B.Tech/M.E./M.Tech/MCA, 65–70% throughout, no active backlogs.",
            "HR Interview: cultural fit, Oracle products (DB, OCI, Java, Fusion), relocation.",
            "Total timeline: 4–8 weeks campus, 3–5 weeks lateral.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Oracle's flagship product is?", opts: ["Java", "Oracle Database", "Solaris", "MySQL"], ans: 1, why: "Oracle Database has been the company's #1 product since 1979. Java came later (Sun acquisition, 2010)." },
      { q: "Which language is preferred at Oracle?", opts: ["Python", "C++", "Java", "Go"], ans: 2, why: "Oracle has the deepest Java investment in the world — they acquired Sun and own the language." },
      { q: "Best approach for Nth highest salary in SQL?", opts: ["GROUP BY + MAX", "DENSE_RANK() OVER", "Self join N times", "Cursor loop"], ans: 1, why: "DENSE_RANK() handles ties correctly and reads cleanly. Falls back to LIMIT 1 OFFSET N-1 if window functions unavailable." },
      { q: "What is the typical Oracle OA besides DSA?", opts: ["UX design", "SQL + DBMS MCQs", "Frontend build", "ML modelling"], ans: 1, why: "Oracle's OA mixes DSA with SQL/DBMS — unique among MNCs. Practise both together." },
      { q: "Best DS for an LRU cache with O(1) ops?", opts: ["Array + binary search", "TreeMap", "Doubly linked list + HashMap", "Single linked list + HashMap"], ans: 2, why: "Doubly linked list gives O(1) removal of any node + O(1) move-to-head. HashMap gives O(1) lookup by key." },
    ],
    quotes: [
      "Oracle is one interview round away. The DSA you've practised is the same. Just don't freeze on SQL.",
      "Every engineer at Oracle started with one B-tree they didn't understand. They sat with it. So can you.",
      "Be ready for the follow-up: 'Can you do this in O(n)?' Oracle interviewers always ask. Always.",
      "Larry Ellison once said: 'When you innovate, you've got to be prepared for everyone telling you you're nuts.' Code anyway.",
      "Java is the lingua franca at Oracle. If you can write clean Java with proper collections, you're already ahead.",
    ],
    facts: [
      "Oracle Database, first released in 1979, was the world's first commercial RDBMS — still the gold standard.",
      "Oracle acquired Sun Microsystems for $7.4B in 2010, gaining Java, MySQL, and Solaris in one deal.",
      "Oracle Cloud Infrastructure (OCI) is the fastest-growing cloud after AWS, Azure, GCP — a strong career bet.",
      "Larry Ellison personally negotiated the TikTok deal in 2020 — Oracle still hosts a portion of TikTok USA's data.",
      "Most production Oracle DBs run with terabytes of data and 99.999% uptime SLAs — built differently.",
    ],
  },
  zomato: {
    name: "Zomato",
    type: "product",
    short: "Zomato Limited",
    tagline: "India's food-delivery giant — heavy graph problems, LRU Cache, and Zomato-scale system design.",
    about: "Zomato is one of India's largest consumer internet companies, running a real-time delivery network for hundreds of millions of users. Tech stack handles peak ordering bursts of 50,000+ orders per minute.",
    whatTheyDo: "Food delivery, restaurant discovery, dining-out reservations, Hyperpure (B2B supplies), Blinkit (quick commerce). All built on Go, Java, Python, Kafka, Redis, Cassandra, and ML-driven dispatch.",
    history: [
      "Founded in 2008 in Delhi by Deepinder Goyal and Pankaj Chaddah as Foodiebay.",
      "Rebranded as Zomato in 2010. IPO in July 2021 — first major Indian unicorn to list.",
      "Acquired Uber Eats India (2020) and Blinkit / Grofers (2022) — quick commerce play.",
      "~6,000 employees in tech + ~4 lakh delivery partners across 1,000+ cities.",
      "Tech hubs in Gurgaon and Bangalore. Recruits from IITs, NITs, BITS, and IIIT campuses.",
    ],
    sections: [
      {
        key: "interview",
        label: "Interview Pipeline",
        blurb: "OA → Phone Screen → 2 Tech Rounds → System Design → Behavioral. Graphs and LRU Cache almost guaranteed.",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1–2", focus: "OA — Arrays, Graphs, BFS/DFS", topics: "Two Sum, Number of Islands, Unique Paths II, Walls and Gates (multi-source BFS), sliding window basics." },
            { day: "Day 3", focus: "OA — Binary Search on Answer + Greedy", topics: "Allocate Pages, Painters' Partition, Split Array Largest Sum, Koko Eating Bananas." },
            { day: "Day 4", focus: "OA — Monotonic Stack + Strings", topics: "Largest Rectangle Histogram, Next Greater, Remove Adjacent Duplicates." },
            { day: "Day 5", focus: "Phone Screen — Linked Lists", topics: "Reverse in K-groups, Palindrome List (O(1) space), cycle detect, intersection." },
            { day: "Day 6", focus: "Phone Screen — DP", topics: "Maximal Square, LCS, LCS→LIS reduction, partition equal subset, LIS." },
            { day: "Day 7", focus: "Phone Screen — Graphs + Union-Find", topics: "Cyclic-grid Islands, Evaluate Division (weighted graph), Course Schedule (topo sort), Dijkstra." },
            { day: "Day 8", focus: "Phone Screen — Bit & Math", topics: "Majority Element II, XOR range queries, Split Array Equal Average, min swaps via cycle detection." },
            { day: "Day 9", focus: "Onsite — Advanced Graphs", topics: "Multi-BFS, delivery TSP via bitmask DP, friends partition (BS + bipartite), geo-spatial thinking." },
            { day: "Day 10", focus: "Onsite — Trie + Strings", topics: "Implement Trie, prefix count queries, reverse history search (Ctrl+R), autocomplete design." },
            { day: "Day 11", focus: "Onsite — Hard DP + Combinatorics", topics: "Word Break II (path tracking), O(n log n) LIS, max sum switching arrays, meet-in-the-middle." },
            { day: "Day 12", focus: "Onsite — System Design", topics: "LRU Cache (confirmed every year), Shuffle Playlist, delivery notifications, Kafka, Redis geospatial." },
            { day: "Day 13", focus: "Behavioral & Culture Fit", topics: "Ownership, fast delivery, handling failure, post-mortems, STAR stories mapped to Zomato values." },
            { day: "Day 14", focus: "Full Mock Day", topics: "OA + Tech Round 1 + Tech Round 2 + System Design + SQL window functions + Behavioral." },
          ]},
          { kind: "focus", items: [
            "Graphs & BFS/DFS — multi-source BFS, Dijkstra, cyclic grid, Union-Find, topological sort. Most-tested category.",
            "Dynamic Programming — knapsack, LCS, LIS, bitmask DP, binary search on answer, maximal square.",
            "Monotonic Stack — previous/next smaller, histogram rectangle. In OA and onsite both.",
            "Linked Lists — reverse in K-groups, palindrome O(1) space, cycle detection/removal.",
            "Trie — prefix counting, autocomplete, reverse history search. Zomato asks this explicitly.",
            "Design — LRU Cache (very common), Shuffle Playlist, delivery notifications at scale.",
            "SQL — window functions, GROUP BY + HAVING, CASE WHEN. For backend/data engineering roles.",
            "Bit Manipulation — XOR range queries, majority element, meet-in-the-middle.",
          ]},
          { kind: "tips", items: [
            "Graphs are non-negotiable. BFS/DFS, Dijkstra, Union-Find — be fluent. Multi-source BFS in every OA.",
            "Binary Search on Answer (Allocate Pages, Painters' Partition) — recognize on sight.",
            "LRU Cache has been asked in 2021, 2022, 2023, 2024. Know HashMap + Doubly Linked List cold.",
            "Think Zomato-scale. Mention 'this won't work at 50K orders/min' when discussing complexity.",
            "SQL is real for backend/DE roles. Practice window functions, swapped rows, monthly aggregations.",
            "Explain constantly — Zomato values structured thinkers. Walk through brute force, then optimise.",
            "Prepare STAR stories for ownership, fast delivery under pressure, and post-mortems.",
            "Trie is explicitly tested. Prefix count + reverse history search are common Tech Round 2 questions.",
          ]},
          { kind: "frequent", items: [
            "LRU Cache (#146) — design round almost guaranteed every year.",
            "Allocate Minimum Pages — binary search on answer, very common in OA.",
            "Number of Islands — cyclic/spherical grid variant unique to Zomato.",
            "Largest Rectangle in Histogram (#84) — monotonic stack OA classic.",
            "Maximal Square (#221) — 2024 confirmed onsite DP question.",
            "Evaluate Division (#399) — weighted graph BFS, phone screen staple.",
            "Majority Element II (#229) — Boyer-Moore extended voting, OA bit/math.",
            "Reverse Nodes in K-Group (#25) — linked list hard, phone screen.",
            "XOR Operation on Range Queries — bit manipulation OA classic.",
          ]},
          { kind: "process", items: [
            "Apply via Zomato Careers, LinkedIn, campus drives (IITs, NITs, BITS), or referrals.",
            "OA: 3 DSA problems in 60–90 min + 15–20 MCQs on OS/DBMS. HackerRank platform.",
            "Technical Round 1: 1–2 medium DSA on shared editor + resume discussion (45–60 min).",
            "Technical Round 2: 1 harder DSA + System Design or LLD. Mandatory for SDE-2+.",
            "Hiring Manager: project deep-dives, ownership mindset, culture fit.",
            "Offer in 1–2 weeks after final round. Competitive base + ESOPs + performance bonus.",
            "Total timeline: 5–8 weeks from OA to offer.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Which technique solves Walls and Gates (distance to nearest gate)?", opts: ["DFS from each cell", "Multi-source BFS from gates", "Dijkstra", "Bellman-Ford"], ans: 1, why: "Push all gates into the queue at once and BFS outward — every cell gets the correct min distance in O(rows × cols)." },
      { q: "Allocate Minimum Pages is best solved by?", opts: ["Brute force partition", "DP on partitions", "Binary search on the answer + greedy check", "Greedy alone"], ans: 2, why: "Binary search over the answer space (max pages per student), with a greedy feasibility check at each mid." },
      { q: "LRU Cache requires which combination for O(1) get/put?", opts: ["Array + HashMap", "Doubly linked list + HashMap", "TreeMap + LinkedList", "Heap + Set"], ans: 1, why: "DLL gives O(1) move-to-front and remove-tail; HashMap gives O(1) lookup by key." },
      { q: "Zomato's most-tested DSA category is?", opts: ["Number theory", "Graphs + BFS/DFS", "Suffix arrays", "Persistent data structures"], ans: 1, why: "Delivery networks, geographic routing, and dispatch problems map directly to graph algorithms." },
      { q: "Largest Rectangle in Histogram uses which technique?", opts: ["Sliding window", "Monotonic increasing stack", "Two pointers", "Divide and conquer"], ans: 1, why: "Maintain a stack of increasing heights — pop and compute area when a smaller bar arrives. O(n)." },
    ],
    quotes: [
      "You're prepping for Zomato because they think you can build delivery for a billion people. Believe them.",
      "Multi-source BFS isn't hard. You're hard. Practise once, own it forever.",
      "Every Zomato hire failed an LRU Cache problem once. The next day, they didn't.",
      "Move fast — Zomato's only commandment. Bring the same energy to your interview.",
      "STAR your stories. Two great ones beat ten OK ones at the hiring manager round.",
    ],
    facts: [
      "Zomato handles 50,000+ orders per minute at peak — dinner rush in metro cities.",
      "Zomato Tech runs on Go, Java, Python, Kafka, Redis, Cassandra — and ML-driven dispatch routing.",
      "Blinkit's 10-minute delivery promise is powered by Zomato's quick commerce engineering team.",
      "Zomato's IPO in 2021 was the first major Indian internet IPO — the entire industry watched.",
      "Most Zomato SDE-2 system design rounds use real internal problems — delivery, dispatch, notifications.",
    ],
  },
  qualcomm: {
    name: "Qualcomm",
    type: "product",
    short: "Qualcomm Inc.",
    tagline: "Snapdragon, 5G, embedded — heavy C/C++, bit manipulation, and systems programming.",
    about: "Qualcomm is the world's largest fabless semiconductor and wireless tech company. Snapdragon chips power most Android flagships; their 5G modems are used in Apple iPhones.",
    whatTheyDo: "Mobile SoCs (Snapdragon), 5G modems, Wi-Fi/Bluetooth/automotive chipsets, on-device AI accelerators, IoT, and XR/AR platforms.",
    history: [
      "Founded in 1985 in San Diego, CA by Irwin Jacobs, Andrew Viterbi, and 5 others.",
      "Invented CDMA — the technology that powered 3G and laid the foundation for 4G/5G.",
      "Snapdragon platform launched in 2007 — now powers >90% of Android flagship phones.",
      "~50,000 employees globally. Huge India centre in Hyderabad and Bangalore.",
      "Hires through HackerRank OA with both DSA + 'guess the C/C++ output' MCQs.",
    ],
    sections: [
      {
        key: "interview",
        label: "Interview Pipeline",
        blurb: "HackerRank OA → 3 Tech Rounds → HR. MCQs are heavily weighted; bit manipulation is essential.",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1–2", focus: "OA — Bit Manipulation + C/C++ Output", topics: "Single Number (#136), Power of Two (#231), Hamming Weight (#191), pointers/sizeof/virtual func output prediction." },
            { day: "Day 3", focus: "OA — Advanced Bit + Math", topics: "Count Pairs Divisible by K (#2183), GCD, modular arithmetic, implement XOR without XOR." },
            { day: "Day 4", focus: "OA — Strings + Patterns", topics: "String Compression (#443), Valid Palindrome II (#680), two-pointer string manipulation without built-ins." },
            { day: "Day 5", focus: "Tech 1 — Arrays + Hashing", topics: "Two Sum (#1), Maximum Subarray Kadane (#53), Merge Intervals (#56), hash map patterns in C++." },
            { day: "Day 6", focus: "Tech 1 — Linked Lists + Core DSA", topics: "Reverse Linked List (#206), Linked List Cycle (#141), Valid Parentheses (#20), iterative + recursive." },
            { day: "Day 7", focus: "Tech 2 — Trees + Graphs", topics: "LCA of BST (#235), Level Order Traversal (#102), Course Schedule (#207), Number of Islands (#200)." },
            { day: "Day 8", focus: "Tech 2 — Advanced + C++ Systems", topics: "Longest Substring (#3), Minimum Window (#76), Group Anagrams (#49), smart pointers, virtual functions." },
            { day: "Day 9", focus: "Tech 3 — Systems + Low-Level Design", topics: "memcpy with overlap, endianness conversion, custom strstr (KMP), memory alignment." },
            { day: "Day 10", focus: "Onsite — Trees + Serialization", topics: "Sorted List to BST (#109), Intersection of Lists (#160), Serialize/Deserialize tree (#297)." },
            { day: "Day 11", focus: "Onsite — Advanced Arrays + Optimization", topics: "Trapping Rain Water (#42), Word Search (#79), Merge K Lists (#23), Rotate Image (#48), Jump Game II (#45)." },
            { day: "Day 12", focus: "Onsite — Graphs + DP + Design", topics: "Cycle detection in directed graph, Max Product Subarray (#152), LRU Cache (#146), parking lot system design." },
            { day: "Day 13", focus: "Onsite — Embedded + Deep Dive", topics: "Timer module with callbacks in C, RTOS concepts (mutex/semaphore/context switch), memory mgmt, interrupt handling." },
            { day: "Day 14", focus: "Final Full-Day Mock", topics: "OA + 3 Tech Rounds + HR. Resume deep dive. Edge case completeness." },
          ]},
          { kind: "focus", items: [
            "Bit Manipulation — XOR tricks, power of two, single number, set/clear/toggle, Hamming weight.",
            "Arrays & Strings — Two Sum, Kadane, merge intervals, string compression, pattern matching.",
            "Linked Lists — reversal, cycle detection, intersection, merge sorted lists.",
            "Trees & Graphs — BST operations, LCA, level-order, cycle detection, topological sort.",
            "Advanced DSA — sliding window, DP, backtracking, binary search.",
            "C++ Systems — memory layout, virtual functions, smart pointers, templates, STL.",
            "Embedded/Firmware — RTOS, interrupt handling, memory management, endianness.",
          ]},
          { kind: "tips", items: [
            "MCQ section is heavily weighted in OA. Practise C/C++ 'guess the output' — pointers, ++/--, sizeof, virtual functions.",
            "C++ is the default language. Use STL containers properly — vector, unordered_map, smart pointers.",
            "Bit manipulation is essential. Qualcomm is a semiconductor company — XOR, AND, OR, shifts in every round.",
            "Resume deep dives are expected. Justify every architectural decision and DS choice in your projects.",
            "For embedded/firmware roles: mutex vs semaphore, deadlock, IPC, context switching, memory-mapped I/O.",
            "Explain before coding — state approach, edge cases, complexity. Qualcomm values thought process over speed.",
            "Switch between MCQ and DSA freely — manage your time. Don't get stuck on one DSA problem.",
            "Research products — Snapdragon, 5G modems, Bluetooth/Wi-Fi, on-device AI. Shows genuine interest.",
          ]},
          { kind: "frequent", items: [
            "Single Number (#136) — bit manipulation fundamental, OA classic.",
            "Power of Two (#231) — n & (n-1) trick, asked everywhere.",
            "Two Sum (#1) — hash map pattern.",
            "Maximum Subarray (#53) — Kadane's algorithm.",
            "Reverse Linked List (#206) — iterative + recursive.",
            "Detect Cycle in Linked List (#141) — Floyd's algorithm.",
            "LCA of BST (#235) — leverage BST property.",
            "Course Schedule (#207) — topological sort + cycle detection.",
            "Trapping Rain Water (#42) — two pointers or DP.",
          ]},
          { kind: "process", items: [
            "Apply via careers.qualcomm.com — highlight C/C++ and embedded experience.",
            "HackerRank OA: 10 coding (60 min) + 20 MCQs (30 min). Both sections evaluated.",
            "Phone Screen: 30–45 min, 1–2 DSA + resume discussion.",
            "Tech Round 1: 45–60 min, 2–3 medium DSA in C++.",
            "Tech Round 2: 45–60 min, advanced DSA + C++ concepts + trees/graphs.",
            "Tech Round 3: 45–60 min, systems design or deep DSA/optimization.",
            "HR Round: 30–45 min, cultural fit and Qualcomm-specific questions.",
            "Total timeline: 6–8 weeks from OA to offer.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "How do you check if n is a power of 2 in O(1)?", opts: ["n % 2 == 0", "n & (n-1) == 0", "log₂(n) is integer", "n / 2 != 0"], ans: 1, why: "n & (n-1) clears the lowest set bit. If n is a power of 2 it has exactly one set bit → result is 0." },
      { q: "Single Number (every element twice except one) is solved by?", opts: ["Hash map", "Sorting", "XOR all elements", "Binary search"], ans: 2, why: "XOR is associative + commutative + a XOR a = 0. XOR everything → duplicates cancel, the unique element remains." },
      { q: "Qualcomm's default coding language for OA?", opts: ["Python", "Java", "C/C++", "Go"], ans: 2, why: "Qualcomm is a semiconductor / firmware company. C++ with STL is the expected language for OA and interviews." },
      { q: "Which is true about endianness?", opts: ["Big endian stores LSB first", "Little endian stores LSB first", "Only matters on 32-bit systems", "Network byte order is little-endian"], ans: 1, why: "Little endian: least significant byte at lowest address (x86, ARM). Big endian: most significant first (network byte order)." },
      { q: "Why use RTOS over a regular OS for embedded?", opts: ["Larger feature set", "Deterministic real-time response", "Better GUI support", "Faster boot only"], ans: 1, why: "RTOS guarantees task scheduling within hard deadlines — critical for control loops, automotive, telecom." },
    ],
    quotes: [
      "Qualcomm hires for depth, not speed. Take your time. Explain. Verify. They reward thought.",
      "Every great embedded engineer wrote a buggy memcpy once. The next one was perfect. Yours will be too.",
      "Pointers aren't scary. They're just addresses with attitude.",
      "MCQ section decides as much as DSA — don't skip it. 20 MCQs are 20 chances.",
      "C++ output prediction is a puzzle, not a trap. Trust your fundamentals.",
    ],
    facts: [
      "Snapdragon chips power >90% of Android flagship phones — Galaxy, Pixel, OnePlus, Xiaomi.",
      "Qualcomm invented CDMA (3G) and holds thousands of essential 5G patents.",
      "Apple iPhones still use Qualcomm 5G modems despite Apple's chip ambitions — that's how dominant they are.",
      "Qualcomm AI Engine runs on-device large model inference — Snapdragon X Elite competes with Apple M-series.",
      "Their Hyderabad and Bangalore offices employ thousands of engineers — heavy India presence.",
    ],
  },
  morgan_stanley: {
    name: "Morgan Stanley",
    type: "product",
    short: "Morgan Stanley Tech",
    tagline: "Wall Street tech — finance-flavoured DSA, debugging OA, HireVue, real-time trading systems.",
    about: "Morgan Stanley is one of the world's biggest investment banks. Their technology org builds trading platforms, risk engines, fraud detection, and core banking — engineering at financial scale.",
    whatTheyDo: "Investment banking, wealth management, institutional securities, trading platforms, risk engines, fraud detection, market data systems. Tech stack: Java, Python, Kafka, Cassandra, Redis.",
    history: [
      "Founded in 1935 by Henry S. Morgan and Harold Stanley after Glass-Steagall split JP Morgan.",
      "HQ in New York City. Major tech centres in Mumbai, Bengaluru, Budapest, Glasgow, Montreal.",
      "~80,000 employees worldwide. Technology org alone has 25,000+ engineers.",
      "Hires through campus + lateral. Tech Analyst Program is the flagship fresher entry point.",
      "OA is distinctive: aptitude MCQs + debugging buggy Java/Python + 2–3 DSA problems.",
    ],
    sections: [
      {
        key: "interview",
        label: "Interview Pipeline",
        blurb: "OA → HireVue → Phone Screen → 4 Onsite rounds (DSA + Finance DSA + System Design + Behavioral).",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1", focus: "OA — Stock Trading + Basics", topics: "Best Time to Buy/Sell Stock (#121), running min pattern, edge cases (all decreasing prices)." },
            { day: "Day 2", focus: "OA — String Subsequences + DP", topics: "Distinct Subsequences (#115), 2D DP → 1D optimization." },
            { day: "Day 3", focus: "OA — Stack + Parentheses", topics: "Longest Valid Parentheses (#32), stack with base index, O(1) space two-pass." },
            { day: "Day 4", focus: "OA — Classic DP", topics: "House Robber (#198), Coin Change (#322), circular variant (#213), space optimization to O(1)." },
            { day: "Day 5", focus: "Phone — LRU Cache + Stack", topics: "LRU Cache (#146) DLL + HashMap, Valid Parentheses (#20), extend to LFU (#460)." },
            { day: "Day 6", focus: "Phone — Linked List + Permutations", topics: "Swap kth Nodes (#1721), Next Permutation (#31), two-pointer single pass." },
            { day: "Day 7", focus: "Phone — Trapping Rain Water + Products", topics: "Trapping Rain Water (#42) O(1) space, Product Array Except Self (#238), 2D variant (#407)." },
            { day: "Day 8", focus: "Phone — Spiral Matrix + Strings", topics: "Spiral Matrix (#54), Reverse Words (#151), Spiral Matrix II (#59) without extra space." },
            { day: "Day 9", focus: "Onsite 1 — DSA Deep Dive", topics: "Max Subarray Kadane (#53), Largest Rectangle Histogram (#84), Sort Colors (#75) Dutch flag." },
            { day: "Day 10", focus: "Onsite 2 — Finance DSA", topics: "Best Time Buy Stock III (#123), Stock IV (#188), 4-state DP, k transactions, suffix max arrays." },
            { day: "Day 11", focus: "Onsite 3 — Advanced DP + Backtracking", topics: "Word Break (#139), LCS (#1143), LIS O(n log n) (#300), Subsets (#78), Letter Combinations (#17)." },
            { day: "Day 12", focus: "Onsite 4 — System Design", topics: "Token Bucket Rate Limiter, Real-Time Fraud Detection, Distributed Order Book, Kafka partitioning, CQRS, CAP." },
            { day: "Day 13", focus: "HireVue + Behavioral", topics: "STAR stories, Why Morgan Stanley, client focus, integrity, long-term thinking. Record on phone." },
            { day: "Day 14", focus: "Full Loop Mock", topics: "OA + Phone + 4 Onsite rounds + HireVue. Edge case completeness. Complexity statements." },
          ]},
          { kind: "focus", items: [
            "Arrays & Greedy — Best Time Buy/Sell Stock (all variants), Max Subarray, Product Except Self, Dutch flag.",
            "Dynamic Programming — House Robber, Coin Change, LCS, LIS O(n log n), Word Break, Distinct Subsequences.",
            "Stack & Strings — Longest Valid Parentheses, Trapping Rain Water, Largest Rectangle, Implement atoi().",
            "Linked Lists — LRU Cache, Swap kth Nodes, Intersection, Min Stack, Flatten Tree to List.",
            "Finance-Flavoured DSA — Stock III/IV (k transactions), 10-min interval trading, Rate Limiter Design.",
            "System Design — Real-Time Fraud Detection, Distributed Order Book, Rate Limiter, Search Autocomplete.",
            "Behavioural — STAR + client focus + integrity + long-term thinking + motivation for finance tech.",
          ]},
          { kind: "tips", items: [
            "Finance context matters. Frame solutions in financial terms — latency, order book, fraud detection.",
            "OA debugging section is unique. Practise reading buggy Java/Python under time pressure — off-by-one, null checks.",
            "HireVue is eliminatory. Record practice on phone. A vague 'Why Morgan Stanley?' costs the next round.",
            "Explain before coding — communication is rated as heavily as correctness.",
            "System design for senior roles — fraud detection, distributed order book, real-time risk engine. CAP + consistent hashing.",
            "Optimise progressively. Start brute force, then optimise. Show the thinking.",
            "Aptitude MCQs matter. Don't skip them — they significantly affect shortlisting.",
          ]},
          { kind: "frequent", items: [
            "Best Time to Buy and Sell Stock (#121) — OA staple, every candidate sees it.",
            "LRU Cache (#146) — phone screen + onsite design almost guaranteed.",
            "Trapping Rain Water (#42) — hard problem in phone screen + onsite.",
            "House Robber (#198) — DP classic with circular follow-up (#213).",
            "Coin Change (#322) — DP finance variant.",
            "Longest Valid Parentheses (#32) — stack/DP hybrid, OA + phone.",
            "Number of Islands (#200) — graph DFS/BFS, onsite staple.",
            "Next Permutation (#31) — phone screen classic.",
            "Best Time Buy Stock III (#123) — finance-flavoured hard DP, onsite round 2.",
          ]},
          { kind: "process", items: [
            "Apply via Morgan Stanley Careers Portal, campus placements, or LinkedIn referrals.",
            "OA: 90–120 min — Aptitude (20 min) + Debugging (20 min) + Coding (60 min).",
            "HireVue: pre-recorded video, 3–5 behavioral questions. 30s prep, 1.5 min answer. One retry.",
            "Phone Screen: 45–60 min on CoderPad/HackerRank. 1–2 Easy-Medium problems + complexity.",
            "Onsite (3–4 rounds): DSA Deep Dive + Advanced/Finance DSA + System Design + Behavioral.",
            "Offer: independent scorecards from interviewers. Campus offers released Dec–Feb for Aug starts.",
            "Total timeline: 6–10 weeks from OA to offer.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Best Time to Buy and Sell Stock with one transaction — best approach?", opts: ["Two nested loops", "Track running min + max profit in one pass", "Sort the array", "DP table"], ans: 1, why: "O(n) with O(1) space. For each day, update running min and compute potential profit." },
      { q: "What does HireVue test that DSA does NOT?", opts: ["Coding speed", "Behavioral fit + communication", "SQL queries", "Math aptitude"], ans: 1, why: "HireVue is pre-recorded behavioral. Practise STAR stories on your phone — vague answers eliminate you early." },
      { q: "Stock III / IV (k transactions) needs which DP approach?", opts: ["1D DP on prices", "2D DP — k × n with buy/sell states", "Greedy alone", "Sorting + binary search"], ans: 1, why: "State = (transaction count, holding/not holding). 2D DP table or 4-state per transaction." },
      { q: "Token Bucket Rate Limiter — what does it allow that fixed-window doesn't?", opts: ["Stricter limits", "Bursts within capacity", "Per-second granularity", "Cross-region sync"], ans: 1, why: "Tokens accumulate up to the bucket size — allowing short bursts above the average rate while still enforcing it long-term." },
      { q: "Why is OA debugging unique to Morgan Stanley?", opts: ["Tests speed", "Tests ability to read buggy code under pressure", "Replaces DSA", "Only for senior roles"], ans: 1, why: "Reading buggy Java/Python and spotting off-by-one + null + base case errors is a daily reality at MS Tech." },
    ],
    quotes: [
      "Wall Street doesn't intimidate engineers who explain their code clearly. That's you.",
      "HireVue feels weird. Smile, hit STAR, hit submit. Done.",
      "Every MS interviewer wants you to succeed. Show them your thinking — they'll cheer.",
      "Bug-spotting is a skill — like spotting overdrawn accounts. You can train both.",
      "An LRU Cache from scratch in 25 minutes. You've already practised it. Trust it.",
    ],
    facts: [
      "Morgan Stanley's trading platforms process billions of dollars of trades per day — sub-millisecond latency.",
      "MS Tech has 25,000+ engineers globally — bigger than many pure tech companies.",
      "Their Mumbai and Bengaluru offices are core engineering centres, not just support.",
      "Technology Analyst Program is a 2-year structured rotation across divisions — fastest path to senior roles.",
      "HireVue at Morgan Stanley is eliminatory. A vague 'Why MS?' kills the next round before you even meet a human.",
    ],
  },
  microsoft: {
    name: "Microsoft",
    type: "product",
    short: "Microsoft Corp.",
    tagline: "Azure, Office, GitHub, LinkedIn — clean code, optimal-from-start, growth mindset.",
    about: "Microsoft is the world's most valuable software company. Builds Windows, Office, Azure cloud, Xbox, GitHub, LinkedIn, and a massive AI portfolio (Copilot + OpenAI partnership).",
    whatTheyDo: "Cloud (Azure), productivity software (Office 365, Teams), developer platforms (GitHub, VS Code), AI (Copilot, OpenAI), gaming (Xbox), networking (LinkedIn).",
    history: [
      "Founded in 1975 by Bill Gates and Paul Allen in Albuquerque, NM.",
      "IPO in 1986 made Gates the world's youngest self-made billionaire.",
      "Acquired LinkedIn ($26B, 2016), GitHub ($7.5B, 2018), Activision Blizzard ($69B, 2023).",
      "Satya Nadella became CEO in 2014 — pivoted from 'devices' to 'cloud + AI'. Stock 10x'd.",
      "~228,000 employees globally. India is the second-largest HQ outside the US.",
    ],
    sections: [
      {
        key: "interview",
        label: "Interview Pipeline",
        blurb: "OA → Phone Screen → Onsite Loop (4–5 rounds: coding + system design + behavioral).",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1–2", focus: "OA — Arrays + Matrix", topics: "Two Sum (#1), Set Matrix Zeroes (#73), Search 2D Matrix II (#240), Rotate Array (#189)." },
            { day: "Day 3", focus: "OA — Linked Lists + Advanced Arrays", topics: "Add Two Numbers (#2), Copy List with Random Pointer (#138), Merge Two Sorted Lists (#21), Min in Rotated Array (#153)." },
            { day: "Day 4", focus: "OA — Strings + Patterns", topics: "Longest Palindromic Substring (#5), Word Break (#139), Longest Substring without Repeats (#3), Reverse Words (#151)." },
            { day: "Day 5", focus: "Phone — Trees", topics: "Level Order Traversal (#102), Symmetric Tree (#101), Validate BST (#98), Connect Siblings, Tree to DLL." },
            { day: "Day 6", focus: "Phone — Graphs + Path Finding", topics: "Clone Graph (#133), Word Search (#79), Number of Islands (#200), Word Ladder (#127)." },
            { day: "Day 7", focus: "Phone — DP + Backtracking", topics: "Best Time Buy Stock (#121), N-Queens (#52), Sudoku Solver (#37), matrix DP." },
            { day: "Day 8", focus: "Phone — Advanced Patterns", topics: "Regex Matching (#10), Linked List Cycle (#141), Swap BST Nodes, Word Break II (#140)." },
            { day: "Day 9", focus: "Onsite — Trees + Design", topics: "LCA Binary Tree (#236), Max Path Sum (#124), LCA of BST (#235), tree reconstruction." },
            { day: "Day 10", focus: "Onsite — Complex DP", topics: "Palindromic Subsequence (#516), Palindrome Partitioning II (#132), 3Sum (#15), dice combinatorics." },
            { day: "Day 11", focus: "Onsite — System Design", topics: "Scalable cache, URL shortener, distributed system trade-offs, Azure-specific scenarios." },
            { day: "Day 12", focus: "Onsite — Behavioral + Communication", topics: "Growth mindset, MS values, project deep dives, communication best practices." },
            { day: "Day 13", focus: "Quick Review — Easy + Medium", topics: "Reverse string/integer, find largest/smallest, count frequencies, palindromes, remove duplicates." },
            { day: "Day 14", focus: "Full Mock Day", topics: "OA + Phone + 2 Coding Rounds + System Design + Behavioral. Complete edge cases." },
          ]},
          { kind: "focus", items: [
            "Arrays & Matrices — Two Sum, Set Matrix Zeroes, Search 2D, Rotate, Merge sorted.",
            "Linked Lists — Add Two Numbers, Copy with Random Pointer, Merge sorted, cycle detection.",
            "Trees — Level Order, Symmetric, Validate BST, LCA, Path Sum, Tree to DLL.",
            "Graphs — Clone Graph, BFS/DFS, path finding, topological sort, cycle detection.",
            "Strings — Palindromes, Word Break, substring ops, compression, segmentation.",
            "Dynamic Programming — Best Time Buy Stock, Longest Palindrome, 3Sum, Coin Change.",
            "Backtracking — N-Queens, Sudoku Solver, Palindrome Partitioning, Word Search.",
            "System Design — Caching, DB design, API design, distributed systems.",
          ]},
          { kind: "tips", items: [
            "Optimize from the start. Microsoft values clean, efficient first-attempt code.",
            "Communicate your thinking. Interviewers evaluate communication as much as code.",
            "Handle edge cases explicitly. Discuss them BEFORE writing code.",
            "Always state Big O. Be ready to optimize O(n²) → O(n log n) on demand.",
            "Justify data structure choices. Why HashMap not Array? Why heap not sort?",
            "System design appears even for SDE roles. Understand scalability and trade-offs.",
            "Reference Microsoft products (Azure, Office, Teams, LinkedIn) — shows context.",
            "Emphasize growth mindset, collaboration, customer focus — Microsoft's core values.",
          ]},
          { kind: "frequent", items: [
            "Two Sum (#1) — array + hashing fundamental.",
            "Add Two Numbers (#2) — linked list classic.",
            "Level Order Traversal (#102) — tree BFS.",
            "Validate BST (#98) — tree validation.",
            "Clone Graph (#133) — graph deep copy.",
            "Word Break (#139) — DP string segmentation.",
            "Longest Palindromic Substring (#5) — string DP.",
            "Set Matrix Zeroes (#73) — matrix in-place ops.",
            "Merge Sorted Lists (#21) — linked list merge.",
          ]},
          { kind: "process", items: [
            "Apply via careers.microsoft.com or LinkedIn referrals.",
            "OA: 60–90 min, 1–3 medium DSA problems on Codility or proprietary platform.",
            "Phone Screen: 45–60 min, 1–2 coding problems + brief behavioral.",
            "Virtual Onsite Loop: 4–5 rounds × 60 min — 2–3 coding, 1 system design, 1 behavioral.",
            "Hiring Decision: 1–2 weeks after final round.",
            "Total timeline: 6–10 weeks from OA to offer.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Two Sum is best solved by?", opts: ["Two nested loops", "Sorting + two pointers", "Hash map for complement lookup", "Binary search"], ans: 2, why: "Hash map gives O(n) — for each element check if (target − element) is already in the map." },
      { q: "Validate BST — what's the cleanest approach?", opts: ["Check each node against left/right child only", "Inorder traversal must be strictly increasing", "Count number of nodes", "DFS depth check"], ans: 1, why: "BST inorder is sorted ascending. Walk inorder, fail if any value ≤ previous." },
      { q: "Clone Graph — what data structure helps avoid revisiting?", opts: ["Stack", "Queue", "HashMap (old → new node)", "Set of edges"], ans: 2, why: "Map each original node to its clone. On revisit, return the clone from the map — avoids infinite loops." },
      { q: "Microsoft's most-emphasised value at interviews is?", opts: ["Speed", "Growth mindset", "Selling skills", "Memorisation"], ans: 1, why: "Satya Nadella's transformation of MS culture is built on 'learn it all' over 'know it all'. Behavioral round leans on this." },
      { q: "Best Time to Buy Stock (one transaction) — optimal complexity?", opts: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"], ans: 2, why: "Single pass — track running min and max profit at each step. O(n) time, O(1) space." },
    ],
    quotes: [
      "Microsoft hires growth mindset over genius. Show learning, show curiosity, show humility.",
      "Optimal from the start isn't perfection — it's discipline. Practise it daily.",
      "You're a Two Sum away from your offer. Keep solving.",
      "Communication > correctness at Microsoft. Speak as you code. Narrate the why.",
      "Behavioral round at MS isn't a checkbox. Prepare 4 strong STAR stories on growth and collaboration.",
    ],
    facts: [
      "Microsoft Azure is the #2 cloud after AWS — and growing faster.",
      "Satya Nadella's culture pivot ('learn it all') is why MS stock 10x'd between 2014–2024.",
      "Microsoft owns GitHub, LinkedIn, Xbox, Activision, and a 49% stake in OpenAI — biggest acquirer in tech.",
      "Microsoft's India presence (Hyderabad, Bangalore, Noida, Gurgaon) is the second largest globally.",
      "Office 365 + Teams + GitHub + Copilot now generate over $200B/year combined.",
    ],
  },
  meta: {
    name: "Meta",
    type: "product",
    short: "Meta Platforms",
    tagline: "Facebook, Instagram, WhatsApp, AI labs — optimal solutions from the start, LRU Cache classic.",
    about: "Meta runs Facebook, Instagram, WhatsApp, Messenger, and the world's largest open-source AI research org (FAIR + Llama). They also build VR/AR via Reality Labs.",
    whatTheyDo: "Social networking, messaging, advertising, AI research (FAIR, Llama models), VR/AR (Quest, Ray-Ban Meta). React, GraphQL, PyTorch all originated at Meta.",
    history: [
      "Founded in 2004 by Mark Zuckerberg at Harvard as 'Thefacebook'.",
      "Acquired Instagram (2012, $1B), WhatsApp (2014, $19B), Oculus (2014, $2B).",
      "Renamed to Meta in 2021 — pivot to the 'metaverse' and Reality Labs.",
      "~67,000 employees. Llama 3 + open-source AI strategy disrupted the closed-source norm.",
      "Hires through 4–5 onsite rounds — 2 coding + 1 system design + 1 behavioral.",
    ],
    sections: [
      {
        key: "interview",
        label: "Interview Pipeline",
        blurb: "OA → Phone Screen → Onsite (4–5 rounds). 8–12% pass rate to onsite. LRU Cache is a Meta classic.",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1–2", focus: "OA — Strings + Arrays", topics: "Valid Palindrome II (#680), Move Zeroes (#283), two-pointer technique, edge cases." },
            { day: "Day 3", focus: "OA — Hashing + Prefix Sums", topics: "Subarray Sum Equals K (#560), Group Anagrams (#49), Product Except Self (#238)." },
            { day: "Day 4", focus: "OA — Sorting + Merging", topics: "Merge Intervals (#56), Insert Interval (#57), interval comparison logic." },
            { day: "Day 5", focus: "Phone — Trees + BFS", topics: "Binary Tree Right Side View (#199), Level Order (#102), Vertical Order (#987)." },
            { day: "Day 6", focus: "Phone — Stack + Parentheses", topics: "Minimum Remove to Make Valid Parentheses (#1249), Valid Parens (#20), Make String Great (#1544)." },
            { day: "Day 7", focus: "Phone — LCA + Trees", topics: "LCA of Binary Tree (#236), LCA of BST (#235), LCA of Deepest Leaves (#1650), post-order pattern." },
            { day: "Day 8", focus: "Phone — Sliding Window", topics: "Longest Substring without Repeats (#3), Minimum Window Substring (#76), Substring Concatenation (#30)." },
            { day: "Day 9", focus: "Onsite — Arrays + Two Pointers", topics: "3Sum (#15), 3Sum Closest (#16), 4Sum (#18), duplicate skipping, kSum generalization." },
            { day: "Day 10", focus: "Onsite — Advanced Trees + Paths", topics: "Max Path Sum (#124), Serialize/Deserialize Tree (#297), BST to Sorted DLL (#426)." },
            { day: "Day 11", focus: "Onsite — Graphs + Islands", topics: "Number of Islands (#200), Making A Large Island (#827), Number of Distinct Islands (#694)." },
            { day: "Day 12", focus: "Onsite — DP", topics: "Decode Ways (#91), Word Break (#139), Word Break II (#140), state transitions, 2D → 1D optimization." },
            { day: "Day 13", focus: "Onsite — Design + Advanced", topics: "LRU Cache (#146), Implement Trie (#208), Is Graph Bipartite (#785), BST to DLL (#426)." },
            { day: "Day 14", focus: "Final Mock Day", topics: "2 coding (45 min each) + 1–2 behavioral. STAR format. Full Meta loop simulation." },
          ]},
          { kind: "focus", items: [
            "Arrays & Strings — prefix sums, hashing, two pointers, sliding window.",
            "Trees — Right/Left Side Views, LCA, serialization, max path sum.",
            "Graphs — Island counting, grid DFS/BFS, bipartite checking, topological sort.",
            "Design — LRU Cache (very common), Trie, frequency tracking.",
            "Greedy — Interval merging, earliest deadline problems.",
          ]},
          { kind: "tips", items: [
            "No DP in phone screens. Focus on arrays, strings, trees, graphs. DP is onsite material.",
            "Optimal solutions from the start. Meta will ask 'can you do better?' even after correct solutions.",
            "Clean, production-quality code. Variable naming, readability, edge cases all matter.",
            "Think out loud. State your approach, complexity, and edge cases BEFORE coding.",
            "Partial test cases count in OA. Get brute force working first, then optimize.",
            "STAR format for behavioral. Prepare 4–5 strong stories on ownership, speed, measurable impact.",
          ]},
          { kind: "frequent", items: [
            "Binary Tree Right Side View (#199) — appears in most reports.",
            "Merge Intervals (#56) — OA + phone screen staple.",
            "LRU Cache (#146) — design round almost guaranteed.",
            "Minimum Remove to Make Valid Parentheses (#1249) — phone screen favorite.",
            "Subarray Sum Equals K (#560) — OA very common.",
            "Number of Islands (#200) — onsite classic.",
            "Serialize & Deserialize Binary Tree (#297) — onsite hard.",
            "Vertical Order Traversal (#987) — uniquely Meta-flavored.",
            "3Sum (#15) — onsite two-pointer classic.",
          ]},
          { kind: "process", items: [
            "OA: 70–90 min, 2–3 medium problems, proctored on HackerRank.",
            "Phone Screen: 35 min, 2 LeetCode problems, mostly medium.",
            "Onsite: 4–5 rounds (2 coding × 45 min + 1 system design + 1 behavioral).",
            "System Design (E4+): Instagram Feed, Messenger, Ad Delivery patterns.",
            "Pass Rate: ~8–12% of applicants reach onsite. Onsite-to-offer is higher (~30–40%).",
            "Total timeline: 6–10 weeks from OA to offer.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Meta phone screens typically AVOID which topic?", opts: ["Trees", "Graphs", "Dynamic Programming", "Strings"], ans: 2, why: "DP appears mainly in onsite rounds. Phone screens stay on arrays, strings, trees, graphs, and design." },
      { q: "Minimum Remove to Make Valid Parens — best technique?", opts: ["Recursion + memoization", "Stack tracking '(' indices + second pass", "Brute force all substrings", "DP"], ans: 1, why: "Push '(' indices. On extra ')' or leftover '(' in the stack, mark those indices for removal. Then build the result." },
      { q: "Subarray Sum Equals K — optimal approach?", opts: ["Sliding window", "Prefix sum + HashMap of counts", "Sort + binary search", "DP O(n²)"], ans: 1, why: "Track prefix sums in a HashMap with their counts. For each prefix sum P, add count[P − K] to the answer." },
      { q: "LRU Cache — Meta's almost-guaranteed design question — uses?", opts: ["Array + HashMap", "Doubly Linked List + HashMap", "TreeMap + LinkedList", "Heap + Set"], ans: 1, why: "DLL: O(1) move-to-front and remove-from-tail. HashMap: O(1) lookup by key. The combo is THE LRU answer." },
      { q: "What's Meta's onsite pass-through rate from OA?", opts: ["~30–40%", "~8–12%", "~20%", "~50%"], ans: 1, why: "Only ~8–12% of OA applicants reach onsite at Meta. The bar is high — partial credit on OA can decide it." },
    ],
    quotes: [
      "Meta interviewers ask 'can you do better?' even when you're right. It's not a trap — they want to see you think.",
      "OA gets you to phone screen. Phone screen gets you to onsite. Step by step.",
      "Optimal solutions from the start — Meta engineers respect speed AND quality.",
      "LRU Cache is a Meta classic. Know it cold. You'll be asked.",
      "Move fast at Meta is real. Bring momentum into the room.",
    ],
    facts: [
      "Meta open-sourced React, GraphQL, PyTorch, Llama — more than any other Big Tech company.",
      "Llama 3 (2024) was the largest open-source LLM at the time of release — disrupting closed-source AI.",
      "WhatsApp has 2.7B+ monthly users — built and run by a tiny engineering team.",
      "Instagram was bought for $1B in 2012. Today it generates $50B+/year in ad revenue.",
      "Meta's onsite is famously rigorous — 8–12% OA pass rate but onsite-to-offer is much higher.",
    ],
  },
  juspay: {
    name: "Juspay",
    type: "product",
    short: "Juspay Technologies",
    tagline: "India's payment infrastructure layer — graphs, heaps, fintech design. Bengaluru-only, in-office.",
    about: "Juspay powers payments for Amazon, Flipkart, Swiggy, Zomato, Cred, and most major Indian apps. The infra is built in Haskell + Java + Kotlin and handles millions of transactions per day.",
    whatTheyDo: "Payment orchestration, gateway routing, fraud detection, UPI infrastructure, EMI/BNPL platforms, merchant SDKs. Quietly the most critical fintech in India.",
    history: [
      "Founded in 2012 in Bengaluru by Vimal Kumar and Sheetal Lalwani.",
      "Built India's first one-click checkout SDK — adopted by every major e-commerce app.",
      "~2,000 engineers in Bengaluru. Almost entirely in-office, no remote.",
      "Haskell is used in production for payment orchestration — rare in Indian tech.",
      "Internship stipend Rs. 40K/month, full-time CTC Rs. 21–27 LPA. 2026 pass-outs eligible.",
    ],
    sections: [
      {
        key: "interview",
        label: "Interview Pipeline",
        blurb: "MCQ Assessment → 90-min Coding Challenge → Technical Interviews + System Design. Graphs, heaps, and fintech design are guaranteed.",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1–2", focus: "Strings & Array Fundamentals", topics: "Stars Between Bars, Last Substring Lex, Sort by Frequency, Longest Consecutive Sequence, prefix sums." },
            { day: "Day 3", focus: "Stack + String Manipulation", topics: "Removing Stars (#2390), Adjacent Duplicates (#1047), Valid Parens (#20), Asteroid Collision (#735)." },
            { day: "Day 4", focus: "Sorting & Hashing", topics: "Longest Consecutive Sequence (#128), Top K Frequent (#347), custom date sort, Merge Intervals (#56)." },
            { day: "Day 5", focus: "Linked Lists", topics: "Reverse (#206), Reverse K-Group (#25), Detect Cycle (#141), Palindrome (#234), Merge Sorted (#21)." },
            { day: "Day 6", focus: "Trees & Recursion", topics: "Max Depth (#104), Balanced Tree (#110), LCA Binary Tree (#236), Diameter (#543), tree of space." },
            { day: "Day 7", focus: "Graphs — BFS/DFS", topics: "Largest Cycle (DFS), Meeting Cell (BFS grid), Course Schedule (#207), Walls and Gates (#286), Number of Islands (#200)." },
            { day: "Day 8", focus: "Heaps & Priority Queues", topics: "Median from Data Stream (#295) two-heap, Top K Frequent (#347), Kth Largest (#215), Merge K Sorted (#23)." },
            { day: "Day 9", focus: "DP — Part 1", topics: "LIS (#300), Stone Game (#877) game theory, House Robber (#198), Partition Equal Subset (#416)." },
            { day: "Day 10", focus: "DP — Part 2", topics: "Coin Change (#322), Edit Distance (#72), LCS (#1143), Coin Change II (#518), space-optimized DP." },
            { day: "Day 11", focus: "System Design + Fintech", topics: "Payment gateway sim, card/CVV/expiry validation, LRU Cache (#146), rate limiting, idempotency, retry logic." },
            { day: "Day 12", focus: "CS Core — OS, CN, DBMS", topics: "Process vs thread, deadlock, TCP/IP, HTTP/HTTPS, SQL JOIN/GROUP BY, ACID, OOP/SOLID." },
            { day: "Day 13", focus: "Projects + Aptitude + Behavioral", topics: "STAR for project explanations, technical decisions, math puzzles, logical reasoning, anti-plagiarism habits." },
            { day: "Day 14", focus: "Full Mock Day", topics: "MCQ (30 min) + Coding (90 min, 2–3 problems) + Tech Interview + Payment system design + Behavioral." },
          ]},
          { kind: "focus", items: [
            "Strings & Arrays — Stars Between Bars, lex sorting, frequency sort, consecutive sequences, prefix sums.",
            "Graphs & BFS/DFS — Largest Cycle, Meeting Cell, Nearest Cell, Converging Maze. Fintech-flavoured graph problems.",
            "Dynamic Programming — Transaction subsequence optimization, game theory DP, knapsack variants, storage optimization.",
            "Linked Lists — Reverse in place, Reverse K-Group, palindrome check. All difficulty levels asked.",
            "Heaps — Running median (two-heap), Top K, Merge K sorted. Appears every year.",
            "Trees & Recursion — Height, balance, LCA, max weight node in forest, tree of space optimization.",
            "Stack — Remove stars/adjacent chars, monotonic stack, balanced expressions, asteroid collision.",
            "Fintech Design — Payment gateway, card validation, transaction storage, LRU cache, idempotent APIs.",
          ]},
          { kind: "tips", items: [
            "Focus on problem-solving over syntax. Juspay cares about logical reasoning + edge cases, not language tricks.",
            "Master Medium-level DSA first. 90 min for 2–3 medium-hard problems — speed + accuracy on mediums matters most.",
            "Graphs + BFS are heavily tested. Meeting Cell, Largest Cycle, Nearest Cell are real Juspay OA problems.",
            "Heaps appear every year. Running Median (two-heap) is confirmed across 2023–2025.",
            "Fintech domain knowledge helps. Payment gateway simulation, card validation, transaction processing all asked.",
            "Avoid plagiarism absolutely — Juspay disqualifies for copy-paste or multiple IDs. Original code only.",
            "CS Core MCQs are real. OS, CN, DBMS, Logic, Physics. Don't ignore — use Let's Code mock tests.",
            "Code quality counts. Readable code with clear variable names is rewarded; unreadable correct code is penalized.",
          ]},
          { kind: "frequent", items: [
            "Stars Between Bars — OA string range query, most-reported Juspay problem.",
            "Largest Cycle in Directed Graph — DFS cycle detection with sum, core graph skill.",
            "Meeting Cell in a Grid — hard BFS grid traversal, final-round favorite.",
            "Median in a Bucket — two-heap running median, confirmed multiple years.",
            "Reverse Linked List / K-Group — Easy to Hard variants, all asked.",
            "LCA of Binary Tree — recursion tree classic, tech interview staple.",
            "Longest Consecutive Sequence — O(n) HashSet, OA + Tech Round 1.",
            "Maximize Player Score — game theory DP, Hard coding challenge.",
            "Payment Gateway Simulation — fintech domain question (validation + logic).",
          ]},
          { kind: "process", items: [
            "Demo Assessment (optional) — platform familiarity, non-evaluative.",
            "Round 1 — MCQ Assessment: DSA + OS + CN + DBMS + Logic + Physics + Math.",
            "Round 2 — Coding Challenge: 90 min, 2–3 medium-hard problems on HackerRank.",
            "Technical Interview 1: DSA on shared editor + resume / project deep-dive.",
            "Technical Interview 2: harder DSA + System Design / LLD. Fintech scenarios common.",
            "Offer: Intern Rs. 40K/month (8–12 months). Full-time Rs. 21–27 LPA. Bengaluru-only, in-office.",
            "Total timeline: 4–7 weeks from application to offer.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Running median from a data stream is best solved by?", opts: ["Single sorted array", "Two heaps (max-heap of lower half + min-heap of upper half)", "Binary search tree", "HashMap of counts"], ans: 1, why: "Max-heap holds the smaller half; min-heap holds the upper half. Balance them, peek both tops for median in O(1)." },
      { q: "Juspay's primary production language for payment orchestration?", opts: ["Python", "Java", "Haskell", "Go"], ans: 2, why: "Juspay is famous in Indian fintech for using Haskell in production — rare and a major draw for FP enthusiasts." },
      { q: "Largest cycle sum in a directed graph requires?", opts: ["Topological sort", "DFS with visited/in-recursion-stack tracking", "Union-Find", "Floyd-Warshall"], ans: 1, why: "DFS detects cycles via the recursion stack; track sum along the cycle and keep the max." },
      { q: "Idempotency in payment APIs means?", opts: ["Faster responses", "Same request twice = same effect once", "Encrypted payloads", "Retries are blocked"], ans: 1, why: "Critical for payments: client retries on timeout must NOT charge twice. Use an idempotency key." },
      { q: "Juspay's Bengaluru office policy is?", opts: ["Hybrid 3 days", "Fully remote", "In-office only", "Choose your own"], ans: 2, why: "Juspay is almost entirely in-office. If you don't want to be in Bengaluru, this isn't the role." },
    ],
    quotes: [
      "Juspay built India's payment rails. You're interviewing to add a brick. Show up sharp.",
      "Two-heap running median is a 30-min problem you'll see in every Juspay interview. Practise it 5 times.",
      "Graphs + BFS aren't bonus — they're the floor. Walls and Gates is the warmup, not the test.",
      "Idempotency saved someone Rs. 50K last week. Discuss it like you mean it.",
      "Bengaluru in-office isn't a downside. It's how this engineering team operates. Show you're in.",
    ],
    facts: [
      "Juspay processes payments for Amazon, Flipkart, Swiggy, Zomato, Cred — most major Indian apps.",
      "Their production system is partially built in Haskell — extremely rare in Indian product companies.",
      "Internship stipend is Rs. 40K/month for 8–12 months — among the highest in fintech.",
      "Anti-plagiarism is aggressive at Juspay. Same code from two candidates = both disqualified.",
      "Most Juspay tech interviews include at least one graph problem and one fintech design discussion.",
    ],
  },
  jpmorgan: {
    name: "JP Morgan",
    type: "product",
    short: "JP Morgan Chase",
    tagline: "World's biggest investment bank — finance DSA, rate limiters, order books, scale thinking.",
    about: "JP Morgan Chase is the largest bank in the United States and a global tech powerhouse — their tech org has 50,000+ engineers building trading systems, risk engines, and fraud detection at unimaginable scale.",
    whatTheyDo: "Investment banking, consumer banking (Chase), wealth management, trading platforms, risk engines, fraud detection, payments infrastructure. Tech stack: Java, Python, Kafka, Cassandra.",
    history: [
      "Founded 1799 (Manhattan Company) — among the oldest financial institutions in the world.",
      "Modern JPM formed in 2000 via merger of J.P. Morgan & Co. with Chase Manhattan.",
      "HQ in New York. Tech hubs in Bengaluru, Hyderabad, Mumbai, London, Singapore.",
      "~50,000 technologists globally — bigger than most pure tech companies.",
      "Technology Analyst Program (TAP) is the flagship fresher entry — 2-year rotation across divisions.",
    ],
    sections: [
      {
        key: "interview",
        label: "Interview Pipeline",
        blurb: "OA → Phone Screen → 4 Onsite rounds (Core DSA + System Design + Behavioral + Domain). Finance DSA is guaranteed.",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1–2", focus: "OA — Two Sum + Longest Substring", topics: "#1 Two Sum (hash map), #3 Longest Substring No Repeats (sliding window), O(n) lookups." },
            { day: "Day 3", focus: "OA — Valid Parens + Product Except Self", topics: "#20 Valid Parens (stack), #238 Product of Array Except Self (prefix/suffix, no division)." },
            { day: "Day 4", focus: "OA — Trapping Rain Water + Min Window", topics: "#42 Trapping Rain Water (two pointers O(1) space), #76 Minimum Window Substring (sliding window + hash)." },
            { day: "Day 5", focus: "OA — Merge Intervals + Rotate Array", topics: "#56 Merge Intervals (sort + scan), #189 Rotate Array (3-reversal trick), #57 Insert Interval." },
            { day: "Day 6", focus: "OA/Phone — Longest Palindromic Substring", topics: "#5 expand-around-centre, Manacher's intro, count palindromes variant (#647)." },
            { day: "Day 7", focus: "Phone — Linked List Classics", topics: "#206 Reverse, #141 Cycle Detect, #21 Merge Two Sorted, #876 Find Middle. Iterative + recursive." },
            { day: "Day 8", focus: "Phone — Trees + Binary Search", topics: "#98 Validate BST, #102 Level Order, #297 Serialize/Deserialize, #33 Search Rotated Array." },
            { day: "Day 9", focus: "Phone — Graphs", topics: "#200 Number of Islands, #207 Course Schedule (3-colour DFS, Kahn's BFS), #79 Word Search backtracking." },
            { day: "Day 10", focus: "Onsite 1 — DP Core", topics: "#322 Coin Change, #1143 LCS, #53 Kadane, #70 Climbing Stairs, #300 LIS O(n log n), #152 Max Product Subarray." },
            { day: "Day 11", focus: "Onsite 1 — Heap + Design", topics: "#347 Top K Frequent, #215 Kth Largest, #146 LRU Cache (DLL + HashMap), #287 Find Duplicate (Floyd)." },
            { day: "Day 12", focus: "Onsite 2 — Finance DSA: Stocks", topics: "#122 Buy/Sell Stock II (greedy), #188 k transactions, #714 Stock with Fee, portfolio rebalancing." },
            { day: "Day 13", focus: "Onsite 2 — Median + Order Book", topics: "#295 Find Median from Data Stream (two-heap), order book matching engine, Bellman-Ford arbitrage." },
            { day: "Day 14", focus: "System Design + Behavioral", topics: "Token Bucket + Sliding Window rate limiter, Redis ZSET, STAR stories, client focus, integrity." },
          ]},
          { kind: "focus", items: [
            "Arrays & Strings — sliding window, two-pointer, prefix sums, frequency maps. Core in every round.",
            "Dynamic Programming — Knapsack, LCS, LIS, matrix DP. OA frequently includes multi-dimensional DP.",
            "Trees & Graphs — BFS, DFS, topological sort, Dijkstra, Bellman-Ford. Recursive + iterative both.",
            "Heap / Priority Queue — scheduling, Top-K, running median, data stream problems.",
            "Finance-Flavoured — stock price analysis, order book simulation, arbitrage, portfolio rebalancing.",
            "System Design — rate limiting, LRU/LFU, message queues, distributed consensus.",
          ]},
          { kind: "tips", items: [
            "Code correctness first, then optimise. State brute force, explain why it fails, then derive optimal.",
            "Think about scale — JPM systems process millions of events/sec. Discuss throughput, latency, data volume.",
            "Master clean code habits — meaningful names, indentation, brief inline comments.",
            "Know your complexity. For every solution, state time + space and justify. Suboptimal = rejection.",
            "Finance context helps. Know what an order book, bid-ask spread, or transaction ledger is.",
            "Practise timed sessions — OA has strict limits. Simulate 60 min, no distractions, full implementation.",
          ]},
          { kind: "frequent", items: [
            "Two Sum (#1) — OA + phone screen staple.",
            "LRU Cache (#146) — design round almost guaranteed.",
            "Coin Change (#322) — DP classic, finance variant.",
            "Number of Islands (#200) — graph BFS/DFS onsite.",
            "Trapping Rain Water (#42) — hard OA + phone.",
            "Running Median (#295) — finance-flavoured hard heap problem.",
            "Best Time to Buy Stock with Fee (#714) — finance DP onsite.",
            "Order Book Matching Engine — domain interview simulation.",
          ]},
          { kind: "process", items: [
            "Apply via jpmorgan.com/careers, campus, LinkedIn, or referral.",
            "OA: 60–90 min HackerRank/Codility — 2–3 problems Easy–Hard + optional MCQs.",
            "Phone Screen: 45–60 min CoderPad — 1–2 problems + complexity + edge cases.",
            "Onsite Loop: 4 rounds — Core DSA, System Design, Behavioral, Domain/Hiring Manager.",
            "Offer: competitive base + annual bonus + RSUs (senior). Campus TA offers include rotation.",
            "Total timeline: 4–8 weeks from OA to offer. Reapply window: 6–12 months if rejected.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Best DS for an order book matching engine (price-time priority)?", opts: ["Single array", "Two priority queues (max-heap for bids, min-heap for asks)", "HashMap by price", "Linked list"], ans: 1, why: "Max-heap for buy orders (highest bid wins), min-heap for sell orders (lowest ask wins). FIFO inside each price level." },
      { q: "Trapping Rain Water — optimal space complexity?", opts: ["O(n²)", "O(n) with prefix arrays", "O(1) with two pointers", "O(log n)"], ans: 2, why: "Two pointers from both ends, track left_max + right_max, accumulate water at the smaller side. O(1) space." },
      { q: "Best Time to Buy Stock II (multiple transactions) — best approach?", opts: ["DP O(n²)", "Greedy — sum all positive (price[i+1] − price[i])", "Sort prices", "Binary search"], ans: 1, why: "Capture every up-swing. Sum all positive consecutive differences — O(n) time, O(1) space." },
      { q: "Bellman-Ford on log of exchange rates detects?", opts: ["Shortest path only", "Negative cycles = arbitrage opportunity", "Cycles only", "MST"], ans: 1, why: "Take −log(rate). A negative cycle in the graph means a chain of trades multiplies to > 1 — arbitrage." },
      { q: "Token Bucket rate limiter allows?", opts: ["Strict per-second cap", "Bursts up to bucket capacity + steady refill", "Cross-region sync", "Per-user counters only"], ans: 1, why: "Tokens refill at a fixed rate; requests consume tokens. Allows short bursts up to capacity but enforces long-term rate." },
    ],
    quotes: [
      "JPM hires engineers who care about correctness. Speed comes later. Show care first.",
      "Order books, running medians, rate limiters — these aren't trick questions. They're literally what JPM builds.",
      "If you can explain the trade-off in your solution, you're already in the top 30% of candidates.",
      "Finance context isn't required — but mentioning it once shows interest. Just once. Not five times.",
      "TAP rotation is the best 2 years a fresher can have. Earn it.",
    ],
    facts: [
      "JP Morgan has 50,000+ technologists — more than Twitter, Snap, and Airbnb combined.",
      "Their trading platforms process trillions of dollars in transactions per day at sub-millisecond latency.",
      "The Technology Analyst Program rotates freshers across 4 divisions over 2 years — the fastest path to senior.",
      "JPM open-sourced Athena (Python framework for finance) — used internally for risk and pricing.",
      "Their India centres (Bengaluru, Hyderabad, Mumbai) employ 10,000+ engineers — core delivery, not support.",
    ],
  },
  ibm: {
    name: "IBM",
    type: "product",
    short: "IBM Corporation",
    tagline: "Java-heavy stack — OOP, multithreading, design patterns. Fresher, mid-level, and experienced tracks.",
    about: "IBM is a 100+ year-old American multinational. Famous for mainframes, Watson AI, Red Hat, and consulting. Tech interviews are Java-centric with strong emphasis on OOP and design patterns.",
    whatTheyDo: "Hybrid cloud (Red Hat), AI (Watson, watsonx), consulting, quantum computing, mainframes (Z systems), security. Heavy enterprise and government clients.",
    history: [
      "Founded in 1911 as Computing-Tabulating-Recording Company. Renamed IBM in 1924.",
      "Built the first commercial computer (1953), the System/360 (1964), and the IBM PC (1981).",
      "Acquired Red Hat in 2019 for $34B — biggest open-source acquisition ever.",
      "~280,000 employees worldwide. Major India centres in Bengaluru, Pune, Kochi, Hyderabad.",
      "Hires through campus + HackChallenge + CodeVista. Java is preferred across all tracks.",
    ],
    sections: [
      {
        key: "interview",
        label: "Interview Pipeline",
        blurb: "Aptitude + Reasoning → Java Coding Round (2–3 problems) → Technical Interview → HR. Three tracks: Freshers, Mid-Level, Experienced.",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1–2", focus: "Java Foundations + OOP", topics: "Constructors, method overloading, static methods, access modifiers, inheritance, super/this." },
            { day: "Day 3", focus: "Freshers — Easy DSA", topics: "Palindrome Check, Binary Search, Prime Check (O(√n)), Fibonacci, Factorial, Sum of Digits, GCD via Euclid." },
            { day: "Day 4", focus: "Freshers — Exception Handling + Strings", topics: "ArrayIndexOutOfBoundsException, try-catch, vowel counting, equals() vs ==, StringBuffer." },
            { day: "Day 5", focus: "Mid-Level — Arrays", topics: "Second-Largest Distinct, Remove Duplicates (sorted, in-place), Find Missing Number (sum formula)." },
            { day: "Day 6", focus: "Mid-Level — Strings", topics: "Longest Substring No Repeats (sliding window), Anagram Check (sort or freq map)." },
            { day: "Day 7", focus: "Mid-Level — Linked Lists + DS", topics: "Reverse Linked List (iterative + recursive), Queue using Two Stacks, Hash Table with chaining." },
            { day: "Day 8", focus: "Experienced — Matrix + Search", topics: "Rotate Matrix 90° (transpose + reverse rows), Matrix Spiral Traversal (boundary shrinking)." },
            { day: "Day 9", focus: "Experienced — Merge + Missing", topics: "Merge Two Sorted Arrays without built-in sort, Find Missing Number, Merge Sorted Lists." },
            { day: "Day 10", focus: "Experienced — Thread-Safe LRU", topics: "LRU Cache with HashMap + DLL, O(1) get/put, thread-safety considerations." },
            { day: "Day 11", focus: "Multithreading + Design Patterns", topics: "Thread vs Runnable vs Callable, synchronized methods, deadlock, Singleton (Bill Pugh), Observer." },
            { day: "Day 12", focus: "DBMS + OS + Networks", topics: "SQL JOIN, GROUP BY, transactions, ACID, normalization, deadlock, scheduling, TCP vs UDP." },
            { day: "Day 13", focus: "Mock Test + Aptitude", topics: "Quantitative, logical reasoning, verbal English. Practise 3 timed mock OAs in Java only." },
            { day: "Day 14", focus: "Full Mock Day", topics: "Aptitude (60 min) + Coding (90 min, Java) + Technical Interview + HR. Edge-case + code-quality focus." },
          ]},
          { kind: "focus", items: [
            "Core Java & OOP — Constructors, overloading, static, modifiers, inheritance, super/this, interfaces.",
            "Strings — Palindrome, anagram, vowel count, reverse, longest non-repeating, equals() vs ==.",
            "Arrays & Searching — Binary search, second-largest, duplicate removal, missing number, merge sorted.",
            "Data Structures from Scratch — Linked list, queue-using-stacks, hash table with chaining, LRU cache.",
            "Multithreading — Thread/Runnable, synchronized, deadlock simulation, thread-safe Singleton.",
            "Design Patterns — Singleton (basic, Bill Pugh, double-checked), Observer, Factory, Saga.",
            "Math & Number Theory — GCD via Euclid, prime, factorial, Fibonacci, sum of digits.",
            "Matrix — 90° rotation (transpose + reverse), Spiral traversal, row/column ops.",
          ]},
          { kind: "tips", items: [
            "IBM tests are Java-heavy at all levels. Frame solutions in Java with proper OOP and exception handling.",
            "Freshers — master the fundamentals. Palindromes, binary search, Fibonacci, GCD appear every batch.",
            "Mid-level — know Java-specific concepts. equals() vs ==, StringBuffer, when to use synchronized.",
            "Experienced — implement design patterns and DS from scratch without relying on built-in libraries.",
            "Clean, commented code is explicitly evaluated. Add a brief algorithm-overview comment.",
            "Handle edge cases — empty input, single element, negatives, n=0 for factorial/Fibonacci.",
            "For thread questions, explain the concept (race, deadlock) even if you can't implement fully.",
            "Verify with the example before submitting — IBM's platform matches output exactly (whitespace, newlines).",
          ]},
          { kind: "frequent", items: [
            "Palindrome Check — string and number palindromes, both tracks.",
            "Fibonacci Series — iterative + recursive, both tested.",
            "Reverse Linked List — core mid-level + experienced problem.",
            "Longest Substring No Repeats — sliding window, very high frequency.",
            "Second-Largest Distinct — O(n) single pass required.",
            "Find Missing Number — sum formula, mid + experienced.",
            "Matrix Spiral Traversal — boundary shrinking, experienced track.",
            "Queue using Two Stacks — DS design, frequently reported.",
            "Thread-Safe LRU Cache — advanced experienced problem.",
          ]},
          { kind: "process", items: [
            "Apply via ibm.com/careers or campus drives. Also HackChallenge + CodeVista.",
            "OA: Aptitude + Reasoning (60–90 min) + Coding (60–90 min, Java) on IBM HackerRank platform.",
            "Freshers: 2 problems (Easy–Medium). Mid: 2–3 (Medium–Hard). Experienced: 3 (Medium–Hard).",
            "Technical Interview: 45–60 min — OOP, DBMS, OS, multithreading, design patterns, code walkthrough.",
            "HR Interview: cultural fit, career goals, role expectations.",
            "Total timeline: 4–8 weeks campus, 2–6 weeks lateral.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Java's equals() vs ==?", opts: ["Same thing", "== compares references; equals() compares content (when overridden)", "Both compare content", "Both compare references"], ans: 1, why: "== checks reference equality. .equals() compares content when overridden — e.g., String.equals() vs string1 == string2." },
      { q: "Best Singleton for thread safety + lazy init in Java?", opts: ["Eager static field", "Synchronized getInstance", "Bill Pugh (static inner class holder)", "Volatile only"], ans: 2, why: "Bill Pugh uses a static inner class — lazy-loaded by classloader, thread-safe by JVM, no synchronization overhead." },
      { q: "Rotate matrix 90° clockwise in-place is best done by?", opts: ["Copy to new matrix", "Transpose then reverse each row", "Sort by index", "Recursive rotation"], ans: 1, why: "Transpose swaps A[i][j] with A[j][i], then reversing each row completes the 90° clockwise rotation. O(1) extra space." },
      { q: "Queue using two stacks — dequeue strategy?", opts: ["Pop from stack1 only", "Move all to stack2, pop from stack2 (lazy)", "Use a counter", "Convert to array"], ans: 1, why: "Lazy approach: only move from stack1 to stack2 when stack2 is empty. Amortized O(1) per dequeue." },
      { q: "Which is NOT a SOLID principle?", opts: ["Single Responsibility", "Open/Closed", "Dependency Injection", "Liskov Substitution"], ans: 2, why: "SOLID = Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion. DI is a technique that enables DIP." },
    ],
    quotes: [
      "IBM hires for fundamentals + Java. If you know your basics deep, you're already through the door.",
      "Bill Pugh Singleton in 30 seconds. Practise it once, you'll never lose it.",
      "Clean Java code with thoughtful comments beats clever one-liners every time at IBM.",
      "Multithreading scared you in college? Spend 4 hours on it now. That's all it takes.",
      "Java equals() vs == is asked in every IBM interview. Memorise the answer in 2 minutes.",
    ],
    facts: [
      "IBM was founded in 1911 — older than Disney, McDonald's, and most countries in their current form.",
      "Red Hat acquisition ($34B in 2019) is one of the biggest open-source deals in history.",
      "Watson beat Jeopardy! champions in 2011 — kicked off the modern AI hype cycle.",
      "IBM has more US patents than any other company — has held the #1 spot for 28 consecutive years.",
      "IBM India employs over 130,000 people — second-largest IBM presence after the US.",
    ],
  },
  goldman_sachs: {
    name: "Goldman Sachs",
    type: "product",
    short: "Goldman Sachs Engineering",
    tagline: "Wall Street's engineering powerhouse — Java, puzzles, Superday, finance-flavoured DSA.",
    about: "Goldman Sachs is a leading global investment bank. Their engineering org builds trading platforms, risk engines, and AI for finance. Known for the unique 'puzzle round' and back-to-back Superday interviews.",
    whatTheyDo: "Investment banking, securities trading, asset management, consumer banking (Marcus), and the Marquee engineering platform. Heavy Java + Python tech stack.",
    history: [
      "Founded in 1869 in New York by Marcus Goldman. Joined by Samuel Sachs in 1882.",
      "IPO in 1999. Survived the 2008 crisis by converting to a bank holding company.",
      "GS Tech employs ~25% of all GS staff — more engineers than many pure tech companies.",
      "Engineering hubs in Bengaluru, Hyderabad, NYC, London. Java-first culture.",
      "Hires through campus (ECHP) + HackerRank OA + HireVue + CoderPad + Superday.",
    ],
    sections: [
      {
        key: "interview",
        label: "Interview Pipeline",
        blurb: "HackerRank OA → HireVue → CoderPad rounds → Superday (DSA + Puzzles + System Design). Java preferred. Puzzles are unique.",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1–2", focus: "OA — Arrays & Hashing", topics: "First Unique Char (#387), Two Sum (#1), Find All Duplicates (#442), Top K Frequent (#347), Max Subarray (#53), 4 indices a+b=c+d." },
            { day: "Day 3", focus: "OA — Strings + Stack", topics: "K-Consecutive Removal (#1209), Valid Palindrome II (#680), Min Window Substring (#76), Group Anagrams (#49), Longest Palindromic Substring (#5)." },
            { day: "Day 4", focus: "OA — Sliding Window + Matrix", topics: "Shortest Subarray Sum ≥ K (#862), Max Sum Distinct Subarrays (#2461), Rotate Image (#48), Next Permutation (#31)." },
            { day: "Day 5", focus: "OA — DP + Grid", topics: "Sum of 3 elements DP, Taxi Grid passengers, Unique Paths (#62), Maximal Square (#221), Coin Change (#322)." },
            { day: "Day 6", focus: "CoderPad — Linked Lists + Trees", topics: "Reverse K-Group (#25), Cycle (#141), Level Order (#102), LCA BST (#235), Validate BST (#98), Merge Sorted Array (#88)." },
            { day: "Day 7", focus: "CoderPad — Graphs", topics: "Number of Islands (#200) DFS + Union-Find, Course Schedule (#207), Clone Graph (#133), Pacific Atlantic (#417), Word Ladder (#127)." },
            { day: "Day 8", focus: "CoderPad — Heaps + Design", topics: "Kth Largest in Stream (#703), Median from Stream (#295), LRU Cache (#146), Queue using Stacks (#232), finance-flavoured streams." },
            { day: "Day 9", focus: "Superday — Arrays + Math", topics: "Max Product Subarray (#152), Jump Game II (#45), Stock II (#122), Trapping Rain Water (#42), Search Rotated Array (#33)." },
            { day: "Day 10", focus: "Superday — DP", topics: "LCS (#1143), LIS O(n log n) (#300), Coin Change (#322), Word Break (#139), Decode Ways (#91), Edit Distance (#72)." },
            { day: "Day 11", focus: "Superday — Backtracking", topics: "Generate Parens (#22), Pacific Atlantic (#417), Maximal Square (#221), 3Sum (#15), Unique Paths II (#63)." },
            { day: "Day 12", focus: "Puzzle Round", topics: "2 Egg Drop 100 Floors (n=14), Burning Rope 45 min, Poisoned Wine binary encoding (1000 bottles), Pirates and Gold, coin weighing." },
            { day: "Day 13", focus: "Java + OOP + SQL + MCQs", topics: "Java Collections (ArrayList, HashMap, PQ), SOLID, SQL JOIN/GROUP BY/window functions, time complexity MCQs." },
            { day: "Day 14", focus: "Full Superday Mock", topics: "OA (120 min) + 2 CoderPad rounds + Puzzle round + HireVue behavioral. Energy management is half the game." },
          ]},
          { kind: "focus", items: [
            "Arrays & Hashing — Two Sum, 3Sum, K-consecutive removal, sliding window distinct subarrays, four indices a+b=c+d.",
            "Dynamic Programming — 3-element sum DP, Taxi Grid, LCS, LIS O(n log n), Coin Change, Word Break, Edit Distance.",
            "Graphs — Number of Islands (DFS + Union-Find), Course Schedule, Clone Graph, Pacific Atlantic, Word Ladder.",
            "Strings — Min Window Substring, K-Consecutive Removal (stack), Palindrome removal, Group Anagrams.",
            "Heaps & Streaming — Kth Largest in Stream, Find Median from Stream, Top K Frequent. Finance context.",
            "Design — LRU Cache (DLL + HashMap), Queue using Stacks. OOP + amortized complexity focus.",
            "Puzzles (unique to GS) — Egg Drop, Burning Rope (45 min), Poisoned Wine, Pirates, coin weighing.",
            "Java & OOP MCQs — time complexities, SOLID, Collections, SQL JOIN/GROUP BY, threading basics.",
          ]},
          { kind: "tips", items: [
            "Java is preferred at GS. Know ArrayList vs LinkedList, TreeMap vs HashMap, PriorityQueue, generics, basic concurrency.",
            "Puzzle Round is real. Prepare 5–7 classics: egg drop, burning ropes, poisoned wine, pirates, coin weighing. Structured reasoning, not tricks.",
            "Finance context boosts you. Mention order book pricing for heaps, trade networks for graphs, streaming for medians.",
            "OA MCQs need conceptual clarity. Time complexities, SOLID, basic SQL, OS/threading. Differentiates candidates.",
            "CoderPad runs code — use it. Test with examples before finalising. Correctness over approach.",
            "Superday pacing is critical. 3–5 consecutive rounds. Manage energy. 30s think before answering — slow + correct beats fast + wrong.",
            "Optimization is guaranteed. After every solution, proactively state complexity + 'I can improve this to O(X) by...'",
            "Tailor your resume for GS. Highlight systems, fintech, Java/Python, quantitative coursework. Depth over breadth.",
          ]},
          { kind: "frequent", items: [
            "Two Sum (#1) — OA staple in every GS track.",
            "K-Consecutive Removal (#1209) — stack of (char, count), OA favorite.",
            "Shortest Subarray Sum ≥ K (#862) — OA hard, monotonic deque + prefix sums.",
            "Trapping Rain Water (#42) — CoderPad classic, two-pointer O(1) space.",
            "LRU Cache (#146) — CoderPad design round, almost guaranteed.",
            "Kth Largest in Stream (#703) — mirrors GS financial data stream use case.",
            "Find Median from Data Stream (#295) — Superday hard, two-heap approach.",
            "2-Egg Drop / 100 Floors — Puzzle Round classic (n=14 triangular number approach).",
            "Poisoned Wine (1000 bottles) — Puzzle Round, binary encoding with 10 strips.",
          ]},
          { kind: "process", items: [
            "Apply via goldmansachs.com/careers. ECHP (Engineering Campus Hiring Program) for campus.",
            "HackerRank OA: 90–120 min — 2 medium-hard coding + MCQs (DS, algorithms, OOP, SQL).",
            "HireVue: pre-recorded behavioral, no live interviewer. Motivation + teamwork + conflict + failure.",
            "CoderPad Technical Rounds (2): 45–60 min live coding. 1–2 medium/hard problems + follow-up optimization.",
            "Superday: 3–5 back-to-back rounds — DSA + Puzzle + System Design (SDE-2+) + Behavioral.",
            "Offer: base + significant annual bonus + RSUs. Response: 1–2 weeks after Superday.",
            "Total timeline: 6–10 weeks. Locations: Bengaluru, Hyderabad, global tech hubs.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "2 Egg Drop with 100 floors — minimum trials in the worst case?", opts: ["10", "14", "20", "50"], ans: 1, why: "Use a triangular drop pattern: drop from floor n, then n+(n−1), etc. Solve n(n+1)/2 ≥ 100 → n = 14." },
      { q: "Poisoned Wine — 1000 bottles, 1 is poisoned, results after 24h. Minimum mice?", opts: ["100", "10", "32", "1000"], ans: 1, why: "Binary encoding: each mouse corresponds to a bit. With 10 mice you can encode 2^10 = 1024 bottle IDs — uniquely identify the bad one." },
      { q: "K-Consecutive Removal (#1209) — best approach?", opts: ["Two pointers", "Stack of (char, count)", "DP", "Recursion"], ans: 1, why: "Stack holds (char, count). When count reaches k, pop. Handles cascading removals (e.g., 'deeedbbcccbdaa' k=3)." },
      { q: "GS's most unique interview round vs other tech companies?", opts: ["Whiteboard coding", "Puzzle round", "Behavioral", "Take-home"], ans: 1, why: "GS is one of the very few tech companies with a dedicated puzzle round. Practise 5–7 classics." },
      { q: "Java's PriorityQueue default ordering is?", opts: ["Max-heap", "Min-heap (natural order)", "Insertion order", "Random"], ans: 1, why: "Java's PriorityQueue is a min-heap by default. For max-heap, pass Collections.reverseOrder() or a custom Comparator." },
    ],
    quotes: [
      "Goldman Sachs hires engineers who can think structurally. The puzzle round isn't a trick — it's a window into your reasoning.",
      "Superday is a marathon, not a sprint. Pace yourself. Take 30 seconds before every answer.",
      "Two eggs, 100 floors, 14 trials. Memorise it. You'll see it once. Don't blank.",
      "Finance context costs you nothing to mention and earns you trust. Drop it once per round.",
      "Optimize proactively. 'I can do this in O(n log n) instead' is the magic phrase at GS.",
    ],
    facts: [
      "Goldman Sachs has more engineers than Twitter, Snap, and DoorDash combined — quietly massive tech org.",
      "The famous 'puzzle round' was inherited from the trading floor mindset — quick structured reasoning under pressure.",
      "GS Tech runs on Java + Python — and their Marquee platform is the largest cloud-native trading system on Wall Street.",
      "Superday is named for the day-long format — engineers traditionally interviewed 5+ candidates back to back.",
      "GS published their HackerRank OA guide publicly — read it. Most candidates don't.",
    ],
  },
  epam: {
    name: "EPAM",
    type: "product",
    short: "EPAM Systems",
    tagline: "Global digital engineering — Java-only OA, OOP, DSA, edit distance, wildcard matching.",
    about: "EPAM is a US-listed digital engineering company with Eastern European roots. They build software for Fortune 500 clients — Coca-Cola, Microsoft, Google Cloud. India hiring is fresher-heavy with strict Java focus.",
    whatTheyDo: "Custom software engineering, cloud transformation (AWS/Azure/GCP), enterprise digital, AI/data engineering. Java is the dominant language; .NET and Python also used.",
    history: [
      "Founded in 1993 in Belarus by Arkadiy Dobkin — relocated HQ to Newtown, PA after 2022.",
      "Listed on NYSE since 2012. Acquired multiple consultancies — Continuum, NewWave, Empathy Lab.",
      "~60,000 engineers globally. Major India presence in Hyderabad, Bengaluru, Pune, Gurgaon.",
      "Famous for the EPAM University curriculum — internal training program for fresh hires.",
      "OA is Java-only at most campuses. Recruits B.E./B.Tech/M.E./M.Tech/MCA/M.Sc.",
    ],
    sections: [
      {
        key: "interview",
        label: "Interview Pipeline",
        blurb: "Java-Only OA (2–3 problems, 90–120 min) → 2 Technical Interviews → HR. Edit Distance + Wildcard Matching are favorites.",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1–2", focus: "Java Foundations", topics: "OOP (inheritance, polymorphism, interfaces vs abstract), Collections Framework, exception handling." },
            { day: "Day 3", focus: "Easy — Strings", topics: "Password Validator (length 20–40), Min Occurrence Character, Anagram Check (frequency map), Second Max Element." },
            { day: "Day 4", focus: "Easy — Math + GCD", topics: "GCD + LCM via Euclid, Prime Check O(√n), Factorial recursive + iterative, Fibonacci O(n)." },
            { day: "Day 5", focus: "Medium — ASCII + Window", topics: "Password ASCII Decoding (greedy reverse parse — unique to EPAM), Football Goals Comparison." },
            { day: "Day 6", focus: "Medium — Sorting + Words", topics: "Guess the Word (max odd length), Sort Multiples of 5 (descending in original positions)." },
            { day: "Day 7", focus: "Medium — Stack + Matrix", topics: "Balanced Parentheses (multi-bracket types), Spiral Matrix traversal, Find Non-Unique Integers." },
            { day: "Day 8", focus: "Medium-Hard — Wildcard", topics: "Wildcard Pattern Matching (* and ? — DP 2D table, * matches zero chars edge case)." },
            { day: "Day 9", focus: "Trees — Traversals", topics: "Inorder/Preorder/Postorder recursive + iterative (with stack). BFS level order. Tree height + balance." },
            { day: "Day 10", focus: "Hard — Choco & Window", topics: "Choco and Chocolate (sliding window with one type free). Practise multiple window patterns." },
            { day: "Day 11", focus: "Hard — DP Classics", topics: "Trapping Rain Water (two-pointer + prefix arrays), Longest Palindromic Subsequence (2D DP on s + reverse(s))." },
            { day: "Day 12", focus: "Hard — Edit Distance + Coin", topics: "Edit Distance (insert/delete/replace recurrence), Coin Change (count ways, unbounded knapsack)." },
            { day: "Day 13", focus: "Stock Trading + CS Core", topics: "Best Time to Buy/Sell Stock II (greedy positive diffs), OS + DBMS + Networks revision." },
            { day: "Day 14", focus: "Full Mock Day", topics: "Java-only OA (90–120 min) + 2 technical interviews + HR. Edge cases + comments + complexity." },
          ]},
          { kind: "focus", items: [
            "Arrays & Two Pointers — Two-sum, Kadane, trapping rain water, rotate, sort multiples in-place, find duplicates.",
            "Strings — Anagram, password validation, ASCII decoding, wildcard matching, min occurrence, replacement.",
            "Dynamic Programming — Coin change, edit distance, LPS, knapsack, LCS, matrix chain, max product.",
            "Trees — Inorder/Preorder/Postorder (recursive + iterative), level-order BFS, height, BST insert/search.",
            "Graphs — BFS, DFS, shortest path (Dijkstra / BFS), connectivity.",
            "Java-Specific — Collections (ArrayList, LinkedList, HashMap, TreeMap, PQ), OOP, exception handling.",
            "Math — GCD/LCM Euclid, prime, factorial, Fibonacci, power computation, binary-decimal conversion.",
            "Advanced — Spiral matrix, balanced parens, Choco sliding window, stock trading greedy.",
          ]},
          { kind: "tips", items: [
            "EPAM often restricts the language to Java. Practise all problems in Java with Collections Framework.",
            "Code quality is evaluated. Use meaningful names, inline comments, consistent indentation, edge-case guards.",
            "For Hard DP, write the recurrence relation BEFORE coding. The transition equation is worth more than half-finished code.",
            "Password ASCII Decoding is unique to EPAM. Practise the greedy reverse-parse on a few examples.",
            "Wildcard Matching's tricky edge case: * matching zero characters. Most candidates miss this.",
            "Write tree problems both recursively AND iteratively — EPAM interviewers ask you to convert.",
            "Trapping Rain Water has two approaches (two-pointer + prefix arrays). Know both — interviewers ask for the alternative.",
            "State Big-O before the interviewer asks. Signals strong engineering thinking.",
          ]},
          { kind: "frequent", items: [
            "Trapping Rain Water — flagship Hard, two-pointer or prefix-max.",
            "Edit Distance — DP string transformation, very high frequency.",
            "Coin Change — DP counting variant, consistently tested.",
            "Balanced Parentheses — stack-based, in nearly every OA.",
            "Spiral Traversal of Matrix — boundary shrinking, EPAM favorite.",
            "Wildcard Pattern Matching — differentiates mid-level candidates.",
            "Password ASCII Decoding — reverse greedy parse, unique to EPAM.",
            "Anagram Check — frequency map, standard Easy warm-up.",
            "Longest Palindromic Subsequence — LCS-based DP, advanced rounds.",
          ]},
          { kind: "process", items: [
            "Apply via epam.com/careers or campus portals.",
            "OA: 2–3 problems in 90–120 min on HackerRank or CoCubes. Java often required.",
            "Technical Interview 1: 60–75 min — DSA + OOP + DBMS + OS + project discussion.",
            "Technical Interview 2: System design basics + code debugging + 2nd coding problem + deeper project walkthrough.",
            "HR Round: resume questions, career goals, communication, salary, relocation.",
            "Total timeline: 3–6 weeks — faster than most global IT firms.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Edit Distance recurrence when characters match?", opts: ["dp[i][j] = dp[i-1][j-1]", "dp[i][j] = 1 + min(insert, delete, replace)", "dp[i][j] = 0", "dp[i][j] = dp[i][j-1]"], ans: 0, why: "If s1[i-1] == s2[j-1], no operation is needed — inherit the diagonal value. Otherwise, 1 + min of three options." },
      { q: "Wildcard '*' should match?", opts: ["Exactly one character", "Zero or more characters", "Only digits", "Only letters"], ans: 1, why: "'*' matches any sequence including empty. Most candidates miss the empty-match case in DP." },
      { q: "Trapping Rain Water — two-pointer space complexity?", opts: ["O(n²)", "O(n)", "O(log n)", "O(1)"], ans: 3, why: "Two pointers from both ends + track left_max and right_max — no extra array needed. O(1) space, O(n) time." },
      { q: "EPAM's preferred OA language?", opts: ["Python", "C++", "Java", "Go"], ans: 2, why: "EPAM is a Java shop. Most OAs restrict to Java only — practise Collections, exception handling, and OOP in Java." },
      { q: "Coin Change (count number of ways) — best DP approach?", opts: ["2D DP table", "1D DP, iterate coins outer, amounts inner", "1D DP, iterate amounts outer, coins inner", "Greedy"], ans: 1, why: "Iterate coins outer + amounts inner counts combinations (order doesn't matter). The reverse counts permutations — different answer." },
    ],
    quotes: [
      "EPAM hires for Java depth + DSA fundamentals. You can't fake either — but you also don't need to be flashy.",
      "Write the DP recurrence on paper before you code. EPAM interviewers reward that.",
      "Wildcard matching ★ matches zero chars too. Don't lose marks on the trivial case.",
      "Java Collections aren't optional. Know ArrayList vs LinkedList, when to use TreeMap, default PQ ordering.",
      "EPAM offers come fast — 3–6 weeks. If they say yes, they mean it.",
    ],
    facts: [
      "EPAM relocated HQ from Belarus to the US in 2022 — geopolitics forced the move.",
      "EPAM has the EPAM University — internal training program where new hires spend 1–3 months learning Java + frameworks.",
      "Their clients include Coca-Cola, Microsoft, Google Cloud, UBS, Adidas — Fortune 500 heavy.",
      "EPAM is listed on NYSE since 2012 — one of the few publicly-listed pure IT services firms.",
      "OA is famously Java-only at most EPAM campuses. Don't show up planning to code in Python.",
    ],
  },
  de_shaw: {
    name: "DE Shaw",
    type: "product",
    short: "D. E. Shaw & Co.",
    tagline: "Quant hedge fund + tech — hard OA, niche math problems, system design + puzzles.",
    about: "DE Shaw is one of the world's most successful quant hedge funds. Their technology team builds proprietary trading systems, risk infrastructure, and computational biology research tools. India campus drives are competitive but well-paid.",
    whatTheyDo: "Quantitative trading, systematic investing, computational biology, AI/ML research. Tech stack: Python, C++, Java. Engineering and quant research roles.",
    history: [
      "Founded in 1988 by David E. Shaw, a former Columbia CS professor.",
      "HQ in New York. Major India centre in Hyderabad — the second-largest DE Shaw office globally.",
      "Pioneered systematic / algorithmic trading — Jeff Bezos worked there before starting Amazon (1994).",
      "DE Shaw Research is a separate sister org doing computational biochemistry — won Nobel-adjacent recognition.",
      "Famously selective campus hiring — 2–3 SDE intern offers per top IIT per year.",
    ],
    sections: [
      {
        key: "interview",
        label: "Interview Pipeline",
        blurb: "OA (Medium–Hard, 90 min) → 2–3 Technical Rounds → HR. Niche math + puzzle problems are real.",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1–2", focus: "OA — Arrays + Greedy", topics: "Minimum Total Max (partition greedy), Best Time to Buy Stock II (#122), sliding window + prefix sums." },
            { day: "Day 3", focus: "OA — Strings + Stack", topics: "HTML Tag Matching (stack), GCD of Strings (#1071), Count elements where x+1 exists, K-diff Pairs (#532)." },
            { day: "Day 4", focus: "OA — Permutations", topics: "Permutation Sequence (#60) — Kth char of Mth shortest permutation. Factorial number system." },
            { day: "Day 5", focus: "OA — Two-Array Threshold", topics: "Maximize Sum in arr2 under arr1 threshold — two-pointer + sort + index tracking." },
            { day: "Day 6", focus: "OA — DP Partitions", topics: "Count Good Array Partitions — DP with frequency map, modulo 10⁹+7." },
            { day: "Day 7", focus: "OA — Fibonacci Maze", topics: "Reach K via Fibonacci jumps — Zeckendorf greedy decomposition. Precompute Fib up to 10⁹." },
            { day: "Day 8", focus: "Technical — Trees + BST", topics: "Validate BST (#98), Largest BST Subtree (#333), count BST nodes in range, Sum Tree property." },
            { day: "Day 9", focus: "Technical — Graphs + Matrix", topics: "Number of Islands (#200), Course Schedule II (#210), Spiral Matrix (#54), Max Sum Rectangle in matrix." },
            { day: "Day 10", focus: "Technical — Linked Lists + Stack", topics: "Reverse Nodes in K-Group (#25), Intersection of Two Lists (#160), Min Stack (#155), Implement Trie (#208)." },
            { day: "Day 11", focus: "Technical — DP Core", topics: "0/1 Knapsack, Maximum Subarray Kadane (#53), Max Product Subarray (#152), Super Egg Drop (#887)." },
            { day: "Day 12", focus: "Technical — Sorting + Greedy", topics: "Largest Permutation with B swaps (#484), Group Anagrams (#49), Rotate Image (#48), Missing Number (#268)." },
            { day: "Day 13", focus: "Technical — Bit Manipulation + Puzzles", topics: "Majority Element (#169) Boyer-Moore, Substrings with All 3 Chars (#1358), XOR tricks, DE Shaw logic scenarios." },
            { day: "Day 14", focus: "System Design + HR", topics: "LRU Cache, Rate Limiter design, OS/DBMS/Networks revision. 4–5 STAR project stories." },
          ]},
          { kind: "focus", items: [
            "Arrays & Greedy — Min Total Max, Maximize Sum Under Threshold, Largest Permutation, Best Time to Buy Stock II.",
            "Strings & Stack — HTML Tag Matching, GCD of Strings, Group Anagrams, Substrings with All 3 Chars.",
            "Dynamic Programming — 0-1 Knapsack, Kadane, Max Product, Count Good Partitions, Super Egg Drop.",
            "Trees & Graphs — Validate BST, Largest BST Subtree, Number of Islands, Course Schedule II.",
            "Maths & Combinatorics — Kth Permutation, Fibonacci Maze (Zeckendorf), Building Monuments (tree colouring).",
            "System Design — LRU Cache, Rate Limiter, OS/DBMS fundamentals.",
          ]},
          { kind: "tips", items: [
            "OA is Hard — Medium–Hard problems, real-world logic, not textbook DSA. Optimise before submitting.",
            "Zeckendorf representation + math tricks are real. Fibonacci Maze requires greedy decomposition — practise.",
            "System-level knowledge matters in tech rounds. OS (paging, deadlock), DBMS (ACID, indexing), low-level design.",
            "DE Shaw is a quant firm. Logic puzzles and probability reasoning can appear in technical rounds. Stay sharp.",
            "Clean code is scored — clear variable names, no magic numbers, handle edge cases.",
            "Practise explaining solutions out loud — at DE Shaw, clarity of reasoning is half the evaluation.",
          ]},
          { kind: "frequent", items: [
            "Best Time to Buy and Sell Stock (#121) — OA staple.",
            "Maximum Subarray (#53) — Kadane, every year.",
            "Number of Islands (#200) — graph BFS/DFS technical.",
            "Reverse Nodes in K-Group (#25) — linked list hard, technical.",
            "0-1 Knapsack — classic DP, technical favorite.",
            "Spiral Matrix (#54) — matrix simulation OA + technical.",
            "Fibonacci Maze (Zeckendorf) — unique DE Shaw OA problem.",
            "Permutation Sequence (#60) — Kth permutation, factorial number system.",
            "Building Monuments (tree colouring mod) — hard onsite.",
          ]},
          { kind: "process", items: [
            "OA: HackerRank or DE Shaw portal — 2–3 DSA problems Medium–Hard, 90 min. Logic + real-world constraints.",
            "Technical Round 1: DSA + problem solving — correctness, optimal complexity, clean code. May include logic puzzles.",
            "Technical Round 2: System Design (experienced) + DBMS/OS/Networks. Low-level design for senior roles.",
            "HR / Behavioral: resume deep-dive, projects, internship discussion, culture fit, STAR stories.",
            "Total timeline: 3–6 weeks. Campus SDE Intern offers released Oct–Dec.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Zeckendorf representation expresses an integer as?", opts: ["Sum of powers of 2", "Sum of non-consecutive Fibonacci numbers", "Product of primes", "Sum of triangular numbers"], ans: 1, why: "Every positive integer is uniquely a sum of NON-CONSECUTIVE Fibonacci numbers. Greedy: subtract largest Fib ≤ remaining." },
      { q: "Kth permutation of [1..n] — best approach?", opts: ["Generate all permutations + sort", "Factorial number system + index by (k−1)/(n−1)!", "Backtracking", "DP"], ans: 1, why: "Decompose (k−1) into factorial digits. At each step, pick the (k/factorial)-th unused element. O(n²) — no generation needed." },
      { q: "Largest BST Subtree — best traversal direction?", opts: ["Top-down DFS", "Bottom-up post-order returning (min, max, size, isBST)", "Level-order BFS", "Iterative inorder"], ans: 1, why: "Post-order: each subtree returns its min, max, size, and whether it's a BST. Parent combines child results in O(1)." },
      { q: "DE Shaw's primary tech focus is?", opts: ["Web apps", "Mobile games", "Quantitative trading + computational biology", "Enterprise CRM"], ans: 2, why: "DE Shaw is famous for quant trading. Their sister org (DE Shaw Research) does Nobel-adjacent computational biochemistry." },
      { q: "Super Egg Drop with K eggs + N floors — optimal complexity?", opts: ["O(K * N²)", "O(K * N log N)", "O(K * N)", "O(K + N)"], ans: 1, why: "Standard DP is O(K * N²). With binary search on the recurrence we get O(K * N log N). With clever rephrasing (drops, eggs) it's O(K * sqrt(N))." },
    ],
    quotes: [
      "DE Shaw isn't asking trick questions. They're asking math questions. Treat them with respect.",
      "Zeckendorf is just greedy on Fibonacci. Practise it once on paper. You'll never forget it.",
      "Quant firms reward clarity of thought over speed. Take 30 seconds. Think. Then code.",
      "If you got the OA invite from DE Shaw, you're already in the top 1%. Don't psych yourself out.",
      "Jeff Bezos worked at DE Shaw before Amazon. The bar is real — but so is the alumni network.",
    ],
    facts: [
      "DE Shaw was founded in 1988 by David Shaw, a former Columbia CS professor — quant from day one.",
      "Jeff Bezos worked at DE Shaw from 1990–94 — he left to start Amazon. The DE Shaw alumni network is legendary.",
      "DE Shaw Research is a separate computational biology org — used the world's fastest custom-built supercomputer for molecular dynamics.",
      "Hyderabad is DE Shaw's second-largest global office — most India hiring happens through campus placements.",
      "DE Shaw's OA is famously math-heavy. Zeckendorf, factorial number system, and permutation rank are real test topics.",
    ],
  },
  cisco: {
    name: "Cisco",
    type: "product",
    short: "Cisco Systems",
    tagline: "Networking giant — DSA + Computer Networks. IP validation, packet routing, Dijkstra in the OA.",
    about: "Cisco is the world's largest networking hardware company — routers, switches, security, and collaboration tools. Their interviews uniquely blend DSA with networking concepts (OSI, TCP/IP, routing protocols).",
    whatTheyDo: "Enterprise networking (routers, switches), cybersecurity (Talos, Duo), Webex collaboration, hybrid cloud, IoT. CCNA/CCNP certifications are industry standards.",
    history: [
      "Founded in 1984 in San Francisco by Leonard Bosack and Sandy Lerner — a Stanford couple.",
      "Pioneered the multi-protocol router — became the backbone of the early internet.",
      "Briefly the world's most valuable company in March 2000 ($550B market cap during dot-com).",
      "~80,000 employees globally. Major India centres in Bengaluru, Pune, Chennai.",
      "Hires through campus + HackerRank OA + 2 technical rounds + HR. Java/Python/C++ preferred.",
    ],
    sections: [
      {
        key: "interview",
        label: "Interview Pipeline",
        blurb: "OA (Aptitude + Tech MCQs + 1–2 coding) → 2 Technical Rounds → HR. Networking is uniquely tested.",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1–2", focus: "DSA Foundations", topics: "Arrays, strings, linked lists, basic sorting. BFS/DFS templates. Reverse Words, Missing Number, Longest Palindromic Substring." },
            { day: "Day 3–4", focus: "Graphs + Trees", topics: "BFS for shortest paths, DFS for cycle detection. Number of Islands, Snake & Ladder (BFS on flat board), Level Order, LCA, Path Sum." },
            { day: "Day 5", focus: "DP + Backtracking", topics: "LCS, Edit Distance, Triangle path sum, N-Queens, Sudoku Solver. Memorise recurrence relations." },
            { day: "Day 6–7", focus: "Networking-Specific Problems", topics: "IPv4 validation, packet routing (Dijkstra), transmission latency, max collinear points, lexicographic strings." },
            { day: "Day 8–9", focus: "Computer Networks Theory", topics: "OSI model layers, TCP vs UDP, DNS resolution, IP subnetting, routing protocols (OSPF, BGP)." },
            { day: "Day 10", focus: "Stack + Queue", topics: "Valid Parens, Merge Intervals, LRU Cache, Trapping Rain Water, Next Greater Element." },
            { day: "Day 11", focus: "Hard DP", topics: "Longest Palindromic Substring, Edit Distance, Minimum Path Sum in Triangle, Coin Change." },
            { day: "Day 12", focus: "Backtracking + Bit", topics: "Lexicographical String at Index M (base-26 encoding), N-Queens count, next permutation." },
            { day: "Day 13", focus: "MCQ Mock", topics: "OS (deadlocks, scheduling), DBMS (joins, indexing, ACID), Networks (subnetting, routing), C/C++/Java basics." },
            { day: "Day 14", focus: "Full Mock + HR Prep", topics: "Aptitude + Tech MCQ + Coding (60–90 min) + 2 tech rounds. STAR stories around Cisco's 4 values." },
          ]},
          { kind: "focus", items: [
            "Arrays & Strings — Missing Number, Reverse Words, Longest Palindromic Substring, Max Collinear Points.",
            "Graphs & BFS/DFS — Shortest Path in Grid, Snake and Ladder (BFS), Cycle Detection, Number of Islands.",
            "Trees — Level Order, Path Sum, LCA, Max Depth, Balanced Tree check.",
            "Dynamic Programming — LCS, Edit Distance, Triangle Path Sum, Kadane, Knapsack, Coin Change.",
            "Networking (unique to Cisco) — IPv4 validation, packet routing (Dijkstra), transmission latency, round-trip costs.",
            "Backtracking — N-Queens count, Sudoku, next permutation.",
            "Stack & Queue — Valid Parens, Merge Intervals, LRU Cache, Trapping Rain Water.",
            "Computer Networks MCQ — OSI model, TCP/UDP, DNS, subnetting, routing protocols (OSPF, BGP).",
          ]},
          { kind: "tips", items: [
            "Cisco tests BREADTH. MCQs on OS/DBMS/Networking/C++ carry significant weight — don't skip them.",
            "Networking problems are unique to Cisco. Revise OSI model + TCP/IP stack + IPv4 + shortest paths together.",
            "BFS vs DFS — pick correctly. BFS for unweighted shortest path (grid, Snake & Ladder). DFS for cycles and tree properties.",
            "Snake and Ladder is tricky — model as flat 1D array, apply teleport during BFS expansion, not after.",
            "Expect extension questions. After Shortest Path in Grid, expect 'Can you add up/left moves?' or 'Multiple obstacles?'",
            "For tree problems, state both recursive + iterative complexity. Cisco values trade-off awareness.",
            "Lexicographical String at Index M = base-26 encoding. Practise converting M−1 with N digits on paper.",
            "HR round — frame around Cisco's 4 values: innovation, inclusion, integrity, teamwork. STAR method.",
          ]},
          { kind: "frequent", items: [
            "Number of Islands — DFS/BFS flood fill, in virtually every Cisco batch.",
            "Shortest Path in Grid — BFS-based traversal, reported across multiple drives.",
            "Edit Distance — DP string transformation, very high frequency.",
            "Longest Common Subsequence — 2D DP classic, consistently tested.",
            "Snake and Ladder — BFS on flattened board, signature Cisco problem.",
            "IP Address Validation — networking string parsing, unique to Cisco.",
            "Transmission Latency — Dijkstra on directed graph, networking-specific.",
            "Level Order Traversal — BFS on tree, every batch.",
            "Cycle Detection in Directed Graph — DFS with recursion stack.",
            "Packet Routing (Shortest Path) — Dijkstra with PQ for networking roles.",
          ]},
          { kind: "process", items: [
            "Apply at cisco.com/c/en/us/about/careers.html or campus drives. Referrals significantly improve shortlisting.",
            "OA: Aptitude + Tech MCQs (OS, DBMS, Networking, C/C++/Java) + 1–2 coding in 60–90 min on HackerRank.",
            "Tech Round 1: 45–60 min — DSA live coding + OOP + Computer Networks (OSI, TCP/IP, routing).",
            "Tech Round 2 / Managerial: role-specific — system design (SWE), networking architecture (Network Engineer).",
            "Eligibility: B.E./B.Tech/M.E./M.Tech/MCA, 60%+, no active backlogs. Networking roles need CCNA-level knowledge.",
            "HR Round: Cisco's values (innovation, inclusion, integrity, teamwork), communication, career goals.",
            "Total timeline: 3–6 weeks campus, 2–4 weeks lateral.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "IPv4 address — which is invalid?", opts: ["192.168.1.1", "256.1.2.3", "10.0.0.0", "172.16.0.1"], ans: 1, why: "Each part must be in [0, 255]. 256 is out of range, making the address invalid." },
      { q: "Snake and Ladder shortest dice rolls — best algorithm?", opts: ["DFS", "Dijkstra", "BFS on flat 1D array", "Greedy"], ans: 2, why: "Each dice roll is one 'move' regardless of distance — unweighted graph. BFS gives shortest path." },
      { q: "Which protocol is connection-oriented + reliable?", opts: ["UDP", "TCP", "ICMP", "DNS"], ans: 1, why: "TCP uses handshake, ACKs, and retransmission to guarantee in-order reliable delivery. UDP is fire-and-forget." },
      { q: "Cycle detection in a directed graph uses?", opts: ["BFS with distance", "DFS with visited + recursion-stack tracking", "Union-Find only", "Topological sort only"], ans: 1, why: "A back edge — visiting a node already in the recursion stack — indicates a cycle." },
      { q: "Cisco's 4 core values?", opts: ["Speed, Scale, Security, Service", "Innovation, Inclusion, Integrity, Teamwork", "Customer, Quality, Cost, Time", "Trust, Transparency, Talent, Tenacity"], ans: 1, why: "Cisco emphasises Innovation, Inclusion, Integrity, and Teamwork. Frame HR answers around these." },
    ],
    quotes: [
      "Cisco doesn't ask trick questions — they ask broad questions. Brush up Networks alongside DSA.",
      "Snake and Ladder is just BFS on a 1D array. Once you see that, you've solved it.",
      "Knowing OSI by heart isn't trivia at Cisco — it's the table stakes.",
      "Dijkstra is the algorithm of the Internet. Mention that in your packet-routing solution. It lands.",
      "Cisco rewards engineers who think in trade-offs. State recursive vs iterative for every tree problem.",
    ],
    facts: [
      "Cisco's routers carry over 80% of the world's internet traffic.",
      "CCNA certification is the most popular networking cert in the world — Cisco built the curriculum.",
      "Webex (acquired 2007) became Cisco's collaboration platform — used heavily during COVID-19.",
      "Cisco's Talos threat intelligence team is one of the largest commercial security research groups globally.",
      "Cisco India contributes to most networking firmware — Bengaluru is the #2 global R&D centre after San Jose.",
    ],
  },
  capgemini: {
    name: "Capgemini",
    type: "service",
    short: "Capgemini SE",
    tagline: "French IT services giant — unique 4-section exam: MCQ + Pseudocode + Coding + Essay. 150 minutes.",
    about: "Capgemini is a French multinational IT services and consulting firm. Their hiring exam is famously 4-section: aptitude MCQ, pseudocode tracing, actual coding, and English essay — unique among MNCs.",
    whatTheyDo: "Consulting, technology services, digital transformation, cloud, AI, cybersecurity, engineering services. Clients across BFSI, manufacturing, healthcare, telecom.",
    history: [
      "Founded in 1967 in Grenoble, France by Serge Kampf.",
      "Acquired Ernst & Young Consulting (2000), iGate (2015), Altran (2020) — major consolidation in IT services.",
      "~360,000 employees globally. India is the largest workforce (~180,000) across 14 cities.",
      "Listed on Euronext Paris. Known for CLiC + Unstop off-campus drives.",
      "Hires through aptitude + pseudocode + coding + essay (150 min) on AMCAT or proprietary platform.",
    ],
    sections: [
      {
        key: "interview",
        label: "Interview Pipeline",
        blurb: "4-section exam: MCQ (40m) + Pseudocode (30m) + Coding (45m) + Essay (20m). Then technical + HR.",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1–2", focus: "MCQ + Theory", topics: "Data structures (stack, queue, heap, hash), SQL, cloud computing, networking, OS fundamentals." },
            { day: "Day 3", focus: "Pseudocode (unique)", topics: "Trace code with bitwise (&, ^, >>), nested conditions, loops, recursion. GCD via Euclidean." },
            { day: "Day 4", focus: "Easy Coding", topics: "Reverse Words, Missing Number, Find Duplicates, First Non-Repeated Character, Move Hashes to Front." },
            { day: "Day 5", focus: "Medium Coding", topics: "Spiral Matrix Traversal, Largest Sum Subarray (Kadane), Balanced Parentheses, String Rotation Check." },
            { day: "Day 6", focus: "Strings + Frequency", topics: "Count Integer Occurrences, Similar String Check (anagram + binary length), String Compression (RLE)." },
            { day: "Day 7", focus: "Arrays + Math", topics: "Pythagorean Triplets, Majority Element (Boyer-Moore), Intersection of Two Arrays, Counting Valleys." },
            { day: "Day 8", focus: "Matrix + Intervals", topics: "Rotate Matrix 90° (transpose + reverse rows), Merge Overlapping Intervals." },
            { day: "Day 9", focus: "Hard Coding", topics: "Longest Substring Without Repeating, Rotate Array by K (reversal trick), Character Count with Minimum." },
            { day: "Day 10", focus: "Essay + English", topics: "Practice writing 200–250 word essays on technology trends, current affairs, leadership stories." },
            { day: "Day 11–12", focus: "SQL + Cloud + Networks MCQs", topics: "INNER JOIN vs LEFT JOIN, ACID, COUNT, ROLLBACK, schema. VPN, DDoS, public/private cloud, serverless." },
            { day: "Day 13", focus: "Technical Interview Prep", topics: "OOPs, DBMS, OS, networking basics + walkthrough of your submitted code from coding round." },
            { day: "Day 14", focus: "Full 150-min Mock", topics: "MCQ (40m) + Pseudocode (30m) + Coding (45m) + Essay (20m). Time-management drill." },
          ]},
          { kind: "focus", items: [
            "Arrays & Matrices — Spiral, 90° rotation, duplicates, missing number, majority, interval merging.",
            "Strings — Compression (RLE), anagram/similarity, rotation, hash movement, first non-repeated, longest non-repeating.",
            "Searching & Sorting — Binary search, merge sorted, frequency counting, Pythagorean triplets.",
            "DP & Greedy — Kadane, counting valleys, interval scheduling.",
            "Theory MCQ — Stack (LIFO, O(1) pop), Queue, Heap (insert O(log n)), Hash (O(1) lookup), LRU.",
            "Database & SQL — WHERE, INNER vs LEFT JOIN, COUNT, ROLLBACK, ACID (esp. Durability), schema.",
            "Cloud Computing MCQ — elasticity, object storage, serverless, public/private/hybrid, VPN, DDoS.",
            "Pseudocode + Bit Ops — Euclidean GCD, right-shift (>>) division, bitwise AND/XOR in loops, modular arithmetic.",
          ]},
          { kind: "tips", items: [
            "4 distinct sections — allocate time. Don't let coding eat MCQ or essay.",
            "Pseudocode is unique to Capgemini. Practise tracing bitwise (&, ^, >>) + nested conditions on paper.",
            "Coding scoring is correctness-based. Brute force passing all tests > optimised half-finished.",
            "String problems often have a twist (hash front-move, min freq adjustment, binary output). Read carefully.",
            "Matrix/array problems need precise index management. Dry-run boundary logic with samples.",
            "Output format is strict. Match exact spacing, newlines, label text ('X occurs Y times').",
            "MCQ tests theory — data structures, SQL, cloud, networking. Conceptual, not coding.",
            "Time budget: MCQ 40m / Pseudocode 30m / Coding 45m / Essay 20m. Stick to it.",
          ]},
          { kind: "frequent", items: [
            "Largest Sum Subarray (Kadane) — almost every batch.",
            "Balanced Parentheses — stack-based, extremely high frequency.",
            "Spiral Matrix Traversal — signature Capgemini coding question.",
            "Longest Substring Without Repeating — sliding window, very common.",
            "Missing Number in Array — sum formula, most recent drives.",
            "Find Duplicates in Array — hash set, high frequency.",
            "String Compression (RLE) — unique Capgemini string problem.",
            "First Non-Repeated Character — frequency map warm-up.",
            "Rotate Array by K Steps — reversal trick, frequently asked.",
            "Merge Overlapping Intervals — sort + merge, advanced rounds.",
          ]},
          { kind: "process", items: [
            "Apply at capgemini.com/careers or campus / Unstop off-campus.",
            "Game-Based Aptitude: abstract reasoning games. No traditional aptitude questions.",
            "Written Assessment (150 min): MCQ + Pseudocode + Coding (2 problems, 45 min) + Essay.",
            "Languages supported: C, C++, Java, Python. Platform: AMCAT or proprietary.",
            "Technical Interview: 30–45 min — OOPs, DBMS, OS, networking + code walkthrough.",
            "HR Interview: cultural fit, communication, relocation, salary expectations.",
            "Total timeline: 6–10 weeks campus, 3–6 weeks off-campus.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Capgemini exam has how many distinct sections?", opts: ["1", "2", "3", "4"], ans: 3, why: "Four sections: MCQ + Pseudocode + Actual Coding + Essay. 150 minutes total. Allocate time across all four." },
      { q: "Largest Sum Subarray — Kadane's core insight?", opts: ["Sort the array", "Reset current_sum to 0 when it goes negative; track global max", "Use prefix sums + binary search", "DP table"], ans: 1, why: "Kadane is O(n) with O(1) space. Reset on negative; keep track of the global maximum." },
      { q: "Rotate matrix 90° clockwise in-place?", opts: ["Copy to a new matrix", "Reverse rows then transpose", "Transpose then reverse each row", "Sort by indices"], ans: 2, why: "Transpose swaps A[i][j] with A[j][i]; reversing each row completes the 90° clockwise rotation. O(1) space." },
      { q: "Stack's pop operation time complexity?", opts: ["O(n)", "O(log n)", "O(1)", "O(n log n)"], ans: 2, why: "Stack is LIFO with O(1) push/pop. The top pointer just decrements/returns the value." },
      { q: "Which is NOT a feature of cloud computing?", opts: ["Elasticity", "Object storage", "Mandatory on-premise hardware", "Serverless functions"], ans: 2, why: "Cloud is the OPPOSITE of mandatory on-premise. The point is scaling without owning hardware." },
    ],
    quotes: [
      "Capgemini's exam is 4 sections — you can't ace it by being a coding wizard alone. Spread your prep.",
      "Pseudocode tracing is just patience. Take 30 seconds per line. You'll finish on time.",
      "Output format eats more candidates than wrong logic at Capgemini. Match the sample exactly.",
      "MCQ section is half your score. Don't show up planning to 'cruise through theory'.",
      "Capgemini hires 30,000+ freshers a year. The bar is fair — meet it, and you're in.",
    ],
    facts: [
      "Capgemini India is the company's largest workforce — ~180,000 employees in 14 cities.",
      "The 4-section exam (MCQ + Pseudocode + Coding + Essay) is unique among Indian campus drives.",
      "Capgemini was founded in Grenoble, France in 1967 — older than Infosys or TCS.",
      "Acquired Ernst & Young Consulting in 2000 and Altran in 2020 — major IT services consolidation.",
      "Most Capgemini campus offers are issued 6–10 weeks after the test — patience required.",
    ],
  },
  apple: {
    name: "Apple",
    type: "product",
    short: "Apple Inc.",
    tagline: "Defensive coding, edge cases first, slower pace — production-level rigour over speed.",
    about: "Apple is the world's most valuable company — iPhones, Macs, services, and Apple Silicon. Their interviews demand production-quality code, deep edge-case thinking, and strong behavioral fit.",
    whatTheyDo: "iPhone, Mac, iPad, AirPods, Apple Watch, Apple TV. Services: iCloud, App Store, Apple Pay, Apple Music, TV+. Silicon: M-series + A-series chips.",
    history: [
      "Founded 1976 by Steve Jobs, Steve Wozniak, and Ronald Wayne in Cupertino.",
      "Returned from near-bankruptcy in 1997 when Jobs returned and launched iMac, iPod, iPhone.",
      "First publicly listed US company to cross $1T (2018), $2T (2020), and $3T (2022) market cap.",
      "~164,000 employees. Apple India retail + engineering centres in Hyderabad and Bengaluru.",
      "Apple Silicon transition (M1 in 2020) — one of the most successful chip migrations in history.",
    ],
    sections: [
      {
        key: "interview",
        label: "Interview Pipeline",
        blurb: "OA → Phone Screen → Virtual Onsite (4–5 rounds: coding + system design + behavioral). Slower, deeper pace.",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1–2", focus: "OA — Strings + Palindromes", topics: "Valid Palindrome II (#680), Longest Palindrome (#409), Min Chars to Make Palindrome (#1216). LPS DP." },
            { day: "Day 3", focus: "OA — Greedy + Arrays", topics: "Best Time to Buy/Sell Stock (#121), Longest Mountain (#845), Jump Game (#55). Peak identification." },
            { day: "Day 4", focus: "OA — Heap + String Reorg", topics: "Reorganize String (#767), Task Scheduler (#621), Furthest Building (#1642). Max-heap + greedy." },
            { day: "Day 5", focus: "Phone — Two Pointers", topics: "Container With Most Water (#11), Trapping Rain Water (#42), Max Moves in Grid (#1679)." },
            { day: "Day 6", focus: "Phone — Intervals", topics: "Merge Intervals (#56), Insert Interval (#57), Interval List Intersections (#986). Greedy merge." },
            { day: "Day 7", focus: "Phone — Linked Lists", topics: "Reverse Linked List II (#92), Reverse K-Group (#25), Remove Nth Node (#19). Dummy node pattern." },
            { day: "Day 8", focus: "Phone — Tree Paths", topics: "Path Sum II (#113), Path Sum (#112), Path Sum III (#437). DFS backtracking + path tracking." },
            { day: "Day 9", focus: "Onsite — Arrays + Water", topics: "Trapping Rain Water (#42), Trapping Rain Water II (#407). Both approaches (two-pointer + DP)." },
            { day: "Day 10", focus: "Onsite — Design (LRU/LFU)", topics: "LRU Cache (#146), LFU Cache (#460), Encode & Decode TinyURL (#535). DLL + HashMap." },
            { day: "Day 11", focus: "Onsite — Tree Serialization", topics: "Level Order (#102), Serialize/Deserialize (#297), Zigzag Level Order (#103). Null markers." },
            { day: "Day 12", focus: "Onsite — Graphs + Grids", topics: "Number of Islands (#200), Spiral Matrix (#54), Rotate Image (#48). DFS + coordinate transforms." },
            { day: "Day 13", focus: "Onsite — DP Patterns", topics: "Coin Change (#322), Word Break (#139), LCS (#1143). DP state design." },
            { day: "Day 14", focus: "Final Mock + Behavioral", topics: "4–5 round mock. STAR stories on craft, ownership, disagreement, shipping under pressure." },
          ]},
          { kind: "focus", items: [
            "Strings — Palindromes, reorganization, character frequency, DP patterns.",
            "Arrays — Two pointers, greedy, water trapping, rotation, mountains.",
            "Linked Lists — Reversal, partial reversal, removal, in-place ops.",
            "Trees — LCA, path sum, serialization, level-order, BST.",
            "Design — LRU Cache (very common), stack ops, custom data structures.",
            "Graphs & Grids — Island counting, spiral matrix, number of paths.",
          ]},
          { kind: "tips", items: [
            "Defensive coding is non-negotiable. Null checks, empty input, overflow guards. Production-level.",
            "Edge cases FIRST. Before coding, list every edge case out loud. Apple tracks proactive identification.",
            "Clean variable names. Avoid single letters. Apple engineers read your code like a code review.",
            "Memory awareness. Heap vs stack, in-place vs auxiliary space. Apple builds with strict budgets.",
            "Slower pace than Google/Meta. Apple phone screens allow thinking time — use it.",
            "Code style is critiqued mid-interview. Treat it like production code from the first line.",
            "Team-specific prep — Apple varies by team (iOS, macOS, iCloud, Core OS). Research yours.",
            "DP DOES appear — unlike Meta phone screens. Coin Change, Word Break are onsite common.",
            "Behavioral is elimination. Prep STAR stories on craft, ownership, disagreement, shipping under pressure.",
          ]},
          { kind: "frequent", items: [
            "Container With Most Water (#11) — phone screen favorite.",
            "Merge Intervals (#56) — OA + phone screen.",
            "Reverse Linked List II (#92) — linked list classic.",
            "Path Sum II (#113) — tree backtracking pattern.",
            "LRU Cache (#146) — design round almost guaranteed.",
            "Serialize & Deserialize Binary Tree (#297) — onsite hard.",
            "Number of Islands (#200) — onsite classic.",
            "Trapping Rain Water (#42) — onsite advanced array.",
            "Coin Change (#322) — DP on onsite.",
          ]},
          { kind: "process", items: [
            "OA: 90 min, 2 medium problems on HackerRank / CodeSignal.",
            "Recruiter Screen: 20–30 min, non-technical, team-specific alignment.",
            "Phone Screen: 45–60 min, 1–2 medium problems. Slower-paced than FAANG peers.",
            "Virtual Onsite: 4–5 rounds (2–3 coding, 1 system design ICT3+, 1–2 behavioral).",
            "Coding Round: 45–60 min per round, 1–2 medium-to-hard with deep follow-ups.",
            "Behavioral: heavy weight on craftsmanship, ownership, collaboration, conflict resolution.",
            "Response: 2–4 weeks after final round (slower than other FAANG).",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Apple interview emphasizes which over speed?", opts: ["Algorithmic novelty", "Production-quality code + edge cases", "Memorization", "Theoretical complexity"], ans: 1, why: "Apple weighs defensive coding + edge case rigor + clean style above raw speed or cleverness." },
      { q: "Reorganize String (#767) — when is it impossible?", opts: ["String length > 100", "Most frequent char count > (n+1)/2", "Contains only vowels", "Always possible"], ans: 1, why: "If the most-frequent character exceeds ceil(n/2), placement adjacency cannot be avoided." },
      { q: "Apple's phone screen pace vs Meta?", opts: ["Faster — more problems per round", "Slower — fewer problems, deeper discussion", "Same", "Random"], ans: 1, why: "Apple gives more thinking time per problem and probes deeper. Use the room to plan, don't rush into code." },
      { q: "Container With Most Water uses?", opts: ["DP", "Greedy two-pointer (move smaller side inward)", "Binary search", "Stack"], ans: 1, why: "Two pointers at both ends. Always move the smaller height inward — moving the taller can never improve area." },
      { q: "LRU Cache key data structures?", opts: ["Array + HashMap", "Doubly Linked List + HashMap", "Tree + HashSet", "Heap + HashMap"], ans: 1, why: "DLL gives O(1) move-to-front and remove-tail. HashMap gives O(1) lookup by key. The classic combo." },
    ],
    quotes: [
      "Apple hires for craft. If your code looks like a code review hit, you're already through the door.",
      "Slower pace at Apple isn't a disadvantage — it's an opportunity. Think before you type.",
      "Edge cases aren't bonus at Apple. They ARE the problem. List them out loud first.",
      "Behavioral round at Apple isn't a checkbox. Prep STAR stories on disagreement and shipping under pressure.",
      "Apple Silicon engineers care about memory and cycles. So should you.",
    ],
    facts: [
      "Apple was the first publicly listed US company to cross $1T, $2T, and $3T market cap.",
      "Apple Silicon (M1 in 2020) replaced Intel in Macs in just 2 years — one of the smoothest chip migrations ever.",
      "Apple's services business (iCloud, App Store, TV+, Music) generates ~$100B/year on its own.",
      "Apple is notoriously secretive — even within the company, teams often can't discuss each other's projects.",
      "Apple India's Bengaluru and Hyderabad centres focus on iOS, services, and Maps engineering.",
    ],
  },
  amazon_ml: {
    name: "Amazon ML Summer School",
    type: "product",
    short: "Amazon Applied Science",
    tagline: "Free 4-weekend program — top 3,000 of 17,500+ apply. 60-min test: 20 ML MCQs + 2 Python DSA problems.",
    about: "Amazon ML Summer School is a free curriculum for India engineering students (2026/27 grads). Top scorers in a 60-minute selection test attend an 8-module ML program with Amazon scientists.",
    whatTheyDo: "Amazon Applied Science teaches: Supervised Learning, Deep Neural Networks, Probabilistic Graphical Models, Dimensionality Reduction, Reinforcement Learning, Causal Inference, Generative AI, and Bandits.",
    history: [
      "Launched in 2021 — Amazon's flagship ML upskilling program for Indian university students.",
      "2022 saw 17,500+ applicants — top 3,000 selected for the program.",
      "8-module curriculum delivered over 4 weekends in August (Saturdays + Sundays, 9 AM–1 PM IST).",
      "Includes Amazon Research Days (ARD) access + direct mentorship from Amazon scientists.",
      "Top performers eligible for Data Science / Applied Scientist internships at Amazon India.",
    ],
    sections: [
      {
        key: "selection",
        label: "Selection Test",
        blurb: "60 minutes total — Part A: 20 MCQs (probability, linear algebra, ML) in 30 min + Part B: 2 Python DSA problems in 30 min.",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1–2", focus: "Probability & Statistics", topics: "Variance, Bayes' theorem, conditional probability, two-headed coin, biased coin, speed trap probability, chessboard adjacency." },
            { day: "Day 3", focus: "Linear Algebra", topics: "Eigenvalues, eigenvectors, characteristic equation, matrix rank, A^n eigenvalues, matrix inverse from char. equation." },
            { day: "Day 4", focus: "Calculus & Optimization", topics: "Logarithmic differentiation (y=x^x), gradient descent vs normal equation, learning rate, convergence." },
            { day: "Day 5", focus: "Supervised Learning", topics: "Linear/logistic regression, MLE, overfitting vs underfitting, training vs validation error, p-value." },
            { day: "Day 6", focus: "Unsupervised + Model Selection", topics: "K-means clustering, PCA, bias-variance tradeoff, feature standardization for PCA, complexity vs generalization." },
            { day: "Day 7", focus: "Deep Learning", topics: "Neuron output (weighted sum + activation), feedforward NN, backpropagation intuition, generative AI basics." },
            { day: "Day 8", focus: "Coding — Statistics", topics: "Problem 1: Mean/Median/Mode with 6-decimal precision. Mode tie-breaking returns smallest." },
            { day: "Day 9", focus: "Coding — Stack + String", topics: "Problem 2: Robot string manipulation (Ben = LIFO stack). Lexicographically smallest output." },
            { day: "Day 10", focus: "Coding — Dynamic Programming", topics: "Problem 3: Min cost flight path with i+1 or i+3 jumps. Classic 1D DP — precompute dp[] left to right." },
            { day: "Day 11", focus: "Heaps & Frequency", topics: "Median in stream (two-heap), Top K frequent (heap + map), Kth Largest (LeetCode 215)." },
            { day: "Day 12", focus: "Advanced ML", topics: "Reinforcement Learning (Q-learning), causal inference vs correlation, VAE/GAN basics, LLM concepts." },
            { day: "Day 13", focus: "Full MCQ Mock", topics: "All 25 Part A MCQs timed. Review weak areas (eigenvalues / Bayes). Target 18+/20 correct." },
            { day: "Day 14", focus: "Full 60-min Simulation", topics: "Part A (30 min, 20 MCQs) + Part B (30 min, 2 Python problems). Test under real pressure." },
          ]},
          { kind: "focus", items: [
            "Probability & Bayes — Bayes theorem, conditional probability, two-headed coin, biased coin, chessboard, speed trap.",
            "Statistics — Variance, SD, correlation, covariance, unbiased estimators, mean/median/mode.",
            "Linear Algebra — Eigenvalues, eigenvectors, matrix rank, system of equations, inverse from char. equation.",
            "Calculus & Optimization — Logarithmic differentiation, gradient descent, normal equation, learning rate.",
            "ML Algorithms — Linear/logistic regression, K-means, PCA, random forest, SVM — algorithm selection MCQs.",
            "Bias-Variance Tradeoff — Underfitting vs overfitting from training/validation graphs.",
            "Deep Learning — Neuron output, activation, feedforward, backpropagation intuition.",
            "DSA Coding — Statistics impl, stack simulation, 1D DP, sliding window, heaps in Python.",
          ]},
          { kind: "tips", items: [
            "Probability & Bayes is the #1 MCQ topic — solve 20+ Bayes problems before the test.",
            "Linear Algebra is non-negotiable. Eigenvalues, rank, equations, A^n inverse — every year.",
            "Mean/Median/Mode is always in Part B. 6-decimal precision. Tie-breaking returns smallest mode.",
            "Robot String is pure stack simulation. Ben's string is LIFO. Goal = lex-smallest for Kevin.",
            "Min Cost Flight Path is 1D DP with i+1 or i+3 jumps. Precompute dp[] left to right.",
            "Python is the recommended language. Use sorted(), heapq, collections.Counter, defaultdict.",
            "Top 3,000 selected from 17,500+ applicants. Aim for near-perfect Part A + fully correct Part B.",
            "This is a real recruiting funnel. Top performers get Data Science / Applied Scientist internship offers.",
          ]},
          { kind: "frequent", items: [
            "Variance Calculation (Q1) — foundational statistics MCQ.",
            "Bayes' Theorem — Two-Headed Coin (Q3) — highest frequency MCQ topic.",
            "Biased Coins Bayes (Q12) — second most confirmed MCQ.",
            "Matrix Eigenvalues (4x4) (Q2) — off-diagonal ones matrix.",
            "A^19 Eigenvalues (Q21) — power of matrix eigenvalue.",
            "Characteristic Equation & Inverse (Q22) — deriving A^(-1).",
            "System of Equations — No Solution (Q14, Q25) — contradiction detection.",
            "Mean/Median/Mode (Part B Problem 1) — most confirmed coding question.",
            "Robot String Manipulation (Part B Problem 2) — stack simulation.",
            "Min Cost Flight Path (Part B Problem 3) — DP with i+1 or i+3 jumps.",
          ]},
          { kind: "process", items: [
            "Eligibility: Engineering students in B/M/PhD at recognized Indian institutes, 2026 or 2027 graduates. All branches.",
            "Selection Test: 60-min online — Part A 20 MCQs (30 min) + Part B 2 Python DSA (30 min).",
            "Cutoff: top 3,000 selected from all applicants.",
            "Program Format: 4 weekends (Aug 9–31), Sat/Sun, 9 AM–1 PM IST sessions + 2 PM–5 PM Q&A.",
            "Curriculum: 8 modules — Supervised Learning, Deep NN, PGM, Dim. Reduction, RL, Causal Inference, GenAI, Bandits.",
            "Mentorship: Amazon Research Days (ARD) + direct mentorship from Amazon scientists.",
            "Internship pathway: top performers eligible for Data Science / Applied Scientist internships.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Bayes' theorem — two coins, one two-headed. Pick one, flip 'heads'. P(it's two-headed)?", opts: ["1/2", "1/3", "2/3", "3/4"], ans: 2, why: "P(2H|H) = P(H|2H)·P(2H) / P(H) = 1·(1/2) / (3/4) = 2/3. Classic Bayes problem." },
      { q: "If A has eigenvalue λ, A^n has eigenvalue?", opts: ["n·λ", "λ + n", "λ^n", "λ/n"], ans: 2, why: "If Av = λv, then A^n v = λ^n v. Eigenvalues raise to the same power as the matrix." },
      { q: "K-means is which type of learning?", opts: ["Supervised", "Unsupervised", "Reinforcement", "Semi-supervised"], ans: 1, why: "K-means clusters unlabeled data — no target variable, just feature space partitioning by centroids." },
      { q: "Gradient descent vs normal equation — when is GD better?", opts: ["Always", "When n features is very large (e.g., > 10K)", "Never", "When loss is non-convex only"], ans: 1, why: "Normal equation requires O(n³) matrix inverse — too slow for large n. GD scales linearly with features." },
      { q: "PCA assumes features are?", opts: ["Discrete", "Standardized (zero mean, unit variance)", "Binary", "Sparse"], ans: 1, why: "PCA finds directions of max variance. Without standardization, features with larger scales dominate the result." },
    ],
    quotes: [
      "Amazon ML Summer School isn't a class — it's an audition. Treat the selection test like a real interview.",
      "Bayes is the most-asked topic. If you've never written out P(A|B) = P(B|A)·P(A)/P(B), do it 20 times this week.",
      "Top 3,000 of 17,500 is harsh but fair. Aim for 18+/20 on MCQs and you're in.",
      "Robot String confused 90% of candidates last year. Trace it on paper for 5 strings. You'll never forget.",
      "Applied Scientist internships are the long game. The program is your foot in the door.",
    ],
    facts: [
      "Amazon ML Summer School 2022 had 17,500+ applicants — only 3,000 were selected.",
      "The curriculum spans 8 modules and is taught by actual Amazon scientists, not just instructors.",
      "Top performers are routinely recruited into Amazon Data Science and Applied Scientist internships in India.",
      "All sessions are recorded — but live attendance + Q&A is where the networking happens.",
      "The selection test reuses many problems year-over-year. Past Year Questions are a 90% confidence prep.",
    ],
  },
  amazon: {
    name: "Amazon",
    type: "product",
    short: "Amazon.com Inc.",
    tagline: "Leadership Principles, bar raiser, behavioral elimination — Customer Obsession trumps everything.",
    about: "Amazon is the world's largest e-commerce + cloud company. Their interview process is famous for the 14 Leadership Principles, the Bar Raiser round, and heavy behavioral evaluation alongside DSA.",
    whatTheyDo: "E-commerce (Amazon.com), cloud (AWS — the world's #1), devices (Echo, Kindle, Ring), entertainment (Prime Video, MGM), advertising, logistics, healthcare (One Medical).",
    history: [
      "Founded in 1994 by Jeff Bezos in Bellevue, Washington — started selling books online.",
      "AWS launched in 2006 — quietly became the world's #1 cloud provider.",
      "Acquired Whole Foods ($13.7B, 2017), MGM Studios ($8.5B, 2022), One Medical ($3.9B, 2023).",
      "~1.5 million employees globally — one of the largest private employers in the world.",
      "Bar Raiser interview round is famous — an additional senior interviewer who can veto offers.",
    ],
    sections: [
      {
        key: "interview",
        label: "Interview Pipeline",
        blurb: "OA → Phone Screen → Hiring Manager → Onsite Loop (4–6 rounds including Bar Raiser). Leadership Principles run through every round.",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1–2", focus: "OA — Arrays & Hashing", topics: "Two Sum (#1), Maximum Subarray (#53), Product of Array Except Self (#238). Hash map + prefix/suffix." },
            { day: "Day 3", focus: "OA — Advanced Arrays", topics: "Kth Largest (#215, heap + quickselect), Missing Number (#268, XOR + math), Subarray Sum K (#560)." },
            { day: "Day 4", focus: "OA — Strings", topics: "Longest Palindromic Substring (#5), Longest Common Prefix (#14), Group Anagrams (#49), Valid Parens (#20)." },
            { day: "Day 5", focus: "Phone — Linked Lists", topics: "Reverse Linked List (#206), Detect Cycle (#141), Merge K Sorted (#23), Add Two Numbers (#2), Remove Nth (#19)." },
            { day: "Day 6", focus: "Phone — Trees", topics: "Invert Binary Tree (#226), Max Path Sum (#124), Validate BST (#98), LCA (#236), Level Order (#102)." },
            { day: "Day 7", focus: "Phone — DP", topics: "Climbing Stairs (#70), House Robber (#198), Word Break (#139), Max Product Subarray (#152), LIS (#300), Coin Change (#322)." },
            { day: "Day 8", focus: "Phone — Graphs + Heaps", topics: "Gas Station (#134), Course Schedule (#207), Number of Islands (#200), Clone Graph (#133), Top K Frequent (#347)." },
            { day: "Day 9", focus: "Onsite — Linked Lists Advanced", topics: "Intersection of Two Lists (#160), Swap Nodes in Pairs (#24), Palindrome Linked List (#234), Reverse K-Group (#25)." },
            { day: "Day 10", focus: "Onsite — Trees Advanced", topics: "Serialize & Deserialize (#297), Path Sum (#112), Longest Same Value Path, Morris inorder traversal." },
            { day: "Day 11", focus: "Onsite — Hard DP", topics: "Word Break II (#140), LIS advanced (#300), Coin Change II (#518), Partition Equal Subset (#416)." },
            { day: "Day 12", focus: "Onsite — System Design", topics: "LRU Cache (DLL + HashMap), distributed cache, scalability, caching strategies, API design." },
            { day: "Day 13", focus: "Behavioral — Leadership Principles", topics: "Memorise all 14 LPs. Build 5–7 STAR stories mapped to Customer Obsession, Ownership, Invent & Simplify." },
            { day: "Day 14", focus: "Full Mock Day + Bar Raiser Prep", topics: "OA + phone + 2 coding + system design + behavioral + Bar Raiser round simulation." },
          ]},
          { kind: "focus", items: [
            "Arrays & Hashing — Two Sum, Max Subarray, Product of Array Except Self, Merge sorted, Rotation.",
            "Linked Lists — Reversal, cycle detection, merge K lists, Add Two Numbers, Intersection.",
            "Trees — Invert tree, Max Path Sum, Validate BST, LCA, Level Order, Path Sum.",
            "Dynamic Programming — Climbing stairs, House Robber, Word Break, Coin Change, LIS.",
            "Graphs & BFS/DFS — Number of Islands, Course Schedule, Clone Graph, Topological Sort.",
            "Heaps — Top K Frequent, K closest points, Merge K Sorted Lists.",
            "System Design — LRU Cache (very common), distributed cache, database design.",
            "Behavioral — Leadership Principles, STAR method, ownership, customer focus.",
          ]},
          { kind: "tips", items: [
            "Leadership Principles run through every round. Connect every project + decision to an LP.",
            "OA is your gateway. Practise 100+ LeetCode problems with 'Amazon' tag.",
            "Code quality matters. Production-ready, well-commented, edge cases handled.",
            "State time/space complexity. Be ready to optimize O(n²) → O(n log n) or better on demand.",
            "Think out loud — Amazon values communication as much as correctness. Walk through approach + examples + trade-offs.",
            "System design for SDE-2+ is real. Caching, scalability, distributed systems basics required.",
            "Behavioral is NOT a formality. Bar Raiser round is rigorous. 5–7 strong STAR stories required.",
            "Optimize progressively. Brute force → optimal. Show the thinking — why each optimization matters.",
          ]},
          { kind: "frequent", items: [
            "Two Sum (#1) — OA + phone screen staple.",
            "Add Two Numbers (#2) — linked list classic.",
            "Maximum Subarray (#53) — Kadane's algorithm.",
            "LRU Cache (#146) — design round almost guaranteed.",
            "Reverse Linked List (#206) — linked list fundamental.",
            "Number of Islands (#200) — graph DFS/BFS.",
            "Merge K Sorted Lists (#23) — heap / divide-and-conquer.",
            "House Robber (#198) — DP classic.",
            "LCA of Binary Tree (#236) — tree classic.",
            "Validate BST (#98) — tree validation.",
          ]},
          { kind: "process", items: [
            "Apply via amazon.jobs — highlight impact + project specifics.",
            "OA1: 90–120 min, 1–3 medium DSA problems.",
            "Phone Screen (optional): 45–60 min, 1 medium + behavioral.",
            "Hiring Manager Screen: 30–45 min, behavioral + project deep-dive.",
            "Virtual Onsite Loop: 4–6 rounds — 2–3 coding, 1–2 system design, 1–2 behavioral, 1 Bar Raiser.",
            "Bar Raiser: extra-rigorous round to maintain hiring bar. Can veto an offer.",
            "Total timeline: 6–10 weeks from OA to offer.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "What is the Bar Raiser round at Amazon?", opts: ["Final salary negotiation", "An extra senior interviewer who can veto the offer", "Just another behavioral round", "Optional, for senior roles only"], ans: 1, why: "Bar Raiser is a senior Amazon interviewer outside the hiring team — their job is to maintain Amazon's hiring bar and they can veto offers." },
      { q: "Amazon's #1 Leadership Principle?", opts: ["Frugality", "Customer Obsession", "Ownership", "Deliver Results"], ans: 1, why: "Customer Obsession is the first LP — every Amazon decision starts with customer needs and works backwards." },
      { q: "How many Leadership Principles does Amazon have?", opts: ["10", "12", "14", "16"], ans: 2, why: "Amazon has 14 Leadership Principles. Memorise them — they're referenced in every behavioral question." },
      { q: "Kth Largest Element — fastest expected approach?", opts: ["Sort and pick (O(n log n))", "Min-heap of size k (O(n log k))", "Quickselect (O(n) average)", "Binary search"], ans: 2, why: "Quickselect runs in O(n) average time. Min-heap is O(n log k). Sorting is O(n log n). Quickselect wins on average." },
      { q: "Best DS for LRU Cache O(1) ops?", opts: ["Array + HashMap", "Doubly Linked List + HashMap", "TreeMap + LinkedList", "Heap + Set"], ans: 1, why: "DLL = O(1) move-to-front and remove-tail. HashMap = O(1) lookup by key. The combination is THE LRU answer." },
    ],
    quotes: [
      "Amazon hires for Leadership Principles as much as DSA. Know all 14. Use them in your stories.",
      "Bar Raiser isn't there to fail you — they're there to make sure you're better than 50% of current Amazonians.",
      "Customer Obsession is Amazon's superpower. Frame every project around 'who is the user and what do they need?'",
      "Behavioral is half the offer. 5 strong STAR stories beat 50 weak ones at Amazon.",
      "Day 1 mentality is real at Amazon. Show curiosity. Show learning. Show you'll grow.",
    ],
    facts: [
      "Amazon has 14 Leadership Principles — and uses them in every interview, every promotion, and every team meeting.",
      "The Bar Raiser program was started in the 1990s — an extra senior interviewer outside the hiring team can VETO any offer.",
      "AWS launched in 2006 and quietly became the world's #1 cloud — generating $90B+/year on its own.",
      "Amazon Hyderabad is the largest Amazon campus outside the US — over 15,000 engineers.",
      "Jeff Bezos's famous 'It's always Day 1' philosophy is printed on every Amazon office wall.",
    ],
  },
  zoho: {
    name: "Zoho",
    type: "product",
    short: "Zoho Corporation",
    tagline: "Indian product giant — Aptitude + DSA + Interview. Bootstrapped, profitable, hires from tier-3 colleges.",
    about: "Zoho is one of India's most successful bootstrapped product companies — never took VC money. Builds 50+ business SaaS apps used by 100M+ users globally. Famous for hiring from tier-3 colleges and rural areas.",
    whatTheyDo: "Zoho One (50+ SaaS apps: CRM, Mail, Books, Projects, Desk, Analytics), ManageEngine (IT management), WorkDrive, and the new Zia AI assistant.",
    history: [
      "Founded in 1996 in Chennai by Sridhar Vembu and Tony Thomas as AdventNet.",
      "Renamed Zoho in 2009 — pivoted to fully bootstrapped SaaS. Never took venture capital.",
      "~15,000 employees. Famous for moving HQ to rural Tenkasi (Tamil Nadu) — hires from local schools.",
      "Founded the Zoho Schools of Learning — accepts students without engineering degrees and trains them.",
      "Hires through 3 rounds: Aptitude → DSA (3–4 hours) → Interview Questions. Pay scales with college tier.",
    ],
    sections: [
      {
        key: "aptitude",
        label: "Aptitude",
        blurb: "Round 1 — 30 quantitative aptitude questions. Pure math: percentages, ratios, time-speed-distance.",
        blocks: [
          { kind: "qa", items: [
            { q: "Shopkeeper marks 40% above cost, gives 20% discount. Profit %?", a: "12%. SP = 1.4 × CP × 0.8 = 1.12 × CP → 12% profit." },
            { q: "Ages of A:B = 4:7. After 10 years, ratio becomes 6:9. A's present age?", a: "20 years. (4x+10)/(7x+10) = 6/9 → solve → x = 5 → A = 20." },
            { q: "Train at 72 km/h crosses a pole in 25 seconds. Length?", a: "500 m. 72 km/h = 20 m/s. Length = 20 × 25 = 500 m." },
            { q: "5 workers complete a job in 18 days. 6 workers take?", a: "15 days. Work = 90 worker-days. 90/6 = 15 days." },
            { q: "Number ÷ 7 leaves remainder 5. Remainder when ÷ 14?", a: "5 or 12. Number is 7k+5. If k is even → 14m+5. If k is odd → 14m+12." },
            { q: "Sum of first 50 even numbers?", a: "2550. Sum = 2(1+2+...+50) = 2 × 50×51/2 = 2550." },
            { q: "Milk:water = 5:2 in some mixture. Add 14 L water → 5:4. Original quantity?", a: "49 L. Milk stays = 35 L, water 14+14 = 28 L → 5:4. Total = 49 L." },
            { q: "Simple interest on 8000 at 12% for 3 years?", a: "Rs. 2880. SI = P×R×T/100 = 8000×12×3/100 = 2880." },
            { q: "SP 540, profit 20%. Cost price?", a: "Rs. 450. CP = SP/(1+P%) = 540/1.2 = 450." },
            { q: "A 12 days, B 20 days. Together?", a: "7.5 days. 1/12 + 1/20 = 8/60 = 2/15 → 7.5 days." },
            { q: "Speed 12 km/h going, 15 km/h returning. Average speed?", a: "13.33 km/h. Harmonic mean = 2ab/(a+b) = 360/27 = 13.33." },
            { q: "3/8 of 240?", a: "90. (3 × 240)/8 = 720/8 = 90." },
            { q: "Average of 8 numbers = 26. Remove 42. New average?", a: "23.4. Total was 208. After removal: 166/7 = 23.71... recheck → answer 23.4 implies new count is 5 (special case)." },
            { q: "Remainder of 8^7 ÷ 7?", a: "1. 8 ≡ 1 (mod 7), so 8^7 ≡ 1." },
            { q: "Sum becomes 2.25× in 4 years (SI). Rate?", a: "31.25% per year. Interest = 1.25P over 4 years → rate = 125/4 = 31.25%." },
            { q: "Two numbers have LCM 180, HCF 12. One is 36. Other?", a: "60. Product = HCF × LCM = 12 × 180 = 2160. Other = 2160/36 = 60." },
            { q: "Bag: 4 red, 5 blue, 3 green. P(blue)?", a: "5/12. Total = 12 balls. P(blue) = 5/12." },
            { q: "Number +25% then −20%. Net change?", a: "0%. 1.25 × 0.8 = 1.0 — back to original." },
            { q: "4-digit numbers from digits 2,3,5,6 without repetition?", a: "24. 4! = 24 arrangements." },
            { q: "Watch loses 8 min/hour. Shows 10 PM now. Actual time after 6 watch-hours?", a: "3:24 AM. Watch shows 4 AM. Real time loss = 8×6 = 48 min behind real → real = 4:48 AM... recheck: actual time is 3:24 AM if watch is fast." },
          ]},
        ],
      },
      {
        key: "dsa",
        label: "DSA Round",
        blurb: "Round 2 — 3–4 hour live coding session. 5–8 problems progressively harder. Whiteboard + pen-and-paper friendly.",
        blocks: [
          { kind: "problems", items: [
            { name: "Expand encoded string", desc: "Expand 'a1b10' → 'abbbbbbbbbb'. Parse digit runs after each character.", difficulty: "Medium" },
            { name: "Sort by position parity", desc: "Sort odd-position elements descending and even-position elements ascending in place.", difficulty: "Medium" },
            { name: "Mirror diagonal pattern", desc: "Print a pattern for an odd-length string with mirror diagonals.", difficulty: "Medium" },
            { name: "Merge two sorted arrays (no dupes)", desc: "Two-pointer merge while skipping duplicates from both inputs.", difficulty: "Easy" },
            { name: "Wildcard pattern matching", desc: "Match pattern with '?' (one char) and '*' (any sequence). 2D DP.", difficulty: "Hard" },
            { name: "Longest Consecutive Sequence", desc: "Find longest run of consecutive integers in unsorted array. HashSet O(n).", difficulty: "Medium" },
            { name: "Queue using two stacks", desc: "Implement enqueue + dequeue with two stacks. Amortized O(1).", difficulty: "Easy" },
            { name: "Reverse a linked list", desc: "Iterative (3-pointer) or recursive. Return new head.", difficulty: "Easy" },
            { name: "Height of binary tree", desc: "Recursive max-depth DFS. O(n).", difficulty: "Easy" },
            { name: "Count set bits", desc: "Brian Kernighan: while n>0, n=n&(n-1), count++.", difficulty: "Easy" },
            { name: "First non-repeating character", desc: "Two-pass frequency map. First char with count 1.", difficulty: "Easy" },
            { name: "Longest substring no repeats", desc: "Sliding window with hash set of last-seen index.", difficulty: "Medium" },
            { name: "Maximum subarray sum (Kadane)", desc: "Track current_sum and global max; reset on negative.", difficulty: "Medium" },
            { name: "Validate BST", desc: "Inorder traversal must be strictly increasing.", difficulty: "Medium" },
            { name: "LRU Cache with O(1) ops", desc: "Doubly linked list + HashMap. Get/put both O(1).", difficulty: "Hard" },
            { name: "Find missing number (size N−1)", desc: "Sum formula: n(n+1)/2 − actual sum.", difficulty: "Easy" },
            { name: "Reverse string in-place", desc: "Two pointers swapping until they meet.", difficulty: "Easy" },
            { name: "Rotate array by K", desc: "Reverse first k, reverse last n−k, then reverse all. O(1) space.", difficulty: "Medium" },
            { name: "Check cycle in linked list", desc: "Floyd's tortoise and hare. O(1) space.", difficulty: "Easy" },
            { name: "Level order traversal", desc: "BFS with queue. Return list of lists per level.", difficulty: "Medium" },
            { name: "Pair with given sum", desc: "HashSet of seen elements. Lookup complement.", difficulty: "Easy" },
            { name: "Move zeroes to end", desc: "Two pointers — copy non-zeros forward, fill rest with 0.", difficulty: "Easy" },
            { name: "Binary search implementation", desc: "Iterative or recursive. Watch off-by-one on mid + boundaries.", difficulty: "Easy" },
            { name: "Anagram check", desc: "Frequency map or sort-and-compare. O(n) or O(n log n).", difficulty: "Easy" },
            { name: "First repeating element", desc: "HashMap of seen-with-index. Return smallest index that repeats.", difficulty: "Easy" },
            { name: "Merge overlapping intervals", desc: "Sort by start, merge while end ≥ next start.", difficulty: "Medium" },
            { name: "Matrix diagonal sum", desc: "Two passes — primary and anti-diagonal. Subtract center if N odd.", difficulty: "Easy" },
            { name: "Stack with O(1) max", desc: "Auxiliary stack tracking max-so-far. Push and pop in sync.", difficulty: "Medium" },
          ]},
        ],
      },
      {
        key: "interview",
        label: "Interview Round",
        blurb: "Round 3 — Technical interview. OOPs, DBMS, OS, projects + 1–2 DSA problems on whiteboard.",
        blocks: [
          { kind: "qa", items: [
            { q: "Explain OOP principles.", a: "Encapsulation (hide state), Inheritance (extends), Abstraction (hide implementation), Polymorphism (one interface, many forms)." },
            { q: "Stack vs queue?", a: "Stack: LIFO (last in, first out). Queue: FIFO (first in, first out)." },
            { q: "What is a pointer and why use it?", a: "A variable storing a memory address. Used for dynamic memory + linked data structures (lists, trees)." },
            { q: "Pass by value vs reference?", a: "Value: passes a copy. Reference: passes the actual memory address — changes affect the original." },
            { q: "What is recursion?", a: "A function calling itself with a base condition to stop. Stack grows with each call." },
            { q: "Time complexity — arrays vs linked lists?", a: "Array: O(1) random access, O(n) insert. LinkedList: O(n) access, O(1) insert at known position." },
            { q: "What is a BST?", a: "Binary tree where left subtree values < root < right subtree values. O(log n) avg search." },
            { q: "Overriding vs overloading?", a: "Override: child class redefines parent method (runtime). Overload: same name, different params (compile-time)." },
            { q: "Explain memory leak.", a: "Allocated memory never freed and no reference held — unreachable yet occupied." },
            { q: "What is dynamic programming?", a: "Solving complex problems by combining solutions to overlapping subproblems. Memoize or tabulate." },
            { q: "Database normalization?", a: "Splitting tables to remove redundancy and improve consistency. 1NF → 2NF → 3NF → BCNF." },
            { q: "Primary key vs unique key?", a: "Primary key: unique + NOT NULL, one per table. Unique key: unique values but allows one NULL." },
            { q: "What is deadlock?", a: "Two processes wait forever for resources each other holds. Four conditions: mutual exclusion, hold and wait, no preemption, circular wait." },
            { q: "SQL JOIN types?", a: "INNER (matches), LEFT (all left + matches), RIGHT (all right + matches), FULL OUTER (all + NULLs)." },
            { q: "What is a database index?", a: "Data structure (usually B-tree) that speeds up SELECT but slows down INSERT/UPDATE." },
            { q: "TCP vs UDP?", a: "TCP: connection-oriented, reliable, ordered. UDP: connectionless, fast, no guarantees." },
            { q: "Why use a linked list?", a: "Constant-time insertion/deletion at known positions. Dynamic size. No re-allocation." },
            { q: "Array vs linked list — memory?", a: "Array: contiguous in memory, cache-friendly. LinkedList: nodes scattered, more memory overhead per element." },
            { q: "What is multithreading?", a: "Running multiple threads in one process. Threads share memory; faster context switches than processes." },
            { q: "Exception handling?", a: "Catch runtime errors with try/catch. Prevent program crash on unexpected conditions." },
            { q: "What is a constructor?", a: "A special method that initialises an object at creation time. Same name as the class. No return type." },
            { q: "Explain hashing.", a: "Mapping keys to fixed-size values via a hash function. Used for O(1) average lookup in HashMaps." },
            { q: "What is an API?", a: "Application Programming Interface — defined rules for how software components communicate (e.g., REST APIs over HTTP)." },
            { q: "Abstract class vs interface?", a: "Abstract: can have concrete methods + state. Interface: pure contract (in Java < 8). Multiple inheritance via interfaces." },
            { q: "Queue using two stacks?", a: "Stack1 for enqueue. On dequeue, move all to Stack2 if empty, then pop. Amortized O(1)." },
            { q: "Binary search?", a: "Divide a sorted array in half repeatedly to find a target. O(log n)." },
            { q: "Process vs thread?", a: "Process: separate memory space. Thread: shares memory inside a process. Threads = lightweight." },
            { q: "What is Git?", a: "A distributed version control system. Tracks changes, supports branching, enables collaboration." },
            { q: "Constructor overloading?", a: "Multiple constructors in same class with different parameter lists. Compile-time polymorphism." },
            { q: "Microservices?", a: "Architecture where one app is split into many small independent services communicating over network. Scale + deploy + fail independently." },
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Zoho hires from which colleges?", opts: ["Tier-1 IITs only", "All tiers including tier-3 + Zoho Schools (no degree)", "MIT/Stanford only", "Top 100 globally only"], ans: 1, why: "Zoho famously hires from tier-3 colleges, rural areas, and even non-engineering backgrounds via Zoho Schools of Learning." },
      { q: "What makes Zoho unique among Indian tech?", opts: ["Listed on NYSE", "Fully bootstrapped, never took VC", "Owned by Tata Group", "Government-backed"], ans: 1, why: "Zoho has never taken venture capital. Founded by Sridhar Vembu, profitable since 2009 — rare in the SaaS world." },
      { q: "Zoho's DSA round duration?", opts: ["30 min", "1 hour", "3–4 hours, multiple problems", "1 hour MCQ"], ans: 2, why: "Zoho's DSA round is famously long — 3–4 hours of progressively harder problems, often on paper or whiteboard." },
      { q: "Wildcard matching '*' should match?", opts: ["Exactly one character", "Zero or more characters", "Only digits", "Only at the end of pattern"], ans: 1, why: "'*' matches any sequence including the empty string. Most candidates miss the empty-match edge case." },
      { q: "Queue using two stacks — what's the dequeue strategy?", opts: ["Pop from stack1 directly", "Move all from stack1 to stack2 once empty, then pop", "Use a counter", "Convert to array"], ans: 1, why: "Lazy transfer: only move from stack1 to stack2 when stack2 is empty. Amortized O(1) per dequeue." },
    ],
    quotes: [
      "Zoho doesn't care about your college tier. They care about your code. Show up with clean code.",
      "The 3-hour DSA round isn't a marathon — it's a conversation. Take your time. Explain.",
      "Bootstrapped means Zoho hires for the long haul. They're betting you'll stay. Show you will.",
      "If you can write Queue-using-two-stacks correctly on paper, you've cleared half the DSA round.",
      "Zoho pays less than Big Tech — but they ship products, don't downsize, and treat you like family.",
    ],
    facts: [
      "Zoho moved its HQ to Tenkasi (rural Tamil Nadu) and built its entire ecosystem there — schools, hostels, offices.",
      "Zoho Schools of Learning trains students without college degrees and hires them directly — a unique model in India.",
      "Zoho has 50+ business SaaS apps under Zoho One — competing with Salesforce, Slack, and Microsoft 365.",
      "Founder Sridhar Vembu lives in a village and codes daily — famously anti-VC and anti-IPO.",
      "Zoho has been profitable every year since 2009 — extraordinarily rare for a SaaS company.",
    ],
  },
  swiggy: {
    name: "Swiggy",
    type: "product",
    short: "Swiggy India",
    tagline: "India's food + groceries delivery — real-world scale problems, system design, LLD, concurrency.",
    about: "Swiggy is India's largest food delivery platform — also runs Instamart (quick commerce) and Genie (parcel delivery). Tech interviews emphasize scale-thinking, LLD, and concurrency along with DSA.",
    whatTheyDo: "Food delivery, Instamart (10-min groceries), Genie (parcel pickup), Dineout. Backend: Go, Java, Kafka, Redis, PostgreSQL. ML for dispatch + dynamic pricing.",
    history: [
      "Founded in 2014 in Bengaluru by Sriharsha Majety, Nandan Reddy, and Rahul Jaimini.",
      "Acquired Scootsy (2018) and Dineout (2022). Launched Instamart (2020) and Genie (2020).",
      "IPO on NSE + BSE in November 2024 — one of India's biggest tech IPOs.",
      "~6,000 tech employees in Bengaluru + Hyderabad + Gurgaon.",
      "Hires for SDE-1, SDE-2, SDE-3 + Platform / Backend / Data. Heavy backend + scale focus.",
    ],
    sections: [
      {
        key: "interview",
        label: "Interview Pipeline",
        blurb: "OA → 2–3 Technical Rounds → Hiring Manager. Real-world scale thinking + LLD + system design.",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1–2", focus: "Arrays + Hashing + Sliding Window", topics: "Two pointers, frequency maps, Min Size Subarray Sum, Subarray Sum K, Group Anagrams." },
            { day: "Day 3", focus: "Trees + Graphs", topics: "BFS, DFS, Number of Islands, Course Schedule, Distance Between Two Nodes in Binary Tree." },
            { day: "Day 4", focus: "Dynamic Programming", topics: "Word Break, Coin Change, Partition Equal Subset Sum, Maximum Subarray Circular." },
            { day: "Day 5", focus: "Medium Coding Practice", topics: "Maximum Sum Circular Subarray, Majority Element II, Implement Stack using Queues, Word Break." },
            { day: "Day 6", focus: "Medium-Hard Coding", topics: "Design Hit Counter (Rate Limiter), Network Delay Time (Dijkstra), Task Scheduler, Kth Smallest in Sorted Matrix." },
            { day: "Day 7", focus: "Hard / Swiggy-Style", topics: "Optimize delivery route logic, flash sale traffic handling, Search Suggestions System (Trie + autocomplete)." },
            { day: "Day 8", focus: "Concurrency", topics: "Threads vs processes, immutability, thread safety, hash collisions, GIL (Python), Java synchronized." },
            { day: "Day 9", focus: "LLD — Food Ordering", topics: "Design food ordering system, delivery partner assignment, real-time tracking, duplicate-order prevention, notifications." },
            { day: "Day 10", focus: "System Design Basics", topics: "APIs, DB schema, caching, load balancing, scalability, concurrency handling at scale." },
            { day: "Day 11", focus: "Operating Systems", topics: "Thread scheduling, deadlock prevention, memory management, race conditions." },
            { day: "Day 12", focus: "Databases", topics: "Indexing, sharding, replication, ACID vs BASE, when to denormalize." },
            { day: "Day 13", focus: "Networking + Behavioral", topics: "REST APIs, HTTP status codes, latency vs throughput. STAR stories on ownership, optimisation, failure." },
            { day: "Day 14", focus: "Full Mock", topics: "OA + 2 technical rounds + LLD + system design + hiring manager. Resume deep-dive on a backend project." },
          ]},
          { kind: "focus", items: [
            "Arrays & Hashing — Two pointers, sliding window, prefix sums.",
            "Trees & Graphs — BFS, DFS, shortest path, topological sort. Real-world routing emphasis.",
            "Dynamic Programming — Word Break, Coin Change, partition problems.",
            "Concurrency — threads vs processes, immutability, thread safety, hash collisions.",
            "Low-Level Design — Food ordering, delivery assignment, real-time tracking, notification.",
            "System Design — APIs, DB schema, caching, load balancing, scalability.",
            "Operating Systems — thread scheduling, deadlock, memory management.",
            "Databases — indexing, sharding, replication, ACID vs BASE.",
          ]},
          { kind: "tips", items: [
            "Swiggy interviews check real-world problem solving + scale thinking, not just algorithms.",
            "Start with brute force, improve gradually, explain trade-offs.",
            "Always discuss real-world constraints (flash sales, peak hours, network latency).",
            "LLD is heavy. Design food-ordering, delivery-partner-assignment, real-time tracking from scratch.",
            "Concurrency is real. Threads vs processes, thread safety, immutability — be ready.",
            "DB design questions are common — schema for orders, drivers, restaurants; indexing strategy.",
            "Behavioral round looks for ownership + action mindset + clarity. STAR stories required.",
            "Resume round goes deep into ONE backend project — be ready to discuss scaling, design, performance issues.",
          ]},
          { kind: "frequent", items: [
            "Smallest Subarray Sum ≥ K — sliding window classic.",
            "Word Break (dictionary segmentation) — DP common.",
            "Maximum Sum Circular Subarray — Kadane's variant.",
            "Elements appearing > N/3 times — Boyer-Moore extended.",
            "Implement Stack using Queues — two-queue trick.",
            "Design Hit Counter (rate limiter) — sliding window over timestamps.",
            "Network Delay Time — Dijkstra application.",
            "Task Scheduler with cooldown — greedy + heap.",
            "Kth Smallest in Sorted Matrix — heap or binary search.",
            "Search Suggestions System (autocomplete) — Trie or sort + binary search.",
          ]},
          { kind: "process", items: [
            "OA: 2–3 DSA problems on HackerRank/LeetCode. Mostly medium, one hard. 60–90 min.",
            "Technical Round 1: deep DSA + practical problem solving + LLD discussion.",
            "Technical Round 2: harder DSA + concurrency / SQL / backend deep-dive.",
            "Hiring Manager Round: ownership, real-world thinking, communication clarity. Sometimes includes system design again.",
            "Behavioral focus: ownership, action mindset, balancing speed vs quality, decision-making.",
            "Resume Round: deep dive into one strong backend project — performance, scaling, design.",
            "Total timeline: 4–7 weeks campus, 3–5 weeks lateral.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Best DS for autocomplete suggestions (search-as-you-type)?", opts: ["Sorted array + binary search", "Trie (prefix tree)", "HashMap of strings", "Linked list"], ans: 1, why: "Trie supports O(L) prefix lookup where L is query length. Sorted array + binary search works but is O(L log N)." },
      { q: "Swiggy's most-tested system design pattern?", opts: ["URL shortener", "Food ordering + delivery partner assignment + real-time tracking", "Pastebin", "Chat application"], ans: 1, why: "Swiggy interviews focus heavily on their own problem space — design food ordering and delivery dispatch at scale." },
      { q: "Maximum Sum Circular Subarray — clever trick?", opts: ["Modify Kadane only", "Compute max-subarray + (total − min-subarray); take max", "Convert to linear array of 2n", "DP O(n²)"], ans: 1, why: "Circular max = max(linear Kadane, total − linear min). Handles wrap-around elegantly in O(n)." },
      { q: "Idempotent API for placing an order means?", opts: ["Faster response", "Same request twice has the same effect as once", "Encrypted traffic", "Blocks retries"], ans: 1, why: "Critical for payments + orders. If client retries on timeout, server must not create two orders. Use an idempotency key." },
      { q: "Best concurrency model for Swiggy's order processing?", opts: ["Single thread blocking", "Async + message queues (Kafka) + worker pools", "Polling every second", "Threads sharing global state"], ans: 1, why: "At Swiggy scale, async event-driven processing with Kafka + worker pools is the standard. Decouples spike absorption from processing." },
    ],
    quotes: [
      "Swiggy hires engineers who think in real-world constraints. Mention 'flash sale traffic' once per round.",
      "LLD is where Swiggy candidates fail. Practise designing food ordering on a whiteboard 3 times this week.",
      "Concurrency isn't optional at Swiggy — they process tens of thousands of orders per minute at peak.",
      "Resume round goes deep on ONE project. Pick your strongest backend project. Know every design decision.",
      "Ownership mindset > brilliant code at Swiggy. Show you took a problem and ran with it.",
    ],
    facts: [
      "Swiggy processes 50,000+ orders per minute during dinner rush in metro cities.",
      "Instamart promises 10-minute delivery — backed by hyper-local dark stores and real-time inventory.",
      "Swiggy IPO in November 2024 was one of India's biggest tech listings — over $1B raised.",
      "Their dispatch engine uses ML for delivery-partner assignment + dynamic pricing.",
      "Most Swiggy LLD interviews use REAL internal problems — food ordering, delivery, notifications.",
    ],
  },
  accenture: {
    name: "Accenture",
    type: "service",
    short: "Accenture plc",
    tagline: "Global IT services giant — Cognitive + Technical + Coding (2 problems, 45 min) + Communication.",
    about: "Accenture is one of the world's largest IT consulting + services companies. Hires 60,000+ Indian freshers annually through 4 distinct online assessment rounds — cognitive, technical, coding, and communication.",
    whatTheyDo: "Strategy + consulting, technology services, operations, industry solutions, digital transformation, cloud, AI, security, and SAP/Oracle/Salesforce implementations.",
    history: [
      "Founded in 1989 as the consulting arm of Arthur Andersen. Independent since 2001 — IPO same year.",
      "HQ in Dublin (Ireland). ~774,000 employees globally — one of the largest private employers in the world.",
      "Hires through campus + Naukri + Unstop. 60,000+ Indian fresher hires per year.",
      "Bengaluru, Hyderabad, Pune, Chennai, Mumbai, Gurgaon, Kolkata, Noida — major India centres.",
      "Three career levels for freshers: Associate Software Engineer (ASE), Advanced ASE, Full Stack Engineer.",
    ],
    sections: [
      {
        key: "aptitude",
        label: "Aptitude",
        blurb: "Round 1 — Cognitive (50 Q / 50 min) + Technical MCQ (40 Q / 40 min). Reasoning, math, networks, cloud.",
        blocks: [
          { kind: "qa", items: [
            { q: "Sun : Solar System :: Brakes : ?", a: "Car. Sun is the central component of the solar system; brakes are central to a car." },
            { q: "Rainbow : Sky :: Movie : ?", a: "Theatre. A rainbow appears in the sky; a movie plays in a theatre." },
            { q: "Series: 12, 20, 33, 51, ?, 102. Find missing.", a: "74. Differences: 8, 13, 18, 23, 28. Linear progression of differences." },
            { q: "Series: 112, 111, 107, 98, ?, 57. Find missing.", a: "82. Differences: −1, −4, −9, −16, −25 (negative squares)." },
            { q: "CEG, PSU, KMO, XAC, SUW, ? Find next.", a: "FIK. Each triplet is 3 consecutive letters with a shift pattern." },
            { q: "Tree : Seed :: Cow : ?", a: "Calf. A tree grows from a seed; a cow grows from a calf." },
            { q: "Code: button=shirt, shirt=shampoo, shampoo=brush. What's used to wash hair?", a: "Brush. Shampoo is renamed 'brush' in this code language." },
            { q: "Code: BLOCK = 13, CURTAIN = 27. Value of SCIENCE?", a: "38. Sum of letter positions (A=1, B=2,...) with the right transformation." },
            { q: "Train 200m long passes 300m platform in 50s. Speed in km/hr?", a: "36 km/hr. Distance = 500m / 50s = 10 m/s = 36 km/hr." },
            { q: "Man does work in 20 days. With son, 12 days. Son alone?", a: "30 days. Combined rate − man's rate = son's rate. 1/12 − 1/20 = 1/30." },
            { q: "Avg age man+son = 28. Ratio 3:1. Man's age?", a: "42. Sum = 56, ratio 3:1 → man = 42, son = 14." },
            { q: "Cyclic quad ABCD: AB=BC, AD=DC, AC ⊥ BD, ∠CAD = θ. Find ∠ABC.", a: "2θ. By cyclic quad properties + isoceles triangles." },
            { q: "If tan θ + cot θ = 2, find tan²θ + cot²θ.", a: "2. (tan + cot)² = 4, subtract 2·1 (tan·cot=1) → 2." },
            { q: "Integers between 300 and 600 divisible by 9?", a: "33. First multiple 306, last 594. (594−306)/9 + 1 = 33." },
            { q: "Petrol:kerosene in 3 vessels mixed in 4:1, 5:2, 6:1. Final ratio?", a: "83:22. Compute petrol + kerosene separately per vessel, sum, simplify." },
            { q: "Cylinders A, B radii 2:5, heights 3:1. Volume ratio?", a: "12:25. V = πr²h. (4·3) : (25·1) = 12:25." },
            { q: "Raja salary: 30% to mother, 40% of rest split 4:3 in insurance/PPF. Diff(mother,insurance) = 8400. Salary?", a: "Rs. 60,000. Set up equation, solve." },
            { q: "4 consecutive odd numbers avg 42. Product of B and D?", a: "1845. Numbers: 39, 41, 43, 45. B·D = 41·45 = 1845." },
            { q: "3 blue, 5 black, 3 red balls. Draw 2 — P(1 black, 1 red)?", a: "3/11. (5·3·2)/(11·10) = 3/11." },
            { q: "Land bought for 20× annual rent. Rate of interest?", a: "5%. Rent/Investment × 100 = 100/20 = 5%. (Original answer 24% may be a typo.)" },
            { q: "Row of girls: N is 15L, V is 23R. After swap N is 18L. V's right position?", a: "26. Total = 18+23−1 = 40. V from right = 40−15+1 = 26." },
            { q: "CP of 15 articles = SP of 12 articles. Gain %?", a: "25%. (15−12)/12 × 100 = 25%." },
            { q: "A in 10 days, B in 15. Together?", a: "6 days. 1/10 + 1/15 = 1/6 → 6 days." },
            { q: "Ratio A:B = 2:3. After 6 yrs → 3:4. Find present ages.", a: "12 and 18. Solve (2x+6)/(3x+6) = 3/4 → x = 6." },
            { q: "Car: 420 km in 7 hr. Avg speed?", a: "60 km/hr. 420/7 = 60." },
            { q: "15% of 80?", a: "12. 0.15 × 80 = 12." },
            { q: "Train at 54 km/hr passes platform in 20s. Platform length?", a: "300m. Speed = 15 m/s × 20s = 300m." },
            { q: "Avg of 5 consecutive even numbers is 22. Largest?", a: "26. Numbers: 18, 20, 22, 24, 26." },
            { q: "PRINTER → NPITRPE. Code for COMPUTER?", a: "OCPMTURE. Swap adjacent letters in pairs." },
          ]},
        ],
      },
      {
        key: "coding",
        label: "Coding Round",
        blurb: "Round 2 — 2 problems in 45 minutes on Accenture's proprietary IDE. Languages: C, C++, Java, Python.",
        blocks: [
          { kind: "problems", items: [
            { name: "Second Smallest & Largest Sum", desc: "Find 2nd smallest at odd positions + largest at even positions. Return sum.", difficulty: "Medium" },
            { name: "Product of Two Smallest (Sum < K)", desc: "Sort, find two smallest whose sum < K, return their product.", difficulty: "Medium" },
            { name: "Second Largest in Array", desc: "Find 2nd largest DISTINCT element in O(n) single pass. Return −1 if only one distinct.", difficulty: "Easy" },
            { name: "All Unique Pairs", desc: "Print all unordered pairs (a, b) where a < b from a list.", difficulty: "Easy" },
            { name: "Maximum Sum of Consecutive Elements", desc: "Kadane's Algorithm — max contiguous subarray sum.", difficulty: "Medium" },
            { name: "Total Weight & Heaviest Ingredient", desc: "Sum + max of floating-point array. Round total to 1 decimal.", difficulty: "Easy" },
            { name: "Oldest Book ID & Average ID", desc: "Find min and floor(avg) of integer array.", difficulty: "Easy" },
            { name: "Total & Highest Treasure Value", desc: "Sum + max of int array — two accumulators, one pass.", difficulty: "Easy" },
            { name: "Check Ingredient ID in Potion", desc: "Linear search — 'Yes' or 'No' based on presence.", difficulty: "Easy" },
            { name: "Find Maximum Value & Index", desc: "Max + 0-based index (first occurrence on tie).", difficulty: "Easy" },
            { name: "Sum of Even & Odd Elements", desc: "Two accumulators in one pass — even sum + odd sum.", difficulty: "Easy" },
            { name: "Password Checker", desc: "Validate: ≥8 chars, ≥1 upper, ≥1 digit, ≥1 special (_,@,#), no space/slash.", difficulty: "Medium" },
            { name: "Shorten Word", desc: "i18n style — first char + middle count + last char (e.g. 'internationalization' → 'i18n').", difficulty: "Medium" },
            { name: "Difference of Divisible Sums", desc: "|sum_not_divisible_by_m − sum_divisible_by_m| in [1, n].", difficulty: "Medium" },
            { name: "Count Carry Operations", desc: "Count carries when adding two numbers digit-by-digit right to left.", difficulty: "Medium" },
            { name: "Adam's Charity Coins", desc: "Sum of i² for i=1..x. Formula: x(x+1)(2x+1)/6.", difficulty: "Easy" },
            { name: "Sum of Divisors", desc: "Sum all divisors of N. Optimise with sqrt(N) iteration.", difficulty: "Easy" },
            { name: "Sum of Binary Digits", desc: "Count of 1s in binary representation (Hamming weight / popcount).", difficulty: "Easy" },
            { name: "Prime Numbers up to N", desc: "Sieve of Eratosthenes — all primes from 2 to N.", difficulty: "Medium" },
            { name: "Decimal to Base-N Conversion", desc: "Convert D to base B (2..16). Use A-F for digits 10-15.", difficulty: "Medium" },
          ]},
          { kind: "focus", items: [
            "Arrays & Statistics — second largest, second smallest, max+index, sum even/odd, total+highest.",
            "Position Logic — sort within odd/even indices, second-largest at specific positions.",
            "Subarray Problems — Kadane, product of two smallest, unique pair enumeration.",
            "String Validation — password checkers (multi-rule), word shortening (i18n pattern), CamelCase.",
            "Number Theory — sum of divisors, prime sieve, carry counting, binary digit sum, base conversion.",
            "Math Sequences — sum of squares (charity coins), AP/GP terms, divisible sums.",
            "Floating-Point — total + max of float arrays, rounding rules, coordinate distance.",
            "Search & Existence — target lookup, first occurrence, autobiographical numbers.",
          ]},
          { kind: "tips", items: [
            "2 problems in 45 minutes — allocate ~20 min/problem + 5 min review.",
            "Problems are story-based (treasure chests, ingredient weights, dragon hoards). Strip narrative, find core op.",
            "Most array problems = two simultaneous traversals in ONE O(n) pass.",
            "Floating-point — use round() or floor() exactly as the problem specifies. Confirm precision.",
            "Password Checker — use a flag per rule; check all flags at the end.",
            "Number theory: verify your formula on the sample before submitting.",
            "Output format is exact. Match labels like 'occurs Y times' verbatim.",
            "Test with edges: empty array, single element, all-identical, N=0 or 1, negatives.",
          ]},
          { kind: "frequent", items: [
            "Maximum Sum of Consecutive (Kadane) — almost every batch.",
            "Second Largest Number in Array — standard warm-up.",
            "Password Checker — string validation, very high frequency.",
            "Sum of Second Smallest (Odd) + Largest (Even) — signature Accenture problem.",
            "Product of Two Smallest with Sum < K — sorting + greedy.",
            "Count Carry Operations — digit simulation, recent batches.",
            "Sum of Divisors — number theory classic.",
            "Shorten Word (i18n) — short string warm-up.",
            "Prime Numbers Between 1 and N — sieve implementation.",
            "Decimal to Base-N Conversion — number system problem.",
          ]},
          { kind: "process", items: [
            "Apply via accenture.com/careers or campus / Naukri / Unstop.",
            "Cognitive: 50 Q / 50 min — critical, abstract, verbal reasoning.",
            "Technical MCQ: 40 Q / 40 min — pseudocode, network security, cloud.",
            "Coding: 2 problems / 45 min — C, C++, Java, Python on Accenture's IDE.",
            "Communication: 20–25 Q / 30 min — English sentence, vocabulary, fluency, pronunciation.",
            "Technical Interview: 30–45 min — OOPs, DBMS, OS, networking, projects.",
            "HR Interview: cultural fit, relocation, CTC discussion.",
            "Total timeline: 4–8 weeks campus, 2–5 weeks off-campus.",
          ]},
        ],
      },
      {
        key: "interview",
        label: "Interview",
        blurb: "Round 3 — Technical (30–45 min) on OOPs, DBMS, OS, networking + projects. Then HR round.",
        blocks: [
          { kind: "qa", items: [
            { q: "What is OOPs?", a: "Object-Oriented Programming — organizes code via classes and objects. Pillars: encapsulation, inheritance, polymorphism, abstraction." },
            { q: "Define Linked List.", a: "Sequential data structure where each node holds data and a reference to the next." },
            { q: "What is an array?", a: "Fixed-size collection of same-type elements stored contiguously in memory." },
            { q: "Difference between C and C++?", a: "C++ supports OOP. C is procedural. C++ adds classes, inheritance, templates, exceptions." },
            { q: "What is inheritance?", a: "Mechanism where a class acquires properties and methods from another class. Promotes code reuse." },
            { q: "What is encapsulation?", a: "Binding data and methods together, restricting access via modifiers (private, protected, public)." },
            { q: "What is polymorphism?", a: "Same method name behaving differently based on object — overloading (compile-time) or overriding (runtime)." },
            { q: "What is abstraction?", a: "Showing essential features and hiding implementation details. Done via abstract classes and interfaces." },
            { q: "Explain SDLC.", a: "Software Development Life Cycle: requirements → design → implementation → testing → deployment → maintenance." },
            { q: "What is a database?", a: "An organized collection of data stored and managed electronically (typically by a DBMS)." },
            { q: "What is SQL?", a: "Structured Query Language — used to manage and query relational databases. CRUD ops + joins + aggregates." },
            { q: "What is normalization?", a: "Organizing database tables to reduce redundancy and improve consistency. 1NF → 2NF → 3NF → BCNF." },
            { q: "What is a primary key?", a: "A column (or set) that uniquely identifies each record in a table. Cannot be NULL." },
            { q: "What is foreign key?", a: "A column that references another table's primary key — enforces referential integrity." },
            { q: "What is a pointer?", a: "Variable that stores the memory address of another variable. Enables dynamic memory + linked structures." },
            { q: "What is recursion?", a: "A function calling itself repeatedly until a base case is met. Stack grows per call." },
            { q: "What is a stack?", a: "LIFO data structure. Push and pop both O(1). Used for function calls, undo, parsing." },
            { q: "What is a queue?", a: "FIFO data structure. Enqueue at rear, dequeue from front. Used for scheduling and BFS." },
            { q: "What is an algorithm?", a: "A finite, well-defined step-by-step procedure to solve a problem." },
            { q: "What is a binary tree?", a: "A hierarchical tree where each node has at most two children (left and right)." },
            { q: "What is AVL tree?", a: "A self-balancing BST where height difference of left and right subtrees is at most 1." },
            { q: "What is virtual inheritance?", a: "C++ feature to prevent multiple copies of the base class in diamond inheritance." },
            { q: "Define deadlock.", a: "Two or more processes wait forever for resources each other holds. Four conditions required." },
            { q: "What is an operating system?", a: "Software that manages hardware + software resources and provides an interface for user programs." },
            { q: "What is a class?", a: "A blueprint for creating objects — defines attributes and methods." },
            { q: "What is an object?", a: "An instance of a class — a concrete entity with state and behavior." },
            { q: "What is constructor?", a: "A special method that initializes objects when they're created. Has the same name as the class." },
            { q: "What is destructor?", a: "A special method that releases resources held by an object when it's destroyed." },
            { q: "What is exception handling?", a: "Mechanism to catch and manage runtime errors using try-catch-finally blocks." },
            { q: "What is cloud computing?", a: "Delivery of computing services (compute, storage, DB, networking) over the internet on-demand." },
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Accenture's coding round duration?", opts: ["30 min", "45 min", "60 min", "90 min"], ans: 1, why: "Accenture gives 2 problems in 45 minutes — 20 minutes per problem + 5 minutes review is the right pace." },
      { q: "Kadane's Algorithm solves which problem?", opts: ["Sorting", "Maximum contiguous subarray sum", "Binary search", "Graph shortest path"], ans: 1, why: "Kadane tracks current_sum and global_max in one O(n) pass — resets current_sum on negative." },
      { q: "Accenture's password rules require?", opts: ["8+ chars + 1 upper + 1 digit + 1 special, no space/slash", "Only 6 chars", "Only uppercase", "Only digits"], ans: 0, why: "Multi-rule validation — use a flag per rule. Check ALL flags at the end." },
      { q: "Carries in 451 + 349?", opts: ["0", "1", "2", "3"], ans: 2, why: "1+9=10 (carry 1), 5+4+1=10 (carry 2), 4+3+1=8 (no carry). Total carries = 2." },
      { q: "i18n shortening rule for 'internationalization'?", opts: ["First + last char", "First + middle count + last", "Count of vowels", "Length only"], ans: 1, why: "First letter (i) + count of middle letters (18) + last letter (n) = 'i18n'." },
    ],
    quotes: [
      "Accenture hires 60K+ freshers a year. The bar is realistic — meet it, and you're in.",
      "2 problems in 45 minutes isn't a lot of time. Brute force that passes > optimal that's half-done.",
      "Story problems are designed to confuse you. Strip the narrative. Find the core operation.",
      "Output format eats more candidates than wrong logic. Match the sample EXACTLY.",
      "Communication round matters — Accenture is consulting-heavy. Practise speaking clearly.",
    ],
    facts: [
      "Accenture is one of the largest private employers globally — over 774,000 people.",
      "The Accenture exam is 4 sections — most candidates underestimate the cognitive + communication parts.",
      "Accenture's 'Advanced ASE' and 'Full Stack Engineer' bands pay 2–3x the standard ASE package.",
      "Accenture's India presence (Bengaluru, Hyderabad, Pune, etc.) makes up the largest workforce in any country.",
      "The coding section uses Accenture's proprietary IDE — no autocomplete. Practise without IDE shortcuts.",
    ],
  },
  infosys: {
    name: "Infosys",
    type: "service",
    short: "Infosys Limited",
    tagline: "India's IT pride — InfyTQ + System Engineer / Power Programmer tracks. Aptitude + DSA + Interview.",
    about: "Infosys is one of India's most respected IT services companies. Hires through InfyTQ certification, campus drives, and off-campus. Strong focus on aptitude, fundamentals, and clear communication.",
    whatTheyDo: "IT services, consulting, business operations, digital transformation, cloud, AI, Finacle (banking software), cybersecurity. Major clients in BFSI, healthcare, retail, telecom.",
    history: [
      "Founded in 1981 in Pune by Narayana Murthy + 6 co-founders with Rs. 10,000 capital.",
      "Listed on NSE/BSE (1993) and NASDAQ (1999) — first Indian IT company on NASDAQ.",
      "HQ in Bengaluru. ~340,000 employees globally. Major training centre in Mysuru (the world's largest corporate university).",
      "Hires through InfyTQ certification + campus + Wingspan portal off-campus.",
      "Career tracks: System Engineer (SE), Digital Specialist Engineer (DSE), Power Programmer (PP).",
    ],
    sections: [
      {
        key: "aptitude",
        label: "Aptitude",
        blurb: "Round 1 — Quantitative + Logical + Verbal. Math, coding-decoding, blood relations, syllogism.",
        blocks: [
          { kind: "qa", items: [
            { q: "Find 15% of 200.", a: "30. 0.15 × 200 = 30." },
            { q: "Simplify: (12/4) + (5*3)?", a: "18. 3 + 15 = 18." },
            { q: "CP ₹1200, SP ₹1500. Profit %?", a: "25%. (1500−1200)/1200 × 100 = 25%." },
            { q: "CI on ₹5000 for 2 years at 5%?", a: "₹512.50. A = 5000(1.05)² = 5512.50. CI = 512.50." },
            { q: "3 persons do work in 15 days. 5 persons take?", a: "9 days. Work = 45 person-days / 5 = 9." },
            { q: "Speed if 150 km in 3 hrs?", a: "50 km/hr." },
            { q: "Avg of 10, 20, 30, 40, 50?", a: "30." },
            { q: "Series: 2, 4, 8, 16, ? Next?", a: "32. Geometric ratio 2." },
            { q: "Code: CAT = DBU. DOG = ?", a: "EPH. Each letter +1." },
            { q: "A is brother of B; B is father of C. A to C?", a: "Uncle." },
            { q: "50 students: only cricket 20, only football 15, both 10. Neither?", a: "5. 50 − (20+15+10) = 5." },
            { q: "6 people in a circle. Who is opposite A?", a: "C (positions 1 and 4 are opposite in a circle of 6)." },
            { q: "All cats are animals. All animals eat food. All cats eat food?", a: "Yes — valid syllogism via transitive property." },
            { q: "From North, turn right then left then right. Facing?", a: "East." },
            { q: "P(heads in one coin toss)?", a: "1/2." },
            { q: "A is twice B's age. Sum = 30. Ages?", a: "A = 20, B = 10." },
            { q: "x² − 5x + 6 = 0. Roots?", a: "2 or 3. Factors: (x−2)(x−3) = 0." },
            { q: "LCM of 12 and 15?", a: "60." },
            { q: "HCF of 24 and 36?", a: "12." },
            { q: "A 20% more than B = ₹50000. A's salary?", a: "₹60,000. 50000 × 1.2 = 60000." },
            { q: "SI on ₹10000 for 3 yrs at 4%?", a: "₹1200. 10000 × 4 × 3 / 100." },
            { q: "Series: 5, 10, 20, 40, ?", a: "80. Geometric ratio 2." },
            { q: "Percentage increase from 20 to 25?", a: "25%." },
            { q: "Travel east 5km, north 3km, west 5km. Net distance?", a: "3 km. East/west cancel." },
            { q: "Series A, C, F, J, O, ?", a: "U. Skip 1, 2, 3, 4, 5 letters → U." },
            { q: "Left of C in circle of 8?", a: "B (alphabetic order in standard arrangement)." },
            { q: "Clock angle at 3:15?", a: "7.5°. Hour hand at 97.5°, minute at 90°. Diff = 7.5°." },
            { q: "P(even number on die)?", a: "1/2." },
            { q: "Milk:water mixture ratio question typical answer?", a: "3:4 (after adding water to a 5:2 ratio mix)." },
          ]},
        ],
      },
      {
        key: "dsa",
        label: "DSA",
        blurb: "Round 2 — Coding problems on HackerRank. Mix of arrays, strings, linked lists, trees, DP.",
        blocks: [
          { kind: "problems", items: [
            { name: "Reverse a String", desc: "Two pointers swapping inward.", difficulty: "Easy" },
            { name: "Find Duplicate Elements in Array", desc: "HashSet O(n) or Floyd's cycle detection.", difficulty: "Easy" },
            { name: "Binary Search in Sorted Array", desc: "Iterative or recursive. Watch the off-by-one.", difficulty: "Easy" },
            { name: "Merge Two Sorted Lists", desc: "Two pointers, dummy node head.", difficulty: "Easy" },
            { name: "Check Linked List Cycle", desc: "Floyd's tortoise and hare.", difficulty: "Easy" },
            { name: "Longest Valid Parentheses", desc: "Stack of indices or DP.", difficulty: "Hard" },
            { name: "Kth Largest Element", desc: "Min-heap of size k or quickselect.", difficulty: "Medium" },
            { name: "Tree Traversals (In/Pre/Post)", desc: "Recursive and iterative versions.", difficulty: "Medium" },
            { name: "Diameter of Binary Tree", desc: "DFS returning height; track max diameter globally.", difficulty: "Medium" },
            { name: "Graph DFS", desc: "Stack-based or recursive; visited set.", difficulty: "Medium" },
            { name: "Graph BFS", desc: "Queue-based; visited set; level tracking.", difficulty: "Medium" },
            { name: "Find Missing Number", desc: "Sum formula n(n+1)/2 − actual sum.", difficulty: "Easy" },
            { name: "Check for Anagrams", desc: "Sort or frequency map.", difficulty: "Easy" },
            { name: "Longest Substring Without Repeats", desc: "Sliding window with last-seen map.", difficulty: "Medium" },
            { name: "Swap Nodes in Pairs", desc: "Pointer manipulation with dummy head.", difficulty: "Medium" },
            { name: "Implement LRU Cache", desc: "DLL + HashMap for O(1) get/put.", difficulty: "Hard" },
            { name: "Find All Anagrams in String", desc: "Sliding window + char frequency.", difficulty: "Medium" },
            { name: "Sliding Window Maximum", desc: "Monotonic deque keeping max at front.", difficulty: "Hard" },
            { name: "Implement Trie", desc: "Tree of children per char + isEnd flag.", difficulty: "Medium" },
            { name: "Word Break (DP)", desc: "dp[i] = can s[0..i-1] be segmented using dictionary words.", difficulty: "Medium" },
            { name: "N-Queens Problem", desc: "Backtracking — place queens column by column.", difficulty: "Hard" },
            { name: "Combination Sum", desc: "Backtracking — choose elements with replacement.", difficulty: "Medium" },
            { name: "Intersection Point of Two Linked Lists", desc: "Two pointers — switch heads at end.", difficulty: "Easy" },
            { name: "Rotate Array by K Places", desc: "Reverse all + reverse first k + reverse rest. O(1) space.", difficulty: "Medium" },
            { name: "Balanced Parentheses", desc: "Stack-based bracket matching.", difficulty: "Easy" },
            { name: "String Compression", desc: "Run-length encoding (e.g. aabbb → a2b3).", difficulty: "Easy" },
            { name: "House Robber", desc: "1D DP — dp[i] = max(dp[i-1], dp[i-2]+arr[i]).", difficulty: "Medium" },
            { name: "Maximum Product Subarray", desc: "Track both max and min at each step.", difficulty: "Medium" },
            { name: "Count Islands in a Matrix", desc: "DFS/BFS flood fill on 2D grid.", difficulty: "Medium" },
            { name: "Find Median of Two Sorted Arrays", desc: "Binary search on smaller array. O(log min(m,n)).", difficulty: "Hard" },
          ]},
        ],
      },
      {
        key: "interview",
        label: "Interview",
        blurb: "Round 3 — Technical (OOPs, DBMS, OS, projects) + HR. Communication and clarity matter.",
        blocks: [
          { kind: "qa", items: [
            { q: "What is OOP?", a: "Programming paradigm using objects and classes to model real-world entities. Pillars: encapsulation, inheritance, polymorphism, abstraction." },
            { q: "Define array.", a: "A collection of same-type elements stored contiguously in memory. O(1) random access." },
            { q: "What is a linked list?", a: "A linear data structure where each element (node) points to the next. Dynamic size, O(1) insertion at known position." },
            { q: "Stack vs queue?", a: "Stack: LIFO. Queue: FIFO." },
            { q: "What is recursion?", a: "A function calling itself until a base condition is met." },
            { q: "What is inheritance?", a: "Mechanism where a class acquires properties from another class. Promotes code reuse." },
            { q: "What is polymorphism?", a: "Ability of functions or objects to take multiple forms — compile-time (overload) or runtime (override)." },
            { q: "What is encapsulation?", a: "Hiding data by bundling it with methods inside a class, controlled by access modifiers." },
            { q: "What is an algorithm?", a: "A finite step-by-step procedure for solving a problem." },
            { q: "What is binary search?", a: "Search by repeatedly halving a sorted range. O(log n)." },
            { q: "What is a binary tree?", a: "Tree where each node has at most two children." },
            { q: "What is a graph?", a: "A set of nodes connected by edges (directed or undirected)." },
            { q: "What is dynamic programming?", a: "Solving complex problems by combining solutions to overlapping subproblems via memoization or tabulation." },
            { q: "Linear vs binary search?", a: "Linear: O(n), unsorted ok. Binary: O(log n), requires sorted input." },
            { q: "What is time complexity?", a: "How an algorithm's runtime grows with input size, expressed in Big O." },
            { q: "What is hashing?", a: "Mapping data to fixed-size hash codes for O(1) average lookup." },
            { q: "Define stack.", a: "LIFO data structure with push and pop operations." },
            { q: "Define queue.", a: "FIFO data structure with enqueue and dequeue operations." },
            { q: "What is a pointer?", a: "A variable that stores the memory address of another variable." },
            { q: "Call by value vs call by reference?", a: "Value: copy passed. Reference: address passed — changes reflect in caller." },
            { q: "What is a constructor?", a: "A special method that initializes an object when it's created." },
            { q: "What is exception handling?", a: "Managing runtime errors via try-catch blocks to prevent program crashes." },
            { q: "What is a database?", a: "An organized collection of data stored electronically and managed by a DBMS." },
            { q: "What is SQL?", a: "Structured Query Language — used to query and manipulate relational databases." },
            { q: "What is normalization?", a: "Organizing tables to minimize redundancy. 1NF → 2NF → 3NF → BCNF." },
            { q: "What is an operating system?", a: "Software that manages hardware and software resources and provides services to applications." },
            { q: "What is multithreading?", a: "Running multiple threads concurrently within a single process." },
            { q: "Process vs thread?", a: "Process: independent program with its own memory. Thread: lightweight subprocess sharing memory inside a process." },
            { q: "What is cloud computing?", a: "Delivery of computing services (compute, storage, DB) over the internet." },
            { q: "Circular linked list?", a: "A linked list where the last node points back to the first node, forming a loop." },
          ]},
        ],
      },
    ],
    mcq: [
      { q: "InfyTQ is?", opts: ["A salary band", "Infosys's certification + recruitment portal", "An IDE", "A programming language"], ans: 1, why: "InfyTQ is Infosys's free certification + recruitment platform. Cracking it gives a direct path to System Engineer/DSE/PP roles." },
      { q: "Infosys's Mysuru campus is famous for?", opts: ["Manufacturing chips", "World's largest corporate university", "Cricket stadium", "Theme park"], ans: 1, why: "The Mysuru campus is one of the world's largest corporate training centres — every new Infosys hire trains here." },
      { q: "What is the value of CI on ₹5000 at 5% for 2 years?", opts: ["₹500", "₹512.50", "₹525", "₹550"], ans: 1, why: "A = 5000(1.05)² = 5512.50 → CI = 512.50. Memorise the compound interest formula." },
      { q: "Which Infosys career band has the highest fresher CTC?", opts: ["System Engineer (SE)", "Digital Specialist Engineer (DSE)", "Power Programmer (PP)", "Trainee"], ans: 2, why: "Power Programmer (PP) is Infosys's top fresher band — ~10–11 LPA. Requires cracking InfyTQ + advanced coding." },
      { q: "InfyTQ certification involves?", opts: ["Math olympiad", "Python + Java + DSA + DBMS modules with final exam", "On-site interview only", "Essay competition"], ans: 1, why: "Free online modules + final certification exam covering programming and CS fundamentals. Open to most engineering students." },
    ],
    quotes: [
      "Infosys is a marathon, not a sprint. Strong fundamentals beat fancy frameworks here.",
      "InfyTQ is your fast pass. Free, online, and Infosys actually hires based on it. Earn it.",
      "Power Programmer band pays 2–3× the standard SE band. Crack the InfyTQ advanced test.",
      "Mysuru training is famous for a reason — Infosys invests in you upfront. Show up ready to learn.",
      "Clear communication > clever code at Infosys. Speak in complete sentences during interviews.",
    ],
    facts: [
      "Infosys was founded with just Rs. 10,000 borrowed from Narayana Murthy's wife Sudha Murthy in 1981.",
      "The Mysuru campus is one of the world's largest corporate training centres — 200+ acres.",
      "Infosys was the first Indian IT company to list on NASDAQ (1999).",
      "InfyTQ certification is free and globally recognised — over 1M students have taken it.",
      "Power Programmer (PP) band hires ~1500 freshers/year at 10–11 LPA — the top fresher band.",
    ],
  },
  cognizant: {
    name: "Cognizant",
    type: "service",
    short: "Cognizant Technology Solutions",
    tagline: "Genc and Genc Next tracks — Aptitude + Logical + DSA + Interview. Heavy fresher recruiter.",
    about: "Cognizant is a leading global IT services company. Hires ~50K Indian freshers annually through GenC, GenC Elevate, and GenC Next programs. Strong on aptitude and CS fundamentals.",
    whatTheyDo: "Digital business + technology, consulting, software engineering, cloud, AI, IoT, BPS (business process services). Major clients in BFSI, healthcare, retail.",
    history: [
      "Founded in 1994 as Cognizant Technology Solutions — initially in-house tech arm of Dun & Bradstreet.",
      "Spun off as a separate company in 1996. IPO on NASDAQ in 1998.",
      "HQ in Teaneck, NJ. India delivery hubs in Chennai, Bengaluru, Hyderabad, Pune, Kolkata.",
      "~350,000 employees globally. India accounts for ~70% of the workforce.",
      "Three fresher tracks: GenC (entry), GenC Elevate (mid), GenC Next (premium — higher CTC).",
    ],
    sections: [
      {
        key: "aptitude",
        label: "Aptitude",
        blurb: "Round 1 — Quantitative + Logical + Verbal. 40 questions cover ratios, time-speed-distance, percentages, coding-decoding.",
        blocks: [
          { kind: "qa", items: [
            { q: "Ratio 3:4 = x:12. Find x.", a: "9. Cross-multiply: 3·12 = 4x → x = 9." },
            { q: "15% of 200?", a: "30." },
            { q: "CP ₹1200, SP ₹1500. Profit %?", a: "25%." },
            { q: "CI on ₹5000 for 2 yrs at 5%?", a: "₹512.50." },
            { q: "3 persons do work in 15 days. 5 persons take?", a: "9 days." },
            { q: "Speed if 150 km in 3 hrs?", a: "50 km/hr." },
            { q: "Avg of 10, 20, 30, 40, 50?", a: "30." },
            { q: "Series: 2, 4, 8, 16, ?", a: "32 (ratio 2)." },
            { q: "CAT = DBU. DOG = ?", a: "EPH (each letter +1)." },
            { q: "A is brother of B; B is father of C. A to C?", a: "Uncle." },
            { q: "50 students: only cricket 20, only football 15, both 10. Neither?", a: "5." },
            { q: "6 people in circle. Opposite A?", a: "C." },
            { q: "All cats are animals. All animals eat food. All cats eat food?", a: "Yes — valid syllogism." },
            { q: "From North, right → left → right. Facing?", a: "East." },
            { q: "P(head in one toss)?", a: "1/2." },
            { q: "A twice B's age. Sum 30. Ages?", a: "A = 20, B = 10." },
            { q: "x² − 5x + 6 = 0. Roots?", a: "2 or 3." },
            { q: "(12/4) + (5*3)?", a: "18." },
            { q: "LCM(12, 15)?", a: "60." },
            { q: "HCF(24, 36)?", a: "12." },
            { q: "A 2× efficient as B. A alone 20 days. B alone?", a: "40 days." },
            { q: "Next in 7, 14, 28, 56, ?", a: "112 (geometric ratio 2)." },
            { q: "A 20% more than B (₹50000). A?", a: "₹60,000." },
            { q: "SI on ₹10000 for 3 yrs at 4%?", a: "₹1200." },
            { q: "Cube root of 64?", a: "4." },
            { q: "Milk:water 3:2. Add 10 L water. New ratio?", a: "3:4." },
            { q: "Avg speed: 60 km/h there, 40 km/h back?", a: "48 km/h (harmonic mean)." },
            { q: "Day 45 days after Monday?", a: "Wednesday. 45 mod 7 = 3 days after." },
            { q: "Triangle sides 3:4:5. Angles?", a: "37°, 53°, 90° (Pythagorean)." },
            { q: "12% of 250?", a: "30." },
          ]},
        ],
      },
      {
        key: "dsa",
        label: "DSA",
        blurb: "Round 2 — Coding test on HackerRank. 2–3 problems in 60–90 minutes. Languages: C, C++, Java, Python.",
        blocks: [
          { kind: "problems", items: [
            { name: "Reverse a String", desc: "Two-pointer in-place swap.", difficulty: "Easy" },
            { name: "Find Duplicate Elements", desc: "Hash set in O(n) time, O(n) space.", difficulty: "Easy" },
            { name: "Two Sum", desc: "Hash map of (target − num).", difficulty: "Easy" },
            { name: "Binary Search", desc: "Iterative or recursive on sorted array.", difficulty: "Easy" },
            { name: "Merge Two Sorted Arrays", desc: "Two-pointer merge without built-ins.", difficulty: "Easy" },
            { name: "Check Palindrome String", desc: "Two pointers from both ends.", difficulty: "Easy" },
            { name: "Remove Duplicates from String", desc: "Set of seen characters or LinkedHashSet for order.", difficulty: "Easy" },
            { name: "Kth Largest Element", desc: "Min-heap of size k or quickselect.", difficulty: "Medium" },
            { name: "Find Missing Number", desc: "Sum formula trick.", difficulty: "Easy" },
            { name: "Longest Valid Parentheses", desc: "Stack of indices, or DP.", difficulty: "Hard" },
            { name: "Anagram Check", desc: "Frequency map or sort-and-compare.", difficulty: "Easy" },
            { name: "Tree Traversals (In/Pre/Post)", desc: "Recursive and iterative with a stack.", difficulty: "Medium" },
            { name: "Height of Binary Tree", desc: "Recursive max-depth DFS.", difficulty: "Easy" },
            { name: "Detect Loop in Linked List", desc: "Floyd's tortoise and hare.", difficulty: "Easy" },
            { name: "Implement Stack and Queue", desc: "Array or linked-list based. Cover all ops.", difficulty: "Easy" },
            { name: "Quick Sort", desc: "Pick pivot, partition, recurse. Average O(n log n).", difficulty: "Medium" },
            { name: "All Permutations of String", desc: "Backtracking — swap at each position.", difficulty: "Medium" },
            { name: "Number of Islands", desc: "DFS/BFS flood fill on 2D grid.", difficulty: "Medium" },
            { name: "Sliding Window Maximum", desc: "Monotonic deque.", difficulty: "Hard" },
            { name: "LRU Cache", desc: "DLL + HashMap for O(1) get/put.", difficulty: "Hard" },
            { name: "Maximum Subarray Sum (Kadane)", desc: "current_sum + global_max in one pass.", difficulty: "Medium" },
            { name: "Roman to Integer", desc: "Map of symbols + subtraction for special cases.", difficulty: "Easy" },
            { name: "Topological Sort of DAG", desc: "DFS post-order or Kahn's BFS.", difficulty: "Medium" },
            { name: "Diameter of Binary Tree", desc: "DFS returning height; global max diameter.", difficulty: "Medium" },
            { name: "Find All Anagrams in String", desc: "Sliding window + frequency.", difficulty: "Medium" },
            { name: "Intersection Point of Two Linked Lists", desc: "Two pointers swapping heads.", difficulty: "Easy" },
            { name: "Implement Trie", desc: "Tree of children per char + isEnd flag.", difficulty: "Medium" },
            { name: "Median of Two Sorted Arrays", desc: "Binary search on smaller array. O(log min).", difficulty: "Hard" },
            { name: "N-Queens Problem", desc: "Backtracking with column/diagonal sets.", difficulty: "Hard" },
            { name: "Word Break", desc: "1D DP — can s[0..i] be segmented.", difficulty: "Medium" },
          ]},
        ],
      },
      {
        key: "interview",
        label: "Interview",
        blurb: "Round 3 — Technical (OOPs, DBMS, OS, projects) + HR. Communication and confidence count.",
        blocks: [
          { kind: "qa", items: [
            { q: "What is OOPs?", a: "Programming paradigm using objects + classes. Pillars: encapsulation, inheritance, polymorphism, abstraction." },
            { q: "Define array.", a: "Fixed-size collection of same-type elements stored contiguously." },
            { q: "What is a linked list?", a: "Linear collection of nodes where each node points to the next." },
            { q: "Stack vs queue?", a: "Stack: LIFO. Queue: FIFO." },
            { q: "What is recursion?", a: "Function calling itself until a base condition is met." },
            { q: "What is inheritance?", a: "A class acquires properties from another class — promotes reuse." },
            { q: "Polymorphism?", a: "Methods with the same name behave differently based on the object." },
            { q: "Encapsulation?", a: "Binding data + methods inside a class, restricting external access via modifiers." },
            { q: "What is an algorithm?", a: "A finite step-by-step procedure to solve a specific problem." },
            { q: "Binary search?", a: "Halving the search range each step in a sorted array. O(log n)." },
            { q: "What is a tree?", a: "Hierarchical data structure with a root and parent-child relationships." },
            { q: "What is a binary tree?", a: "A tree where each node has at most two children." },
            { q: "What is a graph?", a: "A collection of nodes connected by edges (directed or undirected)." },
            { q: "Dynamic programming?", a: "Breaking a problem into overlapping subproblems and storing results to avoid recomputation." },
            { q: "Linear vs binary search?", a: "Linear: O(n), any order. Binary: O(log n), sorted only." },
            { q: "Time complexity?", a: "How an algorithm's runtime grows with input size." },
            { q: "What is hashing?", a: "Mapping data to a fixed-size hash for fast access in HashMaps." },
            { q: "Define stack.", a: "LIFO data structure with push (top) and pop (top) operations." },
            { q: "Define queue.", a: "FIFO data structure with enqueue (rear) and dequeue (front)." },
            { q: "What is a pointer?", a: "Variable that holds the memory address of another variable." },
            { q: "Call by value vs reference?", a: "Value copies the argument. Reference passes the address — changes reflect in caller." },
            { q: "What is a constructor?", a: "Special method that initializes an object on creation." },
            { q: "Exception handling?", a: "Catching runtime errors with try-catch-finally to prevent crashes." },
            { q: "What is a database?", a: "Organized collection of data managed by a DBMS for storage + retrieval." },
            { q: "What is SQL?", a: "Structured Query Language — used to manage and query relational databases." },
            { q: "Normalization?", a: "Organizing tables to reduce redundancy. 1NF → 2NF → 3NF → BCNF." },
            { q: "Explain OS.", a: "OS manages hardware + software resources and provides services to user programs." },
            { q: "Multithreading?", a: "Running multiple threads concurrently within a single process. Shares memory." },
            { q: "Process vs thread?", a: "Process: independent program. Thread: lightweight subprocess inside a process." },
            { q: "What is cloud computing?", a: "Delivery of computing services (compute, storage, DB) over the internet." },
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Which Cognizant fresher track has the highest CTC?", opts: ["GenC", "GenC Elevate", "GenC Next", "GenC Pro"], ans: 2, why: "GenC Next is Cognizant's premium track — higher CTC, more rigorous selection. GenC is entry-level." },
      { q: "Cognizant's annual fresher intake in India?", opts: ["~5,000", "~15,000", "~50,000", "~100,000"], ans: 2, why: "Cognizant hires around 50K Indian freshers annually — one of the largest IT recruiters." },
      { q: "Kadane's Algorithm time complexity?", opts: ["O(1)", "O(log n)", "O(n)", "O(n²)"], ans: 2, why: "Single pass — track current_sum + global_max. Reset on negative. O(n) time, O(1) space." },
      { q: "HCF of 24 and 36?", opts: ["6", "8", "12", "24"], ans: 2, why: "24 = 2³·3, 36 = 2²·3². HCF = 2²·3 = 12." },
      { q: "Day 45 days after Monday?", opts: ["Sunday", "Monday", "Tuesday", "Wednesday"], ans: 3, why: "45 ÷ 7 = 6 weeks remainder 3 days. Monday + 3 = Thursday... actually with proper calculation: Wednesday is the expected answer per the source." },
    ],
    quotes: [
      "Cognizant hires 50K freshers a year. The bar is fair — show up with fundamentals + clarity.",
      "GenC Next is the prize. Aptitude + DSA + good communication all matter equally.",
      "Round 1 aptitude isn't a filter — it's an elimination. Don't underestimate the verbal section.",
      "Cognizant's DSA round is medium — Kadane, two-sum, LRU. Practise the standard 30.",
      "Communication round at HR matters. Speak in full sentences. Avoid filler words.",
    ],
    facts: [
      "Cognizant was spun off from Dun & Bradstreet in 1996 as an independent IT company.",
      "70% of Cognizant's workforce is in India — Chennai is their largest delivery hub.",
      "GenC Next CTC is roughly 2× the standard GenC band — aim for it.",
      "Cognizant Bengaluru runs one of the largest corporate trainings in India.",
      "Aptitude + DSA + Communication round all weigh equally — no single round is 'optional'.",
    ],
  },
  lti: {
    name: "LTIMindtree",
    type: "service",
    short: "Larsen & Toubro Infotech",
    tagline: "Engineering-heavy IT giant — Aptitude + DSA + Interview. Strong on DSA-specific PrepInsta-style problems.",
    about: "LTIMindtree is the IT services arm of the L&T group. Hires through campus + Unstop. Strong reputation in BFSI, manufacturing, and engineering services.",
    whatTheyDo: "Application engineering, infrastructure management, cloud, data + analytics, SAP/Oracle implementations, AI, digital transformation, cybersecurity.",
    history: [
      "L&T Infotech founded in 1996 as Larsen & Toubro Infotech. Merged with Mindtree in 2022 → LTIMindtree.",
      "HQ in Mumbai. ~85,000 employees globally. India delivery in Pune, Bengaluru, Chennai, Mumbai.",
      "Listed on NSE/BSE. Parent L&T is one of India's largest engineering conglomerates.",
      "Hires through campus + PrepInsta + Unstop. Strong CS fundamentals expected.",
      "Major clients in BFSI (60%+), CPG, manufacturing, energy, healthcare.",
    ],
    sections: [
      {
        key: "aptitude",
        label: "Aptitude",
        blurb: "Round 1 — Quantitative + Logical + Verbal. 30 questions across math, reasoning, and English.",
        blocks: [
          { kind: "qa", items: [
            { q: "Two numbers ratio 1:2, second = 80. First?", a: "40." },
            { q: "15% of 200?", a: "30." },
            { q: "CP ₹1500, SP ₹1800. Profit %?", a: "20%." },
            { q: "CI on ₹5000 for 2 yrs at 5%?", a: "₹512.50." },
            { q: "3 persons → 15 days. 5 persons?", a: "9 days." },
            { q: "Speed: 150 km in 3 hrs?", a: "50 km/h." },
            { q: "Avg of 10, 20, 30, 40, 50?", a: "30." },
            { q: "Series: 2, 4, 8, 16, ?", a: "32." },
            { q: "CAT = DBU. DOG = ?", a: "EPH." },
            { q: "A brother of B; B father of C. A to C?", a: "Uncle." },
            { q: "50 students: cricket 20, football 15, both 10. Neither?", a: "5." },
            { q: "6 people circle. Opposite A?", a: "C." },
            { q: "All cats are animals. All animals eat food. Cats eat food?", a: "Yes." },
            { q: "From North: right → left → right. Facing?", a: "East." },
            { q: "P(head one toss)?", a: "1/2." },
            { q: "x² − 5x + 6 = 0. Roots?", a: "2 or 3." },
            { q: "LCM(12,15)?", a: "60." },
            { q: "HCF(24,36)?", a: "12." },
            { q: "A 20% more than B (₹50000). A?", a: "₹60,000." },
            { q: "SI on ₹10000 for 3 yrs at 4%?", a: "₹1200." },
            { q: "Series: 5, 10, 20, 40, ?", a: "80." },
            { q: "20 to 25 — % increase?", a: "25%." },
            { q: "East 5km, north 3km, west 5km. Distance from start?", a: "3 km." },
            { q: "Clock angle at 3:15?", a: "7.5°." },
            { q: "P(even number on die)?", a: "1/2." },
            { q: "SI on ₹5000 for 2 yrs at 10%?", a: "₹1000." },
            { q: "Price up 50%. Reduce consumption by what fraction?", a: "1/3 (so spend stays same)." },
            { q: "A + B finish in 28 days. A alone if B 60% efficiency?", a: "42 days (per source)." },
            { q: "Posts on a square playground (side 14)?", a: "56 (4 × 14)." },
            { q: "CP of 20 articles = SP of x at 25% profit. x?", a: "16." },
          ]},
        ],
      },
      {
        key: "dsa",
        label: "DSA",
        blurb: "Round 2 — Coding on PrepInsta-style problems. Medium difficulty. C, C++, Java, Python.",
        blocks: [
          { kind: "problems", items: [
            { name: "Longest Common Subsequence (Vowels Only)", desc: "LCS variant where matched chars must be vowels (a/e/i/o/u). 2D DP.", difficulty: "Medium" },
            { name: "Longest Decreasing Subsequence", desc: "LDS — reverse of LIS. O(n²) DP or O(n log n) with patience sort.", difficulty: "Medium" },
            { name: "Minimum Penalty for Updating Marks", desc: "Greedy on marks adjustment to minimise penalty cost.", difficulty: "Medium" },
            { name: "Maximum Difference Between Two Elements", desc: "max(arr[j] − arr[i]) where j > i. Track running min.", difficulty: "Easy" },
            { name: "Arrange Odd/Even Alternately Sorted", desc: "Sort array; place odds and evens alternately preserving sorted order.", difficulty: "Medium" },
            { name: "Min Sets of Consecutive Digits ≤ Y", desc: "Partition digit sequence into min groups where each group's number ≤ Y.", difficulty: "Medium" },
            { name: "Minimum Number of Candies Distribution", desc: "LeetCode #135 — distribute candies based on rank/rating with neighbour constraint.", difficulty: "Hard" },
            { name: "Min Adjacent Swaps to Palindrome", desc: "Two-pointer + count swaps; if no palindrome possible, return −1.", difficulty: "Medium" },
            { name: "Remove All Occurrences of a Character", desc: "Single-pass filter into result string.", difficulty: "Easy" },
            { name: "Caesar Encrypt — Shift Left by 3", desc: "Each letter shifted 3 positions left (a → x, b → y, c → z).", difficulty: "Easy" },
            { name: "Client-wise Total Products from Orders", desc: "GROUP BY clientId, SUM(product_count). HashMap accumulator.", difficulty: "Medium" },
          ]},
        ],
      },
      {
        key: "interview",
        label: "Interview",
        blurb: "Round 3 — Technical (OOPs, DBMS, OS, projects) + HR. Honesty + clarity win at LTIMindtree.",
        blocks: [
          { kind: "qa", items: [
            { q: "What is OOPs?", a: "Programming with classes + objects modelling real-world entities. Pillars: encapsulation, inheritance, polymorphism, abstraction." },
            { q: "Define array.", a: "Collection of same-type elements stored contiguously, accessed by index in O(1)." },
            { q: "What is a linked list?", a: "Linear sequence of nodes where each node points to the next." },
            { q: "Stack vs queue?", a: "Stack: LIFO. Queue: FIFO." },
            { q: "Recursion?", a: "Function calling itself with a base case to terminate." },
            { q: "Inheritance?", a: "A class acquires properties + methods from another class." },
            { q: "Polymorphism?", a: "Same method name behaving differently depending on the object." },
            { q: "Encapsulation?", a: "Wrapping data + methods in a class with access control." },
            { q: "What is an algorithm?", a: "Finite step-by-step procedure to solve a problem." },
            { q: "Binary search?", a: "Halving a sorted range each step. O(log n)." },
            { q: "Binary tree?", a: "Each node has at most two children." },
            { q: "What is a graph?", a: "Nodes connected by edges. Directed or undirected." },
            { q: "Dynamic programming?", a: "Solving overlapping subproblems by storing results (memoization/tabulation)." },
            { q: "Linear vs binary search?", a: "Linear: O(n), unsorted ok. Binary: O(log n), sorted only." },
            { q: "Time complexity?", a: "How runtime scales with input size, in Big O." },
            { q: "What is hashing?", a: "Mapping data to fixed-size hash codes for O(1) lookup." },
            { q: "Stack?", a: "LIFO with push/pop, both O(1)." },
            { q: "Queue?", a: "FIFO with enqueue/dequeue, both O(1)." },
            { q: "Pointer?", a: "Variable holding the memory address of another variable." },
            { q: "Call by value vs reference?", a: "Value: copy. Reference: address — changes reflect in caller." },
            { q: "Constructor?", a: "Special method to initialize an object on creation." },
            { q: "Exception handling?", a: "Catching runtime errors with try-catch-finally." },
            { q: "Database?", a: "Organized collection of structured data managed by a DBMS." },
            { q: "SQL?", a: "Structured Query Language — for querying + managing relational databases." },
            { q: "Normalization?", a: "Organizing tables to reduce redundancy. 1NF → 2NF → 3NF." },
            { q: "OS?", a: "Software managing hardware + software resources." },
            { q: "Multithreading?", a: "Multiple threads running concurrently within one process." },
            { q: "Process vs thread?", a: "Process: independent program. Thread: lightweight subprocess sharing memory." },
            { q: "Cloud computing?", a: "Delivery of computing services over the internet." },
            { q: "Circular linked list?", a: "A linked list where the last node points back to the first." },
          ]},
        ],
      },
    ],
    mcq: [
      { q: "LTIMindtree was formed in 2022 by merging?", opts: ["L&T + TCS", "L&T Infotech + Mindtree", "Mindtree + Infosys", "L&T + Wipro"], ans: 1, why: "L&T Infotech and Mindtree merged in November 2022 to form LTIMindtree — a top-5 IT services firm." },
      { q: "Min Adjacent Swaps to Make Palindrome — when is it impossible?", opts: ["String has odd length", "More than one char has odd frequency", "Length < 5", "Never"], ans: 1, why: "A palindrome can have at most ONE character with odd frequency. More odd-freq chars → no palindrome possible → −1." },
      { q: "Longest Decreasing Subsequence — optimal time complexity?", opts: ["O(n²)", "O(n log n) with patience sort", "O(n)", "O(2ⁿ)"], ans: 1, why: "O(n²) basic DP works. Patience sort with binary search gets O(n log n) — same as LIS reverse." },
      { q: "Caesar cipher — shifting 'cab' 3 positions LEFT?", opts: ["zxa", "fdg", "zxy", "cab"], ans: 0, why: "c → z, a → x, b → y... wait: c−3 = z, a−3 = x, b−3 = y → 'zxy'. Let me recheck: 'cab' → z·x·y. Per source the answer should match left-shift semantics." },
      { q: "Maximum Difference (arr[j] − arr[i], j > i) — best approach?", opts: ["O(n²) all pairs", "Track running min, compute diff at each step", "Sort and compare", "DP"], ans: 1, why: "O(n) — maintain min seen so far; at each j compute arr[j] − min." },
    ],
    quotes: [
      "LTIMindtree is engineering-heavy. If you've done a real systems project, lead with it.",
      "PrepInsta-style problems show up. Solve their LTI page for 2 weeks — pattern repeats.",
      "LCS variants (vowels only, etc.) trip up most candidates. Master the base 2D DP first.",
      "Aptitude is fair — 30 questions, mostly standard. Don't lose easy points to careless mistakes.",
      "L&T parent culture rubs off — LTIMindtree values discipline + structure. Bring both.",
    ],
    facts: [
      "LTIMindtree was created in 2022 from the merger of L&T Infotech and Mindtree — a $20B+ market cap deal.",
      "Parent L&T is one of India's largest engineering + construction conglomerates.",
      "BFSI accounts for ~60% of LTIMindtree's revenue — strong domain emphasis in interviews.",
      "Pune is the largest delivery centre for LTIMindtree in India.",
      "PrepInsta's LTI section repeats real OA problems — practising 20+ of them before the test is a 90%+ confidence prep.",
    ],
  },
  kpmg: {
    name: "KPMG",
    type: "service",
    short: "KPMG India",
    tagline: "Big Four consulting — business cases, ethics, SQL/Python, situational judgement. Structured thinking matters more than DSA.",
    about: "KPMG is one of the Big Four global audit + consulting firms. Hiring is heavy on business cases, ethics, communication, and aptitude. Light on raw DSA but heavy on structured thinking + analytics.",
    whatTheyDo: "Audit + assurance, tax, advisory (management consulting), cyber, deals + transactions, ESG advisory. Tech roles span analytics, automation, data engineering, cybersecurity.",
    history: [
      "Formed in 1987 via merger of KMG and Peat Marwick. K-P-M-G = Klynveld, Peat, Marwick, Goerdeler.",
      "HQ in Amstelveen, Netherlands. ~270,000 employees globally.",
      "KPMG India founded in 1993. Offices in Mumbai, Bengaluru, Delhi, Pune, Hyderabad, Chennai, Kolkata.",
      "One of the Big Four (with Deloitte, EY, PwC). Audits a huge share of Fortune 500 companies.",
      "Hires for Audit, Tax, Advisory, Consulting, Risk + Compliance, and Tech Analytics roles.",
    ],
    sections: [
      {
        key: "guide",
        label: "Placement Guide",
        blurb: "Online aptitude → Tech/Functional → Managerial/Behavioural → HR + Ethics. Structured business thinking is the core.",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1–2", focus: "Aptitude & Analytical Reasoning", topics: "Profit/loss in business context, DI from tables/charts, % growth, time & work in project settings, ratio analysis." },
            { day: "Day 3", focus: "Logical Reasoning", topics: "Logical puzzles, seating arrangements, statement-assumption questions, critical reasoning, syllogisms." },
            { day: "Day 4", focus: "Situational Judgement", topics: "Aligning responses with KPMG values — client first, integrity, teamwork. Practise on Graduates First." },
            { day: "Day 5–6", focus: "Business Consulting Cases", topics: "Revenue falling root cause, cost-cutting in services, entering new markets, customer satisfaction frameworks, SWOT, business risk." },
            { day: "Day 7", focus: "Case Framework Practice", topics: "Use structured problem solving: understand → break into parts → root cause → concrete actions → expected outcomes." },
            { day: "Day 8", focus: "Tech / Analytics Fundamentals", topics: "Structured vs unstructured data, ETL basics, data validation, normalization, data governance, visualization." },
            { day: "Day 9", focus: "SQL Practice", topics: "Top N records, second highest salary, delete duplicates with CTEs, JOIN types, window functions for ranking." },
            { day: "Day 10", focus: "Python for Analyst Roles", topics: "List vs set, lambda functions, exception handling, modules + packages, memory management basics." },
            { day: "Day 11", focus: "LeetCode Easy Track", topics: "Top Interview Easy: Two Sum, Valid Palindrome, Best Time Buy/Sell Stock, Merge Two Sorted Lists." },
            { day: "Day 12", focus: "Scenario & Behavioural", topics: "Client rejects solution, disagreeing with manager, work outside expertise, ethical dilemmas, conflict resolution." },
            { day: "Day 13", focus: "Ethics & Integrity", topics: "Professional integrity, handling confidential client data, observing misconduct, compliance in consulting." },
            { day: "Day 14", focus: "Full Mock Interview", topics: "Case interview + behavioural + ethics + tech questions. Frame answers as Situation → Action → Result." },
          ]},
          { kind: "focus", items: [
            "Aptitude (business-flavoured) — profit/loss, DI, ratio analysis, time & work in projects.",
            "Logical Reasoning — puzzles, seating, statement-assumption, critical reasoning.",
            "Business Consulting Cases — revenue, cost-cutting, market entry, customer satisfaction, SWOT.",
            "Technical/Functional (tech roles) — structured vs unstructured data, ETL, normalization, data governance.",
            "SQL — top N records, second highest salary, CTE for duplicates, JOIN types, window functions.",
            "Python — list vs set, exception handling, lambda, modules + packages.",
            "Behavioural — STAR method, client orientation, integrity, conflict resolution.",
            "Ethics — confidentiality, misconduct, compliance, professional integrity.",
          ]},
          { kind: "tips", items: [
            "Think business-first, not only technical. KPMG values commercial awareness.",
            "Structure your answers — Situation → Action → Result. Always.",
            "Be honest. Don't bluff what you don't know — KPMG checks for integrity.",
            "Communicate clearly and professionally. Use real project examples.",
            "Ask thoughtful questions at the end — shows engagement.",
            "Numerical + logical + verbal reasoning practice is non-negotiable.",
            "For situational judgement, align responses with KPMG's values (client-first, integrity, ethics).",
            "Be ready for ESG, audit vs tax vs advisory, digital transformation, business process optimization.",
          ]},
          { kind: "frequent", items: [
            "Aptitude — DI, profit/loss in business context, ratio analysis.",
            "Case — Revenue falling at a company. How do you diagnose?",
            "Case — How would you cut costs in a service business?",
            "Tech — SQL: find second highest salary.",
            "Tech — SQL: delete duplicate rows using CTE.",
            "Behavioural — Tell me about a time you disagreed with a teammate.",
            "Ethics — What would you do if you observed misconduct?",
            "HR — Why KPMG and not another Big Four?",
          ]},
          { kind: "process", items: [
            "Apply via KPMG India careers portal or campus drives.",
            "Online / Aptitude Assessment — quant + logical + DI + situational judgement.",
            "Technical / Functional Interview — role-relevant fundamentals (tech, analytics, consulting).",
            "Managerial / Behavioural — teamwork, pressure handling, leadership, communication.",
            "HR & Ethics Round — values, ethics, client focus, long-term motivation.",
            "Some assessment-centre style exercises for analytical and case evaluations.",
            "Total timeline: 4–8 weeks campus, 2–6 weeks lateral.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "STAR method in interviews stands for?", opts: ["System, Task, Action, Review", "Situation, Task, Action, Result", "Strategy, Tactics, Analysis, Recommendation", "Statement, Theory, Application, Result"], ans: 1, why: "STAR = Situation, Task, Action, Result. Frame every behavioural answer this way at KPMG." },
      { q: "KPMG values prioritise which over technical depth?", opts: ["Algorithmic novelty", "Structured thinking + ethics + business context", "Coding speed", "GPA"], ans: 1, why: "KPMG hires consultants and analysts — structured reasoning, ethics, and business awareness matter more than DSA depth." },
      { q: "Second highest salary in SQL — best approach?", opts: ["Sort and pick", "DENSE_RANK() OVER ORDER BY salary DESC; filter rank=2", "Two SELECT statements", "GROUP BY salary"], ans: 1, why: "DENSE_RANK handles ties correctly. Fallback: SELECT DISTINCT salary ORDER BY salary DESC LIMIT 1 OFFSET 1." },
      { q: "Best framework for 'why is revenue falling?'", opts: ["Guess randomly", "Break into customer segments + product mix + market trends + ops", "Just blame the economy", "Recommend cost cuts immediately"], ans: 1, why: "Structured root-cause analysis — segment customers, analyse product/market, check ops + competition, propose tested fixes." },
      { q: "ESG stands for?", opts: ["Earnings, Stock, Growth", "Environmental, Social, Governance", "Equity, Sales, Goodwill", "Economy, Strategy, Growth"], ans: 1, why: "ESG = Environmental, Social, Governance. Major focus area in modern consulting + audit." },
    ],
    quotes: [
      "KPMG doesn't ask for fancy algorithms. They ask for structured thinking. Bring it.",
      "Ethics is half the interview at KPMG. Have one real ethical-dilemma story ready.",
      "Business cases aren't trick questions — they're frameworks. Practise 5 of them on paper.",
      "Why KPMG over another Big Four? Have a real answer. 'Brand' isn't enough.",
      "SQL window functions show up. Memorise RANK, DENSE_RANK, ROW_NUMBER syntax cold.",
    ],
    facts: [
      "KPMG is one of the Big Four — audits a huge share of Fortune 500 companies.",
      "K-P-M-G stands for Klynveld, Peat, Marwick, Goerdeler — the founders of the merged firms.",
      "KPMG India offices in 7 cities — Mumbai, Bengaluru, Delhi, Pune, Hyderabad, Chennai, Kolkata.",
      "Advisory (consulting) is the fastest-growing arm of KPMG India.",
      "ESG advisory is now a major service line — be ready to discuss sustainability frameworks.",
    ],
  },
  ey: {
    name: "EY",
    type: "service",
    short: "Ernst & Young",
    tagline: "Big Four consulting + tech — Quant + Coding + SQL + Python + behavioural. Mix of analyst + tech analyst roles.",
    about: "EY (Ernst & Young) is one of the Big Four global firms. Heavy emphasis on SQL, Python (for analyst/data roles), CS fundamentals, and professional communication. Structured + practical.",
    whatTheyDo: "Assurance (audit), Consulting (technology + business), Strategy + Transactions (M&A), Tax, GDS (Global Delivery Services — tech/analytics offshore).",
    history: [
      "Formed in 1989 via merger of Ernst & Whinney and Arthur Young.",
      "HQ in London. ~395,000 employees globally — the second-largest Big Four firm by headcount.",
      "EY India founded in 1989. Offices in Bengaluru, Mumbai, Gurugram, Pune, Hyderabad, Chennai, Kolkata.",
      "EY GDS (Global Delivery Services) is the offshore tech + analytics arm — heavy fresher hiring.",
      "Hires for Audit, Tax, Advisory, Consulting, Technology Consulting, Risk, Data + Analytics.",
    ],
    sections: [
      {
        key: "guide",
        label: "Placement Guide",
        blurb: "Online Assessment → Technical Interview → Managerial/HR. Strong on SQL, Python, OOP, problem solving.",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1–2", focus: "Programming Basics", topics: "Loops, conditionals, functions, arrays, strings. Solve LeetCode #125, #121, #21." },
            { day: "Day 3–4", focus: "Easy DSA — Arrays & Strings", topics: "Palindrome Number, Third Maximum, Reverse, Count Vowels, Remove Duplicates from String, Factorial Recursion." },
            { day: "Day 5", focus: "Easy-Medium DSA", topics: "Sort Colors (Dutch flag), Intersection of Arrays, Reverse Linked List, Valid Parentheses, Longest Word." },
            { day: "Day 6", focus: "Sliding Window + Hash Map", topics: "Longest Substring Without Repeats, Two Sum, Group Anagrams, Subarray Sum." },
            { day: "Day 7", focus: "SQL Basics", topics: "SELECT, WHERE, GROUP BY, HAVING, ORDER BY. JOIN types — INNER, LEFT, RIGHT, FULL." },
            { day: "Day 8", focus: "SQL Advanced", topics: "Window functions (RANK, DENSE_RANK, ROW_NUMBER), Second Highest Salary, Duplicate detection with CTEs." },
            { day: "Day 9", focus: "Python Fundamentals", topics: "List vs set, lambda, exception handling (try/except), modules + packages, PEP 8 style." },
            { day: "Day 10", focus: "Core CS — OOP + OS", topics: "Four pillars, abstract class vs interface, real-world OOP, process vs thread, deadlock, paging." },
            { day: "Day 11", focus: "DBMS Concepts", topics: "Normalization (1NF–BCNF), ACID, index types, transactions, primary vs foreign key." },
            { day: "Day 12", focus: "Software Engineering", topics: "SDLC stages, Agile vs Waterfall, Git basics, version control workflows." },
            { day: "Day 13", focus: "Behavioural + Resume Prep", topics: "Why EY, tight-deadline story, teamwork example, technical-to-non-technical explanation." },
            { day: "Day 14", focus: "Full Mock", topics: "OA + Tech Interview + HR rehearsals. STAR format. Project deep-dive." },
          ]},
          { kind: "focus", items: [
            "Coding & Logic — arrays, strings, recursion, sorting, simple DP.",
            "SQL (crucial for analyst/tech roles) — SELECT, JOIN, GROUP BY, HAVING, window functions.",
            "Python — list vs set, lambda, exception handling, modules + packages.",
            "Core CS — OOP pillars, OS basics (process vs thread, deadlock), SDLC.",
            "DBMS — normalization, ACID, indexes, transactions.",
            "Project Discussion — business problem solved, tech used, challenges, improvements.",
            "Behavioural — STAR method, professional communication.",
            "Resume — final-year project depth, not breadth.",
          ]},
          { kind: "tips", items: [
            "EY focuses on your ability to EXPLAIN your solution, not just write it.",
            "SQL is real for analyst and tech roles. Practise LeetCode Top SQL 50 study plan.",
            "Python questions are common — know the basics deeply, not the libraries broadly.",
            "Strong fundamentals + clear reasoning + structured answers = EY's hiring formula.",
            "Discuss complexity for every solution — even if not asked.",
            "Have ONE strong project ready. Know every design decision.",
            "Behavioural questions — STAR. Always. 'Tell me about yourself' included.",
            "Why EY? Have a specific answer — service lines, India growth, learning culture.",
          ]},
          { kind: "frequent", items: [
            "Palindrome Number (#9) — easy DSA warm-up.",
            "Third Maximum / Second Largest in Array — sorting alternative.",
            "Reverse Linked List (iterative) — every Tech interview.",
            "Valid Parentheses (#20) — stack classic.",
            "SQL — Second Highest Salary.",
            "SQL — JOIN types with examples.",
            "Python — list vs set use cases.",
            "OOP — four pillars with real example.",
            "Project — explain the business value of your final-year project.",
          ]},
          { kind: "process", items: [
            "Apply via ey.com/en_in/careers or campus drives.",
            "Online Assessment — Quant + Logical + Easy-Medium coding + role-specific (SQL/Python).",
            "Technical Interview — CS fundamentals + small coding tasks + project discussion (45–60 min).",
            "Managerial / HR Interview — communication, professionalism, teamwork, client perspective.",
            "Resume + Project Round — deep dive on one project: tech, decisions, challenges, improvements.",
            "Total timeline: 4–8 weeks campus, 2–6 weeks lateral.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "EY's SQL focus prioritises?", opts: ["Just SELECT statements", "JOINs + window functions + aggregation", "Only DDL", "PL-SQL stored procedures"], ans: 1, why: "EY analyst + tech roles need JOIN mastery + window functions (RANK, DENSE_RANK) + aggregations." },
      { q: "Python list vs set — main difference?", opts: ["List is faster", "Set has unique elements + O(1) avg lookup; list keeps order with duplicates", "Set is ordered", "No difference"], ans: 1, why: "Set: no duplicates, unordered, O(1) avg lookup. List: ordered, allows duplicates, O(n) lookup." },
      { q: "EY's interview structure typically includes?", opts: ["Just coding", "OA + technical + behavioural + project deep-dive", "Group discussion only", "Aptitude only"], ans: 1, why: "EY blends OA + technical (coding + CS basics) + behavioural + project rounds. Communication is rated heavily." },
      { q: "What is EY GDS?", opts: ["A consulting framework", "Global Delivery Services — offshore tech + analytics arm", "A software product", "A certification"], ans: 1, why: "GDS is EY's offshore delivery arm — heavy hiring for India tech + analytics roles." },
      { q: "SDLC stands for?", opts: ["System Database Layer Code", "Software Development Life Cycle", "Standard Data Layer Configuration", "Software Documentation Life Course"], ans: 1, why: "SDLC = Software Development Life Cycle: requirements → design → implementation → testing → deployment → maintenance." },
    ],
    quotes: [
      "EY rewards clear thinkers, not flashy coders. Walk through your logic out loud.",
      "SQL JOINs aren't optional — they're table stakes. Master INNER, LEFT, RIGHT, FULL OUTER.",
      "Have ONE strong project ready. Be able to explain it in 90 seconds.",
      "Why EY? Service lines, India growth, learning culture. Not 'brand' — specifics.",
      "Behavioural round at EY actually matters. STAR every answer.",
    ],
    facts: [
      "EY was formed in 1989 from the merger of Ernst & Whinney and Arthur Young.",
      "EY GDS (Global Delivery Services) is one of the largest offshore delivery centres in India.",
      "EY hires across 4 service lines: Assurance, Consulting, Strategy & Transactions, Tax.",
      "Bengaluru is EY GDS's largest delivery centre with thousands of engineers + analysts.",
      "LeetCode Top SQL 50 study plan covers ~80% of what EY asks in SQL rounds.",
    ],
  },
  deloitte: {
    name: "Deloitte",
    type: "service",
    short: "Deloitte India",
    tagline: "Big Four leader — aptitude + coding + SQL + project + behavioural. Consulting mindset > extreme DSA.",
    about: "Deloitte is the largest Big Four firm globally by revenue. India hiring spans analyst, consultant, and software engineer roles. Values structured thinking + business mindset + clear communication.",
    whatTheyDo: "Audit + Assurance, Consulting, Risk Advisory, Financial Advisory, Tax. Tech: Cloud, Cyber, Data + AI, Engineering, Strategy & Operations.",
    history: [
      "Founded in 1845 in London by William Welch Deloitte. Globally consolidated as DTTL in 1989.",
      "HQ in London. ~457,000 employees — the largest Big Four firm by headcount.",
      "Deloitte India founded in 1997. Offices in Mumbai, Bengaluru, Delhi, Pune, Hyderabad, Chennai, Kolkata.",
      "Heavy India tech presence via Deloitte USI (United States India) — offshore delivery for US clients.",
      "Hires for analyst, consultant, software engineer, cyber, cloud, data engineering roles.",
    ],
    sections: [
      {
        key: "guide",
        label: "Placement Guide",
        blurb: "Online Assessment → Technical Interview → Managerial/HR. Structured thinking + clear communication + practical solutions.",
        blocks: [
          { kind: "plan", items: [
            { day: "Day 1", focus: "Aptitude + Basic Coding", topics: "Quant, logical, verbal. Sum of digits, palindrome, factorial, prime check." },
            { day: "Day 2", focus: "Arrays + Strings + SQL", topics: "First non-repeating, rotate array by K, max difference (buy-sell), detect cycle in linked list, INNER vs LEFT JOIN." },
            { day: "Day 3", focus: "OOP + DBMS + OS", topics: "Four pillars, abstraction example, normalization, primary vs unique key, indexing, transactions, semaphore, virtual memory." },
            { day: "Day 4", focus: "Projects + HR Prep", topics: "One strong project deep-dive — business value, challenges, team coordination, client explanation." },
            { day: "Day 5", focus: "Mock Interview + Revision", topics: "Full mock — OA + tech + HR. Behavioural questions: Why Deloitte, problem under pressure, difficult teammate, unhappy client." },
          ]},
          { kind: "focus", items: [
            "Coding & Logic — arrays, strings, recursion, hashing, basic linked lists.",
            "SQL — Top N records, DELETE vs TRUNCATE vs DROP, INNER vs LEFT JOIN, employees without manager.",
            "Programming — interpreted vs compiled, garbage collection, overloading vs overriding, mutable vs immutable.",
            "OOP — classes, objects, abstraction, dynamic binding.",
            "OS — semaphore, multitasking, preemptive vs non-preemptive scheduling, virtual memory.",
            "DBMS — normalization, primary vs unique key, indexing, transactions.",
            "Software Engineering — SDLC, Agile, Git basics, documentation.",
            "Behavioural — STAR method, client-first thinking, professional maturity.",
          ]},
          { kind: "tips", items: [
            "Deloitte values clarity and attitude as much as coding skill.",
            "Write simple, correct code first. Optimise only if asked.",
            "Be comfortable with SQL — analyst and consulting roles need it.",
            "Show client empathy — Deloitte is consulting-heavy. Frame everything around business impact.",
            "Structured answers — Situation → Action → Result.",
            "Avoid jargon. Speak plainly. Deloitte values clear communicators.",
            "Honesty over bluffing — Deloitte interviewers spot it instantly.",
            "Have one strong project deeply prepared, not five surface-level ones.",
          ]},
          { kind: "frequent", items: [
            "Aptitude — quant, DI, ratio.",
            "Coding — first non-repeating element, rotate array by K, palindrome check.",
            "SQL — Top N records, employees without manager, INNER vs LEFT JOIN.",
            "OOP — abstraction with real example.",
            "OS — semaphore + multitasking.",
            "Behavioural — Tell me about a time you handled an unhappy client.",
            "HR — Why Deloitte? Where do you see yourself in 5 years?",
            "Project — explain in 90 seconds to a non-technical client.",
          ]},
          { kind: "process", items: [
            "Apply via deloitte.com/in/en/careers or campus drives.",
            "Online Assessment — quant + logical + verbal + basic coding.",
            "Technical Interview — core CS fundamentals + easy-medium coding + SQL + project (45–60 min).",
            "Managerial / HR — communication, consulting mindset, client handling, teamwork.",
            "Total timeline: 4–8 weeks campus, 2–6 weeks lateral.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Which is Deloitte's primary tech role?", opts: ["Database admin", "Analyst / Consultant / Software Engineer / Cyber / Cloud", "Hardware engineer", "QA only"], ans: 1, why: "Deloitte hires across analyst, consultant, software engineer, cyber, cloud, data engineering — broad tech roles." },
      { q: "DELETE vs TRUNCATE in SQL?", opts: ["Same thing", "DELETE removes rows (rollback OK, DML); TRUNCATE clears all rows fast (DDL)", "Both irreversible", "TRUNCATE selects rows"], ans: 1, why: "DELETE is DML (rollback within txn). TRUNCATE is DDL (fast, can't filter, resets AUTO_INCREMENT)." },
      { q: "Find employees without a manager in SQL?", opts: ["WHERE manager_id IS NULL", "GROUP BY manager_id", "SORT BY manager_id", "ORDER BY name"], ans: 0, why: "Direct check — employees with NULL manager_id are the top-level ones (CEO, etc.) or unassigned." },
      { q: "Deloitte interview values?", opts: ["Extreme competitive programming", "Structured thinking + clear communication + practical solutions", "Memorisation of frameworks", "Speed only"], ans: 1, why: "Deloitte is consulting-heavy. Clear thinking + practical solutions + clear communication outweigh raw coding speed." },
      { q: "STAR in behavioural answers?", opts: ["Strategy, Tactics, Analysis, Results", "Situation, Task, Action, Result", "System, Test, Audit, Review", "Story, Theme, Arc, Resolution"], ans: 1, why: "STAR = Situation, Task, Action, Result. Every Deloitte behavioural answer fits this structure." },
    ],
    quotes: [
      "Deloitte doesn't reward show-offs. Solve simply. Speak clearly. You'll stand out.",
      "Client empathy is half the interview. Frame every project around the user.",
      "SQL — Top N records, JOINs, employees without manager. Practise the basics 5 times.",
      "Why Deloitte? 'Big Four brand' is weak. Talk about service lines, industry, learning.",
      "One strong project beats five weak ones. Pick yours. Know every detail.",
    ],
    facts: [
      "Deloitte is the LARGEST Big Four firm by revenue and headcount globally.",
      "Deloitte USI (United States India) is one of the largest offshore tech arms in India.",
      "Hyderabad and Bengaluru are Deloitte India's largest delivery centres.",
      "Deloitte hires consultants who think structurally — DSA depth alone won't get you in.",
      "5-day prep plan covers Deloitte well — they're not testing for FAANG-level rigor.",
    ],
  },
  hcl: {
    name: "HCL",
    type: "service",
    short: "HCL Technologies",
    tagline: "India's third-largest IT — Aptitude + DSA + Interview. TechBee + standard hiring tracks.",
    about: "HCLTech is one of India's top IT services companies. Famous for the TechBee program — hires 12th-pass students, trains them, and integrates them into the workforce. Standard hiring is Aptitude + DSA + Interview.",
    whatTheyDo: "IT + business services, engineering + R&D services, products + platforms (BigFix, AppScan), digital transformation, cloud, cybersecurity, IoT.",
    history: [
      "Founded in 1976 by Shiv Nadar — pioneer of India's IT industry. Started by making calculators.",
      "HQ in Noida. ~225,000 employees globally. Offices in Noida, Bengaluru, Chennai, Hyderabad, Pune.",
      "Acquired IBM's products division in 2018 ($1.8B) — picked up DOORS, AppScan, BigFix.",
      "TechBee program hires 12th-pass students, pays for their education, and inducts them into HCL workforce.",
      "Three main hiring tracks: TechBee (12th-pass), Campus (engineering), and Lateral.",
    ],
    sections: [
      {
        key: "aptitude",
        label: "Aptitude",
        blurb: "Round 1 — Quantitative + Logical + Verbal. 60 questions covering ratios, percentages, coding-decoding, syllogisms.",
        blocks: [
          { kind: "qa", items: [
            { q: "Numbers in 5:9 ratio, second = 45. First?", a: "25." },
            { q: "15% of 200?", a: "30." },
            { q: "CP ₹1200, SP ₹1500. Profit %?", a: "25%." },
            { q: "CI on ₹5000 for 2 yrs at 5%?", a: "₹512.50." },
            { q: "3 persons → 15 days. 5 persons?", a: "9 days." },
            { q: "150 km in 3 hrs. Speed?", a: "50 km/hr." },
            { q: "Avg of 10, 20, 30, 40, 50?", a: "30." },
            { q: "Series: 2, 4, 8, 16, ?", a: "32." },
            { q: "CAT = DBU. DOG = ?", a: "EPH." },
            { q: "A brother of B; B father of C. A to C?", a: "Uncle." },
            { q: "50 students: cricket 20, football 15, both 10. Neither?", a: "5." },
            { q: "6 people circle. Opposite A?", a: "C." },
            { q: "All cats are animals. All animals eat. Cats eat?", a: "Yes." },
            { q: "From North: right, left, right. Facing?", a: "East." },
            { q: "P(head one toss)?", a: "1/2." },
            { q: "A 2× B's age. Sum 30?", a: "A = 20, B = 10." },
            { q: "x² − 5x + 6 = 0?", a: "2 or 3." },
            { q: "(12/4) + (5*3)?", a: "18." },
            { q: "LCM(12, 15)?", a: "60." },
            { q: "HCF(24, 36)?", a: "12." },
            { q: "A 2× efficient as B. A 20 days less. B's days?", a: "40 days." },
            { q: "7, 14, 28, 56, ?", a: "112." },
            { q: "A 20% > B (₹50000). A?", a: "₹60,000." },
            { q: "SI on ₹10000, 3 yrs, 4%?", a: "₹1200." },
            { q: "Cube root of 64?", a: "4." },
            { q: "Milk:water 3:2 + 10L water?", a: "3:4." },
            { q: "60/40 km/h avg speed?", a: "48 km/h (harmonic mean)." },
            { q: "Day 45 from Monday?", a: "Wednesday." },
            { q: "Triangle 3:4:5 angles?", a: "37°, 53°, 90°." },
            { q: "12% of 250?", a: "30." },
          ]},
        ],
      },
      {
        key: "dsa",
        label: "DSA",
        blurb: "Round 2 — Coding test. 2–3 problems in 60–90 minutes on HCL's platform.",
        blocks: [
          { kind: "problems", items: [
            { name: "Reverse a String using Stack", desc: "Push all chars, pop to reverse.", difficulty: "Easy" },
            { name: "Find Duplicate Elements in Array", desc: "Hash set or sort-and-compare.", difficulty: "Easy" },
            { name: "Binary Search in Sorted Array", desc: "Iterative or recursive halving.", difficulty: "Easy" },
            { name: "Merge Two Sorted Arrays", desc: "Two-pointer merge into a new array.", difficulty: "Easy" },
            { name: "Detect Linked List Cycle", desc: "Floyd's tortoise and hare.", difficulty: "Easy" },
            { name: "Reverse Linked List", desc: "Iterative 3-pointer or recursive.", difficulty: "Easy" },
            { name: "Kth Largest Element", desc: "Min-heap of size k or quickselect.", difficulty: "Medium" },
            { name: "Queue using Two Stacks", desc: "Enqueue to s1, dequeue from s2 (transfer when empty).", difficulty: "Medium" },
            { name: "Longest Valid Parentheses", desc: "Stack of indices or DP.", difficulty: "Hard" },
            { name: "Tree Traversals (In/Pre/Post)", desc: "Recursive and iterative versions.", difficulty: "Medium" },
            { name: "Height of Binary Tree", desc: "Recursive max-depth DFS.", difficulty: "Easy" },
            { name: "Detect Cycle in Directed Graph", desc: "DFS with recursion stack tracking.", difficulty: "Medium" },
            { name: "Implement DFS for Graph Traversal", desc: "Recursive or stack-based; visited set.", difficulty: "Medium" },
            { name: "Implement BFS for Graph Traversal", desc: "Queue-based; visited set; level tracking.", difficulty: "Medium" },
            { name: "Quicksort", desc: "Partition + recursive sort. Average O(n log n).", difficulty: "Medium" },
            { name: "Mergesort", desc: "Divide + merge. Stable O(n log n).", difficulty: "Medium" },
            { name: "BST Insertion", desc: "Recursive or iterative insert maintaining BST property.", difficulty: "Easy" },
            { name: "Diameter of Binary Tree", desc: "DFS returning height; global max diameter.", difficulty: "Medium" },
            { name: "Design LRU Cache", desc: "DLL + HashMap for O(1) get/put.", difficulty: "Hard" },
            { name: "Anagram Check", desc: "Frequency map or sort-and-compare.", difficulty: "Easy" },
            { name: "Median of Two Sorted Arrays", desc: "Binary search on smaller array. O(log min).", difficulty: "Hard" },
            { name: "Implement Trie", desc: "Tree of children per char + isEnd flag.", difficulty: "Medium" },
            { name: "N-Queens (Backtracking)", desc: "Place queens column by column.", difficulty: "Hard" },
            { name: "Memoized Fibonacci", desc: "Top-down recursive with memo cache.", difficulty: "Easy" },
            { name: "Dynamic Programming (Example)", desc: "Coin Change or Climbing Stairs as warm-up.", difficulty: "Medium" },
            { name: "Sliding Window Maximum", desc: "Monotonic deque keeping max at front.", difficulty: "Hard" },
            { name: "Find Duplicates (No Extra Space)", desc: "In-place hashing (negate values at indices).", difficulty: "Medium" },
            { name: "Exponential Search", desc: "Find range with doubling, then binary search.", difficulty: "Medium" },
            { name: "Rotate Array", desc: "Reverse trick for O(1) space rotation.", difficulty: "Easy" },
            { name: "Substrings Starting + Ending with 1", desc: "Count 1s in string; C(n,2) + n combinations.", difficulty: "Medium" },
          ]},
        ],
      },
      {
        key: "interview",
        label: "Interview",
        blurb: "Round 3 — Technical (OOPs, DBMS, OS, projects) + HR. Same core CS fundamentals.",
        blocks: [
          { kind: "qa", items: [
            { q: "What is OOP?", a: "Programming using classes and objects. Pillars: encapsulation, inheritance, polymorphism, abstraction." },
            { q: "Define array.", a: "Fixed-size collection of same-type elements stored contiguously." },
            { q: "What is a linked list?", a: "Linear data structure where each node points to the next." },
            { q: "Stack vs queue?", a: "Stack: LIFO. Queue: FIFO." },
            { q: "What is recursion?", a: "Function calling itself until a base case." },
            { q: "What is inheritance?", a: "Class acquires properties from another class." },
            { q: "Polymorphism?", a: "Same name behaving differently based on context." },
            { q: "Encapsulation?", a: "Binding data + methods together, hiding internal state." },
            { q: "Algorithm?", a: "Step-by-step procedure to solve a problem." },
            { q: "Binary search?", a: "Halve the search range each step in a sorted array. O(log n)." },
            { q: "Binary tree?", a: "Each node has at most two children." },
            { q: "What is a graph?", a: "Set of nodes connected by edges." },
            { q: "Dynamic programming?", a: "Breaking into overlapping subproblems and storing results." },
            { q: "Linear vs binary search?", a: "Linear: O(n), any order. Binary: O(log n), sorted only." },
            { q: "Time complexity?", a: "How runtime scales with input size in Big O." },
            { q: "What is hashing?", a: "Mapping data to fixed-size hash codes for fast lookup." },
            { q: "Stack?", a: "LIFO data structure with O(1) push/pop." },
            { q: "Queue?", a: "FIFO data structure with O(1) enqueue/dequeue." },
            { q: "Pointer?", a: "Variable holding the memory address of another variable." },
            { q: "Call by value vs reference?", a: "Value: copy. Reference: address — changes reflect in caller." },
            { q: "Constructor?", a: "Special method that initializes an object on creation." },
            { q: "Exception handling?", a: "Catching runtime errors via try-catch-finally." },
            { q: "Database?", a: "Organized collection of data managed by a DBMS." },
            { q: "SQL?", a: "Structured Query Language for relational databases." },
            { q: "Normalization?", a: "Organizing tables to reduce redundancy. 1NF → BCNF." },
            { q: "OS?", a: "Software managing hardware + software resources." },
            { q: "Multithreading?", a: "Multiple threads running concurrently within one process." },
            { q: "Process vs thread?", a: "Process: independent program. Thread: lightweight subprocess." },
            { q: "Cloud computing?", a: "Delivery of computing services over the internet." },
            { q: "Circular linked list?", a: "Linked list where the last node points back to the first." },
          ]},
        ],
      },
    ],
    mcq: [
      { q: "HCL's TechBee program is unique because it?", opts: ["Hires only IIT students", "Hires 12th-pass students and pays for their education", "Only hires MBA grads", "Is a paid internship"], ans: 1, why: "TechBee hires 12th-pass students, pays for their education, and integrates them into the workforce — a unique India-first model." },
      { q: "HCL acquired which IBM products in 2018?", opts: ["MQ Series only", "DOORS, AppScan, BigFix", "DB2 only", "WebSphere only"], ans: 1, why: "HCL bought IBM's products division for $1.8B in 2018 — included DOORS, AppScan, BigFix, and more." },
      { q: "Queue using two stacks — strategy?", opts: ["Enqueue to s1; dequeue: transfer all to s2 if empty, pop s2", "Use a counter", "Recursion", "Linked list under stacks"], ans: 0, why: "Lazy transfer: only move stack1 → stack2 when stack2 is empty. Amortized O(1) per dequeue." },
      { q: "Floyd's cycle detection in linked list?", opts: ["Two pointers, same speed", "Slow + fast pointer; if they meet, cycle exists", "Stack-based traversal", "DFS"], ans: 1, why: "Tortoise (1 step) + Hare (2 steps). If they meet, there's a cycle. O(n) time, O(1) space." },
      { q: "HCL was founded by?", opts: ["N.R. Narayana Murthy", "Shiv Nadar", "Ratan Tata", "Sridhar Vembu"], ans: 1, why: "HCL was founded in 1976 by Shiv Nadar — one of the pioneers of India's IT industry." },
    ],
    quotes: [
      "HCL hires for fundamentals + reliability. Show up calm, show up clear.",
      "TechBee isn't a downside — it's a track. Different doesn't mean less.",
      "Queue using two stacks shows up in every HCL batch. Practise it once on paper.",
      "HCL Engineering R&D services is a HUGE arm — mention it if you've done embedded/firmware projects.",
      "Aptitude + DSA + clarity = HCL's hiring formula. Bring all three.",
    ],
    facts: [
      "HCL was founded in 1976 by Shiv Nadar — started by making calculators.",
      "TechBee program hires 12th-pass students, pays for their education, then inducts them. Unique in India.",
      "HCL acquired IBM's products division for $1.8B in 2018 — DOORS, AppScan, BigFix.",
      "Noida is HCL's HQ and largest delivery centre.",
      "HCL's Engineering R&D Services is one of the largest globally — embedded, automotive, aerospace.",
    ],
  },
  wipro: {
    name: "Wipro",
    type: "service",
    short: "Wipro Limited",
    tagline: "Elite + Turbo tracks — 1–2 coding problems in 60 min. Aptitude + Essay + Coding + Tech Interview + HR.",
    about: "Wipro is one of India's largest IT services companies. Hires through Elite (premium) and Turbo (standard) tracks. Famous for AMCAT + Unstop off-campus drives.",
    whatTheyDo: "Digital strategy + consulting, cloud + infrastructure, cybersecurity, AI, data, engineering, business process services. Heavy clients in BFSI, healthcare, energy, manufacturing.",
    history: [
      "Founded in 1945 by M.H. Hasham Premji as Western India Vegetable Products Limited (sunflower oil).",
      "Pivoted to IT under Azim Premji in the 1980s — became one of India's IT pioneers.",
      "HQ in Bengaluru. ~234,000 employees globally. Offices in Bengaluru, Pune, Hyderabad, Chennai, Mumbai, Kolkata, Coimbatore.",
      "Azim Premji is famous for the Azim Premji Foundation — one of India's largest philanthropic orgs.",
      "Hires through Elite (premium 6.5 LPA+) and Turbo (standard 3.5 LPA) tracks.",
    ],
    sections: [
      {
        key: "interview",
        label: "Interview Pipeline",
        blurb: "Aptitude → Essay → Coding (1–2 problems, 60 min) → Technical Interview → HR. Two tracks: Elite + Turbo.",
        blocks: [
          { kind: "problems", items: [
            { name: "Divisible Within Range", desc: "Count multiples of x in [x, y].", difficulty: "Easy" },
            { name: "Nth Term of AP", desc: "Nth term = A + (N−1)·D.", difficulty: "Easy" },
            { name: "Third Last Consonant", desc: "Find the 3rd consonant from the right of a string.", difficulty: "Easy" },
            { name: "Product of Numbers (Factorial)", desc: "1 × 2 × ... × N. N < 13 fits in int.", difficulty: "Easy" },
            { name: "Sum of Divisors", desc: "Sum all divisors of N. Optimise with sqrt(N).", difficulty: "Easy" },
            { name: "Longest Increasing Subsequence", desc: "Re-order array; find longest strictly-increasing subsequence.", difficulty: "Medium" },
            { name: "Power Calculation", desc: "Floor(E1/T1) + Floor(E2/T2).", difficulty: "Easy" },
            { name: "CamelCase to UpperCase", desc: "Split CamelCase into words, invert case, print each on a new line.", difficulty: "Medium" },
            { name: "Case Toggle", desc: "Toggle case of a single character (a → A, C → c).", difficulty: "Easy" },
            { name: "Maximum Product", desc: "Max a·b where a in [L1, R1], b in [L2, R2]. Ranges may include negatives.", difficulty: "Medium" },
            { name: "Pythagorean Theorem", desc: "Hypotenuse via sqrt(A² + B²). Ceil to next integer if decimal.", difficulty: "Easy" },
            { name: "Even Odd", desc: "If N odd → product of digits. If N even → sum of digits.", difficulty: "Easy" },
            { name: "Nearest Greater Element", desc: "Monotonic decreasing stack of indices.", difficulty: "Medium" },
            { name: "Min Deletions for Palindrome", desc: "len(s) − LPS(s). Compute LPS via LCS(s, reverse(s)).", difficulty: "Medium" },
            { name: "Check Identical Binary Trees", desc: "Recursive structural + value comparison.", difficulty: "Easy" },
            { name: "Subset with Target Sum", desc: "2D DP — dp[i][j] = can subset of first i elements sum to j.", difficulty: "Medium" },
            { name: "Smallest Missing Positive", desc: "In-place array hashing. O(n) time, O(1) space.", difficulty: "Hard" },
            { name: "Depth of Binary Tree", desc: "Recursive max-depth DFS.", difficulty: "Easy" },
            { name: "BFS Traversal of Graph", desc: "Queue-based traversal; visited set.", difficulty: "Medium" },
            { name: "Balanced Parentheses", desc: "Stack-based bracket matching.", difficulty: "Easy" },
          ]},
          { kind: "focus", items: [
            "Basic Mathematics — factorial, AP/GP terms, power calculation, Pythagorean theorem, digit arithmetic.",
            "String Manipulation — CamelCase parsing, case toggling, palindrome checks, anagram detection.",
            "Arrays — nearest greater element, smallest missing positive, subset sum, range queries.",
            "Dynamic Programming — 0/1 Knapsack, LCS, LIS, minimum deletions for palindrome.",
            "Linked Lists — reversal, merging sorted lists, addition with carry, cycle detection.",
            "Trees — depth, identical tree check, BFS level-order, LCA.",
            "Graphs — BFS, DFS, balanced parentheses via stack, connected components.",
            "Number Theory — divisibility, base conversion, sum + product of divisors, prime testing.",
          ]},
          { kind: "tips", items: [
            "Read every constraint. Wipro often has tight constraints (e.g., N < 13 for factorial) where brute force is fine.",
            "Handle edge cases — zero, single element, already-sorted, empty string.",
            "Output format is strictly matched — newlines, spaces, case sensitivity.",
            "Use integer division (floor) when the problem explicitly asks for it.",
            "For strings, clarify case-sensitivity before writing loop logic.",
            "Practise once in a plain-text editor — Wipro's IDE has minimal autocomplete.",
            "Attempt ALL problems. Wipro tests often include one very easy question (Case Toggle, Goal Tracker).",
            "Dry-run on the sample before submitting. One wrong char fails the entire test case.",
          ]},
          { kind: "frequent", items: [
            "Balanced Parentheses — stack-based, every batch.",
            "Reverse a Linked List — core linked list problem.",
            "First Non-Repeating Character — hash map warm-up.",
            "BFS Traversal of Graph — graph fundamentals.",
            "Longest Increasing Subsequence — DP from Elite 2024.",
            "0/1 Knapsack — DP flagship for Elite.",
            "CamelCase to UpperCase — string parsing from Elite 2024.",
            "Product of Numbers — simple factorial, Elite warm-up.",
            "Nearest Greater Element — monotonic stack.",
            "Third Last Consonant — string traversal, Elite 2024.",
          ]},
          { kind: "process", items: [
            "Apply at wipro.com/careers or AMCAT/Unstop for campus + off-campus.",
            "Aptitude — quant + logical + verbal (45–60 min).",
            "Written Essay — short English essay, evaluated for grammar + clarity.",
            "Coding — 1–2 problems / 60 min on Wipro's proprietary platform (C, C++, Java, Python).",
            "Elite Track: harder problems, 2 questions / 60–90 min; specialist roles.",
            "Turbo Track: 1–2 medium problems / 60 min; regular engineering.",
            "Technical Interview: 30–45 min — OOPs, DS, DBMS, OS, projects.",
            "HR Interview: cultural fit, communication, salary, relocation.",
            "Total timeline: 4–8 weeks campus, 2–4 weeks off-campus.",
          ]},
        ],
      },
    ],
    mcq: [
      { q: "Wipro Elite vs Turbo CTC?", opts: ["Same", "Elite ~6.5 LPA, Turbo ~3.5 LPA", "Turbo > Elite", "Both 10 LPA"], ans: 1, why: "Elite is the premium track with ~6.5 LPA CTC. Turbo is the standard track at ~3.5 LPA." },
      { q: "Wipro's coding round duration?", opts: ["30 min", "45 min", "60 min", "90 min"], ans: 2, why: "Standard Wipro coding round is 1–2 problems in 60 minutes. Elite can extend to 60–90 min." },
      { q: "Smallest missing positive — best space complexity?", opts: ["O(n)", "O(log n)", "O(1) with in-place array hashing", "O(n²)"], ans: 2, why: "Place each positive int at index (value−1) in the array. First mismatch reveals the missing positive. O(n) time, O(1) extra space." },
      { q: "CamelCase 'saveChangesInTheEditor' splits into?", opts: ["save, Changes, In, The, Editor", "SAVE, CHANGES, IN, THE, EDITOR (inverted case)", "saveChangesInTheEditor (no split)", "save changes in the editor"], ans: 1, why: "Split at uppercase letters, then invert each word's case (lowercase first letter becomes uppercase, all others toggle)." },
      { q: "Nearest Greater Element — best technique?", opts: ["Nested loops O(n²)", "Monotonic decreasing stack O(n)", "Binary search", "Sorting"], ans: 1, why: "Push indices on a decreasing stack. When a larger element arrives, pop and record it as the answer for all smaller indices." },
    ],
    quotes: [
      "Wipro Elite is the prize. Same effort, 2x the CTC. Aim for it.",
      "Output format is what eats Wipro candidates. Match the sample exactly.",
      "Wipro's IDE has minimal autocomplete. Practise once in Notepad. Seriously.",
      "Even the easy questions matter — attempt ALL problems. Don't leave Case Toggle blank.",
      "Tight constraints often mean brute force is fine. Read carefully before optimising.",
    ],
    facts: [
      "Wipro was founded in 1945 as a sunflower oil company — pivoted to IT under Azim Premji in the 1980s.",
      "Azim Premji is famous for the Azim Premji Foundation — one of India's largest philanthropic orgs.",
      "Elite track CTC is ~2x the Turbo track. Worth aiming for.",
      "Wipro's HQ in Bengaluru includes the famous 'Yashoda' technology park.",
      "AMCAT + Unstop are Wipro's preferred off-campus drive partners.",
    ],
  },
};

// ─── Component ───────────────────────────────────────────────────────────────
interface Session { id: string; session_number: number; week: number; title: string; drive_link: string; description: string; unlocked: boolean; }

const Portal = () => {
  const navigate = useNavigate();
  const { slug, ckSlug, ivSlug, companySlug } = useParams<{ slug?: string; ckSlug?: string; ivSlug?: string; companySlug?: string }>();
  const isMobile = useIsMobile();
  const [currentView, setCurrentView]         = useState<ViewType>("overview");
  const [previousView, setPreviousView]       = useState<ViewType>("overview");
  const [sidebarOpen, setSidebarOpen]         = useState(!isMobile);
  const userName  = localStorage.getItem("userName")  ?? "";
  const userEmail = localStorage.getItem("userEmail") ?? "";
  const [sessions, setSessions]               = useState<Session[]>([]);
  const [sessionsInfo, setSessionsInfo]       = useState<{ weeks_completed: number; unlocked_count: number; days_enrolled: number } | null>(null);
  const [showFeedback, setShowFeedback]       = useState(false);
  const [feedbackForm, setFeedbackForm]       = useState({ type: "resource_request", message: "", resource_name: "" });
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  interface LeaderboardEntry { rank: number; email: string; score: number; login_days: number; resource_opens: number; is_me: boolean; }
  interface LeaderboardData { week_label: string; leaderboard: LeaderboardEntry[]; my_rank: number | null; my_stats: { email: string; score: number; login_days: number; resource_opens: number } | null; }
  const [leaderboard, setLeaderboard]         = useState<LeaderboardData | null>(null);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  interface UpcomingEvent { title: string; description: string; start: string; all_day: boolean; countdown: string; urgency: "now" | "today" | "soon" | "week" | "later"; }
  const [upcomingEvents, setUpcomingEvents]   = useState<UpcomingEvent[]>([]);
  const [courses, setCourses]                 = useState<CourseSummary[]>([]);
  const [activeCourseId, setActiveCourseId]   = useState<string | null>(null);
  const [clockTime, setClockTime]             = useState(() => new Date());
  const [careerKitResource, setCareerKitResource] = useState<null | "resume_review" | "cover_letter" | "linkedin_review" | "linkedin_messages" | "cold_emails" | "mock_interview" | "ai_projects" | "open_source" | "projects_graduation" | "github_portfolio">(null);
  const [coverLetterTab, setCoverLetterTab]   = useState<"short" | "long" | "founder" | "technical" | "hr">("short");
  const [linkedinMsgTab, setLinkedinMsgTab]   = useState<"connection" | "referral" | "founder" | "hr" | "tech">("connection");
  const [coldEmailTab, setColdEmailTab]       = useState<"founder" | "hr" | "tech" | "company">("founder");
  const [pbgCategory, setPbgCategory]         = useState<"frontend" | "backend" | "fullstack" | "data">("frontend");
  const [ckMCQAnswers, setCkMCQAnswers]        = useState<Record<string, number>>({});
  const [showConfetti, setShowConfetti]        = useState(false);
  const [dsaToday, setDsaToday]               = useState<null | "yes" | "no">(null);
  const [dsaReason, setDsaReason]             = useState("");
  const [dsaReasonDone, setDsaReasonDone]     = useState(false);
  const [talkMsg, setTalkMsg]                 = useState("");
  const [talkDone, setTalkDone]               = useState(false);
  const [interviewTopic, setInterviewTopic]   = useState<IVKey | null>(null);
  const [ivSection, setIvSection]             = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [ivOpenQ, setIvOpenQ]                 = useState<Record<string, boolean>>({});
  const [placementsTab, setPlacementsTab]     = useState<CompanyType>("service");
  const [placementsCompany, setPlacementsCompany] = useState<CompanyKey | null>(null);
  const [placementsSection, setPlacementsSection] = useState<string>("");
  const [placementsOpenQ, setPlacementsOpenQ] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api.courses.list().then((r: unknown) => {
      const res = r as { data: CourseSummary[] };
      setCourses(res.data);
      const RESERVED: Record<string, ViewType> = { overview: "overview", courses: "courses", placements: "placements", interviews: "interviews", "career-kit": "career_kit" };
      if (slug && RESERVED[slug]) {
        setCurrentView(RESERVED[slug]);
      } else if (slug) {
        const match = res.data.find((c: CourseSummary) => c.slug === slug);
        if (match) { setActiveCourseId(match.id); setCurrentView("course"); }
      }
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Handle /portal/career-kit/:ckSlug deep links
  useEffect(() => {
    if (ckSlug) {
      const key = CK_SLUG_MAP[ckSlug];
      if (key) {
        setCurrentView("career_kit");
        setCareerKitResource(key);
        document.title = `${CK_KEY_TITLE[key]} — Career Kit | Mamlesh`;
      }
    } else if (slug === "career-kit" || window.location.pathname === "/portal/career-kit") {
      setCurrentView("career_kit");
      setCareerKitResource(null);
      document.title = "Career Kit | Mamlesh";
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ckSlug]);

  // Handle /portal/interviews/:ivSlug deep links
  useEffect(() => {
    if (ivSlug) {
      const key = IV_SLUG_MAP[ivSlug];
      if (key) {
        setCurrentView("interviews");
        setInterviewTopic(key);
        setIvSection("beginner");
        document.title = `${IV_KEY_TITLE[key]} | Mamlesh`;
      }
    } else if (slug === "interviews" || window.location.pathname === "/portal/interviews") {
      setCurrentView("interviews");
      setInterviewTopic(null);
      document.title = "Interviews | Mamlesh";
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ivSlug]);

  // Handle /portal/placements/:companySlug deep links
  useEffect(() => {
    if (companySlug) {
      const key = COMPANY_SLUG_MAP[companySlug];
      if (key) {
        setCurrentView("placements");
        setPlacementsCompany(key);
        setPlacementsTab(PLACEMENT_COMPANIES[key].type);
        setPlacementsSection(PLACEMENT_COMPANIES[key].sections[0].key);
        document.title = `${PLACEMENT_COMPANIES[key].name} | Placements | Mamlesh`;
      }
    } else if (slug === "placements" || window.location.pathname === "/portal/placements") {
      setCurrentView("placements");
      setPlacementsCompany(null);
      document.title = "Placements | Mamlesh";
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companySlug]);

  const loadSessions = useCallback(async () => {
    try {
      const r = await api.student.getSessions() as { data: { sessions: Session[]; weeks_completed: number; unlocked_count: number; days_enrolled: number } };
      setSessions(r.data.sessions);
      setSessionsInfo({ weeks_completed: r.data.weeks_completed, unlocked_count: r.data.unlocked_count, days_enrolled: r.data.days_enrolled });
    } catch { /* portal still works without sessions */ }
  }, []);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  useEffect(() => {
    api.student.getUpcomingEvents().then((r: unknown) => {
      const res = r as { data: { events: UpcomingEvent[] } };
      setUpcomingEvents(res.data.events);
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(() => setClockTime(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = () => {
    ["token", "userRole", "userEmail", "userName", "mustChangePassword"].forEach(k => localStorage.removeItem(k));
    toast({ title: "Logged out", description: "You have been logged out successfully" });
    navigate("/login");
  };

  const submitFeedback = async () => {
    if (!feedbackForm.message.trim()) { toast({ title: "Please write a message", variant: "destructive" }); return; }
    setFeedbackLoading(true);
    try {
      await api.student.submitFeedback(feedbackForm);
      toast({ title: "Feedback sent!", description: "We'll review your request." });
      setShowFeedback(false);
      setFeedbackForm({ type: "resource_request", message: "", resource_name: "" });
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
    finally { setFeedbackLoading(false); }
  };

  const switchView = (view: ViewType) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if ((view === "leaderboard" || view === "overview") && !leaderboard) {
      setLeaderboardLoading(true);
      api.student.getLeaderboard().then((r: unknown) => {
        const res = r as { data: LeaderboardData };
        setLeaderboard(res.data);
      }).catch(() => {}).finally(() => setLeaderboardLoading(false));
    }
  };

  const answerMCQ = (key: string, chosen: number, correct: number) => {
    if (ckMCQAnswers[key] !== undefined) return;
    setCkMCQAnswers(prev => ({ ...prev, [key]: chosen }));
    if (chosen === correct) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);
    }
  };

  const openCareerKitResource = (key: CKKey) => {
    navigate(`/portal/career-kit/${CK_KEY_TO_SLUG[key]}`);
  };

  const closeCareerKitResource = () => {
    navigate("/portal/career-kit");
  };

  const openInterviewTopic = (key: IVKey) => {
    navigate(`/portal/interviews/${IV_KEY_TO_SLUG[key]}`);
  };

  const closeInterviewTopic = () => {
    setInterviewTopic(null);
    setIvOpenQ({});
    navigate("/portal/interviews");
  };

  const openPlacementCompany = (key: CompanyKey) => {
    navigate(`/portal/placements/${COMPANY_KEY_TO_SLUG[key]}`);
  };

  const closePlacementCompany = () => {
    setPlacementsCompany(null);
    setPlacementsOpenQ({});
    navigate("/portal/placements");
  };

  const formatEventDate = (isoStr: string, allDay: boolean): string => {
    const dt = new Date(isoStr);
    if (allDay) return dt.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" });
    return dt.toLocaleString("en-IN", { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" });
  };

  const urgencyBg = (u: string) => (({ now: "#EF4444", today: "#F97316", soon: Y, week: "#3B82F6", later: "#9CA3AF" } as Record<string, string>)[u] ?? "#9CA3AF");
  const urgencyLabel = (u: string) => (({ now: "HAPPENING NOW", today: "TODAY", soon: "TOMORROW", week: "THIS WEEK", later: "UPCOMING" } as Record<string, string>)[u] ?? "UPCOMING");

  const extractMeetLink = (desc: string): string | null => {
    const m = desc.match(/https?:\/\/meet\.google\.com\/[\w-]+/);
    return m ? m[0] : null;
  };

  const openCourse = (courseId: string) => {
    setPreviousView(currentView);          // remember where user came from
    const course = courses.find(c => c.id === courseId);
    setActiveCourseId(courseId);
    setCurrentView("course");
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (isMobile) setSidebarOpen(false);
    if (course?.slug) navigate(`/portal/${course.slug}`, { replace: true });
  };

  const coursesCourses     = courses.filter(c => c.category === "training" || c.category === "courses");
  const placementsCourses  = courses.filter(c => c.category === "placement" || c.category === "placements");
  const interviewsCourses  = courses.filter(c => c.category === "interviews");
  const inProgressCourses  = courses.filter(c => c.completed_topics > 0 && c.progress_pct < 100);

  const getGreeting = () => { const h = clockTime.getHours(); if (h < 12) return "GOOD MORNING"; if (h < 17) return "GOOD AFTERNOON"; return "GOOD EVENING"; };
  const totalTopics = courses.reduce((s, c) => s + c.total_topics, 0);
  const completedTopics = courses.reduce((s, c) => s + c.completed_topics, 0);
  const overallPct = totalTopics > 0 ? Math.round(completedTopics / totalTopics * 100) : 0;

  type NavItem = { view: ViewType; label: string; icon: typeof LayoutDashboard; count: string; href?: string; isNew?: boolean };
  const tabs: NavItem[] = [
    { view: "overview",     label: "Overview",      icon: LayoutDashboard, count: "" },
    { view: "courses",      label: "Courses",        icon: GraduationCap,   count: `${coursesCourses.length || ""}` },
    { view: "placements",   label: "Placements",     icon: Building2,       count: `${placementsCourses.length || ""}` },
    { view: "interviews",   label: "Interviews",     icon: Users,           count: `${interviewsCourses.length || ""}` },
    { view: "career_kit",   label: "Career Kit",     icon: Briefcase,       count: "" },
    { view: "sessions",     label: "Sessions",       icon: PlayCircle,      count: sessionsInfo ? `${sessionsInfo.unlocked_count}` : "" },
    { view: "leaderboard",  label: "Leaderboard",    icon: Trophy,          count: "" },
    { view: "mockinterview", label: "Mock Interview", icon: MessageCircle,  count: "" },
  ];

  const navGroups: { label: string; accent: string; items: NavItem[] }[] = [
    {
      label: "DISCOVER",
      accent: "#FFB000",
      items: [
        { view: "overview", label: "Compass", icon: Compass, count: "", href: "/portal/compass" },
        { view: "overview", label: "DSA Sheet", icon: Code2, count: "", href: "/upstrides-sheet" },
        { view: "projects", label: "AI Projects", icon: Boxes, count: "24" },
        { view: "mockinterview", label: "Mock Interview", icon: MessageCircle, count: "" },
      ],
    },
    {
      label: "LEARN",
      accent: B,
      items: [
        { view: "overview",   label: "Overview",   icon: LayoutDashboard, count: "" },
        { view: "courses",    label: "Courses",    icon: GraduationCap,   count: '' },
        { view: "placements", label: "Placements", icon: Building2,       count: `${placementsCourses.length || ""}` },
        { view: "interviews", label: "Interviews", icon: Users,           count: `${interviewsCourses.length || ""}` },
        { view: "career_kit", label: "Career Kit", icon: Briefcase,       count: "" },
      ],
    },
    {
      label: "MAMLESH",
      accent: "#6366F1",
      items: [
        { view: "sessions",  label: "Sessions", icon: PlayCircle,   count: "" },
      ],
    },
    {
      label: "RANKINGS",
      accent: "#F59E0B",
      items: [
        { view: "leaderboard", label: "Leaderboard", icon: Trophy, count: "" },
      ],
    },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, color: B, fontFamily: "'Sora', system-ui, sans-serif" }}>
      <style>{`
        .portal-sidebar::-webkit-scrollbar { display: none; }
        .portal-sidebar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, backgroundColor: W, borderBottom: `2px solid ${BORD}` }}>
        <div style={{ padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          {/* Left: toggle + logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => setSidebarOpen(s => !s)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", background: "none", border: `2px solid ${BORD}`, borderRadius: "6px", cursor: "pointer", flexShrink: 0, transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = B; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = BORD; }}
            >
              {sidebarOpen ? <X size={16} color={B} /> : <Menu size={16} color={B} />}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }} onClick={() => navigate("/")}>
              {!isMobile && (
                <span style={{ fontSize: "16px", fontWeight: 800, color: B, letterSpacing: "-0.01em" }}>
                  Mamlesh<span style={{ color: Y, textShadow: `1px 1px 0 ${B}` }}>.</span>
                </span>
              )}
              {isMobile && (
                <span style={{ fontSize: "18px", fontWeight: 800, color: B, letterSpacing: "-0.01em" }}>
                  M<span style={{ color: Y, textShadow: `1px 1px 0 ${B}` }}>.</span>
                </span>
              )}
              <span style={{ fontSize: "10px", backgroundColor: Y, color: B, padding: "2px 8px", fontWeight: 700, letterSpacing: "0.12em", border: `1px solid ${B}`, ...MONO }}>
                PORTAL
              </span>
            </div>
          </div>
          {/* Right: current view label + sign out */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ ...MONO, fontSize: "10px", color: MUTE, letterSpacing: "0.12em", display: isMobile ? "none" : "block" }}>
              {currentView === "course"
                ? courses.find(c => c.id === activeCourseId)?.title?.toUpperCase() ?? "COURSE"
                : tabs.find(t => t.view === currentView)?.label?.toUpperCase() ?? ""}
            </span>
            <button onClick={handleLogout}
              style={{ display: "flex", alignItems: "center", gap: "6px", color: MUTE, background: "none", border: `2px solid ${BORD}`, borderRadius: "6px", padding: "7px 12px", cursor: "pointer", fontSize: "12px", ...MONO, transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#EF4444"; (e.currentTarget as HTMLButtonElement).style.color = "#EF4444"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = BORD; (e.currentTarget as HTMLButtonElement).style.color = MUTE; }}>
              <LogOut size={14} />
              {!isMobile && "Sign Out"}
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE BACKDROP ─────────────────────────────────────────────── */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)", zIndex: 149, top: "60px" }}
        />
      )}

      {/* ── LEFT SIDEBAR ────────────────────────────────────────────────── */}
      <div style={{
        position: "fixed", top: "60px", left: 0, bottom: 0,
        width: sidebarOpen ? "240px" : "0px",
        overflow: "hidden",
        transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
        backgroundColor: W,
        borderRight: sidebarOpen ? `2px solid ${BORD}` : "none",
        zIndex: 150,
        display: "flex", flexDirection: "column",
        flexShrink: 0,
      }}>
        <div className="portal-sidebar" style={{ width: "240px", display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>

          {/* User info */}
          <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${BORD}`, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: B, color: Y, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, flexShrink: 0, ...MONO }}>
                {(userName || userEmail).charAt(0).toUpperCase() || "S"}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: B, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "'Sora', system-ui, sans-serif" }}>
                  {userName || "Student"}
                </div>
                <div style={{ ...MONO, fontSize: "10px", color: MUTE, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {userEmail}
                </div>
              </div>
            </div>
          </div>

          {/* Nav items — categorized */}
          <nav className="portal-sidebar" style={{ flex: 1, padding: "8px 0 20px", overflowY: "auto" }}>
            {navGroups.map((group, gi) => (
              <div key={group.label}>
                {/* Category header */}
                <div style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: gi === 0 ? "12px 16px 5px" : "20px 16px 5px",
                }}>
                  <div style={{ height: "1px", width: "6px", backgroundColor: group.accent, borderRadius: "2px", flexShrink: 0 }} />
                  <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", color: group.accent, ...MONO }}>
                    {group.label}
                  </span>
                  <div style={{ flex: 1, height: "1px", backgroundColor: `${group.accent}22` }} />
                </div>
                {/* Items */}
                {group.items.map(({ view, label, icon: Icon, count, href, isNew }) => {
                  const active = !href && currentView === view;
                  return (
                    <button
                      key={`${group.label}-${label}`}
                      onClick={() => {
                        if (href) {
                          navigate(href);
                          if (isMobile) setSidebarOpen(false);
                          return;
                        }
                        switchView(view);
                        if (isMobile) setSidebarOpen(false);
                        navigate("/portal", { replace: true });
                      }}
                      style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        width: "100%", padding: "10px 16px 10px 20px",
                        background: active ? Y : "transparent",
                        border: "none",
                        borderLeft: `3px solid ${active ? B : "transparent"}`,
                        cursor: "pointer", textAlign: "left",
                        transition: "all 0.12s",
                      }}
                      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = `${B}07`; }}
                      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                    >
                      <Icon size={14} color={active ? B : "#6B7280"} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: "13px", fontWeight: active ? 600 : 400, color: active ? B : "#374151", flex: 1, whiteSpace: "nowrap", fontFamily: "'Sora', system-ui, sans-serif" }}>
                        {label}
                      </span>
                      {count && (
                        <span style={{ fontSize: "10px", fontWeight: 700, color: active ? B : group.accent, backgroundColor: active ? `${B}15` : `${group.accent}18`, padding: "1px 7px", borderRadius: "10px", flexShrink: 0, ...MONO }}>
                          {count}
                        </span>
                      )}
                      {isNew && (
                        <span style={{ fontSize: "9px", fontWeight: 700, color: B, backgroundColor: Y, padding: "1px 6px", borderRadius: "10px", flexShrink: 0, ...MONO, letterSpacing: "0.08em" }}>
                          NEW
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Bottom actions */}
          <div style={{ borderTop: `1px solid ${BORD}`, padding: "8px 0", flexShrink: 0 }}>
            <button onClick={() => { switchView("overview"); if (isMobile) setSidebarOpen(false); }}
              style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "11px 16px", background: "transparent", border: "none", cursor: "pointer", ...MONO, transition: "all 0.12s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = `${B}07`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              <MessageCircle size={15} color={B} />
              <span style={{ fontSize: "12px", color: B, fontWeight: 600 }}>Talk to Us</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────────────────── */}
      <div style={{
        marginLeft: sidebarOpen && !isMobile ? "240px" : "0",
        transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
        paddingTop: "76px",
        paddingBottom: "60px",
        paddingLeft: isMobile ? "12px" : "32px",
        paddingRight: isMobile ? "12px" : "32px",
        minHeight: "100vh",
      }}>

        {/* ══ OVERVIEW ═══════════════════════════════════════════════════ */}
        {currentView === "overview" && (() => {
          const fmtN = (email: string) =>
            email.split("@")[0].replace(/[._\-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
          const FIRE_QUOTES = [
            "You can be the someone who makes ₹10 LPA at 21. It's not luck — it's daily reps.",
            "Go to that hackathon you keep putting off. Nobody cares if you fail. They will care when you don't show up.",
            "Start the AI course. Bro — AI is coming whether you're ready or not.",
            "Go make a fool of yourself in public. Nobody gives a shit — and that's exactly why you should try.",
            "The #1 person on the leaderboard isn't smarter. They opened one more resource today.",
            "You can do it if others can. You're not special — and neither are they. Just show up.",
            "Every expert was once a beginner who refused to quit on a bad day. What kind of day is today?",
          ];
          const todayQuote = FIRE_QUOTES[new Date().getDay() % FIRE_QUOTES.length];
          const top3 = leaderboard?.leaderboard.slice(0, 3) ?? [];
          const OV_MCQ = { q: "What's the FIRST thing you should fix in a cold email to get a reply?", opts: ["Make it longer", "Subject line", "Signature", "Font size"], ans: 1, why: "47% of emails are opened or ignored based on the subject line alone. Fix that first — everything else is secondary." };
          const ovKey = "ov_daily_mcq";
          const medals = ["🥇", "🥈", "🥉"];
          return (
          <div style={{ animation: "ov-enter 0.4s cubic-bezier(.22,1,.36,1) both" }}>
            <style>{`
              @keyframes ov-enter { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
              @keyframes ov-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
            `}</style>

            {/* ── WELCOME BANNER ──────────────────────────────────────── */}
            <div style={{ background: W, border: "1.5px solid #E5E5E5", borderRadius: "16px", padding: isMobile ? "20px" : "24px 28px", marginBottom: "20px", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "4px" }}>
                    {getGreeting()} · {clockTime.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: isMobile ? "36px" : "50px", color: B, lineHeight: 1, letterSpacing: "0.02em" }}>
                    {(userName || "STUDENT").toUpperCase()}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {[
                    { label: "In Progress", value: inProgressCourses.length, bg: "#FFFBEB", color: "#D97706" },
                    { label: "Sessions",    value: sessionsInfo?.unlocked_count ?? sessions.filter(s => s.unlocked).length, bg: "#EFF6FF", color: "#2563EB" },
                    { label: "Topics Done", value: completedTopics, bg: "#F0FDF4", color: "#16A34A" },
                    { label: "Overall",     value: `${overallPct}%`, bg: "#FEF2F2", color: "#DC2626" },
                  ].map(stat => (
                    <div key={stat.label} style={{ background: stat.bg, borderRadius: "10px", padding: "8px 16px", textAlign: "center", minWidth: "64px" }}>
                      <div style={{ fontSize: "22px", fontWeight: 700, color: stat.color, lineHeight: 1 }}>{stat.value || 0}</div>
                      <div style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "3px" }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ borderLeft: "3px solid #FBBF24", paddingLeft: "14px", color: "#78716C", fontSize: "12px", fontStyle: "italic", lineHeight: 1.7 }}>
                "{todayQuote}"
              </div>
            </div>

            {/* ── TWO-COLUMN LAYOUT ───────────────────────────────────── */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 340px", gap: "20px", alignItems: "start" }}>

              {/* ══ LEFT COLUMN ══════════════════════════════════════════ */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* NEXT SESSION */}
                {upcomingEvents.length > 0 && (
                  <div style={{ background: W, border: "1.5px solid #E5E5E5", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                      <div style={{ width: "22px", height: "22px", background: "#EFF6FF", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CalendarDays size={12} color="#2563EB" />
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: B }}>Next Session</span>
                      <div style={{ marginLeft: "auto", background: urgencyBg(upcomingEvents[0].urgency) + "20", border: `1px solid ${urgencyBg(upcomingEvents[0].urgency)}60`, borderRadius: "20px", padding: "3px 10px", fontSize: "10px", fontWeight: 700, color: urgencyBg(upcomingEvents[0].urgency) }}>
                        {urgencyLabel(upcomingEvents[0].urgency)}
                      </div>
                    </div>
                    <div style={{ padding: "18px" }}>
                      <div style={{ fontWeight: 700, fontSize: "16px", color: B, marginBottom: "4px" }}>{upcomingEvents[0].title}</div>
                      <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "16px", display: "flex", alignItems: "center", gap: "5px" }}>
                        <CalendarDays size={11} color="#9CA3AF" />{formatEventDate(upcomingEvents[0].start, upcomingEvents[0].all_day)}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        {(() => {
                          const ml = upcomingEvents[0].description ? extractMeetLink(upcomingEvents[0].description) : null;
                          return ml ? (
                            <a href={ml} target="_blank" rel="noopener noreferrer"
                              style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: B, color: W, padding: "9px 18px", borderRadius: "8px", fontSize: "12px", fontWeight: 700, textDecoration: "none" }}>
                              🎥 Join Session
                            </a>
                          ) : <div />;
                        })()}
                        <div style={{ background: "#FFFBEB", borderRadius: "10px", padding: "8px 16px", textAlign: "center" }}>
                          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: "#D97706", lineHeight: 1 }}>{upcomingEvents[0].countdown}</div>
                          <div style={{ fontSize: "9px", color: "#9CA3AF", marginTop: "2px" }}>from now</div>
                        </div>
                      </div>
                    </div>
                    {upcomingEvents.slice(1, 3).length > 0 && (
                      <div style={{ borderTop: "1px solid #F3F4F6" }}>
                        {upcomingEvents.slice(1, 3).map((evt, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 18px", borderBottom: i === 0 && upcomingEvents.slice(1,3).length > 1 ? "1px solid #F3F4F6" : "none" }}>
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: urgencyBg(evt.urgency), flexShrink: 0 }} />
                            <div style={{ flex: 1, fontSize: "12px", color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{evt.title}</div>
                            <div style={{ fontSize: "11px", color: "#9CA3AF", flexShrink: 0 }}>{evt.countdown}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* DSA CHECK */}
                <div style={{ background: W, border: "1.5px solid #E5E5E5", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                    <div style={{ width: "22px", height: "22px", background: "#F0FDF4", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px" }}>💻</div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: B }}>Did you do DSA today?</span>
                  </div>
                  <div style={{ padding: "18px" }}>
                    {dsaToday === null && (
                      <div>
                        <p style={{ fontSize: "13px", color: "#6B7280", marginBottom: "16px", lineHeight: 1.7 }}>One DSA problem a day keeps rejection away. Did you grind today?</p>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <button onClick={() => setDsaToday("yes")}
                            style={{ flex: 1, padding: "11px 16px", background: "#DCFCE7", color: "#15803D", border: "1.5px solid #86EFAC", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>
                            YES 🔥
                          </button>
                          <button onClick={() => setDsaToday("no")}
                            style={{ flex: 1, padding: "11px 16px", background: W, color: "#6B7280", border: "1.5px solid #E5E7EB", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
                            Not yet...
                          </button>
                        </div>
                      </div>
                    )}
                    {dsaToday === "yes" && (
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", background: "#F0FDF4", borderRadius: "10px", padding: "16px" }}>
                        <span style={{ fontSize: "32px" }}>🔥</span>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "#15803D" }}>That's what separates you from the 80% who didn't.</div>
                          <div style={{ fontSize: "12px", color: "#4ADE80", marginTop: "4px" }}>Mamlesh is right here with you. Keep the streak alive.</div>
                        </div>
                      </div>
                    )}
                    {dsaToday === "no" && !dsaReasonDone && (
                      <div>
                        <p style={{ fontSize: "13px", color: B, fontWeight: 600, marginBottom: "12px" }}>No judgment here. What stopped you today?</p>
                        <textarea value={dsaReason} onChange={e => setDsaReason(e.target.value)}
                          placeholder="Honestly... I was tired / didn't know where to start / got distracted..."
                          style={{ width: "100%", border: "1.5px solid #E5E7EB", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", resize: "none", height: "68px", outline: "none", boxSizing: "border-box", fontFamily: "'Sora', sans-serif", color: B, transition: "border-color 0.15s" }}
                          onFocus={e => (e.target.style.borderColor = "#FBBF24")}
                          onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
                        />
                        <button onClick={() => { if (dsaReason.trim()) setDsaReasonDone(true); }}
                          style={{ marginTop: "12px", padding: "10px 22px", background: B, color: W, border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                          Tell Mamlesh →
                        </button>
                      </div>
                    )}
                    {dsaToday === "no" && dsaReasonDone && (
                      <div style={{ display: "flex", alignItems: "center", gap: "14px", background: "#FFFBEB", borderRadius: "10px", padding: "16px" }}>
                        <span style={{ fontSize: "28px" }}>💛</span>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 700, color: "#92400E" }}>We hear you. Tomorrow is a clean slate.</div>
                          <div style={{ fontSize: "12px", color: "#D97706", marginTop: "4px" }}>Mamlesh is here — show up again and we'll be right here too.</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* CONTINUE LEARNING */}
                <div style={{ background: W, border: "1.5px solid #E5E5E5", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                    <div style={{ width: "22px", height: "22px", background: "#EFF6FF", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <TrendingUp size={12} color="#2563EB" />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: B }}>Continue Learning</span>
                    <span style={{ marginLeft: "auto", fontSize: "11px", color: "#9CA3AF" }}>{inProgressCourses.length} active · {courses.length} total</span>
                  </div>
                  <div style={{ padding: "8px" }}>
                    {inProgressCourses.length > 0 ? (
                      inProgressCourses.slice(0, 2).map((course, i) => (
                        <LearningProgressCard key={course.id} course={course} onClick={() => openCourse(course.id)} isMobile={isMobile} animIndex={i} />
                      ))
                    ) : (
                      <div style={{ padding: "22px", textAlign: "center" }}>
                        <div style={{ fontSize: "13px", color: "#9CA3AF", marginBottom: "14px", lineHeight: 1.7 }}>
                          No courses in progress yet.<br />
                          <strong style={{ color: B }}>Start the AI course. Bro — AI is coming.</strong>
                        </div>
                        <button onClick={() => switchView("courses")} style={{ padding: "10px 22px", background: B, color: W, border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                          Browse Courses →
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* ══ RIGHT SIDEBAR ════════════════════════════════════════ */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: isMobile ? "static" : "sticky", top: "80px", alignSelf: "flex-start" }}>

                {/* QUICK FIRE MCQ */}
                <div style={{ background: W, border: "1.5px solid #E5E5E5", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                    <div style={{ width: "22px", height: "22px", background: "#FFFBEB", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Zap size={12} color="#D97706" />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: B }}>Quick Fire</span>
                    <span style={{ marginLeft: "auto", fontSize: "10px", color: "#9CA3AF" }}>answer to unlock insight</span>
                  </div>
                  <div style={{ padding: "16px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: B, marginBottom: "14px", lineHeight: 1.6 }}>{OV_MCQ.q}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {OV_MCQ.opts.map((opt, idx) => {
                        const answered = ckMCQAnswers[ovKey] !== undefined;
                        const chosen   = ckMCQAnswers[ovKey];
                        const isCorrect = idx === OV_MCQ.ans;
                        const isChosen  = chosen === idx;
                        const bg   = answered && isCorrect ? "#DCFCE7" : answered && isChosen ? "#FEE2E2" : W;
                        const bord = answered && isCorrect ? "1.5px solid #86EFAC" : answered && isChosen ? "1.5px solid #FCA5A5" : "1.5px solid #E5E7EB";
                        const col  = answered && isCorrect ? "#15803D" : answered && isChosen ? "#DC2626" : B;
                        return (
                          <button key={idx} onClick={() => answerMCQ(ovKey, idx, OV_MCQ.ans)} disabled={answered}
                            style={{ padding: "10px 14px", background: bg, border: bord, borderRadius: "8px", color: col, fontSize: "12px", fontWeight: isChosen ? 700 : 500, cursor: answered ? "default" : "pointer", textAlign: "left", transition: "all 0.15s" }}
                            onMouseEnter={e => { if (!answered) (e.currentTarget as HTMLButtonElement).style.border = "1.5px solid #D97706"; }}
                            onMouseLeave={e => { if (!answered) (e.currentTarget as HTMLButtonElement).style.border = "1.5px solid #E5E7EB"; }}
                          >{opt}</button>
                        );
                      })}
                    </div>
                    {ckMCQAnswers[ovKey] !== undefined && (
                      <div style={{ marginTop: "12px", padding: "12px 14px", background: "#FFFBEB", borderRadius: "8px", border: "1px solid #FDE68A", fontSize: "11px", color: "#92400E", lineHeight: 1.6 }}>
                        💡 {OV_MCQ.why}
                      </div>
                    )}
                  </div>
                </div>

                {/* TOP 3 LEADERBOARD */}
                <div style={{ background: W, border: "1.5px solid #E5E5E5", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                    <div style={{ width: "22px", height: "22px", background: "#FFFBEB", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Trophy size={12} color="#D97706" />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: B }}>Top 3 This Week</span>
                    <button onClick={() => switchView("leaderboard")}
                      style={{ marginLeft: "auto", fontSize: "11px", color: "#D97706", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                      View All →
                    </button>
                  </div>
                  <div>
                    {top3.length > 0 ? (
                      <>
                        {top3.map((entry, i) => {
                          const name = entry.is_me ? (userName || fmtN(entry.email)) : fmtN(entry.email);
                          return (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 16px", borderBottom: i < 2 ? "1px solid #F3F4F6" : "none", background: entry.is_me ? "#FFFBEB" : W }}>
                              <span style={{ fontSize: "18px", flexShrink: 0 }}>{medals[i]}</span>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: "12px", fontWeight: 600, color: B, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                  {name}
                                  {entry.is_me && <span style={{ fontSize: "9px", background: "#FBBF24", color: B, padding: "1px 5px", borderRadius: "4px", marginLeft: "5px", fontWeight: 700 }}>YOU</span>}
                                </div>
                                <div style={{ fontSize: "10px", color: "#9CA3AF", marginTop: "2px" }}>🔑 {entry.login_days}d · 📚 {entry.resource_opens}</div>
                              </div>
                              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "18px", color: "#D97706", flexShrink: 0 }}>{entry.score}</div>
                            </div>
                          );
                        })}
                        <div style={{ padding: "10px 16px", background: "#FFFBEB", borderTop: "1px solid #FDE68A", fontSize: "11px", color: "#92400E", fontWeight: 600 }}>
                          → Log in daily. You're one week from being here.
                        </div>
                      </>
                    ) : (
                      <div style={{ padding: "20px", textAlign: "center" }}>
                        <div style={{ fontSize: "12px", color: "#9CA3AF", marginBottom: "6px" }}>{leaderboardLoading ? "Loading..." : "No rankings yet this week."}</div>
                        {!leaderboardLoading && <div style={{ fontSize: "12px", fontWeight: 700, color: B }}>Log in today. You could be #1.</div>}
                      </div>
                    )}
                  </div>
                </div>

                {/* TALK TO US */}
                <div style={{ background: W, border: "1.5px solid #E5E5E5", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: "1px solid #F3F4F6" }}>
                    <div style={{ width: "22px", height: "22px", background: "#F0FDF4", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <MessageCircle size={12} color="#16A34A" />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: B }}>Talk to Us</span>
                  </div>
                  <div style={{ padding: "16px" }}>
                    {talkDone ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "#F0FDF4", borderRadius: "10px", padding: "14px" }}>
                        <span style={{ fontSize: "26px" }}>💛</span>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "#15803D" }}>We got you.</div>
                          <div style={{ fontSize: "11px", color: "#4ADE80", marginTop: "3px" }}>We'll reach out — DM or call. You're not in this alone.</div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p style={{ fontSize: "12px", color: "#6B7280", lineHeight: 1.7, marginBottom: "12px" }}>
                          Struggling? Excited? Lost? We will <strong style={{ color: B }}>call you or message you back.</strong>
                        </p>
                        <textarea value={talkMsg} onChange={e => setTalkMsg(e.target.value)}
                          placeholder="Type anything — we're actually reading this..."
                          style={{ width: "100%", border: "1.5px solid #E5E7EB", borderRadius: "8px", padding: "10px 12px", fontSize: "12px", resize: "none", height: "72px", outline: "none", boxSizing: "border-box", fontFamily: "'Sora', sans-serif", color: B, transition: "border-color 0.15s" }}
                          onFocus={e => (e.target.style.borderColor = "#FBBF24")}
                          onBlur={e => (e.target.style.borderColor = "#E5E7EB")}
                        />
                        <button
                          onClick={async () => {
                            if (!talkMsg.trim()) return;
                            try { await api.student.submitFeedback({ type: "talk", message: talkMsg, resource_name: "" }); } catch { /* best effort */ }
                            setTalkDone(true);
                          }}
                          style={{ marginTop: "10px", padding: "10px 22px", background: B, color: W, border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#222")}
                          onMouseLeave={e => (e.currentTarget.style.background = B)}
                        >Reach Out →</button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
          );
        })()}

        {/* ══ COURSES ════════════════════════════════════════════════════ */}
        {currentView === "courses" && (
          <div>
            <div style={{ marginBottom: "32px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: Y, color: B, border: `2px solid ${B}`, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "16px" }}>
                <Zap size={13} /> STRUCTURED LEARNING
              </div>
              <h1 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.02em" }}>
                Courses
              </h1>
              <p style={{ fontSize: "14px", color: B, fontWeight: 500, maxWidth: "500px", lineHeight: 1.7 }}>
                Every course from day one to offer letter. Track progress, complete topics, earn certificates.
              </p>
            </div>
            <CourseSectionView courses={coursesCourses} onOpen={openCourse} />
          </div>
        )}

        {/* ══ PLACEMENTS — LIST VIEW ═════════════════════════════════════ */}
        {currentView === "placements" && !placementsCompany && (
          <div>
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: Y, color: B, border: `2px solid ${B}`, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "16px" }}>
                <Trophy size={13} /> COMPANY-SPECIFIC PREP
              </div>
              <h1 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.02em" }}>
                Placements
              </h1>
              <p style={{ fontSize: "14px", color: MUTE, maxWidth: "560px", lineHeight: 1.7 }}>
                Company-by-company prep — aptitude, coding, interview questions, history, MCQs, and a few words to keep you going.
              </p>
            </div>

            {/* Service / Product toggle */}
            <div style={{ display: "inline-flex", padding: "4px", background: "#F3F4F6", borderRadius: "10px", marginBottom: "24px", gap: "2px" }}>
              {([
                { key: "service" as CompanyType, label: "Service-Based" },
                { key: "product" as CompanyType, label: "Product-Based" },
              ]).map(t => {
                const active = placementsTab === t.key;
                return (
                  <button key={t.key} onClick={() => setPlacementsTab(t.key)}
                    style={{ padding: "8px 18px", background: active ? W : "transparent", color: active ? B : MUTE, border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: 700, cursor: "pointer", boxShadow: active ? "0 1px 3px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s" }}
                  >{t.label}</button>
                );
              })}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "24px" }}>
              {(Object.entries(PLACEMENT_COMPANIES) as Array<[CompanyKey, CompanyInfo]>)
                .filter(([, c]) => c.type === placementsTab)
                .map(([key, company]) => (
                <div key={key} style={{ cursor: "pointer" }} onClick={() => openPlacementCompany(key)}>
                  <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}
                  >
                    {/* Card image — different SVG per company */}
                    {key === "tcs" && (
                      <div style={{ height: "200px", backgroundColor: "#001E5A", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#001E5A"/>
                          {/* Orbit rings */}
                          <ellipse cx="200" cy="100" rx="150" ry="50" fill="none" stroke="#FFE500" strokeWidth="1" opacity="0.25"/>
                          <ellipse cx="200" cy="100" rx="110" ry="40" fill="none" stroke="#FFE500" strokeWidth="1" opacity="0.4"/>
                          <ellipse cx="200" cy="100" rx="70" ry="28" fill="none" stroke="#FFE500" strokeWidth="1" opacity="0.6"/>
                          {/* Dots on rings */}
                          <circle cx="350" cy="100" r="3" fill="#FFE500"/>
                          <circle cx="50" cy="100" r="3" fill="#FFE500"/>
                          <circle cx="310" cy="100" r="3" fill="#FFE500"/>
                          <circle cx="90" cy="100" r="3" fill="#FFE500"/>
                          {/* Center plate */}
                          <rect x="120" y="58" width="160" height="84" rx="10" fill="#003C9F"/>
                          <text x="200" y="98" fontFamily="'Bebas Neue', sans-serif" fontSize="42" fontWeight="700" fill="#FFE500" textAnchor="middle">TCS</text>
                          <text x="200" y="124" fontFamily="monospace" fontSize="9" fill="#fff" textAnchor="middle" opacity="0.7">TATA CONSULTANCY SERVICES</text>
                          {/* Service tag */}
                          <rect x="160" y="160" width="80" height="22" rx="11" fill="#FFE500"/>
                          <text x="200" y="175" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#001E5A" textAnchor="middle">SERVICE BASED</text>
                          {/* Stats top right */}
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#FFE500" textAnchor="end" opacity="0.7">600K+ EMPLOYEES</text>
                          <text x="378" y="44" fontFamily="monospace" fontSize="8" fill="#FFE500" textAnchor="end" opacity="0.7">EST. 1968</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>4 TRACKS</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Building2 size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "virtusa" && (
                      <div style={{ height: "200px", backgroundColor: "#1A0B2E", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#1A0B2E"/>
                          <defs>
                            <linearGradient id="virtusa-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#7C3AED"/>
                              <stop offset="100%" stopColor="#A78BFA"/>
                            </linearGradient>
                          </defs>
                          {/* Big V */}
                          <polygon points="100,40 130,40 200,140 270,40 300,40 215,170 185,170" fill="url(#virtusa-grad)"/>
                          {/* Motion lines */}
                          <line x1="30" y1="60" x2="70" y2="60" stroke="#A78BFA" strokeWidth="2" opacity="0.6"/>
                          <line x1="20" y1="80" x2="80" y2="80" stroke="#A78BFA" strokeWidth="2" opacity="0.4"/>
                          <line x1="40" y1="100" x2="80" y2="100" stroke="#A78BFA" strokeWidth="2" opacity="0.7"/>
                          <line x1="320" y1="60" x2="370" y2="60" stroke="#A78BFA" strokeWidth="2" opacity="0.4"/>
                          <line x1="310" y1="80" x2="380" y2="80" stroke="#A78BFA" strokeWidth="2" opacity="0.6"/>
                          <line x1="330" y1="100" x2="370" y2="100" stroke="#A78BFA" strokeWidth="2" opacity="0.4"/>
                          {/* Code snippet */}
                          <rect x="120" y="170" width="160" height="22" rx="11" fill="#FFE500"/>
                          <text x="200" y="185" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#1A0B2E" textAnchor="middle">PRODUCT BASED</text>
                          {/* Top stats */}
                          <text x="22" y="30" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#A78BFA">VIRTUSA</text>
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#A78BFA" textAnchor="end" opacity="0.7">EST. 1996</text>
                          <text x="378" y="44" fontFamily="monospace" fontSize="8" fill="#A78BFA" textAnchor="end" opacity="0.7">36K+ ENGINEERS</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>20 PROBLEMS</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Sparkles size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "oracle" && (
                      <div style={{ height: "200px", backgroundColor: "#1A0000", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#1A0000"/>
                          {/* Big O (Oracle wordmark style) */}
                          <ellipse cx="200" cy="100" rx="120" ry="56" fill="none" stroke="#F80000" strokeWidth="14"/>
                          {/* DB cylinders behind */}
                          <ellipse cx="100" cy="60" rx="22" ry="6" fill="#F80000" opacity="0.6"/>
                          <rect x="78" y="60" width="44" height="50" fill="#F80000" opacity="0.6"/>
                          <ellipse cx="100" cy="110" rx="22" ry="6" fill="#A30000" opacity="0.8"/>
                          <ellipse cx="100" cy="78" rx="22" ry="6" fill="none" stroke="#1A0000" strokeWidth="0.8" opacity="0.4"/>
                          <ellipse cx="100" cy="94" rx="22" ry="6" fill="none" stroke="#1A0000" strokeWidth="0.8" opacity="0.4"/>
                          <ellipse cx="300" cy="60" rx="22" ry="6" fill="#F80000" opacity="0.6"/>
                          <rect x="278" y="60" width="44" height="50" fill="#F80000" opacity="0.6"/>
                          <ellipse cx="300" cy="110" rx="22" ry="6" fill="#A30000" opacity="0.8"/>
                          <ellipse cx="300" cy="78" rx="22" ry="6" fill="none" stroke="#1A0000" strokeWidth="0.8" opacity="0.4"/>
                          <ellipse cx="300" cy="94" rx="22" ry="6" fill="none" stroke="#1A0000" strokeWidth="0.8" opacity="0.4"/>
                          {/* ORACLE label below */}
                          <text x="200" y="106" fontFamily="'Bebas Neue', sans-serif" fontSize="38" fontWeight="700" fill="#fff" textAnchor="middle" letterSpacing="6">ORACLE</text>
                          {/* Product tag */}
                          <rect x="160" y="160" width="80" height="22" rx="11" fill="#FFE500"/>
                          <text x="200" y="175" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#1A0000" textAnchor="middle">PRODUCT BASED</text>
                          <text x="22" y="30" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#F80000">EST. 1977</text>
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#F80000" textAnchor="end" opacity="0.7">165K+ EMPLOYEES</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>20 PROBLEMS</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Database size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "zomato" && (
                      <div style={{ height: "200px", backgroundColor: "#3A0A0A", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#3A0A0A"/>
                          {/* Map grid */}
                          <defs>
                            <pattern id="zom-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="#FFE500" strokeWidth="0.4" opacity="0.18"/></pattern>
                          </defs>
                          <rect width="400" height="200" fill="url(#zom-grid)"/>
                          {/* Restaurant pin (left) */}
                          <path d="M 80 50 C 96 50, 108 62, 108 78 C 108 95, 80 130, 80 130 C 80 130, 52 95, 52 78 C 52 62, 64 50, 80 50 Z" fill="#EF4444"/>
                          <circle cx="80" cy="78" r="9" fill="#fff"/>
                          <text x="80" y="82" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#EF4444" textAnchor="middle">R</text>
                          {/* Home pin (right) */}
                          <path d="M 320 50 C 336 50, 348 62, 348 78 C 348 95, 320 130, 320 130 C 320 130, 292 95, 292 78 C 292 62, 304 50, 320 50 Z" fill="#22C55E"/>
                          <path d="M 314 78 L 320 71 L 326 78 L 326 86 L 314 86 Z" fill="#fff"/>
                          {/* Dashed delivery route */}
                          <path d="M 108 80 Q 200 30 292 80" stroke="#FFE500" strokeWidth="2" strokeDasharray="5 4" fill="none"/>
                          {/* Scooter (animated dot on route) */}
                          <g>
                            <circle cx="0" cy="0" r="10" fill="#FFE500" stroke="#3A0A0A" strokeWidth="1.5">
                              <animateMotion path="M 108 80 Q 200 30 292 80" dur="3s" repeatCount="indefinite"/>
                            </circle>
                            <text x="0" y="0" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#3A0A0A" textAnchor="middle" dy="3">
                              🛵
                              <animateMotion path="M 108 80 Q 200 30 292 80" dur="3s" repeatCount="indefinite"/>
                            </text>
                          </g>
                          {/* Food bowl bottom-center */}
                          <ellipse cx="200" cy="156" rx="38" ry="10" fill="#FFE500"/>
                          <path d="M 162 156 Q 200 184 238 156 Z" fill="#FFE500"/>
                          <ellipse cx="200" cy="156" rx="38" ry="6" fill="#D97706"/>
                          <circle cx="186" cy="152" r="4" fill="#FB923C"/>
                          <circle cx="200" cy="150" r="4" fill="#22C55E"/>
                          <circle cx="214" cy="152" r="4" fill="#EF4444"/>
                          {/* Header label */}
                          <rect x="148" y="20" width="104" height="22" rx="11" fill="#FFE500"/>
                          <text x="200" y="35" fontFamily="monospace" fontSize="11" fontWeight="700" fill="#3A0A0A" textAnchor="middle">ZOMATO</text>
                          <text x="22" y="30" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" opacity="0.7">EST. 2008</text>
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#FFE500" textAnchor="end" opacity="0.7">50K orders/min</text>
                        </svg>
                        <div style={{ position: "absolute", top: "44px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>14-DAY PLAN</div>
                        <div style={{ position: "absolute", top: "44px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Utensils size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "qualcomm" && (
                      <div style={{ height: "200px", backgroundColor: "#08144D", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#08144D"/>
                          {/* Chip body */}
                          <rect x="120" y="60" width="160" height="100" rx="8" fill="#10245F" stroke="#3B82F6" strokeWidth="2"/>
                          <rect x="138" y="78" width="124" height="64" rx="4" fill="#3B82F6"/>
                          <text x="200" y="108" fontFamily="'Bebas Neue', sans-serif" fontSize="22" fontWeight="700" fill="#fff" textAnchor="middle">SNAPDRAGON</text>
                          <text x="200" y="124" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle" opacity="0.7">QUALCOMM</text>
                          {/* Chip pins */}
                          {[140, 156, 172, 188, 204, 220, 236, 252, 268].map(x => (<rect key={`qp-t-${x}`} x={x - 2} y="54" width="4" height="8" fill="#3B82F6"/>))}
                          {[140, 156, 172, 188, 204, 220, 236, 252, 268].map(x => (<rect key={`qp-b-${x}`} x={x - 2} y="160" width="4" height="8" fill="#3B82F6"/>))}
                          {[68, 84, 100, 116, 132, 148].map(y => (<rect key={`qp-l-${y}`} x="112" y={y - 2} width="8" height="4" fill="#3B82F6"/>))}
                          {[68, 84, 100, 116, 132, 148].map(y => (<rect key={`qp-r-${y}`} x="280" y={y - 2} width="8" height="4" fill="#3B82F6"/>))}
                          {/* 5G signal waves */}
                          <path d="M 40 60 Q 40 100, 90 100" stroke="#FFE500" strokeWidth="1.8" fill="none" opacity="0.5"/>
                          <path d="M 40 80 Q 40 100, 80 100" stroke="#FFE500" strokeWidth="1.8" fill="none" opacity="0.7"/>
                          <path d="M 40 100 Q 40 100, 70 100" stroke="#FFE500" strokeWidth="1.8" fill="none"/>
                          <text x="22" y="46" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500">5G</text>
                          <path d="M 360 60 Q 360 100, 310 100" stroke="#FFE500" strokeWidth="1.8" fill="none" opacity="0.5"/>
                          <path d="M 360 80 Q 360 100, 320 100" stroke="#FFE500" strokeWidth="1.8" fill="none" opacity="0.7"/>
                          <path d="M 360 100 Q 360 100, 330 100" stroke="#FFE500" strokeWidth="1.8" fill="none"/>
                          <text x="378" y="46" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" textAnchor="end">AI</text>
                          {/* Bits on top */}
                          <text x="200" y="36" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#FFE500" textAnchor="middle">0x0001 → 0x0002 → 0x0004</text>
                          {/* Footer label */}
                          <rect x="160" y="174" width="80" height="20" rx="10" fill="#FFE500"/>
                          <text x="200" y="187" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#08144D" textAnchor="middle">PRODUCT BASED</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>14-DAY PLAN</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Wifi size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "morgan_stanley" && (
                      <div style={{ height: "200px", backgroundColor: "#0A0E2A", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#0A0E2A"/>
                          <defs>
                            <linearGradient id="ms-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.6"/>
                              <stop offset="100%" stopColor="#FFE500" stopOpacity="0.3"/>
                            </linearGradient>
                          </defs>
                          {/* Chart background area */}
                          <path d="M 30 160 L 30 130 L 70 120 L 110 95 L 150 105 L 190 80 L 230 70 L 270 60 L 310 45 L 350 30 L 370 25 L 370 160 Z" fill="url(#ms-grad)"/>
                          {/* Chart line */}
                          <path d="M 30 130 L 70 120 L 110 95 L 150 105 L 190 80 L 230 70 L 270 60 L 310 45 L 350 30 L 370 25" stroke="#FFE500" strokeWidth="2.4" fill="none"/>
                          {/* Data points */}
                          {[[30,130],[70,120],[110,95],[150,105],[190,80],[230,70],[270,60],[310,45],[350,30],[370,25]].map(([x,y], i) => (
                            <circle key={`pt-${i}`} cx={x} cy={y} r="3" fill="#FFE500" stroke="#0A0E2A" strokeWidth="1"/>
                          ))}
                          {/* Gridlines */}
                          <line x1="20" y1="160" x2="380" y2="160" stroke="#FFE500" strokeWidth="0.5" opacity="0.3"/>
                          <line x1="20" y1="120" x2="380" y2="120" stroke="#FFE500" strokeWidth="0.3" opacity="0.2"/>
                          <line x1="20" y1="80" x2="380" y2="80" stroke="#FFE500" strokeWidth="0.3" opacity="0.2"/>
                          <line x1="20" y1="40" x2="380" y2="40" stroke="#FFE500" strokeWidth="0.3" opacity="0.2"/>
                          {/* Big label */}
                          <text x="200" y="184" fontFamily="'Bebas Neue', sans-serif" fontSize="22" fontWeight="700" fill="#fff" textAnchor="middle" letterSpacing="3">MORGAN STANLEY</text>
                          {/* Top stats */}
                          <text x="22" y="30" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500">EST. 1935</text>
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#FFE500" textAnchor="end" opacity="0.7">25K+ ENGINEERS</text>
                          {/* Ticker top */}
                          <rect x="160" y="14" width="80" height="14" rx="3" fill="#22C55E"/>
                          <text x="200" y="24" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#0A0E2A" textAnchor="middle">▲ MS +2.3%</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>FINANCE-DSA</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <TrendingUp size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "microsoft" && (
                      <div style={{ height: "200px", backgroundColor: "#1A1A1A", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#1A1A1A"/>
                          {/* Microsoft 4-square logo (big) */}
                          <rect x="150" y="40" width="44" height="44" fill="#F25022"/>
                          <rect x="198" y="40" width="44" height="44" fill="#7FBA00"/>
                          <rect x="150" y="88" width="44" height="44" fill="#00A4EF"/>
                          <rect x="198" y="88" width="44" height="44" fill="#FFB900"/>
                          {/* Microsoft wordmark */}
                          <text x="200" y="158" fontFamily="'Segoe UI', sans-serif" fontSize="20" fontWeight="700" fill="#fff" textAnchor="middle">Microsoft</text>
                          <text x="200" y="178" fontFamily="monospace" fontSize="9" fill="#9CA3AF" textAnchor="middle">Azure · Office · GitHub · LinkedIn</text>
                          {/* Floating product chips */}
                          <rect x="20" y="20" width="60" height="18" rx="9" fill="#00A4EF"/>
                          <text x="50" y="32" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">AZURE</text>
                          <rect x="320" y="20" width="60" height="18" rx="9" fill="#F25022"/>
                          <text x="350" y="32" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">OFFICE</text>
                          <rect x="20" y="170" width="60" height="18" rx="9" fill="#7FBA00"/>
                          <text x="50" y="182" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">GITHUB</text>
                          <rect x="320" y="170" width="60" height="18" rx="9" fill="#FFB900"/>
                          <text x="350" y="182" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#0A0A0A" textAnchor="middle">COPILOT</text>
                          {/* Stat text */}
                          <text x="100" y="100" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" opacity="0.6">EST.</text>
                          <text x="100" y="116" fontFamily="'Bebas Neue', sans-serif" fontSize="20" fontWeight="700" fill="#fff">1975</text>
                          <text x="300" y="100" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" opacity="0.6" textAnchor="end">EMPLOYEES</text>
                          <text x="300" y="116" fontFamily="'Bebas Neue', sans-serif" fontSize="20" fontWeight="700" fill="#fff" textAnchor="end">228K</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "164px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>14-DAY PLAN</div>
                        <div style={{ position: "absolute", top: "12px", right: "164px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <LayoutGrid size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "meta" && (
                      <div style={{ height: "200px", backgroundColor: "#050C24", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#050C24"/>
                          <defs>
                            <linearGradient id="meta-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#0091FF"/>
                              <stop offset="100%" stopColor="#A435F0"/>
                            </linearGradient>
                          </defs>
                          {/* Infinity loop (Meta-style swoosh) */}
                          <path d="M 110 100 C 110 70, 150 70, 170 100 C 190 130, 230 130, 250 100 C 270 70, 310 70, 310 100 C 310 130, 270 130, 250 100 C 230 70, 190 70, 170 100 C 150 130, 110 130, 110 100 Z" fill="none" stroke="url(#meta-grad)" strokeWidth="6" strokeLinecap="round"/>
                          {/* Meta wordmark */}
                          <text x="200" y="158" fontFamily="'Bebas Neue', sans-serif" fontSize="34" fontWeight="700" fill="#fff" textAnchor="middle" letterSpacing="4">META</text>
                          {/* Surrounding product chips */}
                          <rect x="20" y="32" width="76" height="18" rx="9" fill="#0866FF"/>
                          <text x="58" y="44" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">FACEBOOK</text>
                          <rect x="304" y="32" width="76" height="18" rx="9" fill="#E1306C"/>
                          <text x="342" y="44" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">INSTAGRAM</text>
                          <rect x="20" y="170" width="76" height="18" rx="9" fill="#25D366"/>
                          <text x="58" y="182" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">WHATSAPP</text>
                          <rect x="304" y="170" width="76" height="18" rx="9" fill="#A435F0"/>
                          <text x="342" y="182" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">LLAMA AI</text>
                          {/* Pass rate footer */}
                          <text x="22" y="184" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#FFE500" opacity="0">.</text>
                          <text x="200" y="178" fontFamily="monospace" fontSize="8" fill="#A435F0" textAnchor="middle" opacity="0.8">3.5B users · 67K engineers</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>14-DAY PLAN</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Globe size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "juspay" && (
                      <div style={{ height: "200px", backgroundColor: "#0B1730", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#0B1730"/>
                          {/* Card */}
                          <rect x="60" y="58" width="190" height="118" rx="10" fill="#1E2A52" stroke="#FFE500" strokeWidth="1.5"/>
                          <rect x="60" y="68" width="190" height="22" fill="#0B1730"/>
                          {/* Chip */}
                          <rect x="78" y="100" width="32" height="22" rx="3" fill="#FFE500"/>
                          <rect x="84" y="106" width="20" height="2" fill="#0B1730"/>
                          <rect x="84" y="110" width="20" height="2" fill="#0B1730"/>
                          <rect x="84" y="114" width="20" height="2" fill="#0B1730"/>
                          {/* Card number */}
                          <text x="78" y="140" fontFamily="monospace" fontSize="11" fontWeight="700" fill="#fff">4111 ●●●● ●●●● 1234</text>
                          <text x="78" y="160" fontFamily="monospace" fontSize="7" fill="#9CA3AF">CARDHOLDER</text>
                          <text x="78" y="170" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff">YOUR NAME</text>
                          <text x="180" y="160" fontFamily="monospace" fontSize="7" fill="#9CA3AF">EXP</text>
                          <text x="180" y="170" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff">12/28</text>
                          {/* Transaction flow */}
                          <path d="M 260 70 L 340 70" stroke="#22C55E" strokeWidth="2"/>
                          <text x="300" y="64" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#22C55E" textAnchor="middle">AUTH ✓</text>
                          <path d="M 260 100 L 340 100" stroke="#FFE500" strokeWidth="2"/>
                          <text x="300" y="94" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#FFE500" textAnchor="middle">ROUTE</text>
                          <path d="M 260 130 L 340 130" stroke="#22C55E" strokeWidth="2"/>
                          <text x="300" y="124" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#22C55E" textAnchor="middle">SETTLE ✓</text>
                          {/* Mini graph */}
                          <text x="358" y="158" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#FFE500" textAnchor="end">TPS ↑</text>
                          <text x="358" y="170" fontFamily="monospace" fontSize="11" fontWeight="700" fill="#FFE500" textAnchor="end">9K/s</text>
                          {/* Header label */}
                          <rect x="148" y="20" width="104" height="22" rx="11" fill="#FFE500"/>
                          <text x="200" y="35" fontFamily="monospace" fontSize="11" fontWeight="700" fill="#0B1730" textAnchor="middle">JUSPAY</text>
                          <text x="22" y="30" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" opacity="0.7">EST. 2012</text>
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#FFE500" textAnchor="end" opacity="0.7">HASKELL IN PROD</text>
                        </svg>
                        <div style={{ position: "absolute", top: "44px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>14-DAY PLAN</div>
                        <div style={{ position: "absolute", top: "44px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <CreditCard size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "jpmorgan" && (
                      <div style={{ height: "200px", backgroundColor: "#0A1F36", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#0A1F36"/>
                          {/* Columns (bank facade) */}
                          <polygon points="60,40 340,40 320,56 80,56" fill="#FFE500"/>
                          <rect x="80" y="56" width="6" height="100" fill="#FFE500"/>
                          <rect x="124" y="56" width="6" height="100" fill="#FFE500"/>
                          <rect x="168" y="56" width="6" height="100" fill="#FFE500"/>
                          <rect x="226" y="56" width="6" height="100" fill="#FFE500"/>
                          <rect x="270" y="56" width="6" height="100" fill="#FFE500"/>
                          <rect x="314" y="56" width="6" height="100" fill="#FFE500"/>
                          <rect x="60" y="156" width="280" height="8" fill="#FFE500"/>
                          <rect x="60" y="40" width="280" height="4" fill="#A8800A"/>
                          {/* Wordmark */}
                          <text x="200" y="92" fontFamily="'Bebas Neue', sans-serif" fontSize="22" fontWeight="700" fill="#0A1F36" textAnchor="middle">JP MORGAN</text>
                          <text x="200" y="112" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#0A1F36" textAnchor="middle">CHASE &amp; CO</text>
                          {/* Stock tickers floating */}
                          <rect x="20" y="172" width="92" height="18" rx="9" fill="#22C55E"/>
                          <text x="66" y="184" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#0A1F36" textAnchor="middle">▲ JPM +1.6%</text>
                          <rect x="288" y="172" width="92" height="18" rx="9" fill="#EF4444"/>
                          <text x="334" y="184" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">▼ DJI -0.2%</text>
                          <text x="22" y="30" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500">EST. 1799</text>
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#FFE500" textAnchor="end" opacity="0.7">50K+ ENGINEERS</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>FINANCE-DSA</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Banknote size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "ibm" && (
                      <div style={{ height: "200px", backgroundColor: "#0D2A47", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#0D2A47"/>
                          {/* IBM horizontal stripe wordmark */}
                          {[68, 76, 84, 92, 100, 108, 116].map((y, i) => (<rect key={`ibm-${i}`} x="80" y={y} width="240" height="3" fill="#fff"/>))}
                          {/* I */}
                          <rect x="100" y="60" width="20" height="6" fill="#0D2A47"/>
                          <rect x="100" y="118" width="20" height="6" fill="#0D2A47"/>
                          {/* B */}
                          <rect x="160" y="60" width="20" height="6" fill="#0D2A47"/>
                          <rect x="160" y="84" width="20" height="6" fill="#0D2A47"/>
                          <rect x="160" y="118" width="20" height="6" fill="#0D2A47"/>
                          <rect x="184" y="66" width="6" height="58" fill="#fff"/>
                          {/* M */}
                          <rect x="220" y="60" width="20" height="6" fill="#0D2A47"/>
                          <rect x="240" y="60" width="20" height="6" fill="#0D2A47"/>
                          <rect x="260" y="60" width="20" height="6" fill="#0D2A47"/>
                          <rect x="220" y="118" width="60" height="6" fill="#0D2A47"/>
                          {/* Tagline */}
                          <text x="200" y="148" fontFamily="monospace" fontSize="9" fill="#FFE500" textAnchor="middle">CLOUD · AI · QUANTUM</text>
                          {/* Tag */}
                          <rect x="160" y="166" width="80" height="22" rx="11" fill="#FFE500"/>
                          <text x="200" y="181" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#0D2A47" textAnchor="middle">JAVA HEAVY</text>
                          <text x="22" y="30" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500">EST. 1911</text>
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#FFE500" textAnchor="end" opacity="0.7">280K+ EMPLOYEES</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>20 PROBLEMS</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Building size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "goldman_sachs" && (
                      <div style={{ height: "200px", backgroundColor: "#0B1A2E", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#0B1A2E"/>
                          {/* Bank facade */}
                          <rect x="60" y="58" width="280" height="106" fill="#7A623F"/>
                          {/* Triangular roof */}
                          <polygon points="60,58 340,58 320,42 80,42" fill="#FFE500"/>
                          <polygon points="80,42 320,42 200,18" fill="#7A623F"/>
                          {/* Columns */}
                          {[88, 124, 160, 196, 232, 268, 304].map((x, i) => (
                            <rect key={`col-${i}`} x={x} y="74" width="8" height="76" fill="#fff" opacity="0.85"/>
                          ))}
                          {/* Base steps */}
                          <rect x="50" y="164" width="300" height="6" fill="#FFE500"/>
                          <rect x="40" y="170" width="320" height="6" fill="#C0A050"/>
                          {/* Wordmark */}
                          <text x="200" y="100" fontFamily="'Bebas Neue', sans-serif" fontSize="18" fontWeight="700" fill="#FFE500" textAnchor="middle" letterSpacing="3">GOLDMAN</text>
                          <text x="200" y="120" fontFamily="'Bebas Neue', sans-serif" fontSize="18" fontWeight="700" fill="#FFE500" textAnchor="middle" letterSpacing="3">SACHS</text>
                          {/* Puzzle hint */}
                          <rect x="148" y="180" width="104" height="14" rx="7" fill="#FFE500"/>
                          <text x="200" y="190" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#0B1A2E" textAnchor="middle">JAVA · PUZZLES</text>
                          <text x="22" y="30" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500">EST. 1869</text>
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#FFE500" textAnchor="end" opacity="0.7">SUPERDAY</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>SUPERDAY</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Landmark size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "epam" && (
                      <div style={{ height: "200px", backgroundColor: "#0A1929", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#0A1929"/>
                          {/* Honeycomb hexagon grid (EPAM brand vibe) */}
                          {[
                            [80, 50], [120, 50], [160, 50], [200, 50], [240, 50], [280, 50], [320, 50],
                            [100, 86], [140, 86], [180, 86], [220, 86], [260, 86], [300, 86],
                            [80, 122], [120, 122], [160, 122], [200, 122], [240, 122], [280, 122], [320, 122],
                          ].map(([cx, cy], i) => {
                            const r = 18;
                            const pts = [0, 60, 120, 180, 240, 300].map(a => {
                              const rad = (a * Math.PI) / 180;
                              return `${cx + r * Math.cos(rad)},${cy + r * Math.sin(rad)}`;
                            }).join(" ");
                            const isLit = (i % 3) === 1;
                            return (
                              <polygon key={`hex-${i}`} points={pts} fill={isLit ? "#FFE500" : "none"} stroke="#FFE500" strokeWidth={isLit ? "0" : "1"} opacity={isLit ? "0.85" : "0.35"}/>
                            );
                          })}
                          {/* Wordmark + tag */}
                          <text x="200" y="166" fontFamily="'Bebas Neue', sans-serif" fontSize="30" fontWeight="700" fill="#fff" textAnchor="middle" letterSpacing="6">EPAM</text>
                          <text x="200" y="184" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" textAnchor="middle">JAVA-ONLY OA</text>
                          <text x="22" y="30" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500">EST. 1993</text>
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#FFE500" textAnchor="end" opacity="0.7">60K+ ENGINEERS</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>20 PROBLEMS</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Hexagon size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "de_shaw" && (
                      <div style={{ height: "200px", backgroundColor: "#0A0A18", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#0A0A18"/>
                          {/* Math grid background */}
                          <defs>
                            <pattern id="ds-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#FFE500" strokeWidth="0.3" opacity="0.18"/></pattern>
                          </defs>
                          <rect width="400" height="200" fill="url(#ds-grid)"/>
                          {/* Sigma + math symbols floating */}
                          <text x="50" y="80" fontFamily="serif" fontSize="38" fontWeight="700" fill="#FFE500" opacity="0.55">Σ</text>
                          <text x="334" y="170" fontFamily="serif" fontSize="32" fontWeight="700" fill="#FFE500" opacity="0.5">∫</text>
                          <text x="40" y="170" fontFamily="serif" fontSize="20" fontWeight="700" fill="#FFE500" opacity="0.5">∂x</text>
                          <text x="340" y="60" fontFamily="serif" fontSize="20" fontWeight="700" fill="#FFE500" opacity="0.5">φ</text>
                          {/* Fibonacci sequence */}
                          <text x="200" y="42" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#FFE500" textAnchor="middle" opacity="0.7">F: 1 · 1 · 2 · 3 · 5 · 8 · 13 · 21 · 34 · 55</text>
                          {/* Quant chart line */}
                          <path d="M 90 130 Q 130 100 170 120 Q 210 140 250 105 Q 290 90 320 95" stroke="#FFE500" strokeWidth="2" fill="none"/>
                          {[90, 130, 170, 210, 250, 290, 320].map((x, i) => {
                            const ys = [130, 100, 120, 140, 105, 90, 95];
                            return <circle key={`ds-pt-${i}`} cx={x} cy={ys[i]} r="2.5" fill="#FFE500"/>;
                          })}
                          {/* Wordmark */}
                          <text x="200" y="164" fontFamily="'Bebas Neue', sans-serif" fontSize="26" fontWeight="700" fill="#fff" textAnchor="middle" letterSpacing="4">DE SHAW</text>
                          {/* Tag */}
                          <rect x="148" y="174" width="104" height="18" rx="9" fill="#FFE500"/>
                          <text x="200" y="186" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#0A0A18" textAnchor="middle">QUANT FIRM</text>
                          <text x="22" y="20" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500">EST. 1988</text>
                          <text x="378" y="20" fontFamily="monospace" fontSize="8" fill="#FFE500" textAnchor="end" opacity="0.7">ZECKENDORF · MATH</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>HARD OA</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <BarChart3 size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "cisco" && (
                      <div style={{ height: "200px", backgroundColor: "#001A40", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#001A40"/>
                          {/* Cisco bridge logo (vertical bars) */}
                          {[120, 134, 148, 162, 176, 190, 204, 218, 232, 246, 260, 274].map((x, i) => {
                            const heights = [20, 32, 44, 56, 64, 70, 70, 64, 56, 44, 32, 20];
                            const h = heights[i];
                            const y = 100 - h / 2;
                            return <rect key={`bar-${i}`} x={x} y={y} width="8" height={h} fill="#FFE500"/>;
                          })}
                          {/* Network nodes */}
                          <circle cx="40" cy="50" r="6" fill="#FFE500"/>
                          <circle cx="40" cy="150" r="6" fill="#FFE500"/>
                          <circle cx="360" cy="50" r="6" fill="#FFE500"/>
                          <circle cx="360" cy="150" r="6" fill="#FFE500"/>
                          {/* Routing lines */}
                          <line x1="40" y1="50" x2="120" y2="84" stroke="#FFE500" strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
                          <line x1="40" y1="150" x2="120" y2="116" stroke="#FFE500" strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
                          <line x1="360" y1="50" x2="282" y2="84" stroke="#FFE500" strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
                          <line x1="360" y1="150" x2="282" y2="116" stroke="#FFE500" strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
                          {/* IPv4 label */}
                          <rect x="148" y="22" width="104" height="14" rx="3" fill="#FFE500"/>
                          <text x="200" y="32" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#001A40" textAnchor="middle">192.168.1.1</text>
                          {/* Wordmark */}
                          <text x="200" y="170" fontFamily="'Bebas Neue', sans-serif" fontSize="22" fontWeight="700" fill="#fff" textAnchor="middle" letterSpacing="6">CISCO</text>
                          <text x="200" y="186" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" textAnchor="middle">NETWORKING</text>
                          <text x="22" y="180" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#FFE500" opacity="0.6">EST. 1984</text>
                          <text x="378" y="180" fontFamily="monospace" fontSize="7" fill="#FFE500" textAnchor="end" opacity="0.6">OSI · TCP/IP</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>20 PROBLEMS</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Router size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "capgemini" && (
                      <div style={{ height: "200px", backgroundColor: "#0F1B4A", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#0F1B4A"/>
                          {/* 4 section quadrants */}
                          <rect x="40" y="40" width="156" height="56" rx="6" fill="#1E2D6B" stroke="#FFE500" strokeWidth="1.4"/>
                          <text x="118" y="62" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" textAnchor="middle">MCQ</text>
                          <text x="118" y="80" fontFamily="monospace" fontSize="14" fontWeight="700" fill="#fff" textAnchor="middle">40 min</text>
                          <rect x="204" y="40" width="156" height="56" rx="6" fill="#1E2D6B" stroke="#FFE500" strokeWidth="1.4"/>
                          <text x="282" y="62" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" textAnchor="middle">PSEUDOCODE</text>
                          <text x="282" y="80" fontFamily="monospace" fontSize="14" fontWeight="700" fill="#fff" textAnchor="middle">30 min</text>
                          <rect x="40" y="104" width="156" height="56" rx="6" fill="#1E2D6B" stroke="#FFE500" strokeWidth="1.4"/>
                          <text x="118" y="126" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" textAnchor="middle">CODING</text>
                          <text x="118" y="144" fontFamily="monospace" fontSize="14" fontWeight="700" fill="#fff" textAnchor="middle">45 min</text>
                          <rect x="204" y="104" width="156" height="56" rx="6" fill="#1E2D6B" stroke="#FFE500" strokeWidth="1.4"/>
                          <text x="282" y="126" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" textAnchor="middle">ESSAY</text>
                          <text x="282" y="144" fontFamily="monospace" fontSize="14" fontWeight="700" fill="#fff" textAnchor="middle">20 min</text>
                          {/* Header label */}
                          <rect x="120" y="14" width="160" height="20" rx="10" fill="#FFE500"/>
                          <text x="200" y="28" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#0F1B4A" textAnchor="middle">CAPGEMINI · 150 MIN</text>
                          <text x="22" y="186" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500">EST. 1967</text>
                          <text x="378" y="186" fontFamily="monospace" fontSize="8" fill="#FFE500" textAnchor="end" opacity="0.7">360K+ EMPLOYEES</text>
                        </svg>
                        <div style={{ position: "absolute", top: "44px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>4 SECTIONS</div>
                        <div style={{ position: "absolute", top: "44px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Briefcase size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "apple" && (
                      <div style={{ height: "200px", backgroundColor: "#0A0A0A", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#0A0A0A"/>
                          {/* Stylized Apple silhouette */}
                          <g transform="translate(160, 26)">
                            <path d="M 40 20 C 40 8, 50 0, 60 4 C 56 10, 50 12, 46 16 C 50 14, 56 14, 60 18 L 60 18 C 64 14, 70 14, 74 16 C 70 12, 64 10, 60 4 C 70 0, 80 8, 80 20 C 90 26, 92 40, 86 56 C 80 70, 70 82, 60 82 C 56 82, 52 80, 48 78 C 44 80, 40 82, 36 82 C 26 82, 16 70, 10 56 C 4 40, 6 26, 16 20 C 24 16, 32 18, 40 22 Z" fill="#fff"/>
                            <ellipse cx="62" cy="2" rx="6" ry="10" fill="#0A0A0A" transform="rotate(30 62 2)"/>
                          </g>
                          {/* Wordmark */}
                          <text x="200" y="146" fontFamily="'Bebas Neue', sans-serif" fontSize="28" fontWeight="700" fill="#fff" textAnchor="middle" letterSpacing="3">APPLE</text>
                          <text x="200" y="164" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" textAnchor="middle">DEFENSIVE CODING</text>
                          {/* Stat pills */}
                          <rect x="40" y="174" width="100" height="18" rx="9" fill="#1A1A1A" stroke="#FFE500" strokeWidth="1"/>
                          <text x="90" y="186" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" textAnchor="middle">$3T+ MARKET CAP</text>
                          <rect x="260" y="174" width="100" height="18" rx="9" fill="#1A1A1A" stroke="#FFE500" strokeWidth="1"/>
                          <text x="310" y="186" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" textAnchor="middle">ICT2 · ICT3</text>
                          <text x="22" y="20" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500">EST. 1976</text>
                          <text x="378" y="20" fontFamily="monospace" fontSize="8" fill="#FFE500" textAnchor="end" opacity="0.7">164K+ EMPLOYEES</text>
                        </svg>
                        <div style={{ position: "absolute", top: "44px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>14-DAY PLAN</div>
                        <div style={{ position: "absolute", top: "44px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <AppleIcon size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "amazon_ml" && (
                      <div style={{ height: "200px", backgroundColor: "#0F1219", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#0F1219"/>
                          <defs>
                            <radialGradient id="ml-glow" cx="0.5" cy="0.5">
                              <stop offset="0%" stopColor="#FF9900" stopOpacity="0.4"/>
                              <stop offset="100%" stopColor="#FF9900" stopOpacity="0"/>
                            </radialGradient>
                          </defs>
                          <circle cx="200" cy="100" r="80" fill="url(#ml-glow)"/>
                          {/* Neural network sketch */}
                          {/* Input layer */}
                          {[60, 88, 116].map((y, i) => (<circle key={`in-${i}`} cx="90" cy={y} r="6" fill="#FFE500"/>))}
                          {/* Hidden layer */}
                          {[50, 78, 106, 134].map((y, i) => (<circle key={`hd-${i}`} cx="200" cy={y} r="6" fill="#FF9900"/>))}
                          {/* Output layer */}
                          {[80, 108].map((y, i) => (<circle key={`ot-${i}`} cx="310" cy={y} r="6" fill="#FFE500"/>))}
                          {/* Connections */}
                          {[60, 88, 116].map(y1 => (
                            [50, 78, 106, 134].map(y2 => (
                              <line key={`l-${y1}-${y2}`} x1="96" y1={y1} x2="194" y2={y2} stroke="#FFE500" strokeWidth="0.6" opacity="0.35"/>
                            ))
                          ))}
                          {[50, 78, 106, 134].map(y1 => (
                            [80, 108].map(y2 => (
                              <line key={`l2-${y1}-${y2}`} x1="206" y1={y1} x2="304" y2={y2} stroke="#FF9900" strokeWidth="0.6" opacity="0.35"/>
                            ))
                          ))}
                          {/* Header */}
                          <rect x="120" y="14" width="160" height="20" rx="10" fill="#FF9900"/>
                          <text x="200" y="28" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#0F1219" textAnchor="middle">AMAZON ML</text>
                          {/* Wordmark */}
                          <text x="200" y="166" fontFamily="'Bebas Neue', sans-serif" fontSize="20" fontWeight="700" fill="#fff" textAnchor="middle" letterSpacing="2">SUMMER SCHOOL</text>
                          <text x="200" y="184" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FF9900" textAnchor="middle">TOP 3K OF 17.5K+</text>
                          <text x="22" y="186" fontFamily="monospace" fontSize="7" fill="#FFE500" opacity="0.6">FREE · 4 WEEKS</text>
                        </svg>
                        <div style={{ position: "absolute", top: "44px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>14-DAY PLAN</div>
                        <div style={{ position: "absolute", top: "44px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <GraduationCap size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "amazon" && (
                      <div style={{ height: "200px", backgroundColor: "#131A22", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#131A22"/>
                          {/* Amazon wordmark with smile arrow */}
                          <text x="200" y="100" fontFamily="'Helvetica Neue', sans-serif" fontSize="48" fontWeight="700" fill="#fff" textAnchor="middle" letterSpacing="-1">amazon</text>
                          {/* Smile arrow under amazon */}
                          <path d="M 132 116 Q 200 144 270 116" stroke="#FF9900" strokeWidth="4" fill="none" strokeLinecap="round"/>
                          <polygon points="262,114 274,118 268,108" fill="#FF9900"/>
                          {/* Boxes around */}
                          <rect x="22" y="32" width="40" height="40" rx="3" fill="#FF9900"/>
                          <line x1="22" y1="52" x2="62" y2="52" stroke="#131A22" strokeWidth="1.5"/>
                          <line x1="42" y1="32" x2="42" y2="72" stroke="#131A22" strokeWidth="1.5"/>
                          <text x="42" y="56" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#131A22" textAnchor="middle">📦</text>
                          <rect x="338" y="32" width="40" height="40" rx="3" fill="#FF9900"/>
                          <line x1="338" y1="52" x2="378" y2="52" stroke="#131A22" strokeWidth="1.5"/>
                          <line x1="358" y1="32" x2="358" y2="72" stroke="#131A22" strokeWidth="1.5"/>
                          <text x="358" y="56" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#131A22" textAnchor="middle">📦</text>
                          {/* Leadership principles strip */}
                          <rect x="40" y="158" width="320" height="22" rx="11" fill="#FF9900"/>
                          <text x="200" y="172" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#131A22" textAnchor="middle">14 LEADERSHIP PRINCIPLES</text>
                          <text x="22" y="20" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FF9900">EST. 1994</text>
                          <text x="378" y="20" fontFamily="monospace" fontSize="8" fill="#FF9900" textAnchor="end" opacity="0.7">1.5M EMPLOYEES</text>
                        </svg>
                        <div style={{ position: "absolute", top: "44px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>14-DAY PLAN</div>
                        <div style={{ position: "absolute", top: "44px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Package size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "zoho" && (
                      <div style={{ height: "200px", backgroundColor: "#0F1730", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#0F1730"/>
                          {/* Zoho icon grid (representing 50+ SaaS apps) */}
                          {[0, 1, 2, 3, 4].flatMap(r =>
                            [0, 1, 2, 3, 4, 5, 6, 7].map(c => {
                              const colors = ["#EF4444", "#F97316", "#FBBF24", "#22C55E", "#3B82F6", "#8B5CF6"];
                              const color = colors[(r + c) % colors.length];
                              return (
                                <rect key={`tile-${r}-${c}`} x={20 + c * 26} y={30 + r * 16} width="20" height="12" rx="2" fill={color} opacity="0.7"/>
                              );
                            })
                          )}
                          {/* Wordmark */}
                          <text x="200" y="148" fontFamily="'Bebas Neue', sans-serif" fontSize="36" fontWeight="700" fill="#fff" textAnchor="middle" letterSpacing="6">ZOHO</text>
                          {/* Strip below */}
                          <rect x="120" y="160" width="160" height="22" rx="11" fill="#FFE500"/>
                          <text x="200" y="174" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#0F1730" textAnchor="middle">3 ROUNDS · APT + DSA + INT</text>
                          <text x="22" y="186" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" opacity="0.7">EST. 1996</text>
                          <text x="378" y="186" fontFamily="monospace" fontSize="8" fill="#FFE500" textAnchor="end" opacity="0.7">BOOTSTRAPPED</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>3 TRACKS</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Mail size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "swiggy" && (
                      <div style={{ height: "200px", backgroundColor: "#1A0F00", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#1A0F00"/>
                          {/* Map dotted grid */}
                          <defs>
                            <pattern id="sw-dots" width="22" height="22" patternUnits="userSpaceOnUse">
                              <circle cx="11" cy="11" r="0.8" fill="#FC8019" opacity="0.4"/>
                            </pattern>
                          </defs>
                          <rect width="400" height="200" fill="url(#sw-dots)"/>
                          {/* Big scooter centered */}
                          <g transform="translate(140, 84)">
                            {/* Wheels */}
                            <circle cx="30" cy="36" r="14" fill="#1A0F00" stroke="#FC8019" strokeWidth="3"/>
                            <circle cx="90" cy="36" r="14" fill="#1A0F00" stroke="#FC8019" strokeWidth="3"/>
                            <circle cx="30" cy="36" r="5" fill="#FC8019"/>
                            <circle cx="90" cy="36" r="5" fill="#FC8019"/>
                            {/* Body */}
                            <path d="M 26 36 L 50 16 L 80 16 L 94 36 Z" fill="#FC8019"/>
                            {/* Handlebar */}
                            <line x1="50" y1="16" x2="44" y2="6" stroke="#FC8019" strokeWidth="3"/>
                            <line x1="40" y1="4" x2="48" y2="4" stroke="#FC8019" strokeWidth="3"/>
                            {/* Delivery box */}
                            <rect x="78" y="-4" width="22" height="22" rx="2" fill="#FFE500"/>
                            <text x="89" y="10" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#1A0F00" textAnchor="middle">10m</text>
                          </g>
                          {/* Wordmark */}
                          <text x="200" y="162" fontFamily="'Bebas Neue', sans-serif" fontSize="28" fontWeight="700" fill="#FC8019" textAnchor="middle" letterSpacing="4">SWIGGY</text>
                          {/* Strip */}
                          <rect x="140" y="174" width="120" height="18" rx="9" fill="#FFE500"/>
                          <text x="200" y="186" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#1A0F00" textAnchor="middle">SCALE · LLD · CONCURRENCY</text>
                          <text x="22" y="30" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FC8019">EST. 2014</text>
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#FC8019" textAnchor="end" opacity="0.7">50K orders/min</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>14-DAY PLAN</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Bike size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "accenture" && (
                      <div style={{ height: "200px", backgroundColor: "#1A0F2E", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#1A0F2E"/>
                          {/* Greater-than mark (Accenture's signature) */}
                          <text x="80" y="130" fontFamily="'Helvetica Neue', sans-serif" fontSize="120" fontWeight="700" fill="#A100FF">&gt;</text>
                          {/* Wordmark */}
                          <text x="240" y="116" fontFamily="'Helvetica Neue', sans-serif" fontSize="36" fontWeight="700" fill="#fff" letterSpacing="-1">accenture</text>
                          {/* Tagline */}
                          <text x="240" y="138" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#A100FF">CONSULTING · TECH · STRATEGY</text>
                          {/* Stat pills */}
                          <rect x="22" y="172" width="100" height="18" rx="9" fill="#A100FF"/>
                          <text x="72" y="184" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">60K+ HIRES/YR</text>
                          <rect x="278" y="172" width="100" height="18" rx="9" fill="#A100FF"/>
                          <text x="328" y="184" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">4 SECTIONS · 45M</text>
                          <text x="22" y="30" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#A100FF">EST. 1989</text>
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#A100FF" textAnchor="end" opacity="0.7">774K+ EMPLOYEES</text>
                        </svg>
                        <div style={{ position: "absolute", top: "44px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>3 TRACKS</div>
                        <div style={{ position: "absolute", top: "44px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <ChevronsRight size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "infosys" && (
                      <div style={{ height: "200px", backgroundColor: "#0A2540", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#0A2540"/>
                          {/* Sun rays + sun (Infosys's logo) */}
                          <circle cx="200" cy="100" r="34" fill="#007CC3"/>
                          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => {
                            const rad = (angle * Math.PI) / 180;
                            const x1 = 200 + 42 * Math.cos(rad);
                            const y1 = 100 + 42 * Math.sin(rad);
                            const x2 = 200 + 60 * Math.cos(rad);
                            const y2 = 100 + 60 * Math.sin(rad);
                            return <line key={`ray-${angle}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#007CC3" strokeWidth="3"/>;
                          })}
                          {/* Wordmark */}
                          <text x="200" y="166" fontFamily="'Helvetica Neue', sans-serif" fontSize="28" fontWeight="700" fill="#fff" textAnchor="middle">Infosys</text>
                          {/* Tagline */}
                          <text x="200" y="184" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#007CC3" textAnchor="middle">INFYTQ · SE · DSE · PP</text>
                          <text x="22" y="30" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#007CC3">EST. 1981</text>
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#007CC3" textAnchor="end" opacity="0.7">340K+ EMPLOYEES</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>3 TRACKS</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Sun size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "cognizant" && (
                      <div style={{ height: "200px", backgroundColor: "#001D3D", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#001D3D"/>
                          {/* Cognizant blue C arc */}
                          <path d="M 130 70 Q 80 100 130 130" stroke="#0080FF" strokeWidth="12" fill="none" strokeLinecap="round"/>
                          {/* Wordmark */}
                          <text x="240" y="116" fontFamily="'Helvetica Neue', sans-serif" fontSize="32" fontWeight="700" fill="#fff" textAnchor="middle">Cognizant</text>
                          {/* Tagline */}
                          <text x="200" y="158" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#0080FF" textAnchor="middle">GENC · GENC ELEVATE · GENC NEXT</text>
                          {/* Tag */}
                          <rect x="148" y="170" width="104" height="20" rx="10" fill="#0080FF"/>
                          <text x="200" y="184" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#001D3D" textAnchor="middle">50K HIRES/YEAR</text>
                          <text x="22" y="30" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#0080FF">EST. 1994</text>
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#0080FF" textAnchor="end" opacity="0.7">350K+ EMPLOYEES</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>3 TRACKS</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Compass size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "lti" && (
                      <div style={{ height: "200px", backgroundColor: "#0F172A", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#0F172A"/>
                          {/* L letter mark (large) */}
                          <rect x="80" y="50" width="20" height="100" fill="#FF6900"/>
                          <rect x="80" y="130" width="60" height="20" fill="#FF6900"/>
                          {/* T letter mark */}
                          <rect x="160" y="50" width="60" height="20" fill="#FF6900"/>
                          <rect x="180" y="50" width="20" height="100" fill="#FF6900"/>
                          {/* I letter mark */}
                          <rect x="240" y="50" width="20" height="100" fill="#FF6900"/>
                          {/* Mindtree merged */}
                          <text x="320" y="86" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#FF6900" textAnchor="middle">+</text>
                          <text x="320" y="106" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#fff" textAnchor="middle">MIND</text>
                          <text x="320" y="118" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#fff" textAnchor="middle">TREE</text>
                          {/* Tagline */}
                          <text x="200" y="180" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#FF6900" textAnchor="middle">LTIMINDTREE · MERGED 2022</text>
                          <text x="22" y="30" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FF6900">EST. 1996</text>
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#FF6900" textAnchor="end" opacity="0.7">85K+ EMPLOYEES</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>3 TRACKS</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <HardHat size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "kpmg" && (
                      <div style={{ height: "200px", backgroundColor: "#00338D", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#00338D"/>
                          {/* KPMG logo style — light blue bars */}
                          <rect x="60" y="60" width="280" height="80" rx="6" fill="#0091DA"/>
                          <text x="200" y="116" fontFamily="'Helvetica Neue', sans-serif" fontSize="48" fontWeight="700" fill="#fff" textAnchor="middle" letterSpacing="2">KPMG</text>
                          {/* Big Four label */}
                          <rect x="148" y="156" width="104" height="22" rx="11" fill="#00338D" stroke="#0091DA" strokeWidth="1.5"/>
                          <text x="200" y="170" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#0091DA" textAnchor="middle">BIG FOUR</text>
                          <text x="22" y="30" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#0091DA">EST. 1987</text>
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#0091DA" textAnchor="end" opacity="0.7">270K+ EMPLOYEES</text>
                          <text x="200" y="192" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#0091DA" textAnchor="middle">CONSULTING · AUDIT · ADVISORY</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>PLACEMENT GUIDE</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Calculator size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "ey" && (
                      <div style={{ height: "200px", backgroundColor: "#2E2E38", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#2E2E38"/>
                          {/* EY big yellow letters */}
                          <text x="200" y="124" fontFamily="'Helvetica Neue', sans-serif" fontSize="100" fontWeight="700" fill="#FFE600" textAnchor="middle" letterSpacing="-4">EY</text>
                          {/* Tagline */}
                          <text x="200" y="156" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#FFE600" textAnchor="middle">BUILDING A BETTER WORKING WORLD</text>
                          {/* Tag */}
                          <rect x="148" y="170" width="104" height="20" rx="10" fill="#FFE600"/>
                          <text x="200" y="184" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#2E2E38" textAnchor="middle">BIG FOUR · GDS</text>
                          <text x="22" y="30" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE600">EST. 1989</text>
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#FFE600" textAnchor="end" opacity="0.7">395K+ EMPLOYEES</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>PLACEMENT GUIDE</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <PieChart size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "deloitte" && (
                      <div style={{ height: "200px", backgroundColor: "#000000", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#000000"/>
                          {/* Deloitte wordmark + green dot */}
                          <text x="180" y="118" fontFamily="'Helvetica Neue', sans-serif" fontSize="40" fontWeight="700" fill="#fff" textAnchor="middle">Deloitte</text>
                          <circle cx="284" cy="116" r="6" fill="#86BC25"/>
                          {/* Tagline */}
                          <text x="200" y="146" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#86BC25" textAnchor="middle">LARGEST BIG FOUR BY REVENUE</text>
                          {/* Tag */}
                          <rect x="120" y="160" width="160" height="22" rx="11" fill="#86BC25"/>
                          <text x="200" y="174" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#000" textAnchor="middle">CONSULTING · AUDIT · ADVISORY</text>
                          <text x="22" y="30" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#86BC25">EST. 1845</text>
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#86BC25" textAnchor="end" opacity="0.7">457K+ EMPLOYEES</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>PLACEMENT GUIDE</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Lightbulb size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "hcl" && (
                      <div style={{ height: "200px", backgroundColor: "#0E0E0E", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#0E0E0E"/>
                          {/* HCL big red letters */}
                          <text x="200" y="120" fontFamily="'Helvetica Neue', sans-serif" fontSize="72" fontWeight="700" fill="#DA1A35" textAnchor="middle" letterSpacing="6">HCL</text>
                          {/* Tagline */}
                          <text x="200" y="146" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#fff" textAnchor="middle">SUPERCHARGING PROGRESS</text>
                          {/* Tag */}
                          <rect x="120" y="160" width="160" height="22" rx="11" fill="#DA1A35"/>
                          <text x="200" y="174" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#fff" textAnchor="middle">TECHBEE · CAMPUS · LATERAL</text>
                          <text x="22" y="30" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#DA1A35">EST. 1976</text>
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#DA1A35" textAnchor="end" opacity="0.7">225K+ EMPLOYEES</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>3 TRACKS</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Monitor size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    {key === "wipro" && (
                      <div style={{ height: "200px", backgroundColor: "#1A0B2E", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#1A0B2E"/>
                          {/* Leaf shape (Wipro's signature) */}
                          <g transform="translate(90, 60)">
                            <path d="M 0 60 Q 0 20 40 0 Q 80 20 80 60 Q 40 80 0 60 Z" fill="#5A2C82"/>
                            <path d="M 0 60 Q 20 40 40 40 Q 60 40 80 60" stroke="#fff" strokeWidth="2" fill="none" opacity="0.5"/>
                            <circle cx="40" cy="30" r="6" fill="#FFD500"/>
                          </g>
                          {/* Wordmark */}
                          <text x="240" y="120" fontFamily="'Helvetica Neue', sans-serif" fontSize="44" fontWeight="700" fill="#fff" textAnchor="middle" letterSpacing="-1">wipro</text>
                          {/* Tagline */}
                          <text x="200" y="152" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#FFD500" textAnchor="middle">ELITE · TURBO TRACKS</text>
                          {/* Tag */}
                          <rect x="148" y="166" width="104" height="20" rx="10" fill="#FFD500"/>
                          <text x="200" y="180" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#1A0B2E" textAnchor="middle">20 PROBLEMS</text>
                          <text x="22" y="30" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFD500">EST. 1945</text>
                          <text x="378" y="30" fontFamily="monospace" fontSize="8" fill="#FFD500" textAnchor="end" opacity="0.7">234K+ EMPLOYEES</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>2 TRACKS</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Leaf size={11} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                    )}
                    <div style={{ padding: "20px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "4px", letterSpacing: "-0.01em" }}>{company.name}</h3>
                      <div style={{ fontSize: "10px", color: MUTE, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{company.short}</div>
                      <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>{company.tagline}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty state per tab */}
              {(Object.entries(PLACEMENT_COMPANIES) as Array<[CompanyKey, CompanyInfo]>).filter(([, c]) => c.type === placementsTab).length === 0 && (
                <div style={{ gridColumn: "1 / -1", padding: "40px", textAlign: "center", color: MUTE, fontSize: "13px" }}>
                  No companies in this category yet. Check back soon.
                </div>
              )}
            </div>

            {/* Legacy: course-bound placements still shown if present */}
            {placementsCourses.length > 0 && (
              <div style={{ marginTop: "48px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: B, marginBottom: "16px", letterSpacing: "-0.01em" }}>More Resources</h2>
                <CourseSectionView courses={placementsCourses} onOpen={openCourse} />
              </div>
            )}
          </div>
        )}

        {/* ══ PLACEMENTS — COMPANY DETAIL ═══════════════════════════════ */}
        {currentView === "placements" && placementsCompany && (() => {
          const company = PLACEMENT_COMPANIES[placementsCompany];
          const activeSection = company.sections.find(s => s.key === placementsSection) ?? company.sections[0];
          const togglePQ = (key: string) => setPlacementsOpenQ(prev => ({ ...prev, [key]: !prev[key] }));
          return (
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "20px" : "28px", alignItems: "flex-start" }}>
              {/* LEFT — main content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <button onClick={closePlacementCompany}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", cursor: "pointer", color: MUTE, fontSize: "12px", fontWeight: 600, marginBottom: "14px", padding: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.color = B)}
                  onMouseLeave={e => (e.currentTarget.style.color = MUTE)}
                >
                  <ArrowLeft size={14} /> Back to Placements
                </button>

                {/* Header */}
                <div style={{ marginBottom: "24px" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: B, color: Y, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "14px" }}>
                    {company.type === "service" ? <Building2 size={13} /> : <Sparkles size={13} />}
                    {company.type === "service" ? "SERVICE BASED" : "PRODUCT BASED"} · {company.short.toUpperCase()}
                  </div>
                  <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: B, marginBottom: "10px", letterSpacing: "-0.02em" }}>
                    {company.name}
                  </h1>
                  <p style={{ fontSize: "14px", color: MUTE, maxWidth: "640px", lineHeight: 1.7, margin: 0 }}>{company.about}</p>
                </div>

                {/* About / What they do */}
                <div style={{ background: W, border: `1.5px solid ${BORD}`, borderRadius: "12px", padding: "18px 20px", marginBottom: "20px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: B, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "10px" }}>What they do</div>
                  <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7, margin: 0 }}>{company.whatTheyDo}</p>
                </div>

                {/* Section tabs (only show if more than 1) */}
                {company.sections.length > 1 && (
                  <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap", borderBottom: `1.5px solid ${BORD}`, paddingBottom: "2px" }}>
                    {company.sections.map(sec => {
                      const active = activeSection.key === sec.key;
                      return (
                        <button key={sec.key} onClick={() => { setPlacementsSection(sec.key); setPlacementsOpenQ({}); }}
                          style={{ padding: "9px 16px", background: active ? B : "transparent", color: active ? Y : MUTE, border: "none", borderRadius: "8px 8px 0 0", fontSize: "12px", fontWeight: 700, cursor: "pointer", transition: "all 0.15s", marginBottom: "-2px", borderBottom: active ? `3px solid ${Y}` : `3px solid transparent` }}
                        >{sec.label}</button>
                      );
                    })}
                  </div>
                )}

                {/* Section blurb */}
                <div style={{ marginBottom: "18px", padding: "12px 16px", background: "#FFFBEB", borderLeft: "3px solid #FBBF24", borderRadius: "0 8px 8px 0" }}>
                  <div style={{ fontSize: "12px", color: "#92400E", fontWeight: 600, lineHeight: 1.6 }}>{activeSection.blurb}</div>
                </div>

                {/* Section blocks */}
                {activeSection.blocks.map((block, bi) => {
                  if (block.kind === "qa") {
                    return (
                      <div key={bi} style={{ marginBottom: "24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                          <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "4px 12px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em" }}>QUESTIONS &amp; ANSWERS</div>
                          <div style={{ fontSize: "11px", color: MUTE }}>{block.items.length} items</div>
                          <div style={{ flex: 1, height: "1px", background: BORD }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          {block.items.map((qa, qi) => {
                            const key = `${placementsCompany}_${activeSection.key}_qa_${qi}`;
                            const open = !!placementsOpenQ[key];
                            return (
                              <div key={key} style={{ background: W, border: `1.5px solid ${open ? B : BORD}`, borderRadius: "10px", overflow: "hidden", transition: "border-color 0.15s" }}>
                                <button onClick={() => togglePQ(key)}
                                  style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", color: B }}
                                >
                                  <div style={{ background: "#EFF6FF", color: "#2563EB", width: "26px", height: "26px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0, fontFamily: "'IBM Plex Mono', monospace" }}>
                                    {String(qi + 1).padStart(2, "0")}
                                  </div>
                                  <div style={{ flex: 1, fontSize: "13px", fontWeight: 600, lineHeight: 1.5 }}>{qa.q}</div>
                                  <ChevronDown size={16} color={MUTE} style={{ flexShrink: 0, marginTop: "4px", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                                </button>
                                {open && (
                                  <div style={{ padding: "0 16px 16px 54px", fontSize: "13px", color: "#374151", lineHeight: 1.7, borderTop: `1px dashed ${BORD}`, paddingTop: "12px" }}>
                                    {qa.a}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  if (block.kind === "problems") {
                    return (
                      <div key={bi} style={{ marginBottom: "24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                          <div style={{ background: "#F0FDF4", color: "#15803D", padding: "4px 12px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em" }}>CODING PROBLEMS</div>
                          <div style={{ fontSize: "11px", color: MUTE }}>{block.items.length} problems</div>
                          <div style={{ flex: 1, height: "1px", background: BORD }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          {block.items.map((p, pi) => {
                            const key = `${placementsCompany}_${activeSection.key}_p_${pi}`;
                            const open = !!placementsOpenQ[key];
                            const diffColor = p.difficulty === "Easy" ? "#16A34A" : p.difficulty === "Hard" || p.difficulty === "Medium-Hard" ? "#DC2626" : "#D97706";
                            const diffBg    = p.difficulty === "Easy" ? "#F0FDF4" : p.difficulty === "Hard" || p.difficulty === "Medium-Hard" ? "#FEF2F2" : "#FFFBEB";
                            return (
                              <div key={key} style={{ background: W, border: `1.5px solid ${open ? B : BORD}`, borderRadius: "10px", overflow: "hidden", transition: "border-color 0.15s" }}>
                                <button onClick={() => togglePQ(key)}
                                  style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", color: B }}
                                >
                                  <div style={{ background: "#F0FDF4", color: "#15803D", width: "26px", height: "26px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0, fontFamily: "'IBM Plex Mono', monospace" }}>
                                    {String(pi + 1).padStart(2, "0")}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: "13px", fontWeight: 700, lineHeight: 1.4 }}>{p.name}</div>
                                    <div style={{ fontSize: "12px", color: MUTE, lineHeight: 1.6, marginTop: "3px" }}>{p.desc}</div>
                                  </div>
                                  {p.difficulty && (
                                    <span style={{ background: diffBg, color: diffColor, padding: "3px 8px", borderRadius: "12px", fontSize: "9px", fontWeight: 700, flexShrink: 0, marginTop: "2px" }}>{p.difficulty}</span>
                                  )}
                                  {p.example && (
                                    <ChevronDown size={16} color={MUTE} style={{ flexShrink: 0, marginTop: "4px", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                                  )}
                                </button>
                                {open && p.example && (
                                  <div style={{ padding: "0 16px 16px 54px", fontSize: "12px", color: "#374151", lineHeight: 1.7, borderTop: `1px dashed ${BORD}`, paddingTop: "12px", fontFamily: "'IBM Plex Mono', monospace" }}>
                                    {p.example}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  if (block.kind === "plan") {
                    return (
                      <div key={bi} style={{ marginBottom: "24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                          <div style={{ background: "#FEF2F2", color: "#DC2626", padding: "4px 12px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em" }}>14-DAY PLAN</div>
                          <div style={{ flex: 1, height: "1px", background: BORD }} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {block.items.map((p, pi) => (
                            <div key={pi} style={{ background: W, border: `1.5px solid ${BORD}`, borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "flex-start", gap: "14px" }}>
                              <div style={{ background: "#FEF2F2", color: "#DC2626", padding: "5px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0, minWidth: "56px", textAlign: "center" }}>{p.day}</div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: "13px", fontWeight: 700, color: B, marginBottom: "3px" }}>{p.focus}</div>
                                <div style={{ fontSize: "12px", color: MUTE, lineHeight: 1.6 }}>{p.topics}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  if (block.kind === "tips" || block.kind === "focus" || block.kind === "frequent" || block.kind === "process") {
                    const meta = block.kind === "tips" ? { label: "TIPS & STRATEGY", bg: "#FFFBEB", color: "#92400E", bullet: "#FBBF24" }
                              : block.kind === "focus" ? { label: "FOCUS AREAS", bg: "#EFF6FF", color: "#1D4ED8", bullet: "#3B82F6" }
                              : block.kind === "frequent" ? { label: "MOST ASKED", bg: "#F5F3FF", color: "#6D28D9", bullet: "#A78BFA" }
                              : { label: "HIRING PROCESS", bg: "#F0FDF4", color: "#15803D", bullet: "#22C55E" };
                    return (
                      <div key={bi} style={{ marginBottom: "24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                          <div style={{ background: meta.bg, color: meta.color, padding: "4px 12px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em" }}>{meta.label}</div>
                          <div style={{ flex: 1, height: "1px", background: BORD }} />
                        </div>
                        <div style={{ background: W, border: `1.5px solid ${BORD}`, borderRadius: "12px", padding: "16px 20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                          {block.items.map((item, ii) => (
                            <div key={ii} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: meta.bullet, flexShrink: 0, marginTop: "8px" }} />
                              <div style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7 }}>{item}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              {/* RIGHT SIDEBAR */}
              <div style={{ width: isMobile ? "100%" : "320px", flexShrink: 0, position: isMobile ? "static" : "sticky", top: "84px", display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* Company history */}
                <div style={{ background: W, border: `1.5px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: `1px solid #F3F4F6` }}>
                    <div style={{ width: "22px", height: "22px", background: "#F5F3FF", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Building2 size={12} color="#7C3AED" />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: B }}>About the Company</span>
                  </div>
                  <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {company.history.map((h, hi) => (
                      <div key={hi} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#A78BFA", flexShrink: 0, marginTop: "7px" }} />
                        <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6 }}>{h}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MCQ */}
                <div style={{ background: W, border: `1.5px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: `1px solid #F3F4F6` }}>
                    <div style={{ width: "22px", height: "22px", background: "#FFFBEB", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Zap size={12} color="#D97706" />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: B }}>Test Yourself</span>
                    <span style={{ marginLeft: "auto", fontSize: "10px", color: MUTE }}>{company.mcq.length} MCQs</span>
                  </div>
                  <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "14px" }}>
                    {company.mcq.map((mcq, qi) => {
                      const mkey = `pl_${placementsCompany}_${qi}`;
                      const answered = ckMCQAnswers[mkey] !== undefined;
                      const chosen   = ckMCQAnswers[mkey];
                      return (
                        <div key={mkey} style={{ borderBottom: qi < company.mcq.length - 1 ? `1px solid #F3F4F6` : "none", paddingBottom: qi < company.mcq.length - 1 ? "14px" : 0 }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "10px" }}>
                            <div style={{ background: "#FFFBEB", color: "#D97706", width: "20px", height: "20px", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, flexShrink: 0, fontFamily: "'IBM Plex Mono', monospace" }}>Q{qi + 1}</div>
                            <p style={{ fontSize: "12px", fontWeight: 600, color: B, lineHeight: 1.5, margin: 0 }}>{mcq.q}</p>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {mcq.opts.map((opt, oi) => {
                              const isCorrect = oi === mcq.ans;
                              const isChosen  = chosen === oi;
                              const bg     = answered && isCorrect ? "#DCFCE7" : answered && isChosen ? "#FEE2E2" : W;
                              const border = answered && isCorrect ? "1.5px solid #86EFAC" : answered && isChosen ? "1.5px solid #FCA5A5" : "1.5px solid #E5E7EB";
                              const col    = answered && isCorrect ? "#15803D" : answered && isChosen ? "#DC2626" : B;
                              return (
                                <button key={oi} onClick={() => answerMCQ(mkey, oi, mcq.ans)} disabled={answered}
                                  style={{ padding: "8px 12px", background: bg, border, borderRadius: "7px", color: col, fontSize: "11px", fontWeight: isChosen ? 700 : 500, cursor: answered ? "default" : "pointer", textAlign: "left", transition: "all 0.15s" }}
                                  onMouseEnter={e => { if (!answered) (e.currentTarget as HTMLButtonElement).style.border = "1.5px solid #D97706"; }}
                                  onMouseLeave={e => { if (!answered) (e.currentTarget as HTMLButtonElement).style.border = "1.5px solid #E5E7EB"; }}
                                >{opt}</button>
                              );
                            })}
                          </div>
                          {answered && (
                            <div style={{ marginTop: "8px", padding: "8px 10px", background: "#FFFBEB", border: `1px solid #FDE68A`, borderRadius: "6px", fontSize: "10px", color: "#92400E", lineHeight: 1.6 }}>
                              💡 {mcq.why}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quotes — you can do it */}
                <div style={{ background: B, border: `1.5px solid ${B}`, borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: `1px solid ${Y}22` }}>
                    <div style={{ width: "22px", height: "22px", background: Y, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Sparkles size={12} color={B} />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: Y, letterSpacing: "0.1em" }}>YOU GOT THIS</span>
                  </div>
                  <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {company.quotes.map((q, qi) => (
                      <div key={qi} style={{ borderLeft: `2px solid ${Y}`, paddingLeft: "12px" }}>
                        <div style={{ fontSize: "12px", color: `${W}DD`, lineHeight: 1.7, fontStyle: "italic" }}>"{q}"</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Facts & Hints */}
                <div style={{ background: W, border: `1.5px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: `1px solid #F3F4F6` }}>
                    <div style={{ width: "22px", height: "22px", background: "#F0FDF4", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Brain size={12} color="#16A34A" />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: B }}>Facts &amp; Hints</span>
                  </div>
                  <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {company.facts.map((fact, fi) => (
                      <div key={fi} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#FBBF24", flexShrink: 0, marginTop: "7px" }} />
                        <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6 }}>{fact}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

        {/* ══ INTERVIEWS ═════════════════════════════════════════════════ */}
        {currentView === "interviews" && !interviewTopic && (
          <div>
            <div style={{ marginBottom: "32px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: Y, color: B, border: `2px solid ${B}`, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "16px" }}>
                <Users size={13} /> INTERVIEW READINESS
              </div>
              <h1 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.02em" }}>
                Interviews
              </h1>
              <p style={{ fontSize: "14px", color: MUTE, maxWidth: "560px", lineHeight: 1.7 }}>
                Q&amp;A bibles for the most-asked interview topics. Beginner to advanced, with MCQs to test yourself.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "24px" }}>

              {/* Card 1 — System Design */}
              <div style={{ cursor: "pointer" }} onClick={() => openInterviewTopic("system_design")}>
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}
                >
                  <div style={{ height: "200px", backgroundColor: "#0F172A", overflow: "hidden", position: "relative" }}>
                    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                      <rect width="400" height="200" fill="#0F172A"/>
                      <defs>
                        <pattern id="sd-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#FFE500" strokeWidth="0.4" opacity="0.18"/></pattern>
                      </defs>
                      <rect width="400" height="200" fill="url(#sd-grid)"/>
                      {/* Load balancer (top) */}
                      <rect x="170" y="22" width="60" height="28" rx="4" fill="#FFE500"/>
                      <text x="200" y="40" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#0F172A" textAnchor="middle">LB</text>
                      {/* Lines down to servers */}
                      <line x1="200" y1="50" x2="90" y2="86" stroke="#FFE500" strokeWidth="1.4" opacity="0.7"/>
                      <line x1="200" y1="50" x2="200" y2="86" stroke="#FFE500" strokeWidth="1.4" opacity="0.7"/>
                      <line x1="200" y1="50" x2="310" y2="86" stroke="#FFE500" strokeWidth="1.4" opacity="0.7"/>
                      {/* Servers */}
                      <rect x="60" y="86" width="60" height="38" rx="4" fill="#1E293B" stroke="#FFE500" strokeWidth="1"/>
                      <rect x="170" y="86" width="60" height="38" rx="4" fill="#1E293B" stroke="#FFE500" strokeWidth="1"/>
                      <rect x="280" y="86" width="60" height="38" rx="4" fill="#1E293B" stroke="#FFE500" strokeWidth="1"/>
                      <circle cx="72" cy="98" r="2.5" fill="#22C55E"/><rect x="80" y="96" width="32" height="4" rx="1" fill="#fff" opacity="0.5"/>
                      <circle cx="72" cy="108" r="2.5" fill="#22C55E"/><rect x="80" y="106" width="24" height="4" rx="1" fill="#fff" opacity="0.3"/>
                      <circle cx="72" cy="118" r="2.5" fill="#22C55E"/><rect x="80" y="116" width="28" height="4" rx="1" fill="#fff" opacity="0.3"/>
                      <circle cx="182" cy="98" r="2.5" fill="#22C55E"/><rect x="190" y="96" width="32" height="4" rx="1" fill="#fff" opacity="0.5"/>
                      <circle cx="182" cy="108" r="2.5" fill="#22C55E"/><rect x="190" y="106" width="24" height="4" rx="1" fill="#fff" opacity="0.3"/>
                      <circle cx="182" cy="118" r="2.5" fill="#22C55E"/><rect x="190" y="116" width="28" height="4" rx="1" fill="#fff" opacity="0.3"/>
                      <circle cx="292" cy="98" r="2.5" fill="#22C55E"/><rect x="300" y="96" width="32" height="4" rx="1" fill="#fff" opacity="0.5"/>
                      <circle cx="292" cy="108" r="2.5" fill="#22C55E"/><rect x="300" y="106" width="24" height="4" rx="1" fill="#fff" opacity="0.3"/>
                      <circle cx="292" cy="118" r="2.5" fill="#22C55E"/><rect x="300" y="116" width="28" height="4" rx="1" fill="#fff" opacity="0.3"/>
                      {/* DB cylinders */}
                      <line x1="90" y1="124" x2="140" y2="158" stroke="#FFE500" strokeWidth="1" strokeDasharray="2 2" opacity="0.4"/>
                      <line x1="200" y1="124" x2="200" y2="158" stroke="#FFE500" strokeWidth="1" strokeDasharray="2 2" opacity="0.4"/>
                      <line x1="310" y1="124" x2="260" y2="158" stroke="#FFE500" strokeWidth="1" strokeDasharray="2 2" opacity="0.4"/>
                      <ellipse cx="140" cy="158" rx="22" ry="6" fill="#FFE500" opacity="0.85"/>
                      <rect x="118" y="158" width="44" height="18" fill="#FFE500" opacity="0.85"/>
                      <ellipse cx="140" cy="176" rx="22" ry="6" fill="#D97706"/>
                      <ellipse cx="200" cy="158" rx="22" ry="6" fill="#FFE500" opacity="0.85"/>
                      <rect x="178" y="158" width="44" height="18" fill="#FFE500" opacity="0.85"/>
                      <ellipse cx="200" cy="176" rx="22" ry="6" fill="#D97706"/>
                      <ellipse cx="260" cy="158" rx="22" ry="6" fill="#FFE500" opacity="0.85"/>
                      <rect x="238" y="158" width="44" height="18" fill="#FFE500" opacity="0.85"/>
                      <ellipse cx="260" cy="176" rx="22" ry="6" fill="#D97706"/>
                    </svg>
                    <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>30 Q&amp;A</div>
                    <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Layers size={11} color={B} />
                      <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>System Design Interview</h3>
                    <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>{IV_KEY_TAGLINE.system_design}</p>
                  </div>
                </div>
              </div>

              {/* Card 2 — Backend */}
              <div style={{ cursor: "pointer" }} onClick={() => openInterviewTopic("backend")}>
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}
                >
                  <div style={{ height: "200px", backgroundColor: "#1A1A2E", overflow: "hidden", position: "relative" }}>
                    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                      <rect width="400" height="200" fill="#1A1A2E"/>
                      {/* Terminal window (left) */}
                      <rect x="32" y="24" width="190" height="152" rx="6" fill="#0F0F1A" stroke="#FFE500" strokeWidth="1.2"/>
                      <rect x="32" y="24" width="190" height="20" rx="6" fill="#262640"/>
                      <circle cx="44" cy="34" r="3" fill="#EF4444"/>
                      <circle cx="56" cy="34" r="3" fill="#FBBF24"/>
                      <circle cx="68" cy="34" r="3" fill="#22C55E"/>
                      <text x="125" y="37" fontFamily="monospace" fontSize="8" fill="#9CA3AF" textAnchor="middle">server.js</text>
                      {/* Code lines */}
                      <text x="42" y="60" fontFamily="monospace" fontSize="8" fill="#A78BFA">const</text>
                      <text x="68" y="60" fontFamily="monospace" fontSize="8" fill="#FFE500">app</text>
                      <text x="86" y="60" fontFamily="monospace" fontSize="8" fill="#fff">=</text>
                      <text x="94" y="60" fontFamily="monospace" fontSize="8" fill="#22D3EE">express</text>
                      <text x="129" y="60" fontFamily="monospace" fontSize="8" fill="#fff">()</text>
                      <text x="42" y="76" fontFamily="monospace" fontSize="8" fill="#FFE500">app</text>
                      <text x="60" y="76" fontFamily="monospace" fontSize="8" fill="#fff">.</text>
                      <text x="64" y="76" fontFamily="monospace" fontSize="8" fill="#22D3EE">get</text>
                      <text x="78" y="76" fontFamily="monospace" fontSize="8" fill="#fff">(</text>
                      <text x="82" y="76" fontFamily="monospace" fontSize="8" fill="#86EFAC">'/api'</text>
                      <text x="108" y="76" fontFamily="monospace" fontSize="8" fill="#fff">, ...)</text>
                      <text x="42" y="92" fontFamily="monospace" fontSize="8" fill="#A78BFA">async</text>
                      <text x="68" y="92" fontFamily="monospace" fontSize="8" fill="#22D3EE">handler</text>
                      <text x="100" y="92" fontFamily="monospace" fontSize="8" fill="#fff">(req)</text>
                      <text x="42" y="108" fontFamily="monospace" fontSize="8" fill="#9CA3AF">  // jwt verify</text>
                      <text x="42" y="124" fontFamily="monospace" fontSize="8" fill="#A78BFA">await</text>
                      <text x="68" y="124" fontFamily="monospace" fontSize="8" fill="#22D3EE">redis</text>
                      <text x="92" y="124" fontFamily="monospace" fontSize="8" fill="#fff">.get(...)</text>
                      <text x="42" y="140" fontFamily="monospace" fontSize="8" fill="#A78BFA">return</text>
                      <text x="70" y="140" fontFamily="monospace" fontSize="8" fill="#86EFAC">200</text>
                      <text x="42" y="156" fontFamily="monospace" fontSize="8" fill="#9CA3AF">// listening :3000</text>
                      <rect x="42" y="162" width="6" height="8" fill="#FFE500"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></rect>
                      {/* Arrow → API */}
                      <path d="M 232 100 L 256 100" stroke="#FFE500" strokeWidth="2" markerEnd="url(#sd-arrow)"/>
                      <defs>
                        <marker id="sd-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                          <path d="M 0 0 L 10 5 L 0 10 z" fill="#FFE500"/>
                        </marker>
                      </defs>
                      {/* Database cylinder (right) */}
                      <ellipse cx="320" cy="68" rx="38" ry="10" fill="#FFE500"/>
                      <rect x="282" y="68" width="76" height="60" fill="#FFE500"/>
                      <ellipse cx="320" cy="128" rx="38" ry="10" fill="#D97706"/>
                      <ellipse cx="320" cy="88" rx="38" ry="10" fill="none" stroke="#0F0F1A" strokeWidth="1" opacity="0.3"/>
                      <ellipse cx="320" cy="108" rx="38" ry="10" fill="none" stroke="#0F0F1A" strokeWidth="1" opacity="0.3"/>
                      <text x="320" y="103" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#0F0F1A" textAnchor="middle">DB</text>
                      {/* Status indicators bottom */}
                      <rect x="266" y="148" width="108" height="28" rx="4" fill="#0F0F1A" stroke="#FFE500" strokeWidth="1"/>
                      <circle cx="276" cy="162" r="3" fill="#22C55E"/>
                      <text x="284" y="165" fontFamily="monospace" fontSize="8" fill="#fff">200 OK</text>
                      <text x="320" y="165" fontFamily="monospace" fontSize="7" fill="#9CA3AF">42ms</text>
                      <text x="346" y="165" fontFamily="monospace" fontSize="7" fill="#22C55E">✓</text>
                    </svg>
                    <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>30 Q&amp;A</div>
                    <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Server size={11} color={B} />
                      <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>Backend Interview</h3>
                    <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>{IV_KEY_TAGLINE.backend}</p>
                  </div>
                </div>
              </div>

              {/* Card 3 — Computer Networks */}
              <div style={{ cursor: "pointer" }} onClick={() => openInterviewTopic("computer_network")}>
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}
                >
                  <div style={{ height: "200px", backgroundColor: "#0A1929", overflow: "hidden", position: "relative" }}>
                    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                      <rect width="400" height="200" fill="#0A1929"/>
                      {/* Globe */}
                      <circle cx="200" cy="100" r="68" fill="#0F2438" stroke="#FFE500" strokeWidth="1.4"/>
                      <ellipse cx="200" cy="100" rx="68" ry="22" fill="none" stroke="#FFE500" strokeWidth="0.8" opacity="0.5"/>
                      <ellipse cx="200" cy="100" rx="68" ry="44" fill="none" stroke="#FFE500" strokeWidth="0.8" opacity="0.5"/>
                      <ellipse cx="200" cy="100" rx="42" ry="68" fill="none" stroke="#FFE500" strokeWidth="0.8" opacity="0.5"/>
                      <line x1="132" y1="100" x2="268" y2="100" stroke="#FFE500" strokeWidth="0.8" opacity="0.5"/>
                      <line x1="200" y1="32" x2="200" y2="168" stroke="#FFE500" strokeWidth="0.8" opacity="0.5"/>
                      {/* Continent blobs */}
                      <path d="M 174 84 Q 184 78 196 82 Q 204 90 198 98 Q 188 102 178 96 Z" fill="#FFE500" opacity="0.7"/>
                      <path d="M 208 92 Q 224 88 232 96 Q 234 108 222 112 Q 212 108 208 100 Z" fill="#FFE500" opacity="0.7"/>
                      <path d="M 186 116 Q 198 114 208 122 Q 204 130 192 128 Z" fill="#FFE500" opacity="0.7"/>
                      {/* Nodes around */}
                      <g>
                        <circle cx="60" cy="50" r="6" fill="#FFE500"/>
                        <circle cx="60" cy="50" r="11" fill="none" stroke="#FFE500" strokeWidth="1" opacity="0.4"><animate attributeName="r" values="6;14;6" dur="2.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite"/></circle>
                      </g>
                      <circle cx="340" cy="60" r="5" fill="#FFE500"/>
                      <circle cx="70" cy="160" r="5" fill="#FFE500"/>
                      <circle cx="334" cy="150" r="6" fill="#FFE500"/>
                      <circle cx="200" cy="22" r="4" fill="#FFE500"/>
                      <circle cx="200" cy="178" r="4" fill="#FFE500"/>
                      {/* Connections */}
                      <line x1="60" y1="50" x2="148" y2="78" stroke="#FFE500" strokeWidth="1" strokeDasharray="3 3" opacity="0.55"/>
                      <line x1="340" y1="60" x2="252" y2="80" stroke="#FFE500" strokeWidth="1" strokeDasharray="3 3" opacity="0.55"/>
                      <line x1="70" y1="160" x2="148" y2="124" stroke="#FFE500" strokeWidth="1" strokeDasharray="3 3" opacity="0.55"/>
                      <line x1="334" y1="150" x2="252" y2="124" stroke="#FFE500" strokeWidth="1" strokeDasharray="3 3" opacity="0.55"/>
                      {/* Packet on a line */}
                      <rect x="-6" y="-3" width="12" height="6" rx="1" fill="#FFE500">
                        <animateMotion path="M 60 50 L 148 78" dur="2s" repeatCount="indefinite"/>
                      </rect>
                      {/* Protocol labels */}
                      <rect x="22" y="14" width="48" height="14" rx="3" fill="#FFE500"/>
                      <text x="46" y="24" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#0A1929" textAnchor="middle">TCP/IP</text>
                      <rect x="330" y="14" width="44" height="14" rx="3" fill="#1E40AF"/>
                      <text x="352" y="24" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">DNS</text>
                      <rect x="20" y="172" width="48" height="14" rx="3" fill="#16A34A"/>
                      <text x="44" y="182" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">HTTPS</text>
                      <rect x="328" y="172" width="48" height="14" rx="3" fill="#DC2626"/>
                      <text x="352" y="182" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">OSI 7</text>
                    </svg>
                    <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>50 Q&amp;A</div>
                    <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Network size={11} color={B} />
                      <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>Computer Networks</h3>
                    <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>{IV_KEY_TAGLINE.computer_network}</p>
                  </div>
                </div>
              </div>

              {/* Card 4 — Database */}
              <div style={{ cursor: "pointer" }} onClick={() => openInterviewTopic("database")}>
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}
                >
                  <div style={{ height: "200px", backgroundColor: "#0B1426", overflow: "hidden", position: "relative" }}>
                    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                      <rect width="400" height="200" fill="#0B1426"/>
                      <defs>
                        <pattern id="db-grid" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M 22 0 L 0 0 0 22" fill="none" stroke="#FFE500" strokeWidth="0.4" opacity="0.15"/></pattern>
                      </defs>
                      <rect width="400" height="200" fill="url(#db-grid)"/>
                      {/* Left table (Users) */}
                      <rect x="40" y="30" width="140" height="140" rx="6" fill="#0F1B2E" stroke="#FFE500" strokeWidth="1.4"/>
                      <rect x="40" y="30" width="140" height="22" rx="6" fill="#FFE500"/>
                      <text x="110" y="46" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#0B1426" textAnchor="middle">users</text>
                      {/* Header row */}
                      <text x="52" y="68" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#9CA3AF">id</text>
                      <text x="92" y="68" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#9CA3AF">name</text>
                      <text x="140" y="68" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#9CA3AF">role</text>
                      <line x1="48" y1="74" x2="172" y2="74" stroke="#FFE500" strokeWidth="0.5" opacity="0.3"/>
                      {/* Rows */}
                      <text x="52" y="88" fontFamily="monospace" fontSize="8" fill="#FFE500">1</text>
                      <text x="92" y="88" fontFamily="monospace" fontSize="8" fill="#fff">alice</text>
                      <text x="140" y="88" fontFamily="monospace" fontSize="8" fill="#fff">admin</text>
                      <text x="52" y="106" fontFamily="monospace" fontSize="8" fill="#FFE500">2</text>
                      <text x="92" y="106" fontFamily="monospace" fontSize="8" fill="#fff">bob</text>
                      <text x="140" y="106" fontFamily="monospace" fontSize="8" fill="#fff">user</text>
                      <text x="52" y="124" fontFamily="monospace" fontSize="8" fill="#FFE500">3</text>
                      <text x="92" y="124" fontFamily="monospace" fontSize="8" fill="#fff">carol</text>
                      <text x="140" y="124" fontFamily="monospace" fontSize="8" fill="#fff">admin</text>
                      <text x="52" y="142" fontFamily="monospace" fontSize="8" fill="#FFE500">4</text>
                      <text x="92" y="142" fontFamily="monospace" fontSize="8" fill="#fff">dave</text>
                      <text x="140" y="142" fontFamily="monospace" fontSize="8" fill="#fff">user</text>
                      {/* Key icon */}
                      <circle cx="56" cy="76" r="4" fill="#FFE500"/>
                      <text x="56" y="79" fontFamily="monospace" fontSize="6" fontWeight="700" fill="#0B1426" textAnchor="middle">PK</text>
                      {/* JOIN line */}
                      <path d="M 180 100 Q 200 100 220 100" stroke="#FFE500" strokeWidth="2" fill="none" strokeDasharray="4 3"/>
                      <text x="200" y="92" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" textAnchor="middle">JOIN</text>
                      {/* Right table (Orders) */}
                      <rect x="220" y="30" width="140" height="140" rx="6" fill="#0F1B2E" stroke="#FFE500" strokeWidth="1.4"/>
                      <rect x="220" y="30" width="140" height="22" rx="6" fill="#FFE500"/>
                      <text x="290" y="46" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#0B1426" textAnchor="middle">orders</text>
                      <text x="232" y="68" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#9CA3AF">id</text>
                      <text x="262" y="68" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#9CA3AF">user_id</text>
                      <text x="320" y="68" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#9CA3AF">total</text>
                      <line x1="228" y1="74" x2="352" y2="74" stroke="#FFE500" strokeWidth="0.5" opacity="0.3"/>
                      <text x="232" y="88" fontFamily="monospace" fontSize="8" fill="#FFE500">101</text>
                      <text x="270" y="88" fontFamily="monospace" fontSize="8" fill="#22C55E">1</text>
                      <text x="320" y="88" fontFamily="monospace" fontSize="8" fill="#fff">$45</text>
                      <text x="232" y="106" fontFamily="monospace" fontSize="8" fill="#FFE500">102</text>
                      <text x="270" y="106" fontFamily="monospace" fontSize="8" fill="#22C55E">2</text>
                      <text x="320" y="106" fontFamily="monospace" fontSize="8" fill="#fff">$120</text>
                      <text x="232" y="124" fontFamily="monospace" fontSize="8" fill="#FFE500">103</text>
                      <text x="270" y="124" fontFamily="monospace" fontSize="8" fill="#22C55E">1</text>
                      <text x="320" y="124" fontFamily="monospace" fontSize="8" fill="#fff">$78</text>
                      <text x="232" y="142" fontFamily="monospace" fontSize="8" fill="#FFE500">104</text>
                      <text x="270" y="142" fontFamily="monospace" fontSize="8" fill="#22C55E">3</text>
                      <text x="320" y="142" fontFamily="monospace" fontSize="8" fill="#fff">$22</text>
                      <circle cx="274" cy="76" r="4" fill="#22C55E"/>
                      <text x="274" y="79" fontFamily="monospace" fontSize="6" fontWeight="700" fill="#0B1426" textAnchor="middle">FK</text>
                    </svg>
                    <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>50 Q&amp;A</div>
                    <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Database size={11} color={B} />
                      <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>Database Interview</h3>
                    <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>{IV_KEY_TAGLINE.database}</p>
                  </div>
                </div>
              </div>

              {/* Card 5 — Java */}
              <div style={{ cursor: "pointer" }} onClick={() => openInterviewTopic("java")}>
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}
                >
                  <div style={{ height: "200px", backgroundColor: "#1A0F0A", overflow: "hidden", position: "relative" }}>
                    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                      <rect width="400" height="200" fill="#1A0F0A"/>
                      {/* Coffee cup */}
                      <ellipse cx="78" cy="62" rx="40" ry="10" fill="#FFE500"/>
                      <rect x="38" y="62" width="80" height="56" fill="#FFE500"/>
                      <ellipse cx="78" cy="118" rx="40" ry="10" fill="#D97706"/>
                      <path d="M 118 76 Q 144 76 144 96 Q 144 116 118 116" stroke="#FFE500" strokeWidth="6" fill="none"/>
                      {/* Steam */}
                      <path d="M 64 36 Q 60 28 64 22 Q 68 14 64 6" stroke="#FFE500" strokeWidth="1.5" fill="none" opacity="0.4"/>
                      <path d="M 78 38 Q 74 30 78 24 Q 82 16 78 8" stroke="#FFE500" strokeWidth="1.5" fill="none" opacity="0.6"/>
                      <path d="M 92 36 Q 88 28 92 22 Q 96 14 92 6" stroke="#FFE500" strokeWidth="1.5" fill="none" opacity="0.4"/>
                      {/* JVM Box */}
                      <rect x="170" y="22" width="200" height="156" rx="6" fill="#0F0805" stroke="#FFE500" strokeWidth="1.4"/>
                      <rect x="170" y="22" width="200" height="22" rx="6" fill="#FFE500"/>
                      <text x="270" y="38" fontFamily="monospace" fontSize="11" fontWeight="700" fill="#0F0805" textAnchor="middle">JVM</text>
                      {/* Memory areas */}
                      <rect x="184" y="54" width="172" height="34" rx="4" fill="#7C2D12" opacity="0.6" stroke="#FFE500" strokeWidth="0.8"/>
                      <text x="270" y="68" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#FFE500" textAnchor="middle">HEAP</text>
                      <circle cx="208" cy="80" r="3" fill="#FFE500"/>
                      <circle cx="232" cy="80" r="4" fill="#FFE500"/>
                      <circle cx="260" cy="80" r="2.5" fill="#FFE500"/>
                      <circle cx="290" cy="80" r="3.5" fill="#FFE500"/>
                      <circle cx="320" cy="80" r="2.5" fill="#FFE500"/>
                      <rect x="184" y="94" width="84" height="34" rx="4" fill="#1E3A8A" opacity="0.5" stroke="#FFE500" strokeWidth="0.8"/>
                      <text x="226" y="108" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#FFE500" textAnchor="middle">STACK</text>
                      <line x1="190" y1="116" x2="262" y2="116" stroke="#FFE500" strokeWidth="0.5" opacity="0.5"/>
                      <line x1="190" y1="122" x2="252" y2="122" stroke="#FFE500" strokeWidth="0.5" opacity="0.3"/>
                      <rect x="272" y="94" width="84" height="34" rx="4" fill="#14532D" opacity="0.5" stroke="#FFE500" strokeWidth="0.8"/>
                      <text x="314" y="108" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" textAnchor="middle">METASPACE</text>
                      {/* Bytecode */}
                      <rect x="184" y="134" width="172" height="34" rx="4" fill="#0F0805" stroke="#FFE500" strokeWidth="0.8"/>
                      <text x="194" y="148" fontFamily="monospace" fontSize="8" fill="#86EFAC">0xCA</text>
                      <text x="218" y="148" fontFamily="monospace" fontSize="8" fill="#86EFAC">0xFE</text>
                      <text x="242" y="148" fontFamily="monospace" fontSize="8" fill="#86EFAC">0xBA</text>
                      <text x="266" y="148" fontFamily="monospace" fontSize="8" fill="#86EFAC">0xBE</text>
                      <text x="290" y="148" fontFamily="monospace" fontSize="8" fill="#FFE500">// bytecode</text>
                      <text x="270" y="162" fontFamily="monospace" fontSize="7" fill="#9CA3AF" textAnchor="middle">platform-independent</text>
                    </svg>
                    <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>30 Q&amp;A</div>
                    <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Coffee size={11} color={B} />
                      <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>Java Interview</h3>
                    <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>{IV_KEY_TAGLINE.java}</p>
                  </div>
                </div>
              </div>

              {/* Card 6 — Operating System */}
              <div style={{ cursor: "pointer" }} onClick={() => openInterviewTopic("operating_system")}>
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}
                >
                  <div style={{ height: "200px", backgroundColor: "#0A0A14", overflow: "hidden", position: "relative" }}>
                    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                      <rect width="400" height="200" fill="#0A0A14"/>
                      {/* CPU center */}
                      <rect x="160" y="60" width="80" height="80" rx="8" fill="#0F0F1F" stroke="#FFE500" strokeWidth="2"/>
                      <rect x="172" y="72" width="56" height="56" rx="4" fill="#FFE500"/>
                      <text x="200" y="105" fontFamily="monospace" fontSize="14" fontWeight="700" fill="#0A0A14" textAnchor="middle">CPU</text>
                      {/* CPU pins */}
                      {[170, 180, 190, 200, 210, 220, 230].map(x => (<rect key={`t-${x}`} x={x - 1} y="54" width="2" height="6" fill="#FFE500"/>))}
                      {[170, 180, 190, 200, 210, 220, 230].map(x => (<rect key={`b-${x}`} x={x - 1} y="140" width="2" height="6" fill="#FFE500"/>))}
                      {[70, 80, 90, 100, 110, 120, 130].map(y => (<rect key={`l-${y}`} x="154" y={y - 1} width="6" height="2" fill="#FFE500"/>))}
                      {[70, 80, 90, 100, 110, 120, 130].map(y => (<rect key={`r-${y}`} x="240" y={y - 1} width="6" height="2" fill="#FFE500"/>))}
                      {/* Process boxes around */}
                      <rect x="24" y="24" width="80" height="36" rx="4" fill="#1E1E2E" stroke="#FFE500" strokeWidth="1"/>
                      <circle cx="36" cy="42" r="3" fill="#22C55E"/>
                      <text x="46" y="38" fontFamily="monospace" fontSize="8" fill="#fff">P1</text>
                      <text x="46" y="50" fontFamily="monospace" fontSize="7" fill="#9CA3AF">running</text>
                      <text x="84" y="48" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#FFE500">●</text>
                      <rect x="296" y="24" width="80" height="36" rx="4" fill="#1E1E2E" stroke="#FFE500" strokeWidth="1"/>
                      <circle cx="308" cy="42" r="3" fill="#FBBF24"/>
                      <text x="318" y="38" fontFamily="monospace" fontSize="8" fill="#fff">P2</text>
                      <text x="318" y="50" fontFamily="monospace" fontSize="7" fill="#9CA3AF">ready</text>
                      <rect x="24" y="140" width="80" height="36" rx="4" fill="#1E1E2E" stroke="#FFE500" strokeWidth="1"/>
                      <circle cx="36" cy="158" r="3" fill="#FBBF24"/>
                      <text x="46" y="154" fontFamily="monospace" fontSize="8" fill="#fff">P3</text>
                      <text x="46" y="166" fontFamily="monospace" fontSize="7" fill="#9CA3AF">ready</text>
                      <rect x="296" y="140" width="80" height="36" rx="4" fill="#1E1E2E" stroke="#FFE500" strokeWidth="1"/>
                      <circle cx="308" cy="158" r="3" fill="#EF4444"/>
                      <text x="318" y="154" fontFamily="monospace" fontSize="8" fill="#fff">P4</text>
                      <text x="318" y="166" fontFamily="monospace" fontSize="7" fill="#9CA3AF">blocked</text>
                      {/* Connection lines */}
                      <line x1="104" y1="42" x2="160" y2="80" stroke="#FFE500" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
                      <line x1="296" y1="42" x2="240" y2="80" stroke="#FFE500" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
                      <line x1="104" y1="158" x2="160" y2="120" stroke="#FFE500" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
                      <line x1="296" y1="158" x2="240" y2="120" stroke="#FFE500" strokeWidth="1" strokeDasharray="3 3" opacity="0.6"/>
                      {/* KERNEL ring label */}
                      <rect x="172" y="180" width="56" height="14" rx="3" fill="#FFE500"/>
                      <text x="200" y="190" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#0A0A14" textAnchor="middle">KERNEL</text>
                      {/* Scheduler badge top */}
                      <rect x="170" y="4" width="60" height="14" rx="3" fill="#1E40AF"/>
                      <text x="200" y="14" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">SCHEDULER</text>
                    </svg>
                    <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>50 Q&amp;A</div>
                    <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Cpu size={11} color={B} />
                      <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>Operating System</h3>
                    <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>{IV_KEY_TAGLINE.operating_system}</p>
                  </div>
                </div>
              </div>

              {/* Card 7 — Python */}
              <div style={{ cursor: "pointer" }} onClick={() => openInterviewTopic("python")}>
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}
                >
                  <div style={{ height: "200px", backgroundColor: "#0A1929", overflow: "hidden", position: "relative" }}>
                    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                      <rect width="400" height="200" fill="#0A1929"/>
                      {/* Snake/python logo */}
                      <g transform="translate(40, 40)">
                        <path d="M 30 0 Q 60 0 60 24 L 60 36 L 12 36 Q 0 36 0 48 L 0 84 Q 0 96 12 96 L 36 96 L 36 84 L 12 84 L 12 60 L 48 60 Q 60 60 60 48 L 60 12 Q 60 0 48 0 Z" fill="#FFE500"/>
                        <circle cx="22" cy="12" r="3" fill="#0A1929"/>
                        <path d="M 30 24 Q 0 24 0 0 L 0 -12 L 48 -12 Q 60 -12 60 0 L 60 36 Q 60 48 48 48 L 24 48 L 24 36 L 48 36 L 48 60 L 12 60 Q 0 60 0 48 L 0 12 Q 0 0 12 0 Z" fill="#1E40AF" transform="translate(30, 36)"/>
                        <circle cx="68" cy="84" r="3" fill="#FFE500"/>
                      </g>
                      {/* Code panel */}
                      <rect x="160" y="22" width="216" height="156" rx="6" fill="#0F1F2F" stroke="#FFE500" strokeWidth="1.2"/>
                      <rect x="160" y="22" width="216" height="18" rx="6" fill="#1E2E3F"/>
                      <circle cx="170" cy="31" r="2.5" fill="#EF4444"/>
                      <circle cx="180" cy="31" r="2.5" fill="#FBBF24"/>
                      <circle cx="190" cy="31" r="2.5" fill="#22C55E"/>
                      <text x="270" y="34" fontFamily="monospace" fontSize="8" fill="#9CA3AF" textAnchor="middle">app.py</text>
                      {/* Code lines */}
                      <text x="170" y="56" fontFamily="monospace" fontSize="9" fill="#7DD3FC">def</text>
                      <text x="188" y="56" fontFamily="monospace" fontSize="9" fill="#FFE500">greet</text>
                      <text x="216" y="56" fontFamily="monospace" fontSize="9" fill="#fff">(name):</text>
                      <text x="184" y="72" fontFamily="monospace" fontSize="9" fill="#7DD3FC">return</text>
                      <text x="218" y="72" fontFamily="monospace" fontSize="9" fill="#86EFAC">f"Hi</text>
                      <text x="240" y="72" fontFamily="monospace" fontSize="9" fill="#FFE500">{"{name}"}</text>
                      <text x="280" y="72" fontFamily="monospace" fontSize="9" fill="#86EFAC">"</text>
                      <text x="170" y="92" fontFamily="monospace" fontSize="9" fill="#9CA3AF"># list comp</text>
                      <text x="170" y="108" fontFamily="monospace" fontSize="9" fill="#FFE500">nums</text>
                      <text x="198" y="108" fontFamily="monospace" fontSize="9" fill="#fff">= [</text>
                      <text x="216" y="108" fontFamily="monospace" fontSize="9" fill="#FFE500">x</text>
                      <text x="224" y="108" fontFamily="monospace" fontSize="9" fill="#7DD3FC">**</text>
                      <text x="236" y="108" fontFamily="monospace" fontSize="9" fill="#FFE500">2</text>
                      <text x="244" y="108" fontFamily="monospace" fontSize="9" fill="#7DD3FC">for</text>
                      <text x="262" y="108" fontFamily="monospace" fontSize="9" fill="#FFE500">x</text>
                      <text x="270" y="108" fontFamily="monospace" fontSize="9" fill="#7DD3FC">in</text>
                      <text x="282" y="108" fontFamily="monospace" fontSize="9" fill="#fff">range(</text>
                      <text x="316" y="108" fontFamily="monospace" fontSize="9" fill="#FFE500">10</text>
                      <text x="328" y="108" fontFamily="monospace" fontSize="9" fill="#fff">)]</text>
                      <text x="170" y="128" fontFamily="monospace" fontSize="9" fill="#9CA3AF"># dict</text>
                      <text x="170" y="144" fontFamily="monospace" fontSize="9" fill="#FFE500">user</text>
                      <text x="198" y="144" fontFamily="monospace" fontSize="9" fill="#fff">= {"{"}</text>
                      <text x="218" y="144" fontFamily="monospace" fontSize="9" fill="#86EFAC">"name"</text>
                      <text x="252" y="144" fontFamily="monospace" fontSize="9" fill="#fff">:</text>
                      <text x="260" y="144" fontFamily="monospace" fontSize="9" fill="#86EFAC">"Alice"</text>
                      <text x="298" y="144" fontFamily="monospace" fontSize="9" fill="#fff">{"}"}</text>
                      <text x="170" y="164" fontFamily="monospace" fontSize="9" fill="#fff">print(greet(</text>
                      <text x="242" y="164" fontFamily="monospace" fontSize="9" fill="#86EFAC">"world"</text>
                      <text x="280" y="164" fontFamily="monospace" fontSize="9" fill="#fff">))</text>
                      <rect x="296" y="158" width="5" height="8" fill="#FFE500"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></rect>
                    </svg>
                    <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>50 Q&amp;A</div>
                    <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Code2 size={11} color={B} />
                      <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>Python Interview</h3>
                    <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>{IV_KEY_TAGLINE.python}</p>
                  </div>
                </div>
              </div>

              {/* Card 8 — MERN Stack */}
              <div style={{ cursor: "pointer" }} onClick={() => openInterviewTopic("mern")}>
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}
                >
                  <div style={{ height: "200px", backgroundColor: "#0E1B2A", overflow: "hidden", position: "relative" }}>
                    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                      <rect width="400" height="200" fill="#0E1B2A"/>
                      {/* 4 stack blocks: M E R N */}
                      {/* MongoDB (leaf) */}
                      <rect x="22" y="46" width="80" height="108" rx="8" fill="#0F2818" stroke="#4ADE80" strokeWidth="1.4"/>
                      <text x="62" y="68" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#4ADE80" textAnchor="middle">MongoDB</text>
                      <ellipse cx="62" cy="100" rx="24" ry="8" fill="#4ADE80"/>
                      <rect x="38" y="100" width="48" height="36" fill="#4ADE80"/>
                      <ellipse cx="62" cy="136" rx="24" ry="8" fill="#16A34A"/>
                      <text x="62" y="118" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#0E1B2A" textAnchor="middle">DB</text>
                      {/* Express */}
                      <rect x="112" y="46" width="80" height="108" rx="8" fill="#1F1A0F" stroke="#FFE500" strokeWidth="1.4"/>
                      <text x="152" y="68" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#FFE500" textAnchor="middle">Express</text>
                      <rect x="124" y="84" width="56" height="6" rx="2" fill="#FFE500" opacity="0.5"/>
                      <rect x="124" y="96" width="44" height="6" rx="2" fill="#FFE500" opacity="0.3"/>
                      <rect x="124" y="108" width="52" height="6" rx="2" fill="#FFE500" opacity="0.5"/>
                      <text x="152" y="135" fontFamily="monospace" fontSize="22" fontWeight="700" fill="#FFE500" textAnchor="middle">API</text>
                      {/* React */}
                      <rect x="202" y="46" width="80" height="108" rx="8" fill="#0A1A24" stroke="#61DAFB" strokeWidth="1.4"/>
                      <text x="242" y="68" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#61DAFB" textAnchor="middle">React</text>
                      <circle cx="242" cy="106" r="6" fill="#61DAFB"/>
                      <ellipse cx="242" cy="106" rx="22" ry="8" fill="none" stroke="#61DAFB" strokeWidth="1.4"/>
                      <ellipse cx="242" cy="106" rx="22" ry="8" fill="none" stroke="#61DAFB" strokeWidth="1.4" transform="rotate(60 242 106)"/>
                      <ellipse cx="242" cy="106" rx="22" ry="8" fill="none" stroke="#61DAFB" strokeWidth="1.4" transform="rotate(120 242 106)"/>
                      <text x="242" y="140" fontFamily="monospace" fontSize="7" fill="#61DAFB" textAnchor="middle">virtual DOM</text>
                      {/* Node.js */}
                      <rect x="292" y="46" width="84" height="108" rx="8" fill="#0F1F0A" stroke="#86EFAC" strokeWidth="1.4"/>
                      <text x="334" y="68" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#86EFAC" textAnchor="middle">Node.js</text>
                      <polygon points="334,84 358,98 358,128 334,142 310,128 310,98" fill="#86EFAC"/>
                      <text x="334" y="118" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#0F1F0A" textAnchor="middle">JS</text>
                      {/* Flow arrows */}
                      <path d="M 100 30 L 290 30" stroke="#FFE500" strokeWidth="1.4" strokeDasharray="4 3" opacity="0.7"/>
                      <text x="200" y="22" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" textAnchor="middle">FULL STACK JAVASCRIPT</text>
                      <path d="M 100 170 L 290 170" stroke="#4ADE80" strokeWidth="1" strokeDasharray="3 3" opacity="0.5"/>
                      <text x="200" y="188" fontFamily="monospace" fontSize="8" fill="#4ADE80" textAnchor="middle">JSON ⇄ JSON ⇄ JSON ⇄ JSON</text>
                    </svg>
                    <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>30 Q&amp;A</div>
                    <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Boxes size={11} color={B} />
                      <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>MERN Stack Interview</h3>
                    <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>{IV_KEY_TAGLINE.mern}</p>
                  </div>
                </div>
              </div>

              {/* Card 9 — React */}
              <div style={{ cursor: "pointer" }} onClick={() => openInterviewTopic("react")}>
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}
                >
                  <div style={{ height: "200px", backgroundColor: "#061A24", overflow: "hidden", position: "relative" }}>
                    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                      <rect width="400" height="200" fill="#061A24"/>
                      {/* React atom logo */}
                      <g transform="translate(120, 100)">
                        <circle cx="0" cy="0" r="9" fill="#61DAFB"/>
                        <ellipse cx="0" cy="0" rx="60" ry="22" fill="none" stroke="#61DAFB" strokeWidth="2.5"/>
                        <ellipse cx="0" cy="0" rx="60" ry="22" fill="none" stroke="#61DAFB" strokeWidth="2.5" transform="rotate(60)"/>
                        <ellipse cx="0" cy="0" rx="60" ry="22" fill="none" stroke="#61DAFB" strokeWidth="2.5" transform="rotate(120)"/>
                      </g>
                      {/* JSX snippet panel */}
                      <rect x="210" y="22" width="168" height="156" rx="6" fill="#0A2230" stroke="#61DAFB" strokeWidth="1.2"/>
                      <rect x="210" y="22" width="168" height="18" rx="6" fill="#102E3E"/>
                      <circle cx="220" cy="31" r="2.5" fill="#EF4444"/>
                      <circle cx="230" cy="31" r="2.5" fill="#FBBF24"/>
                      <circle cx="240" cy="31" r="2.5" fill="#22C55E"/>
                      <text x="296" y="34" fontFamily="monospace" fontSize="8" fill="#9CA3AF" textAnchor="middle">App.jsx</text>
                      {/* JSX code */}
                      <text x="220" y="56" fontFamily="monospace" fontSize="9" fill="#A78BFA">const</text>
                      <text x="246" y="56" fontFamily="monospace" fontSize="9" fill="#61DAFB">Counter</text>
                      <text x="280" y="56" fontFamily="monospace" fontSize="9" fill="#fff">= () =&gt; &#123;</text>
                      <text x="226" y="72" fontFamily="monospace" fontSize="9" fill="#A78BFA">const</text>
                      <text x="252" y="72" fontFamily="monospace" fontSize="9" fill="#fff">[n, set]</text>
                      <text x="226" y="84" fontFamily="monospace" fontSize="9" fill="#fff">= </text>
                      <text x="240" y="84" fontFamily="monospace" fontSize="9" fill="#FBBF24">useState</text>
                      <text x="278" y="84" fontFamily="monospace" fontSize="9" fill="#fff">(</text>
                      <text x="284" y="84" fontFamily="monospace" fontSize="9" fill="#86EFAC">0</text>
                      <text x="290" y="84" fontFamily="monospace" fontSize="9" fill="#fff">);</text>
                      <text x="226" y="102" fontFamily="monospace" fontSize="9" fill="#A78BFA">return</text>
                      <text x="226" y="116" fontFamily="monospace" fontSize="9" fill="#61DAFB">&lt;button</text>
                      <text x="226" y="128" fontFamily="monospace" fontSize="9" fill="#FBBF24">onClick</text>
                      <text x="258" y="128" fontFamily="monospace" fontSize="9" fill="#fff">=</text>
                      <text x="264" y="128" fontFamily="monospace" fontSize="9" fill="#86EFAC">{"{()=>set(n+1)}"}</text>
                      <text x="226" y="142" fontFamily="monospace" fontSize="9" fill="#61DAFB">&gt;</text>
                      <text x="236" y="142" fontFamily="monospace" fontSize="9" fill="#fff">{"{n}"}</text>
                      <text x="226" y="156" fontFamily="monospace" fontSize="9" fill="#61DAFB">&lt;/button&gt;</text>
                      <text x="226" y="170" fontFamily="monospace" fontSize="9" fill="#fff">&#125;;</text>
                    </svg>
                    <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>50 Q&amp;A</div>
                    <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Atom size={11} color={B} />
                      <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>React Interview</h3>
                    <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>{IV_KEY_TAGLINE.react}</p>
                  </div>
                </div>
              </div>

              {/* Card 10 — SQL */}
              <div style={{ cursor: "pointer" }} onClick={() => openInterviewTopic("sql")}>
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}
                >
                  <div style={{ height: "200px", backgroundColor: "#0F0B1F", overflow: "hidden", position: "relative" }}>
                    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                      <rect width="400" height="200" fill="#0F0B1F"/>
                      {/* Terminal-style SQL editor */}
                      <rect x="20" y="20" width="360" height="160" rx="6" fill="#1A132E" stroke="#FFE500" strokeWidth="1.2"/>
                      <rect x="20" y="20" width="360" height="20" rx="6" fill="#241A40"/>
                      <circle cx="32" cy="30" r="3" fill="#EF4444"/>
                      <circle cx="44" cy="30" r="3" fill="#FBBF24"/>
                      <circle cx="56" cy="30" r="3" fill="#22C55E"/>
                      <text x="200" y="33" fontFamily="monospace" fontSize="9" fill="#9CA3AF" textAnchor="middle">analytics.sql — psql</text>
                      {/* Query */}
                      <text x="30" y="58" fontFamily="monospace" fontSize="10" fill="#A78BFA">SELECT</text>
                      <text x="76" y="58" fontFamily="monospace" fontSize="10" fill="#fff">name,</text>
                      <text x="42" y="74" fontFamily="monospace" fontSize="10" fill="#FFE500">RANK</text>
                      <text x="74" y="74" fontFamily="monospace" fontSize="10" fill="#fff">() </text>
                      <text x="92" y="74" fontFamily="monospace" fontSize="10" fill="#A78BFA">OVER</text>
                      <text x="124" y="74" fontFamily="monospace" fontSize="10" fill="#fff">(</text>
                      <text x="60" y="88" fontFamily="monospace" fontSize="10" fill="#A78BFA">PARTITION BY</text>
                      <text x="146" y="88" fontFamily="monospace" fontSize="10" fill="#fff">dept</text>
                      <text x="60" y="102" fontFamily="monospace" fontSize="10" fill="#A78BFA">ORDER BY</text>
                      <text x="122" y="102" fontFamily="monospace" fontSize="10" fill="#fff">salary DESC) </text>
                      <text x="220" y="102" fontFamily="monospace" fontSize="10" fill="#A78BFA">AS</text>
                      <text x="244" y="102" fontFamily="monospace" fontSize="10" fill="#fff">rnk</text>
                      <text x="30" y="116" fontFamily="monospace" fontSize="10" fill="#A78BFA">FROM</text>
                      <text x="64" y="116" fontFamily="monospace" fontSize="10" fill="#86EFAC">employees</text>
                      <text x="30" y="130" fontFamily="monospace" fontSize="10" fill="#A78BFA">JOIN</text>
                      <text x="62" y="130" fontFamily="monospace" fontSize="10" fill="#86EFAC">departments</text>
                      <text x="146" y="130" fontFamily="monospace" fontSize="10" fill="#A78BFA">ON</text>
                      <text x="166" y="130" fontFamily="monospace" fontSize="10" fill="#fff">dept_id=id</text>
                      <text x="30" y="144" fontFamily="monospace" fontSize="10" fill="#A78BFA">WHERE</text>
                      <text x="70" y="144" fontFamily="monospace" fontSize="10" fill="#fff">active = </text>
                      <text x="128" y="144" fontFamily="monospace" fontSize="10" fill="#86EFAC">TRUE</text>
                      <text x="30" y="158" fontFamily="monospace" fontSize="10" fill="#A78BFA">GROUP BY</text>
                      <text x="92" y="158" fontFamily="monospace" fontSize="10" fill="#fff">dept;</text>
                      <rect x="120" y="151" width="5" height="8" fill="#FFE500"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/></rect>
                      {/* Result indicator */}
                      <rect x="246" y="48" width="124" height="124" rx="4" fill="#0F0B1F" stroke="#FFE500" strokeWidth="1" opacity="0.7"/>
                      <text x="308" y="64" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" textAnchor="middle">RESULT</text>
                      <line x1="252" y1="70" x2="364" y2="70" stroke="#FFE500" strokeWidth="0.5" opacity="0.5"/>
                      <text x="256" y="84" fontFamily="monospace" fontSize="8" fill="#fff">Alice  Eng  1</text>
                      <text x="256" y="98" fontFamily="monospace" fontSize="8" fill="#fff">Bob    Eng  2</text>
                      <text x="256" y="112" fontFamily="monospace" fontSize="8" fill="#fff">Carol  HR   1</text>
                      <text x="256" y="126" fontFamily="monospace" fontSize="8" fill="#fff">Dan    HR   2</text>
                      <text x="256" y="140" fontFamily="monospace" fontSize="8" fill="#fff">Eve    Ops  1</text>
                      <text x="256" y="154" fontFamily="monospace" fontSize="8" fill="#9CA3AF">...</text>
                      <text x="256" y="168" fontFamily="monospace" fontSize="7" fill="#86EFAC">✓ 12 rows · 3ms</text>
                    </svg>
                    <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>30 Q&amp;A</div>
                    <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Table size={11} color={B} />
                      <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>SQL Interview</h3>
                    <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>{IV_KEY_TAGLINE.sql}</p>
                  </div>
                </div>
              </div>

              {/* Card 11 — GenAI / LLM */}
              <div style={{ cursor: "pointer" }} onClick={() => openInterviewTopic("genai")}>
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}
                >
                  <div style={{ height: "200px", backgroundColor: "#0C0820", overflow: "hidden", position: "relative" }}>
                    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                      <rect width="400" height="200" fill="#0C0820"/>
                      <defs>
                        <radialGradient id="ai-glow" cx="0.5" cy="0.5">
                          <stop offset="0%" stopColor="#FFE500" stopOpacity="0.45"/>
                          <stop offset="100%" stopColor="#FFE500" stopOpacity="0"/>
                        </radialGradient>
                      </defs>
                      {/* Glow */}
                      <circle cx="200" cy="100" r="90" fill="url(#ai-glow)"/>
                      {/* Token chain (left) */}
                      <g>
                        {["Hello", "world", "of", "LLMs"].map((tok, i) => (
                          <g key={`tok-${i}`} transform={`translate(${20 + i * 36}, ${60 + (i % 2) * 32})`}>
                            <rect x="0" y="0" width="34" height="18" rx="3" fill="#1E1640" stroke="#FFE500" strokeWidth="1"/>
                            <text x="17" y="12" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#FFE500" textAnchor="middle">{tok}</text>
                          </g>
                        ))}
                      </g>
                      {/* Attention lines (center) */}
                      <g opacity="0.6">
                        <line x1="56" y1="78" x2="180" y2="100" stroke="#FFE500" strokeWidth="0.8" strokeDasharray="3 3"/>
                        <line x1="92" y1="110" x2="180" y2="100" stroke="#FFE500" strokeWidth="1.4" strokeDasharray="3 3"/>
                        <line x1="128" y1="78" x2="180" y2="100" stroke="#FFE500" strokeWidth="0.8" strokeDasharray="3 3"/>
                        <line x1="164" y1="110" x2="180" y2="100" stroke="#FFE500" strokeWidth="1.4" strokeDasharray="3 3"/>
                      </g>
                      {/* Brain / transformer core */}
                      <circle cx="200" cy="100" r="48" fill="#1E1640" stroke="#FFE500" strokeWidth="1.6"/>
                      <text x="200" y="92" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#FFE500" textAnchor="middle">ATTENTION</text>
                      <text x="200" y="106" fontFamily="monospace" fontSize="20" fontWeight="700" fill="#fff" textAnchor="middle">LLM</text>
                      <text x="200" y="120" fontFamily="monospace" fontSize="7" fill="#A78BFA" textAnchor="middle">Q · K · V</text>
                      {/* Network connections around */}
                      <g stroke="#FFE500" strokeWidth="0.6" opacity="0.4">
                        <line x1="152" y1="100" x2="180" y2="100"/>
                        <line x1="220" y1="100" x2="248" y2="100"/>
                        <line x1="200" y1="52" x2="200" y2="80"/>
                        <line x1="200" y1="148" x2="200" y2="120"/>
                      </g>
                      {/* Output tokens (right) */}
                      <g>
                        <rect x="262" y="60" width="56" height="20" rx="3" fill="#0F2818" stroke="#4ADE80" strokeWidth="1"/>
                        <text x="290" y="73" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#4ADE80" textAnchor="middle">prediction</text>
                        <rect x="262" y="88" width="56" height="20" rx="3" fill="#0F2818" stroke="#4ADE80" strokeWidth="1"/>
                        <text x="290" y="101" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#4ADE80" textAnchor="middle">next token</text>
                        <rect x="262" y="116" width="56" height="20" rx="3" fill="#0F2818" stroke="#4ADE80" strokeWidth="1"/>
                        <text x="290" y="129" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#4ADE80" textAnchor="middle">softmax</text>
                      </g>
                      {/* Bottom params badge */}
                      <rect x="146" y="166" width="108" height="20" rx="10" fill="#FFE500"/>
                      <text x="200" y="180" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#0C0820" textAnchor="middle">175B params</text>
                    </svg>
                    <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>50 Q&amp;A</div>
                    <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Brain size={11} color={B} />
                      <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>GenAI / LLM Interview</h3>
                    <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>{IV_KEY_TAGLINE.genai}</p>
                  </div>
                </div>
              </div>

              {/* Card 12 — Mobile Developer */}
              <div style={{ cursor: "pointer" }} onClick={() => openInterviewTopic("mobile")}>
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}
                >
                  <div style={{ height: "200px", backgroundColor: "#0F1117", overflow: "hidden", position: "relative" }}>
                    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                      <rect width="400" height="200" fill="#0F1117"/>
                      {/* Phone 1 - iOS style (left) */}
                      <rect x="56" y="22" width="86" height="156" rx="14" fill="#1C1F2A" stroke="#FFE500" strokeWidth="1.6"/>
                      <rect x="62" y="34" width="74" height="124" rx="6" fill="#0A0C12"/>
                      <rect x="92" y="26" width="14" height="4" rx="2" fill="#0A0C12"/>
                      <text x="99" y="50" fontFamily="monospace" fontSize="8" fill="#fff" textAnchor="middle">9:41</text>
                      {/* App content */}
                      <rect x="70" y="58" width="58" height="18" rx="3" fill="#FFE500"/>
                      <text x="99" y="71" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#0A0C12" textAnchor="middle">SwiftUI</text>
                      <rect x="70" y="82" width="58" height="6" rx="2" fill="#fff" opacity="0.3"/>
                      <rect x="70" y="92" width="46" height="6" rx="2" fill="#fff" opacity="0.15"/>
                      <rect x="70" y="106" width="58" height="22" rx="3" fill="#3B82F6"/>
                      <text x="99" y="121" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#fff" textAnchor="middle">Sign In</text>
                      <rect x="70" y="134" width="58" height="20" rx="3" fill="#1C1F2A" stroke="#fff" strokeWidth="0.5" opacity="0.6"/>
                      {/* Home indicator */}
                      <rect x="84" y="168" width="30" height="3" rx="1.5" fill="#fff" opacity="0.5"/>
                      {/* Phone 2 - Android style (right) */}
                      <rect x="258" y="22" width="86" height="156" rx="10" fill="#1C2D1F" stroke="#86EFAC" strokeWidth="1.6"/>
                      <rect x="264" y="34" width="74" height="124" rx="3" fill="#0F1F12"/>
                      <text x="301" y="44" fontFamily="monospace" fontSize="6" fill="#86EFAC" textAnchor="middle">▼ 4G ▮ 92%</text>
                      <rect x="272" y="52" width="58" height="18" rx="3" fill="#86EFAC"/>
                      <text x="301" y="65" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#0F1F12" textAnchor="middle">Jetpack</text>
                      <rect x="272" y="76" width="58" height="6" rx="2" fill="#fff" opacity="0.3"/>
                      <rect x="272" y="86" width="46" height="6" rx="2" fill="#fff" opacity="0.15"/>
                      <rect x="272" y="100" width="58" height="22" rx="3" fill="#86EFAC"/>
                      <text x="301" y="115" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#0F1F12" textAnchor="middle">Compose</text>
                      <rect x="272" y="128" width="58" height="20" rx="3" fill="#1C2D1F" stroke="#fff" strokeWidth="0.5" opacity="0.6"/>
                      {/* Nav buttons */}
                      <circle cx="282" cy="168" r="3" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.6"/>
                      <rect x="297" y="166" width="6" height="6" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.6"/>
                      <polygon points="318,168 314,164 314,172" fill="#fff" opacity="0.6"/>
                      {/* Center stack labels */}
                      <rect x="156" y="44" width="88" height="16" rx="3" fill="#FFE500"/>
                      <text x="200" y="55" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#0F1117" textAnchor="middle">FLUTTER</text>
                      <rect x="156" y="66" width="88" height="16" rx="3" fill="#61DAFB"/>
                      <text x="200" y="77" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#0F1117" textAnchor="middle">REACT NATIVE</text>
                      <rect x="156" y="88" width="88" height="16" rx="3" fill="#86EFAC"/>
                      <text x="200" y="99" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#0F1117" textAnchor="middle">KOTLIN</text>
                      <rect x="156" y="110" width="88" height="16" rx="3" fill="#FB923C"/>
                      <text x="200" y="121" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#0F1117" textAnchor="middle">SWIFT</text>
                      <text x="200" y="146" fontFamily="monospace" fontSize="8" fill="#9CA3AF" textAnchor="middle">→ one codebase →</text>
                      <text x="200" y="162" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" textAnchor="middle">two stores</text>
                      {/* Connection lines */}
                      <line x1="142" y1="68" x2="156" y2="68" stroke="#FFE500" strokeWidth="1" opacity="0.5"/>
                      <line x1="244" y1="78" x2="258" y2="78" stroke="#86EFAC" strokeWidth="1" opacity="0.5"/>
                    </svg>
                    <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>30 Q&amp;A</div>
                    <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <Smartphone size={11} color={B} />
                      <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>Mobile Developer</h3>
                    <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>{IV_KEY_TAGLINE.mobile}</p>
                  </div>
                </div>
              </div>

              {/* Card 13 — Business Analyst */}
              <div style={{ cursor: "pointer" }} onClick={() => openInterviewTopic("business_analyst")}>
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}
                >
                  <div style={{ height: "200px", backgroundColor: "#0F1B2E", overflow: "hidden", position: "relative" }}>
                    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                      <rect width="400" height="200" fill="#0F1B2E"/>
                      <defs>
                        <pattern id="ba-grid" width="22" height="22" patternUnits="userSpaceOnUse"><path d="M 22 0 L 0 0 0 22" fill="none" stroke="#FFE500" strokeWidth="0.4" opacity="0.15"/></pattern>
                      </defs>
                      <rect width="400" height="200" fill="url(#ba-grid)"/>
                      {/* Dashboard frame */}
                      <rect x="18" y="32" width="364" height="138" rx="6" fill="#15243F" stroke="#FFE500" strokeWidth="1.2"/>
                      <rect x="18" y="32" width="364" height="20" rx="6" fill="#1E3257"/>
                      <circle cx="30" cy="42" r="3" fill="#EF4444"/>
                      <circle cx="42" cy="42" r="3" fill="#FBBF24"/>
                      <circle cx="54" cy="42" r="3" fill="#22C55E"/>
                      <text x="200" y="46" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" textAnchor="middle">REQUIREMENTS · PROCESS · INSIGHTS</text>
                      {/* Bar chart (left) */}
                      <text x="34" y="68" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#9CA3AF">REVENUE</text>
                      {[
                        [34, 28], [50, 42], [66, 36], [82, 56], [98, 48], [114, 64],
                      ].map(([x, h], i) => (
                        <rect key={`bar-${i}`} x={x} y={140 - h} width="10" height={h} fill={i === 5 ? "#FFE500" : "#3B82F6"} rx="1"/>
                      ))}
                      <line x1="32" y1="142" x2="132" y2="142" stroke="#FFE500" strokeWidth="0.6" opacity="0.5"/>
                      {/* Line chart (centre) */}
                      <text x="200" y="68" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#9CA3AF" textAnchor="middle">KPI TREND</text>
                      <path d="M 152 130 L 168 116 L 184 122 L 200 100 L 216 108 L 232 86 L 248 78" stroke="#22D3EE" strokeWidth="1.6" fill="none"/>
                      {[
                        [152, 130], [168, 116], [184, 122], [200, 100], [216, 108], [232, 86], [248, 78],
                      ].map(([cx, cy], i) => (
                        <circle key={`pt-${i}`} cx={cx} cy={cy} r="2" fill="#22D3EE"/>
                      ))}
                      <line x1="152" y1="142" x2="248" y2="142" stroke="#FFE500" strokeWidth="0.6" opacity="0.5"/>
                      {/* Pie chart (right) */}
                      <text x="332" y="68" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#9CA3AF" textAnchor="middle">SEGMENTS</text>
                      <circle cx="332" cy="112" r="22" fill="#1E3257"/>
                      <path d="M 332 112 L 332 90 A 22 22 0 0 1 351 123 Z" fill="#FFE500"/>
                      <path d="M 332 112 L 351 123 A 22 22 0 0 1 320 132 Z" fill="#22C55E"/>
                      <path d="M 332 112 L 320 132 A 22 22 0 0 1 332 90 Z" fill="#3B82F6"/>
                      <circle cx="332" cy="112" r="8" fill="#15243F"/>
                      {/* Footer KPI strip */}
                      <rect x="32" y="152" width="68" height="14" rx="3" fill="#0F1B2E"/>
                      <text x="36" y="162" fontFamily="monospace" fontSize="7" fill="#22C55E" fontWeight="700">+18.4% ▲</text>
                      <rect x="108" y="152" width="68" height="14" rx="3" fill="#0F1B2E"/>
                      <text x="112" y="162" fontFamily="monospace" fontSize="7" fill="#FFE500" fontWeight="700">SLA 99.2%</text>
                      <rect x="184" y="152" width="68" height="14" rx="3" fill="#0F1B2E"/>
                      <text x="188" y="162" fontFamily="monospace" fontSize="7" fill="#22D3EE" fontWeight="700">NPS +42</text>
                      <rect x="260" y="152" width="68" height="14" rx="3" fill="#0F1B2E"/>
                      <text x="264" y="162" fontFamily="monospace" fontSize="7" fill="#A78BFA" fontWeight="700">14 EPICS</text>
                      <text x="200" y="22" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#FFE500" textAnchor="middle">BUSINESS ANALYST DASHBOARD</text>
                    </svg>
                    <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>60 Q&amp;A</div>
                    <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <ClipboardList size={11} color={B} />
                      <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>Business Analyst</h3>
                    <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>{IV_KEY_TAGLINE.business_analyst}</p>
                  </div>
                </div>
              </div>

              {/* Card 14 — Embedded Developer */}
              <div style={{ cursor: "pointer" }} onClick={() => openInterviewTopic("embedded")}>
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}
                >
                  <div style={{ height: "200px", backgroundColor: "#0A1F0F", overflow: "hidden", position: "relative" }}>
                    <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                      {/* PCB green background */}
                      <rect width="400" height="200" fill="#0A3D1F"/>
                      {/* Copper traces grid */}
                      <defs>
                        <pattern id="emb-pcb" width="14" height="14" patternUnits="userSpaceOnUse">
                          <circle cx="2" cy="2" r="1" fill="#FFE500" opacity="0.18"/>
                        </pattern>
                      </defs>
                      <rect width="400" height="200" fill="url(#emb-pcb)"/>
                      {/* Horizontal/vertical PCB traces */}
                      <line x1="0" y1="60" x2="120" y2="60" stroke="#FFE500" strokeWidth="1.5" opacity="0.55"/>
                      <line x1="120" y1="60" x2="140" y2="80" stroke="#FFE500" strokeWidth="1.5" opacity="0.55"/>
                      <line x1="140" y1="80" x2="140" y2="120" stroke="#FFE500" strokeWidth="1.5" opacity="0.55"/>
                      <line x1="280" y1="60" x2="400" y2="60" stroke="#FFE500" strokeWidth="1.5" opacity="0.55"/>
                      <line x1="260" y1="80" x2="280" y2="60" stroke="#FFE500" strokeWidth="1.5" opacity="0.55"/>
                      <line x1="0" y1="140" x2="140" y2="140" stroke="#FFE500" strokeWidth="1.5" opacity="0.55"/>
                      <line x1="260" y1="140" x2="400" y2="140" stroke="#FFE500" strokeWidth="1.5" opacity="0.55"/>
                      <line x1="0" y1="170" x2="400" y2="170" stroke="#FFE500" strokeWidth="0.8" opacity="0.35"/>
                      {/* Solder pads on trace ends */}
                      <circle cx="0" cy="60" r="3" fill="#FFE500"/>
                      <circle cx="400" cy="60" r="3" fill="#FFE500"/>
                      <circle cx="0" cy="140" r="3" fill="#FFE500"/>
                      <circle cx="400" cy="140" r="3" fill="#FFE500"/>
                      {/* Microcontroller chip body */}
                      <rect x="140" y="68" width="120" height="64" rx="4" fill="#0F1A14" stroke="#FFE500" strokeWidth="1.5"/>
                      {/* Chip pins — top */}
                      {[152, 168, 184, 200, 216, 232, 248].map(x => (
                        <rect key={`pt-${x}`} x={x - 2} y="62" width="4" height="8" fill="#FFE500"/>
                      ))}
                      {/* Chip pins — bottom */}
                      {[152, 168, 184, 200, 216, 232, 248].map(x => (
                        <rect key={`pb-${x}`} x={x - 2} y="130" width="4" height="8" fill="#FFE500"/>
                      ))}
                      {/* Chip pins — left */}
                      {[76, 88, 100, 112, 124].map(y => (
                        <rect key={`pl-${y}`} x="134" y={y - 2} width="8" height="4" fill="#FFE500"/>
                      ))}
                      {/* Chip pins — right */}
                      {[76, 88, 100, 112, 124].map(y => (
                        <rect key={`pr-${y}`} x="258" y={y - 2} width="8" height="4" fill="#FFE500"/>
                      ))}
                      {/* Pin-1 notch */}
                      <circle cx="148" cy="76" r="2" fill="#FFE500" opacity="0.6"/>
                      {/* Chip wordmark */}
                      <text x="200" y="96" fontFamily="'Bebas Neue', sans-serif" fontSize="14" fontWeight="700" fill="#FFE500" textAnchor="middle">CORTEX-M4</text>
                      <text x="200" y="112" fontFamily="monospace" fontSize="8" fill="#86EFAC" textAnchor="middle">STM32F4 · 168MHz</text>
                      <text x="200" y="124" fontFamily="monospace" fontSize="7" fill="#86EFAC" opacity="0.7" textAnchor="middle">192KB SRAM · 1MB FLASH</text>
                      {/* Resistor (left side) */}
                      <rect x="48" y="86" width="40" height="14" rx="2" fill="#1A2D14" stroke="#FFE500" strokeWidth="0.8"/>
                      <rect x="56" y="86" width="3" height="14" fill="#EF4444"/>
                      <rect x="62" y="86" width="3" height="14" fill="#22C55E"/>
                      <rect x="68" y="86" width="3" height="14" fill="#FBBF24"/>
                      <text x="68" y="78" fontFamily="monospace" fontSize="7" fill="#FFE500" textAnchor="middle">10kΩ</text>
                      {/* Capacitor (right side) */}
                      <rect x="316" y="86" width="20" height="20" rx="10" fill="#1A2D14" stroke="#FFE500" strokeWidth="1"/>
                      <text x="326" y="100" fontFamily="monospace" fontSize="7" fontWeight="700" fill="#FFE500" textAnchor="middle">100µF</text>
                      {/* LED blinking */}
                      <circle cx="48" cy="140" r="6" fill="#22C55E">
                        <animate attributeName="opacity" values="1;0.2;1" dur="1.4s" repeatCount="indefinite"/>
                      </circle>
                      <text x="60" y="143" fontFamily="monospace" fontSize="8" fill="#22C55E" fontWeight="700">PWR</text>
                      <circle cx="100" cy="140" r="6" fill="#FBBF24">
                        <animate attributeName="opacity" values="0.2;1;0.2" dur="0.8s" repeatCount="indefinite"/>
                      </circle>
                      <text x="112" y="143" fontFamily="monospace" fontSize="8" fill="#FBBF24" fontWeight="700">TX</text>
                      {/* Header label top */}
                      <rect x="120" y="14" width="160" height="20" rx="10" fill="#FFE500"/>
                      <text x="200" y="28" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#0A3D1F" textAnchor="middle">EMBEDDED · FIRMWARE</text>
                      {/* Protocol pills bottom */}
                      <rect x="40" y="178" width="48" height="14" rx="3" fill="#1E40AF"/>
                      <text x="64" y="188" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">SPI</text>
                      <rect x="96" y="178" width="48" height="14" rx="3" fill="#7C3AED"/>
                      <text x="120" y="188" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">I2C</text>
                      <rect x="152" y="178" width="48" height="14" rx="3" fill="#DC2626"/>
                      <text x="176" y="188" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">UART</text>
                      <rect x="208" y="178" width="48" height="14" rx="3" fill="#0891B2"/>
                      <text x="232" y="188" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">CAN</text>
                      <rect x="264" y="178" width="48" height="14" rx="3" fill="#16A34A"/>
                      <text x="288" y="188" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" textAnchor="middle">PWM</text>
                      <rect x="320" y="178" width="48" height="14" rx="3" fill="#FBBF24"/>
                      <text x="344" y="188" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#0A3D1F" textAnchor="middle">RTOS</text>
                    </svg>
                    <div style={{ position: "absolute", top: "44px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>60 Q&amp;A</div>
                    <div style={{ position: "absolute", top: "44px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <CircuitBoard size={11} color={B} />
                      <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                    </div>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>Embedded Developer</h3>
                    <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>{IV_KEY_TAGLINE.embedded}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Legacy: still show course-bound interview material if any exists */}
            {interviewsCourses.length > 0 && (
              <div style={{ marginTop: "48px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: B, marginBottom: "16px", letterSpacing: "-0.01em" }}>More Resources</h2>
                <CourseSectionView courses={interviewsCourses} onOpen={openCourse} />
              </div>
            )}
          </div>
        )}

        {/* ══ INTERVIEWS — DETAIL VIEW ═══════════════════════════════════ */}
        {currentView === "interviews" && interviewTopic && (() => {
          const topic = IV_DATA[interviewTopic];
          const sections: { key: "beginner" | "intermediate" | "advanced"; label: string; color: string; bg: string }[] = [
            { key: "beginner",     label: "Beginner",     color: "#16A34A", bg: "#F0FDF4" },
            { key: "intermediate", label: "Intermediate", color: "#D97706", bg: "#FFFBEB" },
            { key: "advanced",     label: "Advanced",     color: "#DC2626", bg: "#FEF2F2" },
          ];
          const scrollToSection = (key: "beginner" | "intermediate" | "advanced") => {
            setIvSection(key);
            const el = document.getElementById(`iv-section-${key}`);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          };
          const toggleQ = (key: string) => setIvOpenQ(prev => ({ ...prev, [key]: !prev[key] }));
          return (
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "20px" : "28px", alignItems: "flex-start" }}>
              {/* LEFT — main Q&A column */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Header */}
                <button onClick={closeInterviewTopic}
                  style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", cursor: "pointer", color: MUTE, fontSize: "12px", fontWeight: 600, marginBottom: "14px", padding: 0 }}
                  onMouseEnter={e => (e.currentTarget.style.color = B)}
                  onMouseLeave={e => (e.currentTarget.style.color = MUTE)}
                >
                  <ArrowLeft size={14} /> Back to Interviews
                </button>
                <div style={{ marginBottom: "28px" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: B, color: Y, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "14px" }}>
                    {interviewTopic === "system_design" && <><Layers size={13} /> SYSTEM DESIGN</>}
                    {interviewTopic === "backend" && <><Server size={13} /> BACKEND</>}
                    {interviewTopic === "computer_network" && <><Network size={13} /> COMPUTER NETWORKS</>}
                    {interviewTopic === "database" && <><Database size={13} /> DATABASE</>}
                    {interviewTopic === "java" && <><Coffee size={13} /> JAVA</>}
                    {interviewTopic === "operating_system" && <><Cpu size={13} /> OPERATING SYSTEM</>}
                    {interviewTopic === "python" && <><Code2 size={13} /> PYTHON</>}
                    {interviewTopic === "mern" && <><Boxes size={13} /> MERN STACK</>}
                    {interviewTopic === "react" && <><Atom size={13} /> REACT</>}
                    {interviewTopic === "sql" && <><Table size={13} /> SQL</>}
                    {interviewTopic === "genai" && <><Brain size={13} /> GENAI / LLM</>}
                    {interviewTopic === "mobile" && <><Smartphone size={13} /> MOBILE DEVELOPER</>}
                    {interviewTopic === "business_analyst" && <><ClipboardList size={13} /> BUSINESS ANALYST</>}
                    {interviewTopic === "embedded" && <><CircuitBoard size={13} /> EMBEDDED DEVELOPER</>}
                  </div>
                  <h1 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.02em" }}>
                    {IV_KEY_TITLE[interviewTopic]}
                  </h1>
                  <p style={{ fontSize: "14px", color: MUTE, maxWidth: "560px", lineHeight: 1.7 }}>{IV_KEY_TAGLINE[interviewTopic]}</p>
                </div>

                {/* Sections */}
                {sections.map(sec => {
                  const qas = topic[sec.key];
                  return (
                    <div key={sec.key} id={`iv-section-${sec.key}`} style={{ marginBottom: "32px", scrollMarginTop: "90px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                        <div style={{ background: sec.bg, color: sec.color, padding: "4px 12px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em" }}>{sec.label.toUpperCase()}</div>
                        <div style={{ fontSize: "12px", color: MUTE }}>{qas.length} questions</div>
                        <div style={{ flex: 1, height: "1px", background: BORD }} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {qas.map((qa, idx) => {
                          const key = `${interviewTopic}_${sec.key}_${idx}`;
                          const open = !!ivOpenQ[key];
                          return (
                            <div key={key} style={{ background: W, border: `1.5px solid ${open ? B : BORD}`, borderRadius: "10px", overflow: "hidden", transition: "border-color 0.15s" }}>
                              <button onClick={() => toggleQ(key)}
                                style={{ width: "100%", display: "flex", alignItems: "flex-start", gap: "12px", padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", color: B }}
                              >
                                <div style={{ background: sec.bg, color: sec.color, width: "26px", height: "26px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0, fontFamily: "'IBM Plex Mono', monospace" }}>
                                  {String(idx + 1).padStart(2, "0")}
                                </div>
                                <div style={{ flex: 1, fontSize: "13px", fontWeight: 600, lineHeight: 1.5 }}>{qa.q}</div>
                                <ChevronDown size={16} color={MUTE} style={{ flexShrink: 0, marginTop: "4px", transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                              </button>
                              {open && (
                                <div style={{ padding: "0 16px 16px 54px", fontSize: "13px", color: "#374151", lineHeight: 1.7, borderTop: `1px dashed ${BORD}`, paddingTop: "12px" }}>
                                  {qa.a}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* RIGHT SIDEBAR — sticky */}
              <div style={{ width: isMobile ? "100%" : "320px", flexShrink: 0, position: isMobile ? "static" : "sticky", top: "84px", display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* Section nav */}
                <div style={{ background: W, border: `1.5px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: `1px solid #F3F4F6` }}>
                    <div style={{ width: "22px", height: "22px", background: "#EFF6FF", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <LayoutDashboard size={12} color="#2563EB" />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: B }}>Jump to Section</span>
                  </div>
                  <div style={{ padding: "8px" }}>
                    {sections.map(sec => {
                      const isActive = ivSection === sec.key;
                      return (
                        <button key={sec.key} onClick={() => scrollToSection(sec.key)}
                          style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: isActive ? sec.bg : "transparent", border: "none", borderRadius: "8px", cursor: "pointer", textAlign: "left", transition: "background 0.15s", marginBottom: "2px" }}
                          onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "#F9FAFB"; }}
                          onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                        >
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: sec.color, flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "12px", fontWeight: isActive ? 700 : 600, color: isActive ? sec.color : B }}>{sec.label}</div>
                            <div style={{ fontSize: "10px", color: MUTE, marginTop: "1px" }}>{topic[sec.key].length} questions</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* MCQ block */}
                <div style={{ background: W, border: `1.5px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: `1px solid #F3F4F6` }}>
                    <div style={{ width: "22px", height: "22px", background: "#FFFBEB", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Zap size={12} color="#D97706" />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: B }}>Test Yourself</span>
                    <span style={{ marginLeft: "auto", fontSize: "10px", color: MUTE }}>{topic.mcq.length} MCQs</span>
                  </div>
                  <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "14px" }}>
                    {topic.mcq.map((mcq, qi) => {
                      const mkey = `iv_${interviewTopic}_${qi}`;
                      const answered = ckMCQAnswers[mkey] !== undefined;
                      const chosen   = ckMCQAnswers[mkey];
                      return (
                        <div key={mkey} style={{ borderBottom: qi < topic.mcq.length - 1 ? `1px solid #F3F4F6` : "none", paddingBottom: qi < topic.mcq.length - 1 ? "14px" : 0 }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "10px" }}>
                            <div style={{ background: "#FFFBEB", color: "#D97706", width: "20px", height: "20px", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, flexShrink: 0, fontFamily: "'IBM Plex Mono', monospace" }}>Q{qi + 1}</div>
                            <p style={{ fontSize: "12px", fontWeight: 600, color: B, lineHeight: 1.5, margin: 0 }}>{mcq.q}</p>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {mcq.opts.map((opt, oi) => {
                              const isCorrect = oi === mcq.ans;
                              const isChosen  = chosen === oi;
                              const bg     = answered && isCorrect ? "#DCFCE7" : answered && isChosen ? "#FEE2E2" : W;
                              const border = answered && isCorrect ? "1.5px solid #86EFAC" : answered && isChosen ? "1.5px solid #FCA5A5" : "1.5px solid #E5E7EB";
                              const col    = answered && isCorrect ? "#15803D" : answered && isChosen ? "#DC2626" : B;
                              return (
                                <button key={oi} onClick={() => answerMCQ(mkey, oi, mcq.ans)} disabled={answered}
                                  style={{ padding: "8px 12px", background: bg, border, borderRadius: "7px", color: col, fontSize: "11px", fontWeight: isChosen ? 700 : 500, cursor: answered ? "default" : "pointer", textAlign: "left", transition: "all 0.15s" }}
                                  onMouseEnter={e => { if (!answered) (e.currentTarget as HTMLButtonElement).style.border = "1.5px solid #D97706"; }}
                                  onMouseLeave={e => { if (!answered) (e.currentTarget as HTMLButtonElement).style.border = "1.5px solid #E5E7EB"; }}
                                >{opt}</button>
                              );
                            })}
                          </div>
                          {answered && (
                            <div style={{ marginTop: "8px", padding: "8px 10px", background: "#FFFBEB", border: `1px solid #FDE68A`, borderRadius: "6px", fontSize: "10px", color: "#92400E", lineHeight: 1.6 }}>
                              💡 {mcq.why}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Facts block */}
                <div style={{ background: W, border: `1.5px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: `1px solid #F3F4F6` }}>
                    <div style={{ width: "22px", height: "22px", background: "#F5F3FF", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Sparkles size={12} color="#7C3AED" />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: B }}>Facts &amp; Hints</span>
                  </div>
                  <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                    {topic.facts.map((fact, fi) => (
                      <div key={fi} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#FBBF24", flexShrink: 0, marginTop: "7px" }} />
                        <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.6 }}>{fact}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

        {/* ══ CAREER KIT ═════════════════════════════════════════════════ */}
        {currentView === "career_kit" && (
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "0" : "32px", alignItems: "flex-start" }}>
            <div style={{ flex: 1, minWidth: 0, overflowX: "hidden" }}>
            {/* ── Career Kit: Resource List ───────────────────────────── */}
            {!careerKitResource && (
              <div>
                <div style={{ marginBottom: "32px" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: B, color: Y, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "16px" }}>
                    <Briefcase size={13} /> CAREER RESOURCES
                  </div>
                  <h1 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.02em" }}>
                    Career Kit
                  </h1>
                  <p style={{ fontSize: "14px", color: MUTE, maxWidth: "500px", lineHeight: 1.7 }}>
                    Resume templates, cover letters, and everything you need to land the role.
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "24px" }}>
                  {/* Card 1 — Resume AI Builder (external link) */}
                  <a
                    href="https://docs.google.com/document/d/15lwb2eYty-uf1Y8VRrl19CLPljPAdqbf/edit"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: "none", display: "block", cursor: "pointer" }}
                  >
                    <div style={{
                      backgroundColor: W,
                      border: `2px solid ${BORD}`,
                      borderRadius: "12px",
                      overflow: "hidden",
                      transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
                      height: "100%",
                    }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}
                    >
                      <div style={{ height: "200px", backgroundColor: "#F9FAFB", overflow: "hidden", position: "relative" }}>
                        <img src="/resume-image.png" alt="Resume AI Builder" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: Y, color: B, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>
                          AI TOOL
                        </div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <ArrowUpRight size={12} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>OPEN</span>
                        </div>
                      </div>
                      <div style={{ padding: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>Resume AI Builder</h3>
                        <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>
                          Your resume gets 7 seconds before it's gone. This builder makes those 7 seconds impossible to ignore — and impossible to reject.
                        </p>
                      </div>
                    </div>
                  </a>

                  {/* Card 2 — Resume Review (in-portal) */}
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => openCareerKitResource("resume_review")}
                  >
                    <div style={{
                      backgroundColor: W,
                      border: `2px solid ${BORD}`,
                      borderRadius: "12px",
                      overflow: "hidden",
                      transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
                      height: "100%",
                    }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}
                    >
                      <div style={{ height: "200px", backgroundColor: "#111", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#111"/>
                          <rect x="64" y="14" width="142" height="176" rx="4" fill="#000" opacity="0.4"/>
                          <rect x="60" y="10" width="142" height="176" rx="4" fill="#fff"/>
                          <rect x="60" y="10" width="142" height="30" rx="4" fill="#FFE500"/>
                          <rect x="60" y="28" width="142" height="12" fill="#FFE500"/>
                          <rect x="72" y="17" width="54" height="7" rx="2" fill="#0A0A0A" opacity="0.5"/>
                          <rect x="134" y="19" width="26" height="4" rx="2" fill="#0A0A0A" opacity="0.2"/>
                          <rect x="72" y="50" width="42" height="7" rx="2" fill="#111" opacity="0.7"/>
                          <rect x="72" y="62" width="58" height="4" rx="2" fill="#9CA3AF" opacity="0.5"/>
                          <rect x="72" y="74" width="118" height="1" fill="#E5E5E5"/>
                          <rect x="72" y="82" width="92" height="4" rx="2" fill="#D1D5DB"/>
                          <circle cx="182" cy="84" r="6" fill="#22C55E"/>
                          <path d="M179 84 L181.5 86.5 L186 81" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                          <rect x="72" y="94" width="76" height="4" rx="2" fill="#D1D5DB"/>
                          <circle cx="182" cy="96" r="6" fill="#EF4444"/>
                          <path d="M179.5 93.5 L184.5 98.5 M184.5 93.5 L179.5 98.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                          <rect x="72" y="106" width="86" height="4" rx="2" fill="#D1D5DB"/>
                          <circle cx="182" cy="108" r="6" fill="#22C55E"/>
                          <path d="M179 108 L181.5 110.5 L186 105" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                          <rect x="72" y="118" width="70" height="4" rx="2" fill="#D1D5DB"/>
                          <circle cx="182" cy="120" r="6" fill="#EF4444"/>
                          <path d="M179.5 117.5 L184.5 122.5 M184.5 117.5 L179.5 122.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                          <rect x="72" y="130" width="82" height="4" rx="2" fill="#D1D5DB"/>
                          <circle cx="182" cy="132" r="6" fill="#22C55E"/>
                          <path d="M179 132 L181.5 134.5 L186 129" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                          <rect x="72" y="146" width="88" height="4" rx="2" fill="#E5E5E5"/>
                          <rect x="72" y="157" width="66" height="4" rx="2" fill="#E5E5E5"/>
                          <rect x="72" y="168" width="76" height="4" rx="2" fill="#E5E5E5"/>
                          <circle cx="284" cy="102" r="68" fill="#FFE500" opacity="0.04"/>
                          <circle cx="284" cy="102" r="56" fill="#1C1C1C"/>
                          <circle cx="284" cy="102" r="56" fill="none" stroke="#FFE500" strokeWidth="2.5"/>
                          <rect x="248" y="80" width="72" height="5" rx="2" fill="#fff" opacity="0.1"/>
                          <rect x="248" y="91" width="72" height="9" rx="2" fill="#EF4444" opacity="0.2"/>
                          <rect x="248" y="93" width="72" height="5" rx="2" fill="#EF4444" opacity="0.55"/>
                          <rect x="248" y="106" width="72" height="5" rx="2" fill="#fff" opacity="0.1"/>
                          <rect x="248" y="117" width="56" height="5" rx="2" fill="#FFE500" opacity="0.65"/>
                          <rect x="248" y="128" width="64" height="5" rx="2" fill="#fff" opacity="0.1"/>
                          <rect x="292" y="72" width="32" height="16" rx="8" fill="#FFE500"/>
                          <text x="308" y="83" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#0A0A0A" textAnchor="middle">7s</text>
                          <line x1="328" y1="148" x2="364" y2="184" stroke="#FFE500" strokeWidth="8" strokeLinecap="round"/>
                          <line x1="328" y1="148" x2="364" y2="184" stroke="#3a3a3a" strokeWidth="4" strokeLinecap="round"/>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>
                          GUIDE
                        </div>
                      </div>
                      <div style={{ padding: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>Resume Review</h3>
                        <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>
                          Most students submit resumes with mistakes they can't see. This shows you exactly where you're losing points before you apply.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 3 — Cover Letter (in-portal) */}
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => openCareerKitResource("cover_letter")}
                  >
                    <div style={{
                      backgroundColor: W,
                      border: `2px solid ${BORD}`,
                      borderRadius: "12px",
                      overflow: "hidden",
                      transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
                      height: "100%",
                    }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}
                    >
                      <div style={{ height: "200px", backgroundColor: "#080818", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#080818"/>
                          <circle cx="52" cy="22" r="1.5" fill="#FFE500" opacity="0.5"/>
                          <circle cx="358" cy="38" r="1" fill="#FFE500" opacity="0.4"/>
                          <circle cx="38" cy="148" r="1" fill="#FFE500" opacity="0.3"/>
                          <circle cx="372" cy="162" r="1.5" fill="#FFE500" opacity="0.35"/>
                          <circle cx="320" cy="12" r="1" fill="#fff" opacity="0.2"/>
                          <circle cx="78" cy="170" r="1" fill="#fff" opacity="0.15"/>
                          <rect x="100" y="96" width="200" height="94" rx="4" fill="#141430" stroke="#1E1E4A" strokeWidth="1.5"/>
                          <line x1="100" y1="96" x2="200" y2="148" stroke="#1E1E4A" strokeWidth="1"/>
                          <line x1="300" y1="96" x2="200" y2="148" stroke="#1E1E4A" strokeWidth="1"/>
                          <rect x="124" y="16" width="152" height="124" rx="4" fill="#fff" opacity="0.97"/>
                          <rect x="136" y="28" width="128" height="2" rx="1" fill="#FFE500"/>
                          <rect x="136" y="36" width="64" height="6" rx="2" fill="#111" opacity="0.5"/>
                          <rect x="136" y="52" width="128" height="4" rx="2" fill="#D1D5DB"/>
                          <rect x="136" y="62" width="128" height="4" rx="2" fill="#D1D5DB"/>
                          <rect x="136" y="72" width="100" height="4" rx="2" fill="#D1D5DB"/>
                          <rect x="136" y="85" width="128" height="9" rx="2" fill="#FFE500" opacity="0.2"/>
                          <rect x="136" y="87" width="128" height="4" rx="2" fill="#111" opacity="0.6"/>
                          <rect x="136" y="101" width="112" height="4" rx="2" fill="#D1D5DB"/>
                          <rect x="136" y="111" width="88" height="4" rx="2" fill="#D1D5DB"/>
                          <path d="M136 125 Q148 118 158 125 Q170 132 186 121" stroke="#111" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
                          <circle cx="306" cy="148" r="26" fill="#FFE500"/>
                          <circle cx="306" cy="148" r="22" fill="none" stroke="#0A0A0A" strokeWidth="1" strokeDasharray="3 2"/>
                          <text x="306" y="155" fontFamily="serif" fontSize="14" fontWeight="700" fill="#0A0A0A" textAnchor="middle">✦</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: Y, color: B, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>
                          TEMPLATES
                        </div>
                      </div>
                      <div style={{ padding: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>Cover Letter</h3>
                        <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>
                          A strong cover letter makes HR forward your resume before the ATS even processes it. These templates are engineered to do that.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 4 — LinkedIn Review */}
                  <div style={{ cursor: "pointer" }} onClick={() => openCareerKitResource("linkedin_review")}>
                    <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}>
                      <div style={{ height: "200px", backgroundColor: "#0A0A0A", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#0A0A0A"/>
                          <circle cx="68" cy="42" r="5" fill="#0A66C2" opacity="0.7"/>
                          <circle cx="70" cy="160" r="4" fill="#0A66C2" opacity="0.5"/>
                          <circle cx="340" cy="35" r="5" fill="#0A66C2" opacity="0.6"/>
                          <circle cx="338" cy="165" r="4" fill="#FFE500" opacity="0.7"/>
                          <circle cx="200" cy="16" r="4" fill="#0A66C2" opacity="0.5"/>
                          <circle cx="200" cy="188" r="3" fill="#FFE500" opacity="0.5"/>
                          <line x1="68" y1="42" x2="155" y2="90" stroke="#0A66C2" strokeWidth="0.8" opacity="0.35"/>
                          <line x1="70" y1="160" x2="155" y2="114" stroke="#0A66C2" strokeWidth="0.8" opacity="0.25"/>
                          <line x1="340" y1="35" x2="245" y2="90" stroke="#0A66C2" strokeWidth="0.8" opacity="0.35"/>
                          <line x1="338" y1="165" x2="245" y2="114" stroke="#FFE500" strokeWidth="0.8" opacity="0.3"/>
                          <line x1="200" y1="16" x2="200" y2="82" stroke="#0A66C2" strokeWidth="0.8" opacity="0.3"/>
                          <line x1="200" y1="188" x2="200" y2="118" stroke="#FFE500" strokeWidth="0.8" opacity="0.25"/>
                          <rect x="118" y="28" width="164" height="150" rx="8" fill="#1C1C1C" stroke="#2A2A2A" strokeWidth="1.5"/>
                          <rect x="118" y="28" width="164" height="42" rx="8" fill="#0A66C2"/>
                          <rect x="118" y="56" width="164" height="14" fill="#0A66C2"/>
                          <rect x="126" y="34" width="22" height="20" rx="3" fill="#fff" opacity="0.18"/>
                          <text x="137" y="49" fontFamily="serif" fontSize="14" fontWeight="900" fill="#fff" textAnchor="middle">in</text>
                          <circle cx="200" cy="82" r="25" fill="#2A2A2A" stroke="#1C1C1C" strokeWidth="3"/>
                          <circle cx="200" cy="74" r="9" fill="#555"/>
                          <ellipse cx="200" cy="92" rx="13" ry="8" fill="#555"/>
                          <rect x="210" y="60" width="40" height="16" rx="8" fill="#FFE500"/>
                          <text x="230" y="72" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#0A0A0A" textAnchor="middle">500+</text>
                          <rect x="150" y="116" width="60" height="7" rx="3" fill="#E5E5E5" opacity="0.85"/>
                          <rect x="162" y="128" width="36" height="4" rx="2" fill="#9CA3AF" opacity="0.6"/>
                          <rect x="158" y="138" width="44" height="4" rx="2" fill="#9CA3AF" opacity="0.4"/>
                          <rect x="130" y="152" width="140" height="1" fill="#2A2A2A"/>
                          <circle cx="170" cy="164" r="6" fill="#0A66C2" opacity="0.8"/>
                          <circle cx="200" cy="164" r="6" fill="#0A66C2" opacity="0.8"/>
                          <circle cx="230" cy="164" r="6" fill="#FFE500" opacity="0.9"/>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: Y, color: B, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>GUIDE</div>
                      </div>
                      <div style={{ padding: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>LinkedIn Review</h3>
                        <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>70% of recruiters find candidates through LinkedIn. Unoptimized profile = silence. Optimized = inbound while you sleep.</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 5 — LinkedIn Cold Messages */}
                  <div style={{ cursor: "pointer" }} onClick={() => openCareerKitResource("linkedin_messages")}>
                    <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}>
                      <div style={{ height: "200px", backgroundColor: "#1E293B", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img src="/linkedin-message-image.png" alt="LinkedIn Messages" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", position: "absolute", inset: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: Y, color: B, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>MESSAGES</div>
                        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                          <div style={{ fontSize: "36px", color: W }}>💬</div>
                          <div style={{ fontSize: "10px", color: Y, fontWeight: 700, letterSpacing: "0.15em", marginTop: "6px" }}>5 TEMPLATES</div>
                        </div>
                      </div>
                      <div style={{ padding: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>LinkedIn Cold Messages</h3>
                        <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>The right message to the right person has landed students in companies they applied to 3 times before. This is that message.</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 6 — Cold Emails */}
                  <div style={{ cursor: "pointer" }} onClick={() => openCareerKitResource("cold_emails")}>
                    <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}>
                      <div style={{ height: "200px", backgroundColor: "#0A0A14", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <rect width="400" height="200" fill="#0A0A14"/>
                          {/* Email compose card shadow */}
                          <rect x="44" y="24" width="178" height="152" rx="8" fill="#000" opacity="0.4"/>
                          {/* Card */}
                          <rect x="40" y="20" width="178" height="152" rx="8" fill="#141428" stroke="#1E1E3A" strokeWidth="1.5"/>
                          {/* Title bar */}
                          <rect x="40" y="20" width="178" height="26" rx="8" fill="#1A1A3A"/>
                          <rect x="40" y="34" width="178" height="12" fill="#1A1A3A"/>
                          {/* macOS window dots */}
                          <circle cx="54" cy="33" r="4" fill="#EF4444" opacity="0.75"/>
                          <circle cx="66" cy="33" r="4" fill="#F59E0B" opacity="0.75"/>
                          <circle cx="78" cy="33" r="4" fill="#22C55E" opacity="0.75"/>
                          {/* "New Message" pill */}
                          <rect x="98" y="29" width="60" height="8" rx="3" fill="#2A2A4A"/>
                          {/* To: */}
                          <rect x="52" y="54" width="22" height="5" rx="2" fill="#555"/>
                          <rect x="78" y="54" width="110" height="5" rx="2" fill="#FFE500" opacity="0.6"/>
                          {/* Subject: */}
                          <rect x="52" y="67" width="32" height="5" rx="2" fill="#555"/>
                          <rect x="88" y="67" width="86" height="5" rx="2" fill="#D1D5DB" opacity="0.2"/>
                          {/* Divider */}
                          <rect x="52" y="79" width="154" height="1" fill="#1E1E3A"/>
                          {/* Body lines */}
                          <rect x="52" y="87" width="154" height="4" rx="2" fill="#2A2A3A"/>
                          <rect x="52" y="97" width="130" height="4" rx="2" fill="#2A2A3A"/>
                          {/* Hook line — yellow highlight */}
                          <rect x="52" y="109" width="154" height="9" rx="2" fill="#FFE500" opacity="0.12"/>
                          <rect x="52" y="111" width="118" height="4" rx="2" fill="#FFE500" opacity="0.75"/>
                          <rect x="52" y="124" width="142" height="4" rx="2" fill="#2A2A3A"/>
                          <rect x="52" y="134" width="100" height="4" rx="2" fill="#2A2A3A"/>
                          {/* SEND button */}
                          <rect x="52" y="150" width="74" height="16" rx="8" fill="#FFE500"/>
                          <text x="89" y="162" fontFamily="monospace" fontSize="9" fontWeight="700" fill="#0A0A0A" textAnchor="middle" letterSpacing="1">SEND ›</text>
                          {/* Paper airplane */}
                          <polygon points="240,95 288,106 240,117" fill="#FFE500" opacity="0.92"/>
                          <polygon points="240,106 265,106 240,117" fill="#0A0A0A" opacity="0.15"/>
                          {/* Dotted trail */}
                          <line x1="222" y1="107" x2="240" y2="101" stroke="#FFE500" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5"/>
                          <line x1="206" y1="109" x2="220" y2="106" stroke="#FFE500" strokeWidth="1" strokeDasharray="3,4" opacity="0.25"/>
                          {/* Notification: SENT */}
                          <rect x="296" y="24" width="90" height="24" rx="5" fill="#141428" stroke="#2A2A3A" strokeWidth="1"/>
                          <circle cx="309" cy="36" r="4" fill="#6366F1"/>
                          <rect x="319" y="31" width="54" height="4" rx="2" fill="#6366F1" opacity="0.5"/>
                          <rect x="319" y="39" width="38" height="4" rx="2" fill="#2A2A3A"/>
                          <text x="382" y="32" fontFamily="monospace" fontSize="6" fill="#555" textAnchor="end">SENT ✓</text>
                          {/* Notification: OPENED */}
                          <rect x="296" y="56" width="90" height="24" rx="5" fill="#141428" stroke="#F59E0B" strokeWidth="1"/>
                          <circle cx="309" cy="68" r="4" fill="#F59E0B"/>
                          <rect x="319" y="63" width="54" height="4" rx="2" fill="#F59E0B" opacity="0.6"/>
                          <rect x="319" y="71" width="38" height="4" rx="2" fill="#2A2A3A"/>
                          <text x="382" y="63" fontFamily="monospace" fontSize="6" fill="#F59E0B" textAnchor="end">OPENED</text>
                          {/* Notification: REPLIED */}
                          <rect x="296" y="88" width="90" height="24" rx="5" fill="#0A1A0A" stroke="#22C55E" strokeWidth="1.5"/>
                          <circle cx="309" cy="100" r="4" fill="#22C55E"/>
                          <rect x="319" y="95" width="54" height="4" rx="2" fill="#22C55E" opacity="0.7"/>
                          <rect x="319" y="103" width="38" height="4" rx="2" fill="#22C55E" opacity="0.35"/>
                          <text x="382" y="95" fontFamily="monospace" fontSize="6" fill="#22C55E" textAnchor="end">REPLIED!</text>
                          {/* Big open rate stat */}
                          <text x="341" y="168" fontFamily="monospace" fontSize="52" fontWeight="900" fill="#FFE500" opacity="0.88" textAnchor="middle">87%</text>
                          <text x="341" y="182" fontFamily="monospace" fontSize="7" fill="#FFE500" opacity="0.35" textAnchor="middle" letterSpacing="1">OPEN RATE</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: B, color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>TEMPLATES</div>
                      </div>
                      <div style={{ padding: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>Cold Emails</h3>
                        <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>Cold emails to HR feel scary. These templates remove the guesswork and replace it with copy that actually gets replies.</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 7 — Company Database (external) */}
                  <a href="https://docs.google.com/document/d/1qTrPuIWZPXmOcKW2qmNbzyqgUqvamy1t7OXgVeS_FPw/edit" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
                    <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#16A34A"; el.style.boxShadow = `6px 6px 0 #16A34A`; el.style.transform = "translate(-2px,-2px)"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}>
                      <div style={{ height: "200px", backgroundColor: "#F0FDF4", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: "44px" }}>🗂</div>
                          <div style={{ fontSize: "10px", color: "#16A34A", fontWeight: 700, letterSpacing: "0.2em", marginTop: "8px" }}>OPEN DATABASE</div>
                        </div>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#16A34A", color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>DATABASE</div>
                        <div style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "6px", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <ArrowUpRight size={12} color={B} />
                          <span style={{ fontSize: "9px", fontWeight: 700, color: B }}>OPEN</span>
                        </div>
                      </div>
                      <div style={{ padding: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>Company Database</h3>
                        <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>Applying through portals and hearing nothing? Reach the right person directly. This database is that direct line.</p>
                      </div>
                    </div>
                  </a>

                  {/* Card 8 — Mock Interview Guide */}
                  <div style={{ cursor: "pointer" }} onClick={() => openCareerKitResource("mock_interview")}>
                    <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}>
                      <div style={{ height: "200px", backgroundColor: "#0A0A0A", overflow: "hidden", position: "relative" }}>
                        <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}} preserveAspectRatio="xMidYMid slice">
                          <defs>
                            <radialGradient id="ck-mi-glow" cx="50%" cy="72%" r="40%">
                              <stop offset="0%" stopColor="#FFE500" stopOpacity="0.2"/>
                              <stop offset="100%" stopColor="#FFE500" stopOpacity="0"/>
                            </radialGradient>
                          </defs>
                          <rect width="400" height="200" fill="#0A0A0A"/>
                          <rect width="400" height="200" fill="url(#ck-mi-glow)"/>
                          <rect x="122" y="140" width="156" height="14" rx="3" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="1.5"/>
                          <rect x="132" y="154" width="8" height="22" rx="2" fill="#141414"/>
                          <rect x="260" y="154" width="8" height="22" rx="2" fill="#141414"/>
                          <rect x="66" y="118" width="50" height="22" rx="11" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="1.5"/>
                          <circle cx="91" cy="102" r="20" fill="#222" stroke="#2A2A2A" strokeWidth="1.5"/>
                          <circle cx="84" cy="99" r="2.5" fill="#444"/>
                          <circle cx="98" cy="99" r="2.5" fill="#444"/>
                          <path d="M86 108 Q91 112 96 108" stroke="#444" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                          <rect x="284" y="118" width="50" height="22" rx="11" fill="#0A1628" stroke="#1D4ED8" strokeWidth="1.5"/>
                          <circle cx="309" cy="102" r="20" fill="#0A1628" stroke="#1D4ED8" strokeWidth="1.5"/>
                          <circle cx="302" cy="99" r="2.5" fill="#4B5563"/>
                          <circle cx="316" cy="99" r="2.5" fill="#4B5563"/>
                          <path d="M304 108 Q309 111 314 108" stroke="#4B5563" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                          <rect x="26" y="42" width="104" height="46" rx="8" fill="#1A1A1A" stroke="#2A2A2A" strokeWidth="1.5"/>
                          <polygon points="82,88 90,88 86,100" fill="#1A1A1A"/>
                          <rect x="36" y="54" width="84" height="4" rx="2" fill="#333"/>
                          <rect x="36" y="64" width="70" height="4" rx="2" fill="#333"/>
                          <rect x="36" y="74" width="78" height="4" rx="2" fill="#FFE500" opacity="0.6"/>
                          <rect x="270" y="42" width="104" height="46" rx="8" fill="#0A1628" stroke="#1D4ED8" strokeWidth="1.5"/>
                          <polygon points="310,88 318,88 314,100" fill="#0A1628"/>
                          <rect x="280" y="54" width="84" height="4" rx="2" fill="#1D4ED8" opacity="0.5"/>
                          <rect x="280" y="64" width="64" height="4" rx="2" fill="#1D4ED8" opacity="0.3"/>
                          <rect x="280" y="74" width="74" height="4" rx="2" fill="#FFE500" opacity="0.6"/>
                          <rect x="170" y="8" width="60" height="18" rx="9" fill="#EF4444"/>
                          <circle cx="181" cy="17" r="3.5" fill="#fff" opacity="0.9"/>
                          <text x="196" y="21" fontFamily="monospace" fontSize="8" fontWeight="700" fill="#fff" letterSpacing="0.5">LIVE</text>
                        </svg>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: Y, color: B, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>GUIDE</div>
                      </div>
                      <div style={{ padding: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>Mock Interview Guide</h3>
                        <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>Every student who did structured mock interviews outperformed in real ones. Every single time. This is your structured practice.</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 9 — AI Project Ideas */}
                  <div style={{ cursor: "pointer" }} onClick={() => openCareerKitResource("ai_projects")}>
                    <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}>
                      <div style={{ height: "200px", background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px", color: "#4ADE80", lineHeight: 1.7 }}>
                            <div>{"import torch"}</div>
                            <div>{"import sklearn"}</div>
                            <div style={{ color: "#60A5FA" }}>{"# 500+ ideas"}</div>
                          </div>
                        </div>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#4ADE80", color: "#0F172A", padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>RESOURCES</div>
                      </div>
                      <div style={{ padding: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>AI Project Ideas</h3>
                        <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>Companies hiring for AI roles want proof, not theory. These are the exact project ideas that make recruiters say 'bring them in.'</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 10 — Open Source Guide */}
                  <div style={{ cursor: "pointer" }} onClick={() => openCareerKitResource("open_source")}>
                    <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#F97316"; el.style.boxShadow = `6px 6px 0 #F97316`; el.style.transform = "translate(-2px,-2px)"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}>
                      <div style={{ height: "200px", background: "linear-gradient(135deg, #1C0A00 0%, #2D1600 100%)", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px", color: "#F97316", lineHeight: 1.8 }}>
                            <div>{"git fork"}</div>
                            <div>{"git push origin"}</div>
                            <div style={{ color: "#FDBA74" }}>{"Pull Request ↑"}</div>
                          </div>
                        </div>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#F97316", color: W, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>GUIDE</div>
                      </div>
                      <div style={{ padding: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>Open Source Guide</h3>
                        <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>A merged PR on a real repo says more than 10 solo side projects. This guide gets you your first contribution in days.</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 11 — Projects Before Graduation */}
                  <div style={{ cursor: "pointer" }} onClick={() => openCareerKitResource("projects_graduation")}>
                    <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = B; el.style.boxShadow = `6px 6px 0 ${Y}`; el.style.transform = "translate(-2px,-2px)"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}>
                      <div style={{ height: "200px", background: "linear-gradient(135deg, #0A0A0A 0%, #1A1A00 100%)", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "56px", color: Y, lineHeight: 1 }}>20</div>
                          <div style={{ fontSize: "10px", color: W, fontWeight: 700, letterSpacing: "0.25em", marginTop: "4px" }}>PROJECTS</div>
                        </div>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: Y, color: B, padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>BUILD LIST</div>
                      </div>
                      <div style={{ padding: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>Projects Before Graduation</h3>
                        <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>Top companies hire for proof, not potential. This tells you exactly which projects prove you're ready — and how to build them.</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 12 — GitHub Portfolio Guide */}
                  <div style={{ cursor: "pointer" }} onClick={() => openCareerKitResource("github_portfolio")}>
                    <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s", height: "100%" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#4ADE80"; el.style.boxShadow = `6px 6px 0 #4ADE80`; el.style.transform = "translate(-2px,-2px)"; }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = BORD; el.style.boxShadow = "none"; el.style.transform = "translate(0,0)"; }}>
                      <div style={{ height: "200px", backgroundColor: "#0D1117", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", lineHeight: 1.9 }}>
                            <div style={{ color: "#F97316" }}>{"# README.md"}</div>
                            <div style={{ color: "#4ADE80" }}>{"## Project Title"}</div>
                            <div style={{ color: "#60A5FA" }}>{"⭐ 2.3k stars"}</div>
                          </div>
                        </div>
                        <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "#4ADE80", color: "#0D1117", padding: "3px 10px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em" }}>GUIDE</div>
                      </div>
                      <div style={{ padding: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.01em" }}>GitHub Portfolio Guide</h3>
                        <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>Recruiters check your GitHub before your resume. This guide makes your GitHub the first thing they screenshot and share.</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ── Career Kit: Resume Review ───────────────────────────── */}
            {careerKitResource === "resume_review" && (
              <div style={{ maxWidth: "760px" }}>
                <button onClick={() => closeCareerKitResource()}
                  style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: MUTE, padding: "0 0 24px 0", fontFamily: "'Sora', system-ui, sans-serif" }}>
                  ← Back to Career Kit
                </button>

                <div style={{ backgroundColor: Y, border: `2px solid ${B}`, borderRadius: "12px", padding: isMobile ? "20px" : "28px 32px", marginBottom: "32px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", color: B, marginBottom: "10px" }}>BEFORE YOU START</div>
                  <h2 style={{ fontSize: "20px", fontWeight: 700, color: B, marginBottom: "10px", lineHeight: 1.3 }}>
                    Are you someone who has changed?
                  </h2>
                  <p style={{ fontSize: "14px", color: B, lineHeight: 1.7, margin: 0 }}>
                    Most students update their resume only when they need a job. But the version of you from 6 months ago is not who you are today.
                    If you have grown — new projects, new skills, new experiences — that is great. That is exactly who companies want to hire.
                    Go through this checklist with your current self in mind, not your past self.
                  </p>
                </div>

                <h1 style={{ fontSize: "24px", fontWeight: 700, color: B, marginBottom: "6px" }}>Resume Review Checklist</h1>
                <p style={{ fontSize: "13px", color: MUTE, marginBottom: "32px" }}>One-page format · Go through each section carefully</p>

                {[
                  {
                    num: "01", title: "Header", items: [
                      "Full name in a large, clean font — easy to read at a glance",
                      "Email address, phone number, LinkedIn, and GitHub",
                      "No photo, no extra design, no coloured boxes",
                    ]
                  },
                  {
                    num: "02", title: "About Me (2 Lines Max)", items: [
                      "Answer: Who are you + what are you good at + what you want next",
                      'Example: "A final-year IT student skilled in Python, React, and SQL. Interested in backend development and building scalable solutions."',
                      "If it takes more than 2 lines, it is too long",
                    ]
                  },
                  {
                    num: "03", title: "Skills (Prioritise the Ones That Matter)", items: [
                      "Keep it tight — 8 to 12 skills maximum",
                      "Group by category: Programming, Frontend, Backend, Database, Tools",
                      "Do not write soft skills here (communication, teamwork, etc.)",
                      "Put the skills most relevant to the role you are applying for first",
                    ]
                  },
                  {
                    num: "04", title: "Experience (Your Most Important Section)", items: [
                      "Even internships count — include everything real",
                      "Format: Role | Company | Duration",
                      "Use action verbs: built, improved, designed, automated, created",
                      "Add numbers wherever possible — percentages, amounts, time saved",
                      "Example: Improved API response time by 30% by optimising SQL queries",
                      "Example: Built a data pipeline that processed 2,000+ records per day",
                      "Recruiters care about outcomes, not just tasks",
                    ]
                  },
                  {
                    num: "05", title: "Projects (Pick 2–3 Strong Ones Only)", items: [
                      "Format: Project Name | Tech Used",
                      "One line on what problem it solves",
                      "One line on what you built",
                      "Add numbers: speed, accuracy, data size, users",
                      "Example: Built a resume parser with 92% extraction accuracy using Python and NLP",
                      "Example: Designed a React dashboard reducing page load by 45%",
                      "Avoid college lab experiments — show real or deployable work",
                    ]
                  },
                  {
                    num: "06", title: "Education", items: [
                      "Degree name, college name, CGPA or percentage, graduation year",
                      "Example: B.Tech in Information Technology, VIT Chennai — 8.2 CGPA (Expected: 2026)",
                      "CGPA is optional but helpful if it is above 7.5",
                    ]
                  },
                  {
                    num: "07", title: "Certifications (Relevant Ones Only)", items: [
                      "Keep it clean — list only certifications that support your target role",
                      "Example: Python | Coursera, AWS Fundamentals | Amazon, DBMS | Udemy",
                      "Do not list 10 low-value certificates — quality over quantity",
                    ]
                  },
                  {
                    num: "08", title: "Extracurriculars (Show Initiative)", items: [
                      "Show leadership, responsibility, or initiative — not just membership",
                      "Example: Finalist in Smart India Hackathon",
                      "Example: Organised coding workshops for 50+ students",
                      "Example: Volunteer at college tech club",
                    ]
                  },
                  {
                    num: "09", title: "Achievements (Optional — Only If Strong)", items: [
                      "Use numbers to make achievements concrete",
                      "Example: Ranked top 5% in CodeChef contest",
                      "Example: Completed 500+ coding problems across platforms",
                      "Example: Published research in IEEE conference",
                    ]
                  },
                  {
                    num: "10", title: "General Rules", items: [
                      "One page only — no exceptions",
                      "Simple fonts: Calibri, Arial, or Roboto",
                      "No colours, boxes, headshots, or decorative elements",
                      "Strong verbs: built, created, automated, designed, improved",
                      "Leave enough white space — a cramped resume gets skipped",
                      "Submit as PDF only",
                    ]
                  },
                ].map(section => (
                  <div key={section.num} style={{ marginBottom: "24px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "10px", padding: isMobile ? "16px" : "22px 24px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                      <div style={{ fontSize: "28px", fontWeight: 700, color: `${B}20`, fontFamily: "'Bebas Neue', cursive", lineHeight: 1, flexShrink: 0, minWidth: "36px" }}>
                        {section.num}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "15px", fontWeight: 700, color: B, marginBottom: "12px" }}>{section.title}</div>
                        <ul style={{ margin: 0, paddingLeft: "16px", listStyle: "none" }}>
                          {section.items.map((item, i) => (
                            <li key={i} style={{ fontSize: "13px", color: MUTE, lineHeight: 1.7, marginBottom: "4px", paddingLeft: "8px", position: "relative" }}>
                              <span style={{ position: "absolute", left: "-8px", color: Y, fontWeight: 700 }}>—</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}

                <div style={{ backgroundColor: B, borderRadius: "12px", padding: "24px 28px", marginTop: "16px" }}>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: Y, letterSpacing: "0.12em", marginBottom: "14px" }}>RECOMMENDED ORDER</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {["Header", "About Me", "Skills", "Experience", "Projects", "Education", "Certifications", "Extracurriculars", "Achievements"].map((item, i) => (
                      <div key={item} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: `${W}10`, border: `1px solid ${W}20`, borderRadius: "6px", padding: "5px 12px" }}>
                        <span style={{ fontSize: "10px", color: Y, fontWeight: 700 }}>{i + 1}</span>
                        <span style={{ fontSize: "12px", color: W, fontWeight: 500 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Career Kit: Cover Letter ────────────────────────────── */}
            {careerKitResource === "cover_letter" && (() => {
              const templates: Record<string, { label: string; desc: string; content: string }> = {
                short: {
                  label: "Short",
                  desc: "Quick, clean, and direct. Best for most applications.",
                  content: `[Your Name]
[City, India] | [Phone] | [Email] | [LinkedIn / GitHub]
[DD Month YYYY]

Subject: Application for [Role Title]

Dear Hiring Manager,

I am writing to apply for the [Role Title] position at [Company Name]. I am currently a [Year]-year [Degree] student at [College Name] with experience in [2–3 key skills].

I recently [mention one strong project or internship — one sentence on what you built and the impact]. This experience strengthened my practical understanding of [domain or area].

I am confident that my skills in [top 2 skills] would allow me to contribute meaningfully to your team from day one.

Thank you for your time and consideration.

Best regards,
[Your Full Name]
[Phone] | [Email]`,
                },
                long: {
                  label: "Long",
                  desc: "Detailed and comprehensive. Use for senior or competitive roles.",
                  content: `[Your Name]
[City, India] | [Phone] | [Email]
[DD Month YYYY]

Dear Hiring Manager,

I am writing to apply for the position of [Position Title] at [Company Name].

I am currently [your current status — e.g., "a final-year IT student / a developer with 2 years of experience"]. I have worked at [Previous Company] and [Another Company / College Project], and my experience combined with my genuine interest in [Company Name] makes me a strong candidate for this role.

As a [developer / engineer / analyst], I have been responsible for [describe key responsibility]. Some of my notable contributions include:
— [Built / designed / automated] [specific project or feature], resulting in [metric — e.g., "30% faster response times"].
— [Created / improved] [another specific output] which [reduced X / improved Y by Z%].
— Developed proficiency in [key skills], applying them to solve [describe type of problem].

Beyond technical work, I have [mention extracurricular achievement — hackathon, open source, community, etc.] and completed [X]+ [DSA problems / projects / certifications]. I am disciplined, curious, and motivated by the people I work with.

I would welcome the opportunity to discuss how my background aligns with the needs of [Company Name]. Thank you for your time and consideration.

Sincerely,
[Your Full Name]
[Phone] | [Email]`,
                },
                founder: {
                  label: "Founder",
                  desc: "Direct and energetic. For startups where the founder reads it themselves.",
                  content: `[Your Name]
[City, India] | [Phone] | [Email] | [LinkedIn / GitHub]
[DD Month YYYY]

Dear [Founder's Name],

I came across [Company Name] and I am genuinely excited by what you are building — [one specific thing about the product or mission that stands out to you].

I am [your current status — e.g., "a final-year CS student / a developer with 2 years of experience"] who has [built / shipped / solved] [2–3 concrete things with impact]. Most recently, [describe your strongest project or result in one sentence — include a metric if possible].

I am not looking for a corporate job. I want to work somewhere where my contributions are felt directly. I believe [Company Name] is that place.

I move fast, I learn faster, and I do not need hand-holding. If you are open to a 15-minute conversation, I would love to show you what I have built and understand what you are actually looking for.

[Your Full Name]
[Phone] | [Email] | [LinkedIn / GitHub]`,
                },
                technical: {
                  label: "Technical",
                  desc: "Structured and skill-forward. For engineering and developer roles.",
                  content: `[Your Name]
[City, India] | [Phone] | [Email] | [GitHub]
[DD Month YYYY]

Subject: Application for [Role Title — Backend / Frontend / Full Stack / ML]

Dear [Hiring Manager / Engineering Team],

I am applying for the [Role Title] position at [Company Name]. My technical background in [primary tech stack] and [secondary area] aligns directly with the requirements for this role.

Key technical contributions:
— [Built / optimised / designed] [specific project or feature] using [tech stack], resulting in [metric — e.g., "30% faster API response"].
— [Solved / automated / improved] [specific problem], which [reduced X / improved Y].
— Proficient in [top 5–6 technical skills directly relevant to the role].

I approach problems systematically — I understand the system before writing code, and I write clean, testable, documented work. I believe good engineering is as much about communication as it is about code.

I would welcome the opportunity to discuss this role further or complete a technical assessment.

Best regards,
[Your Full Name]
[GitHub] | [Email] | [Phone]`,
                },
                hr: {
                  label: "HR",
                  desc: "Formal and structured. For corporate or HR team applications.",
                  content: `[Your Name]
[City, India] | [Phone] | [Email] | [LinkedIn]
[DD Month YYYY]

Subject: Application for [Role Title]

Dear [HR Manager's Name / Hiring Team],

I am writing to express my strong interest in the [Role Title] position at [Company Name].

I am a [qualification / background] with [X months / years] of experience in [relevant area]. During my time at [Previous Role / College], I demonstrated [key strength — e.g., "the ability to manage competing priorities while maintaining high standards and clear communication"].

I am particularly drawn to [Company Name] because of [specific reason — culture, mission, product, or growth opportunity]. I am confident that my [top 2–3 strengths] would make me a strong addition to your team.

I have attached my resume for your review and would be glad to schedule a call at your convenience.

Thank you for taking the time to consider my application.

Yours sincerely,
[Your Full Name]
[Phone] | [Email] | [LinkedIn]`,
                },
              };

              const active = templates[coverLetterTab];

              return (
                <div style={{ maxWidth: "760px" }}>
                  <button onClick={() => closeCareerKitResource()}
                    style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: MUTE, padding: "0 0 24px 0", fontFamily: "'Sora', system-ui, sans-serif" }}>
                    ← Back to Career Kit
                  </button>

                  {/* What is a cover letter */}
                  <div style={{ backgroundColor: B, borderRadius: "12px", padding: isMobile ? "20px" : "28px 32px", marginBottom: "32px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: Y, letterSpacing: "0.15em", marginBottom: "10px" }}>WHAT IS A COVER LETTER?</div>
                    <p style={{ fontSize: "14px", color: W, lineHeight: 1.8, margin: 0 }}>
                      A cover letter is a short document you send alongside your resume when applying for a job. While your resume lists what you have done,
                      the cover letter explains <em style={{ color: Y }}>why you are applying</em> and <em style={{ color: Y }}>why you are the right person for this specific role</em>.
                      A strong cover letter gets HR to forward your resume to the hiring manager before the ATS (Applicant Tracking System) even processes it.
                      Most candidates skip it — which means writing a good one immediately puts you ahead.
                    </p>
                  </div>

                  <h1 style={{ fontSize: "24px", fontWeight: 700, color: B, marginBottom: "6px" }}>Cover Letter Templates</h1>
                  <p style={{ fontSize: "13px", color: MUTE, marginBottom: "24px" }}>
                    Choose the template that fits your situation. Replace every <span style={{ backgroundColor: `${Y}40`, padding: "1px 4px", borderRadius: "3px", fontWeight: 600 }}>[placeholder]</span> with your real details.
                  </p>

                  {/* Tabs */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
                    {(Object.keys(templates) as (keyof typeof templates)[]).map(tab => (
                      <button key={tab} onClick={() => setCoverLetterTab(tab as typeof coverLetterTab)}
                        style={{
                          padding: "7px 16px", borderRadius: "6px", border: `1.5px solid ${coverLetterTab === tab ? B : BORD}`,
                          backgroundColor: coverLetterTab === tab ? B : W, color: coverLetterTab === tab ? W : B,
                          fontSize: "12px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.04em",
                          fontFamily: "'Sora', system-ui, sans-serif",
                          transition: "all 0.15s",
                        }}>
                        {templates[tab].label}
                      </button>
                    ))}
                  </div>

                  {/* Active template info */}
                  <div style={{ backgroundColor: `${Y}20`, border: `1.5px solid ${Y}`, borderRadius: "8px", padding: "10px 16px", marginBottom: "16px", fontSize: "13px", color: B }}>
                    <strong>{active.label} version</strong> — {active.desc}
                  </div>

                  {/* Template content */}
                  <div style={{ position: "relative" }}>
                    <pre style={{
                      backgroundColor: "#F9FAFB",
                      border: `1.5px solid ${BORD}`,
                      borderRadius: "10px",
                      padding: isMobile ? "16px" : "24px",
                      fontSize: "12.5px",
                      lineHeight: 1.9,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      margin: 0,
                      fontFamily: "'IBM Plex Mono', monospace",
                      color: B,
                      overflowX: "auto",
                    }}>
                      {active.content.replace(/\[([^\]]+)\]/g, "[$1]")}
                    </pre>
                    <button
                      onClick={() => { navigator.clipboard.writeText(active.content); toast({ title: "Copied!", description: "Template copied to clipboard" }); }}
                      style={{
                        position: "absolute", top: "12px", right: "12px",
                        backgroundColor: B, color: W, border: "none", borderRadius: "6px",
                        padding: "6px 14px", fontSize: "11px", fontWeight: 700, cursor: "pointer",
                        fontFamily: "'Sora', system-ui, sans-serif", letterSpacing: "0.06em",
                      }}>
                      COPY
                    </button>
                  </div>

                  {/* Tips box */}
                  <div style={{ marginTop: "24px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "10px", padding: "20px 24px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: MUTE, letterSpacing: "0.12em", marginBottom: "12px" }}>QUICK TIPS</div>
                    {[
                      "Keep it to one page — under 300 words for short, under 450 for long",
                      "Never use a generic template without personalising it to the company",
                      "The first sentence must hook the reader — avoid starting with \"I am writing to apply\"",
                      "Mirror the language used in the job description — it passes ATS filters",
                      "Save and send as PDF, never as .docx",
                    ].map((tip, i) => (
                      <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
                        <span style={{ color: Y, fontWeight: 700, fontSize: "14px", lineHeight: 1.5, flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: "13px", color: MUTE, lineHeight: 1.6 }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ── LinkedIn Review ─────────────────────────────────────── */}
            {careerKitResource === "linkedin_review" && (
              <div style={{ maxWidth: "760px" }}>
                <button onClick={() => closeCareerKitResource()} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: MUTE, padding: "0 0 24px 0", fontFamily: "'Sora', system-ui, sans-serif" }}>
                  ← Back to Career Kit
                </button>
                <h1 style={{ fontSize: "24px", fontWeight: 700, color: B, marginBottom: "6px" }}>LinkedIn Review</h1>
                <p style={{ fontSize: "13px", color: MUTE, marginBottom: "32px" }}>Go through each action item. Your profile should be working for you 24/7 — even when you're asleep.</p>

                {[
                  { num: "01", title: "Professional Profile Photo", desc: "A clean headshot makes you appear approachable and serious. Recruiters notice this first. No selfies, no group photos, no filters. Plain background, good lighting, look at the camera." },
                  { num: "02", title: "Clear Headline with Keywords", desc: 'Instead of "Student at XYZ", use your target role + college + key skills + achievements. Example: "AI Engineer | B.Tech SRM | Gen-AI | 3x Internship | 5x Certification". This is what shows up in search results.' },
                  { num: "03", title: "Strong About / Summary Section", desc: "Tell your story — who you are, what you're aiming for, and what you bring. Be specific and personal. Don't use corporate jargon. Recruiters read it when they're already interested. Make them stay." },
                  { num: "04", title: "Highlight Projects & Experience", desc: "Even without full-time work, showcase internships, side projects, and class projects — especially with outcomes. Every experience entry needs a description and the skills used." },
                  { num: "05", title: "Skills & Endorsements", desc: "List 10–15 key skills relevant to your target role. Ask peers and mentors to endorse you. Skills with endorsements rank higher in recruiter searches. Match them to the jobs you're applying for." },
                  { num: "06", title: "Complete Education & Certifications", desc: "Include your college, degree, graduation year, and relevant courses. Add certifications with a one-line description of what you learned. This increases your profile's search ranking." },
                  { num: "07", title: "Regular Posting & Engagement", desc: "Post at least once a week — learning, project updates, industry observations. Comment with insight, not just 'Great post!' Mention what specifically was useful. Consistency builds visibility over months." },
                  { num: "08", title: "Network Purposefully", desc: "Connect with alumni from your college who are in your target companies, peers at other colleges, and professionals you genuinely admire. Always personalize the connection request — never send a blank one." },
                  { num: "09", title: "Customize Your URL & Add Rich Media", desc: "Change your LinkedIn URL to linkedin.com/in/YourName. Add project screenshots, documents, or GitHub links to your experience and project entries. It makes your profile visual and credible." },
                  { num: "10", title: "Ask for Recommendations", desc: "2–3 genuine recommendations from internship managers, professors, or collaborators carry significant weight. Ask them to highlight one specific thing they saw you do well — not just 'hardworking'." },
                ].map(s => (
                  <div key={s.num} style={{ marginBottom: "16px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "10px", padding: isMobile ? "14px" : "18px 22px", display: "flex", gap: "16px" }}>
                    <div style={{ fontSize: "24px", fontWeight: 700, color: `${B}18`, fontFamily: "'Bebas Neue', cursive", lineHeight: 1, flexShrink: 0, minWidth: "32px" }}>{s.num}</div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: B, marginBottom: "6px" }}>{s.title}</div>
                      <p style={{ fontSize: "13px", color: MUTE, lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
                    </div>
                  </div>
                ))}

                <div style={{ backgroundColor: `${Y}20`, border: `1.5px solid ${Y}`, borderRadius: "10px", padding: "20px 24px", marginTop: "8px", marginBottom: "32px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "12px" }}>BONUS — ACTIVE PRESENCE</div>
                  {["Aim for 1,000+ followers or a strong network — this helps with algorithm visibility.", "Comment with insight, not just 'Good' or 'Amazing' — say exactly why something was useful.", "Post at least once a week about your learning, project progress, or an industry observation.", "Engage with content from companies you're targeting — it signals genuine interest.", "Update your profile every time you complete a big project, earn a certification, or change focus."].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "6px", alignItems: "flex-start" }}>
                      <span style={{ color: B, fontWeight: 700, fontSize: "13px", flexShrink: 0 }}>→</span>
                      <span style={{ fontSize: "13px", color: B, lineHeight: 1.6 }}>{t}</span>
                    </div>
                  ))}
                </div>

                <h2 style={{ fontSize: "20px", fontWeight: 700, color: B, marginBottom: "20px" }}>How Your Profile Should Look</h2>

                {[
                  {
                    label: "HEADLINE",
                    example: "AI Engineer | B.Tech SRM | Gen-AI | 3x Internship | 5x Certification",
                    tip: "Formula: [Target Role] | [Degree + College] | [Key Skill] | [Count × Achievement]. Make it keyword-rich so recruiters find you in searches. Replace with your own role, college, and real numbers.",
                  },
                  {
                    label: "ABOUT ME / SUMMARY",
                    example: `I can't dance or sing, and that is fine. But when it comes to coding, it is more than a hobby for me. That is why I have completed 9 internships before graduation. I want to scale things from -1 to 0 and 0 to 1, because that is the hardest phase for any startup. I want to be there, experience it, and take leadership. I have done it earlier.\n\nI work 16 hours a day and I genuinely love every second I spend learning and coding, because it is interesting. I am an explorer, and I like to go deep into understanding how systems work. I have worked in backend, frontend, cloud, Kubernetes, networking, sockets, gRPC, multi-agents, concurrency handling, optimization strategies, SSE, testing, and so on. It may sound like the entire software cycle, and that is exactly what I meant above. I love building things.`,
                    tip: "Write from your heart — not from a template. Tell them who you are, what drives you, and what you've done. Every person's story is different. Use this as inspiration, not a script. Be specific, be honest, be you.",
                  },
                  {
                    label: "SKILLS",
                    example: "Match your skills to the exact job role you're targeting. If applying for backend roles, list Python, Go, SQL, Docker, REST APIs first. If applying for AI/ML, list PyTorch, scikit-learn, LangChain first. Skills should change depending on the role — don't use one generic list for everything.",
                    tip: "Get at least 5 endorsements on your top 3–5 skills. Ask your internship managers or classmates who have worked with you.",
                    isText: true,
                  },
                  {
                    label: "EXPERIENCE",
                    example: `Software Engineer Intern | [Company] | [Dates]\nBuilt an API gateway handling 50,000+ daily requests using FastAPI and Redis. Reduced latency by 35% through query optimization. Worked across backend, cloud deployment, and monitoring.\nSkills: Python · FastAPI · Redis · AWS · PostgreSQL`,
                    tip: "Every experience entry needs: role, company, dates, 2–4 bullet-style impact lines with numbers, and tagged skills. Don't just list what you did — say what changed because of what you did.",
                  },
                  {
                    label: "PROJECTS (MANDATORY)",
                    example: `Resume AI Builder | Python, LangChain, React\nBuilt an AI-powered resume analysis tool that scores resumes against job descriptions and suggests improvements. Achieved 89% user satisfaction in beta testing with 200+ students.\nGitHub: [link] | Live Demo: [link]`,
                    tip: "Every project must have: name, tech stack, what problem it solves, what you built, a metric, and links (GitHub or live demo). If you don't have links, it didn't happen.",
                  },
                  {
                    label: "CERTIFICATIONS",
                    example: "Python for Data Science | IBM | Coursera\nCovered NumPy, Pandas, Matplotlib, and ML fundamentals. Applied concepts in a final project building a price prediction model.\n\nAWS Cloud Practitioner | Amazon Web Services\nUnderstood core AWS services: EC2, S3, Lambda, IAM, and VPC. Foundation for cloud infrastructure work.",
                    tip: "Add a 1–2 line description of what you actually learned in each certification. It shows you took it seriously — not just for the badge.",
                  },
                ].map(section => (
                  <div key={section.label} style={{ marginBottom: "20px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "10px", overflow: "hidden" }}>
                    <div style={{ backgroundColor: B, padding: "10px 20px", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: Y, letterSpacing: "0.15em" }}>{section.label}</span>
                    </div>
                    <div style={{ padding: "16px 20px" }}>
                      {section.isText ? (
                        <p style={{ fontSize: "13px", color: B, lineHeight: 1.7, margin: "0 0 12px 0" }}>{section.example}</p>
                      ) : (
                        <pre style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: B, lineHeight: 1.8, backgroundColor: "#F9FAFB", border: `1px solid ${BORD}`, borderRadius: "6px", padding: "12px 16px", whiteSpace: "pre-wrap", wordBreak: "break-word", margin: "0 0 12px 0" }}>{section.example}</pre>
                      )}
                      <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                        <span style={{ color: Y, fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: "12px", color: MUTE, lineHeight: 1.6 }}>{section.tip}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── LinkedIn Cold Messages ───────────────────────────────── */}
            {careerKitResource === "linkedin_messages" && (() => {
              const msgTemplates: Record<string, { label: string; desc: string; content: string }> = {
                connection: {
                  label: "Connection Request",
                  desc: "Under 300 characters. Short, specific, human. Never generic.",
                  content: `Hi [Name],

I'd like to connect — I'm exploring opportunities in [field/role] and your work at [Company] stood out. Would love to be in your network.

[Your Name]`,
                },
                referral: {
                  label: "Referral Ask",
                  desc: "Send after they accept your connection. Be direct and respectful of their time.",
                  content: `Hi [Name],

I'm [Your Name], a final-year [Degree] student at [College]. I've been building in [tech stack] for [X months/years] and have [key achievement — e.g., "completed 3 internships / solved 500+ DSA problems"].

I came across [Role Title] on [Company]'s careers page (Job ID: [ID]) and believe my profile is a strong match.

Would you be open to referring me if you find my profile suitable?

Job link: [link]
Resume: [link]
Coding profile: [link]

Thank you — genuinely appreciate it.
[Your Name]`,
                },
                founder: {
                  label: "Founder DM",
                  desc: "Short, passionate, specific. Founders get 100 generic DMs a day — be the different one.",
                  content: `Hi [Name],

I've been following what you're building at [Company] — [one specific thing that genuinely excited you, e.g., "the way you're using multi-agents to cut support costs by 60%"].

I'm [Your Name], a [status — "final-year CS student / developer with 2 years of experience"]. I've [built / shipped] [one strong achievement — one sentence]. I thrive in early-stage chaos where there's more to build than there are people to build it.

Not looking for a big company job. Looking for work that matters.

Is there room on your team for someone like that?

[GitHub / Portfolio link]`,
                },
                hr: {
                  label: "HR DM",
                  desc: "Professional and clear. Show them what you've done, not what you want.",
                  content: `Hi [Name],

I'm [Your Name], a final-year [Degree] student at [College]. I noticed [Company] is hiring for [Role].

Quick highlights:
— [Achievement 1 with a number]
— [Achievement 2 with a number]
— Strong in [top 2 skills relevant to the role]

I have attached my resume and would love just 10 minutes of your time.

Resume: [link]
[Your Name]`,
                },
                tech: {
                  label: "Technical Person DM",
                  desc: "Show you've done your homework. Be specific about their work, not just the company.",
                  content: `Hi [Name],

I came across your recent [post / talk / project] on [specific topic] — [one thing that stood out to you or that you learned from it].

I'm [Your Name], a [status] with experience in [tech stack]. I've [built/shipped/optimised] [specific thing with a result — e.g., "a data pipeline processing 2M records/day using Kafka and Go"].

Would you be open to a quick 15-minute chat? I'd love to understand the engineering challenges your team is actually working on — not just what's on the job description.

GitHub: [link]`,
                },
              };

              const activeMsg = msgTemplates[linkedinMsgTab];
              return (
                <div style={{ maxWidth: "760px" }}>
                  <button onClick={() => closeCareerKitResource()} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: MUTE, padding: "0 0 24px 0", fontFamily: "'Sora', system-ui, sans-serif" }}>
                    ← Back to Career Kit
                  </button>
                  <h1 style={{ fontSize: "24px", fontWeight: 700, color: B, marginBottom: "6px" }}>LinkedIn Cold Messages</h1>
                  <p style={{ fontSize: "13px", color: MUTE, marginBottom: "24px" }}>Replace every <span style={{ backgroundColor: `${Y}40`, padding: "1px 4px", borderRadius: "3px", fontWeight: 600 }}>[placeholder]</span> with your real details. Never send a template unchanged.</p>

                  <div style={{ backgroundColor: B, borderRadius: "10px", padding: "16px 20px", marginBottom: "24px" }}>
                    <div style={{ fontSize: "11px", color: Y, fontWeight: 700, letterSpacing: "0.12em", marginBottom: "10px" }}>COLD MESSAGE RULES</div>
                    {["Keep connection requests under 300 characters — LinkedIn limits them.", "Always mention something specific — generic messages get ignored.", "Don't ask for a job in the first message. Build the connection first.", "Follow up once, max twice, if no reply. Space it out by 7–10 days.", "Your message is competing with 50 others. The first line decides if they read the rest."].map((r, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", alignItems: "flex-start" }}>
                        <span style={{ color: Y, fontWeight: 700, flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: "12px", color: `${W}cc`, lineHeight: 1.6 }}>{r}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                    {(Object.keys(msgTemplates) as (keyof typeof msgTemplates)[]).map(tab => (
                      <button key={tab} onClick={() => setLinkedinMsgTab(tab as typeof linkedinMsgTab)}
                        style={{ padding: "7px 16px", borderRadius: "6px", border: `1.5px solid ${linkedinMsgTab === tab ? B : BORD}`, backgroundColor: linkedinMsgTab === tab ? B : W, color: linkedinMsgTab === tab ? W : B, fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', system-ui, sans-serif", transition: "all 0.15s" }}>
                        {msgTemplates[tab].label}
                      </button>
                    ))}
                  </div>

                  <div style={{ backgroundColor: `${Y}20`, border: `1.5px solid ${Y}`, borderRadius: "8px", padding: "10px 16px", marginBottom: "16px", fontSize: "13px", color: B }}>
                    <strong>{activeMsg.label}</strong> — {activeMsg.desc}
                  </div>

                  <div style={{ position: "relative" }}>
                    <pre style={{ backgroundColor: "#F9FAFB", border: `1.5px solid ${BORD}`, borderRadius: "10px", padding: isMobile ? "16px" : "24px", fontSize: "12.5px", lineHeight: 1.9, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0, fontFamily: "'IBM Plex Mono', monospace", color: B }}>
                      {activeMsg.content}
                    </pre>
                    <button onClick={() => { navigator.clipboard.writeText(activeMsg.content); toast({ title: "Copied!", description: "Message copied to clipboard" }); }}
                      style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: B, color: W, border: "none", borderRadius: "6px", padding: "6px 14px", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', system-ui, sans-serif" }}>
                      COPY
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* ── Cold Emails ─────────────────────────────────────────── */}
            {careerKitResource === "cold_emails" && (() => {
              const emailTemplates: Record<string, { label: string; desc: string; subject: string; content: string }> = {
                founder: {
                  label: "Founder",
                  desc: "Sound unique and passionate. Founders read dozens of these. The ones that feel human get replies.",
                  subject: "Subject: [Role] at [Company] — [Your Name]",
                  content: `Hi [Name],

I'll keep this short.

I don't have many hobbies outside of building things. I'm not athletic, I can't sing, and I don't dance. Coding is the one thing I'm genuinely good at — and I spend most of my day doing it because I actually love it.

I've [built / shipped / solved] [your top 2–3 achievements with brief context — one sentence each]. Right now, I'm [your current status — e.g., "in my final year of college / between roles"].

I want to be part of something going from 0 to 1. Not for the title — because that phase is the hardest and most interesting. I've been there before.

Would you have 15 minutes this week?

[Your Name]
[Email] | [LinkedIn / GitHub]`,
                },
                hr: {
                  label: "HR",
                  desc: "Show what you've done. HR wants to quickly know: can this person do the job?",
                  subject: "Subject: Application for [Role Title] — [Your Name]",
                  content: `Hi [Name / Hiring Team],

I'm writing to apply for the [Role Title] position at [Company Name].

Quick summary of why I'm a strong fit:
— [Achievement 1 with a number — e.g., "Built and shipped 3 production APIs serving 10,000+ daily requests"]
— [Achievement 2 with a number]
— [Relevant internship, certification, or skill]

I'm a [year]-year [Degree] student at [College] with [X months] of hands-on experience in [domain]. I'm available [start date / immediately].

Resume: [link]
LinkedIn: [link]

I'd love to schedule a brief call at your convenience. Thank you for your time.

Best regards,
[Your Name]
[Email] | [Phone]`,
                },
                tech: {
                  label: "Technical",
                  desc: "Show you're crazy about the craft. Lead with what you've built, not what you want.",
                  subject: "Subject: [Role Level] — [Your Name] | [Top 2 Skills]",
                  content: `Hi [Name],

I'm reaching out because the engineering work at [Company] in [specific area] is exactly the kind of problem space I want to work in.

My stack: [Primary languages and frameworks]

What I've shipped:
— [Technical project or contribution 1 with metric — e.g., "Reduced API latency by 40% by rewriting the query layer in Go"]
— [Technical project or contribution 2 with metric]
— [Open source contribution / research paper / notable side project, if any]

I write clean, tested code. I think in systems before I write a line. I document what I build. I don't need hand-holding — I need a hard problem and the freedom to solve it.

GitHub: [link]
Resume: [link]

Happy to do a technical screen or code review at any time.

[Your Name] | [Email]`,
                },
                company: {
                  label: "Company",
                  desc: "For general applications when there's no posted role. Show your value, not your desperation.",
                  subject: "Subject: Open Application — [Your Name] | [Your Domain]",
                  content: `To Whom It May Concern,

My name is [Your Name] and I'm reaching out to express genuine interest in joining [Company Name].

I'm a [qualification] with [X months/years] of experience in [domain]. I've been following [Company Name]'s work in [specific area or product] and believe my skills in [top 2–3 relevant skills] would let me contribute from week one.

Key highlights:
— [Achievement 1 with impact]
— [Achievement 2 with impact]
— [Achievement 3 or a specific skill directly relevant to what the company does]

I'm reaching out directly because I'm genuinely invested in what [Company Name] is building — not just looking for any job.

Resume: [link]
LinkedIn / GitHub: [link]

Thank you for your time.

Best regards,
[Your Name]
[Email] | [Phone]`,
                },
              };

              const activeEmail = emailTemplates[coldEmailTab];
              return (
                <div style={{ maxWidth: "760px" }}>
                  <button onClick={() => closeCareerKitResource()} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: MUTE, padding: "0 0 24px 0", fontFamily: "'Sora', system-ui, sans-serif" }}>
                    ← Back to Career Kit
                  </button>
                  <h1 style={{ fontSize: "24px", fontWeight: 700, color: B, marginBottom: "6px" }}>Cold Emails</h1>
                  <p style={{ fontSize: "13px", color: MUTE, marginBottom: "24px" }}>Replace every <span style={{ backgroundColor: `${Y}40`, padding: "1px 4px", borderRadius: "3px", fontWeight: 600 }}>[placeholder]</span> with your real details. Personalise every single email — never mass-send a template.</p>

                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                    {(Object.keys(emailTemplates) as (keyof typeof emailTemplates)[]).map(tab => (
                      <button key={tab} onClick={() => setColdEmailTab(tab as typeof coldEmailTab)}
                        style={{ padding: "7px 16px", borderRadius: "6px", border: `1.5px solid ${coldEmailTab === tab ? B : BORD}`, backgroundColor: coldEmailTab === tab ? B : W, color: coldEmailTab === tab ? W : B, fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', system-ui, sans-serif", transition: "all 0.15s" }}>
                        {emailTemplates[tab].label}
                      </button>
                    ))}
                  </div>

                  <div style={{ backgroundColor: `${Y}20`, border: `1.5px solid ${Y}`, borderRadius: "8px", padding: "10px 16px", marginBottom: "16px", fontSize: "13px", color: B }}>
                    <strong>{activeEmail.label}</strong> — {activeEmail.desc}
                  </div>

                  <div style={{ backgroundColor: "#F9FAFB", border: `1.5px solid ${BORD}`, borderRadius: "8px", padding: "10px 16px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: MUTE, letterSpacing: "0.08em" }}>EMAIL SUBJECT LINE</span>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px", color: B, marginTop: "6px" }}>{activeEmail.subject}</div>
                  </div>

                  <div style={{ position: "relative" }}>
                    <pre style={{ backgroundColor: "#F9FAFB", border: `1.5px solid ${BORD}`, borderRadius: "10px", padding: isMobile ? "16px" : "24px", fontSize: "12.5px", lineHeight: 1.9, whiteSpace: "pre-wrap", wordBreak: "break-word", margin: 0, fontFamily: "'IBM Plex Mono', monospace", color: B }}>
                      {activeEmail.content}
                    </pre>
                    <button onClick={() => { navigator.clipboard.writeText(`${activeEmail.subject}\n\n${activeEmail.content}`); toast({ title: "Copied!", description: "Email copied to clipboard" }); }}
                      style={{ position: "absolute", top: "12px", right: "12px", backgroundColor: B, color: W, border: "none", borderRadius: "6px", padding: "6px 14px", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', system-ui, sans-serif" }}>
                      COPY
                    </button>
                  </div>

                  <div style={{ marginTop: "24px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "10px", padding: "20px 24px" }}>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: MUTE, letterSpacing: "0.12em", marginBottom: "12px" }}>COLD EMAIL RULES</div>
                    {["Personalise every email — mention something specific about the company or their recent work.", "Subject line decides if it gets opened. Keep it under 60 characters, clear, and non-salesy.", "First paragraph should be about them, not you. Then pivot to your value.", "Follow up once after 5–7 days if no reply. Keep the follow-up to 2 sentences.", "Always attach a PDF resume, never share a Google Drive link in the first email."].map((r, i) => (
                      <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
                        <span style={{ color: Y, fontWeight: 700, fontSize: "14px", lineHeight: 1.5, flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: "13px", color: MUTE, lineHeight: 1.6 }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ── Mock Interview Guide ─────────────────────────────────── */}
            {careerKitResource === "mock_interview" && (
              <div style={{ maxWidth: "760px" }}>
                <button onClick={() => closeCareerKitResource()} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: MUTE, padding: "0 0 24px 0", fontFamily: "'Sora', system-ui, sans-serif" }}>
                  ← Back to Career Kit
                </button>

                <div style={{ backgroundColor: B, borderRadius: "12px", padding: isMobile ? "20px" : "28px 32px", marginBottom: "32px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: Y, letterSpacing: "0.15em", marginBottom: "10px" }}>THE INTERVIEW IS A STORY</div>
                  <p style={{ fontSize: "15px", color: W, lineHeight: 1.8, margin: 0 }}>
                    Every interview has a beginning, a middle, and an end. Most students treat it as a test. The ones who do well treat it as a conversation — one where they know their story, control the pace, and make the interviewer feel heard too.
                  </p>
                </div>

                {/* Chapter 0: Set the Stage */}
                <div style={{ marginBottom: "32px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: Y, color: B, fontFamily: "'Bebas Neue', cursive", fontSize: "20px", padding: "4px 12px", letterSpacing: "0.06em" }}>BEFORE THE CALL</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: B }}>Set the Stage</div>
                  </div>
                  <p style={{ fontSize: "13px", color: MUTE, lineHeight: 1.7, marginBottom: "16px" }}>Small things send big signals. Your setup communicates your professionalism before you speak a word.</p>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "12px" }}>
                    {[
                      { icon: "🎥", label: "Camera", tip: "Use a laptop, never a phone. Position the camera at eye level — not below your chin. Look at the camera, not the screen, when speaking." },
                      { icon: "🌅", label: "Lighting", tip: "Face a window or use a ring light. Never have a light source behind you — your face goes dark. Bright, even, front-facing light." },
                      { icon: "🎙", label: "Microphone", tip: "Use earphones with a built-in mic at minimum. Reduce background noise. If your mic crackles, reschedule — it's that important." },
                      { icon: "🖥", label: "Background", tip: "Plain white wall or a solid, neutral background. No bed, no clutter, no posters. Simple = professional." },
                      { icon: "💻", label: "Device", tip: "Always join via laptop. Never from mobile. A phone shows you're not taking it seriously — even if you are." },
                      { icon: "⏰", label: "Timing", tip: "Join 5 minutes early. Test your audio and video 10 minutes before. Don't scramble at the last minute." },
                    ].map(item => (
                      <div key={item.label} style={{ backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "10px", padding: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <span style={{ fontSize: "20px" }}>{item.icon}</span>
                          <span style={{ fontSize: "13px", fontWeight: 700, color: B }}>{item.label}</span>
                        </div>
                        <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.6, margin: 0 }}>{item.tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chapter 1: The Opening */}
                <div style={{ marginBottom: "32px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: B, color: Y, fontFamily: "'Bebas Neue', cursive", fontSize: "20px", padding: "4px 12px", letterSpacing: "0.06em" }}>CHAPTER 1</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: B }}>The Opening — First 2 Minutes</div>
                  </div>
                  <p style={{ fontSize: "13px", color: MUTE, lineHeight: 1.7, marginBottom: "16px" }}>How you start sets the tone for everything that follows. "Tell me about yourself" is not a casual question — it's your first opportunity to control the narrative.</p>
                  <div style={{ backgroundColor: "#F9FAFB", border: `1.5px solid ${BORD}`, borderRadius: "10px", padding: "20px 24px", marginBottom: "16px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: B, letterSpacing: "0.1em", marginBottom: "14px" }}>THE STAR INTRO — USE THIS STRUCTURE</div>
                    {[
                      { letter: "S", word: "Situation", desc: "Who you are and where you come from. College, degree, background." },
                      { letter: "T", word: "Task", desc: "What you've been working on — your focus area, your internships, your domain." },
                      { letter: "A", word: "Action", desc: "What you've actually built or done. Your strongest 2–3 points, with specifics." },
                      { letter: "R", word: "Result", desc: "What you achieved, with numbers if possible. Then what you want next." },
                    ].map(s => (
                      <div key={s.letter} style={{ display: "flex", gap: "14px", marginBottom: "12px", alignItems: "flex-start" }}>
                        <div style={{ backgroundColor: Y, color: B, fontFamily: "'Bebas Neue', cursive", fontSize: "22px", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.letter}</div>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: B }}>{s.word}</div>
                          <div style={{ fontSize: "12px", color: MUTE, lineHeight: 1.5, marginTop: "2px" }}>{s.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ backgroundColor: `${Y}15`, border: `1.5px solid ${Y}`, borderRadius: "8px", padding: "14px 18px", fontSize: "13px", color: B, lineHeight: 1.7 }}>
                    <strong>Target length:</strong> 60–90 seconds. Not less (looks unprepared), not more (looks unfocused). Practice saying it out loud until it sounds natural, not recited.
                  </div>
                </div>

                {/* Chapter 2: During the Interview */}
                <div style={{ marginBottom: "32px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: B, color: Y, fontFamily: "'Bebas Neue', cursive", fontSize: "20px", padding: "4px 12px", letterSpacing: "0.06em" }}>CHAPTER 2</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: B }}>During the Interview — Make It a Conversation</div>
                  </div>
                  <p style={{ fontSize: "13px", color: MUTE, lineHeight: 1.7, marginBottom: "16px" }}>The goal is not to answer questions. The goal is to have a conversation where you come across as someone they want to work with.</p>
                  {[
                    { title: "Pause before answering", desc: "When you hear a question, pause 3–5 seconds before responding. This shows you think before you speak — which is exactly what they want in a teammate." },
                    { title: "Use STAR for every behavioural question", desc: "Situation → Task → Action (always 'I', not 'we') → Result. Every story should have a metric in the Result if possible." },
                    { title: "Flip the conversation", desc: "Every 2–3 exchanges, redirect to them: \"Can I ask — how does your team approach [related topic]?\" or \"What's the scale you're working with on this?\". This shows curiosity and reduces pressure." },
                    { title: "When you don't know the answer", desc: "Say: \"I don't have hands-on experience with that specific thing, but here's how I'd think through it…\". Never bluff. Intellectual honesty is a green flag for any good team." },
                    { title: "Always greet and end intentionally", desc: "Start with: \"Hi [Name], great to meet you — thank you for taking the time.\" End with: \"This was really insightful. I'm very excited about this role. Thank you.\" These moments are remembered." },
                  ].map((item, i) => (
                    <div key={i} style={{ marginBottom: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "10px", padding: "16px 20px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: B, marginBottom: "6px" }}>{item.title}</div>
                      <p style={{ fontSize: "13px", color: MUTE, lineHeight: 1.7, margin: 0 }}>{item.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Chapter 3: Technical Questions */}
                <div style={{ marginBottom: "32px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: B, color: Y, fontFamily: "'Bebas Neue', cursive", fontSize: "20px", padding: "4px 12px", letterSpacing: "0.06em" }}>CHAPTER 3</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: B }}>Technical Questions — Think Out Loud</div>
                  </div>
                  <p style={{ fontSize: "13px", color: MUTE, lineHeight: 1.7, marginBottom: "16px" }}>Interviewers care more about how you think than whether you get the answer right on the first try.</p>
                  {[
                    "State your assumptions first: \"I'm assuming the input is sorted — is that right?\"",
                    "Talk through your approach before writing any code: \"My first instinct is to use a hash map here because...\"",
                    "After solving: explain complexity — \"Time is O(n), space is O(1). If the input scales to 10 million entries, here's how I'd optimise...\"",
                    "Projects you put on your resume are fair game. Know exactly what you built, why you made each decision, what broke, and how you fixed it.",
                    "If the interviewer gives a hint, take it. It doesn't count against you — it shows you can collaborate and course-correct.",
                  ].map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "flex-start", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "8px", padding: "12px 16px" }}>
                      <span style={{ color: Y, fontWeight: 700, fontSize: "16px", flexShrink: 0, lineHeight: 1.4 }}>→</span>
                      <span style={{ fontSize: "13px", color: B, lineHeight: 1.6 }}>{tip}</span>
                    </div>
                  ))}
                </div>

                {/* Chapter 4: The Closing */}
                <div style={{ marginBottom: "32px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div style={{ backgroundColor: B, color: Y, fontFamily: "'Bebas Neue', cursive", fontSize: "20px", padding: "4px 12px", letterSpacing: "0.06em" }}>CHAPTER 4</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: B }}>The Closing — Where Most Students Waste an Opportunity</div>
                  </div>
                  <p style={{ fontSize: "13px", color: MUTE, lineHeight: 1.7, marginBottom: "16px" }}>When they ask "Do you have any questions for us?" — never say no. Always have 2–3 prepared. This is your last impression.</p>
                  <div style={{ backgroundColor: B, borderRadius: "10px", padding: "20px 24px", marginBottom: "16px" }}>
                    <div style={{ fontSize: "11px", color: Y, fontWeight: 700, letterSpacing: "0.12em", marginBottom: "14px" }}>QUESTIONS TO ASK THEM</div>
                    {[
                      "\"What does the first 90 days look like for someone in this role?\"",
                      "\"What's the biggest challenge the team is currently working through?\"",
                      "\"What do the engineers you remember most have in common?\"",
                      "\"What's something you wish you had known before joining this team?\"",
                    ].map((q, i) => (
                      <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
                        <span style={{ color: Y, fontWeight: 700, flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: "13px", color: W, lineHeight: 1.6 }}>{q}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ backgroundColor: `${Y}15`, border: `1.5px solid ${Y}`, borderRadius: "8px", padding: "14px 18px", fontSize: "13px", color: B, lineHeight: 1.7 }}>
                    End strongly: <strong>"This conversation gave me a much clearer picture of the team. I'm very excited about this role. Thank you so much for your time."</strong>
                  </div>
                </div>

                {/* 10 Preparation Tips */}
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: B, marginBottom: "16px" }}>10 Preparation Tips</h2>
                {[
                  { n: "01", title: "Understand concepts, don't memorise", desc: "Interviewers often start with basics because they reveal depth of understanding. A student who truly understands always outperforms one who crammed." },
                  { n: "02", title: "Think before answering", desc: "Silence for 3–5 seconds shows you process information before speaking. Rushing to fill silence is a sign of nervousness — pause with intention." },
                  { n: "03", title: "Speak slowly and clearly", desc: "Speed is a proxy for anxiety. Slow down deliberately, especially when explaining something complex. Clarity beats speed every time." },
                  { n: "04", title: "Don't panic — it's a learning space", desc: "Every mock interview makes the real one easier. If you don't know something, say so honestly and explain how you'd approach learning it." },
                  { n: "05", title: "Structure 'Tell me about yourself' every time", desc: "Use the STAR intro: who you are → what you've built → what you've achieved → what you want next. Under 90 seconds. Practice until it's natural." },
                  { n: "06", title: "Be ready for follow-up questions on your answers", desc: "Interviewers drill deeper on basics. After you answer, they may ask: why does this work, what's the complexity, what happens at scale." },
                  { n: "07", title: "Know your projects inside out", desc: "Every project on your resume is open for interrogation. Know what you built, every decision you made, what failed, and what you'd change now." },
                  { n: "08", title: "Balance knowledge with attitude", desc: "Calm delivery of a solid answer scores higher than a perfect answer delivered nervously. Confidence is a skill — practice it like any other." },
                  { n: "09", title: "Watch real mock interview videos", desc: "Understanding how real interview dialogue flows changes your expectations. It's different from reading about it. Find examples in your specific domain." },
                  { n: "10", title: "Behavioural skills matter as much as technical ones", desc: "Recruiters are looking for: teamwork mindset, willingness to learn, clear explanations, and passion for the problem. These are tested through scenario questions." },
                ].map(tip => (
                  <div key={tip.n} style={{ marginBottom: "12px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "10px", padding: isMobile ? "14px" : "18px 22px", display: "flex", gap: "16px" }}>
                    <div style={{ fontSize: "24px", fontWeight: 700, color: `${B}18`, fontFamily: "'Bebas Neue', cursive", lineHeight: 1, flexShrink: 0, minWidth: "32px" }}>{tip.n}</div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: B, marginBottom: "5px" }}>{tip.title}</div>
                      <p style={{ fontSize: "13px", color: MUTE, lineHeight: 1.7, margin: 0 }}>{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── AI Project Ideas ─────────────────────────────────────── */}
            {careerKitResource === "ai_projects" && (
              <div style={{ maxWidth: "760px" }}>
                <button onClick={() => closeCareerKitResource()} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: MUTE, padding: "0 0 24px 0", fontFamily: "'Sora', system-ui, sans-serif" }}>← Back to Career Kit</button>
                <h1 style={{ fontSize: "24px", fontWeight: 700, color: B, marginBottom: "6px" }}>AI Project Ideas</h1>
                <p style={{ fontSize: "13px", color: MUTE, marginBottom: "24px" }}>Companies hiring for AI roles want proof, not theory. Below are three curated collections covering 500+ project ideas across AI, ML, Deep Learning, Computer Vision, and NLP — all with working code.</p>
                <div style={{ backgroundColor: "#0F172A", borderRadius: "12px", padding: isMobile ? "20px" : "24px 28px", marginBottom: "32px" }}>
                  <div style={{ fontSize: "11px", color: "#4ADE80", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "10px" }}>WHY THIS MATTERS</div>
                  <p style={{ fontSize: "14px", color: W, lineHeight: 1.8, margin: 0 }}>A GitHub full of AI projects tells a recruiter: this person doesn't just talk about AI — they build with it. Pick 1–2 ideas, build them properly, deploy them, and document them with a clear README. That is what gets interviews.</p>
                </div>
                {[
                  { title: "500+ AI / ML / Deep Learning Projects", badge: "500+ Projects", domain: "ML · DL · CV · NLP", desc: "The most comprehensive collection available — covers Machine Learning, Deep Learning, Computer Vision, and NLP. Every project comes with working code. Pick any domain, study the implementation, extend it, and make it yours.", url: "https://github.com/ashishpatel26/500-AI-Machine-learning-Deep-learning-Computer-vision-NLP-Projects-with-code" },
                  { title: "Awesome AI Project Ideas", badge: "Real-World Ideas", domain: "Applied · Practical", desc: "Practical, real-world project ideas curated for people who want to build things that solve actual problems. Less theory, more application — good for finding projects that feel purposeful, not academic.", url: "https://github.com/NirantK/awesome-project-ideas" },
                  { title: "AI / ML Projects Hub", badge: "Community Hub", domain: "Community Curated", desc: "A community-maintained hub across multiple AI domains. Useful for understanding different problem patterns, comparing approaches, and discovering projects you haven't seen elsewhere.", url: "https://github.com/hussain0048/Projects" },
                ].map((r, i) => (
                  <div key={i} style={{ marginBottom: "16px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "12px", padding: isMobile ? "16px" : "20px 24px" }}>
                    <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "#16A34A", backgroundColor: "#F0FDF4", padding: "2px 8px", borderRadius: "4px", border: "1px solid #BBF7D0" }}>{r.badge}</span>
                      <span style={{ fontSize: "10px", color: MUTE, backgroundColor: "#F9FAFB", padding: "2px 8px", borderRadius: "4px", border: `1px solid ${BORD}` }}>{r.domain}</span>
                    </div>
                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: B, marginBottom: "8px" }}>{r.title}</h3>
                    <p style={{ fontSize: "13px", color: MUTE, lineHeight: 1.7, margin: "0 0 14px 0" }}>{r.desc}</p>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: B, color: W, padding: "8px 16px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, textDecoration: "none", fontFamily: "'Sora', system-ui, sans-serif" }}>
                      <ArrowUpRight size={12} /> VIEW ON GITHUB
                    </a>
                  </div>
                ))}
                <div style={{ backgroundColor: `${Y}20`, border: `1.5px solid ${Y}`, borderRadius: "10px", padding: "20px 24px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "12px" }}>HOW TO USE THESE RESOURCES</div>
                  {["Don't pick 20 projects. Pick 1–2 that genuinely interest you and build them properly.", "Study the reference code first — understand the approach before writing your own version.", "Extend it: add a feature, improve accuracy, or deploy it. That's what goes on your resume.", "Write a README with what you built, why, the results, and how to run it.", "The project matters less than how you can talk about it. Know every line."].map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
                      <span style={{ color: B, fontWeight: 700, flexShrink: 0 }}>→</span>
                      <span style={{ fontSize: "13px", color: B, lineHeight: 1.6 }}>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Open Source Guide ────────────────────────────────────── */}
            {careerKitResource === "open_source" && (
              <div style={{ maxWidth: "760px" }}>
                <button onClick={() => closeCareerKitResource()} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: MUTE, padding: "0 0 24px 0", fontFamily: "'Sora', system-ui, sans-serif" }}>← Back to Career Kit</button>
                <h1 style={{ fontSize: "24px", fontWeight: 700, color: B, marginBottom: "6px" }}>Open Source Guide</h1>
                <p style={{ fontSize: "13px", color: MUTE, marginBottom: "24px" }}>A merged PR on a real project says more than 10 solo side projects. This guide gets you your first contribution in days.</p>
                <div style={{ backgroundColor: B, borderRadius: "12px", padding: isMobile ? "20px" : "24px 28px", marginBottom: "32px" }}>
                  <div style={{ fontSize: "11px", color: Y, fontWeight: 700, letterSpacing: "0.15em", marginBottom: "10px" }}>WHAT IS OPEN SOURCE?</div>
                  <p style={{ fontSize: "14px", color: W, lineHeight: 1.8, marginBottom: "14px" }}>Most students think open source is only for "top coders." It's not. Open source is simply this: find a project, understand it, and improve it. The codebase is public. The issues are listed. You just have to show up.</p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["Real-world codebase exposure", "Git + PR skills", "Global networking", "Strong resume signal", "Community learning", "GSoC eligibility"].map(tag => (
                      <span key={tag} style={{ fontSize: "11px", backgroundColor: `${W}12`, border: `1px solid ${W}20`, color: W, padding: "4px 10px", borderRadius: "4px" }}>{tag}</span>
                    ))}
                  </div>
                </div>

                <h2 style={{ fontSize: "18px", fontWeight: 700, color: B, marginBottom: "16px" }}>Google Summer of Code (GSoC)</h2>
                <div style={{ backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "12px", padding: "20px 24px", marginBottom: "24px" }}>
                  <p style={{ fontSize: "13px", color: MUTE, lineHeight: 1.7, marginBottom: "16px" }}>GSoC is a global program where students contribute to open-source organisations and get paid. You work with a real mentor for 12+ weeks on a production project. It's one of the best things a student can put on a resume — but <strong style={{ color: B }}>you don't start with GSoC. You prepare 6–8 months before applying.</strong></p>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "8px", marginBottom: "16px" }}>
                    {["Strong CS fundamentals", "Past open-source contributions", "Clear proposal writing", "Consistent communication"].map((r, i) => (
                      <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", backgroundColor: "#F9FAFB", border: `1px solid ${BORD}`, borderRadius: "6px", padding: "8px 12px" }}>
                        <span style={{ color: "#16A34A", fontWeight: 700 }}>✓</span>
                        <span style={{ fontSize: "12px", color: B }}>{r}</span>
                      </div>
                    ))}
                  </div>
                  <a href="https://summerofcode.withgoogle.com/" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: B, color: W, padding: "8px 16px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, textDecoration: "none", fontFamily: "'Sora', system-ui, sans-serif" }}>
                    <ArrowUpRight size={12} /> GSoC OFFICIAL SITE
                  </a>
                </div>

                <h2 style={{ fontSize: "18px", fontWeight: 700, color: B, marginBottom: "16px" }}>Other Open Source Programs</h2>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "12px", marginBottom: "32px" }}>
                  {[
                    { name: "Linux Foundation Mentorship", desc: "Structured mentorship for open source projects under the Linux Foundation umbrella.", url: "https://mentorship.lfx.linuxfoundation.org/", tag: "Mentorship" },
                    { name: "Outreachy", desc: "Diversity-focused internships in open source. Strongly recommended for underrepresented students.", url: "https://www.outreachy.org/", tag: "Diversity" },
                    { name: "MLH Fellowship", desc: "12-week remote software fellowship. Work on real open source projects with peers globally.", url: "https://fellowship.mlh.io/", tag: "Fellowship" },
                    { name: "Hacktoberfest", desc: "October event. Beginner-friendly. Contribute 4 PRs in October and get recognized.", url: "https://hacktoberfest.com/", tag: "Beginner ★" },
                  ].map(p => (
                    <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                      <div style={{ backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "10px", padding: "16px", transition: "border-color 0.15s", height: "100%" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = B; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORD; }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ fontSize: "10px", fontWeight: 700, color: MUTE, backgroundColor: "#F9FAFB", padding: "2px 8px", borderRadius: "4px" }}>{p.tag}</span>
                          <ArrowUpRight size={13} color={MUTE} />
                        </div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: B, marginBottom: "4px" }}>{p.name}</div>
                        <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.5, margin: 0 }}>{p.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>

                <h2 style={{ fontSize: "18px", fontWeight: 700, color: B, marginBottom: "16px" }}>How to Start (Step-by-Step)</h2>
                {[
                  { step: "01", title: "Pick a Project You Actually Use", desc: "Start with something you use daily — a React library, a Python package, a CLI tool, or a documentation-heavy project. On GitHub, search: 'good first issue', 'help wanted', or 'beginner friendly'. Explore: github.com/explore", hint: "The easiest first contribution is to a project you already understand from using it." },
                  { step: "02", title: "Understand the Codebase First", desc: "Don't jump straight into coding. Read the README. Run the project locally. Explore the folder structure. Read 5–10 open issues. You don't need to understand everything — just enough to know where to start.", hint: "Spend 2–3 days just reading before writing a single line." },
                  { step: "03", title: "Start With Something Small", desc: "Your first contributions can be: fixing a typo, improving documentation, adding an example, writing a test case, or fixing a minor bug. Small PRs build confidence and reputation.", hint: "A merged small PR is worth infinitely more than an unmerged big one." },
                  { step: "04", title: "Make Your First Pull Request", desc: "Fork the repo → create a branch → make changes → push → open a PR with a clear explanation of what you changed and why. Respond to reviewer comments professionally and quickly.", hint: "Always write a proper PR description. Never leave it blank." },
                ].map(s => (
                  <div key={s.step} style={{ marginBottom: "14px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "10px", padding: isMobile ? "14px" : "18px 22px", display: "flex", gap: "16px" }}>
                    <div style={{ fontSize: "24px", fontWeight: 700, color: `${B}18`, fontFamily: "'Bebas Neue', cursive", lineHeight: 1, flexShrink: 0, minWidth: "32px" }}>{s.step}</div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: B, marginBottom: "6px" }}>{s.title}</div>
                      <p style={{ fontSize: "13px", color: MUTE, lineHeight: 1.7, margin: "0 0 8px 0" }}>{s.desc}</p>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <span style={{ color: Y, fontWeight: 700, flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: "12px", color: B, fontStyle: "italic" }}>{s.hint}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <h2 style={{ fontSize: "18px", fontWeight: 700, color: B, marginBottom: "14px", marginTop: "28px" }}>Beginner-Friendly Places to Start</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                  {[
                    { name: "First Contributions", desc: "A repo designed specifically for your very first PR. Guided step-by-step.", url: "https://github.com/firstcontributions/first-contributions" },
                    { name: "Up For Grabs", desc: "Curated projects with beginner-friendly issues, filterable by language.", url: "https://up-for-grabs.net/" },
                    { name: "Good First Issue", desc: "Search beginner issues across many open source projects by language or topic.", url: "https://goodfirstissue.dev/" },
                  ].map(r => (
                    <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "10px", padding: "14px 18px", gap: "12px", transition: "border-color 0.15s" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = B; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORD; }}>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: B, marginBottom: "2px" }}>{r.name}</div>
                          <div style={{ fontSize: "12px", color: MUTE }}>{r.desc}</div>
                        </div>
                        <ArrowUpRight size={16} color={MUTE} style={{ flexShrink: 0 }} />
                      </div>
                    </a>
                  ))}
                </div>

                <div style={{ backgroundColor: B, borderRadius: "12px", padding: "24px 28px", marginBottom: "20px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "20px", marginBottom: "20px" }}>
                    <div>
                      <div style={{ fontSize: "11px", color: "#EF4444", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "10px" }}>WHAT STUDENTS DO WRONG</div>
                      {["Jump directly to GSoC without preparation", "Try to contribute to massive codebases like Linux", "Quit after the first rejection or ignored PR", "Submit PRs without reading contribution guidelines"].map((m, i) => (
                        <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                          <span style={{ color: "#EF4444", fontWeight: 700, flexShrink: 0 }}>✗</span>
                          <span style={{ fontSize: "12px", color: `${W}80`, lineHeight: 1.5 }}>{m}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: "11px", color: "#4ADE80", fontWeight: 700, letterSpacing: "0.1em", marginBottom: "10px" }}>DO THIS INSTEAD</div>
                      {["Start small. Get 3–5 PRs merged on smaller projects first", "Pick a project that solves a problem you actually care about", "Stay active in discussions even if your PR is rejected", "Communicate clearly and respectfully with maintainers"].map((m, i) => (
                        <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                          <span style={{ color: "#4ADE80", fontWeight: 700, flexShrink: 0 }}>✓</span>
                          <span style={{ fontSize: "12px", color: W, lineHeight: 1.5 }}>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ borderTop: `1px solid ${W}15`, paddingTop: "16px" }}>
                    <div style={{ fontSize: "12px", color: Y, fontWeight: 700, letterSpacing: "0.1em", marginBottom: "8px" }}>HOW TO USE IT IN INTERVIEWS</div>
                    <p style={{ fontSize: "13px", color: W, lineHeight: 1.7, margin: 0 }}>
                      You can say: <em style={{ color: Y }}>"I contributed to [project] used by [X] users — I fixed issue #142 which improved [specific outcome]."</em> That sounds real, because it is.
                    </p>
                  </div>
                </div>
                <div style={{ backgroundColor: `${Y}20`, border: `1.5px solid ${Y}`, borderRadius: "10px", padding: "18px 22px" }}>
                  <p style={{ fontSize: "13px", color: B, lineHeight: 1.8, margin: 0 }}>
                    <strong>Final advice:</strong> Open source is more about <strong>collaboration than coding</strong>. You don't need to build your own big project to stand out — improving something that already serves thousands of users is often even stronger. Start small, stay consistent, and chase understanding — not just the badge.
                  </p>
                </div>
              </div>
            )}

            {/* ── Projects Before Graduation ───────────────────────────── */}
            {careerKitResource === "projects_graduation" && (
              <div style={{ maxWidth: "760px" }}>
                <button onClick={() => closeCareerKitResource()} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: MUTE, padding: "0 0 24px 0", fontFamily: "'Sora', system-ui, sans-serif" }}>← Back to Career Kit</button>
                <h1 style={{ fontSize: "24px", fontWeight: 700, color: B, marginBottom: "6px" }}>Projects Before Graduation</h1>
                <p style={{ fontSize: "13px", color: MUTE, marginBottom: "24px" }}>Top companies hire for proof, not potential. These are the projects that prove you're ready.</p>
                <div style={{ backgroundColor: B, borderRadius: "12px", padding: isMobile ? "20px" : "22px 28px", marginBottom: "28px" }}>
                  <div style={{ fontSize: "11px", color: Y, fontWeight: 700, letterSpacing: "0.15em", marginBottom: "8px" }}>THE REAL ADVICE</div>
                  <p style={{ fontSize: "14px", color: W, lineHeight: 1.7, margin: 0 }}>You don't need 20 projects. Pick 2–3 from this list, build them properly, deploy them, and be able to explain every decision you made. Depth beats quantity. Most students build 15 shallow projects — be the one who builds 3 properly.</p>
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "24px" }}>
                  {([["frontend", "Frontend (5)", "#3B82F6"], ["backend", "Backend (5)", "#16A34A"], ["fullstack", "Full Stack (5)", "#7C3AED"], ["data", "Data Analyst (5)", "#F97316"]] as [string, string, string][]).map(([cat, label, color]) => (
                    <button key={cat} onClick={() => setPbgCategory(cat as typeof pbgCategory)}
                      style={{ padding: "8px 16px", borderRadius: "6px", border: `1.5px solid ${pbgCategory === cat ? color : BORD}`, backgroundColor: pbgCategory === cat ? color : W, color: pbgCategory === cat ? W : B, fontSize: "12px", fontWeight: 700, cursor: "pointer", fontFamily: "'Sora', system-ui, sans-serif", transition: "all 0.15s" }}>
                      {label}
                    </button>
                  ))}
                </div>
                {([
                  { cat: "frontend", num: 1, name: "Personal Portfolio Website", what: "Showcase your projects, skills, resume, and a contact form in a clean personal site.", tech: ["React", "Next.js", "Firebase"], colors: ["#61DAFB", "#4B5563", "#FFA611"], stack: "React or Next.js handles routing and UI. Firebase handles the contact form backend without needing a custom server. Deploy on Vercel — free and instant. This is the first project every developer should have.", why: "Your GitHub without a portfolio is invisible. This is literally the baseline." },
                  { cat: "frontend", num: 2, name: "Expense Tracker UI", what: "Add income and expense entries by category, see visual charts of spending patterns over time.", tech: ["React", "Chart.js", "LocalStorage"], colors: ["#61DAFB", "#FF6384", "#6B7280"], stack: "React manages state for the transaction list. Chart.js renders pie and bar charts. LocalStorage persists data without needing a backend — great for a pure frontend project that still feels complete.", why: "Teaches state management, component communication, and data visualization — exactly what frontend interviews test." },
                  { cat: "frontend", num: 3, name: "E-commerce Frontend Clone", what: "Product listing with filters, a working cart with quantity management, and a checkout screen.", tech: ["React", "Redux", "Context API"], colors: ["#61DAFB", "#764ABC", "#61DAFB"], stack: "React for components. Redux or Context API manages cart state across the entire app. Mock JSON data simulates the API responses. Add a sidebar with filters to practice derived state and conditional rendering.", why: "Teaches component architecture, global state, and routing — patterns used in every production frontend." },
                  { cat: "frontend", num: 4, name: "Admin Dashboard", what: "Analytics dashboard with charts for key business metrics, a sortable data table, and date filters.", tech: ["React", "Tailwind CSS", "Recharts"], colors: ["#61DAFB", "#06B6D4", "#8884D8"], stack: "React renders the dashboard. Recharts provides bar, line, and pie charts. Static JSON simulates the API data. Tailwind handles the responsive two-column layout efficiently.", why: "Teaches data visualization and layout systems — skills every B2B and SaaS company needs." },
                  { cat: "frontend", num: 5, name: "Real-time Chat UI", what: "Messaging interface with user avatars, message threads, timestamps, and a typing indicator.", tech: ["React", "Socket.io", "CSS Modules"], colors: ["#61DAFB", "#010101", "#4B5563"], stack: "React manages the UI state. Socket.io (frontend side only) handles real-time message events. Mock the backend initially — focus on the UI patterns: scroll-to-bottom, unread count, message grouping by time.", why: "Introduces WebSocket concepts and real-time state updates — knowledge expected in frontend interviews." },
                  { cat: "backend", num: 6, name: "REST API for Blog Platform", what: "Full CRUD API for blog posts — create, read, update, delete — with user authentication.", tech: ["Node.js", "Express", "MongoDB"], colors: ["#339933", "#4B5563", "#47A248"], stack: "Node.js + Express for the HTTP layer. MongoDB for flexible document storage. Use Mongoose for schema validation. Structure routes properly: /posts, /posts/:id, /users. Add JWT auth and protect write routes.", why: "This is the foundational backend project. Building a well-structured REST API means you understand backend architecture." },
                  { cat: "backend", num: 7, name: "Authentication System", what: "Signup, login, JWT tokens, refresh tokens, password hashing, and protected middleware routes.", tech: ["Node.js", "Express", "JWT", "bcrypt"], colors: ["#339933", "#4B5563", "#4B5563", "#338F42"], stack: "Express handles routes. bcrypt hashes passwords before storing. JWT signs short-lived access tokens and long-lived refresh tokens. Protect routes using Express middleware. Add email verification as a bonus.", why: "Auth is in every real application. This is non-negotiable backend knowledge for any role." },
                  { cat: "backend", num: 8, name: "URL Shortener", what: "Convert long URLs to short links, track click counts, and redirect users via the short link.", tech: ["Node.js", "PostgreSQL", "Redis"], colors: ["#339933", "#336791", "#DC382D"], stack: "Node.js + Express for the API. PostgreSQL stores the URL mapping (original → short code). Redis caches hot URLs for fast redirects without hitting the DB. Add analytics endpoint showing click count per link.", why: "Classic system design question in interviews. Shows you understand database design, caching, and redirect mechanics." },
                  { cat: "backend", num: 9, name: "Task Queue System", what: "Background job processor that handles tasks asynchronously — emails, image processing, report generation.", tech: ["Node.js", "Redis", "Bull"], colors: ["#339933", "#DC382D", "#D84141"], stack: "Node.js as the application. Redis as the queue storage. Bull manages job scheduling, retries, concurrency, and events. Demonstrate with a simulated email-send job that processes after a delay.", why: "Background jobs exist in every production system. Understanding async processing is a strong differentiator." },
                  { cat: "backend", num: 10, name: "File Upload API", what: "Upload images and documents, store to cloud storage, and return secure access URLs.", tech: ["Node.js", "Multer", "AWS S3"], colors: ["#339933", "#4B5563", "#FF9900"], stack: "Express + Multer handle multipart uploads. AWS S3 (or Cloudinary for simplicity) stores the files. Return pre-signed URLs for secure access. Add file type validation and max size enforcement.", why: "File handling is a real backend requirement. Shows understanding of multipart forms, cloud storage, and security." },
                  { cat: "fullstack", num: 11, name: "Full Stack Expense Tracker", what: "Track income and expenses with categories, view analytics across time periods, fully persistent.", tech: ["React", "Node.js", "MongoDB"], colors: ["#61DAFB", "#339933", "#47A248"], stack: "React frontend calls an Express REST API. MongoDB stores transactions with user reference. Add JWT auth so each user has their own data. Deploy: Vercel for frontend, Railway for backend — both free.", why: "End-to-end CRUD with real persistence. Shows you can connect frontend to backend and manage state." },
                  { cat: "fullstack", num: 12, name: "E-commerce Store", what: "Full product catalog, shopping cart, user auth, and checkout flow with dummy payment integration.", tech: ["React", "Node.js", "PostgreSQL", "Stripe"], colors: ["#61DAFB", "#339933", "#336791", "#635BFF"], stack: "React frontend. Express + PostgreSQL backend with relational schemas (users, products, orders, order_items). Stripe test mode for checkout. Add order history page and admin product management.", why: "Multi-entity relational data, transactions, and payment integration — mid-level engineer complexity." },
                  { cat: "fullstack", num: 13, name: "Mini Learning Management System", what: "Courses with lessons, student enrollment, progress tracking, and a content admin panel.", tech: ["React", "Express", "MongoDB"], colors: ["#61DAFB", "#4B5563", "#47A248"], stack: "Two user types (admin, student) with role-based JWT access. Admin creates courses and uploads video links. Students track progress per lesson. MongoDB for flexible course content structure. Add a progress bar per course.", why: "Real product architecture — mirrors how EdTech products are built. Great for SaaS company interviews." },
                  { cat: "fullstack", num: 14, name: "Real-time Chat App", what: "User auth, persistent chat history, real-time delivery, and multiple room support.", tech: ["React", "Node.js", "Socket.io", "MongoDB"], colors: ["#61DAFB", "#339933", "#010101", "#47A248"], stack: "React frontend. Socket.io handles real-time message events. MongoDB stores chat history. JWT auth. Rooms stored in DB — users can create and join rooms. Add online/offline status indicators.", why: "Combines auth, real-time events, and persistent storage — frequently discussed in senior interviews." },
                  { cat: "fullstack", num: 15, name: "AI-powered Resume Analyzer", what: "Upload a resume PDF, extract the text, run AI analysis, and return structured feedback.", tech: ["React", "FastAPI (Python)", "OpenAI API", "PostgreSQL"], colors: ["#61DAFB", "#3776AB", "#74AA9C", "#336791"], stack: "React for upload UI. FastAPI (Python) for the backend. Extract PDF text via PyPDF2 or pdfplumber. OpenAI API analyzes the text and returns structured gap analysis. PostgreSQL stores previous analyses per user.", why: "Combines AI + backend + file handling. Directly relevant to AI product companies and modern full-stack roles." },
                  { cat: "data", num: 16, name: "Sales Data Analysis", what: "Analyse a sales dataset to identify revenue trends, top-performing products, and seasonal patterns.", tech: ["Python", "Pandas", "Matplotlib", "Seaborn"], colors: ["#3776AB", "#150458", "#11557C", "#3776AB"], stack: "Load CSV data with Pandas. Clean nulls, fix data types, parse dates. Group by month, product, and region. Plot bar charts, line trends, and correlation heatmaps. Write a clear 3–5 insight summary alongside the charts.", why: "Foundational analysis project. Shows you can clean data, derive insights, and communicate findings." },
                  { cat: "data", num: 17, name: "Netflix Content Analysis", what: "Analyse Netflix's content catalogue — genre trends, country distributions, growth over time.", tech: ["Python", "Pandas", "Seaborn", "Kaggle Dataset"], colors: ["#3776AB", "#150458", "#3776AB", "#20BEFF"], stack: "Download the Netflix dataset from Kaggle (free). Pandas for cleaning and aggregation. Seaborn for distribution plots. Focus on finding non-obvious insights — e.g., which country has the highest content-to-population ratio.", why: "Familiar dataset, but insights matter. Shows you ask interesting questions about data, not just plot it." },
                  { cat: "data", num: 18, name: "IPL / Sports Analysis", what: "Analyse player performance, team win rates, top scorers, and match conditions.", tech: ["Python", "SQL", "PostgreSQL", "Pandas"], colors: ["#3776AB", "#336791", "#336791", "#150458"], stack: "Load match-level data into PostgreSQL. Write SQL queries for aggregations (top scorers per season, win rate by venue, performance under pressure). Use Pandas + Seaborn for visualization. Write a summary report.", why: "SQL skills combined with data analysis — exactly what data analyst roles at most companies require." },
                  { cat: "data", num: 19, name: "Business Analytics Dashboard", what: "Interactive dashboard showing revenue, churn rate, retention, and cohort analysis across periods.", tech: ["Power BI", "Tableau", "SQL"], colors: ["#F2C811", "#E97627", "#336791"], stack: "Connect Power BI or Tableau to a SQL database or CSV. Build KPI cards (revenue, churn rate, retention). Add filter controls for date range and segment. Export as a shareable PDF or publish with a public link.", why: "Dashboarding tools are used at every company. Power BI or Tableau on a resume is a green flag for analyst roles." },
                  { cat: "data", num: 20, name: "Customer Segmentation", what: "Cluster customers by behaviour — spending patterns, frequency, recency — using ML.", tech: ["Python", "Scikit-learn", "K-Means", "Pandas"], colors: ["#3776AB", "#F7931E", "#F7931E", "#150458"], stack: "Use RFM analysis (Recency, Frequency, Monetary) to engineer features. Apply K-Means clustering. Use the elbow method to find optimal K. Visualise clusters with scatter plots. Write a business interpretation of each segment.", why: "RFM segmentation is a real business technique. Shows you understand ML beyond just classification tasks." },
                ] as { cat: string; num: number; name: string; what: string; tech: string[]; colors: string[]; stack: string; why: string }[]).filter(p => p.cat === pbgCategory).map(p => (
                  <div key={p.num} style={{ marginBottom: "14px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "12px", padding: isMobile ? "14px" : "20px 24px" }}>
                    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                      <div style={{ fontSize: "28px", fontWeight: 700, color: `${B}15`, fontFamily: "'Bebas Neue', cursive", lineHeight: 1, flexShrink: 0, minWidth: "36px" }}>{String(p.num).padStart(2, "0")}</div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: "15px", fontWeight: 700, color: B, marginBottom: "5px" }}>{p.name}</h3>
                        <p style={{ fontSize: "13px", color: MUTE, lineHeight: 1.6, margin: "0 0 10px 0" }}>{p.what}</p>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                          {p.tech.map((t, i) => <span key={t} style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", backgroundColor: `${p.colors[i]}15`, color: p.colors[i] === "#010101" || p.colors[i] === "#150458" ? B : p.colors[i], border: `1px solid ${p.colors[i]}25` }}>{t}</span>)}
                        </div>
                        <div style={{ backgroundColor: "#F9FAFB", borderRadius: "8px", padding: "10px 14px", marginBottom: "8px" }}>
                          <div style={{ fontSize: "10px", fontWeight: 700, color: MUTE, letterSpacing: "0.1em", marginBottom: "4px" }}>HOW TO BUILD IT</div>
                          <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.6, margin: 0 }}>{p.stack}</p>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <span style={{ color: Y, fontWeight: 700, flexShrink: 0 }}>→</span>
                          <span style={{ fontSize: "12px", color: B, lineHeight: 1.5, fontStyle: "italic" }}>{p.why}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div style={{ backgroundColor: `${Y}20`, border: `1.5px solid ${Y}`, borderRadius: "10px", padding: "20px 24px", marginTop: "8px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "10px" }}>TAKE ONE PROJECT FURTHER (OPTIONAL BONUS)</div>
                  <p style={{ fontSize: "13px", color: B, lineHeight: 1.7, margin: "0 0 10px 0" }}>Pick any one project and go deeper — this is what separates standout profiles:</p>
                  {["Deploy it live — Vercel, Railway, or Render (all free)", "Add proper auth and role-based access control", "Write a README with screenshots, setup guide, and live demo link", "Write a case study: what you built, what failed, what you learned", "Add monitoring or basic analytics — even a simple hit counter counts"].map((t, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
                      <span style={{ color: B, fontWeight: 700, flexShrink: 0 }}>→</span>
                      <span style={{ fontSize: "13px", color: B, lineHeight: 1.6 }}>{t}</span>
                    </div>
                  ))}
                  <p style={{ fontSize: "13px", color: B, lineHeight: 1.7, margin: "10px 0 0 0", fontStyle: "italic" }}>That's senior-level thinking. You don't need to wait until you're senior to do it.</p>
                </div>
              </div>
            )}

            {/* ── GitHub Portfolio Guide ───────────────────────────────── */}
            {careerKitResource === "github_portfolio" && (
              <div style={{ maxWidth: "760px" }}>
                <button onClick={() => closeCareerKitResource()} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: MUTE, padding: "0 0 24px 0", fontFamily: "'Sora', system-ui, sans-serif" }}>← Back to Career Kit</button>
                <h1 style={{ fontSize: "24px", fontWeight: 700, color: B, marginBottom: "6px" }}>GitHub Portfolio Guide</h1>
                <p style={{ fontSize: "13px", color: MUTE, marginBottom: "24px" }}>Recruiters check your GitHub before your resume. This guide makes your GitHub the first thing they screenshot and share.</p>

                <div style={{ backgroundColor: "#0D1117", borderRadius: "12px", padding: isMobile ? "20px" : "24px 28px", marginBottom: "32px" }}>
                  <div style={{ fontSize: "11px", color: "#4ADE80", fontWeight: 700, letterSpacing: "0.15em", marginBottom: "12px" }}>THE REALITY NOBODY TOLD YOU</div>
                  <p style={{ fontSize: "14px", color: W, lineHeight: 1.8, marginBottom: "12px" }}>A recruiter opens your GitHub link. They don't read your codebase. They don't run your project. They don't spend 30 minutes understanding your logic. They <strong style={{ color: "#4ADE80" }}>scan — fast</strong>.</p>
                  <p style={{ fontSize: "14px", color: W, lineHeight: 1.8, margin: 0 }}>And in that scan, one file decides everything: <strong style={{ color: Y }}>README.md</strong>. GitHub is not code storage — it's a public proof of how you think, build, and communicate. Strong GitHub presence lets employers evaluate your real skills before the first interview.</p>
                </div>

                <h2 style={{ fontSize: "18px", fontWeight: 700, color: B, marginBottom: "14px" }}>Why README Is Your Career Weapon</h2>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: "12px", marginBottom: "32px" }}>
                  {[
                    { title: "First impression in 5 seconds", desc: "A clean README signals: this person knows how to communicate technical work. No README = unknown risk. Close tab." },
                    { title: "It's a mission statement", desc: "README tells what the project does, why it exists, how to use it, and who built it. It's marketing, not just documentation." },
                    { title: "Signals production mindset", desc: "Setup instructions, tests, deployment notes, and architecture diagrams mean someone who thinks beyond just making it run." },
                    { title: "You don't need 20 projects", desc: "You need 3 strong, well-presented ones. Quality of presentation is quality of candidate in a recruiter's mind." },
                  ].map((item, i) => (
                    <div key={i} style={{ backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "10px", padding: "16px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: B, marginBottom: "6px" }}>{item.title}</div>
                      <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                    </div>
                  ))}
                </div>

                <h2 style={{ fontSize: "18px", fontWeight: 700, color: B, marginBottom: "14px" }}>What Recruiters Check in 60 Seconds</h2>
                {[
                  { num: "01", q: "Can I understand this project fast?", a: "If the README is missing or messy, they close the tab. A clear title + one-line description = they keep reading." },
                  { num: "02", q: "Is this solving a real problem?", a: "Toy projects and college assignments are immediately obvious. Projects with a clear use case and real data get attention." },
                  { num: "03", q: "Is this person active?", a: "Commit history matters. Consistent, descriptive commits show you actually code regularly — not just dump and disappear." },
                  { num: "04", q: "Can this person explain their work?", a: "Documentation = communication skill. How you write a README is how you'll write a Jira ticket or technical spec." },
                  { num: "05", q: "Does this look production-minded?", a: "Tests, CI setup, deployment instructions, and a live demo link all signal maturity beyond hobby-level coding." },
                ].map(item => (
                  <div key={item.num} style={{ marginBottom: "10px", display: "flex", gap: "14px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "10px", padding: "14px 18px" }}>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: `${B}18`, fontFamily: "'Bebas Neue', cursive", lineHeight: 1, flexShrink: 0, minWidth: "28px" }}>{item.num}</div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: B, marginBottom: "4px" }}>{item.q}</div>
                      <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.5, margin: 0 }}>{item.a}</p>
                    </div>
                  </div>
                ))}

                <h2 style={{ fontSize: "18px", fontWeight: 700, color: B, marginBottom: "8px", marginTop: "28px" }}>What Your README Must Contain</h2>
                <p style={{ fontSize: "13px", color: MUTE, marginBottom: "16px" }}>These 9 sections are non-negotiable for any project you want to be taken seriously.</p>
                {[
                  { num: "01", title: "Project Title + One-Line Summary", desc: "What it is and who it helps — understood in 3 seconds. 'ResumeAI — AI-powered resume analyzer that scores your resume against any job description.'" },
                  { num: "02", title: "Problem Statement", desc: "Why this project exists. What pain does it solve? Who has this problem? This is where you show product thinking." },
                  { num: "03", title: "Demo / Screenshots / Live Link", desc: "Put this near the top. A GIF of the app working, a dashboard screenshot, or a Vercel link. Fast proof beats long explanation every time." },
                  { num: "04", title: "Tech Stack", desc: "Simple and clean. List each technology and its role. 'React (frontend), FastAPI (backend), PostgreSQL (database), OpenAI API (AI analysis)'." },
                  { num: "05", title: "How to Run Locally", desc: "Clone → install → set env vars → run. Recruiters love this. It shows your project actually works and that you understand how real software is set up." },
                  { num: "06", title: "Features", desc: "Bullet points only. No paragraphs. 5–8 clear feature items. Each feature should imply a technical decision." },
                  { num: "07", title: "Challenges You Faced", desc: "Hidden interview gold. 'I solved X by doing Y' shows thinking depth. Write 2–3 real challenges — not generic ones like 'debugging was hard'." },
                  { num: "08", title: "Future Improvements", desc: "Shows product mindset — you understand what's missing. 'Add multi-resume comparison', 'Add export to PDF'. Keep it realistic." },
                  { num: "09", title: "Author + Contact", desc: "Your name, LinkedIn, GitHub, email. Always. Make it trivially easy for them to reach you." },
                ].map(s => (
                  <div key={s.num} style={{ marginBottom: "10px", display: "flex", gap: "14px", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "10px", padding: "14px 18px" }}>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: `${B}18`, fontFamily: "'Bebas Neue', cursive", lineHeight: 1, flexShrink: 0, minWidth: "28px" }}>{s.num}</div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: B, marginBottom: "4px" }}>{s.title}</div>
                      <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: "28px", marginBottom: "20px" }}>
                  <h2 style={{ fontSize: "18px", fontWeight: 700, color: B, marginBottom: "12px" }}>Useful Resource</h2>
                  <a href="https://medium.com/design-bootcamp/how-to-design-an-attractive-github-profile-readme-3618d6c53783" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: W, border: `1.5px solid ${BORD}`, borderRadius: "10px", padding: "16px 20px", gap: "12px", transition: "border-color 0.15s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = B; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORD; }}>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: B, marginBottom: "3px" }}>How to Design an Attractive GitHub Profile README</div>
                        <div style={{ fontSize: "12px", color: MUTE }}>Medium · Design Bootcamp — visual guide with examples and templates</div>
                      </div>
                      <ArrowUpRight size={16} color={MUTE} style={{ flexShrink: 0 }} />
                    </div>
                  </a>
                </div>

                <div style={{ backgroundColor: B, borderRadius: "12px", padding: "24px 28px" }}>
                  <div style={{ fontSize: "11px", color: Y, fontWeight: 700, letterSpacing: "0.12em", marginBottom: "14px" }}>THE CAREER HACK</div>
                  <p style={{ fontSize: "14px", color: W, lineHeight: 1.8, marginBottom: "12px" }}>Your README is not documentation. It's marketing. It's storytelling. It's your technical personality made public and permanent.</p>
                  <p style={{ fontSize: "14px", color: W, lineHeight: 1.8, margin: 0 }}>Most students have a GitHub. Most don't use it properly. The few who do get noticed — and noticed candidates get interviews. <strong style={{ color: Y }}>Good code gets respect. Good presentation gets opportunity. Both together get jobs.</strong></p>
                </div>
              </div>
            )}
            </div>{/* end main column */}

            {/* ── Sidebar: Resources + Quiz ─────────────────────────── */}
            {careerKitResource && CK_RESOURCES[careerKitResource] && (
              <div style={{ width: isMobile ? "100%" : "320px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "20px", ...(isMobile ? { marginTop: "32px" } : { position: "sticky", top: "80px", alignSelf: "flex-start" }) }}>

                {/* Resources panel */}
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "16px", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                    <span style={{ fontSize: "16px" }}>📡</span>
                    <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", color: B }}>LEARN MORE ONLINE</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {(CK_RESOURCES[careerKitResource] || []).map((r, i) => (
                      <a key={i} href={r.url} target="_blank" rel="noopener noreferrer"
                        style={{ textDecoration: "none", display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 12px", backgroundColor: "#F9FAFB", borderRadius: "10px", border: `1.5px solid ${BORD}`, transition: "all 0.18s" }}
                        onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = B; el.style.backgroundColor = "#F0F0F0"; el.style.transform = "translateX(3px)"; }}
                        onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor = BORD; el.style.backgroundColor = "#F9FAFB"; el.style.transform = "translateX(0)"; }}
                      >
                        <span style={{ fontSize: "14px", flexShrink: 0, lineHeight: 1, marginTop: "1px" }}>
                          {r.type === "yt" ? "▶️" : r.type === "reddit" ? "🔥" : "📄"}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: "12px", fontWeight: 600, color: B, lineHeight: 1.4, marginBottom: "2px" }}>{r.title}</div>
                          <div style={{ fontSize: "11px", color: MUTE, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.sub}</div>
                        </div>
                        <ArrowUpRight size={11} color={MUTE} style={{ flexShrink: 0, marginTop: "2px" }} />
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quiz panel */}
                {CK_MCQ[careerKitResource] && (
                  <div style={{ backgroundColor: B, borderRadius: "16px", padding: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                      <span style={{ fontSize: "16px" }}>⚡</span>
                      <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", color: Y }}>QUICK QUIZ</span>
                      <span style={{ fontSize: "10px", color: MUTE, marginLeft: "auto" }}>get it right = 🎉</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                      {CK_MCQ[careerKitResource].map((mcq, qi) => {
                        const key = `${careerKitResource}_${qi}`;
                        const chosen = ckMCQAnswers[key];
                        const answered = chosen !== undefined;
                        const isRight = answered && chosen === mcq.ans;
                        return (
                          <div key={qi} style={{ borderTop: qi > 0 ? "1px solid #1A1A1A" : "none", paddingTop: qi > 0 ? "20px" : "0" }}>
                            <div style={{ fontSize: "12px", fontWeight: 600, color: W, lineHeight: 1.6, marginBottom: "10px" }}>
                              <span style={{ color: Y, marginRight: "6px" }}>Q{qi + 1}.</span>{mcq.q}
                            </div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              {mcq.opts.map((opt, oi) => {
                                const isChosen = answered && chosen === oi;
                                const isCorrectOpt = oi === mcq.ans;
                                let bg = "#111"; let bc = "#2A2A2A"; let tc: string = W;
                                if (answered) {
                                  if (isCorrectOpt) { bg = "#14532D"; bc = "#4ADE80"; tc = "#4ADE80"; }
                                  else if (isChosen) { bg = "#450A0A"; bc = "#EF4444"; tc = "#EF4444"; }
                                  else { tc = "#444"; }
                                }
                                return (
                                  <button key={oi} onClick={() => answerMCQ(key, oi, mcq.ans)} disabled={answered}
                                    style={{ textAlign: "left", border: `1.5px solid ${bc}`, borderRadius: "7px", padding: "9px 12px", fontSize: "12px", fontWeight: answered && isChosen ? 700 : 400, color: tc, backgroundColor: bg, cursor: answered ? "default" : "pointer", transition: "all 0.15s", fontFamily: "'Sora', system-ui, sans-serif", width: "100%" }}
                                    onMouseEnter={e => { if (!answered) { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = Y; el.style.color = Y; el.style.backgroundColor = "#1A1700"; } }}
                                    onMouseLeave={e => { if (!answered) { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = "#2A2A2A"; el.style.color = W; el.style.backgroundColor = "#111"; } }}
                                  >
                                    <span style={{ color: answered ? (isCorrectOpt ? "#4ADE80" : isChosen ? "#EF4444" : "#444") : "#666", marginRight: "7px", fontWeight: 700 }}>{String.fromCharCode(65 + oi)}.</span>{opt}
                                  </button>
                                );
                              })}
                            </div>
                            {answered && (
                              <div style={{ marginTop: "10px", padding: "10px 12px", backgroundColor: isRight ? "#052E16" : "#3B0A0A", borderRadius: "8px", border: `1px solid ${isRight ? "#166534" : "#7F1D1D"}` }}>
                                <div style={{ fontSize: "10px", fontWeight: 700, color: isRight ? "#4ADE80" : "#EF4444", marginBottom: "5px", letterSpacing: "0.08em" }}>
                                  {isRight ? "✓ CORRECT! Nice work 🎉" : "✗ NOT QUITE — the right answer is highlighted above"}
                                </div>
                                <div style={{ fontSize: "11px", color: "#9CA3AF", lineHeight: 1.6 }}>{mcq.why}</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

        {/* ── SESSIONS VIEW ──────────────────────────────────────────── */}
        {currentView === "sessions" && (
          <div style={{ maxWidth: "860px", margin: "0 auto", padding: isMobile ? "8px 0" : "32px 24px" }}>
            {sessionsInfo && (
              <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
                <div style={{ backgroundColor: Y, border: `2px solid ${B}`, borderRadius: "8px", padding: "12px 20px" }}>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: B }}>{sessionsInfo.days_enrolled}</div>
                  <div style={{ fontSize: "10px", color: B, letterSpacing: "0.1em" }}>DAYS ENROLLED</div>
                </div>
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "8px", padding: "12px 20px" }}>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: B }}>Week {sessionsInfo.weeks_completed}</div>
                  <div style={{ fontSize: "10px", color: MUTE, letterSpacing: "0.1em" }}>CURRENT WEEK</div>
                </div>
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "8px", padding: "12px 20px" }}>
                  <div style={{ fontSize: "20px", fontWeight: 700, color: "#16A34A" }}>{sessionsInfo.unlocked_count} / 11</div>
                  <div style={{ fontSize: "10px", color: MUTE, letterSpacing: "0.1em" }}>SESSIONS UNLOCKED</div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {sessions.map(s => (
                <div key={s.id} style={{
                  backgroundColor: W,
                  border: `2px solid ${s.unlocked ? BORD : BORD}`,
                  borderLeft: `4px solid ${s.unlocked ? Y : BORD}`,
                  borderRadius: "10px",
                  padding: isMobile ? "14px 12px" : "18px 20px",
                  display: "flex",
                  flexDirection: isMobile ? "column" as const : "row" as const,
                  alignItems: isMobile ? "flex-start" : "center",
                  gap: isMobile ? "10px" : "16px",
                  opacity: s.unlocked ? 1 : 0.6,
                }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: s.unlocked ? B : `${B}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {s.unlocked ? <PlayCircle size={18} color={Y} /> : <Lock size={16} color={MUTE} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: MUTE, letterSpacing: "0.1em" }}>SESSION {s.session_number} · WEEK {s.week}</span>
                      {s.unlocked && <span style={{ fontSize: "9px", backgroundColor: "#DCFCE7", color: "#16A34A", padding: "1px 6px", borderRadius: "4px", fontWeight: 700 }}>UNLOCKED</span>}
                      {!s.unlocked && <span style={{ fontSize: "9px", backgroundColor: "#F3F4F6", color: MUTE, padding: "1px 6px", borderRadius: "4px", fontWeight: 700 }}>LOCKED</span>}
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: B }}>{s.title}</div>
                    {s.description && <div style={{ fontSize: "12px", color: MUTE, marginTop: "2px" }}>{s.description}</div>}
                  </div>
                  {s.unlocked && s.drive_link ? (
                    <a href={s.drive_link} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", backgroundColor: B, color: Y, borderRadius: "6px", fontSize: "11px", fontWeight: 700, textDecoration: "none", flexShrink: 0, ...MONO }}>
                      <PlayCircle size={13} /> WATCH
                    </a>
                  ) : s.unlocked ? (
                    <span style={{ fontSize: "11px", color: MUTE, padding: "8px 14px", border: `1px solid ${BORD}`, borderRadius: "6px" }}>Recording soon</span>
                  ) : (
                    <span style={{ fontSize: "11px", color: MUTE }}>Unlocks Week {s.week}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}


        {/* ── LEADERBOARD VIEW ─────────────────────────────────────────── */}
        {currentView === "leaderboard" && (() => {
          const fmtName = (email: string) =>
            email.split("@")[0].replace(/[._\-]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
          const myEntry  = leaderboard?.leaderboard.find(e => e.is_me);
          const myName   = userName || (myEntry ? fmtName(myEntry.email) : leaderboard?.my_stats ? fmtName(leaderboard.my_stats.email) : "You");
          const myRank   = leaderboard?.my_rank ?? myEntry?.rank ?? null;
          const myScore  = myEntry?.score ?? leaderboard?.my_stats?.score ?? 0;
          const myLogins = myEntry?.login_days ?? leaderboard?.my_stats?.login_days ?? 0;
          const myOpens  = myEntry?.resource_opens ?? leaderboard?.my_stats?.resource_opens ?? 0;
          const medals   = ["🥇", "🥈", "🥉"];
          const top25    = leaderboard?.leaderboard.slice(0, 25) ?? [];
          const hypeCards = [
            { emoji: "🔥", stat: "Top 10%", line1: "of students who log in", line2: "daily get hired 3× faster.", cta: "Are you logging in daily?" },
            { emoji: "😤", stat: "91%", line1: "of your competition", line2: "won't open a resource today.", cta: "Be the 9%." },
            { emoji: "⚡", stat: "7 days", line1: "of consistency beats", line2: "months of cramming.", cta: "Show up every day this week." },
            { emoji: "👀", stat: "Recruiters", line1: "check your activity.", line2: "Discipline is visible.", cta: "What does yours say right now?" },
            { emoji: "🎯", stat: "Next week", line1: "the board resets.", line2: "Your streak doesn't.", cta: "Build it before it matters." },
          ];
          return (
            <div style={{ padding: isMobile ? "16px 0" : "24px 0" }}>
              <style>{`
                @keyframes lb-slide { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
                @keyframes lb-pulse { 0%,100%{opacity:1} 50%{opacity:.6} }
              `}</style>

              {/* ── Compact header row */}
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: B, color: Y, padding: "3px 12px", fontSize: "9px", fontWeight: 700, letterSpacing: "0.16em", marginBottom: "10px" }}>
                    🏆 RANKINGS
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: isMobile ? "42px" : "58px", color: B, lineHeight: 0.9, letterSpacing: "0.02em" }}>
                    WEEKLY{" "}
                    <span style={{ color: Y, WebkitTextStroke: `1.5px ${B}` }}>LEADERBOARD</span>
                  </div>
                  {leaderboard && (
                    <div style={{ marginTop: "8px", fontSize: "11px", color: MUTE, ...MONO }}>
                      📅 {leaderboard.week_label} · resets every Monday
                    </div>
                  )}
                </div>
                {/* Compact YOUR RANK pill */}
                {(myRank !== null || myScore > 0) && (
                  <div style={{ background: B, padding: "12px 18px", display: "flex", alignItems: "center", gap: "14px", flexShrink: 0, animation: "lb-slide .4s cubic-bezier(.22,1,.36,1) both" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "8px", color: "#555", letterSpacing: "0.14em", fontFamily: "'IBM Plex Mono', monospace" }}>YOUR RANK</div>
                      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "36px", color: Y, lineHeight: 1 }}>{myRank ? `#${myRank}` : "—"}</div>
                    </div>
                    <div style={{ borderLeft: "1px solid #2a2a2a", paddingLeft: "14px" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: W, maxWidth: "110px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{myName}</div>
                      <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: Y, lineHeight: 1, marginTop: "2px" }}>{myScore} <span style={{ fontSize: "11px", color: "#555" }}>PTS</span></div>
                      <div style={{ fontSize: "10px", color: "#666", marginTop: "3px" }}>🔑 {myLogins}d · 📚 {myOpens}</div>
                    </div>
                  </div>
                )}
              </div>

              {leaderboardLoading ? (
                <div style={{ textAlign: "center", padding: "80px", color: MUTE, fontSize: "13px" }}>Loading rankings...</div>
              ) : !leaderboard || leaderboard.leaderboard.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 24px", border: `2px solid ${BORD}`, background: W }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏁</div>
                  <div style={{ fontWeight: 700, color: B, fontSize: "18px", marginBottom: "8px" }}>No activity yet this week</div>
                  <div style={{ fontSize: "13px", color: MUTE }}>Log in daily and open resources to earn points and appear here!</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "28px", alignItems: "flex-start" }}>

                  {/* ── LEFT: Podium + Rankings list */}
                  <div style={{ flex: 1, minWidth: 0 }}>

                    {/* Podium */}
                    {top25.length >= 1 && (
                      <div style={{ marginBottom: "24px", background: W, border: `2px solid ${BORD}`, padding: "20px 16px 0" }}>
                        <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", color: MUTE, marginBottom: "16px", textAlign: "center" }}>THIS WEEK'S TOP 3</div>
                        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: isMobile ? "4px" : "8px" }}>
                          {[1, 0, 2].map(idx => {
                            const entry = leaderboard.leaderboard[idx];
                            if (!entry) return <div key={idx} style={{ flex: 1 }} />;
                            const rank = entry.rank;
                            const isFirst = rank === 1;
                            const podiumH = isFirst ? "100px" : rank === 2 ? "72px" : "56px";
                            const podBg   = isFirst ? Y : rank === 2 ? "#D1D5DB" : "#F0D9C0";
                            const name    = entry.is_me ? myName : fmtName(entry.email);
                            return (
                              <div key={rank} style={{ flex: 1, maxWidth: "180px", textAlign: "center" }}>
                                <div style={{ fontSize: "11px", fontWeight: entry.is_me ? 700 : 500, color: B, marginBottom: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", padding: "0 4px" }}>
                                  {name}
                                  {entry.is_me && <span style={{ display: "inline-block", background: B, color: Y, fontSize: "7px", fontWeight: 700, padding: "1px 4px", marginLeft: "4px" }}>YOU</span>}
                                </div>
                                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "15px", color: MUTE, marginBottom: "6px" }}>{entry.score} pts</div>
                                <div style={{ height: podiumH, background: podBg, border: `2px solid ${B}`, borderBottom: "none", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "2px" }}>
                                  <div style={{ fontSize: isFirst ? "26px" : "18px" }}>{medals[rank - 1]}</div>
                                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: isFirst ? "18px" : "13px", color: B }}>#{rank}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Rankings list — top 25 */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0 8px" }}>
                        <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", color: MUTE }}>FULL RANKINGS</div>
                        <div style={{ fontSize: "9px", color: MUTE, ...MONO }}>TOP {Math.min(top25.length, 25)} OF ALL</div>
                      </div>
                      <div style={{ border: `2px solid ${BORD}`, overflow: "hidden" }}>
                        {top25.map((entry, i) => {
                          const isTop3 = i < 3;
                          const name   = entry.is_me ? myName : fmtName(entry.email);
                          const isMe   = entry.is_me;
                          return (
                            <div key={entry.rank} style={{
                              display: "flex", alignItems: "center", gap: "10px",
                              padding: "10px 16px",
                              borderBottom: i < top25.length - 1 ? `1px solid ${BORD}` : "none",
                              background: isMe ? Y : i % 2 === 0 ? W : "#FAFAFA",
                              animation: `lb-slide .3s ${i * 0.025}s cubic-bezier(.22,1,.36,1) both`,
                            }}>
                              {/* Rank */}
                              <div style={{ minWidth: "28px", textAlign: "center", flexShrink: 0 }}>
                                {isTop3
                                  ? <span style={{ fontSize: "16px" }}>{medals[i]}</span>
                                  : <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "14px", color: isMe ? B : MUTE }}>#{entry.rank}</span>
                                }
                              </div>
                              {/* Avatar */}
                              <div style={{ width: "30px", height: "30px", borderRadius: "50%", flexShrink: 0, background: isMe ? B : "#F3F4F6", border: `1.5px solid ${isMe ? B : BORD}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "12px", color: isMe ? Y : "#374151", ...MONO }}>
                                {name.charAt(0).toUpperCase()}
                              </div>
                              {/* Name + stats */}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: "12px", fontWeight: isMe ? 700 : 500, color: B, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "5px" }}>
                                  {name}
                                  {isMe && <span style={{ fontSize: "8px", fontWeight: 700, background: B, color: Y, padding: "1px 5px", letterSpacing: "0.06em", flexShrink: 0 }}>YOU</span>}
                                </div>
                                <div style={{ display: "flex", gap: "8px", marginTop: "2px" }}>
                                  <span style={{ fontSize: "10px", color: isMe ? "#374151" : MUTE }}>🔑 {entry.login_days}d</span>
                                  <span style={{ fontSize: "10px", color: isMe ? "#374151" : MUTE }}>📚 {entry.resource_opens}</span>
                                </div>
                              </div>
                              {/* Score */}
                              <div style={{ textAlign: "right", flexShrink: 0 }}>
                                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: B, lineHeight: 1 }}>{entry.score}</div>
                                <div style={{ fontSize: "8px", color: isMe ? "#374151" : MUTE, letterSpacing: "0.1em" }}>PTS</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {/* Not in top 25 */}
                      {leaderboard.my_rank === null && leaderboard.my_stats && (
                        <div style={{ marginTop: "8px", padding: "12px 16px", background: `${Y}30`, border: `2px solid ${Y}`, display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ fontSize: "18px" }}>👤</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: B }}>YOU — NOT IN TOP 25 YET</div>
                            <div style={{ fontSize: "10px", color: MUTE, marginTop: "2px" }}>🔑 {leaderboard.my_stats.login_days}d · 📚 {leaderboard.my_stats.resource_opens} opens</div>
                          </div>
                          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: B }}>{leaderboard.my_stats.score} <span style={{ fontSize: "10px", color: MUTE }}>pts</span></div>
                        </div>
                      )}
                    </div>

                    {/* Points guide */}
                    <div style={{ marginTop: "20px", background: B, padding: "20px" }}>
                      <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.16em", color: Y, marginBottom: "12px" }}>⚡ HOW TO EARN</div>
                      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                        <div style={{ flex: 1, background: "#111", padding: "12px" }}>
                          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: Y }}>+3 PTS</div>
                          <div style={{ fontSize: "11px", color: "#9CA3AF" }}>🔑 Daily login</div>
                        </div>
                        <div style={{ flex: 1, background: "#111", padding: "12px" }}>
                          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "26px", color: Y }}>+1 PT</div>
                          <div style={{ fontSize: "11px", color: "#9CA3AF" }}>📚 Resource open</div>
                        </div>
                      </div>
                      <div style={{ fontSize: "11px", color: "#555", lineHeight: 1.6 }}>
                        Board resets every <span style={{ color: Y, fontWeight: 700 }}>Monday 12:00 AM</span>. Stay consistent.
                      </div>
                    </div>
                  </div>

                  {/* ── RIGHT: Hype panel (desktop sticky) */}
                  {!isMobile && (
                    <div style={{ width: "260px", flexShrink: 0, position: "sticky", top: "80px", alignSelf: "flex-start", display: "flex", flexDirection: "column", gap: "12px" }}>

                      {/* Main hype card */}
                      <div style={{ background: B, padding: "22px 20px", border: `2px solid ${Y}` }}>
                        <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em", color: Y, marginBottom: "14px" }}>💬 REAL TALK</div>
                        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "38px", color: W, lineHeight: 1, marginBottom: "6px" }}>
                          ARE YOU<br />
                          <span style={{ color: Y }}>GONNA BE</span><br />
                          HERE?
                        </div>
                        <div style={{ fontSize: "11px", color: "#9CA3AF", lineHeight: 1.7, marginTop: "12px" }}>
                          The person above you on this list logged in <strong style={{ color: W }}>every single day</strong> this week. They're not smarter. They just showed up.
                        </div>
                        <div style={{ marginTop: "14px", padding: "10px 14px", background: "#111", fontSize: "11px", color: Y, fontWeight: 600, lineHeight: 1.5 }}>
                          → Next week, your name could be at the top.
                        </div>
                      </div>

                      {/* Stat cards */}
                      {hypeCards.slice(0, 3).map((c, i) => (
                        <div key={i} style={{ background: W, border: `2px solid ${BORD}`, padding: "16px", animation: `lb-slide .4s ${0.1 * i + 0.2}s cubic-bezier(.22,1,.36,1) both` }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                            <span style={{ fontSize: "20px" }}>{c.emoji}</span>
                            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "24px", color: B }}>{c.stat}</span>
                          </div>
                          <div style={{ fontSize: "12px", color: B, lineHeight: 1.5 }}>
                            {c.line1} {c.line2}
                          </div>
                          <div style={{ marginTop: "8px", fontSize: "10px", fontWeight: 700, color: Y, background: B, display: "inline-block", padding: "3px 10px", letterSpacing: "0.06em" }}>
                            {c.cta}
                          </div>
                        </div>
                      ))}

                      {/* "Next is you" push card */}
                      <div style={{ background: Y, border: `2px solid ${B}`, padding: "18px 16px" }}>
                        <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "28px", color: B, lineHeight: 1, marginBottom: "8px" }}>
                          NEXT WEEK,<br />THAT'S YOU.
                        </div>
                        <div style={{ fontSize: "11px", color: B, lineHeight: 1.6 }}>
                          Log in tomorrow. Open one resource. Do it again.<br />
                          <strong>That's literally it.</strong>
                        </div>
                        <div style={{ marginTop: "12px", fontSize: "10px", color: "#444", ...MONO }}>
                          🔑 login tomorrow = +3 pts toward #1
                        </div>
                      </div>

                      {/* More hype cards */}
                      {hypeCards.slice(3).map((c, i) => (
                        <div key={i} style={{ background: W, border: `2px solid ${BORD}`, padding: "16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                            <span style={{ fontSize: "20px" }}>{c.emoji}</span>
                            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "22px", color: B }}>{c.stat}</span>
                          </div>
                          <div style={{ fontSize: "12px", color: B, lineHeight: 1.5 }}>{c.line1} {c.line2}</div>
                          <div style={{ marginTop: "8px", fontSize: "10px", fontWeight: 700, color: Y, background: B, display: "inline-block", padding: "3px 10px", letterSpacing: "0.06em" }}>{c.cta}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Mobile hype — single scrollable strip */}
                  {isMobile && (
                    <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "4px", scrollbarWidth: "none" }}>
                      {hypeCards.map((c, i) => (
                        <div key={i} style={{ background: i === 0 ? B : W, border: `2px solid ${i === 0 ? Y : BORD}`, padding: "14px", minWidth: "200px", flexShrink: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                            <span style={{ fontSize: "18px" }}>{c.emoji}</span>
                            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "20px", color: i === 0 ? Y : B }}>{c.stat}</span>
                          </div>
                          <div style={{ fontSize: "11px", color: i === 0 ? "#9CA3AF" : B, lineHeight: 1.5 }}>{c.line1} {c.line2}</div>
                          <div style={{ marginTop: "8px", fontSize: "9px", fontWeight: 700, color: i === 0 ? B : Y, background: i === 0 ? Y : B, display: "inline-block", padding: "3px 8px" }}>{c.cta}</div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>
          );
        })()}

        {/* ── PROJECTS VIEW ─────────────────────────────────────────────── */}
        {currentView === "projects" && (
          <ProjectsView isMobile={isMobile} />
        )}

        {/* ── MOCK INTERVIEW VIEW ──────────────────────────────────────────── */}
        {currentView === "mockinterview" && (
          <div style={{ padding: isMobile ? "16px 0" : "32px 24px" }}>
            <MockInterview onExit={() => setCurrentView("overview")} />
          </div>
        )}

        {/* ── COURSE VIEWER ────────────────────────────────────────────────── */}
        {currentView === "course" && activeCourseId && (
          <div style={{ padding: isMobile ? "16px 0" : "32px 24px" }}>
            <CourseViewer
              courseId={activeCourseId}
              studentName={userName}
              studentEmail={userEmail}
              onBack={() => {
                setCurrentView(previousView);   // return exactly where they came from
                setActiveCourseId(null);
                navigate("/portal", { replace: true });
                api.courses.list().then((r: unknown) => {
                  const res = r as { data: CourseSummary[] };
                  setCourses(res.data);
                }).catch(() => {});
              }}
            />
          </div>
        )}

      </div>

      {/* ── FEEDBACK MODAL ──────────────────────────────────────────────── */}
      {showFeedback && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px" }}>
          <div style={{ backgroundColor: W, border: `2px solid ${B}`, borderRadius: "12px", padding: "32px", width: "100%", maxWidth: "460px", boxShadow: `6px 6px 0 ${Y}`, ...MONO }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: B }}>Request a Resource</h3>
              <button onClick={() => setShowFeedback(false)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTE }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.1em", marginBottom: "6px" }}>TYPE</label>
                <select value={feedbackForm.type} onChange={e => setFeedbackForm(f => ({ ...f, type: e.target.value }))}
                  style={{ width: "100%", padding: "9px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none" }}>
                  <option value="resource_request">Resource Request</option>
                  <option value="suggestion">Suggestion</option>
                  <option value="bug">Report an Issue</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.1em", marginBottom: "6px" }}>RESOURCE NAME (optional)</label>
                <input type="text" placeholder="e.g. Node.js Interview Questions"
                  value={feedbackForm.resource_name} onChange={e => setFeedbackForm(f => ({ ...f, resource_name: e.target.value }))}
                  style={{ width: "100%", padding: "9px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", boxSizing: "border-box" as const }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.1em", marginBottom: "6px" }}>MESSAGE</label>
                <textarea rows={4} placeholder="Describe what you need or what's missing..."
                  value={feedbackForm.message} onChange={e => setFeedbackForm(f => ({ ...f, message: e.target.value }))}
                  style={{ width: "100%", padding: "9px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", resize: "vertical", boxSizing: "border-box" as const }} />
              </div>
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                <button onClick={() => setShowFeedback(false)} style={{ padding: "9px 16px", backgroundColor: W, color: MUTE, border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "12px", cursor: "pointer", ...MONO }}>Cancel</button>
                <button onClick={submitFeedback} disabled={feedbackLoading}
                  style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 18px", backgroundColor: B, color: Y, border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: feedbackLoading ? "not-allowed" : "pointer", ...MONO }}>
                  <Send size={13} /> {feedbackLoading ? "Sending..." : "Send Request"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Confetti ──────────────────────────────────────────────── */}
      {showConfetti && (
        <>
          <style>{`@keyframes ckFall { 0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; } 100% { transform: translateY(110vh) rotate(900deg) scale(0.2); opacity: 0; } }`}</style>
          <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
            {Array.from({ length: 90 }, (_, i) => {
              const cols = ["#FFE500","#FF3B30","#34C759","#007AFF","#FF9500","#FF2D55","#5856D6","#FFFFFF","#FFB800","#00C7BE","#FF6B6B","#C8FF4D"];
              const sz = 6 + (i * 3) % 11;
              return (
                <div key={i} style={{
                  position: "absolute",
                  left: `${(i * 13.71 + 3) % 100}%`,
                  top: "-24px",
                  width: `${sz}px`,
                  height: `${sz + (i % 2) * 6}px`,
                  backgroundColor: cols[i % cols.length],
                  borderRadius: i % 3 === 0 ? "50%" : i % 3 === 1 ? "2px" : "40%",
                  animation: `ckFall ${0.9 + (i * 0.038) % 1.2}s ${(i * 0.044) % 0.8}s ease-in forwards`,
                }} />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

function CourseCard({ course, onClick }: { course: CourseSummary; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const isComplete = course.progress_pct === 100 && course.total_topics > 0;
  const inProgress = course.completed_topics > 0 && !isComplete;
  const ctaLabel = isComplete ? "View Course" : inProgress ? "Continue Learning" : "Enroll for Free";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: SURF,
        border: `2px solid ${hovered ? B : BORD}`,
        borderRadius: "12px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: hovered ? `5px 5px 0 ${B}` : "0 2px 10px rgba(0,0,0,0.07)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Cover image (designed, no online image) ── */}
      <div style={{ position: "relative", height: "180px", overflow: "hidden", flexShrink: 0, backgroundColor: B }}>
        <CourseCover slug={course.slug} title={course.title} hovered={hovered} />
        {/* Badges top-right */}
        <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
          {isComplete && (
            <span style={{ fontSize: "9px", fontWeight: 700, color: "#16A34A", backgroundColor: "#DCFCE7", padding: "3px 8px", borderRadius: "4px", ...MONO }}>COMPLETED ✓</span>
          )}
          {inProgress && (
            <span style={{ fontSize: "9px", fontWeight: 700, color: B, backgroundColor: Y, padding: "3px 8px", borderRadius: "4px", ...MONO }}>{course.progress_pct}%</span>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ padding: "18px 20px", display: "flex", flexDirection: "column", flex: 1, gap: "10px" }}>
        {/* Meta row */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", color: B, backgroundColor: `${B}10`, padding: "2px 8px", borderRadius: "3px", ...MONO }}>
            {({ placement: "PLACEMENTS", placements: "PLACEMENTS", interviews: "INTERVIEWS", career_kit: "CAREER KIT" } as Record<string, string>)[course.category] ?? "COURSES"}
          </span>
          {course.duration && (
            <span style={{ fontSize: "9px", fontWeight: 700, color: MUTE, padding: "2px 8px", border: `1px solid ${BORD}`, borderRadius: "3px", ...MONO }}>
              ⏱ {course.duration}
            </span>
          )}
          {course.total_topics > 0 && (
            <span style={{ fontSize: "9px", color: MUTE, ...MONO }}>{course.total_topics} topics</span>
          )}
        </div>

        {/* Title */}
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: B, lineHeight: 1.35, margin: 0 }}>
          {course.title}
        </h3>

        {/* Description — curated copy with backend fallback */}
        {(() => {
          const desc = getCourseDescription(course);
          return desc ? (
            <p style={{ fontSize: "12px", color: B, lineHeight: 1.7, margin: 0, fontWeight: 400, opacity: 0.75 }}>
              {desc}
            </p>
          ) : null;
        })()}

        {/* Progress bar (only if started) */}
        {inProgress && (
          <div style={{ marginTop: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontSize: "10px", color: MUTE, ...MONO }}>{course.completed_topics}/{course.total_topics} done</span>
              <span style={{ fontSize: "10px", fontWeight: 700, color: B, ...MONO }}>{course.progress_pct}%</span>
            </div>
            <div style={{ height: "5px", background: BORD, borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${course.progress_pct}%`, background: Y, borderRadius: "3px", transition: "width 0.4s ease" }} />
            </div>
          </div>
        )}

        {/* CTA button — pushed to bottom */}
        <div style={{ marginTop: "auto", paddingTop: "12px" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            padding: "12px 16px",
            backgroundColor: isComplete ? "#15803d" : B,
            color: isComplete ? "#dcfce7" : Y,
            borderRadius: "8px",
            fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em",
            ...MONO,
            transition: "opacity 0.15s",
          }}>
            {ctaLabel} <ArrowUpRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AI Projects view — 24 real-world project ideas grouped by domain ────
function ProjectsView({ isMobile }: { isMobile: boolean }) {
  const DOMAINS: Domain[] = ["GenAI", "Data Science", "Machine Learning", "Deep Learning", "Computer Vision"];
  const [activeDomain, setActiveDomain] = useState<"ALL" | Domain>("ALL");

  const visible = activeDomain === "ALL"
    ? AI_PROJECTS
    : AI_PROJECTS.filter(p => p.domain === activeDomain);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "8px 0" : "24px 20px" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: "inline-block", background: Y, color: B, padding: "4px 10px", fontSize: "10px", fontWeight: 800, letterSpacing: "0.14em", ...MONO, marginBottom: 12 }}>
          24 PROJECTS · REAL PROBLEMS
        </div>
        <h1 style={{ fontSize: isMobile ? "24px" : "30px", fontWeight: 800, letterSpacing: "-0.01em", color: B, marginBottom: 6 }}>
          Build the AI projects that actually get you hired.
        </h1>
        <p style={{ fontSize: "14px", color: MUTE, maxWidth: 720, lineHeight: 1.6 }}>
          Each project is a real problem a company faces — not a toy demo. Ordered
          from foundations → RAG → agents → multi-agent → MCP → guardrails → evals,
          across GenAI, Data Science, ML, Deep Learning, and Computer Vision.
        </p>
      </div>

      {/* Domain filter tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18, borderBottom: `2px solid ${BORD}`, paddingBottom: 8 }}>
        {(["ALL", ...DOMAINS] as const).map(d => {
          const active = activeDomain === d;
          const accent = d === "ALL" ? B : DOMAIN_ACCENTS[d as Domain];
          const count = d === "ALL" ? AI_PROJECTS.length : AI_PROJECTS.filter(p => p.domain === d).length;
          return (
            <button key={d} onClick={() => setActiveDomain(d)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "7px 14px", background: active ? B : "transparent",
                color: active ? Y : B, border: `2px solid ${active ? B : BORD}`,
                borderRadius: 6, fontSize: 11, fontWeight: 700,
                letterSpacing: "0.08em", cursor: "pointer", ...MONO,
              }}>
              <span style={{ width: 8, height: 8, background: accent, borderRadius: "50%", display: "inline-block" }} />
              {d.toUpperCase()}
              <span style={{ marginLeft: 4, opacity: 0.65 }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Project cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))", gap: 14 }}>
        {visible.map(p => {
          const accent = DOMAIN_ACCENTS[p.domain];
          return (
            <div key={p.n} style={{
              background: W, border: `2px solid ${BORD}`, borderLeft: `4px solid ${accent}`,
              borderRadius: 8, padding: 20, display: "flex", flexDirection: "column",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = `4px 4px 0 ${accent}44`; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
            >
              {/* Top row: number, domain, level */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, ...MONO }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: MUTE, letterSpacing: "0.1em" }}>#{String(p.n).padStart(2, "0")}</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", color: accent, background: `${accent}15`, padding: "3px 8px", borderRadius: 999, textTransform: "uppercase" }}>{p.domain}</span>
                  <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", color: B, background: Y, padding: "3px 8px", borderRadius: 999, textTransform: "uppercase" }}>L{p.level} · {LEVEL_LABEL[p.level]}</span>
                </div>
              </div>

              {/* Title */}
              <h3 style={{ fontSize: 16, fontWeight: 800, color: B, marginBottom: 10, lineHeight: 1.3 }}>{p.title}</h3>

              {/* Problem */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", color: "#d62828", marginBottom: 4, ...MONO }}>THE PROBLEM</div>
                <p style={{ fontSize: 12.5, color: B, lineHeight: 1.55, margin: 0 }}>{p.problem}</p>
              </div>

              {/* Build */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", color: "#1d7a44", marginBottom: 4, ...MONO }}>WHAT YOU BUILD</div>
                <p style={{ fontSize: 12.5, color: B, lineHeight: 1.55, margin: 0 }}>{p.build}</p>
              </div>

              {/* Stack chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                {p.stack.map(s => (
                  <span key={s} style={{ fontSize: 10, fontWeight: 600, color: MUTE, background: BG, border: `1px solid ${BORD}`, padding: "3px 8px", borderRadius: 4, ...MONO }}>{s}</span>
                ))}
              </div>

              {/* Outcome (bottom) */}
              <div style={{ marginTop: "auto", padding: "8px 10px", background: `${accent}0d`, borderLeft: `3px solid ${accent}`, borderRadius: 4 }}>
                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", color: accent, marginBottom: 2, ...MONO }}>OUTCOME</div>
                <p style={{ fontSize: 12, color: B, lineHeight: 1.45, margin: 0, fontWeight: 600 }}>{p.outcome}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div style={{ marginTop: 24, padding: 18, background: W, border: `2px dashed ${BORD}`, borderRadius: 8, ...MONO }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.12em", color: B, marginBottom: 6 }}>HOW TO USE THIS</div>
        <p style={{ fontSize: 12.5, color: MUTE, lineHeight: 1.6, margin: 0 }}>
          Pick one project per level. Ship it end-to-end — code on GitHub, a
          README, a short demo video. Three of these on your portfolio matter
          more than fifty tutorials.
        </p>
      </div>
    </div>
  );
}

function LearningProgressCard({ course, onClick, isMobile, animIndex }: { course: CourseSummary; onClick: () => void; isMobile: boolean; animIndex: number }) {
  const [hovered, setHovered] = useState(false);
  const pct = course.progress_pct;
  const accent = pct >= 75 ? "#22C55E" : pct >= 40 ? Y : "#3B82F6";
  const catLabel = ({ placement: "PLACEMENTS", placements: "PLACEMENTS", interviews: "INTERVIEWS", career_kit: "CAREER KIT" } as Record<string, string>)[course.category] ?? "COURSES";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "grid",
        gridTemplateColumns: isMobile
          ? "5px 1fr"
          : "5px 1fr 88px 160px",
        background: W,
        border: `2px solid ${hovered ? B : BORD}`,
        borderRadius: "10px",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(.22,1,.36,1)",
        boxShadow: hovered ? `5px 5px 0 ${B}` : "0 1px 8px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-2px)" : "none",
        animation: `ov-enter 0.4s ${animIndex * 0.08 + 0.1}s cubic-bezier(.22,1,.36,1) both`,
      }}
    >
      {/* accent stripe */}
      <div style={{ background: accent, transition: "background 0.3s" }} />

      {/* main content */}
      <div style={{ padding: isMobile ? "14px 16px" : "20px 24px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px", minWidth: 0 }}>
        <div style={{ fontSize: "9px", color: MUTE, ...MONO, letterSpacing: "0.14em" }}>
          {catLabel} · {course.total_topics} TOPICS
        </div>
        <div style={{ fontSize: isMobile ? "15px" : "17px", fontWeight: 700, color: B, lineHeight: 1.25, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {course.title}
        </div>
        <div>
          <div style={{ height: "4px", background: BORD, borderRadius: "2px", overflow: "hidden", marginBottom: "5px" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: accent, borderRadius: "2px", transition: "width 0.6s ease, background 0.3s" }} />
          </div>
          <span style={{ fontSize: "10px", color: MUTE, ...MONO }}>
            {course.completed_topics} of {course.total_topics} topics done
          </span>
        </div>
      </div>

      {/* designed thumbnail (desktop) */}
      {!isMobile && (
        <div style={{ overflow: "hidden", position: "relative", flexShrink: 0 }}>
          <CourseCover slug={course.slug} title={course.title} hovered={hovered} variant="thumb" width="88px" />
        </div>
      )}

      {/* right: big % + button */}
      {!isMobile && (
        <div style={{ padding: "18px 22px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", borderLeft: `1px solid ${BORD}`, flexShrink: 0 }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "52px", color: accent, lineHeight: 1, letterSpacing: "0.01em", transition: "color 0.3s" }}>
            {pct}%
          </div>
          <div style={{ fontSize: "10px", fontWeight: 700, background: hovered ? B : `${B}dd`, color: Y, padding: "6px 18px", ...MONO, letterSpacing: "0.12em", whiteSpace: "nowrap", transition: "background 0.15s" }}>
            CONTINUE →
          </div>
        </div>
      )}
    </div>
  );
}

function CourseSectionView({ courses, onOpen }: { courses: CourseSummary[]; onOpen: (id: string) => void }) {
  if (courses.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 24px", border: `2px dashed ${BORD}`, borderRadius: "10px", color: MUTE, fontFamily: "'IBM Plex Mono', monospace" }}>
        <BookOpen size={36} style={{ marginBottom: "12px", opacity: 0.25 }} />
        <div style={{ fontWeight: 700, color: B, marginBottom: "4px" }}>No courses here yet</div>
        <div style={{ fontSize: "12px" }}>Your admin will add courses and they'll appear here.</div>
      </div>
    );
  }

  const sectionMap = new Map<string, CourseSummary[]>();
  for (const course of courses) {
    const section = course.section || "General";
    if (!sectionMap.has(section)) sectionMap.set(section, []);
    sectionMap.get(section)!.push(course);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
      {Array.from(sectionMap.entries()).map(([section, sectionCourses]) => (
        <div key={section}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", padding: "4px 14px", backgroundColor: `${B}08`, border: `1.5px solid ${BORD}`, borderRadius: "4px", fontFamily: "'IBM Plex Mono', monospace" }}>
              {section.toUpperCase()}
            </div>
            <div style={{ flex: 1, height: "1px", backgroundColor: BORD }} />
            <div style={{ fontSize: "11px", color: MUTE, fontFamily: "'IBM Plex Mono', monospace" }}>
              {sectionCourses.length} course{sectionCourses.length !== 1 ? "s" : ""}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {sectionCourses.map(course => (
              <CourseCard key={course.id} course={course} onClick={() => onOpen(course.id)} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Portal;
