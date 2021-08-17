import PostFeed from "../components/PostFeed";
import Loader from "../components/Loader";
import MetaTags from "../components/MetaTags";
import { firestore, fromMillis, postToJSON } from "../lib/firebase";

import { useState } from "react";

// Max posts to query per page
const LIMIT = 1;

export async function getServerSideProps(context) {
  const postsQuery = firestore
    .collectionGroup("posts")
    .where("published", "==", true)
    .orderBy("createdAt", "desc")
    .limit(LIMIT);

  const posts = (await postsQuery.get()).docs.map(postToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    const cursor =
      typeof last.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt;

    const query = firestore
      .collectionGroup("posts")
      .where("published", "==", true)
      .orderBy("createdAt", "desc")
      .startAfter(cursor)
      .limit(LIMIT);

    const newPosts = (await query.get()).docs.map((doc) => doc.data());
    newPosts.length ? setPosts(posts.concat(newPosts)) : setPostsEnd(true);
    setLoading(false);
  };

  return (
    <main className={"container -mt-6"}>
      <MetaTags />
      <PostFeed posts={posts} />

      {!loading && !postsEnd && (
        <button className={"btn"} onClick={getMorePosts}>
          Load more
        </button>
      )}

      <div className={"flex sm:block justify-center"}>
        <Loader show={loading} />
      </div>

      {postsEnd && "You have reached the end!"}
    </main>
  );
}
