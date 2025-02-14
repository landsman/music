"use client";

import { useEffect, useRef, useState } from 'react';

const speed = 50;
const padding = 50;
const debounceTime = 200;

export function Marquee({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const resizeTimer = useRef<number | null>(null);

  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  function runOrNot() {
    const textEl = textRef.current;
    if (textEl && window.innerWidth <= 550) {
      const textWidth = textEl.offsetWidth;
      if (textEl.textContent && textEl.textContent.length >= 25) {
        const distance = textWidth + padding;
        setScrollDistance(distance);
        setDuration(distance / speed);
        setIsScrolling(true);
      } else {
        setIsScrolling(false);
      }
    } else {
      setIsScrolling(false);
    }
  }

  useEffect(() => {
    runOrNot();
  }, [text]);

  useEffect(() => {
    const handleResize = () => {
      if (resizeTimer.current) {
        clearTimeout(resizeTimer.current);
      }
      resizeTimer.current = window.setTimeout(() => {
        runOrNot();
      }, debounceTime);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimer.current) clearTimeout(resizeTimer.current);
    };
  }, [text]);

  return (
      <div className="marquee-container" ref={containerRef}>
        {isScrolling ? (
            <div
                className="marquee-content"
                style={{
                  '--scroll-distance': `${scrollDistance}px`,
                  '--duration': `${duration}s`,
                }}
            >
          <span className="marquee-text" ref={textRef}>
            {text}
          </span>
              <span className="marquee-gap" style={{ width: padding }} />
              <span className="marquee-text">{text}</span>
            </div>
        ) : (
            <span className="marquee-text" ref={textRef}>
          {text}
        </span>
        )}
      </div>
  );
}