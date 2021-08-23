import { firestore } from "helpers/firebaseHelper";
import { UserInterface } from "structures/userModel";
import { DocumentReference, DocumentSnapshot } from '@firebase/firestore-types'

export async function getUserDocByUsername(
  username: string
): Promise<DocumentSnapshot | null> {
  const usersRef = firestore.collection("users");
  const usersQuery = usersRef.where("username", "==", username).limit(1);

  return (await usersQuery.get()).docs[0];
}

export function getUserDocRefByUid(userUid: string): DocumentReference {
  return firestore.collection('users').doc(userUid);
}

export async function saveUsername(
  user: UserInterface,
  newUsername: string
): Promise<void> {
  const userRef = firestore.doc(`users/${user.uid}`);
  const usernameRef = firestore.doc(`usernames/${newUsername}`);

  const batch = firestore.batch();
  batch.set(userRef, {
    username: newUsername,
    photoURL: user.photoURL,
    displayName: user.displayName,
  });
  batch.set(usernameRef, { uid: user.uid });

  await batch.commit();
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  const ref = firestore.doc(`usernames/${username}`);

  return (await ref.get()).exists;
}
