import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AgentGuard } from './guards/agent.guard';
import { LoginGuard } from './guards/login.guard';
import { MessageGuard } from './guards/message.guard';
import { TemplateFormsComponent } from './components/template-forms/template-forms.component';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'splash',
    loadChildren: () =>
      import('./pages/splash/splash.module').then((m) => m.SplashPageModule),
  },
  {
    path: 'tabs',
    canActivate: [AgentGuard],
    loadChildren: () =>
      import('./pages/tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'web/login',
    canActivate: [LoginGuard],
    loadChildren: () =>
      import('./web/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'web/manageuser',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('./web/manageuser/manageuser.module').then(
        (m) => m.ManageuserPageModule
      ),
  },
  {
    path: 'draft-page',
    loadChildren: () =>
      import('./pages/draft-page/draft-page.module').then(
        (m) => m.DraftPagePageModule
      ),
  },
  {
    path: 'form-page',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('./pages/form-page/form-page.module').then(
        (m) => m.FormPagePageModule
      ),
  },
  {
    path: 'web/formbuilder',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('./pages/formbuilder/formbuilder.module').then(
        (m) => m.FormbuilderPageModule
      ),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/dashboard/dashboard.module').then(
        (m) => m.DashboardPageModule
      ),
  },
  {
    path: 'web/dhome',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('./web/dhome/dhome.module').then((m) => m.DhomePageModule),
  },
  {
    path: 'commcontent',
    canActivate:[MessageGuard],
    loadChildren: () =>
      import('./pages/commcontent/commcontent.module').then(
        (m) => m.CommcontentPageModule
      ),
  },

  {
    path: 'communication',
    loadChildren: () =>
      import('./pages/communication/communication.module').then(
        (m) => m.CommunicationPageModule
      ),
  },
  // {
  //   path: 'web/geolocate',
  //   loadChildren: () =>
  //     import('./web/geolocate/geolocate.module').then(
  //       (m) => m.GeolocatePageRoutingModule
  //     ),
  // },
  {
    path: 'web/manageuser',
    canActivate: [AdminGuard],
    loadChildren: () => import('./web/manageuser/manageuser.module').then( m => m.ManageuserPageModule)
  },
  {
    path: 'web/manage-form',
    canActivate: [AdminGuard],
    loadChildren: () => import('./web/manage-form/manage-form.module').then( m => m.ManageFormPageModule)
  },
  {
    path: 'success-page',
    loadChildren: () => import('./success-page/success-page.module').then( m => m.SuccessPagePageModule)
  },
  {
    path: 'web/chat',
    canActivate: [AdminGuard],
    loadChildren: () => import('./web/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'web/browse-templates',
    loadChildren: () => import('./web/browse-templates/browse-templates.module').then( m => m.BrowseTemplatesPageModule)
  },
  {
    path: 'web/templates/jla',
    loadChildren: () => import('./web/templates/jla/jla.module').then( m => m.JLAPageModule)
  }





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
