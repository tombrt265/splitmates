import { NavLink } from "react-router-dom";

interface MobileNavBarTabProps {
  path: string;
  label: string;
  handleClick: () => void;
}

export const MobileNavBarTab = ({
  path,
  label,
  handleClick,
}: MobileNavBarTabProps) => {
  return (
    <NavLink
      onClick={handleClick}
      to={path}
      end
      className={({ isActive }) =>
        "flex flex-row font-medium text-[2rem] leading-4 p-[3.2rem_2.4rem] w-full shadow-[inset_0_-1.5px_0_rgb(90,95,102)] last:mr-0" +
        (isActive
          ? " underline decoration-solid decoration-[var(--indigo)] decoration-4 underline-offset-8"
          : "")
      }
    >
      {label}
    </NavLink>
  );
};
