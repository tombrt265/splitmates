import { withAuthenticationRequired } from "@auth0/auth0-react";
import { PageLoader } from "./page-loader";

interface AuthenticationGuardProps {
  component: React.ComponentType;
}

export const AuthenticationGuard = ({
  component,
}: AuthenticationGuardProps) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="flex flex-col items-center h-full w-full">
        <PageLoader />
      </div>
    ),
  });

  return <Component />;
};
