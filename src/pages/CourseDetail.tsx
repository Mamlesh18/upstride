import { Link } from "react-router-dom";
import PublicLayout from "@/components/mamlesh/PublicLayout";
import Seo from "@/components/mamlesh/Seo";
import { COURSE_DETAIL as C } from "@/data/mamleshCourseDetail";
import { PROFILE } from "@/data/mamleshContent";

export default function CourseDetail() {
  const livePrice = C.livePrice;
  const originalPrice = C.originalPrice;
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
          <div className="cd-enroll-note">{C.enrollmentNote}</div>

          <div className="cd-hero-cta">
            <Link to="/login" className="btn btn-ghost">
              Already enrolled? Log in
            </Link>
            <a className="btn btn-primary" href={C.paymentUrl}>
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

        <p className="cd-weekend-note">{C.weekendMessage}</p>

        {/* Pricing */}
        <section className="section" style={{ textAlign: "center" }}>
          <h2 className="cd-h2">Pricing</h2>
          <p className="muted">{C.earlyBird}</p>
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
              <a className="btn btn-primary" href={C.paymentUrl}>
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
