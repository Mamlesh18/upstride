import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Users, FolderKanban, UserCog, PhoneCall, Plus, Trash2, RefreshCw, LogOut, ToggleLeft, ToggleRight, X, PlayCircle, MessageSquare, Lock, Save, CalendarDays, ImagePlus, ToggleRight as Toggle, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

const Y = "#FFE500"; const B = "#0A0A0A"; const W = "#FFFFFF"; const BG = "#FAFAFA";
const BORD = "#E5E5E5"; const MUTE = "#6B7280"; const RED = "#EF4444"; const GREEN = "#22C55E";
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

type Tab = "students" | "managers" | "projects" | "sales" | "sessions" | "feedback" | "events" | "resources";
type ContactStatus = "pending" | "picked" | "rejected" | "missed" | "joining" | "will_discuss";

interface Student { id: string; name: string; email: string; is_active: boolean; must_change_password: boolean; }
interface Manager { id: string; name: string; email: string; is_active: boolean; }
interface Project { id: string; title: string; description: string; project_link: string; meeting_link: string; github_link: string; day: string; time: string; manager_id: string; manager_name: string; }
interface Salesperson { id: string; name: string; email: string; is_active: boolean; }
interface Contact { id: string; name: string; phone: string; email: string; status: ContactStatus; notes: string; assigned_to: string | null; assigned_to_name: string | null; created_at?: string; assigned_at?: string; source?: string; }
interface Stats {
  total_students: number; active_students: number; pending_password_change: number;
  total_managers: number; total_projects: number; live_projects: number; completed_projects: number;
  total_contacts: number; unassigned_contacts: number;
  contacts_pending: number; contacts_picked: number; contacts_rejected: number;
  contacts_missed: number; contacts_joining: number; contacts_will_discuss: number;
}

const STATUS_CONFIG: Record<ContactStatus, { label: string; color: string; bg: string }> = {
  pending:      { label: "Pending",      color: "#6B7280", bg: "#F3F4F6" },
  picked:       { label: "Picked Call",  color: "#16A34A", bg: "#DCFCE7" },
  rejected:     { label: "Rejected",     color: "#DC2626", bg: "#FEE2E2" },
  missed:       { label: "Missed Call",  color: "#D97706", bg: "#FEF3C7" },
  joining:      { label: "Joining",      color: "#7C3AED", bg: "#EDE9FE" },
  will_discuss: { label: "Will Discuss", color: "#0369A1", bg: "#E0F2FE" },
};

const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px" }}>
    <div style={{ backgroundColor: W, border: `2px solid ${B}`, borderRadius: "12px", padding: "32px", width: "100%", maxWidth: "480px", boxShadow: `6px 6px 0 ${Y}`, ...MONO }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: B }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTE }}><X size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

const Input = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>{label}</label>
    <input {...props} style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", boxSizing: "border-box" as const, ...props.style }} />
  </div>
);

const Btn = ({ children, onClick, color = B, disabled = false, small = false }: { children: React.ReactNode; onClick?: () => void; color?: string; disabled?: boolean; small?: boolean }) => (
  <button onClick={onClick} disabled={disabled}
    style={{ padding: small ? "6px 12px" : "10px 20px", backgroundColor: disabled ? `${color}80` : color, color: color === B ? Y : W, border: `2px solid ${color}`, borderRadius: "6px", fontSize: small ? "11px" : "12px", fontWeight: 700, letterSpacing: "0.1em", ...MONO, cursor: disabled ? "not-allowed" : "pointer", boxShadow: `2px 2px 0 ${color === B ? Y : B}` }}>
    {children}
  </button>
);

const toDateStr = (d: Date) => d.toLocaleDateString("en-CA"); // YYYY-MM-DD

export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("students");
  const [stats, setStats] = useState<Stats | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [studentPage, setStudentPage] = useState(1);
  const [studentTotal, setStudentTotal] = useState(0);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [salespersons, setSalespersons] = useState<Salesperson[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactTotal, setContactTotal] = useState(0);
  const [contactPage, setContactPage] = useState(1);
  const [contactFilter, setContactFilter] = useState<string>("all");
  const [contactSpFilter, setContactSpFilter] = useState<string>("all");
  const [contactSearch, setContactSearch] = useState("");
  const [contactDateFilter, setContactDateFilter] = useState(() => toDateStr(new Date()));
  const [contactStats, setContactStats] = useState<Record<string, number>>({});

  interface SessionItem { id: string; session_number: number; week: number; title: string; drive_link: string; description: string; }
  interface FeedbackItem { id: string; student_email: string; type: string; message: string; resource_name: string; status: string; created_at: string; }
  const [adminSessions, setAdminSessions] = useState<SessionItem[]>([]);
  const [editingSession, setEditingSession] = useState<number | null>(null);
  const [sessionEdit, setSessionEdit] = useState({ drive_link: "", description: "" });
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [feedbackFilter, setFeedbackFilter] = useState("open");

  interface EventItem { id: string; title: string; location: string; date: string; description: string; is_active: boolean; image_data: string | null; image_type: string | null; }
  const [eventsList, setEventsList] = useState<EventItem[]>([]);
  const [showAddEvent, setShowAddEvent] = useState(false);

  interface AdminResource { id: string; section: string; category: string; name: string; tagline: string; url: string; company_type?: string; sub_type?: string; emoji?: string; badge_label?: string; badge_accent?: boolean; }
  const [adminResources, setAdminResources] = useState<AdminResource[]>([]);
  const [showAddResource, setShowAddResource] = useState(false);
  const [resourceSection, setResourceSection] = useState("recommended");
  const [resourceForm, setResourceForm] = useState({ section: "recommended", category: "", name: "", tagline: "", url: "", company_type: "service", sub_type: "", emoji: "", badge_label: "", badge_accent: false });
  const [eventForm, setEventForm] = useState({ title: "", location: "", date: "", description: "", is_active: true });
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [eventImagePreview, setEventImagePreview] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Resume Enhancer
  const [showResumeCreds, setShowResumeCreds] = useState(false);
  const [resumeCredsForm, setResumeCredsForm] = useState({ email: "upstride1@gmail.com", password: "Upstride" });
  const [resumeCredsLoading, setResumeCredsLoading] = useState(false);

  // Modals
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddManager, setShowAddManager] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddSalesperson, setShowAddSalesperson] = useState(false);
  const [showBulkContacts, setShowBulkContacts] = useState(false);
  const [showAllot, setShowAllot] = useState(false);
  const [resetTarget, setResetTarget] = useState<Student | null>(null);

  // Forms
  const [studentForm, setStudentForm] = useState({ emails: "", password: "" });
  const [managerForm, setManagerForm] = useState({ email: "", name: "", password: "" });
  const [projectForm, setProjectForm] = useState({ title: "", description: "", project_link: "", meeting_link: "", github_link: "", day: "", time: "", manager_id: "" });
  const [spForm, setSpForm] = useState({ email: "", name: "", password: "" });
  const [bulkContactsRaw, setBulkContactsRaw] = useState("");
  const [allotForm, setAllotForm] = useState({ salesperson_id: "", count: 10 });
  const [resetPwd, setResetPwd] = useState("");

  const loadStats = useCallback(async () => {
    try {
      const r = await api.admin.getStats() as { data: { stats: Stats } };
      setStats(r.data.stats);
    } catch { /* silent */ }
  }, []);

  const conversionRate = (stats: Stats) => {
    if (!stats.total_contacts) return 0;
    return Math.round((stats.contacts_joining / stats.total_contacts) * 100);
  };

  const loadStudents = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const r = await api.admin.listStudents(page, search) as { data: { students: Student[]; pagination: { total: number } } };
      setStudents(r.data.students);
      setStudentTotal(r.data.pagination.total);
      setStudentPage(page);
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  }, [search]);

  const loadManagers = useCallback(async () => {
    try {
      const r = await api.admin.listManagers() as { data: { managers: Manager[] } };
      setManagers(r.data.managers);
    } catch { /* silent */ }
  }, []);

  const loadProjects = useCallback(async () => {
    try {
      const r = await api.admin.listProjects() as { data: { projects: Project[] } };
      setProjects(r.data.projects);
    } catch { /* silent */ }
  }, []);

  const loadSalespersons = useCallback(async () => {
    try {
      const r = await api.admin.listSalespersons() as { data: { salespersons: Salesperson[] } };
      setSalespersons(r.data.salespersons);
    } catch { /* silent */ }
  }, []);

  const loadContacts = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const params = {
        status: contactFilter !== "all" ? contactFilter : undefined,
        assigned_to: contactSpFilter !== "all" ? contactSpFilter : undefined,
        search: contactSearch || undefined,
        date: contactDateFilter || undefined,
        page,
      };
      const r = await api.admin.listContacts(params) as { data: { contacts: Contact[]; total: number } };
      setContacts(r.data.contacts);
      setContactTotal(r.data.total);
      setContactPage(page);
      const cs = await api.admin.contactStats() as { data: { by_status: Record<string, number>; total: number; unassigned: number } };
      setContactStats({ ...cs.data.by_status, total: cs.data.total, unassigned: cs.data.unassigned });
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [contactFilter, contactSpFilter, contactSearch, contactDateFilter]);

  useEffect(() => { loadStats(); loadManagers(); loadSalespersons(); }, [loadStats, loadManagers, loadSalespersons]);
  useEffect(() => { if (tab === "students") loadStudents(); }, [tab, loadStudents]);
  useEffect(() => { if (tab === "projects") loadProjects(); }, [tab, loadProjects]);
  useEffect(() => { if (tab === "sales") { loadSalespersons(); loadContacts(); } }, [tab, loadSalespersons, loadContacts]);

  const loadAdminSessions = useCallback(async () => {
    try {
      const r = await api.adminExtra.getSessions() as { data: { sessions: SessionItem[] } };
      setAdminSessions(r.data.sessions);
    } catch { /* silent */ }
  }, []);

  const loadFeedback = useCallback(async () => {
    try {
      const r = await api.adminExtra.getFeedback(feedbackFilter !== "all" ? feedbackFilter : undefined) as { data: { feedback: FeedbackItem[] } };
      setFeedbackList(r.data.feedback);
    } catch { /* silent */ }
  }, [feedbackFilter]);

  useEffect(() => { if (tab === "sessions") loadAdminSessions(); }, [tab, loadAdminSessions]);
  useEffect(() => { if (tab === "feedback") loadFeedback(); }, [tab, feedbackFilter, loadFeedback]);

  const loadEvents = useCallback(async () => {
    try {
      const r = await api.events.adminList() as { data: { events: EventItem[] } };
      setEventsList(r.data.events);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { if (tab === "events") loadEvents(); }, [tab, loadEvents]);

  const loadAdminResources = useCallback(async () => {
    try {
      const r = await api.resources.adminList() as { data: { resources: AdminResource[] } };
      setAdminResources(r.data.resources);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { if (tab === "resources") loadAdminResources(); }, [tab, loadAdminResources]);

  const handleBulkSetResumeCreds = async () => {
    if (!resumeCredsForm.email.trim() || !resumeCredsForm.password.trim()) {
      toast({ title: "Email and password required", variant: "destructive" }); return;
    }
    setResumeCredsLoading(true);
    try {
      const r = await api.admin.bulkSetResumeEnhancer(resumeCredsForm.email.trim(), resumeCredsForm.password.trim()) as { data: { count: number } };
      toast({ title: `Resume Enhancer creds set for ${r.data.count} students` });
      setShowResumeCreds(false);
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally { setResumeCredsLoading(false); }
  };

  const handleAddStudent = async () => {
    const emails = studentForm.emails.split(/[\n,]+/).map(e => e.trim()).filter(Boolean);
    if (!emails.length) { toast({ title: "No emails entered", variant: "destructive" }); return; }
    if (studentForm.password.length < 8) { toast({ title: "Password too short", description: "Min 8 characters", variant: "destructive" }); return; }
    try {
      const r = await api.admin.bulkAddStudents(emails, studentForm.password) as { data: { added: string[]; skipped: string[] } };
      const { added, skipped } = r.data;
      toast({ title: `${added.length} student(s) added`, description: skipped.length ? `${skipped.length} already existed (skipped)` : undefined });
      setShowAddStudent(false);
      setStudentForm({ emails: "", password: "" });
      loadStudents(1); loadStats();
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const handleAddManager = async () => {
    try {
      await api.admin.addManager(managerForm);
      toast({ title: "Manager added" });
      setShowAddManager(false);
      setManagerForm({ email: "", name: "", password: "" });
      loadManagers(); loadStats();
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const handleAddProject = async () => {
    try {
      await api.admin.addProject(projectForm);
      toast({ title: "Project added" });
      setShowAddProject(false);
      setProjectForm({ title: "", description: "", project_link: "", meeting_link: "", github_link: "", day: "", time: "", manager_id: "" });
      loadProjects(); loadStats();
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const toggleStudent = async (s: Student) => {
    try {
      await api.admin.updateStudent(s.id, { is_active: !s.is_active });
      loadStudents(studentPage);
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const deleteStudent = async (id: string) => {
    if (!confirm("Remove this student?")) return;
    try { await api.admin.deleteStudent(id); loadStudents(studentPage); loadStats(); toast({ title: "Removed" }); }
    catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const deleteManager = async (id: string) => {
    if (!confirm("Remove this manager and all their projects?")) return;
    try { await api.admin.deleteManager(id); loadManagers(); loadStats(); toast({ title: "Removed" }); }
    catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Remove this project?")) return;
    try { await api.admin.deleteProject(id); loadProjects(); loadStats(); toast({ title: "Removed" }); }
    catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const handleResetPassword = async () => {
    if (!resetTarget) return;
    try {
      await api.admin.resetPassword(resetTarget.id, resetPwd);
      toast({ title: "Password reset" });
      setResetTarget(null); setResetPwd("");
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const handleAddSalesperson = async () => {
    try {
      await api.admin.addSalesperson(spForm);
      toast({ title: "Sales person added" });
      setShowAddSalesperson(false); setSpForm({ email: "", name: "", password: "" });
      loadSalespersons();
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const handleBulkContacts = async () => {
    if (!bulkContactsRaw.trim()) { toast({ title: "Nothing to add", variant: "destructive" }); return; }
    try {
      const r = await api.admin.bulkAddContacts(bulkContactsRaw) as { data: { added: number; skipped: string[] } };
      toast({ title: `${r.data.added} contact(s) added`, description: r.data.skipped.length ? `${r.data.skipped.length} lines skipped (missing phone)` : undefined });
      setShowBulkContacts(false); setBulkContactsRaw("");
      loadContacts(1);
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const handleDeleteContact = async (id: string) => {
    if (!confirm("Remove this contact?")) return;
    try { await api.admin.deleteContact(id); loadContacts(contactPage); toast({ title: "Contact removed" }); }
    catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const handleAllot = async () => {
    if (!allotForm.salesperson_id) { toast({ title: "Select a sales person", variant: "destructive" }); return; }
    if (allotForm.count < 1) { toast({ title: "Enter a valid count", variant: "destructive" }); return; }
    try {
      const r = await api.admin.allotContacts(allotForm.salesperson_id, allotForm.count) as { message: string };
      toast({ title: r.message });
      setShowAllot(false); loadContacts(1);
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const logout = () => {
    ["token", "userRole", "userEmail", "userName", "mustChangePassword"].forEach(k => localStorage.removeItem(k));
    navigate("/login");
  };

  const saveSession = async (sessionNumber: number) => {
    try {
      await api.adminExtra.updateSession(sessionNumber, sessionEdit);
      toast({ title: "Session updated" });
      setEditingSession(null);
      loadAdminSessions();
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const resolveFeedback = async (id: string) => {
    try {
      await api.adminExtra.resolveFeedback(id);
      loadFeedback();
      toast({ title: "Marked as resolved" });
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const handleCreateEvent = async () => {
    if (!eventForm.title || !eventForm.location || !eventForm.date) {
      toast({ title: "Title, location and date are required", variant: "destructive" }); return;
    }
    const fd = new FormData();
    fd.append("title", eventForm.title);
    fd.append("location", eventForm.location);
    fd.append("date", eventForm.date);
    fd.append("description", eventForm.description);
    fd.append("is_active", String(eventForm.is_active));
    if (eventImage) fd.append("image", eventImage);
    try {
      await api.events.create(fd);
      toast({ title: "Event created" });
      setShowAddEvent(false);
      setEventForm({ title: "", location: "", date: "", description: "", is_active: true });
      setEventImage(null); setEventImagePreview(null);
      loadEvents();
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const toggleEvent = async (ev: EventItem) => {
    const fd = new FormData();
    fd.append("is_active", String(!ev.is_active));
    try {
      await api.events.update(ev.id, fd);
      loadEvents();
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try { await api.events.delete(id); loadEvents(); toast({ title: "Event deleted" }); }
    catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const handleAddResource = async () => {
    if (!resourceForm.name || !resourceForm.tagline || !resourceForm.url) {
      toast({ title: "Name, tagline and URL are required", variant: "destructive" }); return;
    }
    const payload: Record<string, unknown> = {
      section: resourceForm.section,
      category: resourceForm.category || resourceForm.name,
      name: resourceForm.name,
      tagline: resourceForm.tagline,
      url: resourceForm.url,
    };
    if (resourceForm.section === "placement") {
      payload.company_type = resourceForm.company_type;
      if (resourceForm.company_type === "service" && resourceForm.sub_type) payload.sub_type = resourceForm.sub_type;
      if (resourceForm.emoji) payload.emoji = resourceForm.emoji;
    }
    if (resourceForm.badge_label) { payload.badge_label = resourceForm.badge_label; payload.badge_accent = resourceForm.badge_accent; }
    if (resourceForm.emoji && resourceForm.section !== "placement") payload.emoji = resourceForm.emoji;
    try {
      await api.resources.add(payload as Parameters<typeof api.resources.add>[0]);
      toast({ title: "Resource added" });
      setShowAddResource(false);
      setResourceForm({ section: "recommended", category: "", name: "", tagline: "", url: "", company_type: "service", sub_type: "", emoji: "", badge_label: "", badge_accent: false });
      loadAdminResources();
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const handleDeleteResource = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await api.resources.delete(id); loadAdminResources(); toast({ title: "Deleted" }); }
    catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEventImage(file);
    const reader = new FileReader();
    reader.onload = ev => setEventImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "students", label: "Students", icon: <Users size={15} /> },
    { key: "managers", label: "Project Managers", icon: <UserCog size={15} /> },
    { key: "projects", label: "Projects", icon: <FolderKanban size={15} /> },
    { key: "sales", label: "Sales", icon: <PhoneCall size={15} /> },
    { key: "sessions", label: "Sessions", icon: <PlayCircle size={15} /> },
    { key: "feedback", label: "Feedback", icon: <MessageSquare size={15} /> },
    { key: "events", label: "Events", icon: <CalendarDays size={15} /> },
    { key: "resources", label: "Resources", icon: <BookOpen size={15} /> },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, ...MONO }}>
      {/* Header */}
      <div style={{ backgroundColor: B, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px", borderBottom: `3px solid ${Y}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ backgroundColor: Y, color: B, padding: "4px 10px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em" }}>UPSTRIDE</div>
          <span style={{ color: W, fontSize: "13px", fontWeight: 600 }}>Admin Dashboard</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: `${W}80`, fontSize: "12px" }}>{localStorage.getItem("userEmail")}</span>
          <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "transparent", border: `1px solid ${W}40`, borderRadius: "6px", padding: "6px 12px", color: W, fontSize: "12px", cursor: "pointer", ...MONO }}>
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>
        {/* ── Dashboard Overview ─────────────────────────────────── */}
        {stats && (
          <div style={{ marginBottom: "32px" }}>

            {/* Row 1: Students + Projects */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>

              {/* Students block */}
              <div style={{ backgroundColor: B, border: `2px solid ${B}`, borderRadius: "12px", padding: "24px", boxShadow: `4px 4px 0 ${Y}` }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: Y, letterSpacing: "0.15em", marginBottom: "16px" }}>STUDENTS</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                  {[
                    { label: "Total", value: stats.total_students, color: W },
                    { label: "Active", value: stats.active_students, color: GREEN },
                    { label: "Pending Pwd", value: stats.pending_password_change, color: "#F59E0B" },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "32px", fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
                      <div style={{ fontSize: "10px", color: `${W}60`, marginTop: "4px", letterSpacing: "0.08em" }}>{label.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects block */}
              <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", padding: "24px", boxShadow: `4px 4px 0 ${B}20` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: MUTE, letterSpacing: "0.15em" }}>PROJECTS</div>
                  <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", backgroundColor: "#DCFCE7", color: GREEN }}>2-MONTH CYCLE</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                  {[
                    { label: "Total", value: stats.total_projects, color: B },
                    { label: "🟢 Live", value: stats.live_projects, color: GREEN },
                    { label: "✅ Done", value: stats.completed_projects, color: MUTE },
                  ].map(({ label, value, color }) => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "32px", fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
                      <div style={{ fontSize: "10px", color: MUTE, marginTop: "4px", letterSpacing: "0.08em" }}>{label.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Conversion Funnel */}
            <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", padding: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: MUTE, letterSpacing: "0.15em" }}>SALES CONVERSION FUNNEL</div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: MUTE }}>Total Contacts: <strong style={{ color: B }}>{stats.total_contacts}</strong></span>
                  <span style={{ fontSize: "13px", fontWeight: 700, padding: "4px 12px", borderRadius: "6px", backgroundColor: stats.contacts_joining > 0 ? "#DCFCE7" : "#F3F4F6", color: stats.contacts_joining > 0 ? GREEN : MUTE }}>
                    {conversionRate(stats)}% conversion
                  </span>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px" }}>
                {[
                  { label: "Pending",      value: stats.contacts_pending,      color: MUTE,      bg: "#F3F4F6", icon: "⏳" },
                  { label: "Picked Call",  value: stats.contacts_picked,       color: "#16A34A", bg: "#DCFCE7", icon: "📞" },
                  { label: "Missed",       value: stats.contacts_missed,       color: "#D97706", bg: "#FEF3C7", icon: "📵" },
                  { label: "Will Discuss", value: stats.contacts_will_discuss, color: "#0369A1", bg: "#E0F2FE", icon: "💬" },
                  { label: "Rejected",     value: stats.contacts_rejected,     color: RED,       bg: "#FEE2E2", icon: "❌" },
                  { label: "Joining",      value: stats.contacts_joining,      color: "#7C3AED", bg: "#EDE9FE", icon: "🎉" },
                ].map(({ label, value, color, bg, icon }) => {
                  const pct = stats.total_contacts ? Math.round((value / stats.total_contacts) * 100) : 0;
                  return (
                    <div key={label} style={{ backgroundColor: bg, borderRadius: "10px", padding: "16px 12px", textAlign: "center" }}>
                      <div style={{ fontSize: "20px", marginBottom: "4px" }}>{icon}</div>
                      <div style={{ fontSize: "26px", fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
                      <div style={{ fontSize: "9px", fontWeight: 700, color, letterSpacing: "0.1em", marginTop: "4px" }}>{label.toUpperCase()}</div>
                      <div style={{ fontSize: "11px", color, marginTop: "4px", opacity: 0.7 }}>{pct}%</div>
                    </div>
                  );
                })}
              </div>

              {/* Funnel bar */}
              {stats.total_contacts > 0 && (
                <div style={{ marginTop: "16px" }}>
                  <div style={{ height: "8px", borderRadius: "4px", backgroundColor: "#F3F4F6", overflow: "hidden", display: "flex" }}>
                    {[
                      { value: stats.contacts_picked,       color: "#16A34A" },
                      { value: stats.contacts_will_discuss, color: "#0369A1" },
                      { value: stats.contacts_joining,      color: "#7C3AED" },
                      { value: stats.contacts_missed,       color: "#D97706" },
                      { value: stats.contacts_rejected,     color: RED },
                      { value: stats.contacts_pending,      color: "#D1D5DB" },
                    ].map(({ value, color }, i) => (
                      <div key={i} style={{ width: `${(value / stats.total_contacts) * 100}%`, backgroundColor: color, transition: "width 0.6s ease" }} />
                    ))}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                    <span style={{ fontSize: "10px", color: MUTE }}>Unassigned: <strong>{stats.unassigned_contacts}</strong></span>
                    <span style={{ fontSize: "10px", color: "#7C3AED", fontWeight: 700 }}>Joining: {stats.contacts_joining} ({conversionRate(stats)}%)</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", borderBottom: `2px solid ${BORD}`, marginBottom: "24px" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 20px", border: "none", background: tab === t.key ? B : "transparent", color: tab === t.key ? Y : MUTE, fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", cursor: "pointer", borderRadius: "6px 6px 0 0", ...MONO }}>
              {t.icon} {t.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Students Tab */}
        {tab === "students" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
              <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && loadStudents(1)}
                style={{ padding: "8px 14px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", minWidth: "260px" }} />
              <div style={{ display: "flex", gap: "8px" }}>
                <Btn onClick={() => loadStudents(1)} small><RefreshCw size={12} style={{ display: "inline", marginRight: "4px" }} />Refresh</Btn>
                <Btn onClick={() => setShowResumeCreds(true)} small style={{ background: "#7C3AED", color: W }}>🔑 Resume Tool Creds</Btn>
                <Btn onClick={() => setShowAddStudent(true)} small><Plus size={12} style={{ display: "inline", marginRight: "4px" }} />Add Student</Btn>
              </div>
            </div>

            {loading ? <p style={{ color: MUTE, fontSize: "13px" }}>Loading...</p> : (
              <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "10px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: `${B}08`, borderBottom: `2px solid ${BORD}` }}>
                      {["Name", "Email", "Status", "Password", "Actions"].map(h => (
                        <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", fontWeight: 700, color: MUTE, letterSpacing: "0.12em" }}>{h.toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={s.id} style={{ borderBottom: i < students.length - 1 ? `1px solid ${BORD}` : "none" }}>
                        <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: B }}>{s.name}</td>
                        <td style={{ padding: "12px 16px", fontSize: "12px", color: MUTE }}>{s.email}</td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", backgroundColor: s.is_active ? `${GREEN}20` : `${RED}20`, color: s.is_active ? GREEN : RED }}>
                            {s.is_active ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", backgroundColor: s.must_change_password ? "#FEF3C7" : "#F0FDF4", color: s.must_change_password ? "#D97706" : GREEN }}>
                            {s.must_change_password ? "MUST CHANGE" : "SET"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button onClick={() => toggleStudent(s)} title={s.is_active ? "Deactivate" : "Activate"}
                              style={{ background: "none", border: "none", cursor: "pointer", color: s.is_active ? GREEN : MUTE }}>
                              {s.is_active ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                            </button>
                            <button onClick={() => setResetTarget(s)} title="Reset password"
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#6366F1" }}>
                              <RefreshCw size={15} />
                            </button>
                            <button onClick={() => deleteStudent(s.id)} title="Remove"
                              style={{ background: "none", border: "none", cursor: "pointer", color: RED }}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr><td colSpan={5} style={{ padding: "32px", textAlign: "center", color: MUTE, fontSize: "13px" }}>No students found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {studentTotal > 0 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: MUTE }}>
                  Showing {Math.min((studentPage - 1) * 20 + 1, studentTotal)}–{Math.min(studentPage * 20, studentTotal)} of <strong style={{ color: B }}>{studentTotal}</strong> students
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    disabled={studentPage === 1}
                    onClick={() => loadStudents(studentPage - 1)}
                    style={{ padding: "6px 14px", border: `2px solid ${studentPage === 1 ? BORD : B}`, borderRadius: "6px", background: studentPage === 1 ? BG : B, color: studentPage === 1 ? MUTE : Y, fontSize: "11px", fontWeight: 700, cursor: studentPage === 1 ? "not-allowed" : "pointer", ...MONO }}>
                    ← Prev
                  </button>
                  <span style={{ fontSize: "12px", color: B, fontWeight: 700, padding: "0 8px" }}>
                    Page {studentPage} of {Math.ceil(studentTotal / 20)}
                  </span>
                  <button
                    disabled={studentPage * 20 >= studentTotal}
                    onClick={() => loadStudents(studentPage + 1)}
                    style={{ padding: "6px 14px", border: `2px solid ${studentPage * 20 >= studentTotal ? BORD : B}`, borderRadius: "6px", background: studentPage * 20 >= studentTotal ? BG : B, color: studentPage * 20 >= studentTotal ? MUTE : Y, fontSize: "11px", fontWeight: 700, cursor: studentPage * 20 >= studentTotal ? "not-allowed" : "pointer", ...MONO }}>
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Managers Tab */}
        {tab === "managers" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
              <Btn onClick={() => setShowAddManager(true)} small><Plus size={12} style={{ display: "inline", marginRight: "4px" }} />Add Manager</Btn>
            </div>
            <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "10px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: `${B}08`, borderBottom: `2px solid ${BORD}` }}>
                    {["Name", "Email", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "10px", fontWeight: 700, color: MUTE, letterSpacing: "0.12em" }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {managers.map((m, i) => (
                    <tr key={m.id} style={{ borderBottom: i < managers.length - 1 ? `1px solid ${BORD}` : "none" }}>
                      <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: 600, color: B }}>{m.name}</td>
                      <td style={{ padding: "12px 16px", fontSize: "12px", color: MUTE }}>{m.email}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", backgroundColor: m.is_active ? `${GREEN}20` : `${RED}20`, color: m.is_active ? GREEN : RED }}>
                          {m.is_active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <button onClick={() => deleteManager(m.id)} style={{ background: "none", border: "none", cursor: "pointer", color: RED }}><Trash2 size={15} /></button>
                      </td>
                    </tr>
                  ))}
                  {managers.length === 0 && (
                    <tr><td colSpan={4} style={{ padding: "32px", textAlign: "center", color: MUTE, fontSize: "13px" }}>No managers added yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {tab === "projects" && (
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
              <Btn onClick={() => setShowAddProject(true)} small><Plus size={12} style={{ display: "inline", marginRight: "4px" }} />Add Project</Btn>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {projects.map(p => (
                <div key={p.id} style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "10px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: B, marginBottom: "4px" }}>{p.title}</div>
                    <div style={{ fontSize: "12px", color: MUTE, marginBottom: "6px" }}>Manager: <strong style={{ color: B }}>{p.manager_name}</strong></div>
                    {(p.day || p.time) && (
                      <div style={{ display: "flex", gap: "12px", marginBottom: "6px" }}>
                        {p.day && <span style={{ fontSize: "11px", fontWeight: 700, backgroundColor: Y, color: B, padding: "2px 8px", border: `1px solid ${B}`, borderRadius: "4px" }}>📅 {p.day}</span>}
                        {p.time && <span style={{ fontSize: "11px", fontWeight: 700, backgroundColor: `${B}10`, color: B, padding: "2px 8px", border: `1px solid ${BORD}`, borderRadius: "4px" }}>🕐 {p.time}</span>}
                      </div>
                    )}
                    {p.description && <div style={{ fontSize: "12px", color: MUTE, marginBottom: "8px" }}>{p.description}</div>}
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      {p.project_link && <a href={p.project_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "#6366F1", fontWeight: 700 }}>Project Link ↗</a>}
                      {p.meeting_link && <a href={p.meeting_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "#0EA5E9", fontWeight: 700 }}>Meeting Link ↗</a>}
                      {p.github_link && <a href={p.github_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "#111827", fontWeight: 700 }}>GitHub ↗</a>}
                    </div>
                  </div>
                  <button onClick={() => deleteProject(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: RED, flexShrink: 0 }}><Trash2 size={16} /></button>
                </div>
              ))}
              {projects.length === 0 && <p style={{ textAlign: "center", color: MUTE, fontSize: "13px", padding: "32px" }}>No projects added yet</p>}
            </div>
          </div>
        )}

        {/* ── Sessions Tab ──────────────────────────────────────────── */}
        {tab === "sessions" && (
          <div>
            <p style={{ fontSize: "12px", color: MUTE, marginBottom: "16px" }}>
              Paste Google Drive links for each session. Students unlock 2 sessions per week automatically based on their enrollment date.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {adminSessions.map(s => (
                <div key={s.session_number} style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "10px", padding: "16px 20px" }}>
                  {editingSession === s.session_number ? (
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: B, marginBottom: "12px" }}>
                        Session {s.session_number} — {s.title}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <input placeholder="Google Drive link (https://drive.google.com/...)" value={sessionEdit.drive_link}
                          onChange={e => setSessionEdit(f => ({ ...f, drive_link: e.target.value }))}
                          style={{ width: "100%", padding: "9px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", boxSizing: "border-box" as const }} />
                        <input placeholder="Short description (optional)" value={sessionEdit.description}
                          onChange={e => setSessionEdit(f => ({ ...f, description: e.target.value }))}
                          style={{ width: "100%", padding: "9px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", boxSizing: "border-box" as const }} />
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Btn onClick={() => saveSession(s.session_number)} small><Save size={12} style={{ display: "inline", marginRight: "4px" }} />Save</Btn>
                          <Btn onClick={() => setEditingSession(null)} color={MUTE} small>Cancel</Btn>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "6px", backgroundColor: s.drive_link ? B : `${B}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {s.drive_link ? <PlayCircle size={16} color={Y} /> : <Lock size={14} color={MUTE} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "11px", color: MUTE, letterSpacing: "0.08em" }}>SESSION {s.session_number} · WEEK {s.week}</div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: B }}>{s.title}</div>
                        {s.drive_link && <div style={{ fontSize: "11px", color: "#16A34A", marginTop: "2px" }}>✓ Link added</div>}
                        {!s.drive_link && <div style={{ fontSize: "11px", color: MUTE, marginTop: "2px" }}>No link yet</div>}
                      </div>
                      <Btn onClick={() => { setEditingSession(s.session_number); setSessionEdit({ drive_link: s.drive_link, description: s.description }); }} small>Edit Link</Btn>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Feedback Tab ──────────────────────────────────────────── */}
        {tab === "feedback" && (
          <div>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
              {["open", "resolved", "all"].map(f => (
                <button key={f} onClick={() => setFeedbackFilter(f)}
                  style={{ padding: "6px 14px", borderRadius: "20px", border: `2px solid ${feedbackFilter === f ? B : BORD}`, backgroundColor: feedbackFilter === f ? B : W, color: feedbackFilter === f ? Y : MUTE, fontSize: "11px", fontWeight: 700, cursor: "pointer", ...MONO }}>
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {feedbackList.map(fb => (
                <div key={fb.id} style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "10px", padding: "16px 20px", display: "flex", gap: "14px", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", backgroundColor: fb.type === "resource_request" ? "#EDE9FE" : fb.type === "bug" ? "#FEE2E2" : "#E0F2FE", color: fb.type === "resource_request" ? "#7C3AED" : fb.type === "bug" ? "#DC2626" : "#0369A1" }}>
                        {fb.type.replace("_", " ").toUpperCase()}
                      </span>
                      <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", backgroundColor: fb.status === "open" ? "#FEF3C7" : "#DCFCE7", color: fb.status === "open" ? "#D97706" : "#16A34A" }}>
                        {fb.status.toUpperCase()}
                      </span>
                      <span style={{ fontSize: "11px", color: MUTE }}>{fb.student_email}</span>
                    </div>
                    {fb.resource_name && <div style={{ fontSize: "12px", fontWeight: 600, color: B, marginBottom: "4px" }}>Resource: {fb.resource_name}</div>}
                    <div style={{ fontSize: "13px", color: B }}>{fb.message}</div>
                  </div>
                  {fb.status === "open" && (
                    <button onClick={() => resolveFeedback(fb.id)}
                      style={{ padding: "6px 12px", backgroundColor: "#16A34A", color: W, border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 700, cursor: "pointer", ...MONO, flexShrink: 0 }}>
                      Resolve
                    </button>
                  )}
                </div>
              ))}
              {feedbackList.length === 0 && (
                <p style={{ textAlign: "center", color: MUTE, padding: "40px", fontSize: "13px" }}>No {feedbackFilter} feedback</p>
              )}
            </div>
          </div>
        )}

        {/* ── Events Tab ────────────────────────────────────────── */}
        {tab === "events" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <p style={{ fontSize: "12px", color: MUTE }}>Events appear automatically on the homepage. Toggle to show/hide.</p>
              <Btn onClick={() => setShowAddEvent(true)} small><Plus size={12} style={{ display: "inline", marginRight: "4px" }} />Add Event</Btn>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
              {eventsList.map(ev => (
                <div key={ev.id} style={{ backgroundColor: W, border: `2px solid ${ev.is_active ? B : BORD}`, borderRadius: "12px", overflow: "hidden", boxShadow: ev.is_active ? `4px 4px 0 ${Y}` : "none" }}>
                  {ev.image_data ? (
                    <img src={`data:${ev.image_type};base64,${ev.image_data}`} alt={ev.title}
                      style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ width: "100%", height: "160px", backgroundColor: `${B}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <ImagePlus size={32} color={BORD} />
                    </div>
                  )}
                  <div style={{ padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: B }}>{ev.title}</div>
                        <div style={{ fontSize: "12px", color: MUTE, marginTop: "2px" }}>📍 {ev.location}</div>
                        <div style={{ fontSize: "12px", color: MUTE }}>📅 {new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
                      </div>
                      <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", backgroundColor: ev.is_active ? "#DCFCE7" : "#F3F4F6", color: ev.is_active ? "#16A34A" : MUTE, whiteSpace: "nowrap" }}>
                        {ev.is_active ? "LIVE" : "HIDDEN"}
                      </span>
                    </div>
                    {ev.description && <p style={{ fontSize: "12px", color: MUTE, marginBottom: "12px", lineHeight: 1.5 }}>{ev.description}</p>}
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => toggleEvent(ev)}
                        style={{ flex: 1, padding: "7px", border: `2px solid ${BORD}`, borderRadius: "6px", background: W, fontSize: "11px", fontWeight: 700, cursor: "pointer", color: ev.is_active ? "#D97706" : "#16A34A", ...MONO }}>
                        {ev.is_active ? "Hide" : "Show"}
                      </button>
                      <button onClick={() => deleteEvent(ev.id)}
                        style={{ padding: "7px 10px", border: `2px solid ${RED}20`, borderRadius: "6px", background: W, cursor: "pointer", color: RED, display: "flex", alignItems: "center" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {eventsList.length === 0 && (
                <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px", color: MUTE, fontSize: "13px", backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "10px" }}>
                  <CalendarDays size={36} color={BORD} style={{ margin: "0 auto 12px", display: "block" }} />
                  No events yet. Add your first upcoming event.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Sales Tab ─────────────────────────────────────────── */}
        {tab === "sales" && (
          <div>
            {/* Sales persons section */}
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 style={{ fontSize: "13px", fontWeight: 700, color: B, letterSpacing: "0.08em" }}>SALES PERSONS</h3>
                <Btn onClick={() => setShowAddSalesperson(true)} small><Plus size={12} style={{ display: "inline", marginRight: "4px" }} />Add Sales Person</Btn>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {salespersons.map(sp => (
                  <div key={sp.id} style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "8px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px", boxShadow: `2px 2px 0 ${Y}` }}>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: B }}>{sp.name}</div>
                      <div style={{ fontSize: "11px", color: MUTE }}>{sp.email}</div>
                    </div>
                    <button onClick={async () => { if (!confirm("Remove?")) return; await api.admin.deleteSalesperson(sp.id); loadSalespersons(); }} style={{ background: "none", border: "none", cursor: "pointer", color: RED }}><Trash2 size={14} /></button>
                  </div>
                ))}
                {salespersons.length === 0 && <p style={{ fontSize: "13px", color: MUTE }}>No sales persons yet.</p>}
              </div>
            </div>

            {/* Contact stats */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
              {[
                { label: "Total", value: contactStats.total || 0, color: B },
                { label: "Unassigned", value: contactStats.unassigned || 0, color: "#D97706" },
                { label: "Picked", value: contactStats.picked || 0, color: "#16A34A" },
                { label: "Rejected", value: contactStats.rejected || 0, color: "#DC2626" },
                { label: "Missed", value: contactStats.missed || 0, color: "#F59E0B" },
                { label: "Joining", value: contactStats.joining || 0, color: "#7C3AED" },
                { label: "Will Discuss", value: contactStats.will_discuss || 0, color: "#0369A1" },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "8px", padding: "10px 16px", minWidth: "90px", textAlign: "center" }}>
                  <div style={{ fontSize: "20px", fontWeight: 700, color }}>{value}</div>
                  <div style={{ fontSize: "10px", color: MUTE, letterSpacing: "0.08em" }}>{label.toUpperCase()}</div>
                </div>
              ))}
            </div>

            {/* Date filter */}
            {(() => {
              const today = toDateStr(new Date());
              const yesterday = toDateStr(new Date(Date.now() - 86400000));
              return (
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: MUTE, letterSpacing: "0.1em", marginRight: "4px" }}>DATE:</span>
                  {[
                    { label: "📅 Today", value: today },
                    { label: "Yesterday", value: yesterday },
                    { label: "All Time", value: "" },
                  ].map(({ label, value }) => (
                    <button key={label} onClick={() => setContactDateFilter(value)}
                      style={{ padding: "5px 12px", borderRadius: "20px", border: `2px solid ${contactDateFilter === value ? B : BORD}`, backgroundColor: contactDateFilter === value ? B : W, color: contactDateFilter === value ? Y : MUTE, fontSize: "11px", fontWeight: 700, cursor: "pointer", ...MONO }}>
                      {label}
                    </button>
                  ))}
                  <input type="date" value={contactDateFilter}
                    onChange={e => setContactDateFilter(e.target.value)}
                    max={today}
                    style={{ padding: "5px 10px", border: `2px solid ${contactDateFilter && contactDateFilter !== today && contactDateFilter !== yesterday ? B : BORD}`, borderRadius: "6px", fontSize: "12px", ...MONO, outline: "none", cursor: "pointer" }} />
                </div>
              );
            })()}

            {/* Contacts toolbar */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px", alignItems: "center" }}>
              <input placeholder="Search name, phone..." value={contactSearch} onChange={e => setContactSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && loadContacts(1)}
                style={{ padding: "8px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", minWidth: "200px" }} />
              <select value={contactFilter} onChange={e => setContactFilter(e.target.value)}
                style={{ padding: "8px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "12px", ...MONO, outline: "none" }}>
                <option value="all">All Statuses</option>
                {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <select value={contactSpFilter} onChange={e => setContactSpFilter(e.target.value)}
                style={{ padding: "8px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "12px", ...MONO, outline: "none" }}>
                <option value="all">All Sales Persons</option>
                <option value="unassigned">Unassigned</option>
                {salespersons.map(sp => <option key={sp.id} value={sp.id}>{sp.name}</option>)}
              </select>
              <Btn onClick={() => loadContacts(1)} small><RefreshCw size={12} style={{ display: "inline", marginRight: "4px" }} />Refresh</Btn>
              <Btn onClick={() => setShowBulkContacts(true)} small><Plus size={12} style={{ display: "inline", marginRight: "4px" }} />Import Contacts</Btn>
              <Btn onClick={() => setShowAllot(true)} small><PhoneCall size={12} style={{ display: "inline", marginRight: "4px" }} />Allot Contacts</Btn>
            </div>

            {/* Contacts grouped by import date (created_at) */}
            {(() => {
              const formatAdminDay = (iso: string) => {
                try {
                  const d = new Date(iso);
                  const today = new Date();
                  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
                  if (d.toDateString() === today.toDateString()) return "Today";
                  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
                  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
                } catch { return iso; }
              };
              const grouped = (() => {
                const map: Record<string, Contact[]> = {};
                for (const c of contacts) {
                  const key = c.created_at
                    ? new Date(c.created_at).toDateString()
                    : "Unknown";
                  if (!map[key]) map[key] = [];
                  map[key].push(c);
                }
                return Object.entries(map)
                  .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());
              })();

              if (contacts.length === 0 && !loading) return (
                <div style={{ textAlign: "center", padding: "32px", color: MUTE, fontSize: "13px", backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "10px" }}>
                  No contacts found. Import contacts to get started.
                </div>
              );

              return grouped.map(([dateKey, dayContacts]) => {
                const byCfg = Object.entries(STATUS_CONFIG).reduce((acc, [k, v]) => {
                  const n = dayContacts.filter(c => c.status === k as ContactStatus).length;
                  if (n > 0) acc.push({ key: k, label: v.label, color: v.color, bg: v.bg, n });
                  return acc;
                }, [] as { key: string; label: string; color: string; bg: string; n: number }[]);

                return (
                  <div key={dateKey} style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", backgroundColor: B, borderRadius: "8px 8px 0 0", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: Y }}>📅 {formatAdminDay(dateKey)}</span>
                      <span style={{ fontSize: "11px", color: `${W}70` }}>{dayContacts.length} contacts</span>
                      <div style={{ display: "flex", gap: "6px", marginLeft: "auto", flexWrap: "wrap" }}>
                        {byCfg.map(({ key, label, color, bg, n }) => (
                          <span key={key} style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", backgroundColor: bg, color }}>{label}: {n}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ backgroundColor: `${B}06`, borderBottom: `1px solid ${BORD}` }}>
                            {["#", "Name", "Phone", "Email", "Assigned To", "Status", "Notes", ""].map(h => (
                              <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: "10px", fontWeight: 700, color: MUTE, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {dayContacts.map((c, i) => {
                            const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.pending;
                            return (
                              <tr key={c.id} style={{ borderBottom: `1px solid ${BORD}`, backgroundColor: i % 2 === 0 ? W : `${B}02` }}>
                                <td style={{ padding: "9px 14px", fontSize: "11px", color: MUTE }}>{i + 1}</td>
                                <td style={{ padding: "9px 14px", fontSize: "13px", fontWeight: 600, color: B }}>{c.name}</td>
                                <td style={{ padding: "9px 14px", fontSize: "12px", color: B }}>{c.phone}</td>
                                <td style={{ padding: "9px 14px", fontSize: "11px", color: MUTE }}>{c.email || "—"}</td>
                                <td style={{ padding: "9px 14px", fontSize: "12px", color: c.assigned_to_name ? B : MUTE }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                    {c.assigned_to_name || <em>Unassigned</em>}
                                    {c.source === "salesperson" && (
                                      <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "8px", backgroundColor: "#E0F2FE", color: "#0369A1", letterSpacing: "0.06em" }}>SP ADDED</span>
                                    )}
                                  </div>
                                </td>
                                <td style={{ padding: "9px 14px" }}>
                                  <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "10px", backgroundColor: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                                </td>
                                <td style={{ padding: "9px 14px", fontSize: "11px", color: MUTE, maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.notes || "—"}</td>
                                <td style={{ padding: "9px 14px" }}>
                                  <button onClick={() => handleDeleteContact(c.id)} title="Remove contact" style={{ background: "none", border: "none", cursor: "pointer", color: RED }}>
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              });
            })()}
            {/* Contact pagination */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px", flexWrap: "wrap", gap: "8px" }}>
              <span style={{ fontSize: "12px", color: MUTE }}>
                Showing {Math.min((contactPage - 1) * 50 + 1, contactTotal || 0)}–{Math.min(contactPage * 50, contactTotal)} of <strong style={{ color: B }}>{contactTotal}</strong> contacts
              </span>
              {contactTotal > 50 && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    disabled={contactPage === 1}
                    onClick={() => loadContacts(contactPage - 1)}
                    style={{ padding: "6px 14px", border: `2px solid ${contactPage === 1 ? BORD : B}`, borderRadius: "6px", background: contactPage === 1 ? BG : B, color: contactPage === 1 ? MUTE : Y, fontSize: "11px", fontWeight: 700, cursor: contactPage === 1 ? "not-allowed" : "pointer", ...MONO }}>
                    ← Prev
                  </button>
                  <span style={{ fontSize: "12px", color: B, fontWeight: 700, padding: "0 8px" }}>
                    Page {contactPage} of {Math.ceil(contactTotal / 50)}
                  </span>
                  <button
                    disabled={contactPage * 50 >= contactTotal}
                    onClick={() => loadContacts(contactPage + 1)}
                    style={{ padding: "6px 14px", border: `2px solid ${contactPage * 50 >= contactTotal ? BORD : B}`, borderRadius: "6px", background: contactPage * 50 >= contactTotal ? BG : B, color: contactPage * 50 >= contactTotal ? MUTE : Y, fontSize: "11px", fontWeight: 700, cursor: contactPage * 50 >= contactTotal ? "not-allowed" : "pointer", ...MONO }}>
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Resources Tab ─────────────────────────────────────── */}
        {tab === "resources" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ display: "flex", gap: "6px" }}>
                {["all", "recommended", "training", "placement"].map(s => (
                  <button key={s} onClick={() => setResourceSection(s)}
                    style={{ padding: "6px 14px", borderRadius: "20px", border: `2px solid ${resourceSection === s ? B : BORD}`, backgroundColor: resourceSection === s ? B : W, color: resourceSection === s ? Y : MUTE, fontSize: "11px", fontWeight: 700, cursor: "pointer", ...MONO }}>
                    {s === "all" ? "ALL" : s.toUpperCase()}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <Btn onClick={loadAdminResources} small><RefreshCw size={12} style={{ display: "inline", marginRight: "4px" }} />Refresh</Btn>
                <Btn onClick={() => setShowAddResource(true)} small><Plus size={12} style={{ display: "inline", marginRight: "4px" }} />Add Resource</Btn>
              </div>
            </div>

            <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "10px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: `${B}08`, borderBottom: `2px solid ${BORD}` }}>
                    {["Section", "Category", "Name", "Tagline", "Sub-type / Company Type", "Actions"].map(h => (
                      <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "10px", fontWeight: 700, color: MUTE, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {adminResources
                    .filter(r => resourceSection === "all" || r.section === resourceSection)
                    .map((r, i, arr) => (
                      <tr key={r.id} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${BORD}` : "none" }}>
                        <td style={{ padding: "10px 14px" }}>
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px",
                            backgroundColor: r.section === "recommended" ? Y : r.section === "training" ? "#E0F2FE" : "#EDE9FE",
                            color: r.section === "recommended" ? B : r.section === "training" ? "#0369A1" : "#7C3AED" }}>
                            {r.section.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: "10px 14px", fontSize: "12px", color: MUTE }}>{r.category}</td>
                        <td style={{ padding: "10px 14px", fontSize: "13px", fontWeight: 600, color: B }}>
                          {r.emoji && <span style={{ marginRight: "6px" }}>{r.emoji}</span>}
                          {r.name}
                        </td>
                        <td style={{ padding: "10px 14px", fontSize: "11px", color: MUTE, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.tagline}</td>
                        <td style={{ padding: "10px 14px", fontSize: "11px", color: MUTE }}>
                          {r.sub_type || r.company_type || "—"}
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "#6366F1", fontWeight: 700 }}>Open ↗</a>
                            <button onClick={() => handleDeleteResource(r.id, r.name)} style={{ background: "none", border: "none", cursor: "pointer", color: RED }}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {adminResources.filter(r => resourceSection === "all" || r.section === resourceSection).length === 0 && (
                    <tr><td colSpan={6} style={{ padding: "32px", textAlign: "center", color: MUTE, fontSize: "13px" }}>No resources in this section</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: "11px", color: MUTE, marginTop: "8px" }}>
              Total: {adminResources.length} resources
            </p>
          </div>
        )}
      </div>

      {/* Resume Enhancer Credentials Modal */}
      {showResumeCreds && (
        <Modal title="Set Resume Enhancer Credentials" onClose={() => setShowResumeCreds(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.7, margin: 0 }}>
              Set the login credentials that students will see in their portal under <strong>Resume AI</strong>. This will apply to <strong>all existing students</strong>.
            </p>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: MUTE, letterSpacing: "0.08em", display: "block", marginBottom: "5px" }}>RESUME TOOL EMAIL</label>
              <input
                type="email"
                value={resumeCredsForm.email}
                onChange={e => setResumeCredsForm(f => ({ ...f, email: e.target.value }))}
                style={{ width: "100%", padding: "9px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", boxSizing: "border-box" as const }}
              />
            </div>
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: MUTE, letterSpacing: "0.08em", display: "block", marginBottom: "5px" }}>RESUME TOOL PASSWORD</label>
              <input
                type="text"
                value={resumeCredsForm.password}
                onChange={e => setResumeCredsForm(f => ({ ...f, password: e.target.value }))}
                style={{ width: "100%", padding: "9px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", boxSizing: "border-box" as const }}
              />
            </div>
            <Btn onClick={handleBulkSetResumeCreds} disabled={resumeCredsLoading} style={{ background: "#7C3AED" }}>
              {resumeCredsLoading ? "Setting..." : "Apply to All Students"}
            </Btn>
          </div>
        </Modal>
      )}

      {/* Add Student Modal */}
      {showAddStudent && (
        <Modal title="Add Students" onClose={() => setShowAddStudent(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>EMAIL ADDRESSES</label>
              <textarea
                placeholder={"student1@gmail.com\nstudent2@gmail.com\nstudent3@gmail.com"}
                value={studentForm.emails}
                onChange={e => setStudentForm(f => ({ ...f, emails: e.target.value }))}
                rows={6}
                style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", resize: "vertical", boxSizing: "border-box" as const }}
              />
              <p style={{ fontSize: "11px", color: MUTE, marginTop: "4px" }}>One email per line, or comma-separated. Email is used as the student name.</p>
            </div>
            <Input label="SHARED PASSWORD" type="text" placeholder="Min 8 characters — same for all" value={studentForm.password} onChange={e => setStudentForm(f => ({ ...f, password: e.target.value }))} />
            <p style={{ fontSize: "11px", color: MUTE }}>Each student must change this password on first login.</p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Btn onClick={() => setShowAddStudent(false)} color={MUTE} small>Cancel</Btn>
              <Btn onClick={handleAddStudent} small>Add Students</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Manager Modal */}
      {showAddManager && (
        <Modal title="Add Project Manager" onClose={() => setShowAddManager(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Input label="FULL NAME" type="text" placeholder="Manager full name" value={managerForm.name} onChange={e => setManagerForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="EMAIL ADDRESS" type="email" placeholder="manager@example.com" value={managerForm.email} onChange={e => setManagerForm(f => ({ ...f, email: e.target.value }))} />
            <Input label="PASSWORD" type="text" placeholder="Min 8 characters" value={managerForm.password} onChange={e => setManagerForm(f => ({ ...f, password: e.target.value }))} />
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Btn onClick={() => setShowAddManager(false)} color={MUTE} small>Cancel</Btn>
              <Btn onClick={handleAddManager} small>Add Manager</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <Modal title="Add Project" onClose={() => setShowAddProject(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "70vh", overflowY: "auto" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>ASSIGN TO MANAGER</label>
              <select value={projectForm.manager_id} onChange={e => setProjectForm(f => ({ ...f, manager_id: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none" }}>
                <option value="">Select manager...</option>
                {managers.map(m => <option key={m.id} value={m.id}>{m.name} ({m.email})</option>)}
              </select>
            </div>
            <Input label="PROJECT TITLE" type="text" placeholder="Project title" value={projectForm.title} onChange={e => setProjectForm(f => ({ ...f, title: e.target.value }))} />
            <Input label="DESCRIPTION" type="text" placeholder="Short description (optional)" value={projectForm.description} onChange={e => setProjectForm(f => ({ ...f, description: e.target.value }))} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <Input label="DAY" type="text" placeholder="e.g. Monday" value={projectForm.day} onChange={e => setProjectForm(f => ({ ...f, day: e.target.value }))} />
              <Input label="TIME" type="text" placeholder="e.g. 10:00 AM" value={projectForm.time} onChange={e => setProjectForm(f => ({ ...f, time: e.target.value }))} />
            </div>
            <Input label="PROJECT LINK" type="url" placeholder="https://..." value={projectForm.project_link} onChange={e => setProjectForm(f => ({ ...f, project_link: e.target.value }))} />
            <Input label="MEETING LINK" type="url" placeholder="https://meet.google.com/..." value={projectForm.meeting_link} onChange={e => setProjectForm(f => ({ ...f, meeting_link: e.target.value }))} />
            <Input label="GITHUB LINK" type="url" placeholder="https://github.com/..." value={projectForm.github_link} onChange={e => setProjectForm(f => ({ ...f, github_link: e.target.value }))} />
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Btn onClick={() => setShowAddProject(false)} color={MUTE} small>Cancel</Btn>
              <Btn onClick={handleAddProject} small>Add Project</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Reset Password Modal */}
      {resetTarget && (
        <Modal title={`Reset Password — ${resetTarget.name}`} onClose={() => setResetTarget(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Input label="NEW TEMPORARY PASSWORD" type="text" placeholder="Min 8 characters" value={resetPwd} onChange={e => setResetPwd(e.target.value)} />
            <p style={{ fontSize: "11px", color: MUTE }}>Student will be forced to change this on next login.</p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Btn onClick={() => setResetTarget(null)} color={MUTE} small>Cancel</Btn>
              <Btn onClick={handleResetPassword} small>Reset Password</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Sales Person Modal */}
      {showAddSalesperson && (
        <Modal title="Add Sales Person" onClose={() => setShowAddSalesperson(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <Input label="FULL NAME" type="text" placeholder="Sales person name" value={spForm.name} onChange={e => setSpForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="EMAIL ADDRESS" type="email" placeholder="sales@example.com" value={spForm.email} onChange={e => setSpForm(f => ({ ...f, email: e.target.value }))} />
            <Input label="PASSWORD" type="text" placeholder="Min 8 characters" value={spForm.password} onChange={e => setSpForm(f => ({ ...f, password: e.target.value }))} />
            <p style={{ fontSize: "11px", color: MUTE }}>Sales person will be prompted to change password on first login.</p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Btn onClick={() => setShowAddSalesperson(false)} color={MUTE} small>Cancel</Btn>
              <Btn onClick={handleAddSalesperson} small>Add</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Bulk Import Contacts Modal */}
      {showBulkContacts && (
        <Modal title="Import Contacts" onClose={() => setShowBulkContacts(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>CONTACTS (Name, Phone, Email)</label>
              <textarea
                value={bulkContactsRaw}
                onChange={e => setBulkContactsRaw(e.target.value)}
                placeholder={"Arjun Kumar, arjun@gmail.com, 9876543210\nPriya Sharma, priya@gmail.com, 9123456789\nRahul Verma, , 9988776655"}
                rows={10}
                style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "12px", ...MONO, outline: "none", resize: "vertical", boxSizing: "border-box" as const }}
              />
              <p style={{ fontSize: "11px", color: MUTE, marginTop: "6px" }}>One contact per line: <strong>Name, Email, Phone</strong> (email optional). Phone is required.</p>
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Btn onClick={() => setShowBulkContacts(false)} color={MUTE} small>Cancel</Btn>
              <Btn onClick={handleBulkContacts} small>Import</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Allot Contacts Modal */}
      {showAllot && (
        <Modal title="Allot Contacts to Sales Person" onClose={() => setShowAllot(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ backgroundColor: "#FEF3C7", border: "1px solid #D97706", borderRadius: "6px", padding: "10px 14px", fontSize: "12px", color: "#92400E" }}>
              <strong>{contactStats.unassigned || 0}</strong> unassigned contacts available. Allotment picks the next N in order.
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>SALES PERSON</label>
              <select value={allotForm.salesperson_id} onChange={e => setAllotForm(f => ({ ...f, salesperson_id: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none" }}>
                <option value="">Select sales person...</option>
                {salespersons.map(sp => <option key={sp.id} value={sp.id}>{sp.name} — {sp.email}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>HOW MANY CONTACTS?</label>
              <input
                type="number" min={1} max={500}
                value={allotForm.count}
                onChange={e => setAllotForm(f => ({ ...f, count: parseInt(e.target.value) || 1 }))}
                style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "16px", fontWeight: 700, ...MONO, outline: "none", boxSizing: "border-box" as const }}
              />
              <p style={{ fontSize: "11px", color: MUTE, marginTop: "4px" }}>Next {allotForm.count} unassigned contacts will be allotted.</p>
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Btn onClick={() => setShowAllot(false)} color={MUTE} small>Cancel</Btn>
              <Btn onClick={handleAllot} small>Allot Contacts</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Resource Modal */}
      {showAddResource && (
        <Modal title="Add Resource" onClose={() => setShowAddResource(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxHeight: "70vh", overflowY: "auto" }}>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>SECTION</label>
              <select value={resourceForm.section} onChange={e => setResourceForm(f => ({ ...f, section: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none" }}>
                <option value="recommended">Recommended</option>
                <option value="training">Training</option>
                <option value="placement">Placement</option>
              </select>
            </div>

            {resourceForm.section === "placement" && (
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>COMPANY TYPE</label>
                <select value={resourceForm.company_type} onChange={e => setResourceForm(f => ({ ...f, company_type: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none" }}>
                  <option value="service">Service (TCS, Infosys...)</option>
                  <option value="product">Product (Google, Amazon...)</option>
                </select>
              </div>
            )}

            <Input
              label={resourceForm.section === "placement" && resourceForm.company_type === "service" ? "COMPANY NAME (Category)" : "CATEGORY"}
              type="text"
              placeholder={resourceForm.section === "training" ? "e.g. Python, React, DSA" : resourceForm.section === "placement" ? "e.g. TCS, Infosys, Google" : "e.g. Resume, LinkedIn"}
              value={resourceForm.category}
              onChange={e => setResourceForm(f => ({ ...f, category: e.target.value }))}
            />

            {resourceForm.section === "placement" && resourceForm.company_type === "service" && (
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>QUESTION TYPE</label>
                <select value={resourceForm.sub_type} onChange={e => setResourceForm(f => ({ ...f, sub_type: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none" }}>
                  <option value="">Select type...</option>
                  <option value="Aptitude">Aptitude</option>
                  <option value="DSA">DSA</option>
                  <option value="Technical Interview">Technical Interview</option>
                </select>
              </div>
            )}

            <Input label="RESOURCE NAME" type="text" placeholder="e.g. Python Crash Course" value={resourceForm.name} onChange={e => setResourceForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="TAGLINE / DESCRIPTION" type="text" placeholder="One line that sells this resource" value={resourceForm.tagline} onChange={e => setResourceForm(f => ({ ...f, tagline: e.target.value }))} />
            <Input label="URL" type="url" placeholder="https://..." value={resourceForm.url} onChange={e => setResourceForm(f => ({ ...f, url: e.target.value }))} />

            <Input label="EMOJI (optional)" type="text" placeholder="e.g. 🚀" value={resourceForm.emoji} onChange={e => setResourceForm(f => ({ ...f, emoji: e.target.value }))} />

            {resourceForm.section === "recommended" && (
              <Input label="BADGE LABEL (optional)" type="text" placeholder="e.g. MUST USE, TOP PICK" value={resourceForm.badge_label} onChange={e => setResourceForm(f => ({ ...f, badge_label: e.target.value }))} />
            )}

            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Btn onClick={() => setShowAddResource(false)} color={MUTE} small>Cancel</Btn>
              <Btn onClick={handleAddResource} small>Add Resource</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <Modal title="Add Upcoming Event" onClose={() => { setShowAddEvent(false); setEventImagePreview(null); setEventImage(null); setEventForm({ title: "", location: "", date: "", description: "", is_active: true }); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <Input label="EVENT TITLE" type="text" placeholder="e.g. Upstride Career Bootcamp" value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))} />
            <Input label="LOCATION / COLLEGE NAME" type="text" placeholder="e.g. SRM Ramapuram, Chennai" value={eventForm.location} onChange={e => setEventForm(f => ({ ...f, location: e.target.value }))} />
            <Input label="DATE" type="date" value={eventForm.date} onChange={e => setEventForm(f => ({ ...f, date: e.target.value }))} />
            <Input label="DESCRIPTION (optional)" type="text" placeholder="Short description" value={eventForm.description} onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))} />
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>EVENT IMAGE</label>
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ fontSize: "12px", ...MONO, width: "100%" }} />
              {eventImagePreview && (
                <img src={eventImagePreview} alt="Preview" style={{ marginTop: "8px", width: "100%", height: "120px", objectFit: "cover", borderRadius: "6px", border: `2px solid ${BORD}` }} />
              )}
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Btn onClick={() => { setShowAddEvent(false); setEventImagePreview(null); setEventImage(null); }} color={MUTE} small>Cancel</Btn>
              <Btn onClick={handleCreateEvent} small>Create Event</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
