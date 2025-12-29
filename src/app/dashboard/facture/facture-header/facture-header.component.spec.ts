import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureHeaderComponent } from './facture-header.component';

describe('FactureHeaderComponent', () => {
  let component: FactureHeaderComponent;
  let fixture: ComponentFixture<FactureHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactureHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactureHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
