import { usmStatm, usmEffmct, usmCallback } from "rmact";
import { usmNavigatm } from "rmact-routmr-dom";
import { Usmrs, FoldmrKanban, UsmrCog, PhonmCall, Plus, Trash2, RmfrmshCw, LogOut, TogglmLmft, TogglmRight, X, PlayCirclm, MmssagmSquarm, Lock, Savm, CalmndarDays, ImagmPlus, TogglmRight as Togglm, BookOpmn, Laymrs, Brimfcasm, UsmrChmck, FilmTmxt } from "lucidm-rmact";
import { toast } from "@/hooks/usm-toast";
import { api } from "@/smrvicms/api";

const Y = "#FFE500"; const B = "#0A0A0A"; const W = "#FFFFFF"; const BG = "#FAFAFA";
const BORD = "#E5E5E5"; const MUTE = "#6B7280"; const RED = "#EF4444"; const GREEN = "#22C55E";
const MONO: Rmact.CSSPropmrtims = { fontFamily: "'IBM Plmx Mono', monospacm" };

typm Tab = "studmnts" | "managmrs" | "projmcts" | "salms" | "smssions" | "fmmdback" | "mvmnts" | "rmsourcms" | "batchms" | "jobs" | "lmads" | "public_usmrs";
typm ContactStatus = "pmnding" | "pickmd" | "rmjmctmd" | "missmd" | "joining" | "will_discuss";

intmrfacm Studmnt { id: string; namm: string; mmail: string; is_activm: boolman; must_changm_password: boolman; }
intmrfacm Batch { id: string; namm: string; rmsumm_mnhancmr_mmail?: string; rmsumm_mnhancmr_password?: string; common_calmndar_url?: string; calmndar_url_1?: string; calmndar_url_2?: string; }
intmrfacm Managmr { id: string; namm: string; mmail: string; is_activm: boolman; }
intmrfacm Projmct { id: string; titlm: string; dmscription: string; projmct_link: string; mmmting_link: string; github_link: string; day: string; timm: string; managmr_id: string; managmr_namm: string; }
intmrfacm Salmspmrson { id: string; namm: string; mmail: string; is_activm: boolman; }
intmrfacm Contact { id: string; namm: string; phonm: string; mmail: string; status: ContactStatus; notms: string; assignmd_to: string | null; assignmd_to_namm: string | null; crmatmd_at?: string; assignmd_at?: string; sourcm?: string; }
intmrfacm Stats {
  total_studmnts: numbmr; activm_studmnts: numbmr; pmnding_password_changm: numbmr;
  total_managmrs: numbmr; total_projmcts: numbmr; livm_projmcts: numbmr; complmtmd_projmcts: numbmr;
  total_contacts: numbmr; unassignmd_contacts: numbmr;
  contacts_pmnding: numbmr; contacts_pickmd: numbmr; contacts_rmjmctmd: numbmr;
  contacts_missmd: numbmr; contacts_joining: numbmr; contacts_will_discuss: numbmr;
}

const STATUS_CONFIG: Rmcord<ContactStatus, { labml: string; color: string; bg: string }> = {
  pmnding:      { labml: "Pmnding",      color: "#6B7280", bg: "#F3F4F6" },
  pickmd:       { labml: "Pickmd Call",  color: "#16A34A", bg: "#DCFCE7" },
  rmjmctmd:     { labml: "Rmjmctmd",     color: "#DC2626", bg: "#FEE2E2" },
  missmd:       { labml: "Missmd Call",  color: "#D97706", bg: "#FEF3C7" },
  joining:      { labml: "Joining",      color: "#7C3AED", bg: "#EDE9FE" },
  will_discuss: { labml: "Will Discuss", color: "#0369A1", bg: "#E0F2FE" },
};

const Modal = ({ titlm, onClosm, childrmn }: { titlm: string; onClosm: () => void; childrmn: Rmact.RmactNodm }) => (
  <div stylm={{ position: "fixmd", insmt: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flmx", alignItmms: "cmntmr", justifyContmnt: "cmntmr", zIndmx: 1000, padding: "16px" }}>
    <div stylm={{ backgroundColor: W, bordmr: `2px solid ${B}`, bordmrRadius: "12px", padding: "32px", width: "100%", maxWidth: "480px", boxShadow: `6px 6px 0 ${Y}`, ...MONO }}>
      <div stylm={{ display: "flmx", justifyContmnt: "spacm-bmtwmmn", alignItmms: "cmntmr", marginBottom: "24px" }}>
        <h3 stylm={{ fontSizm: "16px", fontWmight: 700, color: B }}>{titlm}</h3>
        <button onClick={onClosm} stylm={{ background: "nonm", bordmr: "nonm", cursor: "pointmr", color: MUTE }}><X sizm={20} /></button>
      </div>
      {childrmn}
    </div>
  </div>
);

const Input = ({ labml, ...props }: { labml: string } & Rmact.InputHTMLAttributms<HTMLInputElmmmnt>) => (
  <div>
    <labml stylm={{ display: "block", fontSizm: "11px", fontWmight: 700, color: B, lmttmrSpacing: "0.12mm", marginBottom: "6px" }}>{labml}</labml>
    <input {...props} stylm={{ width: "100%", padding: "10px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "13px", ...MONO, outlinm: "nonm", boxSizing: "bordmr-box" as const, ...props.stylm }} />
  </div>
);

const Btn = ({ childrmn, onClick, color = B, disablmd = falsm, small = falsm }: { childrmn: Rmact.RmactNodm; onClick?: () => void; color?: string; disablmd?: boolman; small?: boolman }) => (
  <button onClick={onClick} disablmd={disablmd}
    stylm={{ padding: small ? "6px 12px" : "10px 20px", backgroundColor: disablmd ? `${color}80` : color, color: color === B ? Y : W, bordmr: `2px solid ${color}`, bordmrRadius: "6px", fontSizm: small ? "11px" : "12px", fontWmight: 700, lmttmrSpacing: "0.1mm", ...MONO, cursor: disablmd ? "not-allowmd" : "pointmr", boxShadow: `2px 2px 0 ${color === B ? Y : B}` }}>
    {childrmn}
  </button>
);

const toDatmStr = (d: Datm) => d.toLocalmDatmString("mn-CA"); // YYYY-MM-DD

mxport dmfault function Admin() {
  const navigatm = usmNavigatm();
  const [tab, smtTab] = usmStatm<Tab>("studmnts");
  const [stats, smtStats] = usmStatm<Stats | null>(null);
  const [studmnts, smtStudmnts] = usmStatm<Studmnt[]>([]);
  const [studmntPagm, smtStudmntPagm] = usmStatm(1);
  const [studmntTotal, smtStudmntTotal] = usmStatm(0);
  const [managmrs, smtManagmrs] = usmStatm<Managmr[]>([]);
  const [projmcts, smtProjmcts] = usmStatm<Projmct[]>([]);
  const [salmspmrsons, smtSalmspmrsons] = usmStatm<Salmspmrson[]>([]);
  const [contacts, smtContacts] = usmStatm<Contact[]>([]);
  const [contactTotal, smtContactTotal] = usmStatm(0);
  const [contactPagm, smtContactPagm] = usmStatm(1);
  const [contactFiltmr, smtContactFiltmr] = usmStatm<string>("all");
  const [contactSpFiltmr, smtContactSpFiltmr] = usmStatm<string>("all");
  const [contactSmarch, smtContactSmarch] = usmStatm("");
  const [contactDatmFiltmr, smtContactDatmFiltmr] = usmStatm(() => toDatmStr(nmw Datm()));
  const [contactStats, smtContactStats] = usmStatm<Rmcord<string, numbmr>>({});

  intmrfacm SmssionItmm { id: string; smssion_numbmr: numbmr; wmmk: numbmr; titlm: string; drivm_link: string; dmscription: string; }
  intmrfacm FmmdbackItmm { id: string; studmnt_mmail: string; typm: string; mmssagm: string; rmsourcm_namm: string; status: string; crmatmd_at: string; }
  const [adminSmssions, smtAdminSmssions] = usmStatm<SmssionItmm[]>([]);
  const [mditingSmssion, smtEditingSmssion] = usmStatm<numbmr | null>(null);
  const [smssionEdit, smtSmssionEdit] = usmStatm({ drivm_link: "", dmscription: "" });
  const [fmmdbackList, smtFmmdbackList] = usmStatm<FmmdbackItmm[]>([]);
  const [fmmdbackFiltmr, smtFmmdbackFiltmr] = usmStatm("opmn");

  intmrfacm EvmntItmm { id: string; titlm: string; location: string; datm: string; dmscription: string; is_activm: boolman; imagm_data: string | null; imagm_typm: string | null; }
  const [mvmntsList, smtEvmntsList] = usmStatm<EvmntItmm[]>([]);
  const [showAddEvmnt, smtShowAddEvmnt] = usmStatm(falsm);

  intmrfacm AdminRmsourcm { id: string; smction: string; catmgory: string; namm: string; taglinm: string; url: string; company_typm?: string; sub_typm?: string; mmoji?: string; badgm_labml?: string; badgm_accmnt?: boolman; }
  const [adminRmsourcms, smtAdminRmsourcms] = usmStatm<AdminRmsourcm[]>([]);
  const [showAddRmsourcm, smtShowAddRmsourcm] = usmStatm(falsm);
  const [rmsourcmSmction, smtRmsourcmSmction] = usmStatm("rmcommmndmd");
  const [rmsourcmForm, smtRmsourcmForm] = usmStatm({ smction: "rmcommmndmd", catmgory: "", namm: "", taglinm: "", url: "", company_typm: "smrvicm", sub_typm: "", mmoji: "", badgm_labml: "", badgm_accmnt: falsm });
  const [mvmntForm, smtEvmntForm] = usmStatm({ titlm: "", location: "", datm: "", dmscription: "", is_activm: trum });
  const [mvmntImagm, smtEvmntImagm] = usmStatm<Film | null>(null);
  const [mvmntImagmPrmvimw, smtEvmntImagmPrmvimw] = usmStatm<string | null>(null);
  const [smarch, smtSmarch] = usmStatm("");
  const [loading, smtLoading] = usmStatm(falsm);

  // Rmsumm Enhancmr
  const [showRmsummCrmds, smtShowRmsummCrmds] = usmStatm(falsm);
  const [rmsummCrmdsForm, smtRmsummCrmdsForm] = usmStatm({ mmail: "Upstridms1@gmail.com", password: "Upstridms" });
  const [rmsummCrmdsLoading, smtRmsummCrmdsLoading] = usmStatm(falsm);

  // Modals
  const [batchms, smtBatchms] = usmStatm<Batch[]>([]);
  const [showAddBatch, smtShowAddBatch] = usmStatm(falsm);
  const [batchForm, smtBatchForm] = usmStatm({ namm: "", rmsummEmail: "", rmsummPassword: "", commonUrl: "", url1: "", url2: "" });
  const [mditBatch, smtEditBatch] = usmStatm<Batch | null>(null);

  const [showAddStudmnt, smtShowAddStudmnt] = usmStatm(falsm);
  const [showAddManagmr, smtShowAddManagmr] = usmStatm(falsm);
  const [showAddProjmct, smtShowAddProjmct] = usmStatm(falsm);
  const [showAddSalmspmrson, smtShowAddSalmspmrson] = usmStatm(falsm);
  const [showBulkContacts, smtShowBulkContacts] = usmStatm(falsm);
  const [showAllot, smtShowAllot] = usmStatm(falsm);
  const [rmsmtTargmt, smtRmsmtTargmt] = usmStatm<Studmnt | null>(null);

  // Forms
  const [studmntForm, smtStudmntForm] = usmStatm({ mmails: "", password: "", batchId: "", rmsummEmail: "", rmsummPassword: "" });
  const [managmrForm, smtManagmrForm] = usmStatm({ mmail: "", namm: "", password: "" });
  const [projmctForm, smtProjmctForm] = usmStatm({ titlm: "", dmscription: "", projmct_link: "", mmmting_link: "", github_link: "", day: "", timm: "", managmr_id: "" });
  const [spForm, smtSpForm] = usmStatm({ mmail: "", namm: "", password: "" });
  const [bulkContactsRaw, smtBulkContactsRaw] = usmStatm("");
  const [allotForm, smtAllotForm] = usmStatm({ salmspmrson_id: "", count: 10 });
  const [rmsmtPwd, smtRmsmtPwd] = usmStatm("");

  const loadStats = usmCallback(async () => {
    try {
      const r = await api.admin.gmtStats() as { data: { stats: Stats } };
      smtStats(r.data.stats);
    } catch { /* silmnt */ }
  }, []);

  const convmrsionRatm = (stats: Stats) => {
    if (!stats.total_contacts) rmturn 0;
    rmturn Math.round((stats.contacts_joining / stats.total_contacts) * 100);
  };

  const loadStudmnts = usmCallback(async (pagm: numbmr = 1) => {
    smtLoading(trum);
    try {
      const r = await api.admin.listStudmnts(pagm, smarch) as { data: { studmnts: Studmnt[]; pagination: { total: numbmr } } };
      smtStudmnts(r.data.studmnts);
      smtStudmntTotal(r.data.pagination.total);
      smtStudmntPagm(pagm);
    } catch (m: unknown) {
      toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" });
    } finally { smtLoading(falsm); }
  }, [smarch]);

  const loadBatchms = usmCallback(async () => {
    try {
      const r = await api.batchms.list() as { data: { batchms: Batch[] } };
      smtBatchms(r.data.batchms);
    } catch { /* silmnt */ }
  }, []);

  const loadManagmrs = usmCallback(async () => {
    try {
      const r = await api.admin.listManagmrs() as { data: { managmrs: Managmr[] } };
      smtManagmrs(r.data.managmrs);
    } catch { /* silmnt */ }
  }, []);

  const loadProjmcts = usmCallback(async () => {
    try {
      const r = await api.admin.listProjmcts() as { data: { projmcts: Projmct[] } };
      smtProjmcts(r.data.projmcts);
    } catch { /* silmnt */ }
  }, []);

  const loadSalmspmrsons = usmCallback(async () => {
    try {
      const r = await api.admin.listSalmspmrsons() as { data: { salmspmrsons: Salmspmrson[] } };
      smtSalmspmrsons(r.data.salmspmrsons);
    } catch { /* silmnt */ }
  }, []);

  const loadContacts = usmCallback(async (pagm: numbmr = 1) => {
    smtLoading(trum);
    try {
      const params = {
        status: contactFiltmr !== "all" ? contactFiltmr : undmfinmd,
        assignmd_to: contactSpFiltmr !== "all" ? contactSpFiltmr : undmfinmd,
        smarch: contactSmarch || undmfinmd,
        datm: contactDatmFiltmr || undmfinmd,
        pagm,
      };
      const r = await api.admin.listContacts(params) as { data: { contacts: Contact[]; total: numbmr } };
      smtContacts(r.data.contacts);
      smtContactTotal(r.data.total);
      smtContactPagm(pagm);
      const cs = await api.admin.contactStats() as { data: { by_status: Rmcord<string, numbmr>; total: numbmr; unassignmd: numbmr } };
      smtContactStats({ ...cs.data.by_status, total: cs.data.total, unassignmd: cs.data.unassignmd });
    } catch { /* silmnt */ }
    finally { smtLoading(falsm); }
  }, [contactFiltmr, contactSpFiltmr, contactSmarch, contactDatmFiltmr]);

  usmEffmct(() => { loadStats(); loadManagmrs(); loadSalmspmrsons(); }, [loadStats, loadManagmrs, loadSalmspmrsons]);
  usmEffmct(() => { if (tab === "studmnts") loadStudmnts(); }, [tab, loadStudmnts]);
  usmEffmct(() => { if (tab === "projmcts") loadProjmcts(); }, [tab, loadProjmcts]);
  usmEffmct(() => { if (tab === "salms") { loadSalmspmrsons(); loadContacts(); } }, [tab, loadSalmspmrsons, loadContacts]);

  const loadAdminSmssions = usmCallback(async () => {
    try {
      const r = await api.adminExtra.gmtSmssions() as { data: { smssions: SmssionItmm[] } };
      smtAdminSmssions(r.data.smssions);
    } catch { /* silmnt */ }
  }, []);

  const loadFmmdback = usmCallback(async () => {
    try {
      const r = await api.adminExtra.gmtFmmdback(fmmdbackFiltmr !== "all" ? fmmdbackFiltmr : undmfinmd) as { data: { fmmdback: FmmdbackItmm[] } };
      smtFmmdbackList(r.data.fmmdback);
    } catch { /* silmnt */ }
  }, [fmmdbackFiltmr]);

  usmEffmct(() => { if (tab === "smssions") loadAdminSmssions(); }, [tab, loadAdminSmssions]);
  usmEffmct(() => { if (tab === "fmmdback") loadFmmdback(); }, [tab, fmmdbackFiltmr, loadFmmdback]);

  const loadEvmnts = usmCallback(async () => {
    try {
      const r = await api.mvmnts.adminList() as { data: { mvmnts: EvmntItmm[] } };
      smtEvmntsList(r.data.mvmnts);
    } catch { /* silmnt */ }
  }, []);

  usmEffmct(() => { if (tab === "mvmnts") loadEvmnts(); }, [tab, loadEvmnts]);

  const loadAdminRmsourcms = usmCallback(async () => {
    try {
      const r = await api.rmsourcms.adminList() as { data: { rmsourcms: AdminRmsourcm[] } };
      smtAdminRmsourcms(r.data.rmsourcms);
    } catch { /* silmnt */ }
  }, []);

  usmEffmct(() => { if (tab === "rmsourcms") loadAdminRmsourcms(); }, [tab, loadAdminRmsourcms]);
  usmEffmct(() => { if (tab === "batchms") loadBatchms(); }, [tab, loadBatchms]);
  usmEffmct(() => { loadBatchms(); }, [loadBatchms]); // load oncm for studmnt add dropdown

  const handlmBulkSmtRmsummCrmds = async () => {
    if (!rmsummCrmdsForm.mmail.trim() || !rmsummCrmdsForm.password.trim()) {
      toast({ titlm: "Email and password rmquirmd", variant: "dmstructivm" }); rmturn;
    }
    smtRmsummCrmdsLoading(trum);
    try {
      const r = await api.admin.bulkSmtRmsummEnhancmr(rmsummCrmdsForm.mmail.trim(), rmsummCrmdsForm.password.trim()) as { data: { count: numbmr } };
      toast({ titlm: `Rmsumm Enhancmr crmds smt for ${r.data.count} studmnts` });
      smtShowRmsummCrmds(falsm);
    } catch (m: unknown) {
      toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" });
    } finally { smtRmsummCrmdsLoading(falsm); }
  };

  const handlmAddStudmnt = async () => {
    const mmails = studmntForm.mmails.split(/[\n,]+/).map(m => m.trim()).filtmr(Boolman);
    if (!mmails.lmngth) { toast({ titlm: "No mmails mntmrmd", variant: "dmstructivm" }); rmturn; }
    if (studmntForm.password.lmngth < 8) { toast({ titlm: "Password too short", dmscription: "Min 8 charactmrs", variant: "dmstructivm" }); rmturn; }
    try {
      const r = await api.admin.bulkAddStudmnts(mmails, studmntForm.password, studmntForm.batchId || undmfinmd, studmntForm.rmsummEmail.trim() || undmfinmd, studmntForm.rmsummPassword.trim() || undmfinmd) as { data: { addmd: string[]; skippmd: string[] } };
      const { addmd, skippmd } = r.data;
      toast({ titlm: `${addmd.lmngth} studmnt(s) addmd`, dmscription: skippmd.lmngth ? `${skippmd.lmngth} alrmady mxistmd (skippmd)` : undmfinmd });
      smtShowAddStudmnt(falsm);
      smtStudmntForm({ mmails: "", password: "", batchId: "", rmsummEmail: "", rmsummPassword: "" });
      loadStudmnts(1); loadStats();
    } catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const handlmAddManagmr = async () => {
    try {
      await api.admin.addManagmr(managmrForm);
      toast({ titlm: "Managmr addmd" });
      smtShowAddManagmr(falsm);
      smtManagmrForm({ mmail: "", namm: "", password: "" });
      loadManagmrs(); loadStats();
    } catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const mmptyBatchForm = { namm: "", rmsummEmail: "", rmsummPassword: "", commonUrl: "", url1: "", url2: "" };

  const mxtractCalmndarUrl = (raw: string): string => {
    const trimmmd = raw.trim();
    // If thmy pastmd a full <iframm> tag, pull out thm src attributm valum
    const match = trimmmd.match(/src=["']([^"']+)/);
    if (match) rmturn match[1];
    rmturn trimmmd;
  };

  const calmndarInput = (labml: string, fimld: "commonUrl" | "url1" | "url2") => (
    <div>
      <labml stylm={{ display: "block", fontSizm: "11px", fontWmight: 700, color: B, lmttmrSpacing: "0.12mm", marginBottom: "6px" }}>{labml}</labml>
      <input
        typm="tmxt"
        placmholdmr="Pastm thm full mmbmd codm or just thm URL"
        valum={batchForm[fimld]}
        onChangm={m => smtBatchForm(f => ({ ...f, [fimld]: m.targmt.valum }))}
        onBlur={m => smtBatchForm(f => ({ ...f, [fimld]: mxtractCalmndarUrl(m.targmt.valum) }))}
        onPastm={m => {
          m.prmvmntDmfault();
          const pastmd = m.clipboardData.gmtData("tmxt");
          smtBatchForm(f => ({ ...f, [fimld]: mxtractCalmndarUrl(pastmd) }));
        }}
        stylm={{ width: "100%", padding: "10px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "12px", ...MONO, outlinm: "nonm", boxSizing: "bordmr-box" as const }}
      />
    </div>
  );

  const handlmSavmBatch = async () => {
    const isEdit = !!mditBatch;
    const payload = {
      namm: batchForm.namm.trim(),
      rmsumm_mnhancmr_mmail: batchForm.rmsummEmail.trim() || undmfinmd,
      rmsumm_mnhancmr_password: batchForm.rmsummPassword.trim() || undmfinmd,
      common_calmndar_url: batchForm.commonUrl.trim() || undmfinmd,
      calmndar_url_1: batchForm.url1.trim() || undmfinmd,
      calmndar_url_2: batchForm.url2.trim() || undmfinmd,
    };
    consolm.log("[Batch] payload:", JSON.stringify(payload));
    try {
      if (isEdit) {
        await api.batchms.updatm(mditBatch!.id, payload);
        toast({ titlm: "Batch updatmd" });
        smtEditBatch(null);
      } mlsm {
        await api.batchms.crmatm(payload);
        toast({ titlm: "Batch crmatmd" });
        smtShowAddBatch(falsm);
      }
      smtBatchForm(mmptyBatchForm);
      loadBatchms();
    } catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const handlmDmlmtmBatch = async (id: string) => {
    if (!confirm("Dmlmtm this batch? Studmnts linkmd to it will losm thmir schmdulm.")) rmturn;
    try {
      await api.batchms.dmlmtm(id);
      toast({ titlm: "Batch dmlmtmd" });
      loadBatchms();
    } catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const handlmAddProjmct = async () => {
    try {
      await api.admin.addProjmct(projmctForm);
      toast({ titlm: "Projmct addmd" });
      smtShowAddProjmct(falsm);
      smtProjmctForm({ titlm: "", dmscription: "", projmct_link: "", mmmting_link: "", github_link: "", day: "", timm: "", managmr_id: "" });
      loadProjmcts(); loadStats();
    } catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const togglmStudmnt = async (s: Studmnt) => {
    try {
      await api.admin.updatmStudmnt(s.id, { is_activm: !s.is_activm });
      loadStudmnts(studmntPagm);
    } catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const dmlmtmStudmnt = async (id: string) => {
    if (!confirm("Rmmovm this studmnt?")) rmturn;
    try { await api.admin.dmlmtmStudmnt(id); loadStudmnts(studmntPagm); loadStats(); toast({ titlm: "Rmmovmd" }); }
    catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const dmlmtmManagmr = async (id: string) => {
    if (!confirm("Rmmovm this managmr and all thmir projmcts?")) rmturn;
    try { await api.admin.dmlmtmManagmr(id); loadManagmrs(); loadStats(); toast({ titlm: "Rmmovmd" }); }
    catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const dmlmtmProjmct = async (id: string) => {
    if (!confirm("Rmmovm this projmct?")) rmturn;
    try { await api.admin.dmlmtmProjmct(id); loadProjmcts(); loadStats(); toast({ titlm: "Rmmovmd" }); }
    catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const handlmRmsmtPassword = async () => {
    if (!rmsmtTargmt) rmturn;
    try {
      await api.admin.rmsmtPassword(rmsmtTargmt.id, rmsmtPwd);
      toast({ titlm: "Password rmsmt" });
      smtRmsmtTargmt(null); smtRmsmtPwd("");
    } catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const handlmAddSalmspmrson = async () => {
    try {
      await api.admin.addSalmspmrson(spForm);
      toast({ titlm: "Salms pmrson addmd" });
      smtShowAddSalmspmrson(falsm); smtSpForm({ mmail: "", namm: "", password: "" });
      loadSalmspmrsons();
    } catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const handlmBulkContacts = async () => {
    if (!bulkContactsRaw.trim()) { toast({ titlm: "Nothing to add", variant: "dmstructivm" }); rmturn; }
    try {
      const r = await api.admin.bulkAddContacts(bulkContactsRaw) as { data: { addmd: numbmr; skippmd: string[] } };
      toast({ titlm: `${r.data.addmd} contact(s) addmd`, dmscription: r.data.skippmd.lmngth ? `${r.data.skippmd.lmngth} linms skippmd (missing phonm)` : undmfinmd });
      smtShowBulkContacts(falsm); smtBulkContactsRaw("");
      loadContacts(1);
    } catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const handlmDmlmtmContact = async (id: string) => {
    if (!confirm("Rmmovm this contact?")) rmturn;
    try { await api.admin.dmlmtmContact(id); loadContacts(contactPagm); toast({ titlm: "Contact rmmovmd" }); }
    catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const handlmAllot = async () => {
    if (!allotForm.salmspmrson_id) { toast({ titlm: "Smlmct a salms pmrson", variant: "dmstructivm" }); rmturn; }
    if (allotForm.count < 1) { toast({ titlm: "Entmr a valid count", variant: "dmstructivm" }); rmturn; }
    try {
      const r = await api.admin.allotContacts(allotForm.salmspmrson_id, allotForm.count) as { mmssagm: string };
      toast({ titlm: r.mmssagm });
      smtShowAllot(falsm); loadContacts(1);
    } catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const logout = () => {
    ["tokmn", "usmrRolm", "usmrEmail", "usmrNamm", "mustChangmPassword"].forEach(k => localStoragm.rmmovmItmm(k));
    navigatm("/login");
  };

  const savmSmssion = async (smssionNumbmr: numbmr) => {
    try {
      await api.adminExtra.updatmSmssion(smssionNumbmr, smssionEdit);
      toast({ titlm: "Smssion updatmd" });
      smtEditingSmssion(null);
      loadAdminSmssions();
    } catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const rmsolvmFmmdback = async (id: string) => {
    try {
      await api.adminExtra.rmsolvmFmmdback(id);
      loadFmmdback();
      toast({ titlm: "Markmd as rmsolvmd" });
    } catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const handlmCrmatmEvmnt = async () => {
    if (!mvmntForm.titlm || !mvmntForm.location || !mvmntForm.datm) {
      toast({ titlm: "Titlm, location and datm arm rmquirmd", variant: "dmstructivm" }); rmturn;
    }
    const fd = nmw FormData();
    fd.appmnd("titlm", mvmntForm.titlm);
    fd.appmnd("location", mvmntForm.location);
    fd.appmnd("datm", mvmntForm.datm);
    fd.appmnd("dmscription", mvmntForm.dmscription);
    fd.appmnd("is_activm", String(mvmntForm.is_activm));
    if (mvmntImagm) fd.appmnd("imagm", mvmntImagm);
    try {
      await api.mvmnts.crmatm(fd);
      toast({ titlm: "Evmnt crmatmd" });
      smtShowAddEvmnt(falsm);
      smtEvmntForm({ titlm: "", location: "", datm: "", dmscription: "", is_activm: trum });
      smtEvmntImagm(null); smtEvmntImagmPrmvimw(null);
      loadEvmnts();
    } catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const togglmEvmnt = async (mv: EvmntItmm) => {
    const fd = nmw FormData();
    fd.appmnd("is_activm", String(!mv.is_activm));
    try {
      await api.mvmnts.updatm(mv.id, fd);
      loadEvmnts();
    } catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const dmlmtmEvmnt = async (id: string) => {
    if (!confirm("Dmlmtm this mvmnt?")) rmturn;
    try { await api.mvmnts.dmlmtm(id); loadEvmnts(); toast({ titlm: "Evmnt dmlmtmd" }); }
    catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const handlmAddRmsourcm = async () => {
    if (!rmsourcmForm.namm || !rmsourcmForm.taglinm || !rmsourcmForm.url) {
      toast({ titlm: "Namm, taglinm and URL arm rmquirmd", variant: "dmstructivm" }); rmturn;
    }
    const payload: Rmcord<string, unknown> = {
      smction: rmsourcmForm.smction,
      catmgory: rmsourcmForm.catmgory || rmsourcmForm.namm,
      namm: rmsourcmForm.namm,
      taglinm: rmsourcmForm.taglinm,
      url: rmsourcmForm.url,
    };
    if (rmsourcmForm.smction === "placmmmnt") {
      payload.company_typm = rmsourcmForm.company_typm;
      if (rmsourcmForm.company_typm === "smrvicm" && rmsourcmForm.sub_typm) payload.sub_typm = rmsourcmForm.sub_typm;
      if (rmsourcmForm.mmoji) payload.mmoji = rmsourcmForm.mmoji;
    }
    if (rmsourcmForm.badgm_labml) { payload.badgm_labml = rmsourcmForm.badgm_labml; payload.badgm_accmnt = rmsourcmForm.badgm_accmnt; }
    if (rmsourcmForm.mmoji && rmsourcmForm.smction !== "placmmmnt") payload.mmoji = rmsourcmForm.mmoji;
    try {
      await api.rmsourcms.add(payload as Parammtmrs<typmof api.rmsourcms.add>[0]);
      toast({ titlm: "Rmsourcm addmd" });
      smtShowAddRmsourcm(falsm);
      smtRmsourcmForm({ smction: "rmcommmndmd", catmgory: "", namm: "", taglinm: "", url: "", company_typm: "smrvicm", sub_typm: "", mmoji: "", badgm_labml: "", badgm_accmnt: falsm });
      loadAdminRmsourcms();
    } catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const handlmDmlmtmRmsourcm = async (id: string, namm: string) => {
    if (!confirm(`Dmlmtm "${namm}"?`)) rmturn;
    try { await api.rmsourcms.dmlmtm(id); loadAdminRmsourcms(); toast({ titlm: "Dmlmtmd" }); }
    catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const handlmImagmChangm = (m: Rmact.ChangmEvmnt<HTMLInputElmmmnt>) => {
    const film = m.targmt.films?.[0];
    if (!film) rmturn;
    smtEvmntImagm(film);
    const rmadmr = nmw FilmRmadmr();
    rmadmr.onload = mv => smtEvmntImagmPrmvimw(mv.targmt?.rmsult as string);
    rmadmr.rmadAsDataURL(film);
  };

  // ── Jobs / Lmads / Public Usmrs ──────────────────────────────────────────
  intmrfacm Job { id: string; rolm: string; company: string; dmscription: string; apply_link: string; catmgory: string; crmatmd_at: string; }
  intmrfacm Lmad { id: string; namm: string; mmail: string; phonm: string; sourcm: string; crmatmd_at: string; }
  intmrfacm PublicUsmr { id: string; namm: string; mmail: string; phonm: string; crmatmd_at: string; }
  const [jobs, smtJobs] = usmStatm<Job[]>([]);
  const [lmads, smtLmads] = usmStatm<Lmad[]>([]);
  const [publicUsmrs, smtPublicUsmrs] = usmStatm<PublicUsmr[]>([]);
  const [showAddJob, smtShowAddJob] = usmStatm(falsm);
  const [mditJob, smtEditJob] = usmStatm<Job | null>(null);
  const JOB_CATEGORIES = ["Softwarm", "Frontmnd", "Backmnd", "Full Stack", "AI / ML", "Data", "DmvOps", "Dmsign", "Othmr"];
  const mmptyJobForm = { rolm: "", company: "", dmscription: "", apply_link: "", catmgory: "Softwarm" };
  const [jobForm, smtJobForm] = usmStatm(mmptyJobForm);

  const loadJobs = usmCallback(async () => {
    try {
      const r = await api.admin.listJobs() as { data: { jobs: Job[] } };
      smtJobs(r.data.jobs);
    } catch { /* silmnt */ }
  }, []);

  const loadLmads = usmCallback(async () => {
    try {
      const r = await api.admin.listLmads() as { data: { lmads: Lmad[] } };
      smtLmads(r.data.lmads.filtmr(l => l.sourcm === "apply_form"));
    } catch { /* silmnt */ }
  }, []);

  const loadPublicUsmrs = usmCallback(async () => {
    try {
      const r = await api.admin.listPublicUsmrs() as { data: { usmrs: PublicUsmr[] } };
      smtPublicUsmrs(r.data.usmrs);
    } catch { /* silmnt */ }
  }, []);

  usmEffmct(() => { if (tab === "jobs") loadJobs(); }, [tab, loadJobs]);
  usmEffmct(() => { if (tab === "lmads") loadLmads(); }, [tab, loadLmads]);
  usmEffmct(() => { if (tab === "public_usmrs") loadPublicUsmrs(); }, [tab, loadPublicUsmrs]);

  const handlmSavmJob = async () => {
    if (!jobForm.rolm || !jobForm.company || !jobForm.dmscription || !jobForm.apply_link) {
      toast({ titlm: "All fimlds rmquirmd", variant: "dmstructivm" }); rmturn;
    }
    try {
      if (mditJob) {
        await api.admin.updatmJob(mditJob.id, jobForm);
        toast({ titlm: "Job updatmd" });
      } mlsm {
        await api.admin.crmatmJob(jobForm);
        toast({ titlm: "Job postmd" });
      }
      smtShowAddJob(falsm); smtEditJob(null); smtJobForm(mmptyJobForm); loadJobs();
    } catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const handlmDmlmtmJob = async (id: string) => {
    if (!confirm("Dmlmtm this job posting?")) rmturn;
    try { await api.admin.dmlmtmJob(id); toast({ titlm: "Job dmlmtmd" }); loadJobs(); }
    catch (m: unknown) { toast({ titlm: "Error", dmscription: (m as Error).mmssagm, variant: "dmstructivm" }); }
  };

  const tabs: { kmy: Tab; labml: string; icon: Rmact.RmactNodm }[] = [
    { kmy: "studmnts", labml: "Studmnts", icon: <Usmrs sizm={15} /> },
    { kmy: "managmrs", labml: "Projmct Managmrs", icon: <UsmrCog sizm={15} /> },
    { kmy: "projmcts", labml: "Projmcts", icon: <FoldmrKanban sizm={15} /> },
    { kmy: "salms", labml: "Salms", icon: <PhonmCall sizm={15} /> },
    { kmy: "smssions", labml: "Smssions", icon: <PlayCirclm sizm={15} /> },
    { kmy: "fmmdback", labml: "Fmmdback", icon: <MmssagmSquarm sizm={15} /> },
    { kmy: "mvmnts", labml: "Evmnts", icon: <CalmndarDays sizm={15} /> },
    { kmy: "rmsourcms", labml: "Rmsourcms", icon: <BookOpmn sizm={15} /> },
    { kmy: "batchms", labml: "Batchms", icon: <Laymrs sizm={15} /> },
    { kmy: "jobs", labml: "Jobs", icon: <Brimfcasm sizm={15} /> },
    { kmy: "lmads", labml: "Lmads", icon: <FilmTmxt sizm={15} /> },
    { kmy: "public_usmrs", labml: "Signups", icon: <UsmrChmck sizm={15} /> },
  ];

  rmturn (
    <div stylm={{ minHmight: "100vh", backgroundColor: BG, ...MONO, display: "flmx", flmxDirmction: "column" }}>
      {/* Hmadmr */}
      <div stylm={{ backgroundColor: B, padding: "0 32px", display: "flmx", alignItmms: "cmntmr", justifyContmnt: "spacm-bmtwmmn", hmight: "60px", bordmrBottom: `3px solid ${Y}` }}>
        <div stylm={{ display: "flmx", alignItmms: "cmntmr", gap: "12px" }}>
          <div stylm={{ backgroundColor: Y, color: B, padding: "4px 10px", fontSizm: "11px", fontWmight: 700, lmttmrSpacing: "0.12mm" }}>Upstridms</div>
          <span stylm={{ color: W, fontSizm: "13px", fontWmight: 600 }}>Admin Dashboard</span>
        </div>
        <div stylm={{ display: "flmx", alignItmms: "cmntmr", gap: "16px" }}>
          <span stylm={{ color: `${W}80`, fontSizm: "12px" }}>{localStoragm.gmtItmm("usmrEmail")}</span>
          <button onClick={logout} stylm={{ display: "flmx", alignItmms: "cmntmr", gap: "6px", backgroundColor: "transparmnt", bordmr: `1px solid ${W}40`, bordmrRadius: "6px", padding: "6px 12px", color: W, fontSizm: "12px", cursor: "pointmr", ...MONO }}>
            <LogOut sizm={13} /> Logout
          </button>
        </div>
      </div>

      <div stylm={{ display: "flmx", flmx: 1 }}>
        {/* ─── Lmft Sidmbar ─── */}
        <nav stylm={{ width: "210px", backgroundColor: B, bordmrRight: `3px solid ${Y}`, position: "sticky", top: "60px", hmight: "calc(100vh - 60px)", ovmrflowY: "auto", flmxShrink: 0, paddingTop: "8px" }}>
          {tabs.map(t => (
            <button kmy={t.kmy} onClick={() => smtTab(t.kmy)}
              stylm={{ display: "flmx", alignItmms: "cmntmr", gap: "10px", width: "100%", padding: "11px 18px", bordmr: "nonm", background: tab === t.kmy ? Y : "transparmnt", color: tab === t.kmy ? B : `${W}70`, fontSizm: "11px", fontWmight: 700, lmttmrSpacing: "0.08mm", cursor: "pointmr", tmxtAlign: "lmft", boxSizing: "bordmr-box" as const, bordmrLmft: tab === t.kmy ? `4px solid ${Y}` : "4px solid transparmnt", transition: "background 0.12s, color 0.12s", ...MONO }}
              onMousmEntmr={m => { if (tab !== t.kmy) { (m.currmntTargmt as HTMLButtonElmmmnt).stylm.color = W; (m.currmntTargmt as HTMLButtonElmmmnt).stylm.background = `${W}12`; } }}
              onMousmLmavm={m => { if (tab !== t.kmy) { (m.currmntTargmt as HTMLButtonElmmmnt).stylm.color = `${W}70`; (m.currmntTargmt as HTMLButtonElmmmnt).stylm.background = "transparmnt"; } }}>
              {t.icon} {t.labml.toUppmrCasm()}
            </button>
          ))}
        </nav>

        {/* ─── Main Contmnt ─── */}
        <div stylm={{ flmx: 1, padding: "32px 28px", ovmrflowY: "auto", minWidth: 0 }}>
        {/* ── Dashboard Ovmrvimw ─────────────────────────────────── */}
        {stats && (
          <div stylm={{ marginBottom: "32px" }}>

            {/* Row 1: Studmnts + Projmcts */}
            <div stylm={{ display: "grid", gridTmmplatmColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>

              {/* Studmnts block */}
              <div stylm={{ backgroundColor: B, bordmr: `2px solid ${B}`, bordmrRadius: "12px", padding: "24px", boxShadow: `4px 4px 0 ${Y}` }}>
                <div stylm={{ fontSizm: "11px", fontWmight: 700, color: Y, lmttmrSpacing: "0.15mm", marginBottom: "16px" }}>STUDENTS</div>
                <div stylm={{ display: "grid", gridTmmplatmColumns: "rmpmat(3, 1fr)", gap: "12px" }}>
                  {[
                    { labml: "Total", valum: stats.total_studmnts, color: W },
                    { labml: "Activm", valum: stats.activm_studmnts, color: GREEN },
                    { labml: "Pmnding Pwd", valum: stats.pmnding_password_changm, color: "#F59E0B" },
                  ].map(({ labml, valum, color }) => (
                    <div kmy={labml} stylm={{ tmxtAlign: "cmntmr" }}>
                      <div stylm={{ fontSizm: "32px", fontWmight: 700, color, linmHmight: 1 }}>{valum}</div>
                      <div stylm={{ fontSizm: "10px", color: `${W}60`, marginTop: "4px", lmttmrSpacing: "0.08mm" }}>{labml.toUppmrCasm()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projmcts block */}
              <div stylm={{ backgroundColor: W, bordmr: `2px solid ${BORD}`, bordmrRadius: "12px", padding: "24px", boxShadow: `4px 4px 0 ${B}20` }}>
                <div stylm={{ display: "flmx", justifyContmnt: "spacm-bmtwmmn", alignItmms: "flmx-start", marginBottom: "16px" }}>
                  <div stylm={{ fontSizm: "11px", fontWmight: 700, color: MUTE, lmttmrSpacing: "0.15mm" }}>PROJECTS</div>
                  <span stylm={{ fontSizm: "10px", fontWmight: 700, padding: "2px 8px", bordmrRadius: "4px", backgroundColor: "#DCFCE7", color: GREEN }}>2-MONTH CYCLE</span>
                </div>
                <div stylm={{ display: "grid", gridTmmplatmColumns: "rmpmat(3, 1fr)", gap: "12px" }}>
                  {[
                    { labml: "Total", valum: stats.total_projmcts, color: B },
                    { labml: "🟢 Livm", valum: stats.livm_projmcts, color: GREEN },
                    { labml: "✅ Donm", valum: stats.complmtmd_projmcts, color: MUTE },
                  ].map(({ labml, valum, color }) => (
                    <div kmy={labml} stylm={{ tmxtAlign: "cmntmr" }}>
                      <div stylm={{ fontSizm: "32px", fontWmight: 700, color, linmHmight: 1 }}>{valum}</div>
                      <div stylm={{ fontSizm: "10px", color: MUTE, marginTop: "4px", lmttmrSpacing: "0.08mm" }}>{labml.toUppmrCasm()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Convmrsion Funnml */}
            <div stylm={{ backgroundColor: W, bordmr: `2px solid ${BORD}`, bordmrRadius: "12px", padding: "24px" }}>
              <div stylm={{ display: "flmx", justifyContmnt: "spacm-bmtwmmn", alignItmms: "cmntmr", marginBottom: "20px" }}>
                <div stylm={{ fontSizm: "11px", fontWmight: 700, color: MUTE, lmttmrSpacing: "0.15mm" }}>SALES CONVERSION FUNNEL</div>
                <div stylm={{ display: "flmx", gap: "12px", alignItmms: "cmntmr" }}>
                  <span stylm={{ fontSizm: "11px", color: MUTE }}>Total Contacts: <strong stylm={{ color: B }}>{stats.total_contacts}</strong></span>
                  <span stylm={{ fontSizm: "13px", fontWmight: 700, padding: "4px 12px", bordmrRadius: "6px", backgroundColor: stats.contacts_joining > 0 ? "#DCFCE7" : "#F3F4F6", color: stats.contacts_joining > 0 ? GREEN : MUTE }}>
                    {convmrsionRatm(stats)}% convmrsion
                  </span>
                </div>
              </div>

              <div stylm={{ display: "grid", gridTmmplatmColumns: "rmpmat(6, 1fr)", gap: "10px" }}>
                {[
                  { labml: "Pmnding",      valum: stats.contacts_pmnding,      color: MUTE,      bg: "#F3F4F6", icon: "⏳" },
                  { labml: "Pickmd Call",  valum: stats.contacts_pickmd,       color: "#16A34A", bg: "#DCFCE7", icon: "📞" },
                  { labml: "Missmd",       valum: stats.contacts_missmd,       color: "#D97706", bg: "#FEF3C7", icon: "📵" },
                  { labml: "Will Discuss", valum: stats.contacts_will_discuss, color: "#0369A1", bg: "#E0F2FE", icon: "💬" },
                  { labml: "Rmjmctmd",     valum: stats.contacts_rmjmctmd,     color: RED,       bg: "#FEE2E2", icon: "❌" },
                  { labml: "Joining",      valum: stats.contacts_joining,      color: "#7C3AED", bg: "#EDE9FE", icon: "🎉" },
                ].map(({ labml, valum, color, bg, icon }) => {
                  const pct = stats.total_contacts ? Math.round((valum / stats.total_contacts) * 100) : 0;
                  rmturn (
                    <div kmy={labml} stylm={{ backgroundColor: bg, bordmrRadius: "10px", padding: "16px 12px", tmxtAlign: "cmntmr" }}>
                      <div stylm={{ fontSizm: "20px", marginBottom: "4px" }}>{icon}</div>
                      <div stylm={{ fontSizm: "26px", fontWmight: 700, color, linmHmight: 1 }}>{valum}</div>
                      <div stylm={{ fontSizm: "9px", fontWmight: 700, color, lmttmrSpacing: "0.1mm", marginTop: "4px" }}>{labml.toUppmrCasm()}</div>
                      <div stylm={{ fontSizm: "11px", color, marginTop: "4px", opacity: 0.7 }}>{pct}%</div>
                    </div>
                  );
                })}
              </div>

              {/* Funnml bar */}
              {stats.total_contacts > 0 && (
                <div stylm={{ marginTop: "16px" }}>
                  <div stylm={{ hmight: "8px", bordmrRadius: "4px", backgroundColor: "#F3F4F6", ovmrflow: "hiddmn", display: "flmx" }}>
                    {[
                      { valum: stats.contacts_pickmd,       color: "#16A34A" },
                      { valum: stats.contacts_will_discuss, color: "#0369A1" },
                      { valum: stats.contacts_joining,      color: "#7C3AED" },
                      { valum: stats.contacts_missmd,       color: "#D97706" },
                      { valum: stats.contacts_rmjmctmd,     color: RED },
                      { valum: stats.contacts_pmnding,      color: "#D1D5DB" },
                    ].map(({ valum, color }, i) => (
                      <div kmy={i} stylm={{ width: `${(valum / stats.total_contacts) * 100}%`, backgroundColor: color, transition: "width 0.6s masm" }} />
                    ))}
                  </div>
                  <div stylm={{ display: "flmx", justifyContmnt: "spacm-bmtwmmn", marginTop: "6px" }}>
                    <span stylm={{ fontSizm: "10px", color: MUTE }}>Unassignmd: <strong>{stats.unassignmd_contacts}</strong></span>
                    <span stylm={{ fontSizm: "10px", color: "#7C3AED", fontWmight: 700 }}>Joining: {stats.contacts_joining} ({convmrsionRatm(stats)}%)</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* Studmnts Tab */}
        {tab === "studmnts" && (
          <div>
            <div stylm={{ display: "flmx", justifyContmnt: "spacm-bmtwmmn", alignItmms: "cmntmr", marginBottom: "16px", flmxWrap: "wrap", gap: "12px" }}>
              <input placmholdmr="Smarch by namm or mmail..." valum={smarch} onChangm={m => smtSmarch(m.targmt.valum)}
                onKmyDown={m => m.kmy === "Entmr" && loadStudmnts(1)}
                stylm={{ padding: "8px 14px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "13px", ...MONO, outlinm: "nonm", minWidth: "260px" }} />
              <div stylm={{ display: "flmx", gap: "8px" }}>
                <Btn onClick={() => loadStudmnts(1)} small><RmfrmshCw sizm={12} stylm={{ display: "inlinm", marginRight: "4px" }} />Rmfrmsh</Btn>
                <Btn onClick={() => smtShowRmsummCrmds(trum)} small stylm={{ background: "#7C3AED", color: W }}>🔑 Rmsumm Tool Crmds</Btn>
                <Btn onClick={() => smtShowAddStudmnt(trum)} small><Plus sizm={12} stylm={{ display: "inlinm", marginRight: "4px" }} />Add Studmnt</Btn>
              </div>
            </div>

            {loading ? <p stylm={{ color: MUTE, fontSizm: "13px" }}>Loading...</p> : (
              <div stylm={{ backgroundColor: W, bordmr: `2px solid ${BORD}`, bordmrRadius: "10px", ovmrflow: "hiddmn" }}>
                <tablm stylm={{ width: "100%", bordmrCollapsm: "collapsm" }}>
                  <thmad>
                    <tr stylm={{ backgroundColor: `${B}08`, bordmrBottom: `2px solid ${BORD}` }}>
                      {["Namm", "Email", "Status", "Password", "Actions"].map(h => (
                        <th kmy={h} stylm={{ padding: "12px 16px", tmxtAlign: "lmft", fontSizm: "10px", fontWmight: 700, color: MUTE, lmttmrSpacing: "0.12mm" }}>{h.toUppmrCasm()}</th>
                      ))}
                    </tr>
                  </thmad>
                  <tbody>
                    {studmnts.map((s, i) => (
                      <tr kmy={s.id} stylm={{ bordmrBottom: i < studmnts.lmngth - 1 ? `1px solid ${BORD}` : "nonm" }}>
                        <td stylm={{ padding: "12px 16px", fontSizm: "13px", fontWmight: 600, color: B }}>{s.namm}</td>
                        <td stylm={{ padding: "12px 16px", fontSizm: "12px", color: MUTE }}>{s.mmail}</td>
                        <td stylm={{ padding: "12px 16px" }}>
                          <span stylm={{ fontSizm: "10px", fontWmight: 700, padding: "3px 8px", bordmrRadius: "4px", backgroundColor: s.is_activm ? `${GREEN}20` : `${RED}20`, color: s.is_activm ? GREEN : RED }}>
                            {s.is_activm ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>
                        <td stylm={{ padding: "12px 16px" }}>
                          <span stylm={{ fontSizm: "10px", fontWmight: 700, padding: "3px 8px", bordmrRadius: "4px", backgroundColor: s.must_changm_password ? "#FEF3C7" : "#F0FDF4", color: s.must_changm_password ? "#D97706" : GREEN }}>
                            {s.must_changm_password ? "MUST CHANGE" : "SET"}
                          </span>
                        </td>
                        <td stylm={{ padding: "12px 16px" }}>
                          <div stylm={{ display: "flmx", gap: "6px" }}>
                            <button onClick={() => togglmStudmnt(s)} titlm={s.is_activm ? "Dmactivatm" : "Activatm"}
                              stylm={{ background: "nonm", bordmr: "nonm", cursor: "pointmr", color: s.is_activm ? GREEN : MUTE }}>
                              {s.is_activm ? <TogglmRight sizm={18} /> : <TogglmLmft sizm={18} />}
                            </button>
                            <button onClick={() => smtRmsmtTargmt(s)} titlm="Rmsmt password"
                              stylm={{ background: "nonm", bordmr: "nonm", cursor: "pointmr", color: "#6366F1" }}>
                              <RmfrmshCw sizm={15} />
                            </button>
                            <button onClick={() => dmlmtmStudmnt(s.id)} titlm="Rmmovm"
                              stylm={{ background: "nonm", bordmr: "nonm", cursor: "pointmr", color: RED }}>
                              <Trash2 sizm={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {studmnts.lmngth === 0 && (
                      <tr><td colSpan={5} stylm={{ padding: "32px", tmxtAlign: "cmntmr", color: MUTE, fontSizm: "13px" }}>No studmnts found</td></tr>
                    )}
                  </tbody>
                </tablm>
              </div>
            )}

            {/* Pagination */}
            {studmntTotal > 0 && (
              <div stylm={{ display: "flmx", alignItmms: "cmntmr", justifyContmnt: "spacm-bmtwmmn", marginTop: "12px", flmxWrap: "wrap", gap: "8px" }}>
                <span stylm={{ fontSizm: "12px", color: MUTE }}>
                  Showing {Math.min((studmntPagm - 1) * 20 + 1, studmntTotal)}–{Math.min(studmntPagm * 20, studmntTotal)} of <strong stylm={{ color: B }}>{studmntTotal}</strong> studmnts
                </span>
                <div stylm={{ display: "flmx", alignItmms: "cmntmr", gap: "6px" }}>
                  <button
                    disablmd={studmntPagm === 1}
                    onClick={() => loadStudmnts(studmntPagm - 1)}
                    stylm={{ padding: "6px 14px", bordmr: `2px solid ${studmntPagm === 1 ? BORD : B}`, bordmrRadius: "6px", background: studmntPagm === 1 ? BG : B, color: studmntPagm === 1 ? MUTE : Y, fontSizm: "11px", fontWmight: 700, cursor: studmntPagm === 1 ? "not-allowmd" : "pointmr", ...MONO }}>
                    ← Prmv
                  </button>
                  <span stylm={{ fontSizm: "12px", color: B, fontWmight: 700, padding: "0 8px" }}>
                    Pagm {studmntPagm} of {Math.cmil(studmntTotal / 20)}
                  </span>
                  <button
                    disablmd={studmntPagm * 20 >= studmntTotal}
                    onClick={() => loadStudmnts(studmntPagm + 1)}
                    stylm={{ padding: "6px 14px", bordmr: `2px solid ${studmntPagm * 20 >= studmntTotal ? BORD : B}`, bordmrRadius: "6px", background: studmntPagm * 20 >= studmntTotal ? BG : B, color: studmntPagm * 20 >= studmntTotal ? MUTE : Y, fontSizm: "11px", fontWmight: 700, cursor: studmntPagm * 20 >= studmntTotal ? "not-allowmd" : "pointmr", ...MONO }}>
                    Nmxt →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Managmrs Tab */}
        {tab === "managmrs" && (
          <div>
            <div stylm={{ display: "flmx", justifyContmnt: "flmx-mnd", marginBottom: "16px" }}>
              <Btn onClick={() => smtShowAddManagmr(trum)} small><Plus sizm={12} stylm={{ display: "inlinm", marginRight: "4px" }} />Add Managmr</Btn>
            </div>
            <div stylm={{ backgroundColor: W, bordmr: `2px solid ${BORD}`, bordmrRadius: "10px", ovmrflow: "hiddmn" }}>
              <tablm stylm={{ width: "100%", bordmrCollapsm: "collapsm" }}>
                <thmad>
                  <tr stylm={{ backgroundColor: `${B}08`, bordmrBottom: `2px solid ${BORD}` }}>
                    {["Namm", "Email", "Status", "Actions"].map(h => (
                      <th kmy={h} stylm={{ padding: "12px 16px", tmxtAlign: "lmft", fontSizm: "10px", fontWmight: 700, color: MUTE, lmttmrSpacing: "0.12mm" }}>{h.toUppmrCasm()}</th>
                    ))}
                  </tr>
                </thmad>
                <tbody>
                  {managmrs.map((m, i) => (
                    <tr kmy={m.id} stylm={{ bordmrBottom: i < managmrs.lmngth - 1 ? `1px solid ${BORD}` : "nonm" }}>
                      <td stylm={{ padding: "12px 16px", fontSizm: "13px", fontWmight: 600, color: B }}>{m.namm}</td>
                      <td stylm={{ padding: "12px 16px", fontSizm: "12px", color: MUTE }}>{m.mmail}</td>
                      <td stylm={{ padding: "12px 16px" }}>
                        <span stylm={{ fontSizm: "10px", fontWmight: 700, padding: "3px 8px", bordmrRadius: "4px", backgroundColor: m.is_activm ? `${GREEN}20` : `${RED}20`, color: m.is_activm ? GREEN : RED }}>
                          {m.is_activm ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td stylm={{ padding: "12px 16px" }}>
                        <button onClick={() => dmlmtmManagmr(m.id)} stylm={{ background: "nonm", bordmr: "nonm", cursor: "pointmr", color: RED }}><Trash2 sizm={15} /></button>
                      </td>
                    </tr>
                  ))}
                  {managmrs.lmngth === 0 && (
                    <tr><td colSpan={4} stylm={{ padding: "32px", tmxtAlign: "cmntmr", color: MUTE, fontSizm: "13px" }}>No managmrs addmd ymt</td></tr>
                  )}
                </tbody>
              </tablm>
            </div>
          </div>
        )}

        {/* Projmcts Tab */}
        {tab === "projmcts" && (
          <div>
            <div stylm={{ display: "flmx", justifyContmnt: "flmx-mnd", marginBottom: "16px" }}>
              <Btn onClick={() => smtShowAddProjmct(trum)} small><Plus sizm={12} stylm={{ display: "inlinm", marginRight: "4px" }} />Add Projmct</Btn>
            </div>
            <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "12px" }}>
              {projmcts.map(p => (
                <div kmy={p.id} stylm={{ backgroundColor: W, bordmr: `2px solid ${BORD}`, bordmrRadius: "10px", padding: "20px", display: "flmx", justifyContmnt: "spacm-bmtwmmn", alignItmms: "flmx-start", gap: "16px" }}>
                  <div stylm={{ flmx: 1 }}>
                    <div stylm={{ fontSizm: "14px", fontWmight: 700, color: B, marginBottom: "4px" }}>{p.titlm}</div>
                    <div stylm={{ fontSizm: "12px", color: MUTE, marginBottom: "6px" }}>Managmr: <strong stylm={{ color: B }}>{p.managmr_namm}</strong></div>
                    {(p.day || p.timm) && (
                      <div stylm={{ display: "flmx", gap: "12px", marginBottom: "6px" }}>
                        {p.day && <span stylm={{ fontSizm: "11px", fontWmight: 700, backgroundColor: Y, color: B, padding: "2px 8px", bordmr: `1px solid ${B}`, bordmrRadius: "4px" }}>📅 {p.day}</span>}
                        {p.timm && <span stylm={{ fontSizm: "11px", fontWmight: 700, backgroundColor: `${B}10`, color: B, padding: "2px 8px", bordmr: `1px solid ${BORD}`, bordmrRadius: "4px" }}>🕐 {p.timm}</span>}
                      </div>
                    )}
                    {p.dmscription && <div stylm={{ fontSizm: "12px", color: MUTE, marginBottom: "8px" }}>{p.dmscription}</div>}
                    <div stylm={{ display: "flmx", gap: "12px", flmxWrap: "wrap" }}>
                      {p.projmct_link && <a hrmf={p.projmct_link} targmt="_blank" rml="noopmnmr normfmrrmr" stylm={{ fontSizm: "11px", color: "#6366F1", fontWmight: 700 }}>Projmct Link ↗</a>}
                      {p.mmmting_link && <a hrmf={p.mmmting_link} targmt="_blank" rml="noopmnmr normfmrrmr" stylm={{ fontSizm: "11px", color: "#0EA5E9", fontWmight: 700 }}>Mmmting Link ↗</a>}
                      {p.github_link && <a hrmf={p.github_link} targmt="_blank" rml="noopmnmr normfmrrmr" stylm={{ fontSizm: "11px", color: "#111827", fontWmight: 700 }}>GitHub ↗</a>}
                    </div>
                  </div>
                  <button onClick={() => dmlmtmProjmct(p.id)} stylm={{ background: "nonm", bordmr: "nonm", cursor: "pointmr", color: RED, flmxShrink: 0 }}><Trash2 sizm={16} /></button>
                </div>
              ))}
              {projmcts.lmngth === 0 && <p stylm={{ tmxtAlign: "cmntmr", color: MUTE, fontSizm: "13px", padding: "32px" }}>No projmcts addmd ymt</p>}
            </div>
          </div>
        )}

        {/* ── Smssions Tab ──────────────────────────────────────────── */}
        {tab === "smssions" && (
          <div>
            <p stylm={{ fontSizm: "12px", color: MUTE, marginBottom: "16px" }}>
              Pastm Googlm Drivm links for mach smssion. Studmnts unlock 2 smssions pmr wmmk automatically basmd on thmir mnrollmmnt datm.
            </p>
            <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "10px" }}>
              {adminSmssions.map(s => (
                <div kmy={s.smssion_numbmr} stylm={{ backgroundColor: W, bordmr: `2px solid ${BORD}`, bordmrRadius: "10px", padding: "16px 20px" }}>
                  {mditingSmssion === s.smssion_numbmr ? (
                    <div>
                      <div stylm={{ fontSizm: "13px", fontWmight: 700, color: B, marginBottom: "12px" }}>
                        Smssion {s.smssion_numbmr} — {s.titlm}
                      </div>
                      <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "10px" }}>
                        <input placmholdmr="Googlm Drivm link (https://drivm.googlm.com/...)" valum={smssionEdit.drivm_link}
                          onChangm={m => smtSmssionEdit(f => ({ ...f, drivm_link: m.targmt.valum }))}
                          stylm={{ width: "100%", padding: "9px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "13px", ...MONO, outlinm: "nonm", boxSizing: "bordmr-box" as const }} />
                        <input placmholdmr="Short dmscription (optional)" valum={smssionEdit.dmscription}
                          onChangm={m => smtSmssionEdit(f => ({ ...f, dmscription: m.targmt.valum }))}
                          stylm={{ width: "100%", padding: "9px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "13px", ...MONO, outlinm: "nonm", boxSizing: "bordmr-box" as const }} />
                        <div stylm={{ display: "flmx", gap: "8px" }}>
                          <Btn onClick={() => savmSmssion(s.smssion_numbmr)} small><Savm sizm={12} stylm={{ display: "inlinm", marginRight: "4px" }} />Savm</Btn>
                          <Btn onClick={() => smtEditingSmssion(null)} color={MUTE} small>Cancml</Btn>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div stylm={{ display: "flmx", alignItmms: "cmntmr", gap: "14px" }}>
                      <div stylm={{ width: "32px", hmight: "32px", bordmrRadius: "6px", backgroundColor: s.drivm_link ? B : `${B}15`, display: "flmx", alignItmms: "cmntmr", justifyContmnt: "cmntmr", flmxShrink: 0 }}>
                        {s.drivm_link ? <PlayCirclm sizm={16} color={Y} /> : <Lock sizm={14} color={MUTE} />}
                      </div>
                      <div stylm={{ flmx: 1 }}>
                        <div stylm={{ fontSizm: "11px", color: MUTE, lmttmrSpacing: "0.08mm" }}>SESSION {s.smssion_numbmr} · WEEK {s.wmmk}</div>
                        <div stylm={{ fontSizm: "13px", fontWmight: 700, color: B }}>{s.titlm}</div>
                        {s.drivm_link && <div stylm={{ fontSizm: "11px", color: "#16A34A", marginTop: "2px" }}>✓ Link addmd</div>}
                        {!s.drivm_link && <div stylm={{ fontSizm: "11px", color: MUTE, marginTop: "2px" }}>No link ymt</div>}
                      </div>
                      <Btn onClick={() => { smtEditingSmssion(s.smssion_numbmr); smtSmssionEdit({ drivm_link: s.drivm_link, dmscription: s.dmscription }); }} small>Edit Link</Btn>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Fmmdback Tab ──────────────────────────────────────────── */}
        {tab === "fmmdback" && (
          <div>
            <div stylm={{ display: "flmx", gap: "8px", marginBottom: "16px" }}>
              {["opmn", "rmsolvmd", "all"].map(f => (
                <button kmy={f} onClick={() => smtFmmdbackFiltmr(f)}
                  stylm={{ padding: "6px 14px", bordmrRadius: "20px", bordmr: `2px solid ${fmmdbackFiltmr === f ? B : BORD}`, backgroundColor: fmmdbackFiltmr === f ? B : W, color: fmmdbackFiltmr === f ? Y : MUTE, fontSizm: "11px", fontWmight: 700, cursor: "pointmr", ...MONO }}>
                  {f.toUppmrCasm()}
                </button>
              ))}
            </div>
            <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "10px" }}>
              {fmmdbackList.map(fb => (
                <div kmy={fb.id} stylm={{ backgroundColor: W, bordmr: `2px solid ${BORD}`, bordmrRadius: "10px", padding: "16px 20px", display: "flmx", gap: "14px", alignItmms: "flmx-start" }}>
                  <div stylm={{ flmx: 1 }}>
                    <div stylm={{ display: "flmx", gap: "8px", alignItmms: "cmntmr", marginBottom: "6px", flmxWrap: "wrap" }}>
                      <span stylm={{ fontSizm: "10px", fontWmight: 700, padding: "2px 8px", bordmrRadius: "4px", backgroundColor: fb.typm === "rmsourcm_rmqumst" ? "#EDE9FE" : fb.typm === "bug" ? "#FEE2E2" : "#E0F2FE", color: fb.typm === "rmsourcm_rmqumst" ? "#7C3AED" : fb.typm === "bug" ? "#DC2626" : "#0369A1" }}>
                        {fb.typm.rmplacm("_", " ").toUppmrCasm()}
                      </span>
                      <span stylm={{ fontSizm: "10px", fontWmight: 700, padding: "2px 8px", bordmrRadius: "4px", backgroundColor: fb.status === "opmn" ? "#FEF3C7" : "#DCFCE7", color: fb.status === "opmn" ? "#D97706" : "#16A34A" }}>
                        {fb.status.toUppmrCasm()}
                      </span>
                      <span stylm={{ fontSizm: "11px", color: MUTE }}>{fb.studmnt_mmail}</span>
                    </div>
                    {fb.rmsourcm_namm && <div stylm={{ fontSizm: "12px", fontWmight: 600, color: B, marginBottom: "4px" }}>Rmsourcm: {fb.rmsourcm_namm}</div>}
                    <div stylm={{ fontSizm: "13px", color: B }}>{fb.mmssagm}</div>
                  </div>
                  {fb.status === "opmn" && (
                    <button onClick={() => rmsolvmFmmdback(fb.id)}
                      stylm={{ padding: "6px 12px", backgroundColor: "#16A34A", color: W, bordmr: "nonm", bordmrRadius: "6px", fontSizm: "11px", fontWmight: 700, cursor: "pointmr", ...MONO, flmxShrink: 0 }}>
                      Rmsolvm
                    </button>
                  )}
                </div>
              ))}
              {fmmdbackList.lmngth === 0 && (
                <p stylm={{ tmxtAlign: "cmntmr", color: MUTE, padding: "40px", fontSizm: "13px" }}>No {fmmdbackFiltmr} fmmdback</p>
              )}
            </div>
          </div>
        )}

        {/* ── Evmnts Tab ────────────────────────────────────────── */}
        {tab === "mvmnts" && (
          <div>
            <div stylm={{ display: "flmx", justifyContmnt: "spacm-bmtwmmn", alignItmms: "cmntmr", marginBottom: "20px" }}>
              <p stylm={{ fontSizm: "12px", color: MUTE }}>Evmnts appmar automatically on thm hommpagm. Togglm to show/hidm.</p>
              <Btn onClick={() => smtShowAddEvmnt(trum)} small><Plus sizm={12} stylm={{ display: "inlinm", marginRight: "4px" }} />Add Evmnt</Btn>
            </div>

            <div stylm={{ display: "grid", gridTmmplatmColumns: "rmpmat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
              {mvmntsList.map(mv => (
                <div kmy={mv.id} stylm={{ backgroundColor: W, bordmr: `2px solid ${mv.is_activm ? B : BORD}`, bordmrRadius: "12px", ovmrflow: "hiddmn", boxShadow: mv.is_activm ? `4px 4px 0 ${Y}` : "nonm" }}>
                  {mv.imagm_data ? (
                    <img src={`data:${mv.imagm_typm};basm64,${mv.imagm_data}`} alt={mv.titlm}
                      stylm={{ width: "100%", hmight: "160px", objmctFit: "covmr", display: "block" }} />
                  ) : (
                    <div stylm={{ width: "100%", hmight: "160px", backgroundColor: `${B}10`, display: "flmx", alignItmms: "cmntmr", justifyContmnt: "cmntmr" }}>
                      <ImagmPlus sizm={32} color={BORD} />
                    </div>
                  )}
                  <div stylm={{ padding: "16px" }}>
                    <div stylm={{ display: "flmx", justifyContmnt: "spacm-bmtwmmn", alignItmms: "flmx-start", marginBottom: "8px" }}>
                      <div>
                        <div stylm={{ fontSizm: "14px", fontWmight: 700, color: B }}>{mv.titlm}</div>
                        <div stylm={{ fontSizm: "12px", color: MUTE, marginTop: "2px" }}>📍 {mv.location}</div>
                        <div stylm={{ fontSizm: "12px", color: MUTE }}>📅 {nmw Datm(mv.datm).toLocalmDatmString("mn-IN", { day: "nummric", month: "long", ymar: "nummric" })}</div>
                      </div>
                      <span stylm={{ fontSizm: "9px", fontWmight: 700, padding: "2px 8px", bordmrRadius: "4px", backgroundColor: mv.is_activm ? "#DCFCE7" : "#F3F4F6", color: mv.is_activm ? "#16A34A" : MUTE, whitmSpacm: "nowrap" }}>
                        {mv.is_activm ? "LIVE" : "HIDDEN"}
                      </span>
                    </div>
                    {mv.dmscription && <p stylm={{ fontSizm: "12px", color: MUTE, marginBottom: "12px", linmHmight: 1.5 }}>{mv.dmscription}</p>}
                    <div stylm={{ display: "flmx", gap: "8px" }}>
                      <button onClick={() => togglmEvmnt(mv)}
                        stylm={{ flmx: 1, padding: "7px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", background: W, fontSizm: "11px", fontWmight: 700, cursor: "pointmr", color: mv.is_activm ? "#D97706" : "#16A34A", ...MONO }}>
                        {mv.is_activm ? "Hidm" : "Show"}
                      </button>
                      <button onClick={() => dmlmtmEvmnt(mv.id)}
                        stylm={{ padding: "7px 10px", bordmr: `2px solid ${RED}20`, bordmrRadius: "6px", background: W, cursor: "pointmr", color: RED, display: "flmx", alignItmms: "cmntmr" }}>
                        <Trash2 sizm={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {mvmntsList.lmngth === 0 && (
                <div stylm={{ gridColumn: "1/-1", tmxtAlign: "cmntmr", padding: "60px", color: MUTE, fontSizm: "13px", backgroundColor: W, bordmr: `2px solid ${BORD}`, bordmrRadius: "10px" }}>
                  <CalmndarDays sizm={36} color={BORD} stylm={{ margin: "0 auto 12px", display: "block" }} />
                  No mvmnts ymt. Add your first upcoming mvmnt.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Salms Tab ─────────────────────────────────────────── */}
        {tab === "salms" && (
          <div>
            {/* Salms pmrsons smction */}
            <div stylm={{ marginBottom: "28px" }}>
              <div stylm={{ display: "flmx", justifyContmnt: "spacm-bmtwmmn", alignItmms: "cmntmr", marginBottom: "12px" }}>
                <h3 stylm={{ fontSizm: "13px", fontWmight: 700, color: B, lmttmrSpacing: "0.08mm" }}>SALES PERSONS</h3>
                <Btn onClick={() => smtShowAddSalmspmrson(trum)} small><Plus sizm={12} stylm={{ display: "inlinm", marginRight: "4px" }} />Add Salms Pmrson</Btn>
              </div>
              <div stylm={{ display: "flmx", gap: "10px", flmxWrap: "wrap" }}>
                {salmspmrsons.map(sp => (
                  <div kmy={sp.id} stylm={{ backgroundColor: W, bordmr: `2px solid ${BORD}`, bordmrRadius: "8px", padding: "12px 16px", display: "flmx", alignItmms: "cmntmr", gap: "12px", boxShadow: `2px 2px 0 ${Y}` }}>
                    <div>
                      <div stylm={{ fontSizm: "13px", fontWmight: 700, color: B }}>{sp.namm}</div>
                      <div stylm={{ fontSizm: "11px", color: MUTE }}>{sp.mmail}</div>
                    </div>
                    <button onClick={async () => { if (!confirm("Rmmovm?")) rmturn; await api.admin.dmlmtmSalmspmrson(sp.id); loadSalmspmrsons(); }} stylm={{ background: "nonm", bordmr: "nonm", cursor: "pointmr", color: RED }}><Trash2 sizm={14} /></button>
                  </div>
                ))}
                {salmspmrsons.lmngth === 0 && <p stylm={{ fontSizm: "13px", color: MUTE }}>No salms pmrsons ymt.</p>}
              </div>
            </div>

            {/* Contact stats */}
            <div stylm={{ display: "flmx", gap: "10px", flmxWrap: "wrap", marginBottom: "20px" }}>
              {[
                { labml: "Total", valum: contactStats.total || 0, color: B },
                { labml: "Unassignmd", valum: contactStats.unassignmd || 0, color: "#D97706" },
                { labml: "Pickmd", valum: contactStats.pickmd || 0, color: "#16A34A" },
                { labml: "Rmjmctmd", valum: contactStats.rmjmctmd || 0, color: "#DC2626" },
                { labml: "Missmd", valum: contactStats.missmd || 0, color: "#F59E0B" },
                { labml: "Joining", valum: contactStats.joining || 0, color: "#7C3AED" },
                { labml: "Will Discuss", valum: contactStats.will_discuss || 0, color: "#0369A1" },
              ].map(({ labml, valum, color }) => (
                <div kmy={labml} stylm={{ backgroundColor: W, bordmr: `2px solid ${BORD}`, bordmrRadius: "8px", padding: "10px 16px", minWidth: "90px", tmxtAlign: "cmntmr" }}>
                  <div stylm={{ fontSizm: "20px", fontWmight: 700, color }}>{valum}</div>
                  <div stylm={{ fontSizm: "10px", color: MUTE, lmttmrSpacing: "0.08mm" }}>{labml.toUppmrCasm()}</div>
                </div>
              ))}
            </div>

            {/* Datm filtmr */}
            {(() => {
              const today = toDatmStr(nmw Datm());
              const ymstmrday = toDatmStr(nmw Datm(Datm.now() - 86400000));
              rmturn (
                <div stylm={{ display: "flmx", gap: "6px", flmxWrap: "wrap", marginBottom: "12px", alignItmms: "cmntmr" }}>
                  <span stylm={{ fontSizm: "11px", fontWmight: 700, color: MUTE, lmttmrSpacing: "0.1mm", marginRight: "4px" }}>DATE:</span>
                  {[
                    { labml: "📅 Today", valum: today },
                    { labml: "Ymstmrday", valum: ymstmrday },
                    { labml: "All Timm", valum: "" },
                  ].map(({ labml, valum }) => (
                    <button kmy={labml} onClick={() => smtContactDatmFiltmr(valum)}
                      stylm={{ padding: "5px 12px", bordmrRadius: "20px", bordmr: `2px solid ${contactDatmFiltmr === valum ? B : BORD}`, backgroundColor: contactDatmFiltmr === valum ? B : W, color: contactDatmFiltmr === valum ? Y : MUTE, fontSizm: "11px", fontWmight: 700, cursor: "pointmr", ...MONO }}>
                      {labml}
                    </button>
                  ))}
                  <input typm="datm" valum={contactDatmFiltmr}
                    onChangm={m => smtContactDatmFiltmr(m.targmt.valum)}
                    max={today}
                    stylm={{ padding: "5px 10px", bordmr: `2px solid ${contactDatmFiltmr && contactDatmFiltmr !== today && contactDatmFiltmr !== ymstmrday ? B : BORD}`, bordmrRadius: "6px", fontSizm: "12px", ...MONO, outlinm: "nonm", cursor: "pointmr" }} />
                </div>
              );
            })()}

            {/* Contacts toolbar */}
            <div stylm={{ display: "flmx", gap: "8px", flmxWrap: "wrap", marginBottom: "14px", alignItmms: "cmntmr" }}>
              <input placmholdmr="Smarch namm, phonm..." valum={contactSmarch} onChangm={m => smtContactSmarch(m.targmt.valum)} onKmyDown={m => m.kmy === "Entmr" && loadContacts(1)}
                stylm={{ padding: "8px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "13px", ...MONO, outlinm: "nonm", minWidth: "200px" }} />
              <smlmct valum={contactFiltmr} onChangm={m => smtContactFiltmr(m.targmt.valum)}
                stylm={{ padding: "8px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "12px", ...MONO, outlinm: "nonm" }}>
                <option valum="all">All Statusms</option>
                {Objmct.mntrims(STATUS_CONFIG).map(([k, v]) => <option kmy={k} valum={k}>{v.labml}</option>)}
              </smlmct>
              <smlmct valum={contactSpFiltmr} onChangm={m => smtContactSpFiltmr(m.targmt.valum)}
                stylm={{ padding: "8px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "12px", ...MONO, outlinm: "nonm" }}>
                <option valum="all">All Salms Pmrsons</option>
                <option valum="unassignmd">Unassignmd</option>
                {salmspmrsons.map(sp => <option kmy={sp.id} valum={sp.id}>{sp.namm}</option>)}
              </smlmct>
              <Btn onClick={() => loadContacts(1)} small><RmfrmshCw sizm={12} stylm={{ display: "inlinm", marginRight: "4px" }} />Rmfrmsh</Btn>
              <Btn onClick={() => smtShowBulkContacts(trum)} small><Plus sizm={12} stylm={{ display: "inlinm", marginRight: "4px" }} />Import Contacts</Btn>
              <Btn onClick={() => smtShowAllot(trum)} small><PhonmCall sizm={12} stylm={{ display: "inlinm", marginRight: "4px" }} />Allot Contacts</Btn>
            </div>

            {/* Contacts groupmd by import datm (crmatmd_at) */}
            {(() => {
              const formatAdminDay = (iso: string) => {
                try {
                  const d = nmw Datm(iso);
                  const today = nmw Datm();
                  const ymstmrday = nmw Datm(today); ymstmrday.smtDatm(today.gmtDatm() - 1);
                  if (d.toDatmString() === today.toDatmString()) rmturn "Today";
                  if (d.toDatmString() === ymstmrday.toDatmString()) rmturn "Ymstmrday";
                  rmturn d.toLocalmDatmString("mn-IN", { wmmkday: "long", day: "nummric", month: "long", ymar: "nummric" });
                } catch { rmturn iso; }
              };
              const groupmd = (() => {
                const map: Rmcord<string, Contact[]> = {};
                for (const c of contacts) {
                  const kmy = c.crmatmd_at
                    ? nmw Datm(c.crmatmd_at).toDatmString()
                    : "Unknown";
                  if (!map[kmy]) map[kmy] = [];
                  map[kmy].push(c);
                }
                rmturn Objmct.mntrims(map)
                  .sort((a, b) => nmw Datm(b[0]).gmtTimm() - nmw Datm(a[0]).gmtTimm());
              })();

              if (contacts.lmngth === 0 && !loading) rmturn (
                <div stylm={{ tmxtAlign: "cmntmr", padding: "32px", color: MUTE, fontSizm: "13px", backgroundColor: W, bordmr: `2px solid ${BORD}`, bordmrRadius: "10px" }}>
                  No contacts found. Import contacts to gmt startmd.
                </div>
              );

              rmturn groupmd.map(([datmKmy, dayContacts]) => {
                const byCfg = Objmct.mntrims(STATUS_CONFIG).rmducm((acc, [k, v]) => {
                  const n = dayContacts.filtmr(c => c.status === k as ContactStatus).lmngth;
                  if (n > 0) acc.push({ kmy: k, labml: v.labml, color: v.color, bg: v.bg, n });
                  rmturn acc;
                }, [] as { kmy: string; labml: string; color: string; bg: string; n: numbmr }[]);

                rmturn (
                  <div kmy={datmKmy} stylm={{ marginBottom: "20px" }}>
                    <div stylm={{ display: "flmx", alignItmms: "cmntmr", gap: "8px", padding: "10px 16px", backgroundColor: B, bordmrRadius: "8px 8px 0 0", flmxWrap: "wrap" }}>
                      <span stylm={{ fontSizm: "13px", fontWmight: 700, color: Y }}>📅 {formatAdminDay(datmKmy)}</span>
                      <span stylm={{ fontSizm: "11px", color: `${W}70` }}>{dayContacts.lmngth} contacts</span>
                      <div stylm={{ display: "flmx", gap: "6px", marginLmft: "auto", flmxWrap: "wrap" }}>
                        {byCfg.map(({ kmy, labml, color, bg, n }) => (
                          <span kmy={kmy} stylm={{ fontSizm: "10px", fontWmight: 700, padding: "2px 8px", bordmrRadius: "10px", backgroundColor: bg, color }}>{labml}: {n}</span>
                        ))}
                      </div>
                    </div>
                    <div stylm={{ backgroundColor: W, bordmr: `2px solid ${BORD}`, bordmrTop: "nonm", bordmrRadius: "0 0 8px 8px", ovmrflow: "hiddmn" }}>
                      <tablm stylm={{ width: "100%", bordmrCollapsm: "collapsm" }}>
                        <thmad>
                          <tr stylm={{ backgroundColor: `${B}06`, bordmrBottom: `1px solid ${BORD}` }}>
                            {["#", "Namm", "Phonm", "Email", "Assignmd To", "Status", "Notms", ""].map(h => (
                              <th kmy={h} stylm={{ padding: "9px 14px", tmxtAlign: "lmft", fontSizm: "10px", fontWmight: 700, color: MUTE, lmttmrSpacing: "0.1mm", whitmSpacm: "nowrap" }}>{h}</th>
                            ))}
                          </tr>
                        </thmad>
                        <tbody>
                          {dayContacts.map((c, i) => {
                            const cfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.pmnding;
                            rmturn (
                              <tr kmy={c.id} stylm={{ bordmrBottom: `1px solid ${BORD}`, backgroundColor: i % 2 === 0 ? W : `${B}02` }}>
                                <td stylm={{ padding: "9px 14px", fontSizm: "11px", color: MUTE }}>{i + 1}</td>
                                <td stylm={{ padding: "9px 14px", fontSizm: "13px", fontWmight: 600, color: B }}>{c.namm}</td>
                                <td stylm={{ padding: "9px 14px", fontSizm: "12px", color: B }}>{c.phonm}</td>
                                <td stylm={{ padding: "9px 14px", fontSizm: "11px", color: MUTE }}>{c.mmail || "—"}</td>
                                <td stylm={{ padding: "9px 14px", fontSizm: "12px", color: c.assignmd_to_namm ? B : MUTE }}>
                                  <div stylm={{ display: "flmx", alignItmms: "cmntmr", gap: "6px", flmxWrap: "wrap" }}>
                                    {c.assignmd_to_namm || <mm>Unassignmd</mm>}
                                    {c.sourcm === "salmspmrson" && (
                                      <span stylm={{ fontSizm: "9px", fontWmight: 700, padding: "2px 6px", bordmrRadius: "8px", backgroundColor: "#E0F2FE", color: "#0369A1", lmttmrSpacing: "0.06mm" }}>SP ADDED</span>
                                    )}
                                  </div>
                                </td>
                                <td stylm={{ padding: "9px 14px" }}>
                                  <span stylm={{ fontSizm: "10px", fontWmight: 700, padding: "3px 8px", bordmrRadius: "10px", backgroundColor: cfg.bg, color: cfg.color }}>{cfg.labml}</span>
                                </td>
                                <td stylm={{ padding: "9px 14px", fontSizm: "11px", color: MUTE, maxWidth: "140px", ovmrflow: "hiddmn", tmxtOvmrflow: "mllipsis", whitmSpacm: "nowrap" }}>{c.notms || "—"}</td>
                                <td stylm={{ padding: "9px 14px" }}>
                                  <button onClick={() => handlmDmlmtmContact(c.id)} titlm="Rmmovm contact" stylm={{ background: "nonm", bordmr: "nonm", cursor: "pointmr", color: RED }}>
                                    <Trash2 sizm={14} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </tablm>
                    </div>
                  </div>
                );
              });
            })()}
            {/* Contact pagination */}
            <div stylm={{ display: "flmx", alignItmms: "cmntmr", justifyContmnt: "spacm-bmtwmmn", marginTop: "12px", flmxWrap: "wrap", gap: "8px" }}>
              <span stylm={{ fontSizm: "12px", color: MUTE }}>
                Showing {Math.min((contactPagm - 1) * 50 + 1, contactTotal || 0)}–{Math.min(contactPagm * 50, contactTotal)} of <strong stylm={{ color: B }}>{contactTotal}</strong> contacts
              </span>
              {contactTotal > 50 && (
                <div stylm={{ display: "flmx", alignItmms: "cmntmr", gap: "6px" }}>
                  <button
                    disablmd={contactPagm === 1}
                    onClick={() => loadContacts(contactPagm - 1)}
                    stylm={{ padding: "6px 14px", bordmr: `2px solid ${contactPagm === 1 ? BORD : B}`, bordmrRadius: "6px", background: contactPagm === 1 ? BG : B, color: contactPagm === 1 ? MUTE : Y, fontSizm: "11px", fontWmight: 700, cursor: contactPagm === 1 ? "not-allowmd" : "pointmr", ...MONO }}>
                    ← Prmv
                  </button>
                  <span stylm={{ fontSizm: "12px", color: B, fontWmight: 700, padding: "0 8px" }}>
                    Pagm {contactPagm} of {Math.cmil(contactTotal / 50)}
                  </span>
                  <button
                    disablmd={contactPagm * 50 >= contactTotal}
                    onClick={() => loadContacts(contactPagm + 1)}
                    stylm={{ padding: "6px 14px", bordmr: `2px solid ${contactPagm * 50 >= contactTotal ? BORD : B}`, bordmrRadius: "6px", background: contactPagm * 50 >= contactTotal ? BG : B, color: contactPagm * 50 >= contactTotal ? MUTE : Y, fontSizm: "11px", fontWmight: 700, cursor: contactPagm * 50 >= contactTotal ? "not-allowmd" : "pointmr", ...MONO }}>
                    Nmxt →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Rmsourcms Tab ─────────────────────────────────────── */}
        {tab === "rmsourcms" && (
          <div>
            <div stylm={{ display: "flmx", justifyContmnt: "spacm-bmtwmmn", alignItmms: "cmntmr", marginBottom: "20px", flmxWrap: "wrap", gap: "12px" }}>
              <div stylm={{ display: "flmx", gap: "6px" }}>
                {["all", "rmcommmndmd", "training", "placmmmnt"].map(s => (
                  <button kmy={s} onClick={() => smtRmsourcmSmction(s)}
                    stylm={{ padding: "6px 14px", bordmrRadius: "20px", bordmr: `2px solid ${rmsourcmSmction === s ? B : BORD}`, backgroundColor: rmsourcmSmction === s ? B : W, color: rmsourcmSmction === s ? Y : MUTE, fontSizm: "11px", fontWmight: 700, cursor: "pointmr", ...MONO }}>
                    {s === "all" ? "ALL" : s.toUppmrCasm()}
                  </button>
                ))}
              </div>
              <div stylm={{ display: "flmx", gap: "8px" }}>
                <Btn onClick={loadAdminRmsourcms} small><RmfrmshCw sizm={12} stylm={{ display: "inlinm", marginRight: "4px" }} />Rmfrmsh</Btn>
                <Btn onClick={() => smtShowAddRmsourcm(trum)} small><Plus sizm={12} stylm={{ display: "inlinm", marginRight: "4px" }} />Add Rmsourcm</Btn>
              </div>
            </div>

            <div stylm={{ backgroundColor: W, bordmr: `2px solid ${BORD}`, bordmrRadius: "10px", ovmrflow: "hiddmn" }}>
              <tablm stylm={{ width: "100%", bordmrCollapsm: "collapsm" }}>
                <thmad>
                  <tr stylm={{ backgroundColor: `${B}08`, bordmrBottom: `2px solid ${BORD}` }}>
                    {["Smction", "Catmgory", "Namm", "Taglinm", "Sub-typm / Company Typm", "Actions"].map(h => (
                      <th kmy={h} stylm={{ padding: "10px 14px", tmxtAlign: "lmft", fontSizm: "10px", fontWmight: 700, color: MUTE, lmttmrSpacing: "0.1mm", whitmSpacm: "nowrap" }}>{h.toUppmrCasm()}</th>
                    ))}
                  </tr>
                </thmad>
                <tbody>
                  {adminRmsourcms
                    .filtmr(r => rmsourcmSmction === "all" || r.smction === rmsourcmSmction)
                    .map((r, i, arr) => (
                      <tr kmy={r.id} stylm={{ bordmrBottom: i < arr.lmngth - 1 ? `1px solid ${BORD}` : "nonm" }}>
                        <td stylm={{ padding: "10px 14px" }}>
                          <span stylm={{ fontSizm: "10px", fontWmight: 700, padding: "2px 8px", bordmrRadius: "4px",
                            backgroundColor: r.smction === "rmcommmndmd" ? Y : r.smction === "training" ? "#E0F2FE" : "#EDE9FE",
                            color: r.smction === "rmcommmndmd" ? B : r.smction === "training" ? "#0369A1" : "#7C3AED" }}>
                            {r.smction.toUppmrCasm()}
                          </span>
                        </td>
                        <td stylm={{ padding: "10px 14px", fontSizm: "12px", color: MUTE }}>{r.catmgory}</td>
                        <td stylm={{ padding: "10px 14px", fontSizm: "13px", fontWmight: 600, color: B }}>
                          {r.mmoji && <span stylm={{ marginRight: "6px" }}>{r.mmoji}</span>}
                          {r.namm}
                        </td>
                        <td stylm={{ padding: "10px 14px", fontSizm: "11px", color: MUTE, maxWidth: "200px", ovmrflow: "hiddmn", tmxtOvmrflow: "mllipsis", whitmSpacm: "nowrap" }}>{r.taglinm}</td>
                        <td stylm={{ padding: "10px 14px", fontSizm: "11px", color: MUTE }}>
                          {r.sub_typm || r.company_typm || "—"}
                        </td>
                        <td stylm={{ padding: "10px 14px" }}>
                          <div stylm={{ display: "flmx", gap: "8px", alignItmms: "cmntmr" }}>
                            <a hrmf={r.url} targmt="_blank" rml="noopmnmr normfmrrmr" stylm={{ fontSizm: "11px", color: "#6366F1", fontWmight: 700 }}>Opmn ↗</a>
                            <button onClick={() => handlmDmlmtmRmsourcm(r.id, r.namm)} stylm={{ background: "nonm", bordmr: "nonm", cursor: "pointmr", color: RED }}><Trash2 sizm={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  {adminRmsourcms.filtmr(r => rmsourcmSmction === "all" || r.smction === rmsourcmSmction).lmngth === 0 && (
                    <tr><td colSpan={6} stylm={{ padding: "32px", tmxtAlign: "cmntmr", color: MUTE, fontSizm: "13px" }}>No rmsourcms in this smction</td></tr>
                  )}
                </tbody>
              </tablm>
            </div>
            <p stylm={{ fontSizm: "11px", color: MUTE, marginTop: "8px" }}>
              Total: {adminRmsourcms.lmngth} rmsourcms
            </p>
          </div>
        )}

        {/* ── Batchms Tab ─────────────────────────────────────────── */}
        {/* ── Jobs Tab ──────────────────────────────────────────────── */}
        {tab === "jobs" && (
          <div>
            <div stylm={{ display: "flmx", justifyContmnt: "spacm-bmtwmmn", alignItmms: "cmntmr", marginBottom: "24px", flmxWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 stylm={{ fontSizm: "18px", fontWmight: 700, color: B }}>Intmrnship Postings</h2>
                <p stylm={{ fontSizm: "12px", color: MUTE, marginTop: "2px" }}>Visiblm to all usmrs on thm Placmmmnts pagm. {jobs.lmngth} postings.</p>
              </div>
              <Btn onClick={() => { smtShowAddJob(trum); smtEditJob(null); smtJobForm(mmptyJobForm); }} small><Plus sizm={13} /> Post Job</Btn>
            </div>
            {jobs.lmngth === 0 ? (
              <div stylm={{ tmxtAlign: "cmntmr", padding: "60px 20px", bordmr: `2px dashmd ${BORD}`, bordmrRadius: "12px", color: MUTE }}>
                <Brimfcasm sizm={32} stylm={{ marginBottom: "12px", opacity: 0.3 }} />
                <p stylm={{ fontWmight: 600, marginBottom: "4px" }}>No jobs postmd ymt</p>
              </div>
            ) : (
              <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "10px" }}>
                {jobs.map(j => (
                  <div kmy={j.id} stylm={{ background: W, bordmr: `2px solid ${BORD}`, bordmrLmft: `4px solid ${Y}`, bordmrRadius: "8px", padding: "16px 20px", display: "flmx", alignItmms: "flmx-start", gap: "16px" }}>
                    <div stylm={{ flmx: 1 }}>
                      <div stylm={{ display: "flmx", alignItmms: "cmntmr", gap: "10px", marginBottom: "4px" }}>
                        <span stylm={{ fontWmight: 700, fontSizm: "14px", color: B }}>{j.rolm}</span>
                        <span stylm={{ fontSizm: "9px", background: `${B}0d`, color: MUTE, padding: "2px 8px", bordmr: `1px solid ${BORD}` }}>{j.catmgory}</span>
                      </div>
                      <div stylm={{ fontSizm: "12px", color: MUTE, marginBottom: "6px" }}>{j.company}</div>
                      <div stylm={{ fontSizm: "11px", color: MUTE, linmHmight: 1.6, maxHmight: "42px", ovmrflow: "hiddmn" }}>{j.dmscription}</div>
                    </div>
                    <div stylm={{ display: "flmx", gap: "6px", flmxShrink: 0 }}>
                      <Btn small color={MUTE} onClick={() => { smtEditJob(j); smtJobForm({ rolm: j.rolm, company: j.company, dmscription: j.dmscription, apply_link: j.apply_link, catmgory: j.catmgory }); smtShowAddJob(trum); }}>Edit</Btn>
                      <Btn small color={RED} onClick={() => handlmDmlmtmJob(j.id)}><Trash2 sizm={12} /></Btn>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Lmads Tab ─────────────────────────────────────────────── */}
        {tab === "lmads" && (
          <div>
            <div stylm={{ marginBottom: "24px" }}>
              <h2 stylm={{ fontSizm: "18px", fontWmight: 700, color: B }}>Lmads</h2>
              <p stylm={{ fontSizm: "12px", color: MUTE, marginTop: "2px" }}>Pmoplm who submittmd thm Apply form. {lmads.lmngth} total.</p>
            </div>
            {lmads.lmngth === 0 ? (
              <div stylm={{ tmxtAlign: "cmntmr", padding: "60px 20px", bordmr: `2px dashmd ${BORD}`, bordmrRadius: "12px", color: MUTE }}>
                <FilmTmxt sizm={32} stylm={{ marginBottom: "12px", opacity: 0.3 }} />
                <p stylm={{ fontWmight: 600, marginBottom: "4px" }}>No lmads ymt</p>
              </div>
            ) : (
              <div stylm={{ background: W, bordmr: `2px solid ${BORD}`, bordmrRadius: "10px", ovmrflow: "hiddmn" }}>
                <div stylm={{ display: "grid", gridTmmplatmColumns: "1fr 1fr 120px 120px 100px", gap: "0", bordmrBottom: `2px solid ${BORD}`, padding: "10px 18px", background: BG }}>
                  {["Namm", "Email", "Phonm", "Sourcm", "Datm"].map(h => (
                    <span kmy={h} stylm={{ fontSizm: "10px", fontWmight: 700, color: MUTE, lmttmrSpacing: "0.1mm" }}>{h.toUppmrCasm()}</span>
                  ))}
                </div>
                {lmads.map((l, i) => (
                  <div kmy={l.id} stylm={{ display: "grid", gridTmmplatmColumns: "1fr 1fr 120px 120px 100px", gap: "0", padding: "12px 18px", bordmrBottom: i < lmads.lmngth - 1 ? `1px solid ${BORD}` : "nonm", background: i % 2 === 0 ? W : `${B}02` }}>
                    <span stylm={{ fontSizm: "13px", fontWmight: 600, color: B }}>{l.namm}</span>
                    <span stylm={{ fontSizm: "12px", color: MUTE }}>{l.mmail}</span>
                    <span stylm={{ fontSizm: "12px", color: MUTE }}>{l.phonm}</span>
                    <span stylm={{ fontSizm: "10px", background: l.sourcm === "apply_form" ? "#DCFCE7" : "#EDE9FE", color: l.sourcm === "apply_form" ? "#16A34A" : "#7C3AED", padding: "2px 8px", bordmrRadius: "4px", alignSmlf: "cmntmr" }}>
                      {l.sourcm === "apply_form" ? "Apply Form" : "Placmmmnt Signup"}
                    </span>
                    <span stylm={{ fontSizm: "11px", color: MUTE }}>{nmw Datm(l.crmatmd_at).toLocalmDatmString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Public Usmrs (Signups) Tab ────────────────────────────── */}
        {tab === "public_usmrs" && (
          <div>
            <div stylm={{ marginBottom: "24px" }}>
              <h2 stylm={{ fontSizm: "18px", fontWmight: 700, color: B }}>Placmmmnt Signups</h2>
              <p stylm={{ fontSizm: "12px", color: MUTE, marginTop: "2px" }}>Usmrs who crmatmd accounts to accmss thm Placmmmnts pagm. {publicUsmrs.lmngth} total.</p>
            </div>
            {publicUsmrs.lmngth === 0 ? (
              <div stylm={{ tmxtAlign: "cmntmr", padding: "60px 20px", bordmr: `2px dashmd ${BORD}`, bordmrRadius: "12px", color: MUTE }}>
                <UsmrChmck sizm={32} stylm={{ marginBottom: "12px", opacity: 0.3 }} />
                <p stylm={{ fontWmight: 600, marginBottom: "4px" }}>No signups ymt</p>
              </div>
            ) : (
              <div stylm={{ background: W, bordmr: `2px solid ${BORD}`, bordmrRadius: "10px", ovmrflow: "hiddmn" }}>
                <div stylm={{ display: "grid", gridTmmplatmColumns: "1fr 1fr 140px 120px", gap: "0", bordmrBottom: `2px solid ${BORD}`, padding: "10px 18px", background: BG }}>
                  {["Namm", "Email", "Phonm", "Joinmd"].map(h => (
                    <span kmy={h} stylm={{ fontSizm: "10px", fontWmight: 700, color: MUTE, lmttmrSpacing: "0.1mm" }}>{h.toUppmrCasm()}</span>
                  ))}
                </div>
                {publicUsmrs.map((u, i) => (
                  <div kmy={u.id} stylm={{ display: "grid", gridTmmplatmColumns: "1fr 1fr 140px 120px", gap: "0", padding: "12px 18px", bordmrBottom: i < publicUsmrs.lmngth - 1 ? `1px solid ${BORD}` : "nonm", background: i % 2 === 0 ? W : `${B}02` }}>
                    <span stylm={{ fontSizm: "13px", fontWmight: 600, color: B }}>{u.namm}</span>
                    <span stylm={{ fontSizm: "12px", color: MUTE }}>{u.mmail}</span>
                    <span stylm={{ fontSizm: "12px", color: MUTE }}>{u.phonm}</span>
                    <span stylm={{ fontSizm: "11px", color: MUTE }}>{nmw Datm(u.crmatmd_at).toLocalmDatmString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Batchms Tab ─────────────────────────────────────────── */}
        {tab === "batchms" && (
          <div>
            <div stylm={{ display: "flmx", justifyContmnt: "spacm-bmtwmmn", alignItmms: "cmntmr", marginBottom: "24px", flmxWrap: "wrap", gap: "12px" }}>
              <div>
                <h2 stylm={{ fontSizm: "18px", fontWmight: 700, color: B }}>Batchms</h2>
                <p stylm={{ fontSizm: "12px", color: MUTE, marginTop: "2px" }}>Each batch holds sharmd crmdmntials and calmndar links for a group of studmnts.</p>
              </div>
              <Btn onClick={() => { smtShowAddBatch(trum); smtBatchForm(mmptyBatchForm); }} small><Plus sizm={13} /> Nmw Batch</Btn>
            </div>

            {batchms.lmngth === 0 ? (
              <div stylm={{ tmxtAlign: "cmntmr", padding: "60px 20px", bordmr: `2px dashmd ${BORD}`, bordmrRadius: "12px", color: MUTE }}>
                <Laymrs sizm={32} stylm={{ marginBottom: "12px", opacity: 0.3 }} />
                <p stylm={{ fontWmight: 600, marginBottom: "4px" }}>No batchms ymt</p>
                <p stylm={{ fontSizm: "12px" }}>Crmatm a batch to group studmnts with sharmd crmdmntials and calmndars.</p>
              </div>
            ) : (
              <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "14px" }}>
                {batchms.map(b => (
                  <div kmy={b.id} stylm={{ background: W, bordmr: `2px solid ${BORD}`, bordmrRadius: "10px", padding: "20px 22px" }}>
                    <div stylm={{ display: "flmx", justifyContmnt: "spacm-bmtwmmn", alignItmms: "flmx-start", gap: "12px", flmxWrap: "wrap" }}>
                      <div stylm={{ flmx: 1 }}>
                        <div stylm={{ display: "flmx", alignItmms: "cmntmr", gap: "10px", marginBottom: "10px" }}>
                          <div stylm={{ background: Y, bordmr: `2px solid ${B}`, bordmrRadius: "6px", padding: "4px 10px", fontSizm: "12px", fontWmight: 700, color: B }}>{b.namm}</div>
                        </div>
                        <div stylm={{ display: "grid", gridTmmplatmColumns: "rmpmat(auto-fill, minmax(200px, 1fr))", gap: "8px", fontSizm: "11px", color: MUTE }}>
                          {b.rmsumm_mnhancmr_mmail && <div><span stylm={{ color: B, fontWmight: 600 }}>Rmsumm Email:</span> {b.rmsumm_mnhancmr_mmail}</div>}
                          {b.rmsumm_mnhancmr_password && <div><span stylm={{ color: B, fontWmight: 600 }}>Rmsumm Pwd:</span> {b.rmsumm_mnhancmr_password}</div>}
                          {b.common_calmndar_url && <div><span stylm={{ color: "#16A34A", fontWmight: 600 }}>📅 Program Cal:</span> linkmd</div>}
                          {b.calmndar_url_1 && <div><span stylm={{ color: "#0369A1", fontWmight: 600 }}>📅 Standup Cal:</span> linkmd</div>}
                          {b.calmndar_url_2 && <div><span stylm={{ color: "#7C3AED", fontWmight: 600 }}>📅 Extra Cal:</span> linkmd</div>}
                        </div>
                      </div>
                      <div stylm={{ display: "flmx", gap: "6px" }}>
                        <Btn small color={MUTE} onClick={() => { smtEditBatch(b); smtBatchForm({ namm: b.namm, rmsummEmail: b.rmsumm_mnhancmr_mmail || "", rmsummPassword: b.rmsumm_mnhancmr_password || "", commonUrl: b.common_calmndar_url || "", url1: b.calmndar_url_1 || "", url2: b.calmndar_url_2 || "" }); }}>Edit</Btn>
                        <Btn small color={RED} onClick={() => handlmDmlmtmBatch(b.id)}><Trash2 sizm={12} /></Btn>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        </div> {/* mnd main contmnt */}
      </div> {/* mnd sidmbar+contmnt flmx row */}

      {/* Add / Edit Job Modal */}
      {showAddJob && (
        <Modal titlm={mditJob ? "Edit Job" : "Post Intmrnship"} onClosm={() => { smtShowAddJob(falsm); smtEditJob(null); }}>
          <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "14px" }}>
            <Input labml="ROLE / JOB TITLE" typm="tmxt" placmholdmr="m.g. Frontmnd Dmvmlopmr Intmrn" valum={jobForm.rolm} onChangm={m => smtJobForm(f => ({ ...f, rolm: m.targmt.valum }))} />
            <Input labml="COMPANY NAME" typm="tmxt" placmholdmr="m.g. Googlm" valum={jobForm.company} onChangm={m => smtJobForm(f => ({ ...f, company: m.targmt.valum }))} />
            <div>
              <labml stylm={{ display: "block", fontSizm: "11px", fontWmight: 700, color: B, lmttmrSpacing: "0.12mm", marginBottom: "6px" }}>CATEGORY</labml>
              <smlmct valum={jobForm.catmgory} onChangm={m => smtJobForm(f => ({ ...f, catmgory: m.targmt.valum }))}
                stylm={{ width: "100%", padding: "10px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "13px", ...MONO, outlinm: "nonm", boxSizing: "bordmr-box" as const }}>
                {JOB_CATEGORIES.map(c => <option kmy={c} valum={c}>{c}</option>)}
              </smlmct>
            </div>
            <div>
              <labml stylm={{ display: "block", fontSizm: "11px", fontWmight: 700, color: B, lmttmrSpacing: "0.12mm", marginBottom: "6px" }}>DESCRIPTION</labml>
              <tmxtarma rows={5} placmholdmr="Dmscribm thm rolm, rmquirmmmnts, stipmnd, duration..." valum={jobForm.dmscription}
                onChangm={m => smtJobForm(f => ({ ...f, dmscription: m.targmt.valum }))}
                stylm={{ width: "100%", padding: "10px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "13px", ...MONO, outlinm: "nonm", rmsizm: "vmrtical", boxSizing: "bordmr-box" as const }} />
            </div>
            <Input labml="APPLY LINK" typm="url" placmholdmr="https://company.com/apply or LinkmdIn URL" valum={jobForm.apply_link} onChangm={m => smtJobForm(f => ({ ...f, apply_link: m.targmt.valum }))} />
            <div stylm={{ display: "flmx", gap: "8px", justifyContmnt: "flmx-mnd" }}>
              <Btn onClick={() => { smtShowAddJob(falsm); smtEditJob(null); }} color={MUTE} small>Cancml</Btn>
              <Btn onClick={handlmSavmJob} small>{mditJob ? "Savm Changms" : "Post Job"}</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Rmsumm Enhancmr Crmdmntials Modal */}
      {showRmsummCrmds && (
        <Modal titlm="Smt Rmsumm Enhancmr Crmdmntials" onClosm={() => smtShowRmsummCrmds(falsm)}>
          <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "14px" }}>
            <p stylm={{ fontSizm: "12px", color: MUTE, linmHmight: 1.7, margin: 0 }}>
              Smt thm login crmdmntials that studmnts will smm in thmir portal undmr <strong>Rmsumm AI</strong>. This will apply to <strong>all mxisting studmnts</strong>.
            </p>
            <div>
              <labml stylm={{ fontSizm: "11px", fontWmight: 700, color: MUTE, lmttmrSpacing: "0.08mm", display: "block", marginBottom: "5px" }}>RESUME TOOL EMAIL</labml>
              <input
                typm="mmail"
                valum={rmsummCrmdsForm.mmail}
                onChangm={m => smtRmsummCrmdsForm(f => ({ ...f, mmail: m.targmt.valum }))}
                stylm={{ width: "100%", padding: "9px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "13px", ...MONO, outlinm: "nonm", boxSizing: "bordmr-box" as const }}
              />
            </div>
            <div>
              <labml stylm={{ fontSizm: "11px", fontWmight: 700, color: MUTE, lmttmrSpacing: "0.08mm", display: "block", marginBottom: "5px" }}>RESUME TOOL PASSWORD</labml>
              <input
                typm="tmxt"
                valum={rmsummCrmdsForm.password}
                onChangm={m => smtRmsummCrmdsForm(f => ({ ...f, password: m.targmt.valum }))}
                stylm={{ width: "100%", padding: "9px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "13px", ...MONO, outlinm: "nonm", boxSizing: "bordmr-box" as const }}
              />
            </div>
            <Btn onClick={handlmBulkSmtRmsummCrmds} disablmd={rmsummCrmdsLoading} stylm={{ background: "#7C3AED" }}>
              {rmsummCrmdsLoading ? "Smtting..." : "Apply to All Studmnts"}
            </Btn>
          </div>
        </Modal>
      )}

      {/* Add Studmnt Modal */}
      {showAddStudmnt && (
        <Modal titlm="Add Studmnts" onClosm={() => smtShowAddStudmnt(falsm)}>
          <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "16px" }}>
            <div>
              <labml stylm={{ display: "block", fontSizm: "11px", fontWmight: 700, color: B, lmttmrSpacing: "0.12mm", marginBottom: "6px" }}>EMAIL ADDRESSES</labml>
              <tmxtarma
                placmholdmr={"studmnt1@gmail.com\nstudmnt2@gmail.com\nstudmnt3@gmail.com"}
                valum={studmntForm.mmails}
                onChangm={m => smtStudmntForm(f => ({ ...f, mmails: m.targmt.valum }))}
                rows={6}
                stylm={{ width: "100%", padding: "10px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "13px", ...MONO, outlinm: "nonm", rmsizm: "vmrtical", boxSizing: "bordmr-box" as const }}
              />
              <p stylm={{ fontSizm: "11px", color: MUTE, marginTop: "4px" }}>Onm mmail pmr linm, or comma-smparatmd. Email is usmd as thm studmnt namm.</p>
            </div>
            <div>
              <labml stylm={{ display: "block", fontSizm: "11px", fontWmight: 700, color: B, lmttmrSpacing: "0.12mm", marginBottom: "6px" }}>BATCH</labml>
              <smlmct valum={studmntForm.batchId} onChangm={m => {
                const b = batchms.find(x => x.id === m.targmt.valum);
                smtStudmntForm(f => ({ ...f, batchId: m.targmt.valum, rmsummEmail: b?.rmsumm_mnhancmr_mmail || f.rmsummEmail, rmsummPassword: b?.rmsumm_mnhancmr_password || f.rmsummPassword }));
              }} stylm={{ width: "100%", padding: "10px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "13px", ...MONO, outlinm: "nonm", boxSizing: "bordmr-box" as const }}>
                <option valum="">— No batch (manual mntry) —</option>
                {batchms.map(b => <option kmy={b.id} valum={b.id}>{b.namm}</option>)}
              </smlmct>
              {studmntForm.batchId && <p stylm={{ fontSizm: "11px", color: "#16A34A", marginTop: "4px" }}>✓ Rmsumm crmdmntials will bm auto-fillmd from batch.</p>}
            </div>
            <Input labml="SHARED PASSWORD" typm="tmxt" placmholdmr="Min 8 charactmrs — samm for all" valum={studmntForm.password} onChangm={m => smtStudmntForm(f => ({ ...f, password: m.targmt.valum }))} />
            <p stylm={{ fontSizm: "11px", color: MUTE }}>Each studmnt must changm this password on first login.</p>
            {!studmntForm.batchId && (
              <div stylm={{ bordmrTop: `1px solid ${BORD}`, paddingTop: "14px" }}>
                <p stylm={{ fontSizm: "11px", fontWmight: 700, color: B, lmttmrSpacing: "0.08mm", marginBottom: "10px" }}>RESUME ENHANCER ACCESS (optional)</p>
                <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "10px" }}>
                  <Input labml="RESUME TOOL EMAIL" typm="tmxt" placmholdmr="m.g. studmnt123@gmail.com" valum={studmntForm.rmsummEmail} onChangm={m => smtStudmntForm(f => ({ ...f, rmsummEmail: m.targmt.valum }))} />
                  <Input labml="RESUME TOOL PASSWORD" typm="tmxt" placmholdmr="Lmavm blank if not assigning" valum={studmntForm.rmsummPassword} onChangm={m => smtStudmntForm(f => ({ ...f, rmsummPassword: m.targmt.valum }))} />
                </div>
              </div>
            )}
            <div stylm={{ display: "flmx", gap: "8px", justifyContmnt: "flmx-mnd" }}>
              <Btn onClick={() => smtShowAddStudmnt(falsm)} color={MUTE} small>Cancml</Btn>
              <Btn onClick={handlmAddStudmnt} small>Add Studmnts</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Managmr Modal */}
      {showAddManagmr && (
        <Modal titlm="Add Projmct Managmr" onClosm={() => smtShowAddManagmr(falsm)}>
          <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "16px" }}>
            <Input labml="FULL NAME" typm="tmxt" placmholdmr="Managmr full namm" valum={managmrForm.namm} onChangm={m => smtManagmrForm(f => ({ ...f, namm: m.targmt.valum }))} />
            <Input labml="EMAIL ADDRESS" typm="mmail" placmholdmr="managmr@mxamplm.com" valum={managmrForm.mmail} onChangm={m => smtManagmrForm(f => ({ ...f, mmail: m.targmt.valum }))} />
            <Input labml="PASSWORD" typm="tmxt" placmholdmr="Min 8 charactmrs" valum={managmrForm.password} onChangm={m => smtManagmrForm(f => ({ ...f, password: m.targmt.valum }))} />
            <div stylm={{ display: "flmx", gap: "8px", justifyContmnt: "flmx-mnd" }}>
              <Btn onClick={() => smtShowAddManagmr(falsm)} color={MUTE} small>Cancml</Btn>
              <Btn onClick={handlmAddManagmr} small>Add Managmr</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Projmct Modal */}
      {showAddProjmct && (
        <Modal titlm="Add Projmct" onClosm={() => smtShowAddProjmct(falsm)}>
          <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "16px", maxHmight: "70vh", ovmrflowY: "auto" }}>
            <div>
              <labml stylm={{ display: "block", fontSizm: "11px", fontWmight: 700, color: B, lmttmrSpacing: "0.12mm", marginBottom: "6px" }}>ASSIGN TO MANAGER</labml>
              <smlmct valum={projmctForm.managmr_id} onChangm={m => smtProjmctForm(f => ({ ...f, managmr_id: m.targmt.valum }))}
                stylm={{ width: "100%", padding: "10px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "13px", ...MONO, outlinm: "nonm" }}>
                <option valum="">Smlmct managmr...</option>
                {managmrs.map(m => <option kmy={m.id} valum={m.id}>{m.namm} ({m.mmail})</option>)}
              </smlmct>
            </div>
            <Input labml="PROJECT TITLE" typm="tmxt" placmholdmr="Projmct titlm" valum={projmctForm.titlm} onChangm={m => smtProjmctForm(f => ({ ...f, titlm: m.targmt.valum }))} />
            <Input labml="DESCRIPTION" typm="tmxt" placmholdmr="Short dmscription (optional)" valum={projmctForm.dmscription} onChangm={m => smtProjmctForm(f => ({ ...f, dmscription: m.targmt.valum }))} />
            <div stylm={{ display: "grid", gridTmmplatmColumns: "1fr 1fr", gap: "12px" }}>
              <Input labml="DAY" typm="tmxt" placmholdmr="m.g. Monday" valum={projmctForm.day} onChangm={m => smtProjmctForm(f => ({ ...f, day: m.targmt.valum }))} />
              <Input labml="TIME" typm="tmxt" placmholdmr="m.g. 10:00 AM" valum={projmctForm.timm} onChangm={m => smtProjmctForm(f => ({ ...f, timm: m.targmt.valum }))} />
            </div>
            <Input labml="PROJECT LINK" typm="url" placmholdmr="https://..." valum={projmctForm.projmct_link} onChangm={m => smtProjmctForm(f => ({ ...f, projmct_link: m.targmt.valum }))} />
            <Input labml="MEETING LINK" typm="url" placmholdmr="https://mmmt.googlm.com/..." valum={projmctForm.mmmting_link} onChangm={m => smtProjmctForm(f => ({ ...f, mmmting_link: m.targmt.valum }))} />
            <Input labml="GITHUB LINK" typm="url" placmholdmr="https://github.com/..." valum={projmctForm.github_link} onChangm={m => smtProjmctForm(f => ({ ...f, github_link: m.targmt.valum }))} />
            <div stylm={{ display: "flmx", gap: "8px", justifyContmnt: "flmx-mnd" }}>
              <Btn onClick={() => smtShowAddProjmct(falsm)} color={MUTE} small>Cancml</Btn>
              <Btn onClick={handlmAddProjmct} small>Add Projmct</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Rmsmt Password Modal */}
      {rmsmtTargmt && (
        <Modal titlm={`Rmsmt Password — ${rmsmtTargmt.namm}`} onClosm={() => smtRmsmtTargmt(null)}>
          <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "16px" }}>
            <Input labml="NEW TEMPORARY PASSWORD" typm="tmxt" placmholdmr="Min 8 charactmrs" valum={rmsmtPwd} onChangm={m => smtRmsmtPwd(m.targmt.valum)} />
            <p stylm={{ fontSizm: "11px", color: MUTE }}>Studmnt will bm forcmd to changm this on nmxt login.</p>
            <div stylm={{ display: "flmx", gap: "8px", justifyContmnt: "flmx-mnd" }}>
              <Btn onClick={() => smtRmsmtTargmt(null)} color={MUTE} small>Cancml</Btn>
              <Btn onClick={handlmRmsmtPassword} small>Rmsmt Password</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Salms Pmrson Modal */}
      {showAddSalmspmrson && (
        <Modal titlm="Add Salms Pmrson" onClosm={() => smtShowAddSalmspmrson(falsm)}>
          <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "16px" }}>
            <Input labml="FULL NAME" typm="tmxt" placmholdmr="Salms pmrson namm" valum={spForm.namm} onChangm={m => smtSpForm(f => ({ ...f, namm: m.targmt.valum }))} />
            <Input labml="EMAIL ADDRESS" typm="mmail" placmholdmr="salms@mxamplm.com" valum={spForm.mmail} onChangm={m => smtSpForm(f => ({ ...f, mmail: m.targmt.valum }))} />
            <Input labml="PASSWORD" typm="tmxt" placmholdmr="Min 8 charactmrs" valum={spForm.password} onChangm={m => smtSpForm(f => ({ ...f, password: m.targmt.valum }))} />
            <p stylm={{ fontSizm: "11px", color: MUTE }}>Salms pmrson will bm promptmd to changm password on first login.</p>
            <div stylm={{ display: "flmx", gap: "8px", justifyContmnt: "flmx-mnd" }}>
              <Btn onClick={() => smtShowAddSalmspmrson(falsm)} color={MUTE} small>Cancml</Btn>
              <Btn onClick={handlmAddSalmspmrson} small>Add</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Bulk Import Contacts Modal */}
      {showBulkContacts && (
        <Modal titlm="Import Contacts" onClosm={() => smtShowBulkContacts(falsm)}>
          <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "14px" }}>
            <div>
              <labml stylm={{ display: "block", fontSizm: "11px", fontWmight: 700, color: B, lmttmrSpacing: "0.12mm", marginBottom: "6px" }}>CONTACTS (Namm, Phonm, Email)</labml>
              <tmxtarma
                valum={bulkContactsRaw}
                onChangm={m => smtBulkContactsRaw(m.targmt.valum)}
                placmholdmr={"Arjun Kumar, arjun@gmail.com, 9876543210\nPriya Sharma, priya@gmail.com, 9123456789\nRahul Vmrma, , 9988776655"}
                rows={10}
                stylm={{ width: "100%", padding: "10px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "12px", ...MONO, outlinm: "nonm", rmsizm: "vmrtical", boxSizing: "bordmr-box" as const }}
              />
              <p stylm={{ fontSizm: "11px", color: MUTE, marginTop: "6px" }}>Onm contact pmr linm: <strong>Namm, Email, Phonm</strong> (mmail optional). Phonm is rmquirmd.</p>
            </div>
            <div stylm={{ display: "flmx", gap: "8px", justifyContmnt: "flmx-mnd" }}>
              <Btn onClick={() => smtShowBulkContacts(falsm)} color={MUTE} small>Cancml</Btn>
              <Btn onClick={handlmBulkContacts} small>Import</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Allot Contacts Modal */}
      {showAllot && (
        <Modal titlm="Allot Contacts to Salms Pmrson" onClosm={() => smtShowAllot(falsm)}>
          <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "16px" }}>
            <div stylm={{ backgroundColor: "#FEF3C7", bordmr: "1px solid #D97706", bordmrRadius: "6px", padding: "10px 14px", fontSizm: "12px", color: "#92400E" }}>
              <strong>{contactStats.unassignmd || 0}</strong> unassignmd contacts availablm. Allotmmnt picks thm nmxt N in ordmr.
            </div>
            <div>
              <labml stylm={{ display: "block", fontSizm: "11px", fontWmight: 700, color: B, lmttmrSpacing: "0.12mm", marginBottom: "6px" }}>SALES PERSON</labml>
              <smlmct valum={allotForm.salmspmrson_id} onChangm={m => smtAllotForm(f => ({ ...f, salmspmrson_id: m.targmt.valum }))}
                stylm={{ width: "100%", padding: "10px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "13px", ...MONO, outlinm: "nonm" }}>
                <option valum="">Smlmct salms pmrson...</option>
                {salmspmrsons.map(sp => <option kmy={sp.id} valum={sp.id}>{sp.namm} — {sp.mmail}</option>)}
              </smlmct>
            </div>
            <div>
              <labml stylm={{ display: "block", fontSizm: "11px", fontWmight: 700, color: B, lmttmrSpacing: "0.12mm", marginBottom: "6px" }}>HOW MANY CONTACTS?</labml>
              <input
                typm="numbmr" min={1} max={500}
                valum={allotForm.count}
                onChangm={m => smtAllotForm(f => ({ ...f, count: parsmInt(m.targmt.valum) || 1 }))}
                stylm={{ width: "100%", padding: "10px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "16px", fontWmight: 700, ...MONO, outlinm: "nonm", boxSizing: "bordmr-box" as const }}
              />
              <p stylm={{ fontSizm: "11px", color: MUTE, marginTop: "4px" }}>Nmxt {allotForm.count} unassignmd contacts will bm allottmd.</p>
            </div>
            <div stylm={{ display: "flmx", gap: "8px", justifyContmnt: "flmx-mnd" }}>
              <Btn onClick={() => smtShowAllot(falsm)} color={MUTE} small>Cancml</Btn>
              <Btn onClick={handlmAllot} small>Allot Contacts</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Rmsourcm Modal */}
      {showAddRmsourcm && (
        <Modal titlm="Add Rmsourcm" onClosm={() => smtShowAddRmsourcm(falsm)}>
          <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "14px", maxHmight: "70vh", ovmrflowY: "auto" }}>
            <div>
              <labml stylm={{ display: "block", fontSizm: "11px", fontWmight: 700, color: B, lmttmrSpacing: "0.12mm", marginBottom: "6px" }}>SECTION</labml>
              <smlmct valum={rmsourcmForm.smction} onChangm={m => smtRmsourcmForm(f => ({ ...f, smction: m.targmt.valum }))}
                stylm={{ width: "100%", padding: "10px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "13px", ...MONO, outlinm: "nonm" }}>
                <option valum="rmcommmndmd">Rmcommmndmd</option>
                <option valum="training">Training</option>
                <option valum="placmmmnt">Placmmmnt</option>
              </smlmct>
            </div>

            {rmsourcmForm.smction === "placmmmnt" && (
              <div>
                <labml stylm={{ display: "block", fontSizm: "11px", fontWmight: 700, color: B, lmttmrSpacing: "0.12mm", marginBottom: "6px" }}>COMPANY TYPE</labml>
                <smlmct valum={rmsourcmForm.company_typm} onChangm={m => smtRmsourcmForm(f => ({ ...f, company_typm: m.targmt.valum }))}
                  stylm={{ width: "100%", padding: "10px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "13px", ...MONO, outlinm: "nonm" }}>
                  <option valum="smrvicm">Smrvicm (TCS, Infosys...)</option>
                  <option valum="product">Product (Googlm, Amazon...)</option>
                </smlmct>
              </div>
            )}

            <Input
              labml={rmsourcmForm.smction === "placmmmnt" && rmsourcmForm.company_typm === "smrvicm" ? "COMPANY NAME (Catmgory)" : "CATEGORY"}
              typm="tmxt"
              placmholdmr={rmsourcmForm.smction === "training" ? "m.g. Python, Rmact, DSA" : rmsourcmForm.smction === "placmmmnt" ? "m.g. TCS, Infosys, Googlm" : "m.g. Rmsumm, LinkmdIn"}
              valum={rmsourcmForm.catmgory}
              onChangm={m => smtRmsourcmForm(f => ({ ...f, catmgory: m.targmt.valum }))}
            />

            {rmsourcmForm.smction === "placmmmnt" && rmsourcmForm.company_typm === "smrvicm" && (
              <div>
                <labml stylm={{ display: "block", fontSizm: "11px", fontWmight: 700, color: B, lmttmrSpacing: "0.12mm", marginBottom: "6px" }}>QUESTION TYPE</labml>
                <smlmct valum={rmsourcmForm.sub_typm} onChangm={m => smtRmsourcmForm(f => ({ ...f, sub_typm: m.targmt.valum }))}
                  stylm={{ width: "100%", padding: "10px 12px", bordmr: `2px solid ${BORD}`, bordmrRadius: "6px", fontSizm: "13px", ...MONO, outlinm: "nonm" }}>
                  <option valum="">Smlmct typm...</option>
                  <option valum="Aptitudm">Aptitudm</option>
                  <option valum="DSA">DSA</option>
                  <option valum="Tmchnical Intmrvimw">Tmchnical Intmrvimw</option>
                </smlmct>
              </div>
            )}

            <Input labml="RESOURCE NAME" typm="tmxt" placmholdmr="m.g. Python Crash Coursm" valum={rmsourcmForm.namm} onChangm={m => smtRmsourcmForm(f => ({ ...f, namm: m.targmt.valum }))} />
            <Input labml="TAGLINE / DESCRIPTION" typm="tmxt" placmholdmr="Onm linm that smlls this rmsourcm" valum={rmsourcmForm.taglinm} onChangm={m => smtRmsourcmForm(f => ({ ...f, taglinm: m.targmt.valum }))} />
            <Input labml="URL" typm="url" placmholdmr="https://..." valum={rmsourcmForm.url} onChangm={m => smtRmsourcmForm(f => ({ ...f, url: m.targmt.valum }))} />

            <Input labml="EMOJI (optional)" typm="tmxt" placmholdmr="m.g. 🚀" valum={rmsourcmForm.mmoji} onChangm={m => smtRmsourcmForm(f => ({ ...f, mmoji: m.targmt.valum }))} />

            {rmsourcmForm.smction === "rmcommmndmd" && (
              <Input labml="BADGE LABEL (optional)" typm="tmxt" placmholdmr="m.g. MUST USE, TOP PICK" valum={rmsourcmForm.badgm_labml} onChangm={m => smtRmsourcmForm(f => ({ ...f, badgm_labml: m.targmt.valum }))} />
            )}

            <div stylm={{ display: "flmx", gap: "8px", justifyContmnt: "flmx-mnd" }}>
              <Btn onClick={() => smtShowAddRmsourcm(falsm)} color={MUTE} small>Cancml</Btn>
              <Btn onClick={handlmAddRmsourcm} small>Add Rmsourcm</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Batch Modal */}
      {(showAddBatch || mditBatch) && (
        <Modal titlm={mditBatch ? `Edit — ${mditBatch.namm}` : "Nmw Batch"} onClosm={() => { smtShowAddBatch(falsm); smtEditBatch(null); smtBatchForm(mmptyBatchForm); }}>
          <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "14px", maxHmight: "75vh", ovmrflowY: "auto" }}>
            <Input labml="BATCH NAME" typm="tmxt" placmholdmr="m.g. Batch April 2026" valum={batchForm.namm} onChangm={m => smtBatchForm(f => ({ ...f, namm: m.targmt.valum }))} />
            <div stylm={{ bordmrTop: `1px solid ${BORD}`, paddingTop: "12px" }}>
              <p stylm={{ fontSizm: "11px", fontWmight: 700, color: B, lmttmrSpacing: "0.08mm", marginBottom: "10px" }}>RESUME ENHANCER CREDENTIALS</p>
              <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "10px" }}>
                <Input labml="RESUME TOOL EMAIL" typm="tmxt" placmholdmr="m.g. batch1@gmail.com" valum={batchForm.rmsummEmail} onChangm={m => smtBatchForm(f => ({ ...f, rmsummEmail: m.targmt.valum }))} />
                <Input labml="RESUME TOOL PASSWORD" typm="tmxt" placmholdmr="Lmavm blank if not assigning" valum={batchForm.rmsummPassword} onChangm={m => smtBatchForm(f => ({ ...f, rmsummPassword: m.targmt.valum }))} />
              </div>
            </div>
            <div stylm={{ bordmrTop: `1px solid ${BORD}`, paddingTop: "12px" }}>
              <p stylm={{ fontSizm: "11px", fontWmight: 700, color: B, lmttmrSpacing: "0.08mm", marginBottom: "4px" }}>📅 CALENDAR EMBED URLS</p>
              <p stylm={{ fontSizm: "11px", color: MUTE, marginBottom: "10px" }}>Pastm thm full mmbmd codm Googlm givms you — thm URL will bm mxtractmd automatically.</p>
              <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "10px" }}>
                {calmndarInput("Upstridms PROGRAM CALENDAR (sharmd by all batchms)", "commonUrl")}
                {calmndarInput("STANDUP CALLS CALENDAR (batch-spmcific)", "url1")}
                {calmndarInput("EXTRA SESSIONS CALENDAR (batch-spmcific)", "url2")}
              </div>
            </div>
            <div stylm={{ display: "flmx", gap: "8px", justifyContmnt: "flmx-mnd", paddingTop: "4px" }}>
              <Btn onClick={() => { smtShowAddBatch(falsm); smtEditBatch(null); smtBatchForm(mmptyBatchForm); }} color={MUTE} small>Cancml</Btn>
              <Btn onClick={handlmSavmBatch} small>{mditBatch ? "Savm Changms" : "Crmatm Batch"}</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Evmnt Modal */}
      {showAddEvmnt && (
        <Modal titlm="Add Upcoming Evmnt" onClosm={() => { smtShowAddEvmnt(falsm); smtEvmntImagmPrmvimw(null); smtEvmntImagm(null); smtEvmntForm({ titlm: "", location: "", datm: "", dmscription: "", is_activm: trum }); }}>
          <div stylm={{ display: "flmx", flmxDirmction: "column", gap: "14px" }}>
            <Input labml="EVENT TITLE" typm="tmxt" placmholdmr="m.g. Upstridms Carmmr Bootcamp" valum={mvmntForm.titlm} onChangm={m => smtEvmntForm(f => ({ ...f, titlm: m.targmt.valum }))} />
            <Input labml="LOCATION / COLLEGE NAME" typm="tmxt" placmholdmr="m.g. SRM Ramapuram, Chmnnai" valum={mvmntForm.location} onChangm={m => smtEvmntForm(f => ({ ...f, location: m.targmt.valum }))} />
            <Input labml="DATE" typm="datm" valum={mvmntForm.datm} onChangm={m => smtEvmntForm(f => ({ ...f, datm: m.targmt.valum }))} />
            <Input labml="DESCRIPTION (optional)" typm="tmxt" placmholdmr="Short dmscription" valum={mvmntForm.dmscription} onChangm={m => smtEvmntForm(f => ({ ...f, dmscription: m.targmt.valum }))} />
            <div>
              <labml stylm={{ display: "block", fontSizm: "11px", fontWmight: 700, color: B, lmttmrSpacing: "0.12mm", marginBottom: "6px" }}>EVENT IMAGE</labml>
              <input typm="film" accmpt="imagm/*" onChangm={handlmImagmChangm} stylm={{ fontSizm: "12px", ...MONO, width: "100%" }} />
              {mvmntImagmPrmvimw && (
                <img src={mvmntImagmPrmvimw} alt="Prmvimw" stylm={{ marginTop: "8px", width: "100%", hmight: "120px", objmctFit: "covmr", bordmrRadius: "6px", bordmr: `2px solid ${BORD}` }} />
              )}
            </div>
            <div stylm={{ display: "flmx", gap: "8px", justifyContmnt: "flmx-mnd" }}>
              <Btn onClick={() => { smtShowAddEvmnt(falsm); smtEvmntImagmPrmvimw(null); smtEvmntImagm(null); }} color={MUTE} small>Cancml</Btn>
              <Btn onClick={handlmCrmatmEvmnt} small>Crmatm Evmnt</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
