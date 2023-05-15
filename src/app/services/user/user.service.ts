import { AuthenticationResponse } from './../../api/model/authenticationResponse';
import { AuthenticationRequest } from './../../api/model/authenticationRequest';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {  AuthentificationService, UtilisateurDto, UtilisateursService } from 'src/app/api';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private authenticationService: AuthentificationService,
    private utilisateurService: UtilisateursService,
    private router:Router) { }


  login(authenticationRequest:AuthenticationRequest){

    return this.authenticationService.authenticate(authenticationRequest);

  }




  register(authenticationRequest:AuthenticationRequest):Observable<AuthenticationResponse>{
    return this.authenticationService.register(authenticationRequest);
  }


  public isAuthencated():boolean{
    const token = localStorage.getItem("accessToken");
    if(!token){
      this.router.navigate(['/login']);
      return false;
    }
    else {
      this.router.navigate(['/workspace/dashboard'])
      return true;
    }
  }

  getUserByUsername(username?: string): Observable<UtilisateurDto> {
    if (username !== undefined) {
      console.log('====================================');
      console.log(username);
      console.log('====================================');
      return this.utilisateurService.findByUsername(username);
    }
    return of();
  }

  setAccessToken(authenticationResponse: AuthenticationResponse): void {
    localStorage.setItem('accessToken', JSON.stringify(authenticationResponse));
  }

  setRefreshToken(authenticationResponse: AuthenticationResponse): void {
    localStorage.setItem('refreshToken', JSON.stringify(authenticationResponse));
  }

  refreshToken(){
    var authenticationResponse = JSON.parse(
      localStorage.getItem('refreshToken') as string
    );
      return this.authenticationService.refreshToken(authenticationResponse?.refresh_token).subscribe((res=>{
          console.log("Refresh OKIIIIIIIIIIIIIIIII")
      }),(error=>{
        console.log("Erreur lors la récuperation du refresh Token");
      }))
  }

  logout(){

  }


  setConnectedUser(utilisateur: UtilisateurDto): void {
    localStorage.setItem('user', JSON.stringify(utilisateur));
  }

  getConnectedUser(): UtilisateurDto {
    if (localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user') as string);
    }
    return {};
  }

  isUserLoggedAndAccessTokenValid(): boolean {
    if (localStorage.getItem('accessToken')) {
      // TODO il faut verifier si le access token est valid
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }

}
