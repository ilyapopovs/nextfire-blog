import Link from "next/link";
import ReactMarkdown from "react-markdown";

// UI component for main post content
export default function PostContent({ post }) {
  const createdAt: Date =
    typeof post?.createdAt === "number"
      ? new Date(post.createdAt)
      : post.createdAt.toDate();

  return (
    <div className={"card my-6"}>
      <h1 className={"text-2xl font-bold mb-1"}>{post?.title}</h1>
      <span className={"text-sm"}>
        Written by{" "}
        <Link href={`/${post.username}/`} passHref>
          <a className={"text-theme-link font-bold"}>@{post.username}</a>
        </Link>{" "}
        on {createdAt.toDateString()}
      </span>
      <div className={"mt-4"}>
        <ReactMarkdown>{post?.content}</ReactMarkdown>
      </div>
    </div>
  );
}
