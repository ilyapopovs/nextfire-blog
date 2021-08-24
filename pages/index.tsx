import PostsFeed from "components/PostsFeed";
import Loader from "components/Loader";
import { useState } from "react";
import { getPosts, getPostsAfter } from "repositories/postsRepository";

// Max posts to query per page
const POSTS_PER_PAGE = parseInt(process.env.NEXT_PUBLIC_POSTS_PER_PAGE);

export async function getServerSideProps() {
  // serializing because otherwise `getServerSideProps` is complaining
  const posts = (await getPosts(POSTS_PER_PAGE)).map((post) =>
    post.toSerializedPost()
  );

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [isLoading, setIsLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  const loadMorePosts = async () => {
    setIsLoading(true);
    const lastPost = posts[posts.length - 1];
    const newPosts = await getPostsAfter(lastPost.createdAt, POSTS_PER_PAGE);

    newPosts.length && setPosts(posts.concat(newPosts));
    newPosts.length !== POSTS_PER_PAGE && setPostsEnd(true);

    setIsLoading(false);
  };

  return (
    <main className={"container -mt-6"}>
      <PostsFeed posts={posts} />

      {!isLoading && !postsEnd && (
        <button className={"btn"} onClick={loadMorePosts}>
          Load more
        </button>
      )}

      <div className={"flex sm:block justify-center"}>
        <Loader isShown={isLoading} />
      </div>

      {postsEnd && "You have reached the end!"}
    </main>
  );
}
