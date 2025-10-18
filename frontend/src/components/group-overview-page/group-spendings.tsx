import { useState } from "react";
import { ExpensesDialog } from "./expenses-dialog";
import { FiPlus } from "react-icons/fi";

interface GroupSpendingsProps {
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

export const GroupSpendings = ({
  expenses,
  updateExpenses,
  members,
}: GroupSpendingsProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="bg-gray-200 rounded-xl p-4 md:col-span-3">
      <div className="flex justify-between items-center mb-2">
        <h4>Last Expenses</h4>
        <button
          className="p-2 bg-blue-500 text-white rounded-md"
          onClick={() => setDialogOpen(true)}
        >
          <FiPlus size={20} />
        </button>
      </div>

      {expenses.length > 0 ? (
        <ul
          className="overflow-x-auto flex flex-wrap gap-2 text-2xl"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "oklch(78.5% 0.115 274.713) transparent",
          }}
        >
          {expenses.map((spending) => (
            <li key={spending.id}>
              <button className="bg-gray-400 text-white py-1 px-4 rounded">
                {spending.description}: {spending.amount} €
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xl text-gray-500">No entries found</p>
      )}

      <ExpensesDialog
        dialogState={dialogOpen}
        onClose={() => setDialogOpen(false)}
        updateExpenses={updateExpenses}
        members={members}
      />
    </div>
  );
};
