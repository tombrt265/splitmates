import { useTheme } from '../../hooks/useTheme';
import '../../styles/components/button.css';

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="theme-toggle-container">
      <span className="theme-toggle-label">Dark mode</span>
      <button 
        className={`theme-toggle-switch ${theme === 'dark' ? 'active' : ''}`}
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
      >
        <span className="theme-toggle-slider"></span>
      </button>
    </div>
  );
};