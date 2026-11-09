// Optional React components. Use ONLY after confirming `motion` is installed.
// If the project uses `framer-motion` instead, change the import below accordingly.
import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

const ease = [0.22, 1, 0.36, 1];
export function AppEntrance({ children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? false : { opacity: 0, scale: 0.985, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.38, ease }}>
      {children}
    </motion.div>
  );
}
// Use in a location that always remains mounted between route transitions.
// IMPORTANT: render the matched page as children with a stable routeKey.
// With React Router, use location.pathname + location.search ONLY if you want search-param changes animated.
export function PagePresence({ routeKey, children }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={routeKey}
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduce ? { opacity: 1 } : { opacity: 0, y: -5 }}
        transition={{ duration: reduce ? 0 : 0.22, ease }}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
export function StaggerGroup({ children, className = '' }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial="hidden" animate="visible"
      variants={{ visible: { transition: { staggerChildren: reduce ? 0 : 0.055, delayChildren: 0.04 } } }}>
      {children}
    </motion.div>
  );
}
export function StaggerItem({ children, className = '' }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} variants={{
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 9 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.32, ease } }
  }}>{children}</motion.div>;
}
