import { useAuth0 } from "@auth0/auth0-react";
import { NavBarTab } from "./nav-bar-tab";

export const NavBarTabs = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { isAuthenticated } = useAuth0();
  const iconGroups = "/icon-groups.svg";
  const iconProfile = "/icon-profile.svg";

  return (
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
  );
};
