interface Friend {
  name: string;
  icon: string;
}

export const FriendsCard = ({ friends }: { friends: Friend[] }) => {
  return (
    <div className="bg-indigo-200 rounded-xl flex flex-col items-center">
      <h1>Freunde</h1>
      <ul
        className="w-full flex flex-col items-center overflow-auto"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "oklch(78.5% 0.115 274.713) transparent",
        }}
      >
        {friends.map((friend) => (
          <li className="w-4/5 py-1 nth-[0]:py-0" key={friend.name}>
            <a
              href="#"
              className="inline-block w-full rounded-md p-2 bg-indigo-300"
            >
              <span className="px-2">{friend.icon}</span>
              <span>{friend.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
