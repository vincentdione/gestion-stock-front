import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoriesService, CategoryDto } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {



  onAddCategory= new EventEmitter();
  onUpdateCategory= new EventEmitter();
  categoryForm:any = FormGroup;
  dialogAction : any = "Ajouter"
  action :any = "Ajouter";
  responseMessage:any;

  category: CategoryDto = {}

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder : FormBuilder,
  private categoryService:CategoriesService,private dialogRef: MatDialogRef<CategoryComponent>,private snackbarService: SnackbarService) { }

  ngOnInit(): void {

    this.categoryForm = this.formBuilder.group({
      code :[null,[Validators.required]],
      designation :[null,[Validators.required]],
    })

    if(this.dialogData.action === "Modifier"){
      this.dialogAction = "Modifier"
      this.action = "Modifier"
      this.categoryForm.patchValue(this.dialogData.data)
    }
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
    var formData = this.categoryForm.value;

    this.category = {
      code : formData.code,
      designation : formData.designation
    }

    this.categoryService.saveCategory(this.category).subscribe((res:any)=>{
       this.dialogRef.close()
       this.onAddCategory.emit();
       this.responseMessage = res.message
       this.snackbarService.openSnackbar("Catégorie ajoutée avec success!","success")
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

    var formData = this.categoryForm.value;
    console.log(this.categoryForm.value)

    var data = {
      id : this.dialogData.data.id,
      code : formData.code,
      designation : formData.designation
    }

    console.log(data)

    this.categoryService.saveCategory(data).subscribe((res:any)=>{
       this.dialogRef.close()
       this.onUpdateCategory.emit();
       this.responseMessage = res.message
       this.snackbarService.openSnackbar("Catégorie modifiée avec success !"+data.code,"success")
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
