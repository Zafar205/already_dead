'use client';

// 1. Import Variants here
import { motion, Variants } from 'framer-motion'; 
import { ReactNode } from 'react';

interface ScrollRevealProps {
  children?: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  className?: string;
}

export default function ScrollReveal({ 
  children, 
  direction = 'up', 
  delay = 0,
  className = "" 
}: ScrollRevealProps) {
  
  // 2. Add the : Variants type definition here
  const variants: Variants = { 
    hidden: {
      opacity: 0,
      x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { 
        duration: 0.6, 
        delay: delay, 
        ease: [0.25, 0.25, 0, 1] 
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={direction === 'none' ? {} : variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}