import { useState } from "react";
import { ExpensesDialog } from "../expenses-dialog";

interface GroupSpendingProps {
  expenses?: {
    id: number;
    description: string;
    amount: number;
    paidBy: string;
    date: string;
  }[];
  updateExpenses: () => void;
  members: { name: string; icon: string }[];
}

export const GroupSpendings = ({
  expenses,
  updateExpenses,
  members,
}: GroupSpendingProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchExpenses = async () => {
    updateExpenses();
  };

  return (
    <div className="bg-gray-200 rounded-xl p-4 md:col-span-3">
      <h4>Last Expenses</h4>
      <ul
        className="overflow-x-auto flex gap-2 text-2xl"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "oklch(78.5% 0.115 274.713) transparent",
        }}
      >
        {expenses ? (
          expenses.map((spending) => (
            <li key={spending.id}>
              <button className="bg-gray-400 text-white py-1 px-4 rounded">
                {spending.amount} €
              </button>
            </li>
          ))
        ) : (
          <p className="text-xl">No entries found</p>
        )}
      </ul>
      <button
        className="mt-2 p-2 bg-blue-500 text-white rounded-md"
        onClick={() => setDialogOpen(true)}
      >
        <span className="text-xl">Create New Entry</span>
      </button>
      <ExpensesDialog
        dialogState={dialogOpen}
        onClose={() => setDialogOpen(false)}
        updateExpenses={fetchExpenses}
        members={members}
      />
    </div>
  );
};
