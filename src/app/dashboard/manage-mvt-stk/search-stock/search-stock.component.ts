import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ArticleDto, ArticleStockInfo, ArticleStockInfoDto, ArticlesService, MouvementsDeStockService, MvtStkDto, UniteDto, UnitsService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-search-stock',
  templateUrl: './search-stock.component.html',
  styleUrls: ['./search-stock.component.scss']
})
export class SearchStockComponent {

  displayColumns : string[] = ["article","unite","typeMvtStk","sourceMvt","quantite","dateMvt","action"]
  displayStockColumns : string[] = ["article","stock","action"]

  dataSource : any;
  dataSourceStock: any;
  responseMessage : any;

  mvtStock: MvtStkDto = {}
  articles: ArticleDto []= []
  listeArticles: ArticleStockInfoDto []= []
  listeUnites: UniteDto [] = []
  selectedArticle : ArticleDto = {}
  filterForm:any = FormGroup;
  articleStocks : ArticleStockInfo []= []

  constructor(private mvtService: MouvementsDeStockService, private articleService: ArticlesService,
    private uniteService: UnitsService, private formBuilder: FormBuilder,
    private ngxService:NgxUiLoaderService,
    private snackbarService: SnackbarService,private router:Router, private dialog : MatDialog) { }



  ngOnInit(): void {
    this.ngxService.start()
    this.tableData()

    this.filterForm = this.formBuilder.group({
      article: [''], // Définissez les valeurs par défaut si nécessaire
      unite: [''],
      type: ['']
    });

  }


  tableData(){
    this.mvtService.findAllMvtStock().subscribe((res:any) => {
       this.ngxService.stop()
       this.dataSource = new MatTableDataSource(res)

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


   this.uniteService.getAllUnites().subscribe((res)=>{
    this.listeUnites = res
 },(error=>{
   if(error.error?.message){
     this.responseMessage = error.error?.message
     console.log(this.responseMessage)
 }
 else {
   this.responseMessage = GlobalConstants.genericErrorMessage
   console.log(this.responseMessage)
 }
 }))

 this.mvtService.getAllArticlesWithStockInfo().subscribe((res)=>{
  this.listeArticles = res
  console.log(res)
  console.log("res")
},(error=>{
 if(error.error?.message){
   this.responseMessage = error.error?.message
   console.log(this.responseMessage)
}
else {
 this.responseMessage = GlobalConstants.genericErrorMessage
 console.log(this.responseMessage)
}
}))

  }


  onSearch(){
    const articleValue = this.filterForm.get('article').value;
    const uniteValue = this.filterForm.get('unite').value;
    let typeValue = this.filterForm.get('type').value;

    typeValue = typeValue.toUpperCase();


    if (articleValue !== undefined && uniteValue !== undefined && typeValue !== undefined){

      this.mvtService.getStockInfoByUnite(articleValue.id,typeValue).subscribe((res:any)=>{
        this.dataSourceStock = new MatTableDataSource(res)
        console.log(res)
      },error => {
        console.log("first")
      } )
    }

  }


  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase()
 }

 getStockInfoKeys(stockInfo: any): string[] {
  return Object.keys(stockInfo);
}


}
