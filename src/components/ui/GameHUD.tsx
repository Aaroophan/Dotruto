import React from 'react';
import { Heart, Trophy, GaugeCircle } from 'lucide-react';
import { useGameContext } from '../../context/GameContext';

export const GameHUD: React.FC = () => {
  const { score, lives, level } = useGameContext();

  return (
    <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none">
      <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg p-3 flex items-center space-x-6">
        {/* Lives */}
        <div className="flex items-center">
          <Heart className="h-5 w-5 text-red-500 mr-2" />
          <div className="flex">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className={`w-5 h-5 rounded-full mx-0.5 ${
                  i < lives ? 'bg-red-500' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Level */}
        <div className="flex items-center">
          <GaugeCircle className="h-5 w-5 text-blue-400 mr-2" />
          <span className="text-blue-300 font-medium">Level {level}</span>
        </div>
      </div>
      
      {/* Score */}
      <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg p-3 flex items-center">
        <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
        <span className="text-yellow-300 font-bold text-lg">{score}</span>
      </div>
    </div>
  );
};