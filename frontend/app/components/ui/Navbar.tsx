"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Menu, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <motion.nav 
  initial={{ y: -20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  className="fixed top-0 left-0 right-0 z-[100] px-4 py-3"
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
          
          {['Features', 'Intelligence', 'Pricing'].map((item) => (
            <Link 
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-zinc-400 hover:text-white transition"
            >
              {item}
            </Link>
          ))}

          {/* Divider */}
          <div className="h-4 w-px bg-zinc-700" />

          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 text-sm text-zinc-400 hover:text-red-400 transition flex items-center gap-2"
            >
              <LogOut size={14} />
              Logout
            </button>
          ) : (
            <Link 
              href="/login" 
              className="px-4 py-1.5 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-200 transition"
            >
              Get Started
            </Link>
          )}
        </div>
      )}

      {/* Mobile */}
      {!isAuthPage && (
        <button 
          className="md:hidden text-zinc-100 p-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}

    </div>
  </div>
</motion.nav>
  );
}
