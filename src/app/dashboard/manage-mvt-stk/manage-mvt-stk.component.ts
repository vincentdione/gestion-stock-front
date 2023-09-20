import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ArticleDto, ArticlesService, MouvementsDeStockService, MvtStkDto, UnitsService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-manage-mvt-stk',
  templateUrl: './manage-mvt-stk.component.html',
  styleUrls: ['./manage-mvt-stk.component.scss']
})
export class ManageMvtStkComponent {


  displayColumns : string[] = ["article","unite","typeMvtStk","sourceMvt","quantite","dateMvt","action"]

  dataSource : any;
  responseMessage : any;
  filterForm:any = FormGroup;

  mvtStock: MvtStkDto = {}
  articles: ArticleDto []= []
  selectedArticle : ArticleDto = {}
  @ViewChild(MatPaginator)
  paginator: MatPaginator | undefined;



  constructor(private mvtService: MouvementsDeStockService,
    private ngxService:NgxUiLoaderService,  private formBuilder: FormBuilder, private articleService: ArticlesService,
    private snackbarService: SnackbarService,private router:Router, private dialog : MatDialog) { }



  ngOnInit(): void {
    this.ngxService.start()
    this.refreshTableData();
    this.getAllArticles()
    this.filterForm = this.formBuilder.group({
      article: [''], // Définissez les valeurs par défaut si nécessaire
    });
  }

  refreshTableData(res?: any) {
    if (res) {
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.paginator = this.paginator;
    } else {
        this.tableData()
    }
  }


  tableData(){
      this.mvtService.findAllMvtStock().subscribe((res:any) => {
         this.ngxService.stop()
         this.dataSource = new MatTableDataSource(res)
         this.dataSource.paginator = this.paginator;
      },(error:any)=>{
        this.ngxService.stop()
        if(error.error?.message){
          this.responseMessage = error.error?.message
      }
      else {
        this.responseMessage = GlobalConstants.genericErrorMessage
      }
      this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
      })
    }


    getAllArticles(){
      this.articleService.getAllArticles().subscribe((res:any) => {
        this.ngxService.stop()
        this.articles = res

     },(error:any)=>{
       this.ngxService.stop()
       if(error.error?.message){
         this.responseMessage = error.error?.message
     }
     else {
       this.responseMessage = GlobalConstants.genericErrorMessage
     }
     this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
     })
    }

    onSearch(){
      const articleValue = this.filterForm.get('article').value;
    if (articleValue !== undefined) {
    this.mvtService.mvtStkArticle(articleValue.id).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.refreshTableData(res); // Rafraîchissez le tableau avec les résultats de la recherche
        console.log(res);
      },
      (error) => {
        this.ngxService.stop();
        console.log("error");
        // Gérez les erreurs ici
      }
    );
  }

    }


    applyFilter(event:Event){
       const filterValue = (event.target as HTMLInputElement).value;
       this.dataSource.filter = filterValue.trim().toLowerCase()
    }



    // handleEdit(values:any){
    //    const dialogConfig = new MatDialogConfig();
    //   dialogConfig.data = {
    //     action:'Modifier',
    //     data: values
    //   }
    //   dialogConfig.width = "850px"
    //   const dialogRef = this.dialog.open(UniteComponent,dialogConfig);
    //   this.router.events.subscribe(()=>{
    //     dialogRef.close();
    //   })
    //   const sub = dialogRef.componentInstance.onUpdate.subscribe(
    //     (res:any)=>{
    //       this.ngxService.start();
    //       this.tableData()
    //     }
    //   )
    // }





}
