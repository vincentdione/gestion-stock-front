import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import jwt_decode from 'jwt-decode'
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGardService {

  constructor(public authService: UserService,public router: Router) { }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Vérifier si l'utilisateur est authentifié
    const isLoggedIn = this.authService.isUserLoggedAndAccessTokenValid();
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return false;
    }

    // Récupérer le rôle attendu depuis la route
    const expectedRoles = route.data['expectedRole'] as Array<string>;
    console.log('Rôles attendus:', expectedRoles);

    // Récupérer les rôles de l'utilisateur depuis localStorage
    const storedUser = localStorage.getItem('user');
    let userRoles: Array<string> = [];

    if (storedUser) {
      const user = JSON.parse(storedUser);
      userRoles = user.roles || [];  // Assurez-vous que `roles` est bien un tableau
    }
    console.log('Rôles de l\'utilisateur:', userRoles);

    // Vérifier si au moins un des rôles de l'utilisateur est dans la liste des rôles attendus
    const hasRole = userRoles.some(role => expectedRoles.includes(role));

    if (hasRole) {
      return true;
    }

    // Rediriger vers la page de login si le rôle n'est pas autorisé
    this.router.navigate(['/login']);
    return false;
  }


  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

  //   return this.authService.isUserLoggedAndAccessTokenValid();
  // }



//   canActivate(route: ActivatedRouteSnapshot):boolean {
//     let expectRoleArray = route.data
//     expectRoleArray = expectRoleArray['expectedRole'];


//     console.log("expectRoleArray"+expectRoleArray)

//     const token : any = localStorage.getItem("user");
//     var tokenPayload : any;
//     try {
//       console.log("token"+token)
//       console.log(jwt_decode(token))
//       tokenPayload = jwt_decode(token)
//       console.log("tokenPayload"+JSON.stringify(tokenPayload))
//     } catch (error) {
//       localStorage.clear();
//       console.log("clear token")
//       this.router.navigate(["/"])
//     }

//     let checkRole = false;
//         if(expectRoleArray == tokenPayload.role){
//           checkRole = true;
//         }

//   console.log("tokenPayload"+tokenPayload)
//   // if(tokenPayload.role[0] == ["ROLE_MANAGER"] || tokenPayload.role[0] == ["ROLE_ADMIN"]){
//     if(this.authService.isAuthencated() && checkRole ){
//       return true;
//     }
//     //this.snackbarService.openSnackbar(GlobalConstants.unauthorized,GlobalConstants.error);
//     this.router.navigate(['/workspace/dashboard']);
//     return false;
//   // }
//   // else {
//   //   this.router.navigate(["/"]);
//   //   console.log("clear 2222 222")
//   //   localStorage.clear();
//   //   return false;
//   // }
// }
}
