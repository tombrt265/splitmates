interface BarChartItem {
  label: string;
  value: number;
}

interface BarChartProps {
  title: string;
  data: BarChartItem[];
  maxBars?: number;
}

const DEFAULT_COLOR_PALETTE = [
  "#7FC97F", // Grün
  "#FDC086", // Gelb-Orange
  "#6BAED6", // Blau
  "#BC80BD", // Lila
  "#FF9F80", // Korall/Orange
  "#BEBEBE", // Grau
  "#8DD3C7", // Mint
  "#FFD92F", // Gelb
  "#80B1D3", // Blau 2
];

export const BarChart = ({ title, data, maxBars }: BarChartProps) => {
  if (!data || data.length === 0) return null;

  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const displayedData = maxBars ? sortedData.slice(0, maxBars) : sortedData;

  const maxValue = Math.max(...displayedData.map((d) => d.value));

  return (
    <div className="bg-gray-50 rounded-xl px-10 py-4 flex flex-col items-center h-80">
      <h2 className="text-xl! font-medium! text-gray-600 mt-0!">{title}</h2>

      <div className="flex items-end gap-4 w-full h-full">
        {displayedData.map((item, i) => {
          const heightPercent = (item.value / maxValue) * 100;
          const color = DEFAULT_COLOR_PALETTE[i % DEFAULT_COLOR_PALETTE.length];

          return (
            <div key={i} className="flex flex-col items-center flex-1 h-full">
              {/* Säule */}
              <div className="w-full flex items-end h-full">
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${heightPercent}%`,
                    backgroundColor: color,
                  }}
                  title={`${item.value}`}
                />
              </div>

              {/* Label */}
              <span className="mt-2 text-xs text-gray-500 text-center">
                {item.label}
              </span>
              <span className="text-xs font-medium text-gray-700">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
