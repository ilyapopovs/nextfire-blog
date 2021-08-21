import Link from "next/link";
import { PostInterface } from "structures/postModel";

export default function PostsFeed({ posts, isAdmin = false }) {
  return posts
    ? posts.map((post) => (
        <PostPreview post={post} key={post.slug} isAdmin={isAdmin} />
      ))
    : null;
}

function PostPreview({
  post,
  isAdmin = false,
}: {
  post: PostInterface;
  isAdmin: boolean;
}) {
  // Rough estimates
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className={"card my-6"}>
      <Link href={`/${post.username}`}>
        <a>
          <strong>By @{post.username}</strong>
        </a>
      </Link>

      <h2 className={"text-2xl font-bold cursor-pointer my-4"}>
        <Link href={`/${post.username}/${post.slug}`} passHref>
          <a className={"inline-block w-full"}>{post.title}</a>
        </Link>
      </h2>

      <footer className={"flex"}>
        <span className={"inline-block"}>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span className={"inline-block ml-auto"}>
          ❤️ {post.heartCount || 0} Hearts
        </span>
      </footer>

      {isAdmin && <AdminControls post={post} />}
    </div>
  );
}

function AdminControls({ post }: { post: PostInterface }) {
  return (
    <div className={"flex justify-between items-center"}>
      <Link href={`/admin/${post.slug}`}>
        <h3>
          <button className={"btn btn-primary w-20"}>Edit</button>
        </h3>
      </Link>

      {post.isPublished ? (
        <p className={"text-green-600 font-bold"}>Live 🚀</p>
      ) : (
        <p className={"text-blue-600 font-bold"}>Unpublished 🔏</p>
      )}
    </div>
  );
}
