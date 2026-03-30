"use client";

import Link from "next/link";
import { CODING_PROGRESS_DATA, TOTAL_CODING_PROBLEMS, getProblemId, useCodingProgress } from "./codingProgress";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getLeetCodeUrl = (name: string) => `https://leetcode.com/problems/${toSlug(name)}/`;

export default function CodingTracker() {
  const { completed, completedCount, leftCount, progressPercent, toggleProblem } = useCodingProgress();

  const circleRadius = 54;
  const circleStroke = 8;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const circleOffset = circleCircumference - (progressPercent / 100) * circleCircumference;

  return (
    <div className="h-full rounded-3xl border border-white/10 bg-white/3 p-5 md:p-6 shadow-lg shadow-black/20">
      <p className="text-xs uppercase tracking-[0.3em] text-indigo-300/80">Coding Practice</p>
      <h2 className="mt-2 text-xl font-bold">DSA Cheat Sheet</h2>
      <p className="mt-2 text-sm text-white/65">
        Ace the coding interview with 75 Questions. Mark each problem as done and track your progress on the right.
      </p>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-3">
          {CODING_PROGRESS_DATA.map((section) => (
            <section key={section.title} className="rounded-3xl border border-white/10 bg-white/3 p-3.5 md:p-4">
              <div className="mb-2.5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-white">{section.title}</h3>
                  <p className="mt-0.5 text-[11px] md:text-xs text-white/45">{section.problems.length} problems</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-wide text-white/60">
                  {section.problems.length}
                </span>
              </div>

              <div className="space-y-1.5">
                {section.problems.map((problem) => {
                  const problemId = getProblemId(section.title, problem.name);
                  const isDone = Boolean(completed[problemId]);

                  return (
                    <div
                      key={problem.name}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:border-indigo-400/30 hover:bg-white/5"
                    >
                      <label className="flex items-center gap-3 cursor-pointer min-w-0 flex-1">
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => toggleProblem(problemId)}
                          className="h-4 w-4 shrink-0 accent-emerald-500"
                        />
                        <span className={`min-w-0 truncate text-sm leading-snug ${isDone ? "text-white/45 line-through" : "text-white"}`}>
                          {problem.name}
                        </span>
                      </label>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            problem.difficulty === "Easy"
                              ? "bg-emerald-500/15 text-emerald-300"
                              : problem.difficulty === "Medium"
                              ? "bg-amber-500/15 text-amber-300"
                              : "bg-rose-500/15 text-rose-300"
                          }`}
                        >
                          {problem.difficulty}
                        </span>

                        <Link
                          href={getLeetCodeUrl(problem.name)}
                          target="_blank"
                          className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1.5 text-[11px] md:text-xs font-medium text-indigo-300 transition hover:border-indigo-400/50 hover:bg-indigo-500/20"
                        >
                          Solve →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <aside className="lg:sticky lg:top-6 h-fit rounded-3xl border border-white/10 bg-white/3 p-5 md:p-6 shadow-lg shadow-black/20">
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-300/80">Progress</p>
          <h3 className="mt-2 text-xl font-bold">Your Checklist</h3>

          <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-center">
              <div className="relative h-40 w-40">
                <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r={circleRadius}
                    stroke="rgba(255,255,255,0.10)"
                    strokeWidth={circleStroke}
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={circleRadius}
                    stroke="url(#progressGradient)"
                    strokeWidth={circleStroke}
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={circleOffset}
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <p className="text-3xl font-black text-white">{completedCount}</p>
                  <p className="text-sm text-white/45">/{TOTAL_CODING_PROBLEMS}</p>
                  <p className="mt-1 text-sm text-white/55">Solved</p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-3 text-center">
                <p className="text-white/45">Completed</p>
                <p className="mt-1 text-2xl font-bold text-emerald-300">{completedCount}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-3 text-center">
                <p className="text-white/45">Left</p>
                <p className="mt-1 text-2xl font-bold text-rose-300">{leftCount}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-white/45">Sections</p>
              <p className="mt-1 text-2xl font-bold text-white">{CODING_PROGRESS_DATA.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-white/45">Problems</p>
              <p className="mt-1 text-2xl font-bold text-white">{TOTAL_CODING_PROBLEMS}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}