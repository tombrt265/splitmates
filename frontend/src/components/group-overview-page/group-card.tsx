import { GroupSpendings } from "./group-spendings";

interface GroupCardProps {
  expenses: {
    id: number;
    description: string;
    amount: number;
    paidBy: string;
    date: string;
  }[];
  updateExpenses: () => void;
  members: { name: string; avatarUrl: string; userID: string }[];
}

export const GroupCard = ({
  expenses,
  updateExpenses,
  members,
}: GroupCardProps) => {
  return (
    <div className="bg-gray-100 rounded-xl p-4 order-1 md:order-0">
      <div className="grid gap-4 h-full grid-cols-1 md:grid-cols-3 md:grid-rows-3">
        {/* Placeholder charts */}
        {["Debt by Person", "Debt by Category", "Money Spent"].map((title) => (
          <div
            key={title}
            className="bg-gray-200 rounded-md p-2 !text-gray-400 flex flex-col items-center justify-center"
          >
            <h4 className="!text-gray-400">{title} – Coming soon...</h4>
          </div>
        ))}

        {/* Overall Debt */}
        <div className="bg-gray-200 rounded-md p-2 md:col-span-3 !text-gray-400 flex flex-col items-center justify-center">
          <h4 className="!text-gray-400">Overall Debt – Coming soon...</h4>
        </div>

        {/* Expenses */}
        <GroupSpendings
          expenses={expenses}
          updateExpenses={updateExpenses}
          members={members}
        />
      </div>
    </div>
  );
};
