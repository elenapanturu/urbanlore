import Image from "next/image";
import Head from 'next/head';
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
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
          <input
            type="text"
            placeholder="Enter a city..."
            className="px-4 py-2 border rounded-lg shadow-sm w-64 focus:outline-none focus:ring-2 focus:ring-gray-600"
          />
          <button className="bg-black text-white px-4 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105">Explore</button>
        </div>

        <section className="w-full max-w-3xl">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800"> Locations</h2>
          {/* o sa mapam printre place cards*/}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* cardurile, urmeaza sa nu mai fie harcodate */}
            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative w-full h-36 rounded-lg overflow-hidden">
                <Image src="/images/prague_depeche_mode_statue.jpg" alt="Iconic Statue Prague" layout="fill" objectFit="cover" />
              </div>
              <h3 className="font-bold mt-2 text-lg text-gray-900">Iconic statue where Depeche Mode shot a pic</h3>
              <p className="text-sm text-gray-600">Prague, Czech Republic</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative w-full h-36 rounded-lg overflow-hidden">
                <Image src="/images/prague_depeche_mode_statue.jpg" alt="Iconic Statue Prague" layout="fill" objectFit="cover" />
              </div>
              <h3 className="font-bold mt-2 text-lg text-gray-900">Iconic Statue</h3>
              <p className="text-sm text-gray-600">Prague, Czech Republic</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative w-full h-36 rounded-lg overflow-hidden">
                <Image src="/images/prague_depeche_mode_statue.jpg" alt="Iconic Statue Prague" layout="fill" objectFit="cover" />
              </div>
              <h3 className="font-bold mt-2 text-lg text-gray-900">Iconic Statue</h3>
              <p className="text-sm text-gray-600">Prague, Czech Republic</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="text-center text-sm text-gray-500 mt-10">
        <p>&copy; 2025 UrbanLore. Proiect Cloud Computing - Panturu Elena 1133</p>
      </footer>
    </div>
  );
}
