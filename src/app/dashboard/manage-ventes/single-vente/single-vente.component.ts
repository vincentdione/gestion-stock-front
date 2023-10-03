import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VenteDto } from 'src/app/api';

@Component({
  selector: 'app-single-vente',
  templateUrl: './single-vente.component.html',
  styleUrls: ['./single-vente.component.scss']
})
export class SingleVenteComponent {

  constructor(private route: ActivatedRoute) { }

vente!: VenteDto

ngOnInit() {
  this.route.paramMap.subscribe(params => {
    const venteId = params.get('id');

    // Récupération des données envoyées avec la navigation
     const navigationData = window.history.state.data;
     this.vente = navigationData
    console.log("data ====  ", this.vente)
    // Utilisez la valeur de venteId et les données de navigationData comme nécessaire.
  });

}
}
