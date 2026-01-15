import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";
import { ThemeToggleButton } from "../buttons/theme-toggle-button";

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
          className="w-15 h-15 bg-widget text-primary flex items-center justify-center rounded-md shadow-md"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="navbar-menu"
          aria-label="Toggle Navigation Menu"
        >
          <span className="text-2xl text-blue-400">&#9776;</span>
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div
            className="absolute top-full left-0 mt-2 w-40 rounded-md flex flex-col gap-2 bg-widget p-4 shadow-lg"
            id="navbar-menu"
            role="menu"
          >
            <Link
              to="/groups"
              role="menuitem"
              className="bg-widget hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md border-blue-400 border-2"
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-center text-blue-400 hover:text-white font-semibold block px-4 py-2 leading-none">
                Groups
              </span>
            </Link>
            <Link
              to="/account"
              role="menuitem"
              className="bg-widget hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 border-2 border-blue-400 rounded-md"
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-center text-blue-400 hover:text-white font-semibold block px-4 py-2 leading-none">
                Account
              </span>
            </Link>
            <ThemeToggleButton />
            <button
              role="menuitem"
              className="bg-blue-400 hover:bg-blue-500 rounded-md text-white block px-4 py-2 leading-none"
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
