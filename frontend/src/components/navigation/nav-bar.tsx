import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { FiLogOut, FiMenu, FiUser, FiUsers, FiX } from "react-icons/fi";

export const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <nav className="fixed top-4 left-4 z-50" aria-label="Main Navigation">
      <div className="relative">
        {/* Burger Square */}
        <button
          className="w-15 h-15 bg-white text-gray-800 flex items-center justify-center rounded-md shadow-md"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
          aria-label="Toggle Navigation Menu"
        >
          {menuOpen ? (
            <FiX className="text-2xl text-blue-400" aria-hidden="true" />
          ) : (
            <FiMenu className="text-2xl text-blue-400" aria-hidden="true" />
          )}
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div
            className="absolute top-full left-0 mt-2 w-40 rounded-md flex flex-col gap-2 bg-white p-4 shadow-lg"
            id="navbar-menu"
            role="menu"
          >
            <Link
              to="/groups"
              role="menuitem"
              className="group bg-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md border-blue-400 border-2 flex items-center gap-2 px-4 py-2"
              onClick={() => setMenuOpen(false)}
            >
              <FiUsers aria-hidden="true" className="text-blue-400 group-hover:text-white" />
              <span className="text-center text-blue-400 group-hover:text-white font-semibold leading-none">
                Groups
              </span>
            </Link>
            <Link
              to="/account"
              role="menuitem"
              className="group bg-white hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border-2 border-blue-400 rounded-md flex items-center gap-2 px-4 py-2"
              onClick={() => setMenuOpen(false)}
            >
              <FiUser aria-hidden="true" className="text-blue-400 group-hover:text-white" />
              <span className="text-center text-blue-400 group-hover:text-white font-semibold leading-none">
                Account
              </span>
            </Link>
            <button
              role="menuitem"
              className="bg-red-500 hover:bg-red-600 rounded-md text-white block px-4 py-2 leading-none flex items-center gap-2 justify-center"
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
            >
              <FiLogOut aria-hidden="true" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
