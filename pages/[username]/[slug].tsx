import PostContent from "../../components/PostContent";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import AuthCheck from "../../components/AuthCheck";
import HeartButton from "../../components/HeartButton";
import Link from "next/link";

export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection("posts").doc(slug);
    post = postToJSON(await postRef.get());

    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 100,
  };
}

export async function getStaticPaths() {
  // Optional todo: Improve using Admin SDK to select empty docs
  const snapshot = await firestore.collectionGroup("posts").get();

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: "blocking",
  };
}

export default function Post(props) {
  const postRef = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  return (
    <main className={"container mx-auto py-4 flex justify-between"}>
      <section className={"pr-8"} style={{ flex: 3 }}>
        <PostContent post={post} />
      </section>

      <div style={{ flex: 1 }}>
        <aside className={"card sticky top-24"} >
          <p className={"font-bold mb-6"}>
            Hearts: {post.heartCount || 0} ❤️
          </p>
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
