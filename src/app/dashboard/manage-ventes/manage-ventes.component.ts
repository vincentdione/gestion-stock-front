import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  ConditionAVDto,
  ConditionsDeVentesService,
  LigneVenteDto,
  ModePayementDto,
  ModesPayementService,
  UniteDto,
  UnitsService,
  VenteDto,
  VentesService
} from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-ventes',
  templateUrl: './manage-ventes.component.html',
  styleUrls: ['./manage-ventes.component.scss']
})
export class ManageVentesComponent implements OnInit {

  displayColumns: string[] = ["code", "dateVente", "nomClient", "montantTotal", "action"];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  responseMessage: any;
  totalCommande = 0;
  showClientInfo: boolean = true;


  comVenteForm: FormGroup;
  dataVentes: VenteDto[] = [];

  displayColumnVentes: string[] = ["code", "unite", "quantite", "prixUnitaire", "total", "action"];
  lignesCommande: LigneVenteDto[] = [];

  dataModePayement: ModePayementDto[] = [];
  dataConditions: ConditionAVDto[] = [];
  dataUnites: UniteDto[] = [];
  selectedCondition: ConditionAVDto = {};

  // Mode édition
  isEditMode = false;
  venteId: number | null = null;
  isSubmitting = false;

  constructor(
    private venteService: VentesService,
    private ngxService: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private conditionAV: ConditionsDeVentesService,
    private uniteService: UnitsService,
    private modePayementService: ModesPayementService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.comVenteForm = this.formBuilder.group({
      // Champs client (optionnels)
      nomClient: [''],
      prenomClient: [''],
      telephone: [''],
      adresse: [''],

      // Mode de paiement (obligatoire)
      mode: [null, Validators.required],

      // Champs pour ajouter des articles
      article: [null, Validators.required],
      unite: [null, Validators.required],
      quantite: [1, [Validators.required, Validators.min(1)]],
      prixUnitaire: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.ngxService.start();
    this.loadData();

    // Vérifier si on est en mode édition
    this.checkEditMode();
  }

  checkEditMode(): void {
    // Vérifier si on vient d'une page d'édition via le state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['edit']) {
      this.isEditMode = true;
      const vente = navigation.extras.state['vente'];
      if (vente && vente.id) {
        this.loadVenteForEdit(vente.id);
      }
    }
  }

  loadData(): void {
    this.getAllVentes();
    this.getAllModePayement();
    this.getAllConditions();
  }

  getAllModePayement(): void {
    this.modePayementService.getAllModes().subscribe(
      (res: any) => {
        this.dataModePayement = res;
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  getAllConditions(): void {
    this.conditionAV.getAllConditionWithDistincts().subscribe(
      (res: any) => {
        this.dataConditions = res;
      },
      (error) => {
        this.handleError(error);
      }
    );
  }

  loadVenteForEdit(id: number): void {
    this.ngxService.start();
    this.venteService.getVenteById(id).subscribe(
      (res: VenteDto) => {
        this.ngxService.stop();
        this.venteId = id;
        this.patchFormWithVente(res);
      },
      (error: any) => {
        this.ngxService.stop();
        this.handleError(error);
      }
    );
  }

  toggleClientInfo(): void {
    this.showClientInfo = !this.showClientInfo;
  }

  patchFormWithVente(vente: VenteDto): void {
    // Remplir les champs client
    this.comVenteForm.patchValue({
      nomClient: vente.nomClient || '',
      prenomClient: vente.prenomClient || '',
      telephone: vente.numero || '',
      adresse: vente.adresse || '',
      mode: vente.modePayement
    });

    // Charger les lignes de vente existantes
    if (vente.ligneVentes && vente.ligneVentes.length > 0) {
      this.lignesCommande = vente.ligneVentes;
      this.calculerTotalCommande();
    }
  }

  onArticleSelected(condition: ConditionAVDto): void {
    if (condition?.article?.id) {
      this.selectedCondition = condition;
      this.comVenteForm.patchValue({
        prixUnitaire: condition.prixUnitaireTtc
      });

      // Charger les unités pour cet article
      this.uniteService.getAllUniteByArticle(condition.article.id).subscribe(
        (res: any) => {
          this.dataUnites = res;

          // Sélectionner l'unité par défaut si disponible
          if (res.length > 0) {
            const defaultUnite = res.find((u: UniteDto) => u.nom === condition.unite?.nom) || res[0];
            this.comVenteForm.patchValue({
              unite: defaultUnite
            });
          }
        },
        (error) => {
          this.dataUnites = [];
        }
      );
    }
  }

  onUniteSelected(unite: UniteDto): void {
    // Trouver la condition correspondant à l'unité sélectionnée
    const conditionWithSelectedUnite = this.dataConditions.find(
      condition => condition.unite?.id === unite.id &&
                  condition.article?.id === this.selectedCondition.article?.id
    );

    if (conditionWithSelectedUnite) {
      this.selectedCondition = conditionWithSelectedUnite;
      this.comVenteForm.patchValue({
        prixUnitaire: conditionWithSelectedUnite.prixUnitaireTtc
      });
    }
  }

  getAllVentes(): void {
    this.venteService.getLatestVentes().subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.dataVentes = res;
        this.dataSource.data = res.map((vente: VenteDto) => ({
          ...vente,
          montantTotal: this.calculerMontantVente(vente),
          nomComplet: `${vente.nomClient || ''} ${vente.prenomClient || ''}`.trim() || 'Non renseigné'
        }));
      },
      (error: any) => {
        this.ngxService.stop();
        this.handleError(error);
      }
    );
  }

  calculerMontantVente(vente: VenteDto): number {
    if (!vente.ligneVentes || vente.ligneVentes.length === 0) {
      return 0;
    }
    return vente.ligneVentes.reduce((total, ligne) => {
      return total + (ligne.prixUnitaire || 0) * (ligne.quantite || 0);
    }, 0);
  }

  addLigneVente(): void {
    if (this.comVenteForm.valid) {
      const formData = this.comVenteForm.value;

      const ligneCmd: LigneVenteDto = {
        article: formData.article?.article,
        unite: formData.unite?.nom,
        prixUnitaire: formData.prixUnitaire,
        quantite: formData.quantite
      };

      // Vérifier si l'article existe déjà
      const existingIndex = this.lignesCommande.findIndex(
        ligne => ligne.article?.id === ligneCmd.article?.id &&
                ligne.unite === ligneCmd.unite
      );

      if (existingIndex > -1) {
        // Mettre à jour la quantité
        this.lignesCommande[existingIndex].quantite =
          (this.lignesCommande[existingIndex].quantite || 0) + ligneCmd.quantite!;
        this.snackbarService.openSnackbar("Quantité mise à jour", "success");
      } else {
        // Ajouter nouvelle ligne
        this.lignesCommande.push(ligneCmd);
        this.snackbarService.openSnackbar("Article ajouté à la commande", "success");
      }

      this.calculerTotalCommande();
      this.resetLigneForm();
    }
  }

  removeLigneVente(ligne: LigneVenteDto): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: `Supprimer l'article ${ligne.article?.designation || ''} de la commande ?`
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    dialogRef.componentInstance.onEmitStatusChange.subscribe((confirmed: boolean) => {
      if (confirmed) {
        const index = this.lignesCommande.indexOf(ligne);
        if (index > -1) {
          this.lignesCommande.splice(index, 1);
          this.calculerTotalCommande();
          this.snackbarService.openSnackbar("Article retiré de la commande", "success");
        }
      }
      dialogRef.close();
    });
  }

  calculerTotalCommande(): void {
    this.totalCommande = this.lignesCommande.reduce((total, ligne) => {
      return total + (ligne.prixUnitaire || 0) * (ligne.quantite || 0);
    }, 0);
  }

  resetLigneForm(): void {
    this.comVenteForm.patchValue({
      article: null,
      unite: null,
      quantite: 1,
      prixUnitaire: 0
    });
    this.dataUnites = [];
    this.selectedCondition = {};
  }

  clearForm(): void {
    if (this.isSubmitting) return;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: this.isEditMode
        ? 'Annuler les modifications ?'
        : 'Vider le formulaire ?'
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    dialogRef.componentInstance.onEmitStatusChange.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.lignesCommande = [];
        this.totalCommande = 0;
        this.comVenteForm.reset({
          nomClient: '',
          prenomClient: '',
          telephone: '',
          adresse: '',
          mode: null,
          article: null,
          unite: null,
          quantite: 1,
          prixUnitaire: 0
        });
        this.dataUnites = [];
        this.selectedCondition = {};
        this.isEditMode = false;
        this.venteId = null;

        this.snackbarService.openSnackbar(
          this.isEditMode ? 'Modifications annulées' : 'Formulaire réinitialisé',
          "success"
        );
      }
      dialogRef.close();
    });
  }

  handleAdd(): void {
    if (this.isSubmitting) return;

    if (this.comVenteForm.get('mode')?.invalid) {
      this.snackbarService.openSnackbar("Veuillez sélectionner un mode de paiement", "error");
      return;
    }

    if (this.lignesCommande.length === 0) {
      this.snackbarService.openSnackbar("Veuillez ajouter au moins un article", "error");
      return;
    }

    this.isSubmitting = true;
    this.ngxService.start();

    // Récupérer les valeurs du formulaire
    const formValues = this.comVenteForm.value;

    const venteDto: VenteDto = {
      nomClient: formValues.nomClient ? formValues.nomClient.trim() : undefined,
      prenomClient: formValues.prenomClient ? formValues.prenomClient.trim() : undefined,
      numero: formValues.telephone ? formValues.telephone.trim() : undefined,
      adresse: formValues.adresse ? formValues.adresse.trim() : undefined,
      modePayement: formValues.mode,
      dateVente: new Date().toISOString(),
      ligneVentes: this.lignesCommande.map(ligne => ({
        ...ligne,
        article: {
          id: ligne.article?.id,
          codeArticle: ligne.article?.codeArticle,
          designation: ligne.article?.designation
        }
      }))
    };

    console.log("Données à envoyer:", venteDto);

    if (this.isEditMode && this.venteId) {
      // Mode édition
      venteDto.id = this.venteId;
      // this.updateVente(venteDto);
    } else {
      // Mode création
      this.createVente(venteDto);
    }
  }

  createVente(venteDto: VenteDto): void {
    console.log("=========================")
    console.log(venteDto)
    console.log("=========================")
    this.venteService.saveVente(venteDto).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.isSubmitting = false;
        this.snackbarService.openSnackbar("Vente enregistrée avec succès", "success");
        this.resetAfterSuccess();
        this.getAllVentes();
      },
      (error: any) => {
        this.ngxService.stop();
        this.isSubmitting = false;
        this.handleError(error);
      }
    );
  }



  resetAfterSuccess(): void {
    this.lignesCommande = [];
    this.totalCommande = 0;
    this.comVenteForm.reset({
      nomClient: '',
      prenomClient: '',
      telephone: '',
      adresse: '',
      mode: null,
      article: null,
      unite: null,
      quantite: 1,
      prixUnitaire: 0
    });
    this.dataUnites = [];
    this.selectedCondition = {};
    this.isEditMode = false;
    this.venteId = null;
  }

  handleDelete(vente: VenteDto): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: `Supprimer la vente ${vente.code || '#' + vente.id} ?`
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    dialogRef.componentInstance.onEmitStatusChange.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.ngxService.start();
        this.deleteVente(vente.id!);
      }
      dialogRef.close();
    });
  }

  deleteVente(id: number): void {
    this.venteService.deleteVente(id).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.getAllVentes();
        this.snackbarService.openSnackbar("Vente supprimée avec succès", "success");
      },
      (error: any) => {
        this.ngxService.stop();
        this.handleError(error);
      }
    );
  }

  handleView(vente: VenteDto): void {
    const navigationExtras: NavigationExtras = {
      state: {
        data: vente
      }
    };
    this.router.navigate(['/workspace/dashboard/ventes', vente.id], navigationExtras);
   }

  handleEdit(vente: VenteDto): void {
    // Navigation vers la même page avec mode édition
    const navigationExtras: NavigationExtras = {
      state: {
        edit: true,
        vente: vente
      }
    };
    this.router.navigate(['/workspace/dashboard/ventes'], navigationExtras);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getPageTitle(): string {
    return this.isEditMode ? 'Modifier la vente' : 'Nouvelle vente';
  }

  getSubmitButtonText(): string {
    return this.isEditMode ? 'Modifier la vente' : 'Valider la vente';
  }

  canAddArticle(): boolean {
    return !!(this.comVenteForm.get('article')?.value &&
             this.comVenteForm.get('quantite')?.value &&
             this.comVenteForm.get('unite')?.value);
  }

  private handleError(error: any): void {
    if (error.error?.message) {
      this.responseMessage = error.error.message;
    } else {
      this.responseMessage = GlobalConstants.genericErrorMessage;
    }
    this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
  }
}