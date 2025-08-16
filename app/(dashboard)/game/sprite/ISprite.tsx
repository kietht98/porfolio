import Control from "../utils";
import { ClimbingEnemy, FlyEnemy, GroundEnemy } from "./IFly";
import { BOOM, DUST, Fire } from "./IParticle";

export class Player {
  // coordinates
  static width = Control.SPRITE.width;
  static height = Control.SPRITE.height;
  static frameX = 0;
  static frameY = 0;
  static dx = 0;
  static dy = Control.CANVAS_HEIGHT - this.height - this.height;
  static states: any[];
  // control game
  static vx = 0;
  static vy = 0;
  static state = 0;
  static speed = 5;
  static gravity = 0;
  static input = "";
  static maxFrame = 5;
  static currentState: any;
  static enemies: FlyEnemy[] = [];
  static count: number = 0;
  static particles: DUST[] = [];
  static countLose: number = 0;
  static imageParticles: Fire[] = [];
  static imageBoom: HTMLImageElement;
  static boom: BOOM;
  static collisions: BOOM[] = [];
  static ctx: CanvasRenderingContext2D;
  static setState(state: number) {
    if (Player.currentState.state !== Player.states[state].state) {
      Player.currentState = Player.states[state];
      Player.currentState.enter();
    }
    Player.state = state;
  }
  static onGround() {
    return Player.dy >= Control.CANVAS_HEIGHT - Player.height * 3;
  }

  static updateInput(value: string) {
    Player.input = value;
  }

  static handleMoveActions(window: Window) {
    window.addEventListener("keydown", function (event) {
      let input = Player.input;
      switch (event.key) {
        case "ArrowLeft":
          input = "PRESS left";
          break;
        case "ArrowRight":
          input = "PRESS right";
          break;
        case "ArrowUp":
          input = "PRESS up";
          break;
        case "ArrowDown":
          input = "PRESS down";
          break;
        case "Control":
          input = "PRESS attack";
          break;
        case "a":
          input = "PRESS left";
          break;
        case "d":
          input = "PRESS right";
          break;
        case "w":
          input = "PRESS up";
          break;
        case "s":
          input = "PRESS down";
          break;
        case " ":
          input = "PRESS attack";
          break;
      }
      Player.updateInput(input);
    });
    window.addEventListener("keyup", function (e) {
      let input = Player.input;
      switch (e.key) {
        case "ArrowLeft":
          input = "RELEASE left";
          break;
        case "ArrowRight":
          input = "RELEASE right";
          break;
        case "ArrowUp":
          input = "RELEASE up";
          break;
        case "ArrowDown":
          input = "RELEASE down";
          break;
        case "Control":
          input = "RELEASE attack";
          break;
        case "a":
          input = "RELEASE left";
          break;
        case "d":
          input = "RELEASE right";
          break;
        case "w":
          input = "RELEASE up";
          break;
        case "s":
          input = "RELEASE down";
          break;
        case " ":
          input = "RELEASE attack";
          break;
      }
      Player.updateInput(input);
    });
  }

  static checkCollision(deltaTime: number) {
    Player.enemies.forEach((enemy, index) => {
      if (
        enemy.dxEnemy < Player.dx + Player.width &&
        enemy.dxEnemy + enemy.EnemyWidthDraw > Player.dx &&
        enemy.dyEnemy < Player.dy + Player.height &&
        enemy.dyEnemy + enemy.EnemyHeightDraw > Player.dy
      ) {
        Player.enemies.splice(index, 1);
        enemy.marForDeletion = true;
        const boom = new BOOM(
          Player.ctx,
          Player.imageBoom,
          Player.dx,
          Player.dy
        );
        boom.markedForDeletion = true;
        Player.collisions.push(boom);
        Player.count += 1;
      } else {
        Player.countLose -= 1;
      }
    });
  }
}

export class SpritePlayer extends Player {
  ctx: CanvasRenderingContext2D;
  image: HTMLImageElement;
  states = [
    new Standing(),
    new Running(),
    new Jumping(),
    new Sitting(),
    new Rolling(),
    new Falling(),
  ];
  currentState: any;
  frameInterval = 50;
  timer = 0;
  enemyTimer = 0;
  enemyInterval = 1000;
  enemies: FlyEnemy[] = [];
  imageEnemySpider: HTMLImageElement | undefined;
  imageEnemyPlant: HTMLImageElement | undefined;
  imageEnemy: HTMLImageElement;
  deltaTime: number = 0;
  particles: DUST[] = [];
  imageFire: HTMLImageElement;

  constructor(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement | null,
    images: {
      imageEnemy: HTMLImageElement;
      imageEnemyPlant?: HTMLImageElement;
      imageEnemySpider?: HTMLImageElement;
    },
    imageParticles: {
      imageFire: HTMLImageElement;
      imageBoom: HTMLImageElement;
    }
  ) {
    super();
    this.ctx = ctx;
    Player.ctx = ctx;
    this.image = image || new Image();
    this.imageEnemy = images?.imageEnemy;
    this.imageEnemyPlant = images?.imageEnemyPlant;
    this.imageEnemySpider = images?.imageEnemySpider;
    this.currentState = this.states[0];
    Player.states = this.states;
    Player.currentState = this.states[0];
    Player.enemies = this.enemies;
    this.imageFire = imageParticles.imageFire;
    Player.imageBoom = imageParticles.imageBoom;
  }

  update(deltaTime: number) {
    Player?.currentState?.handleInput?.(Player.input);
    this.deltaTime = deltaTime;
    this.addEnemy(deltaTime);
    Player.enemies.forEach((enemy, index) => {
      if (enemy.dxEnemy > 0) {
        enemy.update(deltaTime);
      } else {
        Player.enemies.splice(index, 1);
      }
    });

    // boundaries
    if (Player.dx < 0) {
      Player.dx = 0;
    } else if (Player.dx > Control.CANVAS_MAX_WIDTH - Player.width) {
      Player.dx = Control.CANVAS_MAX_WIDTH - Player.width;
      Player.setState(1);
    }
    if (Player.dy > Control.CANVAS_HEIGHT - Player.height - Player.height) {
      Player.dy = Control.CANVAS_HEIGHT - Player.height - Player.height;
    }

    // movement
    Player.dx += Player.vx;
    Player.vy += Player.gravity;
    Player.dy += Player.vy;

    // gravity
    if (Player.dy < Control.CANVAS_HEIGHT - Player.height - Player.height) {
      Player.gravity += 0.1;
    } else {
      Player.gravity = 0;
      Player.vy = 0;
    }
    // timing of sprites
    if (this.timer > this.frameInterval) {
      if (Player.frameX < Player.maxFrame) Player.frameX++;
      else Player.frameX = 0;
      this.timer = 0;
    } else {
      this.timer += deltaTime;
    }
    Player.checkCollision(deltaTime);
    Player.imageParticles.forEach((fire, index) => {
      fire.update();
      if (fire.markedForDeletion) {
        Player.imageParticles.splice(index, 1);
      }
    });
    Player.collisions.forEach((collision, index) => {
      collision.update(deltaTime);
    });
  }

  addEnemy(deltaTime: number) {
    if (this.enemyTimer > this.enemyInterval) {
      Player.enemies.push(new FlyEnemy(this));
      if (this.enemyTimer > this.enemyInterval + 100) {
        Player.enemies.push(new GroundEnemy(this));
      }
      if (this.enemyTimer > this.enemyInterval + 150) {
        Player.enemies.push(new ClimbingEnemy(this));
      }
      this.enemyTimer = 0;
    } else {
      this.enemyTimer += deltaTime;
    }
  }

  draw() {
    this.ctx.drawImage(
      this.image,
      Player.frameX * Player.width,
      Player.frameY * Player.height,
      Player.width,
      Player.height,
      Player.dx,
      Player.dy,
      Player.width,
      Player.height
    );
    Player.enemies.forEach((enemy) => {
      enemy.draw();
    });
    Player.imageParticles.forEach((fire, index) => {
      fire.draw(this.ctx, this.imageFire);
    });
    Player.collisions.forEach((collision) => {
      collision.draw(this.ctx);
    });
  }

  handleMove(window: Window) {
    Player.handleMoveActions(window);
  }
}

class Standing extends Player {
  state = "STANDING";

  enter() {
    Player.vx = 0;
    Player.frameX = 0;
    Player.frameY = 0;
    Player.maxFrame = 6;
  }
  handleInput(input: string) {
    if (input === "PRESS right") {
      Player.vx = Player.speed;
      Player.setState(1); // running
    } else if (input === "PRESS left") {
      Player.vx = -Player.speed;
      Player.setState(1); // running
    } else if (input === "PRESS up") {
      if (Player.onGround()) {
        Player.setState(2); // jumping
      }
    } else if (input === "PRESS down") {
      Player.setState(3); // sitting
    } else if (input === "PRESS attack") {
      Player.setState(4); // rolling
    }
  }
}

class Running extends Player {
  state = "RUNNING";

  enter() {
    Player.frameX = 0;
    Player.frameY = 3;
    Player.maxFrame = 8;
  }
  handleInput(input: string) {
    // Player.particles.push(
    //   new DUST(Player, Player.dx, Player.dy + Player.height)
    // );
    Player.imageParticles.push(
      new Fire(Player, Player.dx, Player.dy + Player.height)
    );
    if (input === "PRESS right") {
      Player.vx = Player.speed;
      Player.setState(1); // running
    } else if (input === "RELEASE right") {
      if (Player.vx > 0 && Player.onGround()) {
        Player.setState(0); // standing
      }
    } else if (input === "PRESS left") {
      Player.vx = -Player.speed;
      Player.setState(1); // running
    } else if (input === "RELEASE left") {
      if (Player.vx < 0 && Player.onGround()) {
        Player.setState(0); // standing
      }
    } else if (input === "PRESS up") {
      if (Player.onGround()) {
        Player.setState(2); // jumping
      }
    } else if (input === "PRESS down") {
      Player.setState(3); // sitting
    } else if (input === "PRESS attack") {
      Player.setState(4); // rolling
    }
  }
}

class Jumping extends Player {
  state = "JUMPING";

  enter() {
    Player.vy = -25;
    Player.dy -= 1;
    Player.frameX = 0;
    Player.frameY = 1;
    Player.maxFrame = 6;
    this.handleJumpEvent();
  }
  handleInput(input: string) {
    // Player.particles.push(
    //   new DUST(Player, Player.dx, Player.dy + Player.height)
    // );
    Player.imageParticles.push(
      new Fire(Player, Player.dx, Player.dy + Player.height)
    );
    if (input === "PRESS right") {
      Player.vx = Player.speed;
      Player.setState(1); // running
    } else if (input === "PRESS left") {
      Player.vx = -Player.speed;
      Player.setState(1); // running
    } else if (input === "PRESS attack") {
      Player.setState(4); // rolling
    }
  }
  handleJumpEvent() {
    if (Player.vy < Player.gravity) {
      requestAnimationFrame(this.handleJumpEvent.bind(this));
    } else {
      Player.setState(5); // falling
    }
  }
}

class Sitting extends Player {
  state = "SITTING";

  enter() {
    Player.vx = 0;
    Player.frameX = 0;
    Player.frameY = 5;
    Player.maxFrame = 4;
  }
  handleInput(input: string) {
    if (input === "PRESS right") {
      Player.vx = Player.speed;
      Player.setState(1); // running
    } else if (input === "PRESS left") {
      Player.vx = -Player.speed;
      Player.setState(1); // running
    } else if (input === "RELEASE down") {
      //Player.setState(0); // standing
    } else if (input === "PRESS up") {
      Player.setState(2); // jumping
    } else if (input === "PRESS attack") {
      Player.setState(4); // rolling
    }
  }
}

class Rolling extends Player {
  state = "ROLLING";
  enter() {
    Player.vx = Player.speed * 2;
    Player.frameX = 0;
    Player.frameY = 6;
    Player.maxFrame = 6;
  }
  handleInput(input: string) {
    if (input === "RELEASE right") {
      Player.setState(0); // standing
    } else if (input === "RELEASE left") {
      Player.setState(0); // standing
    } else if (input === "RELEASE attack") {
      Player.setState(0); // standing
    }
  }
}

class Falling extends Player {
  state = "FALLING";

  enter() {
    Player.frameX = 0;
    Player.frameY = 2;
    Player.maxFrame = 6;
    this.handleFalling();
  }
  handleInput(input: string) {
    // Player.particles.push(
    //   new DUST(Player, Player.dx, Player.dy + Player.height)
    // );
    Player.imageParticles.push(
      new Fire(Player, Player.dx, Player.dy + Player.height)
    );
    if (input === "PRESS down") {
      Player.setState(1); // Running
    }
  }
  handleFalling() {
    if (!Player.onGround()) {
      requestAnimationFrame(this.handleFalling.bind(this));
    } else {
      Player.setState(0); // standing
    }
  }
}
