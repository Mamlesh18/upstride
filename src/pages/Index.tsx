import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "@/components/mamlesh/PublicLayout";
import Seo from "@/components/mamlesh/Seo";
import Reveal from "@/components/mamlesh/Reveal";
import Linkify from "@/components/mamlesh/Linkify";
import { PROFILE, STATS, BLOGS as SEED_BLOGS, READ_PAPERS as SEED_PAPERS } from "@/data/mamleshContent";
import { api, type BlogSummary, type Paper } from "@/services/api";

function formatDate(value: string): string {
  const d = new Date(value);
  return isNaN(d.getTime())
    ? value
    : d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export default function Index() {
  const [blogs, setBlogs] = useState<BlogSummary[] | null>(null);
  const [papers, setPapers] = useState<Paper[] | null>(null);

  useEffect(() => {
    api.blogs.list().then(setBlogs).catch(() => setBlogs([]));
    api.papers.list().then(setPapers).catch(() => setPapers([]));
  }, []);

  const recentBlogs = blogs && blogs.length > 0
    ? blogs.slice(0, 6).map((b) => ({ slug: b.slug, title: b.title, date: formatDate(b.created_at) }))
    : SEED_BLOGS.slice(0, 6);

  const recentPapers = papers && papers.length > 0
    ? papers.slice(0, 6).map((p) => ({ id: p.id, title: p.title, url: p.url }))
    : SEED_PAPERS.slice(0, 6);

  return (
    <PublicLayout>
      <div className="container">
        <Seo
          title="Mamlesh - Voice AI Engineer, Applied AI & Systems"
          description="Voice AI engineer and educator. Building agents and AI systems in production, teaching the AI Masterclass + Career Compass, and writing about applied AI."
        />

        {/* Hero */}
        <section className="hero hero-animate">
          <div>
            <h1>Hey, I am {PROFILE.name}</h1>
            <p className="hero-role">
              <Linkify text={`${PROFILE.role} at iNextLabs`} />
            </p>
            <p className="tagline">{PROFILE.tagline}</p>
            <div className="bio">
              {PROFILE.intro.map((para, i) => (
                <p key={i}>
                  <Linkify text={para} />
                </p>
              ))}
            </div>
            <div className="hero-cta">
              <Link to="/courses/ai-masterclass" className="btn btn-primary">
                Join the Masterclass
              </Link>
              <Link to="/about" className="btn btn-ghost">
                About me
              </Link>
            </div>
            <a
              className="linkedin-badge"
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              <span className="li-mark">in</span>
              <span>
                <strong>13k+</strong> followers on LinkedIn - come say hi
              </span>
            </a>
            <div className="sign">- {PROFILE.name}</div>
          </div>
          <img
            className="hero-photo"
            src="/main.jpeg"
            alt={PROFILE.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
            }}
          />
        </section>

        <Reveal className="stats">
          {STATS.map((s) => (
            <div className="stat" key={s.l}>
              <div className="n">{s.n}</div>
              <div className="l">{s.l}</div>
            </div>
          ))}
        </Reveal>

        {/* Recent blogs */}
        {recentBlogs.length > 0 && (
          <Reveal className="section" as="section">
            <div className="section-head">
              <h2>Writing</h2>
              <Link to="/blogs" className="arrow-link">
                Full archive →
              </Link>
            </div>
            <div className="read-list">
              {recentBlogs.map((b) => (
                <Link key={b.slug} to={`/blogs/${b.slug}`} className="read-item">
                  <span className="date">{b.date}</span>
                  <span className="title">{b.title}</span>
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        {/* Papershelf */}
        {recentPapers.length > 0 && (
          <Reveal className="section" as="section" style={{ paddingTop: 0 }}>
            <div className="section-head">
              <h2>On my papershelf</h2>
              <Link to="/papershelf" className="arrow-link">
                Full papershelf →
              </Link>
            </div>
            <ul className="paper-list">
              {recentPapers.map((p) => (
                <li key={p.id}>
                  <a className="link-blue" href={p.url} target="_blank" rel="noreferrer">
                    {p.title}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </PublicLayout>
  );
}
