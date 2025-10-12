import { GroupSpendings } from "./group-spendings";

interface GroupCardProps {
  expenses?: { id: number; description: string; amount: number; paidBy: string; date: string }[];
  updateExpenses: () => void;
  members: { name: string; icon: string }[];
}

export const GroupCard = ({ expenses, updateExpenses, members }: GroupCardProps) => {
  return (
    <div className="bg-gray-100 rounded-xl md:row-span-1 p-4 order-1 md:order-0">
      <div className="grid gap-4 h-full grid-cols-1 md:grid-cols-3 md:grid-rows-3">
        {/* Debt by Person */}
        <div className="bg-gray-200 rounded-md p-2">
          <h4>Schulden nach Person</h4>
          <p className="text-2xl">Balkendiagramm</p>
        </div>

        {/* Debt by Category */}
        <div className="bg-gray-200 rounded-md p-2">
          <h4>Schulden nach Kategorie</h4>
          <p className="text-2xl">Kreisdiagramm</p>
        </div>

        {/* Money spent by Person */}
        <div className="bg-gray-200 rounded-md p-2">
          <h4>Ausgaben nach Person</h4>
          <p className="text-2xl">Balkendiagramm</p>
        </div>

        {/* Overall Debt (volle Breite) */}
        <div className="bg-gray-200 rounded-md p-2 md:col-span-3">
          <h4>Schuldenübersicht</h4>
          <p className="text-2xl">
            Liniendiagramm - Schulden[€] in den letzten 30 Tagen (von ganz links
            nach ganz rechts)
          </p>
        </div>

        {/* Last Spendings */}
        <GroupSpendings expenses={expenses} updateExpenses={updateExpenses} members={members}/>
      </div>
    </div>
  );
};
