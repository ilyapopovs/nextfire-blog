import Link from "next/link";
import { useContext, useState } from "react";
import { UserContext } from "../lib/context";
import { SignOutButton } from "../pages/enter";

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

export const DEFAULT_THEME = THEME_SYSTEM;

export default function Navbar({ themeClass, setThemeClass }) {
  const { user, username } = useContext(UserContext);
  const [isDropdownShown, setIsDropdownShown] = useState(false);

  return (
    <nav className={"w-full h-16 sm:sticky z-50 top-0 font-bold"}>
      <div className={"w-full h-16 bg-theme-primary absolute top-0 z-40"} />
      <div className={"h-16 container relative z-40 bg-theme-primary"}>
        <ul className={"flex justify-center items-center h-full"}>
          <li className={"mr-auto"}>
            <Link href="/" passHref>
              <a className={"btn w-auto bg-gray-900 text-white text-xl"}>
                BLOG
              </a>
            </Link>
          </li>

          <li>
            <SwitchThemeButton
              themeClass={themeClass}
              setThemeClass={setThemeClass}
            />
          </li>
          <li>
            {user ? (
              <img
                onClick={() => setIsDropdownShown(!isDropdownShown)}
                src={user?.photoURL}
                className={"rounded-full w-12 h-12 cursor-pointer"}
                alt=""
              />
            ) : (
              <Link href="/enter" passHref>
                <a className={"btn btn-primary"}>Log in</a>
              </Link>
            )}
          </li>
        </ul>
      </div>
      <div
        id="navbar-dropdown"
        className={
          (isDropdownShown ? "dropdown-shown " : "") +
          "relative z-30 py-4 bg-theme-primary border-b border-theme-primary rounded-b-2xl"
        }
      >
        <div className={"container"}>
          <ul className={"flex flex-col-reverse sm:flex-row h-full"}>
            <li
              className={"sm:ml-auto"}
              onClick={() => setIsDropdownShown(!isDropdownShown)}
            >
              <SignOutButton />
            </li>
            {username ? (
              <>
                <li>
                  <Link href={`/${username}`} passHref>
                    <a
                      className={"btn"}
                      onClick={() => setIsDropdownShown(!isDropdownShown)}
                    >
                      Profile
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin" passHref>
                    <a
                      className={"btn btn-primary sm:mr-0"}
                      onClick={() => setIsDropdownShown(!isDropdownShown)}
                    >
                      Write Posts
                    </a>
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link href="/enter" passHref>
                  <a
                    className={"btn btn-primary sm:mr-0"}
                    onClick={() => setIsDropdownShown(!isDropdownShown)}
                  >
                    Create Username
                  </a>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function SwitchThemeButton({ themeClass, setThemeClass }) {
  const [iconName, setIconName] = useState(THEME_ICONS_SEQUENCE[DEFAULT_THEME]);

  function switchTheme() {
    const newTheme = THEME_SEQUENCE[themeClass] ?? DEFAULT_THEME;

    setThemeClass(newTheme);
    setIconName(
      THEME_ICONS_SEQUENCE[newTheme] ?? THEME_ICONS_SEQUENCE[DEFAULT_THEME]
    );
  }

  return (
    <button
      className={"btn theme-switcher w-auto bg-transparent visible"}
      onClick={switchTheme}
    >
      <span className={"material-icons"}>{iconName}</span>
    </button>
  );
}
