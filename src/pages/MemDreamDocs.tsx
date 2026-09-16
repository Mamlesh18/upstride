import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, Navigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import Seo from "@/components/mamlesh/Seo";
import Markdown from "@/components/mamlesh/Markdown";
import MemDreamShell, { REPO_URL } from "@/components/memdream/MemDreamShell";
import { extractHeadings, stripSection, type DocHeading } from "@/lib/markdownHeadings";
import overviewMdRaw from "@/content/memdream/overview.md?raw";
import sdkMdRaw from "@/content/memdream/sdk.md?raw";
import selfHostingMdRaw from "@/content/memdream/self-hosting.md?raw";
import apiMdRaw from "@/content/memdream/api.md?raw";

export type SectionKey = "overview" | "sdk" | "self-hosting" | "api";

// The source docs carry their own manual "## Contents" link index. The site
// renders real sidebar + on-page navigation, so that listing would only repeat
// it — drop it before headings are parsed or anything is rendered.
const clean = (md: string) => stripSection(md, "Contents");

interface Doc {
  key: SectionKey;
  /** URL segment; the overview lives at the bare /memdream/docs. */
  slug: string;
  label: string;
  blurb: string;
  icon: string;
  body: string;
  source: string;
  /** Only the API reference wants `POST /path` headings turned into chips. */
  http?: boolean;
}

const DOCS: Doc[] = [
  {
    key: "overview",
    slug: "",
    label: "Overview",
    blurb: "What MemDream is, how to install it, and the five ideas the rest of the docs assume.",
    icon: "◆",
    body: clean(overviewMdRaw),
    source: "docs/overview.md",
  },
  {
    key: "sdk",
    slug: "sdk",
    label: "Python SDK",
    blurb: "Every constructor, method, argument, return type and exception — embedded and hosted.",
    icon: "❯",
    body: clean(sdkMdRaw),
    source: "docs/sdk.md",
  },
  {
    key: "self-hosting",
    slug: "self-hosting",
    label: "Self-hosting",
    blurb: "Run the server: Docker or Python, every configuration variable, scaling, production checklist.",
    icon: "▤",
    body: clean(selfHostingMdRaw),
    source: "docs/self-hosting.md",
  },
  {
    key: "api",
    slug: "api",
    label: "API reference",
    blurb: "The HTTP surface — endpoints, parameters, request and response bodies, and error codes.",
    icon: "⇄",
    body: clean(apiMdRaw),
    source: "docs/api.md",
    http: true,
  },
];

const BY_SLUG = new Map(DOCS.map((d) => [d.slug, d]));
const href = (d: Doc) => (d.slug ? `/memdream/docs/${d.slug}` : "/memdream/docs");

// h2 + nested h3 for every doc, computed once at module load.
const OUTLINE: Record<SectionKey, DocHeading[]> = DOCS.reduce(
  (acc, d) => {
    acc[d.key] = extractHeadings(d.body, 3, 2);
    return acc;
  },
  {} as Record<SectionKey, DocHeading[]>
);

const flatten = (nodes: DocHeading[]): DocHeading[] =>
  nodes.flatMap((n) => [n, ...flatten(n.children)]);

export default function MemDreamDocs() {
  const { section } = useParams<{ section?: string }>();
  const [params] = useSearchParams();
  const location = useLocation();

  // The docs used to live at /memdream/docs?section=sdk. Keep those links —
  // and anything pointing at a slug we do not publish — landing somewhere real.
  const legacy = section === undefined ? params.get("section") : null;

  const doc = BY_SLUG.get(section ?? "") ?? DOCS[0];
  const index = DOCS.indexOf(doc);
  const prev = DOCS[index - 1];
  const next = DOCS[index + 1];

  const [navOpen, setNavOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const outline = OUTLINE[doc.key];
  const flat = useMemo(() => flatten(outline), [outline]);

  // Jump to the top on a section switch; honour a hash once the new markdown
  // for that section has actually rendered.
  useEffect(() => {
    setNavOpen(false);
    const hash = location.hash.replace("#", "");
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const raf = requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(raf);
  }, [doc.key, location.hash]);

  // Highlight whichever heading is currently under the sticky header.
  useEffect(() => {
    if (!contentRef.current) return;
    const els = flat
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-150px 0px -70% 0px", threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [flat, doc.key]);

  if (legacy && BY_SLUG.has(legacy)) {
    return <Navigate to={`/memdream/docs/${legacy}${location.hash}`} replace />;
  }
  if (section !== undefined && !BY_SLUG.has(section)) {
    return <Navigate to="/memdream/docs" replace />;
  }

  const subnav = (
    <div className="mdm-docs-bar">
      <div className="mdm-container mdm-container-wide mdm-docs-bar-inner">
        {DOCS.map((d) => (
          <NavLink key={d.key} to={href(d)} end className="mdm-doctab">
            <span className="mdm-doctab-i" aria-hidden="true">
              {d.icon}
            </span>
            {d.label}
          </NavLink>
        ))}
      </div>
    </div>
  );

  return (
    <MemDreamShell subnav={subnav} wide>
      <Seo
        title={`${doc.label} — MemDream docs`}
        description={doc.blurb}
      />

      <div className="mdm-container mdm-container-wide mdm-docs">
        <button
          type="button"
          className="mdm-docs-side-toggle"
          onClick={() => setNavOpen((o) => !o)}
          aria-expanded={navOpen}
        >
          {navOpen ? "Hide contents" : `Contents — ${doc.label}`}
        </button>

        <div className="mdm-docs-shell">
          {/* ── Left rail: the four docs, active one expanded ── */}
          <aside className={`mdm-docs-side ${navOpen ? "open" : ""}`}>
            <div className="mdm-docs-group">
              <span className="mdm-docs-group-title">Documentation</span>
              <nav>
                {DOCS.map((d) => (
                  <span key={d.key} style={{ display: "contents" }}>
                    <Link
                      to={href(d)}
                      className={`mdm-docs-link ${d.key === doc.key ? "active" : ""}`}
                      onClick={() => setNavOpen(false)}
                    >
                      {d.label}
                    </Link>
                    {d.key === doc.key &&
                      outline.map((h) => (
                        <Link
                          key={h.id}
                          to={`${href(d)}#${h.id}`}
                          className={`mdm-docs-link sub ${activeId === h.id ? "active" : ""}`}
                          onClick={() => setNavOpen(false)}
                        >
                          {h.text}
                        </Link>
                      ))}
                  </span>
                ))}
              </nav>
            </div>

            <div className="mdm-docs-group">
              <span className="mdm-docs-group-title">Project</span>
              <nav>
                <Link to="/memdream" className="mdm-docs-link">
                  Overview page
                </Link>
                <a
                  className="mdm-docs-link"
                  href={`${REPO_URL}/blob/main/${doc.source}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Edit this page ↗
                </a>
                <a className="mdm-docs-link" href={REPO_URL} target="_blank" rel="noreferrer">
                  GitHub ↗
                </a>
              </nav>
            </div>
          </aside>

          {/* ── Article ── */}
          <article className="mdm-docs-main" ref={contentRef}>
            <span className="mdm-docs-eyebrow">MemDream documentation</span>

            <Markdown key={doc.key} httpHeadings={doc.http}>
              {doc.body}
            </Markdown>

            {/* The overview closes on "Where to go next" — these are it. */}
            {doc.key === "overview" && (
              <div className="mdm-doccards">
                {DOCS.filter((d) => d.key !== "overview").map((d) => (
                  <Link key={d.key} to={href(d)} className="mdm-doccard">
                    <b>
                      <span className="mdm-doctab-i" aria-hidden="true">
                        {d.icon}
                      </span>
                      {d.label}
                    </b>
                    <p>{d.blurb}</p>
                  </Link>
                ))}
              </div>
            )}

            <nav className="mdm-docs-nav">
              {prev && (
                <Link to={href(prev)}>
                  <span>← Previous</span>
                  <b>{prev.label}</b>
                </Link>
              )}
              {next && (
                <Link to={href(next)} className="next">
                  <span>Next →</span>
                  <b>{next.label}</b>
                </Link>
              )}
            </nav>
          </article>

          {/* ── Right rail: this page's outline ── */}
          <aside className="mdm-docs-toc">
            <span className="mdm-docs-toc-label">On this page</span>
            <nav>
              {flat.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  className={activeId === h.id ? "active" : ""}
                  style={h.depth >= 3 ? { paddingLeft: 26 } : undefined}
                >
                  {h.text}
                </a>
              ))}
            </nav>
          </aside>
        </div>
      </div>
    </MemDreamShell>
  );
}
