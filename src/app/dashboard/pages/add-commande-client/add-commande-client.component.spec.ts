import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCommandeClientComponent } from './add-commande-client.component';

describe('AddCommandeClientComponent', () => {
  let component: AddCommandeClientComponent;
  let fixture: ComponentFixture<AddCommandeClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCommandeClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCommandeClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
