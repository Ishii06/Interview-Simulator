"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

type LegalSection = {
  title: string;
  body: string[];
  bullets?: string[];
};

type LegalPageProps = {
  badge: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  ctaLabel: string;
  ctaHref: string;
  ctaNote: string;
};

export default function LegalPage({ badge, title, intro, updated, sections, ctaLabel, ctaHref, ctaNote }: LegalPageProps) {
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
            <Sparkles size={12} />
            {badge}
          </div>
          <h1 className="mt-6 text-[clamp(4rem,4vw,3rem)] font-black leading-[1.2] tracking-[-0.001em] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/55">
            {intro}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12 }}
          className="mt-10 grid gap-4 rounded-3xl border border-white/8 bg-white/[0.03] p-6 md:grid-cols-3"
        >
          <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/35">Updated</p>
            <p className="mt-3 text-sm leading-7 text-white/70">{updated}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/35">Scope</p>
            <p className="mt-3 text-sm leading-7 text-white/70">Covers account data, interview activity, and product usage across the platform.</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/35">Support</p>
            <p className="mt-3 text-sm leading-7 text-white/70">Questions can be sent to tejasbhalla07@gmail.com or through the contact button below.</p>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-5">
          {sections.map((section, index) => (
            <motion.article
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-3xl border border-white/8 bg-white/[0.03] p-6 md:p-8 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-sm"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10">
                  <ShieldCheck size={16} className="text-cyan-300/85" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {section.title}
                  </h2>
                  <div className="mt-5 grid gap-4 text-sm leading-8 text-white/62">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>

              {section.bullets && section.bullets.length > 0 && (
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {section.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-start gap-3 rounded-2xl border border-white/6 bg-black/15 px-4 py-3 text-sm text-white/72">
                      <CheckCircle2 size={14} className="mt-1 flex-shrink-0 text-cyan-300/75" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mt-6 flex flex-col gap-4 rounded-3xl border border-cyan-400/12 bg-cyan-400/6 p-6 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-cyan-200/80">{ctaNote}</p>
            <p className="mt-1 text-sm text-white/55">These pages are meant to be readable first and formal enough to support the product experience.</p>
          </div>
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            {ctaLabel}
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}