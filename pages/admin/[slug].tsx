import AuthCheck from "../../components/AuthCheck";
import { firestore, auth, serverTimestamp } from "../../lib/firebase";
import ImageUploader from "../../components/ImageUploader";

import { useState } from "react";
import { useRouter } from "next/router";

import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  const postRef = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts")
    // @ts-ignore
    .doc(slug);
  const [post]: [any, boolean, Error] = useDocumentDataOnce(postRef);

  return (
    <main>
      {post && (
        <div className={"flex justify-between"}>
          <section className={"w-full"} style={{ maxWidth: "70%" }}>
            <h1 className={"text-2xl font-bold"}>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </section>

          <aside className={"w-full flex flex-col"} style={{ maxWidth: "25%" }}>
            <h3 className={'text-lg font-bold'}>Tools</h3>
            <button className={'btn'} onClick={() => setPreview(!preview)}>
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className={"btn btn-blue"}>Live view</button>
            </Link>
            <DeletePostButton postRef={postRef} />
          </aside>
        </div>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, errors, handleSubmit, formState, reset, watch } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty } = formState;

  const updatePost = async ({ content, published }) => {
    await postRef.update({
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success("Post updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className={"card"}>
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? "hidden" : ""}>
        <div className={"py-2"}>
          <ImageUploader />
        </div>

        <textarea
          className={"input w-full"}
          name="content"
          ref={register({
            maxLength: { value: 20000, message: "content is too long" },
            minLength: { value: 10, message: "content is too short" },
            required: { value: true, message: "content is required" },
          })}
        />

        {errors.content && (
          <p className={"text-danger"}>{errors.content.message}</p>
        )}

        <label className={"flex items-center my-4 text-xl cursor-pointer"}>
          <input
            className={"w-6 h-6 mr-2"}
            name="published"
            type="checkbox"
            ref={register}
          />
          Published
        </label>

        <button
          type="submit"
          className={"btn btn-green"}
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

function DeletePostButton({ postRef }) {
  const router = useRouter();

  const deletePost = async () => {
    if (confirm("Are you sure?")) {
      await postRef.delete();
      router.push("/admin").then();
      toast("Post deleted", { icon: "🗑️" });
    }
  };

  return (
    <button className={"btn btn-red"} onClick={deletePost}>
      Delete
    </button>
  );
}
