import { CommandeFournisseurDto } from './../../../api/model/commandeFournisseurDto';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ArticleDto,ConditionAVDto,UniteDto, ArticlesService, ClientDto, UnitsService,ClientsService, CommandeClientDto, CommandeClientsService,ConditionsDeVentesService, CommandeFournisseursService, FournisseurDto, FournisseursService, LigneCommandeClientDto, LigneCommandeFournisseurDto } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-add-commande-client',
  templateUrl: './add-commande-client.component.html',
  styleUrls: ['./add-commande-client.component.scss']
})
export class AddCommandeClientComponent {


  statut : any[] = ["EN_COURS","TERMINE"];
  responseMessage : any;

  comClientForm: any = FormGroup
  comClient: CommandeClientDto = {}
  comFournisseur: CommandeFournisseurDto = {}
  ligneComClient: LigneCommandeClientDto = {}
  ligneComFournisseur: LigneCommandeFournisseurDto = {}

  displayColumns : string [] = ["code","unite","quantite","prixUnitaire","action"];
  dataSource:any = [];

  lignesCommande: Array<any> = [];
  totalCommande = 0;
  totalLigneCommande = 0;
  articleNotYetSelected = false;

  codeArticle = '';
  quantite = '';
  codeCommande = '';

  dataClients : any [] = [];
  dataArticles : any [] = [];
  dataConditions : any [] = [];
  dataAllConditions : any [] = [];
  dataUnites : any [] = [];

  selectedClient: ClientDto = {}
  selectedFournisseur: FournisseurDto = {}
  selectedArticle: ArticleDto = {}
  selectedCondition: ConditionAVDto = {}
  selectedUnite: UniteDto = {}
  searchedArticle: ArticleDto = {};
  origin = ''

  uniqueArticles!: any[];

  constructor(
    private clientService:ClientsService,
    private fournisseurService:FournisseursService,
    private articleService: ArticlesService,
    private comClientService:CommandeClientsService,
    private comFournisseurService:CommandeFournisseursService,
    private conditionAV:ConditionsDeVentesService,
    private uniteService:UnitsService,
    // private ligneCommandeClients : Ligne
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbarService : SnackbarService,
     private ngxService: NgxUiLoaderService,private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.ngxService.start()
    this.activatedRoute.data.subscribe(data => {
      this.origin = data['origin'];
    });

    this.comClientForm = this.formBuilder.group({
      code :[null],
      clientDto :[null],
      ligneCommandeClients: this.formBuilder.group({
        article :[null,[Validators.required]],
        unite :[null,[Validators.required]],
        quantite :[null],
        prixUnitaire :[],
    })

    })
    this.ngxService.stop()
    if (this.origin == 'client'){
      this.getClients()

    }
    else if (this.origin == 'fournisseur'){
      this.getFournisseurs()
    }
    this.getArticles()
    this.getConditionAVs()
    this.getAllConditions()

    if (this.dataUnites.length > 0) {
      this.selectedUnite = this.dataUnites[0];
  }
  }


  generateCode(): string {
    const prefix = 'cmd-cli-';
    const randomDigits = Math.floor(Math.random() * 10000); // Génère un nombre aléatoire entre 0 et 9999
    const code = prefix + randomDigits;
    return code;
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

  getConditionAVs(){
    this.conditionAV.getAllConditionWithDistincts().subscribe((res:any)=>{
      this.dataConditions = res
      //this.uniqueArticles = this.getUniqueArticles(res);
      //this.dataConditions = this.uniqueArticles
      console.log(this.dataConditions)
      //console.log(this.uniqueArticles)
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

  getAllConditions(){
    this.conditionAV.getAllConditions().subscribe((res:any)=>{
      this.dataAllConditions = res
      //this.uniqueArticles = this.getUniqueArticles(res);
      //this.dataConditions = this.uniqueArticles
      console.log(this.dataConditions)
      //console.log(this.uniqueArticles)
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

  getUniqueArticles(data: any[]): any[] {
    const uniqueArticles = new Map();
    data.forEach(item => {
      if (!uniqueArticles.has(item.article.id)) {
        uniqueArticles.set(item.article.id, item.article);
      }
    });
    return Array.from(uniqueArticles.values());
  }

  onUniteSelected(selectedUnite: any) {

    const conditionWithSelectedUnite = this.dataAllConditions.find(condition => condition.unite.id === selectedUnite.id);
    if (conditionWithSelectedUnite) {
        this.comClientForm.get('ligneCommandeClients').get('prixUnitaire').setValue(conditionWithSelectedUnite.prixUnitaireTtc);
        this.selectedCondition = conditionWithSelectedUnite
    }
}

  getStatus(status:boolean){
    if(status === false){
     return "EN_COURS"
    }
    else {
     return "TERMINE"
    }
 }


 onAdd(){

   if(this.origin == 'client'){
      this.addClient()
   }
   else if (this.origin == 'fournisseur'){
    this.addFournisseur()
   }

 }

 private addClient(){
  var formData = this.comClientForm.value
   this.ligneComClient = {
    article : formData.ligneCommandeClients?.article,
    quantite: formData.ligneCommandeClients?.quantite,
    prixUnitaire: this.selectedCondition.prixUnitaireTtc,
   }


   this.comClient = {
    clientDto: this.comClientForm.value.clientDto,
    code: this.comClientForm.value.code,
    dateCommande: new Date().getTime().toString(),
    etat: 'EN_PREPARATION',
    ligneCommandeClients: this.lignesCommande
  };

  console.log("loggggg")
  console.log(this.comClient)

  this.comClientService.saveCommandeClients(this.comClient).subscribe((res)=>{
    this.snackbarService.openSnackbar("Commande client ajoutée avec success","success");
    this.router.navigate(['/workspace/dashboard/commandeClients']);
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

 private addFournisseur(){
  var formData = this.comClientForm.value
  this.ligneComFournisseur = {
    article : formData.ligneCommandeClients?.article,
   quantite: formData.ligneCommandeClients?.quantite,
   prixUnitaire: this.selectedCondition.prixUnitaireTtc,
  }

  console.log(this.ligneComFournisseur)


  this.comFournisseur = {
   fournisseurDto: this.comClientForm.value.clientDto,
   code: this.comClientForm.value.code,
   dateCommande: new Date().getTime().toString(),
   etatCommande: 'EN_PREPARATION',
   ligneCommandeFournisseurDtos: this.lignesCommande
 };

 console.log("this.comFournisseur")
 console.log(this.comFournisseur)

  this.comFournisseurService.saveCommandeFournisseurs(this.comFournisseur).subscribe((res)=>{
    this.snackbarService.openSnackbar("Commande fournisseur ajoutée avec success","success");
    this.router.navigate(['/workspace/dashboard/commandeFournisseurs'])
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


 private preparerCommande(): any {
    return  {
      clientDto: this.comClientForm.value.ClientDto,
      code: this.comClientForm.code,
      dateCommande: new Date().getTime(),
      etatCommande: 'EN_PREPARATION',
      ligneCommandeClients: this.ligneComClient
    };

}

  onChange(value:any) {
    console.log(value)
    this.uniteService.getAllUniteByArticle(value.article.id).subscribe(
      (res:any)=>{
         this.dataUnites = res
         console.log(this.dataUnites)

      },
      )

 }



 ajouterLigneCommande(): void {
  this.checkLigneCommande();
  this.calculerTotalCommande();

  this.searchedArticle = {};
  this.quantite = '';
  this.codeArticle = '';
  this.articleNotYetSelected = false;
  this.getArticles();
}

calculerTotalCommande(): void {
  this.totalCommande = 0;
  this.lignesCommande.forEach(ligne => {
    if (ligne.prixUnitaire && ligne.quantite) {
      this.totalCommande += +ligne.prixUnitaire * +ligne.quantite;
    }
  });
}

private checkLigneCommande(): void {
  var formData = this.comClientForm.value
  const ligneCmdAlreadyExists = this.lignesCommande.find(lig => lig.article?.codeArticle === this.selectedArticle.codeArticle);
  if (ligneCmdAlreadyExists) {
    console.log("existe *******")
    this.lignesCommande.forEach(lig => {
      console.log(lig)
      console.log(JSON.stringify(lig))
      console.log(lig && lig.article?.codeArticle === this.selectedArticle.codeArticle)
      if (lig && lig.article?.codeArticle === this.selectedArticle.codeArticle) {
        // @ts-ignore
        lig.quantite = lig.quantite +  +formData?.ligneCommandeClients?.quantite;
        console.log(lig.quantite)
      }
    });
  } else {
    const ligneCmd: LigneCommandeClientDto = {
      article: formData?.ligneCommandeClients?.article.article,
      unite: formData?.ligneCommandeClients?.article.unite.nom,
      prixUnitaire: this.selectedCondition?.prixUnitaireTtc,
      quantite: +formData?.ligneCommandeClients?.quantite
    };


    this.lignesCommande.push(ligneCmd);
    this.dataSource = new MatTableDataSource(this.lignesCommande)
    console.log("lignes commandes")
    console.log(this.lignesCommande)
    console.log(formData?.ligneCommandeClients?.article)
  }
}

handleDelete(el:any){
  const index = this.lignesCommande.indexOf(el);
if (index > -1) {
  this.lignesCommande.splice(index, 1);
  this.dataSource = new MatTableDataSource(this.lignesCommande);
  this.dataSource.data = this.lignesCommande;
  this.calculerTotalCommande()

}

}

}
