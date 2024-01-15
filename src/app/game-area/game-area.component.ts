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

  resetGame() {
      this.player.position = {  x: Boundary.width + Boundary.width / 2, y: Boundary.height + Boundary.height / 2 };
      this.player.resetCollision();
      this.player.goalReached = false; // Setzen Sie die goalReached-Flag zurück
      this.updateRightColumn();
  }
  
  deleteText(): void {
    this.buttonText = [];
  }

  startGame() {
    this.animateAction(0, 44);
    // Funktion Animation beendet --> Button disabled:
    this.isPlayButtonDisabled = true;
  }
  
  animateAction(index: number, steps: number) {
    
    if ((index < this.buttonText.length) && (this.animationActive == true)) {
      console.log(index)
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
    this.player = new Player(
      {
        position: { x: Boundary.width + Boundary.width / 2, y: Boundary.height + Boundary.height / 2 },
        velocity: { x: 0, y: 0 },
      },
      this // Übergeben Sie eine Referenz auf das GameAreaComponent-Objekt
    );
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
      ['-',' ',' ',' ','-',' ','-',' ',' ','-'],
      ['-','-','-',' ','-',' ','-','-',' ','-'],
      ['-',' ',' ',' ','-',' ','-','-',' ','-'],
      ['-',' ','-','-','-',' ','-','-',' ','-'],
      ['-',' ',' ','+',' ',' ',' ',' ',' ','-'],
      ['-','-','-','-','-','-','-','-',' ','-'],
      ['-','-',' ',' ',' ','-',' ',' ',' ','-'],
      ['-',' ',' ','-',' ',' ',' ','-',' ','-'],
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
          case '+':
            this.goal = new Goal({
              position: {
                x: 44 * j, // Berücksichtigen Sie die Breite der Boundary
                y: 44 * i, // Berücksichtigen Sie die Höhe der Boundary
              },
            });
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
      return;
    }
  
    const c: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d')!;
    c.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    this.boundaries.forEach((boundary) => {
      boundary.draw(c);
    });
  
    // Zeichne das Ziel unabhängig von der Überprüfung der Goal-Kollision
    this.goal.draw(c);
  
    this.player.update();
    this.player.checkBoundaryCollision(this.boundaries);
  
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
class Goal {
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
  goalReached: boolean = false;

  constructor(
    { position, velocity }: { position: { x: number; y: number }; velocity: { x: number; y: number } },
    gameArea: GameAreaComponent // Fügen Sie eine zusätzliche Parameter für die GameArea hinzu
  ) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
    this.collision = false;
    this.gameArea = gameArea; // Weisen Sie die GameArea-Referenz zu
  }

  stopAnimation(): void {
    this.gameArea.stopAnimation(); // Rufen Sie die Methode stopAnimation aus GameAreaComponent auf
  }

  resetCollision(): void {
    this.collision = false;
  }

  draw(): void {
    const c: CanvasRenderingContext2D = document.querySelector('canvas')!.getContext('2d')!;
    c.beginPath();
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
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  resetVel(): void {
    this.velocity.x = 0;
    this.velocity.y = 0;
  }
  resetToStartPosition(): void {
    this.position = { x: Boundary.width + Boundary.width / 2, y: Boundary.height + Boundary.height / 2 };
  }
  checkBoundaryCollision(boundaries: Boundary[]): void {
    for (const boundary of boundaries) {
      // Calculate the distance between the center of the circle (player) and the closest point on the rectangle (boundary)
      const closestX = Math.max(boundary.position.x, Math.min(this.position.x, boundary.position.x + boundary.width));
      const closestY = Math.max(boundary.position.y, Math.min(this.position.y, boundary.position.y + boundary.height));
  
      // Calculate the distance between the closest point on the rectangle and the center of the circle
      const distanceX = this.position.x - closestX;
      const distanceY = this.position.y - closestY;
      const distanceSquared = distanceX * distanceX + distanceY * distanceY;
  
      // Check if the distance is less than the radius squared (collision occurs)
      if (distanceSquared < this.radius * this.radius) {
        // Print information for debugging
        console.log("Collision detected!");
        //console.log("Player position:", this.position);
        //console.log("Boundary position:", boundary.position);
  
        // Uncomment the following line to reset the player's position upon collision
        // this.resetToStartPosition();
  
        // Adjust player velocity after collision (set to 0 for simplicity)
        this.collision = true;
        //this.stopAnimation()
        this.gameArea.isPlayButtonDisabled = true;
        this.resetVel();
        this.draw()
        //this.resetToStartPosition()
        // You can add additional logic here based on your requirements
      }
    }
  }

  checkGoalCollision(): boolean {
    if (this.goalReached) {
      return false;
    }
    console.log(this.gameArea.goal.position.x, "goalposx")
    console.log(this.gameArea.goal.position.y, "goalposy")
    const distanceX = this.position.x - (this.gameArea.goal.position.x + 44);
    const distanceY = this.position.y - (this.gameArea.goal.position.y + 44);
    const distanceSquared = distanceX * distanceX + distanceY * distanceY;
  
    // Überprüfen Sie, ob die Distanz kleiner als die Summe der Radien von Spieler und Ziel ist
    const combinedRadius = this.radius + Goal.width / 2; // Beachten Sie die Breite des Ziels
    if (distanceSquared < combinedRadius * combinedRadius) {
      console.log('Goal reached!');
      alert("Spiel beendet");
      this.gameArea.isPlayButtonDisabled = true;
      this.goalReached = true;
      this.stopAnimation();
      return true;
    }
  
    return false;
  }
  
  
  

  
 
}

