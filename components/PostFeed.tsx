import Link from "next/link";

export default function PostFeed({ posts, admin = false }) {
  return posts
    ? posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))
    : null;
}

function PostItem({ post, admin = false }) {
  // Naive method to calc word count and read time
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

      {/* If admin view, show extra controls for user */}
      {admin && (
        <div className={"flex justify-between items-center"}>
          <Link href={`/admin/${post.slug}`}>
            <h3>
              <button className={"btn btn-primary w-20"}>Edit</button>
            </h3>
          </Link>

          {post.published ? (
            <p className={"text-green-600 font-bold"}>Live 🚀</p>
          ) : (
            <p className={"text-blue-600 font-bold"}>Unpublished 🔏</p>
          )}
        </div>
      )}
    </div>
  );
}
