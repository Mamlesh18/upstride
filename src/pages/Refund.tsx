import PublicLayout from "@/components/mamlesh/PublicLayout";
import PolicyLayout, {
  Note,
  type PolicySection,
} from "@/components/mamlesh/PolicyLayout";
import { PROFILE } from "@/data/mamleshContent";

export default function Refund() {
  const sections: PolicySection[] = [
    {
      id: "window",
      heading: "Your 24-hour refund window",
      body: (
        <>
          <p>
            We keep refunds simple. From the moment your payment goes through, you have a full <strong>24 hours</strong> to change your mind.
          </p>
          <Note tone="success">
            Request a refund within 24 hours of paying and you get <strong>100% back</strong> - no questions asked.
          </Note>
        </>
      ),
    },
    {
      id: "eligibility",
      heading: "When a refund no longer applies",
      body: (
        <>
          <p>You become ineligible for a refund once any of these happen:</p>
          <ul>
            <li>More than 24 hours have passed since your payment.</li>
            <li>
              You have downloaded your <strong>GST invoice</strong> or <strong>certificate of completion</strong> from the portal - even if the 24 hours are not yet up.
            </li>
            <li>You move from one cohort or batch to another after enrolling.</li>
            <li>You enrolled after the cohort had already started using a direct payment link.</li>
          </ul>
        </>
      ),
    },
    {
      id: "how",
      heading: "How to request a refund",
      body: (
        <>
          <p>It takes a minute:</p>
          <ul>
            <li>
              Email <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a> from the address you paid with, within the 24-hour window.
            </li>
            <li>Include your payment or transaction ID so we can find it quickly.</li>
          </ul>
          <p>That is all we need to get it moving.</p>
        </>
      ),
    },
    {
      id: "processing",
      heading: "How refunds are processed",
      body: (
        <>
          <p>
            Approved refunds go back to your <strong>original payment method</strong> through our payment partner, <strong>Razorpay</strong>.
          </p>
          <ul>
            <li>We usually initiate the refund within 2-3 business days of approval.</li>
            <li>It can take another 5-7 business days to appear, depending on your bank or card issuer.</li>
          </ul>
          <p>
            Any non-recoverable payment-gateway charges may be deducted where permitted by law.
          </p>
        </>
      ),
    },
    {
      id: "duplicate",
      heading: "Duplicate or failed payments",
      body: (
        <p>
          If you were charged twice for the same order, or money left your account but access was never granted, the extra or erroneous amount is refunded in full - just email us.
        </p>
      ),
    },
    {
      id: "taxes",
      heading: "Taxes (GST)",
      body: (
        <p>
          Prices include <strong>GST</strong> as applicable under Indian law. When a refund is issued, the corresponding tax component is refunded too, in line with applicable GST regulations.
        </p>
      ),
    },
    {
      id: "grievances",
      heading: "Questions or grievances",
      body: (
        <>
          <p>
            Have a concern? Write to <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>. We aim to acknowledge within 48 hours and resolve things within a reasonable time, as required by applicable consumer-protection law.
          </p>
          <Note>
            This page is for transparency and is not legal advice. For your specific situation, please consult a qualified professional.
          </Note>
        </>
      ),
    },
  ];

  return (
    <PublicLayout>
      <PolicyLayout
        seo={{
          title: "Refund Policy - Mamlesh",
          description:
            "Simple, fair refunds: a 24-hour no-questions-asked window, clear eligibility, and fast processing via Razorpay.",
        }}
        eyebrow="Refund & Cancellation"
        title="Refund Policy"
        updated="Last updated: July 2026 · Governed by the laws of India"
        intro={
          <p>
            Fair and simple. This policy explains exactly when you can get a refund, how to request one, and how quickly you will get your money back - in line with the Consumer Protection Act, 2019.
          </p>
        }
        sections={sections}
      />
    </PublicLayout>
  );
}
