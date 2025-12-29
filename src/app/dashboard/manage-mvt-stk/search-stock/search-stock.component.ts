import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ArticleDto, ArticleStockInfoDto, ArticlesService, MouvementsDeStockService, UniteDto, UnitsService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-search-stock',
  templateUrl: './search-stock.component.html',
  styleUrls: ['./search-stock.component.scss']
})
export class SearchStockComponent {

  displayStockColumns: string[] = ["article", "stock", "action"];
  dataSourceStock: MatTableDataSource<any> = new MatTableDataSource<any>();
  responseMessage: any;

  articles: ArticleDto[] = [];
  listeArticles: ArticleStockInfoDto[] = [];
  listeUnites: UniteDto[] = [];
  selectedArticle: ArticleDto = {};
  filterForm: FormGroup;

  constructor(
    private mvtService: MouvementsDeStockService,
    private articleService: ArticlesService,
    private uniteService: UnitsService,
    private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.filterForm = this.formBuilder.group({
      article: [''],
      unite: [''],
      type: ['']
    });
  }

  ngOnInit(): void {
    this.ngxService.start();
    this.loadInitialData();
  }

  loadInitialData() {
    // Charger les articles
    this.articleService.getAllArticles().subscribe(
      (res: any) => {
        this.articles = res;
      },
      (error: any) => {
        this.handleError(error);
      }
    );

    // Charger les unités
    this.uniteService.getAllUnites().subscribe(
      (res: any) => {
        this.listeUnites = res;
      },
      (error: any) => {
        this.handleError(error);
      }
    );

    // Charger les stocks initiaux
    this.mvtService.getAllArticlesWithStockInfo().subscribe(
      (res: any) => {
        this.listeArticles = res;
        this.dataSourceStock = new MatTableDataSource(res);
        this.ngxService.stop();
      },
      (error: any) => {
        this.handleError(error);
        this.ngxService.stop();
      }
    );
  }

  onSearch() {
    const articleValue = this.filterForm.get('article')?.value;
    const uniteValue = this.filterForm.get('unite')?.value;
    let typeValue = this.filterForm.get('type')?.value;

    if (!articleValue) {
      this.snackbarService.openSnackbar("Veuillez sélectionner un article", "warning");
      return;
    }

    this.ngxService.start();

    if (typeValue) {
      typeValue = typeValue.toUpperCase();
      this.mvtService.getStockInfoByUnite(articleValue.id, typeValue).subscribe(
        (res: any) => {
          this.ngxService.stop();
          this.dataSourceStock = new MatTableDataSource(res);
          if (res.length === 0) {
            this.snackbarService.openSnackbar("Aucun résultat trouvé", "info");
          }
        },
        (error: any) => {
          this.ngxService.stop();
          this.handleError(error);
        }
      );
    } else {
      // Si pas de type spécifié, montrer tout le stock
      this.mvtService.getAllArticlesWithStockInfo().subscribe(
        (res: any) => {
          this.ngxService.stop();
          this.dataSourceStock = new MatTableDataSource(
            res.filter((item: any) =>
              !articleValue || item.articleId === articleValue.id
            )
          );
        },
        (error: any) => {
          this.ngxService.stop();
          this.handleError(error);
        }
      );
    }
  }

  resetFilters() {
    this.filterForm.reset();
    this.loadInitialData();
    this.snackbarService.openSnackbar("Filtres réinitialisés", "success");
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceStock.filter = filterValue.trim().toLowerCase();
  }

  getStockInfoKeys(stockInfo: any): string[] {
    return stockInfo ? Object.keys(stockInfo) : [];
  }

  calculateTotalStock(stockInfo: any): number {
    if (!stockInfo) return 0;
    return Object.values(stockInfo).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
  }

  calculateTotalAllStock(): number {
    if (!this.dataSourceStock?.data) return 0;
    return this.dataSourceStock.data.reduce((total: number, item: any) => {
      return total + this.calculateTotalStock(item.stockInfo);
    }, 0);
  }

  getAverageStock(): number {
    if (!this.dataSourceStock?.data?.length) return 0;
    const total = this.calculateTotalAllStock();
    return Math.round(total / this.dataSourceStock.data.length * 10) / 10; // Arrondi à 1 décimale
  }

  exportToExcel() {
    // Implémentez l'export Excel ici
    this.snackbarService.openSnackbar("Export Excel bientôt disponible", "info");
  }

  private handleError(error: any) {
    if (error.error?.message) {
      this.responseMessage = error.error?.message;
    } else {
      this.responseMessage = GlobalConstants.genericErrorMessage;
    }
    this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
  }
}