import { Spendings } from "./spendings";
import { Debts } from "./debts";
import { OpenClaims } from "./open-claims";
import { GroupInfo } from "./group-info";

export const GroupCard = () => {
  return (
    <div className="bg-indigo-300 rounded-xl md:row-span-2 p-4">
      <div className="grid grid-rows-[1fr_5fr] gap-4 h-full">
        {/* obere Zeile mit 3 Boxen */}
        <div className="grid grid-cols-[2fr_1fr_1fr] gap-4">
          <div className="bg-indigo-100 rounded-xl p-4">
            <Spendings />
          </div>
          <div className="bg-indigo-100 rounded-xl p-4">
            <Debts />
          </div>
          <div className="bg-indigo-100 rounded-xl p-4">
            <OpenClaims />
          </div>
        </div>

        {/* untere große Box */}
        <div className="bg-indigo-200 rounded-xl p-4">
          <GroupInfo />
        </div>
      </div>
    </div>
  );
};
