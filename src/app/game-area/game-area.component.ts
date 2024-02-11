import { Component, AfterViewInit, Renderer2, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { timeout } from 'rxjs'; // also not used?
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-game-area',
  templateUrl: './game-area.component.html',
  styleUrls: ['./game-area.component.css']
})

export class GameAreaComponent implements AfterViewInit {
  @ViewChild('myCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  boundaries: Boundary[] = [];
  buttonText: string[] = [];
  icons: Icon[] = [];
  player!: Player;
  animationActive: boolean = true;
  isPlayButtonDisabled: boolean = false;
  goal!: Goal;
  dynamicText: string = 'Initial text in the textbox';
  clickedLink: string | null = null;
  collectedHeartsCount: number = 0;
  HeartsCount: number = 0;

  // map two dimensional array
  map: string[][] = [
    ['-','-','-','-','-','-','-','-','-','-'],
    ['-',' ',' ',' ','-',' ','-',' ',' ','-'],
    ['-','-','-','i','-','b','-','-',' ','-'],
    ['-',' ',' ',' ','-','i','-','-',' ','-'],
    ['-',' ','-','-','-',' ','-','-',' ','-'],
    ['-',' ',' ',' ',' ',' ','+',' ',' ','-'],
    ['-','-','-','-','-','-','-','-',' ','-'],
    ['-','-',' ',' ',' ','-','b',' ',' ','-'],
    ['-',' ',' ','-',' ',' ',' ','-',' ','-'],
    ['-','-','-','-','-','-','-','-','-','-'],
  ];

  onLinkClick(link: string) {
    this.clickedLink = link;
  }

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
      this.player.resetCollision();
      this.player.goalReached = false; // Setzen Sie die goalReached-Flag zurück
      this.updateRightColumn();
      this.collectedHeartsCount = 0;this.icons.forEach((icon) => {
      this.icons.forEach(icon => {
        icon.collected = false;
      });
      });
  }

  // deletes the code
  deleteText(): void {
    this.buttonText = [];
    this.updateRightColumn();
  }

  startGame() {
    console.log("start game");
    this.animateAction(0, 44);
    // TODO - Funktion Animation beendet --> Button disabled:
    this.isPlayButtonDisabled = true;
  }

  animateAction(index: number, steps: number) {
    // finds the direction in which the player-figure shold move
    if ((index < this.buttonText.length) && (this.animationActive == true)) {
      console.log(index)
      const element = this.buttonText[index];
      switch (element) {
        case 'goLeft();':
          console.log("left");
          this.animateMovement(index, -1, 0, steps);
          break;
        case 'goRight();':
          console.log("right");
          this.animateMovement(index, 1, 0, steps);
          break;
        case 'goUp();':
          console.log("up");
          this.animateMovement(index, 0, -1, steps);
          break;
        case 'goDown();':
          console.log("down");
          this.animateMovement(index, 0, 1, steps);
          break;
      }
      console.log("total"+this.HeartsCount);
      console.log("collected"+this.collectedHeartsCount);
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
  constructor(private toastr: ToastrService, private renderer: Renderer2) {
    this.player = new Player(
      {
        position: { x: Boundary.width + Boundary.width / 2, y: Boundary.height + Boundary.height / 2 },
        velocity: { x: 0, y: 0 },
      },
      this,
      toastr // Übergeben Sie eine Referenz auf das GameAreaComponent-Objekt
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

    // inserts the canvas and deletes the old one
    this.renderer.insertBefore(parent!, newCanvas, existingCanvas);
    this.renderer.removeChild(parent!, existingCanvas);

    this.canvasRef.nativeElement = newCanvas;
    const c: CanvasRenderingContext2D = newCanvas.getContext('2d')!;

    // calculates width of the canvas by multiplying the pixel width and height by the number of columns and rows
    newCanvas.width = this.map[0].length * Boundary.width;
    newCanvas.height = this.map.length * Boundary.height;

    // paints the canvas with each boundary being 44 pixels wide/high
    this.map.forEach((row, i) => {
      //for each row
      row.forEach((symbol, j) => {
        switch (symbol) {
          case '-':
            // create boundary if symbol == "-"
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
            // create goal if symbol == "+"
            this.goal = new Goal({
              position: {
                x: 44 * j, // Berücksichtigen Sie die Breite der Boundary
                y: 44 * i, // Berücksichtigen Sie die Höhe der Boundary
              },
            });
            break;
          case 'i':
            // create goal if symbol == "+"
            this.icons.push(
              new Icon({
                position: {
                  x: 44 * j,
                  y: 44 * i,
                },
                itemtype: "i",
              })
            );
            this.HeartsCount += 1;
            break;
          case 'b':
            // create goal if symbol == "+"
            this.icons.push(
              new Icon({
                position: {
                  x: 44 * j,
                  y: 44 * i,
                },
                itemtype: "b",
              })
            );
            break;
        }
      });
    });
    requestAnimationFrame(() => this.animate());
  }

  private animate(): void {
    // Animation stoppen, wenn animationActive false ist
    if (!this.animationActive) {
      return;
    }
    const c: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d')!;

    // clears rectangle on each frame 
    c.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    //prints chesspattern
    this.chesspattern(this.map);
    //prints boundaries
    this.boundaries.forEach((boundary) => {
      boundary.draw(c);
    });
    // print goal and update player
    this.goal.draw(c);
    this.player.checkIconCollision()
    this.icons.forEach((icon) => {
      if (!icon.collected) {
        icon.drawSVGIconOnCanvas(icon.itemtype, c);
      }
    });
    this.player.update();
    this.player.checkBoundaryCollision(this.boundaries);
    if (!this.animationActive || this.player.checkGoalCollision()) {
      return;
    }
    this.player.draw();
    requestAnimationFrame(() => this.animate());
  }
  
  private chesspattern(map: String[][]): void {
    const c: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d')!;
    map.forEach((row, i) => {
      //for each row
      row.forEach((symbol, j) => {
        // for each symbol
        // Draw chessboard pattern
      c.fillStyle = (i + j) % 2 === 0 ? 'white' : '#EEEEEE';
      c.fillRect(44 * i, 44 * j, Boundary.width, Boundary.height);

    });
  });
  }

  stopAnimation(): void {
    this.animationActive = false; // stops animation
  }

  startAnimation(): void {
    this.animationActive = true; // starts animation
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

class Icon {
  // width and height of goal
  static width: number = 32;
  static height: number = 32;
  collected: boolean = false; 
  static heartSVG: string = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
  <path fill="red" d="M9 2H5v2H3v2H1v6h2v2h2v2h2v2h2v2h2v2h2v-2h2v-2h2v-2h2v-2h2v-2h2V6h-2V4h-2V2h-4v2h-2v2h-2V4H9zm0 
  2v2h2v2h2V6h2V4h4v2h2v6h-2v2h-2v2h-2v2h-2v2h-2v-2H9v-2H7v-2H5v-2H3V6h2V4z"/>
  </svg>`;
  static bugSVG: string = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
  <path fill="currentColor" d="M8 2h2v4h4V2h2v4h2v3h2v2h-2v2h4v2h-4v2h2v2h-2v3H6v-3H4v-2h2v-2H2v-2h4v-2H4V9h2V6h2zm8 
  6H8v3h8zm-5 5H8v7h3zm2 7h3v-7h-3zM4 9H2V7h2zm0 10v2H2v-2zm16 0h2v2h-2zm0-10V7h2v2z"/></svg>`

  position: { x: number; y: number };
  width: number;
  height: number;
  itemtype: string;

  constructor({ position, itemtype}: { position: { x: number; y: number }, itemtype: string }) {
    this.position = position;
    this.itemtype = itemtype
    this.width = 32;
    this.height = 32;
  }

  // draw svg on canvas
  drawSVGIconOnCanvas(icontype: string, c: CanvasRenderingContext2D): void {
    let svgString: string = "";
    switch(icontype){
      case "i":
        svgString = Icon.heartSVG;
        break;
      case "b":   
      svgString = Icon.bugSVG;
        break;
    }
    
    const img = new Image();
    // decode svg string
    const decodedSvg = decodeURIComponent(svgString);
    // code svg string
    img.src = 'data:image/svg+xml;base64,' + btoa(decodedSvg);

    //draws image
    
    if (c) {
      // calculate the center position of a square
      const centerX = this.position.x + Boundary.width / 2;
      const centerY = this.position.y + Boundary.height / 2;
      // Adjust for the size of the SVG (32x32)
      const imageX = centerX - Icon.width/2; // 32/2 = 16
      const imageY = centerY - Icon.height/2; // 32/2 = 16
      // Draw the image centered in the box
      c.drawImage(img, imageX, imageY);
    }
    img.onerror = (e) => {
      console.error('Error loading SVG image', e);
    };
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
    gameArea: GameAreaComponent, // Fügen Sie eine zusätzliche Parameter für die GameArea hinzu
    private toastr: ToastrService
  ) {
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

  // this method is not used, need to be reviewed if its needed?
  resetToStartPosition(): void {
    // calculates starting position and resets player to this position
    this.position = { x: Boundary.width + Boundary.width / 2, y: Boundary.height + Boundary.height / 2 };
  }

  checkBoundaryCollision(boundaries: Boundary[]): void {
    if (this.collision) {
      return; // Wenn eine Kollision bereits erkannt wurde, tue nichts
    }

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
        this.collision = true;
        alert("Kollision Spiel beendet");
        this.gameArea.isPlayButtonDisabled = true;
        this.resetVel();
        this.draw();
        this.stopAnimation();
        return; // Verlasse die Schleife, da die Kollision bereits erkannt wurde
      }
    }
  }

  showToast(): void {
    this.toastr.success('Herzlichen Glückwunsch!', 'Spiel beendet.', {
      positionClass: 'toast-center', // Fügen Sie diese Zeile hinzu
    });
  }
  
  checkIconCollision(): void {
    if (this.collision) {
      return;
  }
    // Iteriere über alle Icons im Spielbereich
    for (const icon of this.gameArea.icons) {
      if (icon.collected) {
          continue; // Überspringe dieses Icon, wenn es bereits gesammelt wurde
      }
      const closestX = Math.max(icon.position.x, Math.min(this.position.x, icon.position.x + icon.width));
      const closestY = Math.max(icon.position.y, Math.min(this.position.y, icon.position.y + icon.height));
      // calculate the distance between the closest point on the rectangle and the center of the circle
      const distanceX = this.position.x - closestX;
      const distanceY = this.position.y - closestY;
      const distanceSquared = distanceX * distanceX + distanceY * distanceY;
      // Überprüfe, ob eine Kollision vorliegt
      if (distanceSquared < this.radius * this.radius) {
          // Kollision erkannt, führe entsprechende Aktionen aus
          icon.collected = true;
          this.gameArea.collectedHeartsCount++; 
          // Weitere Behandlung, z. B. Punktezählung oder Animation
      }
  }
  }

  checkGoalCollision(): boolean {
    // calculate x and y distance to the finish-square
    const distanceX = this.position.x - (this.gameArea.goal.position.x + 22);
    const distanceY = this.position.y - (this.gameArea.goal.position.y + 22);

    // if finish reached, create alert
    if (distanceX == 0 && distanceY == 0 && this.gameArea.collectedHeartsCount == this.gameArea.HeartsCount && this.goalReached !== true) {
      console.log('Goal reached!');
      alert("Ziel erreicht");
      this.showToast();
      this.gameArea.isPlayButtonDisabled = true;
      this.goalReached = true;
      return true;
    }
    return false;
  }
}
