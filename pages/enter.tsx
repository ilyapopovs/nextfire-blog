import { useEffect, useState, useCallback, useContext } from "react";
import { isUsernameTaken, saveUsername } from "repositories/usersRepository";
import { signInWithGoogle } from "services/authService";
import { UserContext } from "helpers/contextsHelper";
import { SignOutButton } from "components/SignOutButton";
import debounce from "lodash.debounce";

export default function EnterPage() {
  const { user, username } = useContext(UserContext);

  return (
    <main className={"container flex justify-center"}>
      {user ? (
        !username ? (
          <UsernameCreationForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <GoogleSignInButton />
      )}
    </main>
  );
}

function GoogleSignInButton() {
  return (
    <button className={"btn mr-0"} onClick={signInWithGoogle}>
      <img src={"/google-logo.png"} width="30px" className={"mr-4"} alt="" />
      Sign in with Google
    </button>
  );
}

function UsernameCreationForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useContext(UserContext);

  useEffect(() => {
    checkIsUsernameTaken(formValue);
  }, [formValue]);

  // useCallback is required for debounce to work
  const checkIsUsernameTaken = useCallback(
    debounce(async (username) => {
      if (username.length > 3) {
        setIsValid(!(await isUsernameTaken(username)));
        setIsLoading(false);
      }
    }, 500),
    []
  );

  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const usernameValidationExpression =
      /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (val.length < 3) {
      setFormValue(val);
      setIsLoading(false);
      setIsValid(false);

      return;
    }

    if (usernameValidationExpression.test(val)) {
      setIsLoading(true);
      setIsValid(false);
      setFormValue(val);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await saveUsername(user, formValue);
  };

  return (
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
          isLoading={isLoading}
        />
      </form>
    </section>
  );
}

function UsernameMessage({ username, isValid, isLoading }) {
  if (isLoading) {
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
