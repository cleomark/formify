import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class MessageGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.API.chat == null){
      if(this.API.getUserType() =='1'){
        this.router.navigate(['/tabs/communication']);
      }else{
        this.router.navigate(['/communication']);
      }
      return false;
    }
    return true;
  }
  
  constructor(private API:ApiService, private router:Router){}
}
