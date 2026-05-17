import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ExternalLink, Video, FolderKanban, LogOut, RefreshCw,
  Github, Clock, ClipboardList, ChevronDown, Plus, X, Check,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

const Y = "#FFE500"; const B = "#0A0A0A"; const W = "#FFFFFF"; const BG = "#FAFAFA";
const BORD = "#E5E5E5"; const MUTE = "#6B7280";
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

interface Project { id: string; title: string; description: string; project_link: string; meeting_link: string; github_link: string; day: string; time: string; }
interface Batch { id: string; name: string; }
interface StandupStudent { email: string; name: string; role: string; updates: Record<string, string>; }
interface StandupData { batch_id: string; dates: string[]; students: StandupStudent[]; }

type PMTab = "projects" | "standup";

export default function ProjectManager() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<PMTab>("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const name = localStorage.getItem("userName") || "Manager";
  const email = localStorage.getItem("userEmail") || "";

  // Standup state
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [standupData, setStandupData] = useState<StandupData | null>(null);
  const [loadingStandup, setLoadingStandup] = useState(false);
  const [editingCell, setEditingCell] = useState<{ email: string; date: string } | null>(null);
  const [cellValue, setCellValue] = useState("");
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [roleValue, setRoleValue] = useState("");
  const [addingDate, setAddingDate] = useState(false);
  const [newDateLabel, setNewDateLabel] = useState("");
  const [savedIndicator, setSavedIndicator] = useState<string | null>(null);
  const cellRef = useRef<HTMLTextAreaElement>(null);
  const roleRef = useRef<HTMLInputElement>(null);

  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const r = await api.projects.myProjects() as { data: { projects: Project[] } };
      setProjects(r.data.projects);
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally { setLoadingProjects(false); }
  };

  const loadBatches = async () => {
    try {
      const r = await api.standup.pmBatches();
      setBatches(r.data.batches);
    } catch { /* no batches yet */ }
  };

  useEffect(() => { loadProjects(); loadBatches(); }, []);

  const loadStandup = async (batchId: string) => {
    setLoadingStandup(true);
    setStandupData(null);
    try {
      const r = await api.standup.pmGet(batchId);
      setStandupData(r.data);
    } catch (e: unknown) {
      toast({ title: "Error loading standup", description: (e as Error).message, variant: "destructive" });
    } finally { setLoadingStandup(false); }
  };

  const selectBatch = (batch: Batch) => {
    setSelectedBatch(batch);
    loadStandup(batch.id);
    setEditingCell(null);
    setEditingRole(null);
  };

  const showSaved = (label = "Saved") => {
    setSavedIndicator(label);
    setTimeout(() => setSavedIndicator(null), 1800);
  };

  const startEditCell = (email: string, date: string) => {
    const current = standupData?.students.find(s => s.email === email)?.updates[date] ?? "";
    setEditingCell({ email, date });
    setCellValue(current);
    setTimeout(() => cellRef.current?.focus(), 50);
  };

  const commitCell = async () => {
    if (!editingCell || !selectedBatch) { setEditingCell(null); return; }
    const { email, date } = editingCell;
    // Optimistically update local state
    setStandupData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        students: prev.students.map(s =>
          s.email === email ? { ...s, updates: { ...s.updates, [date]: cellValue } } : s
        ),
      };
    });
    setEditingCell(null);
    try {
      await api.standup.pmUpdateCell(selectedBatch.id, date, email, cellValue);
      showSaved();
    } catch {
      toast({ title: "Save failed", variant: "destructive" });
    }
  };

  const startEditRole = (email: string, currentRole: string) => {
    setEditingRole(email);
    setRoleValue(currentRole);
    setTimeout(() => roleRef.current?.focus(), 50);
  };

  const commitRole = async () => {
    if (!editingRole || !selectedBatch) { setEditingRole(null); return; }
    const email = editingRole;
    setStandupData(prev => {
      if (!prev) return prev;
      return { ...prev, students: prev.students.map(s => s.email === email ? { ...s, role: roleValue } : s) };
    });
    setEditingRole(null);
    try {
      await api.standup.pmUpdateRole(selectedBatch.id, email, roleValue);
      showSaved();
    } catch {
      toast({ title: "Save failed", variant: "destructive" });
    }
  };

  const addDateColumn = async () => {
    if (!newDateLabel.trim() || !selectedBatch) return;
    const label = newDateLabel.trim();
    try {
      await api.standup.pmAddDate(selectedBatch.id, label);
      setStandupData(prev => prev ? { ...prev, dates: [...prev.dates, label] } : prev);
      setNewDateLabel("");
      setAddingDate(false);
      showSaved("Column added");
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    }
  };

  const removeDateColumn = async (date: string) => {
    if (!selectedBatch) return;
    if (!window.confirm(`Remove column "${date}" and all its data?`)) return;
    try {
      await api.standup.pmRemoveDate(selectedBatch.id, date);
      setStandupData(prev => {
        if (!prev) return prev;
        const dates = prev.dates.filter(d => d !== date);
        const students = prev.students.map(s => {
          const updates = { ...s.updates };
          delete updates[date];
          return { ...s, updates };
        });
        return { ...prev, dates, students };
      });
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    }
  };

  const logout = () => {
    ["token", "userRole", "userEmail", "userName", "mustChangePassword"].forEach(k => localStorage.removeItem(k));
    navigate("/login");
  };

  const navBtn = (t: PMTab, label: string, Icon: typeof FolderKanban) => {
    const active = tab === t;
    return (
      <button
        onClick={() => setTab(t)}
        style={{
          display: "flex", alignItems: "center", gap: "10px",
          width: "100%", padding: "11px 16px",
          background: active ? Y : "transparent",
          border: "none",
          borderLeft: `3px solid ${active ? B : "transparent"}`,
          cursor: "pointer", textAlign: "left",
          transition: "all 0.12s", ...MONO,
        }}
        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = `${B}08`; }}
        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
      >
        <Icon size={15} color={active ? B : MUTE} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: "12px", fontWeight: active ? 700 : 500, color: active ? B : MUTE, letterSpacing: "0.04em" }}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, ...MONO, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ backgroundColor: B, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px", borderBottom: `3px solid ${Y}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ backgroundColor: Y, color: B, padding: "4px 10px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em" }}>Upstrides</div>
          <span style={{ color: W, fontSize: "13px", fontWeight: 600 }}>Project Manager</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {savedIndicator && (
            <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#4ade80", fontSize: "11px", fontWeight: 700 }}>
              <Check size={12} /> {savedIndicator}
            </span>
          )}
          <span style={{ color: `${W}80`, fontSize: "12px" }}>{email}</span>
          <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "transparent", border: `1px solid ${W}40`, borderRadius: "6px", padding: "6px 12px", color: W, fontSize: "12px", cursor: "pointer", ...MONO }}>
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      {/* Body: sidebar + content */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Sidebar */}
        <div style={{ width: "200px", flexShrink: 0, backgroundColor: W, borderRight: `2px solid ${BORD}`, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${BORD}` }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: B, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
            <div style={{ fontSize: "10px", color: MUTE, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "2px" }}>{email}</div>
          </div>
          <nav style={{ flex: 1, padding: "8px 0" }}>
            {navBtn("projects", "Projects", FolderKanban)}
            {navBtn("standup", "Standup Sheet", ClipboardList)}
          </nav>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 28px" }}>

          {/* ── PROJECTS TAB ── */}
          {tab === "projects" && (
            <>
              <a
                href="https://docs.google.com/document/d/14_Krx7K9ewXhhkUqx4x3kXTcFbZuda6sbypqleI8xe0/edit?usp=sharing"
                target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "14px 18px", backgroundColor: B, border: `2px solid ${Y}`, borderRadius: "8px", marginBottom: "28px", textDecoration: "none", boxShadow: `3px 3px 0 ${Y}` }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "20px" }}>🔑</span>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: Y, letterSpacing: "0.08em" }}>SECRET KEYS — FOR PROJECT USE ONLY</div>
                    <div style={{ fontSize: "11px", color: `${W}70`, marginTop: "2px" }}>
                      Use <strong style={{ color: W }}>gpt-4o-mini</strong> for LLM &nbsp;·&nbsp; <strong style={{ color: W }}>text-embedding-3-small</strong> for embeddings
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: B, backgroundColor: Y, whiteSpace: "nowrap", padding: "6px 14px", borderRadius: "5px" }}>OPEN DOC →</div>
              </a>

              <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h1 style={{ fontSize: "22px", fontWeight: 700, color: B, marginBottom: "4px" }}>
                    Projects <span style={{ color: MUTE, fontSize: "14px", fontWeight: 500 }}>({projects.length})</span>
                  </h1>
                  <p style={{ fontSize: "12px", color: MUTE }}>Your assigned projects and resources</p>
                </div>
                <button onClick={loadProjects} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "transparent", border: `2px solid ${BORD}`, borderRadius: "6px", padding: "8px 14px", color: B, fontSize: "12px", cursor: "pointer", ...MONO }}>
                  <RefreshCw size={13} /> Refresh
                </button>
              </div>

              {loadingProjects ? (
                <div style={{ textAlign: "center", padding: "60px", color: MUTE, fontSize: "13px" }}>Loading projects...</div>
              ) : projects.length === 0 ? (
                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", padding: "60px", textAlign: "center" }}>
                  <FolderKanban size={40} color={BORD} style={{ margin: "0 auto 16px" }} />
                  <p style={{ fontSize: "14px", color: MUTE }}>No projects assigned yet.</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
                  {projects.map(p => (
                    <div key={p.id} style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", padding: "24px", boxShadow: `4px 4px 0 ${Y}`, display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div>
                        <h3 style={{ fontSize: "15px", fontWeight: 700, color: B, marginBottom: "6px" }}>{p.title}</h3>
                        {(p.day || p.time) && (
                          <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                            {p.day && <span style={{ fontSize: "11px", fontWeight: 700, backgroundColor: Y, color: B, padding: "3px 10px", border: `1px solid ${B}`, borderRadius: "4px" }}>📅 {p.day}</span>}
                            {p.time && <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, backgroundColor: `${B}08`, color: B, padding: "3px 10px", border: `1px solid ${BORD}`, borderRadius: "4px" }}><Clock size={11} /> {p.time}</span>}
                          </div>
                        )}
                        {p.description && <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.6 }}>{p.description}</p>}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto", paddingTop: "12px", borderTop: `1px solid ${BORD}` }}>
                        {p.project_link ? (
                          <a href={p.project_link} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", backgroundColor: B, color: Y, borderRadius: "6px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textDecoration: "none" }}>
                            <ExternalLink size={13} /> VIEW PROJECT
                          </a>
                        ) : <div style={{ padding: "8px 12px", backgroundColor: BORD, borderRadius: "6px", fontSize: "11px", color: MUTE }}>No project link</div>}
                        {p.meeting_link ? (
                          <a href={p.meeting_link} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", backgroundColor: W, color: B, border: `2px solid ${B}`, borderRadius: "6px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textDecoration: "none" }}>
                            <Video size={13} /> JOIN MEETING
                          </a>
                        ) : <div style={{ padding: "8px 12px", backgroundColor: BORD, borderRadius: "6px", fontSize: "11px", color: MUTE }}>No meeting link</div>}
                        {p.github_link && (
                          <a href={p.github_link} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", backgroundColor: "#111827", color: W, borderRadius: "6px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textDecoration: "none" }}>
                            <Github size={13} /> VIEW ON GITHUB
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── STANDUP TAB ── */}
          {tab === "standup" && (
            <div>
              <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "22px", fontWeight: 700, color: B, marginBottom: "4px" }}>Standup Sheet</h1>
                <p style={{ fontSize: "12px", color: MUTE }}>Select a batch to view and edit daily standup updates</p>
              </div>

              {/* Batch selector */}
              <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <label style={{ fontSize: "11px", fontWeight: 700, color: B, letterSpacing: "0.1em" }}>BATCH</label>
                {batches.length === 0 ? (
                  <span style={{ fontSize: "12px", color: MUTE }}>No batches found. Create batches in the admin panel.</span>
                ) : (
                  <div style={{ position: "relative" }}>
                    <select
                      value={selectedBatch?.id ?? ""}
                      onChange={e => {
                        const b = batches.find(x => x.id === e.target.value);
                        if (b) selectBatch(b);
                      }}
                      style={{ appearance: "none", padding: "8px 32px 8px 12px", border: `2px solid ${selectedBatch ? B : BORD}`, borderRadius: "6px", fontSize: "13px", fontWeight: 600, color: B, backgroundColor: W, cursor: "pointer", outline: "none", ...MONO }}
                    >
                      <option value="">— select batch —</option>
                      {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <ChevronDown size={14} color={MUTE} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                )}
                {selectedBatch && (
                  <button onClick={() => loadStandup(selectedBatch.id)} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "transparent", border: `2px solid ${BORD}`, borderRadius: "6px", padding: "7px 12px", color: B, fontSize: "11px", cursor: "pointer", ...MONO }}>
                    <RefreshCw size={12} /> Refresh
                  </button>
                )}
              </div>

              {/* Standup table */}
              {!selectedBatch ? (
                <div style={{ backgroundColor: W, border: `2px dashed ${BORD}`, borderRadius: "12px", padding: "60px", textAlign: "center" }}>
                  <ClipboardList size={40} color={BORD} style={{ margin: "0 auto 16px" }} />
                  <p style={{ fontSize: "14px", color: MUTE }}>Select a batch to get started</p>
                </div>
              ) : loadingStandup ? (
                <div style={{ textAlign: "center", padding: "60px", color: MUTE, fontSize: "13px" }}>Loading standup data...</div>
              ) : !standupData ? null : (
                <>
                  {/* Toolbar */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "11px", color: MUTE }}>{standupData.students.length} student{standupData.students.length !== 1 ? "s" : ""} · {standupData.dates.length} date column{standupData.dates.length !== 1 ? "s" : ""}</span>
                    <div style={{ flex: 1 }} />
                    {addingDate ? (
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <input
                          autoFocus
                          value={newDateLabel}
                          onChange={e => setNewDateLabel(e.target.value)}
                          onKeyDown={e => { if (e.key === "Enter") addDateColumn(); if (e.key === "Escape") { setAddingDate(false); setNewDateLabel(""); } }}
                          placeholder="e.g. May 8"
                          style={{ padding: "6px 10px", border: `2px solid ${B}`, borderRadius: "5px", fontSize: "12px", outline: "none", ...MONO, width: "120px" }}
                        />
                        <button onClick={addDateColumn} style={{ padding: "6px 12px", backgroundColor: B, color: Y, border: "none", borderRadius: "5px", fontSize: "11px", fontWeight: 700, cursor: "pointer", ...MONO }}>Add</button>
                        <button onClick={() => { setAddingDate(false); setNewDateLabel(""); }} style={{ padding: "6px", backgroundColor: "transparent", border: `1px solid ${BORD}`, borderRadius: "5px", cursor: "pointer", display: "flex" }}>
                          <X size={13} color={MUTE} />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setAddingDate(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", backgroundColor: B, color: Y, border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 700, cursor: "pointer", letterSpacing: "0.08em", ...MONO }}>
                        <Plus size={13} /> ADD DATE COLUMN
                      </button>
                    )}
                  </div>

                  {standupData.students.length === 0 ? (
                    <div style={{ backgroundColor: W, border: `2px dashed ${BORD}`, borderRadius: "10px", padding: "40px", textAlign: "center" }}>
                      <p style={{ fontSize: "13px", color: MUTE }}>No students in this batch yet.</p>
                      <p style={{ fontSize: "11px", color: MUTE, marginTop: "4px" }}>Add students to this batch from the admin panel.</p>
                    </div>
                  ) : (
                    <div style={{ overflowX: "auto", borderRadius: "10px", border: `2px solid ${BORD}`, backgroundColor: W }}>
                      <table style={{ borderCollapse: "collapse", minWidth: "100%", fontFamily: "'IBM Plex Mono', monospace" }}>
                        <thead>
                          <tr style={{ backgroundColor: B }}>
                            {/* Name */}
                            <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "10px", fontWeight: 700, color: Y, letterSpacing: "0.12em", whiteSpace: "nowrap", minWidth: "160px", borderRight: `1px solid ${W}20` }}>
                              STUDENT
                            </th>
                            {/* Role */}
                            <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "10px", fontWeight: 700, color: Y, letterSpacing: "0.12em", whiteSpace: "nowrap", minWidth: "130px", borderRight: `1px solid ${W}20` }}>
                              ROLE
                            </th>
                            {/* Date columns */}
                            {standupData.dates.map(date => (
                              <th key={date} style={{ padding: "10px 16px", textAlign: "left", fontSize: "10px", fontWeight: 700, color: Y, letterSpacing: "0.1em", whiteSpace: "nowrap", minWidth: "200px", borderRight: `1px solid ${W}15`, position: "relative" }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                                  <span>{date}</span>
                                  <button
                                    onClick={() => removeDateColumn(date)}
                                    style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: `${W}60`, display: "flex", flexShrink: 0 }}
                                    title="Remove column"
                                  >
                                    <X size={11} />
                                  </button>
                                </div>
                              </th>
                            ))}
                            {standupData.dates.length === 0 && (
                              <th style={{ padding: "10px 16px", fontSize: "10px", color: `${W}50`, fontStyle: "italic" }}>
                                (no date columns yet — click ADD DATE COLUMN)
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {standupData.students.map((student, idx) => (
                            <tr key={student.email} style={{ backgroundColor: idx % 2 === 0 ? W : `${B}04`, borderTop: `1px solid ${BORD}` }}>
                              {/* Name */}
                              <td style={{ padding: "10px 16px", fontSize: "12px", fontWeight: 700, color: B, whiteSpace: "nowrap", borderRight: `1px solid ${BORD}`, verticalAlign: "top" }}>
                                <div style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: "140px" }}>{student.name}</div>
                                <div style={{ fontSize: "10px", color: MUTE, marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "140px" }}>{student.email}</div>
                              </td>
                              {/* Role */}
                              <td style={{ padding: "8px 12px", borderRight: `1px solid ${BORD}`, verticalAlign: "top", minWidth: "130px" }}>
                                {editingRole === student.email ? (
                                  <input
                                    ref={roleRef}
                                    value={roleValue}
                                    onChange={e => setRoleValue(e.target.value)}
                                    onBlur={commitRole}
                                    onKeyDown={e => { if (e.key === "Enter") commitRole(); if (e.key === "Escape") setEditingRole(null); }}
                                    style={{ width: "100%", padding: "4px 8px", border: `2px solid ${B}`, borderRadius: "4px", fontSize: "12px", outline: "none", ...MONO, boxSizing: "border-box" as const }}
                                  />
                                ) : (
                                  <div
                                    onClick={() => startEditRole(student.email, student.role)}
                                    style={{ fontSize: "12px", color: student.role ? B : MUTE, cursor: "text", padding: "4px 6px", borderRadius: "4px", minHeight: "28px", border: `1px solid transparent`, transition: "border-color 0.12s" }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORD; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "transparent"; }}
                                  >
                                    {student.role || <span style={{ color: BORD }}>click to set</span>}
                                  </div>
                                )}
                              </td>
                              {/* Date cells */}
                              {standupData.dates.map(date => {
                                const isEditing = editingCell?.email === student.email && editingCell?.date === date;
                                const value = student.updates[date] ?? "";
                                return (
                                  <td key={date} style={{ padding: "6px 10px", borderRight: `1px solid ${BORD}`, verticalAlign: "top", minWidth: "200px" }}>
                                    {isEditing ? (
                                      <textarea
                                        ref={cellRef}
                                        value={cellValue}
                                        onChange={e => setCellValue(e.target.value)}
                                        onBlur={commitCell}
                                        onKeyDown={e => { if (e.key === "Escape") { setEditingCell(null); } }}
                                        rows={4}
                                        style={{ width: "100%", padding: "6px 8px", border: `2px solid ${B}`, borderRadius: "4px", fontSize: "11px", outline: "none", resize: "vertical", ...MONO, boxSizing: "border-box" as const, minHeight: "80px" }}
                                      />
                                    ) : (
                                      <div
                                        onClick={() => startEditCell(student.email, date)}
                                        style={{
                                          fontSize: "11px", color: value ? B : MUTE, cursor: "text", padding: "6px 8px",
                                          borderRadius: "4px", minHeight: "60px", border: `1px solid transparent`,
                                          whiteSpace: "pre-wrap", lineHeight: 1.6, transition: "border-color 0.12s",
                                        }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = BORD; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "transparent"; }}
                                      >
                                        {value || <span style={{ color: BORD, fontStyle: "italic" }}>click to add update</span>}
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
