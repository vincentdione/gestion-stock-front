import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UtilisateursEntreprisesService } from 'src/app/api';

import { SnackbarService } from './../../../services/snackbar.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm : any = FormGroup
  responseMessage : any ;

  constructor(private formBuilder : FormBuilder,private router: Router,
    private userService : UtilisateursEntreprisesService,
    private snackbarService : SnackbarService,
    private dialogRef : MatDialogRef<ChangePasswordComponent>, private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {

    this.changePasswordForm = this.formBuilder.group({
      oldPassword : [null,[Validators.required]],
      newPassword : [null,[Validators.required]],
      confirmPassword : [null,[Validators.required]],
    })
  }

  validateSubmit(){
    if(this.changePasswordForm.controls['newPassword'].value !== this.changePasswordForm.controls['confirmPassword'].value){
      return true;
    }
    else {
      return false;
    }
  }
  handleChangePasswordSubmit(){
    this.ngxService.start();
    var formData = this.changePasswordForm.value;
    var data = {
      olPassword : formData.olPassword,
      newPassword : formData.newPassword,
      confirmPassword : formData.confirmPassword,
    }

  //   this.userService.changePassword(data).subscribe((res:any) => {
  //     this.ngxService.stop();
  //     this.dialogRef.close();
  //     console.log(res)
  //     this.responseMessage = res?.message
  //     this.snackbarService.openSnackbar(this.responseMessage,"success")
  // },(error)=>{
  //   this.ngxService.stop();
  //   if(error.error?.message){
  //       this.responseMessage = error.error?.message
  //   }
  //   else {
  //     this.responseMessage = GlobalConstants.genericErrorMessage
  //   }
  //   this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
  // })

  }

}
