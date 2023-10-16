import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCommandeClientComponent } from './single-commande-client.component';

describe('SingleCommandeClientComponent', () => {
  let component: SingleCommandeClientComponent;
  let fixture: ComponentFixture<SingleCommandeClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleCommandeClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleCommandeClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
