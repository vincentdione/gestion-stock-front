import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturePrintComponent } from './facture-print.component';

describe('FacturePrintComponent', () => {
  let component: FacturePrintComponent;
  let fixture: ComponentFixture<FacturePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturePrintComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
