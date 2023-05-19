import { ManageClientsComponent } from './manage-clients/manage-clients.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DefaultDashboardComponent } from './default-dashboard/default-dashboard.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageArticlesComponent } from './manage-articles/manage-articles.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { ManageSousCategoryComponent } from './manage-sous-category/manage-sous-category.component';
import { ManageFournisseursComponent } from './manage-fournisseurs/manage-fournisseurs.component';
import { ManageCommandeClientsComponent } from './manage-commande-clients/manage-commande-clients.component';
import { ManageCommandeFournisseursComponent } from './manage-commande-fournisseurs/manage-commande-fournisseurs.component';
import { ManageVentesComponent } from './manage-ventes/manage-ventes.component';
import { ManageMvtStkComponent } from './manage-mvt-stk/manage-mvt-stk.component';
import { AddCategoryComponent } from './manage-category/add-category/add-category.component';
import { AddCommandeClientComponent } from './pages/add-commande-client/add-commande-client.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', component: DefaultDashboardComponent },
      { path: 'dashboard', component: DefaultDashboardComponent },
      { path: 'users', component: ManageUsersComponent },
      { path: 'article', component: ManageArticlesComponent },
      { path: 'category', component: ManageCategoryComponent },
      { path: 'addCategory', component: AddCategoryComponent },
      { path: 'sousCategory', component: ManageSousCategoryComponent },
      { path: 'clients', component: ManageClientsComponent },
      { path: 'fournisseurs', component: ManageFournisseursComponent },
      { path: 'commandeClients',
          component: ManageCommandeClientsComponent,
          data: {
            origin: 'client'
          }
    },
      { path: 'addcommandeClient',
      component: AddCommandeClientComponent,
      data: {
        origin: 'client'
      }
     },
     { path: 'addcommandeFournisseur',
      component: AddCommandeClientComponent,
      data: {
        origin: 'fournisseur'
      }
     },
      {
        path: 'commandeFournisseurs',
        component: ManageCommandeClientsComponent,
        data: {
          origin: 'fournisseur'
        }
      },
      { path: 'ventes', component: ManageVentesComponent },
      { path: 'mouvements', component: ManageMvtStkComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
