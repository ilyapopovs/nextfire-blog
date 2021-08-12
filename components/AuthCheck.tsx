import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function AuthCheck(props) {
  const { username } = useContext(UserContext);

  return username
    ? props.children
    : props.fallback || (
        <>
          <div>You must be signed in!</div>
          <Link href="/enter">
            <button className={"btn-blue"}>Sign in</button>
          </Link>
        </>
      );
}
