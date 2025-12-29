import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatPaginator } from '@angular/material/paginator';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ArticlesService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { ArticleComponent } from '../dialog/article/article.component';
import { ArticleApiServiceService } from 'src/app/services/article-api-service.service';

@Component({
  selector: 'app-manage-articles',
  templateUrl: './manage-articles.component.html',
  styleUrls: ['./manage-articles.component.scss']
})
export class ManageArticlesComponent implements AfterViewInit {
  displayColumns: string[] = ["code", "category", "souscategory", "prixUnitaireHt", "tauxTval", "prixUnitaireTtc", "action"];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  responseMessage: string = '';
  showAdditionalColumns = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('input') input!: ElementRef;

  constructor(
    private articleService: ArticlesService,
    private ngxService: NgxUiLoaderService,
    private articleApi: ArticleApiServiceService,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(): void {
    this.articleService.getAllArticles().subscribe(
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
  getCategoriesCount(): number {
    if (!this.dataSource?.data) return 0;
    const categories = new Set(
      this.dataSource.data
        .map((article: any) => article?.sousCategoryDto?.category?.code)
        .filter(Boolean)
    );
    return categories.size;
  }

  getSousCategoriesCount(): number {
    if (!this.dataSource?.data) return 0;
    const sousCategories = new Set(
      this.dataSource.data
        .map((article: any) => article?.sousCategoryDto?.code)
        .filter(Boolean)
    );
    return sousCategories.size;
  }

  getAveragePrice(): number {
    if (!this.dataSource?.data?.length) return 0;
    const total = this.dataSource.data.reduce((sum: number, article: any) => {
      return sum + (article.prixUnitaireTtc || 0);
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

  getUniqueCategories(): string[] {
    if (!this.dataSource?.data) return [];
    const categories = this.dataSource.data
      .map((article: any) => article?.sousCategoryDto?.category?.code)
      .filter(Boolean)
      .filter((value, index, self) => self.indexOf(value) === index);
    return categories;
  }

  filterByCategory(category: string | null): void {
    if (category === null) {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        return data?.sousCategoryDto?.category?.code === filter;
      };
      this.dataSource.filter = category;
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  resetFilters(inputElement?: HTMLInputElement): void {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchStr = (
        data.codeArticle +
        (data?.sousCategoryDto?.category?.code || '') +
        (data?.sousCategoryDto?.code || '')
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

  viewDetails(article: any): void {
    // Implémentez la logique pour voir les détails
    console.log('Voir détails:', article);
  }

  exportToExcel(): void {
    // Implémentez l'export Excel
    console.log('Export Excel');
  }

  // Méthodes existantes à conserver
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.ngxService.start();

      this.articleApi.importCsv(file).subscribe(
        (res: any) => {
          this.ngxService.stop();
          this.responseMessage = res?.message || 'Importation réussie';
          this.snackbarService.openSnackbar(this.responseMessage, "success");
          this.tableData();
          event.target.value = '';
        },
        (error: any) => {
          this.ngxService.stop();
          if (error.error?.message) {
            this.responseMessage = error.error?.message;
          } else {
            this.responseMessage = GlobalConstants.genericErrorMessage;
          }
          this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
          event.target.value = '';
        }
      );
    }
  }

  handleAddCat(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Ajouter'
    };
    dialogConfig.width = "850px";

    const dialogRef = this.dialog.open(ArticleComponent, dialogConfig);

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
      data: values,
      sousCategoryDto: values.sousCategoryDto
    };
    dialogConfig.width = "850px";

    const dialogRef = this.dialog.open(ArticleComponent, dialogConfig);

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
      message: `Supprimer l'article ${values.code}`
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);

    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res) => {
      this.ngxService.start();
      this.delete(values.id);
      dialogRef.close();
    });
  }

  delete(id: any): void {
    this.articleService.deleteArticle1(id).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.tableData();
        this.responseMessage = res?.message;
        this.snackbarService.openSnackbar(this.responseMessage, "success");
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