import { useSignUp } from "../hooks/useSignUp";

export const HomePage = () => {
  const { handleSignUp } = useSignUp();

  return (
    <div className="flex flex-col h-full">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-indigo-50 to-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Split expenses <span className="text-indigo-600">easily</span> with
          friends
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
          Splitmates makes it easy to manage shared expenses in groups. Add
          members, track spending, and settle balances with just one click.
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleSignUp}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow hover:bg-indigo-700 transition"
          >
            Get started
          </button>
          <button
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-xl font-medium shadow hover:bg-gray-200 transition disabled:opacity-50 disabled:hover:bg-gray-100"
            disabled
          >
            Learn more
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Splitmates?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Create groups</h3>
            <p className="text-gray-600">
              Organize with friends, family, or roommates. Each group has its
              own members and expenses.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Add expenses</h3>
            <p className="text-gray-600">
              Specify who paid for what. Splitmates automatically splits costs
              fairly among all members.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Settle up easily</h3>
            <p className="text-gray-600">
              Splitmates shows who owes whom. With one click, you can settle all
              outstanding balances.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-indigo-50 px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">How it works</h2>
          <ol className="space-y-6 text-left max-w-xl mx-auto text-gray-700">
            <li>
              <span className="font-semibold">1.</span> Create a group and
              invite your friends.
            </li>
            <li>
              <span className="font-semibold">2.</span> Add shared expenses —
              whether for dinners, trips, or rent.
            </li>
            <li>
              <span className="font-semibold">3.</span> Splitmates divides
              everything automatically and fairly.
            </li>
            <li>
              <span className="font-semibold">4.</span> Settle open balances
              with one simple click.
            </li>
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section
        id="cta"
        className="px-6 py-20 bg-indigo-600 text-white text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to end money disputes forever?
        </h2>
        <p className="mb-8 text-lg text-indigo-100">
          Start free with Splitmates today and make splitting expenses
          effortless.
        </p>
        <button
          onClick={handleSignUp}
          className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold shadow hover:bg-gray-100 transition"
        >
          Start for free
        </button>
      </section>
    </div>
  );
};
