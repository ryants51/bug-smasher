import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFirestoreModule } from '@angular/fire/firestore/public_api';
import { AngularFireAuthModule } from '@angular/fire/auth/public_api';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule // imports firebase/auth, only needed for auth features
  ]
})
export class CoreModule { }
