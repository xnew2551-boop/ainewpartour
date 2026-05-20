'use client';

import { motion } from 'framer-motion';

export function MotionHero({ children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
}
