import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-task-notification',
  templateUrl: './task-notification.component.html',
  styleUrls: ['./task-notification.component.scss'],
})
export class TaskNotificationComponent  implements OnInit {

  ngOnInit() {}
  name!: string;

  constructor(private modalCtrl: ModalController) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }
}
