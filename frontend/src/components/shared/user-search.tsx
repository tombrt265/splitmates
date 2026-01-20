import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";

interface User {
  id: number;
  name: string;
}

interface UserSearchProps {
  onSelectedUsersChange: (users: string[]) => void;
}

export default function UserSearch({ onSelectedUsersChange }: UserSearchProps) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mocked Users
  useEffect(() => {
    setUsers([
      { id: 1, name: "John.Doe" },
      { id: 2, name: "JaneSmith" },
      { id: 3, name: "AliceJohnson" },
      { id: 4, name: "BobBrown" },
      { id: 5, name: "CharlieDavis" },
      { id: 6, name: "EveMiller" },
      { id: 7, name: "FrankWilson" },
      { id: 8, name: "GraceLee" },
      { id: 9, name: "HankTaylor" },
      { id: 10, name: "IvyAnderson" },
    ]);
  }, []);

  // Alle User beim Laden fetchen
  // useEffect(() => {
  //   fetch("/api/users") // deine API
  //     .then((res) => res.json())
  //     .then((data) => setUsers(data));
  // }, []);

  // Filtern, wenn query sich ändert
  useEffect(() => {
    if (!query) {
      setFiltered(users);
      return;
    }
    setFiltered(
      users.filter((u) => u.name.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query, users]);

  useEffect(() => {
    onSelectedUsersChange(selectedUsers);
  }, [selectedUsers, onSelectedUsersChange]);

  return (
    <div className="w-full max-w-md">
      <input
        type="text"
        placeholder="Mitglieder hinzufügen..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border-0 focus:outline-none text-2xl! rounded"
      />

      <ul
        className="mt-2 flex flex-col gap-2 h-60 overflow-y-auto"
        style={{
          scrollbarColor: "rgba(0, 0, 0, 0.1) transparent",
          scrollbarWidth: "thin",
        }}
      >
        {filtered
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((user) => (
            <li key={user.id}>
              <button
                className="w-full flex gap-2 text-start p-2"
                onClick={() => setSelectedUsers((prev) => [...prev, user.name])}
              >
                <span className="font-bold text-xl">{user.name[0]}</span>
                <span className="font-bold text-xl">{user.name}</span>
                <FiPlus aria-hidden="true" className="ml-auto text-gray-500" />
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
