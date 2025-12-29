import { Component, EventEmitter, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthentificationService, EntreprisesService, UtilisateursEntreprisesService } from 'src/app/api';

import { SnackbarService } from './../../../services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';
import { Role, RoleLabel } from '../../models/role.enum';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  onAddUser= new EventEmitter();
  onUpdateUser= new EventEmitter();
  userForm:any = FormGroup;
  dialogAction : any = "Ajouter"
  action :any = "Ajouter";
  responseMessage:any;
  userRoles : any [] = [];
  hospitals : any [] = [];
  onRole : any
  role : any
  roles = Object.values(Role);         // ['USER', 'LIVREUR', 'ADMIN', 'MANAGER']
  roleLabels = RoleLabel;

  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any,
  private formBuilder : FormBuilder,
  private utilisateurService:UtilisateursEntreprisesService,private entrepriseService: EntreprisesService, private authenticationService: AuthentificationService,
  private dialogRef: MatDialogRef<UserComponent>,private snackbarService: SnackbarService,private ngxService:NgxUiLoaderService) { }

  ngOnInit(): void {

    this.role = localStorage.getItem("role")
    this.role = JSON.parse(this.role)


    this.userForm = this.formBuilder.group({
      nom :[null,[Validators.required]],
      prenom :[null,[Validators.required]],
      username :[null,[Validators.required]],
      email :[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      password :[null,[Validators.required]],
      roles :[null],
    })

    if(this.dialogData.action === "Modifier"){
      this.dialogAction = "Modifier"
      this.action = "Modifier"
      this.userForm.patchValue(this.dialogData.data)
    }

  }






  handleUserSubmit(){

    if(this.dialogAction === "Modifier"){
       this.edit()
    }
    else {
      console.log("add")
      this.add()
    }

  }

  add(){

    this.ngxService.start()
    var formData = this.userForm.value;

    var data = {
      nom :formData.nom,
      prenom :formData.prenom,
      username :formData.username,
      email :formData.email,
      password :formData.password,
      role : formData.roles,
    }

    this.utilisateurService.saveUser1(data).subscribe((res:any)=>{
      this.ngxService.stop()
       this.dialogRef.close()
       this.onAddUser.emit();
       this.responseMessage = res.message
       this.snackbarService.openSnackbar("utilisateur ajouté avec success","success")

    },(error)=>{
      this.ngxService.stop()
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

    var formData = this.userForm.value;
    var data = {
      id : this.dialogData.data.id,
      nom :formData.nom,
      prenom :formData.prenom,
      username :formData.username,
      email :formData.email,
      role : formData.roles,
      password: formData.password,
    }

    console.log("Update user")
    console.log(data)


    this.utilisateurService.saveUser1(data).subscribe((res:any)=>{
       this.dialogRef.close()
       this.onUpdateUser.emit();
       this.responseMessage = res.message
       this.snackbarService.openSnackbar(this.responseMessage,"success")
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

  onChange(value:any) {
    /*  this.radioForm.addControl('hop_prix',[value.hop])
     this.radioForm.controls['hopitalId'].id.setValue(value.id)
     this.radioForm.controls['hopitalId'].id.setValue(value.id) */
    //  this.utilisateurService.getOneRole(value).subscribe((res:any) => {
    //      console.log(res)
    //  },(error)=>{
    //    console.log("error"+error)
    //  })
 }


}
