
import { ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-template-forms',
  templateUrl: './template-forms.component.html',
  styleUrls: ['./template-forms.component.scss'],
})
export class TemplateFormsComponent  implements OnInit {
  @Input() passedData: string = '';
  @Input() id:string = '';
  submitForm() {
    const formData = {
      name: (document.getElementById('name') as HTMLInputElement).value,
      address: (document.getElementById('address') as HTMLInputElement).value,
      type: (document.getElementById('type') as HTMLInputElement).value,
      mobile: (document.getElementById('mobile') as HTMLInputElement).value,
      groupName: (document.getElementById('groupName') as HTMLInputElement).value,
      groupAddress: (document.getElementById('groupAddress') as HTMLInputElement).value,
      lenderName: (document.getElementById('lenderName')as HTMLInputElement).value,
      lenderAddress: (document.getElementById('lenderAddress')as HTMLInputElement).value,
      cicNo: (document.getElementById('cicNo')as HTMLInputElement).value,
      farmLocation: (document.getElementById('farmLocation')as HTMLInputElement).value,
      north: (document.getElementById('north')as HTMLInputElement).value,
      south: (document.getElementById('south')as HTMLInputElement).value,
      east: (document.getElementById('east')as HTMLInputElement).value,
      west: (document.getElementById('west')as HTMLInputElement).value,
      areaPlanted: (document.getElementById('areaPlanted')as HTMLInputElement).value,
      ppirArea: (document.getElementById('ppirArea')as HTMLInputElement).value,
      datePlanning: (document.getElementById('datePlanning')as HTMLInputElement).value,
      ppirDopds: (document.getElementById('ppirDopds')as HTMLInputElement).value,
      tp: (document.getElementById('tp')as HTMLInputElement).value,
      ppirDoptp: (document.getElementById('ppirDoptp')as HTMLInputElement).value,
      seedVariety: (document.getElementById('seedVariety')as HTMLInputElement).value,
      pcicList: (document.getElementById('pcicList')as HTMLInputElement).value,
      riceVariety: (document.getElementById('riceVariety')as HTMLInputElement).value,
      remarks: (document.getElementById('remarks')as HTMLInputElement).value,
      conformedBy: (document.getElementById('conformedBy')as HTMLInputElement).value,
      preparedBy: (document.getElementById('preparedBy')as HTMLInputElement).value,
      
    };

  const requiredFields = ['name', 'address', 'type', 'mobile', 'lenderName', 'lenderAddress', 'cicNo', 'farmLocation', 'north', 'south', 'east', 'west', 'areaPlanted', 'ppirArea', 'datePlanning', 'ppirDopds', 'ppirDoptp', 'tp', 'seedVariety', 'pcicList', 'riceVariety', 'conformedBy', 'preparedBy'];

  const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

  if (missingFields.length > 0) {
    const errorMessage = 'Please fill out all required fields: ';
    alert(errorMessage);
    return; 
    
  }

    console.clear();
    console.log('Form Data:', formData);
    setTimeout(() => {
      this.clearFormFields();
    }, 0);
  }
  clearFormFields() {
    const formElement = document.getElementById('farmerForm') as HTMLFormElement;
    if (formElement) {
      formElement.reset(); 
    }
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

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
 
}