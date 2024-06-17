import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageFormPageRoutingModule } from './manage-form-routing.module';

import { ManageFormPage } from './manage-form.page';
import { ShareModule } from 'src/app/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageFormPageRoutingModule,
    ShareModule
  ],
  declarations: [ManageFormPage]
})
export class ManageFormPageModule {}
