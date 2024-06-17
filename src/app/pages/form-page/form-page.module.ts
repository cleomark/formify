import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormPagePageRoutingModule } from './form-page-routing.module';

import { FormPagePage } from './form-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormPagePageRoutingModule
  ],
  declarations: [FormPagePage]
})
export class FormPagePageModule {}
