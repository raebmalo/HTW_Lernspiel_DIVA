import { Component, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-game-ui',
  templateUrl: './game-ui.component.html',
  styleUrls: ['./game-ui.component.css']
})
export class GameUiComponent implements AfterViewInit {
  @ViewChild('myCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  c!: CanvasRenderingContext2D;
  boundaries: Boundary[] = [];

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