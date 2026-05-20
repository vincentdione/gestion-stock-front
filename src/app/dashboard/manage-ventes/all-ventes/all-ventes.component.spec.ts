import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllVentesComponent } from './all-ventes.component';

describe('AllVentesComponent', () => {
  let component: AllVentesComponent;
  let fixture: ComponentFixture<AllVentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllVentesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllVentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
