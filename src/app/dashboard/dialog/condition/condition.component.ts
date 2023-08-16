import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ArticleDto, ArticlesService, ConditionAVDto, ConditionsDeVentesService, UniteDto, UnitsService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss']
})
export class ConditionComponent {




  onAdd= new EventEmitter();
  onUpdate= new EventEmitter();
  conditionForm:any = FormGroup;
  dialogAction : any = "Ajouter"
  action :any = "Ajouter";
  responseMessage:any;

  listeUnites: Array<UniteDto> = []
  listeArticles: Array<ArticleDto> = []

  condition: ConditionAVDto = {}
  selectedArticle: ArticleDto = {}


  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder : FormBuilder,
  private conditionService:ConditionsDeVentesService,
  private uniteService:UnitsService,
  private articleService:ArticlesService,
  private dialogRef: MatDialogRef<ConditionComponent>,
  private snackbarService: SnackbarService) { }

  ngOnInit(): void {

    this.conditionForm = this.formBuilder.group({
      article :[null,[Validators.required]],
      unite :[null,[Validators.required]],
      // quantity :[null,[Validators.required]],
      price :[this.selectedArticle?.prixUnitaireTtc],
    })

    if(this.dialogData.action === "Modifier"){
      this.dialogAction = "Modifier"
      this.action = "Modifier"
      this.conditionForm.patchValue(this.dialogData.data)
    }

    this.getAllUnites()
    this.getAllArticles()

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

  getAllArticles(){
    this.articleService.getAllArticles().subscribe((res)=>{
       this.listeArticles = res
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

  handleSubmit(){

    if(this.dialogAction === "Modifier"){
       this.edit()
    }
    else {
      this.add()
    }

  }

  add(){
    var formData = this.conditionForm.value;

    this.condition = {
      article : formData.article,
      unite : formData.unite,
      price : formData.price,
      // quantity : formData.quantity,
    }

    this.conditionService.saveCondition(this.condition).subscribe((res:any)=>{
       this.dialogRef.close()
       this.onAdd.emit();
       this.responseMessage = res.message
       this.snackbarService.openSnackbar("Condition ajoutée avec success!","success")
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

    var formData = this.conditionForm.value;
    console.log(this.conditionForm.value)

    var data = {
      id : this.dialogData.data.id,
      article : formData.article,
      unite : formData.unite,
      price : this.selectedArticle?.prixUnitaireTtc,
      // quantity : formData.quantity,
    }

    console.log(data)

    this.conditionService.saveCondition(data).subscribe((res:any)=>{
       this.dialogRef.close()
       this.onUpdate.emit();
       this.responseMessage = res.message
       this.snackbarService.openSnackbar("Condition modifiée avec success !"+data?.article.codeArticle,"success")
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
