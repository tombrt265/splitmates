import { NavBarBrand } from "./nav-bar-brand";
import { NavBarButtons } from "./nav-bar-buttons";
import { NavBarTabs } from "./nav-bar-tabs";

export const NavBar = () => {
  return (
    <div className=" max-sm:hidden flex justify-center shrink-0 w-full z-300">
      <nav className="max-sm:h-[6.4rem] max-sm:p-[0.8rem_1.6rem] flex flex-1 items-center shrink-0 h-[80px] p-[0_24px] m-0">
        <NavBarBrand />
        <NavBarTabs />
        <NavBarButtons />
      </nav>
    </div>
  );
};
