import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';
import { TaskNotificationComponent } from 'src/app/components/task-notification/task-notification.component';
import { UserFormComponent } from 'src/app/components/user-form/user-form.component';
import { TemplateFormsComponent } from 'src/app/components/template-forms/template-forms.component';
import { TemplatesFormsComponent } from 'src/app/components/templates-forms/templates-forms.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, DashboardPageRoutingModule],
  declarations: [
    DashboardPage,
    NotificationsComponent,
    TaskNotificationComponent,
    UserFormComponent,
    TemplateFormsComponent,
    TemplatesFormsComponent,
  ],
})
export class DashboardPageModule {}
