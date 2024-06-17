import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent  implements OnInit {

  @Input() passedData: string = '';
  @Input() id:string = '';
  constructor(private modalCtrl: ModalController,private API :ApiService) {}

  getKey(id:string){
    return id.split('-')[0];
  }
  forms:Map<string,any> = new Map();

  ngOnInit() {
    this.API.dictionary(this.id).subscribe(data=>{
      this.forms = new Map(Object.entries(data))
      console.log(this.forms);
    })
  }

  getMap(value:any){
    return new Map(Object.entries(value))
  }
  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

}
