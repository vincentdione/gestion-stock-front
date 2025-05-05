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
      return this.utilisateurService.findByUsername(username);
    }
    return of();
  }

  setAccessToken(authenticationResponse: AuthenticationResponse): void {
    if (authenticationResponse.access_token) {
      localStorage.setItem('accessToken', authenticationResponse.access_token);
    } else {
      console.error('Access token est undefined dans la réponse');
    }
  }

  setRefreshToken(authenticationResponse: AuthenticationResponse): void {
    if (authenticationResponse.refresh_token) {
      localStorage.setItem('refreshToken', authenticationResponse.refresh_token);
    } else {
      console.error('Refresh token est undefined dans la réponse');
    }
  }


  refreshToken(){
    var authenticationResponse = JSON.parse(
      localStorage.getItem('refreshToken') as string
    );
      return this.authenticationService.refreshToken(authenticationResponse?.refresh_token).subscribe((res=>{
      }),(error=>{
        console.log("Erreur lors la récuperation du refresh Token");
      }))
  }

  logout(){
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }


  setConnectedUser(utilisateur: UtilisateurDto): void {
    localStorage.setItem('user', JSON.stringify(utilisateur));
  }

  getConnectedUser(): UtilisateurDto {
    if (localStorage.getItem('user')) {
      console.log(JSON.parse(localStorage.getItem('user') as string));
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


  getEntrepriseName(): string | null {
    const storedData = localStorage.getItem('user');  // Récupérer la chaîne JSON
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);  // Convertir la chaîne JSON en objet
        return parsedData?.entrepriseNom || null;  // Récupérer l'attribut 'entrepriseNom' ou null si absent
      } catch (error) {
        console.error('Erreur de parsing du JSON', error);
        return null;
      }
    }
    return null;  // Si aucune donnée n'est trouvée
  }
}
