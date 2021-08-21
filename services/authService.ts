import { auth, googleAuthProvider } from "helpers/firebaseHelper";

export async function signInWithGoogle(): Promise<void> {
  await auth.signInWithPopup(googleAuthProvider);
}

export async function signOut(): Promise<void> {
  await auth.signOut();
}

export function getCurrentUserUid(): string {
  return auth.currentUser.uid;
}
