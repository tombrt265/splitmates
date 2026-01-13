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

  /** Lädt Gruppen des aktuellen Nutzers */
  const fetchGroups = useCallback(async () => {
    if (!userId) return;
    const res = await fetch(
      `${API_BASE}/api/groups?user_id=${encodeURIComponent(userId)}`
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

  const handleCreateGroup = async (name: string, category: string) => {
    const res = await fetch(`${API_BASE}/api/groups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        category,
        avatar_url: "https://example.com/avatar.jpg",
        auth0_sub: userId,
      }),
    });
    if (!res.ok) throw new Error("Fehler beim Erstellen der Gruppe");

    const group = await res.json();

    const inviteRes = await fetch(`${API_BASE}/api/groups/${group.id}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!inviteRes.ok) throw new Error("Fehler beim Abrufen des Gruppenlinks");

    const data = await inviteRes.json();
    await fetchGroups();

    return { group, inviteLink: data.invite_link };
  };

  const handleGroupClick = (groupId: number) => {
    navigate(`/groups/${groupId}`);
  };

  return (
    <PageLayout>
      <div className="w-full max-w-3xl mx-auto my-auto flex flex-col items-center gap-6 p-6">
        <div className="flex flex-col items-center justify-center p-8 bg-blue-100 rounded-lg shadow-md w-[400px]">
          <h1 className="text-4xl! mt-0!">My Groups</h1>
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
            className="bg-blue-600 rounded-lg p-2 mt-4"
            onClick={() => setDialogOpen(true)}
          >
            <h6 className="text-white!">Create Group</h6>
          </button>

          {/* Dialog */}
          <GroupsDialog
            dialogState={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onCreateGroup={handleCreateGroup}
            viewGroup={handleGroupClick}
          />
        </div>
      </div>
    </PageLayout>
  );
};
