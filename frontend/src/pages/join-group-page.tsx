import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../api";

export const JoinGroupPage = () => {
  const { user, isLoading } = useAuth0();
  const auth0_sub = user?.sub;
  const [status, setStatus] = useState<string>("Beitreten...");
  const [error, setError] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  useEffect(() => {
    const joinGroup = async () => {
      if (!token) {
        setError("Kein Token gefunden");
        setStatus("");
        return;
      }
      if (!auth0_sub) return; // Warte auf Auth0

      try {
        const res = await fetch(`${API_BASE}/api/groups/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            auth0_sub: auth0_sub,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Fehler beim Beitreten");
        }

        const data = await res.json();
        setStatus(`Erfolgreich der Gruppe beigetreten! (ID: ${data.group_id})`);

        setTimeout(() => navigate("/groups"), 1500);
      } catch {
        setError("Fehler beim Beitreten");
        setStatus("");
      }
    };

    if (!isLoading && auth0_sub) {
      joinGroup();
    }
  }, [token, auth0_sub, isLoading, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      {status && <p className="text-green-600">{status}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
};
