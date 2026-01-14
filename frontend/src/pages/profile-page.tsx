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
  const [openSections, setOpenSections] = useState<Record<ViewMode, boolean>>({
    [ViewMode.PROFILE]: true,
    [ViewMode.GENERAL]: true,
    [ViewMode.SECURITY]: true,
    [ViewMode.NOTIFICATIONS]: true,
    [ViewMode.BILLING]: true,
  });

  const toggleSection = (mode: ViewMode) => {
    setOpenSections((prev) => ({
      ...prev,
      [mode]: !prev[mode],
    }));
  };

  const renderView = (mode: ViewMode) => {
    switch (mode) {
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
      <div className="w-full flex flex-col  gap-4 p-6">
        {/* Page Title */}
        <h1 className="text-4xl! self-center font-semibold text-gray-800 mb-4">
          Account Settings
        </h1>

        {/* Collapsible Sections */}
        {Object.values(ViewMode).map((mode) => (
          <div
            key={mode}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            {/* Header */}
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center text-xl! font-medium text-blue-400 bg-blue-100 hover:bg-blue-200 transition-colors"
              onClick={() => toggleSection(mode)}
            >
              <span>{mode}</span>
              <span className="text-blue-400">
                {openSections[mode] ? "▲" : "▼"}
              </span>
            </button>

            {/* Content */}
            {openSections[mode] && (
              <div className="px-6 py-4 border-t border-gray-100 bg-blue-50">
                {renderView(mode)}
              </div>
            )}
          </div>
        ))}
      </div>
    </PageLayout>
  );
};
