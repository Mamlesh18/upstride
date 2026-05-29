import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Users, FolderKanban, UserCog, PhoneCall, Plus, Trash2, RefreshCw, LogOut, ToggleLeft, ToggleRight, X, PlayCircle, MessageSquare, Lock, Save, CalendarDays, ImagePlus, ToggleRight as Toggle, BookOpen, Layers, Briefcase, UserPlus, Send, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import ClassMessagesTab from "@/components/admin/ClassMessagesTab";

const Y = "#FFE500"; const B = "#0A0A0A"; const W = "#FFFFFF"; const BG = "#FAFAFA";
const BORD = "#E5E5E5"; const MUTE = "#6B7280"; const RED = "#EF4444"; const GREEN = "#22C55E";
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

type Tab = "students" | "managers" | "projects" | "sales" | "sessions" | "feedback" | "events" | "batches" | "placements" | "leads" | "courses" | "class_msgs";
type ContactStatus = "pending" | "picked" | "rejected" | "missed" | "joining" | "will_discuss";

interface Student { id: string; name: string; email: string; is_active: boolean; must_change_password: boolean; }
interface Batch { id: string; name: string; resume_enhancer_email?: string; resume_enhancer_password?: string; common_calendar_url?: string; calendar_url_1?: string; calendar_url_2?: string; }
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

  // Placements (Jobs)
  interface Job { id: string; role: string; company: string; description: string; apply_link: string; category: string; is_active: boolean; created_at?: string; }
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showAddJob, setShowAddJob] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [jobForm, setJobForm] = useState({ role: "", company: "", description: "", apply_link: "", category: "internship" });

  // Leads & Signups
  interface Lead { id: string; name: string; email: string; phone: string; created_at: string; referred_by?: string | null; }
  interface PublicUser { id: string; name: string; email: string; phone?: string; created_at: string; }
  const [leads, setLeads] = useState<Lead[]>([]);
  const [publicUsers, setPublicUsers] = useState<PublicUser[]>([]);

  // Courses
  interface QAItem { question: string; answer: string; }
  interface MCQItem { question: string; options: string[]; correct_index: number; }
  interface CourseTopic { id: string; title: string; content_type: string; video_url: string; duration: string; order: number; qa_items: QAItem[]; mcq_items: MCQItem[]; difficulty: string; platform: string; }
  interface AdminCourse { id: string; title: string; slug: string; category: string; section: string; description: string; emoji: string; image_url: string; duration: string; order: number; is_active: boolean; is_recommended: boolean; topics: CourseTopic[]; total_topics: number; created_at: string | null; }
  const [adminCourses, setAdminCourses]       = useState<AdminCourse[]>([]);
  const [expandedCourse, setExpandedCourse]   = useState<string | null>(null);
  const [showAddCourse, setShowAddCourse]     = useState(false);
  const [editCourse, setEditCourse]           = useState<AdminCourse | null>(null);
  const [courseForm, setCourseForm]           = useState({ title: "", category: "training", section: "", description: "", emoji: "📚", image_url: "", duration: "", order: 0, is_active: true, is_recommended: false });
  const [showBulkTopic, setShowBulkTopic]     = useState<string | null>(null);
  const [bulkTopicMode, setBulkTopicMode]     = useState<"video" | "qa" | "mixed" | "dsa" | "article">("video");
  const [bulkVideoText, setBulkVideoText]     = useState("");
  const [bulkQATitle, setBulkQATitle]         = useState("");
  const [bulkQAText, setBulkQAText]           = useState("");
  const [bulkMixedTitle, setBulkMixedTitle]   = useState("");
  const [bulkMixedUrl, setBulkMixedUrl]       = useState("");
  const [bulkMixedDuration, setBulkMixedDuration] = useState("");
  const [bulkMixedQAText, setBulkMixedQAText] = useState("");
  const [bulkDSAText, setBulkDSAText]         = useState("");
  const [bulkArticleTitle, setBulkArticleTitle] = useState("");
  const [bulkArticleQAText, setBulkArticleQAText] = useState("");
  const [editTopic, setEditTopic]             = useState<{ courseId: string; topic: CourseTopic } | null>(null);
  const [topicForm, setTopicForm]             = useState({ title: "", content_type: "video", video_url: "", duration: "", qa_text: "", mcq_text: "", difficulty: "Easy", platform: "LeetCode" });
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
  const [batches, setBatches] = useState<Batch[]>([]);
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [batchForm, setBatchForm] = useState({ name: "", resumeEmail: "", resumePassword: "", commonUrl: "", url1: "", url2: "" });
  const [editBatch, setEditBatch] = useState<Batch | null>(null);

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddManager, setShowAddManager] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddSalesperson, setShowAddSalesperson] = useState(false);
  const [showBulkContacts, setShowBulkContacts] = useState(false);
  const [showAllot, setShowAllot] = useState(false);
  const [resetTarget, setResetTarget] = useState<Student | null>(null);

  // Forms
  const [studentForm, setStudentForm] = useState({ emails: "", password: "", batchId: "", resumeEmail: "", resumePassword: "" });
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

  const loadBatches = useCallback(async () => {
    try {
      const r = await api.batches.list() as { data: { batches: Batch[] } };
      setBatches(r.data.batches);
    } catch { /* silent */ }
  }, []);

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

  useEffect(() => { if (tab === "batches") loadBatches(); }, [tab, loadBatches]);

  const loadJobs = useCallback(async () => {
    try {
      const r = await api.admin.listJobs() as { data: { jobs: Job[] } };
      setJobs(r.data.jobs);
    } catch { /* silent */ }
  }, []);

  const loadLeads = useCallback(async () => {
    try {
      const r = await api.admin.listLeads() as { data: { leads: Lead[] } };
      setLeads(r.data.leads);
    } catch { /* silent */ }
  }, []);

  const loadPublicUsers = useCallback(async () => {
    try {
      const r = await api.admin.listPublicUsers() as { data: { users: PublicUser[] } };
      setPublicUsers(r.data.users);
    } catch { /* silent */ }
  }, []);

  useEffect(() => { if (tab === "placements") loadJobs(); }, [tab, loadJobs]);
  useEffect(() => { if (tab === "leads") { loadLeads(); loadPublicUsers(); } }, [tab, loadLeads, loadPublicUsers]);

  const loadAdminCourses = useCallback(async () => {
    try {
      const r = await api.adminCourses.list() as { data: AdminCourse[] };
      setAdminCourses(r.data);
    } catch { /* silent */ }
  }, []);
  useEffect(() => { if (tab === "courses") loadAdminCourses(); }, [tab, loadAdminCourses]);
  useEffect(() => { loadBatches(); }, [loadBatches]); // load once for student add dropdown

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
      const r = await api.admin.bulkAddStudents(emails, studentForm.password, studentForm.batchId || undefined, studentForm.resumeEmail.trim() || undefined, studentForm.resumePassword.trim() || undefined) as { data: { added: string[]; skipped: string[] } };
      const { added, skipped } = r.data;
      toast({ title: `${added.length} student(s) added`, description: skipped.length ? `${skipped.length} already existed (skipped)` : undefined });
      setShowAddStudent(false);
      setStudentForm({ emails: "", password: "", batchId: "", resumeEmail: "", resumePassword: "" });
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

  const emptyBatchForm = { name: "", resumeEmail: "", resumePassword: "", commonUrl: "", url1: "", url2: "" };

  const extractCalendarUrl = (raw: string): string => {
    const trimmed = raw.trim();
    // If they pasted a full <iframe> tag, pull out the src attribute value
    const match = trimmed.match(/src=["']([^"']+)/);
    if (match) return match[1];
    return trimmed;
  };

  const calendarInput = (label: string, field: "commonUrl" | "url1" | "url2") => (
    <div>
      <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>{label}</label>
      <input
        type="text"
        placeholder="Paste the full embed code or just the URL"
        value={batchForm[field]}
        onChange={e => setBatchForm(f => ({ ...f, [field]: e.target.value }))}
        onBlur={e => setBatchForm(f => ({ ...f, [field]: extractCalendarUrl(e.target.value) }))}
        onPaste={e => {
          e.preventDefault();
          const pasted = e.clipboardData.getData("text");
          setBatchForm(f => ({ ...f, [field]: extractCalendarUrl(pasted) }));
        }}
        style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "12px", ...MONO, outline: "none", boxSizing: "border-box" as const }}
      />
    </div>
  );

  const handleSaveBatch = async () => {
    const isEdit = !!editBatch;
    const payload = {
      name: batchForm.name.trim(),
      resume_enhancer_email: batchForm.resumeEmail.trim() || undefined,
      resume_enhancer_password: batchForm.resumePassword.trim() || undefined,
      common_calendar_url: batchForm.commonUrl.trim() || undefined,
      calendar_url_1: batchForm.url1.trim() || undefined,
      calendar_url_2: batchForm.url2.trim() || undefined,
    };
    console.log("[Batch] payload:", JSON.stringify(payload));
    try {
      if (isEdit) {
        await api.batches.update(editBatch!.id, payload);
        toast({ title: "Batch updated" });
        setEditBatch(null);
      } else {
        await api.batches.create(payload);
        toast({ title: "Batch created" });
        setShowAddBatch(false);
      }
      setBatchForm(emptyBatchForm);
      loadBatches();
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const handleDeleteBatch = async (id: string) => {
    if (!confirm("Delete this batch? Students linked to it will lose their schedule.")) return;
    try {
      await api.batches.delete(id);
      toast({ title: "Batch deleted" });
      loadBatches();
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

  const handleSaveCourse = async () => {
    try {
      if (editCourse) {
        await api.adminCourses.update(editCourse.id, courseForm);
        toast({ title: "Course updated" });
      } else {
        await api.adminCourses.create({ ...courseForm, order: Number(courseForm.order) });
        toast({ title: "Course created" });
      }
      setShowAddCourse(false);
      setEditCourse(null);
      setCourseForm({ title: "", category: "training", section: "", description: "", emoji: "📚", image_url: "", duration: "", order: 0, is_active: true, is_recommended: false });
      loadAdminCourses();
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const handleDeleteCourse = async (id: string, title: string) => {
    if (!confirm(`Delete course "${title}" and all its topics? This cannot be undone.`)) return;
    try { await api.adminCourses.delete(id); loadAdminCourses(); toast({ title: "Course deleted" }); }
    catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const parseQAText = (text: string): { question: string; answer: string }[] => {
    const blocks = text.trim().split(/\n{2,}/);
    const items: { question: string; answer: string }[] = [];
    for (const block of blocks) {
      const lines = block.trim().split("\n");
      let q = "", a = "";
      for (const line of lines) {
        if (line.startsWith("Q:")) q = line.slice(2).trim();
        else if (line.startsWith("A:")) a = line.slice(2).trim();
      }
      if (q && a) items.push({ question: q, answer: a });
    }
    return items;
  };

  const parseMCQText = (text: string): { question: string; options: string[]; correct_index: number }[] => {
    const blocks = text.trim().split(/\n\s*\n/);
    const items: { question: string; options: string[]; correct_index: number }[] = [];
    for (const block of blocks) {
      const lines = block.trim().split("\n").map(l => l.trim()).filter(Boolean);
      if (!lines.length || !lines[0].startsWith("Q:")) continue;
      const question = lines[0].slice(2).trim();
      const options: string[] = [];
      let correct_index = 0;
      for (let i = 1; i < lines.length; i++) {
        const l = lines[i];
        if (l.startsWith("* ")) { correct_index = options.length; options.push(l.slice(2).trim()); }
        else if (l.startsWith("- ")) { options.push(l.slice(2).trim()); }
      }
      if (question && options.length >= 2) items.push({ question, options, correct_index });
    }
    return items;
  };


  const handleBulkAddTopics = async () => {
    if (!showBulkTopic) return;
    const courseId = showBulkTopic;

    if (bulkTopicMode === "video") {
      // Merge continuation lines: if a line starts with "," it belongs to the previous line
      const rawLines = bulkVideoText.trim().split("\n");
      const merged: string[] = [];
      for (const line of rawLines) {
        const t = line.trim();
        if (!t) continue;
        if (t.startsWith(",") && merged.length > 0) {
          merged[merged.length - 1] += t; // append ", duration" to previous line
        } else {
          merged.push(t);
        }
      }
      // Skip pure-number lines (row indices from Excel/Sheets)
      const lines = merged.filter(l => !/^\d+$/.test(l));
      const topics = lines.map(line => {
        const sep = line.includes("\t") ? "\t" : ",";
        const parts = line.split(sep).map(p => p.trim());
        return { title: parts[0] || "", content_type: "video", video_url: parts[1] || "", duration: parts[2] || "", qa_items: [] };
      }).filter(t => t.title);
      if (!topics.length) { toast({ title: "No topics found. Format: Title, URL, Duration (one per line)", variant: "destructive" }); return; }
      try {
        await api.adminCourses.bulkAddTopics(courseId, topics);
        toast({ title: `${topics.length} topic(s) added` });
        setShowBulkTopic(null); setBulkVideoText("");
        loadAdminCourses();
      } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }

    } else if (bulkTopicMode === "qa") {
      if (!bulkQATitle.trim()) { toast({ title: "Topic title is required", variant: "destructive" }); return; }
      const qa_items = parseQAText(bulkQAText);
      if (!qa_items.length) { toast({ title: "No Q&A pairs found. Use Q: / A: format, separated by blank lines.", variant: "destructive" }); return; }
      try {
        await api.adminCourses.bulkAddTopics(courseId, [{ title: bulkQATitle.trim(), content_type: "qa", video_url: "", duration: "", qa_items }]);
        toast({ title: `Topic with ${qa_items.length} Q&A pairs added` });
        setShowBulkTopic(null); setBulkQATitle(""); setBulkQAText("");
        loadAdminCourses();
      } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }

    } else if (bulkTopicMode === "mixed") {
      if (!bulkMixedTitle.trim()) { toast({ title: "Topic title is required", variant: "destructive" }); return; }
      const qa_items = parseQAText(bulkMixedQAText);
      try {
        await api.adminCourses.bulkAddTopics(courseId, [{ title: bulkMixedTitle.trim(), content_type: "mixed", video_url: bulkMixedUrl.trim(), duration: bulkMixedDuration.trim(), qa_items }]);
        toast({ title: "Topic added" });
        setShowBulkTopic(null); setBulkMixedTitle(""); setBulkMixedUrl(""); setBulkMixedDuration(""); setBulkMixedQAText("");
        loadAdminCourses();
      } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }

    } else if (bulkTopicMode === "dsa") {
      const rawLines = bulkDSAText.trim().split("\n");
      const merged: string[] = [];
      for (const line of rawLines) {
        const t = line.trim();
        if (!t) continue;
        if (t.startsWith(",") && merged.length > 0) { merged[merged.length - 1] += t; } else { merged.push(t); }
      }
      const topics = merged.filter(l => !/^\d+$/.test(l)).map(line => {
        const sep = line.includes("\t") ? "\t" : ",";
        const parts = line.split(sep).map(p => p.trim());
        return { title: parts[0] || "", content_type: "dsa", video_url: parts[1] || "", duration: "", qa_items: [], mcq_items: [], difficulty: parts[2] || "Easy", platform: parts[3] || "LeetCode" };
      }).filter(t => t.title);
      if (!topics.length) { toast({ title: "No topics found. Format: Problem Name, URL, Difficulty, Platform", variant: "destructive" }); return; }
      try {
        await api.adminCourses.bulkAddTopics(courseId, topics);
        toast({ title: `${topics.length} DSA problem(s) added` });
        setShowBulkTopic(null); setBulkDSAText("");
        loadAdminCourses();
      } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }

    } else if (bulkTopicMode === "article") {
      if (!bulkArticleTitle.trim()) { toast({ title: "Topic title is required", variant: "destructive" }); return; }
      const qa_items = parseQAText(bulkArticleQAText);
      if (!qa_items.length) { toast({ title: "No Q&A pairs found. Use Q: / A: format, separated by blank lines.", variant: "destructive" }); return; }
      try {
        await api.adminCourses.bulkAddTopics(courseId, [{ title: bulkArticleTitle.trim(), content_type: "article", video_url: "", duration: "", qa_items, mcq_items: [] }]);
        toast({ title: `Article topic with ${qa_items.length} questions added` });
        setShowBulkTopic(null); setBulkArticleTitle(""); setBulkArticleQAText("");
        loadAdminCourses();
      } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
    }
  };

  const handleSaveTopic = async () => {
    if (!editTopic) return;
    const { courseId, topic } = editTopic;
    const ct = topicForm.content_type;
    const qa_items = (ct === "qa" || ct === "mixed" || ct === "article") ? parseQAText(topicForm.qa_text) : [];
    const mcq_items = ct === "mcq" ? parseMCQText(topicForm.mcq_text) : [];
    try {
      await api.adminCourses.updateTopic(courseId, topic.id, {
        title: topicForm.title,
        content_type: ct,
        video_url: topicForm.video_url,
        duration: topicForm.duration,
        qa_items,
        mcq_items,
        difficulty: topicForm.difficulty,
        platform: topicForm.platform,
      });
      toast({ title: "Topic updated" });
      setEditTopic(null);
      setTopicForm({ title: "", content_type: "video", video_url: "", duration: "", qa_text: "", mcq_text: "", difficulty: "Easy", platform: "LeetCode" });
      loadAdminCourses();
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const handleDeleteTopic = async (courseId: string, topicId: string, title: string) => {
    if (!confirm(`Delete topic "${title}"?`)) return;
    try { await api.adminCourses.deleteTopic(courseId, topicId); loadAdminCourses(); toast({ title: "Topic deleted" }); }
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
    { key: "batches",     label: "Batches",       icon: <Layers size={15} /> },
    { key: "placements",  label: "Placements",    icon: <Briefcase size={15} /> },
    { key: "leads",       label: "Leads & Signups", icon: <UserPlus size={15} /> },
    { key: "courses",     label: "Courses",       icon: <BookOpen size={15} /> },
    { key: "class_msgs",  label: "Class Messages", icon: <Send size={15} /> },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, ...MONO, display: "flex" }}>

      {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
      <div style={{
        width: "220px", flexShrink: 0, backgroundColor: B,
        position: "fixed", top: 0, left: 0, height: "100vh",
        display: "flex", flexDirection: "column", zIndex: 100,
        borderRight: `3px solid ${Y}`,
      }}>
        {/* Brand */}
        <div style={{ padding: "20px 18px", borderBottom: `1px solid ${W}15` }}>
          <div style={{ backgroundColor: Y, color: B, display: "inline-block", padding: "3px 10px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", marginBottom: "6px" }}>UPSTRIDE</div>
          <div style={{ color: `${W}70`, fontSize: "11px", letterSpacing: "0.06em" }}>Admin Dashboard</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 10px", overflowY: "auto" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                width: "100%", padding: "10px 12px", border: "none",
                borderRadius: "6px", marginBottom: "2px",
                background: tab === t.key ? Y : "transparent",
                color: tab === t.key ? B : `${W}70`,
                fontSize: "12px", fontWeight: 700, cursor: "pointer",
                textAlign: "left", letterSpacing: "0.06em", ...MONO,
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (tab !== t.key) (e.currentTarget as HTMLButtonElement).style.background = `${W}10`; }}
              onMouseLeave={e => { if (tab !== t.key) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: "14px 14px", borderTop: `1px solid ${W}15` }}>
          <div style={{ color: `${W}55`, fontSize: "10px", letterSpacing: "0.08em", marginBottom: "10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {localStorage.getItem("userEmail")}
          </div>
          <button onClick={logout}
            style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%", backgroundColor: "transparent", border: `1px solid ${W}25`, borderRadius: "6px", padding: "8px 12px", color: `${W}80`, fontSize: "11px", cursor: "pointer", ...MONO }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = RED; (e.currentTarget as HTMLButtonElement).style.color = RED; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${W}25`; (e.currentTarget as HTMLButtonElement).style.color = `${W}80`; }}
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
      <div style={{ marginLeft: "220px", flex: 1, minWidth: 0, padding: "32px 32px" }}>
        {/* -- Dashboard Overview ----------------------------------- */}
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
                    { label: "Live", value: stats.live_projects, color: GREEN },
                    { label: "Done", value: stats.completed_projects, color: MUTE },
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
                  { label: "Pending",      value: stats.contacts_pending,      color: MUTE,      bg: "#F3F4F6" },
                  { label: "Picked Call",  value: stats.contacts_picked,       color: "#16A34A", bg: "#DCFCE7" },
                  { label: "Missed",       value: stats.contacts_missed,       color: "#D97706", bg: "#FEF3C7" },
                  { label: "Will Discuss", value: stats.contacts_will_discuss, color: "#0369A1", bg: "#E0F2FE" },
                  { label: "Rejected",     value: stats.contacts_rejected,     color: RED,       bg: "#FEE2E2" },
                  { label: "Joining",      value: stats.contacts_joining,      color: "#7C3AED", bg: "#EDE9FE" },
                ].map(({ label, value, color, bg }) => {
                  const pct = stats.total_contacts ? Math.round((value / stats.total_contacts) * 100) : 0;
                  return (
                    <div key={label} style={{ backgroundColor: bg, borderRadius: "10px", padding: "16px 12px", textAlign: "center" }}>
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

        {/* Current tab label */}
        <div style={{ fontSize: "11px", fontWeight: 700, color: MUTE, letterSpacing: "0.15em", marginBottom: "24px", paddingBottom: "16px", borderBottom: `2px solid ${BORD}` }}>
          {tabs.find(t => t.key === tab)?.label.toUpperCase()}
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
                <Btn onClick={() => setShowResumeCreds(true)} small style={{ background: "#7C3AED", color: W }}>Resume Tool Creds</Btn>
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
                  Showing {Math.min((studentPage - 1) * 20 + 1, studentTotal)}�{Math.min(studentPage * 20, studentTotal)} of <strong style={{ color: B }}>{studentTotal}</strong> students
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    disabled={studentPage === 1}
                    onClick={() => loadStudents(studentPage - 1)}
                    style={{ padding: "6px 14px", border: `2px solid ${studentPage === 1 ? BORD : B}`, borderRadius: "6px", background: studentPage === 1 ? BG : B, color: studentPage === 1 ? MUTE : Y, fontSize: "11px", fontWeight: 700, cursor: studentPage === 1 ? "not-allowed" : "pointer", ...MONO }}>
                    &larr; Prev
                  </button>
                  <span style={{ fontSize: "12px", color: B, fontWeight: 700, padding: "0 8px" }}>
                    Page {studentPage} of {Math.ceil(studentTotal / 20)}
                  </span>
                  <button
                    disabled={studentPage * 20 >= studentTotal}
                    onClick={() => loadStudents(studentPage + 1)}
                    style={{ padding: "6px 14px", border: `2px solid ${studentPage * 20 >= studentTotal ? BORD : B}`, borderRadius: "6px", background: studentPage * 20 >= studentTotal ? BG : B, color: studentPage * 20 >= studentTotal ? MUTE : Y, fontSize: "11px", fontWeight: 700, cursor: studentPage * 20 >= studentTotal ? "not-allowed" : "pointer", ...MONO }}>
                    Next &rarr;
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
                        {p.day && <span style={{ fontSize: "11px", fontWeight: 700, backgroundColor: Y, color: B, padding: "2px 8px", border: `1px solid ${B}`, borderRadius: "4px" }}>{p.day}</span>}
                        {p.time && <span style={{ fontSize: "11px", fontWeight: 700, backgroundColor: `${B}10`, color: B, padding: "2px 8px", border: `1px solid ${BORD}`, borderRadius: "4px" }}>{p.time}</span>}
                      </div>
                    )}
                    {p.description && <div style={{ fontSize: "12px", color: MUTE, marginBottom: "8px" }}>{p.description}</div>}
                    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      {p.project_link && <a href={p.project_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "#6366F1", fontWeight: 700 }}>Project Link &rarr;</a>}
                      {p.meeting_link && <a href={p.meeting_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "#0EA5E9", fontWeight: 700 }}>Meeting Link &rarr;</a>}
                      {p.github_link && <a href={p.github_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "#111827", fontWeight: 700 }}>GitHub &rarr;</a>}
                    </div>
                  </div>
                  <button onClick={() => deleteProject(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: RED, flexShrink: 0 }}><Trash2 size={16} /></button>
                </div>
              ))}
              {projects.length === 0 && <p style={{ textAlign: "center", color: MUTE, fontSize: "13px", padding: "32px" }}>No projects added yet</p>}
            </div>
          </div>
        )}

        {/* -- Sessions Tab -------------------------------------------- */}
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
                        Session {s.session_number} � {s.title}
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
                        <div style={{ fontSize: "11px", color: MUTE, letterSpacing: "0.08em" }}>SESSION {s.session_number} � WEEK {s.week}</div>
                        <div style={{ fontSize: "13px", fontWeight: 700, color: B }}>{s.title}</div>
                        {s.drive_link && <div style={{ fontSize: "11px", color: "#16A34A", marginTop: "2px" }}>? Link added</div>}
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

        {/* -- Feedback Tab -------------------------------------------- */}
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

        {/* -- Events Tab ------------------------------------------ */}
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
                        <div style={{ fontSize: "12px", color: MUTE, marginTop: "2px" }}>{ev.location}</div>
                        <div style={{ fontSize: "12px", color: MUTE }}>{new Date(ev.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
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

        {/* -- Sales Tab ------------------------------------------- */}
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
                    { label: "Today", value: today },
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
                      <span style={{ fontSize: "13px", fontWeight: 700, color: Y }}>{formatAdminDay(dateKey)}</span>
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
                                <td style={{ padding: "9px 14px", fontSize: "11px", color: MUTE }}>{c.email || "�"}</td>
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
                                <td style={{ padding: "9px 14px", fontSize: "11px", color: MUTE, maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.notes || "�"}</td>
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
                Showing {Math.min((contactPage - 1) * 50 + 1, contactTotal || 0)}�{Math.min(contactPage * 50, contactTotal)} of <strong style={{ color: B }}>{contactTotal}</strong> contacts
              </span>
              {contactTotal > 50 && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <button
                    disabled={contactPage === 1}
                    onClick={() => loadContacts(contactPage - 1)}
                    style={{ padding: "6px 14px", border: `2px solid ${contactPage === 1 ? BORD : B}`, borderRadius: "6px", background: contactPage === 1 ? BG : B, color: contactPage === 1 ? MUTE : Y, fontSize: "11px", fontWeight: 700, cursor: contactPage === 1 ? "not-allowed" : "pointer", ...MONO }}>
                    &larr; Prev
                  </button>
                  <span style={{ fontSize: "12px", color: B, fontWeight: 700, padding: "0 8px" }}>
                    Page {contactPage} of {Math.ceil(contactTotal / 50)}
                  </span>
                  <button
                    disabled={contactPage * 50 >= contactTotal}
                    onClick={() => loadContacts(contactPage + 1)}
                    style={{ padding: "6px 14px", border: `2px solid ${contactPage * 50 >= contactTotal ? BORD : B}`, borderRadius: "6px", background: contactPage * 50 >= contactTotal ? BG : B, color: contactPage * 50 >= contactTotal ? MUTE : Y, fontSize: "11px", fontWeight: 700, cursor: contactPage * 50 >= contactTotal ? "not-allowed" : "pointer", ...MONO }}>
                    Next &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* -- Resources Tab --------------------------------------- */}
        {/* -- Batches Tab ------------------------------------------- */}
        {tab === "batches" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: B }}>Batches</h2>
                <p style={{ fontSize: "12px", color: MUTE, marginTop: "2px" }}>Each batch holds shared credentials and calendar links for a group of students.</p>
              </div>
              <Btn onClick={() => { setShowAddBatch(true); setBatchForm(emptyBatchForm); }} small><Plus size={13} /> New Batch</Btn>
            </div>

            {batches.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", border: `2px dashed ${BORD}`, borderRadius: "12px", color: MUTE }}>
                <Layers size={32} style={{ marginBottom: "12px", opacity: 0.3 }} />
                <p style={{ fontWeight: 600, marginBottom: "4px" }}>No batches yet</p>
                <p style={{ fontSize: "12px" }}>Create a batch to group students with shared credentials and calendars.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {batches.map(b => (
                  <div key={b.id} style={{ background: W, border: `2px solid ${BORD}`, borderRadius: "10px", padding: "20px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                          <div style={{ background: Y, border: `2px solid ${B}`, borderRadius: "6px", padding: "4px 10px", fontSize: "12px", fontWeight: 700, color: B }}>{b.name}</div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px", fontSize: "11px", color: MUTE }}>
                          {b.resume_enhancer_email && <div><span style={{ color: B, fontWeight: 600 }}>Resume Email:</span> {b.resume_enhancer_email}</div>}
                          {b.resume_enhancer_password && <div><span style={{ color: B, fontWeight: 600 }}>Resume Pwd:</span> {b.resume_enhancer_password}</div>}
                          {b.common_calendar_url && <div><span style={{ color: "#16A34A", fontWeight: 600 }}>Program Cal:</span> linked</div>}
                          {b.calendar_url_1 && <div><span style={{ color: "#0369A1", fontWeight: 600 }}>Standup Cal:</span> linked</div>}
                          {b.calendar_url_2 && <div><span style={{ color: "#7C3AED", fontWeight: 600 }}>Extra Cal:</span> linked</div>}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <Btn small color={MUTE} onClick={() => { setEditBatch(b); setBatchForm({ name: b.name, resumeEmail: b.resume_enhancer_email || "", resumePassword: b.resume_enhancer_password || "", commonUrl: b.common_calendar_url || "", url1: b.calendar_url_1 || "", url2: b.calendar_url_2 || "" }); }}>Edit</Btn>
                        <Btn small color={RED} onClick={() => handleDeleteBatch(b.id)}><Trash2 size={12} /></Btn>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Placements Tab ─────────────────────────────────────────── */}
        {tab === "placements" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: B }}>Placements</h2>
                <p style={{ fontSize: "12px", color: MUTE, marginTop: "2px" }}>Jobs and internships shown on the public Placements page.</p>
              </div>
              <Btn onClick={() => { setEditJob(null); setJobForm({ role: "", company: "", description: "", apply_link: "", category: "internship" }); setShowAddJob(true); }} small><Plus size={13} /> Add Job</Btn>
            </div>

            {jobs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px", border: `2px dashed ${BORD}`, borderRadius: "12px", color: MUTE }}>
                <Briefcase size={32} style={{ marginBottom: "12px", opacity: 0.3 }} />
                <p style={{ fontWeight: 600, marginBottom: "4px" }}>No jobs yet</p>
                <p style={{ fontSize: "12px" }}>Add internships or full-time roles to show on the Placements page.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {jobs.map(job => (
                  <div key={job.id} style={{ background: W, border: `2px solid ${BORD}`, borderRadius: "10px", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "15px", fontWeight: 700, color: B }}>{job.role}</span>
                        <span style={{ fontSize: "12px", color: MUTE }}>@ {job.company}</span>
                        <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", padding: "2px 8px", borderRadius: "4px", background: job.category === "internship" ? "#E0F2FE" : "#DCFCE7", color: job.category === "internship" ? "#0369A1" : "#16A34A" }}>{job.category.toUpperCase()}</span>
                        {!job.is_active && <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: "#F3F4F6", color: MUTE }}>HIDDEN</span>}
                      </div>
                      {job.description && <p style={{ fontSize: "12px", color: MUTE, marginBottom: "6px", lineHeight: 1.5 }}>{job.description}</p>}
                      {job.apply_link && <a href={job.apply_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "#2563EB", ...MONO }}>Apply Link →</a>}
                    </div>
                    <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                      <Btn small color={job.is_active ? MUTE : GREEN} onClick={async () => {
                        try { await api.admin.updateJob(job.id, { is_active: !job.is_active }); loadJobs(); } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
                      }}>{job.is_active ? <ToggleLeft size={13} /> : <ToggleRight size={13} />} {job.is_active ? "Hide" : "Show"}</Btn>
                      <Btn small color={MUTE} onClick={() => { setEditJob(job); setJobForm({ role: job.role, company: job.company, description: job.description, apply_link: job.apply_link, category: job.category }); setShowAddJob(true); }}>Edit</Btn>
                      <Btn small color={RED} onClick={async () => {
                        try { await api.admin.deleteJob(job.id); loadJobs(); toast({ title: "Job deleted" }); } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
                      }}><Trash2 size={12} /></Btn>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Leads & Signups Tab ─────────────────────────────────────── */}
        {tab === "leads" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

            {/* Apply Now Leads */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: 700, color: B }}>Apply Now Leads</h2>
                  <p style={{ fontSize: "12px", color: MUTE, marginTop: "2px" }}>People who submitted the Apply form on the website. Latest first.</p>
                </div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: MUTE, ...MONO }}>{leads.length} total</span>
              </div>
              {leads.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", border: `2px dashed ${BORD}`, borderRadius: "12px", color: MUTE }}>
                  <p style={{ fontWeight: 600 }}>No leads yet</p>
                  <p style={{ fontSize: "12px" }}>Submissions from the Apply page will show here.</p>
                </div>
              ) : (
                <div style={{ border: `2px solid ${BORD}`, borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 140px", background: B, padding: "10px 16px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", color: Y }}>
                    <span>NAME</span><span>EMAIL</span><span>PHONE</span><span>REFERRED BY</span><span>DATE</span>
                  </div>
                  {leads.map((lead, i) => (
                    <div key={lead.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 140px", padding: "12px 16px", fontSize: "12px", background: i % 2 === 0 ? W : BG, borderTop: `1px solid ${BORD}`, alignItems: "center" }}>
                      <span style={{ fontWeight: 600, color: B }}>{lead.name || "—"}</span>
                      <span style={{ color: MUTE }}>{lead.email || "—"}</span>
                      <span style={{ color: MUTE, ...MONO }}>{lead.phone || "—"}</span>
                      <span style={{ ...MONO, fontSize: "11px" }}>
                        {lead.referred_by ? (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "3px 8px", background: "#FEF3C7", color: "#92400E", border: "1px solid #FDE68A", borderRadius: "10px", fontWeight: 600 }} title={lead.referred_by}>
                            🎁 {lead.referred_by}
                          </span>
                        ) : (
                          <span style={{ color: "#9CA3AF" }}>Self-applied</span>
                        )}
                      </span>
                      <span style={{ color: MUTE, fontSize: "11px" }}>{lead.created_at ? new Date(lead.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Public Signups */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <div>
                  <h2 style={{ fontSize: "18px", fontWeight: 700, color: B }}>Public Sign-ups</h2>
                  <p style={{ fontSize: "12px", color: MUTE, marginTop: "2px" }}>People who created an account on the website. Latest first.</p>
                </div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: MUTE, ...MONO }}>{publicUsers.length} total</span>
              </div>
              {publicUsers.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", border: `2px dashed ${BORD}`, borderRadius: "12px", color: MUTE }}>
                  <p style={{ fontWeight: 600 }}>No public sign-ups yet</p>
                  <p style={{ fontSize: "12px" }}>Accounts created via the public signup page will show here.</p>
                </div>
              ) : (
                <div style={{ border: `2px solid ${BORD}`, borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 160px", background: B, padding: "10px 16px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", color: Y }}>
                    <span>NAME</span><span>EMAIL</span><span>PHONE</span><span>JOINED</span>
                  </div>
                  {publicUsers.map((u, i) => (
                    <div key={u.id} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 160px", padding: "12px 16px", fontSize: "12px", background: i % 2 === 0 ? W : BG, borderTop: `1px solid ${BORD}`, alignItems: "center" }}>
                      <span style={{ fontWeight: 600, color: B }}>{u.name || "—"}</span>
                      <span style={{ color: MUTE }}>{u.email}</span>
                      <span style={{ color: MUTE, ...MONO }}>{u.phone || "—"}</span>
                      <span style={{ color: MUTE, fontSize: "11px" }}>{u.created_at ? new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Courses Tab ─────────────────────────────────────────────── */}
        {tab === "courses" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <div>
                <h2 style={{ fontSize: "22px", fontWeight: 700, color: B }}>Courses</h2>
                <p style={{ fontSize: "12px", color: MUTE, marginTop: "4px" }}>Manage structured courses with video topics and progress tracking.</p>
              </div>
              <Btn onClick={() => { setShowAddCourse(true); setEditCourse(null); setCourseForm({ title: "", category: "training", section: "", description: "", emoji: "📚", image_url: "", duration: "", order: 0, is_active: true, is_recommended: false }); }}>
                + New Course
              </Btn>
            </div>

            {adminCourses.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 24px", border: `2px dashed ${BORD}`, borderRadius: "12px", color: MUTE }}>
                <BookOpen size={40} style={{ marginBottom: "12px", opacity: 0.3 }} />
                <p style={{ fontWeight: 600, color: B, marginBottom: "4px" }}>No courses yet</p>
                <p style={{ fontSize: "12px" }}>Create your first course and add video topics to it.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {adminCourses.map(course => (
                  <div key={course.id} style={{ border: `2px solid ${BORD}`, borderRadius: "10px", overflow: "hidden", background: W }}>
                    {/* Course header row */}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", cursor: "pointer", borderBottom: expandedCourse === course.id ? `1px solid ${BORD}` : "none" }}
                      onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}>
                      <div style={{ width: "36px", height: "36px", background: Y, border: `2px solid ${B}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", flexShrink: 0, borderRadius: "6px" }}>
                        {course.emoji}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "15px", fontWeight: 700, color: B }}>{course.title}</span>
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", background: course.category === "training" ? "#DBEAFE" : "#EDE9FE", color: course.category === "training" ? "#1D4ED8" : "#7C3AED", borderRadius: "4px", ...MONO }}>
                            {course.category.toUpperCase()}
                          </span>
                          {course.section && <span style={{ fontSize: "10px", padding: "2px 8px", background: "#F3F4F6", color: MUTE, borderRadius: "4px", ...MONO }}>{course.section}</span>}
                          {course.is_recommended && <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", background: "#FEF9C3", color: "#A16207", borderRadius: "4px", ...MONO }}>★ RECOMMENDED</span>}
                          {!course.is_active && <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", background: "#F3F4F6", color: MUTE, borderRadius: "4px", ...MONO }}>HIDDEN</span>}
                        </div>
                        <div style={{ fontSize: "11px", color: MUTE, marginTop: "3px", ...MONO }}>{course.total_topics} topics · order #{course.order}</div>
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                        <Btn small color="#2563EB" onClick={e => { e.stopPropagation(); setEditCourse(course); setCourseForm({ title: course.title, category: course.category, section: course.section || "", description: course.description, emoji: course.emoji, image_url: course.image_url || "", duration: course.duration || "", order: course.order, is_active: course.is_active, is_recommended: course.is_recommended }); setShowAddCourse(true); }}>Edit</Btn>
                        <Btn small color={RED} onClick={e => { e.stopPropagation(); handleDeleteCourse(course.id, course.title); }}>Delete</Btn>
                      </div>
                      <span style={{ fontSize: "18px", color: MUTE, userSelect: "none", transform: expandedCourse === course.id ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>›</span>
                    </div>

                    {/* Topics expanded section */}
                    {expandedCourse === course.id && (
                      <div style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                          <span style={{ fontSize: "12px", fontWeight: 700, color: B, ...MONO }}>TOPICS ({course.topics.length})</span>
                          <Btn small onClick={() => { setShowBulkTopic(course.id); setBulkTopicMode("video"); setBulkVideoText(""); setBulkQATitle(""); setBulkQAText(""); setBulkMixedTitle(""); setBulkMixedUrl(""); setBulkMixedDuration(""); setBulkMixedQAText(""); setBulkDSAText(""); setBulkArticleTitle(""); setBulkArticleQAText(""); }}>+ Add Topics</Btn>
                        </div>

                        {course.topics.length === 0 ? (
                          <div style={{ textAlign: "center", padding: "24px", border: `2px dashed ${BORD}`, borderRadius: "8px", color: MUTE, fontSize: "13px" }}>
                            No topics yet. Click "+ Add Topics" to get started.
                          </div>
                        ) : (
                          <div style={{ border: `1px solid ${BORD}`, borderRadius: "8px", overflow: "hidden" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 90px 90px 130px", background: B, padding: "8px 14px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", color: Y, gap: "10px" }}>
                              <span>#</span><span>TITLE</span><span>TYPE</span><span>DURATION</span><span>ACTIONS</span>
                            </div>
                            {course.topics.map((topic, idx) => (
                              <div key={topic.id} style={{ display: "grid", gridTemplateColumns: "40px 1fr 90px 90px 130px", padding: "10px 14px", borderTop: `1px solid ${BORD}`, alignItems: "center", gap: "10px", background: idx % 2 === 0 ? W : BG }}>
                                <span style={{ fontSize: "12px", fontWeight: 700, color: MUTE, textAlign: "center", ...MONO }}>{idx + 1}</span>
                                <div>
                                  <div style={{ fontSize: "13px", fontWeight: 600, color: B }}>{topic.title}</div>
                                  {topic.video_url && <div style={{ fontSize: "10px", color: "#2563EB", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", ...MONO }}>{topic.video_url}</div>}
                                  {topic.qa_items?.length > 0 && <div style={{ fontSize: "10px", color: "#7C3AED", marginTop: "2px", ...MONO }}>{topic.qa_items.length} Q&A pairs</div>}
                                </div>
                                <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", background: topic.content_type === "video" ? "#DBEAFE" : topic.content_type === "qa" ? "#EDE9FE" : topic.content_type === "dsa" ? "#FEF3C7" : topic.content_type === "mcq" ? "#FCE7F3" : topic.content_type === "article" ? "#ECFDF5" : "#DCFCE7", color: topic.content_type === "video" ? "#1D4ED8" : topic.content_type === "qa" ? "#7C3AED" : topic.content_type === "dsa" ? "#D97706" : topic.content_type === "mcq" ? "#BE185D" : topic.content_type === "article" ? "#065F46" : "#16A34A", borderRadius: "4px", ...MONO, textAlign: "center" }}>
                                  {(topic.content_type || "video").toUpperCase()}
                                </span>
                                <span style={{ fontSize: "12px", color: MUTE, ...MONO }}>{topic.duration || "—"}</span>
                                <div style={{ display: "flex", gap: "6px" }}>
                                  <Btn small color="#2563EB" onClick={() => {
                                    setEditTopic({ courseId: course.id, topic });
                                    const qaText = (topic.qa_items || []).map((q: { question: string; answer: string }) => `Q: ${q.question}\nA: ${q.answer}`).join("\n\n");
                                    const mcqText = (topic.mcq_items || []).map((m: { question: string; options: string[]; correct_index: number }) =>
                                      `Q: ${m.question}\n${m.options.map((o, i) => (i === m.correct_index ? `* ${o}` : `- ${o}`)).join("\n")}`
                                    ).join("\n\n");
                                    setTopicForm({ title: topic.title, content_type: topic.content_type || "video", video_url: topic.video_url, duration: topic.duration, qa_text: qaText, mcq_text: mcqText, difficulty: topic.difficulty || "Easy", platform: topic.platform || "LeetCode" });
                                  }}>Edit</Btn>
                                  <Btn small color={RED} onClick={() => handleDeleteTopic(course.id, topic.id, topic.title)}>Del</Btn>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Class Messages Tab ──────────────────────────────────────── */}
        {tab === "class_msgs" && <ClassMessagesTab />}

      </div>

      {/* ── Course & Topic Modals ────────────────────────────────────── */}
      {(showAddCourse) && (
        <Modal title={editCourse ? `Edit Course` : "New Course"} onClose={() => { setShowAddCourse(false); setEditCourse(null); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <Input label="TITLE" type="text" placeholder="e.g. Generative AI for Beginners" value={courseForm.title} onChange={e => setCourseForm(f => ({ ...f, title: e.target.value }))} />
            <div style={{ display: "flex", gap: "10px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>CATEGORY</label>
                <select value={courseForm.category} onChange={e => setCourseForm(f => ({ ...f, category: e.target.value }))}
                  style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none" }}>
                  <option value="training">Courses</option>
                  <option value="placement">Placements</option>
                  <option value="interviews">Interviews</option>
                  <option value="career_kit">Career Kit</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <Input label="SECTION (optional)" type="text" placeholder="e.g. Interview Prep" value={courseForm.section} onChange={e => setCourseForm(f => ({ ...f, section: e.target.value }))} />
              </div>
              <div style={{ width: "120px" }}>
                <Input label="DURATION (optional)" type="text" placeholder="e.g. 2:30:00" value={courseForm.duration} onChange={e => setCourseForm(f => ({ ...f, duration: e.target.value }))} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>COVER IMAGE URL (optional)</label>
              <input type="url" value={courseForm.image_url} onChange={e => setCourseForm(f => ({ ...f, image_url: e.target.value }))}
                placeholder="https://... paste any image URL"
                style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", boxSizing: "border-box" as const }} />
              {courseForm.image_url && (
                <img src={courseForm.image_url} alt="preview" style={{ marginTop: "8px", width: "100%", height: "120px", objectFit: "cover", borderRadius: "6px", border: `1px solid ${BORD}` }} />
              )}
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>DESCRIPTION (optional)</label>
              <textarea value={courseForm.description} onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))} rows={3}
                placeholder="Describe what students will learn in this course"
                style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", resize: "vertical", boxSizing: "border-box" as const }} />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <Input label="DISPLAY ORDER" type="number" value={String(courseForm.order)} onChange={e => setCourseForm(f => ({ ...f, order: Number(e.target.value) }))} />
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>VISIBLE</label>
                <select value={courseForm.is_active ? "yes" : "no"} onChange={e => setCourseForm(f => ({ ...f, is_active: e.target.value === "yes" }))}
                  style={{ padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none" }}>
                  <option value="yes">Yes</option>
                  <option value="no">Hidden</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>RECOMMENDED</label>
                <select value={courseForm.is_recommended ? "yes" : "no"} onChange={e => setCourseForm(f => ({ ...f, is_recommended: e.target.value === "yes" }))}
                  style={{ padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none" }}>
                  <option value="no">No</option>
                  <option value="yes">Yes ★</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Btn onClick={() => { setShowAddCourse(false); setEditCourse(null); }} color={MUTE} small>Cancel</Btn>
              <Btn onClick={handleSaveCourse} small>{editCourse ? "Save Changes" : "Create Course"}</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Bulk Add Topics Modal */}
      {showBulkTopic && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px" }}>
          <div style={{ backgroundColor: W, border: `2px solid ${B}`, borderRadius: "12px", padding: "32px", width: "100%", maxWidth: "560px", boxShadow: `6px 6px 0 ${Y}`, ...MONO, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: B }}>Add Topics</h3>
              <button onClick={() => setShowBulkTopic(null)} style={{ background: "none", border: "none", cursor: "pointer", color: MUTE }}><X size={20} /></button>
            </div>

            {/* Mode tabs */}
            <div style={{ display: "flex", gap: "0", marginBottom: "20px", border: `2px solid ${BORD}`, borderRadius: "6px", overflow: "hidden" }}>
              {(["video", "dsa", "article", "qa", "mixed"] as const).map((mode) => {
                const labels: Record<string, string> = { video: "Video", dsa: "DSA", article: "Article", qa: "Q&A Only", mixed: "Video+Q&A" };
                return (
                  <button key={mode} onClick={() => setBulkTopicMode(mode)}
                    style={{ flex: 1, padding: "9px 4px", border: "none", background: bulkTopicMode === mode ? B : "transparent", color: bulkTopicMode === mode ? Y : MUTE, fontSize: "10px", fontWeight: 700, cursor: "pointer", ...MONO, transition: "all 0.12s" }}>
                    {labels[mode]}
                  </button>
                );
              })}
            </div>

            {bulkTopicMode === "video" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <p style={{ fontSize: "12px", color: MUTE, margin: 0 }}>Format: <strong>Title, URL, Duration</strong> — one topic per line. Duration as <strong>mm:ss</strong> (e.g. 9:39). Also handles two-line format where duration is on the next line.</p>
                <textarea
                  value={bulkVideoText}
                  onChange={e => setBulkVideoText(e.target.value)}
                  rows={10}
                  placeholder={"Introduction to ML, https://youtube.com/..., 9:39\nNeural Networks, https://youtube.com/..., 29:14"}
                  style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "12px", ...MONO, outline: "none", resize: "vertical", boxSizing: "border-box" as const }}
                />
              </div>
            )}

            {bulkTopicMode === "qa" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Input label="TOPIC TITLE" type="text" placeholder="e.g. Python Interview Questions" value={bulkQATitle} onChange={e => setBulkQATitle(e.target.value)} />
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>Q&A PAIRS</label>
                  <p style={{ fontSize: "11px", color: MUTE, marginBottom: "8px" }}>Use <code>Q:</code> and <code>A:</code> prefixes, separated by blank lines.</p>
                  <textarea
                    value={bulkQAText}
                    onChange={e => setBulkQAText(e.target.value)}
                    rows={12}
                    placeholder={"Q: What is a list in Python?\nA: A list is a mutable ordered collection.\n\nQ: What is a tuple?\nA: A tuple is an immutable ordered collection."}
                    style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "12px", ...MONO, outline: "none", resize: "vertical", boxSizing: "border-box" as const }}
                  />
                </div>
              </div>
            )}

            {bulkTopicMode === "mixed" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Input label="TOPIC TITLE" type="text" placeholder="e.g. Python + Interview Questions" value={bulkMixedTitle} onChange={e => setBulkMixedTitle(e.target.value)} />
                <Input label="VIDEO URL" type="url" placeholder="https://youtube.com/..." value={bulkMixedUrl} onChange={e => setBulkMixedUrl(e.target.value)} />
                <Input label="DURATION (optional)" type="text" placeholder="e.g. 9:39" value={bulkMixedDuration} onChange={e => setBulkMixedDuration(e.target.value)} />
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>Q&A PAIRS (optional)</label>
                  <textarea
                    value={bulkMixedQAText}
                    onChange={e => setBulkMixedQAText(e.target.value)}
                    rows={8}
                    placeholder={"Q: What is...\nA: It is...\n\nQ: How does...\nA: It works by..."}
                    style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "12px", ...MONO, outline: "none", resize: "vertical", boxSizing: "border-box" as const }}
                  />
                </div>
              </div>
            )}

            {bulkTopicMode === "dsa" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <p style={{ fontSize: "12px", color: MUTE, margin: 0 }}>Format: <strong>Problem Name, URL, Difficulty, Platform</strong> — one per line.<br />e.g. <code>Two Sum, https://leetcode.com/problems/two-sum/, Easy, LeetCode</code></p>
                <textarea
                  value={bulkDSAText}
                  onChange={e => setBulkDSAText(e.target.value)}
                  rows={10}
                  placeholder={"Two Sum, https://leetcode.com/problems/two-sum/, Easy, LeetCode\nMerge Intervals, https://leetcode.com/problems/merge-intervals/, Medium, LeetCode"}
                  style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "12px", ...MONO, outline: "none", resize: "vertical", boxSizing: "border-box" as const }}
                />
              </div>
            )}

            {bulkTopicMode === "article" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <Input label="ARTICLE TITLE" type="text" placeholder="e.g. Python Interview Questions" value={bulkArticleTitle} onChange={e => setBulkArticleTitle(e.target.value)} />
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>QUESTIONS & ANSWERS</label>
                  <p style={{ fontSize: "11px", color: MUTE, marginBottom: "8px" }}>Use <code>Q:</code> and <code>A:</code> prefixes, separated by blank lines.</p>
                  <textarea
                    value={bulkArticleQAText}
                    onChange={e => setBulkArticleQAText(e.target.value)}
                    rows={12}
                    placeholder={"Q: What is a decorator in Python?\nA: A decorator is a function that wraps another function...\n\nQ: Explain list comprehension.\nA: List comprehension provides a concise way to create lists..."}
                    style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "12px", ...MONO, outline: "none", resize: "vertical", boxSizing: "border-box" as const }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "20px" }}>
              <Btn onClick={() => setShowBulkTopic(null)} color={MUTE} small>Cancel</Btn>
              <Btn onClick={handleBulkAddTopics} small>Add Topics</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Edit Topic Modal */}
      {editTopic && (
        <Modal title="Edit Topic" onClose={() => { setEditTopic(null); setTopicForm({ title: "", content_type: "video", video_url: "", duration: "", qa_text: "", mcq_text: "", difficulty: "Easy", platform: "LeetCode" }); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <Input label="TOPIC TITLE" type="text" value={topicForm.title} onChange={e => setTopicForm(f => ({ ...f, title: e.target.value }))} />
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>CONTENT TYPE</label>
              <select value={topicForm.content_type} onChange={e => setTopicForm(f => ({ ...f, content_type: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none" }}>
                <option value="video">Video</option>
                <option value="qa">Q&A Only</option>
                <option value="mixed">Video + Q&A</option>
                <option value="dsa">DSA Problem</option>
                <option value="mcq">MCQ Quiz</option>
                <option value="article">Article (Interview Q&A)</option>
              </select>
            </div>
            {(topicForm.content_type === "video" || topicForm.content_type === "mixed") && (
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 2 }}><Input label="VIDEO URL" type="url" placeholder="https://youtube.com/..." value={topicForm.video_url} onChange={e => setTopicForm(f => ({ ...f, video_url: e.target.value }))} /></div>
                <div style={{ flex: 1 }}><Input label="DURATION" type="text" placeholder="9:39" value={topicForm.duration} onChange={e => setTopicForm(f => ({ ...f, duration: e.target.value }))} /></div>
              </div>
            )}
            {topicForm.content_type === "dsa" && (
              <>
                <Input label="PROBLEM URL (LeetCode / GFG / etc.)" type="url" placeholder="https://leetcode.com/problems/..." value={topicForm.video_url} onChange={e => setTopicForm(f => ({ ...f, video_url: e.target.value }))} />
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>DIFFICULTY</label>
                    <select value={topicForm.difficulty} onChange={e => setTopicForm(f => ({ ...f, difficulty: e.target.value }))}
                      style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none" }}>
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>PLATFORM</label>
                    <select value={topicForm.platform} onChange={e => setTopicForm(f => ({ ...f, platform: e.target.value }))}
                      style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none" }}>
                      <option value="LeetCode">LeetCode</option>
                      <option value="GFG">GFG</option>
                      <option value="HackerRank">HackerRank</option>
                      <option value="CodeChef">CodeChef</option>
                      <option value="Codeforces">Codeforces</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </>
            )}
            {(topicForm.content_type === "qa" || topicForm.content_type === "mixed" || topicForm.content_type === "article") && (
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>Q&A PAIRS</label>
                <textarea value={topicForm.qa_text} onChange={e => setTopicForm(f => ({ ...f, qa_text: e.target.value }))} rows={8}
                  placeholder={"Q: What is...\nA: It is...\n\nQ: How does...\nA: ..."}
                  style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "12px", ...MONO, outline: "none", resize: "vertical", boxSizing: "border-box" as const }} />
              </div>
            )}
            {topicForm.content_type === "mcq" && (
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>MCQ QUESTIONS</label>
                <p style={{ fontSize: "11px", color: MUTE, marginBottom: "8px" }}>Use <code>Q:</code> for question, <code>- option</code> for wrong answers, <code>* option</code> for correct answer.</p>
                <textarea value={topicForm.mcq_text} onChange={e => setTopicForm(f => ({ ...f, mcq_text: e.target.value }))} rows={10}
                  placeholder={"Q: What is Python?\n- A compiled language\n* An interpreted language\n- A markup language\n\nQ: What does len() return?\n* The number of items in an object\n- The last index\n- The memory size"}
                  style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "12px", ...MONO, outline: "none", resize: "vertical", boxSizing: "border-box" as const }} />
              </div>
            )}
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Btn onClick={() => { setEditTopic(null); setTopicForm({ title: "", content_type: "video", video_url: "", duration: "", qa_text: "", mcq_text: "", difficulty: "Easy", platform: "LeetCode" }); }} color={MUTE} small>Cancel</Btn>
              <Btn onClick={handleSaveTopic} small>Save Changes</Btn>
            </div>
          </div>
        </Modal>
      )}

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
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>BATCH</label>
              <select value={studentForm.batchId} onChange={e => {
                const b = batches.find(x => x.id === e.target.value);
                setStudentForm(f => ({ ...f, batchId: e.target.value, resumeEmail: b?.resume_enhancer_email || f.resumeEmail, resumePassword: b?.resume_enhancer_password || f.resumePassword }));
              }} style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", boxSizing: "border-box" as const }}>
                <option value="">� No batch (manual entry) �</option>
                {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              {studentForm.batchId && <p style={{ fontSize: "11px", color: "#16A34A", marginTop: "4px" }}>? Resume credentials will be auto-filled from batch.</p>}
            </div>
            <Input label="SHARED PASSWORD" type="text" placeholder="Min 8 characters � same for all" value={studentForm.password} onChange={e => setStudentForm(f => ({ ...f, password: e.target.value }))} />
            <p style={{ fontSize: "11px", color: MUTE }}>Each student must change this password on first login.</p>
            {!studentForm.batchId && (
              <div style={{ borderTop: `1px solid ${BORD}`, paddingTop: "14px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.08em", marginBottom: "10px" }}>RESUME ENHANCER ACCESS (optional)</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <Input label="RESUME TOOL EMAIL" type="text" placeholder="e.g. student123@gmail.com" value={studentForm.resumeEmail} onChange={e => setStudentForm(f => ({ ...f, resumeEmail: e.target.value }))} />
                  <Input label="RESUME TOOL PASSWORD" type="text" placeholder="Leave blank if not assigning" value={studentForm.resumePassword} onChange={e => setStudentForm(f => ({ ...f, resumePassword: e.target.value }))} />
                </div>
              </div>
            )}
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
        <Modal title={`Reset Password � ${resetTarget.name}`} onClose={() => setResetTarget(null)}>
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
                {salespersons.map(sp => <option key={sp.id} value={sp.id}>{sp.name} � {sp.email}</option>)}
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



      {/* Add / Edit Batch Modal */}
      {(showAddBatch || editBatch) && (
        <Modal title={editBatch ? `Edit � ${editBatch.name}` : "New Batch"} onClose={() => { setShowAddBatch(false); setEditBatch(null); setBatchForm(emptyBatchForm); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxHeight: "75vh", overflowY: "auto" }}>
            <Input label="BATCH NAME" type="text" placeholder="e.g. Batch April 2026" value={batchForm.name} onChange={e => setBatchForm(f => ({ ...f, name: e.target.value }))} />
            <div style={{ borderTop: `1px solid ${BORD}`, paddingTop: "12px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.08em", marginBottom: "10px" }}>RESUME ENHANCER CREDENTIALS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <Input label="RESUME TOOL EMAIL" type="text" placeholder="e.g. batch1@gmail.com" value={batchForm.resumeEmail} onChange={e => setBatchForm(f => ({ ...f, resumeEmail: e.target.value }))} />
                <Input label="RESUME TOOL PASSWORD" type="text" placeholder="Leave blank if not assigning" value={batchForm.resumePassword} onChange={e => setBatchForm(f => ({ ...f, resumePassword: e.target.value }))} />
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${BORD}`, paddingTop: "12px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.08em", marginBottom: "4px" }}>CALENDAR EMBED URLS</p>
              <p style={{ fontSize: "11px", color: MUTE, marginBottom: "10px" }}>Paste the full embed code Google gives you � the URL will be extracted automatically.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {calendarInput("UPSTRIDE PROGRAM CALENDAR (shared by all batches)", "commonUrl")}
                {calendarInput("STANDUP CALLS CALENDAR (batch-specific)", "url1")}
                {calendarInput("EXTRA SESSIONS CALENDAR (batch-specific)", "url2")}
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", paddingTop: "4px" }}>
              <Btn onClick={() => { setShowAddBatch(false); setEditBatch(null); setBatchForm(emptyBatchForm); }} color={MUTE} small>Cancel</Btn>
              <Btn onClick={handleSaveBatch} small>{editBatch ? "Save Changes" : "Create Batch"}</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Job Modal */}
      {showAddJob && (
        <Modal title={editJob ? "Edit Job" : "Add Job"} onClose={() => { setShowAddJob(false); setEditJob(null); }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <Input label="ROLE / POSITION" type="text" placeholder="e.g. Software Developer Intern" value={jobForm.role} onChange={e => setJobForm(f => ({ ...f, role: e.target.value }))} />
            <Input label="COMPANY" type="text" placeholder="e.g. TCS, Google" value={jobForm.company} onChange={e => setJobForm(f => ({ ...f, company: e.target.value }))} />
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>CATEGORY</label>
              <select value={jobForm.category} onChange={e => setJobForm(f => ({ ...f, category: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none" }}>
                <option value="internship">Internship</option>
                <option value="fulltime">Full-time</option>
                <option value="parttime">Part-time</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: "6px" }}>DESCRIPTION (optional)</label>
              <textarea value={jobForm.description} onChange={e => setJobForm(f => ({ ...f, description: e.target.value }))} rows={3}
                placeholder="Short description of the role"
                style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", resize: "vertical", boxSizing: "border-box" as const }} />
            </div>
            <Input label="APPLY LINK" type="url" placeholder="https://..." value={jobForm.apply_link} onChange={e => setJobForm(f => ({ ...f, apply_link: e.target.value }))} />
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Btn onClick={() => { setShowAddJob(false); setEditJob(null); }} color={MUTE} small>Cancel</Btn>
              <Btn small onClick={async () => {
                if (!jobForm.role.trim() || !jobForm.company.trim()) { toast({ title: "Role and company are required", variant: "destructive" }); return; }
                try {
                  if (editJob) {
                    await api.admin.updateJob(editJob.id, jobForm);
                    toast({ title: "Job updated" });
                  } else {
                    await api.admin.createJob(jobForm);
                    toast({ title: "Job added" });
                  }
                  setShowAddJob(false); setEditJob(null); loadJobs();
                } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
              }}>{editJob ? "Save Changes" : "Add Job"}</Btn>
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
