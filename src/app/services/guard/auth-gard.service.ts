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

    return this.authService.isUserLoggedAndAccessTokenValid();
  }

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
