import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from "../../buttons/login-button";
import { LogoutButton } from "../../buttons/logout-button";

export const NavBarButtons = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { isAuthenticated } = useAuth0();
  const iconProfile = "icon-profile.svg";

  return (
    <div className="mt-auto flex flex-col items-center gap-4 w-full">
      {!isAuthenticated ? (
        <LoginButton isCollapsed={isCollapsed} />
      ) : (
        <>
          <button className="flex gap-2 items-center">
            <img src={iconProfile} alt="Profile" className="h-12" />
            {!isCollapsed && <h6>Profilname</h6>}
          </button>
          <LogoutButton isCollapsed={isCollapsed} />
        </>
      )}
    </div>
  );
};
