import { auth, firestore } from "helpers/firebaseHelper";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { UserInterface } from "structures/userModel";

/**
 * Custom hook for reactively reading user and username data when the auth state changes
 */
export function useUserData() {
  const [user]: [UserInterface, boolean, any] = useAuthState(auth);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const userRef = firestore.collection("users").doc(user.uid);
      unsubscribe = userRef.onSnapshot((doc) => {
        setUsername(doc.data()?.username ?? "");
      });
    } else {
      setUsername("");
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}
