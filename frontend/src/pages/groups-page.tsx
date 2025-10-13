import { useAuth0 } from "@auth0/auth0-react";
import { PageLayout } from "../components/page-layout";
import { useCallback, useEffect, useState } from "react";
import { GroupsDialog } from "../components/groupsDialog";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";

interface Group {
  id: number;
  name: string;
  category: string;
  avatar_url: string;
  owner_id: number;
}

export const GroupsPage = () => {
  const { user, isLoading } = useAuth0();
  const userId = user?.sub;
  const [groups, setGroups] = useState<Group[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const fetchGroups = useCallback(async () => {
    const res = await fetch(
      `${API_BASE}/api/groups?user_id=${encodeURIComponent(
        userId || ""
      )}`
    );
    if (!res.ok) throw new Error("Failed to fetch groups");
    const json = await res.json();
    setGroups(json);
  }, [userId]);

  useEffect(() => {
    if (!isLoading && userId) {
      fetchGroups();
    }
  }, [isLoading, userId, fetchGroups]);

  const handleGroupClick = (groupId: number) => {
    navigate(`/groups/${groupId}`);
  };

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg shadow-md">
          <h3>Meine Gruppen</h3>
          <ul className="flex flex-col gap-2 w-full">
            {groups.map((group) => (
              <li key={group.id}>
                <button
                  onClick={() => handleGroupClick(group.id)}
                  className="w-full bg-white rounded-lg p-2 cursor-pointer"
                >
                  <h6>{group.name}</h6>
                </button>
              </li>
            ))}
          </ul>
          <button
            className="bg-indigo-500 rounded-lg p-2 mt-4"
            onClick={() => {
              setDialogOpen(true);
              console.log("Create Group clicked");
            }}
          >
            <h6 className="text-white!">Gruppe erstellen</h6>
          </button>
          <GroupsDialog
            dialogState={dialogOpen}
            onClose={() => setDialogOpen(false)}
            updateGroups={fetchGroups}
          />
        </div>
      </div>
    </PageLayout>
  );
};
