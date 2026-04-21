import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, LogOut, RefreshCw, ChevronDown, StickyNote } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";

const Y = "#FFE500"; const B = "#0A0A0A"; const W = "#FFFFFF"; const BG = "#FAFAFA";
const BORD = "#E5E5E5"; const MUTE = "#6B7280";
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

type Status = "pending" | "picked" | "rejected" | "missed" | "joining" | "will_discuss";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: Status;
  notes: string;
  assigned_at: string;
  updated_at: string;
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  pending:      { label: "Pending",      color: "#6B7280", bg: "#F3F4F6" },
  picked:       { label: "Picked Call",  color: "#16A34A", bg: "#DCFCE7" },
  rejected:     { label: "Rejected",     color: "#DC2626", bg: "#FEE2E2" },
  missed:       { label: "Missed Call",  color: "#D97706", bg: "#FEF3C7" },
  joining:      { label: "Joining",      color: "#7C3AED", bg: "#EDE9FE" },
  will_discuss: { label: "Will Discuss", color: "#0369A1", bg: "#E0F2FE" },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as Status[];

export default function SalesPerson() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [openNotes, setOpenNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const name = localStorage.getItem("userName") || "Sales";
  const email = localStorage.getItem("userEmail") || "";

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.sales.myContacts(filter === "all" ? undefined : filter) as { data: { contacts: Contact[] } };
      setContacts(r.data.contacts);
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (contactId: string, status: Status, notes?: string) => {
    setUpdatingId(contactId);
    try {
      await api.sales.updateStatus(contactId, status, notes);
      setContacts(prev => prev.map(c => c.id === contactId ? { ...c, status, notes: notes ?? c.notes } : c));
      toast({ title: "Status updated" });
      if (openNotes === contactId) setOpenNotes(null);
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally { setUpdatingId(null); }
  };

  const logout = () => {
    ["token", "userRole", "userEmail", "userName", "mustChangePassword"].forEach(k => localStorage.removeItem(k));
    navigate("/login");
  };

  const filtered = contacts.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = contacts.filter(c => c.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, ...MONO }}>
      {/* Header */}
      <div style={{ backgroundColor: B, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px", borderBottom: `3px solid ${Y}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ backgroundColor: Y, color: B, padding: "4px 10px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em" }}>UPSTRIDE</div>
          <span style={{ color: W, fontSize: "13px", fontWeight: 600 }}>Sales — {name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: `${W}80`, fontSize: "12px" }}>{email}</span>
          <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "transparent", border: `1px solid ${W}40`, borderRadius: "6px", padding: "6px 12px", color: W, fontSize: "12px", cursor: "pointer", ...MONO }}>
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 24px" }}>
        {/* Status filter pills */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
          <button onClick={() => setFilter("all")}
            style={{ padding: "6px 14px", borderRadius: "20px", border: `2px solid ${filter === "all" ? B : BORD}`, backgroundColor: filter === "all" ? B : W, color: filter === "all" ? Y : MUTE, fontSize: "11px", fontWeight: 700, cursor: "pointer", ...MONO }}>
            ALL ({contacts.length})
          </button>
          {ALL_STATUSES.map(s => {
            const cfg = STATUS_CONFIG[s];
            const active = filter === s;
            return (
              <button key={s} onClick={() => setFilter(s)}
                style={{ padding: "6px 14px", borderRadius: "20px", border: `2px solid ${active ? cfg.color : BORD}`, backgroundColor: active ? cfg.bg : W, color: active ? cfg.color : MUTE, fontSize: "11px", fontWeight: 700, cursor: "pointer", ...MONO }}>
                {cfg.label} ({counts[s] || 0})
              </button>
            );
          })}
        </div>

        {/* Search + refresh */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
          <input
            placeholder="Search name, phone, email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: "220px", padding: "9px 14px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none" }}
          />
          <button onClick={load} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", border: `2px solid ${BORD}`, borderRadius: "6px", background: W, fontSize: "12px", cursor: "pointer", ...MONO, color: B }}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: MUTE }}>Loading contacts...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: MUTE, backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "10px" }}>
            <Phone size={36} color={BORD} style={{ margin: "0 auto 12px", display: "block" }} />
            <p>No contacts {filter !== "all" ? `with status "${STATUS_CONFIG[filter as Status]?.label}"` : "assigned"}</p>
          </div>
        ) : (
          <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "10px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: `${B}08`, borderBottom: `2px solid ${BORD}` }}>
                  {["#", "Name", "Phone", "Email", "Status", "Notes", "Actions"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "10px", fontWeight: 700, color: MUTE, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>{h.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => {
                  const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.pending;
                  return (
                    <>
                      <tr key={c.id} style={{ borderBottom: `1px solid ${BORD}`, backgroundColor: i % 2 === 0 ? W : `${B}02` }}>
                        <td style={{ padding: "10px 14px", fontSize: "12px", color: MUTE }}>{i + 1}</td>
                        <td style={{ padding: "10px 14px", fontSize: "13px", fontWeight: 600, color: B }}>{c.name}</td>
                        <td style={{ padding: "10px 14px" }}>
                          <a href={`tel:${c.phone}`} style={{ fontSize: "13px", color: B, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: "5px" }}>
                            <Phone size={12} /> {c.phone}
                          </a>
                        </td>
                        <td style={{ padding: "10px 14px", fontSize: "12px", color: MUTE }}>{c.email || "—"}</td>
                        <td style={{ padding: "10px 14px" }}>
                          <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "12px", backgroundColor: cfg.bg, color: cfg.color, whiteSpace: "nowrap" }}>
                            {cfg.label}
                          </span>
                        </td>
                        <td style={{ padding: "10px 14px", fontSize: "11px", color: MUTE, maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {c.notes || "—"}
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                            {/* Quick status buttons */}
                            <div style={{ position: "relative" }}>
                              <select
                                disabled={updatingId === c.id}
                                value={c.status}
                                onChange={e => updateStatus(c.id, e.target.value as Status)}
                                style={{ padding: "5px 8px", border: `2px solid ${B}`, borderRadius: "5px", fontSize: "11px", fontWeight: 700, ...MONO, cursor: "pointer", backgroundColor: W, color: B, outline: "none" }}
                              >
                                {ALL_STATUSES.map(s => (
                                  <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                                ))}
                              </select>
                            </div>
                            <button
                              onClick={() => { setOpenNotes(openNotes === c.id ? null : c.id); setNoteText(c.notes || ""); }}
                              style={{ padding: "5px 8px", border: `2px solid ${BORD}`, borderRadius: "5px", background: openNotes === c.id ? Y : W, cursor: "pointer", display: "flex", alignItems: "center" }}
                              title="Add note"
                            >
                              <StickyNote size={13} color={B} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {openNotes === c.id && (
                        <tr key={`${c.id}-notes`} style={{ backgroundColor: "#FFFDE7" }}>
                          <td colSpan={7} style={{ padding: "10px 14px" }}>
                            <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                              <textarea
                                value={noteText}
                                onChange={e => setNoteText(e.target.value)}
                                placeholder="Add a note about this call..."
                                rows={2}
                                style={{ flex: 1, padding: "8px 10px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "12px", ...MONO, outline: "none", resize: "vertical" }}
                              />
                              <button
                                onClick={() => updateStatus(c.id, c.status, noteText)}
                                style={{ padding: "8px 14px", backgroundColor: B, color: Y, border: "none", borderRadius: "6px", fontSize: "11px", fontWeight: 700, cursor: "pointer", ...MONO, whiteSpace: "nowrap" }}
                              >
                                Save Note
                              </button>
                              <button
                                onClick={() => setOpenNotes(null)}
                                style={{ padding: "8px 10px", backgroundColor: W, color: MUTE, border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "11px", cursor: "pointer", ...MONO }}
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p style={{ marginTop: "12px", fontSize: "11px", color: MUTE, textAlign: "right" }}>
          Showing {filtered.length} of {contacts.length} contacts
        </p>
      </div>
    </div>
  );
}
