import React from 'react';

// This component is a visual representation of platforms - the actual physics
// body is managed in the GameScreen component
export const Platform: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
}> = ({ x, y, width, height }) => {
  return (
    <div 
      className="absolute bg-blue-500 border border-blue-300 rounded-sm shadow-md shadow-blue-500/30"
      style={{
        width,
        height,
        left: x - width / 2,
        top: y - height / 2,
      }}
    />
  );
};