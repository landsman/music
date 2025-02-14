import {useEffect, useRef, useState} from 'react';

const speed = 50;
const padding = 50;

export function Marquee({ text }: { text: string }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollDistance, setScrollDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;

    if (container && textEl) {
      const textWidth = textEl.offsetWidth;
      if (textEl.textContent.length >= 25) {
        const distance = textWidth + padding;
        setScrollDistance(distance);
        setDuration(distance / speed);
        setIsScrolling(true);
      }
    }
  }, [text, padding, speed]);

  return (
    <div className="marquee-container" ref={containerRef}>
      {isScrolling
        ? (
          <div
            className="marquee-content"
            style={{
              '--scroll-distance': `${scrollDistance}px`,
              "--duration": `${duration}s`,
            }}
          >
            <span className="marquee-text" ref={textRef}>
              {text}
            </span>
            <span className="marquee-gap" style={{ width: padding }} />
            <span className="marquee-text">{text}</span>
          </div>
        )
        : (
          <span className="marquee-text" ref={textRef}>
            {text}
          </span>
        )}
    </div>
  );
}
