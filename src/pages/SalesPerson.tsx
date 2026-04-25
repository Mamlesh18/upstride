import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, LogOut, RefreshCw, StickyNote, UserPlus, X } from "lucide-react";
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

const STATUS_CONFIG: Record<Status, { label: string; shortLabel: string; color: string; bg: string; icon: string }> = {
  pending:      { label: "Haven't Called",  shortLabel: "Not Called",    color: "#6B7280", bg: "#F3F4F6", icon: "📵" },
  missed:       { label: "Missed Call",     shortLabel: "Missed",        color: "#D97706", bg: "#FEF3C7", icon: "📞" },
  picked:       { label: "Picked Up",       shortLabel: "Picked",        color: "#16A34A", bg: "#DCFCE7", icon: "✅" },
  will_discuss: { label: "Will Discuss",    shortLabel: "Will Discuss",  color: "#0369A1", bg: "#E0F2FE", icon: "💬" },
  rejected:     { label: "Rejected",        shortLabel: "Rejected",      color: "#DC2626", bg: "#FEE2E2", icon: "❌" },
  joining:      { label: "Joining",         shortLabel: "Joining",       color: "#7C3AED", bg: "#EDE9FE", icon: "🎉" },
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", phone: "", email: "" });
  const [addingContact, setAddingContact] = useState(false);

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

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name.trim() || !addForm.phone.trim()) {
      toast({ title: "Name and phone are required", variant: "destructive" });
      return;
    }
    setAddingContact(true);
    try {
      await api.sales.addContact({ name: addForm.name.trim(), phone: addForm.phone.trim(), email: addForm.email.trim() || undefined });
      toast({ title: "Contact added!" });
      setAddForm({ name: "", phone: "", email: "" });
      setShowAddModal(false);
      load();
    } catch (e: unknown) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally { setAddingContact(false); }
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

  const formatDay = (iso: string) => {
    try {
      const d = new Date(iso);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      if (d.toDateString() === today.toDateString()) return "Today";
      if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
      return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
    } catch { return iso; }
  };

  const groupedByDay = useMemo(() => {
    const map: Record<string, Contact[]> = {};
    for (const c of filtered) {
      const key = c.assigned_at ? new Date(c.assigned_at).toDateString() : "Unknown";
      if (!map[key]) map[key] = [];
      map[key].push(c);
    }
    return Object.entries(map)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .map(([key, list]) => ({ label: formatDay(key), dateKey: key, contacts: list }));
  }, [filtered]);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: BG, ...MONO }}>
      {/* Header */}
      <div style={{ backgroundColor: B, padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px", borderBottom: `3px solid ${Y}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ backgroundColor: Y, color: B, padding: "4px 10px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em" }}>UPSTRIDE</div>
          <span style={{ color: W, fontSize: "13px", fontWeight: 600 }}>Sales — {name}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: `${W}80`, fontSize: "12px" }}>{email}</span>
          <button
            onClick={() => setShowAddModal(true)}
            style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: Y, border: "none", borderRadius: "6px", padding: "7px 14px", color: B, fontSize: "12px", fontWeight: 700, cursor: "pointer", ...MONO }}>
            <UserPlus size={13} /> Add Contact
          </button>
          <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "transparent", border: `1px solid ${W}40`, borderRadius: "6px", padding: "6px 12px", color: W, fontSize: "12px", cursor: "pointer", ...MONO }}>
            <LogOut size={13} /> Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 24px" }}>

        {/* Summary bar */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
          <button onClick={() => setFilter("all")}
            style={{ padding: "6px 14px", borderRadius: "20px", border: `2px solid ${filter === "all" ? B : BORD}`, backgroundColor: filter === "all" ? B : W, color: filter === "all" ? Y : MUTE, fontSize: "11px", fontWeight: 700, cursor: "pointer", ...MONO }}>
            All ({contacts.length})
          </button>
          {ALL_STATUSES.map(s => {
            const cfg = STATUS_CONFIG[s];
            const active = filter === s;
            return (
              <button key={s} onClick={() => setFilter(active ? "all" : s)}
                style={{ padding: "6px 14px", borderRadius: "20px", border: `2px solid ${active ? cfg.color : BORD}`, backgroundColor: active ? cfg.bg : W, color: active ? cfg.color : MUTE, fontSize: "11px", fontWeight: 700, cursor: "pointer", ...MONO, display: "flex", alignItems: "center", gap: "5px" }}>
                {cfg.icon} {cfg.shortLabel} ({counts[s] || 0})
              </button>
            );
          })}
        </div>

        {/* Search + refresh */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
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

        {/* Grouped by day */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: MUTE }}>Loading contacts...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: MUTE, backgroundColor: W, border: `2px solid ${BORD}`, borderRadius: "10px" }}>
            <Phone size={36} color={BORD} style={{ margin: "0 auto 12px", display: "block" }} />
            <p>No contacts {filter !== "all" ? `— ${STATUS_CONFIG[filter as Status]?.label}` : "assigned"}</p>
          </div>
        ) : (
          groupedByDay.map(group => {
            const dayCounts = ALL_STATUSES.reduce((acc, s) => {
              const n = group.contacts.filter(c => c.status === s).length;
              if (n > 0) acc.push({ s, n });
              return acc;
            }, [] as { s: Status; n: number }[]);

            return (
              <div key={group.dateKey} style={{ marginBottom: "28px" }}>
                {/* Day header */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", backgroundColor: B, borderRadius: "8px 8px 0 0", marginBottom: 0 }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: Y }}>📅 {group.label}</span>
                  <span style={{ fontSize: "11px", color: `${W}70` }}>{group.contacts.length} contacts</span>
                  <div style={{ display: "flex", gap: "6px", marginLeft: "auto", flexWrap: "wrap" }}>
                    {dayCounts.map(({ s, n }) => {
                      const cfg = STATUS_CONFIG[s];
                      return (
                        <span key={s} style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", backgroundColor: cfg.bg, color: cfg.color }}>
                          {cfg.icon} {cfg.shortLabel}: {n}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div style={{ backgroundColor: W, border: `2px solid ${BORD}`, borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ backgroundColor: `${B}06`, borderBottom: `1px solid ${BORD}` }}>
                        {["#", "Name", "Phone", "Email", "Status", "Notes", "Update"].map(h => (
                          <th key={h} style={{ padding: "9px 14px", textAlign: "left", fontSize: "10px", fontWeight: 700, color: MUTE, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>{h.toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {group.contacts.map((c, i) => {
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
                                  {cfg.icon} {cfg.shortLabel}
                                </span>
                              </td>
                              <td style={{ padding: "10px 14px", fontSize: "11px", color: MUTE, maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {c.notes || "—"}
                              </td>
                              <td style={{ padding: "10px 14px" }}>
                                <div style={{ display: "flex", gap: "5px" }}>
                                  <select
                                    disabled={updatingId === c.id}
                                    value={c.status}
                                    onChange={e => updateStatus(c.id, e.target.value as Status)}
                                    style={{ padding: "5px 8px", border: `2px solid ${B}`, borderRadius: "5px", fontSize: "11px", fontWeight: 700, ...MONO, cursor: "pointer", backgroundColor: W, color: B, outline: "none" }}
                                  >
                                    {ALL_STATUSES.map(s => (
                                      <option key={s} value={s}>{STATUS_CONFIG[s].shortLabel}</option>
                                    ))}
                                  </select>
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
              </div>
            );
          })
        )}

        <p style={{ marginTop: "8px", fontSize: "11px", color: MUTE, textAlign: "right" }}>
          Showing {filtered.length} of {contacts.length} contacts
        </p>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
          <div style={{ backgroundColor: W, borderRadius: "12px", padding: "28px 28px 24px", width: "100%", maxWidth: "420px", border: `3px solid ${B}`, boxShadow: `6px 6px 0 ${Y}`, ...MONO }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: B }}>Add New Contact</div>
                <div style={{ fontSize: "11px", color: MUTE, marginTop: "2px" }}>Visible to admin instantly</div>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                <X size={18} color={MUTE} />
              </button>
            </div>

            <form onSubmit={handleAddContact} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: MUTE, letterSpacing: "0.08em", display: "block", marginBottom: "5px" }}>NAME *</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={addForm.name}
                  onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                  required
                  style={{ width: "100%", padding: "9px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: MUTE, letterSpacing: "0.08em", display: "block", marginBottom: "5px" }}>PHONE *</label>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={addForm.phone}
                  onChange={e => setAddForm(f => ({ ...f, phone: e.target.value }))}
                  required
                  style={{ width: "100%", padding: "9px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "11px", fontWeight: 700, color: MUTE, letterSpacing: "0.08em", display: "block", marginBottom: "5px" }}>EMAIL <span style={{ fontWeight: 400 }}>(optional)</span></label>
                <input
                  type="email"
                  placeholder="Email address"
                  value={addForm.email}
                  onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                  style={{ width: "100%", padding: "9px 12px", border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", ...MONO, outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <button
                  type="submit"
                  disabled={addingContact}
                  style={{ flex: 1, padding: "11px", backgroundColor: B, color: Y, border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 700, cursor: addingContact ? "not-allowed" : "pointer", opacity: addingContact ? 0.7 : 1, ...MONO }}>
                  {addingContact ? "Adding..." : "Add Contact"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: "11px 18px", backgroundColor: W, color: MUTE, border: `2px solid ${BORD}`, borderRadius: "6px", fontSize: "13px", cursor: "pointer", ...MONO }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
