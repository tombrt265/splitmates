interface GroupSpendingProps {
  expenses?: { id: number; description: string; amount: number; paidBy: string; date: string }[];
}

export const GroupSpendings = ({expenses}:GroupSpendingProps) => {
  

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
        {expenses ? expenses.map((spending) => (
          <li key={spending.id}>
            <button className="bg-gray-400 text-white py-1 px-4 rounded">
              {spending.amount} €
            </button>
          </li>
        )): <p className="text-xl">Keine Einträge vorhanden</p>}
      </ul>
      <button className="mt-2 p-2 bg-blue-500 text-white rounded-md">
        <span className="text-xl">Neuen Eintrag erstellen</span>
      </button>
    </div>
  );
};
