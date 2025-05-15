import { useState } from "react";
import Image from "next/image";
import Head from 'next/head';
import { Geist, Geist_Mono } from "next/font/google";
import Card from "@/components/Card";
import MiniCard from "@/components/MiniCard";
import { getCityFromAPI } from "../../utils/geocode";
import toast, { Toaster } from "react-hot-toast";

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
    if (!city) {
      toast.error("Off. Write a city first...");
      return 0;
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ city: normalizedCity })
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
      className={`${geistSans.className} ${geistMono.className} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
    >
      <Head>
        <title>UrbanLore</title>
        <meta name="description" content="Find hidden, obscure, and aesthetic places in any city." />
      </Head>

      <main className="flex flex-col gap-[32px] row-start-2 items-center max-w-3xl w-full mx-auto">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
            UrbanLore
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Discover hidden gems, aesthetic alleys, and untold stories from cities around the world.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full px-4">
          <Toaster position="bottom-center" />
          <input
            type="text"
            placeholder="Enter a city..."
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
            {loading ? "Loading..." : "Explore"}
          </button>
        </div>

        <section className="w-full">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-100 text-center">
            Featured Locations
          </h2>

          {places && places.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {places.map((place) => (
                <MiniCard key={place.name} place={place} onClick={setSelectedPlace} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-28 px-6 rounded-xl bg-gradient-to-b from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 text-gray-500 dark:text-gray-400 select-none shadow-inner">
              <div className="flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gray-200/60 dark:bg-gray-700/40">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400 dark:text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L15 12l-5.25-5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-center text-gray-700 dark:text-gray-300">
                No locations yet
              </h3>
              <p className="text-center text-sm italic text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
                Enter a city above and let UrbanLore uncover its hidden beauty — alleys, rooftops, and stories waiting to be explored.
              </p>
            </div>

          )}
        </section>

        {selectedPlace && (
          <Card place={selectedPlace} onClose={() => setSelectedPlace(null)} />
        )}
      </main>

      <footer className="text-center text-sm text-gray-500 mt-10">
        <p>&copy; 2025 UrbanLore. Proiect Cloud Computing - Panturu Elena 1133</p>
      </footer>
    </div >
  );
}
