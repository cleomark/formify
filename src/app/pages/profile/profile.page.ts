import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userdata:any;
  constructor(private API: ApiService) { }

  ngOnInit() {
    this.userdata = this.API.getUserData();
  }

  logout(){
    this.API.logout();
  }

}
