import { firestore, fromMillis, serverTimestamp } from "helpers/firebaseHelper";
import {
  DocumentReference,
  DocumentSnapshot,
  Query,
  Timestamp,
} from "@firebase/firestore-types";
import { PostInterface, PostModel } from "structures/postModel";
import {
  getUserDocByUsername,
  getUserDocRefByUid,
} from "repositories/usersRepository";
import { getCurrentUserUid } from "services/authService";

function getPostsBaseQuery(): Query {
  return firestore
    .collectionGroup("posts")
    .where("isPublished", "==", true)
    .orderBy("createdAt", "desc");
}

export async function getAllPosts(): Promise<PostModel[]> {
  const querySnapshot = await getPostsBaseQuery().get();

  return querySnapshot.docs.map(PostModel.fromDocumentSnapshot);
}

export async function getAllUserPosts(userUid?: string): Promise<PostModel[]> {
  userUid ??= getCurrentUserUid();

  const querySnapshot = await firestore
    .collection("users")
    .doc(userUid)
    .collection("posts")
    .orderBy("createdAt")
    .get();

  return querySnapshot?.docs.map(PostModel.fromDocumentSnapshot) ?? [];
}

export async function getPosts(limit: number = 3): Promise<PostModel[]> {
  const postsQuery = getPostsBaseQuery();
  const querySnapshot = await postsQuery.limit(limit).get();

  return querySnapshot.docs.map(PostModel.fromDocumentSnapshot);
}

export async function getPostsAfter(
  cursor: Timestamp | number,
  limit: number = 3
): Promise<PostModel[]> {
  cursor = typeof cursor === "number" ? fromMillis(cursor) : cursor;

  const postsQuery = getPostsBaseQuery();
  const querySnapshot = await postsQuery.startAfter(cursor).limit(limit).get();

  return querySnapshot.docs.map(PostModel.fromDocumentSnapshot);
}

export async function getPostsFromUserDoc(
  userDoc: DocumentSnapshot,
  limit = 5
): Promise<PostModel[]> {
  const postsQuery = userDoc.ref
    .collection("posts")
    .where("isPublished", "==", true)
    .orderBy("createdAt", "desc")
    .limit(limit);

  return (await postsQuery.get()).docs.map(PostModel.fromDocumentSnapshot);
}

export async function getPostRefBySlug(
  slug: string,
  { username, userUid }: { username?: string; userUid?: string }
): Promise<DocumentReference> {
  if (!username && !userUid) {
    return (
      (await firestore.collectionGroup("posts").where("slug", "==", slug).get())
        .docs[0]?.ref ?? null
    );
  }

  // Get doc ref in a more optimized way if uid or username is provided
  let baseRef: DocumentReference;

  if (userUid) {
    baseRef = getUserDocRefByUid(getCurrentUserUid());
  } else if (username) {
    baseRef = (await getUserDocByUsername(username)).ref;
  }

  return baseRef.collection("posts").doc(slug);
}

/**
 * More optimized, synchronous way of getting a post ref
 */
export function getPostRefBySlugAndUserUid(
  slug: string,
  userUid: string
): DocumentReference {
  return getUserDocRefByUid(userUid).collection("posts").doc(slug);
}

export async function getPostDocBySlug(
  slug: string,
  { username, userUid }: { username?: string; userUid?: string }
): Promise<DocumentSnapshot> {
  return await (await getPostRefBySlug(slug, { username, userUid })).get();
}

export function getPostRefByPath(path: string): DocumentReference {
  return firestore.doc(path);
}

export async function createPost(post: PostInterface): Promise<void> {
  const newDocRef = await getPostRefBySlug(post.slug, {
    userUid: post.userUid,
  });
  // @ts-ignore
  post.createdAt = serverTimestamp();
  // @ts-ignore
  post.updatedAt = serverTimestamp();
  await newDocRef.set(post);
}

export async function updatePost(
  updatedData,
  { post, postRef }: { post?: PostInterface; postRef?: DocumentReference }
): Promise<void> {
  postRef ??= getPostRefBySlugAndUserUid(post.slug, post.userUid);
  updatedData.updatedAt = serverTimestamp();
  await postRef.update(updatedData);
}

export async function deletePost(postRef: DocumentReference): Promise<void> {
  await postRef.delete();
}