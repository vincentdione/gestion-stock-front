import { Component, ChangeDetectorRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { UtilisateurDto } from '../api';
import { MediaMatcher } from '@angular/cdk/layout';
import { UserService } from '../services/user/user.service';
import { MenuItems } from '../shared/menu-item';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy, AfterViewInit {

  @ViewChild('snav') snav!: MatSidenav;

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  userId: any;
  entrepriseNom: string | null = '';
  user: UtilisateurDto = {};
  currentPageTitle: string = '';
  currentYear: number = new Date().getFullYear();

  // Variable pour suivre l'état du sidebar
  isSidebarOpen: boolean = true;

  quickStats = [
    { icon: 'inventory', value: '0', label: 'Articles', trend: 'up' },
    { icon: 'point_of_sale', value: '0', label: 'Ventes', trend: 'up' },
    { icon: 'shopping_cart', value: '0', label: 'Commandes', trend: 'up' },
    { icon: 'local_shipping', value: '0', label: 'Fournisseurs', trend: 'down' }
  ];

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private userService: UserService,
    public menuItems: MenuItems,
    private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => {
      changeDetectorRef.detectChanges();
      // Mettre à jour l'état du sidebar basé sur la taille d'écran
      if (this.mobileQuery.matches) {
        this.isSidebarOpen = true;
      } else {
        this.isSidebarOpen = false;
      }
    };
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem("user");
    this.getUser();
    this.getEntrepriseName();

    // Initialiser l'état du sidebar
    this.isSidebarOpen = this.mobileQuery.matches;

    // Suivre les changements de route pour mettre à jour le titre
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updatePageTitle();
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngAfterViewInit() { }

  getUser() {
    this.userService.isAuthencated();
  }

  getEntrepriseName() {
    this.entrepriseNom = this.userService.getEntrepriseName();
  }

  updatePageTitle() {
    const url = this.router.url;

    const titleMap: { [key: string]: string } = {
      '/dashboard': 'Tableau de Bord',
      '/articles': 'Gestion des Articles',
      '/ventes': 'Ventes',
      '/commandes': 'Commandes',
      '/fournisseurs': 'Fournisseurs',
      '/rapports': 'Rapports'
    };

    this.currentPageTitle = titleMap[url] || 'Tableau de Bord';
  }

  // Méthode pour basculer le sidebar
  toggleSidebar() {
    this.snav.toggle();
    this.isSidebarOpen = this.snav.opened;
  }
}