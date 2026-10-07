import { useEffect, useRef } from 'react';

/**
 * ScrollProgress
 * A thin gradient bar pinned to the top of the viewport that fills as the
 * user scrolls the page. Uses a ref + rAF so it never triggers re-renders.
 */
const ScrollProgress = () => {
  const barRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const el = barRef.current;
      if (el) {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const height =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = height > 0 ? scrollTop / height : 0;
        el.style.transform = `scaleX(${Math.min(progress, 1)})`;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return <div className="scroll-progress" ref={barRef} aria-hidden="true" />;
};

export default ScrollProgress;
