// all-ventes.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { VenteDto, VentesService, ModesPayementService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-all-ventes',
  templateUrl: './all-ventes.component.html',
  styleUrls: ['./all-ventes.component.scss']
})
export class AllVentesComponent implements OnInit {
  displayColumns: string[] = ["code", "dateVente", "nomClient", "modePayement", "montantTotal", "statut", "action"];
  dataSource: MatTableDataSource<VenteDto> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchForm: FormGroup;

  // On ne stocke plus toutes les ventes en mémoire
  filteredVentes: VenteDto[] = [];

  // Pagination properties
  totalElements = 0;
  pageSize = 10;
  currentPage = 0;

  // Options de filtrage
  statuts = [
    { value: 'Tous', label: 'Tous les statuts' },
    { value: 'COMPLETEE', label: 'Complétée' },
    { value: 'ANNULEE', label: 'Annulée' },
    { value: 'EN_COURS', label: 'En cours' }
  ];

  // Propriété pour les modes de paiement
  dataModePayement: any[] = [];

  totalCA = 0;
  totalVentes = 0;
  moyennePanier = 0;

  // Flag pour savoir si on fait une recherche locale ou serveur
  useServerSearch = true; // Mettez à false pour revenir à la recherche locale

  constructor(
    private venteService: VentesService,
    private modePayementService: ModesPayementService,
    private fb: FormBuilder,
    public router: Router,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService
  ) {
    this.searchForm = this.fb.group({
      code: [''],
      nomClient: [''],
      prenomClient: [''],
      telephone: [''],
      modePayement: [''],
      statut: ['Tous'],
      dateRange: this.fb.group({
        start: [''],
        end: ['']
      })
    });
  }

  ngOnInit(): void {
    this.ngxService.start();
    this.loadInitialData();
  }

  loadInitialData(): void {
    // Charger les données initiales (première page)
    this.loadVentesPage();
    this.loadModePayements();
  }

  loadVentesPage(): void {
    this.ngxService.start();

    if (this.useServerSearch) {
      this.loadVentesFromServer();
    } else {
      // Ancienne méthode (chargement de toutes les ventes)
      this.loadAllVentes();
    }
  }

  loadVentesFromServer(): void {
    const searchCriteria = this.buildSearchCriteria();

    if (this.useServerSearch && searchCriteria) {
      // Recherche avancée avec critères complets
      this.venteService.searchVentes(searchCriteria).subscribe(
        (response: any) => {
          this.handleSearchResponse(response);
        },
        (error: any) => {
          this.handleError(error);
        }
      );
    } else {
      // Recherche simple
      const nomClient = this.searchForm.get('nomClient')?.value || undefined;
      const prenomClient = this.searchForm.get('prenomClient')?.value || undefined;
      const codeVente = this.searchForm.get('code')?.value || undefined;
      const page = this.currentPage;
      const size = this.pageSize;

      this.venteService.searchVentesByParams(nomClient, prenomClient, codeVente, page, size).subscribe(
        (response: any) => {
          this.handleSearchResponse(response);
        },
        (error: any) => {
          this.handleError(error);
        }
      );
    }
  }

  loadAllVentes(): void {
    this.venteService.getAllVentes().subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.filteredVentes = res;
        this.totalVentes = res.length;
        this.dataSource.data = this.filteredVentes;
        this.setupDataSource();
        this.calculerStatistiques();
      },
      (error: any) => {
        this.ngxService.stop();
        this.handleError(error);
      }
    );
  }

  buildSearchCriteria(): any {
    const formValue = this.searchForm.value;
    const dateRange = formValue.dateRange || {};

    // Vérifier s'il y a des critères de recherche
    const hasFilters = Object.keys(formValue).some(key => {
      if (key === 'dateRange') return false;
      return formValue[key] && formValue[key] !== '' && formValue[key] !== 'Tous';
    }) || (dateRange.start && dateRange.end);

    if (!hasFilters) {
      return null; // Pas de critères spécifiques
    }

    return {
      nomClient: formValue.nomClient || null,
      prenomClient: formValue.prenomClient || null,
      codeVente: formValue.code || null,
      numeroClient: formValue.telephone || null,
      adresse: null, // Vous pouvez ajouter ce champ si nécessaire
      dateFrom: dateRange.start ? new Date(dateRange.start).toISOString() : null,
      dateTo: dateRange.end ? new Date(dateRange.end).toISOString() : null,
      page: this.currentPage,
      size: this.pageSize,
      sortBy: 'dateVente',
      sortDirection: 'DESC'
    };
  }

  handleSearchResponse(response: any): void {
    this.ngxService.stop();

    if (response && response.content) {
      // Si la réponse est paginée (Spring Page)
      this.filteredVentes = response.content;
      this.totalElements = response.totalElements || 0;
      this.totalVentes = response.totalElements || 0;

      // Mettre à jour le paginator
      if (this.paginator && response.totalPages !== undefined) {
        this.paginator.length = response.totalElements;
        this.paginator.pageIndex = response.number || 0;
        this.paginator.pageSize = response.size || this.pageSize;
      }
    } else {
      // Si la réponse est une simple liste
      this.filteredVentes = response || [];
      this.totalElements = this.filteredVentes.length;
      this.totalVentes = this.filteredVentes.length;
    }

    this.dataSource.data = this.filteredVentes;
    this.setupDataSource();
    this.calculerStatistiques();

    console.log(`${this.filteredVentes.length} ventes trouvées`);
  }

  applyFilters(): void {
    this.currentPage = 0; // Retour à la première page

    if (this.useServerSearch) {
      // Recherche côté serveur
      this.loadVentesFromServer();
    } else {
      // Ancienne méthode : filtrage local
      const filters = this.searchForm.value;
      const allVentes = [...this.dataSource.data]; // Copie des données actuelles

      this.filteredVentes = allVentes.filter(vente => {
        let match = true;

        // Filtre par code
        if (filters.code && vente.code) {
          match = match && vente.code.toLowerCase().includes(filters.code.toLowerCase());
        }

        // Filtre par nom client
        if (filters.nomClient && vente.nomClient) {
          match = match && vente.nomClient.toLowerCase().includes(filters.nomClient.toLowerCase());
        }

        // Filtre par prénom client
        if (filters.prenomClient && vente.prenomClient) {
          match = match && vente.prenomClient.toLowerCase().includes(filters.prenomClient.toLowerCase());
        }

        // Filtre par téléphone
        if (filters.telephone && vente.numero) {
          match = match && vente.numero.includes(filters.telephone);
        }

        // Filtre par mode de paiement
        if (filters.modePayement && vente.modePayement?.code) {
          match = match && vente.modePayement.code === filters.modePayement;
        }

        // Filtre par statut
        if (filters.statut !== 'Tous') {
          const statutVente = this.getStatutVente(vente);
          match = match && statutVente === filters.statut;
        }

        // Filtre par date
        if (filters.dateRange?.start && filters.dateRange?.end && vente.dateVente) {
          const dateVente = new Date(vente.dateVente);
          const startDate = new Date(filters.dateRange.start);
          const endDate = new Date(filters.dateRange.end);
          endDate.setHours(23, 59, 59, 999);

          match = match && dateVente >= startDate && dateVente <= endDate;
        }

        return match;
      });

      this.dataSource.data = this.filteredVentes;
      this.calculerStatistiques();
    }
  }

  resetFilters(): void {
    this.searchForm.reset({
      code: '',
      nomClient: '',
      prenomClient: '',
      telephone: '',
      modePayement: '',
      statut: 'Tous',
      dateRange: {
        start: '',
        end: ''
      }
    });

    this.currentPage = 0;

    if (this.useServerSearch) {
      // Recharger sans filtres
      this.loadVentesFromServer();
    } else {
      // Ancienne méthode
      this.loadAllVentes();
    }
  }

  onPageChange(event: any): void {
    if (this.useServerSearch) {
      this.currentPage = event.pageIndex;
      this.pageSize = event.pageSize;
      this.loadVentesFromServer();
    }
  }

  loadModePayements(): void {
    this.modePayementService.getAllModes().subscribe(
      (res: any) => {
        this.dataModePayement = res;
      },
      (error) => {
        console.error('Erreur chargement modes paiement:', error);
      }
    );
  }

  getStatutVente(vente: VenteDto): string {
    // Logique pour déterminer le statut de la vente
    if (vente.ligneVentes && vente.ligneVentes.length > 0) {
      return 'COMPLETEE';
    }
    return 'EN_COURS';
  }

  getStatutColor(statut: string): string {
    switch (statut) {
      case 'COMPLETEE': return 'success';
      case 'ANNULEE': return 'warn';
      case 'EN_COURS': return 'primary';
      default: return 'basic';
    }
  }

  calculerStatistiques(): void {
    this.totalVentes = this.filteredVentes.length;
    this.totalCA = this.filteredVentes.reduce((total, vente) => {
      // Utiliser le montantTotal du DTO s'il existe, sinon calculer
      if (vente.montantTotal !== undefined && vente.montantTotal !== null) {
        return total + vente.montantTotal;
      }

      // Calcul manuel si montantTotal n'est pas présent
      const montant = vente.ligneVentes?.reduce((sum, ligne) =>
        sum + (ligne.prixUnitaire || 0) * (ligne.quantite || 0), 0) || 0;
      return total + montant;
    }, 0);

    this.moyennePanier = this.totalVentes > 0 ? this.totalCA / this.totalVentes : 0;
  }

  calculerMontantVente(vente: VenteDto): number {
    // Utiliser le montantTotal du DTO s'il existe
    if (vente.montantTotal !== undefined && vente.montantTotal !== null) {
      return vente.montantTotal;
    }

    // Calcul manuel si montantTotal n'est pas présent
    return vente.ligneVentes?.reduce((total, ligne) =>
      total + (ligne.prixUnitaire || 0) * (ligne.quantite || 0), 0) || 0;
  }

  handleView(vente: VenteDto): void {
    const navigationExtras: NavigationExtras = {
      state: {
        data: vente
      }
    };
    this.router.navigate(['/workspace/dashboard/ventes', vente.id], navigationExtras);
  }

  handleDelete(vente: VenteDto): void {
    if (vente.id) {
      this.ngxService.start();
      this.venteService.deleteVente(vente.id).subscribe(
        (res: any) => {
          this.ngxService.stop();
          // Recharger les données après suppression
          this.loadVentesFromServer();
          this.snackbarService.openSnackbar('Vente supprimée avec succès', 'success');
        },
        (error: any) => {
          this.ngxService.stop();
          this.handleError(error);
        }
      );
    }
  }

  setupDataSource(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'nomClient':
          return `${item.nomClient || ''} ${item.prenomClient || ''}`;
        case 'modePayement':
          return item.modePayement?.code || '';
        case 'montantTotal':
          return this.calculerMontantVente(item);
        case 'statut':
          return this.getStatutVente(item);
        case 'dateVente':
          return new Date(item.dateVente || '').getTime();
        default:
          return (item as any)[property];
      }
    };
  }

  exporterCSV(): void {
    const csvData = this.convertToCSV(this.filteredVentes);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ventes_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(ventes: VenteDto[]): string {
    const headers = ['Code', 'Date', 'Client', 'Téléphone', 'Mode Paiement', 'Montant Total', 'Statut'];
    const rows = ventes.map(vente => [
      vente.code || '',
      vente.dateVente ? new Date(vente.dateVente).toLocaleDateString() : '',
      `${vente.nomClient || ''} ${vente.prenomClient || ''}`.trim(),
      vente.numero || '',
      vente.modePayement?.code || '',
      this.calculerMontantVente(vente).toString(),
      this.getStatutVente(vente)
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  private handleError(error: any): void {
    this.ngxService.stop();
    let errorMessage = GlobalConstants.genericErrorMessage;
    if (error.error?.message) {
      errorMessage = error.error.message;
    }
    this.snackbarService.openSnackbar(errorMessage, 'error');
    console.error('Erreur:', error);
  }

  ngAfterViewInit() {
    this.setupDataSource();

    // Gérer les changements de page
    if (this.paginator) {
      this.paginator.page.subscribe((event) => {
        this.onPageChange(event);
      });
    }
  }
}