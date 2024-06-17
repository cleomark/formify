import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  constructor(
    private modalController: ModalController,
    private router: Router
  ) {}

  forms: string[] = ['Form 1', 'Form 2', 'Form 3'];
  selectedForm: string | undefined;

  selectFormClicked(formName: string | undefined) {
    if (formName !== undefined) {
      this.selectedForm = this.selectedForm === formName ? undefined : formName;
    }
  }

  selectForm() {
    // Do something with the selected form (e.g., you can log it)
    if (this.selectedForm !== undefined) {
      console.log('Selected Form:', this.selectedForm);
    }

    // Navigate to the same page regardless of the selected form
    this.router.navigate(['/form-page']);

    this.modalController.dismiss();
  }

  exitModal() {
    this.modalController.dismiss();
  }

  ngOnInit() {}
}
