import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-draft-page',
  templateUrl: './draft-page.page.html',
  styleUrls: ['./draft-page.page.scss'],
})
export class DraftPagePage {
  formDrafts: FormDraft[] = [];

  constructor(private router: Router) {
    // Placeholder data for visualization purposes
    this.formDrafts = [
      { title: 'Form 1' },
      { title: 'Form 2' },
      { title: 'Form 3' },
      // Add more placeholder data as needed
    ];
  }

  goToUploadPage() {
    this.router.navigate(['/tabs/upload-page']);
  }

  openOptionsMenu() {
    console.log('Options button clicked. Add your functionality here.');
  }

  editForm(formData: FormDraft) {
    this.router.navigate(['/form-page']);
  }

  uploadForm(formData: FormDraft) {
    this.router.navigate(['/success-page']);
  }
}

interface FormDraft {
  title: string;
}
