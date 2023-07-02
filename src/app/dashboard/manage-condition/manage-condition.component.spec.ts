import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageConditionComponent } from './manage-condition.component';

describe('ManageConditionComponent', () => {
  let component: ManageConditionComponent;
  let fixture: ComponentFixture<ManageConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageConditionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
