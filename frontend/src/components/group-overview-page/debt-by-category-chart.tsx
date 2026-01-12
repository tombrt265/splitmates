interface CategoryStat {
  category: string;
  totalCents: number;
}

interface DebtByCategoryChartProps {
  stats: CategoryStat[];
}

const CATEGORY_COLORS: Record<string, string> = {
  food: "bg-green-500",
  utilities: "bg-red-500",
  travel: "bg-blue-500",
  accomodation: "bg-purple-500",
  entertainment: "bg-orange-500",
  other: "bg-gray-500",
};

export function DebtByCategoryChart({ stats }: DebtByCategoryChartProps) {
  if (stats.length === 0) return null;

  const maxValue = Math.max(...stats.map((s) => s.totalCents));

  return (
    <div className="bg-gray-100 rounded-md p-4">
      <h3 className="text-sm font-medium text-gray-600 mb-3">
        Ausgaben nach Kategorie
      </h3>

      <div className="flex items-end gap-4 h-40">
        {stats.map(({ category, totalCents }) => {
          const heightPercent = (totalCents / maxValue) * 100;
          const color = CATEGORY_COLORS[category] ?? CATEGORY_COLORS.other;

          return (
            <div key={category} className="flex flex-col items-center flex-1">
              {/* Säule */}
              <div className="w-full flex items-end h-full">
                <div
                  className={`${color} w-full rounded-t-md transition-all`}
                  style={{ height: `${heightPercent}%` }}
                  title={`${(totalCents / 100).toFixed(2)} €`}
                />
              </div>

              {/* Label */}
              <span className="mt-2 text-xs text-gray-500 text-center">
                {category}
              </span>
              <span className="text-xs font-medium text-gray-700">
                {(totalCents / 100).toFixed(0)} €
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
