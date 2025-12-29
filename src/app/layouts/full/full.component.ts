import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, AfterViewInit, OnInit } from '@angular/core';
import { UtilisateurDto } from 'src/app/api';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-full-layout',
  templateUrl: 'full.component.html',
  styleUrls: []
})
export class FullComponent implements OnDestroy, AfterViewInit, OnInit {
  mobileQuery: MediaQueryList;
  entrepriseNom: string = 'Stock';
  userId: any;
  user: UtilisateurDto = {};

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private userService: UserService
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem("user");
    this.getUser();
    // Récupérer le nom de l'entreprise depuis le localStorage ou API
    const storedEntreprise = localStorage.getItem('entrepriseNom');
    if (storedEntreprise) {
      this.entrepriseNom = storedEntreprise;
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngAfterViewInit() { }

  getUser() {
    this.userService.isAuthencated();
  }

  showFabButton(): boolean {
    // Logique pour afficher/masquer le bouton flottant selon la route actuelle
    return false; // À adapter selon vos besoins
  }

  onFabClick(): void {
    // Action du bouton flottant
    console.log('FAB clicked');
  }
}