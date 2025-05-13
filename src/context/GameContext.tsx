import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';

interface GameContextType {
  score: number;
  lives: number;
  level: number;
  paused: boolean;
  addScore: (points: number) => void;
  removeLife: () => void;
  resetGame: () => void;
  setPaused: (paused: boolean) => void;
  togglePause: () => void;
  incrementLevel: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [paused, setPaused] = useState(false);

  const addScore = useCallback((points: number) => {
    setScore((prevScore) => prevScore + points);
  }, []);

  const removeLife = useCallback(() => {
    setLives((prevLives) => Math.max(0, prevLives - 1));
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setPaused(false);
  }, []);

  const togglePause = useCallback(() => {
    setPaused((prev) => !prev);
  }, []);

  const incrementLevel = useCallback(() => {
    setLevel((prev) => prev + 1);
  }, []);

  const value = {
    score,
    lives,
    level,
    paused,
    addScore,
    removeLife,
    resetGame,
    setPaused,
    togglePause,
    incrementLevel,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};