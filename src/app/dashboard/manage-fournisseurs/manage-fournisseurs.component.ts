import { Component } from '@angular/core';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FournisseursComponent } from '../dialog/fournisseurs/fournisseurs.component';
import { MatTableDataSource } from '@angular/material/table';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FournisseursService } from 'src/app/api';

@Component({
  selector: 'app-manage-fournisseurs',
  templateUrl: './manage-fournisseurs.component.html',
  styleUrls: ['./manage-fournisseurs.component.scss']
})
export class ManageFournisseursComponent {



  displayColumns : string[] = ["nom","prenom","email","telephone","adresse","ville","codepostal","pays","action"]
  dataSource : any;
  responseMessage : any;

  constructor(private fournisseurService: FournisseursService,
    private ngxService:NgxUiLoaderService,
    private snackbarService: SnackbarService,private router:Router, private dialog : MatDialog) { }



  ngOnInit(): void {
    this.ngxService.start()
    this.tableData()
  }

  tableData(){
      this.fournisseurService.getAllFournisseurs().subscribe((res:any) => {
         this.ngxService.stop()
         this.dataSource = new MatTableDataSource(res)
         console.log(res)

      },(error:any)=>{
        this.ngxService.stop()
        if(error.error?.message){
          this.responseMessage = error.error?.message
      }
      else {
        this.responseMessage = GlobalConstants.genericErrorMessage
      }
      this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
      })
    }

    applyFilter(event:Event){
       const filterValue = (event.target as HTMLInputElement).value;
       this.dataSource.filter = filterValue.trim().toLowerCase()
    }


    handleAdd(){
       const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        action:'Ajouter'
      }
     // this.router.navigate(['/workspace/add']);
      dialogConfig.width = "850px"
      const dialogRef = this.dialog.open(FournisseursComponent,dialogConfig);
      this.router.events.subscribe(()=>{
        dialogRef.close();
      })
      const sub = dialogRef.componentInstance.onAdd.subscribe(
        (res:any)=>{
          this.ngxService.start();
          this.tableData()
        }
      )

    }

    handleEdit(values:any){
       const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        action:'Modifier',
        data: values
      }
      console.log(values)
      dialogConfig.width = "850px"
      const dialogRef = this.dialog.open(FournisseursComponent,dialogConfig);
      this.router.events.subscribe(()=>{
        dialogRef.close();
      })
      const sub = dialogRef.componentInstance.onUpdate.subscribe(
        (res:any)=>{
          this.ngxService.start();
          this.tableData()
        }
      )
    }

    handleDelete(values:any){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        message:"supprimer la catégorie "+values.code
      }
      const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
      const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res)=>{
         this.ngxService.start();
         this.delete(values.id)
         dialogRef.close();

      })
    }

    delete(id:any){

      this.fournisseurService.deleteFournisseur(id).subscribe((res:any)=>{
          this.ngxService.stop()
          this.tableData()
          this.responseMessage = res?.message
          this.snackbarService.openSnackbar(this.responseMessage,"success")
      },(error:any)=>{
        this.ngxService.stop()
        if(error.error?.message){
          this.responseMessage = error.error?.message
      }
      else {
        this.responseMessage = GlobalConstants.genericErrorMessage
      }
      this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
      })

    }


    // Méthodes pour les statistiques
    getUniqueCities(): number {
      if (!this.dataSource?.data) return 0;
      const cities = this.dataSource.data
        .map((supplier: any) => supplier.adresseDto?.ville)
        .filter((city: any) => city);
      return new Set(cities).size;
    }

    getUniqueCountries(): number {
      if (!this.dataSource?.data) return 0;
      const countries = this.dataSource.data
        .map((supplier: any) => supplier.adresseDto?.pays)
        .filter((country: any) => country);
      return new Set(countries).size;
    }

getCountryFlag(country: string): string {
  // Fonction simple pour afficher des drapeaux (vous pouvez l'améliorer)
  if (!country) return '🏳️';
  const flags: { [key: string]: string } = {
    'France': '🇫🇷',
    'Espagne': '🇪🇸',
    'Allemagne': '🇩🇪',
    'Italie': '🇮🇹',
    'Maroc': '🇲🇦',
    'Tunisie': '🇹🇳',
    'Belgique': '🇧🇪',
    'Suisse': '🇨🇭',
    'Canada': '🇨🇦',
    'USA': '🇺🇸',
  };
  return flags[country] || '🏳️';
}

// Méthode pour effacer le filtre
clearFilter(input: HTMLInputElement): void {
  this.dataSource.filter = '';
  input.value = '';
}

}
