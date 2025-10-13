import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";

interface UserInfo {
  username: string;
  email: string;
  password: string;
  phone: string;
  avatarUrl: string;
}

export const ProfileView = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "john.doe",
    email: "john.doe@example.com",
    password: "********",
    phone: "+1234567890",
    avatarUrl: "/icon-profile.svg",
  });

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Header */}
      <div className="text-2xl font-semibold text-gray-600">
        <span>My Profile</span>
      </div>

      {/* Avatar and Name Box */}
      <div className="flex flex-row items-center gap-4 border border-gray-200 rounded-2xl p-4">
        <div
          className="rounded-full aspect-square h-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${userInfo.avatarUrl})` }}
        ></div>
        <div className="text-2xl">
          <span>{userInfo.username}</span>
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
              key === "avatarUrl" ? null : (
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
