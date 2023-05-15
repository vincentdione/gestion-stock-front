import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageVentesComponent } from './manage-ventes.component';

describe('ManageVentesComponent', () => {
  let component: ManageVentesComponent;
  let fixture: ComponentFixture<ManageVentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageVentesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageVentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
