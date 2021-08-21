import { useState } from "react";
import Loader from "./Loader";
import * as UploadService from "services/uploadService";

/**
 * Uploads images to Firebase Storage returning the download url
 */
export default function ImageUploader() {
  const [isUploading, setIsUploading] = useState(false);
  const [progressIndex, setProgressIndex] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  // Creates a Firebase Upload Task
  const uploadFile = async (e) => {
    const file: any = Array.from(e.target.files)[0];

    function onStarted() {
      setIsUploading(true);
    }

    function onProgress(progressPercent: number) {
      setProgressIndex(progressPercent);
    }

    function onFinished(downloadUrl: string) {
      setDownloadURL(downloadUrl);
      setIsUploading(false);
    }

    await UploadService.uploadFile(file, { onStarted, onProgress, onFinished });
  };

  return (
    <div className={"flex flex-col sm:flex-row"}>
      {isUploading && (
        <div className={"flex items-center"}>
          <Loader isShown={isUploading} />
          <h3 className={"ml-4"}>{progressIndex}%</h3>
        </div>
      )}

      {!isUploading && (
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
