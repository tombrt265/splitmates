import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

import { joinGroupAPI } from "../api";
import { ApiErrorResponse } from "../models";

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
      if (!auth0_sub) return;

      try {
        const res = await joinGroupAPI(token, auth0_sub);
        setStatus(
          `Erfolgreich der Gruppe beigetreten! (ID: ${res.data.group_id})`,
        );
        setTimeout(() => navigate(`/groups/${res.data.group_id}`), 1500);
      } catch (err) {
        const error = err as ApiErrorResponse;
        setError(error.error.message);
        setStatus("");
      }
    };

    if (!isLoading && auth0_sub) {
      joinGroup();
    }
  }, [token, auth0_sub, isLoading, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      {status && (
        <p className="text-emerald-600 flex items-center gap-2">
          <FiCheckCircle aria-hidden="true" />
          {status}
        </p>
      )}
      {error && (
        <p className="text-red-600 flex items-center gap-2">
          <FiAlertCircle aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
};
