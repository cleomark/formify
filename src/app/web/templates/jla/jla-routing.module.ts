import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JLAPage } from './jla.page';

const routes: Routes = [
  {
    path: '',
    component: JLAPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JLAPageRoutingModule {}
