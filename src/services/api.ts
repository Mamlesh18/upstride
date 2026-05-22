// const BASE_URL = "https://upstride-backend-portal.vercel.app";
const BASE_URL = "http://localhost:8001";

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

async function formRequest<T>(path: string, formData: FormData, method = "POST"): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    body: formData,
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || data.message || "Request failed");
  return data;
}

// ── Compass types ──
export interface CompassNextSkill {
  name: string;
  why: string;
  resource_hint?: string;
}
export interface CompassRoadmapStep {
  step: number;
  title: string;
  duration: string;
  skills: string[];
  milestone: string;
  resource_hint?: string;
}
export interface CompassRole {
  id: string;
  title: string;
  description: string;
  demand: string;
  salary_range?: string;
  next_skills: CompassNextSkill[];
  roadmap?: CompassRoadmapStep[];
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
  },

  admin: {
    getStats: () => request("/api/admin/stats"),

    addStudent: (data: { email: string; name: string; password: string }) =>
      request("/api/admin/students", { method: "POST", body: JSON.stringify(data) }),
    bulkAddStudents: (emails: string[], password: string, batchId?: string, resumeEmail?: string, resumePassword?: string) =>
      request("/api/admin/students/bulk", { method: "POST", body: JSON.stringify({ emails, password, ...(batchId ? { batch_id: batchId } : {}), ...(resumeEmail ? { resume_enhancer_email: resumeEmail, resume_enhancer_password: resumePassword } : {}) }) }),
    listStudents: (page = 1, search = "") =>
      request(`/api/admin/students?page=${page}&search=${search}`),
    updateStudent: (id: string, data: Record<string, unknown>) =>
      request(`/api/admin/students/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    resetPassword: (id: string, newPassword: string) =>
      request(`/api/admin/students/${id}/reset-password`, {
        method: "PATCH",
        body: JSON.stringify({ new_password: newPassword }),
      }),
    deleteStudent: (id: string) =>
      request(`/api/admin/students/${id}`, { method: "DELETE" }),
    setResumeEnhancer: (id: string, email: string, password: string) =>
      request(`/api/admin/students/${id}/resume-enhancer`, { method: "PATCH", body: JSON.stringify({ email, password }) }),
    bulkSetResumeEnhancer: (email: string, password: string) =>
      request("/api/admin/students/resume-enhancer/bulk-set", { method: "POST", body: JSON.stringify({ email, password }) }),

    addManager: (data: { email: string; name: string; password: string }) =>
      request("/api/admin/managers", { method: "POST", body: JSON.stringify(data) }),
    listManagers: () => request("/api/admin/managers"),
    deleteManager: (id: string) =>
      request(`/api/admin/managers/${id}`, { method: "DELETE" }),

    addProject: (data: { title: string; description: string; project_link: string; meeting_link: string; github_link: string; day: string; time: string; manager_id: string }) =>
      request("/api/admin/projects", { method: "POST", body: JSON.stringify(data) }),
    listProjects: () => request("/api/admin/projects"),
    updateProject: (id: string, data: Record<string, unknown>) =>
      request(`/api/admin/projects/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    deleteProject: (id: string) =>
      request(`/api/admin/projects/${id}`, { method: "DELETE" }),

    // Sales persons
    addSalesperson: (data: { email: string; name: string; password: string }) =>
      request("/api/admin/salespersons", { method: "POST", body: JSON.stringify(data) }),
    listSalespersons: () => request("/api/admin/salespersons"),
    deleteSalesperson: (id: string) =>
      request(`/api/admin/salespersons/${id}`, { method: "DELETE" }),

    // Contacts
    bulkAddContacts: (raw: string) =>
      request("/api/admin/contacts/bulk", { method: "POST", body: JSON.stringify({ raw }) }),
    allotContacts: (salesperson_id: string, count: number) =>
      request("/api/admin/contacts/allot", { method: "POST", body: JSON.stringify({ salesperson_id, count }) }),
    listContacts: (params: { status?: string; assigned_to?: string; search?: string; page?: number; date?: string }) => {
      const q = new URLSearchParams();
      if (params.status) q.set("status", params.status);
      if (params.assigned_to) q.set("assigned_to", params.assigned_to);
      if (params.search) q.set("search", params.search);
      if (params.page) q.set("page", String(params.page));
      if (params.date) q.set("date", params.date);
      return request(`/api/admin/contacts?${q}`);
    },
    contactStats: () => request("/api/admin/contacts/stats"),
    deleteContact: (id: string) => request(`/api/admin/contacts/${id}`, { method: "DELETE" }),
    clearUnassigned: () => request("/api/admin/contacts/clear-unassigned", { method: "DELETE" }),

    // Jobs
    listJobs: () => request("/api/admin/jobs"),
    createJob: (data: { role: string; company: string; description: string; apply_link: string; category: string }) =>
      request("/api/admin/jobs", { method: "POST", body: JSON.stringify(data) }),
    updateJob: (id: string, data: Record<string, unknown>) =>
      request(`/api/admin/jobs/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    deleteJob: (id: string) => request(`/api/admin/jobs/${id}`, { method: "DELETE" }),

    // Public users & leads
    listPublicUsers: () => request("/api/admin/public-users"),
    listLeads: () => request("/api/admin/leads"),
  },

  projects: {
    myProjects: () => request("/api/projects/my"),
  },

  sales: {
    myContacts: (status?: string) =>
      request(`/api/sales/contacts${status ? `?status=${status}` : ""}`),
    updateStatus: (contactId: string, status: string, notes?: string) =>
      request(`/api/sales/contacts/${contactId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, notes }),
      }),
    addContact: (data: { name: string; phone: string; email?: string }) =>
      request("/api/sales/contacts", { method: "POST", body: JSON.stringify(data) }),
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
    getSchedule: () => request("/api/student/schedule"),
    getUpcomingEvents: () => request("/api/student/events"),

    // ── Compass — personalized career graph ──
    getCompass: () => request<CompassMapResponse>("/api/student/compass"),
    generateCompass: (skills: string[], interests?: string) =>
      request<CompassMapResponse>("/api/student/compass/generate", {
        method: "POST",
        body: JSON.stringify({ skills, interests: interests || null }),
      }),
    deleteCompass: () => request("/api/student/compass", { method: "DELETE" }),
  },

  public: {
    jobs: (params: { category?: string; search?: string; page?: number }) => {
      const q = new URLSearchParams();
      if (params.category) q.set("category", params.category);
      if (params.search) q.set("search", params.search);
      if (params.page) q.set("page", String(params.page));
      return request(`/api/public/jobs?${q}`);
    },
    apply: (data: { name: string; email: string; phone: string }) =>
      request("/api/public/apply", { method: "POST", body: JSON.stringify(data) }),
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

  events: {
    getUpcoming: () => request("/api/events"),
    adminList: () => request("/api/admin/events"),
    create: (fd: FormData) => formRequest("/api/admin/events", fd),
    update: (id: string, fd: FormData) => formRequest(`/api/admin/events/${id}`, fd, "PATCH"),
    delete: (id: string) => request(`/api/admin/events/${id}`, { method: "DELETE" }),
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

  adminCourses: {
    list: () => request("/api/admin/courses"),
    create: (data: Record<string, unknown>) =>
      request("/api/admin/courses", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      request(`/api/admin/courses/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) => request(`/api/admin/courses/${id}`, { method: "DELETE" }),
    addTopic: (courseId: string, data: Record<string, unknown>) =>
      request(`/api/admin/courses/${courseId}/topics`, { method: "POST", body: JSON.stringify(data) }),
    bulkAddTopics: (courseId: string, topics: Record<string, unknown>[]) =>
      request(`/api/admin/courses/${courseId}/topics/bulk`, { method: "POST", body: JSON.stringify({ topics }) }),
    updateTopic: (courseId: string, topicId: string, data: Record<string, unknown>) =>
      request(`/api/admin/courses/${courseId}/topics/${topicId}`, { method: "PATCH", body: JSON.stringify(data) }),
    deleteTopic: (courseId: string, topicId: string) =>
      request(`/api/admin/courses/${courseId}/topics/${topicId}`, { method: "DELETE" }),
  },

  courses: {
    list: () => request<{ success: boolean; data: unknown[] }>("/api/courses"),
    get: (courseId: string) => request<{ success: boolean; data: unknown }>(`/api/courses/${courseId}`),
    markComplete: (courseId: string, topicId: string) =>
      request(`/api/courses/${courseId}/progress/${topicId}`, { method: "POST" }),
    markIncomplete: (courseId: string, topicId: string) =>
      request(`/api/courses/${courseId}/progress/${topicId}`, { method: "DELETE" }),
  },

  standup: {
    pmBatches: () => request<{ success: boolean; data: { batches: { id: string; name: string }[] } }>("/api/standup/pm/batches"),
    pmGet: (batchId: string) => request<{ success: boolean; data: { batch_id: string; dates: string[]; students: { email: string; name: string; role: string; updates: Record<string, string> }[] } }>(`/api/standup/pm/${batchId}`),
    pmUpdateCell: (batchId: string, date: string, student_email: string, update: string) =>
      request(`/api/standup/pm/${batchId}/cell`, { method: "PATCH", body: JSON.stringify({ date, student_email, update }) }),
    pmUpdateRole: (batchId: string, student_email: string, role: string) =>
      request(`/api/standup/pm/${batchId}/role`, { method: "PATCH", body: JSON.stringify({ student_email, role }) }),
    pmAddDate: (batchId: string, date: string) =>
      request(`/api/standup/pm/${batchId}/date`, { method: "POST", body: JSON.stringify({ date }) }),
    pmRemoveDate: (batchId: string, date: string) =>
      request(`/api/standup/pm/${batchId}/date/remove`, { method: "POST", body: JSON.stringify({ date }) }),
    studentGet: () => request<{ success: boolean; data: { batch_id: string | null; dates: string[]; students: { email: string; name: string; role: string; updates: Record<string, string> }[] } }>("/api/standup/student"),
  },

  batches: {
    list: () => request("/api/admin/batches"),
    create: (data: { name: string; resume_enhancer_email?: string; resume_enhancer_password?: string; common_calendar_url?: string; calendar_url_1?: string; calendar_url_2?: string }) =>
      request("/api/admin/batches", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Record<string, unknown>) =>
      request(`/api/admin/batches/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) => request(`/api/admin/batches/${id}`, { method: "DELETE" }),
  },

  adminExtra: {
    getSessions: () => request("/api/admin/sessions"),
    updateSession: (sessionNumber: number, data: { drive_link?: string; description?: string }) =>
      request(`/api/admin/sessions/${sessionNumber}`, { method: "PATCH", body: JSON.stringify(data) }),
    getFeedback: (status?: string) =>
      request(`/api/admin/feedback${status ? `?status=${status}` : ""}`),
    resolveFeedback: (id: string) =>
      request(`/api/admin/feedback/${id}/resolve`, { method: "PATCH" }),
  },
};
