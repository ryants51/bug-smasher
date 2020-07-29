import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Project } from '../project/project.model';
import { Observable } from 'rxjs';
import { firestore } from 'firebase';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/user.model';
import { Ticket } from './ticket.model';
import { Attachment } from './attachments/attachment.model';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  ticketsCollection: AngularFirestoreCollection<Project>;
  allTickets: Observable<Project[]>;

  loggedInUser: User;

  constructor(
   public afStore: AngularFirestore,
   private authService: AuthService
  ) {
    this.authService.getUser().subscribe((user) => {
      if (user != null) {
        this.loggedInUser = user;
        this.ticketsCollection = this.afStore.collection('tickets', ref => {
          return ref.where('assignedUsers', 'array-contains', this.loggedInUser.uid).orderBy('title');
        });
        this.allTickets = this.ticketsCollection.valueChanges({idField: 'projectID'});
      }
    });
  }

  createNewTicket(title: string, description: string, priority: string, type: string, parentProject, assignedUser: string) {
    let newTicketID;

    // Add a blank ticket to generate the ID and then update the ticket with the correct values
    this.afStore.collection('tickets').add({}).then((newTicket) => {
      console.log(newTicket);

      newTicketID = newTicket.id;
      const ticketRef: AngularFirestoreDocument<Ticket> = this.afStore.doc(`tickets/${newTicketID}`);

      const ticketData: Ticket = {
        assignedUser,
        creator: this.loggedInUser.displayName,
        description,
        title,
        dateCreated: new Date(),
        parentProject,
        priority,
        status: 'Open',
        type,
        lastUpdated: new Date(),
        uid: newTicketID
      };

      ticketRef.set(ticketData, { merge: true });
      this.afStore.doc(`tickets/${newTicketID}`).collection('attachments').add({});
      this.afStore.doc(`tickets/${newTicketID}`).collection('comments').add({});
      this.afStore.doc(`tickets/${newTicketID}`).collection('history').add({});

      this.afStore.doc(`projects/${parentProject}`).update({
        tickets: firebase.firestore.FieldValue.arrayUnion(newTicketID),
        assignedUsers: firebase.firestore.FieldValue.arrayUnion(assignedUser)
      });
    });
  }

  editTicket(ticketID: string, title: string, description: string) {
    firestore().collection('tickets').doc(ticketID).update({
      projectName: title,
      projectDescription: description
    });
  }
}
