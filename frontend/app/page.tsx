"use client";
import React, { useEffect, useRef } from 'react';
import { Mic, Cpu, BarChart3, ChevronRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';

const COMPANIES = ["Google", "Meta", "Amazon", "Netflix", "OpenAI", "Microsoft", "Stripe", "Airbnb"];

export default function LandingPage() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return;
      gsap.to(glowRef.current, {
        x: e.clientX - 250,
        y: e.clientY - 250,
        duration: 1.5, // Slower duration = smoother "fluid" feel
        ease: "power2.out",
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] } // Custom cubic-bezier for "Apple-like" feel
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-indigo-500/30 overflow-hidden relative font-sans">
      {/* GSAP Glow Follower - Switched to a more subtle Zinc/Indigo mix */}
      <div 
        ref={glowRef}
        className="pointer-events-none fixed top-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full z-0"
      />

      {/* Navigation */}


      <main className="mt-16 max-w-7xl mx-auto px-8 pt-20 pb-32 relative z-10">
        <motion.div initial="initial" animate="animate" transition={{ staggerChildren: 0.15 }} className="text-center space-y-8">
          
          <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-bold tracking-tight leading-[1.05] text-zinc-100">
            Master your narrative <br />
            <span className="text-zinc-500 italic font-medium">with precision.</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Practice behavioral and technical loops with an AI that mimics the world's most rigorous interviewers.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/login" className="group px-8 py-3.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all">
              Start Free Session <ChevronRight size={18} />
            </Link>
            <button className="px-8 py-3.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl font-bold text-base transition-all text-zinc-300">
              Request Demo
            </button>
          </motion.div>
        </motion.div>

        {/* --- INFINITE SCROLL SECTION (Fixed Fade-In) --- */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.6, duration: 1 }}
          className="w-full mt-12 lg:mt-28 overflow-hidden relative pointer-events-none"
        >
          {/* Side masks for seamless look */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#09090b] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#09090b] to-transparent z-10" />
          
          <motion.div 
            className="flex gap-20 whitespace-nowrap opacity-20"
            animate={{ x: [0, -1200] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          >
            {[...COMPANIES, ...COMPANIES].map((company, i) => (
              <span key={i} className="text-3xl md:text-4xl font-bold tracking-tighter uppercase">
                {company}
              </span>
            ))}
          </motion.div>
        </motion.div>

 {/* Bento Grid — About Section */}
<motion.div 
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
  className="mt-40 grid grid-cols-1 md:grid-cols-12 gap-5"
>
  {/* Real Interview Experience */}
  <BentoCard
    className="md:col-span-8 border-zinc-800 bg-zinc-900/30"
    icon={<Mic className="text-indigo-400" size={24} />}
    title="Real Interview, Real Voice, Real Pressure"
    desc="Experience interviews exactly like real life. The AI interviewer speaks to you, listens carefully, and reacts intelligently — simulating real interview pressure so you’re never caught off-guard."
  />

  {/* Smart AI Evaluation */}
  <motion.div 
    whileHover={{ y: -5 }}
    className="md:col-span-4 p-8 rounded-[2rem] bg-zinc-100 text-zinc-950 flex flex-col justify-end min-h-[320px] shadow-xl"
  >
    <Sparkles className="text-zinc-900 mb-6 opacity-20" size={100} />
    <h3 className="text-2xl font-bold mb-2 tracking-tight">
      Smart AI That Understands You
    </h3>
    <p className="text-zinc-700 font-medium">
      Powered by Google Gemini, questions adapt to your role, skills, experience level, and difficulty — every interview is personalized.
    </p>
  </motion.div>

  {/* Voice-first Practice */}
  <BentoCard
    className="md:col-span-6 border-zinc-800 bg-zinc-900/30"
    icon={<Zap className="text-emerald-500" size={24} />}
    title="Speak, Don’t Type — Voice-First Practice"
    desc="Answer using your own voice just like a real interview. Faster-Whisper converts speech to text while analyzing clarity, confidence, and filler words."
  />

  {/* Feedback & Progress */}
  <BentoCard
    className="md:col-span-6 border-zinc-800 bg-zinc-900/30"
    icon={<BarChart3 className="text-indigo-400" size={24} />}
    title="Actionable Feedback That Actually Helps"
    desc="Receive instant technical scores, communication insights, and clear improvement tips after every answer. Track your progress and improve with every session."
  />
</motion.div>

      </main>
    </div>
  );
}

function BentoCard({ className, icon, title, desc }: { className?: string, icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.15)" }}
      className={`${className} p-8 rounded-[2rem] border backdrop-blur-sm transition-all duration-300 group`}
    >
      <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-zinc-100 mb-2 tracking-tight">{title}</h3>
      <p className="text-zinc-400 leading-relaxed font-light">{desc}</p>
    </motion.div>
  );
}