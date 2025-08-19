import { NavLink } from "react-router-dom";

export const NavBarBrand = () => {
  const logo = "logo.svg";
  return (
    <div className="flex items-center h-[3.2rem] max-[340px]:h-[2.8rem] gap-[1.6rem] ml-[1.6rem]">
      <NavLink to="/" className="h-full flex items-center">
        <img
          className="h-full"
          src={logo}
          alt="Auth0 shield logo"
          width="auto"
          height="36"
        />
      </NavLink>

      <NavLink to="/" className="h-full flex items-center">
        <h1 className="translate-y-[-15%]">Splitmates</h1>
      </NavLink>
    </div>
  );
};
