import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdresseDto, FournisseurDto, FournisseursService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-fournisseurs',
  templateUrl: './fournisseurs.component.html',
  styleUrls: ['./fournisseurs.component.scss']
})
export class FournisseursComponent {

  onAdd= new EventEmitter();
  onUpdate= new EventEmitter();
  fournisseurForm:any = FormGroup;
  adresseForm:any = FormGroup;
  dialogAction : any = "Ajouter"
  action :any = "Ajouter";
  responseMessage:any;

  fournisseur: FournisseurDto = {}
  adresseDto: AdresseDto = {}

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder : FormBuilder,
  private fournisseurService:FournisseursService,private dialogRef: MatDialogRef<FournisseursComponent>,private snackbarService: SnackbarService) { }

  ngOnInit(): void {

    this.fournisseurForm = this.formBuilder.group({
      nom :[null,[Validators.required]],
      prenom :[null,[Validators.required]],
      email :[null,[Validators.required]],
      numTel :[null,[Validators.required]],
      adresseDto: this.formBuilder.group({
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
      this.fournisseurForm.patchValue(this.dialogData.data)

      console.log(this.fournisseurForm.value)

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
    var formData = this.fournisseurForm.value;

    var dataAdresse = {
          adresse1 :formData.adresseDto.adresse1,
          adresse2 :formData.adresseDto.adresse2,
          ville :formData.adresseDto.ville,
          codePostal :formData.adresseDto.codePostal,
          pays :formData.adresseDto.pays,
    }

    this.fournisseur = {
      nom :formData.nom,
      prenom :formData.prenom,
      email :formData.email,
      numTel :formData.numTel,
      adresseDto : dataAdresse
    }

    console.log(this.fournisseur)
    console.log(dataAdresse)

    this.fournisseurService.saveFournisseur(this.fournisseur).subscribe((res:any)=>{
       this.dialogRef.close()
       this.onAdd.emit();
       this.responseMessage = res.message
       this.snackbarService.openSnackbar("fournisseur ajouté avec success","success")
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

    var formData = this.fournisseurForm.value;
    console.log(this.fournisseurForm.value)

    var dataAdresse = {
      adresse1 :formData.adresseDto.adresse1,
      adresse2 :formData.adresseDto.adresse2,
      ville :formData.adresseDto.ville,
      codePostal :formData.adresseDto.codePostal,
      pays :formData.adresseDto.pays,
}

    var data = {
      id : this.dialogData.data.id,
      nom :formData.nom,
      prenom :formData.prenom,
      email :formData.email,
      numTel :formData.numTel,
      adresseDto : dataAdresse
    }

    console.log(data)

    this.fournisseurService.saveFournisseur(data).subscribe((res:any)=>{
       this.dialogRef.close()
       this.onUpdate.emit();
       this.responseMessage = res.message
       this.snackbarService.openSnackbar("fournisseur modifié avec success !"+data.nom,"success")
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
