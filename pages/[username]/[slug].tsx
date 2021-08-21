import PostContent from "components/PostContent";
import { useDocumentData } from "react-firebase-hooks/firestore";
import AuthCheck from "components/AuthCheck";
import HeartButton from "components/HeartButton";
import Link from "next/link";
import {
  getAllPosts,
  getPostDocBySlug,
  getPostRefByPath,
} from "repositories/postsRepository";
import { PostModel } from "structures/postModel";

export async function getStaticProps({ params }) {
  const { username, slug } = params;

  const postDoc = await getPostDocBySlug(slug, { username });
  const post = postDoc
    ? PostModel.fromDocumentSnapshot(postDoc).toSerializedPost()
    : null;
  const postPath = postDoc?.ref.path;

  return {
    props: { post, postPath },
    revalidate: 100,
  };
}

/**
 * Note: Path data retrieval can be improved with Admin SDK
 */
export async function getStaticPaths() {
  const allPublishedPosts = await getAllPosts();

  // this structure format is required by Next.js
  const paths = allPublishedPosts.map((post) => ({
    params: { username: post.username, slug: post.slug },
  }));

  return { paths, fallback: "blocking" };
}

export default function Post(props) {
  const postRef = getPostRefByPath(props.postPath);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  return (
    <main className={"container flex flex-col lg:flex-row justify-between"}>
      <section className={"mb-10 lg:mb-0 lg:pr-10"} style={{ flex: 3 }}>
        <PostContent post={post} />
      </section>

      <div style={{ flex: 1 }}>
        <aside className={"card sticky my-0"}>
          <p className={"font-bold mb-6"}>Hearts: {post.heartCount || 0} ❤️</p>
          <AuthCheck
            fallback={
              <Link href="/enter" passHref>
                <button className={"btn btn-success my-0"}>❤️ Sign Up</button>
              </Link>
            }
          >
            <HeartButton postRef={postRef} />
          </AuthCheck>
        </aside>
      </div>
    </main>
  );
}
