import { useEffect, useRef } from 'react';

/**
 * useScrollReveal
 * Reveals elements with the `.reveal` class as they enter the viewport.
 * Attach the returned ref to a container; every descendant with `.reveal`
 * will get `.is-visible` added when scrolled into view.
 *
 * Usage:
 *   const ref = useScrollReveal();
 *   <section ref={ref}> <div className="reveal">...</div> </section>
 */
const useScrollReveal = (options = {}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const targets = root.classList.contains('reveal')
      ? [root, ...root.querySelectorAll('.reveal')]
      : Array.from(root.querySelectorAll('.reveal'));

    if (targets.length === 0) return;

    // Fallback: if IntersectionObserver is unavailable, show everything.
    if (typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: options.threshold ?? 0.12,
        rootMargin: options.rootMargin ?? '0px 0px -40px 0px',
      }
    );

    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin]);

  return containerRef;
};

export default useScrollReveal;
