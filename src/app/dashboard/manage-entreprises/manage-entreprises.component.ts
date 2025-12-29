import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { EntrepriseDto, EntreprisesService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { EntrepriseComponent } from '../dialog/entreprise/entreprise.component';

@Component({
  selector: 'app-manage-entreprises',
  templateUrl: './manage-entreprises.component.html',
  styleUrls: ['./manage-entreprises.component.scss']
})
export class ManageEntreprisesComponent {

  displayColumns: string[] = ["nom", "description", "codeFiscal", "email", "numTel", "adresseDto", "siteWeb", "action"];
  dataSource: MatTableDataSource<EntrepriseDto> = new MatTableDataSource<EntrepriseDto>([]);
  responseMessage: string = '';
  filterForm: FormGroup;

  entreprises: EntrepriseDto[] = [];
  selectedentreprise: EntrepriseDto = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private entrepriseService: EntreprisesService,
    private ngxService: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.filterForm = this.formBuilder.group({
      entreprise: [''],
      ville: ['']
    });
  }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(): void {
    this.entrepriseService.getAllEntreprises().subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.entreprises = res;
      },
      (error: any) => {
        this.ngxService.stop();
        this.responseMessage = error.error?.message || GlobalConstants.genericErrorMessage;
        this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  getAllentreprises(): void {
    this.entrepriseService.getAllEntreprises().subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.entreprises = res;
      },
      (error: any) => {
        this.ngxService.stop();
        this.responseMessage = error.error?.message || GlobalConstants.genericErrorMessage;
        this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  handleAdd(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Ajouter'
    };
    dialogConfig.width = "850px";

    const dialogRef = this.dialog.open(EntrepriseComponent, dialogConfig);

    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddEntreprise.subscribe(
      (res: any) => {
        this.ngxService.start();
        this.tableData();
      }
    );
  }

  handleEdit(values: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Modifier',
      data: values
    };
    dialogConfig.width = "850px";

    const dialogRef = this.dialog.open(EntrepriseComponent, dialogConfig);

    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onUpdateEntreprise.subscribe(
      (res: any) => {
        this.ngxService.start();
        this.tableData();
      }
    );
  }

  handleDelete(values: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: `Supprimer l'entreprise ${values.nom}`
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);

    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res) => {
      this.ngxService.start();
      this.delete(values.id);
      dialogRef.close();
    });
  }

  delete(id: any): void {
    this.entrepriseService.deleteEntreprise(id).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.tableData();
        this.snackbarService.openSnackbar("Entreprise supprimée avec succès", "success");
      },
      (error: any) => {
        this.ngxService.stop();
        this.responseMessage = error.error?.message || GlobalConstants.genericErrorMessage;
        this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  // Méthodes pour les statistiques
  getUniqueVillesCount(): number {
    if (!this.dataSource?.data) return 0;
    const villes = new Set(
      this.dataSource.data
        .filter((entreprise: EntrepriseDto) => entreprise.adresseDto?.ville)
        .map((entreprise: EntrepriseDto) => entreprise.adresseDto!.ville!)
    );
    return villes.size;
  }

  getWithContactCount(): number {
    if (!this.dataSource?.data) return 0;
    return this.dataSource.data.filter((entreprise: EntrepriseDto) =>
      entreprise.email || entreprise.numTel
    ).length;
  }

  getWithWebsiteCount(): number {
    if (!this.dataSource?.data) return 0;
    return this.dataSource.data.filter((entreprise: EntrepriseDto) =>
      entreprise.siteWeb
    ).length;
  }

  // Méthodes pour les filtres
  getUniqueVilles(): string[] {
    if (!this.dataSource?.data) return [];
    const villes = this.dataSource.data
      .filter((entreprise: EntrepriseDto) => entreprise.adresseDto?.ville)
      .map((entreprise: EntrepriseDto) => entreprise.adresseDto!.ville!)
      .filter((ville, index, self) => self.indexOf(ville) === index);

    return villes.sort();
  }

  onSearch(): void {
    const filters = this.filterForm.value;

    this.entrepriseService.getAllEntreprises().subscribe(
      (res: any) => {
        let filteredData = res;

        // Filtre par entreprise
        if (filters.entreprise && filters.entreprise.id) {
          filteredData = filteredData.filter((entreprise: any) =>
            entreprise.id === filters.entreprise.id
          );
        }

        // Filtre par ville
        if (filters.ville) {
          filteredData = filteredData.filter((entreprise: any) =>
            entreprise.adresseDto?.ville === filters.ville
          );
        }

        this.dataSource = new MatTableDataSource(filteredData);
        this.dataSource.paginator = this.paginator;
      },
      (error: any) => {
        this.snackbarService.openSnackbar(
          error.error?.message || 'Erreur lors de la recherche',
          GlobalConstants.error
        );
      }
    );
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.tableData();
  }

  viewDetails(entreprise: EntrepriseDto): void {
    // Implémentez la logique pour voir les détails
    console.log('Voir détails:', entreprise);
  }

  exportToExcel(): void {
    // Implémentez l'export Excel
    console.log('Export Excel');
  }

  ngAfterViewInit(): void {
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
}