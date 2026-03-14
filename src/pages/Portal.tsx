import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileText, Mail, Linkedin, ListChecks, FileCode, MessageSquare,
  Building2, Code2, LogOut, GraduationCap, Star, Database, Network,
  Cpu, MessageCircle, Lightbulb, Brain, Target, BookOpen, ArrowUpRight,
  Flame, Zap, Trophy,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type ViewType = "recommended" | "training" | "placement";

// ── Resource badge types ───────────────────────────────────────────────────
type Badge = { label: string; color: string } | null;

// ── Data with compelling taglines ─────────────────────────────────────────

const recommendedDocs = [
  {
    id: 1, name: "Most Asked DSA Questions", icon: Code2,
    badge: { label: "MOST OPENED", color: "bg-primary/20 text-primary" } as Badge,
    tagline: "The exact question patterns from TCS, Infosys & Wipro rounds. Students who studied this cracked interviews in 2 weeks flat.",
    url: "https://docs.google.com/document/d/1UUfEZWFUJw3GihrBcSjdKlAXHAklg7fd9qnvrh45Dc0/edit?usp=sharing",
    gradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    id: 2, name: "Resume AI Builder", icon: FileCode,
    badge: { label: "START HERE", color: "bg-green-500/20 text-green-600" } as Badge,
    tagline: "Recruiters decide in 7 seconds. This doc makes those 7 seconds say YES — or you keep getting ghosted forever.",
    url: "https://docs.google.com/document/d/15lwb2eYty-uf1Y8VRrl19CLPljPAdqbf/edit?usp=sharing&ouid=108561889902459626610&rtpof=true&sd=true",
    gradient: "from-green-500/10 to-emerald-500/10",
  },
  {
    id: 3, name: "React Interview Questions", icon: Code2,
    badge: null as Badge,
    tagline: "React is on every JD right now. These are the exact questions they ask. No fluff. Pure interview gold.",
    url: "https://docs.google.com/document/d/1WO82ZMmdhhwWuiG0WzVtKz42J4i1gla_NejVFEQmEUw/edit?usp=sharing",
    gradient: "from-cyan-500/10 to-blue-500/10",
  },
  {
    id: 4, name: "Mock Interview Guide", icon: MessageCircle,
    badge: { label: "HIGH IMPACT", color: "bg-purple-500/20 text-purple-600" } as Badge,
    tagline: "Placed students practice. Rejected ones don't. This is your structured practice — built from real interview formats used by top companies.",
    url: "https://docs.google.com/document/d/1cXm9ZWtKWuy9iIHtCr6595YxJhQVLPYqNY_aSBsF_ZI/edit?usp=sharing",
    gradient: "from-purple-500/10 to-pink-500/10",
  },
  {
    id: 5, name: "Database Interview", icon: Database,
    badge: null as Badge,
    tagline: "SQL trips up 70% of candidates in technical rounds. Read this once, and you're firmly in the 30% that doesn't stumble.",
    url: "https://docs.google.com/document/d/1eEXBhg2QRnFa2r_x9d-C1LmvEyXMLZOfg9DfEo6QnDU/edit?usp=sharing",
    gradient: "from-orange-500/10 to-amber-500/10",
  },
  {
    id: 6, name: "TCS Interview Prep", icon: Building2,
    badge: { label: "TRENDING", color: "bg-orange-500/20 text-orange-600" } as Badge,
    tagline: "TCS hires tens of thousands every year. This prep is built around their exact pattern. Use it before the next candidate does.",
    url: "https://docs.google.com/document/d/1zHWsyH_0MiEjgmvbq5tMc6shIyI_c_XEKokLY5CQwMQ/edit?usp=sharing",
    gradient: "from-red-500/10 to-orange-500/10",
  },
  {
    id: 7, name: "Python Interview Questions", icon: Code2,
    badge: null as Badge,
    tagline: "Python shows up in 8 out of 10 JDs. These are the questions they ask. If you haven't prepped this, you're losing rounds you should be winning.",
    url: "https://docs.google.com/document/d/1suRsDJ1fj-ZLVMjGlGCwGpRgOLp0zpWy2CKpuBmIKmc/edit?usp=sharing",
    gradient: "from-yellow-500/10 to-green-500/10",
  },
  {
    id: 8, name: "LinkedIn Message Templates", icon: Linkedin,
    badge: null as Badge,
    tagline: "One well-crafted message landed a student in Swiggy. This doc has that exact template — and 10 more like it. Copy. Paste. Get noticed.",
    url: "https://docs.google.com/document/d/1KXw6R6RgB_37-3JiQnB9DleoAlMJJTZObIP3M96BqTo/edit?usp=sharing",
    gradient: "from-blue-500/10 to-indigo-500/10",
  },
  {
    id: 9, name: "AI Project Ideas", icon: Lightbulb,
    badge: { label: "STAND OUT", color: "bg-yellow-500/20 text-yellow-700" } as Badge,
    tagline: "AI projects on a resume make interviewers stop scrolling. Build one from this list and watch your shortlist rate change overnight.",
    url: "https://docs.google.com/document/d/1og-faGxKFLwMvjln6vmMfIInnMjtAYGbe4l21euevII/edit?usp=sharing",
    gradient: "from-violet-500/10 to-purple-500/10",
  },
];

const trainingResourcesCategories = [
  {
    category: "Learning Materials",
    headline: "The foundation your career is built on.",
    icon: BookOpen,
    gradient: "from-purple-500/10 to-pink-500/10",
    border: "border-purple-500/20",
    resources: [
      { name: "AI Training Resource", icon: Brain, tagline: "AI is not the future — it's today's hiring requirement. This gives you the foundation that puts you 6 months ahead of every peer who hasn't touched it yet.", url: "https://docs.google.com/document/d/1fZ6b1J3e2mkN954eCgf8G4g6RO_XVCO0FJEJPecNtDc/edit?usp=sharing" },
      { name: "ReactJS Frontend", icon: Code2, tagline: "React developers are in the highest demand bracket. MNCs, startups, product companies — all want it. This covers what no YouTube playlist can in 3 hours.", url: "https://docs.google.com/document/d/1Ez1sA7_r42u1MskH-CuuhbrnucboCS8TNrrXXpQSWYo/edit?usp=sharing" },
      { name: "Python Backend", icon: FileText, tagline: "Python is the language of this placement season. Shaky backend knowledge means losing technical rounds you should be winning. Fix that here, today.", url: "https://docs.google.com/document/d/1GCNXcPpThwiQ70Ad1Y6awnBQe5Bct5VvcIwJNi2sGpc/edit?usp=sharing" },
      { name: "Data Analyst Resource", icon: Database, tagline: "Data roles are the fastest-growing segment — no postgrad required. This guide gives you the tools, mindset and direction to land one.", url: "https://docs.google.com/document/d/1mV-c7F2rs6JVSuY5pvaBJAnXzhMOE4BNNkEDVhwQoxs/edit?usp=sharing" },
    ],
  },
  {
    category: "Resume & Career Documents",
    headline: "Your first impression. Make it unforgettable.",
    icon: FileText,
    gradient: "from-green-500/10 to-emerald-500/10",
    border: "border-green-500/20",
    resources: [
      { name: "Resume AI Builder", icon: FileCode, tagline: "Your resume gets 7 seconds before it's gone. This builder makes those 7 seconds impossible to ignore — and impossible to reject.", url: "https://docs.google.com/document/d/15lwb2eYty-uf1Y8VRrl19CLPljPAdqbf/edit?usp=sharing&ouid=108561889902459626610&rtpof=true&sd=true" },
      { name: "Resume Review", icon: FileText, tagline: "Most students submit resumes with mistakes they can't see. This shows you exactly where you're losing points before you apply again.", url: "https://docs.google.com/document/d/16yLxoy-qZUZ9SRrqJQeL_tVqy4bc5liA39R9T8yyrSs/edit?usp=sharing" },
      { name: "Cover Letter Templates", icon: FileText, tagline: "A strong cover letter makes HR forward your resume before the ATS even processes it. These templates are engineered to do exactly that.", url: "https://docs.google.com/document/d/11P_LLTpx16Z83EW8u_YVY9l05x7SKU950PTWJQuzJhQ/edit?usp=sharing" },
    ],
  },
  {
    category: "Networking & Outreach",
    headline: "Your next offer is one message away.",
    icon: Linkedin,
    gradient: "from-blue-500/10 to-cyan-500/10",
    border: "border-blue-500/20",
    resources: [
      { name: "LinkedIn Profile Review", icon: Linkedin, tagline: "70% of recruiters find candidates through LinkedIn. Unoptimized profile = silence. Optimized profile = inbound opportunities while you sleep.", url: "https://docs.google.com/document/d/1ZUQvHMoMxXjm-G1uGGkQZ1YNj5VNndU5LgE3cfu8IsE/edit?usp=sharing" },
      { name: "LinkedIn Message Templates", icon: Linkedin, tagline: "The right message to the right person has landed students in companies they applied to 3 times before. This is that message.", url: "https://docs.google.com/document/d/1KXw6R6RgB_37-3JiQnB9DleoAlMJJTZObIP3M96BqTo/edit?usp=sharing" },
      { name: "Email To Send To HR", icon: Mail, tagline: "Cold emails to HR feel scary. These templates remove the guesswork and replace it with professional copy that actually gets replies.", url: "https://docs.google.com/document/d/1CSSgkt1qBU9oSXSKALrpy_89MfmkZvJ7vr4z9FRr1uE/edit?usp=sharing" },
      { name: "Company Contact Database", icon: ListChecks, tagline: "Applying through portals and hearing nothing? Reach the right person directly. This database is that direct line — use it.", url: "https://docs.google.com/document/d/1qTrPuIWZPXmOcKW2qmNbzyqgUqvamy1t7OXgVeS_FPw/edit?usp=sharing" },
    ],
  },
  {
    category: "Interview Preparation",
    headline: "Practice is the only thing that separates placed from rejected.",
    icon: MessageCircle,
    gradient: "from-purple-500/10 to-pink-500/10",
    border: "border-purple-500/20",
    resources: [
      { name: "Mock Interview Guide", icon: MessageCircle, tagline: "Every student who did structured mock interviews outperformed in real ones. Every single time. This is your structured practice — built the right way.", url: "https://docs.google.com/document/d/1cXm9ZWtKWuy9iIHtCr6595YxJhQVLPYqNY_aSBsF_ZI/edit?usp=sharing" },
      { name: "Most Asked DSA Questions", icon: Code2, tagline: "Not a random list — built from actual interview reports. These are the questions that keep appearing everywhere. Know the pattern. Solve faster.", url: "https://docs.google.com/document/d/1UUfEZWFUJw3GihrBcSjdKlAXHAklg7fd9qnvrh45Dc0/edit?usp=sharing" },
    ],
  },
  {
    category: "Technical Interview Questions",
    headline: "Know what's coming before you walk in.",
    icon: Code2,
    gradient: "from-orange-500/10 to-red-500/10",
    border: "border-orange-500/20",
    resources: [
      { name: "React Interview Questions", icon: Code2, tagline: "React is the #1 frontend skill being tested right now. These are the exact questions companies ask. Know them cold. Don't guess.", url: "https://docs.google.com/document/d/1WO82ZMmdhhwWuiG0WzVtKz42J4i1gla_NejVFEQmEUw/edit?usp=sharing" },
      { name: "Python Interview Questions", icon: Code2, tagline: "Python questions catch candidates off guard. These are the ones that keep coming up — with the exact approach to answer them confidently.", url: "https://docs.google.com/document/d/1suRsDJ1fj-ZLVMjGlGCwGpRgOLp0zpWy2CKpuBmIKmc/edit?usp=sharing" },
      { name: "Database Interview", icon: Database, tagline: "SQL is tested in 9 out of 10 technical rounds. This covers joins, normalization, indexing — all of it, in the way interviewers actually ask.", url: "https://docs.google.com/document/d/1eEXBhg2QRnFa2r_x9d-C1LmvEyXMLZOfg9DfEo6QnDU/edit?usp=sharing" },
      { name: "Operating System", icon: Cpu, tagline: "OS questions eliminate 40% of candidates in technical rounds. This covers every concept they test — in plain English, not textbook jargon.", url: "https://docs.google.com/document/d/1IxAzP-yStZeFMU7wDA6cMicg3sOj9G0R5_soiLeD09Q/edit?usp=sharing" },
      { name: "Computer Networks", icon: Network, tagline: "CN comes up in every SDE role. This distills the entire syllabus into only what they test — nothing extra, nothing missing.", url: "https://docs.google.com/document/d/1Yz5EvTOL-UqQ61vSXSfLnB53RquAmvD037RxkDhtgvU/edit?usp=sharing" },
      { name: "LLM Interview Questions", icon: MessageSquare, tagline: "AI/ML roles are exploding and the talent pool is thin. This makes you one of the rare few who can speak intelligently about LLMs in an interview.", url: "https://docs.google.com/document/d/1J7L8THutNBC7iapuyiTw9hfIYsO_-U5FxWgt-lVZFvM/edit?usp=sharing" },
      { name: "System Design Questions", icon: Network, tagline: "System design is what separates good hires from great ones. This teaches you to think in systems — a skill that impresses every senior interviewer.", url: "https://docs.google.com/document/d/1gSLI9jFRQ54al8ezjjvDaVGJ4PTvRePXv1HFQPeJCOo/edit?usp=sharing" },
    ],
  },
  {
    category: "Projects & Portfolio",
    headline: "Projects speak louder than your CGPA ever will.",
    icon: Lightbulb,
    gradient: "from-indigo-500/10 to-violet-500/10",
    border: "border-indigo-500/20",
    resources: [
      { name: "AI Project Ideas", icon: Lightbulb, tagline: "Companies hiring for AI roles want proof, not theory. These are the exact project ideas that make recruiters say 'this person gets it — bring them in.'", url: "https://docs.google.com/document/d/1og-faGxKFLwMvjln6vmMfIInnMjtAYGbe4l21euevII/edit?usp=sharing" },
      { name: "Open Source Guide", icon: Code2, tagline: "A merged PR on a real repository says more than 10 solo side projects. This guide gets you your first contribution in days — and teaches you to talk about it.", url: "https://docs.google.com/document/d/1aHs0LHoQdmgwl_wW3iK6mtrwDnl39KzETmf-mDjweKY/edit?usp=sharing" },
      { name: "Projects Before Graduation", icon: GraduationCap, tagline: "Top companies hire for proof, not potential. This tells you exactly which projects prove you're ready — and how to build them fast before placement season.", url: "https://docs.google.com/document/d/13N-rS9kKS4q8llvKye6pzSnhvqj_UCHYm8Wxk4vRlL8/edit?usp=sharing" },
      { name: "GitHub Portfolio Guide", icon: FileCode, tagline: "Recruiters check your GitHub before your resume. This guide makes your GitHub the first thing they want to screenshot and share with their hiring team.", url: "https://docs.google.com/document/d/1e2Pw1jRJLDdA6r5Dye5C_x6dPFGW14qVgPpu4xVsULI/edit?usp=sharing" },
    ],
  },
];

const companiesWithMultipleResources = [
  { name: "Accenture" }, { name: "Cognizant" }, { name: "HCL" },
  { name: "Infosys" }, { name: "L&T" }, { name: "TCS" },
  { name: "Wipro" }, { name: "Zoho" },
];

const companyResources: Record<string, Record<string, string>> = {
  Accenture: { Aptitude: "https://docs.google.com/document/d/1kyy6vP1UhgqHd11T3Dsx7ofvW3DmgA1uhVRZJQXXfGw/edit?usp=sharing", DSA: "https://docs.google.com/document/d/1SGK-t4IeF7gitZLQjVgo8m4V4f9I9FbCVwn5OzKwylY/edit?usp=sharing", "Technical Interview": "https://docs.google.com/document/d/1jJjApMcSJJ_1aGwkht7eOoEltwlKDQrm3c4Wqch_3-4/edit?usp=sharing" },
  HCL: { Aptitude: "https://docs.google.com/document/d/1RJOQcA-2el8Vazcd9LvjAcQdFINEirK1JH7JcuhHBEM/edit?usp=sharing", DSA: "https://docs.google.com/document/d/1qTLCSjjBNjslaJCxM3AKSn5fLBtJIJ0Y2ith2qlyGKM/edit?usp=sharing", "Technical Interview": "https://docs.google.com/document/d/1j4W_yPgA2Uhr-O9Y2q6ZaEQkv8UfUNVZxdhcRfFz1hM/edit?usp=sharing" },
  Infosys: { Aptitude: "https://docs.google.com/document/d/1CD13NBJ9i-z4JtCXN4sy0piryA3KH3waVhA-3sPmTF8/edit?usp=sharing", DSA: "https://docs.google.com/document/d/1ygYv7-tkO2t2MRDGZxVPQMcYRP8RxO5NQGDo9hWA7fs/edit?usp=sharing", "Technical Interview": "https://docs.google.com/document/d/1f1cAMLgh0sH82oc3hhnJjs1aoE6ioj_eY71oZ7NCer8/edit?usp=sharing" },
  Cognizant: { Aptitude: "https://docs.google.com/document/d/1-wGB0YG0sb3Jmup33CO-RBQF712lRH9UiVih0L_hvuY/edit?usp=sharing", DSA: "https://docs.google.com/document/d/1J93SNR-tSzz9ggy0HNXoNMWJ0rEMn-aUz2_06oEYNjc/edit?usp=sharing", "Technical Interview": "https://docs.google.com/document/d/1WCWHFlh8x1Q8WIBqwx5NXi-Z1_-EyzTvYTep5MoWFjU/edit?usp=sharing" },
  Zoho: { Aptitude: "https://docs.google.com/document/d/1ajZ4SQxeaUpHzLF5CaCW4y0RCfcp-jJhctaJiDwgf7Q/edit?usp=sharing", DSA: "https://docs.google.com/document/d/1OKJkV2099PtdbVHe7Zp5Uxh5Noh4l-vhKfzOEq4_Ht8/edit?usp=sharing", "Technical Interview": "https://docs.google.com/document/d/1iv2hJyuhJcyUIYoq1_-a6bSZQMT__gGmBcDUx5hmOCw/edit?usp=sharing" },
  Wipro: { Aptitude: "https://docs.google.com/document/d/1oxrqck6pqx5Z9shgucgoXdckQGu6pmyGiqfuu8Ni5Gk/edit?usp=sharing", DSA: "https://docs.google.com/document/d/16AHBdaYFd4TIEenY6VHv-gzA5Luo1szTjHPRvOV1v30/edit?usp=sharing", "Technical Interview": "https://docs.google.com/document/d/1nRIZprV89KQkC6BNFsgo-2D9qAKJnT1rKorI4aRZo0E/edit?usp=sharing" },
  "L&T": { Aptitude: "https://docs.google.com/document/d/1f9ikBZZWRH0jz4LGKsrsv5hdaR6ohTCBPG6Yr8BZZCQ/edit?usp=sharing", DSA: "https://docs.google.com/document/d/1g-nqsyxbFU8JhleCai_twzNn96MOk7A3Bo2yVYQNfkc/edit?usp=sharing", "Technical Interview": "https://docs.google.com/document/d/14KBq0zzMsIxOUfOv2NTDz-ccr71spBE7I92AdRIdqLc/edit?usp=sharing" },
  TCS: { Aptitude: "https://docs.google.com/document/d/1zHWsyH_0MiEjgmvbq5tMc6shIyI_c_XEKokLY5CQwMQ/edit?usp=sharing", DSA: "https://docs.google.com/document/d/1fL8sS_cC4ImXlkt0XoEl1-s6ap2cZAFxwRQ0MXCGiN8/edit?usp=sharing", "Technical Interview": "https://docs.google.com/document/d/1heVx7vV7fLv8ZWRePmV5gGmIuUSSkbRGuGPcAR3zs30/edit?usp=sharing" },
};

const companiesWithSingleResource = [
  { name: "Zomato", emoji: "🍔", url: "https://docs.google.com/document/d/1W0WvDBPA9tV6n6MsnlSFbUVA6ZIwoJSEtIb7hvw1qY8/edit?usp=sharing" },
  { name: "Zepto", emoji: "⚡", url: "https://docs.google.com/document/d/1P-lmy49E2sgN77ew01vDVaG5l3AKr09iY9yaqAzVowM/edit?usp=sharing" },
  { name: "EY", emoji: "💼", url: "https://docs.google.com/document/d/1StJiYnwDRwIN6EytvUSwwZ9hz_g2LnkCFu1qpiYydgE/edit?usp=sharing" },
  { name: "Deloitte", emoji: "💼", url: "https://docs.google.com/document/d/13U9LbgL8ugyFjorayU5eWVJqg1r1HG1Jj5E1dUNMcIg/edit?usp=sharing" },
  { name: "Capgemini", emoji: "💼", url: "https://docs.google.com/document/d/1AJW_lvHHQPojcIJUOHML7W4GM_0-Qteu1M3qdA3o0ro/edit?usp=sharing" },
  { name: "Swiggy", emoji: "🍕", url: "https://docs.google.com/document/d/14UES14KDHfTnYiVlQieGJw2hE8HjdzqGFWgo-bqDsSA/edit?usp=sharing" },
  { name: "Google", emoji: "🔍", url: "" },
  { name: "Amazon", emoji: "📦", url: "" },
  { name: "Microsoft", emoji: "🪟", url: "" },
];

const questionTypes = [
  {
    type: "Aptitude",
    icon: Brain,
    gradient: "from-blue-500/10 to-cyan-500/10",
    tagline: "The exact reasoning and aptitude patterns from their real test — built from actual interview reports. Know the format before you face it.",
  },
  {
    type: "DSA",
    icon: Code2,
    gradient: "from-purple-500/10 to-pink-500/10",
    tagline: "The data structure problems this company loves to set. Understand their pattern, practice the right way, and walk in ready.",
  },
  {
    type: "Technical Interview",
    icon: Target,
    gradient: "from-green-500/10 to-emerald-500/10",
    tagline: "Real technical questions from actual candidates. Know what's coming before you walk in. Stop being surprised in rounds you should be clearing.",
  },
];

// ── Component ──────────────────────────────────────────────────────────────
const Portal = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<ViewType>("recommended");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("loginTimestamp");
    localStorage.removeItem("userEmail");
    toast({ title: "Logged Out", description: "You have been logged out successfully" });
    navigate("/login");
  };

  const switchView = (view: ViewType) => {
    setCurrentView(view);
    setSelectedCompany(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tabs: { view: ViewType; label: string; icon: typeof Star }[] = [
    { view: "recommended", label: "Recommended", icon: Star },
    { view: "training", label: "Training", icon: GraduationCap },
    { view: "placement", label: "Placement", icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative orbs */}
      <div className="fixed top-4 right-4 z-30 pointer-events-none">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 opacity-80 blur-xl animate-pulse" />
        <div className="absolute top-0 right-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-primary opacity-60 blur-lg animate-float" />
      </div>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="fixed top-0 w-full backdrop-blur-sm z-40 border-b border-border/20 bg-background/80">
        <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/")}>
            <img src="/upstride-logo.png" alt="UPSTRIDE Logo" className="h-9 w-9 object-contain" />
            <span className="text-xl font-bold text-foreground">UPSTRIDE</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex" onClick={() => navigate("/")}>Home</Button>
            <Button variant="ghost" size="sm" className="hidden md:inline-flex" onClick={() => navigate("/programs")}>Programs</Button>
            <Button
              variant="ghost" size="sm"
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <LogOut className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </nav>
      </header>

      {/* ── Sticky Tab Bar ──────────────────────────────────────────────── */}
      <div className="fixed top-[3.5rem] w-full z-30 bg-background/95 backdrop-blur-sm border-b border-border/20">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-1">
            {tabs.map(({ view, label, icon: Icon }) => (
              <button
                key={view}
                onClick={() => switchView(view)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  currentView === view
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {currentView === view && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Page Content ────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 pt-28 pb-20 relative">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 via-purple-500/15 to-pink-500/20 rounded-full blur-3xl animate-move-left-right" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-cyan-400/15 via-blue-500/20 to-primary/15 rounded-full blur-3xl animate-move-right-left" style={{ animationDelay: "3s" }} />
        </div>

        {/* ══ RECOMMENDED VIEW ══════════════════════════════════════════ */}
        {currentView === "recommended" && (
          <div className="animate-fade-in">
            {/* Section hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold border border-primary/20 mb-5">
                <Flame className="w-4 h-4" />
                Handpicked for maximum impact
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-foreground mb-3 tracking-tight">
                Start{" "}
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-text-gradient">
                  Here.
                </span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                These 9 resources have the highest impact-to-effort ratio. Open one right now and feel the difference.
              </p>
            </div>

            {/* Resource cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendedDocs.map((doc, i) => (
                <div
                  key={doc.id}
                  onClick={() => window.open(doc.url, "_blank")}
                  className="group relative bg-background border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-pointer animate-reveal-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Card top gradient */}
                  <div className={`bg-gradient-to-br ${doc.gradient} p-5 pb-4`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2.5 bg-background/80 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform shadow-sm">
                        <doc.icon className="w-5 h-5 text-primary" />
                      </div>
                      {doc.badge && (
                        <span className={`text-xs font-black px-2.5 py-1 rounded-full ${doc.badge.color} tracking-wide`}>
                          {doc.badge.label}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-foreground leading-snug group-hover:text-primary transition-colors duration-300">
                      {doc.name}
                    </h3>
                  </div>

                  {/* Tagline */}
                  <div className="px-5 py-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {doc.tagline}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="px-5 pb-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all duration-300">
                      Open & Study
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TRAINING VIEW ════════════════════════════════════════════ */}
        {currentView === "training" && (
          <div className="animate-fade-in">
            {/* Section hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold border border-primary/20 mb-5">
                <Zap className="w-4 h-4" />
                Everything you need in one place
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-foreground mb-3 tracking-tight">
                Your{" "}
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-text-gradient">
                  Arsenal.
                </span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Every resource you need from day one to offer letter. Organized. Curated. Waiting.
              </p>
            </div>

            {trainingResourcesCategories.map((cat, catIdx) => (
              <div key={catIdx} className="mb-14">
                {/* Category header */}
                <div className={`bg-gradient-to-r ${cat.gradient} rounded-2xl p-5 md:p-7 mb-5 border-2 ${cat.border} animate-reveal-up`}>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-2.5 bg-background/60 rounded-xl">
                      <cat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-foreground">{cat.category}</h2>
                  </div>
                  <p className="text-muted-foreground font-medium italic ml-1">{cat.headline}</p>
                </div>

                {/* Resources */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.resources.map((res, resIdx) => (
                    <div
                      key={resIdx}
                      onClick={() => window.open(res.url, "_blank")}
                      className="group relative bg-background border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer animate-reveal-up"
                      style={{ animationDelay: `${resIdx * 80}ms` }}
                    >
                      <div className={`bg-gradient-to-br ${cat.gradient} p-4 pb-3`}>
                        <div className="p-2 bg-background/80 rounded-xl w-fit group-hover:scale-110 transition-transform mb-2">
                          <res.icon className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-base font-black text-foreground group-hover:text-primary transition-colors">{res.name}</h3>
                      </div>
                      <div className="px-4 py-3">
                        <p className="text-sm text-muted-foreground leading-relaxed">{res.tagline}</p>
                      </div>
                      <div className="px-4 pb-4">
                        <div className="flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all duration-300">
                          Access Resource <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ PLACEMENT VIEW ═══════════════════════════════════════════ */}
        {currentView === "placement" && (
          <div className="animate-fade-in">
            {/* Section hero */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold border border-primary/20 mb-5">
                <Trophy className="w-4 h-4" />
                Company-specific prep
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-foreground mb-3 tracking-tight">
                Know Before{" "}
                <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-text-gradient">
                  You Walk In.
                </span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                17 companies. Their actual questions. Your unfair advantage — use it.
              </p>
            </div>

            {/* ── Service-based ──────────────────────────────────────── */}
            <div className="mb-14">
              <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-5 md:p-7 mb-5 border-2 border-blue-500/20 animate-reveal-up">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2.5 bg-blue-500 rounded-xl">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-foreground">Service-Based IT Companies</h2>
                </div>
                <p className="text-muted-foreground font-medium italic ml-1">
                  These 8 companies hire thousands every year. Your advantage? Knowing their exact questions before walking in.
                </p>
              </div>

              <p className="text-sm text-muted-foreground mb-4 font-medium">
                👇 Tap a company to unlock its 3 preparation resources
              </p>

              {/* Company grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {companiesWithMultipleResources.map((company, i) => (
                  <button
                    key={company.name}
                    onClick={() => setSelectedCompany(selectedCompany === company.name ? null : company.name)}
                    className={`group relative rounded-2xl border-2 p-4 text-center transition-all duration-300 hover:shadow-lg animate-reveal-up ${
                      selectedCompany === company.name
                        ? "border-primary bg-primary/5 shadow-lg"
                        : "border-border hover:border-primary/40 bg-background"
                    }`}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className={`text-3xl mb-2 transition-transform duration-300 ${selectedCompany === company.name ? "scale-110" : "group-hover:scale-110"}`}>
                      🏢
                    </div>
                    <p className={`text-sm font-bold transition-colors ${selectedCompany === company.name ? "text-primary" : "group-hover:text-primary"}`}>
                      {company.name}
                    </p>
                    {selectedCompany === company.name && (
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Selected company resources */}
              {selectedCompany && companyResources[selectedCompany] && (
                <div className="animate-scale-in">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-base font-black text-foreground px-3">
                      {selectedCompany} — 3 Resources Unlocked
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {questionTypes.map((qt, i) => (
                      <div
                        key={qt.type}
                        onClick={() => {
                          const url = companyResources[selectedCompany]?.[qt.type];
                          if (url) window.open(url, "_blank");
                        }}
                        className="group relative bg-background border border-border rounded-2xl overflow-hidden hover:border-primary/50 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-300 cursor-pointer animate-reveal-up"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <div className={`bg-gradient-to-br ${qt.gradient} p-5 pb-4`}>
                          <div className="p-2.5 bg-background/80 rounded-xl w-fit group-hover:scale-110 transition-transform mb-3">
                            <qt.icon className="w-6 h-6 text-primary" />
                          </div>
                          <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors">{qt.type}</h3>
                        </div>
                        <div className="px-5 py-4">
                          <p className="text-sm text-muted-foreground leading-relaxed">{qt.tagline}</p>
                        </div>
                        <div className="px-5 pb-5">
                          <div className="flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all duration-300">
                            View Questions <ArrowUpRight className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!selectedCompany && (
                <div className="text-center py-10 bg-secondary/30 rounded-2xl border-2 border-dashed border-border">
                  <Building2 className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-30" />
                  <p className="text-sm text-muted-foreground font-medium">Select a company above to unlock its resources</p>
                </div>
              )}
            </div>

            {/* ── Product-based ──────────────────────────────────────── */}
            <div>
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-5 md:p-7 mb-5 border-2 border-purple-500/20 animate-reveal-up">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2.5 bg-purple-500 rounded-xl">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-foreground">Product & Startup Companies</h2>
                </div>
                <p className="text-muted-foreground font-medium italic ml-1">
                  These companies pay 2–3× market average and hire purely on merit. One focused prep session from this list can change your trajectory.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {companiesWithSingleResource.map((company, i) => (
                  <button
                    key={company.name}
                    onClick={() => {
                      if (company.url) window.open(company.url, "_blank");
                      else toast({ title: "Coming Soon", description: `${company.name} resources will be available soon` });
                    }}
                    className="group relative bg-background border-2 border-border rounded-2xl p-4 text-center hover:border-primary/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 animate-reveal-up overflow-hidden"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {company.emoji}
                    </div>
                    <p className="text-xs font-bold group-hover:text-primary transition-colors">{company.name}</p>
                    {!company.url && <p className="text-xs text-muted-foreground mt-0.5">Coming Soon</p>}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portal;
