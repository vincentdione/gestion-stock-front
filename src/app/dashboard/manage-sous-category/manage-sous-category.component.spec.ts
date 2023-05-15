import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSousCategoryComponent } from './manage-sous-category.component';

describe('ManageSousCategoryComponent', () => {
  let component: ManageSousCategoryComponent;
  let fixture: ComponentFixture<ManageSousCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSousCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSousCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
