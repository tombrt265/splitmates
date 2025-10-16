import { useAuth0 } from "@auth0/auth0-react";
import { Route, Routes } from "react-router-dom";
import { PageLoader } from "./components/page-loader";
import { CallbackPage } from "./pages/callback-page";
import { HomePage } from "./pages/home-page";
import { NotFoundPage } from "./pages/not-found-page";
import { GroupsPage } from "./pages/groups-page";
import { GroupOverviewPage } from "./pages/group-overview-page";
import { ProfilePage } from "./pages/profile-page";
import { JoinGroupPage } from "./pages/join-group-page";
import { ProtectedRoute } from "./components/protected-route";

export const App = () => {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center h-full w-full">
        <PageLoader />
      </div>
    );
  }

  return (
    <Routes>
      {/* Öffentlich zugänglich */}
      <Route path="/" element={<HomePage />} />
      <Route path="/callback" element={<CallbackPage />} />

      {/* Geschützte Seiten */}
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups"
        element={
          <ProtectedRoute>
            <GroupsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/groups/:groupId"
        element={
          <ProtectedRoute>
            <GroupOverviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/join"
        element={
          <ProtectedRoute>
            <JoinGroupPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
