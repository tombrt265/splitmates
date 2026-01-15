import { useAuth0 } from "@auth0/auth0-react";
import { PageLayout } from "../components/page-layout";
import { useCallback, useEffect, useState } from "react";
import { GroupsDialog } from "../components/groupsDialog";
import { useNavigate } from "react-router-dom";
import {
  createGroupAPI,
  createInviteLinkAPI,
  getGroupsOfUserAPI,
} from "../api";

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
    const json = await getGroupsOfUserAPI(userId);
    setGroups(json);
  }, [userId]);

  useEffect(() => {
    if (!isLoading && userId) {
      fetchGroups();
    }
  }, [isLoading, userId, fetchGroups]);

  const handleCreateGroup = async (name: string, category: string) => {
    const group = await createGroupAPI(name, category, userId!);
    const data = await createInviteLinkAPI(group.id);
    await fetchGroups();
    return { group, inviteLink: data.invite_link };
  };

  const handleGroupClick = (groupId: number) => {
    navigate(`/groups/${groupId}`);
  };

  return (
    <PageLayout>
      <div className="w-full max-w-3xl mx-auto my-auto flex flex-col items-center gap-6 p-6">
        <div className="flex flex-col items-center justify-center p-8 bg-widget rounded-lg shadow-md w-[400px]">
          <h1 className="text-4xl! mt-0!">My Groups</h1>
          <ul className="flex flex-col gap-2 w-full">
            {groups.map((group) => (
              <li key={group.id}>
                <button
                  onClick={() => handleGroupClick(group.id)}
                  className="w-full bg-widget rounded-lg p-2 cursor-pointer"
                >
                  <h6>{group.name}</h6>
                </button>
              </li>
            ))}
          </ul>
          <button
            className="bg-blue-400 rounded-lg p-2 mt-4"
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
