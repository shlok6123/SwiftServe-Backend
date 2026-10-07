import { useEffect } from 'react';

/**
 * RippleEffect
 * Mounts once near the app root and adds a material-style ripple to every
 * `.btn` click without having to touch each button individually. It injects
 * a temporary span at the click point and cleans it up after the animation.
 */
const RippleEffect = () => {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const handleClick = (e) => {
      const target = e.target.closest('.btn, .ripple-host');
      if (!target || target.disabled) return;

      // Ensure the host can clip the ripple.
      if (getComputedStyle(target).position === 'static') {
        target.style.position = 'relative';
      }
      target.classList.add('ripple-host');

      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      target.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
      // Safety cleanup in case animationend never fires.
      setTimeout(() => ripple.remove(), 700);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
};

export default RippleEffect;
