"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Mic, BarChart3, ChevronRight, Zap, ArrowUpRight, Layers } from 'lucide-react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import { useAuthStore } from './store/authStore';

const COMPANIES = ["Google", "Meta", "Amazon", "Netflix", "OpenAI", "Microsoft", "Stripe", "Airbnb"];

/* ─────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────── */
function MagneticButton({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18 });
  const sy = useSpring(y, { stiffness: 200, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.28);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.28);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  const inner = (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
    >
      {children}
    </motion.div>
  );

  return href ? <Link href={href}>{inner}</Link> : inner;
}







/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
function Hero({ user }: { user: any }) {
  const primaryCtaHref = user ? '/interview' : '/login';

  const cycleWords = ['Narrative.', 'Delivery.', 'Presence.'];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % cycleWords.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="mt-10 relative flex flex-col items-center justify-center px-6 pt-24 pb-17 overflow-hidden">
      {/* Dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />
      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 20%, #07070a 80%)',
        }}
      />
      {/* Top center glow */}
      <div
        className="pointer-events-none absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] z-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.5) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(3.2rem,9.5vw,7.5rem)] font-black tracking-[-0.04em] leading-[0.9] text-white uppercase mb-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Own Your
        </motion.h1>

        {/* Cycling outlined word */}
        <div
          className="h-[clamp(3.2rem,9.5vw,7.5rem)] overflow-hidden mb-10"
          style={{ lineHeight: '0.9' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ y: '105%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-105%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3.2rem,9.5vw,7.5rem)] font-black tracking-[-0.04em] leading-[0.9] uppercase"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                WebkitTextStroke: '1.5px rgba(255,255,255,0.45)',
                color: 'transparent',
              }}
            >
              {cycleWords[idx]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.42 }}
          className="text-white/35 text-[16px] max-w-md mx-auto leading-[1.75] mb-12 font-light"
        >
          Practice behavioral and technical interviews with an AI that matches real FAANG intensity — so the actual interview feels like a rehearsal.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.52 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <MagneticButton
            href={primaryCtaHref}
            className="group relative cursor-pointer flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-black text-[14px] overflow-hidden select-none"
          >
            Start Free Session
            <ChevronRight size={15} />
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-black/6 to-transparent skew-x-[-15deg]" />
          </MagneticButton>

          <MagneticButton
            href="/practice"
            className="cursor-pointer flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/10 bg-white/3 hover:bg-white/7 hover:border-white/18 text-white/55 hover:text-white font-bold text-[14px] transition-all duration-200 select-none"
          >
            Practice Tests
          </MagneticButton>
        </motion.div>
      </div>

    </section>
  );
}

/* ─────────────────────────────────────────
   MARQUEE
───────────────────────────────────────── */
function Marquee() {
  return (
    <div className="relative overflow-hidden py-0">
      {/* Wide smooth fade masks */}
      <div
        className="absolute inset-y-0 left-0 w-48 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #07070a 30%, transparent)' }}
      />
      <div
        className="absolute inset-y-0 right-0 w-48 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #07070a 30%, transparent)' }}
      />

      <motion.div
        className="flex whitespace-nowrap will-change-transform"
        animate={{ x: [0, -1200] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      >
        {[...COMPANIES, ...COMPANIES, ...COMPANIES].map((co, i) => (
          <span key={i} className="inline-flex items-center gap-20 px-10">
            <span
              className="text-3xl md:text-4xl font-bold tracking-tighter uppercase text-white/20"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {co}
            </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   LIVE WAVEFORM — animated bars
───────────────────────────────────────── */
function Waveform() {
  return (
    <div className="flex items-end gap-[3px] h-10">
      {[0.4, 0.7, 1, 0.6, 0.9, 0.5, 0.8, 0.3, 0.95, 0.6, 0.75, 0.4, 1, 0.55].map((h, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-emerald-400"
          style={{ height: `${h * 100}%`, opacity: 0.5 + h * 0.5 }}
          animate={{ scaleY: [1, 0.3 + Math.random() * 0.7, 1] }}
          transition={{
            duration: 0.8 + Math.random() * 0.6,
            repeat: Infinity,
            delay: i * 0.07,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   FEATURES — completely new card layout
───────────────────────────────────────── */
function Features() {
  return (
    <section className="px-6 pb-32 max-w-6xl mx-auto">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="flex items-center gap-4 mb-10"
      >
        <div className="h-px w-8 bg-white/20" />
        <span className="text-[11px] tracking-[0.25em] uppercase text-white/25 font-semibold">
          How it works
        </span>
      </motion.div>

      {/* ── ROW 1: Giant hero card (full width, landscape) ── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl border border-white/[0.06] mb-3"
        style={{ background: 'linear-gradient(135deg, #0e0e13 0%, #111118 100%)' }}
      >
        {/* Huge BG number watermark */}
        <div
          className="absolute right-[-20px] top-1/2 -translate-y-1/2 text-[220px] font-black leading-none select-none pointer-events-none"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            color: 'transparent',
            WebkitTextStroke: '1px rgba(255,255,255,0.04)',
          }}
        >
          01
        </div>

        <div className="relative flex flex-col md:flex-row items-start md:items-center gap-10 p-10 md:p-14">
          {/* Left: content */}
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-400/80 tracking-widest uppercase font-semibold">Live Voice</span>
            </div>
            <h2
              className="text-[clamp(1.8rem,4vw,3rem)] font-black tracking-[-0.03em] leading-[1.05] text-white mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Real interview pressure.<br />
              <span className="text-white/30">No safety net.</span>
            </h2>
            <p className="text-white/35 text-[15px] leading-[1.7] max-w-md font-light">
              The AI speaks to you, reacts, pushes back. Faster-Whisper transcribes in real time — you respond out loud, exactly like the real thing.
            </p>
          </div>

          {/* Right: live waveform mock UI */}
          <div className="flex-shrink-0 w-full md:w-72 rounded-2xl border border-white/[0.07] bg-black/30 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] text-white/30 uppercase tracking-widest">Recording</span>
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400/70">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <Waveform />
            <div className="mt-5 pt-4 border-t border-white/[0.05]">
              <p className="text-[12px] text-white/20 leading-relaxed italic">
                "Tell me about a time you resolved a conflict with a teammate..."
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── ROW 2: Two tall portrait cards + one wide card ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">

        {/* Card A — feedback breakdown, no fake numbers */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -6 }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0d0d11] flex flex-col min-h-[320px]"
        >
          <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500/60 via-indigo-400/30 to-transparent" />

          <div className="flex flex-col h-full p-7">
            <div className="flex-1 flex flex-col justify-center gap-3">
              {[
                { label: 'Technical depth', w: '75%', color: '#818cf8' },
                { label: 'Communication', w: '60%', color: '#818cf8' },
                { label: 'Structure', w: '85%', color: '#818cf8' },
              ].map((item, i) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-[12px] text-white/35">{item.label}</span>
                  </div>
                  <div className="h-[3px] w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: item.color, opacity: 0.5 }}
                      initial={{ width: 0 }}
                      whileInView={{ width: item.w }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-white/[0.05]">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={13} className="text-indigo-400/60" />
                <span className="text-[11px] tracking-widest uppercase text-white/25">Analysis</span>
              </div>
              <h3
                className="text-[16px] font-bold text-white leading-snug"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Feedback that stings (in a good way)
              </h3>
            </div>
          </div>
        </motion.div>

        {/* Card B — what gets evaluated, clean list */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -6 }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0d0d11] flex flex-col min-h-[320px]"
        >
          <div className="h-[2px] w-full bg-gradient-to-r from-amber-500/60 via-amber-400/30 to-transparent" />

          <div className="flex flex-col h-full p-7">
            <div className="flex-1 flex flex-col justify-center gap-3">
              {['Clarity of thought', 'Filler word count', 'Answer structure', 'Pacing & confidence'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + i * 0.08, duration: 0.4 }}
                  className="flex items-center gap-3 text-[13px] text-white/35"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400/40 flex-shrink-0" />
                  {item}
                </motion.div>
              ))}
            </div>

            <div className="mt-auto pt-6 border-t border-white/[0.05]">
              <div className="flex items-center gap-2 mb-2">
                <Layers size={13} className="text-amber-400/60" />
                <span className="text-[11px] tracking-widest uppercase text-white/25">Evaluated</span>
              </div>
              <h3
                className="text-[16px] font-bold text-white leading-snug"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Every answer, fully dissected
              </h3>
            </div>
          </div>
        </motion.div>

        {/* Card C — wide landscape, horizontal layout, gemini badge */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -6 }}
          className="relative overflow-hidden rounded-3xl border border-white/[0.06] flex flex-col min-h-[320px]"
          style={{ background: 'linear-gradient(160deg, #1a1033 0%, #0d0d11 60%)' }}
        >
          <div className="h-[2px] w-full bg-gradient-to-r from-violet-500/60 via-violet-400/30 to-transparent" />

          {/* Decorative circles */}
          <div className="absolute top-[-40px] right-[-40px] w-40 h-40 rounded-full border border-violet-500/10" />
          <div className="absolute top-[-20px] right-[-20px] w-24 h-24 rounded-full border border-violet-500/15" />

          <div className="relative flex flex-col h-full p-7">
            {/* Gemini pill */}
            <div className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 mb-6">
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 flex-shrink-0" />
              <span className="text-[11px] text-violet-300/80 font-semibold">Powered by Gemini</span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="space-y-2">
                {['Your role & seniority', 'Target companies', 'Past weak spots'].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3 text-[13px] text-white/40"
                  >
                    <div className="w-1 h-1 rounded-full bg-violet-400/60 flex-shrink-0" />
                    {item}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-5 border-t border-white/[0.05]">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={13} className="text-violet-400/60" />
                <span className="text-[11px] tracking-widest uppercase text-white/25">Smart</span>
              </div>
              <h3
                className="text-[16px] font-bold text-white leading-snug"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Questions that know you
              </h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── ROW 3: CTA strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-5 px-8 py-6 rounded-3xl border border-white/[0.06] bg-white/[0.015]"
      >
        <p className="text-white/30 text-[14px] max-w-sm leading-relaxed">
          Ready to stop fumbling in real interviews?<br />
          <span className="text-white/50">First session free — no card needed.</span>
        </p>
        <Link
          href="/login"
          className="flex-shrink-0 flex items-center gap-2 px-7 py-3.5 bg-white text-black rounded-2xl font-black text-[13px] hover:bg-white/90 transition-all"
        >
          Start now <ArrowUpRight size={13} />
        </Link>
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────
   ROOT
───────────────────────────────────────── */
export default function LandingPage() {
  const { user, initialized, fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    if (!initialized) fetchCurrentUser();
  }, [initialized, fetchCurrentUser]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;900&display=swap');
      `}</style>

      <div
        className="min-h-screen bg-[#07070a] text-white overflow-x-hidden"
        style={{ fontFamily: "'Space Grotesk', 'DM Sans', sans-serif" }}
      >
        <Hero user={user} />
        <Marquee />
        <div className="mt-24">
          <Features />
        </div>
      </div>
    </>
  );
}