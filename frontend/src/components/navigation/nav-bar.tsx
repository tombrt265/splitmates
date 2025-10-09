import { useState } from "react";
import { NavBarBrand } from "../nav-bar-brand";
import { NavBarButtons } from "../nav-bar-buttons";
import { NavBarTabs } from "../nav-bar-tabs";

export const NavBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav className="flex flex-col bg-gray-100 items-start justify-center px-8 py-8 w-max">
      <NavBarBrand
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      <NavBarTabs isCollapsed={isCollapsed} />
      <NavBarButtons isCollapsed={isCollapsed} />
    </nav>
  );
};
