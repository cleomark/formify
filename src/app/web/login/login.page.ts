import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage{

  constructor(private API:ApiService) {}
  username:string = '';
  password:string = '';

  updateUsername(event:any){
    this.username = event.target.value;
  }

  updatePassword(event:any){
    this.password = event.target.value;
  }

  login(){
    this.API.loginAdmin(this.username, this.password)
  }
}
