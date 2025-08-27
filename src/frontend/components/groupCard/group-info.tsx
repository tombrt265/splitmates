export const GroupInfo = () => {
  const group = {
    name: "Gruppe 1",
    members: ["Max", "Erika", "John"],
    creationDate: "01.01.2024",
  };
  return (
    <>
      <h2>{group.name}</h2>
      <h6>Erstellt am: {group.creationDate}</h6>
      <ul className="flex text-2xl">
        <li>Mitglieder:</li>
        {group.members.map((member) => (
          <li key={member} className="mx-2">
            {member}
          </li>
        ))}
      </ul>
    </>
  );
};
