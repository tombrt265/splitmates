interface GroupMembersProps {
  members: { name: string; avatarUrl: string; userID: string }[];
  name: string;
  date: string;
  category: string;
}

export const GroupMembers = ({
  members,
  name,
  category,
  date,
}: GroupMembersProps) => {
  return (
    <div className="bg-gray-200 rounded-xl flex flex-col items-center py-8 order-0 md:order-1">
      <h3>{name}</h3>
      <p>{category}</p>
      <p>{date}</p>
      <h4>Members</h4>
      <ul
        className="w-full flex flex-col items-center overflow-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "oklch(78.5% 0.115 274.713) transparent",
        }}
      >
        {members.map((member) => (
          <li className="w-4/5 py-1" key={member.userID}>
            <button className="w-full rounded-md p-2 bg-gray-300 flex">
              {member.avatarUrl && (
                <div
                  className="rounded-full aspect-square h-20 bg-cover bg-center"
                  style={{ backgroundImage: `url(${member.avatarUrl})` }}
                ></div>
              )}
              <h6>{member.name}</h6>
            </button>
          </li>
        ))}
      </ul>
      <button className="p-2 bg-red-500 text-white rounded-md mt-auto">
        <span className="text-xl">Delete Group</span>
      </button>
    </div>
  );
};
