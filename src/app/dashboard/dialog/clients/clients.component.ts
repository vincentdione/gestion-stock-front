import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdresseDto, ClientDto, ClientsService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {




  onAdd= new EventEmitter();
  onUpdate= new EventEmitter();
  clientForm:any = FormGroup;
  adresseForm:any = FormGroup;
  dialogAction : any = "Ajouter"
  action :any = "Ajouter";
  responseMessage:any;

  client: ClientDto = {}
  adresse: AdresseDto = {}

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder : FormBuilder,
  private clientService:ClientsService,private dialogRef: MatDialogRef<ClientsComponent>,private snackbarService: SnackbarService) { }

  ngOnInit(): void {

    this.clientForm = this.formBuilder.group({
      nom :[null,[Validators.required]],
      prenom :[null,[Validators.required]],
      email :[null,[Validators.required]],
      numTel :[null,[Validators.required]],
      adresse: this.formBuilder.group({
          adresse1 :[null,[Validators.required]],
          adresse2 :[null],
          ville :[null,[Validators.required]],
          codePostal :[null,[Validators.required]],
          pays :[null,[Validators.required]],
      })

    })

    if(this.dialogData.action === "Modifier"){
      this.dialogAction = "Modifier"
      this.action = "Modifier"
      console.log("--------------------")
      console.log(this.dialogData.data)
      console.log("--------------------")
      this.clientForm.patchValue(this.dialogData.data)

      console.log(this.clientForm.value)

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
    var formData = this.clientForm.value;

    var dataAdresse = {
          adresse1 :formData.adresseForm.adresse1,
          adresse2 :formData.adresseForm.adresse2,
          ville :formData.adresseForm.ville,
          codePostal :formData.adresseForm.codePostal,
          pays :formData.adresseForm.pays,
    }

    this.client = {
      nom :formData.nom,
      prenom :formData.prenom,
      email :formData.email,
      numTel :formData.numTel,
      adresse : dataAdresse
    }

    console.log(this.client)
    console.log(dataAdresse)

    this.clientService.saveClient(this.client).subscribe((res:any)=>{
       this.dialogRef.close()
       this.onAdd.emit();
       this.responseMessage = res.message
       this.snackbarService.openSnackbar("Client ajouté avec success","success")
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

    var formData = this.clientForm.value;
    console.log(this.clientForm.value)

    var dataAdresse = {
      adresse1 :formData.adresseForm.adresse1,
      adresse2 :formData.adresseForm.adresse2,
      ville :formData.adresseForm.ville,
      codePostal :formData.adresseForm.codePostal,
      pays :formData.adresseForm.pays,
}

    var data = {
      id : this.dialogData.data.id,
      nom :formData.nom,
      prenom :formData.prenom,
      email :formData.email,
      numTel :formData.numTel,
      adresse : dataAdresse
    }

    console.log(data)

    this.clientService.saveClient(data).subscribe((res:any)=>{
       this.dialogRef.close()
       this.onUpdate.emit();
       this.responseMessage = res.message
       this.snackbarService.openSnackbar("Client modifié avec success !"+data.nom,"success")
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
