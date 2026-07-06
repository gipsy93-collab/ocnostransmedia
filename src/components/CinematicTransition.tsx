import { motion } from 'motion/react';

interface CinematicTransitionProps {
  isActive: boolean;
}

export default function CinematicTransition({ isActive }: CinematicTransitionProps) {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] pointer-events-none"
    >
      {/* Top curtain */}
      <motion.div
        initial={{ y: "-100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-ocean-dark to-ocean-dark/90"
      />
      
      {/* Bottom curtain */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-100%" }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-ocean-dark to-ocean-dark/90"
      />

      {/* Center glow */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 0.3 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-ocean-light rounded-full blur-3xl"
      />
    </motion.div>
  );
}
