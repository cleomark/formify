import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrowseTemplatesPage } from './browse-templates.page';

const routes: Routes = [
  {
    path: '',
    component: BrowseTemplatesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrowseTemplatesPageRoutingModule {}
