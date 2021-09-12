import "styles/globals.css";
import Navbar from "components/Navbar";
import MetaTags from "components/MetaTags";
import { DEFAULT_THEME } from "helpers/themeHelper";
import { Toaster } from "react-hot-toast";
import { UserContext } from "helpers/contextsHelper";
import { useUserData } from "helpers/hooksHelper";
import Footer from "components/Footer";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  const userData = useUserData();
  const [themeClass, setThemeClass] = useState(DEFAULT_THEME);

  useEffect(() => {
    document.body.classList.add('theme-container');
    document.body.classList.add(DEFAULT_THEME);
  }, []);

  return (
    <>
      <MetaTags />
      <UserContext.Provider value={userData}>
        <div id={"main-container"} className={`theme-container`}>
          <Navbar themeClass={themeClass} setThemeClass={setThemeClass} />
          <Component {...pageProps} />
          <Toaster />
        </div>
        <Footer />
      </UserContext.Provider>
    </>
  );
}

export default MyApp;
