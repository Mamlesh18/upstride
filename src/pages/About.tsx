import PublicLayout from "@/components/mamlesh/PublicLayout";
import Seo from "@/components/mamlesh/Seo";
import Reveal from "@/components/mamlesh/Reveal";
import Linkify from "@/components/mamlesh/Linkify";
import { PROFILE, ORG_LINKS } from "@/data/mamleshContent";
import {
  ABOUT_INTRO,
  HIGHLIGHTS,
  ROLES,
  PUBLICATIONS,
  PATENTS,
  VENTURES,
  GALLERY,
} from "@/data/mamleshAbout";

export default function About() {
  return (
    <PublicLayout>
      <div className="container page about-page">
        <Seo
          title="About Mamlesh - Voice AI Engineer, Researcher & Builder"
          description="10 internships, 4 research papers, 2 patents, a 50L raise as founding AI engineer, and 1000+ students mentored. The story, the work, and the research behind Mamlesh."
        />

        {/* Intro */}
        <Reveal as="header" className="about-hero">
          <img className="about-photo" src="/main.jpeg" alt={PROFILE.name} />
          <div>
            <h1>Hey, I am {PROFILE.name}</h1>
            <p className="tagline">{PROFILE.tagline}</p>
            {ABOUT_INTRO.map((p, i) => (
              <p key={i} className="muted">
                <Linkify text={p} />
              </p>
            ))}
          </div>
        </Reveal>

        {/* Highlights */}
        <Reveal className="about-highlights">
          {HIGHLIGHTS.map((h) => (
            <div className="about-stat" key={h.l}>
              <div className="n">{h.n}</div>
              <div className="l">{h.l}</div>
            </div>
          ))}
        </Reveal>

        {/* Experience timeline */}
        <section className="section">
          <Reveal as="h2" className="about-h2">
            Experience
          </Reveal>
          <div className="timeline">
            {ROLES.map((r, i) => (
              <Reveal key={i} className="tl-item" delay={(i % 3) * 60}>
                <div className="tl-dot" />
                <div className="tl-card">
                  <div className="tl-head">
                    <h3>
                      {r.role}{" "}
                      <span className="tl-org">
                        ·{" "}
                        {r.url || ORG_LINKS[r.org] ? (
                          <a
                            className="link-blue"
                            href={r.url || ORG_LINKS[r.org]}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {r.org}
                          </a>
                        ) : (
                          r.org
                        )}
                      </span>
                    </h3>
                    <span className="tl-period">{r.period}</span>
                  </div>
                  <p className="faint tl-meta">
                    {r.type} · {r.location}
                  </p>
                  <ul>
                    {r.points.map((p, j) => (
                      <li key={j}>{p}</li>
                    ))}
                  </ul>
                  <div className="tl-skills">
                    {r.skills.map((s) => (
                      <span className="cd-chip sm" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Research */}
        <section className="section">
          <Reveal as="h2" className="about-h2">
            Research &amp; Publications
          </Reveal>
          <div className="about-grid">
            {PUBLICATIONS.map((p, i) => (
              <Reveal key={i} className="about-card" delay={(i % 2) * 70}>
                <span className="badge">
                  {p.venue} · {p.date}
                </span>
                <h3>
                  {p.link ? (
                    <a
                      className="link-blue"
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {p.title}
                    </a>
                  ) : (
                    p.title
                  )}
                </h3>
                <p className="muted">{p.summary}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Patents */}
        <section className="section">
          <Reveal as="h2" className="about-h2">
            Patents
          </Reveal>
          <div className="about-grid">
            {PATENTS.map((p, i) => (
              <Reveal key={i} className="about-card" delay={(i % 2) * 70}>
                <span className="badge">{p.status}</span>
                <h3>{p.title}</h3>
                <p className="faint" style={{ fontSize: "0.85rem" }}>
                  Application No. {p.number}
                </p>
                <p className="muted">{p.summary}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Ventures */}
        <section className="section">
          <Reveal as="h2" className="about-h2">
            Ventures &amp; Mentorship
          </Reveal>
          <div className="about-grid">
            {VENTURES.map((v, i) => (
              <Reveal key={i} className="about-card accent" delay={(i % 3) * 70}>
                <h3>
                  <Linkify text={v.title} />
                </h3>
                <p className="muted">
                  <Linkify text={v.detail} />
                </p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section className="section">
          <Reveal as="h2" className="about-h2">
            Beyond the work
          </Reveal>
          <Reveal className="about-gallery">
            {GALLERY.map((g) => (
              <figure className="gallery-item" key={g.src}>
                <img src={g.src} alt={g.caption} loading="lazy" />
                <figcaption>{g.caption}</figcaption>
              </figure>
            ))}
          </Reveal>
        </section>

        {/* CTA */}
        <Reveal className="newsletter">
          <h3>Want to build with me or learn from me?</h3>
          <p className="muted">
            I take on a small number of collaborations and mentees. Reach out
            and tell me what you are building.
          </p>
          <a className="btn btn-primary" href={`mailto:${PROFILE.email}`}>
            Get in touch
          </a>
        </Reveal>
      </div>
    </PublicLayout>
  );
}
