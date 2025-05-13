import React, { useState } from 'react';
import { GameScreen } from './components/GameScreen';
import { StartScreen } from './components/StartScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { GameProvider } from './context/GameContext';

function App() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [finalScore, setFinalScore] = useState(0);

  const startGame = () => {
    setGameState('playing');
  };

  const endGame = (score: number) => {
    setFinalScore(score);
    setGameState('gameover');
  };

  const restartGame = () => {
    setGameState('playing');
  };

  const goToStart = () => {
    setGameState('start');
  };

  return (
    <GameProvider>
      <div className="w-full h-screen overflow-hidden bg-gray-900">
        {gameState === 'start' && <StartScreen onStart={startGame} />}
        
        {gameState === 'playing' && <GameScreen onGameOver={endGame} />}
        
        {gameState === 'gameover' && (
          <GameOverScreen 
            score={finalScore} 
            onRestart={restartGame} 
            onMainMenu={goToStart} 
          />
        )}
      </div>
    </GameProvider>
  );
}

export default App;