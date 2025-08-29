import { useAuth0 } from "@auth0/auth0-react";
import { PageLayout } from "../components/page-layout";
import { useEffect, useState } from "react";
import { Dialog } from "../components/shared/dialog";
import UserSearch from "../components/shared/user-search";

export const GroupsPage = () => {
  const userId = useAuth0().user?.sub;
  const [groups, setGroups] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

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

  const handleSelectedUsersChange = (selectedUsers: string[]) => {
    setSelectedUsers(selectedUsers);
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
          <button
            className="bg-indigo-500 rounded-lg p-2 mt-4"
            onClick={() => setDialogOpen(true)}
          >
            <h6 className="text-white!">Gruppe erstellen</h6>
          </button>
          <Dialog
            isDialogOpen={dialogOpen}
            closeDialog={() => setDialogOpen(false)}
          >
            <input
              type="text"
              placeholder="Gruppenname"
              className="border-0 focus:outline-none p-2 w-full text-4xl! text-center font-bold my-8 border-y-2"
            />
            <UserSearch
              onSelectedUsersChange={(selectedUsers) => {
                handleSelectedUsersChange(selectedUsers);
              }}
            />
            <ul className="flex gap-4">
              {selectedUsers.map((user) => (
                <li key={user}>
                  <button
                    onClick={() =>
                      setSelectedUsers((prev) => prev.filter((u) => u !== user))
                    }
                  >
                    <span className="font-bold text-xl">{user[0]}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex gap-4">
              <button
                onClick={() => setDialogOpen(false)}
                className="mt-4 bg-red-500 text-white p-2 rounded"
              >
                <h6>Schließen</h6>
              </button>
              <button className="bg-green-500 text-white p-2 rounded mt-4">
                <h6>Erstellen</h6>
              </button>
            </div>
          </Dialog>
        </div>
      </div>
    </PageLayout>
  );
};
