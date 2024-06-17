import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-page',
  templateUrl: './form-page.page.html',
  styleUrls: ['./form-page.page.scss'],
})
export class FormPagePage implements OnInit {
  constructor(private router: Router) {}

  formData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    dob: '',

    // Add more properties as needed
  };

  onSubmit() {
    this.router.navigate(['/success-page']);
  }

  goToUploadPage() {
    this.router.navigate(['/tabs/upload-page']);
  }

  downloadClicked() {
    console.log('Download button clicked!');
  }

  ngOnInit() {}
}
