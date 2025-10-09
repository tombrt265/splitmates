import { GroupCard } from "../src/components/groupCard/group-card";
import { GroupMembers } from "../src/components/groupCard/group-members";

export const Dashboard = () => {
  return (
    <div className="h-full p-4 grid gap-4 md:grid-cols-[4fr_1fr] md:grid-rows-1">
      <GroupCard />
      <GroupMembers />
    </div>
  );
};
