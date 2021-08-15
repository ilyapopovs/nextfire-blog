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
  const [isDropdownShown, setIsDropdownShown] = useState(false);

  return (
    <nav
      className={
        "w-full h-16 mb-6 sm:sticky top-0 z-50 bg-theme-primary font-bold border-b border-theme-primary"
      }
    >
      <div className={"container"}>
        <ul className={"flex justify-center items-center h-full"}>
          <li className={"mr-auto"}>
            <Link href="/" passHref>
              <a className={"btn w-auto bg-gray-900 text-white text-xl"}>
                BLOG
              </a>
            </Link>
          </li>

          <li>
            <SwitchThemeButton />
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
          (isDropdownShown ? "block" : "hidden") +
          " relative py-4 bg-theme-primary border-b border-theme-primary rounded-b-2xl"
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
      className={"btn w-auto bg-transparent border-theme-primary"}
      onClick={switchTheme}
    >
      <span className={"material-icons"}>{iconName}</span>
    </button>
  );
}
