import { Component, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-game-area',
  templateUrl: './game-area.component.html',
  styleUrls: ['./game-area.component.css']
})
export class GameAreaComponent implements AfterViewInit {
  @ViewChild('myCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  boundaries: Boundary[] = [];
  buttonText: string[] = [];
  player!: Player;
  animationActive: boolean = true;

  updateText(text: string): void {
    this.buttonText.push(text);
    this.updateRightColumn();
  }

  updateRightColumn() {
    let rightColumn = document.querySelector('.right-column');
    let rightColumnText: string = this.buttonText.join('\n');
    if (rightColumn instanceof HTMLElement) {
      rightColumn.textContent = rightColumnText;
    }
  }

  startGame() {
    this.animateAction(0, 44);
  }
  
  animateAction(index: number, steps: number) {
    if (index < this.buttonText.length) {
      const element = this.buttonText[index];
      switch (element) {
        case 'left':
          this.animateMovement(index, -1, 0, steps);
          break;
        case 'right':
          this.animateMovement(index, 1, 0, steps);
          break;
        case 'up':
          this.animateMovement(index, 0, -1, steps);
          break;
        case 'down':
          this.animateMovement(index, 0, 1, steps);
          break;
      }
    } else {
      // All actions are done, reset player velocity and restart animation
      this.player.resetVel();
      this.startAnimation();
    }
  }
  
  animateMovement(index: number, deltaX: number, deltaY: number, steps: number) {
    let currentStep = 0;
    const moveInterval = setInterval(() => {
      this.player.position.x += deltaX;
      this.player.position.y += deltaY;
      currentStep++;
  
      if (currentStep >= steps) {
        clearInterval(moveInterval);
        this.animateAction(index + 1, steps);
      }
    }, 16); // 60 fps
  }

  constructor(private renderer: Renderer2) {
    this.player = new Player({
      position: { x: Boundary.width + Boundary.width / 2, y: Boundary.height + Boundary.height / 2},
      velocity: { x: 0, y: 0 }
    });
  }

  ngAfterViewInit() {
    const existingCanvas = this.canvasRef.nativeElement;
    const newCanvas = this.renderer.createElement('canvas');
    const parent = this.renderer.parentNode(existingCanvas);

    const existingContext = existingCanvas.getContext('2d');
    const newContext = newCanvas.getContext('2d');
    if (existingContext && newContext) {
      newContext.drawImage(existingCanvas, 0, 0);
    }

    this.renderer.insertBefore(parent!, newCanvas, existingCanvas);
    this.renderer.removeChild(parent!, existingCanvas);

    this.canvasRef.nativeElement = newCanvas;
    const c: CanvasRenderingContext2D = newCanvas.getContext('2d')!;

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

    newCanvas.width = map[0].length * Boundary.width;
    newCanvas.height = map.length * Boundary.height;

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
        }
      });
    });

    this.boundaries.forEach(boundary => {
      boundary.draw(c);
    });

    requestAnimationFrame(() => this.animate());
  }

  private animate(): void {
    if (!this.animationActive) {
      return; // Animation stoppen, wenn animationActive false ist
    }

    const c: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d')!;
    c.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    this.boundaries.forEach((boundary) => {
      boundary.draw(c);
    });

    //this.handleInput(this.buttonText);
    this.player.update();
    this.player.draw();
    requestAnimationFrame(() => this.animate());
  }


  stopAnimation(): void {
    this.animationActive = false; // Animation stoppen
  }
  
  startAnimation(): void {
    this.animationActive = true; // Animation starten
    this.animate();
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

class Player {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  radius: number;

  constructor({ position, velocity }: { position: { x: number; y: number }; velocity: { x: number; y: number } }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
  }

  draw(): void {
    const c: CanvasRenderingContext2D = document.querySelector('canvas')!.getContext('2d')!;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = '#fccb00';
    c.fill();
    c.closePath();
  }

  update(): void {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  resetVel(): void {
    this.velocity.x = 0;
    this.velocity.y = 0;
  }
  
 
}

