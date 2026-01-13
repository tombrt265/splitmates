interface BarChartItem {
  label: string;
  value: number;
}

interface BarChartProps {
  title: string;
  data: BarChartItem[];
  maxBars?: number;
  negative?: boolean; // <--- neuer Prop
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

export const BarChart = ({ title, data, maxBars, negative }: BarChartProps) => {
  if (!data || data.length === 0) return null;

  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const displayedData = maxBars ? sortedData.slice(0, maxBars) : sortedData;

  // Für negative Charts brauchen wir den Betrag
  const maxAbsValue = Math.max(...displayedData.map((d) => Math.abs(d.value)));

  return (
    <div className="bg-gray-50 rounded-xl px-10 py-4 flex flex-col items-center h-80">
      <h2 className="text-xl! font-medium! text-gray-600 mt-0!">{title}</h2>

      <div className="flex items-end gap-4 w-full h-full">
        {displayedData.map((item, i) => {
          const color = DEFAULT_COLOR_PALETTE[i % DEFAULT_COLOR_PALETTE.length];
          let barStyle: React.CSSProperties = {};
          let containerClass = "flex flex-col items-center flex-1";

          if (negative) {
            // Höhe als Prozent vom maximalen Betrag
            const heightPercent = (Math.abs(item.value) / maxAbsValue) * 50; // 50% nach oben, 50% nach unten
            barStyle = {
              height: `${heightPercent}%`,
              backgroundColor: color,
            };

            // Wrapper für negative Charts: pos. nach oben, neg. nach unten
            containerClass += " flex justify-end"; // bottom: 50% = 0
          } else {
            // klassisches Chart
            const heightPercent = (item.value / maxAbsValue) * 100;
            barStyle = {
              height: `${heightPercent}%`,
              backgroundColor: color,
            };
          }

          return (
            <div key={i} className={containerClass + " h-full relative"}>
              {/* Säule */}
              {negative ? (
                <div className="relative w-full h-full flex flex-col justify-center">
                  <div
                    className="absolute bottom-1/2 w-full rounded-t-md transition-all"
                    style={{
                      ...barStyle,
                      top: item.value >= 0 ? undefined : "50%",
                      bottom: item.value >= 0 ? "50%" : undefined,
                    }}
                    title={`${item.value}`}
                  />
                </div>
              ) : (
                <div className="w-full flex items-end h-full">
                  <div
                    className="w-full rounded-t-md transition-all"
                    style={barStyle}
                    title={`${item.value}`}
                  />
                </div>
              )}

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
