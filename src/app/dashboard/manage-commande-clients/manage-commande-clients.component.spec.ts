import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCommandeClientsComponent } from './manage-commande-clients.component';

describe('ManageCommandeClientsComponent', () => {
  let component: ManageCommandeClientsComponent;
  let fixture: ComponentFixture<ManageCommandeClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCommandeClientsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCommandeClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
