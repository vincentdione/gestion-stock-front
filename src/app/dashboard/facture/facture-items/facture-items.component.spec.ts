import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactureItemsComponent } from './facture-items.component';

describe('FactureItemsComponent', () => {
  let component: FactureItemsComponent;
  let fixture: ComponentFixture<FactureItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactureItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FactureItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
