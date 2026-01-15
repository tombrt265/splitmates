import { useState } from "react";
import { ExpensesDialog } from "./expenses-dialog";
import { FiPlus } from "react-icons/fi";

interface Expense {
  id: number;
  description: string;
  category: string;
  amount_cents: number;
  paidBy: string;
  created_at: string;
}

interface Member {
  name: string;
  avatarUrl: string;
  userID: string;
}

interface GroupSpendingsProps {
  expenses: Expense[];
  updateExpenses: () => void;
  members: Member[];
}

export const GroupSpendings = ({
  expenses,
  updateExpenses,
  members,
}: GroupSpendingsProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const formattedExpenses = expenses.map((expense) => ({
    ...expense,
    date: new Date(expense.created_at).toLocaleDateString("en-EN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }));

  return (
    <div className="bg-background rounded-2xl shadow-md p-6 flex flex-col gap-2 w-full">
      {/* Header with Add Button */}
      <div className="flex gap-4 items-center">
        <h3 className="text-2xl! my-2! font-semibold! text-black!">
          Recent Transactions
        </h3>
        <button
          className="p-2 bg-blue-400 text-primary rounded-md hover:bg-blue-500 transition-colors"
          onClick={() => setDialogOpen(true)}
        >
          <FiPlus size={14} />
        </button>
      </div>

      {/* Expense List */}
      {formattedExpenses.length > 0 ? (
        <div
          className="overflow-y-auto max-h-80 rounded-xl"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "oklch(70.7% 0.022 261.325) transparent",
          }}
        >
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10">
              <tr>
                {["Description", "Amount", "Paid By", "Involved", "Date"].map(
                  (column) => (
                    <th className="text-left pl-2 pb-2 text-lg">{column}</th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {formattedExpenses.map((expense, idx) => (
                <tr
                  key={expense.id}
                  className={
                    "transition-colors " +
                    (idx % 2 === 0
                      ? "bg-blue-100 hover:bg-blue-200"
                      : "hover:bg-blue-200")
                  }
                >
                  <td className="p-2">{expense.description}</td>
                  <td className="p-2">
                    {(expense.amount_cents / 100).toLocaleString("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </td>
                  <td className="py-2 px-4">
                    <img
                      src={
                        members.find((m) => m.name === expense.paidBy)
                          ?.avatarUrl || "https://via.placeholder.com/40"
                      }
                      className="w-8 h-8 rounded-full"
                      alt={expense.paidBy}
                    />
                  </td>
                  <td className="p-2 flex flex-row gap-2">
                    {members
                      .filter((m) => m.name !== expense.paidBy)
                      .map((m) => (
                        <img
                          key={m.userID}
                          src={m.avatarUrl}
                          alt={m.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ))}
                  </td>
                  <td className="p-2">{expense.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No entries found</p>
      )}

      {/* Expenses Dialog */}
      <ExpensesDialog
        dialogState={dialogOpen}
        onClose={() => setDialogOpen(false)}
        updateExpenses={updateExpenses}
        members={members}
      />
    </div>
  );
};
