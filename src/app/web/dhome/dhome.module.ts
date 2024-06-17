import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DhomePageRoutingModule } from './dhome-routing.module';

import { DhomePage } from './dhome.page';
import { ShareModule } from 'src/app/share/share.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DhomePageRoutingModule,
    ShareModule
  ],
  declarations: [DhomePage]
})
export class DhomePageModule {}
