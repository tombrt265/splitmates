import { useAuth0 } from "@auth0/auth0-react";
import { LoginButton } from "../buttons/login-button";
import { LogoutButton } from "../buttons/logout-button";

export const NavBarButtons = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="mt-auto flex flex-col items-center gap-4 w-full">
      {!isAuthenticated ? (
        <LoginButton isCollapsed={isCollapsed} />
      ) : (
        <>
          <LogoutButton isCollapsed={isCollapsed} />
        </>
      )}
    </div>
  );
};
