import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalComponent } from '../modals/modal/modal.component';
import { UploadModalComponent } from '../modals/upload-modal/upload-modal.component'; // Import your Upload Modal component

@Component({
  selector: 'app-upload-page',
  templateUrl: './upload-page.page.html',
  styleUrls: ['./upload-page.page.scss'],
})
export class UploadPagePage implements OnInit {
  constructor(
    private navCtrl: NavController,
    private router: Router,
    private modalController: ModalController
  ) {}

  uploadFormClicked() {
    this.presentUploadModal(); // Trigger the upload modal when Upload Form button is clicked
  }

  editFormClicked() {
    this.presentEditModal(); // Trigger the edit modal when Edit Form button is clicked
  }

  goToDraftPage() {
    this.router.navigate(['/draft-page']);
  }

  async presentUploadModal() {
    const modal = await this.modalController.create({
      component: UploadModalComponent, // Use your Upload Modal component
    });
    return await modal.present();
  }

  async presentEditModal() {
    const modal = await this.modalController.create({
      component: ModalComponent, // Use your Edit Modal component
    });
    return await modal.present();
  }

  ngOnInit() {}
}
