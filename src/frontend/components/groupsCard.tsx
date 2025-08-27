interface Group {
  name: string;
  icon: string;
}

export const GroupsCard = ({ groups }: { groups: Group[] }) => {
  return (
    <div className="bg-indigo-200 rounded-xl flex flex-col items-center">
      <h1>Gruppen</h1>
      <ul
        className="w-full flex flex-col items-center overflow-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "oklch(78.5% 0.115 274.713) transparent",
        }}
      >
        {groups.map((group) => (
          <li className="w-4/5 py-1 nth-[0]:py-0" key={group.name}>
            <a
              href="#"
              className="inline-block w-full rounded-md p-2 bg-indigo-300"
            >
              <span className="px-2">{group.icon}</span>
              <span>{group.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
