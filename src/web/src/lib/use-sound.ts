import { useCallback, useEffect, useRef, useState } from "react";

type SoundType = "click" | "success" | "error" | "beep";

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  gain: number;
  ramp?: "up" | "down";
}

const SOUND_CONFIGS: Record<SoundType, SoundConfig> = {
  click: {
    frequency: 1000,
    duration: 0.08,
    type: "sine",
    gain: 0.3,
  },
  success: {
    frequency: 880,
    duration: 0.15,
    type: "sine",
    gain: 0.3,
    ramp: "up",
  },
  error: {
    frequency: 200,
    duration: 0.25,
    type: "square",
    gain: 0.2,
    ramp: "down",
  },
  beep: {
    frequency: 440,
    duration: 0.12,
    type: "sine",
    gain: 0.3,
  },
};

/**
 * Custom hook for playing UI sounds using the Web Audio API.
 *
 * Follows accessibility best practices:
 * - Respects prefers-reduced-motion as a proxy for audio preferences
 * - Provides manual enable/disable control
 * - Sounds are non-blocking and complement visual feedback
 *
 * @see https://www.userinterface.wiki/sounds-on-the-web
 */
export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for prefers-reduced-motion (proxy for audio preferences)
  useEffect(() => {
    const mediaQuery = globalThis.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    );
    if (mediaQuery) {
      setPrefersReducedMotion(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  // Lazy initialization of AudioContext
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  }, []);

  // Clean up AudioContext on unmount
  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const play = useCallback(
    async (sound: SoundType) => {
      console.log("[useSound] play called:", sound, {
        isEnabled,
        prefersReducedMotion,
      });

      // Skip if sounds are disabled or user prefers reduced motion
      if (!isEnabled || prefersReducedMotion) {
        console.log("[useSound] skipping - disabled or reduced motion");
        return;
      }

      try {
        const ctx = getAudioContext();
        console.log("[useSound] AudioContext state:", ctx.state);
        const config = SOUND_CONFIGS[sound];

        // Resume context if suspended (browser autoplay policy)
        if (ctx.state === "suspended") {
          await ctx.resume();
        }

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime);

        // Set gain directly
        gainNode.gain.setValueAtTime(config.gain, ctx.currentTime);

        // Apply frequency ramp for success/error distinction
        if (config.ramp === "up") {
          oscillator.frequency.linearRampToValueAtTime(
            config.frequency * 1.5,
            ctx.currentTime + config.duration,
          );
        } else if (config.ramp === "down") {
          oscillator.frequency.linearRampToValueAtTime(
            config.frequency * 0.5,
            ctx.currentTime + config.duration,
          );
        }

        // Fade out at the end to avoid click
        gainNode.gain.setValueAtTime(config.gain, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(
          0,
          ctx.currentTime + config.duration,
        );

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + config.duration + 0.01);
      } catch {
        // Silently fail - audio is enhancement, not critical
      }
    },
    [isEnabled, prefersReducedMotion, getAudioContext],
  );

  // Convenience methods
  const playClick = useCallback(() => play("click"), [play]);
  const playSuccess = useCallback(() => play("success"), [play]);
  const playError = useCallback(() => play("error"), [play]);
  const playBeep = useCallback(() => play("beep"), [play]);

  return {
    play,
    playClick,
    playSuccess,
    playError,
    playBeep,
    isEnabled,
    setIsEnabled,
    isMuted: prefersReducedMotion || !isEnabled,
  };
}
