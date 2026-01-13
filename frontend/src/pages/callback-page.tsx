import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

import { signUpUserAPI } from "../api";
import { PageLoader } from "../components/page-loader";

export const CallbackPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const signupUser = async () => {
      if (isLoading || !isAuthenticated || !user) return;

      const username = user["https://splitmates.vercel.app/username"];
      const email = user.email;
      const auth0_sub = user.sub;
      let picture = user.picture;

      if (!email) console.error("Email fehlt");
      if (!username) console.error("Username fehlt");
      if (!auth0_sub) console.error("Auth0 Sub fehlt");
      if (!picture)
        picture =
          "https://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?d=identicon";

      if (!email || !username || !auth0_sub) {
        console.error("Fehlende Userdaten von Auth0");
        return;
      }

      try {
        const data = signUpUserAPI(username, email, auth0_sub, picture);
        console.log("User erfolgreich registriert:", data);

        navigate("/groups");
      } catch (err) {
        console.error("Signup-Fehler:", err);
      }
    };

    signupUser();
  }, [isLoading, isAuthenticated, user, navigate]);

  return <PageLoader />;
};
