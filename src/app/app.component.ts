import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from './auth/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, shareReplay } from 'rxjs/operators';
import { User } from './user/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Bug Smasher';
  isLoggedIn = false;
  private authListenerSubs: Subscription;
  user: User = {
    uid: 'Placeholder',
    email: 'Placeholder',
    role: 'Placeholder'
  };

  isHandset$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authListenerSubs = this.authService.getUser().subscribe((user) => {
      this.user = user;
      if (!!this.user) {
        this.title = `Welcome, ${user.displayName}`;
        this.isLoggedIn = true;
      }
    });

    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    this.authService.getUser().subscribe(user => this.user = user);
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.authService.signOut();
    this.title = `Bug Smasher`;
    this.isLoggedIn = false;
  }
}
