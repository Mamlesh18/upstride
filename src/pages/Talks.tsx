import { Fragment } from "react";
import PublicLayout from "@/components/mamlesh/PublicLayout";
import Seo from "@/components/mamlesh/Seo";
import { JOURNEY, TALK_GALLERY } from "@/data/mamleshContent";

const ROW_SIZE = 3;

export default function Talks() {
  const rows: (typeof JOURNEY)[] = [];
  for (let i = 0; i < JOURNEY.length; i += ROW_SIZE) {
    rows.push(JOURNEY.slice(i, i + ROW_SIZE));
  }

  return (
    <PublicLayout>
      <div className="container page">
        <Seo
          title="Talks - Mamlesh"
          description="My speaking journey - guest lectures and podcasts across colleges in 2026, on applied AI and building a career in tech."
        />
        <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>Talks</h1>
        <p className="muted" style={{ maxWidth: 620 }}>
          I have spoken at 8+ colleges and mentored 1000+ students. Here is my
          speaking journey so far - guest lectures and podcasts on applied AI
          and building a career in tech.
        </p>

        <figure className="talks-banner">
          <img
            src="/students.jpeg"
            alt="Mamlesh speaking to students"
            loading="lazy"
          />
        </figure>

        <h2 className="about-h2" style={{ marginTop: 40 }}>
          The journey so far
        </h2>

        <div className="journey">
          {rows.map((row, ri) => (
            <Fragment key={ri}>
              <div className={`journey-row ${ri % 2 ? "rtl" : "ltr"}`}>
                {row.map((item) => (
                  <div className="journey-node" key={item.n}>
                    <div className="journey-card">
                      <span className="journey-num">{item.n}</span>
                      <span className="journey-date">{item.date}</span>
                      <strong>{item.place}</strong>
                      {item.tag && <span className="badge">{item.tag}</span>}
                    </div>
                  </div>
                ))}
              </div>
              {ri < rows.length - 1 && (
                <div
                  className={`journey-bridge ${ri % 2 === 0 ? "right" : "left"}`}
                >
                  <span className="arc" />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        <h2 className="about-h2" style={{ marginTop: 48 }}>
          Moments from these talks
        </h2>
        <div className="about-gallery">
          {TALK_GALLERY.map((g) => (
            <figure className="gallery-item" key={g.src}>
              <img src={g.src} alt={g.caption} loading="lazy" />
              <figcaption>{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
