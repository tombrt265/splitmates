import { useAuth0 } from "@auth0/auth0-react";
import { NavBarTab } from "./nav-bar-tab";

export const NavBarTabs = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="flex-1 flex items-center justify-end  ">
      {isAuthenticated && (
        <>
          <NavBarTab path="/profile" label="Profil" />
        </>
      )}
      <NavBarTab path="/" label="Lorem Ipsum" />
    </div>
  );
};
