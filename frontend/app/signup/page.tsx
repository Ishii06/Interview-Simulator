"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, User, Mail, Lock, Sparkles, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-center items-center p-6 relative">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full z-0" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-zinc-100 transition-colors text-sm font-medium z-10">
        <ChevronLeft size={16} /> Home
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[420px] z-10"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-6">
            <Sparkles size={12} /> Start for free
          </div>
          <h1 className="text-3xl font-black tracking-tight">Create account</h1>
          <p className="text-zinc-500 text-sm mt-2 font-medium">Join 10,000+ developers practicing daily</p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-3.5 text-zinc-600 group-focus-within:text-emerald-400 transition-colors" size={18} />
                <input type="text" placeholder="Alex Rivera" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-700" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-3.5 text-zinc-600 group-focus-within:text-emerald-400 transition-colors" size={18} />
                <input type="email" placeholder="alex@dev.com" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-700" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-3.5 text-zinc-600 group-focus-within:text-emerald-400 transition-colors" size={18} />
                <input type="password" placeholder="••••••••" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-700" />
              </div>
            </div>

            <button className="w-full bg-white hover:bg-zinc-100 text-zinc-950 font-black py-4 rounded-2xl transition-all shadow-xl shadow-white/5 mt-4">
              Get Started Now
            </button>
          </form>

          <p className="text-[10px] text-center text-zinc-600 mt-6 leading-relaxed">
            By signing up, you agree to our <span className="text-zinc-400 underline">Terms of Service</span> and <span className="text-zinc-400 underline">Privacy Policy</span>.
          </p>
        </div>

        <p className="text-center mt-8 text-sm text-zinc-500 font-medium">
          Already have an account? 
          <Link href="/login" className="ml-2 text-white hover:text-emerald-400 font-bold transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}