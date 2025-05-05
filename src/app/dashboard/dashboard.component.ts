import { Component, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { UtilisateurDto } from '../api';
import { MediaMatcher } from '@angular/cdk/layout';
import { UserService } from '../services/user/user.service';
import { MenuItems } from '../shared/menu-item';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy, AfterViewInit {

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  userId : any
  entrepriseNom: string | null = '';
  user : UtilisateurDto = {}
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,private userService:UserService,
    public menuItems : MenuItems

  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnInit(): void {
    this.userId = localStorage.getItem("user")
    this.getUser()
    this.getEntrepriseName()
    }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngAfterViewInit() { }

  getUser(){
    this.userService.isAuthencated();
  }

  getEntrepriseName() {
    this.entrepriseNom = this.userService.getEntrepriseName();
  }

}
