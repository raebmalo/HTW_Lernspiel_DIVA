// Imports for Angular's testing framework and the component under test
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

// Test suite for AppComponent
describe('AppComponent', () => {
  // Setup before each test
  beforeEach(async () => {
    // Configure test module with necessary imports and declarations
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
    }).compileComponents(); // Compile components
  });

  // Test to verify the AppComponent is created
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent); // Create component
    const app = fixture.componentInstance; // Access component instance
    expect(app).toBeTruthy(); // Verify instance is created
  });

  // Test to check if AppComponent's title is set correctly
  it(`should have as title 'DIVA-Lernspiel'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('DIVA-Lernspiel'); // Check title property
  });

  // Test to ensure title is rendered in the template
  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges(); // Apply data bindings
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, DIVA-Lernspiel'); // Verify title in DOM
  });
});
