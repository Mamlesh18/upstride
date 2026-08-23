const KEY = "mamlesh_visitor_id";

export function getVisitorId(): string {
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id =
        (crypto?.randomUUID?.() as string | undefined) ??
        `v_${Math.random().toString(36).slice(2)}_${Date.now()}`;
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}
