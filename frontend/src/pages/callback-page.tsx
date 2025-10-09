import { useAuth0 } from "@auth0/auth0-react";
import { MobileNavBar } from "../components/navigation/mobile/mobile-nav-bar";
import { NavBar } from "../components/navigation/desktop/nav-bar";
import { PageLayout } from "../components/page-layout";

export const CallbackPage = () => {
  const { error } = useAuth0();

  if (error) {
    return (
      <PageLayout>
        <p>
          <span>{error.message}</span>
        </p>
      </PageLayout>
    );
  }

  return (
    <div className="flex flex-col items-center h-full w-full">
      <NavBar />
      <MobileNavBar />
      <div className="max-sm:mt-[6.4rem] flex-1 basis-auto shrink-0 flex flex-col mt-32 max-w-[120rem] w-full" />
    </div>
  );
};
