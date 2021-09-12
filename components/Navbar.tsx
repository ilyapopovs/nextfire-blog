import Link from "next/link";
import { useContext, useState } from "react";
import { UserContext } from "helpers/contextsHelper";
import { SignOutButton } from "components/SignOutButton";
import * as Theme from "helpers/themeHelper";

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
  const [iconName, setIconName] = useState(
    Theme.THEME_ICONS_SEQUENCE[Theme.DEFAULT_THEME]
  );

  function switchTheme() {
    const newTheme = Theme.THEME_SEQUENCE[themeClass] ?? Theme.DEFAULT_THEME;
    const oldTheme = themeClass;

    setThemeClass(newTheme);
    document.body.classList.add(newTheme);
    document.body.classList.remove(oldTheme);
    setIconName(
      Theme.THEME_ICONS_SEQUENCE[newTheme] ??
        Theme.THEME_ICONS_SEQUENCE[Theme.DEFAULT_THEME]
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
