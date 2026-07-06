import { ReactNode, forwardRef, useRef, type RefObject } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

interface CinematicSectionProps {
  children: ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  id?: string;
}

const CinematicSection = forwardRef<HTMLElement, CinematicSectionProps>(function CinematicSection(
  { children, className = '', intensity = 'medium', id },
  forwardedRef
) {
  const internalRef = useRef<HTMLElement>(null);
  const ref = (forwardedRef as RefObject<HTMLElement>) || internalRef;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const springProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scaleValues = {
    low: { from: 1.01, to: 1 },
    medium: { from: 1.03, to: 1 },
    high: { from: 1.05, to: 1 }
  };

  const scale = useTransform(
    springProgress,
    [0, 1],
    [scaleValues[intensity].from, scaleValues[intensity].to]
  );

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      style={{ scale }}
    >
      {children}
    </motion.section>
  );
});

export default CinematicSection;
