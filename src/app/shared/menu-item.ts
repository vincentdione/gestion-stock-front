
import { Injectable } from "@angular/core"

export interface  Menu {
  state: string,
  name: string,
  icon: string,
  role: string
}


// const menuItems = [    { label: 'Accueil', icon: 'home', link: '/home' },
//  {      label: 'Menu avec sous-menu',      icon: 'menu',
//   subMenuItems: [
//      { label: 'Sous-menu 1', link: '/sous-menu-1' },
//      { label: 'Sous-menu 2', link: '/sous-menu-2' },
//      { label: 'Sous-menu 3', link: '/sous-menu-3' },      ]
// },
// { label: 'Menu simple', icon: 'menu', link: '/menu-simple' },
// { label: 'A propos', icon: 'info', link: '/about' },
// ];

const MENU_ITEMS = [
  {state : 'dashboard', name: 'Dashboard', icon: 'dashboard', role:''},
  // {state : 'stock', name: 'Manage', icon: 'dashboard', role:''},
  {state : "users", name: 'Utilisateurs', icon: 'person', role:''},
  {state : "article", name: 'Articles', icon: 'person', role:''},
  {state : "category", name: 'Categories', icon: 'person', role:''},


]


@Injectable()
export class MenuItems {
  getMenuItems(): Menu[] {
     return MENU_ITEMS;
  }
}
