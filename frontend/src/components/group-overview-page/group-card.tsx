import { GroupSpendings } from "./group-spendings";
import { DebtByCategoryChart } from "./debt-by-category-chart";

interface Expense {
  id: number;
  description: string;
  category: string;
  amount_cents: number;
  paidBy: string;
  created_at: string;
}

interface GroupCardProps {
  expenses: Expense[];
  updateExpenses: () => void;
  members: { name: string; avatarUrl: string; userID: string }[];
}

export const GroupCard = ({
  expenses,
  updateExpenses,
  members,
}: GroupCardProps) => {
  const expensesByCategory = expenses.reduce<Record<string, number>>(
    (acc, expense) => {
      acc[expense.category] =
        (acc[expense.category] ?? 0) + expense.amount_cents;
      return acc;
    },
    {}
  );

  const categoryStats = Object.entries(expensesByCategory).map(
    ([category, totalCents]) => ({
      category,
      totalCents,
    })
  );
  categoryStats.sort((a, b) => b.totalCents - a.totalCents);

  return (
    <div className="bg-gray-100 rounded-xl p-4 order-1 md:order-0">
      <div className="grid gap-4 h-full grid-cols-1 md:grid-cols-3 md:grid-rows-3">
        {/* Debt By Person */}
        <div className="bg-gray-200 rounded-md p-2 !text-gray-400 flex flex-col items-center justify-center">
          <h4 className="!text-gray-400">Debt By Person – Coming soon...</h4>
        </div>

        {/* Debt By Category */}
        <DebtByCategoryChart stats={categoryStats} />

        {/* Money Spent */}
        <div className="bg-gray-200 rounded-md p-2 !text-gray-400 flex flex-col items-center justify-center">
          <h4 className="!text-gray-400">Money Spent – Coming soon...</h4>
        </div>

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
