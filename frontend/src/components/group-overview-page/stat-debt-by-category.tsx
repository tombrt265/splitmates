interface CategoryStat {
  category: string;
  totalCents: number;
}

interface DebtByCategoryChartProps {
  stats: CategoryStat[];
}

const CATEGORY_COLORS: Record<string, string> = {
  food: "bg-[#7FC97F]", // sanftes, beruhigendes Grün
  utilities: "bg-[#FDC086]", // warmes, weiches Gelb-Orange
  travel: "bg-[#6BAED6]", // angenehmes Blau
  accomodation: "bg-[#BC80BD]", // mildes Lila
  entertainment: "bg-[#FF9F80]", // weiches Korall/Orange
  other: "bg-[#BEBEBE]", // neutales Grau
};

export function DebtByCategoryChart({ stats }: DebtByCategoryChartProps) {
  if (stats.length === 0) return null;

  const maxValue = Math.max(...stats.map((s) => s.totalCents));

  return (
    <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center h-80">
      <h2 className="text-xl! font-medium! text-gray-600! mb-3 mt-0!">
        Debt By Category
      </h2>

      <div className="flex items-end gap-4 h-full">
        {stats.map(({ category, totalCents }) => {
          const heightPercent = (totalCents / maxValue) * 100;
          const color =
            CATEGORY_COLORS[category.toLowerCase()] ?? CATEGORY_COLORS.other;

          return (
            <div
              key={category}
              className="flex flex-col items-center flex-1 h-full"
            >
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
