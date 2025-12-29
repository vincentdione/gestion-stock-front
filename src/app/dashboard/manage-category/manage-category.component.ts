import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoriesService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';
import { CategoryComponent } from '../dialog/category/category.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent {

  displayColumns: string[] = ["code", "designation", "action"];
  additionalColumns: string[] = ["parent", "level"];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  responseMessage: string = '';

  selectedParent: number | null = null;
  showAdditionalColumns = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('input') input!: ElementRef;

  constructor(
    private categorieService: CategoriesService,
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
    this.categorieService.getAllCategorys().subscribe(
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

  handleAddCat(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Ajouter'
    };
    dialogConfig.width = "850px";

    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);

    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddCategory.subscribe(
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

    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);

    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onUpdateCategory.subscribe(
      (res: any) => {
        this.ngxService.start();
        this.tableData();
      }
    );
  }

  handleDelete(values: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: `Supprimer la catégorie ${values.code}`
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);

    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res) => {
      this.ngxService.start();
      this.deleteCategory(values.id);
      dialogRef.close();
    });
  }

  deleteCategory(id: any): void {
    this.categorieService.deleteCategory(id).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.tableData();
        this.snackbarService.openSnackbar("Catégorie supprimée avec succès", "success");
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
    return this.dataSource.data.filter((category: any) =>
      category.code && category.designation
    ).length;
  }

  getNestedCategoriesCount(): number {
    if (!this.dataSource?.data) return 0;
    return this.dataSource.data.filter((category: any) =>
      category.parentId || category.level > 1
    ).length;
  }

  getRecentAdditions(): number {
    if (!this.dataSource?.data) return 0;
    // Supposons que vous avez un champ dateCreation
    // Sinon, retournez simplement le total ou une autre métrique
    return this.dataSource.data.length;
  }

  // Méthodes pour les filtres
  hasParentCategories(): boolean {
    if (!this.dataSource?.data) return false;
    return this.dataSource.data.some((category: any) => category.parentId);
  }

  getParentCategories(): any[] {
    if (!this.dataSource?.data) return [];

    // Récupérer toutes les catégories principales (sans parent)
    const parentCategories = this.dataSource.data.filter((category: any) =>
      !category.parentId || category.level === 1
    );

    return parentCategories;
  }

  filterByParent(parentId: number | null): void {
    this.selectedParent = parentId;

    if (parentId === null) {
      this.dataSource.filter = '';
    } else if (parentId === 0) {
      // Filtrer les catégories principales
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return !data.parentId || data.level === 1;
      };
      this.dataSource.filter = 'main';
    } else {
      // Filtrer par parent spécifique
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return data.parentId === parentId;
      };
      this.dataSource.filter = parentId.toString();
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getParentName(parentId: number | null): string {
    if (parentId === null) return 'Toutes les catégories';
    if (parentId === 0) return 'Catégories principales';

    const parent = this.dataSource.data.find((cat: any) => cat.id === parentId);
    return parent ? `${parent.designation} (${parent.code})` : 'Inconnu';
  }

  resetFilters(inputElement?: HTMLInputElement): void {
    this.selectedParent = null;
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchStr = (data.code + data.designation + (data.description || '')).toLowerCase();
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

  // Méthodes pour les icônes et couleurs
  getCategoryIcon(level?: number): string {
    if (!level || level === 1) return 'category';
    if (level === 2) return 'subdirectory_arrow_right';
    if (level === 3) return 'account_tree';
    return 'folder';
  }

  getCategoryColor(level?: number): string {
    if (!level || level === 1) return '#008080'; // Teal - $level-1
    if (level === 2) return '#2196F3'; // Blue - $level-2
    if (level === 3) return '#4CAF50'; // Green - $level-3
    if (level === 4) return '#FF9800'; // Orange - $level-4
    return '#9C27B0'; // Purple - $level-5
  }

  getLevelClass(level?: number): string {
    if (!level || level === 1) return 'level-1';
    if (level === 2) return 'level-2';
    if (level === 3) return 'level-3';
    if (level === 4) return 'level-4';
    return 'level-5';
  }

  getParentDesignation(category: any): string {
    if (!category.parentId) return '';

    const parent = this.dataSource.data.find((cat: any) => cat.id === category.parentId);
    return parent ? parent.designation : '';
  }

  hasChildren(category: any): boolean {
    if (!this.dataSource?.data) return false;
    return this.dataSource.data.some((cat: any) => cat.parentId === category.id);
  }

  getChildrenCount(category: any): number {
    if (!this.dataSource?.data) return 0;
    return this.dataSource.data.filter((cat: any) => cat.parentId === category.id).length;
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
      case 'parent':
        return this.dataSource.data.some((category: any) => category.parentId);
      case 'level':
        return this.dataSource.data.some((category: any) => category.level);
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

  viewDetails(category: any): void {
    // Implémentez la logique pour voir les détails
    console.log('Voir détails:', category);
  }

  viewChildren(category: any): void {
    this.filterByParent(category.id);
  }

  addSubCategory(category: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Ajouter',
      parentCategory: category
    };
    dialogConfig.width = "850px";

    const dialogRef = this.dialog.open(CategoryComponent, dialogConfig);

    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddCategory.subscribe(
      (res: any) => {
        this.ngxService.start();
        this.tableData();
      }
    );
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