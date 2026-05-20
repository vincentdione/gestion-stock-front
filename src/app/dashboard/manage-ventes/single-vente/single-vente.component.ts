import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
export class SingleVenteComponent implements OnInit {

  vente: VenteDto | null = null;
  venteFacture: any[] = [];
  dataSource: any = new MatTableDataSource([]);
  total: number = 0;
  idVente!: number;
  idEntreprise!: number;
  responseMessage: any;

  isLoading: boolean = true;
  showClientForm: boolean = false;
  clientForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private snackbarService: SnackbarService,
    private venteService: VentesService,
    private cdr: ChangeDetectorRef,
    private ngxService: NgxUiLoaderService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.ngxService.start();
    this.initClientForm();

    this.route.paramMap.subscribe(params => {
      const navigationData = window.history.state;

      if (navigationData && navigationData.data) {
        // Si les données sont passées via state
        this.vente = navigationData.data;
        this.processVenteData();
      } else {
        // Sinon charger depuis l'API via l'ID de l'URL
        const venteId = params.get('id');
        if (venteId) {
          this.idVente = parseInt(venteId);
          this.loadVenteById(this.idVente);
        }
      }
    });
  }

  initClientForm() {
    this.clientForm = this.fb.group({
      nomClient: ['', Validators.required],
      prenomClient: [''],
      telephone: [''],
      adresse: [''],
      email: ['']
    });
  }

  loadVenteById(id: number) {
    this.venteService.getVenteById(id).subscribe({
      next: (res: VenteDto) => {
        this.vente = res;
        this.processVenteData();
      },
      error: (error) => {
        this.handleError(error);
      }
    });
  }

  processVenteData() {
    if (this.vente) {
      this.ngxService.stop();
      this.isLoading = false;

      // Extraire les lignes de vente de l'objet vente
      const lignesVentes = this.vente.ligneVentes || [];
      this.dataSource = new MatTableDataSource(lignesVentes);
      this.venteFacture = lignesVentes;

      // Récupérer l'ID entreprise
      this.idEntreprise = this.vente.idEntreprise!;

      // Calculer le total
      this.updateTotal(lignesVentes);

      // Pré-remplir le formulaire client si des données existent
      this.prefillClientForm();
    } else {
      this.ngxService.stop();
      this.isLoading = false;
    }
  }

  prefillClientForm() {
    if (this.vente) {
      this.clientForm.patchValue({
        nomClient: this.vente.nomClient || '',
        prenomClient: this.vente.prenomClient || '',
        telephone: this.vente.numero || '',
        adresse: this.vente.adresse || '',
      });
    }
  }

  toggleClientForm() {
    this.showClientForm = !this.showClientForm;
    if (this.showClientForm) {
      this.prefillClientForm();
    }
  }

  cancelClientForm() {
    this.showClientForm = false;
    this.clientForm.reset();
    this.prefillClientForm();
  }

  saveClientInfo() {
    if (!this.vente || this.clientForm.invalid) {
      return;
    }

    this.ngxService.start();

    // Créer une copie des données de la vente avec les nouvelles infos client
    const updatedVente: VenteDto = {
      ...this.vente,
      nomClient: this.clientForm.get('nomClient')?.value,
      prenomClient: this.clientForm.get('prenomClient')?.value,
      numero: this.clientForm.get('telephone')?.value,
      adresse: this.clientForm.get('adresse')?.value,
      //email: this.clientForm.get('email')?.value
    };

    // Appeler l'API pour mettre à jour la vente
    this.venteService.updateClientInfo(this.vente.id!, updatedVente).subscribe({
      next: (res: VenteDto) => {
        this.ngxService.stop();
        this.vente = res;
        this.snackbarService.openSnackbar('Informations client mises à jour avec succès', 'success');
        this.showClientForm = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.ngxService.stop();
        this.handleError(error);
      }
    });
  }

  updateTotal(lignesVentes: any[]) {
    this.total = lignesVentes.reduce((acc: number, curr: { prixUnitaire: number; quantite: number; }) =>
      acc + ((curr.prixUnitaire || 0) * (curr.quantite || 0)), 0);
    this.cdr.detectChanges();
  }

  handleError(error: any): void {
    this.ngxService.stop();
    this.isLoading = false;
    if (error.error?.message) {
      this.responseMessage = error.error?.message;
    } else {
      this.responseMessage = GlobalConstants.genericErrorMessage;
    }
    this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
  }

  handleFacture() {
    if (!this.vente) return;

    const navigationExtras: NavigationExtras = {
      state: {
        data: this.vente.ligneVentes || [],
        origin: 'ventes',
        idEntreprise: this.idEntreprise,
        venteInfo: this.vente // Ajouter les infos de la vente pour la facture
      },
    };
    this.router.navigate(['/workspace/dashboard/facture'], navigationExtras);
  }

  printPage(): void {
    window.print();
  }

  // ========== MÉTHODES UTILITAIRES POUR LE TEMPLATE ==========

  // Code de la vente
  getVenteCode(): string {
    return this.vente?.code || `Vente #${this.vente?.id || ''}`;
  }

  // Date de vente
  getDateVente(): string {
    return this.vente?.dateVente || '';
  }

  // Mode de paiement
  getModePaiement(): string {
    return this.vente?.modePayement?.code || 'Non spécifié';
  }

  // Nom complet du client
  getClientName(): string {
    if (this.vente?.nomClient && this.vente?.prenomClient) {
      return `${this.vente.nomClient} ${this.vente.prenomClient}`;
    } else if (this.vente?.nomClient) {
      return this.vente.nomClient;
    }
    return 'Non spécifié';
  }

  // Nombre total d'articles
  getTotalArticles(): number {
    return this.dataSource?.data?.length || 0;
  }

  // Montant total de la vente
  getMontantTotal(): number {
    return this.vente?.montantTotal || this.total;
  }

  // Vérifie si la vente a un commentaire
  hasCommentaire(): boolean {
    return !!this.vente?.commentaire;
  }
}