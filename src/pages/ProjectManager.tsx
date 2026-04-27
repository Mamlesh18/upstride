import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, Video, FolderKanban, LogOut, RefreshCw, Github, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

const Y = "#FFE500"; const B = "#0A0A0A"; const W = "#FFFFFF"; const BG = "#FAFAFA";
const BORD = "#E5E5E5"; const MUTE = "#6B7280";
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

interface Project { id: string; title: string; description: string; project_link: string; meeting_link: string; github_link: string; day: string; time: string; }

export default function ProjectManager() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const name = localStorage.getItem("userName") || "Manager";
  const email = localStorage.getItem("userEmail") || "";

  const load = async () => {
    setLoading(true);
    try {
      const r = await api.projects.myProjects() as { data: { projects: Project[] } };
      setProjects(r.data.projects);
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const logout = () => {
    ["token", "userRole", "userEmail", "userName", "mustChangePassword"].forEach(k => localStorage.removeItem(k));
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, ...MONO }}>
      {/* Header */}
      <div style={{ backgroundColor: B, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px", borderBottom: `3px solid ${Y}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ backgroundColor: Y, color: B, padding: "4px 10px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em" }}>Upstrides</div>
          <span style={{ color: W, fontSize: "13px", fontWeight: 600 }}>Project Manager</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: `${W}80`, fontSize: "12px" }}>{email}</span>
          <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "transparent", border: `1px solid ${W}40`, borderRadius: "6px", padding: "6px 12px", color: W, fontSize: "12px", cursor: "pointer", ...MONO }}>
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Secret keys doc banner */}
        <a
          href="https://docs.google.com/document/d/14_Krx7K9ewXhhkUqx4x3kXTcFbZuda6sbypqleI8xe0/edit?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
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
          <div style={{ fontSize: "11px", fontWeight: 700, color: B, backgroundColor: Y, whiteSpace: "nowrap", padding: "6px 14px", borderRadius: "5px" }}>
            OPEN DOC →
          </div>
        </a>

        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: B, marginBottom: "4px" }}>
            Welcome, <span style={{ color: B, borderBottom: `3px solid ${Y}` }}>{name}</span>
          </h1>
          <p style={{ fontSize: "13px", color: MUTE }}>Your assigned projects and resources</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FolderKanban size={16} color={B} />
            <span style={{ fontSize: "13px", fontWeight: 700, color: B }}>{projects.length} PROJECT{projects.length !== 1 ? "S" : ""}</span>
          </div>
          <button onClick={load} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "transparent", border: `2px solid ${BORD}`, borderRadius: "6px", padding: "8px 14px", color: B, fontSize: "12px", cursor: "pointer", ...MONO }}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: MUTE, fontSize: "13px" }}>Loading projects...</div>
        ) : projects.length === 0 ? (
          <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", padding: "60px", textAlign: "center" }}>
            <FolderKanban size={40} color={BORD} style={{ margin: "0 auto 16px" }} />
            <p style={{ fontSize: "14px", color: MUTE }}>No projects assigned yet.</p>
            <p style={{ fontSize: "12px", color: MUTE, marginTop: "4px" }}>Contact your admin to get projects assigned.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {projects.map(p => (
              <div key={p.id} style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "12px", padding: "24px", boxShadow: `4px 4px 0 ${Y}`, display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: B, marginBottom: "6px" }}>{p.title}</h3>
                  {(p.day || p.time) && (
                    <div style={{ display: "flex", gap: "8px", marginBottom: "8px", flexWrap: "wrap" }}>
                      {p.day && (
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, backgroundColor: Y, color: B, padding: "3px 10px", border: `1px solid ${B}`, borderRadius: "4px" }}>
                          📅 {p.day}
                        </span>
                      )}
                      {p.time && (
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 700, backgroundColor: `${B}08`, color: B, padding: "3px 10px", border: `1px solid ${BORD}`, borderRadius: "4px" }}>
                          <Clock size={11} /> {p.time}
                        </span>
                      )}
                    </div>
                  )}
                  {p.description && <p style={{ fontSize: "12px", color: MUTE, lineHeight: 1.6 }}>{p.description}</p>}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto", paddingTop: "12px", borderTop: `1px solid ${BORD}` }}>
                  {p.project_link ? (
                    <a href={p.project_link} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", backgroundColor: B, color: Y, borderRadius: "6px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textDecoration: "none" }}>
                      <ExternalLink size={13} /> VIEW PROJECT
                    </a>
                  ) : (
                    <div style={{ padding: "8px 12px", backgroundColor: BORD, borderRadius: "6px", fontSize: "11px", color: MUTE }}>No project link</div>
                  )}
                  {p.meeting_link ? (
                    <a href={p.meeting_link} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", backgroundColor: W, color: B, border: `2px solid ${B}`, borderRadius: "6px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textDecoration: "none" }}>
                      <Video size={13} /> JOIN MEETING
                    </a>
                  ) : (
                    <div style={{ padding: "8px 12px", backgroundColor: BORD, borderRadius: "6px", fontSize: "11px", color: MUTE }}>No meeting link</div>
                  )}
                  {p.github_link && (
                    <a href={p.github_link} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", backgroundColor: "#111827", color: W, borderRadius: "6px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textDecoration: "none" }}>
                      <Github size={13} /> VIEW ON GITHUB
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
