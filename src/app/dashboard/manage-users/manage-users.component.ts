import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UtilisateurDto, UtilisateursEntreprisesService, UtilisateursService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent {

   displayColumns : string[] = ["username","email","nom","prenom","entreprise","role","action"]
   dataSource : any;
   responseMessage : any;
   filterForm:any = FormGroup;

    utilisateur: UtilisateurDto = {}
    utilisateurs: UtilisateurDto []= []
    selectedUtilisateur : UtilisateurDto = {}
    @ViewChild(MatPaginator)
    paginator: MatPaginator | undefined;





    constructor(private utilisateurService: UtilisateursEntreprisesService,
      private ngxService: NgxUiLoaderService,  private formBuilder: FormBuilder,
      private snackbarService: SnackbarService,private router:Router, private dialog : MatDialog) { }



    ngOnInit(): void {
      this.ngxService.start()
      this.refreshTableData();
      this.getAllUtilisateurs()
      this.filterForm = this.formBuilder.group({
        article: [''],
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
          this.utilisateurService.getAllUtilisateurs1().subscribe((res:any) => {
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


        getAllUtilisateurs(){
          this.utilisateurService.getAllUtilisateurs1().subscribe((res:any) => {
            this.ngxService.stop()
            this.utilisateurs = res
            console.log(this.utilisateurs, " ================================ ")
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

        }

}
