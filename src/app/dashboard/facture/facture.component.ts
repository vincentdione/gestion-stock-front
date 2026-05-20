import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntreprisesService, VenteDto } from 'src/app/api';
import { Entreprise } from 'src/app/api/model/entreprise';
import html2pdf from 'html2pdf.js';
import { DomSanitizer } from '@angular/platform-browser';

export interface InvoiceItem {
  description: string;
  code?: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  details?: string;
}

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss']
})
export class FactureComponent implements OnInit {

  venteInfo: VenteDto | null = null;
  entreprise: Entreprise | null = null;
  origin: string = '';
  idEntreprise: number = 0;

  myInvoiceItems: InvoiceItem[] = [];
  subtotal: number = 0;
  taxRate: number = 0;
  taxAmount: number = 0;
  total: number = 0;

  currentYear: number = new Date().getFullYear();
  factureNumber: string = '';
  factureDate: string = '';
  dueDate: string = '';

  constructor(
    private route: ActivatedRoute,
    private entrepriseService: EntreprisesService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      const navigationData = window.history.state;

      // Récupérer les données selon l'origine
      if (navigationData) {
        // Vérifier si c'est une vente ou une commande
        if (navigationData.venteInfo) {
          // Cas des ventes (existant)
          this.venteInfo = navigationData.venteInfo || null;
          this.origin = navigationData.origin || 'ventes';
          this.idEntreprise = navigationData.idEntreprise || 0;

          // Récupérer les lignes de vente
          const venteFacture = navigationData.data || [];

          if (venteFacture.length > 0) {
            this.processInvoiceData(venteFacture);
            this.calculateSummary();
            this.generateFactureInfo();
          }
        } else if (navigationData.commande) {
          // Cas des commandes (nouveau)
          const commande = navigationData.commande;
          this.origin = navigationData.origin || 'commande-client';
          this.idEntreprise = navigationData.idEntreprise || 0;

          // Convertir la commande en format similaire à venteInfo
          this.venteInfo = this.convertCommandeToVenteInfo(commande, navigationData.origin);

          // Traiter les lignes de commande
          const lignesCommande = navigationData.data || [];

          if (lignesCommande.length > 0) {
            this.processInvoiceData(lignesCommande);
            this.calculateSummary();
            this.generateFactureInfo();
          }
        }

        if (this.idEntreprise) {
          this.getEntreprise(this.idEntreprise);
        }
      }
    });
  }

  // Ajoutez cette méthode pour convertir une commande en format vente
  private convertCommandeToVenteInfo(commande: any, origin: string): any {
    if (origin.includes('client')) {
      return {
        nomClient: commande.clientDto?.nom || '',
        prenomClient: commande.clientDto?.prenom || '',
        email: commande.clientDto?.email || '',
        numero: commande.clientDto?.numTel || '',
        adresse: this.formatCommandeAddress(commande.clientDto?.adresse),
        modePayement: commande.modePayement,
        commentaire: commande.commentaire || '',
        dateCommande: commande.dateCommande,
        code: commande.code
      };
    } else if (origin.includes('fournisseur')) {
      return {
        nomClient: commande.fournisseurDto?.nom || '',
        prenomClient: commande.fournisseurDto?.prenom || '',
        email: commande.fournisseurDto?.email || '',
        numero: commande.fournisseurDto?.numTel || '',
        adresse: this.formatCommandeAddress(commande.fournisseurDto?.adresse),
        modePayement: commande.modePayement,
        commentaire: commande.commentaire || '',
        dateCommande: commande.dateCommande,
        code: commande.code
      };
    }
    return {};
  }

  // Méthode pour formater l'adresse de la commande
  private formatCommandeAddress(adresse: any): string {
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

  // Modifiez getBackLink() pour gérer les commandes
  getBackLink(): string {
    if (this.origin.includes('commande-client')) {
      return '/workspace/dashboard/commandeClients';
    } else if (this.origin.includes('commande-fournisseur')) {
      return '/workspace/dashboard/commandeFournisseurs';
    } else {
      return '/workspace/dashboard/ventes';
    }
  }
  processInvoiceData(data: any[]) {
    this.myInvoiceItems = data.map((v: any) => ({
      description: v.article?.designation || v.article?.nom || 'Article inconnu',
      code: v.article?.codeArticle || '',
      quantity: v.quantite || 0,
      unitPrice: v.prixUnitaire || 0,
      currency: 'FCFA',
      details: v.article?.categorie?.code || v.unite || ''
    }));
  }

  calculateSummary() {
    this.subtotal = this.myInvoiceItems.reduce((sum, item) => {
      return sum + (item.unitPrice * item.quantity);
    }, 0);

    // Calcul de la TVA (ajustable selon vos besoins)
    this.taxAmount = (this.subtotal * this.taxRate) / 100;
    this.total = this.subtotal + this.taxAmount;
  }

  generateFactureInfo() {
    // Générer le numéro de facture
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    this.factureNumber = `FAC-${year}${month}${day}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    this.factureDate = now.toISOString();

    // Date d'échéance (30 jours)
    const due = new Date(now);
    due.setDate(due.getDate() + 30);
    this.dueDate = due.toISOString();
  }

  getEntreprise(id: number) {
    this.entrepriseService.getEntrepriseById(id).subscribe(
      (data) => {
        this.entreprise = data;
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'entreprise:', error);
      }
    );
  }

  // ========== MÉTHODES UTILITAIRES ==========

  getClientName(): string {
    if (!this.venteInfo) return '';
    if (this.venteInfo.nomClient && this.venteInfo.prenomClient) {
      return `${this.venteInfo.prenomClient} ${this.venteInfo.nomClient} `;
    } else if (this.venteInfo.nomClient) {
      return this.venteInfo.nomClient;
    }
    return '';
  }

  getModePaiement(): string {
    return this.venteInfo?.modePayement?.code || '';
  }

  getClientPhone(): string {
    return this.venteInfo?.numero || '';
  }

  getClientAddress(): string {
    return this.venteInfo?.adresse || '';
  }

  getCommentaire(): string {
    return this.venteInfo?.commentaire || '';
  }

  hasClientInfo(): boolean {
    return !!(this.getClientName() || this.getClientPhone() || this.getClientAddress());
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  }

  getItemTotal(item: InvoiceItem): number {
    return item.quantity * item.unitPrice;
  }

  // ========== ACTIONS PDF/IMPRESSION ==========
  downloadPDF(): void {
    try {
      const element = document.getElementById('invoice-content');
      if (!element) {
        console.error('Élément de facture non trouvé');
        return;
      }

      // Options pour html2pdf.js avec type casting
      const options = {
        margin: 1,
        filename: `facture_${this.factureNumber}.pdf`,
        image: {
          type: 'jpeg' as const, // Type literal
          quality: 0.98
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false
        },
        jsPDF: {
          unit: 'mm' as const,
          format: 'a4' as const,
          orientation: 'portrait' as const
        }
      };

      // Générer le PDF
      html2pdf()
        .set(options)
        .from(element)
        .save()
        .catch((error: any) => {
          console.error('Erreur lors de la génération du PDF:', error);
        });

    } catch (error) {
      console.error('Erreur dans downloadPDF:', error);
    }
  }

  printInvoice(): void {
    window.print();
  }

  handlePrint(): void {
    this.printInvoice();
  }
}