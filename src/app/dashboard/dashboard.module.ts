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
import { CommandeClientsComponent } from './dialog/commande-clients/commande-clients.component';
import { CommandeFournisseursComponent } from './dialog/commande-fournisseurs/commande-fournisseurs.component';


@NgModule({
  declarations: [
    DashboardComponent,
    DefaultDashboardComponent,
    HeaderComponent,
    SidebarComponent,
    ManageUsersComponent,
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
    CommandeClientsComponent,
    CommandeFournisseursComponent,

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