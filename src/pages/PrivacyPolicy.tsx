import PublicLayout from "@/components/mamlesh/PublicLayout";
import PolicyLayout, {
  Note,
  type PolicySection,
} from "@/components/mamlesh/PolicyLayout";
import { PROFILE } from "@/data/mamleshContent";

export default function PrivacyPolicy() {
  const sections: PolicySection[] = [
    {
      id: "collect",
      heading: "What we collect",
      body: (
        <>
          <ul>
            <li>Your name, email, and phone number when you enrol or contact us.</li>
            <li>
              Payment confirmation from Razorpay (payment ID, amount, and the email used).
            </li>
            <li>
              Limited device and session info, used only to protect against account sharing.
            </li>
          </ul>
          <Note tone="success">
            We never collect or store your card, UPI, or banking details - those are handled entirely by Razorpay.
          </Note>
        </>
      ),
    },
    {
      id: "use",
      heading: "How we use it",
      body: (
        <>
          <ul>
            <li>To give you access to your courses and portal.</li>
            <li>To issue invoices and certificates.</li>
            <li>To send course updates and answer your questions.</li>
            <li>To meet legal, tax, and accounting obligations.</li>
          </ul>
          <p>
            We process your data based on your consent and to deliver the course you signed up for. You can withdraw consent any time, subject to legal retention rules.
          </p>
        </>
      ),
    },
    {
      id: "rights",
      heading: "Your rights",
      body: (
        <>
          <p>Under the DPDP Act, 2023 you can:</p>
          <ul>
            <li>Access a summary of the data we hold about you.</li>
            <li>Ask us to correct, complete, update, or erase your data.</li>
            <li>Withdraw consent, or nominate someone to exercise your rights.</li>
            <li>Raise a grievance (see below).</li>
          </ul>
        </>
      ),
    },
    {
      id: "sharing",
      heading: "How we share it",
      body: (
        <p>
          We do not sell your data. We share it only with the services needed to run the platform - for example, <strong>Razorpay</strong> for payments - who handle it under their own policies, and where a competent authority requires it under Indian law.
        </p>
      ),
    },
    {
      id: "retention",
      heading: "Keeping your data safe",
      body: (
        <p>
          We keep your data only as long as needed for the purposes above or as required by law, then delete or anonymise it. We use reasonable security practices to protect it against unauthorised access, disclosure, or loss.
        </p>
      ),
    },
    {
      id: "grievance",
      heading: "Grievance officer",
      body: (
        <>
          <p>
            For any privacy concern, contact our Grievance Officer at{" "}
            <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>. We acknowledge requests within 48 hours and respond within the timelines required by law.
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
          title: "Privacy Policy - Mamlesh",
          description:
            "How we collect, use, and protect your data - aligned with the DPDP Act 2023 and the IT Act 2000.",
        }}
        eyebrow="Privacy"
        title="Privacy Policy"
        updated="Last updated: July 2026 · Governed by the laws of India"
        intro={
          <p>
            Your privacy matters. Here is exactly what we collect, why, and how we protect it - in line with the <strong>Digital Personal Data Protection Act, 2023</strong> and the <strong>Information Technology Act, 2000</strong>.
          </p>
        }
        sections={sections}
      />
    </PublicLayout>
  );
}
