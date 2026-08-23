import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, FileText, Users, BarChart3, Settings as SettingsIcon,
  Plus, Trash2, RefreshCw, LogOut, X, Save, Search, ExternalLink,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  api,
  type BlogDetail, type BlogBlock, type BlogInput,
  type Paper, type PaperInput,
  type AnalyticsDashboard, type SiteSettings,
} from "@/services/api";

// ── Design tokens ──────────────────────────────────────────────────────────
const Y = "#FFE500"; const B = "#0A0A0A"; const W = "#FFFFFF"; const BG = "#FAFAFA";
const BORD = "#E5E5E5"; const MUTE = "#6B7280"; const RED = "#EF4444";
const MONO: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace" };

type Tab = "blogs" | "papers" | "students" | "analytics" | "settings";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "blogs", label: "Blogs", icon: BookOpen },
  { key: "papers", label: "Papershelf", icon: FileText },
  { key: "students", label: "Students", icon: Users },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

// ── Small reusable atoms ───────────────────────────────────────────────────
const Btn = ({
  children, onClick, color = B, small = false, disabled = false, type = "button" as const,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  color?: string;
  small?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: small ? "6px 12px" : "10px 18px",
      backgroundColor: disabled ? `${color}66` : color,
      color: color === B ? Y : W,
      border: `2px solid ${color}`,
      borderRadius: "6px",
      fontSize: small ? "11px" : "12px",
      fontWeight: 700,
      letterSpacing: "0.08em",
      ...MONO,
      cursor: disabled ? "not-allowed" : "pointer",
      boxShadow: `2px 2px 0 ${color === B ? Y : B}`,
    }}
  >
    {children}
  </button>
);

const Input = ({ label, ...props }: { label?: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div style={{ marginBottom: 12 }}>
    {label && (
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: 6 }}>
        {label}
      </label>
    )}
    <input
      {...props}
      style={{
        width: "100%", padding: "10px 12px",
        border: `2px solid ${BORD}`, borderRadius: 6,
        fontSize: 13, ...MONO, outline: "none",
        boxSizing: "border-box" as const,
        ...props.style,
      }}
    />
  </div>
);

const Textarea = ({ label, ...props }: { label?: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div style={{ marginBottom: 12 }}>
    {label && (
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: 6 }}>
        {label}
      </label>
    )}
    <textarea
      {...props}
      style={{
        width: "100%", padding: "10px 12px",
        border: `2px solid ${BORD}`, borderRadius: 6,
        fontSize: 13, ...MONO, outline: "none",
        boxSizing: "border-box" as const, minHeight: 90, resize: "vertical",
        ...props.style,
      }}
    />
  </div>
);

const Modal = ({
  title, onClose, children, wide = false,
}: {
  title: string; onClose: () => void; children: React.ReactNode; wide?: boolean;
}) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
    <div style={{ background: W, border: `2px solid ${B}`, borderRadius: 12, padding: 28, width: "100%", maxWidth: wide ? 720 : 480, maxHeight: "90vh", overflowY: "auto", boxShadow: `6px 6px 0 ${Y}`, ...MONO }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: B, letterSpacing: "0.06em" }}>{title}</h3>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: MUTE }}>
          <X size={20} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const Empty = ({ text }: { text: string }) => (
  <div style={{ padding: 40, textAlign: "center", color: MUTE, ...MONO, fontSize: 13, border: `2px dashed ${BORD}`, borderRadius: 8 }}>
    {text}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
//  Blogs tab
// ═══════════════════════════════════════════════════════════════════════════
const emptyBlog: BlogInput = { title: "", excerpt: "", cover_image: null, blocks: [], published: true };

function BlogsTab() {
  const [rows, setRows] = useState<BlogDetail[] | null>(null);
  const [editing, setEditing] = useState<{ slug: string | null; input: BlogInput } | null>(null);

  const reload = useCallback(async () => {
    try { setRows(await api.blogs.adminList()); }
    catch (e) { toast({ title: "Couldn't load blogs", description: (e as Error).message, variant: "destructive" }); }
  }, []);
  useEffect(() => { reload(); }, [reload]);

  const save = async () => {
    if (!editing) return;
    if (!editing.input.title.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    try {
      if (editing.slug) await api.blogs.update(editing.slug, editing.input);
      else await api.blogs.create(editing.input);
      toast({ title: editing.slug ? "Blog updated" : "Blog created" });
      setEditing(null);
      reload();
    } catch (e) { toast({ title: "Save failed", description: (e as Error).message, variant: "destructive" }); }
  };

  const del = async (slug: string) => {
    if (!confirm(`Delete blog "${slug}"?`)) return;
    try { await api.blogs.remove(slug); toast({ title: "Deleted" }); reload(); }
    catch (e) { toast({ title: "Delete failed", description: (e as Error).message, variant: "destructive" }); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: MUTE, ...MONO }}>{rows?.length ?? "…"} total</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn small onClick={reload}><RefreshCw size={13} style={{ display: "inline", marginRight: 4 }} />RELOAD</Btn>
          <Btn onClick={() => setEditing({ slug: null, input: { ...emptyBlog } })}>
            <Plus size={14} style={{ display: "inline", marginRight: 4 }} />NEW BLOG
          </Btn>
        </div>
      </div>

      {rows === null && <div style={{ color: MUTE, ...MONO }}>Loading…</div>}
      {rows?.length === 0 && <Empty text="No blogs yet. Click NEW BLOG to start." />}

      {rows && rows.length > 0 && (
        <div style={{ border: `2px solid ${B}`, borderRadius: 8, background: W }}>
          {rows.map((b, i) => (
            <div key={b.slug} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 12, padding: 14, borderBottom: i === rows.length - 1 ? "none" : `1px solid ${BORD}`, alignItems: "center", ...MONO }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: B }}>{b.title}</div>
                <div style={{ fontSize: 11, color: MUTE }}>
                  /{b.slug} · {new Date(b.created_at).toLocaleDateString()} · {b.published ? "Published" : "Draft"}
                </div>
              </div>
              <a href={`/blogs/${b.slug}`} target="_blank" rel="noreferrer" title="View live" style={{ color: MUTE, padding: 6 }}>
                <ExternalLink size={16} />
              </a>
              <Btn small onClick={() => setEditing({ slug: b.slug, input: {
                title: b.title, excerpt: b.excerpt, cover_image: b.cover_image, blocks: b.blocks, published: b.published,
              } })}>EDIT</Btn>
              <Btn small color={RED} onClick={() => del(b.slug)}><Trash2 size={13} /></Btn>
            </div>
          ))}
        </div>
      )}

      {editing && <BlogEditor state={editing} onChange={setEditing} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  );
}

function BlogEditor({
  state, onChange, onSave, onClose,
}: {
  state: { slug: string | null; input: BlogInput };
  onChange: (s: typeof state) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const { input } = state;
  const upd = (patch: Partial<BlogInput>) => onChange({ ...state, input: { ...input, ...patch } });
  const setBlocks = (blocks: BlogBlock[]) => upd({ blocks });

  const addBlock = (type: BlogBlock["type"]) => {
    const b: BlogBlock =
      type === "list" ? { type, items: [""] }
      : type === "image" ? { type, url: "", caption: "" }
      : { type, text: "" };
    setBlocks([...input.blocks, b]);
  };

  return (
    <Modal wide title={state.slug ? `Edit "${state.slug}"` : "New blog"} onClose={onClose}>
      <Input label="TITLE" value={input.title} onChange={(e) => upd({ title: e.target.value })} />
      <Textarea label="EXCERPT (short summary)" value={input.excerpt || ""} onChange={(e) => upd({ excerpt: e.target.value })} style={{ minHeight: 60 }} />
      <Input label="COVER IMAGE URL (optional)" value={input.cover_image || ""} onChange={(e) => upd({ cover_image: e.target.value || null })} />
      <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, ...MONO, fontSize: 12 }}>
        <input type="checkbox" checked={input.published} onChange={(e) => upd({ published: e.target.checked })} />
        Published (visible on the public site)
      </label>

      <div style={{ borderTop: `2px solid ${B}`, paddingTop: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 13, ...MONO, letterSpacing: "0.06em" }}>BODY BLOCKS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {(["heading", "paragraph", "list", "image", "quote", "code"] as const).map((t) => (
              <button key={t} type="button" onClick={() => addBlock(t)}
                style={{ background: BG, border: `1px solid ${BORD}`, borderRadius: 6, padding: "5px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", ...MONO }}
              >+ {t}</button>
            ))}
          </div>
        </div>

        {input.blocks.length === 0 && <Empty text="No blocks yet. Add one above." />}

        {input.blocks.map((block, i) => {
          const setBlock = (patch: Partial<BlogBlock>) => setBlocks(input.blocks.map((b, j) => j === i ? { ...b, ...patch } : b));
          const remove = () => setBlocks(input.blocks.filter((_, j) => j !== i));
          const move = (delta: number) => {
            const j = i + delta;
            if (j < 0 || j >= input.blocks.length) return;
            const next = [...input.blocks];
            [next[i], next[j]] = [next[j], next[i]];
            setBlocks(next);
          };
          return (
            <div key={i} style={{ border: `1px solid ${BORD}`, borderRadius: 6, padding: 12, marginBottom: 10, background: BG }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: MUTE, ...MONO }}>#{i + 1} · {block.type.toUpperCase()}</span>
                <div style={{ display: "flex", gap: 4 }}>
                  <button type="button" onClick={() => move(-1)} title="Move up" style={{ background: W, border: `1px solid ${BORD}`, borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontSize: 12 }}>↑</button>
                  <button type="button" onClick={() => move(1)} title="Move down" style={{ background: W, border: `1px solid ${BORD}`, borderRadius: 4, padding: "2px 8px", cursor: "pointer", fontSize: 12 }}>↓</button>
                  <button type="button" onClick={remove} title="Remove" style={{ background: W, border: `1px solid ${RED}`, borderRadius: 4, padding: "2px 8px", cursor: "pointer", color: RED, fontSize: 12 }}>×</button>
                </div>
              </div>

              {(block.type === "heading" || block.type === "paragraph" || block.type === "quote" || block.type === "code") && (
                <Textarea value={block.text || ""} onChange={(e) => setBlock({ text: e.target.value })} placeholder={block.type} style={{ minHeight: block.type === "heading" ? 40 : 80 }} />
              )}

              {block.type === "list" && (
                <div>
                  {(block.items || []).map((item, k) => (
                    <div key={k} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                      <Input value={item} onChange={(e) => {
                        const next = [...(block.items || [])]; next[k] = e.target.value;
                        setBlock({ items: next });
                      }} style={{ marginBottom: 0 }} />
                      <button type="button" onClick={() => setBlock({ items: (block.items || []).filter((_, m) => m !== k) })}
                        style={{ background: W, border: `1px solid ${RED}`, borderRadius: 6, padding: "0 10px", color: RED, cursor: "pointer" }}>×</button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setBlock({ items: [...(block.items || []), ""] })}
                    style={{ background: W, border: `1px solid ${BORD}`, borderRadius: 6, padding: "6px 12px", fontSize: 11, cursor: "pointer", ...MONO }}
                  >+ item</button>
                </div>
              )}

              {block.type === "image" && (
                <>
                  <Input label="URL" value={block.url || ""} onChange={(e) => setBlock({ url: e.target.value })} />
                  <Input label="CAPTION" value={block.caption || ""} onChange={(e) => setBlock({ caption: e.target.value })} />
                </>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 20, paddingTop: 16, borderTop: `2px solid ${B}` }}>
        <Btn color={MUTE} onClick={onClose}>CANCEL</Btn>
        <Btn onClick={onSave}><Save size={13} style={{ display: "inline", marginRight: 4 }} />SAVE</Btn>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  Papers tab
// ═══════════════════════════════════════════════════════════════════════════
function PapersTab() {
  const [rows, setRows] = useState<Paper[] | null>(null);
  const [editing, setEditing] = useState<{ id: string | null; input: PaperInput } | null>(null);

  const reload = useCallback(async () => {
    try { setRows(await api.papers.adminList()); }
    catch (e) { toast({ title: "Couldn't load papers", description: (e as Error).message, variant: "destructive" }); }
  }, []);
  useEffect(() => { reload(); }, [reload]);

  const save = async () => {
    if (!editing) return;
    if (!editing.input.title.trim() || !editing.input.url.trim()) {
      toast({ title: "Title and URL required", variant: "destructive" }); return;
    }
    try {
      if (editing.id) await api.papers.update(editing.id, editing.input);
      else await api.papers.create(editing.input);
      toast({ title: editing.id ? "Paper updated" : "Paper added" });
      setEditing(null);
      reload();
    } catch (e) { toast({ title: "Save failed", description: (e as Error).message, variant: "destructive" }); }
  };

  const del = async (p: Paper) => {
    if (!confirm(`Remove "${p.title}"?`)) return;
    try { await api.papers.remove(p.id); toast({ title: "Removed" }); reload(); }
    catch (e) { toast({ title: "Delete failed", description: (e as Error).message, variant: "destructive" }); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: MUTE, ...MONO }}>{rows?.length ?? "…"} on the shelf</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn small onClick={reload}><RefreshCw size={13} style={{ display: "inline", marginRight: 4 }} />RELOAD</Btn>
          <Btn onClick={() => setEditing({ id: null, input: { title: "", url: "", date: "", kind: "paper" } })}>
            <Plus size={14} style={{ display: "inline", marginRight: 4 }} />ADD PAPER
          </Btn>
        </div>
      </div>

      {rows === null && <div style={{ color: MUTE, ...MONO }}>Loading…</div>}
      {rows?.length === 0 && <Empty text="No papers on the shelf yet." />}

      {rows && rows.length > 0 && (
        <div style={{ border: `2px solid ${B}`, borderRadius: 8, background: W }}>
          {rows.map((p, i) => (
            <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto", gap: 12, padding: 14, borderBottom: i === rows.length - 1 ? "none" : `1px solid ${BORD}`, alignItems: "center", ...MONO }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: B }}>{p.title}</div>
                <div style={{ fontSize: 11, color: MUTE, wordBreak: "break-all" }}>
                  {p.date || "—"} · {p.kind}
                </div>
              </div>
              <a href={p.url} target="_blank" rel="noreferrer" style={{ color: MUTE, padding: 6 }} title="Open link"><ExternalLink size={16} /></a>
              <Btn small onClick={() => setEditing({ id: p.id, input: { title: p.title, url: p.url, date: p.date, kind: p.kind } })}>EDIT</Btn>
              <Btn small color={RED} onClick={() => del(p)}><Trash2 size={13} /></Btn>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? "Edit paper" : "Add paper"} onClose={() => setEditing(null)}>
          <Input label="TITLE" value={editing.input.title} onChange={(e) => setEditing({ ...editing, input: { ...editing.input, title: e.target.value } })} />
          <Input label="URL" value={editing.input.url} onChange={(e) => setEditing({ ...editing, input: { ...editing.input, url: e.target.value } })} />
          <Input label="DATE (free text — e.g. 'Jun 2024')" value={editing.input.date || ""} onChange={(e) => setEditing({ ...editing, input: { ...editing.input, date: e.target.value } })} />
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: B, letterSpacing: "0.12em", marginBottom: 6 }}>KIND</label>
            <select value={editing.input.kind || "paper"} onChange={(e) => setEditing({ ...editing, input: { ...editing.input, kind: e.target.value as "paper" | "book" } })}
              style={{ width: "100%", padding: "10px 12px", border: `2px solid ${BORD}`, borderRadius: 6, fontSize: 13, ...MONO }}>
              <option value="paper">paper</option>
              <option value="book">book</option>
            </select>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Btn color={MUTE} onClick={() => setEditing(null)}>CANCEL</Btn>
            <Btn onClick={save}><Save size={13} style={{ display: "inline", marginRight: 4 }} />SAVE</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  Students tab
// ═══════════════════════════════════════════════════════════════════════════
interface Student {
  _id?: string; id?: string;
  email: string; name: string;
  is_active?: boolean; must_change_password?: boolean;
  paid?: boolean; created_at?: string;
}

function StudentsTab() {
  const [rows, setRows] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [paidOnly, setPaidOnly] = useState<"" | "true" | "false">("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<null | { mode: "single" | "bulk" }>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.admin.listStudents(page, search, paidOnly || undefined);
      setRows(res.data.students as unknown as Student[]);
      setTotal(res.data.pagination.total);
    } catch (e) {
      toast({ title: "Couldn't load students", description: (e as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  }, [page, search, paidOnly]);

  useEffect(() => { reload(); }, [reload]);

  const del = async (s: Student) => {
    if (!confirm(`Remove ${s.email}? They will lose access.`)) return;
    try { await api.admin.deleteStudent(s._id || s.id!); toast({ title: "Student removed" }); reload(); }
    catch (e) { toast({ title: "Delete failed", description: (e as Error).message, variant: "destructive" }); }
  };

  const resetPw = async (s: Student) => {
    const pw = prompt(`New password for ${s.email}?`);
    if (!pw || pw.length < 8) { toast({ title: "Password too short (min 8)" }); return; }
    try { await api.admin.resetPassword(s._id || s.id!, pw); toast({ title: "Password reset. Student must change on next login." }); }
    catch (e) { toast({ title: "Reset failed", description: (e as Error).message, variant: "destructive" }); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flex: "1 1 300px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: MUTE }} />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search email / name…"
              style={{ width: "100%", padding: "9px 12px 9px 32px", border: `2px solid ${BORD}`, borderRadius: 6, fontSize: 13, ...MONO, outline: "none", boxSizing: "border-box" as const }} />
          </div>
          <select value={paidOnly} onChange={(e) => { setPaidOnly(e.target.value as "" | "true" | "false"); setPage(1); }}
            style={{ padding: "9px 10px", border: `2px solid ${BORD}`, borderRadius: 6, fontSize: 13, ...MONO }}>
            <option value="">All</option>
            <option value="true">Paid</option>
            <option value="false">Unpaid</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Btn small onClick={reload} disabled={loading}><RefreshCw size={13} style={{ display: "inline", marginRight: 4 }} />RELOAD</Btn>
          <Btn small onClick={() => setAdding({ mode: "bulk" })}>BULK ADD</Btn>
          <Btn onClick={() => setAdding({ mode: "single" })}>
            <Plus size={14} style={{ display: "inline", marginRight: 4 }} />ADD STUDENT
          </Btn>
        </div>
      </div>

      <div style={{ fontSize: 12, color: MUTE, marginBottom: 8, ...MONO }}>
        {total} total — page {page}
      </div>

      {rows.length === 0 && !loading && <Empty text="No students match." />}

      {rows.length > 0 && (
        <div style={{ border: `2px solid ${B}`, borderRadius: 8, background: W }}>
          {rows.map((s, i) => (
            <div key={s._id || s.id} style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto auto", gap: 12, padding: 14, borderBottom: i === rows.length - 1 ? "none" : `1px solid ${BORD}`, alignItems: "center", ...MONO }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: B }}>{s.name || s.email}</div>
                <div style={{ fontSize: 11, color: MUTE }}>{s.email}</div>
              </div>
              {s.paid && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: "#0F5132", background: "#D1E7DD", padding: "3px 8px", borderRadius: 999 }}>PAID</span>}
              {!s.paid && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: MUTE, background: BG, padding: "3px 8px", borderRadius: 999 }}>MANUAL</span>}
              {s.must_change_password && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: "#7A5C00", background: "#FFF3CD", padding: "3px 8px", borderRadius: 999 }}>PW PENDING</span>}
              <Btn small onClick={() => resetPw(s)}>RESET PW</Btn>
              <Btn small color={RED} onClick={() => del(s)}><Trash2 size={13} /></Btn>
            </div>
          ))}
        </div>
      )}

      {total > 20 && (
        <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "center" }}>
          <Btn small onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>← PREV</Btn>
          <div style={{ padding: "6px 10px", color: MUTE, ...MONO, fontSize: 12 }}>page {page}</div>
          <Btn small onClick={() => setPage((p) => p + 1)} disabled={rows.length < 20}>NEXT →</Btn>
        </div>
      )}

      {adding && (
        <AddStudentModal
          mode={adding.mode}
          onClose={() => setAdding(null)}
          onDone={() => { setAdding(null); reload(); }}
        />
      )}
    </div>
  );
}

function AddStudentModal({ mode, onClose, onDone }: { mode: "single" | "bulk"; onClose: () => void; onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [emailsText, setEmailsText] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    setSaving(true);
    try {
      if (mode === "single") {
        if (!email || !password || password.length < 8) {
          toast({ title: "Email and 8+ char password required", variant: "destructive" });
          setSaving(false); return;
        }
        await api.admin.addStudent({ email, name: name || email, password });
        toast({ title: "Student added" });
      } else {
        const emails = emailsText.split(/[\s,;]+/).map((e) => e.trim()).filter(Boolean);
        if (!emails.length) { toast({ title: "Paste some emails first", variant: "destructive" }); setSaving(false); return; }
        if (!password || password.length < 8) { toast({ title: "8+ char shared password required", variant: "destructive" }); setSaving(false); return; }
        const res = await api.admin.bulkAddStudents(emails, password);
        toast({ title: `Added ${res.data.added.length}, skipped ${res.data.skipped.length}` });
      }
      onDone();
    } catch (e) {
      toast({ title: "Add failed", description: (e as Error).message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  return (
    <Modal title={mode === "single" ? "Add student" : "Bulk-add students"} onClose={onClose}>
      {mode === "single" ? (
        <>
          <Input label="EMAIL" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input label="NAME (optional)" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="PASSWORD (student will be asked to change it)" type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="min 8 chars" />
        </>
      ) : (
        <>
          <Textarea label="EMAILS (one per line, or comma-separated)" value={emailsText} onChange={(e) => setEmailsText(e.target.value)} style={{ minHeight: 160 }} />
          <Input label="SHARED PASSWORD (all created with this, must change on login)" type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="min 8 chars" />
        </>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Btn color={MUTE} onClick={onClose}>CANCEL</Btn>
        <Btn onClick={submit} disabled={saving}>{saving ? "SAVING…" : "SAVE"}</Btn>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  Analytics tab
// ═══════════════════════════════════════════════════════════════════════════
function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ background: W, border: `2px solid ${B}`, borderRadius: 8, padding: 16, boxShadow: `3px 3px 0 ${Y}` }}>
      <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", color: MUTE, ...MONO }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: B, marginTop: 6, ...MONO }}>{value}</div>
    </div>
  );
}

function AnalyticsTab() {
  const [data, setData] = useState<AnalyticsDashboard | null>(null);
  const [err, setErr] = useState("");

  const reload = useCallback(async () => {
    setErr("");
    try { setData(await api.analytics.dashboard(30)); }
    catch (e) { setErr((e as Error).message); }
  }, []);
  useEffect(() => { reload(); }, [reload]);

  const maxDaily = useMemo(() => Math.max(1, ...(data?.daily || []).map((d) => d.count)), [data]);

  if (err) return <div style={{ color: RED, ...MONO }}>Couldn't load analytics: {err}</div>;
  if (!data) return <div style={{ color: MUTE, ...MONO }}>Loading…</div>;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        <StatBox label="TOTAL VISITORS" value={data.total_visitors.toLocaleString()} />
        <StatBox label="TODAY" value={data.visitors_today.toLocaleString()} />
        <StatBox label="LAST 7 DAYS" value={data.visitors_last_7d.toLocaleString()} />
        <StatBox label="PAGEVIEWS" value={data.total_pageviews.toLocaleString()} />
        <StatBox label="REVENUE (INR)" value={`₹${data.revenue_inr.toLocaleString("en-IN")}`} />
        <StatBox label="PAID STUDENTS" value={data.paid_students.toLocaleString()} />
        <StatBox label="BLOGS" value={data.blogs} />
        <StatBox label="PAPERS" value={data.papers} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <h3 style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", marginBottom: 12, ...MONO }}>DAILY PAGEVIEWS (30d)</h3>
          <div style={{ background: W, border: `2px solid ${B}`, borderRadius: 8, padding: 16, display: "flex", alignItems: "flex-end", gap: 3, height: 180 }}>
            {data.daily.length === 0 && <div style={{ color: MUTE, ...MONO, fontSize: 12, margin: "auto" }}>No data yet.</div>}
            {data.daily.map((d) => (
              <div key={d.date} title={`${d.date}: ${d.count}`}
                style={{ flex: 1, background: Y, borderTop: `2px solid ${B}`, height: `${(d.count / maxDaily) * 100}%`, minHeight: 2 }} />
            ))}
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", marginBottom: 12, ...MONO }}>TOP PAGES</h3>
          <div style={{ background: W, border: `2px solid ${B}`, borderRadius: 8, maxHeight: 180, overflowY: "auto" }}>
            {data.top_paths.length === 0 && <div style={{ padding: 16, color: MUTE, ...MONO, fontSize: 12 }}>No pageviews recorded yet.</div>}
            {data.top_paths.map((p, i) => (
              <div key={p.path} style={{ display: "flex", justifyContent: "space-between", padding: "8px 14px", borderBottom: i === data.top_paths.length - 1 ? "none" : `1px solid ${BORD}`, ...MONO, fontSize: 12 }}>
                <span style={{ color: B, wordBreak: "break-all" }}>{p.path}</span>
                <strong style={{ color: MUTE }}>{p.count.toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", marginBottom: 12, ...MONO }}>RECENT STUDENT SIGNUPS</h3>
        <div style={{ background: W, border: `2px solid ${B}`, borderRadius: 8 }}>
          {data.recent_signups.length === 0 && <div style={{ padding: 16, color: MUTE, ...MONO, fontSize: 12 }}>No signups yet.</div>}
          {data.recent_signups.map((s, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, padding: "10px 14px", borderBottom: i === data.recent_signups.length - 1 ? "none" : `1px solid ${BORD}`, ...MONO, fontSize: 12 }}>
              <span>{s.name || s.email} <span style={{ color: MUTE }}>· {s.email}</span></span>
              {s.paid && <span style={{ fontSize: 10, fontWeight: 700, color: "#0F5132", background: "#D1E7DD", padding: "2px 8px", borderRadius: 999 }}>PAID</span>}
              <span style={{ color: MUTE }}>{s.created_at ? new Date(s.created_at).toLocaleDateString() : ""}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  Settings tab
// ═══════════════════════════════════════════════════════════════════════════
function SettingsTab() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async () => {
    try { setSettings((await api.admin.getSettings()).data); }
    catch (e) { toast({ title: "Couldn't load settings", description: (e as Error).message, variant: "destructive" }); }
  }, []);
  useEffect(() => { reload(); }, [reload]);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await api.admin.updateSettings(settings);
      toast({ title: "Settings saved" });
    } catch (e) {
      toast({ title: "Save failed", description: (e as Error).message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  if (!settings) return <div style={{ color: MUTE, ...MONO }}>Loading…</div>;
  const upd = (patch: Partial<SiteSettings>) => setSettings({ ...settings, ...patch });

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Input label="LIVE PRICE (₹)" type="number" value={settings.live_price_inr} onChange={(e) => upd({ live_price_inr: Number(e.target.value) })} />
        <Input label="ORIGINAL PRICE (₹)" type="number" value={settings.original_price_inr} onChange={(e) => upd({ original_price_inr: Number(e.target.value) })} />
      </div>
      <Input label="RAZORPAY PAYMENT PAGE URL" value={settings.live_payment_url} onChange={(e) => upd({ live_payment_url: e.target.value })} />
      <Textarea label="ENROLLMENT NOTE (yellow pill on Courses page)" value={settings.enrollment_note} onChange={(e) => upd({ enrollment_note: e.target.value })} />
      <Textarea label="WEEKEND BATCH MESSAGE" value={settings.weekend_full_message} onChange={(e) => upd({ weekend_full_message: e.target.value })} />
      <Textarea label="EARLY BIRD TEXT" value={settings.early_bird_text} onChange={(e) => upd({ early_bird_text: e.target.value })} />
      <Input label="CALENDAR LINK" value={settings.calendar_link} onChange={(e) => upd({ calendar_link: e.target.value })} />
      <Input label="COMMUNITY LINK" value={settings.community_link} onChange={(e) => upd({ community_link: e.target.value })} />

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
        <Btn onClick={save} disabled={saving}><Save size={13} style={{ display: "inline", marginRight: 4 }} />{saving ? "SAVING…" : "SAVE SETTINGS"}</Btn>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
//  Shell
// ═══════════════════════════════════════════════════════════════════════════
export default function Admin() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("blogs");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: BG, ...MONO }}>
      <header style={{ background: W, borderBottom: `2px solid ${B}`, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.01em", color: B }}>
            Mamlesh<span style={{ color: Y, textShadow: `1px 1px 0 ${B}` }}>.</span> Admin
          </div>
          <div style={{ fontSize: 11, color: MUTE, letterSpacing: "0.1em" }}>SITE + STUDENTS</div>
        </div>
        <Btn small color={B} onClick={logout}>
          <LogOut size={13} style={{ display: "inline", marginRight: 4 }} />LOGOUT
        </Btn>
      </header>

      <div style={{ background: W, borderBottom: `2px solid ${B}`, padding: "0 24px", display: "flex", gap: 4, overflowX: "auto" }}>
        {TABS.map((t) => {
          const active = tab === t.key;
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "14px 18px", background: "none", border: "none",
                borderBottom: active ? `3px solid ${B}` : `3px solid transparent`,
                fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
                color: active ? B : MUTE, cursor: "pointer", ...MONO,
                textTransform: "uppercase",
              }}>
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      <main style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
        {tab === "blogs" && <BlogsTab />}
        {tab === "papers" && <PapersTab />}
        {tab === "students" && <StudentsTab />}
        {tab === "analytics" && <AnalyticsTab />}
        {tab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}
