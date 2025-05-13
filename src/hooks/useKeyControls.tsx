import { useState, useEffect, useCallback } from 'react';

interface KeyState {
  left: boolean;
  right: boolean;
  jump: boolean;
  clone: boolean;
  pause: boolean;
}

interface KeyControlsOptions {
  onPause?: () => void;
  onClone?: () => void;
}

export const useKeyControls = (options?: KeyControlsOptions) => {
  const [keys, setKeys] = useState<KeyState>({
    left: false,
    right: false,
    jump: false,
    clone: false,
    pause: false,
  });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Prevent default behavior for game controls
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', ' ', 'a', 'd', 'w', 'c', 'p', 'Escape'].includes(e.key)) {
        e.preventDefault();
      }

      // Handle movement keys
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setKeys((prev) => ({ ...prev, left: true }));
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        setKeys((prev) => ({ ...prev, right: true }));
      }
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        setKeys((prev) => ({ ...prev, jump: true }));
      }

      // Handle actions
      if (e.key === 'c' && !keys.clone) {
        setKeys((prev) => ({ ...prev, clone: true }));
        options?.onClone?.();
      }
      if ((e.key === 'p' || e.key === 'Escape') && !keys.pause) {
        setKeys((prev) => ({ ...prev, pause: true }));
        options?.onPause?.();
      }
    },
    [keys.clone, keys.pause, options]
  );

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setKeys((prev) => ({ ...prev, left: false }));
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        setKeys((prev) => ({ ...prev, right: false }));
      }
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        setKeys((prev) => ({ ...prev, jump: false }));
      }
      if (e.key === 'c') {
        setKeys((prev) => ({ ...prev, clone: false }));
      }
      if (e.key === 'p' || e.key === 'Escape') {
        setKeys((prev) => ({ ...prev, pause: false }));
      }
    },
    []
  );

  // Add touch controls for mobile
  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Left side of screen for left movement
      if (touchX < windowWidth / 3) {
        setKeys((prev) => ({ ...prev, left: true }));
      }
      
      // Right side of screen for right movement
      if (touchX > (windowWidth / 3) * 2) {
        setKeys((prev) => ({ ...prev, right: true }));
      }
      
      // Top half of screen for jump
      if (touchY < windowHeight / 2) {
        setKeys((prev) => ({ ...prev, jump: true }));
      }
      
      // Center area for clone
      if (
        touchX > windowWidth / 3 &&
        touchX < (windowWidth / 3) * 2 &&
        touchY > windowHeight / 2
      ) {
        setKeys((prev) => ({ ...prev, clone: true }));
        options?.onClone?.();
      }
    },
    [options]
  );

  const handleTouchEnd = useCallback(() => {
    setKeys((prev) => ({
      ...prev,
      left: false,
      right: false,
      jump: false,
      clone: false,
    }));
  }, []);

  // Clear all keys
  const clearKeys = useCallback(() => {
    setKeys({
      left: false,
      right: false,
      jump: false,
      clone: false,
      pause: false,
    });
  }, []);

  useEffect(() => {
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleKeyDown, handleKeyUp, handleTouchStart, handleTouchEnd]);

  return { keys, clearKeys };
};