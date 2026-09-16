import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import PublicLayout from "@/components/mamlesh/PublicLayout";
import Seo from "@/components/mamlesh/Seo";
import Markdown from "@/components/mamlesh/Markdown";
import { extractHeadings, stripSection, type DocHeading } from "@/lib/markdownHeadings";
import sdkMdRaw from "@/content/memdream/sdk.md?raw";
import selfHostingMdRaw from "@/content/memdream/self-hosting.md?raw";

const REPO_URL = "https://github.com/Mamlesh18/MemDream";

type SectionKey = "sdk" | "self-hosting";

// The site already renders real sidebar + on-page nav, so the source docs'
// own manual "## Contents" link index would just be a redundant listing —
// drop it before parsing headings or rendering.
const sdkMd = stripSection(sdkMdRaw, "Contents");
const selfHostingMd = stripSection(selfHostingMdRaw, "Contents");

const DOCS: Record<SectionKey, { label: string; body: string; path: string }> = {
  sdk: { label: "Python SDK", body: sdkMd, path: "docs/sdk.md" },
  "self-hosting": { label: "Self-hosting", body: selfHostingMd, path: "docs/self-hosting.md" },
};

// Flat h2 list (doc title h1s excluded) used for the left doc switcher.
const HEADINGS: Record<SectionKey, DocHeading[]> = {
  sdk: extractHeadings(sdkMd, 2, 2),
  "self-hosting": extractHeadings(selfHostingMd, 2, 2),
};

// h2 (+ nested h3) used for the right-hand "on this page" column.
const TOC_HEADINGS: Record<SectionKey, DocHeading[]> = {
  sdk: extractHeadings(sdkMd, 3, 2),
  "self-hosting": extractHeadings(selfHostingMd, 3, 2),
};

export default function MemDreamDocs() {
  const [params] = useSearchParams();
  const location = useLocation();
  const requested = params.get("section");
  const section: SectionKey = requested === "self-hosting" ? "self-hosting" : "sdk";
  const doc = DOCS[section];

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const flatToc = useMemo(() => {
    const out: DocHeading[] = [];
    const walk = (nodes: DocHeading[]) => {
      for (const n of nodes) {
        out.push(n);
        walk(n.children);
      }
    };
    walk(TOC_HEADINGS[section]);
    return out;
  }, [section]);

  // Jump to top on section switch; if a hash is present, scroll to that
  // heading once the markdown for the new section has rendered.
  useEffect(() => {
    setMobileNavOpen(false);
    const hash = location.hash.replace("#", "");
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    const id = requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [section, location.hash]);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const els = flatToc
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => !!el);
    if (els.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [flatToc, doc.body]);

  return (
    <PublicLayout>
      <div className="container container-wide page docs-page">
        <Seo
          title={`${doc.label} — MemDream Docs`}
          description={`MemDream ${doc.label} documentation — sourced from ${doc.path}.`}
        />

        <header className="docs-header">
          <span className="policy-eyebrow">Documentation</span>
          <h1>MemDream Docs</h1>
          <p className="muted">
            Reference documentation for MemDream's Python SDK and self-hosting setup.
            Looking for the project overview instead? See the{" "}
            <Link className="link-accent" to="/memdream">
              MemDream project page
            </Link>
            .
          </p>
        </header>

        <button
          type="button"
          className="docs-mobile-toggle"
          onClick={() => setMobileNavOpen((o) => !o)}
        >
          {mobileNavOpen ? "Hide navigation" : "Browse documentation"}
        </button>

        <div className="docs-shell">
          <aside className={`docs-sidebar ${mobileNavOpen ? "open" : ""}`}>
            {(Object.keys(DOCS) as SectionKey[]).map((key) => (
              <div className="docs-group" key={key}>
                <span className="docs-group-title">{DOCS[key].label}</span>
                <nav>
                  {HEADINGS[key].map((h) => (
                    <Link
                      key={h.id}
                      to={`/memdream/docs?section=${key}#${h.id}`}
                      className={`docs-link ${section === key && activeId === h.id ? "active" : ""}`}
                      onClick={() => setMobileNavOpen(false)}
                    >
                      {h.text}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
            <div className="docs-group">
              <span className="docs-group-title">Source</span>
              <nav>
                <a
                  className="docs-link"
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub repository ↗
                </a>
              </nav>
            </div>
          </aside>

          <div className="docs-content" ref={contentRef}>
            <Markdown key={section}>{doc.body}</Markdown>
          </div>

          <aside className="policy-toc docs-toc">
            <span className="toc-label">On this page</span>
            <nav>
              {flatToc.map((h) => (
                <a
                  key={h.id}
                  href={`#${h.id}`}
                  className={activeId === h.id ? "active" : ""}
                  style={h.depth >= 3 ? { paddingLeft: 30 } : undefined}
                >
                  {h.text}
                </a>
              ))}
            </nav>
          </aside>
        </div>
      </div>
    </PublicLayout>
  );
}
