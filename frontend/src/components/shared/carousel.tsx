import { useState, ReactNode } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface CarouselProps {
  children: ReactNode[];
}

export const Carousel = ({ children }: CarouselProps) => {
  const [index, setIndex] = useState(0);

  const count = children.length;

  const goLeft = () => {
    setIndex((prev) => (prev - 1 + count) % count);
  };

  const goRight = () => {
    setIndex((prev) => (prev + 1) % count);
  };

  return (
    <div className="relative w-full bg-background rounded-2xl shadow-md p-6">
      {/* Viewport */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {children.map((child, i) => (
            <div key={i} className="w-full flex-shrink-0 px-2">
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Left arrow */}
      <button
        onClick={goLeft}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-background rounded-full p-2 shadow hover:bg-widget"
      >
        <FiChevronLeft size={20} />
      </button>

      {/* Right arrow */}
      <button
        onClick={goRight}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-background rounded-full p-2 shadow hover:bg-widget"
      >
        <FiChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="mt-4 flex justify-center gap-2">
        {children.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full transition-all ${
              i === index
                ? "bg-blue-400 scale-110"
                : "bg-background hover:bg-widget"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
