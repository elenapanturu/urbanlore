import { useState } from "react";
import Head from "next/head";
import { Geist, Geist_Mono } from "next/font/google";
import Card from "@/components/Card";
import MiniCard from "@/components/MiniCard";
import { getCityFromAPI } from "../../utils/geocode";
import toast, { Toaster } from "react-hot-toast";
import content from "@/data/content.json";

const lang = "en";
const t = content[lang];

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [city, setCity] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!city.trim()) {
      toast.error(t.emptySearchMessage);
      return;
    }
    setLoading(true);
    const normalizedCity = await getCityFromAPI(city);
    const response = await fetch(`/api/places?city=${normalizedCity}`);
    const data = await response.json();

    if (data && data.data.length > 0 && Array.isArray(data.data)) {
      setPlaces(data.data);
    } else {
      const postResponse = await fetch(`/api/places`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ city: normalizedCity }),
      });

      await postResponse.json();

      const retryResponse = await fetch(`/api/places?city=${normalizedCity}`);
      const retryData = await retryResponse.json();
      setPlaces(retryData.data || []);
    }
    setLoading(false);
  };

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]`}
    >
      <Head>
        <title>UrbanLore</title>
        <meta name="description" content="Find hidden, obscure, and aesthetic places in any city." />
      </Head>

      <main className="flex-grow flex flex-col gap-6 items-center max-w-3xl w-full mx-auto px-4 pt-6 shadow-sm">

        <div className="w-full sticky top-0 z-20 bg-white dark:bg-neutral-900 pt-8 pb-4 sticky-header transition-colors duration-300">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-1 text-gray-900 dark:text-gray-100">{t.title}</h1>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
              {t.subtitle}
            </p>
            <p className="text-xs italic text-gray-500 dark:text-gray-400 max-w-md mx-auto -mt-1">
              {t.tagline}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Toaster position="bottom-center" />
          <input
            type="text"
            placeholder={t.placeholder}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="flex-grow px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
            disabled={loading}
            aria-label="City name"
          />
          <button
            onClick={handleSearch}
            className="bg-black text-white px-6 py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-gray-800 sm:w-auto w-full disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? t.loading : t.buttonExplore}
          </button>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-2">
          {["Paris", "Tokyo", "Lisbon", "New York", "Bucharest", "Barcelona"].map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setCity(preset);
              }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-sm rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
            >
              {preset}
            </button>
          ))}
        </div>

        <section className="w-full">


          {places && places.length > 0 ? (
            <>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 text-center">
                {t.featured}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {places.map((place) => (
                  <MiniCard key={place.name} place={place} onClick={setSelectedPlace} />
                ))}
              </div>
            </>
          ) : (
            <section className="w-full text-center px-2 mt-4">
              <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">{t.howItWorksTitle}</h2>
              <div className="flex flex-col sm:flex-row gap-6 justify-center text-gray-600 dark:text-gray-400 text-sm">
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{t.steps[0].title}</h3>
                  <p>{t.steps[0].desc}</p>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{t.steps[1].title}</h3>
                  <p>{t.steps[1].desc}</p>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{t.steps[2].title}</h3>
                  <p>{t.steps[2].desc}</p>
                </div>
              </div>
            </section>
          )}
        </section>

        {selectedPlace && (
          <Card place={selectedPlace} onClose={() => setSelectedPlace(null)} />
        )}
      </main>

      <footer className="text-center text-sm text-gray-400 dark:text-gray-500 py-6">
        <p>&copy; 2025 UrbanLore. Cloud Computing - Panțuru Elena 1133.</p>
      </footer>
    </div>
  );
}
