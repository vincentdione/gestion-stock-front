import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLivraisonsComponent } from './manage-livraisons.component';

describe('ManageLivraisonsComponent', () => {
  let component: ManageLivraisonsComponent;
  let fixture: ComponentFixture<ManageLivraisonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageLivraisonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageLivraisonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
