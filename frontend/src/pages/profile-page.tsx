import { useState } from "react";
import { PageLayout } from "../components/page-layout";
import { ProfileView } from "../components/profile-page/profile-view";
import { SecurityView } from "../components/profile-page/security-view";
import { BillingView } from "../components/profile-page/billing-view";
import { NotificationsView } from "../components/profile-page/notifications-view";

enum ViewMode {
  PROFILE = "My Profile",
  SECURITY = "Security",
  NOTIFICATIONS = "Notifications",
  BILLING = "Billing",
}

export const ProfilePage = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.PROFILE);

  const renderView = () => {
    switch (view) {
      case ViewMode.PROFILE:
        return <ProfileView />;
      case ViewMode.SECURITY:
        return <SecurityView />;
      case ViewMode.NOTIFICATIONS:
        return <NotificationsView />;
      case ViewMode.BILLING:
        return <BillingView />;
      default:
        return null;
    }
  };

  return (
    <PageLayout>
      <div className="bg-gray-200 flex flex-col items-start w-full h-full p-8 text-black gap-4">
        <div className="text-3xl p-4 w-full">
          <span>Account Settings</span>
        </div>
        <div className="p-4 w-full h-full bg-white rounded-2xl flex flex-row">
          <div className="border-r border-gray-200 w-fit flex flex-col p-4 text-lg font-semibold text-gray-500">
            {Object.values(ViewMode).map((mode) => (
              <button
                key={mode}
                className={`cursor-pointer w-fit p-4 text-start rounded-4xl ${
                  view === mode
                    ? "bg-blue-100 text-blue-500"
                    : "hover:bg-blue-100 hover:text-blue-500"
                }`}
                onClick={() => setView(mode)}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className="flex-1 p-8">{renderView()}</div>
        </div>
      </div>
    </PageLayout>
  );
};
