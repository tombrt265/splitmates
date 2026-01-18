import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  headline: string;
  width?: string;
  selectedOptions: string[]; // controlled
  returnSelected: (selected: string[]) => void;
}

export const MultiSelectDropdown = ({
  options,
  headline,
  width,
  selectedOptions,
  returnSelected,
}: MultiSelectDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelect = (id: string) => {
    const next = selectedOptions.includes(id)
      ? selectedOptions.filter((p) => p !== id)
      : [...selectedOptions, id];
    returnSelected(next);
  };

  return (
    <div ref={dropdownRef} className={`relative ${width || "w-full"} my-2`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center border border-widget rounded-2xl px-4 py-2 bg-primary shadow-sm hover:bg-secondary transition"
      >
        <span>{headline}</span>
        <ChevronDown
          className={`h-4 w-4 text-primary transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto bg-primary border border-widget rounded-2xl shadow-lg p-2"
          style={{
            position: "absolute",
            overflowY: "auto",
            maxHeight: "fit-content",
          }}
        >
          {options.length === 0 ? (
            <li className="px-2 py-2 text-primary">No options available</li>
          ) : (
            options.map((option) => (
              <li
                key={option.id}
                className="flex items-center px-2 py-2 hover:bg-widget rounded-lg cursor-pointer text-primary"
                onClick={() => toggleSelect(option.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option.id)}
                  readOnly
                  className="mr-2 accent-blue-500"
                />
                {option.avatarUrl && (
                  <div
                    className="rounded-full h-8 w-8 bg-cover bg-center mr-2 flex-shrink-0"
                    style={{ backgroundImage: `url(${option.avatarUrl})` }}
                  ></div>
                )}
                <span className="text-base">
                  {option.name}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
