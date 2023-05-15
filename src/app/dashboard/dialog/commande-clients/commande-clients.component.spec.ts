import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeClientsComponent } from './commande-clients.component';

describe('CommandeClientsComponent', () => {
  let component: CommandeClientsComponent;
  let fixture: ComponentFixture<CommandeClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommandeClientsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandeClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
