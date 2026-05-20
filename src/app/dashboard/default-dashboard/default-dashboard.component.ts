import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ArticlesService, CommandeClientsService, CommandeFournisseursService, MouvementsDeStockService, VentesService } from 'src/app/api';

@Component({
  selector: 'app-default-dashboard',
  templateUrl: './default-dashboard.component.html',
  styleUrls: ['./default-dashboard.component.scss'],
  providers: [DatePipe]
})
export class DefaultDashboardComponent {
  totalArticles: number = 0;
  totalVentes: number = 0;
  montantTotalVentes: number = 0;
  totalComFournisseurs: number = 0;
  montantTotalComFournisseurs: number = 0;
  totalComClients: number = 0;
  montantTotalComClients: number = 0;

  // Date actuelle
  currentDate: Date = new Date();

  // État de chargement
  isLoading: boolean = false;

  constructor(
    private articleService: ArticlesService,
    private venteService: VentesService,
    private comClientService: CommandeClientsService,
    private comFournisseurService: CommandeFournisseursService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  /**
   * Charge toutes les données du dashboard
   */
  loadDashboardData(): void {
    this.isLoading = true;

    // Charger les articles
    this.loadArticles();

    // Charger les ventes
    this.loadVentes();

    // Charger les commandes clients
    this.loadCommandesClients();

    // Charger les commandes fournisseurs
    this.loadCommandesFournisseurs();

    this.isLoading = false;
  }

  /**
   * Charge les données des articles
   */
  private loadArticles(): void {
    this.articleService.getAllArticles().subscribe({
      next: (res: any) => {
        this.totalArticles = res?.length || 0;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des articles:', err);
        this.totalArticles = 0;
      }
    });
  }

  /**
   * Charge les données des ventes
   */
  private loadVentes(): void {
    // Nombre de ventes
    this.venteService.getAllVentes().subscribe({
      next: (res: any) => {
        this.totalVentes = res?.length || 0;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des ventes:', err);
        this.totalVentes = 0;
      }
    });

    // Montant total des ventes
    this.venteService.getMontantTotalVentes().subscribe({
      next: (res: any) => {
        this.montantTotalVentes = res || 0;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement du montant total des ventes:', err);
        this.montantTotalVentes = 0;
      }
    });
  }

  /**
   * Charge les données des commandes clients
   */
  private loadCommandesClients(): void {
    // Nombre de commandes clients
    this.comClientService.getAllCommandeClients().subscribe({
      next: (res: any) => {
        this.totalComClients = res?.length || 0;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des commandes clients:', err);
        this.totalComClients = 0;
      }
    });

    // Montant total des commandes clients
    this.comClientService.getMontantTotalComClient().subscribe({
      next: (res: any) => {
        this.montantTotalComClients = res || 0;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement du montant total des commandes clients:', err);
        this.montantTotalComClients = 0;
      }
    });
  }

  /**
   * Charge les données des commandes fournisseurs
   */
  private loadCommandesFournisseurs(): void {
    // Nombre de commandes fournisseurs
    this.comFournisseurService.getAllCommandeFournisseurs().subscribe({
      next: (res: any) => {
        this.totalComFournisseurs = res?.length || 0;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des commandes fournisseurs:', err);
        this.totalComFournisseurs = 0;
      }
    });

    // Montant total des commandes fournisseurs
    this.comFournisseurService.getMontantTotalComFournisseur().subscribe({
      next: (res: any) => {
        this.montantTotalComFournisseurs = res || 0;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement du montant total des commandes fournisseurs:', err);
        this.montantTotalComFournisseurs = 0;
      }
    });
  }

  /**
   * Rafraîchir les données du dashboard
   */
  refreshDashboard(): void {
    this.loadDashboardData();
  }

}
