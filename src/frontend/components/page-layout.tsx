// import { PageFooter } from "./page-footer";

import { NavBar } from "./navigation/desktop/nav-bar";
// import { MobileNavBar } from "./navigation/mobile/mobile-nav-bar";

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="flex flex-row md:h-screen w-full">
      <NavBar />
      {/* <MobileNavBar /> */}
      <div className="flex-1 basis-auto shrink-0 flex flex-col">{children}</div>
      {/* <PageFooter /> */}
    </div>
  );
};
