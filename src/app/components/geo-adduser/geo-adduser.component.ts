// geo-adduser.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-geo-adduser',
  templateUrl: './geo-adduser.component.html',
  styleUrls: ['./geo-adduser.component.scss'],
})
export class GeoAdduserComponent implements OnInit {
  @Input() userData: any;
  @Output() userAdded = new EventEmitter<any>();

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
    // If userData is provided, populate the form for editing
    if (this.userData) {
      this.populateForm(this.userData);
    }
  }

  populateForm(user: any) {
    // Populate the form fields with the existing user data for editing
    (document.getElementById('firstname') as HTMLInputElement).value = user.id;
    (document.getElementById('lastname') as HTMLInputElement).value = user.fullname;
    (document.getElementById('email') as HTMLInputElement).value = user.email;
    (document.getElementById('address') as HTMLInputElement).value = user.location;
  
    // Set the file input value if a document is attached
    const fileInput = document.getElementById('file') as HTMLInputElement;
  
    if (user.documents && user.documents !== 'No documents') {
      fileInput.value = ''; // Reset the file input
      if (fileInput.labels) {
        fileInput.labels[0].innerText = user.documents;
      } else {
        // If labels is null, set the value directly (may not show the file name)
        fileInput.value = user.documents;
      }
    }
  }
  
  saveUserData() {
    console.log('Saving user data...');
  
    const fileInput = (document.getElementById('file') as HTMLInputElement);
    const file = fileInput?.files?.[0]; // Get the selected file
  
    const userData = {
      id: (document.getElementById('firstname') as HTMLInputElement).value,
      fullname: (document.getElementById('lastname') as HTMLInputElement).value,
      email: (document.getElementById('email') as HTMLInputElement).value,
      location: (document.getElementById('address') as HTMLInputElement).value,
      documents: file ? file.name : (fileInput.labels && fileInput.labels[0].innerText) || 'No documents',
    };
  
    console.log('Emitted user data:', userData);
  
    this.modalCtrl.dismiss(userData);
    this.userAdded.emit(userData);
  }
  
  
}
