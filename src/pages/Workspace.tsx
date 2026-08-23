import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, CheckCircle2, Circle, Clock, ArrowLeft, Tag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

const Y = "#FFE500"; const B = "#0A0A0A"; const W = "#FFFFFF"; const BG = "#FAFAFA";
const BORD = "#E5E5E5"; const MUTE = "#6B7280"; const GREEN = "#16A34A";
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

type TaskStatus = "todo" | "in_progress" | "done";
type Category = "general" | "resume" | "linkedin" | "project" | "interview";

interface Task {
  id: string; title: string; notes: string; status: TaskStatus;
  category: Category; created_at: string;
}

const CATEGORIES: Record<Category, { label: string; color: string }> = {
  general:   { label: "General",    color: "#6B7280" },
  resume:    { label: "Resume",     color: "#0369A1" },
  linkedin:  { label: "LinkedIn",   color: "#0A66C2" },
  project:   { label: "Project",    color: "#7C3AED" },
  interview: { label: "Interview",  color: "#D97706" },
};

const STATUS_ICON: Record<TaskStatus, React.ReactNode> = {
  todo:        <Circle size={17} color={MUTE} />,
  in_progress: <Clock size={17} color="#D97706" />,
  done:        <CheckCircle2 size={17} color={GREEN} />,
};

export default function Workspace() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", notes: "", category: "general" as Category });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.student.getWorkspace() as { data: { tasks: Task[] } };
      setTasks(r.data.tasks);
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addTask = async () => {
    if (!form.title.trim()) { toast({ title: "Enter a task title", variant: "destructive" }); return; }
    try {
      const r = await api.student.addTask(form) as { data: { task: Task } };
      setTasks(prev => [r.data.task, ...prev]);
      setForm({ title: "", notes: "", category: "general" });
      setAdding(false);
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const cycleStatus = async (task: Task) => {
    const next: Record<TaskStatus, TaskStatus> = { todo: "in_progress", in_progress: "done", done: "todo" };
    const newStatus = next[task.status];
    try {
      await api.student.updateTask(task.id, { status: newStatus });
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.student.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (e: unknown) { toast({ title: "Error", description: (e as Error).message, variant: "destructive" }); }
  };

  const filtered = tasks.filter(t => {
    if (filter !== "all" && t.status !== filter) return false;
    if (catFilter !== "all" && t.category !== catFilter) return false;
    return true;
  });

  const counts = { todo: 0, in_progress: 0, done: 0 };
  tasks.forEach(t => counts[t.status]++);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, ...MONO }}>
      <div style={{ backgroundColor: B, padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `3px solid ${Y}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => navigate("/portal")} style={{ background: "none", border: "none", cursor: "pointer", color: W, display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", ...MONO }}>
            <ArrowLeft size={14} /> Back to Portal
          </button>
          <span style={{ color: `${W}40` }}>|</span>
          <span style={{ color: W, fontSize: "13px", fontWeight: 700 }}>My Workspace</span>
        </div>
        <div style={{ backgroundColor: Y, color: B, padding: "4px 10px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em" }}>Mamlesh</div>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "32px 24px" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          {[
            { label: "To Do", count: counts.todo, color: MUTE },
            { label: "In Progress", count: counts.in_progress, color: "#D97706" },
            { label: "Done", count: counts.done, color: GREEN },
          ].map(({ label, count, color }) => (
            <div key={label} style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "8px", padding: "12px 20px", display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "22px", fontWeight: 700, color }}>{count}</span>
              <span style={{ fontSize: "11px", color: MUTE, letterSpacing: "0.08em" }}>{label.toUpperCase()}</span>
            </div>
          ))}
        </div>

        {/* Filters + Add */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
          {["all", "todo", "in_progress", "done"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: "6px 14px", borderRadius: "20px", border: `2px solid ${filter === s ? B : BORD}`, backgroundColor: filter === s ? B : W, color: filter === s ? Y : MUTE, fontSize: "11px", fontWeight: 700, cursor: "pointer", ...MONO }}>
              {s === "all" ? "All" : s === "in_progress" ? "In Progress" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
          <span style={{ color: BORD }}>|</span>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
            style={{ padding: "6px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "11px", ...MONO, outline: "none" }}>
            <option value="all">All Categories</option>
            {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <button onClick={() => setAdding(true)}
            style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px", backgroundColor: B, color: Y, border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: "pointer", ...MONO, boxShadow: `2px 2px 0 ${Y}` }}>
            <Plus size={14} /> Add Task
          </button>
        </div>

        {/* Add Task Form */}
        {adding && (
          <div style={{ backgroundColor: W, border: `2px solid ${B}`, borderRadius: "10px", padding: "20px", marginBottom: "16px", boxShadow: `4px 4px 0 ${Y}` }}>
            <input
              autoFocus
              placeholder="Task title..."
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              onKeyDown={e => e.key === "Enter" && addTask()}
              style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "14px", fontWeight: 600, ...MONO, outline: "none", boxSizing: "border-box" as const, marginBottom: "10px" }}
            />
            <textarea
              placeholder="Notes (optional)..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={2}
              style={{ width: "100%", padding: "8px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", resize: "vertical", boxSizing: "border-box" as const, marginBottom: "10px" }}
            />
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}
                style={{ padding: "7px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "12px", ...MONO, outline: "none" }}>
                {Object.entries(CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <button onClick={addTask} style={{ padding: "8px 16px", backgroundColor: B, color: Y, border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: "pointer", ...MONO }}>Save</button>
              <button onClick={() => setAdding(false)} style={{ padding: "8px 12px", backgroundColor: W, color: MUTE, border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "12px", cursor: "pointer", ...MONO }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Task List */}
        {loading ? (
          <p style={{ textAlign: "center", color: MUTE, padding: "40px" }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "10px" }}>
            <p style={{ color: MUTE, fontSize: "14px" }}>No tasks yet. Add your first task above!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filtered.map(task => {
              const cat = CATEGORIES[task.category] || CATEGORIES.general;
              return (
                <div key={task.id} style={{ backgroundColor: W, border: `2px solid ${task.status === "done" ? `${BORD}` : BORD}`, borderRadius: "8px", padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: "12px", opacity: task.status === "done" ? 0.7 : 1 }}>
                  <button onClick={() => cycleStatus(task)} style={{ background: "none", border: "none", cursor: "pointer", flexShrink: 0, marginTop: "1px" }} title="Click to cycle status">
                    {STATUS_ICON[task.status]}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: B, textDecoration: task.status === "done" ? "line-through" : "none", marginBottom: task.notes ? "4px" : 0 }}>
                      {task.title}
                    </div>
                    {task.notes && <div style={{ fontSize: "12px", color: MUTE, lineHeight: 1.5 }}>{task.notes}</div>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", backgroundColor: `${cat.color}18`, color: cat.color }}>
                      {cat.label}
                    </span>
                    <button onClick={() => deleteTask(task.id)} style={{ background: "none", border: "none", cursor: "pointer", color: `${MUTE}80`, display: "flex", alignItems: "center" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
