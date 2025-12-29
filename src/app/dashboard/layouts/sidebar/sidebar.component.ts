import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItems } from 'src/app/shared/menu-item';
import { Router } from '@angular/router';

interface SubMenuItem {
  label: string;
  link: string;
  icon: string;
  roles?: string[];
}

interface MenuItem {
  label: string;
  icon: string;
  link?: string;
  roles: string[];
  subMenuItems?: SubMenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  userRole: string = '';
  currentTime: Date = new Date();
  private timeInterval: any;
  private openSections: Set<string> = new Set(['Dashboard']);

  menus: MenuItem[] = [
    { label: 'Dashboard', icon: 'dashboard', link: 'dashboard', roles: ['ADMIN', 'MANAGER'] },
    {
      label: 'Ventes',
      icon: 'point_of_sale',
      subMenuItems: [
        { label: 'Ventes', link: 'ventes', icon: 'shopping_cart', roles: ['ADMIN', 'MANAGER'] },
      ],
      roles: ['ADMIN', 'MANAGER']
    },
    {
      label: 'Clients',
      icon: 'groups',
      subMenuItems: [
        { label: 'Clients', link: 'clients', icon: 'person', roles: ['ADMIN', 'MANAGER'] },
        { label: 'Commandes', link: 'commandeClients', icon: 'receipt_long', roles: ['ADMIN', 'MANAGER'] },
      ],
      roles: ['ADMIN', 'MANAGER']
    },
    {
      label: 'Fournisseurs',
      icon: 'local_shipping',
      subMenuItems: [
        { label: 'Fournisseurs', link: 'fournisseurs', icon: 'business', roles: ['ADMIN', 'MANAGER'] },
        { label: 'Commandes', link: 'commandeFournisseurs', icon: 'inventory', roles: ['ADMIN', 'MANAGER'] },
      ],
      roles: ['ADMIN', 'MANAGER']
    },
    {
      label: 'Stock',
      icon: 'inventory',
      subMenuItems: [
        { label: 'Mouvements', link: 'mouvements', icon: 'swap_horiz', roles: ['ADMIN', 'MANAGER'] },
        { label: 'Rechercher', link: 'search-stock', icon: 'search', roles: ['ADMIN', 'MANAGER'] },
      ],
      roles: ['ADMIN', 'MANAGER']
    },
    {
      label: 'Livraisons',
      icon: 'local_shipping',
      subMenuItems: [
        { label: 'Livraisons', link: 'livraisons', icon: 'delivery_dining', roles: ['ADMIN', 'MANAGER', 'LIVREUR'] },
        { label: 'Rechercher', link: 'search-livraisons', icon: 'find_in_page', roles: ['ADMIN', 'MANAGER'] },
      ],
      roles: ['ADMIN', 'MANAGER', 'LIVREUR']
    },
    {
      label: 'Utilisateurs',
      icon: 'people',
      subMenuItems: [
        { label: 'Utilisateurs', link: 'users', icon: 'person_add', roles: ['ADMIN'] },
      ],
      roles: ['ADMIN']
    },
    {
      label: 'Entreprises',
      icon: 'apartment',
      subMenuItems: [
        { label: 'Entreprises', link: 'entreprises', icon: 'corporate_fare', roles: ['SUPER_ADMIN', 'ADMIN'] },
      ],
      roles: ['SUPER_ADMIN', 'ADMIN']
    },
    {
      label: 'Paramètres',
      icon: 'settings',
      subMenuItems: [
        { label: 'Unités', link: 'unite', icon: 'straighten', roles: ['ADMIN', 'MANAGER'] },
        { label: 'Paiements', link: 'modePayement', icon: 'payments', roles: ['ADMIN', 'MANAGER'] },
        { label: 'Catégories', link: 'category', icon: 'category', roles: ['ADMIN', 'MANAGER'] },
        { label: 'Sous-catégories', link: 'sousCategory', icon: 'layers', roles: ['ADMIN', 'MANAGER'] },
        { label: 'Articles', link: 'article', icon: 'inventory_2', roles: ['ADMIN', 'MANAGER'] },
        { label: 'Conditions', link: 'condition', icon: 'gavel', roles: ['ADMIN', 'MANAGER'] },
      ],
      roles: ['ADMIN', 'MANAGER']
    },
  ];

  filteredMenus: MenuItem[] = [];

  constructor(
    public menuItems: MenuItems,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeUserRole();
    this.filterMenusByRole();
    this.startTimeUpdates();
  }

  ngOnDestroy(): void {
    this.stopTimeUpdates();
  }

  private initializeUserRole(): void {
    const role = localStorage.getItem('role');
    if (role) {
      this.userRole = JSON.parse(role.replace('ROLE_', ''));
    } else {
      this.userRole = '';
      console.warn('Aucun rôle utilisateur trouvé');
    }
  }

  private filterMenusByRole(): void {
    this.filteredMenus = this.menus
      .filter(menu => menu.roles.includes(this.userRole))
      .map(menu => {
        if (menu.subMenuItems) {
          const filteredSubItems = menu.subMenuItems.filter(sub =>
            !sub.roles || sub.roles.includes(this.userRole)
          );
          return { ...menu, subMenuItems: filteredSubItems.length > 0 ? filteredSubItems : undefined };
        }
        return menu;
      })
      .filter(menu => menu.subMenuItems || menu.link); // Garder seulement les menus avec contenu
  }

  private startTimeUpdates(): void {
    this.updateTime();
    this.timeInterval = setInterval(() => {
      this.updateTime();
    }, 60000); // Mise à jour toutes les minutes
  }

  private stopTimeUpdates(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private updateTime(): void {
    this.currentTime = new Date();
  }

  toggleSection(sectionLabel: string): void {
    if (this.openSections.has(sectionLabel)) {
      this.openSections.delete(sectionLabel);
    } else {
      this.openSections.add(sectionLabel);
    }
  }

  isSectionOpen(sectionLabel: string): boolean {
    return this.openSections.has(sectionLabel);
  }

  getUserInitial(): string {
    const name = this.getUserName();
    return name ? name.charAt(0).toUpperCase() : 'U';
  }

  getUserName(): string {
    // À adapter selon votre logique d'authentification
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.name || user.username || 'Utilisateur';
      } catch {
        return 'Utilisateur';
      }
    }
    return 'Utilisateur';
  }

  getUserRole(): string {
    return this.userRole || 'Utilisateur';
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}