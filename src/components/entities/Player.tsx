import React from 'react';

// This component is a visual representation of the player - the actual physics
// body is managed in the GameScreen component
export const Player: React.FC<{
  x: number;
  y: number;
  radius: number;
}> = ({ x, y, radius }) => {
  return (
    <div 
      className="absolute rounded-full bg-orange-500 border-2 border-orange-300 shadow-lg shadow-orange-500/50"
      style={{
        width: radius * 2,
        height: radius * 2,
        left: x - radius,
        top: y - radius,
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
};