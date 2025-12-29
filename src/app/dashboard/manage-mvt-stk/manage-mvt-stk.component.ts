import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ArticleDto, ArticlesService, MouvementsDeStockService, MvtStkDto } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-manage-mvt-stk',
  templateUrl: './manage-mvt-stk.component.html',
  styleUrls: ['./manage-mvt-stk.component.scss']
})
export class ManageMvtStkComponent {

  displayColumns: string[] = ["article", "unite", "typeMvtStk", "sourceMvt", "quantite", "dateMvt", "action"];
  dataSource: MatTableDataSource<MvtStkDto> = new MatTableDataSource<MvtStkDto>();
  responseMessage: any;
  filterForm: FormGroup;

  mvtStock: MvtStkDto = {};
  articles: ArticleDto[] = [];
  selectedArticle: ArticleDto = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private mvtService: MouvementsDeStockService,
    private ngxService: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private articleService: ArticlesService,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.filterForm = this.formBuilder.group({
      article: ['']
    });
  }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
    this.getAllArticles();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  refreshTableData(res?: any) {
    if (res) {
      this.dataSource = new MatTableDataSource(res);
    } else {
      this.tableData();
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  tableData() {
    this.mvtService.findAllMvtStock().subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error: any) => {
        this.ngxService.stop();
        this.handleError(error);
      }
    );
  }

  getAllArticles() {
    this.articleService.getAllArticles().subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.articles = res;
      },
      (error: any) => {
        this.ngxService.stop();
        this.handleError(error);
      }
    );
  }

  onSearch() {
    const articleValue = this.filterForm.get('article')?.value;
    if (articleValue && articleValue.id) {
      this.ngxService.start();
      this.mvtService.mvtStkArticle(articleValue.id).subscribe(
        (res: any) => {
          this.ngxService.stop();
          this.refreshTableData(res);
        },
        (error: any) => {
          this.ngxService.stop();
          this.handleError(error);
        }
      );
    } else {
      this.tableData();
    }
  }

  resetFilter() {
    this.filterForm.reset();
    this.tableData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Méthodes pour les statistiques
  getTotalMovements(): number {
    return this.dataSource?.data?.length || 0;
  }

  getEntreeCount(): number {
    if (!this.dataSource?.data) return 0;
    return this.dataSource.data.filter((mvt: MvtStkDto) => mvt.typeMvtStk === 'ENTREE').length;
  }

  getSortieCount(): number {
    if (!this.dataSource?.data) return 0;
    return this.dataSource.data.filter((mvt: MvtStkDto) => mvt.typeMvtStk === 'SORTIE').length;
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