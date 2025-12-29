import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { UtilisateurDto, UtilisateursEntreprisesService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';
import { UserComponent } from '../dialog/user/user.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent {

  displayColumns: string[] = ["username", "email", "nom", "prenom", "entreprise", "role", "action"];
  dataSource: MatTableDataSource<UtilisateurDto> = new MatTableDataSource<UtilisateurDto>([]);
  responseMessage: string = '';
  filterForm: FormGroup;

  utilisateurs: UtilisateurDto[] = [];
  selectedUtilisateur: UtilisateurDto = {};

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private utilisateurService: UtilisateursEntreprisesService,
    private ngxService: NgxUiLoaderService,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.filterForm = this.formBuilder.group({
      utilisateur: [''],
      role: ['']
    });
  }

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
    this.filterForm = this.formBuilder.group({
      utilisateur: [''],
      role: ['']
    });
  }

  tableData(): void {
    this.utilisateurService.getAllUtilisateurs1().subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.utilisateurs = res;
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

    const dialogRef = this.dialog.open(UserComponent, dialogConfig);

    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAddUser.subscribe(
      (res: any) => {
        this.ngxService.start();
        this.tableData();
      }
    );
  }

  handleDelete(values: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: `Supprimer l'utilisateur ${values.nom}`
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);

    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res) => {
      this.ngxService.start();
      this.delete(values.id);
      dialogRef.close();
    });
  }

  delete(id: any): void {
    this.utilisateurService.deleteUtilisateur(id).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.tableData();
        this.snackbarService.openSnackbar("Utilisateur supprimé avec succès", "success");
      },
      (error: any) => {
        this.ngxService.stop();
        this.responseMessage = error.error?.message || GlobalConstants.genericErrorMessage;
        this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  // Méthodes pour les statistiques
  getRoleCount(role: string): number {
    if (!this.dataSource?.data) return 0;
    return this.dataSource.data.filter((user: UtilisateurDto) => user.role === role).length;
  }

  getUniqueEntreprisesCount(): number {
    if (!this.dataSource?.data) return 0;
    const entreprises = new Set(
      this.dataSource.data
        .filter((user: UtilisateurDto) => user.entrepriseDto?.nom)
        .map((user: UtilisateurDto) => user.entrepriseDto!.nom!)
    );
    return entreprises.size;
  }

  // Méthodes pour les filtres
  getRoleIcon(role: string): string {
    switch(role) {
      case 'ADMIN': return 'admin_panel_settings';
      case 'USER': return 'person';
      case 'MANAGER': return 'manage_accounts';
      default: return 'badge';
    }
  }

  getRoleLabel(role: string): string {
    switch(role) {
      case 'ADMIN': return 'Administrateur';
      case 'USER': return 'Utilisateur';
      case 'MANAGER': return 'Manager';
      default: return 'Tous les rôles';
    }
  }

  getRoleIconColor(role: string): string {
    switch(role) {
      case 'ADMIN': return '#2196F3';
      case 'USER': return '#4CAF50';
      case 'MANAGER': return '#FF9800';
      default: return '#666';
    }
  }

  getRoleClass(role?: string): string {
    if (!role) return '';
    switch(role) {
      case 'ADMIN': return 'role-admin';
      case 'USER': return 'role-user';
      case 'MANAGER': return 'role-manager';
      default: return '';
    }
  }

  onSearch(): void {
    const filters = this.filterForm.value;

    this.utilisateurService.getAllUtilisateurs1().subscribe(
      (res: any) => {
        let filteredData = res;

        // Filtre par utilisateur
        if (filters.utilisateur && filters.utilisateur.id) {
          filteredData = filteredData.filter((user: any) =>
            user.id === filters.utilisateur.id
          );
        }

        // Filtre par rôle
        if (filters.role) {
          filteredData = filteredData.filter((user: any) =>
            user.role === filters.role
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

  editUser(user: UtilisateurDto): void {
    // Implémentez la logique d'édition
    console.log('Éditer:', user);
    // Vous pouvez ouvrir le même dialog que pour l'ajout mais en mode édition
  }

  viewDetails(user: UtilisateurDto): void {
    // Implémentez la logique pour voir les détails
    console.log('Voir détails:', user);
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