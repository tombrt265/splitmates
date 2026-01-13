import { useState } from "react";
import { ExpensesDialog } from "./expenses-dialog";
import { FiPlus } from "react-icons/fi";

interface Expense {
  id: number;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
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
    date: new Date(expense.date).toLocaleDateString("en-EN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }));

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-2 w-full">
      {/* Header with Add Button */}
      <div className="flex gap-4 items-center">
        <h3 className="text-xl! my-2! font-semibold text-gray-800">
          Recent Transactions
        </h3>
        <button
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
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
                <th className="text-left pl-2 text-lg text-gray-600">
                  Description
                </th>
                <th className="text-left p-2 text-lg text-gray-600">Amount</th>
                <th className="text-left p-2 text-lg text-gray-600">Paid By</th>
                <th className="text-left p-2 text-lg text-gray-600">
                  Involved
                </th>
                <th className="text-left p-2 text-lg text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {formattedExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className=" hover:bg-gray-50 transition-colors"
                >
                  <td className="p-2">{expense.description}</td>
                  <td className="p-2">
                    {expense.amount.toLocaleString("de-DE", {
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
