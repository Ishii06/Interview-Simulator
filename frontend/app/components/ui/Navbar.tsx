"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Menu, X, User, LogOut, Settings, LayoutDashboard, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Mock State: Switch this to true to see the logged-in UI
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-[100] px-6 py-5 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto">
        <div className={`
          relative flex justify-between items-center px-6 py-3 rounded-2xl transition-all duration-500
          ${isScrolled 
            ? "bg-zinc-950/60 backdrop-blur-xl border-zinc-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
            : "bg-zinc-950/20 backdrop-blur-md border-transparent"}
          border
        `}>
          
          {/* Animated "Glow Rail" - subtle top border highlight */}
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50" />

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative z-10">
            <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <Cpu size={22} className="text-zinc-950" />
            </div>
            <span className="text-zinc-100 font-bold tracking-tighter text-xl">
              INTERVIEW<span className="text-indigo-500">.AI</span>
            </span>
          </Link>

          {/* Desktop Links */}
          {!isAuthPage && (
            <div className="hidden md:flex items-center gap-10">
              <div className="flex items-center gap-8 mr-4">
                {['Features', 'Intelligence', 'Pricing'].map((item) => (
                  <Link 
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-500 transition-all group-hover:w-full" />
                  </Link>
                ))}
              </div>

              <div className="h-6 w-px bg-zinc-800/50" />

              {isLoggedIn ? (
                /* USER PROFILE SECTION */
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-3 p-1 pr-3 rounded-full bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold">
                      JD
                    </div>
                    <span className="text-sm font-medium text-zinc-200">John Doe</span>
                    <ChevronDown size={14} className={`text-zinc-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 bg-zinc-950 border border-zinc-800 rounded-2xl p-2 shadow-2xl backdrop-blur-xl"
                      >
                        <ProfileLink icon={<LayoutDashboard size={16}/>} label="Dashboard" href="/dashboard" />
                        <ProfileLink icon={<Settings size={16}/>} label="Settings" href="/settings" />
                        <div className="h-px bg-zinc-800 my-2 mx-2" />
                        <button 
                          onClick={() => setIsLoggedIn(false)}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* AUTH LINKS */
                <Link 
                  href="/login" 
                  className="relative group px-6 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 rounded-xl text-sm font-bold transition-all overflow-hidden"
                >
                  <span className="relative z-10">Get Started</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          {!isAuthPage && (
            <button className="md:hidden text-zinc-100 p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

function ProfileLink({ icon, label, href }: { icon: React.ReactNode, label: string, href: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-xl transition-all">
      {icon} {label}
    </Link>
  );
}