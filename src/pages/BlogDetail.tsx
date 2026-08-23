import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PublicLayout from "@/components/mamlesh/PublicLayout";
import Seo from "@/components/mamlesh/Seo";
import { api, type BlogDetail as BlogDetailType, type BlogBlock } from "@/services/api";

function formatDate(value: string): string {
  const d = new Date(value);
  return isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function BlockRenderer({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "heading":
      return <h2>{block.text}</h2>;
    case "paragraph":
      return <p>{block.text}</p>;
    case "quote":
      return <div className="blog-quote">{block.text}</div>;
    case "code":
      return <pre className="blog-code">{block.text}</pre>;
    case "list":
      return (
        <ul>
          {(block.items || []).map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    case "image":
      if (!block.url) return null;
      return (
        <figure className="blog-figure">
          <img src={block.url} alt={block.caption || ""} />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    default:
      return null;
  }
}

export default function BlogDetail() {
  const { slug = "" } = useParams();
  const [blog, setBlog] = useState<BlogDetailType | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "notfound" | "error">("loading");

  useEffect(() => {
    if (!slug) {
      setStatus("notfound");
      return;
    }
    api.blogs
      .get(slug)
      .then((data) => {
        setBlog(data);
        setStatus("ok");
      })
      .catch((e: Error) => {
        setStatus((e.message || "").toLowerCase().includes("not found") ? "notfound" : "error");
      });
  }, [slug]);

  if (status === "loading") {
    return (
      <PublicLayout>
        <div className="container page">
          <Seo title="Loading… - Mamlesh" />
          <p className="faint">Loading…</p>
        </div>
      </PublicLayout>
    );
  }

  if (status === "notfound" || !blog) {
    return (
      <PublicLayout>
        <div className="container page">
          <Seo title="Post coming soon - Mamlesh" />
          <p className="faint" style={{ marginBottom: 8 }}>
            <Link to="/blogs" className="link-blue">← All blogs</Link>
          </p>
          <h1 style={{ fontSize: "2rem", marginBottom: 12 }}>Coming soon</h1>
          <p className="muted">
            This post is on the way. I'm publishing writing here as it's finished — check back soon.
          </p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container page">
        <Seo
          title={`${blog.title} - Mamlesh`}
          description={blog.excerpt || blog.title}
        />
        <p className="faint" style={{ marginBottom: 8 }}>
          <Link to="/blogs" className="link-blue">← All blogs</Link>
        </p>
        <h1 style={{ fontSize: "2.3rem", marginBottom: 8 }}>{blog.title}</h1>
        <p className="faint" style={{ marginBottom: 24 }}>{formatDate(blog.created_at)}</p>
        {blog.cover_image && (
          <img className="blog-cover" src={blog.cover_image} alt={blog.title} />
        )}
        <div className="blog-body prose">
          {blog.blocks.map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
