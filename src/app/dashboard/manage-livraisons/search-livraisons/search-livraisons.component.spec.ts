import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLivraisonsComponent } from './search-livraisons.component';

describe('SearchLivraisonsComponent', () => {
  let component: SearchLivraisonsComponent;
  let fixture: ComponentFixture<SearchLivraisonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchLivraisonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchLivraisonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
