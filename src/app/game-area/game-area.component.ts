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
  isPlayButtonDisabled: boolean = false;
  goal!: Goal;

  // updates the string array that will be shown in the code-column
  updateText(text: string): void {
    this.buttonText.push(text);
    this.updateRightColumn();
  }

  // updates the html element of the code-column
  updateRightColumn() {
    let rightColumn = document.querySelector('.text-column');
    // adds line breaks so that the code will appear vertically
    let rightColumnText: string = this.buttonText.join('\n');
    if (rightColumn instanceof HTMLElement) {
      rightColumn.textContent = rightColumnText;
    }
  }

  // resets the player position and the collision-detection
  resetGame() {
    this.player.position = {  x: Boundary.width + Boundary.width / 2, y: Boundary.height + Boundary.height / 2 };
    this.player.resetCollision()
  }

  // deletes the code
  deleteText(): void {
    this.buttonText = [];
    this.updateRightColumn();
  }

  // starts the game and 
  startGame() {
    console.log("start game");
    this.animateAction(0, 44);
    // TODO - Funktion Animation beendet --> Button disabled:
    this.isPlayButtonDisabled = true;
  }
  
  animateAction(index: number, steps: number) {
    // finds the direction in which the player-figure shold move
    if (index < this.buttonText.length) {
      const element = this.buttonText[index];
      switch (element) {
        case 'left':
          console.log("left");
          this.animateMovement(index, -1, 0, steps);
          break;
        case 'right':
          console.log("right");
          this.animateMovement(index, 1, 0, steps);
          break;
        case 'up':
          console.log("up");
          this.animateMovement(index, 0, -1, steps);
          break;
        case 'down':
          console.log("down");
          this.animateMovement(index, 0, 1, steps);
          break;
      }
    } else {
      // All actions are done, reset player velocity and restart animation
      console.log("else");
      this.player.resetVel();
      this.startAnimation();
    }
  }
  
  animateMovement(index: number, deltaX: number, deltaY: number, steps: number) {
    // animates the movement bei moving the player 1 pixel at a time
    let currentStep = 0;
    console.log("animate movement");
    const moveInterval = setInterval(() => {
      this.player.position.x += deltaX;
      this.player.position.y += deltaY;
      currentStep++;
  
      if (currentStep >= steps) {
        // if stepcounter >= maxsteps, stops the movement
        clearInterval(moveInterval);
        this.animateAction(index + 1, steps);
      }
    }, 16); // 60 fps
  }

  // needed for rendering the player figure
  constructor(private renderer: Renderer2) {
    this.player = new Player(
      {
        position: { x: Boundary.width + Boundary.width / 2, y: Boundary.height + Boundary.height / 2 },
        velocity: { x: 0, y: 0 },
      },
      this // Übergeben Sie eine Referenz auf das GameAreaComponent-Objekt
    );
  }

  ngAfterViewInit() {
    // initializes the html canvas and replaces the existing canvas with the new one
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

    // map two dimensional array
    const map: string[][] = [
      ['-','-','-','-','-','-','-','-','-','-'],
      ['-',' ',' ',' ','-',' ','-',' ',' ','-'],
      ['-','-','-',' ','-',' ','-','-',' ','-'],
      ['-',' ',' ',' ','-',' ','-','-',' ','-'],
      ['-',' ','-','-','-',' ','-','-',' ','-'],
      ['-',' ',' ',' ',' ',' ',' ',' ',' ','-'],
      ['-','-','-','-','-','-','-','-',' ','-'],
      ['-','-',' ',' ',' ','-',' ',' ',' ','-'],
      ['-',' ',' ','-',' ',' ',' ','-',' ','-'],
      ['-','-','-','-','-','-','-','-','-','-'],
    ];

    // calculates width of the canvas by multiplying the pixel width and height by the number of columns and rows
    newCanvas.width = map[0].length * Boundary.width;
    newCanvas.height = map.length * Boundary.height;

    // paints the canvas with each boundary being 44 pixels wide/high
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

    // paints the boundary in a color
    this.boundaries.forEach(boundary => {
      boundary.draw(c);
    });

    requestAnimationFrame(() => this.animate());
  }

  private animate(): void {
    // Animation stoppen, wenn animationActive false ist
    if (!this.animationActive) {
      return; 
    }
  
    const c: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d')!;
    c.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    this.boundaries.forEach((boundary) => {
      boundary.draw(c);
    });
  
    //this.handleInput(this.buttonText);
    this.player.update();
    this.player.checkBoundaryCollision(this.boundaries);
  
    // Check if the goal is reached before continuing with the animation
    if (!this.animationActive || this.player.checkGoalCollision()) {
      return;
    }
  
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

  // width and height of each boundary
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

  // make the goal a dark blue box
  draw(c: CanvasRenderingContext2D): void {
    c.fillStyle = '#09103B';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
class Goal {
  
  // width and height of goal
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

  // make the goal a green box
  draw(c: CanvasRenderingContext2D): void {
    c.fillStyle = 'green';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
} 
class Player {
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  radius: number;
  collision: boolean;
  private gameArea: GameAreaComponent;

  
  constructor(
    { position, velocity }: { position: { x: number; y: number }; velocity: { x: number; y: number } },
    gameArea: GameAreaComponent) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.collision = false;
    // providing the game-area-reference
    this.gameArea = gameArea; 
  }

  stopAnimation(): void {
    // stops animation
    this.gameArea.stopAnimation(); 
  }

  resetCollision(): void {
    // resets collisions
    this.collision = false;
  }

  draw(): void {
    // draws the canvas by selecting the canvas div in the html code
    const c: CanvasRenderingContext2D = document.querySelector('canvas')!.getContext('2d')!;
    c.beginPath();
    // paints a circle that turns red when colliding and is yellow by default
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    if(this.collision === true) {
      c.fillStyle = 'red';
    }
    else {
    c.fillStyle = '#fccb00';
    }
    c.fill();
    c.closePath();
  }

  update(): void {
    // updates velocity
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  resetVel(): void {
    // resets velocity
    this.velocity.x = 0;
    this.velocity.y = 0;
  }
  resetToStartPosition(): void {
    // calculates starting position and resets player to this position
    this.position = { x: Boundary.width + Boundary.width / 2, y: Boundary.height + Boundary.height / 2 };
  }
  checkBoundaryCollision(boundaries: Boundary[]): void {
    for (const boundary of boundaries) {
      // calculates the distance between the center of the circle (player) and the closest point on the rectangle (boundary)
      const closestX = Math.max(boundary.position.x, Math.min(this.position.x, boundary.position.x + boundary.width));
      const closestY = Math.max(boundary.position.y, Math.min(this.position.y, boundary.position.y + boundary.height));
  
      // calculate the distance between the closest point on the rectangle and the center of the circle
      const distanceX = this.position.x - closestX;
      const distanceY = this.position.y - closestY;
      const distanceSquared = distanceX * distanceX + distanceY * distanceY;
  
      // checks if the distance is less than the radius squared (collision occurs)
      if (distanceSquared < this.radius * this.radius) {
        console.log("Collision detected!");
        //console.log("Player position:", this.position);
        //console.log("Boundary position:", boundary.position);
        this.collision = true;
        this.gameArea.isPlayButtonDisabled = true;
        this.resetVel();
        this.draw()
      }
    }
  }

  checkGoalCollision(): boolean {

    // calculates the distance between the center of the circle (player) and the closest point on the rectangle (goal)
    const distanceX = this.position.x - this.gameArea.goal.position.x;
    const distanceY = this.position.y - this.gameArea.goal.position.y;
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;

    if (distanceSquared < this.radius * this.radius) {
      // player reached the goal
      console.log('Goal reached!');
      alert("Spiel beendet");
      this.gameArea.isPlayButtonDisabled = true; 
      return true;
    }
    return false;
  }
}

