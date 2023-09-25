import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ClientsService, CommandeClientDto, CommandeClientsService, CommandeFournisseurDto, CommandeFournisseursService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-commande-clients',
  templateUrl: './manage-commande-clients.component.html',
  styleUrls: ['./manage-commande-clients.component.scss']
})
export class ManageCommandeClientsComponent {




  displayColumns : string [] = ["code","dateCommande","client","etat","action"];
  dataSource:any;
  responseMessage : any;
  dataClients : any [] = [];
  statut : any[] = ["EN_PREPARATION","LIVREE","VALIDEE"];
  origin = ''
  addCommande = ''



  comClientForm: any = FormGroup

  comClient : CommandeClientDto = {}
  comClients : CommandeClientDto [] = []
  comFournisseurs : CommandeFournisseurDto [] = []

  total : number = 0;
  radioDataExport:any;
  panelOpenState = false;

  constructor(private clientService:ClientsService,
    private comClientService:CommandeClientsService,
    private comFournisseurService: CommandeFournisseursService,
     private router: Router,private dialog : MatDialog,
    private snackbarService : SnackbarService, private activatedRoute: ActivatedRoute,
     private ngxService: NgxUiLoaderService,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.ngxService.start()

    this.activatedRoute.data.subscribe(data => {
      this.origin = data['origin'];
    });

    if (this.origin == 'client'){
      this.tableData()
      this.addCommande = 'addcommandeClient'
    }
    else if (this.origin === 'fournisseur') {
      this.tableDataCmFournisseurs()
      this.addCommande = 'addcommandeFournisseur'

    }


    this.comClientForm = this.formBuilder.group({
      code :[null],
      clientDto :[null],
      etat :[null],
    })
  }

  tableData(){
    this.comClientService.getAllCommandeClients().subscribe((res:any) => {
      this.ngxService.stop()
      this.radioDataExport = res
      this.dataSource = new MatTableDataSource(res)
      this.comClients = res
      console.log("======= res ===")
      console.log(res)
      // this.total = res.reduce((acc:number, val:any) => {
      //   return acc + parseInt(val.rad_prix);
      // }, 0);
    },(error)=>{
      this.ngxService.stop()
      if(error.error?.message){
        this.responseMessage = error.error?.message
    }
    else {
      this.responseMessage = GlobalConstants.genericErrorMessage
    }
    this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
    })

    this.getClients()

  }

  tableDataCmFournisseurs(){
    this.comFournisseurService.getAllCommandeFournisseurs().subscribe((res:any) => {
      this.ngxService.stop()
      this.dataSource = new MatTableDataSource(res)
      this.comFournisseurs = res
      console.log(res)
      // this.total = res.reduce((acc:number, val:any) => {
      //   return acc + parseInt(val.rad_prix);
      // }, 0);
    },(error)=>{
      this.ngxService.stop()
      console.log("error")
      console.log(error)
      if(error.error?.message){
        this.responseMessage = error.error?.message
    }
    else {
      this.responseMessage = GlobalConstants.genericErrorMessage
    }
    this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
    })

    this.getClients()

  }


  getClients(){
    this.clientService.getAllClients().subscribe((res:any)=>{
      this.dataClients = res
    },(error)=>{
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



  handleDelete(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message:"supprimer la commande "+values.code
    }
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res)=>{
       this.ngxService.start();
       this.delete(values.id)
       dialogRef.close();

    })
  }

  delete(id:any){

   if (this.origin == 'client'){
    this.comClientService.deleteCommandeClient(id).subscribe((res:any)=>{
      this.ngxService.stop()
      this.tableData()
      this.responseMessage = res?.message
      this.snackbarService.openSnackbar("commande supprimée avec success","success")
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
   else if (this.origin == 'fournisseur'){

    this.comFournisseurService.deleteCommandeFournisseur(id).subscribe((res:any)=>{
      this.ngxService.stop()
      this.tableDataCmFournisseurs()
      this.responseMessage = res?.message
      this.snackbarService.openSnackbar("commande supprimée avec success","success")
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




  getStatus(status:boolean){
     if(status === false){
      return "EN_PREPARATION"
     }
     else {
      return "TERMINE"
     }
  }

  onChange(value:any) {
    console.log(value)

 }

}
