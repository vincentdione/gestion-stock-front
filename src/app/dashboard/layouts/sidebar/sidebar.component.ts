import jwt_decode  from 'jwt-decode';
import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MenuItems } from 'src/app/shared/menu-item';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnDestroy {

  mobileQuery: MediaQueryList;
  token : any = localStorage.getItem('accessToken');
  tokenPayload: any;

  menus = [
  { label: 'Dashboard', icon: 'home', link: 'dashboard' },
  {  label: 'Parametres',      icon: 'menu',
    subMenuItems:
    [
       { label: 'Catégories', link: 'category',icon: 'view_module' },
       { label: 'Sous-catégories', link: 'sousCategory',icon: 'view_quilt' },
       { label: 'Articles', link: 'article',icon: 'add_shopping_cart' },
       { label: 'Utilisateurs', link: 'users',icon: 'person' },
    ]
  },
  {  label: 'Clients',      icon: 'menu',
  subMenuItems:
  [
     { label: 'Clients', link: 'clients',icon: 'person' },
     { label: 'Commandes', link: 'commandeClients',icon: 'assignment' },
  ]
},
{  label: 'Fournisseurs',      icon: 'menu',
  subMenuItems:
  [
     { label: 'Fournisseurs', link: 'fournisseurs',icon: 'person' },
     { label: 'Commandes', link: 'commandeFournisseurs',icon: 'assignment' },
  ]
}
     ];

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems : MenuItems
  ) {
    this.tokenPayload = jwt_decode(this.token)
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }



  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
