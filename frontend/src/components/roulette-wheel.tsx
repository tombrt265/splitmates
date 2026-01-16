import { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";

interface RouletteWheelProps {
  items: string[];
  onResult: (item: string) => void;
}

const colors = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"];

export const RouletteWheel = ({ items, onResult }: RouletteWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const spin = () => {
    if (spinning) return;

    const segmentAngle = 360 / items.length;
    const winnerIndex = Math.floor(Math.random() * items.length);

    // Basis: mindestens 5 volle Umdrehungen
    const rounds = 5;
    const baseRotation = rounds * 360;

    // Offset für Gewinner
    const winnerOffset =
      360 - winnerIndex * segmentAngle - segmentAngle / 2 - 90;

    // Extra Zufallsgrad, maximal +-15° innerhalb des Segments
    const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.6; // +/-30% des Segmentwinkels

    const finalRotation = baseRotation + winnerOffset + randomOffset;

    setSpinning(true);
    setRotation(finalRotation);

    setTimeout(() => {
      setSpinning(false);
      setRotation(finalRotation % 360);
      onResult(items[winnerIndex]);
    }, 5000);
  };

  const segmentAngle = 360 / items.length;
  const radius = 100;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div
          className="w-0 h-0
                 border-l-[10px] border-l-transparent
                 border-r-[10px] border-r-transparent
                 border-b-[20px] border-b-red-500 z-10 rotate-180"
        />
      </div>
      <div className="relative w-[250px] h-[250px]">
        <svg
          viewBox="-100 -100 200 200"
          className="absolute inset-0 w-full h-full origin-center"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? "transform 5s cubic-bezier(0.33, 1, 0.68, 1)"
              : "none",
          }}
        >
          {items.length === 1 ? (
            <>
              <circle
                r={radius}
                fill={colors[0 % colors.length]}
                stroke="#fff"
                strokeWidth={1}
              />
              <text
                x={0}
                y={0}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fff"
                fontSize="10"
              >
                {items[0]}
              </text>
            </>
          ) : (
            items.map((item, index) => {
              const startAngle = (index * segmentAngle * Math.PI) / 180;
              const endAngle = ((index + 1) * segmentAngle * Math.PI) / 180;
              const midAngle = (startAngle + endAngle) / 2;

              const x1 = 0 + radius * Math.cos(startAngle);
              const y1 = 0 + radius * Math.sin(startAngle);
              const x2 = 0 + radius * Math.cos(endAngle);
              const y2 = 0 + radius * Math.sin(endAngle);

              // Label Position entlang der Mittellinie
              const labelRadius = radius * 0.65;
              const lx = labelRadius * Math.cos(midAngle);
              const ly = labelRadius * Math.sin(midAngle);

              // Text-Rotation radial
              const rotateDeg = (midAngle * 180) / Math.PI;

              return (
                <g key={item}>
                  <path
                    d={`M0 0 L${x1} ${y1} A${radius} ${radius} 0 0 1 ${x2} ${y2} Z`}
                    fill={colors[index % colors.length]}
                    stroke="#fff"
                    strokeWidth={1}
                  />
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fff"
                    fontSize="10"
                    transform={`rotate(${rotateDeg}, ${lx}, ${ly})`}
                  >
                    {item}
                  </text>
                </g>
              );
            })
          )}
        </svg>
      </div>

      {/* Spin Button unter dem Rad */}
      <button
        onClick={spin}
        className="action-button action-button--primary mt-4"
      >
        <FiRefreshCw aria-hidden="true" />
        Spin
      </button>
    </div>
  );
};
