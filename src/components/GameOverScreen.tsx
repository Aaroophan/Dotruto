import React from 'react';
import { RotateCcw, Home, Trophy } from 'lucide-react';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  onRestart,
  onMainMenu,
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-white p-4">
      <div className="max-w-md w-full bg-gray-800/80 rounded-2xl p-8 shadow-2xl border border-red-500/20">
        <h1 className="text-4xl font-bold text-center mb-2">Game Over</h1>
        
        <div className="flex items-center justify-center my-8">
          <div className="bg-gray-700/50 rounded-lg p-6 flex flex-col items-center">
            <Trophy className="w-12 h-12 text-yellow-400 mb-3" />
            <p className="text-gray-300 mb-1">Your Score</p>
            <p className="text-4xl font-bold text-yellow-300">{score}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
          >
            <RotateCcw size={18} />
            <span>PLAY AGAIN</span>
          </button>
          
          <button
            onClick={onMainMenu}
            className="w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
          >
            <Home size={18} />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};