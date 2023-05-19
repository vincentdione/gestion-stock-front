import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LigneCommandeComponent } from './ligne-commande.component';

describe('LigneCommandeComponent', () => {
  let component: LigneCommandeComponent;
  let fixture: ComponentFixture<LigneCommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LigneCommandeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LigneCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
