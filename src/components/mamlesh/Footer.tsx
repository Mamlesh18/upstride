import { Link } from "react-router-dom";
import { PROFILE } from "@/data/mamleshContent";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h4>Writings &amp; Learnings</h4>
            <Link to="/blogs">Blogs</Link>
            <Link to="/papershelf">Papershelf</Link>
            <Link to="/talks">Talks</Link>
          </div>

          {/* Courses column hidden while we quiet-launch the next cohort.
              Uncomment to bring it back.
          <div className="footer-col">
            <h4>Courses</h4>
            <Link to="/courses/ai-masterclass">AI Engineer in 30 Days</Link>
            <Link to="/courses">All Courses</Link>
            <Link to="/login">Student Log in</Link>
          </div>
          */}

          <div className="footer-col">
            <h4>Legal &amp; Contact</h4>
            <Link to="/about">About me</Link>
            <Link to="/terms">Terms and Conditions</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/refund">Refund Policy</Link>
          </div>

          <div className="footer-col">
            <h4>Everything Else</h4>
            <a href={`mailto:${PROFILE.email}`}>Email</a>
            <a href={PROFILE.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            © 2026 {PROFILE.name}. Built with care - engineering, AI, and systems.
          </div>
          <div className="footer-legal faint">
            The courses listed on this website are offered by Mamlesh. For any
            queries, reach out at {PROFILE.email}.
          </div>
        </div>
      </div>
    </footer>
  );
}
