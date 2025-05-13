import ThemeToggle from "@/components/ThemeToggle";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ThemeToggle />
    </>
  );
}
