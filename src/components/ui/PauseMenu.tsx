import React from 'react';
import { Play, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { useGameAudio } from '../../hooks/useGameAudio';

interface PauseMenuProps {
  onResume: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({ onResume }) => {
  const { isMuted, toggleMute } = useGameAudio();

  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700 max-w-sm w-full">
        <h2 className="text-2xl font-bold text-white text-center mb-6">Game Paused</h2>
        
        <div className="space-y-3">
          <button
            onClick={onResume}
            className="w-full py-3 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
          >
            <Play size={18} />
            <span className="text-white">RESUME</span>
          </button>
          
          <button
            onClick={toggleMute}
            className="w-full py-3 px-6 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 text-white"
          >
            {isMuted ? (
              <>
                <VolumeX size={18} />
                <span>UNMUTE</span>
              </>
            ) : (
              <>
                <Volume2 size={18} />
                <span>MUTE</span>
              </>
            )}
          </button>
          
          <div className="w-full border-t border-gray-700 my-4"></div>
          
          <p className="text-gray-400 text-sm text-center mb-2">Controls</p>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
            <div className="flex items-center justify-between">
              <span>Move Left/Right:</span>
              <span className="font-mono bg-gray-700 px-2 py-1 rounded text-xs">A/D or ←/→</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Jump/Bounce:</span>
              <span className="font-mono bg-gray-700 px-2 py-1 rounded text-xs">SPACE</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Clone Jutsu:</span>
              <span className="font-mono bg-gray-700 px-2 py-1 rounded text-xs">C</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pause Game:</span>
              <span className="font-mono bg-gray-700 px-2 py-1 rounded text-xs">ESC / P</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};