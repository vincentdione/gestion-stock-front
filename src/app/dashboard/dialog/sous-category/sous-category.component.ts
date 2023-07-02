import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoriesService, CategoryDto, SousCategoriesService, SousCategoryDto } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-sous-category',
  templateUrl: './sous-category.component.html',
  styleUrls: ['./sous-category.component.scss']
})
export class SousCategoryComponent {



  onAddSousCategory= new EventEmitter();
  onUpdateSousCategory= new EventEmitter();
  sousCategoryForm:any = FormGroup;
  dialogAction : any = "Ajouter"
  action :any = "Ajouter";
  responseMessage:any;

  sousCategory: SousCategoryDto = {}
  categories : CategoryDto [] = []
  category : CategoryDto  = {}

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder : FormBuilder,
  private sousCategoryService:SousCategoriesService,
  private categoryService: CategoriesService,
  private dialogRef: MatDialogRef<SousCategoryComponent>,
  private snackbarService: SnackbarService) { }

  ngOnInit(): void {

    this.sousCategoryForm = this.formBuilder.group({
      code :[null,[Validators.required]],
      designation :[null,[Validators.required]],
      category: [null,[Validators.required]]
    })

    if(this.dialogData.action === "Modifier"){
      this.dialogAction = "Modifier"
      this.action = "Modifier"
      this.sousCategoryForm.patchValue(this.dialogData.data)
      console.log("---------")
      console.log(this.dialogData.data)
      console.log(this.sousCategoryForm.value)
      console.log("---------")
    }

    this.getAllCategories()

  }


  getAllCategories(){
    this.categoryService.getAllCategorys().subscribe((res)=>{
       this.categories = res
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
    var formData = this.sousCategoryForm.value;

    this.category = formData.category

    this.sousCategory = {
      code : formData.code,
      designation : formData.designation,
      category : this.category
    }




    console.log("first")
    console.log( this.sousCategory)
    console.log("first")




    this.sousCategoryService.saveSousCategory(this.sousCategory).subscribe((res:any)=>{
       this.dialogRef.close()
       this.onAddSousCategory.emit();
       this.responseMessage = res.message
       this.snackbarService.openSnackbar("Sous catégorie ajoutée avec success","success")
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

    var formData = this.sousCategoryForm.value;
    console.log(this.sousCategoryForm.value)

    var data = {
      id : this.dialogData.data.id,
      code : formData.code,
      designation : formData.designation,
      category : formData.category,
    }

    console.log(data)

    this.sousCategoryService.saveSousCategory(data).subscribe((res:any)=>{
       this.dialogRef.close()
       this.onUpdateSousCategory.emit();
       this.responseMessage = res.message
       this.snackbarService.openSnackbar("Sous catégorie modifiée avec success","success")
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
