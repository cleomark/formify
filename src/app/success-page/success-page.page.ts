import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.page.html',
  styleUrls: ['./success-page.page.scss'],
})
export class SuccessPagePage implements OnInit {
  constructor(private router: Router) {}

  goToUploadPage() {
    this.router.navigate(['/tabs/upload-page']);
  }

  ngOnInit() {}
}
