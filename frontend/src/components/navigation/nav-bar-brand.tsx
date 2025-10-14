interface NavBarBrandProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const NavBarBrand = ({
  isCollapsed,
  onToggleCollapse,
}: NavBarBrandProps) => {
  const logo = "/logo.svg";
  return (
    <div className="flex items-center h-15 gap-6 mb-12">
      <button className="flex items-center h-full" onClick={onToggleCollapse}>
        <img className="h-full" src={logo} alt="SplitMates logo" />
        {!isCollapsed && <h4>Splitmates</h4>}
      </button>
    </div>
  );
};
