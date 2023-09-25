import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ArticleDto, ArticlesService, ConditionAVDto, ConditionsDeVentesService, LigneVenteDto, ModePayementDto, ModesPayementService, UniteDto, UnitsService, VenteDto, VentesService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ModePayementApiService } from 'src/app/api/api/modePayementApi.service';

@Component({
  selector: 'app-manage-ventes',
  templateUrl: './manage-ventes.component.html',
  styleUrls: ['./manage-ventes.component.scss']
})
export class ManageVentesComponent {

  displayColumns : string[] = ["code","dateVente","commentaire","action"]
  dataSource : any;
  dataVenteSource : any
  responseMessage : any;
  totalCommande = 0;

  comVenteForm: any = FormGroup
  comVente: VenteDto = {}
  lignes: LigneVenteDto = {}

  displayColumnVentes : string [] = ["code","unite","quantite","prixUnitaire","action"];
  dataSourceLigneVente:any = [];

  lignesCommande: Array<any> = [];

  dataArticles : any [] = [];
  dataModePayement : ModePayementDto [] = [];
  dataVentes : any [] = [];
  dataConditions : any [] = [];
  dataAllConditions : any [] = [];
  dataUnites : any [] = [];
  selectedArticle: ArticleDto = {};
  selectedCondition: ConditionAVDto = {}
  selectedUnite: UniteDto = {}

  codeArticle = '';
  quantite = '';
  codeCommande = '';
  totalLigneCommande = 0;
  articleNotYetSelected = false;

  constructor(private venteService: VentesService,
    private articleService: ArticlesService,
    private ngxService:NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private conditionAV:ConditionsDeVentesService,
    private uniteService:UnitsService,
    private modePayementService: ModesPayementService,
    private router:Router, private dialog : MatDialog) { }



  ngOnInit(): void {
    this.ngxService.start()
    this.tableData()

    this.comVenteForm = this.formBuilder.group({
     // code :[null],
      mode:[null],
      ligneVentes: this.formBuilder.group({
        article :[null,[Validators.required]],
        quantite :[null],
        unite :[null],
        prixUnitaire :[this.selectedArticle?.prixUnitaireTtc],
    })
  })

  this.getArticles()
  this.getConditionAVs()
  this.getAllConditions()
  this.getAllModePayement()
  }

  getAllModePayement(){
    this.modePayementService.getAllModes().subscribe((res:any)=>{
      this.dataModePayement = res
      console.log(res)
      console.log("modePayement")
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

  onChange(value:any) {
    console.log(value)
    this.uniteService.getAllUniteByArticle(value.article.id).subscribe(
      (res:any)=>{
         this.dataUnites = res
         console.log(this.dataUnites)

      },
      )

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
        this.comVenteForm.get('ligneVentes').get('prixUnitaire').setValue(conditionWithSelectedUnite.prixUnitaireTtc);
        this.selectedCondition = conditionWithSelectedUnite
    }
}


  tableData(){
      this.venteService.getAllVentes().subscribe((res:any) => {
         this.ngxService.stop()
         this.dataSource = new MatTableDataSource(res)
         this.dataVentes = res
         console.log(res)

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

      var formData = this.comVenteForm.value
   this.lignes = {
    article : formData.ligneVentes?.article,
    quantite: formData.ligneVentes?.quantite,
    prixUnitaire: this.selectedArticle.prixUnitaireTtc,
   }

   this.comVente = {
    //code: formData.code,
    modePayement: formData.mode,
    dateVente: new Date().getTime().toString(),
    ligneVentes: this.lignesCommande
  };

  console.log(this.comVente)

  this.venteService.saveVente(this.comVente).subscribe((res)=>{
    this.snackbarService.openSnackbar("Article vendu avec success","success");
    this.tableData()
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

    handleEdit(values:any){

    }

    handleDelete(values:any){

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        message:"supprimer la vente "+values.code
      }
      const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
      const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res)=>{
         this.ngxService.start();
         this.delete(values.id)
         dialogRef.close();

      })

    }

    delete(id:any){

      this.venteService.deleteVente(id).subscribe((res:any)=>{
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



    addLigneVente(): void {
  this.checkLigneCommande();
  this.calculerTotalCommande();

  this.quantite = '';
  this.codeArticle = '';
  this.articleNotYetSelected = false;
  this.getArticles();
  console.log(this.lignesCommande)

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
  var formData = this.comVenteForm.value
  const ligneCmdAlreadyExists = this.lignesCommande.find(lig => lig.article?.codeArticle === this.selectedArticle.codeArticle);
  if (ligneCmdAlreadyExists) {
    this.lignesCommande.forEach(lig => {
      console.log(lig)
      console.log(JSON.stringify(lig))
      console.log(lig && lig.article?.codeArticle === this.selectedArticle.codeArticle)
      if (lig && lig.article?.codeArticle === this.selectedArticle.codeArticle) {
        // @ts-ignore
        lig.quantite = lig.quantite +  +formData?.ligneVentes?.quantite;
        console.log(lig.quantite)
      }
    });
  } else {
    const ligneCmd: LigneVenteDto = {
      article: formData?.ligneVentes?.article.article,
      unite: this.selectedCondition.unite?.nom,
      prixUnitaire: this.selectedCondition?.prixUnitaireTtc,
      quantite: +formData?.ligneVentes?.quantite
    };


    this.lignesCommande.push(ligneCmd);
    this.dataVenteSource = new MatTableDataSource(this.lignesCommande)
    console.log("lignes commandes")
    console.log(this.lignesCommande)
    console.log(this.dataVenteSource)
  }
}


handleDetails(el:any){

}


}
