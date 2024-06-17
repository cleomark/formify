import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{

  constructor(private API:ApiService) {}
  username:string = '';
  password:string = '';

  ngOnInit(): void {
  }

  updateUsername(event:any){
    this.username = event.target.value;
  }

  updatePassword(event:any){
    this.password = event.target.value;
  }

  login(){
    this.API.loginAgent(this.username, this.password)
  }
}