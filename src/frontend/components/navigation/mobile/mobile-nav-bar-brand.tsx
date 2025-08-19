import { NavLink } from "react-router-dom";

interface MobileNavBarBrandProps {
  handleClick: () => void;
}

export const MobileNavBarBrand = ({ handleClick }: MobileNavBarBrandProps) => {
  const logo = "logo.svg";
  return (
    <div
      onClick={handleClick}
      className="flex-1 flex items-center h-full mr-[1.6rem] gap-[1.6rem]"
    >
      <NavLink to="/">
        <img
          className="h-[2.4rem]"
          src={logo}
          alt="Auth0 shield logo"
          width="auto"
          height="24"
        />
      </NavLink>
      <NavLink to="/" className="h-full flex items-center">
        <h1 className="translate-y-[-15%]">Splitmates</h1>
      </NavLink>
    </div>
  );
};
