"use client";

import { CODING_PROGRESS_DATA, TOTAL_CODING_PROBLEMS, useCodingProgress } from "./codingProgress";

export default function CodingProgressPanel() {
  const { completedCount, leftCount, progressPercent } = useCodingProgress();

  const circleRadius = 54;
  const circleStroke = 8;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const circleOffset = circleCircumference - (progressPercent / 100) * circleCircumference;

  return (
    <aside className="h-full rounded-3xl border border-white/10 bg-white/3 p-5 md:p-6 shadow-lg shadow-black/20">
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
  );
}