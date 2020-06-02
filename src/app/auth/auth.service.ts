import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../user/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private router: Router
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afStore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  getUser() {
    return this.user;
  }

  async login(email: string, password: string){
    const credential = await firebase.auth().signInWithEmailAndPassword(email, password);
    return this.router.navigate(['/dashboard']);
  }

  async signOut() {
    await this.afAuth.signOut();
    return this.router.navigate(['/login']);
  }

  private updateUserData(user, userName?: string) {
    const userRef: AngularFirestoreDocument<User> = this.afStore.doc(`users/${user.uid}`);
    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName === null ? userName : user.displayName,
      photoURL: user.photoURL,
      role: 'Developer'
    };

    return userRef.set(data, { merge: true });
  }

  private checkAuthorization(user: User, allowedRoles: string[]): boolean {
    if (!user) {
      return false;
    }

    allowedRoles.forEach((role) => {
      if (allowedRoles.includes(user.role)) {
        return true;
      }
    });

    return false;
  }

  public canRead(user: User): boolean {
    const allowed = ['admin', 'manager', 'developer'];

    return this.checkAuthorization(user, allowed);

    return true;
  }

  public canEdit(user: User): boolean {
    const allowed = ['admin', 'manager'];

    return this.checkAuthorization(user, allowed);

    return true;
  }

  public canDelete(user: User): boolean {
    const allowed = ['admin'];

    return this.checkAuthorization(user, allowed);

    return true;
  }

  async signup(email: string, password: string, displayName: string){
    return await firebase.auth().createUserWithEmailAndPassword(email, password).then((credential) => {
      this.updateUserData(credential.user, displayName).then(() => {
        this.router.navigate(['/dashboard']);
      });
    });
  }

  async doGoogleLogin(){
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    return this.oAuthLogin(provider);
  }

  async doFacebookLogin(){
    const provider = new firebase.auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
 }

  private oAuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider).then((credential) => {
      this.updateUserData(credential.user).then(() => {
        this.router.navigate(['/dashboard']);
      });
    });
  }
}
