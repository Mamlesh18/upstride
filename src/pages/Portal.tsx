import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, Mail, Linkedin, ListChecks, FileCode, MessageSquare,
  Building2, Code2, LogOut, GraduationCap, Star, Database, Network,
  Cpu, MessageCircle, Lightbulb, Brain, Target, BookOpen, ArrowUpRight,
  Flame, Zap, Trophy, Eye, ShoppingCart, Server, Coffee,
  PlayCircle, Lock, CheckSquare, X, Send,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

// ─── Theme ───────────────────────────────────────────────────────────────────
const Y    = "#FFE500";   // yellow
const B    = "#0A0A0A";   // black
const W    = "#FFFFFF";   // white
const BG   = "#FAFAFA";   // page bg
const BORD = "#E5E5E5";   // border
const BORD2= "#D1D1D1";   // hover border
const MUTE = "#6B7280";   // muted text
const SURF = "#FFFFFF";   // card surface

const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

// ─── Types ───────────────────────────────────────────────────────────────────
type ViewType = "recommended" | "training" | "placement" | "sessions";
type Badge = { label: string; accent: boolean } | null;

// ─── Data ────────────────────────────────────────────────────────────────────
const recommendedDocs = [
  { id: 1, name: "Most Asked DSA Questions",    icon: Code2,        badge: { label: "MOST OPENED", accent: true }  as Badge, tagline: "The exact question patterns from TCS, Infosys & Wipro rounds. Students who studied this cracked interviews in 2 weeks flat.", url: "https://docs.google.com/document/d/1UUfEZWFUJw3GihrBcSjdKlAXHAklg7fd9qnvrh45Dc0/edit?usp=sharing" },
  { id: 2, name: "Resume AI Builder",           icon: FileCode,     badge: { label: "START HERE",  accent: false } as Badge, tagline: "Recruiters decide in 7 seconds. This doc makes those 7 seconds say YES — or you keep getting ghosted forever.",              url: "https://docs.google.com/document/d/15lwb2eYty-uf1Y8VRrl19CLPljPAdqbf/edit?usp=sharing&ouid=108561889902459626610&rtpof=true&sd=true" },
  { id: 3, name: "React Interview Questions",   icon: Code2,        badge: null as Badge,                           tagline: "React is on every JD right now. These are the exact questions they ask. No fluff. Pure interview gold.",                             url: "https://docs.google.com/document/d/1WO82ZMmdhhwWuiG0WzVtKz42J4i1gla_NejVFEQmEUw/edit?usp=sharing" },
  { id: 4, name: "Mock Interview Guide",        icon: MessageCircle,badge: { label: "HIGH IMPACT", accent: true }  as Badge, tagline: "Placed students practice. Rejected ones don't. This is your structured practice — built from real interview formats.",        url: "https://docs.google.com/document/d/1cXm9ZWtKWuy9iIHtCr6595YxJhQVLPYqNY_aSBsF_ZI/edit?usp=sharing" },
  { id: 5, name: "Database Interview",          icon: Database,     badge: null as Badge,                           tagline: "SQL trips up 70% of candidates in technical rounds. Read this once, and you're firmly in the 30% that doesn't stumble.",             url: "https://docs.google.com/document/d/1eEXBhg2QRnFa2r_x9d-C1LmvEyXMLZOfg9DfEo6QnDU/edit?usp=sharing" },
  { id: 6, name: "TCS Interview Prep",          icon: Building2,    badge: { label: "TRENDING",    accent: true }  as Badge, tagline: "TCS hires tens of thousands every year. This prep is built around their exact pattern. Use it before the next candidate does.", url: "https://docs.google.com/document/d/1zHWsyH_0MiEjgmvbq5tMc6shIyI_c_XEKokLY5CQwMQ/edit?usp=sharing" },
  { id: 7, name: "Python Interview Questions",  icon: Code2,        badge: null as Badge,                           tagline: "Python shows up in 8 out of 10 JDs. These are the questions they ask. If you haven't prepped this, you're losing rounds.",             url: "https://docs.google.com/document/d/1suRsDJ1fj-ZLVMjGlGCwGpRgOLp0zpWy2CKpuBmIKmc/edit?usp=sharing" },
  { id: 8, name: "LinkedIn Message Templates",  icon: Linkedin,     badge: null as Badge,                           tagline: "One well-crafted message landed a student in Swiggy. This doc has that exact template — and 10 more like it.",                          url: "https://docs.google.com/document/d/1KXw6R6RgB_37-3JiQnB9DleoAlMJJTZObIP3M96BqTo/edit?usp=sharing" },
  { id: 9, name: "AI Project Ideas",            icon: Lightbulb,    badge: { label: "STAND OUT",   accent: false } as Badge, tagline: "AI projects on a resume make interviewers stop scrolling. Build one from this list and watch your shortlist rate change.",    url: "https://docs.google.com/document/d/1og-faGxKFLwMvjln6vmMfIInnMjtAYGbe4l21euevII/edit?usp=sharing" },
];

const trainingResourcesCategories = [
  {
    category: "Core Learning Materials",
    headline: "The technical foundation your career is built on.",
    icon: BookOpen,
    resources: [
      { name: "AI Training Resource",       icon: Brain,       tagline: "AI is not the future — it's today's hiring requirement. This gives you the foundation that puts you 6 months ahead of peers.", url: "https://docs.google.com/document/d/1fZ6b1J3e2mkN954eCgf8G4g6RO_XVCO0FJEJPecNtDc/edit?usp=sharing" },
      { name: "Machine Learning",           icon: Brain,       tagline: "ML is the core of every AI role. This covers algorithms, model building, and the theory you'll be quizzed on in interviews.",   url: "https://docs.google.com/document/d/1FIe9yk_CHsrKti3whIpEv0biCLHPY-6LB0zSDue7U9k/edit?usp=sharing" },
      { name: "Deep Learning",              icon: Brain,       tagline: "Neural networks, transformers, CNNs. Deep learning is what separates ML engineers from AI researchers — this covers both.",     url: "https://docs.google.com/document/d/1lNL4OcpRJStCBED8AAO-sMZpz471-dSb/edit?usp=sharing&ouid=108561889902459626610&rtpof=true&sd=true" },
      { name: "Computer Vision",            icon: Eye,         tagline: "CV roles are exploding. Image recognition, object detection, OpenCV — this covers the stack companies are actively hiring for.", url: "https://docs.google.com/document/d/18rH8HxsV_kShkEBZ8CGApkIufVhcy3VXeuoMPG0JXrg/edit?usp=sharing" },
      { name: "ReactJS Frontend",           icon: Code2,       tagline: "React developers are in the highest demand bracket. This covers what no YouTube playlist can in 3 hours.",                      url: "https://docs.google.com/document/d/1Ez1sA7_r42u1MskH-CuuhbrnucboCS8TNrrXXpQSWYo/edit?usp=sharing" },
      { name: "Next.js Training",           icon: Code2,       tagline: "Next.js is the production standard for React apps. SSR, routing, API routes — this gets you from React to real product work.",   url: "https://docs.google.com/document/d/1JMVFccuU0qZqlVKIyzlb4kmrCn1jeLOvK6ebOcz5g4Q/edit?usp=sharing" },
      { name: "MERN Stack",                 icon: Server,      tagline: "Full-stack companies love MERN. MongoDB, Express, React, Node — this end-to-end guide gets you job-ready front to back.",       url: "https://docs.google.com/document/d/1fzXMkk5_1YxQeWa_LbuAJfbOWrefQx6YhrJpa-e5EjE/edit?usp=sharing" },
      { name: "Python Backend",             icon: FileText,    tagline: "Python is the language of this placement season. Shaky backend knowledge means losing rounds you should be winning.",           url: "https://docs.google.com/document/d/1GCNXcPpThwiQ70Ad1Y6awnBQe5Bct5VvcIwJNi2sGpc/edit?usp=sharing" },
      { name: "Python (Full Guide)",        icon: FileText,    tagline: "From basics to advanced Python — this covers everything from syntax to frameworks used in production systems.",                    url: "https://docs.google.com/document/d/1k5mzINGeii3cbqollxbMwydo7rJvXdApMR-NOYOd658/edit?usp=sharing" },
      { name: "Java Roadmap",               icon: Coffee,      tagline: "Java remains the backbone of enterprise software. This roadmap tells you exactly what to learn and in what order.",              url: "https://docs.google.com/document/d/16lZPa_sQcG5l-xB4qpnVB9x1Z_UoQzH7/edit?usp=sharing&ouid=108561889902459626610&rtpof=true&sd=true" },
      { name: "Java Backend",               icon: Server,      tagline: "Spring Boot, REST APIs, JPA — the Java backend stack companies actually use. One read, and you're interview-ready.",              url: "https://docs.google.com/document/d/1FEljdcRVqN77r4htW3FTwBEumSO-4iTv/edit?usp=sharing&ouid=108561889902459626610&rtpof=true&sd=true" },
      { name: "OOPS Concepts",              icon: Code2,       tagline: "OOP is tested in every technical round. The 4 pillars — with real interview questions and clean code examples.",                 url: "https://docs.google.com/document/d/1FMgq-AZf8cr4CMED1Om3ehY5aD00z9CI/edit?usp=sharing&ouid=108561889902459626610&rtpof=true&sd=true" },
      { name: "SQL Training",               icon: Database,    tagline: "SQL is in 90% of job requirements. JOINs, subqueries, window functions — every concept tested in interviews, all here.",         url: "https://docs.google.com/document/d/1_90s58fwUpNPwA06RDFywcmDqreBPkFO-mjbLVcCzJk/edit?usp=sharing" },
      { name: "Data Analyst Resource",      icon: Database,    tagline: "Data roles are the fastest-growing segment. Tools, mindset, and direction to land a data role without a postgrad.",               url: "https://docs.google.com/document/d/1mV-c7F2rs6JVSuY5pvaBJAnXzhMOE4BNNkEDVhwQoxs/edit?usp=sharing" },
    ],
  },
  {
    category: "Business & Soft Skills",
    headline: "The skills that determine how fast you grow after you get in.",
    icon: Target,
    resources: [
      { name: "Marketing Training",         icon: ShoppingCart, tagline: "Product, growth, and marketing roles are rising. This covers the fundamentals that every non-tech role now expects.",            url: "https://docs.google.com/document/d/1JXoxWhuCajKloI5meNfqVRbwueDPmyU1bRiHUZl5V5s/edit?usp=sharing" },
      { name: "Sales Training",             icon: Target,       tagline: "Sales skills open doors in every career — from FAANG interviews to startup roles. Learn to sell yourself and your ideas.",        url: "https://docs.google.com/document/d/1nc07Nvn3hlQa2jYjQS8XEFuzZ81z-6M4O7WNwe9w6e0/edit?usp=sharing" },
    ],
  },
  {
    category: "Resume & Career Documents",
    headline: "Your first impression. Make it impossible to ignore.",
    icon: FileText,
    resources: [
      { name: "Resume AI Builder",          icon: FileCode,    tagline: "Your resume gets 7 seconds before it's gone. This builder makes those 7 seconds impossible to ignore — and impossible to reject.", url: "https://docs.google.com/document/d/15lwb2eYty-uf1Y8VRrl19CLPljPAdqbf/edit?usp=sharing&ouid=108561889902459626610&rtpof=true&sd=true" },
      { name: "Resume Review",              icon: FileText,    tagline: "Most students submit resumes with mistakes they can't see. This shows you exactly where you're losing points before you apply.",    url: "https://docs.google.com/document/d/16yLxoy-qZUZ9SRrqJQeL_tVqy4bc5liA39R9T8yyrSs/edit?usp=sharing" },
      { name: "Cover Letter Templates",     icon: FileText,    tagline: "A strong cover letter makes HR forward your resume before the ATS even processes it. These templates are engineered to do that.",   url: "https://docs.google.com/document/d/11P_LLTpx16Z83EW8u_YVY9l05x7SKU950PTWJQuzJhQ/edit?usp=sharing" },
    ],
  },
  {
    category: "Networking & Outreach",
    headline: "Your next offer is one well-placed message away.",
    icon: Linkedin,
    resources: [
      { name: "LinkedIn Profile Review",    icon: Linkedin,    tagline: "70% of recruiters find candidates through LinkedIn. Unoptimized profile = silence. Optimized = inbound while you sleep.",          url: "https://docs.google.com/document/d/1ZUQvHMoMxXjm-G1uGGkQZ1YNj5VNndU5LgE3cfu8IsE/edit?usp=sharing" },
      { name: "LinkedIn Message Templates", icon: Linkedin,    tagline: "The right message to the right person has landed students in companies they applied to 3 times before. This is that message.",       url: "https://docs.google.com/document/d/1KXw6R6RgB_37-3JiQnB9DleoAlMJJTZObIP3M96BqTo/edit?usp=sharing" },
      { name: "Email To Send To HR",        icon: Mail,        tagline: "Cold emails to HR feel scary. These templates remove the guesswork and replace it with copy that actually gets replies.",             url: "https://docs.google.com/document/d/1CSSgkt1qBU9oSXSKALrpy_89MfmkZvJ7vr4z9FRr1uE/edit?usp=sharing" },
      { name: "Company Contact Database",   icon: ListChecks,  tagline: "Applying through portals and hearing nothing? Reach the right person directly. This database is that direct line.",                  url: "https://docs.google.com/document/d/1qTrPuIWZPXmOcKW2qmNbzyqgUqvamy1t7OXgVeS_FPw/edit?usp=sharing" },
    ],
  },
  {
    category: "Interview Preparation",
    headline: "Practice is the only thing that separates placed from rejected.",
    icon: MessageCircle,
    resources: [
      { name: "Mock Interview Guide",       icon: MessageCircle,tagline: "Every student who did structured mock interviews outperformed in real ones. Every single time. This is your structured practice.",  url: "https://docs.google.com/document/d/1cXm9ZWtKWuy9iIHtCr6595YxJhQVLPYqNY_aSBsF_ZI/edit?usp=sharing" },
      { name: "Most Asked DSA Questions",   icon: Code2,         tagline: "Not a random list — built from actual interview reports. These are the questions that keep appearing. Know the pattern.",            url: "https://docs.google.com/document/d/1UUfEZWFUJw3GihrBcSjdKlAXHAklg7fd9qnvrh45Dc0/edit?usp=sharing" },
    ],
  },
  {
    category: "Technical Interview Questions",
    headline: "Know exactly what's coming before you walk in the room.",
    icon: Code2,
    resources: [
      { name: "React Interview Questions",  icon: Code2,        tagline: "React is the #1 frontend skill being tested right now. These are the exact questions companies ask. Know them cold.",               url: "https://docs.google.com/document/d/1WO82ZMmdhhwWuiG0WzVtKz42J4i1gla_NejVFEQmEUw/edit?usp=sharing" },
      { name: "Python Interview Questions", icon: Code2,        tagline: "Python questions catch candidates off guard. These are the ones that keep coming up — with exact approaches to answer confidently.", url: "https://docs.google.com/document/d/1suRsDJ1fj-ZLVMjGlGCwGpRgOLp0zpWy2CKpuBmIKmc/edit?usp=sharing" },
      { name: "Database Interview",         icon: Database,     tagline: "SQL is tested in 9 out of 10 technical rounds. JOINs, normalization, indexing — all covered the way interviewers actually ask.",   url: "https://docs.google.com/document/d/1eEXBhg2QRnFa2r_x9d-C1LmvEyXMLZOfg9DfEo6QnDU/edit?usp=sharing" },
      { name: "Operating System",           icon: Cpu,          tagline: "OS questions eliminate 40% of candidates in technical rounds. Every concept they test — in plain English, not textbook jargon.",    url: "https://docs.google.com/document/d/1IxAzP-yStZeFMU7wDA6cMicg3sOj9G0R5_soiLeD09Q/edit?usp=sharing" },
      { name: "Computer Networks",          icon: Network,      tagline: "CN comes up in every SDE role. This distills the entire syllabus into only what they test — nothing extra, nothing missing.",        url: "https://docs.google.com/document/d/1Yz5EvTOL-UqQ61vSXSfLnB53RquAmvD037RxkDhtgvU/edit?usp=sharing" },
      { name: "LLM Interview Questions",    icon: MessageSquare,tagline: "AI/ML roles are exploding and the talent pool is thin. This makes you one of the rare few who can speak intelligently about LLMs.",  url: "https://docs.google.com/document/d/1J7L8THutNBC7iapuyiTw9hfIYsO_-U5FxWgt-lVZFvM/edit?usp=sharing" },
      { name: "System Design Questions",    icon: Network,      tagline: "System design separates good hires from great ones. This teaches you to think in systems — a skill that impresses every senior.",    url: "https://docs.google.com/document/d/1gSLI9jFRQ54al8ezjjvDaVGJ4PTvRePXv1HFQPeJCOo/edit?usp=sharing" },
    ],
  },
  {
    category: "Projects & Portfolio",
    headline: "Projects speak louder than your CGPA ever will.",
    icon: Lightbulb,
    resources: [
      { name: "AI Project Ideas",           icon: Lightbulb,    tagline: "Companies hiring for AI roles want proof, not theory. These are the exact project ideas that make recruiters say 'bring them in.'", url: "https://docs.google.com/document/d/1og-faGxKFLwMvjln6vmMfIInnMjtAYGbe4l21euevII/edit?usp=sharing" },
      { name: "Open Source Guide",          icon: Code2,         tagline: "A merged PR on a real repo says more than 10 solo side projects. This guide gets you your first contribution in days.",            url: "https://docs.google.com/document/d/1aHs0LHoQdmgwl_wW3iK6mtrwDnl39KzETmf-mDjweKY/edit?usp=sharing" },
      { name: "Projects Before Graduation", icon: GraduationCap, tagline: "Top companies hire for proof, not potential. This tells you exactly which projects prove you're ready — and how to build them.",   url: "https://docs.google.com/document/d/13N-rS9kKS4q8llvKye6pzSnhvqj_UCHYm8Wxk4vRlL8/edit?usp=sharing" },
      { name: "GitHub Portfolio Guide",     icon: FileCode,      tagline: "Recruiters check your GitHub before your resume. This guide makes your GitHub the first thing they screenshot and share.",          url: "https://docs.google.com/document/d/1e2Pw1jRJLDdA6r5Dye5C_x6dPFGW14qVgPpu4xVsULI/edit?usp=sharing" },
    ],
  },
];

const companiesWithMultipleResources = [
  { name: "Accenture" }, { name: "Cognizant" }, { name: "HCL" },
  { name: "Infosys"   }, { name: "L&T"       }, { name: "TCS" },
  { name: "Wipro"     }, { name: "Zoho"      },
];

const companyResources: Record<string, Record<string, string>> = {
  Accenture: { Aptitude: "https://docs.google.com/document/d/1kyy6vP1UhgqHd11T3Dsx7ofvW3DmgA1uhVRZJQXXfGw/edit?usp=sharing", DSA: "https://docs.google.com/document/d/1SGK-t4IeF7gitZLQjVgo8m4V4f9I9FbCVwn5OzKwylY/edit?usp=sharing", "Technical Interview": "https://docs.google.com/document/d/1jJjApMcSJJ_1aGwkht7eOoEltwlKDQrm3c4Wqch_3-4/edit?usp=sharing" },
  HCL:       { Aptitude: "https://docs.google.com/document/d/1RJOQcA-2el8Vazcd9LvjAcQdFINEirK1JH7JcuhHBEM/edit?usp=sharing", DSA: "https://docs.google.com/document/d/1qTLCSjjBNjslaJCxM3AKSn5fLBtJIJ0Y2ith2qlyGKM/edit?usp=sharing", "Technical Interview": "https://docs.google.com/document/d/1j4W_yPgA2Uhr-O9Y2q6ZaEQkv8UfUNVZxdhcRfFz1hM/edit?usp=sharing" },
  Infosys:   { Aptitude: "https://docs.google.com/document/d/1CD13NBJ9i-z4JtCXN4sy0piryA3KH3waVhA-3sPmTF8/edit?usp=sharing", DSA: "https://docs.google.com/document/d/1ygYv7-tkO2t2MRDGZxVPQMcYRP8RxO5NQGDo9hWA7fs/edit?usp=sharing", "Technical Interview": "https://docs.google.com/document/d/1f1cAMLgh0sH82oc3hhnJjs1aoE6ioj_eY71oZ7NCer8/edit?usp=sharing" },
  Cognizant: { Aptitude: "https://docs.google.com/document/d/1-wGB0YG0sb3Jmup33CO-RBQF712lRH9UiVih0L_hvuY/edit?usp=sharing", DSA: "https://docs.google.com/document/d/1J93SNR-tSzz9ggy0HNXoNMWJ0rEMn-aUz2_06oEYNjc/edit?usp=sharing", "Technical Interview": "https://docs.google.com/document/d/1WCWHFlh8x1Q8WIBqwx5NXi-Z1_-EyzTvYTep5MoWFjU/edit?usp=sharing" },
  Zoho:      { Aptitude: "https://docs.google.com/document/d/1ajZ4SQxeaUpHzLF5CaCW4y0RCfcp-jJhctaJiDwgf7Q/edit?usp=sharing", DSA: "https://docs.google.com/document/d/1OKJkV2099PtdbVHe7Zp5Uxh5Noh4l-vhKfzOEq4_Ht8/edit?usp=sharing", "Technical Interview": "https://docs.google.com/document/d/1iv2hJyuhJcyUIYoq1_-a6bSZQMT__gGmBcDUx5hmOCw/edit?usp=sharing" },
  Wipro:     { Aptitude: "https://docs.google.com/document/d/1oxrqck6pqx5Z9shgucgoXdckQGu6pmyGiqfuu8Ni5Gk/edit?usp=sharing", DSA: "https://docs.google.com/document/d/16AHBdaYFd4TIEenY6VHv-gzA5Luo1szTjHPRvOV1v30/edit?usp=sharing", "Technical Interview": "https://docs.google.com/document/d/1nRIZprV89KQkC6BNFsgo-2D9qAKJnT1rKorI4aRZo0E/edit?usp=sharing" },
  "L&T":     { Aptitude: "https://docs.google.com/document/d/1f9ikBZZWRH0jz4LGKsrsv5hdaR6ohTCBPG6Yr8BZZCQ/edit?usp=sharing", DSA: "https://docs.google.com/document/d/1g-nqsyxbFU8JhleCai_twzNn96MOk7A3Bo2yVYQNfkc/edit?usp=sharing", "Technical Interview": "https://docs.google.com/document/d/14KBq0zzMsIxOUfOv2NTDz-ccr71spBE7I92AdRIdqLc/edit?usp=sharing" },
  TCS:       { Aptitude: "https://docs.google.com/document/d/1zHWsyH_0MiEjgmvbq5tMc6shIyI_c_XEKokLY5CQwMQ/edit?usp=sharing", DSA: "https://docs.google.com/document/d/1fL8sS_cC4ImXlkt0XoEl1-s6ap2cZAFxwRQ0MXCGiN8/edit?usp=sharing", "Technical Interview": "https://docs.google.com/document/d/1heVx7vV7fLv8ZWRePmV5gGmIuUSSkbRGuGPcAR3zs30/edit?usp=sharing" },
};

const companiesWithSingleResource = [
  { name: "Zomato",    emoji: "🍔", url: "https://docs.google.com/document/d/1W0WvDBPA9tV6n6MsnlSFbUVA6ZIwoJSEtIb7hvw1qY8/edit?usp=sharing" },
  { name: "Zepto",     emoji: "⚡", url: "https://docs.google.com/document/d/1P-lmy49E2sgN77ew01vDVaG5l3AKr09iY9yaqAzVowM/edit?usp=sharing" },
  { name: "EY",        emoji: "💼", url: "https://docs.google.com/document/d/1StJiYnwDRwIN6EytvUSwwZ9hz_g2LnkCFu1qpiYydgE/edit?usp=sharing" },
  { name: "Deloitte",  emoji: "💼", url: "https://docs.google.com/document/d/13U9LbgL8ugyFjorayU5eWVJqg1r1HG1Jj5E1dUNMcIg/edit?usp=sharing" },
  { name: "Capgemini", emoji: "💼", url: "https://docs.google.com/document/d/1AJW_lvHHQPojcIJUOHML7W4GM_0-Qteu1M3qdA3o0ro/edit?usp=sharing" },
  { name: "Swiggy",    emoji: "🍕", url: "https://docs.google.com/document/d/14UES14KDHfTnYiVlQieGJw2hE8HjdzqGFWgo-bqDsSA/edit?usp=sharing" },
  { name: "Google",    emoji: "🔍", url: "" },
  { name: "Amazon",    emoji: "📦", url: "" },
  { name: "Microsoft", emoji: "🪟", url: "" },
];

const questionTypes = [
  { type: "Aptitude",            icon: Brain,  tagline: "The exact reasoning and aptitude patterns from their real test — built from actual interview reports." },
  { type: "DSA",                 icon: Code2,  tagline: "The data structure problems this company loves to set. Practice the right way, and walk in ready." },
  { type: "Technical Interview", icon: Target, tagline: "Real technical questions from actual candidates. Know what's coming before you walk in." },
];

// ─── Component ───────────────────────────────────────────────────────────────
interface Session { id: string; session_number: number; week: number; title: string; drive_link: string; description: string; unlocked: boolean; }

const Portal = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView]         = useState<ViewType>("recommended");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [sessions, setSessions]               = useState<Session[]>([]);
  const [sessionsInfo, setSessionsInfo]       = useState<{ weeks_completed: number; unlocked_count: number; days_enrolled: number } | null>(null);
  const [showFeedback, setShowFeedback]       = useState(false);
  const [feedbackForm, setFeedbackForm]       = useState({ type: "resource_request", message: "", resource_name: "" });
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const loadSessions = useCallback(async () => {
    try {
      const r = await api.student.getSessions() as { data: { sessions: Session[]; weeks_completed: number; unlocked_count: number; days_enrolled: number } };
      setSessions(r.data.sessions);
      setSessionsInfo({ weeks_completed: r.data.weeks_completed, unlocked_count: r.data.unlocked_count, days_enrolled: r.data.days_enrolled });
    } catch { /* portal still works without sessions */ }
  }, []);

  useEffect(() => { loadSessions(); }, [loadSessions]);

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
    setSelectedCompany(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tabs: { view: ViewType; label: string; icon: typeof Star; count: string }[] = [
    { view: "recommended", label: "Recommended", icon: Star,          count: "9" },
    { view: "training",    label: "Training",    icon: GraduationCap, count: `${trainingResourcesCategories.reduce((a, c) => a + c.resources.length, 0)}` },
    { view: "placement",   label: "Placement",   icon: Building2,     count: "17" },
    { view: "sessions",    label: "Sessions",    icon: PlayCircle,    count: "11" },
  ];

  const cardHover = (e: React.MouseEvent<HTMLDivElement>, enter: boolean) => {
    const el = e.currentTarget as HTMLDivElement;
    el.style.borderColor = enter ? B     : BORD;
    el.style.transform   = enter ? "translateY(-3px)" : "translateY(0)";
    el.style.boxShadow   = enter ? `4px 4px 0 ${B}` : "0 1px 6px rgba(0,0,0,0.06)";
  };

  const card: React.CSSProperties = {
    backgroundColor: SURF,
    border: `2px solid ${BORD}`,
    borderRadius: "10px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, color: B, ...MONO }}>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, backgroundColor: W, borderBottom: `2px solid ${BORD}` }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }} onClick={() => navigate("/")}>
            <img src="/upstride-logo.png" alt="Upstride" style={{ height: "30px", objectFit: "contain" }} />
            <span style={{ fontSize: "16px", fontWeight: 700, color: B, letterSpacing: "0.05em" }}>UPSTRIDE</span>
            <span style={{ fontSize: "10px", backgroundColor: Y, color: B, padding: "2px 8px", borderRadius: "3px", fontWeight: 700, letterSpacing: "0.12em", border: `1px solid ${B}` }}>
              PORTAL
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button onClick={() => navigate("/workspace")}
              style={{ display: "flex", alignItems: "center", gap: "6px", color: B, background: Y, border: `2px solid ${B}`, borderRadius: "6px", padding: "7px 14px", cursor: "pointer", fontSize: "12px", fontWeight: 700, ...MONO }}>
              <CheckSquare size={14} /> My Workspace
            </button>
            <button onClick={() => setShowFeedback(true)}
              style={{ display: "flex", alignItems: "center", gap: "6px", color: MUTE, background: "none", border: `2px solid ${BORD}`, borderRadius: "6px", padding: "7px 14px", cursor: "pointer", fontSize: "12px", ...MONO }}>
              <MessageSquare size={14} /> Request Resource
            </button>
            <button onClick={handleLogout}
              style={{ display: "flex", alignItems: "center", gap: "8px", color: MUTE, background: "none", border: `2px solid ${BORD}`, borderRadius: "6px", padding: "7px 14px", cursor: "pointer", fontSize: "12px", ...MONO, transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#EF4444"; (e.currentTarget as HTMLButtonElement).style.color = "#EF4444"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = BORD; (e.currentTarget as HTMLButtonElement).style.color = MUTE; }}>
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ── TAB BAR ─────────────────────────────────────────────────────── */}
      <div style={{ position: "fixed", top: "60px", left: 0, right: 0, zIndex: 99, backgroundColor: W, borderBottom: `2px solid ${BORD}` }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px", display: "flex", gap: "4px", overflowX: "auto" }}>
          {tabs.map(({ view, label, icon: Icon, count }) => (
            <button
              key={view}
              onClick={() => switchView(view)}
              style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "14px 20px",
                fontSize: "12px", fontWeight: 600, letterSpacing: "0.05em",
                ...MONO,
                background: "none", border: "none", cursor: "pointer",
                color: currentView === view ? B : MUTE,
                borderBottom: `3px solid ${currentView === view ? Y : "transparent"}`,
                transition: "all 0.15s",
                whiteSpace: "nowrap" as const,
              }}
              onMouseEnter={e => { if (currentView !== view) (e.currentTarget as HTMLButtonElement).style.color = B; }}
              onMouseLeave={e => { if (currentView !== view) (e.currentTarget as HTMLButtonElement).style.color = MUTE; }}
            >
              <Icon size={15} />
              {label}
              <span style={{ backgroundColor: currentView === view ? Y : `${B}10`, color: B, borderRadius: "4px", padding: "1px 7px", fontSize: "10px", fontWeight: 700, border: `1px solid ${currentView === view ? B : BORD}` }}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "120px 24px 60px" }}>

        {/* ══ RECOMMENDED ════════════════════════════════════════════════ */}
        {currentView === "recommended" && (
          <div>
            <div style={{ marginBottom: "36px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: Y, color: B, border: `2px solid ${B}`, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "16px" }}>
                <Flame size={13} /> HANDPICKED FOR MAXIMUM IMPACT
              </div>
              <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.02em" }}>
                Start Here.
              </h1>
              <p style={{ fontSize: "14px", color: MUTE, maxWidth: "480px", lineHeight: 1.7 }}>
                These 9 resources have the highest impact-to-effort ratio. Open one right now.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
              {recommendedDocs.map((doc) => (
                <div key={doc.id} style={card} onClick={() => window.open(doc.url, "_blank")} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
                  <div style={{ padding: "20px 20px 14px", borderBottom: `1px solid ${BORD}` }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: Y, border: `2px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <doc.icon size={17} color={B} />
                      </div>
                      {doc.badge && (
                        <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", padding: "3px 8px", backgroundColor: doc.badge.accent ? B : `${B}10`, color: doc.badge.accent ? Y : MUTE, border: `1px solid ${doc.badge.accent ? B : BORD}` }}>
                          {doc.badge.label}
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: B, lineHeight: 1.3 }}>{doc.name}</h3>
                  </div>
                  <div style={{ padding: "14px 20px" }}>
                    <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, marginBottom: "14px" }}>{doc.tagline}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: B, fontSize: "12px", fontWeight: 700 }}>
                      Open & Study <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ TRAINING ═══════════════════════════════════════════════════ */}
        {currentView === "training" && (
          <div>
            <div style={{ marginBottom: "36px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: Y, color: B, border: `2px solid ${B}`, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "16px" }}>
                <Zap size={13} /> COMPLETE LEARNING ARSENAL
              </div>
              <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.02em" }}>
                Your Arsenal.
              </h1>
              <p style={{ fontSize: "14px", color: MUTE, maxWidth: "500px", lineHeight: 1.7 }}>
                Every resource from day one to offer letter. Organized. Curated. Waiting.
              </p>
            </div>

            {trainingResourcesCategories.map((cat, catIdx) => (
              <div key={catIdx} style={{ marginBottom: "44px" }}>
                {/* Category header */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px", backgroundColor: W, border: `2px solid ${B}`, borderLeft: `5px solid ${Y}`, marginBottom: "14px", boxShadow: `3px 3px 0 ${B}` }}>
                  <div style={{ width: "32px", height: "32px", backgroundColor: Y, border: `2px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <cat.icon size={16} color={B} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: "15px", fontWeight: 700, color: B, marginBottom: "2px" }}>{cat.category}</h2>
                    <p style={{ fontSize: "12px", color: MUTE }}>{cat.headline}</p>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: "11px", color: MUTE, backgroundColor: BG, border: `1px solid ${BORD}`, borderRadius: "4px", padding: "3px 10px", flexShrink: 0 }}>
                    {cat.resources.length} resources
                  </span>
                </div>

                {/* Resources */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
                  {cat.resources.map((res, resIdx) => (
                    <div key={resIdx} style={card} onClick={() => window.open(res.url, "_blank")} onMouseEnter={e => cardHover(e, true)} onMouseLeave={e => cardHover(e, false)}>
                      <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${BORD}`, display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "30px", height: "30px", backgroundColor: Y, border: `2px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <res.icon size={14} color={B} />
                        </div>
                        <h3 style={{ fontSize: "13px", fontWeight: 700, color: B, lineHeight: 1.3 }}>{res.name}</h3>
                      </div>
                      <div style={{ padding: "12px 16px" }}>
                        <p style={{ fontSize: "11px", color: MUTE, lineHeight: 1.7, marginBottom: "12px" }}>{res.tagline}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", color: B, fontSize: "11px", fontWeight: 700 }}>
                          Access Resource <ArrowUpRight size={13} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ PLACEMENT ══════════════════════════════════════════════════ */}
        {currentView === "placement" && (
          <div>
            <div style={{ marginBottom: "36px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: Y, color: B, border: `2px solid ${B}`, padding: "5px 14px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "16px" }}>
                <Trophy size={13} /> COMPANY-SPECIFIC PREPARATION
              </div>
              <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 700, color: B, marginBottom: "8px", letterSpacing: "-0.02em" }}>
                Know Before You Walk In.
              </h1>
              <p style={{ fontSize: "14px", color: MUTE, maxWidth: "500px", lineHeight: 1.7 }}>
                17 companies. Their actual questions. Your unfair advantage — use it.
              </p>
            </div>

            {/* Service-based */}
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px", backgroundColor: W, border: `2px solid ${B}`, borderLeft: `5px solid ${Y}`, marginBottom: "16px", boxShadow: `3px 3px 0 ${B}` }}>
                <div style={{ width: "32px", height: "32px", backgroundColor: Y, border: `2px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Building2 size={16} color={B} />
                </div>
                <div>
                  <h2 style={{ fontSize: "15px", fontWeight: 700, color: B, marginBottom: "2px" }}>Service-Based IT Companies</h2>
                  <p style={{ fontSize: "12px", color: MUTE }}>Tap a company to unlock its 3 preparation resources</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px", marginBottom: "20px" }}>
                {companiesWithMultipleResources.map((company) => (
                  <button
                    key={company.name}
                    onClick={() => setSelectedCompany(selectedCompany === company.name ? null : company.name)}
                    style={{
                      padding: "16px 12px",
                      border: `2px solid ${selectedCompany === company.name ? B : BORD}`,
                      backgroundColor: selectedCompany === company.name ? Y : W,
                      color: B,
                      fontSize: "12px", fontWeight: 700,
                      ...MONO,
                      cursor: "pointer",
                      transition: "all 0.15s",
                      textAlign: "center" as const,
                      boxShadow: selectedCompany === company.name ? `3px 3px 0 ${B}` : "none",
                    }}
                    onMouseEnter={e => { if (selectedCompany !== company.name) { (e.currentTarget as HTMLButtonElement).style.borderColor = B; } }}
                    onMouseLeave={e => { if (selectedCompany !== company.name) { (e.currentTarget as HTMLButtonElement).style.borderColor = BORD; } }}
                  >
                    🏢<br /><span style={{ fontSize: "11px", display: "block", marginTop: "6px" }}>{company.name}</span>
                  </button>
                ))}
              </div>

              {selectedCompany && companyResources[selectedCompany] && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                    <div style={{ height: "2px", flex: 1, backgroundColor: BORD }} />
                    <span style={{ fontSize: "12px", fontWeight: 700, color: B, backgroundColor: Y, padding: "4px 14px", border: `2px solid ${B}` }}>{selectedCompany} — 3 Resources Unlocked</span>
                    <div style={{ height: "2px", flex: 1, backgroundColor: BORD }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
                    {questionTypes.map((qt) => (
                      <div
                        key={qt.type}
                        style={card}
                        onClick={() => { const url = companyResources[selectedCompany]?.[qt.type]; if (url) window.open(url, "_blank"); }}
                        onMouseEnter={e => cardHover(e, true)}
                        onMouseLeave={e => cardHover(e, false)}
                      >
                        <div style={{ padding: "16px 18px 12px", borderBottom: `1px solid ${BORD}`, display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "32px", height: "32px", backgroundColor: Y, border: `2px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <qt.icon size={15} color={B} />
                          </div>
                          <h3 style={{ fontSize: "14px", fontWeight: 700, color: B }}>{qt.type}</h3>
                        </div>
                        <div style={{ padding: "12px 18px" }}>
                          <p style={{ fontSize: "11px", color: MUTE, lineHeight: 1.7, marginBottom: "12px" }}>{qt.tagline}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: "5px", color: B, fontSize: "11px", fontWeight: 700 }}>
                            View Questions <ArrowUpRight size={13} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!selectedCompany && (
                <div style={{ textAlign: "center", padding: "40px", backgroundColor: W, border: `2px dashed ${BORD2}`, borderRadius: "8px" }}>
                  <Building2 size={32} color={BORD2} style={{ margin: "0 auto 10px" }} />
                  <p style={{ fontSize: "12px", color: MUTE }}>Select a company above to unlock its preparation resources</p>
                </div>
              )}
            </div>

            {/* Product companies */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px", backgroundColor: W, border: `2px solid ${B}`, borderLeft: `5px solid ${Y}`, marginBottom: "16px", boxShadow: `3px 3px 0 ${B}` }}>
                <div style={{ width: "32px", height: "32px", backgroundColor: Y, border: `2px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={16} color={B} />
                </div>
                <div>
                  <h2 style={{ fontSize: "15px", fontWeight: 700, color: B, marginBottom: "2px" }}>Product & Startup Companies</h2>
                  <p style={{ fontSize: "12px", color: MUTE }}>These companies pay 2–3× market average. One focused prep can change your trajectory.</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "10px" }}>
                {companiesWithSingleResource.map((company) => (
                  <button
                    key={company.name}
                    onClick={() => {
                      if (company.url) window.open(company.url, "_blank");
                      else toast({ title: "Coming Soon", description: `${company.name} resources will be available soon` });
                    }}
                    style={{ padding: "16px 12px", border: `2px solid ${BORD}`, backgroundColor: W, cursor: "pointer", transition: "all 0.15s", textAlign: "center" as const, ...MONO }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = B; (e.currentTarget as HTMLButtonElement).style.backgroundColor = Y; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = BORD; (e.currentTarget as HTMLButtonElement).style.backgroundColor = W; }}
                  >
                    <span style={{ fontSize: "24px", display: "block", marginBottom: "6px" }}>{company.emoji}</span>
                    <span style={{ fontSize: "11px", color: B, fontWeight: 600 }}>{company.name}</span>
                    {!company.url && <span style={{ display: "block", fontSize: "9px", color: MUTE, marginTop: "2px" }}>Coming Soon</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SESSIONS VIEW ──────────────────────────────────────────── */}
        {currentView === "sessions" && (
          <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 24px" }}>
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
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
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
    </div>
  );
};

export default Portal;
