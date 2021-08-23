import { DocumentSnapshot } from "@firebase/firestore-types";

/**
 * Represents a document in the `posts` Firestore collection
 */
export interface PostInterface {
  userUid?: string;
  slug?: string;
  title?: string;
  content?: string;
  isPublished?: boolean;
  username?: string;
  heartCount?: number;
  createdAt?: number;
  updatedAt?: number;
}

export class PostModel implements PostInterface {
  userUid: string;
  slug: string;
  title: string;
  content: string;
  isPublished: boolean;
  username: string;
  heartCount: number;
  createdAt: number;
  updatedAt: number;

  constructor(postData = {}) {
    // @ts-ignore
    this.userUid = postData.userUid ?? null;
    // @ts-ignore
    this.slug = postData.slug ?? "";
    // @ts-ignore
    this.title = postData.title ?? "";
    // @ts-ignore
    this.content = postData.content ?? "";
    // @ts-ignore
    this.isPublished = postData.isPublished ?? false;
    // @ts-ignore
    this.username = postData.username ?? "";
    // @ts-ignore
    this.heartCount = postData.heartCount ?? 0;
    // @ts-ignore
    this.createdAt = postData.createdAt ?? null;
    // @ts-ignore
    this.updatedAt = postData.updatedAt ?? null;
  }

  static fromDocumentSnapshot(doc: DocumentSnapshot): PostModel {
    const data = doc.data();
    const newPost = Object.assign(new PostModel(), data);

    // Firestore timestamp is NOT serializable to JSON - must convert to milliseconds
    newPost.createdAt = data?.createdAt?.toMillis() ?? 0;
    newPost.updatedAt = data?.updatedAt?.toMillis() ?? 0;

    return newPost;
  }

  toSerializedPost(): PostInterface {
    return JSON.parse(JSON.stringify(this));
  }
}
