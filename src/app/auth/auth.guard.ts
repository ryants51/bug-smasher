import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | Observable<boolean>{
    return this.authService.getUser().pipe(
      take(1),
      map(user => !!user), // map to boolean
      tap(loggedIn => {
        if (!loggedIn) {
          console.log('Access denied!');
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
