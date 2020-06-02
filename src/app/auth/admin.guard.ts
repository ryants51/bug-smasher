import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.getUser().pipe(
        take(1),
        map(user => user && user.role === 'Admin' ? true : false), // instead of checking admin, you could check canRead, canEdit, etc
        tap(isAdmin => {
          if  (!isAdmin) {
            console.error('Access denied - Admins only!');
            this.router.navigate(['dashboard']);
          }
        })
      );
  }

}
