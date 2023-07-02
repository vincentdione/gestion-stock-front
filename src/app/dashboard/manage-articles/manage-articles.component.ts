import { Component } from '@angular/core';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ArticlesService } from 'src/app/api';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Router } from '@angular/router';
import { ArticleComponent } from '../dialog/article/article.component';


@Component({
  selector: 'app-manage-articles',
  templateUrl: './manage-articles.component.html',
  styleUrls: ['./manage-articles.component.scss']
})
export class ManageArticlesComponent {

  displayColumns : string[] = ["code","category","souscategory","prixUnitaireHt","tauxTval","prixUnitaireTtc","action"]
  dataSource : any;
  responseMessage : any;

  constructor(private articleService: ArticlesService,
    private ngxService:NgxUiLoaderService,
    private snackbarService: SnackbarService,private router:Router, private dialog : MatDialog) { }



  ngOnInit(): void {
    this.ngxService.start()
    this.tableData()
  }

  tableData(){
      this.articleService.getAllArticles().subscribe((res:any) => {
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
    }

    applyFilter(event:Event){
       const filterValue = (event.target as HTMLInputElement).value;
       this.dataSource.filter = filterValue.trim().toLowerCase()
    }


    handleAddCat(){
       const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        action:'Ajouter'
      }
     // this.router.navigate(['/workspace/addCategory']);
      dialogConfig.width = "850px"
      const dialogRef = this.dialog.open(ArticleComponent,dialogConfig);
      this.router.events.subscribe(()=>{
        dialogRef.close();
      })
      const sub = dialogRef.componentInstance.onAdd.subscribe(
        (res:any)=>{
          this.ngxService.start();
          this.tableData()
        }
      )

    }

    handleEdit(values:any){
       const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        action:'Modifier',
        data: values
      }
      dialogConfig.width = "850px"
      const dialogRef = this.dialog.open(ArticleComponent,dialogConfig);
      this.router.events.subscribe(()=>{
        dialogRef.close();
      })
      const sub = dialogRef.componentInstance.onUpdate.subscribe(
        (res:any)=>{
          this.ngxService.start();
          this.tableData()
        }
      )
    }

    handleDelete(values:any){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        message:"supprimer l'article "+values.code
      }
      const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
      const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res)=>{
         this.ngxService.start();
         this.delete(values.id)
         dialogRef.close();

      })
    }

    delete(id:any){

      this.articleService.deleteArticle1(id).subscribe((res:any)=>{
          this.ngxService.stop()
          this.tableData()
          this.responseMessage = res?.message
          this.snackbarService.openSnackbar(this.responseMessage,"success")
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




}
