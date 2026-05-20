import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntreprisesService, VenteDto } from 'src/app/api';
import { Entreprise } from 'src/app/api/model/entreprise';
import html2pdf from 'html2pdf.js';

export interface InvoiceItem {
  description: string;
  code?: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  details?: string;
}

@Component({
  selector: 'app-facture-print',
  templateUrl: './facture-print.component.html',
  styleUrls: ['./facture-print.component.scss']
})
export class FacturePrintComponent implements OnInit {

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
    private entrepriseService: EntreprisesService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      const navigationData = window.history.state;

      // Récupérer les données selon l'origine
      if (navigationData) {
        this.venteInfo = navigationData.venteInfo || null;
        this.origin = navigationData.origin || 'ventes';
        this.idEntreprise = navigationData.idEntreprise || 0;

        // Récupérer les lignes de vente
        const venteFacture = navigationData.data || [];

        if (this.idEntreprise) {
          this.getEntreprise(this.idEntreprise);
        }

        if (venteFacture.length > 0) {
          this.processInvoiceData(venteFacture);
          this.calculateSummary();
          this.generateFactureInfo();
        }
      }
    });
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
      return `${this.venteInfo.nomClient} ${this.venteInfo.prenomClient}`;
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

  // ========== ACTIONS ==========

  handlePrint(): void {
    window.print();
  }

  downloadPDF(): void {
    const element = document.getElementById('invoice-content');
    if (!element) return;

    const opt = {
      margin: 0.5,
      filename: `facture_${this.factureNumber}.pdf`,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait'
      }
    };

    // Utiliser any pour éviter les erreurs TypeScript
    (window as any).html2pdf()
      .set(opt)
      .from(element)
      .save();
  }
}