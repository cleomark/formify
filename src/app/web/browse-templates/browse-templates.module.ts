import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BrowseTemplatesPageRoutingModule } from './browse-templates-routing.module';

import { BrowseTemplatesPage } from './browse-templates.page';
import { ShareModule } from 'src/app/share/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrowseTemplatesPageRoutingModule,
    ShareModule
  ],
  declarations: [BrowseTemplatesPage]
})
export class BrowseTemplatesPageModule {}
