import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { SignOutButton } from "../pages/enter";

export default function Navbar() {
  const { user, username } = useContext(UserContext);

  return (
    <nav
      className={
        "w-full h-16 sticky top-0 z-50 bg-white font-bold border-b border-gray-300"
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
                    <button className={"btn btn-blue"}>Write Posts</button>
                  </Link>
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
                  <button className={"btn btn-blue"}>Log in</button>
                </Link>
              </li>
            </>
          )}

          {!username && !user && (
            <>
              <li>
                <Link href="/enter" passHref>
                  <button className={"btn btn-blue mr-0"}>Log in</button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
