import { DocumentSnapshot } from '@firebase/firestore-types'

/**
 * Represents a document in the `users` Firestore collection
 */
export interface UserInterface {
  uid: string;
  displayName: string;
  photoURL: string;
  username?: string;
}

export class UserModel implements UserInterface{
  uid: string;
  displayName: string;
  photoURL: string;
  username?: string;

  static fromDocumentSnapshot(doc: DocumentSnapshot): UserModel {
    const data = doc.data();
    return Object.assign(new UserModel(), data);
  }

  toSerializedUser(): UserInterface {
    return JSON.parse(JSON.stringify(this));
  }
}
