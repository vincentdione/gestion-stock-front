import { Component } from '@angular/core';
import { ArticlesService, MouvementsDeStockService } from 'src/app/api';

@Component({
  selector: 'app-default-dashboard',
  templateUrl: './default-dashboard.component.html',
  styleUrls: ['./default-dashboard.component.scss']
})
export class DefaultDashboardComponent {


  totalArticles! : number

  constructor(private mvtStockService: MouvementsDeStockService, private articleService: ArticlesService,) { }

  ngOnInit(): void {

    this.getArticles()

}


  getArticles(){

    this.articleService.getAllArticles().subscribe((res:any) => {
      this.totalArticles = res.length
    }, err => {
      console.log(err);
    })
  }

}
