import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModePayementComponent } from './mode-payement.component';

describe('ModePayementComponent', () => {
  let component: ModePayementComponent;
  let fixture: ComponentFixture<ModePayementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModePayementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModePayementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
