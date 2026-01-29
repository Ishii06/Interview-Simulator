"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Github, Mail, Lock, ArrowRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-center items-center p-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full z-0" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-zinc-500 hover:text-zinc-100 transition-colors text-sm font-medium z-10">
        <ChevronLeft size={16} /> Home
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] z-10"
      >
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Cpu size={24} className="text-zinc-950" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-zinc-500 text-sm mt-2 font-medium">Log in to your AI interview dashboard</p>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-3.5 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-700" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Password</label>
                <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-tighter">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-3.5 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-700" 
                />
              </div>
            </div>

            <button className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-white/5 group">
              Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800/60"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em]"><span className="bg-[#121214] px-4 text-zinc-600 font-bold">Secure Access</span></div>
          </div>

          <button className="w-full bg-zinc-950 border border-zinc-800 hover:bg-zinc-900 text-zinc-300 font-bold py-3.5 rounded-2xl flex items-center justify-center gap-3 transition-all">
            <Github size={20} /> Github
          </button>
        </div>

        <p className="text-center mt-8 text-sm text-zinc-500 font-medium">
          New to Interview AI? 
          <Link href="/signup" className="ml-2 text-white hover:text-indigo-400 font-bold transition-colors">Create account</Link>
        </p>
      </motion.div>
    </div>
  );
}