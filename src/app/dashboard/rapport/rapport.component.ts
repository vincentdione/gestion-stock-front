import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RapportDto, RapportSearchCriteria, RapportsService } from 'src/app/api';

export interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  subtitle: string;
  trend?: number;
  format?: 'currency' | 'number' | 'percent';
  details?: string;
}

@Component({
  selector: 'app-rapport',
  templateUrl: './rapport.component.html',
  styleUrls: ['./rapport.component.scss'],
  providers: [DatePipe]
})
export class RapportComponent implements OnInit {
  // États
  isLoading = false;
  rapport: RapportDto | null = null;
  periodeActuelle: string = 'mois';
  today = new Date();

  // Formulaires
  rapportForm!: FormGroup;

  // Statistiques
  statCards: StatCard[] = [];

  // Périodes disponibles
  periodes = [
    { id: 'hier', label: 'Hier', apiKey: 'HIER' },
    { id: 'semaine', label: '7 derniers jours', apiKey: 'SEMAINE' },
    { id: 'mois', label: 'Mois en cours', apiKey: 'MOIS_EN_COURS' },
    { id: 'annee', label: 'Année en cours', apiKey: 'ANNEE_EN_COURS' }
  ];

  // Données
  articlesPlusVendus: any[] = [];
  activitesRecent = [
    { type: 'sale', text: 'Nouvelle vente terminée - 1.250,00€', time: 'Il y a 5 min' },
    { type: 'order', text: 'Commande client #CMD-001234 validée', time: 'Il y a 15 min' },
    { type: 'stock', text: 'Stock article #ART001 mis à jour', time: 'Il y a 30 min' },
    { type: 'alert', text: 'Stock faible pour article #ART005', time: 'Il y a 2 heures' },
    { type: 'sale', text: 'Vente en ligne - 890,00€', time: 'Il y a 3 heures' }
  ];

  constructor(
    private fb: FormBuilder,
    private rapportService: RapportsService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.chargerRapportMois();
  }

  initForm(): void {
    const aujourdHui = new Date();
    const debutMois = new Date(aujourdHui.getFullYear(), aujourdHui.getMonth(), 1);

    this.rapportForm = this.fb.group({
      dateDebut: [debutMois],
      dateFin: [aujourdHui],
      avecDetails: [true],
      limitArticles: [10]
    });
  }

  // Charger les rapports
  chargerRapport(periodeId: string): void {
    this.periodeActuelle = periodeId;
    this.isLoading = true;

    const periode = this.periodes.find(p => p.id === periodeId);
    if (!periode) {
      this.isLoading = false;
      return;
    }

    let rapportObservable;

    switch (periodeId) {
      case 'hier':
        rapportObservable = this.rapportService.rapportHier();
        break;
      case 'semaine':
        rapportObservable = this.rapportService.rapportSemaine();
        break;
      case 'mois':
        rapportObservable = this.rapportService.rapportMoisEnCours();
        break;
      case 'annee':
        rapportObservable = this.rapportService.rapportAnneeEnCours();
        break;
      default:
        rapportObservable = this.rapportService.rapportMoisEnCours();
    }

    rapportObservable.subscribe({
      next: (data: any) => {
        this.rapport = data;
        this.mettreAJourStatCards();
        this.articlesPlusVendus = data.articlesPlusVendus || [];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur chargement rapport:', error);
        this.isLoading = false;
      }
    });
  }

  chargerRapportMois(): void {
    this.chargerRapport('mois');
  }

  chargerRapportPersonnalise(): void {
    this.isLoading = true;
    const criteria: RapportSearchCriteria = {
      periode: 'PERSONNALISEE',
      dateDebut: this.rapportForm.get('dateDebut')?.value,
      dateFin: this.rapportForm.get('dateFin')?.value,
      avecDetails: this.rapportForm.get('avecDetails')?.value,
      limitArticles: this.rapportForm.get('limitArticles')?.value
    };

    this.rapportService.genererRapport(criteria).subscribe({
      next: (data: any) => {
        this.rapport = data;
        this.mettreAJourStatCards();
        this.articlesPlusVendus = data.articlesPlusVendus || [];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur rapport personnalisé:', error);
        this.isLoading = false;
      }
    });
  }

  // Mettre à jour les cartes statistiques
  mettreAJourStatCards(): void {
    if (!this.rapport) return;

    this.statCards = [
      {
        title: 'Chiffre d\'Affaire',
        value: this.rapport.chiffreAffaireTotal || 0,
        icon: 'euro_symbol',
        color: 'sales-card',
        subtitle: 'Total',
        format: 'currency',
        details: this.formaterMontant(this.rapport.montantMoyenVente || 0) + ' / vente'
      },
      {
        title: 'Ventes',
        value: this.rapport.nombreVentes || 0,
        icon: 'shopping_cart',
        color: 'orders-card',
        subtitle: 'Transactions',
        format: 'number',
        details: `${this.formaterNombre(this.rapport.nombreVentes || 0)} ventes réalisées`
      },
      {
        title: 'Commandes Clients',
        value: this.rapport.nombreCommandesClients || 0,
        icon: 'people',
        color: 'suppliers-card',
        subtitle: 'En cours',
        format: 'number',
        details: `${this.rapport.statutCommandesClients?.enPreparation || 0} en préparation`
      },
      {
        title: 'Articles Vendus',
        value: this.rapport.articlesPlusVendus?.length || 0,
        icon: 'inventory',
        color: 'article-card',
        subtitle: 'Top produits',
        format: 'number',
        details: `${this.rapport.articlesQuantite?.[0]?.nom || 'Aucun'} en tête`
      }
    ];
  }

  // Méthodes utilitaires
  formaterValeur(card: StatCard): string {
    switch (card.format) {
      case 'currency':
        return this.formaterMontant(card.value);
      case 'percent':
        return this.formaterPourcentage(card.value);
      default:
        return this.formaterNombre(card.value);
    }
  }

  formaterMontant(montant: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(montant);
  }

  formaterNombre(nombre: number): string {
    return new Intl.NumberFormat('fr-FR').format(nombre);
  }

  formaterPourcentage(pourcentage: number): string {
    return `${pourcentage.toFixed(1)}%`;
  }

  // Navigation
  voirDetailsVentes(): void {
    this.router.navigate(['/ventes']);
  }

  voirDetailsArticles(): void {
    this.router.navigate(['/articles']);
  }

  exporterRapport(format: 'pdf' | 'excel'): void {
    // À implémenter avec le service d'export
    console.log(`Exporter en ${format}`);
  }

  // Méthodes pour les statistiques rapides
  getQuickStats() {
    if (!this.rapport) return [];

    return [
      {
        icon: 'trending_up',
        value: this.rapport.evolutionJournaliere?.[0]?.chiffreAffaire || 0,
        label: 'CA Aujourd\'hui'
      },
      {
        icon: 'inventory',
        value: this.rapport.articlesQuantite?.[0]?.quantiteVendue || 0,
        label: 'Produit Top'
      },
      {
        icon: 'schedule',
        value: this.rapport.statutCommandesClients?.enPreparation || 0,
        label: 'En Préparation'
      },
      {
        icon: 'check_circle',
        value: this.rapport.statutCommandesClients?.livree || 0,
        label: 'Livrées'
      }
    ];
  }

  // Statistiques détaillées
  getDetailedStats() {
    if (!this.rapport) return [];

    return [
      {
        title: 'Panier moyen',
        value: this.rapport.montantMoyenVente || 0,
        icon: 'shopping_basket',
        format: 'currency'
      },
      {
        title: 'Ventes/jour',
        value: this.calculerMoyenneQuotidienne(),
        icon: 'calendar_today',
        format: 'number'
      },
      {
        title: 'CA/jour',
        value: this.calculerCACQuotidien(),
        icon: 'trending_up',
        format: 'currency'
      },
      {
        title: 'Stock faible',
        value: 5, // À remplacer par les données réelles
        icon: 'warning',
        format: 'number'
      }
    ];
  }

  private calculerMoyenneQuotidienne(): number {
    if (!this.rapport?.evolutionJournaliere || this.rapport.evolutionJournaliere.length === 0) return 0;

    const totalVentes = this.rapport.evolutionJournaliere.reduce((sum, item) => sum + (item.nombreVentes || 0), 0);
    return totalVentes / this.rapport.evolutionJournaliere.length;
  }

  private calculerCACQuotidien(): number {
    if (!this.rapport?.evolutionJournaliere || this.rapport.evolutionJournaliere.length === 0) return 0;

    const totalCA = this.rapport.evolutionJournaliere.reduce((sum, item) => sum + (item.chiffreAffaire || 0), 0);
    return totalCA / this.rapport.evolutionJournaliere.length;
  }
}