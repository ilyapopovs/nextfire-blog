import { useDocument } from "react-firebase-hooks/firestore";
import { getCurrentUserUid } from "services/authService";
import {
  addHeart,
  getHeartRef,
  removeHeart,
} from "repositories/heartsRepository";

export default function HeartButton({ postRef }) {
  const heartRef = getHeartRef(postRef);
  const [heartDoc] = useDocument(heartRef);

  return heartDoc?.exists ? (
    <button
      className={"btn my-0"}
      onClick={() => removeHeart(postRef, heartRef)}
    >
      💔 Unheart
    </button>
  ) : (
    <button
      className={"btn my-0"}
      onClick={() => addHeart(getCurrentUserUid(), postRef, heartRef)}
    >
      ❤️ Heart
    </button>
  );
}
