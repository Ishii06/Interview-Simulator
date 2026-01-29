"use client";

import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  title: string;
  des: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}

export const Card = ({ title, des, icon, children }: CardProps) => {
  return (
    <div className="relative w-[320px] h-[420px] rounded-3xl overflow-hidden bg-neutral-900 border border-white/10 group">
      
      {/* Canvas Effect */}
      {children}

      {/* Content */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-end">
        <div className="mb-4">{icon}</div>

        <h3 className="text-xl font-semibold mb-2">{title}</h3>

        <p className="text-sm text-neutral-300 leading-relaxed">
          {des}
        </p>
      </div>

      {/* Hover overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-black/40"
      />
    </div>
  );
};
