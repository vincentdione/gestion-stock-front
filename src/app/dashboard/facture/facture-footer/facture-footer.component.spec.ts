import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureFooterComponent } from './facture-footer.component';

describe('FactureFooterComponent', () => {
  let component: FactureFooterComponent;
  let fixture: ComponentFixture<FactureFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactureFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactureFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
