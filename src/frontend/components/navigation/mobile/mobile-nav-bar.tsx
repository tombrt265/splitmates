import { useState } from "react";
import { MobileMenuToggleButton } from "./mobile-menu-toggle-button";
import { MobileNavBarBrand } from "./mobile-nav-bar-brand";
import { MobileNavBarButtons } from "./mobile-nav-bar-buttons";
import { MobileNavBarTabs } from "./mobile-nav-bar-tabs";

const MobileMenuState = {
  CLOSED: "closed",
  OPEN: "open",
};

const MobileMenuIcon = {
  CLOSE: "close",
  MENU: "menu",
};

export const MobileNavBar = () => {
  const [mobileMenuState, setMobileMenuState] = useState(
    MobileMenuState.CLOSED
  );
  const [mobileMenuIcon, setMobileMenuIcon] = useState(MobileMenuIcon.MENU);

  const isMobileMenuOpen = () => {
    return mobileMenuState === MobileMenuState.OPEN;
  };

  const closeMobileMenu = () => {
    document.body.classList.remove("mobile-scroll-lock");
    setMobileMenuState(MobileMenuState.CLOSED);
    setMobileMenuIcon(MobileMenuIcon.MENU);
  };

  const openMobileMenu = () => {
    document.body.classList.add("mobile-scroll-lock");
    setMobileMenuState(MobileMenuState.OPEN);
    setMobileMenuIcon(MobileMenuIcon.CLOSE);
  };

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen()) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  };

  return (
    <div className="max-sm:flex hidden justify-center shrink-0 w-full z-300">
      <nav className="flex-1 flex flex-col items-center shrink-0 h-[6.4rem]">
        <div className="flex-1 flex flex-row items-center shrink-0 h-full w-full p-[0.8rem_1.6rem] m-0 border-b border-[var(--black)]">
          <MobileNavBarBrand handleClick={closeMobileMenu} />
          <MobileMenuToggleButton
            icon={mobileMenuIcon}
            handleClick={toggleMobileMenu}
          />
        </div>

        {isMobileMenuOpen() && (
          <div className="w-full h-full z-300 bg-white">
            <MobileNavBarTabs handleClick={closeMobileMenu} />
            <MobileNavBarButtons />
          </div>
        )}
      </nav>
    </div>
  );
};
