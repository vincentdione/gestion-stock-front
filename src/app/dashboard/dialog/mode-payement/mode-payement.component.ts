import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModePayementDto, ModesPayementService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-mode-payement',
  templateUrl: './mode-payement.component.html',
  styleUrls: ['./mode-payement.component.scss']
})
export class ModePayementComponent {




  onAdd= new EventEmitter();
  onUpdate= new EventEmitter();
  modePayementForm:any = FormGroup;
  dialogAction : any = "Ajouter"
  action :any = "Ajouter";
  responseMessage:any;

  modePayement: ModePayementDto = {}

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder : FormBuilder,
  private modePayementService:ModesPayementService,private dialogRef: MatDialogRef<ModePayementComponent>,private snackbarService: SnackbarService) { }

  ngOnInit(): void {

    this.modePayementForm = this.formBuilder.group({
      code :[null,[Validators.required]],
      designation :[null,[Validators.required]],
    })

    if(this.dialogData.action === "Modifier"){
      this.dialogAction = "Modifier"
      this.action = "Modifier"
      this.modePayementForm.patchValue(this.dialogData.data)
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
    var formData = this.modePayementForm.value;

    this.modePayement = {
      code : formData.code,
      designation : formData.designation
    }

    this.modePayementService.saveMode(this.modePayement).subscribe((res:any)=>{
       this.dialogRef.close()
       this.onAdd.emit();
       this.responseMessage = res.message
       this.snackbarService.openSnackbar("Mode de payement ajouté avec success!","success")
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

    var formData = this.modePayementForm.value;
    console.log(this.modePayementForm.value)

    var data = {
      id : this.dialogData.data.id,
      code : formData.code,
      designation : formData.designation
    }

    console.log(data)

    this.modePayementService.saveMode(data).subscribe((res:any)=>{
       this.dialogRef.close()
       this.onUpdate.emit();
       this.responseMessage = res.message
       this.snackbarService.openSnackbar("Mode de payement modifié avec success !"+data.code,"success")
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
