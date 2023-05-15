import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFournisseursComponent } from './manage-fournisseurs.component';

describe('ManageFournisseursComponent', () => {
  let component: ManageFournisseursComponent;
  let fixture: ComponentFixture<ManageFournisseursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageFournisseursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageFournisseursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
