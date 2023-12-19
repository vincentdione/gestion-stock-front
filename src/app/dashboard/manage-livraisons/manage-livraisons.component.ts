import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ArticleDto, LivraisonDto, LivraisonsService } from 'src/app/api';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/GlobalConstants';

@Component({
  selector: 'app-manage-livraisons',
  templateUrl: './manage-livraisons.component.html',
  styleUrls: ['./manage-livraisons.component.scss']
})
export class ManageLivraisonsComponent {

  displayColumns : string[] = ["code","dateLivraison","etat","client","livreur","action"]

  dataSource : any;
  responseMessage : any;
  filterForm:any = FormGroup;

  livraison: LivraisonDto = {}
  articles: ArticleDto []= []
  selectedArticle : ArticleDto = {}
  @ViewChild(MatPaginator)
  paginator: MatPaginator | undefined;



  constructor(private serviceLivraison: LivraisonsService,
    private ngxService:NgxUiLoaderService,  private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,private router:Router, private dialog : MatDialog) { }


    ngOnInit(): void {
      this.ngxService.start()
      this.refreshTableData();
      this.filterForm = this.formBuilder.group({
        article: [''], // Définissez les valeurs par défaut si nécessaire
      });
    }

    refreshTableData(res?: any) {
      if (res) {
        this.dataSource = new MatTableDataSource(res)
        this.dataSource.paginator = this.paginator;
      } else {
          this.tableData()
      }
    }


    tableData(){
        this.serviceLivraison.getAllLivraisons().subscribe((res:any) => {
           this.ngxService.stop()
           this.dataSource = new MatTableDataSource(res)
           console.log(res)
           this.dataSource.paginator = this.paginator;
        },(error:any)=>{
          this.ngxService.stop()
          if(error.error?.message){
            this.responseMessage = error.error?.message
        }
        else {
          this.responseMessage = GlobalConstants.genericErrorMessage
        }
        this.snackbarService.openSnackbar(this.responseMessage,GlobalConstants.error)
        })
      }

}
