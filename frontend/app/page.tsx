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
import { Check, Sparkles, ShieldCheck, Trophy } from 'lucide-react';

function Pricing() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: "0",
      desc: "Quick sprint prep.",
      features: ["3 Interviews", "PDF Feedback", "Basic Bank"],
      cta: "Start",
      highlight: false,
    },
    {
      name: "Pro",
      price: annual ? "499" : "699",
      desc: "The FAANG crusher.",
      features: ["Unlimited", "Voice AI", "Gemini 1.5 Pro", "Company Modes"],
      cta: "Go Pro",
      highlight: true,
    },
    {
      name: "Ultra",
      price: annual ? "899" : "1199",
      desc: "Lead & Exec roles.",
      features: ["Analytics", "Roadmap", "Beta Access", "Priority"],
      cta: "Unlock",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="px-6 py-16 max-w-6xl mx-auto relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-cyan-500/5 blur-[120px] rounded-full -z-10" />

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="max-w-xl text-left">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex items-center gap-2 text-cyan-400 text-[10px] font-black tracking-[0.3em] uppercase mb-3"
          >
            <Trophy size={12} /> Pricing Plans
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">Level Up?</span>
          </h2>
        </div>
        
        {/* Toggle with Savings Badge */}
        <div className="flex flex-col items-end gap-3">
          {annual && (
            <motion.span 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] font-black text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20 tracking-widest uppercase"
            >
              Save up to 30%
            </motion.span>
          )}
          <div className="inline-flex items-center p-1 bg-zinc-950 border border-white/5 rounded-xl shadow-2xl overflow-hidden">
            <button 
              onClick={() => setAnnual(false)}
              className={`relative px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-500 ${!annual ? "text-cyan-400" : "text-zinc-500"}`}
            >
              Monthly
              {!annual && <motion.div layoutId="compactTab" className="absolute inset-0 bg-cyan-400 rounded-lg -z-10" />}
            </button>
            <button 
              onClick={() => setAnnual(true)}
              className={`relative px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-500 ${annual ? "text-cyan-400" : "text-zinc-500"}`}
            >
              Yearly
              {annual && <motion.div layoutId="compactTab" className="absolute inset-0 bg-cyan-400 rounded-lg -z-10" />}
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col ${
              plan.highlight 
                ? "bg-zinc-900/50 border-cyan-500/40 shadow-[0_20px_50px_rgba(34,211,238,0.1)] ring-1 ring-cyan-400/20" 
                : "bg-zinc-950/40 border-white/5 backdrop-blur-xl hover:border-white/10"
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className={`text-xl font-black tracking-tight mb-1 ${plan.highlight ? "text-cyan-400" : "text-white"}`}>
                  {plan.name}
                </h3>
                <p className="text-xs font-medium text-zinc-500">{plan.desc}</p>
              </div>
              {plan.highlight && (
                <div className="bg-cyan-500/10 text-cyan-400 text-[8px] font-black px-2 py-1 rounded-md border border-cyan-500/20 uppercase tracking-tighter">
                  Popular
                </div>
              )}
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tighter text-white">₹{plan.price}</span>
                <span className="text-zinc-600 font-bold text-[10px] uppercase">/mo</span>
              </div>
              {/* Billed Annually Information */}
              <AnimatePresence>
                {annual && plan.price !== "0" && (
                  <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.15em] mt-2 italic"
                  >
                    * Billed annually (₹{parseInt(plan.price) * 12}/yr)
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-8 flex-grow">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${plan.highlight ? "bg-cyan-500/20" : "bg-white/5"}`}>
                    <ShieldCheck size={12} className={plan.highlight ? "text-cyan-300" : "text-zinc-600"} />
                  </div>
                  <span className={`text-[11px] font-bold ${plan.highlight ? "text-zinc-200" : "text-zinc-500"}`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button className={`w-full py-4 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase transition-all relative overflow-hidden ${
              plan.highlight 
                ? "bg-white text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]" 
                : "bg-zinc-900 text-white border border-white/5 hover:border-cyan-500/30"
            }`}>
              <span className="relative z-10 flex items-center justify-center gap-2">
                {plan.cta} <Zap size={12} className={plan.highlight ? "fill-black" : "text-cyan-400"} />
              </span>
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
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
      <div className="mt-24">
  <Pricing />
</div>
      
    </section>
  );
}

import { Mail, ArrowRight, Github, Linkedin, Twitter, Globe } from 'lucide-react';

function Footer() {
  const currentYear = new Date().getFullYear();

  const handleEmailClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const email = "tejas@solesphere.ai";
    window.location.href = `mailto:${email}?subject=Inquiry from Solesphere`;
  };

  return (
    <footer className="relative overflow-hidden border-t border-cyan-500/10 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.05),transparent_45%),linear-gradient(180deg,#050507_0%,#0a0a10_35%,#07070a_100%)] text-white pt-24 pb-12">
      <div className="pointer-events-none absolute left-1/2 h-64 w-[80%] -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-[-20%] h-60 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="mb-12 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-6 py-7 md:px-8 md:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-[10px] font-black tracking-[0.28em] uppercase text-cyan-300/75 mb-2">Interview Smarter</p>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Build interview confidence daily.
            </h3>
          </div>
          <Link
            href="/login"
            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white text-black text-[12px] font-black tracking-[0.14em] uppercase hover:bg-cyan-200 transition-all"
          >
            Get Started
            <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-5">
              <h3 className="text-2xl font-medium tracking-tighter flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.8)]" />
                Solesphere<span className="text-zinc-500 italic">/AI</span>
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                High-fidelity interview practice for ambitious engineers. Train with voice, feedback, and role-specific intensity that mirrors real hiring loops.
              </p>
            </div>

            <button
              onClick={handleEmailClick}
              className="group w-full max-w-md rounded-2xl border border-zinc-700/80 bg-zinc-900/50 p-4 transition-all duration-500 hover:border-cyan-400/50 hover:bg-zinc-900"
            >
              <span className="flex items-center gap-4">
                <span className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center transition-colors group-hover:bg-cyan-400">
                  <Mail size={18} className="text-zinc-300 group-hover:text-black" />
                </span>
                <span className="text-left">
                  <span className="block text-xs font-bold text-white">Send a Message</span>
                  <span className="block text-[11px] text-zinc-500">tejas@solesphere.ai</span>
                </span>
                <ArrowRight size={16} className="ml-auto text-zinc-600 transition-all group-hover:text-cyan-300 group-hover:translate-x-1" />
              </span>
            </button>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
            <div className="space-y-5">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Platform</h4>
              <ul className="flex flex-col gap-3">
                {[
                  { label: 'Simulator', href: '/interview/simulator' },
                  { label: 'Practice', href: '/practice' },
                  { label: 'Pricing', href: '#pricing' },
                  { label: 'Resources', href: '/resources' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group">
                      {item.label}
                      <ArrowUpRight size={12} className="opacity-0 transition-all group-hover:opacity-100 group-hover:-translate-y-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Legal</h4>
              <ul className="flex flex-col gap-3">
                {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm text-zinc-400 hover:text-white transition-colors">{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5 col-span-2 md:col-span-1">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">Social</h4>
              <div className="flex gap-3">
                {[Github, Linkedin, Twitter].map((Icon, idx) => (
                  <Link
                    key={idx}
                    href="#"
                    className="group p-3 rounded-xl border border-zinc-800 bg-zinc-900/70 hover:border-cyan-500/35 hover:bg-zinc-800 transition-all"
                  >
                    <Icon size={16} className="text-zinc-400 group-hover:text-cyan-300 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-zinc-900/90 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 text-[11px] font-medium text-zinc-600">
            <span>© {currentYear} SOLESPHERE</span>
            <span className="w-1 h-1 rounded-full bg-zinc-800" />
            <span>HQ / NEW DELHI, IN</span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5">
            <Globe size={12} className="text-zinc-500" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.18em]">Global English</span>
          </div>
        </div>
      </div>
    </footer>
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
      <Footer />
    </>
  );
}

