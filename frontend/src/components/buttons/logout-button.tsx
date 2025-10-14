import { useAuth0 } from "@auth0/auth0-react";

export const LogoutButton = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { logout } = useAuth0();
  const iconLogout = "/icon-logout.svg";

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return !isCollapsed ? (
    <button className="button__logout" onClick={handleLogout}>
      Log Out
    </button>
  ) : (
    <button onClick={handleLogout} className="h-12">
      <img src={iconLogout} alt="Log Out" className="h-full" />
    </button>
  );
};
