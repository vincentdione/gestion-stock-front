import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {  UnitsService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';
import { UniteComponent } from '../dialog/unite/unite.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-unite',
  templateUrl: './manage-unite.component.html',
  styleUrls: ['./manage-unite.component.scss']
})
export class ManageUniteComponent {

  displayColumns : string[] = ["nom","designation","action"]
  dataSource : any;
  responseMessage : any;

  constructor(private uniteService: UnitsService,
    private ngxService:NgxUiLoaderService,
    private snackbarService: SnackbarService,private router:Router, private dialog : MatDialog) { }



  ngOnInit(): void {
    this.ngxService.start()
    this.tableData()
  }

  tableData(){
      this.uniteService.getAllUnites().subscribe((res:any) => {
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


    handleAdd(){
       const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        action:'Ajouter'
      }
     // this.router.navigate(['/workspace/addCategory']);
      dialogConfig.width = "850px"
      const dialogRef = this.dialog.open(UniteComponent,dialogConfig);
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
      const dialogRef = this.dialog.open(UniteComponent,dialogConfig);
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
        message:"supprimer l'unité "+values.nom
      }
      const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
      const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res)=>{
         this.ngxService.start();
         this.delete(values.id)
         dialogRef.close();

      })
    }

    delete(id:any){
      this.uniteService.deleteUnite(id).subscribe((res:any)=>{
          this.ngxService.stop()
          this.tableData()
          this.responseMessage = res?.message
          this.snackbarService.openSnackbar("Unité supprimée avec success","success")
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
