import React, { useState, useEffect } from "react";

interface RouletteOption {
  id: string;
  name: string;
}

interface RouletteWheelProps {
  options: RouletteOption[];
  onComplete: (winner: RouletteOption) => void;
}

const colors = [
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  options,
  onComplete,
}) => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const spinWheel = () => {
    if (isSpinning) return;

    const minSpins = 5; // Minimum number of full rotations
    const maxSpins = 10; // Maximum number of full rotations
    const spinDuration = 5000; // Duration in milliseconds

    const totalSpins = minSpins + Math.random() * (maxSpins - minSpins);
    const winner = Math.floor(Math.random() * options.length);
    const segmentAngle = 360 / options.length;
    
    // Calculate final rotation to land on winner
    const finalRotation = (totalSpins * 360) + (winner * segmentAngle);
    
    setIsSpinning(true);
    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      onComplete(options[winner]);
    }, spinDuration);
  };

  useEffect(() => {
    if (options.length === 1) {
      onComplete(options[0]);
    }
  }, [options]);

  return (
    <div className="flex flex-col items-center p-8">
      <div className="relative w-64 h-64">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-red-500 z-10" />
        
        {/* Wheel */}
        <div className="relative w-full h-full">
          <svg
            viewBox="-100 -100 200 200"
            className="w-full h-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'all 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            }}
          >
            {options.map((option, i) => {
              const angle = (360 / options.length);
              const rotate = i * angle;
              const skew = 90 - angle;
              
              return (
                <g key={option.id} transform={`rotate(${rotate})`}>
                  <path
                    d={`M 0 0 L ${95 * Math.cos(Math.PI/180 * (angle/2))} ${95 * Math.sin(Math.PI/180 * (angle/2))} A 95 95 0 0 1 ${95 * Math.cos(Math.PI/180 * (-angle/2))} ${95 * Math.sin(Math.PI/180 * (-angle/2))} Z`}
                    fill={colors[i % colors.length]}
                    stroke="white"
                    strokeWidth="1"
                  />
                  <text
                    x="35"
                    y="0"
                    fill="white"
                    fontSize="12"
                    textAnchor="middle"
                    transform={`rotate(${angle/2})`}
                    dominantBaseline="middle"
                  >
                    {option.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
