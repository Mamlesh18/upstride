import { Link } from "react-router-dom";
import PublicLayout from "@/components/mamlesh/PublicLayout";
import PolicyLayout, {
  Note,
  type PolicySection,
} from "@/components/mamlesh/PolicyLayout";
import { PROFILE } from "@/data/mamleshContent";

export default function TermsOfAgreement() {
  const sections: PolicySection[] = [
    {
      id: "access",
      heading: "Courses & access",
      body: (
        <>
          <p>
            Courses are digital learning products. Once your payment succeeds, you get access to the course and portal using the email address you paid with.
          </p>
          <p>Access is for one person and is not transferable.</p>
        </>
      ),
    },
    {
      id: "ip",
      heading: "Using the content",
      body: (
        <>
          <p>
            All content - recordings, materials, code, and templates - belongs to {PROFILE.name} and is protected under the <strong>Copyright Act, 1957</strong>. Please use it for your own learning.
          </p>
          <ul>
            <li>Do not resell, redistribute, or publicly share the content.</li>
            <li>Do not share your login or access with anyone else.</li>
          </ul>
          <Note tone="warn">
            We track devices and sessions. Suspected sharing or misuse can lead to access being revoked without a refund.
          </Note>
        </>
      ),
    },
    {
      id: "payments",
      heading: "Payments & taxes",
      body: (
        <p>
          All payments are processed securely through <strong>Razorpay</strong>. Prices are in Indian Rupees (INR) and include <strong>GST</strong> where applicable. A valid tax invoice is available in your course portal.
        </p>
      ),
    },
    {
      id: "refunds",
      heading: "Refunds",
      body: (
        <p>
          Refunds follow our separate <Link to="/refund">Refund Policy</Link>, which gives you a 24-hour window. Please read it before enrolling.
        </p>
      ),
    },
    {
      id: "outcomes",
      heading: "Certificates & outcomes",
      body: (
        <p>
          You receive a certificate of completion after the cohort ends. We do not guarantee any specific job, placement, or salary - the career tools and guidance are there to help, and your results depend on your own effort.
        </p>
      ),
    },
    {
      id: "liability",
      heading: "Limitation of liability",
      body: (
        <p>
          To the maximum extent permitted by law, our total liability relating to the course will not exceed the amount you paid for it. We are not liable for any indirect or consequential losses.
        </p>
      ),
    },
    {
      id: "law",
      heading: "Governing law",
      body: (
        <p>
          These terms are governed by the laws of India. Subject to applicable law, the courts at the service provider's registered location in India have exclusive jurisdiction over any disputes.
        </p>
      ),
    },
    {
      id: "contact",
      heading: "Contact",
      body: (
        <>
          <p>
            Questions about these terms? Email <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>.
          </p>
          <Note>
            This page is for transparency and is not legal advice. Please consult a qualified professional for your specific situation.
          </Note>
        </>
      ),
    },
  ];

  return (
    <PublicLayout>
      <PolicyLayout
        seo={{
          title: "Terms & Conditions - Mamlesh",
          description:
            "The terms for using this website and enrolling in courses - access, content use, payments, refunds, and governing law.",
        }}
        eyebrow="Terms & Conditions"
        title="Terms & Conditions"
        updated="Last updated: July 2026 · Governed by the laws of India"
        intro={
          <p>
            These terms cover how you use this website and enrol in courses. They are an electronic record under the <strong>Information Technology Act, 2000</strong> and a binding agreement under the <strong>Indian Contract Act, 1872</strong>. By using the site or enrolling, you accept them.
          </p>
        }
        sections={sections}
      />
    </PublicLayout>
  );
}
