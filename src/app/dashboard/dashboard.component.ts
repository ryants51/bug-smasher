import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/user.model';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private authListenerSubs: Subscription;
  user: User = {
    uid: 'Placeholder',
    email: 'Placeholder',
    role: 'Placeholder'
  };

  ticketRef: AngularFirestoreDocument<any>;
  ticket: Observable<any>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // this.authListenerSubs.unsubscribe();
  }

  editTicket() {
    if (this.authService.canEdit(this.user)) {
      this.ticketRef.update({ title: 'Edited title!'});
    }
  }

}
