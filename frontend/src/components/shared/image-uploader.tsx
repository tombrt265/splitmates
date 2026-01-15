import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";

export const ImageUploader = () => {
  const defaultAvatar = "/icon-profile.svg";
  const [avatarUrl, setAvatarUrl] = useState<string>(defaultAvatar);

  return (
    <div>
      <div
        className="rounded-full aspect-square h-30 mb-5 bg-cover bg-center"
        style={{ backgroundImage: `url(${avatarUrl})` }}
      ></div>
      <label className="cursor-pointer absolute -mt-14 ml-20 p-2 bg-background border border-widget rounded-full hover:bg-widget">
        <FiEdit2 />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                setAvatarUrl(reader.result as string);
              };
              reader.readAsDataURL(file);
              console.log(avatarUrl);
            }
          }}
        />
      </label>
    </div>
  );
};
