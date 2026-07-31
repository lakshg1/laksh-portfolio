'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { site } from '@/content/site';

const INTERVAL_MS = 2600;

/** Crossfading role label for the hero eyebrow. Roles live in site.ts. */
export function RoleRotator() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % site.roles.length), INTERVAL_MS);
    return () => clearInterval(t);
  }, [reduce]);

  if (reduce) return <span>{site.roles[0]}</span>;

  return (
    <span className="relative inline-block h-[1.4em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={site.roles[i]}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="inline-block"
        >
          {site.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
