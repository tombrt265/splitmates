export const Spendings = () => {
  const lastSpendings = [
    { id: 1, description: "Tom", amount: 12.5 },
    { id: 2, description: "Emre", amount: 3.0 },
    { id: 3, description: "Louis", amount: 7.5 },
    { id: 4, description: "Anna", amount: 5.0 },
    { id: 5, description: "Mia", amount: 10.0 },
    { id: 6, description: "Max", amount: 8.0 },
  ];

  return (
    <>
      <h6>Letzte Ausgaben</h6>
      <ul
        className="overflow-x-auto flex gap-2 text-2xl"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "oklch(78.5% 0.115 274.713) transparent",
        }}
      >
        {lastSpendings.map((spending) => (
          <li key={spending.id}>
            <button className="bg-red-500 text-white py-1 px-4 rounded">
              {spending.amount} €
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};
