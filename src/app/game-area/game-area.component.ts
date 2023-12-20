import { Component, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-game-area',
  templateUrl: './game-area.component.html',
  styleUrls: ['./game-area.component.css']
})
export class GameAreaComponent implements AfterViewInit {
  @ViewChild('myCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  c!: CanvasRenderingContext2D;
  boundaries: Boundary[] = [];
  dynamicText: string = 'Initial text in the textbox';
  buttonText: string = ''; // Text that will be displayed in the right column
  clickedLink: string | null = null;

  onLinkClick(link: string) {
    this.clickedLink = link;
  }

  ngOnInit(): void {
    this.updateLevelLabels();
    window.addEventListener('resize', this.updateLevelLabels);
  }

  private updateLevelLabels() {
    const levelList = document.querySelector('.level-list') as HTMLUListElement;
    const listItems = levelList.querySelectorAll('li');

    listItems.forEach((item, index) => {
      const link = item.querySelector('a') as HTMLAnchorElement;
      if (window.innerWidth <= 1024) {
        // Display only numbers on small screens
        link.textContent = (index + 1).toString();
      } else {
        // Display "Level" text on larger screens
        link.textContent = 'Level ' + (index + 1);
      }
    });
  }

  updateText(text: string): void {
    // Update the text in the right column
    if (!this.buttonText) this.buttonText = text;
    else this.buttonText = this.buttonText + '\n' + text;
  }

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    // Get a reference to the existing canvas in the template
    const existingCanvas = this.canvasRef.nativeElement;

    // Create a new canvas dynamically
    const newCanvas = this.renderer.createElement('canvas');
    const parent = this.renderer.parentNode(existingCanvas);

    // Copy content if needed (e.g., context, drawing commands)
    const existingContext = existingCanvas.getContext('2d');
    const newContext = newCanvas.getContext('2d');
    if (existingContext && newContext) {
      newContext.drawImage(existingCanvas, 0, 0);
    }

    // Replace the existing canvas with the new one in the DOM
    this.renderer.insertBefore(parent!, newCanvas, existingCanvas);
    this.renderer.removeChild(parent!, existingCanvas);

    // Set the new canvas and context for further use
    this.canvasRef.nativeElement = newCanvas;
    this.c = newCanvas.getContext('2d')!;

    // Set the size of the canvas to the screen size
    newCanvas.width = 10 * Boundary.height;
    newCanvas.height = 10 * Boundary.height;

    // Create boundaries based on your map logic
    const map: string[][] = [
      ['-','-','-','-','-','-','-','-','-','-'],
      [' ',' ',' ',' ','-',' ','-',' ',' ','-'],
      ['-','-','-',' ','-',' ','-','-',' ','-'],
      ['-',' ',' ',' ','-',' ','-','-',' ','-'],
      ['-',' ','-','-','-',' ','-','-',' ','-'],
      ['-',' ',' ',' ',' ',' ',' ',' ',' ','-'],
      ['-','-','-','-','-','-','-','-',' ','-'],
      ['-','-',' ',' ',' ','-',' ',' ',' ','-'],
      [' ',' ',' ','-',' ',' ',' ','-',' ','-'],
      ['-','-','-','-','-','-','-','-','-','-'],
    ];

    map.forEach((row, i) => {
      row.forEach((symbol, j) => {
        switch (symbol) {
          case '-':
            this.boundaries.push(
              new Boundary({
                position: {
                  x: 44 * j,
                  y: 44 * i,
                },
              })
            );
            break;
          // Add more cases if needed
        }
      });
    });

    // Draw the boundaries
    this.boundaries.forEach(boundary => {
      boundary.draw(this.c);
    });
  }
}

class Boundary {
  static width: number = 44;
  static height: number = 44;

  position: { x: number; y: number };
  width: number;
  height: number;

  constructor({ position }: { position: { x: number; y: number } }) {
    this.position = position;
    this.width = 44;
    this.height = 44;
  }

  draw(c: CanvasRenderingContext2D): void {
    c.fillStyle = '#09103B';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
