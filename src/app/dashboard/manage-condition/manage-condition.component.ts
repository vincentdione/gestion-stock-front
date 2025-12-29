import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatPaginator } from '@angular/material/paginator';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ConditionsDeVentesService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ConditionComponent } from '../dialog/condition/condition.component';

@Component({
  selector: 'app-manage-condition',
  templateUrl: './manage-condition.component.html',
  styleUrls: ['./manage-condition.component.scss']
})
export class ManageConditionComponent implements AfterViewInit {
  displayColumns: string[] = ["article", "unite", "quantite", "prixUnitaireHt", "tauxTval", "prixUnitaireTtc", "action"];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  responseMessage: string = '';
  showAdditionalColumns = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('input') input!: ElementRef;

  constructor(
    private conditionService: ConditionsDeVentesService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(): void {
    this.conditionService.getAllConditions().subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      },
      (error: any) => {
        this.ngxService.stop();
        this.responseMessage = error.error?.message || GlobalConstants.genericErrorMessage;
        this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  // Méthodes pour les statistiques
  getUniqueArticlesCount(): number {
    if (!this.dataSource?.data) return 0;
    const articles = new Set(
      this.dataSource.data
        .map((condition: any) => condition.article?.codeArticle)
        .filter(Boolean)
    );
    return articles.size;
  }

  getUniqueUnitsCount(): number {
    if (!this.dataSource?.data) return 0;
    const units = new Set(
      this.dataSource.data
        .map((condition: any) => condition.unite?.nom)
        .filter(Boolean)
    );
    return units.size;
  }

  getAveragePrice(): number {
    if (!this.dataSource?.data?.length) return 0;
    const total = this.dataSource.data.reduce((sum: number, condition: any) => {
      return sum + (condition.prixUnitaireTtc || 0);
    }, 0);
    return total / this.dataSource.data.length;
  }

  // Méthodes pour les filtres
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearSearch(inputElement: HTMLInputElement): void {
    inputElement.value = '';
    this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  resetFilters(inputElement?: HTMLInputElement): void {
    if (inputElement) {
      inputElement.value = '';
    }

    this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Méthodes pour les badges TVA
  getTvaClass(taux: number): string {
    if (taux <= 10) return 'tva-low';
    if (taux <= 20) return 'tva-normal';
    return 'tva-high';
  }

  // Méthodes utilitaires
  getFilteredCount(): number {
    if (!this.dataSource?.filteredData) return 0;
    return this.dataSource.filteredData.length;
  }

  getFilteredData(): any[] {
    if (!this.dataSource?.filteredData) return [];
    return this.dataSource.filteredData;
  }

  toggleColumns(): void {
    this.showAdditionalColumns = !this.showAdditionalColumns;
  }

  viewDetails(condition: any): void {
    // Implémentez la logique pour voir les détails
    console.log('Voir détails:', condition);
  }

  exportToExcel(): void {
    // Implémentez l'export Excel
    console.log('Export Excel');
  }

  // Méthodes existantes
  handleAdd(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Ajouter'
    };
    dialogConfig.width = "850px";

    const dialogRef = this.dialog.open(ConditionComponent, dialogConfig);

    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAdd.subscribe(
      (res: any) => {
        this.ngxService.start();
        this.tableData();
      }
    );
  }

  handleEdit(values: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Modifier',
      data: values
    };
    dialogConfig.width = "850px";

    const dialogRef = this.dialog.open(ConditionComponent, dialogConfig);

    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onUpdate.subscribe(
      (res: any) => {
        this.ngxService.start();
        this.tableData();
      }
    );
  }

  handleDelete(values: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: `Supprimer la condition pour l'article ${values.article?.codeArticle}`
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);

    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res) => {
      this.ngxService.start();
      this.delete(values.id);
      dialogRef.close();
    });
  }

  delete(id: any): void {
    this.conditionService.deleteCondition(id).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.tableData();
        this.responseMessage = res?.message;
        this.snackbarService.openSnackbar("Condition supprimée avec succès", "success");
      },
      (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericErrorMessage;
        }
        this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  ngAfterViewInit(): void {
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
}