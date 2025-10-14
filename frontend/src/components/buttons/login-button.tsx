import { useAuth0 } from "@auth0/auth0-react";

export const LoginButton = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { loginWithRedirect } = useAuth0();
  const iconLogin = "/icon-login.svg";

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/profile",
      },
    });
  };

  return !isCollapsed ? (
    <button className="button__login" onClick={handleLogin}>
      Log In
    </button>
  ) : (
    <button onClick={handleLogin} className="h-12">
      <img src={iconLogin} alt="Log In" className="h-full" />
    </button>
  );
};
