import ThemeToggle from "@/components/ThemeToggle";
import { UserProvider } from "@/contexts/UserContext";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Component {...pageProps} />
      <ThemeToggle />
    </UserProvider>
  );
}
