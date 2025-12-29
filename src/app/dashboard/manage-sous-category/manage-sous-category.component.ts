import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SousCategoriesService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';
import { SousCategoryComponent } from '../dialog/sous-category/sous-category.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-manage-sous-category',
  templateUrl: './manage-sous-category.component.html',
  styleUrls: ['./manage-sous-category.component.scss']
})
export class ManageSousCategoryComponent {

  displayColumns: string[] = ["category", "code", "designation", "action"];
  additionalColumns: string[] = ["description"];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  responseMessage: string = '';

  selectedCategoryId: number | null = null;
  showAdditionalColumns = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('input') input!: ElementRef;

  constructor(
    private sousCategorieService: SousCategoriesService,
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
    this.sousCategorieService.getAllSousCategorys().subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        console.log(res);
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

    const dialogRef = this.dialog.open(SousCategoryComponent, dialogConfig);

    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddSousCategory.subscribe(
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

    const dialogRef = this.dialog.open(SousCategoryComponent, dialogConfig);

    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onUpdateSousCategory.subscribe(
      (res: any) => {
        this.ngxService.start();
        this.tableData();
      }
    );
  }

  handleDelete(values: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: `Supprimer la sous-catégorie ${values.code}`
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);

    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res) => {
      this.ngxService.start();
      this.delete(values.id);
      dialogRef.close();
    });
  }

  delete(id: any): void {
    this.sousCategorieService.deleteSousCategory(id).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.tableData();
        this.snackbarService.openSnackbar("Sous-catégorie supprimée avec succès", "success");
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
    return this.dataSource.data.filter((sousCategory: any) =>
      sousCategory.code && sousCategory.designation && sousCategory.category
    ).length;
  }

  getUniqueCategoriesCount(): number {
    if (!this.dataSource?.data) return 0;
    const categories = new Set(
      this.dataSource.data
        .filter((sousCategory: any) => sousCategory.category?.id)
        .map((sousCategory: any) => sousCategory.category.id)
    );
    return categories.size;
  }

  getRecentAdditions(): number {
    if (!this.dataSource?.data) return 0;
    // Supposons que vous avez un champ createdAt
    // Sinon, retournez simplement le total ou une autre métrique
    return this.dataSource.data.length;
  }

  // Méthodes pour les filtres
  getUniqueCategories(): any[] {
    if (!this.dataSource?.data) return [];

    const categoriesMap = new Map();
    this.dataSource.data.forEach((sousCategory: any) => {
      if (sousCategory.category && !categoriesMap.has(sousCategory.category.id)) {
        categoriesMap.set(sousCategory.category.id, sousCategory.category);
      }
    });

    return Array.from(categoriesMap.values());
  }

  filterByCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;

    if (categoryId === null) {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return data.category?.id === categoryId;
      };
      this.dataSource.filter = categoryId.toString();
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getCategoryName(categoryId: number | null): string {
    if (categoryId === null) return 'Toutes les catégories';

    const category = this.dataSource.data.find(
      (sousCategory: any) => sousCategory.category?.id === categoryId
    );

    return category ? `${category.category.designation} (${category.category.code})` : 'Inconnu';
  }

  resetFilters(inputElement?: HTMLInputElement): void {
    this.selectedCategoryId = null;
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchStr = (
        (data.code || '') +
        (data.designation || '') +
        (data.description || '') +
        (data.category?.code || '') +
        (data.category?.designation || '')
      ).toLowerCase();
      return searchStr.includes(filter);
    };

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
      case 'description':
        return this.dataSource.data.some((sousCategory: any) => sousCategory.description);
      default:
        return false;
    }
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

  viewDetails(sousCategory: any): void {
    // Implémentez la logique pour voir les détails
    console.log('Voir détails:', sousCategory);
  }

  viewCategory(category: any): void {
    // Implémentez la logique pour voir la catégorie
    console.log('Voir catégorie:', category);
    // Exemple: this.router.navigate(['/categories', category.id]);
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