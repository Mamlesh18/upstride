import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PublicLayout from "@/components/mamlesh/PublicLayout";
import Seo from "@/components/mamlesh/Seo";
import { COURSE_DETAIL as C } from "@/data/mamleshCourseDetail";
import { PROFILE } from "@/data/mamleshContent";
import { STUDENT_STORIES, PLACEMENT_COMPANIES } from "@/data/studentTestimonials";
import { api, type SiteSettings } from "@/services/api";

// Screenshots from actual cohort sessions.
const SESSION_SHOTS = [
  { src: "/meet-1.jpeg", caption: "Live cohort session — hands-on build" },
  { src: "/meet-2.jpeg", caption: "Q&A + code walkthrough" },
];

export default function CourseDetail() {
  // Admin-editable settings; fall back to the hardcoded defaults if the API
  // is unavailable (offline dev, first-run before admin sets anything).
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    api.public
      .siteConfig()
      .then((r) => setSettings(r.data))
      .catch(() => {
        /* keep hardcoded fallback */
      });
  }, []);

  const livePrice = settings?.live_price_inr ?? C.livePrice;
  const originalPrice = settings?.original_price_inr ?? C.originalPrice;
  const paymentUrl = settings?.live_payment_url || C.paymentUrl;
  const enrollmentNote = settings?.enrollment_note || C.enrollmentNote;
  const earlyBird = settings?.early_bird_text || C.earlyBird;
  const weekendMessage = settings?.weekend_full_message || C.weekendMessage;

  const discounted = originalPrice > livePrice;
  const pctOff = discounted
    ? Math.round(((originalPrice - livePrice) / originalPrice) * 100)
    : 0;

  return (
    <PublicLayout>
      <div className="container page course-detail">
        <Seo
          title="Become an AI Engineer in 30 Days | Mamlesh"
          description="A 30-day live cohort to build production-ready AI systems and become a recruiter-ready AI engineer - AI engineering, real projects, Career Compass, and a lifetime resource library."
        />

        {/* Hero */}
        <header className="cd-hero">
          <span className="badge">Live Weekday cohort</span>
          <h1>{C.title}</h1>
          <p className="tagline">{C.promise}</p>
          <div className="cd-format">{C.format}</div>
          <div className="cd-enroll-note">{enrollmentNote}</div>

          <div className="cd-hero-cta">
            <Link to="/login" className="btn btn-ghost">
              Already enrolled? Log in
            </Link>
            <a className="btn btn-primary" href={paymentUrl}>
              Enroll now
            </a>
          </div>
        </header>

        {/* Sessions */}
        <section className="section">
          <h2 className="cd-h2">The 10 sessions</h2>
          <p className="muted">
            6 AI engineering sessions and 4 career sessions.
          </p>
          <div className="cd-sessions">
            {C.sessions.map((s) => (
              <div className="cd-session" key={s.n}>
                <span className="cd-week">
                  Session {s.n} ·{" "}
                  <span
                    className={`cd-track ${s.track === "AI" ? "ai" : "career"}`}
                  >
                    {s.track === "AI" ? "AI Engineering" : "Career"}
                  </span>
                </span>
                <h3>{s.title}</h3>
                <p className="muted">{s.desc}</p>
                <ul className="cd-topics">
                  {s.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <p className="cd-weekend-note">{weekendMessage}</p>

        {/* Pricing */}
        <section className="section" style={{ textAlign: "center" }}>
          <h2 className="cd-h2">Pricing</h2>
          <p className="muted">{earlyBird}</p>
          <div className="cd-plans single">
            <div className="cd-plan featured">
              {discounted && (
                <span className="cd-offer-badge">
                  Early bird · {pctOff}% OFF
                </span>
              )}
              <h3>Live Cohort</h3>
              <div className="cd-price-row">
                {discounted && (
                  <span className="cd-price-was">
                    ₹{originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
                <span className="cd-plan-price">
                  ₹{livePrice.toLocaleString("en-IN")}
                </span>
              </div>
              {discounted && (
                <div className="cd-price-save">
                  You save ₹
                  {(originalPrice - livePrice).toLocaleString("en-IN")} ·{" "}
                  {pctOff}% off
                </div>
              )}
              <p className="faint">inclusive of all taxes</p>
              <ul className="cd-checklist">
                <li>All 10 live weekday sessions</li>
                <li>Community, network &amp; doubt resolution</li>
                <li>Career Compass + lifetime resource library</li>
                <li>Lifetime recordings &amp; certificate</li>
              </ul>
              <a className="btn btn-primary" href={paymentUrl}>
                Enroll Now
              </a>
            </div>
          </div>
        </section>

        {/* What do you get */}
        <section className="section">
          <h2 className="cd-h2">What do you get?</h2>
          <p className="muted">
            Real, tangible assets that get you hired - included.
          </p>
          <div className="cd-getgrid">
            {C.whatYouGet.map((g, i) => (
              <div className="cd-getcard" key={g.title}>
                <span className="cd-getnum">{i + 1}</span>
                <h3>{g.title}</h3>
                <p className="muted">{g.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Career Compass */}
        <section className="section">
          <div className="cd-compass">
            <h2 className="cd-h2">What is Career Compass?</h2>
            <p className="muted">{C.careerCompass.tagline}</p>
            <ul className="cd-checklist">
              {C.careerCompass.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Real student outcomes ─────────────────────────────────────── */}
        <section className="section">
          <h2 className="cd-h2">Real student outcomes</h2>
          <p className="muted">
            These are actual students from prior cohorts — what they built, and
            where they landed.
          </p>
          <div className="student-wall">
            {STUDENT_STORIES.map((s) => (
              <figure className="student-card" key={s.name}>
                <span className="student-highlight">{s.highlight}</span>
                <blockquote className="student-quote">"{s.quote}"</blockquote>
                <figcaption className="student-foot">
                  <img
                    className="student-photo"
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.visibility =
                        "hidden";
                    }}
                  />
                  <div className="student-meta">
                    <strong>{s.name}</strong>
                    <span>{s.achievement}</span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

          <h3
            className="cd-h3"
            style={{ marginTop: 36, fontSize: "1.05rem", fontWeight: 600 }}
          >
            Where students have landed
          </h3>
          <div className="placement-strip">
            {PLACEMENT_COMPANIES.map((c) => (
              <span className="placement-chip" key={c}>
                <strong>{c}</strong>
              </span>
            ))}
          </div>
        </section>

        {/* ── Inside a live session (screenshots) ──────────────────────── */}
        <section className="section">
          <h2 className="cd-h2">Inside a live session</h2>
          <p className="muted">
            Snapshots from recent cohort meetings — hands-on builds, not
            slideware.
          </p>
          <div className="meet-grid">
            {SESSION_SHOTS.map((shot) => (
              <figure className="meet-shot" key={shot.src}>
                <img src={shot.src} alt={shot.caption} loading="lazy" />
                <figcaption>{shot.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <h2 className="cd-h2">Frequently asked questions</h2>
          <p className="muted">
            Still have questions? Email me at{" "}
            <a className="link-accent" href={`mailto:${PROFILE.email}`}>
              {PROFILE.email}
            </a>
            .
          </p>
          <div className="cd-faqs">
            {C.faqs.map((f, i) => (
              <details className="cd-faq" key={i} open>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </PublicLayout>
  );
}
