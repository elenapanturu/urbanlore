import { useEffect, useState } from 'react';

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
