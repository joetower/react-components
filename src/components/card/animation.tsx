import React, { useEffect, useRef } from 'react';

interface AnimatedComponentProps {
  children: React.ReactNode;
}

const AnimatedComponent: React.FC<AnimatedComponentProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elementsToAnimate = containerRef.current?.querySelectorAll(
      '[data-component-animation="true"]'
    );

    const prefersReducedMotionNoPref = window.matchMedia(
      '(prefers-reduced-motion: no-preference)'
    ).matches;

    if (!elementsToAnimate || !prefersReducedMotionNoPref) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const animatedElement = entry.target as HTMLElement;

        if (entry.isIntersecting) {
          animatedElement.setAttribute('component-is-animating', 'true');
        }
      });
    });

    elementsToAnimate.forEach((animatedElement) => {
      observer.observe(animatedElement);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
};

export default AnimatedComponent;
