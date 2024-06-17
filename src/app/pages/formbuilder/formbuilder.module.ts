import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormbuilderPageRoutingModule } from './formbuilder-routing.module';

import { FormbuilderPage } from './formbuilder.page';
import { ShareModule } from 'src/app/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormbuilderPageRoutingModule,
    ShareModule
  ],
  declarations: [FormbuilderPage]
})
export class FormbuilderPageModule {}
