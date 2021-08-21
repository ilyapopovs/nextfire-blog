import UserProfile from "components/UserProfile";
import PostsFeed from "components/PostsFeed";
import { getUserDocByUsername } from "repositories/usersRepository";
import { UserModel } from "structures/userModel";
import { getPostsFromUserDoc } from "repositories/postsRepository";

const MAX_POSTS = 5;

export async function getServerSideProps({ query }) {
  const { username } = query;
  const userDoc = await getUserDocByUsername(username);

  if (!userDoc) {
    return { notFound: true };
  }

  const user = UserModel.fromDocumentSnapshot(userDoc).toSerializedUser();

  const posts = (await getPostsFromUserDoc(userDoc, MAX_POSTS)).map((post) =>
    post.toSerializedPost()
  );

  return {
    props: { user, posts }, // will be passed to the page component as props
  };
}

export default function UserProfilePage({ user, posts }) {
  return (
    <main className={"container"}>
      <UserProfile user={user} />
      <PostsFeed posts={posts} />
    </main>
  );
}
