import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";

export const ProfileView = () => {
  const [userInfo, setUserInfo] = useState<{ [key: string]: string }>({
    Username: "",
    Email: "",
    AvatarUrl: "",
  });

  const { user, isAuthenticated, isLoading } = useAuth0();
  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated || !user)
    return <div>Please log in to view your profile.</div>;

  useEffect(() => {
    if (user) {
      setUserInfo({
        Username: user["https://splitmates.vercel.app/username"],
        Email: user.email!,
        AvatarUrl: user.picture!,
      });
    }
  }, [user]);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Avatar and Name Box */}
      <div className="flex flex-row items-center gap-4 border border-gray-200 rounded-2xl p-4">
        <div
          className="rounded-full aspect-square h-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${userInfo.AvatarUrl})` }}
        ></div>
        <div className="text-2xl">
          <span>{userInfo.Username}</span>
        </div>
        <label className="ml-auto cursor-pointer hover:text-gray-500 p-2 rounded-full">
          <FiEdit2 />
        </label>
      </div>

      {/* Personal Information Box */}
      <div className="flex flex-row items-center border border-gray-200 rounded-2xl p-4">
        <div>
          <div className="text-2xl font-semibold text-gray-600">
            <span>Personal Information</span>
          </div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-4 mt-4">
            {Object.entries(userInfo).map(([key, value]) =>
              key === "AvatarUrl" ? null : (
                <div className="flex flex-col text-xl" key={key}>
                  <span className="text-gray-500 font-semibold">{key}</span>
                  <span>{value}</span>
                </div>
              )
            )}
          </div>
        </div>
        <label className="ml-auto cursor-pointer hover:text-gray-500 p-2 rounded-full">
          <FiEdit2 />
        </label>
      </div>

      {/* Placeholder for additional boxes */}
      {/* <div className="border border-gray-200 rounded-2xl p-4">BOX 3</div> */}
    </div>
  );
};
