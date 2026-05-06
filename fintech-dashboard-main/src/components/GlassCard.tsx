import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  glow?: boolean;
  borderless?: boolean;
  key?: string | number;
}

export const GlassCard = ({ children, className, hoverEffect = true, glow = false, borderless = false }: GlassCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={hoverEffect ? { y: -4, scale: 1.01, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1)" } : {}}
      transition={{ 
        duration: 0.7, 
        ease: [0.16, 1, 0.3, 1],
        scale: { type: "spring", stiffness: 400, damping: 30 },
        y: { type: "spring", stiffness: 400, damping: 30 }
      }}
      className={cn(
        "glass rounded-[2.5rem] p-8 glass-hover-gradient z-10",
        borderless && "border-0 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.04)]",
        glow && "glow-green-large",
        className
      )}
    >
  {/* Inner-most tint layer (green) */}
  <div
    className={cn(
      "glass-inner-green",
      borderless && "border-0"
    )}
    aria-hidden="true"
  />

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
