import { DetailsLignesCommandesComponent } from './../components/details-lignes-commandes/details-lignes-commandes.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../shared/material-module';
import { DefaultDashboardComponent } from './default-dashboard/default-dashboard.component';
import { HeaderComponent } from './layouts/header/header.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageArticlesComponent } from './manage-articles/manage-articles.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { ManageSousCategoryComponent } from './manage-sous-category/manage-sous-category.component';
import { ManageClientsComponent } from './manage-clients/manage-clients.component';
import { ManageFournisseursComponent } from './manage-fournisseurs/manage-fournisseurs.component';
import { ManageCommandeClientsComponent } from './manage-commande-clients/manage-commande-clients.component';
import { ManageCommandeFournisseursComponent } from './manage-commande-fournisseurs/manage-commande-fournisseurs.component';
import { ManageVentesComponent } from './manage-ventes/manage-ventes.component';
import { ManageMvtStkComponent } from './manage-mvt-stk/manage-mvt-stk.component';
import { ConfirmationComponent } from './dialog/confirmation/confirmation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CdkTableModule } from '@angular/cdk/table';
import { AddCategoryComponent } from './manage-category/add-category/add-category.component';
import { CategoryComponent } from './dialog/category/category.component';
import { SousCategoryComponent } from './dialog/sous-category/sous-category.component';
import { ArticleComponent } from './dialog/article/article.component';
import { ClientsComponent } from './dialog/clients/clients.component';
import { FournisseursComponent } from './dialog/fournisseurs/fournisseurs.component';
import { AddCommandeClientComponent } from './pages/add-commande-client/add-commande-client.component';
import { LigneCommandeComponent } from './dialog/ligne-commande/ligne-commande.component';
import { ManageUniteComponent } from './manage-unite/manage-unite.component';
import { ManageModePayementComponent } from './manage-mode-payement/manage-mode-payement.component';
import { UniteComponent } from './dialog/unite/unite.component';
import { ModePayementComponent } from './dialog/mode-payement/mode-payement.component';
import { ManageConditionComponent } from './manage-condition/manage-condition.component';
import { ConditionComponent } from './dialog/condition/condition.component';
import { SearchStockComponent } from './manage-mvt-stk/search-stock/search-stock.component';
import { XofPipe } from '../custumPipe/xof-pipe';
import { SingleVenteComponent } from './manage-ventes/single-vente/single-vente.component';
import { SingleCommandeClientComponent } from './pages/single-commande-client/single-commande-client.component';
import { ManageLivraisonsComponent } from './manage-livraisons/manage-livraisons.component';
import { SearchLivraisonsComponent } from './manage-livraisons/search-livraisons/search-livraisons.component';
import { UserComponent } from './dialog/user/user.component';
import { ManageEntreprisesComponent } from './manage-entreprises/manage-entreprises.component';
import { EntrepriseComponent } from './dialog/entreprise/entreprise.component';
import { FactureComponent } from './facture/facture.component';
import { ClientInfoComponent } from './facture/client-info/client-info.component';
import { FactureFooterComponent } from './facture/facture-footer/facture-footer.component';
import { FactureHeaderComponent } from './facture/facture-header/facture-header.component';
import { FactureSummaryComponent } from './facture/facture-summary/facture-summary.component';
import { FactureItemsComponent } from './facture/facture-items/facture-items.component';
import { FacturePrintComponent } from './facture/facture-print/facture-print.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DefaultDashboardComponent,
    HeaderComponent,
    SidebarComponent,
    ManageUsersComponent,
    UserComponent,
    ManageArticlesComponent,
    ManageCategoryComponent,
    ManageSousCategoryComponent,
    ManageClientsComponent,
    ManageFournisseursComponent,
    ManageCommandeClientsComponent,
    ManageCommandeFournisseursComponent,
    ManageVentesComponent,
    ManageMvtStkComponent,
    ConfirmationComponent,
    AddCategoryComponent,
    CategoryComponent,
    SousCategoryComponent,
    ArticleComponent,
    ClientsComponent,
    FournisseursComponent,
    AddCommandeClientComponent,
    DetailsLignesCommandesComponent,
    LigneCommandeComponent,
    ManageUniteComponent,
    ManageModePayementComponent,
    UniteComponent,
    ModePayementComponent,
    ManageConditionComponent,
    ConditionComponent,
    SearchStockComponent,
    XofPipe,
    SingleVenteComponent,
    SingleCommandeClientComponent,
    ManageLivraisonsComponent,
    SearchLivraisonsComponent,
    ManageEntreprisesComponent,
    EntrepriseComponent,
    FactureComponent,
    ClientInfoComponent,
    FactureFooterComponent,
    FactureHeaderComponent,
    FactureSummaryComponent,
    FactureItemsComponent,
    FacturePrintComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTableModule
    ],

})
export class DashboardModule { }
