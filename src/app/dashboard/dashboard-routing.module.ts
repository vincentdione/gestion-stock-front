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
import { ManageUniteComponent } from './manage-unite/manage-unite.component';
import { ManageModePayementComponent } from './manage-mode-payement/manage-mode-payement.component';
import { ManageConditionComponent } from './manage-condition/manage-condition.component';
import { SearchStockComponent } from './manage-mvt-stk/search-stock/search-stock.component';
import { SingleVenteComponent } from './manage-ventes/single-vente/single-vente.component';
import { SingleCommandeClientComponent } from './pages/single-commande-client/single-commande-client.component';
import { ManageLivraisonsComponent } from './manage-livraisons/manage-livraisons.component';
import { SearchLivraisonsComponent } from './manage-livraisons/search-livraisons/search-livraisons.component';
import { ManageEntreprisesComponent } from './manage-entreprises/manage-entreprises.component';
import { AuthGardService } from '../services/guard/auth-gard.service';
import { FactureComponent } from './facture/facture.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', component: DefaultDashboardComponent },
      { path: 'dashboard', component: DefaultDashboardComponent },

      { path: 'users', component: ManageUsersComponent, canActivate: [AuthGardService], data: { expectedRole: 'ROLE_ADMIN' } },
      { path: 'entreprises', component: ManageEntreprisesComponent, canActivate: [AuthGardService], data: { expectedRole: ['ROLE_SUPER_ADMIN','ROLE_ADMIN'] } },
      { path: 'facture', component: FactureComponent, canActivate: [AuthGardService], data: { expectedRole: ['ROLE_ADMIN','ROLE_MANAGER'] } },

      { path: 'article', component: ManageArticlesComponent, canActivate: [AuthGardService], data: { expectedRole: ['ROLE_ADMIN','ROLE_MANAGER'] } },
      { path: 'category', component: ManageCategoryComponent, canActivate: [AuthGardService], data: { expectedRole: ['ROLE_ADMIN','ROLE_MANAGER'] } },
      { path: 'unite', component: ManageUniteComponent, canActivate: [AuthGardService], data: { expectedRole: ['ROLE_ADMIN','ROLE_MANAGER'] } },
      { path: 'condition', component: ManageConditionComponent, canActivate: [AuthGardService], data: { expectedRole: ['ROLE_ADMIN','ROLE_MANAGER'] } },
      { path: 'modePayement', component: ManageModePayementComponent, canActivate: [AuthGardService], data: { expectedRole: ['ROLE_ADMIN','ROLE_MANAGER'] } },
      { path: 'addCategory', component: AddCategoryComponent, canActivate: [AuthGardService], data: { expectedRole: ['ROLE_ADMIN','ROLE_MANAGER'] } },
      { path: 'sousCategory', component: ManageSousCategoryComponent, canActivate: [AuthGardService], data: { expectedRole: ['ROLE_ADMIN','ROLE_MANAGER'] } },

      { path: 'clients', component: ManageClientsComponent, canActivate: [AuthGardService], data: { expectedRole: ['ROLE_ADMIN','ROLE_MANAGER'] } },
      { path: 'fournisseurs', component: ManageFournisseursComponent, canActivate: [AuthGardService], data: { expectedRole: ['ROLE_ADMIN','ROLE_MANAGER'] } },

      {
        path: 'commandeClients',
        component: ManageCommandeClientsComponent,
        canActivate: [AuthGardService],
        data: {
          expectedRole: ['ROLE_ADMIN','ROLE_MANAGER'],
          origin: 'client'
        }
      },
      {
        path: 'commandeClients/:id',
        component: SingleCommandeClientComponent,
        canActivate: [AuthGardService],
        data: {
          expectedRole: ['ROLE_ADMIN','ROLE_MANAGER'],
          origin: 'client'
        }
      },
      {
        path: 'addcommandeClient',
        component: AddCommandeClientComponent,
        canActivate: [AuthGardService],
        data: {
          expectedRole: ['ROLE_ADMIN','ROLE_MANAGER'],
          origin: 'client'
        }
      },
      {
        path: 'addcommandeFournisseur',
        component: AddCommandeClientComponent,
        canActivate: [AuthGardService],
        data: {
          expectedRole: ['ROLE_ADMIN','ROLE_MANAGER'],
          origin: 'fournisseur'
        }
      },
      {
        path: 'commandeFournisseurs',
        component: ManageCommandeClientsComponent,
        canActivate: [AuthGardService],
        data: {
          expectedRole: ['ROLE_ADMIN','ROLE_MANAGER'],
          origin: 'fournisseur'
        }
      },
      {
        path: 'commandeFournisseurs/:id',
        component: SingleCommandeClientComponent,
        canActivate: [AuthGardService],
        data: {
          expectedRole: ['ROLE_ADMIN','ROLE_MANAGER'],
          origin: 'fournisseur'
        }
      },

      { path: 'ventes', component: ManageVentesComponent, canActivate: [AuthGardService], data: { expectedRole: ['ROLE_LIVREUR','ROLE_ADMIN','ROLE_MANAGER']} },
      { path: 'ventes/:id', component: SingleVenteComponent, canActivate: [AuthGardService], data: { expectedRole: ['ROLE_LIVREUR','ROLE_ADMIN','ROLE_MANAGER']} },

      { path: 'mouvements', component: ManageMvtStkComponent, canActivate: [AuthGardService], data: { expectedRole: ['ROLE_ADMIN','ROLE_MANAGER'] } },
      { path: 'search-stock', component: SearchStockComponent, canActivate: [AuthGardService], data: { expectedRole: ['ROLE_ADMIN','ROLE_MANAGER'] } },

      { path: 'livraisons', component: ManageLivraisonsComponent, canActivate: [AuthGardService], data: { expectedRole: ['ROLE_LIVREUR','ROLE_ADMIN','ROLE_MANAGER'] } },
      { path: 'search-livraisons', component: SearchLivraisonsComponent, canActivate: [AuthGardService], data: { expectedRole: ['ROLE_LIVREUR','ROLE_ADMIN','ROLE_MANAGER']} },
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
