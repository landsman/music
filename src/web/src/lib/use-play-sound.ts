import { useEffect, useState } from "react";
import {useSound} from "use-sound";

const folder = './feedback/sound'

const SOUND_ASSETS = {
  click: `${folder}/switch-on.mp3`,
  success: `${folder}/plunger.mp3`,
  error: `${folder}/glug-b.mp3`,
};

export function usePlaySound() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(!!mediaQuery?.matches);
  }, []);

  const isMuted = !isEnabled || prefersReducedMotion;

  const [playClick] = useSound(SOUND_ASSETS.click, { volume: 0.5, soundEnabled: !isMuted });
  const [playSuccess] = useSound(SOUND_ASSETS.success, { volume: 0.4, soundEnabled: !isMuted });
  const [playError] = useSound(SOUND_ASSETS.error, { volume: 0.3, soundEnabled: !isMuted });

  return {
    playClick,
    playSuccess,
    playError,
    isEnabled,
    setIsEnabled,
    isMuted,
  };
}