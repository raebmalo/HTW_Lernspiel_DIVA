import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheIdeaComponent } from './the-idea.component';

describe('TheIdeaComponent', () => {
  let component: TheIdeaComponent;
  let fixture: ComponentFixture<TheIdeaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TheIdeaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TheIdeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
