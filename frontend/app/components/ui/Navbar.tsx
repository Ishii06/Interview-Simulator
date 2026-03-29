"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Menu, X, LogOut, BookOpen, ChevronRight, UserCircle2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, initialized, fetchCurrentUser, logout } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!initialized) {
      fetchCurrentUser();
    }
  }, [initialized, fetchCurrentUser]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isResourcesPage = pathname === '/resources';

  return (
    <motion.nav 
  initial={{ y: -20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  className="fixed top-0 left-0 right-0 z-100 px-4 py-3"
>
  <div className="max-w-6xl mx-auto">
    <div className={`
      flex justify-between items-center px-4 py-2 rounded-xl transition-all duration-300
      ${isScrolled 
        ? "bg-zinc-900/70 backdrop-blur-md border border-zinc-800" 
        : "bg-zinc-900/30 backdrop-blur-sm border border-transparent"}
    `}>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center transition-transform group-hover:scale-105">
          <Cpu size={18} className="text-black" />
        </div>
        <span className="text-sm font-semibold text-zinc-100 tracking-tight">
          INTERVIEW <span className="text-cyan-600 tracking-tight">SIMULATOR</span>
        </span>
      </Link>

      {/* Desktop Links */}
      {!isAuthPage && (
        <div className="hidden md:flex items-center gap-6">
          
          {[
            { label: 'Features', href: '/#features' },
            { label: 'Interview', href: '/interview' },
            { label: 'Practice', href: '/practice' },
          ].map((item) => (
            <Link 
              key={item.label}
              href={item.href}
              className="text-sm text-zinc-400 hover:text-white transition"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/resources"
            className={`text-sm transition flex items-center gap-1.5 ${isResourcesPage ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
          >
            <BookOpen size={14} />
            Resources
          </Link>

          {/* Divider */}
          <div className="h-4 w-px bg-zinc-700" />

          {user ? (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setIsUserMenuOpen((current) => !current)}
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:text-white hover:border-zinc-700 transition"
                aria-label="Open user menu"
                aria-expanded={isUserMenuOpen}
              >
                <UserCircle2 size={20} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] w-56 rounded-2xl border border-zinc-800 bg-zinc-950/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-md">
                  <Link
                    href="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition"
                  >
                    <span>Go to profile</span>
                    <ChevronRight size={14} className="text-zinc-500" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm text-zinc-300 hover:bg-white/5 hover:text-red-400 transition"
                  >
                    <span>Logout</span>
                    <LogOut size={14} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className="px-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900/50 text-sm font-medium text-zinc-300 hover:text-white hover:border-zinc-700 transition"
              aria-label="Login"
            >
              Login
            </Link>
          )}
        </div>
      )}

      {/* Mobile */}
      {!isAuthPage && (
        <div className="md:hidden flex items-center gap-2">
          <Link
            href="/resources"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-1.5 ${isResourcesPage ? 'border-white/20 bg-white/8 text-white' : 'border-zinc-800 bg-zinc-900/50 text-zinc-300'}`}
          >
            <BookOpen size={13} />
            Resources
          </Link>
          <button 
            className="text-zinc-100 p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      )}

    </div>

    {!isAuthPage && isOpen && (
      <div className="md:hidden mt-3 rounded-2xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-md p-3 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-2">
          {[
            { label: 'Features', href: '/#features' },
            { label: 'Interview', href: '/interview' },
            { label: 'Practice', href: '/practice' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition"
              onClick={() => setIsOpen(false)}
            >
              <span>{item.label}</span>
              <ChevronRight size={14} className="text-zinc-500" />
            </Link>
          ))}
          <Link
            href="/resources"
            className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition"
            onClick={() => setIsOpen(false)}
          >
            <span>Resources</span>
            <ChevronRight size={14} className="text-zinc-500" />
          </Link>
          <div className="h-px bg-zinc-800 my-1" />
          {user ? (
            <button
              onClick={() => {
                setIsOpen(false);
                setIsUserMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 hover:text-red-400 transition"
            >
              <span>Logout</span>
              <LogOut size={14} />
            </button>
          ) : (
            <Link
              href="/login"
              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-black bg-white hover:bg-zinc-200 transition font-medium"
              onClick={() => setIsOpen(false)}
            >
              <span>Login</span>
              <UserCircle2 size={14} />
            </Link>
          )}
        </div>
      </div>
    )}
  </div>
</motion.nav>
  );
}
