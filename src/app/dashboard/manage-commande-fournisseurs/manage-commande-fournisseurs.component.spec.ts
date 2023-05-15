import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCommandeFournisseursComponent } from './manage-commande-fournisseurs.component';

describe('ManageCommandeFournisseursComponent', () => {
  let component: ManageCommandeFournisseursComponent;
  let fixture: ComponentFixture<ManageCommandeFournisseursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCommandeFournisseursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageCommandeFournisseursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
