import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEntreprisesComponent } from './manage-entreprises.component';

describe('ManageEntreprisesComponent', () => {
  let component: ManageEntreprisesComponent;
  let fixture: ComponentFixture<ManageEntreprisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageEntreprisesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEntreprisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
