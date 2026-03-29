"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock3, MessageSquareQuote, Sparkles, Target } from "lucide-react";
import Link from "next/link";

type Stage = {
  step: string;
  title: string;
  duration: string;
  summary: string;
  focus: string[];
};

const stages: Stage[] = [
  {
    step: "01",
    title: "Introductions",
    duration: "2-5 min",
    summary:
      "Open strong with a brief, confident introduction and pay attention to what the interviewer shares about themselves.",
    focus: [
      "Prepare a 30-60 second self-introduction covering education, experience, and interests.",
      "Smile and speak with a confident voice.",
      "Listen closely so you can ask thoughtful follow-up questions later.",
      "Mention shared interests when they naturally come up.",
    ],
  },
  {
    step: "02",
    title: "Problem Statement",
    duration: "5-10 min",
    summary:
      "Confirm the problem in your own words, ask clarifying questions, and quickly test a sample input together.",
    focus: [
      "Paraphrase the question back to confirm your understanding.",
      "Ask about input type, ordering, empties, and invalid inputs.",
      "Clarify the expected input size to narrow the likely approach.",
      "Walk through one example test case out loud.",
    ],
  },
  {
    step: "03",
    title: "Brainstorming DS&A",
    duration: "10-15 min",
    summary:
      "Think out loud, identify the pattern, and align on a reasonable algorithm before you start coding.",
    focus: [
      "Map the problem to a data structure or algorithm pattern.",
      "Talk through tradeoffs so the interviewer can guide you.",
      "Outline rough steps before you start implementation.",
      "Stay receptive to hints and adjust quickly if needed.",
    ],
  },
  {
    step: "04",
    title: "Implementation",
    duration: "15-20 min",
    summary:
      "Code cleanly, explain key decisions, and lean on helper functions when they make the solution clearer.",
    focus: [
      "Ask before importing a library or module.",
      "Explain why data structures like sets or queues are being used.",
      "Avoid duplicated logic and keep the code modular.",
      "Talk through your decisions as you write each major block.",
    ],
  },
  {
    step: "05",
    title: "Testing & Debugging",
    duration: "5-10 min",
    summary:
      "Use built-in tests, manual walkthroughs, or your own test cases depending on the environment.",
    focus: [
      "Try edge cases, intuitive inputs, and invalid inputs if relevant.",
      "Run or simulate the code from the outermost scope when needed.",
      "Use print statements or manual tracing to isolate issues.",
      "Stay calm and compare expected values with actual values.",
    ],
  },
  {
    step: "06",
    title: "Explanations & Follow-ups",
    duration: "5 min",
    summary:
      "Be ready to justify complexity, design choices, and possible improvements.",
    focus: [
      "Explain time and space complexity in the worst case.",
      "Be able to defend your choice of data structures or loops.",
      "Discuss whether the solution can be improved further.",
      "If a new question appears, restart from problem understanding.",
    ],
  },
  {
    step: "07",
    title: "Outro",
    duration: "2-5 min",
    summary:
      "Use the last few minutes to ask sharp questions and leave a strong final impression.",
    focus: [
      "Prepare a few questions about the team, role, and company.",
      "Demonstrate real interest by asking follow-up questions.",
      "Stay engaged until the end of the interview.",
      "Treat the interview as a two-way conversation.",
    ],
  },
];

function StageCard({ stage, index }: { stage: Stage; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group rounded-3xl border border-white/8 bg-white/[0.03] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-sm"
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold tracking-[0.2em] text-cyan-200/80 uppercase">
            <Sparkles size={12} />
            Stage {stage.step}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {stage.title}
          </h2>
        </div>
        <div className="flex items-center gap-1 rounded-2xl border border-white/8 bg-black/20 px-3 py-2 text-xs text-white/60">
          <Clock3 size={13} />
          {stage.duration}
        </div>
      </div>

      <p className="text-sm leading-7 text-white/60 max-w-2xl">{stage.summary}</p>

      <div className="mt-6 grid gap-3">
        {stage.focus.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/6 bg-black/15 px-4 py-3 text-sm text-white/72">
            <Target size={14} className="mt-1 flex-shrink-0 text-cyan-300/70" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </motion.article>
  );
}

export default function Resources() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#07070a] text-white">
      <div className="absolute inset-0 -z-10 opacity-60" style={{
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.16),transparent_28%)]" />

      <section className="mx-auto max-w-6xl px-6 pt-28 pb-16 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/8 bg-white/5 px-4 py-2 text-[11px] font-semibold tracking-[0.22em] text-white/60 uppercase">
            <MessageSquareQuote size={12} />
            Interview Resources
          </div>
          <h1 className="mt-6 text-[clamp(3rem,8vw,5.8rem)] font-black leading-[0.92] tracking-[-0.05em] uppercase" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Stages of an Interview
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/55">
            Most algorithmic interview rounds are 45 to 60 minutes. The process becomes much easier to control when you break it into stages and treat each stage as a separate objective.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12 }}
          className="mt-10 grid gap-4 rounded-3xl border border-white/8 bg-white/[0.03] p-6 md:grid-cols-3"
        >
          <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/35">Focus</p>
            <p className="mt-3 text-sm leading-7 text-white/70">Clarify the problem early, communicate your thinking clearly, and leave enough time to test and explain your solution.</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/35">Mindset</p>
            <p className="mt-3 text-sm leading-7 text-white/70">Treat the interview like a collaboration. The interviewer wants to see how you reason, not just whether you can memorize a pattern.</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-white/35">Outcome</p>
            <p className="mt-3 text-sm leading-7 text-white/70">A strong interview is usually the result of steady communication, good clarifying questions, and a calm debugging process.</p>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-5">
          {stages.map((stage, index) => (
            <StageCard key={stage.step} stage={stage} index={index} />
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
            <p className="text-sm font-semibold text-cyan-200/80">Use this as a checklist before every mock or live interview.</p>
            <p className="mt-1 text-sm text-white/55">The goal is not perfection, just a repeatable rhythm across each stage.</p>
          </div>
          <Link
            href="/interview"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Start practicing
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}