import { useNavigate } from "react-router-dom";
import { FiHome } from "react-icons/fi";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const handleHomeClick = () => {
    navigate("/");
  };
  return (
    <div className="flex flex-col h-screen">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 p-20 ">
        <h1 className="text-4xl! md:text-6xl font-bold mb-6">
          <h1>404 - Not Found</h1>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-8">
          The page you tried to access does not exist.
        </p>
        <button
          onClick={handleHomeClick}
          className="action-button action-button--success action-button--lg shadow"
        >
          <FiHome aria-hidden="true" />
          Return To Home
        </button>
      </section>
    </div>
  );
};
