import "../styles/globals.css";
import Navbar from "../components/Navbar";
import { DEFAULT_THEME } from "../components/Navbar";
import { Toaster } from "react-hot-toast";
import { UserContext } from "../lib/context";
import { useUserData } from "../lib/hooks";
import Footer from "../components/Footer";
import { useState } from "react";

function MyApp({ Component, pageProps }) {
  const userData = useUserData();
  const [themeClass, setThemeClass] = useState(DEFAULT_THEME);

  return (
    <UserContext.Provider value={userData}>
      <div id={"theme-container"} className={themeClass}>
        <Navbar themeClass={themeClass} setThemeClass={setThemeClass} />
        <Component {...pageProps} />
        <Toaster />
      </div>
      <Footer themeClass={themeClass} />
    </UserContext.Provider>
  );
}

export default MyApp;
