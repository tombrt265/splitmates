import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface SingleSelectDropdownProps {
  options: Option[];
  headline: string;
  width?: string;
  returnSelected: (selected: string | null) => void;
}

export const SingleSelectDropdown = ({
  options,
  headline,
  width,
  returnSelected,
}: SingleSelectDropdownProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
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

  const handleSelect = (id: string) => {
    const newSelection = id === selectedOption ? null : id;
    setSelectedOption(newSelection);
    returnSelected(newSelection);
    setIsOpen(false);
  };

  const selectedLabel =
    options.find((opt) => opt.id === selectedOption)?.name || headline;

  return (
    <div ref={dropdownRef} className={`relative ${width || "w-full"} mb-4`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center border border-gray-300 rounded-2xl px-4 py-2 bg-white shadow-sm hover:shadow-md transition"
      >
        <span>{selectedLabel}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-lg p-2">
          {options.map((option) => (
            <li
              key={option.id}
              className="flex items-center px-2 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => handleSelect(option.id)}
            >
              <input
                type="radio"
                name="singleselect"
                checked={selectedOption === option.id}
                readOnly
                className="mr-2 accent-indigo-500"
              />
              {option.avatarUrl && (
                <div
                  className="rounded-full h-8 w-8 bg-cover bg-center mr-2 flex-shrink-0"
                  style={{ backgroundImage: `url(${option.avatarUrl})` }}
                ></div>
              )}
              <span className="text-gray-700 text-[1.6rem]">{option.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
