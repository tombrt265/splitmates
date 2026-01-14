import { NavBar } from "./navigation/nav-bar";

interface PageLayoutProps {
  children: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen w-full flex justify-center bg-gray-50 px-4 py-6 md:py-10">
      {/* Navigation */}
      <NavBar />

      {/* Main Content */}
      <main className="w-full max-w-5xl flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
};
