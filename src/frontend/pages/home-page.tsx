import { PageLayout } from "../components/page-layout";
import { useSignUp } from "../hooks/useSignup";

export const HomePage = () => {
  const { handleSignUp } = useSignUp();

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-indigo-50 to-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Teile Ausgaben <span className="text-indigo-600">einfach</span> mit
          Freunden
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
          Splitmates macht es dir leicht, gemeinsame Kosten in Gruppen zu
          verwalten. Füge Mitglieder hinzu, tracke Ausgaben und gleiche sie mit
          einem Klick aus.
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleSignUp}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow hover:bg-indigo-700 transition"
          >
            Jetzt starten
          </button>
          <button
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-xl font-medium shadow hover:bg-gray-200 transition disabled:opacity-50 disabled:hover:bg-gray-100"
            disabled
          >
            Mehr erfahren
          </button>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Warum Splitmates?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Gruppen erstellen</h3>
            <p className="text-gray-600">
              Organisiere dich mit Freunden, Familie oder WG-Mitgliedern. Jede
              Gruppe hat ihre eigenen Ausgaben und Mitglieder.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Ausgaben hinzufügen</h3>
            <p className="text-gray-600">
              Lege fest, wer etwas bezahlt hat. Splitmates teilt die Kosten
              automatisch gerecht auf alle Mitglieder auf.
            </p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-3">Einfach ausgleichen</h3>
            <p className="text-gray-600">
              Am Ende zeigt dir Splitmates, wer wem wie viel schuldet. Mit einem
              Klick kannst du alle Zahlungen erledigen.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-indigo-50 px-6 py-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            So funktioniert's
          </h2>
          <ol className="space-y-6 text-left max-w-xl mx-auto text-gray-700">
            <li>
              <span className="font-semibold">1.</span> Erstelle eine Gruppe und
              lade deine Freunde ein.
            </li>
            <li>
              <span className="font-semibold">2.</span> Trage gemeinsame
              Ausgaben ein, egal ob Restaurant, Reisen oder WG.
            </li>
            <li>
              <span className="font-semibold">3.</span> Splitmates teilt
              automatisch fair auf.
            </li>
            <li>
              <span className="font-semibold">4.</span> Überweise mit einem
              Klick die offenen Beträge.
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
          Bereit, nie wieder Geldstreit zu haben?
        </h2>
        <p className="mb-8 text-lg text-indigo-100">
          Starte jetzt kostenlos mit Splitmates und erleichtere dir das Teilen
          von Ausgaben.
        </p>
        <button
          onClick={handleSignUp}
          className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold shadow hover:bg-gray-100 transition"
        >
          Kostenlos starten
        </button>
      </section>
    </PageLayout>
  );
};
