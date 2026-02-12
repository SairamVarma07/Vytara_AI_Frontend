import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered animations using Intersection Observer
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Visibility threshold (0-1), default 0.1
 * @param {string} options.rootMargin - Root margin for trigger, default "0px"
 * @param {boolean} options.triggerOnce - Only trigger animation once, default true
 * @returns {[React.RefObject, boolean]} - Ref to attach and visibility state
 */
export function useScrollAnimation(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
  } = options;

  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}

/**
 * Hook for staggered animations on multiple elements
 * @param {number} itemCount - Number of items to animate
 * @param {Object} options - Configuration options
 * @returns {[React.RefObject, boolean, number]} - Container ref, visibility, and stagger delay
 */
export function useStaggerAnimation(itemCount, options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    staggerDelay = 0.1,
  } = options;

  const [ref, isVisible] = useScrollAnimation({ threshold, rootMargin });

  return [ref, isVisible, staggerDelay];
}

/**
 * Hook for parallax-style scroll animations
 * @param {number} speed - Parallax speed multiplier
 * @returns {[React.RefObject, number]} - Ref and offset value
 */
export function useParallax(speed = 0.5) {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;
      
      if (scrolled > 0 && rect.top < window.innerHeight) {
        setOffset(scrolled * speed);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return [ref, offset];
}

export default useScrollAnimation;
