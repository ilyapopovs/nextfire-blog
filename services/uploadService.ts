import { STATE_CHANGED, storage } from "helpers/firebaseHelper";
import { getCurrentUserUid } from "services/authService";

function getBucketReference(fileExtension: string) {
  const userUid = getCurrentUserUid();
  const timestamp = Date.now();

  return storage.ref(`uploads/${userUid}/${timestamp}.${fileExtension}`);
}

function getProgressPercent(snapshot): number {
  return parseInt(
    ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
  );
}

export async function uploadFile(
  file: Blob,
  { onStarted = null, onProgress = null, onFinished = null }
): Promise<void> {
  const fileExtension = file.type.split("/")[1];
  const ref = getBucketReference(fileExtension);

  onStarted && onStarted();

  const task = ref.put(file);

  task
    .then(() => ref.getDownloadURL()) // Note: this is not a native Promise
    .then((downloadUrl) => onFinished && onFinished(downloadUrl));

  task.on(STATE_CHANGED, (snapshot) => {
    onProgress && onProgress(getProgressPercent(snapshot));
  });
}
