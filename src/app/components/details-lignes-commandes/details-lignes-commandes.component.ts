import { Component,Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ArticlesService, ClientsService, CommandeClientsService, CommandeFournisseursService, LigneCommandeClientDto, VentesService } from 'src/app/api';
import { ConfirmationComponent } from 'src/app/dashboard/dialog/confirmation/confirmation.component';
import { LigneCommandeComponent } from 'src/app/dashboard/dialog/ligne-commande/ligne-commande.component';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-details-lignes-commandes',
  templateUrl: './details-lignes-commandes.component.html',
  styleUrls: ['./details-lignes-commandes.component.scss']
})
export class DetailsLignesCommandesComponent {

  displayColumns : string [] = ["code","article","quantite","prixUnitaire","total","action"];
  dataSource:any = [];

  @Input()
  idCommande: any;
  @Input()
  origin: any;

  responseMessage : any;


  constructor(private clientService:ClientsService,
    private articleService: ArticlesService,
    private comClientService:CommandeClientsService,
    private comFournisseurService:CommandeFournisseursService,
    private venteService: VentesService,
    // private ligneCommandeClients : Ligne
    private router: Router, private dialog: MatDialog,
    private snackbarService : SnackbarService, private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.ngxService.start()
    if (this.origin == 'client'){
      this.tableDataClients()
    }
    else if (this.origin == 'fournisseur'){
      this.tableDataFournisseurs()
    }

    else {
      this.tableDataVentes()

    }

  }

  tableDataVentes(){
    this.venteService.findAllLigneVenteByVenteId(this.idCommande).subscribe((res:any) => {
      this.ngxService.stop()
      this.dataSource = new MatTableDataSource(res)
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
  }


  tableDataClients(){
    this.comClientService.findAllLignesCommandesClientByCommandeClientId(this.idCommande).subscribe((res:any) => {
      this.ngxService.stop()
      this.dataSource = new MatTableDataSource(res)
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
  }

  tableDataFournisseurs(){
    this.comFournisseurService.findAllLignesCommandesFournisseurByCommandeFournisseurId(this.idCommande).subscribe((res:any) => {
      this.ngxService.stop()
      this.dataSource = new MatTableDataSource(res)
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
  }



  handleDelete(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message:"supprimer la ligne de commande "+values.article?.codeArticle
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
    this.comClientService.deleteArticle(this.idCommande,id).subscribe((res:any)=>{
      this.ngxService.stop()
      this.tableDataClients()
      this.responseMessage = res?.message
      this.snackbarService.openSnackbar("Ligne de commande supprimée avec success","success")
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

    this.comFournisseurService.deleteFournisseurArticle(this.idCommande,id).subscribe((res:any)=>{
      this.ngxService.stop()
      this.tableDataFournisseurs()
      this.responseMessage = res?.message
      this.snackbarService.openSnackbar("Ligne de commande supprimée avec success","success")
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

   else {
    this.venteService.deleteVente(this.idCommande,id).subscribe((res:any)=>{
      this.ngxService.stop()
      this.tableDataFournisseurs()
      this.responseMessage = res?.message
      this.snackbarService.openSnackbar("Ligne de vente supprimée avec success","success")
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

  handleEdit(values:any){
    const dialogConfig = new MatDialogConfig();
   dialogConfig.data = {
     action:'Modifier',
     data: values,
     origin: this.origin,
     idCommande: this.idCommande
   }
   console.log(values)
   dialogConfig.width = "850px"
   const dialogRef = this.dialog.open(LigneCommandeComponent,dialogConfig);
   this.router.events.subscribe(()=>{
     dialogRef.close();
   })
   const sub = dialogRef.componentInstance.onUpdate.subscribe(
     (res:any)=>{
       this.ngxService.start();
       if (this.origin == 'client'){
        this.tableDataClients()
       }
       else if (this.origin == 'fournisseur'){
        this.tableDataFournisseurs()
       }
      //  else {
      //   this.tableDataVentes()
      //  }
     }
   )
 }

}
