import { useSignUp } from "../hooks/useSignUp";
import { FiArrowRight } from "react-icons/fi";

export const HomePage = () => {
  const { handleSignUp } = useSignUp();

  return (
    <div className="flex flex-col h-screen">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 p-20 ">
        <h1 className="text-4xl! md:text-6xl font-bold mb-6">
          <h1>SplitMates</h1>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-8">
          Manage shared expenses with friends, roommates, or family.
        </p>
        <button
          onClick={handleSignUp}
          className="action-button action-button--success action-button--lg shadow text-primary"
        >
          <FiArrowRight aria-hidden="true" />
          Get started
        </button>
      </section>
    </div>
  );
};
