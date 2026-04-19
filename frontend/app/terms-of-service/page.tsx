import type { Metadata } from "next";
import LegalPage from "../components/ui/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | Interview AI",
  description: "Terms for using Interview AI and its interview practice features.",
};

const sections = [
  {
    title: "Acceptance of Terms",
    body: [
      "By accessing or using Interview AI, you agree to these terms and to comply with all applicable laws. If you do not agree, do not use the service.",
      "We may update these terms from time to time. When we do, continued use of the platform means you accept the revised terms.",
    ],
    bullets: [
      "Use the platform only if you can form a valid agreement",
      "Keep up with updates to the terms",
      "Stop using the service if you do not agree",
      "Contact support if a term is unclear",
    ],
  },
  {
    title: "Accounts and Conduct",
    body: [
      "You are responsible for the accuracy of your account details and for keeping your login credentials secure. Any activity under your account is your responsibility.",
      "Do not attempt to disrupt the service, upload malicious content, bypass security controls, or misuse interview content, feedback, or analytics in ways that violate applicable rules.",
    ],
    bullets: [
      "Protect your credentials",
      "Keep your profile information accurate",
      "Do not misuse or attack the service",
      "Follow the rules of the platform and the law",
    ],
  },
  {
    title: "AI Features and Output",
    body: [
      "The platform uses AI to generate interview questions, evaluate answers, and produce feedback. AI output can be helpful, but it may not always be accurate, complete, or suitable for every situation.",
      "You should use judgment when relying on generated content. Interview AI is a practice tool, not a guarantee of interview success, hiring outcomes, or professional advice.",
    ],
    bullets: [
      "AI output may be imperfect",
      "Use your own judgment before acting on feedback",
      "The service is for practice and preparation",
      "No guarantee of job placement or results",
    ],
  },
  {
    title: "Subscriptions and Liability",
    body: [
      "If paid plans are offered, billing terms will be shown before purchase. Fees, renewal rules, refunds, and cancellations are governed by the pricing information presented at checkout.",
      "To the maximum extent permitted by law, the service is provided without warranties, and our liability for indirect or incidental damages is limited as allowed by applicable law.",
    ],
    bullets: [
      "Review pricing before purchase",
      "Renewal and cancellation follow checkout terms",
      "No broad warranty promises",
      "Liability is limited where the law allows",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalPage
      badge="Terms of Service"
      title="Rules for Using the Platform"
      intro="These terms explain the basic rules for using Interview AI, including account responsibilities, acceptable use, AI output, and subscription expectations."
      updated="April 19, 2026"
      sections={sections}
      ctaLabel="Start practicing"
      ctaHref="/practice"
      ctaNote="If you continue using the platform after updates, the revised terms will apply."
    />
  );
}