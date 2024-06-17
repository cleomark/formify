import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JLAPageRoutingModule } from './jla-routing.module';

import { JLAPage } from './jla.page';
import { ShareModule } from 'src/app/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JLAPageRoutingModule,
    ShareModule
  ],
  declarations: [JLAPage]
})
export class JLAPageModule {}
