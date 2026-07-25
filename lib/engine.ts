// physics.ts
import { useEffect, useRef } from "react";

interface SpringConfig {
  tension: number;
  friction: number;
  mass: number;
}

// Apple-like spring constants
const APPLE_SPRING: SpringConfig = { tension: 300, friction: 28, mass: 1 };

export function useDynamicIslandPhysics(
  isOpen: boolean,
  containerRef: React.RefObject<HTMLDivElement | null>,
  contentRef: React.RefObject<HTMLDivElement | null>,
) {
  const animationFrameId = useRef<number>(0);
  const velocity = useRef({ width: 0, height: 0 });
  const current = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;

    // Calculate target dimensions
    const isMobile = window.innerWidth < 1280; // xl breakpoint

    let targetWidth, targetHeight;

    if (isMobile) {
      targetWidth = isOpen ? window.innerWidth - 32 : 200; // 200px closed pill, full width open
      targetHeight = isOpen ? content.scrollHeight + 80 : 64; // 64px closed, auto open
    } else {
      targetWidth = content.scrollWidth; // Auto width based on desktop content
      targetHeight = 64; // Fixed desktop height
    }

    // Initialize current on first run
    if (current.current.width === 0) {
      current.current.width = targetWidth;
      current.current.height = targetHeight;
      container.style.width = `${targetWidth}px`;
      container.style.height = `${targetHeight}px`;
      return;
    }

    const animate = () => {
      // Spring physics math
      const dWidth = targetWidth - current.current.width;
      const dHeight = targetHeight - current.current.height;

      const fSpringW = APPLE_SPRING.tension * dWidth;
      const fSpringH = APPLE_SPRING.tension * dHeight;

      const fDamperW = APPLE_SPRING.friction * velocity.current.width;
      const fDamperH = APPLE_SPRING.friction * velocity.current.height;

      const aW = (fSpringW - fDamperW) / APPLE_SPRING.mass;
      const aH = (fSpringH - fDamperH) / APPLE_SPRING.mass;

      velocity.current.width += aW * 0.016; // Assumes 60fps (16ms)
      velocity.current.height += aH * 0.016;

      current.current.width += velocity.current.width;
      current.current.height += velocity.current.height;

      // Apply hardware-accelerated styles
      container.style.width = `${current.current.width}px`;
      container.style.height = `${current.current.height}px`;

      // Stop loop when resting
      const isResting =
        Math.abs(velocity.current.width) < 0.1 &&
        Math.abs(velocity.current.height) < 0.1 &&
        Math.abs(dWidth) < 0.5 &&
        Math.abs(dHeight) < 0.5;

      if (!isResting) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        container.style.width =
          isMobile && isOpen ? "calc(100% - 32px)" : `${targetWidth}px`;
        container.style.height = `${targetHeight}px`;
      }
    };

    cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId.current);
  }, [containerRef, contentRef, isOpen]); // Re-run when state changes
}
