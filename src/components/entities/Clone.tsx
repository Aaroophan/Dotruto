import React from 'react';

// This component is a visual representation of the clone - the actual physics
// body is managed in the GameScreen component
export const Clone: React.FC<{
  x: number;
  y: number;
  radius: number;
}> = ({ x, y, radius }) => {
  return (
    <div 
      className="absolute rounded-full bg-orange-500/70 border border-orange-300/70 shadow-md shadow-orange-500/30"
      style={{
        width: radius * 2,
        height: radius * 2,
        left: x - radius,
        top: y - radius,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="absolute inset-0 animate-ping rounded-full bg-orange-400/30 opacity-75"></div>
    </div>
  );
};