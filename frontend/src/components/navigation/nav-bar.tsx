import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { NavBarTab } from "./nav-bar-tab";
import { LoginButton } from "../buttons/login-button";
import { LogoutButton } from "../buttons/logout-button";

export const NavBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAuthenticated } = useAuth0();

  const logo = "/logo.svg";
  const iconGroups = "/icon-groups.svg";
  const iconProfile = "/icon-profile.svg";

  return (
    <nav className="flex flex-col bg-gray-100 items-start justify-center px-8 py-8 w-max">
      {/* === Brand === */}
      <div className="flex items-center h-15 gap-6 mb-12">
        <button
          className="flex items-center h-full"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <img className="h-full" src={logo} alt="SplitMates logo" />
          {!isCollapsed && <h4>Splitmates</h4>}
        </button>
      </div>

      {/* === Tabs === */}
      <div className="flex flex-col items-start gap-4">
        {isAuthenticated && (
          <>
            <NavBarTab
              path="/groups"
              label="Groups"
              isCollapsed={isCollapsed}
              icon={iconGroups}
            />
            <NavBarTab
              path="/account"
              label="My Account"
              isCollapsed={isCollapsed}
              icon={iconProfile}
            />
          </>
        )}
      </div>

      {/* === Buttons === */}
      <div className="mt-auto flex flex-col items-center gap-4 w-full">
        {!isAuthenticated ? (
          <LoginButton isCollapsed={isCollapsed} />
        ) : (
          <LogoutButton isCollapsed={isCollapsed} />
        )}
      </div>
    </nav>
  );
};
