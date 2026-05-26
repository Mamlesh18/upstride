import type { LucideIcon } from "lucide-react";
import {
  Sparkles, BarChart3, Server, Brain, LayoutTemplate, Cpu, Coffee, Layers,
  ScanEye, Megaphone, PieChart, Code2, Boxes, Smartphone, TrendingUp, Triangle, Atom,
  BookOpen,
} from "lucide-react";

/**
 * CourseCover — a code-generated, branded course cover.
 * No online/stock images: each course gets a designed poster built from a
 * per-subject theme (accent colour, dark gradient, icon, kicker tag).
 * Falls back to a keyword-based theme for any course not explicitly mapped.
 */

export interface CourseTheme {
  accent: string;   // bright accent used for badge / tag / glow
  from: string;     // gradient start (dark)
  to: string;       // gradient end (darker)
  tag: string;      // mono kicker, eg "GENERATIVE AI"
  icon: LucideIcon;
  description: string;
}

const Y = "#FFE500";

export const COURSE_META: Record<string, CourseTheme> = {
  "generative-ai-for-begineers": {
    accent: "#A78BFA", from: "#1E1B3A", to: "#0C0A1C", tag: "GENERATIVE AI", icon: Sparkles,
    description: "Build with LLMs from day one — prompt engineering, RAG, and real AI apps. Go from curious to shipping your first GenAI project.",
  },
  "data-analyst-for-begineers": {
    accent: "#22C55E", from: "#07261A", to: "#08130E", tag: "DATA ANALYTICS", icon: BarChart3,
    description: "Turn raw data into decisions. Master Excel, SQL, Python, and Power BI to analyse, visualise, and tell stories with data.",
  },
  "python-for-beginners-backend": {
    accent: "#FBBF24", from: "#2A2410", to: "#14110A", tag: "PYTHON · BACKEND", icon: Server,
    description: "Learn Python the right way and build real backend APIs — from syntax to servers, databases, and deployment.",
  },
  "deep-learning-for-beginners": {
    accent: "#60A5FA", from: "#0C1E33", to: "#08111F", tag: "DEEP LEARNING", icon: Brain,
    description: "Demystify neural networks. Build and train deep learning models through hands-on projects — no PhD required.",
  },
  "frontend-for-beginners": {
    accent: "#38BDF8", from: "#07273A", to: "#07131D", tag: "FRONTEND", icon: LayoutTemplate,
    description: "Build beautiful, responsive websites. Master HTML, CSS, and JavaScript to ship interfaces people love to use.",
  },
  "machin-learning-engineer": {
    accent: "#818CF8", from: "#131A33", to: "#0A0E1F", tag: "MACHINE LEARNING", icon: Cpu,
    description: "Become an ML Engineer by building real projects — models, pipelines, and deployment. Understand how AI works in practice.",
  },
  "java-for-begineers": {
    accent: "#FB7185", from: "#2A1115", to: "#14090B", tag: "JAVA", icon: Coffee,
    description: "Start strong with Java. Master core programming, OOP, and problem-solving — the foundation for backend and Android.",
  },
  "java-for-beginners-backend": {
    accent: "#FB923C", from: "#2A1A0E", to: "#140D07", tag: "JAVA · BACKEND", icon: Server,
    description: "Build production-grade backends with Java and Spring Boot — APIs, databases, and the patterns top companies hire for.",
  },
  "mern-stack-for-beginners": {
    accent: "#34D399", from: "#07261F", to: "#081310", tag: "MERN STACK", icon: Layers,
    description: "Build full-stack web apps end to end with MongoDB, Express, React, and Node — the stack startups run on.",
  },
  "computer-vision-for-beginners": {
    accent: "#22D3EE", from: "#07252B", to: "#081316", tag: "COMPUTER VISION", icon: ScanEye,
    description: "Teach machines to see. Work with images and video using OpenCV and deep learning to build real CV applications.",
  },
  "the-complete-marketing-course": {
    accent: "#F472B6", from: "#2A1020", to: "#140810", tag: "MARKETING", icon: Megaphone,
    description: "End-to-end marketing that actually converts — branding, content, SEO, ads, and growth in one complete playbook.",
  },
  "data-science-for-beginners": {
    accent: "#2DD4BF", from: "#07241F", to: "#081310", tag: "DATA SCIENCE", icon: PieChart,
    description: "Go from data to insight to impact — statistics, Python, machine learning, and visualisation in one structured path.",
  },
  "software-developer-for-beginners": {
    accent: "#93C5FD", from: "#0E1A2E", to: "#080E1A", tag: "SOFTWARE DEV", icon: Code2,
    description: "Everything a software developer needs — programming fundamentals, data structures, version control, and building real software.",
  },
  "golang-for-beginners": {
    accent: "#22D3EE", from: "#06232B", to: "#071215", tag: "GOLANG", icon: Boxes,
    description: "Learn Go, the language behind modern cloud and high-performance systems — simple, fast, and built to scale.",
  },
  "react-native-for-beginners": {
    accent: "#38BDF8", from: "#0A1E2E", to: "#07121C", tag: "REACT NATIVE", icon: Atom,
    description: "Build real iOS and Android apps from one codebase. Master React Native and ship your first mobile app.",
  },
  "sales-for-beginners": {
    accent: "#FBBF24", from: "#2A2210", to: "#14100A", tag: "SALES", icon: TrendingUp,
    description: "Start a high-income career in sales — outreach, pitching, objection handling, and closing. Skills that pay anywhere.",
  },
  "flutter-for-beginners": {
    accent: "#54C5F8", from: "#0A2030", to: "#07131D", tag: "FLUTTER", icon: Smartphone,
    description: "Build gorgeous cross-platform apps with Flutter and Dart — one codebase for mobile, web, and desktop.",
  },
  "next.js-for-beginners": {
    accent: "#E5E7EB", from: "#1A1A1A", to: "#050505", tag: "NEXT.JS", icon: Triangle,
    description: "Ship fast, SEO-friendly React apps with Next.js — routing, server rendering, and full-stack features built in.",
  },
};

// Keyword fallback for any course not explicitly mapped above.
function fallbackTheme(title: string): CourseTheme {
  const t = title.toLowerCase();
  const pick = (partial: Omit<CourseTheme, "description">): CourseTheme => ({ ...partial, description: "" });
  if (/(gen ?ai|generative|llm|prompt)/.test(t)) return pick({ accent: "#A78BFA", from: "#1E1B3A", to: "#0C0A1C", tag: "GENERATIVE AI", icon: Sparkles });
  if (/(deep learning|neural)/.test(t))          return pick({ accent: "#60A5FA", from: "#0C1E33", to: "#08111F", tag: "DEEP LEARNING", icon: Brain });
  if (/(machine learning|ml |ml$)/.test(t))      return pick({ accent: "#818CF8", from: "#131A33", to: "#0A0E1F", tag: "MACHINE LEARNING", icon: Cpu });
  if (/(computer vision|opencv|vision)/.test(t)) return pick({ accent: "#22D3EE", from: "#07252B", to: "#081316", tag: "COMPUTER VISION", icon: ScanEye });
  if (/(data science|data scientist)/.test(t))   return pick({ accent: "#2DD4BF", from: "#07241F", to: "#081310", tag: "DATA SCIENCE", icon: PieChart });
  if (/(data analyst|analytics|power bi)/.test(t)) return pick({ accent: "#22C55E", from: "#07261A", to: "#08130E", tag: "DATA ANALYTICS", icon: BarChart3 });
  if (/(react native|flutter|mobile|android|ios)/.test(t)) return pick({ accent: "#54C5F8", from: "#0A2030", to: "#07131D", tag: "MOBILE", icon: Smartphone });
  if (/next\.?js/.test(t))                       return pick({ accent: "#E5E7EB", from: "#1A1A1A", to: "#050505", tag: "NEXT.JS", icon: Triangle });
  if (/(frontend|front end|react|web)/.test(t))  return pick({ accent: "#38BDF8", from: "#07273A", to: "#07131D", tag: "FRONTEND", icon: LayoutTemplate });
  if (/mern/.test(t))                            return pick({ accent: "#34D399", from: "#07261F", to: "#081310", tag: "MERN STACK", icon: Layers });
  if (/(java)/.test(t))                          return pick({ accent: "#FB7185", from: "#2A1115", to: "#14090B", tag: "JAVA", icon: Coffee });
  if (/(python)/.test(t))                        return pick({ accent: "#FBBF24", from: "#2A2410", to: "#14110A", tag: "PYTHON", icon: Server });
  if (/(go ?lang|golang)/.test(t))               return pick({ accent: "#22D3EE", from: "#06232B", to: "#071215", tag: "GOLANG", icon: Boxes });
  if (/(marketing|seo|brand)/.test(t))           return pick({ accent: "#F472B6", from: "#2A1020", to: "#140810", tag: "MARKETING", icon: Megaphone });
  if (/(sales|selling)/.test(t))                 return pick({ accent: "#FBBF24", from: "#2A2210", to: "#14100A", tag: "SALES", icon: TrendingUp });
  if (/(software|developer|programming)/.test(t)) return pick({ accent: "#93C5FD", from: "#0E1A2E", to: "#080E1A", tag: "SOFTWARE DEV", icon: Code2 });
  return pick({ accent: Y, from: "#1a1a2e", to: "#0A0A14", tag: "COURSE", icon: BookOpen });
}

export function getCourseTheme(slug: string | undefined, title: string): CourseTheme {
  if (slug && COURSE_META[slug]) return COURSE_META[slug];
  return fallbackTheme(title || "");
}

/** Curated description if we have one, else whatever the backend stored. */
export function getCourseDescription(course: { slug?: string; title: string; description?: string }): string {
  const meta = course.slug ? COURSE_META[course.slug] : undefined;
  if (meta?.description) return meta.description;
  return course.description || "";
}

interface CourseCoverProps {
  slug?: string;
  title: string;
  hovered?: boolean;
  /** "full" = card banner; "thumb" = small side thumbnail */
  variant?: "full" | "thumb";
  height?: number | string;
  width?: number | string;
}

const DOT_PATTERN = (color: string) =>
  `radial-gradient(${color} 1px, transparent 1px)`;

export default function CourseCover({ slug, title, hovered = false, variant = "full", height, width }: CourseCoverProps) {
  const theme = getCourseTheme(slug, title);
  const Icon = theme.icon;
  const isThumb = variant === "thumb";

  return (
    <div
      aria-hidden
      style={{
        position: "relative",
        width: width ?? "100%",
        height: height ?? "100%",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${theme.from} 0%, ${theme.to} 100%)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: isThumb ? "center" : "space-between",
        alignItems: isThumb ? "center" : "stretch",
        padding: isThumb ? 0 : "16px 18px",
      }}
    >
      {/* dotted grid texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: DOT_PATTERN(`${theme.accent}22`),
        backgroundSize: "16px 16px",
        opacity: 0.6,
        pointerEvents: "none",
      }} />

      {/* accent glow, top-right */}
      <div style={{
        position: "absolute", top: "-40%", right: "-15%",
        width: "70%", height: "150%",
        background: `radial-gradient(circle, ${theme.accent}40, transparent 60%)`,
        pointerEvents: "none",
        transition: "transform 0.4s ease",
        transform: hovered ? "scale(1.15)" : "scale(1)",
      }} />

      {/* diagonal accent bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "4px",
        background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}33)`,
        pointerEvents: "none",
      }} />

      {/* big watermark icon, bottom-right */}
      <Icon
        size={isThumb ? 40 : 140}
        color={theme.accent}
        strokeWidth={1.2}
        style={{
          position: "absolute",
          right: isThumb ? "50%" : "-22px",
          bottom: isThumb ? "50%" : "-30px",
          transform: isThumb ? "translate(50%, 50%)" : (hovered ? "rotate(-6deg) scale(1.05)" : "rotate(-6deg)"),
          opacity: isThumb ? 0.85 : 0.16,
          transition: "transform 0.4s ease",
          pointerEvents: "none",
        }}
      />

      {isThumb ? null : (
        <>
          {/* top row — subject tag */}
          <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: theme.accent, color: "#0A0A0A",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em",
              padding: "4px 9px", borderRadius: "4px",
            }}>
              {theme.tag}
            </span>
          </div>

          {/* bottom row — icon badge + wordmark */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "46px", height: "46px", flexShrink: 0,
              borderRadius: "12px",
              background: theme.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 6px 18px ${theme.accent}55`,
              transition: "transform 0.3s ease",
              transform: hovered ? "translateY(-2px)" : "none",
            }}>
              <Icon size={24} color="#0A0A0A" strokeWidth={2.2} />
            </div>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em",
              color: "#FFFFFF", opacity: 0.55,
            }}>
              UPSTRIDES
            </span>
          </div>
        </>
      )}
    </div>
  );
}
