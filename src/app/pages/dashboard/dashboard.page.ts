import { Component, HostListener, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';
import { TaskNotificationComponent } from 'src/app/components/task-notification/task-notification.component';
import { ActionSheetController } from '@ionic/angular';
import { UserFormComponent } from 'src/app/components/user-form/user-form.component';
import Swiper from 'swiper';
import { ApiService } from 'src/app/services/api/api.service';
import { TemplateFormsComponent } from 'src/app/components/template-forms/template-forms.component';
import { TemplatesFormsComponent } from 'src/app/components/templates-forms/templates-forms.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  
  UserData:any;

  Agent: any = "AGENT 0745";


  constructor(private modalCtrl: ModalController, private actionSheetCtrl: ActionSheetController, private API: ApiService) {}

  async openModal() {

    const modal = await this.modalCtrl.create({
      component: NotificationsComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

  }

  async openTask() {

    const modal = await this.modalCtrl.create({
      component: TaskNotificationComponent,
    });
    modal.present();

   

  

  }
  Title = 'Typhoon Survey';

async openForm(id:string) {
  const modal = await this.modalCtrl.create({
    component: UserFormComponent,
    componentProps: {
      id:id,
      passedData: this.Title,
    },
  });
  modal.present();

}



  isActionSheetOpen = false;
  public actionSheetButtons = [
    {
      icon: 'text',
      text: 'Title [a-z]',
      data: {
        action: 'AtoZ',
        text: 'Title [a-z]',
        icon: 'text',
      },
    },
    {
      icon: 'text-outline',
      text: 'Title [z-a]',
      data: {
        action: 'ZtoA',
        text: 'Title [z-a]',
        icon: 'text',
      },
    },
    {
      icon: 'create-outline',
      text: 'Lastest edit',
      data: {
        action: 'Lastest edit',
        text: 'Lastest edit',
        icon: 'create-outline',
      },
    },
    {
      text: 'Finished Tasks',
      icon: 'document-text-outline',
      handler: () => {
        this.openTask();
      },
      data: {
        action: 'finish',
        text: 'Finished Tasks',
        icon: 'document-text-outline',       
      },
    },
    {
      text: 'Unread',
      icon: 'mail-unread-outline',
      data: {
        action: 'unred',
        text: 'Unread',
        icon: 'mail-unread-outline',
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      icon: 'arrow-back-outline',
    },
  ];

  setOpen(isOpen: boolean) {
    this.isActionSheetOpen = isOpen;
  }

  optionicon: string = 'text';
  optiontext: string = 'Title [a-z]';
  selectedAction: any;
  logResult(ev: any) {
    this.optiontext = ev.detail.data.text;
    this.optionicon = ev.detail.data.icon;
    this.selectedAction = ev.detail.data.action;
  }
  

  cards = Array(2).fill({});
  forms:any = [];
  ngOnInit() {
    this.UserData = this.API.getUserData();
    this.Agent = this.UserData.username;
    this.API.getForms().subscribe(data=>{
      this.forms = data.output;
    })
  }

  ngAfterViewInit() {

  }

  async openFormtemp() {
    const modal = await this.modalCtrl.create({
      component: TemplateFormsComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

  }

  async openFormtemps() {
    const modal = await this.modalCtrl.create({
      component: TemplatesFormsComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

  }
  
  
}

