export const GroupSpendings = () => {
  const lastSpendings = [
    { id: 1, description: "Tom", amount: 12.5 },
    { id: 2, description: "Emre", amount: 3.0 },
    { id: 3, description: "Louis", amount: 7.5 },
    { id: 4, description: "Anna", amount: 5.0 },
    { id: 5, description: "Mia", amount: 10.0 },
    { id: 6, description: "Max", amount: 8.0 },
  ];

  return (
    <div className="bg-gray-200 rounded-xl p-4 md:col-span-3">
      <h4>Letzte Einträge</h4>
      <ul
        className="overflow-x-auto flex gap-2 text-2xl"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "oklch(78.5% 0.115 274.713) transparent",
        }}
      >
        {lastSpendings.map((spending) => (
          <li key={spending.id}>
            <button className="bg-gray-400 text-white py-1 px-4 rounded">
              {spending.amount} €
            </button>
          </li>
        ))}
      </ul>
      <button className="mt-2 p-2 bg-blue-500 text-white rounded-md">
        <span className="text-xl">Neuen Eintrag erstellen</span>
      </button>
    </div>
  );
};
