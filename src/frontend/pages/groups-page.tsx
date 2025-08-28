import { useAuth0 } from "@auth0/auth0-react";
import { PageLayout } from "../components/page-layout";
import { useEffect, useState } from "react";

export const GroupsPage = () => {
  const userId = useAuth0().user?.sub;
  const [groups, setGroups] = useState<string[]>([]);

  useEffect(() => {
    const fetchGroups = async () => {
      const res = await fetch(
        `/api/groups?userId=${encodeURIComponent(userId || "")}`
      );
      if (!res.ok) throw new Error("Failed to fetch groups");
      const json = await res.json();
      setGroups(json);
    };
    fetchGroups();
  });

  const handleGroupClick = (group: string) => {
    console.log("Group clicked:", group);
  };

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg shadow-md">
          <h3>Meine Gruppen</h3>
          <ul className="flex flex-col gap-2 w-full">
            {groups.map((group) => (
              <li key={group}>
                <button
                  className="w-full bg-white rounded-lg p-2 cursor-pointer"
                  onClick={() => handleGroupClick(group)}
                >
                  <h6>{group}</h6>
                </button>
              </li>
            ))}
          </ul>
          <button className="bg-indigo-500 rounded-lg p-2 mt-4">
            <h6 className="text-white!">Gruppe erstellen</h6>
          </button>
        </div>
      </div>
    </PageLayout>
  );
};
