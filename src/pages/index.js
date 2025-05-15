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
  const [loading, setLoading] = useState(true);

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
      console.log('2', data.data);
    } else {
      console.log('3');
      const postResponse = await fetch(`/api/places`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ city: normalizedCity })
      });

      const postData = await postResponse.json();
      console.log("GPT data:", postData);

      const response = await fetch(`/api/places?city=${normalizedCity}`);
      const data = await response.json();
      setPlaces(data.data || []);
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

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">UrbanLore</h1>
        <p className="text-center text-lg text-gray-700 mb-6">Discover hidden gems, aesthetic alleys, and untold stories from cities around the world.</p>
        <div className="flex gap-2 mb-8">
          <Toaster position="bottom-center" />
          <input
            type="text"
            placeholder="Enter a city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-4 py-2 border rounded-lg shadow-sm w-64 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          <button
            onClick={handleSearch}
            className="bg-black text-white px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Explore
          </button>
        </div>

        <section className="w-full max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Featured Locations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {places && places.length > 0 && places.map((place) => (
              <MiniCard key={place.name} place={place} onClick={setSelectedPlace} />
            ))}
          </div>
        </section>
        {selectedPlace && (
          <Card place={selectedPlace} onClose={() => setSelectedPlace(null)} />
        )}
      </main>
      <footer className="text-center text-sm text-gray-500 mt-10">
        <p>&copy; 2025 UrbanLore. Proiect Cloud Computing - Panturu Elena 1133</p>
      </footer>
    </div>
  );
}
