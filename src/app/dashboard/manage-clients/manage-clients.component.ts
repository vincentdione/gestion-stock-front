import { Component } from '@angular/core';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ClientsService } from 'src/app/api';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ClientsComponent } from '../dialog/clients/clients.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-manage-clients',
  templateUrl: './manage-clients.component.html',
  styleUrls: ['./manage-clients.component.scss']
})
export class ManageClientsComponent {


  displayColumns : string[] = ["nom","prenom","email","telephone","adresse","ville","codepostal","pays","action"]
  dataSource : any;
  responseMessage : any;
  dataClients : any;
  filterForm:any = FormGroup;

  constructor(private clientService: ClientsService,
    private ngxService:NgxUiLoaderService, private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,private router:Router, private dialog : MatDialog) { }



  ngOnInit(): void {
    this.ngxService.start()
    this.tableData()

    this.filterForm = this.formBuilder.group({
      nom: [''], // Définissez les valeurs par défaut si nécessaire
      email: [''],
      numTel: ['']
    });
  }

  tableData(){
      this.clientService.searchClients().subscribe((res:any) => {
         this.ngxService.stop()
         this.dataSource = new MatTableDataSource(res)
         this.dataClients = res
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
     // this.router.navigate(['/workspace/add']);
      dialogConfig.width = "850px"
      const dialogRef = this.dialog.open(ClientsComponent,dialogConfig);
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
      console.log(values)
      dialogConfig.width = "850px"
      const dialogRef = this.dialog.open(ClientsComponent,dialogConfig);
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
        message:"supprimer la catégorie "+values.code
      }
      const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
      const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res)=>{
         this.ngxService.start();
         this.delete(values.id)
         dialogRef.close();

      })
    }

    delete(id:any){

      this.clientService.deleteClient(id).subscribe((res:any)=>{
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


    onSearch(){
      const nomValue = this.filterForm.get('nom').value;
      const emailValue = this.filterForm.get('email').value;
      let telValue = this.filterForm.get('numTel').value;

      let nom: string = '';
      let prenom: string = '';

      if (nomValue && nomValue.includes(' ')) {
        const parts = nomValue.split(' ', 2);
        nom = parts[0];
        prenom = parts[1];
      } else {
        nom = nomValue;
      }



        this.clientService.searchClients(nomValue,emailValue, telValue).subscribe((res:any)=>{
            this.dataClients = res;
            this.tableData()
            console.log(res);
        }, (err:any)=>{

        });

    }


}
