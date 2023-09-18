import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MouvementsDeStockService, MvtStkDto } from 'src/app/api';
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

  mvtStock: MvtStkDto = {}

  constructor(private mvtService: MouvementsDeStockService,
    private ngxService:NgxUiLoaderService,
    private snackbarService: SnackbarService,private router:Router, private dialog : MatDialog) { }



  ngOnInit(): void {
    this.ngxService.start()
    this.tableData()
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
