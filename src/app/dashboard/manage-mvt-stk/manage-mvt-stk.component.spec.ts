import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMvtStkComponent } from './manage-mvt-stk.component';

describe('ManageMvtStkComponent', () => {
  let component: ManageMvtStkComponent;
  let fixture: ComponentFixture<ManageMvtStkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageMvtStkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMvtStkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
