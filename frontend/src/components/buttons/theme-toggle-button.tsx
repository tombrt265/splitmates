import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import '../../styles/components/theme-toggle.css';

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle icon-only ${theme}`}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      <span className="theme-toggle__option">
        <Sun size={16} />
      </span>

      <span className="theme-toggle__option">
        <Moon size={16} />
      </span>

      <span className="theme-toggle__slider" />
    </button>
  );
};
