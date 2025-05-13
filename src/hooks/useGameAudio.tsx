import { useState, useEffect, useCallback } from 'react';
import { Howl, Howler } from 'howler';

// Define sound types
type SoundType = 'jump' | 'bounce' | 'clone' | 'collect' | 'hit' | 'fall' | 'enemyDefeat';

interface SoundMap {
  [key: string]: Howl;
}

// Creating a singleton for audio management
let isMutedState = false;
let soundsLoaded = false;
let sounds: SoundMap = {};
let bgMusic: Howl | null = null;

const loadSounds = () => {
  if (soundsLoaded) return;

  sounds = {
    jump: new Howl({
      src: ['https://assets.codepen.io/21542/howler-push.mp3'],
      volume: 0.5,
    }),
    bounce: new Howl({
      src: ['https://assets.codepen.io/21542/howler-bounce.mp3'],
      volume: 0.3,
    }),
    clone: new Howl({
      src: ['https://assets.codepen.io/21542/howler-sfx.mp3'],
      volume: 0.6,
    }),
    collect: new Howl({
      src: ['https://assets.codepen.io/21542/howler-coin.mp3'],
      volume: 0.5,
    }),
    hit: new Howl({
      src: ['https://assets.codepen.io/21542/howler-error.mp3'],
      volume: 0.6,
    }),
    fall: new Howl({
      src: ['https://assets.codepen.io/21542/howler-error.mp3'],
      volume: 0.4,
    }),
    enemyDefeat: new Howl({
      src: ['https://assets.codepen.io/21542/howler-laser.mp3'],
      volume: 0.5,
    }),
  };

  bgMusic = new Howl({
    src: ['https://assets.codepen.io/21542/howler-demo-bg-music.mp3'],
    loop: true,
    volume: 0.3,
  });

  soundsLoaded = true;
};

export const useGameAudio = () => {
  const [isMuted, setIsMuted] = useState(isMutedState);

  // Initialize sounds on first render
  useEffect(() => {
    loadSounds();
  }, []);

  // Play a sound effect
  const playSound = useCallback((type: SoundType) => {
    if (isMutedState || !soundsLoaded) return;
    
    const sound = sounds[type];
    if (sound) {
      sound.play();
    }
  }, []);

  // Toggle mute state
  const toggleMute = useCallback(() => {
    isMutedState = !isMutedState;
    setIsMuted(isMutedState);
    Howler.mute(isMutedState);
  }, []);

  // Toggle background music
  const toggleBgMusic = useCallback((play: boolean) => {
    if (!bgMusic || !soundsLoaded) return;
    
    if (play && !isMutedState) {
      if (!bgMusic.playing()) {
        bgMusic.play();
      }
    } else {
      bgMusic.pause();
    }
  }, []);

  return {
    playSound,
    toggleMute,
    toggleBgMusic,
    isMuted,
  };
};