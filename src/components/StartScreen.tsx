import React from 'react';
import { Option as Motion, CheckCircle as CircleCheck, Play, Heart, Scroll } from 'lucide-react';
import { useGameContext } from '../context/GameContext';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const { resetGame } = useGameContext();

  const handleStartClick = () => {
    resetGame();
    onStart();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-white p-4">
      <div className="max-w-lg w-full bg-gray-800/80 rounded-2xl p-8 shadow-2xl border border-orange-500/20">
        <div className="flex items-center justify-center mb-6">
          <Motion 
            className="w-10 h-10 mr-2 text-orange-500" 
            strokeWidth={1.5} 
          />
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-orange-400 to-amber-300 text-transparent bg-clip-text">
            Dotruto: Bounce Trials
          </h1>
        </div>
        
        <div className="my-8 space-y-4">
          <p className="text-center text-gray-300 mb-6">
            Guide Dotruto through challenging platforms, collect chakra scrolls, and use clone jutsu to outsmart enemies!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-start p-4 bg-gray-700/50 rounded-lg">
              <Heart className="mt-1 mr-3 text-red-400 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-medium text-orange-300 mb-1">Survive & Score</h3>
                <p className="text-sm text-gray-300">Bounce off platforms to stay alive and collect chakra scrolls for points.</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-gray-700/50 rounded-lg">
              <CircleCheck className="mt-1 mr-3 text-green-400 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-medium text-orange-300 mb-1">Clone Jutsu</h3>
                <p className="text-sm text-gray-300">Press 'C' to create clones that mimic your movements with a delay.</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-gray-700/50 rounded-lg">
              <Scroll className="mt-1 mr-3 text-blue-400 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-medium text-orange-300 mb-1">Combo System</h3>
                <p className="text-sm text-gray-300">Chain scroll collections for bonus points and high scores.</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-gray-700/50 rounded-lg">
              <Motion className="mt-1 mr-3 text-purple-400 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-medium text-orange-300 mb-1">Avoid Enemies</h3>
                <p className="text-sm text-gray-300">Dodge bouncing enemies or use your clones to eliminate them.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700/30 p-4 rounded-lg mb-6">
            <h3 className="font-medium text-orange-300 mb-2 text-center">Controls</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
              <div className="flex items-center justify-between">
                <span>Move Left/Right:</span>
                <span className="font-mono bg-gray-700 px-2 py-1 rounded">A/D or ←/→</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Jump/Bounce:</span>
                <span className="font-mono bg-gray-700 px-2 py-1 rounded">SPACE</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Clone Jutsu:</span>
                <span className="font-mono bg-gray-700 px-2 py-1 rounded">C</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Pause Game:</span>
                <span className="font-mono bg-gray-700 px-2 py-1 rounded">ESC / P</span>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleStartClick}
          className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40"
        >
          <Play size={20} />
          <span>START GAME</span>
        </button>
      </div>
    </div>
  );
};