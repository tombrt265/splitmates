import { FriendsCard } from "./friends-card";
import { GroupsCard } from "./groupsCard";
import { GroupCard } from "./groupCard/group-card";

export const Dashboard = () => {
  const friends = [
    { name: "Max Mustermann", icon: "M" },
    { name: "Erika Mustermann", icon: "E" },
    { name: "John Doe", icon: "J" },
    { name: "Jane Doe", icon: "J" },
    { name: "Max Mustermann", icon: "M" },
    { name: "Max Mustermann", icon: "M" },
    { name: "Max Mustermann", icon: "M" },
    { name: "Max Mustermann", icon: "M" },
    { name: "Max Mustermann", icon: "M" },
  ];

  const groups = [
    { name: "Gruppe 1", icon: "G1" },
    { name: "Gruppe 2", icon: "G2" },
    { name: "Gruppe 3", icon: "G3" },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden p-4 grid gap-4 md:grid-cols-[4fr_1fr] md:grid-rows-2">
      <GroupCard />

      <FriendsCard friends={friends} />

      <GroupsCard groups={groups} />
    </div>
  );
};
