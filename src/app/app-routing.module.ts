import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FullComponent } from './layouts/full/full.component';
import { AuthGardService } from './services/guard/auth-gard.service';

const routes: Routes = [

  {path:'',component:LoginComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {
    path: 'workspace/dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGardService]
    },

  // {path: '',
  //   component: FullComponent,
  //   children: [
  //     {
  //       path: '',
  //       redirectTo: '/workspace/dashboard',
  //       pathMatch: 'full',
  //     },
  //     {
  //         path: 'dashboard',
  //         loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
  //         },

  //   ]},
  // {
  //   path: 'dashboard',
  //   loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
  //   },
  //   ]},
  // {
  //   path: '',
  //   component: FullComponent,
  //   children: [
  //     {
  //       path: '',
  //       redirectTo: '/workspace/dashboard',
  //       pathMatch: 'full',
  //     },
  //     { path: 'stock',
  //     loadChildren:
  //      () => import('./stock-component/stock-component.module').then(m => m.StockComponentModule)
  //   },
  //     {
  //        path: 'dashboard',
  //        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
  //        }
  //   ]
  // },

  { path: '**', component: LoginComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
