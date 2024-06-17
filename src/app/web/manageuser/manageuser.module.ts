import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageuserPageRoutingModule } from './manageuser-routing.module';

import { ManageuserPage } from './manageuser.page';
import { GeolocateComponent } from 'src/app/components/geolocate/geolocate.component';
import { GeoAdduserComponent } from 'src/app/components/geo-adduser/geo-adduser.component';
import { ShareModule } from 'src/app/share/share.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageuserPageRoutingModule,
    ShareModule
  ],
  declarations: [ManageuserPage,GeolocateComponent,GeoAdduserComponent]
})
export class ManageuserPageModule {}
