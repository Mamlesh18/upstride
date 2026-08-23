import { useEffect, useState, ReactNode } from "react";
import Seo from "./Seo";

export interface PolicySection {
  id: string;
  heading: string;
  body: ReactNode;
}

interface PolicyLayoutProps {
  eyebrow?: string;
  title: string;
  updated?: string;
  intro?: ReactNode;
  sections: PolicySection[];
  seo?: { title?: string; description?: string };
}

export default function PolicyLayout({
  eyebrow = "Legal",
  title,
  updated,
  intro,
  sections,
  seo,
}: PolicyLayoutProps) {
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  return (
    <div className="container page policy">
      {seo && <Seo title={seo.title} description={seo.description} />}

      <header className="policy-header">
        <span className="policy-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {updated && <p className="policy-updated">{updated}</p>}
        {intro && <div className="policy-intro">{intro}</div>}
      </header>

      <div className="policy-layout">
        <aside className="policy-toc">
          <span className="toc-label">On this page</span>
          <nav>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={activeId === s.id ? "active" : ""}
              >
                {s.heading}
              </a>
            ))}
          </nav>
        </aside>

        <div className="policy-content">
          {sections.map((s) => (
            <section id={s.id} key={s.id} className="policy-section">
              <h2>{s.heading}</h2>
              <div className="policy-body">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Note({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "success" | "warn";
}) {
  return <div className={`policy-note ${tone}`}>{children}</div>;
}
