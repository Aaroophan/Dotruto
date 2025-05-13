import React from 'react';
import { Scroll } from 'lucide-react';

// This component is a visual representation of chakra scrolls - the actual physics
// body is managed in the GameScreen component
export const ChakraScroll: React.FC<{
  x: number;
  y: number;
  radius: number;
}> = ({ x, y, radius }) => {
  return (
    <div 
      className="absolute rounded-full bg-green-500 border border-green-300 shadow-md shadow-green-500/50 flex items-center justify-center"
      style={{
        width: radius * 2,
        height: radius * 2,
        left: x - radius,
        top: y - radius,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <Scroll className="w-3/4 h-3/4 text-green-100" />
    </div>
  );
};