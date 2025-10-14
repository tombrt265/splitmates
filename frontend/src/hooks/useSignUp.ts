import { useAuth0 } from "@auth0/auth0-react";

export const useSignUp = () => {
  const { loginWithRedirect } = useAuth0();

  const handleSignUp = async () => {
    await loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup",
      },
      appState: {
        returnTo: "/groups",
      },
    });
  };

  return { handleSignUp };
};
