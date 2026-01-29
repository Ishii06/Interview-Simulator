"use client";

import { motion } from "framer-motion";

interface CanvasRevealEffectProps {
  animationSpeed?: number;
  containerClassName?: string;
}

export const CanvasRevealEffect = ({
  animationSpeed = 3,
  containerClassName = "",
}: CanvasRevealEffectProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileHover={{ opacity: 1 }}
      transition={{ duration: animationSpeed * 0.2 }}
      className={`absolute inset-0 z-0 ${containerClassName}`}
    >
      {/* Soft gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-cyan-500/20 blur-2xl" />
    </motion.div>
  );
};
