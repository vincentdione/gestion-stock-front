import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatTableDataSource } from '@angular/material/table';
import { Router } from "@angular/router";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { ModesPayementService } from "src/app/api";
import { SnackbarService } from "src/app/services/snackbar.service";
import { GlobalConstants } from 'src/app/shared/GlobalConstants';
import { ModePayementComponent } from '../dialog/mode-payement/mode-payement.component';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-manage-mode-payement',
  templateUrl: './manage-mode-payement.component.html',
  styleUrls: ['./manage-mode-payement.component.scss']
})
export class ManageModePayementComponent {

  displayColumns: string[] = ["code", "designation", "action"];
  additionalColumns: string[] = ["type", "status"];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  responseMessage: string = '';

  selectedType: string | null = null;
  showAdditionalColumns = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('input') input!: ElementRef;

  constructor(
    private modePayementService: ModesPayementService,
    private ngxService: NgxUiLoaderService,
    private snackbarService: SnackbarService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.ngxService.start();
    this.tableData();
  }

  tableData(): void {
    this.modePayementService.getAllModes().subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
      },
      (error: any) => {
        this.ngxService.stop();
        this.responseMessage = error.error?.message || GlobalConstants.genericErrorMessage;
        this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearSearch(inputElement: HTMLInputElement): void {
    inputElement.value = '';
    this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  handleAdd(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Ajouter'
    };
    dialogConfig.width = "850px";

    const dialogRef = this.dialog.open(ModePayementComponent, dialogConfig);

    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onAdd.subscribe(
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

    const dialogRef = this.dialog.open(ModePayementComponent, dialogConfig);

    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onUpdate.subscribe(
      (res: any) => {
        this.ngxService.start();
        this.tableData();
      }
    );
  }

  handleDelete(values: any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: `Supprimer le mode de paiement ${values.code || values.designation}`
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);

    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res) => {
      this.ngxService.start();
      this.delete(values.id);
      dialogRef.close();
    });
  }

  delete(id: any): void {
    this.modePayementService.deleteMode(id).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.tableData();
        this.snackbarService.openSnackbar("Mode de paiement supprimé avec succès", "success");
      },
      (error: any) => {
        this.ngxService.stop();
        this.responseMessage = error.error?.message || GlobalConstants.genericErrorMessage;
        this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  // Méthodes pour les statistiques
  getActiveCount(): number {
    if (!this.dataSource?.data) return 0;
    return this.dataSource.data.filter((payment: any) =>
      payment.actif !== false
    ).length;
  }

  getElectronicCount(): number {
    if (!this.dataSource?.data) return 0;
    return this.dataSource.data.filter((payment: any) =>
      payment.type === 'electronique'
    ).length;
  }

  getTraditionalCount(): number {
    if (!this.dataSource?.data) return 0;
    return this.dataSource.data.filter((payment: any) =>
      payment.type === 'traditionnel'
    ).length;
  }

  // Méthodes pour les filtres
  filterByType(type: string | null): void {
    this.selectedType = type;

    if (!type) {
      this.dataSource.filter = '';
    } else {
      this.dataSource.filter = type;
    }

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  resetFilters(inputElement?: HTMLInputElement): void {
    this.selectedType = null;

    if (inputElement) {
      inputElement.value = '';
    }

    this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Méthodes pour les icônes et labels
  getPaymentIcon(type?: string): string {
    if (!type) return 'payments';

    switch(type) {
      case 'electronique': return 'credit_card';
      case 'traditionnel': return 'receipt';
      case 'mobile': return 'smartphone';
      default: return 'payments';
    }
  }

  getTypeIcon(type?: string): string {
    if (!type) return 'payments';

    switch(type) {
      case 'electronique': return 'credit_card';
      case 'traditionnel': return 'receipt';
      case 'mobile': return 'smartphone';
      default: return 'payments';
    }
  }

  getTypeLabel(type?: string): string {
    if (!type) return 'Standard';

    switch(type) {
      case 'electronique': return 'Électronique';
      case 'traditionnel': return 'Traditionnel';
      case 'mobile': return 'Mobile';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }

  getTypeClass(type?: string): string {
    if (!type) return 'type-default';

    switch(type) {
      case 'electronique': return 'type-electronique';
      case 'traditionnel': return 'type-traditionnel';
      case 'mobile': return 'type-mobile';
      default: return 'type-default';
    }
  }

  // Méthodes pour les colonnes dynamiques
  getDisplayColumns(): string[] {
    let columns = [...this.displayColumns];

    if (this.showAdditionalColumns) {
      columns = columns.filter(col => col !== 'action');
      columns = [...columns, ...this.additionalColumns.filter(col => this.hasColumnData(col))];
      columns.push('action');
    }

    return columns;
  }

  hasColumnData(column: string): boolean {
    if (!this.dataSource?.data) return false;

    switch(column) {
      case 'type':
        return this.dataSource.data.some((payment: any) => payment.type);
      case 'status':
        return this.dataSource.data.some((payment: any) => payment.actif !== undefined);
      default:
        return false;
    }
  }

  toggleColumns(): void {
    this.showAdditionalColumns = !this.showAdditionalColumns;
  }

  // Méthodes utilitaires
  getFilteredCount(): number {
    if (!this.dataSource?.filteredData) return 0;
    return this.dataSource.filteredData.length;
  }

  getFilteredData(): any[] {
    if (!this.dataSource?.filteredData) return [];
    return this.dataSource.filteredData;
  }

  viewDetails(payment: any): void {
    // Implémentez la logique pour voir les détails
    console.log('Voir détails:', payment);
  }

  toggleStatus(payment: any): void {
    // Implémentez la logique pour changer le statut
    console.log('Changer statut:', payment);

    // Exemple: this.modePayementService.toggleStatus(payment.id, !payment.actif).subscribe(...)
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