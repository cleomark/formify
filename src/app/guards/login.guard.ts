import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Route, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.API.isLoggedIn()){
        switch(this.API.getUserType()){
          case '0':
            this.router.navigate(['/web/dhome']);
            break;
          case '1':
            this.router.navigate(['/tabs/Dashboard']);
            break;
        }
      }
      return true;
  }
  constructor(
    private API: ApiService,
    private router:Router, 
  ){}
}
