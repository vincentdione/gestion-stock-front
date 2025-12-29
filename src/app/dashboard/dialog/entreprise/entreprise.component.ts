import { Component, EventEmitter, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role, RoleLabel } from '../../models/role.enum';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EntrepriseDto, EntreprisesService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';
import { EntrepriseService } from 'src/app/services/entreprise.service';

@Component({
  selector: 'app-entreprise',
  templateUrl: './entreprise.component.html',
  styleUrls: ['./entreprise.component.scss']
})
export class EntrepriseComponent {

   onAddEntreprise= new EventEmitter();
    onUpdateEntreprise= new EventEmitter();
    entrepriseForm:any = FormGroup;
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
    private entrepriseService: EntreprisesService,
    private dialogRef: MatDialogRef<EntrepriseComponent>,
    private snackbarService: SnackbarService,
    private ngxService:NgxUiLoaderService) { }

    ngOnInit(): void {

      this.role = localStorage.getItem("role")
      this.role = JSON.parse(this.role)

      this.entrepriseForm = this.formBuilder.group({
        nom :[null,[Validators.required]],
        description :[null,[Validators.required]],
        codeFiscal :[null,[Validators.required]],
        email :[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
        numTel :[null,[Validators.required]],
        adresseDto: this.formBuilder.group({
          adresse1: [null],
          adresse2: [null],
          ville: [null],
          codePostal: [null],
          pays: [null],
        }),
        siteWeb :[null],
      })

      if(this.dialogData.action === "Modifier"){
        this.dialogAction = "Modifier"
        this.action = "Modifier"
        this.entrepriseForm.patchValue(this.dialogData.data)
      }
    }

    // SUPPRIMER la méthode onFileChange

    handleUserSubmit(){
      if(this.dialogAction === "Modifier"){
         this.edit()
      }
      else {
        console.log("add")
        this.add()
      }
    }

    add(): void {
      this.ngxService.start();

      const formData = this.entrepriseForm.value;

      const entreprisePayload: EntrepriseDto = {
        nom: formData.nom,
        description: formData.description,
        codeFiscal: formData.codeFiscal,
        email: formData.email,
        numTel: formData.numTel,
        siteWeb: formData.siteWeb,
        adresseDto: formData.adresseDto
      };

      // ENVOYER SANS LOGO - passer null ou undefined
      this.entrepriseService.saveEntreprise(entreprisePayload).subscribe(
        (res: any) => {
          this.ngxService.stop();
          this.dialogRef.close();
          this.onAddEntreprise.emit();
          this.snackbarService.openSnackbar("Entreprise ajoutée avec succès", "success");
        },
        (error) => {
          this.ngxService.stop();
          this.dialogRef.close();
          this.responseMessage = error.error?.message || GlobalConstants.genericErrorMessage;
          this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
        }
      );
    }

    edit() {
      const formData = this.entrepriseForm.value;

      const entreprisePayload: EntrepriseDto = {
        id: this.dialogData.data.id,
        nom: formData.nom,
        description: formData.description,
        codeFiscal: formData.codeFiscal,
        email: formData.email,
        numTel: formData.numTel,
        siteWeb: formData.siteWeb,
        adresseDto: formData.adresseDto
      };

      // ENVOYER SANS LOGO
      this.entrepriseService.saveEntreprise(entreprisePayload).subscribe(
        (res: any) => {
          this.dialogRef.close();
          this.onUpdateEntreprise.emit();
          this.responseMessage = "Entreprise modifiée avec succès";
          this.snackbarService.openSnackbar(this.responseMessage, "success");
        },
        (error) => {
          this.dialogRef.close();
          this.responseMessage = error.error?.message || GlobalConstants.genericErrorMessage;
          this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
        }
      );
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