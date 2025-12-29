import { ChangeDetectorRef, Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { VenteDto, VentesService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-single-vente',
  templateUrl: './single-vente.component.html',
  styleUrls: ['./single-vente.component.scss']
})
export class SingleVenteComponent {

  constructor(private route: ActivatedRoute,private router: Router,
        private snackbarService : SnackbarService,
    private venteService: VentesService,
    private cdr: ChangeDetectorRef,
    private ngxService: NgxUiLoaderService) { }

vente!: VenteDto
venteFacture: any []=[];
origin: string = '';
dataSource:any = [];
total: number = 0;
idVente!: number
idEntreprise!: number

responseMessage : any;
ngOnInit() {
  this.route.paramMap.subscribe(params => {
    // Récupération des données envoyées avec la navigation
     const navigationData = window.history.state;
     this.vente = navigationData.data
     this.venteFacture = navigationData.data
     if (this.vente && this.vente.id !== undefined) {
      this.idVente = this.vente.id;
      this.tableDataVentes(this.idVente);
    }
  });

}

  tableDataVentes(id:number){
    this.venteService.findAllLigneVenteByVenteId(id).subscribe((res:any) => {
      this.ngxService.stop()
      this.dataSource = new MatTableDataSource(res)
      this.venteFacture = res
      this.idEntreprise = res[0]?.article.idEntreprise
      this.updateTotal(res)
      // this.total = res.reduce((acc:number, val:any) => {
      //   return acc + parseInt(val.rad_prix);
      // }, 0);
    },(error)=>{
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

  updateTotal(dataSource:any) {
    this.total = dataSource.reduce((acc: number, curr: { prixUnitaire: number; quantite: number; }) => acc + (curr.prixUnitaire * curr.quantite), 0);
    // Déclenchez la détection des changements pour mettre à jour la vue
    this.cdr.detectChanges();
  }

handleFacture(){
  console.log("handleFacture")
  console.log(this.venteFacture)
  const navigationExtras: NavigationExtras = {
    state: {
      data: this.venteFacture,
      origin: 'ventes',
      idEntreprise: this.idEntreprise
    },
  };
  this.router.navigate(['/workspace/dashboard/facture'],navigationExtras);
}

printPage(): void {
  window.print();
}

}
