import { NavBar } from "./navigation/nav-bar";

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="flex flex-row md:h-screen w-full">
      <NavBar />
      <div className="flex-1 basis-auto shrink-0 flex flex-col h-full">
        {children}
      </div>
    </div>
  );
};
