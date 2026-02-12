/**
 * Device Detection Hook for Responsive UX
 * Provides device type, screen size, and interaction method detection
 */

import { useState, useEffect, useCallback } from 'react';

// Breakpoint definitions (in pixels)
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1536,
};

/**
 * Get device type based on screen width
 */
function getDeviceType(width) {
  if (width < BREAKPOINTS.mobile) return 'mobile-small';
  if (width < BREAKPOINTS.tablet) return 'mobile';
  if (width < BREAKPOINTS.laptop) return 'tablet';
  if (width < BREAKPOINTS.desktop) return 'laptop';
  if (width < BREAKPOINTS.wide) return 'desktop';
  return 'wide';
}

/**
 * Detect if device has touch capability
 */
function isTouchDevice() {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Detect if user prefers reduced motion
 */
function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Detect if user prefers dark mode
 */
function prefersDarkMode() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Get screen orientation
 */
function getOrientation() {
  if (typeof window === 'undefined') return 'portrait';
  return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
}

/**
 * Hook for device detection and responsive behavior
 * @returns {Object} Device information and utilities
 */
export function useDevice() {
  const [deviceInfo, setDeviceInfo] = useState(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1024,
        height: 768,
        deviceType: 'laptop',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isTouch: false,
        orientation: 'landscape',
        prefersReducedMotion: false,
        prefersDarkMode: true,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const deviceType = getDeviceType(width);

    return {
      width,
      height,
      deviceType,
      isMobile: deviceType === 'mobile' || deviceType === 'mobile-small',
      isTablet: deviceType === 'tablet',
      isDesktop: deviceType === 'laptop' || deviceType === 'desktop' || deviceType === 'wide',
      isTouch: isTouchDevice(),
      orientation: getOrientation(),
      prefersReducedMotion: prefersReducedMotion(),
      prefersDarkMode: prefersDarkMode(),
    };
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const deviceType = getDeviceType(width);

      setDeviceInfo({
        width,
        height,
        deviceType,
        isMobile: deviceType === 'mobile' || deviceType === 'mobile-small',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'laptop' || deviceType === 'desktop' || deviceType === 'wide',
        isTouch: isTouchDevice(),
        orientation: getOrientation(),
        prefersReducedMotion: prefersReducedMotion(),
        prefersDarkMode: prefersDarkMode(),
      });
    };

    // Update on resize
    window.addEventListener('resize', updateDeviceInfo);
    
    // Update on orientation change
    window.addEventListener('orientationchange', updateDeviceInfo);

    // Listen for reduced motion preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', updateDeviceInfo);

    // Listen for dark mode preference changes
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkQuery.addEventListener('change', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
      motionQuery.removeEventListener('change', updateDeviceInfo);
      darkQuery.removeEventListener('change', updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
}

/**
 * Hook for responsive breakpoint matching
 * @param {string} breakpoint - Breakpoint name or custom query
 * @returns {boolean} Whether the breakpoint matches
 */
export function useBreakpoint(breakpoint) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    let query;
    
    if (BREAKPOINTS[breakpoint]) {
      query = `(max-width: ${BREAKPOINTS[breakpoint]}px)`;
    } else {
      query = breakpoint; // Allow custom media queries
    }

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (e) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [breakpoint]);

  return matches;
}

/**
 * Hook for detecting hover capability
 * @returns {boolean} Whether device supports hover
 */
export function useHover() {
  const [supportsHover, setSupportsHover] = useState(true);

  useEffect(() => {
    const query = window.matchMedia('(hover: hover)');
    setSupportsHover(query.matches);

    const handler = (e) => setSupportsHover(e.matches);
    query.addEventListener('change', handler);

    return () => query.removeEventListener('change', handler);
  }, []);

  return supportsHover;
}

/**
 * Hook for viewport dimensions with debouncing
 * @param {number} delay - Debounce delay in ms
 * @returns {Object} { width, height }
 */
export function useViewport(delay = 100) {
  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  }));

  useEffect(() => {
    let timeoutId;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setViewport({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, delay);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [delay]);

  return viewport;
}

/**
 * Hook for scroll position
 * @returns {Object} { x, y, direction }
 */
export function useScroll() {
  const [scroll, setScroll] = useState({
    x: 0,
    y: 0,
    direction: null,
  });

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setScroll({
        x: window.scrollX,
        y: currentY,
        direction: currentY > lastY ? 'down' : 'up',
      });
      lastY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scroll;
}

/**
 * Apply device-specific class to document
 */
export function useDeviceClass() {
  const { deviceType, isTouch, orientation } = useDevice();

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove old classes
    root.classList.remove('mobile-small', 'mobile', 'tablet', 'laptop', 'desktop', 'wide');
    root.classList.remove('touch', 'no-touch');
    root.classList.remove('portrait', 'landscape');
    
    // Add new classes
    root.classList.add(deviceType);
    root.classList.add(isTouch ? 'touch' : 'no-touch');
    root.classList.add(orientation);
    
    // Set CSS custom properties
    root.style.setProperty('--device-type', deviceType);
    root.style.setProperty('--is-touch', isTouch ? '1' : '0');
    
  }, [deviceType, isTouch, orientation]);
}

export default useDevice;
