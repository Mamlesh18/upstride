const BASE_URL = "https://upstride-backend-portal.vercel.app";
// const BASE_URL = "http://localhost:8001";
// 
function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json();
  if (!res.ok) {
    const detail = Array.isArray(data.detail)
      ? data.detail.map((e: { loc: string[]; msg: string }) => `${e.loc.join(".")}: ${e.msg}`).join("; ")
      : (data.detail || data.message || "Request failed");
    console.error("[API error]", res.status, detail, data);
    throw new Error(detail);
  }
  return data;
}

// ── Compass types ──
export interface CompassNextSkill {
  name: string;
  why: string;
  resource_hint?: string;
}
export type CompassLinkType = "course" | "interview" | "career_kit" | "placement";
export interface CompassRecommendedLink {
  type: CompassLinkType;
  slug: string;
  label: string;
  note?: string;
}
export type CompassPhase = "foundations" | "core" | "advanced" | "projects" | "interview";
export interface CompassRoadmapStep {
  step: number;
  phase?: CompassPhase;
  title: string;
  duration: string;
  skills: string[];
  milestone: string;
  resource_hint?: string;
  recommended_links?: CompassRecommendedLink[];
}
export interface CompassFlagshipProject {
  title: string;
  description: string;
  skills?: string[];
  difficulty?: string;
  duration?: string;
  inspiration?: string;
}
export interface CompassRole {
  id: string;
  title: string;
  description: string;
  demand: string;
  salary_range?: string;
  next_skills: CompassNextSkill[];
  roadmap?: CompassRoadmapStep[];
  flagship_projects?: CompassFlagshipProject[];
  recommended_links?: CompassRecommendedLink[];
  combination_of?: string[];
}
export interface CompassCluster {
  id: string;
  label: string;
  tagline: string;
  color: string;
  matched_skills: string[];
  roles: CompassRole[];
}
export interface CompassMap {
  clusters: CompassCluster[];
  combo_roles?: CompassRole[];
}
export interface CompassMapResponse {
  skills_input: string[];
  interests?: string | null;
  generated_at?: string | null;
  updated_at?: string | null;
  map: CompassMap | null;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ access_token: string; user: Record<string, unknown> }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    signup: (data: { name: string; email: string; phone: string; password: string }) =>
      request<{ access_token: string; user: Record<string, unknown> }>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    changePassword: (current_password: string, new_password: string) =>
      request("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ current_password, new_password }),
      }),
    forgotPassword: (email: string, new_password: string) =>
      request<{ success: boolean; message?: string }>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email, new_password }),
      }),
    me: () => request("/api/auth/me"),

    // Post-payment onboarding — student sets their password from /login?welcome=1.
    completeSignup: (email: string, password: string) =>
      request<{ access_token: string; user: { id: string; email: string; name: string; role: string; must_change_password: boolean } }>(
        "/api/auth/complete-signup", { method: "POST", body: JSON.stringify({ email, password }) }
      ),
  },

  admin: {
    getStats: () => request("/api/admin/stats"),

    addStudent: (data: { email: string; name: string; password: string }) =>
      request("/api/admin/students", { method: "POST", body: JSON.stringify(data) }),
    bulkAddStudents: (emails: string[], password: string) =>
      request<{ success: boolean; data: { added: string[]; skipped: string[] } }>(
        "/api/admin/students/bulk",
        { method: "POST", body: JSON.stringify({ emails, password }) },
      ),
    listStudents: (page = 1, search = "", paid?: "true" | "false") => {
      const q = new URLSearchParams({ page: String(page) });
      if (search) q.set("search", search);
      if (paid) q.set("paid", paid);
      return request<{ success: boolean; data: { students: Array<Record<string, unknown>>; pagination: { page: number; limit: number; total: number } } }>(`/api/admin/students?${q}`);
    },
    updateStudent: (id: string, data: Record<string, unknown>) =>
      request(`/api/admin/students/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    resetPassword: (id: string, newPassword: string) =>
      request(`/api/admin/students/${id}/reset-password`, {
        method: "PATCH",
        body: JSON.stringify({ new_password: newPassword }),
      }),
    deleteStudent: (id: string) =>
      request(`/api/admin/students/${id}`, { method: "DELETE" }),

    listLeads: () => request<{ success: boolean; data: { leads: Array<Record<string, unknown>> } }>("/api/admin/leads"),

    // Site settings (course price, payment URL, notes)
    getSettings: () => request<{ success: boolean; data: SiteSettings }>("/api/admin/settings"),
    updateSettings: (data: Partial<SiteSettings>) =>
      request<{ success: boolean; data: SiteSettings }>("/api/admin/settings", { method: "PUT", body: JSON.stringify(data) }),
  },

  student: {
    getSessions: () => request("/api/student/sessions"),
    getWorkspace: () => request("/api/student/workspace"),
    addTask: (data: { title: string; notes?: string; category?: string }) =>
      request("/api/student/workspace", { method: "POST", body: JSON.stringify(data) }),
    updateTask: (id: string, data: Record<string, unknown>) =>
      request(`/api/student/workspace/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    deleteTask: (id: string) =>
      request(`/api/student/workspace/${id}`, { method: "DELETE" }),
    submitFeedback: (data: { type: string; message: string; resource_name?: string }) =>
      request("/api/student/feedback", { method: "POST", body: JSON.stringify(data) }),
    getResumeEnhancer: () => request("/api/student/resume-enhancer"),
    track: (type: string, resource_name?: string) =>
      request("/api/student/track", { method: "POST", body: JSON.stringify({ type, resource_name }) }),
    getLeaderboard: () => request("/api/student/leaderboard"),
    getUpcomingEvents: () => request("/api/student/events"),

    // ── Compass — personalized career graph ──
    getCompass: () => request<CompassMapResponse>("/api/student/compass"),
    generateCompass: (skills: string[], interests?: string) =>
      request<CompassMapResponse>("/api/student/compass/generate", {
        method: "POST",
        body: JSON.stringify({ skills, interests: interests || null }),
      }),
    deleteCompass: () => request("/api/student/compass", { method: "DELETE" }),

    // ── DSA Sheet progress (persisted in MongoDB) ──
    getSheetProgress: () => request<{ done: string[]; revision: string[]; unlocked_solutions: string[]; quota_left: number; daily_limit: number }>("/api/student/sheet/progress"),
    setSheetDone: (done: string[]) =>
      request("/api/student/sheet/done", { method: "PUT", body: JSON.stringify({ done }) }),
    setSheetRevision: (revision: string[]) =>
      request("/api/student/sheet/revision", { method: "PUT", body: JSON.stringify({ revision }) }),
    unlockSheetSolution: (problemId: string) =>
      request<{ unlocked: boolean; quota_left: number; reason?: string; already?: boolean }>(
        "/api/student/sheet/unlock", { method: "POST", body: JSON.stringify({ problem_id: problemId }) }
      ),
  },

  sso: {
    // Frontend never touches the shared secret — it just forwards the SSO token
    // and the target page; the backend verifies it server-to-server and mints
    // a short-lived JWT scoped to that page.
    exchange: (data: { token: string; page: string }) =>
      request<{ access_token: string; email: string; name: string; scope: string }>(
        "/api/sso/exchange", { method: "POST", body: JSON.stringify(data) }
      ),
  },

  public: {
    apply: (data: { name: string; email: string; phone: string; referred_by?: string | null }) =>
      request("/api/public/apply", { method: "POST", body: JSON.stringify(data) }),
    siteConfig: () => request<{ success: boolean; data: SiteSettings }>("/api/public/site-config"),
  },

  mockInterview: {
    getCredits: () =>
      request<{ credits: number; max_credits: number }>("/api/mock-interview/credits"),
    consumeCredit: () =>
      request<{ credits: number; consumed: boolean }>("/api/mock-interview/consume-credit", { method: "POST" }),
    getDeepgramToken: () =>
      request<{ token: string; type: string }>("/api/mock-interview/deepgram-token"),
    tts: (text: string, voice = "aura-asteria-en") =>
      fetch(`${BASE_URL}/api/mock-interview/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) },
        body: JSON.stringify({ text, voice }),
      }),
    chat: (data: { role: string; candidate_info: string; messages: { role: string; content: string }[] }) =>
      request<{ evaluation: string; question: string; is_final: boolean; final_report: unknown }>("/api/mock-interview/chat", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    analyze: (data: { role: string; candidate_info: string; messages: { role: string; content: string }[] }) =>
      request("/api/mock-interview/analyze", { method: "POST", body: JSON.stringify(data) }),
  },

  resources: {
    getAll: () => request("/api/resources"),
    adminList: () => request("/api/admin/resources"),
    add: (data: {
      section: string; category: string; name: string; tagline: string; url: string;
      order?: number; company_type?: string; sub_type?: string; emoji?: string;
      badge_label?: string; badge_accent?: boolean;
    }) => request("/api/admin/resources", { method: "POST", body: JSON.stringify(data) }),
    delete: (id: string) => request(`/api/admin/resources/${id}`, { method: "DELETE" }),
  },

  courses: {
    list: () => request<{ success: boolean; data: unknown[] }>("/api/courses"),
    get: (courseId: string) => request<{ success: boolean; data: unknown }>(`/api/courses/${courseId}`),
    markComplete: (courseId: string, topicId: string) =>
      request(`/api/courses/${courseId}/progress/${topicId}`, { method: "POST" }),
    markIncomplete: (courseId: string, topicId: string) =>
      request(`/api/courses/${courseId}/progress/${topicId}`, { method: "DELETE" }),
  },

  // ── mamlesh.me content ─────────────────────────────────────────────
  blogs: {
    list: () => request<BlogSummary[]>("/api/blogs"),
    get: (slug: string) => request<BlogDetail>(`/api/blogs/${slug}`),
    adminList: () => request<BlogDetail[]>("/api/admin/blogs"),
    create: (data: BlogInput) =>
      request<BlogDetail>("/api/admin/blogs", { method: "POST", body: JSON.stringify(data) }),
    update: (slug: string, data: BlogInput) =>
      request<BlogDetail>(`/api/admin/blogs/${slug}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (slug: string) =>
      request<{ status: string; slug: string }>(`/api/admin/blogs/${slug}`, { method: "DELETE" }),
  },

  papers: {
    list: () => request<Paper[]>("/api/papers"),
    adminList: () => request<Paper[]>("/api/admin/papers"),
    create: (data: PaperInput) =>
      request<Paper>("/api/admin/papers", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: PaperInput) =>
      request<Paper>(`/api/admin/papers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id: string) =>
      request<{ status: string; id: string }>(`/api/admin/papers/${id}`, { method: "DELETE" }),
  },

  analytics: {
    track: (path: string, visitorId: string) =>
      request("/api/track", { method: "POST", body: JSON.stringify({ path, visitor_id: visitorId }) }),
    dashboard: (days = 30) => request<AnalyticsDashboard>(`/api/admin/analytics?days=${days}`),
  },
};

// ── mamlesh content types ────────────────────────────────────────────
export interface BlogBlock {
  type: "heading" | "paragraph" | "list" | "image" | "quote" | "code";
  text?: string;
  items?: string[];
  url?: string;
  caption?: string;
}
export interface BlogSummary {
  slug: string;
  title: string;
  excerpt: string;
  cover_image?: string | null;
  published: boolean;
  created_at: string;
}
export interface BlogDetail extends BlogSummary {
  blocks: BlogBlock[];
}
export interface BlogInput {
  title: string;
  excerpt?: string;
  cover_image?: string | null;
  blocks: BlogBlock[];
  published: boolean;
}
export interface Paper {
  id: string;
  title: string;
  url: string;
  kind: "paper" | "book";
  date: string;
  created_at: string;
}
export interface PaperInput {
  title: string;
  url: string;
  date?: string;
  kind?: "paper" | "book";
}
export interface SiteSettings {
  live_price_inr: number;
  original_price_inr: number;
  live_payment_url: string;
  enrollment_note: string;
  weekend_full_message: string;
  early_bird_text: string;
  calendar_link: string;
  community_link: string;
}
export interface AnalyticsDashboard {
  generated_at: string;
  window_days: number;
  total_visitors: number;
  visitors_today: number;
  visitors_last_7d: number;
  total_pageviews: number;
  revenue_inr: number;
  paid_students: number;
  students: number;
  blogs: number;
  papers: number;
  top_paths: { path: string; count: number }[];
  daily: { date: string; count: number }[];
  recent_signups: { email: string; name: string; paid: boolean; created_at: string }[];
}
