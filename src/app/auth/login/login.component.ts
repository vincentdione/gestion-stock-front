import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthenticationRequest } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { UserService } from 'src/app/services/user/user.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: any = FormGroup;
  responseMessage : any;

  authenticationRequest : AuthenticationRequest = {}


  constructor(private formBuilder : FormBuilder,private router: Router,
    private userService : UserService,
    private snackbarService : SnackbarService,
    private ngxService: NgxUiLoaderService) { }

  ngOnInit(): void {

    this.loginForm = this.formBuilder.group({
      username : [null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      password : [null,[Validators.required]]
    })

    this.userService.isAuthencated()

  }


  handleSubmit(){
    this.ngxService.start();
    var formData = this.loginForm.value;
    this.authenticationRequest = {
      username : formData.username,
      password : formData.password
    }

    this.userService.login(this.authenticationRequest).subscribe((res:any) => {
        this.ngxService.stop();
        const accessToken = res?.access_token;
        console.log("res ==== "+JSON.stringify(res));
        if (accessToken) {
          this.userService.setAccessToken(res?.access_token)
          this.userService.setRefreshToken(res?.refresh_token)
          this.userService.setConnectedUser(res)
          this.responseMessage = res?.message
          this.snackbarService.openSnackbar("Bienvenue dans votre gestion de stock!!!","Bienvenue dans votre gestion de stock!!!")
          this.router.navigate(["/workspace/dashboard"])
          console.log("navigate   /workspace/dashboard")

          //this.getUserByUsername()
          //localStorage.setItem('access_token', accessToken);
        }
        // localStorage.setItem("token",JSON.stringify(res))
        // localStorage.setItem("role",JSON.stringify(res?.role[0]))
        // localStorage.setItem("userId",JSON.stringify(res?.user?.id))
        // console.log(res)
        // console.log(res?.token)
        // console.log(res?.role[0])
        // console.log(res?.user?.id)

        //this.router.navigate(['']);


    },(error:any)=>{
      this.ngxService.stop();
      console.log(error)
      if(error.error?.message){
          this.responseMessage = error.error?.message
      }
      else {
        this.responseMessage = GlobalConstants.genericErrorMessage
      }
      this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
    })

  }

  getUserByUsername(): void {
    console.log("---------------------------")
    this.userService.getUserByUsername(this.authenticationRequest?.username)
    .subscribe(user => {
      console.log("---------------------------")
      console.log(user)
      console.log("---------------------------")
      this.userService.setConnectedUser(user);
    },(error:any)=>{
      console.log(error)
    });
  }

}
