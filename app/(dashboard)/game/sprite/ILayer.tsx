import Control from "../utils";

export class Layer {
  x = 0;
  x2 = 1667;
  gameSpeed = 10;
  gameSpeedModify = 1;
  width = 1667;
  height = Control.CANVAS_HEIGHT - 500;
  image: HTMLImageElement;
  ctx: CanvasRenderingContext2D;
  constructor(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement | null,
    gameSpeedModify: number
  ) {
    this.ctx = ctx;
    if (image?.src) {
      this.image = image;
    } else {
      this.image = new Image();
    }
    this.gameSpeedModify = gameSpeedModify;
    this.gameSpeed = Control.SPEED * this.gameSpeedModify;
  }

  update() {
    if (this.x <= -this.width) {
      this.x = this.width + this.x2 - this.gameSpeed;
    }
    if (this.x2 <= -this.width) {
      this.x2 = this.width + this.x - this.gameSpeed;
    }
    this.x = Math.floor(this.x - this.gameSpeed);
    this.x2 = Math.floor(this.x2 - this.gameSpeed);
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.height);
    this.ctx.drawImage(this.image, this.x2, this.height);
  }
}
