import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {  UniteDto, UnitsService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-unite',
  templateUrl: './unite.component.html',
  styleUrls: ['./unite.component.scss']
})
export class UniteComponent {




  onAdd= new EventEmitter();
  onUpdate= new EventEmitter();
  uniteForm:any = FormGroup;
  dialogAction : any = "Ajouter"
  action :any = "Ajouter";
  responseMessage:any;

  unite: UniteDto = {}

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder : FormBuilder,
  private uniteService:UnitsService,private dialogRef: MatDialogRef<UniteComponent>,private snackbarService: SnackbarService) { }

  ngOnInit(): void {

    this.uniteForm = this.formBuilder.group({
      nom :[null,[Validators.required]],
      designation :[null,[Validators.required]],
    })

    if(this.dialogData.action === "Modifier"){
      this.dialogAction = "Modifier"
      this.action = "Modifier"
      this.uniteForm.patchValue(this.dialogData.data)
    }
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
    var formData = this.uniteForm.value;

    this.unite = {
      nom : formData.nom,
      designation : formData.designation
    }

    this.uniteService.saveUnite(this.unite).subscribe((res:any)=>{
       this.dialogRef.close()
       this.onAdd.emit();
       this.responseMessage = res.message
       this.snackbarService.openSnackbar("Unité ajoutée avec success!","success")
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

    var formData = this.uniteForm.value;
    console.log(this.uniteForm.value)

    var data = {
      id : this.dialogData.data.id,
      nom : formData.nom,
      designation : formData.designation
    }

    console.log(data)

    this.uniteService.saveUnite(data).subscribe((res:any)=>{
       this.dialogRef.close()
       this.onUpdate.emit();
       this.responseMessage = res.message
       this.snackbarService.openSnackbar("Unité modifiée avec success !"+data.nom,"success")
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
