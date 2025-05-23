export * from './adminController.service';
import { AdminControllerService } from './adminController.service';
export * from './articles.service';
import { ArticlesService } from './articles.service';
export * from './authentification.service';
import { AuthentificationService } from './authentification.service';
export * from './categories.service';
import { CategoriesService } from './categories.service';
export * from './clients.service';
import { ClientsService } from './clients.service';
export * from './commandeClients.service';
import { CommandeClientsService } from './commandeClients.service';
export * from './commandeFournisseurs.service';
import { CommandeFournisseursService } from './commandeFournisseurs.service';
export * from './conditionsDeVentes.service';
import { ConditionsDeVentesService } from './conditionsDeVentes.service';
export * from './entreprises.service';
import { EntreprisesService } from './entreprises.service';
export * from './fournisseurs.service';
import { FournisseursService } from './fournisseurs.service';
export * from './livraisons.service';
import { LivraisonsService } from './livraisons.service';
export * from './management.service';
import { ManagementService } from './management.service';
export * from './modesPayement.service';
import { ModesPayementService } from './modesPayement.service';
export * from './mouvementsDeStock.service';
import { MouvementsDeStockService } from './mouvementsDeStock.service';
export * from './reports.service';
import { ReportsService } from './reports.service';
export * from './sousCategories.service';
import { SousCategoriesService } from './sousCategories.service';
export * from './units.service';
import { UnitsService } from './units.service';
export * from './utilisateurs.service';
import { UtilisateursService } from './utilisateurs.service';
export * from './utilisateursEntreprises.service';
import { UtilisateursEntreprisesService } from './utilisateursEntreprises.service';
export * from './ventes.service';
import { VentesService } from './ventes.service';
export const APIS = [AdminControllerService, ArticlesService, AuthentificationService, CategoriesService, ClientsService, CommandeClientsService, CommandeFournisseursService, ConditionsDeVentesService, EntreprisesService, FournisseursService, LivraisonsService, ManagementService, ModesPayementService, MouvementsDeStockService, ReportsService, SousCategoriesService, UnitsService, UtilisateursService, UtilisateursEntreprisesService, VentesService];
