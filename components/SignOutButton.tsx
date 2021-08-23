import Link from "next/link";
import { signOut } from "services/authService";

export function SignOutButton() {
  return (
    <Link href={"/"} passHref>
      <a className={"btn"} onClick={signOut}>
        Sign Out
      </a>
    </Link>
  );
}
