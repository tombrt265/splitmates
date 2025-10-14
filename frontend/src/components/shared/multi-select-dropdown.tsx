import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Member {
  name: string;
  avatarUrl: string;
  userID: string;
}

interface MultiSelectDropdownProps {
  members: Member[];
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  members,
}) => {
  const [selectedPayers, setSelectedPayers] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSelect = (name: string) => {
    setSelectedPayers((prev) =>
      prev.includes(name)
        ? prev.filter((p) => p !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="relative w-64">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex justify-between items-center border border-gray-300 rounded-2xl px-4 py-2 bg-white shadow-sm hover:shadow-md transition"
      >
        <span className="truncate text-gray-800">
          {selectedPayers.length > 0
            ? selectedPayers.join(", ")
            : "Wähle Personen..."}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-2 w-full max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-2xl shadow-lg p-2">
          {members.map((member) => (
            <li
              key={member.name}
              className="flex items-center px-2 py-1 hover:bg-gray-50 rounded-lg cursor-pointer"
              onClick={() => toggleSelect(member.userID)}
            >
              <input
                type="checkbox"
                checked={selectedPayers.includes(member.userID)}
                readOnly
                className="mr-2 accent-indigo-500"
              />
              {member.avatarUrl && (
                <div
                  className="rounded-full aspect-square h-20 bg-cover bg-center"
                  style={{ backgroundImage: `url(${member.avatarUrl})` }}
                ></div>
              )}
              <span className="text-gray-700">{member.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
