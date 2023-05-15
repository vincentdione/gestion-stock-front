import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {  UtilisateurDto, UtilisateursService } from 'src/app/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  userId : any
  user : UtilisateurDto ={}
  constructor(private router: Router, private dialog : MatDialog,private userService:UtilisateursService) {

  }

  logout(){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.data = {
      message : 'vous déconnecter'
    };
    // const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    // const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((user)=>{
    //   dialogRef.close();
    //   localStorage.clear();
    //   this.router.navigate(['/'])
    // })
  }

  changePassword(){
    const dialogConfig = new MatDialogConfig()
    dialogConfig.width = "550px"
    // const dialogRef = this.dialog.open(ChangePasswordComponent,dialogConfig);
  }

}
