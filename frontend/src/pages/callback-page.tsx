import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../api";
import { PageLoader } from "../components/page-loader";

export const CallbackPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const signupUser = async () => {
      if (isLoading || !isAuthenticated || !user) return;

      if (!user?.email || !user?.nickname || !user?.sub) {
        console.error("Fehlende Userdaten von Auth0");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/users/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user.username,
            email: user.email,
            auth0_sub: user.sub,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Fehler beim Signup");
        }

        const data = await res.json();
        console.log("User erfolgreich registriert:", data);

        navigate("/groups");
      } catch (err) {
        console.error("Signup-Fehler:", err);
      }
    };

    signupUser();
  }, [isLoading, isAuthenticated, user, navigate]);

  return (
    <div className="flex flex-col items-center h-full w-full">
      <PageLoader />
    </div>
  );
};
