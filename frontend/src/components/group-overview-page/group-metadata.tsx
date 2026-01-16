import { useState } from "react";
import { FiCheck, FiCopy, FiTrash2 } from "react-icons/fi";
import { BalancesDialog } from "./balances-dialog";

interface Member {
  name: string;
  avatarUrl?: string;
  userID: string;
}

interface GroupMembersProps {
  members: Member[];
  name: string;
  category: string;
  date: string;
  groupId?: string;
  onDelete: () => void;
  onCreateLink: () => void;
}

export const GroupMetadata = ({
  members,
  name,
  category,
  date,
  groupId,
  onDelete,
  onCreateLink,
}: GroupMembersProps) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4">
      {/* Group Info */}
      <div className="flex flex-col items-center gap-1 text-center">
        <h1 className="text-4xl! font-semibold m-0!">{name}</h1>
        <span className="text-gray-400 text-sm">
          {new Date(date).toLocaleDateString("en-EN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span className="bg-blue-400 rounded-md font-semibold text-white py-1 px-2">
          {category}
        </span>
      </div>

      {/* Members List */}
      <div className="flex flex-col gap-2 max-h-72 overflow-y-auto px-2">
        <h2 className="text-xl! mt-2! mb-0! font-medium text-gray-700 self-center">
          Members ({members.length})
        </h2>
        <ul className="flex flex-wrap justify-center gap-2">
          {members.map((member) => (
            <li key={member.userID}>
              <button
                onClick={() => setSelectedMember(member)}
                className="cursor-pointer"
                aria-label={`View balances for ${member.name}`}
              >
                {member.avatarUrl && (
                  <div
                    className="rounded-full aspect-square h-12 w-12 bg-cover bg-center flex-shrink-0"
                    style={{ backgroundImage: `url(${member.avatarUrl})` }}
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="self-center flex gap-2">
        {/* Invite Link */}
        <button
          className="action-button action-button--primary w-fit self-center"
          onClick={() => {
            onCreateLink();
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
          }}
        >
          {copySuccess ? (
            <FiCheck aria-hidden="true" className="text-white" />
          ) : (
            <FiCopy aria-hidden="true" className="text-white" />
          )}
          <span className="text-md font-semibold text-white">
            {copySuccess ? "Link copied!" : "Copy Invitation Link"}
          </span>
        </button>

        {/* Delete Button */}
        <button
          className="action-button action-button--danger w-fit self-center"
          onClick={onDelete}
        >
          <FiTrash2 aria-hidden="true" />
          Delete Group
        </button>
      </div>

      {/* Balances Dialog */}
      {selectedMember && groupId && (
        <BalancesDialog
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          groupId={groupId}
          userId={selectedMember.userID}
          memberName={selectedMember.name}
        />
      )}
    </div>
  );
};
