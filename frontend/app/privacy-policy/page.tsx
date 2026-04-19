import type { Metadata } from "next";
import LegalPage from "../components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Interview AI",
  description: "How Interview AI collects, uses, and protects your data.",
};

const sections = [
  {
    title: "Information We Collect",
    body: [
      "We collect information you provide when you create an account, sign in, or use the platform. This can include your name, email address, profile details, and any preferences you save.",
      "When you practice interviews, we may also process audio input, transcripts, answer history, scores, and feedback so the system can evaluate your performance and improve your experience.",
    ],
    bullets: [
      "Account and profile information",
      "Interview audio, transcripts, and answers",
      "Device, browser, and usage analytics",
      "Saved preferences and settings",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "We use your information to run the service, generate interview questions, score responses, deliver feedback, and keep your progress available across sessions.",
      "We also use usage data to diagnose issues, protect the platform from abuse, and improve the relevance and quality of the experience over time.",
    ],
    bullets: [
      "Operate and secure the product",
      "Generate questions and feedback",
      "Personalize practice sessions",
      "Measure performance and reliability",
    ],
  },
  {
    title: "Sharing and Retention",
    body: [
      "We do not sell personal data. We may share information with service providers that help us host the application, process audio, or analyze performance, but only for product-related purposes.",
      "We keep data only as long as it is needed for the service, compliance, or legitimate operational reasons. You can request deletion where applicable by contacting us.",
    ],
    bullets: [
      "No sale of personal information",
      "Limited sharing with trusted providers",
      "Data retained for service and compliance",
      "Deletion requests handled where applicable",
    ],
  },
  {
    title: "Your Choices",
    body: [
      "You can update your account information, manage cookie preferences, and control some communication settings through the product UI or by contacting support.",
      "If you are located in a region with specific privacy rights, you may have additional rights to access, correct, export, or delete your information.",
    ],
    bullets: [
      "Update profile information",
      "Manage cookie preferences",
      "Request access or deletion",
      "Opt out of non-essential communications",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      badge="Privacy Policy"
      title="Your Data, Clearly Explained"
      intro="Interview AI uses your account details, interview activity, and product usage to deliver practice sessions, scoring, and feedback. This policy explains what we collect and how it is handled."
      updated="April 19, 2026"
      sections={sections}
      ctaLabel="Back to home"
      ctaHref="/"
      ctaNote="Review your privacy choices anytime from the cookie settings page."
    />
  );
}