import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "@/components/mamlesh/PublicLayout";
import Seo from "@/components/mamlesh/Seo";
import { BLOGS as SEED_BLOGS } from "@/data/mamleshContent";
import { api, type BlogSummary } from "@/services/api";

function formatDate(value: string): string {
  const d = new Date(value);
  return isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

interface Row {
  slug: string;
  title: string;
  date: string;
}

export default function Blogs() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.blogs
      .list()
      .then((data: BlogSummary[]) => {
        if (data.length === 0) {
          setRows(SEED_BLOGS.map((b) => ({ slug: b.slug, title: b.title, date: b.date })));
        } else {
          setRows(data.map((b) => ({ slug: b.slug, title: b.title, date: formatDate(b.created_at) })));
        }
      })
      .catch((e) => {
        setError(e?.message || "Couldn't load blogs.");
        setRows(SEED_BLOGS.map((b) => ({ slug: b.slug, title: b.title, date: b.date })));
      });
  }, []);

  const list = rows ?? [];

  return (
    <PublicLayout>
      <div className="container page blogs-page">
        <Seo
          title="Blogs - Mamlesh"
          description="Writing on applied AI, voice agents, system design, and engineering."
        />
        <h1 style={{ fontSize: "2.3rem", marginBottom: 12 }}>
          Blogs <span className="count">({list.length})</span>
        </h1>
        <p className="muted" style={{ maxWidth: 660 }}>
          Every week, I document and articulate my thoughts and learnings on
          applied AI, voice agents, and engineering. Here are all the blogs I
          have written to date.
        </p>

        {rows === null && (
          <p className="faint" style={{ marginTop: 24 }}>Loading…</p>
        )}
        {error && <div className="form-error" style={{ marginTop: 16 }}>{error}</div>}

        {rows !== null && list.length === 0 && (
          <div className="content-block" style={{ marginTop: 24 }}>
            No posts yet - new writing is on the way. Check back soon.
          </div>
        )}

        {list.length > 0 && (
          <div className="post-list">
            {list.map((b) => (
              <div className="post-row" key={b.slug}>
                <span className="post-date">{b.date}</span>
                <span className="post-sep">:</span>
                <Link to={`/blogs/${b.slug}`} className="link-blue post-title">
                  {b.title}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
