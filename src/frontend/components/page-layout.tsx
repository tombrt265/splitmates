// import { PageFooter } from "./page-footer";

import { NavBar } from "./navigation/desktop/nav-bar";
import { MobileNavBar } from "./navigation/mobile/mobile-nav-bar";

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="flex flex-col items-center h-full w-full">
      <NavBar />
      <MobileNavBar />
      <div className="max-sm:mt-[0] flex-1 basis-auto shrink-0 flex flex-col h-[calc(100%_-_9.4rem)] w-full p-4">
        {children}
      </div>
      {/* <PageFooter /> */}
    </div>
  );
};
