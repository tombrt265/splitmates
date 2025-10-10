interface GroupMembersProps {
  members: { name: string; icon: string }[];
  name: string;
  date: string;
  category: string;
}

export const GroupMembers = ({members, name, category, date}: GroupMembersProps) => {

  return (
    <div className="bg-gray-200 rounded-xl flex flex-col items-center py-8 order-0 md:order-1">
      <h3>{name}</h3>
      <p>{category}</p>
      <p>{date}</p>
      <h4>Mitglieder</h4>
      <ul
        className="w-full flex flex-col items-center overflow-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "oklch(78.5% 0.115 274.713) transparent",
        }}
      >
        {members.map((member) => (
          <li className="w-4/5 py-1" key={member.name}>
            <button className="w-full rounded-md p-2 bg-gray-300 flex">
              <h6 className="px-2">{member.icon}</h6>
              <h6>{member.name}</h6>
            </button>
          </li>
        ))}
      </ul>
      <button className="mt-2 p-2 bg-blue-500 text-white rounded-md">
        <span className="text-xl">Neues Mitglied hinzufügen</span>
      </button>
      <button className="p-2 bg-red-500 text-white rounded-md mt-auto">
        <span className="text-xl">Gruppe entfernen</span>
      </button>
    </div>
  );
};
