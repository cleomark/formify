import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss'],
})
export class UploadModalComponent implements OnInit {
  // Initialize capturedImage in the constructor
  @ViewChild('capturedImage') capturedImage!: ElementRef<HTMLImageElement>;

  constructor(
    private modalController: ModalController,
    public photoService: PhotoService
  ) {}

  // Remove 'const' keyword and fix method declaration
  openCamera = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });

    var imageUrl = image.webPath;

    // Use the declared property to set the src
    this.capturedImage.nativeElement.src = imageUrl!;
    this.dismissModal();
  };

  openFiles() {
    this.photoService.addNewToGallery();
    this.dismissModal();
  }

  dismissModal() {
    this.modalController.dismiss();
  }

  ngOnInit() {}
}
