import Link from "next/link";
import { useContext, useState } from "react";
import { UserContext } from "../lib/context";
import { SignOutButton } from "../pages/enter";

const THEME_CONTAINER_ID = "theme-container";

const THEME_SYSTEM = "system-theme";
const THEME_LIGHT = "light-theme";
const THEME_DARK = "dark-theme";

const THEME_ICON_SYSTEM = "brightness_auto";
const THEME_ICON_LIGHT = "light_mode";
const THEME_ICON_DARK = "dark_mode";

const THEME_SEQUENCE = {
  [THEME_SYSTEM]: THEME_LIGHT,
  [THEME_LIGHT]: THEME_DARK,
  [THEME_DARK]: THEME_SYSTEM,
};

const THEME_ICONS_SEQUENCE = {
  [THEME_SYSTEM]: THEME_ICON_LIGHT,
  [THEME_LIGHT]: THEME_ICON_DARK,
  [THEME_DARK]: THEME_ICON_SYSTEM,
};

export default function Navbar() {
  const { user, username } = useContext(UserContext);

  return (
    <nav
      className={
        "w-full h-16 sm:sticky top-0 z-50 bg-theme-primary font-bold border-b border-theme-primary"
      }
    >
      <div className={"mx-auto"}>
        <ul className={"flex justify-center items-center h-full"}>
          <li className={"mr-auto"}>
            <Link href="/" passHref>
              <a className={"btn bg-gray-900 text-white text-xl"}>BLOG</a>
            </Link>
          </li>

          {
            //user is signed-in and has a username
            username && (
              <>
                <li>
                  <SignOutButton />
                </li>
                <li>
                  <Link href="/admin">
                    <button className={"btn btn-primary"}>Write Posts</button>
                  </Link>
                </li>
                <li>
                  <SwitchThemeButton />
                </li>
                <li>
                  <Link href={`/${username}`}>
                    <img
                      src={user?.photoURL}
                      className={"rounded-full w-12 h-12 cursor-pointer"}
                      alt=""
                    />
                  </Link>
                </li>
              </>
            )
          }

          {!username && user && (
            <>
              <li>
                <SignOutButton />
              </li>
              <li>
                <Link href="/enter" passHref>
                  <button className={"btn btn-primary"}>Log in</button>
                </Link>
              </li>
              <li>
                <SwitchThemeButton />
              </li>
            </>
          )}

          {!username && !user && (
            <>
              <li>
                <Link href="/enter" passHref>
                  <button className={"btn btn-primary"}>Log in</button>
                </Link>
              </li>
              <li>
                <SwitchThemeButton />
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

function SwitchThemeButton() {
  const [iconName, setIconName] = useState(THEME_ICONS_SEQUENCE[THEME_SYSTEM]);

  function switchTheme() {
    const container = document.getElementById(THEME_CONTAINER_ID);
    const currentTheme = container.className;
    const newTheme = THEME_SEQUENCE[currentTheme] ?? THEME_SYSTEM;

    container.className = newTheme;
    setIconName(
      THEME_ICONS_SEQUENCE[newTheme] ?? THEME_ICONS_SEQUENCE[THEME_SYSTEM]
    );
  }

  return (
    <button
      className={"btn bg-transparent border-theme-primary"}
      onClick={switchTheme}
    >
      <span className={"material-icons"}>{iconName}</span>
    </button>
  );
}
