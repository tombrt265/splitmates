import { useRef, useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface SingleSelectDropdownProps {
  options: Option[];
  selectedOption: string | null; // controlled
  headline: string;
  width?: string;
  returnSelected: (selected: string | null) => void;
}

export const SingleSelectDropdown = ({
  options,
  selectedOption,
  headline,
  width,
  returnSelected,
}: SingleSelectDropdownProps) => {
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

  const handleSelect = (id: string) => {
    const newSelection = id === selectedOption ? null : id;
    returnSelected(newSelection);
    setIsOpen(false);
  };

  const selectedLabel =
    options.find((opt) => opt.id === selectedOption)?.name || headline;

  return (
    <div ref={dropdownRef} className={`relative ${width || "w-full"} my-2`}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center border border-gray-400 rounded-2xl px-4 py-2 bg-primary shadow-sm hover:shadow-md transition"
      >
        <span>{selectedLabel}</span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto bg-primary border border-gray-400 rounded-2xl shadow-lg p-2"
          style={{
            position: "absolute",
            overflowY: "auto",
            maxHeight: "fit-content",
          }}
        >
          {options.length === 0 ? (
            <li className="flex items-center px-2 py-2 text-gray-500">
              No options available
            </li>
          ) : (
            options.map((option) => (
              <li
                key={option.id}
                className="flex items-center px-2 py-2 hover:bg-secondary rounded-lg cursor-pointer text-primary"
                onClick={() => handleSelect(option.id)}
              >
                <input
                  type="radio"
                  name="singleselect"
                  checked={selectedOption === option.id}
                  readOnly
                  className="mr-2 accent-blue-500"
                />
                {option.avatarUrl && (
                  <div
                    className="rounded-full h-8 w-8 bg-cover bg-center mr-2 flex-shrink-0"
                    style={{ backgroundImage: `url(${option.avatarUrl})` }}
                  ></div>
                )}
                <span className="text-widget text-base">
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
