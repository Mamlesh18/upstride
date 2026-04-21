const BASE_URL = "https://upstride-backend-portal.vercel.app";

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
  if (!res.ok) throw new Error(data.detail || data.message || "Request failed");
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

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ access_token: string; user: Record<string, unknown> }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    changePassword: (current_password: string, new_password: string) =>
      request("/api/auth/change-password", {
        method: "POST",
        body: JSON.stringify({ current_password, new_password }),
      }),
    me: () => request("/api/auth/me"),
  },

  admin: {
    getStats: () => request("/api/admin/stats"),

    addStudent: (data: { email: string; name: string; password: string }) =>
      request("/api/admin/students", { method: "POST", body: JSON.stringify(data) }),
    bulkAddStudents: (emails: string[], password: string) =>
      request("/api/admin/students/bulk", { method: "POST", body: JSON.stringify({ emails, password }) }),
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

    addManager: (data: { email: string; name: string; password: string }) =>
      request("/api/admin/managers", { method: "POST", body: JSON.stringify(data) }),
    listManagers: () => request("/api/admin/managers"),
    deleteManager: (id: string) =>
      request(`/api/admin/managers/${id}`, { method: "DELETE" }),

    addProject: (data: { title: string; description: string; project_link: string; meeting_link: string; manager_id: string }) =>
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
    listContacts: (params: { status?: string; assigned_to?: string; search?: string; page?: number }) => {
      const q = new URLSearchParams();
      if (params.status) q.set("status", params.status);
      if (params.assigned_to) q.set("assigned_to", params.assigned_to);
      if (params.search) q.set("search", params.search);
      if (params.page) q.set("page", String(params.page));
      return request(`/api/admin/contacts?${q}`);
    },
    contactStats: () => request("/api/admin/contacts/stats"),
    clearUnassigned: () => request("/api/admin/contacts/clear-unassigned", { method: "DELETE" }),
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
  },

  events: {
    getUpcoming: () => request("/api/events"),
    adminList: () => request("/api/admin/events"),
    create: (fd: FormData) => formRequest("/api/admin/events", fd),
    update: (id: string, fd: FormData) => formRequest(`/api/admin/events/${id}`, fd, "PATCH"),
    delete: (id: string) => request(`/api/admin/events/${id}`, { method: "DELETE" }),
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
