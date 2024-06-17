import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-form',
  templateUrl: './manage-form.page.html',
  styleUrls: ['./manage-form.page.scss'],
})
export class ManageFormPage implements OnInit {

  forms:any=[]
  constructor(private API:ApiService, private router:Router) { }

  ngOnInit() {
    this.API.getForms().subscribe(data=>{
      this.forms = data.output;
    })
  } 

  getThumbnail(file:string){
    return environment.server +'/image_upload/' + file +'.png?'+ new Date().getTime()
  }

  prettyTime(time:string){
    const format = new Date(time);
    return format.toDateString() +' ' +format.toLocaleTimeString();
  }

  openForm(file:string,id:string){
    this.router.navigate(['/web/formbuilder', {
      f:file,
      u:id,
    }]);
  }
  repeatArray = new Array(3);

  addItem() {
    this.repeatArray.push(1);
  }
}
