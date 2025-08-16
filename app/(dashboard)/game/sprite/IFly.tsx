import Control from "../utils";
import { BOOM } from "./IParticle";

const ENEMY_WIDTH = 60;
const ENEMY_HEIGHT = 44;
class Enemy {
  frameX: number;
  frameY: number;
  fps: number;
  frameInterval: number;
  frameTimer: number;
  dxEnemy: number;
  dyEnemy: number = 0;
  speedDx: number;
  speedDy: number;
  imageEnemy: HTMLImageElement | undefined;
  ctx: CanvasRenderingContext2D | undefined;
  EnemyWidth: number = 0;
  EnemyHeight: number = 0;
  EnemyWidthDraw: number = 0;
  EnemyHeightDraw: number = 0;
  marForDeletion: boolean = false;
  maxFrame: number = 0;
  deltaTime: number;
  widthFrame: number = 0;
  gravityEnemy = 0.1;
  vyEnemy = 0;
  constructor() {
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 20;
    this.frameInterval = 1000 / this.fps;
    this.frameTimer = 0;
    this.dxEnemy = Control.CANVAS_WIDTH;
    this.speedDx = 5;
    this.speedDy = 1;
    this.deltaTime = 0;
    this.vyEnemy = Math.random() * (this.gravityEnemy * 2);
  }

  update(deltaTime: number) {
    // movement
    this.dxEnemy -= this.speedDx;

    // timing of sprites
    if (this.frameTimer > this.frameInterval) {
      if (this.frameX < this.maxFrame) {
        this.frameX++;
      } else {
        this.frameX = 0;
      }
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }

  draw() {
    if (this.ctx && this.imageEnemy) {
      this.ctx.drawImage(
        this.imageEnemy,
        this.frameX * this.EnemyWidth,
        this.frameY * this.EnemyHeight,
        this.EnemyWidth,
        this.EnemyHeight,
        this.dxEnemy,
        this.dyEnemy,
        this.EnemyWidthDraw,
        this.EnemyHeightDraw
      );
    }
  }
}

class FlyEnemy extends Enemy {
  constructor(game: any) {
    super();
    this.imageEnemy = game?.imageEnemy;
    this.ctx = game.ctx;
    this.deltaTime = game?.deltaTime;
    this.maxFrame = 5;
    this.EnemyWidth = game.imageEnemy?.naturalWidth / (this.maxFrame + 1); // 293
    this.EnemyHeight = game.imageEnemy?.naturalHeight || 155;
    this.dyEnemy = Math.random() * Control.CANVAS_HEIGHT * 0.5;
    this.EnemyWidthDraw = this.EnemyWidth / 3;
    this.EnemyHeightDraw = this.EnemyHeight / 3;
  }
  update(deltaTime: number) {
    this.gravityEnemy += this.vyEnemy;
    this.dyEnemy += Math.sin(this.gravityEnemy);

    super.update(deltaTime);
  }
}

class GroundEnemy extends Enemy {
  constructor(game: any) {
    super();
    this.imageEnemy = game?.imageEnemyPlant;
    this.ctx = game.ctx;
    this.deltaTime = game?.deltaTime;
    this.maxFrame = 1;
    this.EnemyWidth = game?.imageEnemyPlant?.naturalWidth / (this.maxFrame + 1);
    this.EnemyHeight = game?.imageEnemyPlant?.naturalHeight || 155;
    this.dyEnemy = Control.CANVAS_HEIGHT - 170;
    this.EnemyHeightDraw = this.EnemyHeight;
    this.EnemyWidthDraw = this.EnemyWidth;
  }
  update(deltaTime: number) {
    super.update(deltaTime);
  }
}
class ClimbingEnemy extends Enemy {
  constructor(game: any) {
    super();
    this.imageEnemy = game?.imageEnemySpider;
    this.ctx = game.ctx;
    this.deltaTime = game?.deltaTime;
    this.maxFrame = 5;
    this.EnemyWidth =
      game?.imageEnemySpider?.naturalWidth / (this.maxFrame + 1);
    this.EnemyHeight = game?.imageEnemySpider?.naturalHeight || 155;
    this.EnemyHeightDraw = this.EnemyHeight;
    this.EnemyWidthDraw = this.EnemyWidth;
  }
  update(deltaTime: number) {
    super.update(deltaTime);
    this.gravityEnemy += this.vyEnemy;
    this.dyEnemy += this.gravityEnemy;
    if (this.dyEnemy > Control.CANVAS_HEIGHT - this.EnemyHeightDraw - 200) {
      this.vyEnemy *= -1;
      this.gravityEnemy *= -1;
    }
  }
  draw() {
    super.draw();
    this.ctx?.beginPath();
    this.ctx?.moveTo(this.dxEnemy + this.EnemyWidthDraw / 2, 0);
    this.ctx?.lineTo(this.dxEnemy + this.EnemyWidthDraw / 2, this.dyEnemy + 50);
    this.ctx?.stroke();
  }
}

export { Enemy, FlyEnemy, GroundEnemy, ClimbingEnemy };
