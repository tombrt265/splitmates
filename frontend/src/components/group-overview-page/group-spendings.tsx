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

interface GroupSpendingsProps {
  expenses: Expense[]
  updateExpenses: () => void;
  members: { name: string; avatarUrl: string; userID: string }[];
}

export const GroupSpendings = ({
  expenses,
  updateExpenses,
  members,
}: GroupSpendingsProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  expenses.map((expense) => {
    expense.created_at = new Date(expense.created_at).toLocaleDateString("en-EN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return expense;
  });

  return (
    <div className="bg-gray-200 rounded-xl p-4 md:col-span-3">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-1">
        <h6>Last Expenses</h6>
        <button
          className="p-2 bg-blue-500 text-white rounded-md"
          onClick={() => setDialogOpen(true)}
        >
          <FiPlus size={15} />
        </button>
      </div>

      {/* Expense Table */}
      <div
        className="flex flex-col justify-center w-full"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "oklch(70.7% 0.022 261.325) transparent",
        }}
      >
        {expenses.length > 0 ? (
          <div className="overflow-y-auto max-h-70 border rounded-lg">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Paid By</th>
                  <th className="text-left p-2">Involved Members</th>
                  <th className="text-left p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-t hover:bg-gray-50">
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
                          members.find(
                            (member) => member.name === expense.paidBy
                          )?.avatarUrl || "https://via.placeholder.com/40"
                        }
                        className="w-8 h-8 rounded-full"
                      />
                    </td>
                    <td className="p-2 flex flex-row gap-2">
                      {members.map(
                        (member) =>
                          member.name !== expense.paidBy && (
                            <img
                              key={member.userID}
                              src={member.avatarUrl}
                              alt={member.name}
                              className="w-8 h-8 rounded-full"
                            />
                          )
                      )}
                    </td>
                    <td className="p-2">{expense.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xl text-gray-500 text-center">No entries found</p>
        )}
      </div>

      <ExpensesDialog
        dialogState={dialogOpen}
        onClose={() => setDialogOpen(false)}
        updateExpenses={updateExpenses}
        members={members}
      />
    </div>
  );
};
