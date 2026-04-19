import type { Metadata } from "next";
import CookieSettingsPanel from "../components/ui/CookieSettingsPanel";

export const metadata: Metadata = {
  title: "Cookie Settings | Interview AI",
  description: "Manage cookie preferences for Interview AI.",
};

export default function CookieSettingsPage() {
  return <CookieSettingsPanel />;
}