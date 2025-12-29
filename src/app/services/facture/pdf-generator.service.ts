// pdf-generator.service.ts
import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable, { RowInput, UserOptions } from 'jspdf-autotable';
import { VenteDto, LigneVenteDto, ArticleDto, ModePayementDto } from 'src/app/api';

export interface EntrepriseInfo {
  id?: number;
  nom: string;
  adresse: string;
  telephone: string;
  email: string;
  siret?: string;
  logo?: string;
  ville?: string;
  codePostal?: string;
}

export interface PdfOptions {
  fileName?: string;
  includeLogo?: boolean;
  language?: 'fr' | 'en';
  currency?: string;
  autoDownload?: boolean;
}

export interface ClientInfo {
  nom?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  private readonly defaultEntreprise: EntrepriseInfo = {
    nom: 'Mon Entreprise',
    adresse: '123 Rue du Commerce',
    telephone: '01 23 45 67 89',
    email: 'contact@entreprise.com',
    siret: '123 456 789 00012',
    ville: 'Paris',
    codePostal: '75000'
  };

  constructor() {}

  /**
   * Génère un ticket de caisse (format compact)
   */
  async generateTicketCaisse(
    vente: VenteDto,
    entreprise: Partial<EntrepriseInfo>,
    options: PdfOptions = {}
  ): Promise<Blob> {
    try {
      const doc = new jsPDF({
        format: [80, 297],
        unit: 'mm'
      });

      const entrepriseInfo = { ...this.defaultEntreprise, ...entreprise };
      const margin = 5;
      const pageWidth = 80;
      const contentWidth = pageWidth - (margin * 2);
      let currentY = margin;

      // En-tête
      this.addTicketHeader(doc, entrepriseInfo, margin, currentY, contentWidth);
      currentY = 20;

      // Séparateur
      this.addSeparator(doc, margin, currentY, contentWidth);
      currentY += 5;

      // Infos ticket
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`TICKET DE CAISSE`, margin + (contentWidth / 2), currentY, { align: 'center' });
      currentY += 5;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`N°: ${vente.code || 'N/A'}`, margin, currentY);

      const dateVente = vente.dateVente ? new Date(vente.dateVente) : new Date();
      doc.text(`Date: ${this.formatDate(dateVente)}`, margin + 40, currentY);
      currentY += 4;

      doc.text(`Heure: ${this.formatTime(dateVente)}`, margin, currentY);
      currentY += 6;

      // Séparateur
      this.addSeparator(doc, margin, currentY, contentWidth);
      currentY += 3;

      // Tableau
      const ligneVentes = vente.ligneVentes || [];
      const tableData = this.prepareTicketTableData(ligneVentes);

      const autoTableOptions: UserOptions = {
        startY: currentY,
        head: [['#', 'Article', 'Qte', 'P.U', 'Total']],
        body: tableData,
        margin: { left: margin, right: margin },
        tableWidth: contentWidth,
        styles: {
          fontSize: 7,
          cellPadding: 1,
          overflow: 'linebreak',
          minCellHeight: 4
        },
        headStyles: {
          fillColor: [0, 0, 0],
          textColor: [255, 255, 255],
          fontSize: 7,
          fontStyle: 'bold'
        },
        columnStyles: {
          0: { cellWidth: 8, halign: 'center' },
          1: { cellWidth: 25 },
          2: { cellWidth: 10, halign: 'center' },
          3: { cellWidth: 12, halign: 'right' },
          4: { cellWidth: 15, halign: 'right' }
        }
      };

      autoTable(doc, autoTableOptions);

      const finalY = this.getSafeCursorY(doc);
      currentY = finalY + 5;

      // Totaux
      const totals = this.calculateTotals(ligneVentes);
      const currency = options.currency || '€';

      // Mode de paiement
      const modePaiement = this.getModePayementLabel(vente.modePayement);
      this.addTicketTotals(doc, margin, currentY, contentWidth, totals, currency, modePaiement);
      currentY += 20;

      // Pied de page
      this.addTicketFooter(doc, entrepriseInfo, margin, currentY, contentWidth);

      const pdfBlob = doc.output('blob');

      if (options.autoDownload !== false && options.fileName) {
        doc.save(options.fileName);
      }

      return pdfBlob;

    } catch (error) {
      console.error('Erreur lors de la génération du ticket de caisse:', error);
      throw new Error('Échec de la génération du ticket de caisse');
    }
  }

  /**
   * Génère une facture complète (format A4)
   */
  async generateFacturePDF(
    vente: VenteDto,
    entreprise: Partial<EntrepriseInfo>,
    client?: ClientInfo,
    options: PdfOptions = {}
  ): Promise<Blob> {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const entrepriseInfo = { ...this.defaultEntreprise, ...entreprise };

      const margin = 20;
      const pageWidth = 210;
      const contentWidth = pageWidth - (margin * 2);
      let currentY = margin;

      // Logo
      if (options.includeLogo && entrepriseInfo.logo) {
        await this.addLogo(doc, entrepriseInfo.logo, margin, currentY);
      }

      // Infos entreprise
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(entrepriseInfo.nom, margin, currentY);
      currentY += 7;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      const entrepriseLines = [
        entrepriseInfo.adresse,
        `${entrepriseInfo.codePostal || ''} ${entrepriseInfo.ville || ''}`.trim(),
        `SIRET: ${entrepriseInfo.siret}`,
        `Tél: ${entrepriseInfo.telephone}`,
        `Email: ${entrepriseInfo.email}`
      ];

      entrepriseLines.forEach(line => {
        if (line && line.trim()) {
          doc.text(line, margin, currentY);
          currentY += 4;
        }
      });

      currentY += 5;

      // Titre
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('FACTURE', pageWidth / 2, currentY, { align: 'center' });
      currentY += 15;

      // Infos facture
      const infoX = 130;
      currentY = margin + 10;

      const dateVente = vente.dateVente ? new Date(vente.dateVente) : new Date();

      const factureInfos = [
        { label: 'Facture N°:', value: vente.code || 'N/A' },
        { label: 'Date:', value: this.formatDate(dateVente) },
      ];

      if (client?.nom) {
        factureInfos.push({ label: 'Client:', value: client.nom });
      }

      factureInfos.forEach(info => {
        doc.setFont('helvetica', 'bold');
        doc.text(info.label, infoX, currentY);
        doc.setFont('helvetica', 'normal');
        doc.text(info.value, 180, currentY, { align: 'right' });
        currentY += 6;
      });

      // Infos client
      if (client) {
        currentY += 10;
        doc.setFont('helvetica', 'bold');
        doc.text('CLIENT:', margin, currentY);
        currentY += 6;

        doc.setFont('helvetica', 'normal');
        if (client.nom) {
          doc.text(client.nom, margin, currentY);
          currentY += 4;
        }

        if (client.adresse) {
          doc.text(client.adresse, margin, currentY);
          currentY += 4;
        }

        if (client.telephone) {
          doc.text(`Tél: ${client.telephone}`, margin, currentY);
          currentY += 4;
        }

        if (client.email) {
          doc.text(`Email: ${client.email}`, margin, currentY);
          currentY += 4;
        }
      }

      // Séparateur
      currentY = Math.max(currentY, 80);
      this.addSeparator(doc, margin, currentY, contentWidth, [41, 128, 185]);
      currentY += 10;

      // Tableau
      const ligneVentes = vente.ligneVentes || [];
      const currency = options.currency || '€';
      const tableData = this.prepareFactureTableData(ligneVentes, currency);

      const autoTableOptions: UserOptions = {
        startY: currentY,
        head: [
          ['Référence', 'Désignation', 'Qté', 'Unité', 'Prix unitaire', 'Total HT']
        ],
        body: tableData,
        margin: { left: margin, right: margin },
        styles: {
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak'
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 55 },
          2: { cellWidth: 15, halign: 'center' },
          3: { cellWidth: 20, halign: 'center' },
          4: { cellWidth: 30, halign: 'right' },
          5: { cellWidth: 30, halign: 'right' }
        }
      };

      autoTable(doc, autoTableOptions);

      const finalY = this.getSafeCursorY(doc, currentY + 50);
      currentY = finalY + 10;

      // Totaux
      const totals = this.calculateTotals(ligneVentes);
      this.addFactureTotals(doc, margin, currentY, contentWidth, totals, currency);
      currentY += 30;

      // Conditions de paiement
      const modePayement = vente.modePayement;
      this.addPaymentConditions(doc, margin, currentY, modePayement);

      // Pied de page
      this.addFactureFooter(doc, margin, 270, contentWidth);

      const pdfBlob = doc.output('blob');

      if (options.autoDownload !== false && options.fileName) {
        doc.save(options.fileName);
      }

      return pdfBlob;

    } catch (error) {
      console.error('Erreur lors de la génération de la facture:', error);
      throw new Error('Échec de la génération de la facture');
    }
  }

  /**
   * Génère une facture pour une ligne spécifique
   */
  async generateFactureForLigne(
    ligneVente: LigneVenteDto,
    entreprise: Partial<EntrepriseInfo>,
    options: PdfOptions = {}
  ): Promise<Blob> {
    // Créer un ModePayementDto factice
    const modePayementFactice: ModePayementDto = {
      code: 'N/A',
      designation: 'Facture unitaire'
    };

    // Créer une vente factice avec une seule ligne
    const venteFactice: VenteDto = {
      code: `FAC-${this.generateRandomCode()}`,
      dateVente: new Date().toISOString(),
      ligneVentes: [ligneVente],
      modePayement: modePayementFactice
    };

    return this.generateFacturePDF(venteFactice, entreprise, undefined, {
      fileName: options.fileName || `facture-ligne-${ligneVente.article?.codeArticle || 'ligne'}.pdf`,
      autoDownload: options.autoDownload ?? true,
      ...options
    });
  }

  /**
   * Obtient le libellé du mode de paiement
   */
  private getModePayementLabel(modePayement?: ModePayementDto): string {
    if (!modePayement) {
      return 'Non spécifié';
    }

    // Utiliser designation si disponible, sinon code
    return modePayement.designation || modePayement.code || 'Non spécifié';
  }

  // ========== MÉTHODES D'AIDE PRIVÉES ==========

  /**
   * Prépare les données pour le tableau du ticket
   */
  private prepareTicketTableData(ligneVentes: LigneVenteDto[]): RowInput[] {
    return ligneVentes.map((item, index) => {
      const article = item.article || {};
      const designation = article.designation || article.codeArticle || 'Article inconnu';
      const prixUnitaire = item.prixUnitaire || 0;
      const quantite = item.quantite || 0;
      const totalLigne = prixUnitaire * quantite;

      return [
        (index + 1).toString(),
        this.truncateText(designation, 15),
        quantite.toString(),
        this.formatCurrency(prixUnitaire, '', false),
        this.formatCurrency(totalLigne, '', false)
      ];
    });
  }

  /**
   * Prépare les données pour le tableau de la facture
   */
  private prepareFactureTableData(ligneVentes: LigneVenteDto[], currency: string): RowInput[] {
    return ligneVentes.map((item) => {
      const article = item.article || {};
      const codeArticle = article.codeArticle || 'N/A';
      const designation = article.designation || 'Article non spécifié';
      const unite = item.unite || 'UN';
      const prixUnitaire = item.prixUnitaire || 0;
      const quantite = item.quantite || 0;
      const totalLigne = prixUnitaire * quantite;

      return [
        codeArticle,
        designation,
        quantite.toString(),
        unite,
        this.formatCurrency(prixUnitaire, currency, true),
        this.formatCurrency(totalLigne, currency, true)
      ];
    });
  }

  /**
   * Ajoute l'en-tête du ticket
   */
  private addTicketHeader(
    doc: jsPDF,
    entreprise: EntrepriseInfo,
    x: number,
    y: number,
    width: number
  ): void {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(entreprise.nom, x + width / 2, y, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    const lines = [
      entreprise.adresse,
      entreprise.telephone,
      entreprise.email
    ].filter(line => line && line.trim() !== '');

    lines.forEach((line, index) => {
      doc.text(line, x + width / 2, y + 4 + (index * 4), { align: 'center' });
    });
  }

  /**
   * Ajoute les totaux du ticket
   */
  private addTicketTotals(
    doc: jsPDF,
    x: number,
    y: number,
    width: number,
    totals: { subtotal: number; tva: number; total: number },
    currency: string,
    modePaiement: string
  ): void {
    const rightX = x + width - 5;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('SOUS-TOTAL:', x, y);
    doc.text(this.formatCurrency(totals.subtotal, currency, true), rightX, y, { align: 'right' });
    y += 4;

    if (totals.tva > 0) {
      doc.setFont('helvetica', 'normal');
      doc.text('TVA (20%):', x, y);
      doc.text(this.formatCurrency(totals.tva, currency, true), rightX, y, { align: 'right' });
      y += 4;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('TOTAL:', x, y);
    doc.text(this.formatCurrency(totals.total, currency, true), rightX, y, { align: 'right' });
    y += 8;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Mode: ${modePaiement}`, x, y);
  }

  /**
   * Ajoute le pied de page du ticket
   */
  private addTicketFooter(
    doc: jsPDF,
    entreprise: EntrepriseInfo,
    x: number,
    y: number,
    width: number
  ): void {
    this.addSeparator(doc, x, y, width);
    y += 5;

    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');

    const footerLines = [
      'Merci de votre visite !',
      'Ticket à conserver pour tout échange',
      entreprise.adresse,
      `Tél: ${entreprise.telephone}`,
      `SIRET: ${entreprise.siret}`
    ];

    footerLines.forEach((line, index) => {
      if (line && line.trim()) {
        doc.text(line, x + width / 2, y + (index * 3), { align: 'center' });
      }
    });
  }

  /**
   * Ajoute les totaux de la facture
   */
  private addFactureTotals(
    doc: jsPDF,
    x: number,
    y: number,
    width: number,
    totals: { subtotal: number; tva: number; total: number },
    currency: string
  ): void {
    const rightX = x + width - 20;
    let currentY = y;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const totalLines = [
      { label: 'Sous-total HT:', value: totals.subtotal },
      { label: 'TVA (20%):', value: totals.tva },
      { label: 'Total TTC:', value: totals.total, bold: true, size: 12 }
    ];

    totalLines.forEach(line => {
      if (line.bold) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(line.size || 10);
      } else {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
      }

      doc.text(line.label, rightX, currentY);
      doc.text(this.formatCurrency(line.value, currency, true), x + width, currentY, { align: 'right' });
      currentY += 7;
    });
  }

  /**
   * Ajoute les conditions de paiement
   */
  private addPaymentConditions(
    doc: jsPDF,
    x: number,
    y: number,
    modePayement?: ModePayementDto
  ): void {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('CONDITIONS DE PAIEMENT:', x, y);
    y += 6;

    doc.setFont('helvetica', 'normal');

    if (modePayement) {
      const libelle = this.getModePayementLabel(modePayement);
      doc.text(`Mode de paiement: ${libelle}`, x, y);
      y += 4;

      if (modePayement.code && ['CB', 'CARTE', 'CARTE_BANCAIRE'].includes(modePayement.code)) {
        doc.text('• Transaction sécurisée', x + 5, y);
        y += 4;
      }
    } else {
      doc.text('Mode de paiement: Non spécifié', x, y);
      y += 4;
    }

    doc.text('• Paiement à réception de la facture', x + 5, y);
    y += 4;
    doc.text('• Pas d\'escompte pour paiement anticipé', x + 5, y);
  }

  /**
   * Ajoute le pied de page de la facture
   */
  private addFactureFooter(
    doc: jsPDF,
    x: number,
    y: number,
    width: number
  ): void {
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.2);
    doc.line(x, y, x + width, y);
    y += 5;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');

    const footerLines = [
      'Facture émise par le système de gestion commerciale',
      'Cet document a valeur juridique de facture',
      'Conformément à l\'article L. 441-3 du code de commerce'
    ];

    footerLines.forEach((line, index) => {
      doc.text(line, x + (width / 2), y + (index * 4), { align: 'center' });
    });
  }

  /**
   * Ajoute une ligne séparatrice
   */
  private addSeparator(
    doc: jsPDF,
    x: number,
    y: number,
    width: number,
    color?: [number, number, number]
  ): void {
    if (color) {
      doc.setDrawColor(...color);
    } else {
      doc.setDrawColor(0);
    }
    doc.setLineWidth(0.2);
    doc.line(x, y, x + width, y);
  }

  /**
   * Ajoute un logo (si disponible)
   */
  private async addLogo(
    doc: jsPDF,
    logoUrl: string,
    x: number,
    y: number
  ): Promise<void> {
    try {
      if (logoUrl && logoUrl.startsWith('data:image')) {
        doc.addImage(logoUrl, 'PNG', x, y, 40, 40);
      }
    } catch (error) {
      console.warn('Logo non chargé:', error);
    }
  }

  /**
   * Calcule les totaux
   */
  private calculateTotals(ligneVentes: LigneVenteDto[]): {
    subtotal: number;
    tva: number;
    total: number;
  } {
    const subtotal = ligneVentes.reduce((sum, item) => {
      const prix = item.prixUnitaire || 0;
      const qte = item.quantite || 0;
      return sum + (prix * qte);
    }, 0);

    const tva = subtotal * 0.2;
    const total = subtotal + tva;

    return {
      subtotal: Number(subtotal.toFixed(2)),
      tva: Number(tva.toFixed(2)),
      total: Number(total.toFixed(2))
    };
  }

  /**
   * Récupère la position Y en sécurité
   */
  private getSafeCursorY(doc: jsPDF, defaultValue: number = 100): number {
    try {
      const pdf = doc as any;
      if (pdf.lastAutoTable && pdf.lastAutoTable.finalY) {
        return pdf.lastAutoTable.finalY;
      }
    } catch (error) {
      console.warn('Impossible de récupérer cursorY:', error);
    }
    return defaultValue;
  }

  /**
   * Formate une date
   */
  private formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Formate une heure
   */
  private formatTime(date: Date): string {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Formate une devise
   */
  private formatCurrency(amount: number, currency: string, includeSymbol: boolean = true): string {
    const formatted = amount.toFixed(2).replace('.', ',');
    if (!includeSymbol || !currency) {
      return formatted;
    }
    return `${formatted} ${currency}`;
  }

  /**
   * Tronque un texte
   */
  private truncateText(text: string, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Génère un code aléatoire
   */
  private generateRandomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}