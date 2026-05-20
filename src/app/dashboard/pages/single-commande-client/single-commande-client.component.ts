import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommandeClient } from 'src/app/api/model/commandeClient';
import { CommandeFournisseur } from 'src/app/api/model/commandeFournisseur';

@Component({
  selector: 'app-single-commande-client',
  templateUrl: './single-commande-client.component.html',
  styleUrls: ['./single-commande-client.component.scss']
})
export class SingleCommandeClientComponent {

  origin = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  commande!: any;
  detailCommande = '';

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.origin = data['origin'];
    });

    this.activatedRoute.paramMap.subscribe(params => {
      const navigationData = window.history.state.data;

      if (this.origin == 'client') {
        this.commande = navigationData as CommandeClient;
        this.detailCommande = 'Détails de la commande client';
      }
      if (this.origin == 'fournisseur') {
        this.commande = navigationData as CommandeFournisseur;
        console.log("--------------------------")
        console.log(JSON.stringify(this.commande))
        console.log("--------------------------")
        this.detailCommande = 'Détails de la commande fournisseur';
      }
    });
  }

  // Ajoutez cette nouvelle méthode pour générer la facture
  generateFacture() {
    // Déterminer les lignes de commande selon l'origine
    const lignesCommande = this.origin === 'client'
      ? this.commande?.ligneCommandeClients
      : this.commande?.ligneCommandeFournisseurDtos;

    // Préparer les données à passer au composant facture
    const factureData = {
      // Données de la commande (convertir en format similaire à VenteDto)
      venteInfo: this.prepareVenteInfo(),
      // Les lignes de commande
      data: lignesCommande || [],
      // Origine (pour adapter l'affichage si nécessaire)
      origin: 'commande-' + this.origin,
      // ID entreprise
      idEntreprise: this.commande?.idEntreprise || 0,
      // La commande complète pour référence
      commande: this.commande
    };

    // Naviguer vers le composant facture avec les données
    this.router.navigate(['/workspace/dashboard/facture'], {
      state: factureData
    });
  }

  // Méthode pour préparer les informations au format attendu par le composant facture
  private prepareVenteInfo(): any {
    if (this.origin === 'client') {
      return {
        nomClient: this.commande?.clientDto?.nom || '',
        prenomClient: this.commande?.clientDto?.prenom || '',
        email: this.commande?.clientDto?.email || '',
        numero: this.commande?.clientDto?.numTel || '',
        adresse: this.formatAddress(this.commande?.clientDto?.adresse),
        modePayement: this.commande?.modePayement,
        commentaire: this.commande?.commentaire || '',
        dateCommande: this.commande?.dateCommande,
        code: this.commande?.code
      };
    } else {
      // Pour les fournisseurs
      return {
        nomClient: this.commande?.fournisseurDto?.nom || '',
        prenomClient: this.commande?.fournisseurDto?.prenom || '',
        email: this.commande?.fournisseurDto?.email || '',
        numero: this.commande?.fournisseurDto?.numTel || '',
        adresse: this.formatAddress(this.commande?.fournisseurDto?.adresse),
        modePayement: this.commande?.modePayement,
        commentaire: this.commande?.commentaire || '',
        dateCommande: this.commande?.dateCommande,
        code: this.commande?.code
      };
    }
  }

  // Méthode utilitaire pour formater l'adresse
  private formatAddress(adresse: any): string {
    if (!adresse) return '';

    const parts = [
      adresse.adresse1,
      adresse.adresse2,
      adresse.ville,
      adresse.codePostal,
      adresse.pays
    ].filter(part => part && part.trim() !== '');

    return parts.join(', ');
  }

  // Méthodes utilitaires pour le template (existantes)
  getBackLink(): string {
    return this.origin === 'client'
      ? '/workspace/dashboard/commandeClients'
      : '/workspace/dashboard/commandeFournisseurs';
  }

  getOriginIcon(): string {
    return this.origin === 'client' ? 'person' : 'store';
  }

  getOriginLabel(): string {
    return this.origin === 'client' ? 'Client' : 'Fournisseur';
  }

  getContactName(): string {
    if (this.origin === 'client' && this.commande?.clientDto) {
      return `${this.commande.clientDto.nom || ''} ${this.commande.clientDto.prenom || ''}`.trim();
    }
    if (this.origin === 'fournisseur' && this.commande?.fournisseurDto) {
      return `${this.commande.fournisseurDto.nom || ''} ${this.commande.fournisseurDto.prenom || ''}`.trim();
    }
    return 'Non spécifié';
  }

  getContactEmail(): string {
    if (this.origin === 'client' && this.commande?.clientDto) {
      return this.commande.clientDto.email || '';
    }
    if (this.origin === 'fournisseur' && this.commande?.fournisseurDto) {
      return this.commande.fournisseurDto.email || '';
    }
    return '';
  }

  getContactPhone(): string {
    if (this.origin === 'client' && this.commande?.clientDto) {
      return this.commande.clientDto.numTel || '';
    }
    if (this.origin === 'fournisseur' && this.commande?.fournisseurDto) {
      return this.commande.fournisseurDto.numTel || '';
    }
    return '';
  }

  getContactAddress(): string {
    if (this.origin === 'client' && this.commande?.clientDto?.adresse) {
      const adresse = this.commande.clientDto.adresse;
      return `${adresse.adresse1 || ''} ${adresse.adresse2 || ''} ${adresse.ville || ''} ${adresse.codePostal || ''} ${adresse.pays || ''}`.trim();
    }
    if (this.origin === 'fournisseur' && this.commande?.fournisseurDto?.adresse) {
      const adresse = this.commande.fournisseurDto.adresse;
      return `${adresse.adresse1 || ''} ${adresse.adresse2 || ''} ${adresse.ville || ''} ${adresse.codePostal || ''} ${adresse.pays || ''}`.trim();
    }
    return '';
  }

  getItemsCount(): number {
    if (this.origin === 'client') {
      return this.commande?.ligneCommandeClients?.length || 0;
    } else {
      return this.commande?.ligneCommandeFournisseurDtos?.length || 0;
    }
  }

  getTotalHT(): number {
    if (!this.commande) return 0;

    if (this.origin === 'client' && this.commande.ligneCommandeClients) {
      return this.commande.ligneCommandeClients.reduce((total: number, ligne: any) =>
        total + (ligne.prixUnitaire * ligne.quantite), 0);
    } else if (this.origin === 'fournisseur' && this.commande.ligneCommandeFournisseurDtos) {
      return this.commande.ligneCommandeFournisseurDtos.reduce((total: number, ligne: any) =>
        total + (ligne.prixUnitaire * ligne.quantite), 0);
    }
    return 0;
  }

  getRemise(): number {
    return this.commande?.remise || this.commande?.montantRemise || 0;
  }

  getTVA(): number {
    return this.commande?.tva || this.commande?.montantTVA || 0;
  }

  getTotalNet(): number {
    return this.getTotalHT() - this.getRemise() + this.getTVA();
  }
}