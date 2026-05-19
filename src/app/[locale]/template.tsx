'use client';

import { motion } from 'framer-motion';

const EASE_SNAPPY: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: EASE_SNAPPY, duration: 0.4 }}
    >
      {children}
    </motion.main>
  );
}
