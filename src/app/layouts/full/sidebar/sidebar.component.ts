import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { MenuItems } from 'src/app/shared/menu-item';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {

  token: any = localStorage.getItem('accessToken');
  tokenPayload: any;
  currentTime: Date = new Date();

  private timeInterval: any;
  private updateInterval = 60000; // Mise à jour chaque minute

  constructor(
    public menuItems: MenuItems,
    private router: Router
  ) {
    this.decodeToken();
  }

  ngOnInit(): void {
    this.startTimeUpdates();
  }

  ngOnDestroy(): void {
    this.stopTimeUpdates();
  }

  private decodeToken(): void {
    if (this.token) {
      try {
        this.tokenPayload = jwt_decode(this.token);
      } catch (error) {
        console.error('Error decoding token:', error);
        this.tokenPayload = null;
      }
    }
  }

  private startTimeUpdates(): void {
    // Mettre à jour l'heure immédiatement
    this.updateTime();

    // Configurer l'intervalle pour les mises à jour
    this.timeInterval = setInterval(() => {
      this.updateTime();
    }, this.updateInterval);
  }

  private stopTimeUpdates(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
      this.timeInterval = null;
    }
  }

  private updateTime(): void {
    this.currentTime = new Date();
  }

  // Méthodes publiques
  getUserName(): string {
    if (this.tokenPayload?.name) {
      return this.tokenPayload.name;
    }
    return 'Utilisateur';
  }

  getUserRole(): string {
    if (this.tokenPayload?.role) {
      const roles = Array.isArray(this.tokenPayload.role)
        ? this.tokenPayload.role[0]
        : this.tokenPayload.role;
      return roles || 'Utilisateur';
    }
    return 'Utilisateur';
  }

  logout(): void {
    this.clearUserSession();
    this.navigateToLogin();
  }

  private clearUserSession(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }

  private navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}