import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  usersCollection: AngularFirestoreCollection<User>;
  allUsers: Observable<User[]>;

  userDoc: AngularFirestoreDocument<User>;

  constructor(
   public afStore: AngularFirestore
  ) {
    this.usersCollection = this.afStore.collection('users', ref => {
      return ref.orderBy('displayName');
    });
    this.allUsers = this.usersCollection.valueChanges();
  }

  updateUserRole(usersSelected: string[], userRole: string) {
    usersSelected.forEach(uid => {
      this.userDoc = this.afStore.doc(`users/${uid}`);
      this.userDoc.update({role: userRole});
    });
  }
}
