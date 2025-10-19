import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
import { BalancesDialog } from "./balances-dialog";

interface GroupMembersProps {
  members: { name: string; avatarUrl: string; userID: string }[];
  name: string;
  date: string;
  category: string;
  groupId: string;
  onDelete: () => void;
  onCreateLink: () => void;
}

export const GroupMembers = ({
  members,
  name,
  category,
  date,
  groupId,
  onDelete,
  onCreateLink,
}: GroupMembersProps) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{
    name: string;
    avatarUrl: string;
    userID: string;
  } | null>(null);

  return (
    <div className="bg-gray-200 rounded-xl flex flex-col items-center py-8 order-0 md:order-1">
      <h3>{name}</h3>
      <p>{category}</p>
      <p>{date}</p>
      <div className="flex items-center gap-2">
        <span>{copySuccess ? "Link copied!" : "Copy invite link"}</span>
        <button
          className="p-1"
          onClick={() => {
            onCreateLink();
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
          }}
        >
          {copySuccess ? <FiCheck /> : <FiCopy />}
        </button>
      </div>

      <h4 className="mt-4">Members</h4>
      <ul
        className="w-full flex flex-col items-center overflow-auto gap-2 px-4"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "oklch(78.5% 0.115 274.713) transparent",
        }}
      >
        {members.map((member) => (
          <li className="w-11/12" key={member.userID}>
            <button
              onClick={() => setSelectedMember(member)}
              className="w-full bg-gray-300 rounded-full p-2 hover:bg-gray-400 transition-colors flex items-center gap-3"
            >
              {member.avatarUrl && (
                <div
                  className="rounded-full aspect-square h-12 w-12 bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${member.avatarUrl})` }}
                ></div>
              )}
              <h6 className="text-left font-medium">{member.name}</h6>
            </button>
          </li>
        ))}
      </ul>

      {selectedMember && groupId && (
        <BalancesDialog
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          groupId={groupId}
          userId={selectedMember.userID}
          memberName={selectedMember.name}
        />
      )}

      <button
        className="p-2 bg-red-500 text-white rounded-md mt-auto hover:bg-red-600 transition-colors"
        onClick={onDelete}
      >
        <span className="text-xl">Delete Group</span>
      </button>
    </div>
  );
};
