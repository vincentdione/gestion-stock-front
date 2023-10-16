import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommandeClient } from 'src/app/api/model/commandeClient';
import { CommandeFournisseur } from 'src/app/api/model/commandeFournisseur';

@Component({
  selector: 'app-single-commande-client',
  templateUrl: './single-commande-client.component.html',
  styleUrls: ['./single-commande-client.component.scss']
})
export class SingleCommandeClientComponent {

  origin = ''
  constructor(private activatedRoute: ActivatedRoute) { }

  commande!: any
  detailCommande!:string
ngOnInit() {

  this.activatedRoute.data.subscribe(data => {
    this.origin = data['origin'];
  });

  this.activatedRoute.paramMap.subscribe(params => {
    const commandeId = params.get('id');

    // Récupération des données envoyées avec la navigation
     const navigationData = window.history.state.data;

     if (this.origin == 'client'){
      this.commande = navigationData as CommandeClient
      this.detailCommande = 'Détails de la commande client'
     }
     if (this.origin == 'fournisseur'){
      this.commande = navigationData as CommandeFournisseur
      this.detailCommande = 'Détails de la commande fournisseur'
     }

    // Utilisez la valeur de venteId et les données de navigationData comme nécessaire.
  });

}

}
