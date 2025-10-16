interface GroupMembersProps {
  members: { name: string; avatarUrl: string; userID: string }[];
  name: string;
  date: string;
  category: string;
  onDelete: () => void;
}

export const GroupMembers = ({
  members,
  name,
  category,
  date,
  onDelete,
}: GroupMembersProps) => {
  return (
    <div className="bg-gray-200 rounded-xl flex flex-col items-center py-8 order-0 md:order-1">
      <h3>{name}</h3>
      <p>{category}</p>
      <p>{date}</p>

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
            <button className="w-full bg-gray-300 rounded-full p-2 hover:bg-gray-400 transition-colors flex items-center gap-3">
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

      <button
        className="p-2 bg-red-500 text-white rounded-md mt-auto hover:bg-red-600 transition-colors"
        onClick={onDelete}
      >
        <span className="text-xl">Delete Group</span>
      </button>
    </div>
  );
};
