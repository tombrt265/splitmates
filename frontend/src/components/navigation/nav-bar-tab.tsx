import { NavLink } from "react-router-dom";

interface NavBarTabProps {
  path: string;
  label: string;
  isCollapsed: boolean;
  icon: string;
}

export const NavBarTab = ({
  path,
  label,
  isCollapsed,
  icon,
}: NavBarTabProps) => {
  return (
    <div className="h-12">
      <NavLink to={path} end className="flex items-center h-full">
        <img src={icon} alt={label} className="mr-2 h-full" />
        {!isCollapsed && <h6 className="">{label}</h6>}
      </NavLink>
    </div>
  );
};
