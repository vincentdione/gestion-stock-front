import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CategoriesService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';
import { CategoryComponent } from '../dialog/category/category.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';


@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent {


  displayColumns : string[] = ["code","designation","action"]
  dataSource : any;
  responseMessage : any;

  constructor(private categorieService: CategoriesService,
    private ngxService:NgxUiLoaderService,
    private snackbarService: SnackbarService,private router:Router, private dialog : MatDialog) { }



  ngOnInit(): void {
    this.ngxService.start()
    this.tableData()
  }

  tableData(){
      this.categorieService.getAllCategorys().subscribe((res:any) => {
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
      const dialogRef = this.dialog.open(CategoryComponent,dialogConfig);
      this.router.events.subscribe(()=>{
        dialogRef.close();
      })
      const sub = dialogRef.componentInstance.onAddCategory.subscribe(
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
      const dialogRef = this.dialog.open(CategoryComponent,dialogConfig);
      this.router.events.subscribe(()=>{
        dialogRef.close();
      })
      const sub = dialogRef.componentInstance.onUpdateCategory.subscribe(
        (res:any)=>{
          this.ngxService.start();
          this.tableData()
        }
      )
    }

    handleDelete(values:any){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        message:"supprimer la catégorie "+values.code
      }
      const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
      const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res)=>{
         this.ngxService.start();
         this.deleteCategory(values.id)
         dialogRef.close();

      })
    }

    deleteCategory(id:any){

      this.categorieService.deleteCategory(id).subscribe((res:any)=>{
          this.ngxService.stop()
          this.tableData()
          this.responseMessage = res?.message
          this.snackbarService.openSnackbar("Catégorie supprimée avec success","success")
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
