import { useContext, useState } from "react";
import { useRouter } from "next/router";
import AuthCheck from "components/AuthCheck";
import PostsFeed from "components/PostsFeed";
import { UserContext } from "helpers/contextsHelper";
import { createPost, getAllUserPosts } from "repositories/postsRepository";
import { getCurrentUserUid } from "services/authService";
import { PostModel } from "structures/postModel";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";

export default function AdminPostsPage() {
  return (
    <main className={"container"}>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  async function getPosts() {
    return await getAllUserPosts();
  }

  const [posts, setPosts] = useState([]);
  getPosts().then((posts) => setPosts(posts));

  return (
    <>
      <h1 className={"text-2xl font-bold"}>Manage your Posts</h1>
      <PostsFeed posts={posts} isAdmin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const isTitleValid = title.length > 3 && title.length < 100;

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  async function createNewPost(e) {
    e.preventDefault();
    const userUid = getCurrentUserUid();
    const newPost = new PostModel({
      title,
      slug,
      userUid,
      username,
      content: "# hello world!",
    }).toSerializedPost();

    await createPost(newPost);
    toast.success("Post created!");
    router.push(`/admin/${slug}`).then();
  }

  return (
    <form onSubmit={createNewPost}>
      <label>
        <span className={"label mb-3"}>Post title</span>
        <input
          className={"input w-full"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Awesome Article!"
        />
      </label>
      <p>
        <span className={"label mb-3"}>Slug:</span> {slug}
      </p>
      <button
        type="submit"
        disabled={!isTitleValid}
        className={"btn btn-success"}
      >
        Create New Post
      </button>
    </form>
  );
}
