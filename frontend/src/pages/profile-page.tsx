import { useState } from "react";
import { PageLayout } from "../components/page-layout";
import { ProfileView } from "../components/profile-page/profile-view";
import { SecurityView } from "../components/profile-page/security-view";
import { BillingView } from "../components/profile-page/billing-view";
import { NotificationsView } from "../components/profile-page/notifications-view";
import { GeneralView } from "../components/profile-page/general-view";

enum ViewMode {
  PROFILE = "My Profile",
  GENERAL = "General",
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
      case ViewMode.GENERAL:
        return <GeneralView />;
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
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 p-6">
        {/* Page Title */}
        <div className="text-3xl font-semibold text-gray-800">
          Account Settings
        </div>

        {/* Navigation Tabs (oben, scrollable auf Mobile) */}
        <nav className="flex gap-3 overflow-x-auto border-b border-gray-200 pb-2">
          {Object.values(ViewMode).map((mode) => (
            <button
              key={mode}
              className={`flex-shrink-0 cursor-pointer px-4 py-2 rounded-lg text-gray-600 font-medium whitespace-nowrap hover:bg-blue-50 hover:text-blue-600 ${
                view === mode ? "bg-blue-100 text-blue-600" : ""
              }`}
              onClick={() => setView(mode)}
            >
              {mode}
            </button>
          ))}
        </nav>

        {/* Main Content */}
        <div className="flex flex-col gap-6">
          {/* Jede Sektion als Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 overflow-hidden">
            {renderView()}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
