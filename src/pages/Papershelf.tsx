import { useEffect, useState } from "react";
import PublicLayout from "@/components/mamlesh/PublicLayout";
import Seo from "@/components/mamlesh/Seo";
import { PUBLICATIONS, PATENTS, PATENT_PORTAL } from "@/data/mamleshAbout";
import { READ_PAPERS as SEED_PAPERS } from "@/data/mamleshContent";
import { api, type Paper } from "@/services/api";

interface ResearchRow {
  title: string;
  date: string;
  link?: string;
  appNo?: string;
}

const RESEARCH: ResearchRow[] = [
  ...PATENTS.map<ResearchRow>((p) => ({ title: p.title, date: p.status, appNo: p.number })),
  ...PUBLICATIONS.map<ResearchRow>((p) => ({ title: p.title, date: p.date, link: p.link })),
];

interface Row {
  id: string;
  title: string;
  url: string;
}

export default function Papershelf() {
  const [reading, setReading] = useState<Row[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.papers
      .list()
      .then((data: Paper[]) => {
        if (data.length === 0) {
          setReading(SEED_PAPERS.map((p) => ({ id: p.id, title: p.title, url: p.url })));
        } else {
          setReading(data.map((p) => ({ id: p.id, title: p.title, url: p.url })));
        }
      })
      .catch((e) => {
        setError(e?.message || "Couldn't load papers.");
        setReading(SEED_PAPERS.map((p) => ({ id: p.id, title: p.title, url: p.url })));
      });
  }, []);

  const readingList = reading ?? [];
  const total = RESEARCH.length + readingList.length;

  return (
    <PublicLayout>
      <div className="container page">
        <Seo
          title="Papershelf - Mamlesh"
          description="My published research and patents, plus papers I have read and recommend."
        />
        <h1 style={{ fontSize: "2.3rem", marginBottom: 12 }}>
          Papershelf <span className="count">({total})</span>
        </h1>

        <h2 className="about-h2" style={{ marginTop: 8 }}>Research work</h2>
        <p className="muted" style={{ maxWidth: 660 }}>
          I spend time on independent research and have published 4 papers and 2
          patents. My areas of interest include applied AI, voice systems,
          computer vision, and autonomous systems.
        </p>
        <ul className="paper-list">
          {RESEARCH.map((r, i) => (
            <li key={i}>
              <span className="paper-date">{r.date}</span>
              <span className="paper-sep"> : </span>
              {r.link ? (
                <a className="link-blue" href={r.link} target="_blank" rel="noreferrer">
                  {r.title}
                </a>
              ) : (
                <span className="paper-title">{r.title}</span>
              )}
              {r.appNo && (
                <>
                  {" | "}
                  <a
                    className="link-blue"
                    href={PATENT_PORTAL}
                    target="_blank"
                    rel="noreferrer"
                    title="Verify on the India Patent Office portal"
                  >
                    App No. {r.appNo}
                  </a>
                </>
              )}
            </li>
          ))}
        </ul>

        <h2 className="about-h2" style={{ marginTop: 40 }}>Papers I read</h2>
        <p className="muted" style={{ maxWidth: 660 }}>
          I read papers regularly on topics that interest me. Here are some I
          found worth sharing - click any title to read it.
        </p>

        {reading === null && <p className="faint" style={{ marginTop: 16 }}>Loading…</p>}
        {error && <div className="form-error" style={{ marginTop: 16 }}>{error}</div>}

        {reading !== null && readingList.length === 0 && (
          <div className="content-block" style={{ marginTop: 16 }}>
            Nothing on the shelf yet. Check back soon.
          </div>
        )}

        {readingList.length > 0 && (
          <ul className="paper-list">
            {readingList.map((p) => (
              <li key={p.id}>
                <a className="link-blue" href={p.url} target="_blank" rel="noreferrer">
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PublicLayout>
  );
}
