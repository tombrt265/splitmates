interface MobileMenuToggleButtonProps {
  icon: string;
  handleClick: () => void;
}

export const MobileMenuToggleButton = ({
  icon,
  handleClick,
}: MobileMenuToggleButtonProps) => {
  return (
    <span
      className="ml-[2.4rem] text-[3.6rem] cursor-pointer material-icons"
      id="mobile-menu-toggle-button"
      onClick={handleClick}
    >
      {icon}
    </span>
  );
};
