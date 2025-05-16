import { useEffect, useState } from 'react';
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setDark(true);
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = dark ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
    setDark(!dark);
  };

  return (
    <button
      className={`${geistSans.className} ${geistMono.className}`}
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '10px 15px',
        backgroundColor: dark ? '#fff' : '#000',
        color: dark ? '#000' : '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        zIndex: 9999,
      }}
    >
      {dark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
