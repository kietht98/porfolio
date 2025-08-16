class Particle {
  game: any;
  markedForDeletion: boolean = false;
  x: number = 0;
  speedX: number = 0;
  y: number = 0;
  speedY: number = 0;
  size: number = 1;
  constructor(game: any) {
    this.game = game;
  }
  update(deltaTime?: number) {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= 0.95;
    if (this.size < 0.5) {
      this.markedForDeletion = true;
    }
  }
}

export class DUST extends Particle {
  color: string;
  constructor(game: any, x: number, y: number) {
    super(game);
    this.game = game;
    this.size = Math.random() * 10 + 10;
    this.x = x;
    this.y = y;
    this.speedX = Math.random();
    this.speedY = Math.random();
    this.color = "RED";
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
}

export class Fire extends Particle {
  va: number;
  angle: number = 0;
  constructor(game: any, x: number, y: number) {
    super(game);
    this.game = game;
    this.size = Math.random() * 10 + 100;
    this.x = x;
    this.y = y;
    this.speedX = 1;
    this.speedY = 1;
    this.va = Math.random() * 0.2 - 0.1;
  }

  update() {
    super.update();
    this.angle += this.va;
  }

  draw(ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
    if (ctx && image) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.drawImage(
        image,
        -this.size * 0.5,
        -this.size * 0.5,
        this.size,
        this.size
      );
      ctx.restore();
    }
  }
}

export class BOOM extends Particle {
  maxFrame: number = 0;
  sx: number = 0;
  sy: number = 0;
  speed: number = 5;
  frameInterval: number = 50;
  timer: number = 0;
  image: HTMLImageElement;
  width: number = 0;
  height: number = 0;
  constructor(game: any, image: HTMLImageElement, x: number, y: number) {
    super(game);
    this.x = x;
    this.y = y;
    this.maxFrame = 5;
    this.image = image;
    if (image) {
      this.width = image.naturalWidth / this.maxFrame;
      this.height = image.naturalHeight;
    }
  }
  update(deltaTime: number) {
    if (this.timer > this.frameInterval) {
      if (this.sx < this.maxFrame) {
        this.sx++;
        this.timer = 0;
      }
    } else {
      this.timer += deltaTime;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (ctx) {
      ctx.drawImage(
        this.image,
        this.sx * this.width,
        this.sy,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }
}

type Information =  Promise<string>



type IBike<T> = T extends Promise<infer Information> ? Information : T;

type Result  = IBike<Information>;
const result : Result  = ""