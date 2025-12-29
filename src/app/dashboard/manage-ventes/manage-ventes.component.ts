import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationExtras, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import {
  ArticleDto,
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
export class ManageVentesComponent {

  displayColumns: string[] = ["code", "dateVente", "commentaire", "action"];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  responseMessage: any;
  totalCommande = 0;

  comVenteForm: FormGroup;
  dataVentes: any[] = [];

  displayColumnVentes: string[] = ["code", "unite", "quantite", "prixUnitaire", "total", "action"];
  lignesCommande: LigneVenteDto[] = [];

  dataModePayement: ModePayementDto[] = [];
  dataConditions: ConditionAVDto[] = [];
  dataUnites: UniteDto[] = [];
  selectedCondition: ConditionAVDto = {};

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
      mode: [null, Validators.required],
      article: [null, Validators.required],
      unite: [null, Validators.required],
      quantite: [1, [Validators.required, Validators.min(1)]],
      prixUnitaire: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.ngxService.start();
    this.loadData();
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
    this.venteService.getAllVentes().subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.dataVentes = res;
        this.dataSource.data = res;
      },
      (error: any) => {
        this.ngxService.stop();
        this.handleError(error);
      }
    );
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
      } else {
        // Ajouter nouvelle ligne
        this.lignesCommande.push(ligneCmd);
      }

      this.calculerTotalCommande();
      this.resetLigneForm();
      this.snackbarService.openSnackbar("Article ajouté à la commande", "success");
    }
  }

  removeLigneVente(ligne: LigneVenteDto): void {
    const index = this.lignesCommande.indexOf(ligne);
    if (index > -1) {
      this.lignesCommande.splice(index, 1);
      this.calculerTotalCommande();
      this.snackbarService.openSnackbar("Article retiré de la commande", "success");
    }
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
    this.lignesCommande = [];
    this.totalCommande = 0;
    this.comVenteForm.reset({
      mode: null,
      article: null,
      unite: null,
      quantite: 1,
      prixUnitaire: 0
    });
    this.dataUnites = [];
    this.selectedCondition = {};
  }

  handleAdd(): void {
    if (this.comVenteForm.get('mode')?.invalid) {
      this.snackbarService.openSnackbar("Veuillez sélectionner un mode de paiement", "error");
      return;
    }

    if (this.lignesCommande.length === 0) {
      this.snackbarService.openSnackbar("Veuillez ajouter au moins un article", "error");
      return;
    }

    this.ngxService.start();

    const venteDto: VenteDto = {
      modePayement: this.comVenteForm.get('mode')?.value,
      dateVente: new Date().toISOString(),
      ligneVentes: this.lignesCommande
    };

    this.venteService.saveVente(venteDto).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.snackbarService.openSnackbar("Vente enregistrée avec succès", "success");
        this.clearForm();
        this.getAllVentes();
      },
      (error: any) => {
        this.ngxService.stop();
        this.handleError(error);
      }
    );
  }

  handleDelete(vente: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: `Supprimer la vente ${vente.code || '#' + vente.id}`
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    dialogRef.componentInstance.onEmitStatusChange.subscribe((res: any) => {
      this.ngxService.start();
      this.deleteVente(vente.id);
      dialogRef.close();
    });
  }

  deleteVente(id: any): void {
    this.venteService.deleteVente(id).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.getAllVentes();
        this.snackbarService.openSnackbar(res?.message || "Vente supprimée avec succès", "success");
      },
      (error: any) => {
        this.ngxService.stop();
        this.handleError(error);
      }
    );
  }

  handleView(vente: any): void {
    const navigationExtras: NavigationExtras = {
      state: {
        data: vente,
      },
    };
    this.router.navigate(['/workspace/dashboard/ventes', vente.id], navigationExtras);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private handleError(error: any): void {
    if (error.error?.message) {
      this.responseMessage = error.error?.message;
    } else {
      this.responseMessage = GlobalConstants.genericErrorMessage;
    }
    this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
  }
}