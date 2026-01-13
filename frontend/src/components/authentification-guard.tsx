import { withAuthenticationRequired } from "@auth0/auth0-react";
import { PageLoader } from "./page-loader";

interface AuthenticationGuardProps {
  component: React.ComponentType;
}

export const AuthenticationGuard = ({
  component,
}: AuthenticationGuardProps) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <PageLoader />,
  });

  return <Component />;
};
