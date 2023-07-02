import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ArticleDto, ArticlesService, ClientDto, ClientsService, CommandeClientsService, CommandeFournisseursService, FournisseurDto, FournisseursService, VentesService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-ligne-commande',
  templateUrl: './ligne-commande.component.html',
  styleUrls: ['./ligne-commande.component.scss']
})
export class LigneCommandeComponent {

  onUpdate= new EventEmitter();
  ligneCommandeClients:any = FormGroup;
  dialogAction : any = "Ajouter"
  action :any = "Ajouter";
  responseMessage:any;

  client: ClientDto = {}

  dataClients : any [] = [];
  dataArticles : any [] = [];

  selectedClient: ClientDto = {}
  selectedFournisseur: FournisseurDto = {}
  selectedArticle: ArticleDto = {}
  origin = ''
  idCommande! : number


  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder : FormBuilder,
  private commandeClientService:CommandeClientsService,
  private commandeFournisseurService:CommandeFournisseursService,
  private dialogRef: MatDialogRef<LigneCommandeComponent>,
  private clientService:ClientsService,
  private fournisseurService:FournisseursService,
  private venteService:VentesService,
  private articleService: ArticlesService,
  private snackbarService: SnackbarService) { }

  ngOnInit(): void {


    if(this.dialogData.action === "Modifier"){
      this.dialogAction = "Modifier"
      this.action = "Modifier"
      this.origin = this.dialogData.origin
      this.idCommande = this.dialogData.idCommande

      console.log(this.dialogData.data)

      this.selectedArticle = this.dialogData.data.article.codeArticle
      this.ligneCommandeClients = this.formBuilder.group({
        article :[this.selectedArticle],
        quantite :[this.dialogData.data.quantite],
        prixUnitaire :[this.dialogData.data.article.prixUnitaireTtc],
    })

      //this.ligneCommandeClients.get('article')?.setValue(this.selectedArticle);




    }

    this.getArticles()
    this.getClients()
    this.getFournisseurs()

  }


  onChange(val:any){
    const article = this.dataArticles.find(lig => lig?.codeArticle === val);
    this.ligneCommandeClients.get('prixUnitaire')?.setValue(article.prixUnitaireTtc);

  }


  editComClient(){

    var formData = this.ligneCommandeClients.value;
    console.log(this.ligneCommandeClients.value)
    var data = {
      id : this.dialogData.data.id,
      article: formData?.article,
      quantite : formData?.quantite
    }

    const article = this.dataArticles.find((art)=> art.codeArticle == data.article)

    if (data.article?.codeArticle !== this.selectedArticle){
      this.commandeClientService.updateArticle1(this.idCommande,data.id,article.id).subscribe((res:any)=>{
        this.dialogRef.close()
        this.onUpdate.emit();
        this.responseMessage = res.message
        this.snackbarService.openSnackbar("Commande modifiée avec success !"+data.article.codeArticle,"success")
     },(error:any)=>{
       this.dialogRef.close();
       if(error.error?.message){
           this.responseMessage = error.error?.message
       }
       else {
         this.responseMessage = GlobalConstants.genericErrorMessage
       }
       this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
     })
    }


    if (data?.quantite !== this.dialogData.data.quantite){
      this.commandeClientService.updateQuantiteCommande1(this.idCommande,data.id,data.quantite).subscribe((res:any)=>{
        this.dialogRef.close()
        this.onUpdate.emit();
        this.responseMessage = res.message
        this.snackbarService.openSnackbar("Commande modifiée avec success !"+data.article.codeArticle,"success")
     },(error:any)=>{
       this.dialogRef.close();
       if(error.error?.message){
           this.responseMessage = error.error?.message
       }
       else {
         this.responseMessage = GlobalConstants.genericErrorMessage
       }
       this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
     })
    }


    if (data.article?.codeArticle !== this.selectedArticle && data?.quantite !== this.dialogData.data.quantite ){
      this.commandeClientService.updateArticle1(this.idCommande,data.id,article.id).subscribe((res:any)=>{


        this.commandeClientService.updateQuantiteCommande1(this.idCommande,data.id,data.quantite).subscribe((res:any)=>{
          this.dialogRef.close()
          this.onUpdate.emit();
          this.responseMessage = res.message
          this.snackbarService.openSnackbar("Commande modifiée avec success !"+data.article.codeArticle,"success")
       },(error:any)=>{
         this.dialogRef.close();
         if(error.error?.message){
             this.responseMessage = error.error?.message
         }
         else {
           this.responseMessage = GlobalConstants.genericErrorMessage
         }
         this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
       })
     },(error:any)=>{
       this.dialogRef.close();
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

  editComFournisseur(){

    var formData = this.ligneCommandeClients.value;
    console.log(this.ligneCommandeClients.value)
    var data = {
      id : this.dialogData.data.id,
      article: formData?.article,
      quantite : formData?.quantite
    }

    const article = this.dataArticles.find((art)=> art.codeArticle == data.article)


    if (data.article?.codeArticle !== this.selectedArticle){
      this.commandeFournisseurService.updateArticle(this.idCommande,data.id,article.id).subscribe((res:any)=>{
        this.dialogRef.close()
        this.onUpdate.emit();
        this.responseMessage = res.message
        this.snackbarService.openSnackbar("Commande modifiée avec success !"+data.article.codeArticle,"success")
     },(error:any)=>{
       this.dialogRef.close();
       if(error.error?.message){
           this.responseMessage = error.error?.message
       }
       else {
         this.responseMessage = GlobalConstants.genericErrorMessage
       }
       this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
     })
    }


    if (data?.quantite !== this.dialogData.data.quantite){
      this.commandeFournisseurService.updateQuantiteCommande(this.idCommande,data.id,data.quantite).subscribe((res:any)=>{
        this.dialogRef.close()
        this.onUpdate.emit();
        this.responseMessage = res.message
        this.snackbarService.openSnackbar("Commande modifiée avec success !"+data.article.codeArticle,"success")
     },(error:any)=>{
       this.dialogRef.close();
       if(error.error?.message){
           this.responseMessage = error.error?.message
       }
       else {
         this.responseMessage = GlobalConstants.genericErrorMessage
       }
       this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
     })
    }

    if (data.article?.codeArticle !== this.selectedArticle && data?.quantite !== this.dialogData.data.quantite ){
      this.commandeFournisseurService.updateArticle(this.idCommande,data.id,article.id).subscribe((res:any)=>{


        this.commandeFournisseurService.updateQuantiteCommande(this.idCommande,data.id,data.quantite).subscribe((res:any)=>{
          this.dialogRef.close()
          this.onUpdate.emit();
          this.responseMessage = res.message
          this.snackbarService.openSnackbar("Commande modifiée avec success !"+data.article.codeArticle,"success")
       },(error:any)=>{
         this.dialogRef.close();
         if(error.error?.message){
             this.responseMessage = error.error?.message
         }
         else {
           this.responseMessage = GlobalConstants.genericErrorMessage
         }
         this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
       })
     },(error:any)=>{
       this.dialogRef.close();
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

  // editVente(){

  //   var formData = this.ligneCommandeClients.value;
  //   console.log(this.ligneCommandeClients.value)
  //   var data = {
  //     id : this.dialogData.data.id,
  //     article: formData?.article,
  //     quantite : formData?.quantite
  //   }

  //   const article = this.dataArticles.find((art)=> art.codeArticle == data.article)


  //   if (data.article?.codeArticle !== this.selectedArticle){
  //     this.venteService.upda(this.idCommande,data.id,article.id).subscribe((res:any)=>{
  //       this.dialogRef.close()
  //       this.onUpdate.emit();
  //       this.responseMessage = res.message
  //       this.snackbarService.openSnackbar("Commande modifiée avec success !"+data.article.codeArticle,"success")
  //    },(error:any)=>{
  //      this.dialogRef.close();
  //      if(error.error?.message){
  //          this.responseMessage = error.error?.message
  //      }
  //      else {
  //        this.responseMessage = GlobalConstants.genericErrorMessage
  //      }
  //      this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
  //    })
  //   }


  //   if (data?.quantite !== this.dialogData.data.quantite){
  //     this.commandeFournisseurService.updateQuantiteCommande(this.idCommande,data.id,data.quantite).subscribe((res:any)=>{
  //       this.dialogRef.close()
  //       this.onUpdate.emit();
  //       this.responseMessage = res.message
  //       this.snackbarService.openSnackbar("Commande modifiée avec success !"+data.article.codeArticle,"success")
  //    },(error:any)=>{
  //      this.dialogRef.close();
  //      if(error.error?.message){
  //          this.responseMessage = error.error?.message
  //      }
  //      else {
  //        this.responseMessage = GlobalConstants.genericErrorMessage
  //      }
  //      this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
  //    })
  //   }

  //   if (data.article?.codeArticle !== this.selectedArticle && data?.quantite !== this.dialogData.data.quantite ){
  //     this.commandeFournisseurService.updateArticle(this.idCommande,data.id,article.id).subscribe((res:any)=>{


  //       this.commandeFournisseurService.updateQuantiteCommande(this.idCommande,data.id,data.quantite).subscribe((res:any)=>{
  //         this.dialogRef.close()
  //         this.onUpdate.emit();
  //         this.responseMessage = res.message
  //         this.snackbarService.openSnackbar("Commande modifiée avec success !"+data.article.codeArticle,"success")
  //      },(error:any)=>{
  //        this.dialogRef.close();
  //        if(error.error?.message){
  //            this.responseMessage = error.error?.message
  //        }
  //        else {
  //          this.responseMessage = GlobalConstants.genericErrorMessage
  //        }
  //        this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
  //      })
  //    },(error:any)=>{
  //      this.dialogRef.close();
  //      if(error.error?.message){
  //          this.responseMessage = error.error?.message
  //      }
  //      else {
  //        this.responseMessage = GlobalConstants.genericErrorMessage
  //      }
  //      this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
  //    })



  //   }


  // }

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


  getFournisseurs(){
    this.fournisseurService.getAllFournisseurs().subscribe((res:any)=>{
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

  getArticles(){
    this.articleService.getAllArticles().subscribe((res:any)=>{
      this.dataArticles = res
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

  handleEdit(){

    if (this.origin == 'client'){
       this.editComClient()
    }
    else if (this.origin == 'fournisseur'){
      this.editComFournisseur()
    }
  }

}
