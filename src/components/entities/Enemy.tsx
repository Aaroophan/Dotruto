import React from 'react';

// This component is a visual representation of enemies - the actual physics
// body is managed in the GameScreen component
export const Enemy: React.FC<{
  x: number;
  y: number;
  size: number;
}> = ({ x, y, size }) => {
  return (
    <div 
      className="absolute bg-purple-500 shadow-md shadow-purple-500/30"
      style={{
        width: size,
        height: size,
        left: x - size / 2,
        top: y - size / 2,
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      }}
    />
  );
};