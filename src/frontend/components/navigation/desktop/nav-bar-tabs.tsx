import { useAuth0 } from "@auth0/auth0-react";
import { NavBarTab } from "./nav-bar-tab";

export const NavBarTabs = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { isAuthenticated } = useAuth0();
  const iconFriends = "icon-friends.svg";
  const iconSettings = "icon-settings.svg";
  const iconGroups = "icon-groups.svg";

  return (
    <div className="flex flex-col items-start gap-4">
      {isAuthenticated && (
        <>
          <NavBarTab
            path="/friends"
            label="Freunde"
            isCollapsed={isCollapsed}
            icon={iconFriends}
          />
          <NavBarTab
            path="/groups"
            label="Gruppen"
            isCollapsed={isCollapsed}
            icon={iconGroups}
          />
          <NavBarTab
            path="/settings"
            label="Einstellungen"
            isCollapsed={isCollapsed}
            icon={iconSettings}
          />
        </>
      )}
    </div>
  );
};
