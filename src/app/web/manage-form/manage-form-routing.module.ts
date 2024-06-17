import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageFormPage } from './manage-form.page';

const routes: Routes = [
  {
    path: '',
    component: ManageFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageFormPageRoutingModule {}
