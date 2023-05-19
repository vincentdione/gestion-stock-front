import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsLignesCommandesComponent } from './details-lignes-commandes.component';

describe('DetailsLignesCommandesComponent', () => {
  let component: DetailsLignesCommandesComponent;
  let fixture: ComponentFixture<DetailsLignesCommandesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsLignesCommandesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsLignesCommandesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
