import { Link } from "react-router-dom";
import PublicLayout from "@/components/mamlesh/PublicLayout";
import Seo from "@/components/mamlesh/Seo";
import { COURSES } from "@/data/mamleshContent";

export default function Courses() {
  const course = COURSES[0];

  return (
    <PublicLayout>
      <div className="container page courses-page">
        <Seo
          title="Courses - Mamlesh"
          description="The AI Masterclass + Career Compass - a live weekday cohort to build real AI systems and get career-ready."
        />

        <div className="courses-notice">
          The weekend batch is fully booked - thank you for the incredible
          support. We are now running <strong>weekday classes only</strong>.
        </div>

        <h1 className="courses-title">Become a better engineer</h1>
        <p className="courses-sub">
          One flagship cohort, built to be super practical and no-fluff -
          designed to make you great at building AI systems and landing the role
          you want.
        </p>

        <div className="course-hero-card">
          <span className="badge">Live cohort · Weekday batch</span>
          <h2>{course.title}</h2>
          <p className="muted">{course.tagline}</p>

          <ul className="course-hero-points">
            <li>30 days · 10 live sessions · hands-on agentic projects</li>
            <li>Career Compass: ATS resume, portfolio, LinkedIn, placements</li>
            <li>Lifetime access to recordings and the resource portal</li>
          </ul>

          <Link className="btn btn-primary" to={`/courses/${course.id}`}>
            View the masterclass
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
}
