import { Component, Input, ChangeDetectorRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NavigationExtras, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ArticlesService, ClientsService, CommandeClientsService, CommandeFournisseursService, LigneCommandeClientDto, VentesService } from 'src/app/api';
import { ConfirmationComponent } from 'src/app/dashboard/dialog/confirmation/confirmation.component';
import { LigneCommandeComponent } from 'src/app/dashboard/dialog/ligne-commande/ligne-commande.component';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-details-lignes-commandes',
  templateUrl: './details-lignes-commandes.component.html',
  styleUrls: ['./details-lignes-commandes.component.scss']
})
export class DetailsLignesCommandesComponent implements OnInit, AfterViewInit {

  displayColumns: string[] = ["article", "unite", "quantite", "prixUnitaire", "total", "action"];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input()
  idCommande: any;

  @Input()
  origin: any = '';

  total: number = 0;
  responseMessage: any;

  constructor(
    private clientService: ClientsService,
    private articleService: ArticlesService,
    private comClientService: CommandeClientsService,
    private comFournisseurService: CommandeFournisseursService,
    private venteService: VentesService,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    if (this.origin == 'client') {
      this.tableDataClients();
    } else if (this.origin == 'fournisseur') {
      this.tableDataFournisseurs();
    } else {
      this.tableDataVentes();
    }
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  updateTotal(data: any[]) {
    console.log("Mise à jour du total", data);
    this.total = data.reduce((acc: number, curr: { prixUnitaire: number; quantite: number; }) =>
      acc + (curr.prixUnitaire * curr.quantite), 0);
    this.cdr.detectChanges();
  }

  calculateLineTotal(element: any): number {
    return (element.prixUnitaire || 0) * (element.quantite || 0);
  }

  calculateAveragePrice(): number {
    if (!this.dataSource?.data?.length) return 0;
    const totalPrice = this.dataSource.data.reduce((acc: number, curr: any) =>
      acc + (curr.prixUnitaire || 0), 0);
    return totalPrice / this.dataSource.data.length;
  }

  calculateTotalQuantity(): number {
    if (!this.dataSource?.data?.length) return 0;
    return this.dataSource.data.reduce((acc: number, curr: any) =>
      acc + (curr.quantite || 0), 0);
  }

  getPaginationInfo(): string {
    if (!this.paginator) return '';

    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = Math.min(startIndex + this.paginator.pageSize, this.paginator.length);

    if (this.paginator.length === 0) {
      return 'Aucun résultat';
    }

    return `${startIndex + 1} - ${endIndex} sur ${this.paginator.length}`;
  }

  tableDataVentes() {
    this.venteService.findAllLigneVenteByVenteId(this.idCommande).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.updateTotal(res);
        this.cdr.detectChanges();
      },
      (error) => {
        this.ngxService.stop();
        this.responseMessage = error.error?.message || GlobalConstants.genericErrorMessage;
        this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  tableDataClients() {
    this.comClientService.findAllLignesCommandesClientByCommandeClientId(this.idCommande).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.updateTotal(res);
        this.cdr.detectChanges();
      },
      (error) => {
        this.ngxService.stop();
        this.responseMessage = error.error?.message || GlobalConstants.genericErrorMessage;
        this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  tableDataFournisseurs() {
    this.comFournisseurService.findAllLignesCommandesFournisseurByCommandeFournisseurId(this.idCommande).subscribe(
      (res: any) => {
        this.ngxService.stop();
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.updateTotal(res);
        this.cdr.detectChanges();
      },
      (error) => {
        this.ngxService.stop();
        this.responseMessage = error.error?.message || GlobalConstants.genericErrorMessage;
        this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  handleDelete(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: `Supprimer la ligne de ${this.origin === 'ventes' ? 'vente' : 'commande'} ${values.article?.codeArticle || ''}?`
    };

    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((res) => {
      this.ngxService.start();
      this.delete(values.id);
      dialogRef.close();
    });
  }

  delete(id: any) {
    if (this.origin == 'client') {
      this.comClientService.deleteArticle(this.idCommande, id).subscribe(
        (res: any) => {
          this.handleDeleteSuccess(res);
        },
        (error: any) => {
          this.handleDeleteError(error);
        }
      );
    } else if (this.origin == 'fournisseur') {
      this.comFournisseurService.deleteFournisseurArticle(this.idCommande, id).subscribe(
        (res: any) => {
          this.handleDeleteSuccess(res);
        },
        (error: any) => {
          this.handleDeleteError(error);
        }
      );
    } else {
      this.venteService.deleteVente(this.idCommande, id).subscribe(
        (res: any) => {
          this.handleDeleteSuccess(res);
        },
        (error: any) => {
          this.handleDeleteError(error);
        }
      );
    }
  }

  private handleDeleteSuccess(res: any) {
    this.ngxService.stop();
    if (this.origin == 'client') {
      this.tableDataClients();
    } else if (this.origin == 'fournisseur') {
      this.tableDataFournisseurs();
    } else {
      this.tableDataVentes();
    }
    this.responseMessage = res?.message;
    this.snackbarService.openSnackbar("Ligne supprimée avec succès", "success");
  }

  private handleDeleteError(error: any) {
    this.ngxService.stop();
    this.responseMessage = error.error?.message || GlobalConstants.genericErrorMessage;
    this.snackbarService.openSnackbar(this.responseMessage, GlobalConstants.error);
  }

  handleEdit(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      action: 'Modifier',
      data: values,
      origin: this.origin,
      idCommande: this.idCommande
    };
    dialogConfig.width = "850px";

    const dialogRef = this.dialog.open(LigneCommandeComponent, dialogConfig);

    this.router.events.subscribe(() => {
      dialogRef.close();
    });

    const sub = dialogRef.componentInstance.onUpdate.subscribe((res: any) => {
      this.ngxService.start();
      if (this.origin == 'client') {
        this.tableDataClients();
      } else if (this.origin == 'fournisseur') {
        this.tableDataFournisseurs();
      } else {
        this.tableDataVentes();
      }
    });
  }

  isRowEven(index: number): boolean {
    return index % 2 === 0;
  }

  isRowOdd(index: number): boolean {
    return index % 2 !== 0;
  }
}