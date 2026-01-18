import { useAuth0 } from "@auth0/auth0-react";
import { PageLayout } from "../components/page-layout";
import { useCallback, useEffect, useState } from "react";
import { GroupsDialog } from "../components/groupsDialog";
import { useNavigate } from "react-router-dom";
import { FiChevronRight, FiPlus } from "react-icons/fi";
import { PageLoader } from "../components/page-loader";

import {
  createGroupAPI,
  createInviteLinkAPI,
  getGroupsOfUserAPI,
} from "../api";
import { ApiErrorResponse, Group } from "../models";

export const GroupsPage = () => {
  const { user, isLoading } = useAuth0();
  const auth0_sub = user?.sub;
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupError, setGroupError] = useState<string>("");
  const [groupsLoading, setGroupsLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const fetchGroups = useCallback(async () => {
    if (!auth0_sub) return;
    try {
      setGroupsLoading(true);

      const res = await getGroupsOfUserAPI(auth0_sub);
      setGroups(res.data);

      setGroupsLoading(false);
    } catch (err) {
      const error = err as ApiErrorResponse;
      setGroupError(error.error.message);
    }
  }, [auth0_sub]);

  useEffect(() => {
    if (!isLoading && auth0_sub) {
      fetchGroups();
    }
  }, [isLoading, auth0_sub, fetchGroups]);

  const handleCreateGroup = async (
    name: string,
    category: string,
  ): Promise<{ group: any; inviteLink: string } | ApiErrorResponse> => {
    try {
      const res = await createGroupAPI(name, category, auth0_sub!);
      const res_invite = await createInviteLinkAPI(res.data.id);
      // await fetchGroups();
      return { group: res.data, inviteLink: res_invite.data.invite_link };
    } catch (err) {
      return err as ApiErrorResponse;
    }
  };

  const handleGroupClick = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };

  if (groupsLoading) return <PageLoader />;

  return (
    <PageLayout>
      <div className="w-full max-w-3xl mx-auto my-auto flex flex-col items-center gap-6 p-6">
        <div className="flex flex-col items-center justify-center p-8 bg-blue-50 rounded-lg shadow-md w-[400px]">
          <h1 className="text-4xl! mt-0!">My Groups</h1>
          <ul className="flex flex-col gap-2 w-full">
            {groups.map((group) => (
              <li key={group.id}>
                <button
                  onClick={() => handleGroupClick(group.id)}
                  className="w-full bg-white rounded-lg p-2 cursor-pointer flex items-center justify-between"
                >
                  <h6>{group.name}</h6>
                  <FiChevronRight
                    aria-hidden="true"
                    className="text-gray-400"
                  />
                </button>
              </li>
            ))}
          </ul>
          <button
            className="action-button action-button--success mt-4"
            onClick={() => setDialogOpen(true)}
          >
            <FiPlus aria-hidden="true" size={16} />
            Create Group
          </button>

          <span className="mt-4 text-red-500 font-semibold">{groupError}</span>

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
