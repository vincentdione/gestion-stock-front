import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleVenteComponent } from './single-vente.component';

describe('SingleVenteComponent', () => {
  let component: SingleVenteComponent;
  let fixture: ComponentFixture<SingleVenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleVenteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleVenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
