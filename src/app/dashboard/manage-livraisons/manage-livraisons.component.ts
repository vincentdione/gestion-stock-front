import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ArticleDto, LivraisonDto, LivraisonsService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-manage-livraisons',
  templateUrl: './manage-livraisons.component.html',
  styleUrls: ['./manage-livraisons.component.scss']
})
export class ManageLivraisonsComponent {

  displayColumns: string[] = ["code", "dateLivraison", "etat", "client", "livreur", "action"];
  dataSource: MatTableDataSource<LivraisonDto> = new MatTableDataSource<LivraisonDto>([]);
  responseMessage: any = '';
  filterForm: FormGroup = new FormGroup({});

  articles: ArticleDto[] = [];
  selectedArticle: ArticleDto = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private serviceLivraison: LivraisonsService,
    private ngxService: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.initializeForm();
    this.tableData();
  }

  initializeForm(): void {
    this.filterForm = this.formBuilder.group({
      article: [''],
      status: ['']
    });
  }

  tableData(): void {
    this.serviceLivraison.getAllLivraisons().subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(res);

        // Ajout d'un setTimeout pour s'assurer que le paginator est disponible
        setTimeout(() => {
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
        });

        // Extraire les articles uniques
        this.extractUniqueArticles(res);
      },
      (error: any) => {
        this.ngxService.stop();
        this.responseMessage = error.error?.message || GlobalConstants.genericErrorMessage;
        this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  extractUniqueArticles(livraisons: LivraisonDto[]): void {
    const uniqueArticles = new Map();
    // Adaptez cette logique selon votre structure de données réelle
    livraisons.forEach(livraison => {
      // Exemple: si vous avez un champ article dans livraison
      // if (livraison.article && !uniqueArticles.has(livraison.article.id)) {
      //   uniqueArticles.set(livraison.article.id, livraison.article);
      // }
    });
    this.articles = Array.from(uniqueArticles.values());
  }

  onSearch(): void {
    const filters = this.filterForm.value;

    this.serviceLivraison.getAllLivraisons().subscribe(
      (res: any) => {
        let filteredData = res;

        // Filtre par article
        if (filters.article && filters.article.id) {
          filteredData = filteredData.filter((item: any) =>
            item.article?.id === filters.article.id
          );
        }

        // Filtre par statut
        if (filters.status) {
          filteredData = filteredData.filter((item: any) =>
            item.etat === filters.status
          );
        }

        this.dataSource = new MatTableDataSource(filteredData);
        setTimeout(() => {
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
        });
      },
      (error: any) => {
        this.snackbarService.openSnackbar(
          error.error?.message || 'Erreur lors de la recherche',
          GlobalConstants.error
        );
      }
    );
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.tableData();
  }

  getStatusCount(status: string): number {
    if (!this.dataSource?.data) return 0;
    return this.dataSource.data.filter(item => item.etat === status).length;
  }

  getStatusClass(status?: string): string {
    if (!status) return '';
    switch(status) {
      case 'EN_COURS': return 'status-en-cours';
      case 'VALIDER': return 'status-valider';
      case 'ANNULER': return 'status-annuler';
      case 'RENVOYER': return 'status-renvoyer';
      default: return '';
    }
  }



  viewDetails(delivery: LivraisonDto): void {
    // Implémentez la logique pour voir les détails
    console.log('Voir détails:', delivery);
    // this.router.navigate(['/livraisons/detail', delivery.id]);
  }

  editDelivery(delivery: LivraisonDto): void {
    // Implémentez la logique d'édition
    console.log('Éditer:', delivery);
  }

  cancelDelivery(delivery: LivraisonDto): void {
    // Implémentez la logique d'annulation
    if (confirm('Êtes-vous sûr de vouloir annuler cette livraison ?')) {
      console.log('Annuler:', delivery);
      // this.serviceLivraison.cancelLivraison(delivery.id).subscribe(...);
    }
  }

  exportToExcel(): void {
    // Implémentez l'export Excel
    console.log('Export Excel');
  }

  ngAfterViewInit(): void {
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  // Dans votre component TypeScript, ajoutez ces méthodes :

getStatusLabel(status: string): string {
  switch(status) {
    case 'EN_COURS': return 'En cours';
    case 'VALIDER': return 'Validée';
    case 'ANNULER': return 'Annulée';
    case 'RENVOYER': return 'Renvoyée';
    default: return 'Tous les statuts';
  }
}

getStatusIconColor(status: string): string {
  switch(status) {
    case 'EN_COURS': return '#ff9800';
    case 'VALIDER': return '#4CAF50';
    case 'ANNULER': return '#f44336';
    case 'RENVOYER': return '#9c27b0';
    default: return '#666';
  }
}

// La méthode getStatusIcon existe déjà, assurez-vous qu'elle ressemble à :
getStatusIcon(status?: string): string {
  if (!status) return 'flag'; // Icône par défaut
  switch(status) {
    case 'EN_COURS': return 'schedule';
    case 'VALIDER': return 'check_circle';
    case 'ANNULER': return 'cancel';
    case 'RENVOYER': return 'keyboard_return';
    default: return 'flag';
  }
}
}