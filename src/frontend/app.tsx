import { useAuth0 } from "@auth0/auth0-react";
import { Route, Routes } from "react-router-dom";
import { PageLoader } from "./components/page-loader";
import { CallbackPage } from "./pages/callback-page";
import { HomePage } from "./pages/home-page";
import { NotFoundPage } from "./pages/not-found-page";
import { GroupsPage } from "./pages/groups-page";
import { SettingsPage } from "./pages/settings-page";
import { GroupOverviewPage } from "./pages/group-overview-page";
import { ProfilePage } from "./pages/profile-page";
import { JoinGroupPage } from "./pages/join-group-page";

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
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/dashboard" element={<GroupOverviewPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/groups" element={<GroupsPage />} />
      <Route path="/join" element={<JoinGroupPage />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
