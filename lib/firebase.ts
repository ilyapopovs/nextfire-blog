import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { DocumentSnapshot } from "@firebase/firestore-types";

const firebaseConfig = {
  apiKey: "AIzaSyCco1ck5WsMdgTsvpIy8iT5WlYS7qVyf_M",
  authDomain: "nextfire-blog-app.firebaseapp.com",
  projectId: "nextfire-blog-app",
  storageBucket: "nextfire-blog-app.appspot.com",
  messagingSenderId: "45574597818",
  appId: "1:45574597818:web:1a481cd315a16498046683",
  measurementId: "G-XW5TT4V4K5",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

/**
 * Gets a users/{uid} document with username
 */
export async function getUserWithUsername(username: string) {
  const usersRef = firestore.collection("users");
  const query = usersRef.where("username", "==", username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

/**
 * Converts a firestore document to JSON
 */
export function postToJSON(doc: DocumentSnapshot) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp is NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}
