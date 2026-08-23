import { Link } from "react-router-dom";
import { PROFILE } from "@/data/mamleshContent";
import Linkify from "./Linkify";

export default function AboutMe() {
  return (
    <section className="aboutband">
      <div className="container aboutband-inner">
        <img className="aboutband-photo" src="/main.jpeg" alt={PROFILE.name} />
        <div>
          <h2>Hey, I am {PROFILE.name}</h2>
          <p className="aboutband-tag">{PROFILE.tagline}</p>
          <p className="muted">
            <Linkify text={PROFILE.intro[0]} />
          </p>
          <div className="hero-cta">
            <Link to="/about" className="btn btn-ghost">
              More about me
            </Link>
            <a
              className="btn btn-primary"
              href={`mailto:${PROFILE.email}`}
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
