import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ArticleDto, ArticlesService, SousCategoriesService, SousCategoryDto, UniteDto, UnitsService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent {


  onAdd= new EventEmitter();
  onUpdate= new EventEmitter();
  articleForm:any = FormGroup;
  dialogAction : any = "Ajouter"
  action :any = "Ajouter";
  responseMessage:any;

  article:ArticleDto = {}

  souscategory: SousCategoryDto = {}
  listeSousCategories: Array<SousCategoryDto> = []
  listeUnites: Array<UniteDto> = []

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder : FormBuilder,
  private articleService:ArticlesService,
  private uniteService:UnitsService,
  private sousCategorieService: SousCategoriesService,
  private dialogRef: MatDialogRef<ArticleComponent>,private snackbarService: SnackbarService) { }

  ngOnInit(): void {

    this.articleForm = this.formBuilder.group({
      codeArticle :[null,[Validators.required]],
      designation :[null,[Validators.required]],
      prixUnitaireHt :[null,[Validators.required]],
      tauxTval :[null,[Validators.required]],
      prixUnitaireTtc :[null],
      sous_Category :[null,[Validators.required,]],
      // unite :[null,[Validators.required,]],
    })

    if(this.dialogData.action === "Modifier"){
      this.dialogAction = "Modifier"
      this.action = "Modifier"
      this.articleForm.patchValue(this.dialogData.data)
    }

    this.articleForm.controls['prixUnitaireHt']?.valueChanges.subscribe(() => {
      this.calculerTTC();
    });

    this.articleForm.controls['tauxTval']?.valueChanges.subscribe(() => {
      this.calculerTTC();
    });

    this.getAllSousCategories()
    this.getAllUnites()

  }


  getAllSousCategories(){
    this.sousCategorieService.getAllSousCategorys().subscribe((res)=>{
       this.listeSousCategories = res
    },(error=>{
      if(error.error?.message){
        this.responseMessage = error.error?.message
        console.log(this.responseMessage)
    }
    else {
      this.responseMessage = GlobalConstants.genericErrorMessage
      console.log(this.responseMessage)
    }
    }))
  }

  getAllUnites(){
    this.uniteService.getAllUnites().subscribe((res)=>{
       this.listeUnites = res
    },(error=>{
      if(error.error?.message){
        this.responseMessage = error.error?.message
        console.log(this.responseMessage)
    }
    else {
      this.responseMessage = GlobalConstants.genericErrorMessage
      console.log(this.responseMessage)
    }
    }))
  }

  handleCategorySubmit(){

    if(this.dialogAction === "Modifier"){
       this.edit()
    }
    else {
      this.add()
    }

  }

  add(){
    var formData = this.articleForm.value;

    this.article = {
      codeArticle : formData.codeArticle,
      designation : formData.designation,
      prixUnitaireHt :formData.prixUnitaireHt,
      tauxTval :formData.tauxTval,
      prixUnitaireTtc :formData.prixUnitaireTtc,
      sousCategoryDto :formData.sous_Category,
    }

    this.articleService.saveArticle(this.article).subscribe((res:any)=>{
       this.dialogRef.close()
       this.onAdd.emit();
       this.responseMessage = res.message
       this.snackbarService.openSnackbar(this.article?.codeArticle+ "Modifié avec success","success")
    },(error)=>{
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

  edit(){

    var formData = this.articleForm.value;
    console.log(this.articleForm.value)

    var data = {
      id : this.dialogData.data.id,
      codeArticle : formData.codeArticle,
      designation : formData.designation,
      prixUnitaireHt :formData.prixUnitaireHt,
      tauxTval :formData.tauxTval,
      prixUnitaireTtc :formData.prixUnitaireTtc,
      sousCategoryDto :formData.sous_Category,
      unite :formData.unite,
    }

    console.log(data)

    this.articleService.saveArticle(data).subscribe((res:any)=>{
       this.dialogRef.close()
       this.onUpdate.emit();
       this.responseMessage = res.message
       this.snackbarService.openSnackbar("Article Modifié avec success","success")
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


  calculerTTC(): void {

    if (this.articleForm.get('prixUnitaireHt')?.value &&  this.articleForm.get('tauxTval')?.value) {
      const prix = this.articleForm.get('prixUnitaireHt')?.value;
      const taux = this.articleForm.get('tauxTval')?.value;
      //const resultat = prix * taux / 100;
      const resultat = +prix + (+(prix * (taux / 100)));
      this.articleForm.controls['prixUnitaireTtc'].setValue(resultat);

      // this.articleForm.patchValue({prixUnitaireTtc: resultat})

    }

  }


}
