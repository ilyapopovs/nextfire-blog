import { auth, firestore, googleAuthProvider } from "../lib/firebase";
import { UserContext } from "../lib/context";
import { useEffect, useState, useCallback, useContext } from "react";
import Link from "next/link";
import debounce from "lodash.debounce";

export default function EnterPage() {
  const { user, username } = useContext(UserContext);

  return (
    <main className={"container py-4 flex justify-center"}>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

// Sign in with Google button
function SignInButton() {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button className={"btn mr-0"} onClick={signInWithGoogle}>
      <img src={"/google-logo.png"} width="30px" className={'mr-4'}/>
      Sign in with Google
    </button>
  );
}

// Sign out button
export function SignOutButton() {
  return (
    <Link href={"/"} passHref>
      <a className={"btn"} onClick={() => auth.signOut()}>
        Sign Out
      </a>
    </Link>
  );
}

// Username form
function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    // Commit both docs together as a batch write.
    const batch = firestore.batch();
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  //

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        console.log("Firestore read executed!");
        setIsValid(!exists);
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <form onSubmit={onSubmit}>
          <label>
            <span className={"text-xl font-bold"}>Choose username:</span>
            <br />
            <input
              name="username"
              className={"input my-2 mr-4 text-xl"}
              placeholder="johndoe"
              value={formValue}
              onChange={onChange}
            />
          </label>
          <div className={"inline-block mb-2"}>
            <button
              type="submit"
              className={"btn btn-success"}
              disabled={!isValid}
            >
              Choose
            </button>
          </div>
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          {/*<h3>Debug State</h3>*/}
          {/*<div>*/}
          {/*  Username: {formValue}*/}
          {/*  <br />*/}
          {/*  Loading: {loading.toString()}*/}
          {/*  <br />*/}
          {/*  Username Valid: {isValid.toString()}*/}
          {/*</div>*/}
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking... 🧐</p>;
  } else if (isValid) {
    return (
      <p className={"text-green-600 font-bold"}>{username} is available 👍</p>
    );
  } else if (username && !isValid) {
    return (
      <p className={"text-red-600 font-bold"}>{username} isn't available 😔</p>
    );
  } else {
    return <p className={"h-6"} />;
  }
}
