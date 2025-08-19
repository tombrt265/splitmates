import { useAuth0 } from "@auth0/auth0-react";
import { MobileNavBarTab } from "./mobile-nav-bar-tab";

interface MobileNavBarTabsProps {
  handleClick: () => void;
}

export const MobileNavBarTabs = ({ handleClick }: MobileNavBarTabsProps) => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="flex-1 flex items-center justify-end flex-col w-full">
      <MobileNavBarTab
        path="/profile"
        label="Profile"
        handleClick={handleClick}
      />
      {isAuthenticated && (
        <>
          <MobileNavBarTab
            path="/protected"
            label="Protected"
            handleClick={handleClick}
          />
        </>
      )}
    </div>
  );
};
