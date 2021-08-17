import { useState } from "react";
import { auth, storage, STATE_CHANGED } from "../lib/firebase";
import Loader from "./Loader";

// Uploads images to Firebase Storage
export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  // Creates a Firebase Upload Task
  const uploadFile = async (e) => {
    // Get the file
    const file: any = Array.from(e.target.files)[0];
    const extension = file.type.split("/")[1];

    // Makes reference to the storage bucket location
    const ref = storage.ref(
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);

    // Starts the upload
    const task = ref.put(file);

    // Listen to updates to upload task
    task.on(STATE_CHANGED, (snapshot) => {
      const pct = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);
      // @ts-ignore
      setProgress(pct);

      // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
      task
        .then((d) => ref.getDownloadURL())
        .then((url) => {
          setDownloadURL(url);
          setUploading(false);
        });
    });
  };

  return (
    <div className={"flex flex-col sm:flex-row"}>
      {uploading && (
        <div className={"flex items-center"}>
          <Loader show={uploading} />
          <h3 className={"ml-4"}>{progress}%</h3>
        </div>
      )}

      {!uploading && (
        <div
          className={"w-full sm:w-52 mr-4 mb-4 sm:mb-0"}
          style={{ minWidth: "208px" }}
        >
          <label className={"btn w-full m-0"}>
            📸 Upload Img
            <input
              className={"hidden"}
              type="file"
              onChange={uploadFile}
              accept="image/x-png,image/gif,image/jpeg"
            />
          </label>
        </div>
      )}

      {downloadURL && (
        <code
          className={
            "w-full h-20 sm:h-11 bg-theme-primary p-1 rounded text-xs overflow-x-scroll"
          }
          style={{ overflowWrap: "break-word" }}
        >
          {`![alt](${downloadURL})`}
        </code>
      )}
    </div>
  );
}
