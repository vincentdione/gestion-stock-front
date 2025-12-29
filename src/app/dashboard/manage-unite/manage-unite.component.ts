import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UnitsService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';
import { UniteComponent } from '../dialog/unite/unite.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-manage-unite',
  templateUrl: './manage-unite.component.html',
  styleUrls: ['./manage-unite.component.scss']
})
export class ManageUniteComponent {

  displayColumns: string[] = ["nom", "designation", "action"];
  additionalColumns: string[] = ["symbol", "status"];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  responseMessage: string = '';

  selectedCategory: string | null = null;
  showAdditionalColumns = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('input') input!: ElementRef;

  constructor(
    private uniteService: UnitsService,
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
    this.uniteService.getAllUnites().subscribe(
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

  handleAdd(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Ajouter'
    };
    dialogConfig.width = "850px";

    const dialogRef = this.dialog.open(UniteComponent, dialogConfig);

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

    const dialogRef = this.dialog.open(UniteComponent, dialogConfig);

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
      message: `Supprimer l'unité ${values.nom}`
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);

    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res) => {
      this.ngxService.start();
      this.delete(values.id);
      dialogRef.close();
    });
  }

  delete(id: any): void {
    this.uniteService.deleteUnite(id).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.tableData();
        this.snackbarService.openSnackbar("Unité supprimée avec succès", "success");
      },
      (error: any) => {
        this.ngxService.stop();
        this.responseMessage = error.error?.message || GlobalConstants.genericErrorMessage;
        this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  // Méthodes pour les statistiques
  getCompleteDataCount(): number {
    if (!this.dataSource?.data) return 0;
    return this.dataSource.data.filter((unite: any) =>
      unite.nom && unite.designation
    ).length;
  }

  getUniqueCategoriesCount(): number {
    if (!this.dataSource?.data) return 0;
    const categories = new Set(
      this.dataSource.data
        .filter((unite: any) => unite.categorie)
        .map((unite: any) => unite.categorie)
    );
    return categories.size;
  }

  getRecentAdditions(): number {
    if (!this.dataSource?.data) return 0;
    // Supposons que vous avez un champ dateCreation
    // Sinon, retournez simplement le total ou une autre métrique
    return this.dataSource.data.length;
  }

  // Méthodes pour les filtres
  hasCategories(): boolean {
    if (!this.dataSource?.data) return false;
    return this.dataSource.data.some((unite: any) => unite.categorie);
  }

  getCategories(): string[] {
    if (!this.dataSource?.data) return [];
    const categories = this.dataSource.data
      .filter((unite: any) => unite.categorie)
      .map((unite: any) => unite.categorie)
      .filter((categorie: string, index: number, self: string[]) =>
        self.indexOf(categorie) === index
      );

    return categories.sort();
  }

  filterByCategory(category: string | null): void {
    this.selectedCategory = category;

    if (!category) {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = category;
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  resetFilters(inputElement?: HTMLInputElement): void {
    this.selectedCategory = null;

    if (inputElement) {
      inputElement.value = '';
    }

    this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Méthodes pour les colonnes dynamiques
  getDisplayColumns(): string[] {
    let columns = [...this.displayColumns];

    if (this.showAdditionalColumns) {
      columns = columns.filter(col => col !== 'action');
      columns = [...columns, ...this.additionalColumns.filter(col => this.hasColumnData(col))];
      columns.push('action');
    }

    return columns;
  }

  hasColumnData(column: string): boolean {
    if (!this.dataSource?.data) return false;

    switch(column) {
      case 'symbol':
        return this.dataSource.data.some((unite: any) => unite.symbol);
      case 'status':
        return this.dataSource.data.some((unite: any) => unite.status !== undefined);
      default:
        return false;
    }
  }

  hasSymbolColumn(): boolean {
    return this.showAdditionalColumns && this.hasColumnData('symbol');
  }

  hasStatusColumn(): boolean {
    return this.showAdditionalColumns && this.hasColumnData('status');
  }

  toggleColumns(): void {
    this.showAdditionalColumns = !this.showAdditionalColumns;
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

  viewDetails(unite: any): void {
    // Implémentez la logique pour voir les détails
    console.log('Voir détails:', unite);
  }

  toggleStatus(unite: any): void {
    // Implémentez la logique pour changer le statut
    console.log('Changer statut:', unite);
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
}