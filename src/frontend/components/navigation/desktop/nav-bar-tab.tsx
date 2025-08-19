import { NavLink } from "react-router-dom";

interface NavBarTabProps {
  path: string;
  label: string;
}

export const NavBarTab = ({ path, label }: NavBarTabProps) => {
  return (
    <NavLink
      to={path}
      end
      className={({ isActive }) =>
        "max-[340px]:text-[1.3rem] max-sm:text-2xl flex flex-row justify-center mr-6 font-medium text-2xl leading-4 last:mr-0" +
        (isActive
          ? " max-[340px]:no-underline max-[340px]:text-[color:var(--pink)] max-sm:no-underline text-[color:var(--pink)] underline decoration-solid decoration-[color:var(--indigo)] decoration-4 underline-offset-8"
          : "")
      }
    >
      {label}
    </NavLink>
  );
};
