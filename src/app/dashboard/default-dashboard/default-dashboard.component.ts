import { Component } from '@angular/core';
import { ArticlesService, CommandeClientsService, CommandeFournisseursService, MouvementsDeStockService, VentesService } from 'src/app/api';

@Component({
  selector: 'app-default-dashboard',
  templateUrl: './default-dashboard.component.html',
  styleUrls: ['./default-dashboard.component.scss']
})
export class DefaultDashboardComponent {


  totalArticles! : number
  totalVentes! : number
  montantTotalVentes! : number

  totalComFournisseurs! : number
  montantTotalComFournisseurs! : number

  totalComClients! : number
  montantTotalComClients! : number

  constructor(private mvtStockService: MouvementsDeStockService,private comClientService:CommandeClientsService,
    private comFourClient:CommandeFournisseursService,
    private venteService: VentesService,
    private articleService: ArticlesService,) { }

  ngOnInit(): void {

    this.getArticles()
    this.getVentes()
    this.getComFournisseurs()
    this.getComClients()
}


  getVentes(){
    this.venteService.getAllVentes().subscribe((res:any) => {
      this.totalVentes = res.length
    }, err => {
      console.log(err);
    })

    this.venteService.getMontantTotalVentes().subscribe((res:any) => {
      console.log(res)
      this.montantTotalVentes = res
    }, err => {
      console.log(err);
    })

  }

  getComFournisseurs(){
    this.comFourClient.getAllCommandeFournisseurs().subscribe((res:any) => {
      this.totalComFournisseurs = res.length
    }, err => {
      console.log(err);
    })

    this.comFourClient.getMontantTotalComFournisseur().subscribe((res:any) => {
      console.log(res)
      this.montantTotalComFournisseurs = res
    }, err => {
      console.log(err);
    })

  }

  getComClients(){
    this.comClientService.getAllCommandeClients().subscribe((res:any) => {
      this.totalComClients = res.length
    }, err => {
      console.log(err);
    })

    this.comClientService.getMontantTotalComClient().subscribe((res:any) => {
      console.log(res)
      this.montantTotalComClients = res
    }, err => {
      console.log(err);
    })

  }

  getArticles(){

    this.articleService.getAllArticles().subscribe((res:any) => {
      this.totalArticles = res.length
    }, err => {
      console.log(err);
    })
  }




}
