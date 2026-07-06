import { useState, useCallback } from 'react';

export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const withTransition = useCallback(async (callback: () => void | Promise<void>) => {
    setIsTransitioning(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    callback();
    await new Promise(resolve => setTimeout(resolve, 100));
    setIsTransitioning(false);
  }, []);

  return { isTransitioning, withTransition };
}
