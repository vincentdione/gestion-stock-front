import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageModePayementComponent } from './manage-mode-payement.component';

describe('ManageModePayementComponent', () => {
  let component: ManageModePayementComponent;
  let fixture: ComponentFixture<ManageModePayementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageModePayementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageModePayementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
