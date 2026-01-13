import { useNavigate } from "react-router-dom";

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
          className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold shadow hover:bg-blue-700 transition"
        >
          Return To Home
        </button>
      </section>
    </div>
  );
};
