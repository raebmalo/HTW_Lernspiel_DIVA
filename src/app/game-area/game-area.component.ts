import { Component, AfterViewInit, Renderer2, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-game-area',
  templateUrl: './game-area.component.html',
  styleUrls: ['./game-area.component.css']
})
export class GameAreaComponent implements AfterViewInit {
  @ViewChild('myCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  boundaries: Boundary[] = [];
  buttonText: string[] = []; // Text that will be displayed in the right column


  updateText(text: string): void {
    // Update the text in the right column
    this.buttonText.push(text);
    this.updateRightColumn();
  }

  updateRightColumn(){
    //get context of right column
    let rightColumn = document.querySelector('.right-column');
    //create string and join every object in element with \n
    let rightColumnText: string = this.buttonText.join('\n');
    //if right column exists replace text
    if(rightColumn instanceof HTMLElement){
      rightColumn.textContent = rightColumnText;
    }
  }

  startGame() {
    this.buttonText.forEach((element) => {
      let direction: string = "";
      switch(element){
        case 'left': 
          direction = 'left';
          //player.velocity.y = -5;
          break;
        case 'right':
          direction = 'right';
          //player.velocity.x = -5;
          break;
        case 'up':
          direction = 'up';
          //player.velocity.y = 5;
          break;
        case 'down':
          direction = 'down';
          //player.velocity.x = 5;
          break;
        case 'walk':
          //implement movement
          break;
      }
    });

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
    const c: CanvasRenderingContext2D = newCanvas.getContext('2d')!;;

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

    // Set the size of the canvas to the screen size
    newCanvas.width = map[0].length * Boundary.height;
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
          // Add more cases if needed
        }
      });
    });

    // Draw the boundaries
    this.boundaries.forEach(boundary => {
      boundary.draw(c);
    });
    class Player {
      position: { x: number; y: number };
      velocity: { x: number; y: number };
      radius: number;
    
      constructor({position, velocity}: { position: { x: number; y: number }; velocity: { x: number; y: number }}) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
      }
      
      draw(): void {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = '#fccb00';
        c.fill();
        c.closePath();
      }
    
      update(): void {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
      }
    }
    
    const boundaries: any[] = [];
    const player = new Player({
      position: { x: Boundary.width + Boundary.width / 2, y: Boundary.height + Boundary.height / 2},
      velocity: { x: 0, y: 0 }
    });
    player.draw();
    
    function animate(): void {
      requestAnimationFrame(animate);
      c.clearRect(0, 0, newCanvas.width, newCanvas.height);
      boundaries.forEach((boundary) => {
        boundary.draw();
      });
      player.update();
      player.velocity.x = 0;
      player.velocity.y = 0;
    }
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

