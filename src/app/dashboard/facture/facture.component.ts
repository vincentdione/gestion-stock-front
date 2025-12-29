import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Customer } from './client-info/client-info.component';
import { InvoiceData } from 'src/app/types/invoice';
import { ActivatedRoute } from '@angular/router';
import { CommandeClientDto, EntreprisesService, VenteDto } from 'src/app/api';
import { CommandeFournisseur } from 'src/app/api/model/commandeFournisseur';
import { Entreprise } from 'src/app/api/model/entreprise';

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}


export interface InvoiceDetails {
  number: string;
  date: string;
  dueDate: string;
  currency: string;
}

export interface PaymentInfo {
  terms: string;
  methods: string;
}

export interface Summary {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}

export interface InvoiceItem {
  description: string;
  details?: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}



@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss']
})
export class FactureComponent {

  @Input() data!: InvoiceData;

  constructor(private route: ActivatedRoute,private entrepriseService: EntreprisesService,
    private cdr: ChangeDetectorRef
  ) { }

  vente!: any
  commandeClient!: CommandeClientDto
  commandeFournisseur!: CommandeFournisseur
  entreprise!: Entreprise
  idEntreprise!: number
  origin: string = '';
  myInvoiceItems: InvoiceItem[] = [];
  venteFacture: [] = [];
  subtotal: number = 0;
  taxRate: number = 20; 
  taxAmount: number = 0;
  total: number = 0;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const navigationData = window.history.state;
      this.vente = navigationData.data;
      this.venteFacture = navigationData.data;
      this.origin = navigationData.origin;

      this.idEntreprise = navigationData.data[0]?.article.idEntreprise;
      this.getEntreprise(this.idEntreprise);

      if (this.vente) {
        if (this.origin === 'client') {
        } else if (this.origin === 'fournisseur') {
          // traitement spécifique fournisseur ?
        } else {
          this.myInvoiceItems = this.venteFacture?.map((v:any) => ({
            description: v.article?.designation || 'Article inconnu',
            quantity: v.quantite || 0,
            unitPrice: v.prixUnitaire || 0,
            currency: 'EUR',
            details: v.article?.codeArticle || ''
          }));
          this.calculateSummary();

        }
      }
     
    });
    
  
  }

  calculateSummary() {
    this.subtotal = this.myInvoiceItems.reduce((sum, item) => {
      return sum + (item.unitPrice * item.quantity);
    }, 0);
  
    // this.taxAmount = (this.subtotal * this.taxRate) / 100;
    this.total = this.subtotal;
  }
  

  getEntreprise(id:number) {
    this.entrepriseService.getEntrepriseById(id).subscribe(
      (data) => {
        this.entreprise = data;
        console.log("entreprise ===== ", this.entreprise)
      },
      (error) => {
        console.error('Erreur lors de la récupération de l\'entreprise:', error);
      }
    );
  }

  myCustomer: Customer = {
    name: 'John Doe',
    company: 'ACME Corp',
    address: '123 Main St',
    email: 'john@example.com',
    phone: '123-456-7890'
  };





}
