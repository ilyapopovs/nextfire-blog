import { DocumentReference } from "@firebase/firestore-types";
import { getCurrentUserUid } from "services/authService";
import { firestore, increment } from "helpers/firebaseHelper";

export function getHeartRef(postRef: DocumentReference): DocumentReference {
  return postRef.collection("hearts").doc(getCurrentUserUid());
}

/**
 * Create a user-to-post relationship
 */
export async function addHeart(
  userUid: string,
  postRef: DocumentReference,
  heartRef: DocumentReference
): Promise<void> {
  const batch = firestore.batch();

  batch.update(postRef, { heartCount: increment(1) });
  batch.set(heartRef, { userUid });

  await batch.commit();
}

/**
 * Remove a user-to-post relationship
 */
export async function removeHeart(
  postRef: DocumentReference,
  heartRef: DocumentReference
): Promise<void> {
  const batch = firestore.batch();

  batch.update(postRef, { heartCount: increment(-1) });
  batch.delete(heartRef);

  await batch.commit();
}
