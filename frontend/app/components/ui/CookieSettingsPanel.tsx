"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, ShieldCheck, SlidersHorizontal } from "lucide-react";

type CookiePreferences = {
  essential: boolean;
  analytics: boolean;
  personalization: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "interview-ai-cookie-preferences";

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: false,
  personalization: false,
  marketing: false,
};

function PreferenceRow({
  title,
  description,
  checked,
  disabled,
  onToggle,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className={`w-full rounded-2xl border p-4 text-left transition-all ${
        checked
          ? "border-cyan-400/30 bg-cyan-400/10"
          : "border-white/8 bg-black/15 hover:border-white/15 hover:bg-white/[0.04]"
      } ${disabled ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
    >
      <div className="flex items-start gap-4">
        <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${checked ? "bg-cyan-400/20" : "bg-white/5"}`}>
          <BadgeCheck size={16} className={checked ? "text-cyan-300" : "text-white/25"} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-base font-semibold text-white">{title}</h3>
            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${checked ? "bg-cyan-400/15 text-cyan-200" : "bg-white/5 text-white/35"}`}>
              {checked ? "On" : "Off"}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-white/55">{description}</p>
        </div>
      </div>
    </button>
  );
}

export default function CookieSettingsPanel() {
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CookiePreferences;
        setPreferences({ ...defaultPreferences, ...parsed, essential: true });
        setSaved(true);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const updatePreference = (key: keyof CookiePreferences) => {
    if (key === "essential") {
      return;
    }

    setPreferences((current) => {
      const next = { ...current, [key]: !current[key] };
      setSaved(false);
      return next;
    });
  };

  const savePreferences = () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    setSaved(true);
  };

  const resetPreferences = () => {
    const next = { ...defaultPreferences };
    setPreferences(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSaved(true);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#07070a] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60" style={{
        backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.14),transparent_28%)]" />

      <section className="mx-auto max-w-6xl px-6 pt-28 pb-12 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-4 py-2 text-[11px] font-semibold tracking-[0.22em] text-white/60 uppercase">
            <SlidersHorizontal size={12} />
            Cookie Settings
          </div>
          <h1 className="mt-6 text-[clamp(4rem,4vw,3rem)] font-black leading-[1.2] tracking-[-0.001em] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Control What Gets Stored
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/55">
            Essential cookies keep the product working. Optional cookies help us measure usage, remember preferences, and improve the experience. Your selections are stored locally on this device.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12 }}
          className="mt-10 grid gap-4 rounded-3xl border border-white/8 bg-white/[0.03] p-6 md:grid-cols-3"
        >
          <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/35">Status</p>
            <p className="mt-3 text-sm leading-7 text-white/70">{saved ? "Your preferences are saved on this device." : "You have unsaved changes."}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/35">Essential Cookies</p>
            <p className="mt-3 text-sm leading-7 text-white/70">Always on. They are required for authentication, session handling, and core app behavior.</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/35">Privacy Note</p>
            <p className="mt-3 text-sm leading-7 text-white/70">You can change these choices any time. Optional cookies are not required to use the basic product flow.</p>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55 }}
            className="rounded-3xl border border-white/8 bg-white/[0.03] p-6 md:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10">
                <ShieldCheck size={17} className="text-cyan-300/85" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Cookie Preferences
                </h2>
                <p className="mt-1 text-sm text-white/55">Toggle the optional categories below.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <PreferenceRow
                title="Essential"
                description="Required for login, security, and core application behavior. These cannot be disabled."
                checked={preferences.essential}
                disabled
                onToggle={() => undefined}
              />
              <PreferenceRow
                title="Analytics"
                description="Helps us understand what users click and which flows need improvement."
                checked={preferences.analytics}
                onToggle={() => updatePreference("analytics")}
              />
              <PreferenceRow
                title="Personalization"
                description="Remembers interface preferences and helps tailor practice experiences to your usage."
                checked={preferences.personalization}
                onToggle={() => updatePreference("personalization")}
              />
              <PreferenceRow
                title="Marketing"
                description="Used for promotional measurement and campaign attribution when enabled."
                checked={preferences.marketing}
                onToggle={() => updatePreference("marketing")}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={savePreferences}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Save preferences
                <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={resetPreferences}
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                Reset to default
              </button>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="rounded-3xl border border-white/8 bg-[linear-gradient(180deg,rgba(34,211,238,0.08),rgba(255,255,255,0.03))] p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              What each category does
            </h2>
            <div className="mt-6 grid gap-4 text-sm leading-7 text-white/62">
              <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
                <p className="font-semibold text-white">Analytics</p>
                <p className="mt-2">Helps us track navigation, feature usage, and performance bottlenecks.</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
                <p className="font-semibold text-white">Personalization</p>
                <p className="mt-2">Keeps your preferences available on this device so the app feels consistent.</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-black/15 p-4">
                <p className="font-semibold text-white">Marketing</p>
                <p className="mt-2">Used when we need to understand campaign performance or outreach effectiveness.</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-400/12 bg-cyan-400/6 p-4 text-sm leading-7 text-white/62">
              Changes are saved in your browser storage. If you clear site data, you may need to choose again.
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/privacy-policy"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm font-semibold text-white/72 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              >
                Read privacy policy
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Back to home
              </Link>
            </div>
          </motion.aside>
        </div>
      </section>
    </main>
  );
}