import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUniteComponent } from './manage-unite.component';

describe('ManageUniteComponent', () => {
  let component: ManageUniteComponent;
  let fixture: ComponentFixture<ManageUniteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUniteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageUniteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
