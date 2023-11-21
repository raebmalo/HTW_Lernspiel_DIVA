import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameAreaComponent } from './game-area.component';

describe('GameAreaComponent', () => {
  let component: GameAreaComponent;
  let fixture: ComponentFixture<GameAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameAreaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
