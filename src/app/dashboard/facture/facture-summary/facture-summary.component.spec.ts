import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureSummaryComponent } from './facture-summary.component';

describe('FactureSummaryComponent', () => {
  let component: FactureSummaryComponent;
  let fixture: ComponentFixture<FactureSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactureSummaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactureSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
