class IShape2D {
  x: number;
  y: number;
  width: number;
  height: number;
  path2D = new Path2D();
  ctx: CanvasRenderingContext2D;
  color: string = "blue";
  coordinates: {
    x: number;
    y: number;
  };
  edit: boolean = false;
  constructor(
    ctx: CanvasRenderingContext2D,
    x?: number,
    y?: number,
    width?: number,
    height?: number
  ) {
    this.x = x ?? 50;
    this.y = y ?? 50;
    this.width = width ?? 150;
    this.height = height ?? 100;
    this.ctx = ctx;
    this.coordinates = {
      x: this.x,
      y: this.y,
    };
  }
  initial() {
    return this.path2D;
  }

  setEdit() {
    this.edit = !this.edit;
  }

  initialDraw(color?: string) {
    this.path2D.rect(this.x, this.y, this.width, this.height);
    this.ctx.fillStyle = color ?? this.color;
    if (color) {
      this.color = color;
    }
    this.ctx.closePath();
    this.ctx.fill(this.path2D);
  }

  getPosition() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  isPointInPath2D(x: number, y: number) {
    if (this.ctx.isPointInPath(this.path2D, x + 10, y + 10)) {
      return true;
    } else {
      return false;
    }
  }

  draw(position: { x: number; y: number }, color?: string) {
    if (!this.edit) {
      return;
    }
    console.log("coordinates", this.width);
    this.path2D = new Path2D();
    this.ctx.clearRect(
      this.coordinates.x,
      this.coordinates.y,
      this.width,
      this.height
    );

    this.path2D.rect(position.x, position.y, this.width, this.height);
    this.ctx.fillStyle = color ?? this.color;
    this.ctx.closePath();
    this.ctx.fill(this.path2D);
    this.coordinates.x = position.x;
    this.coordinates.y = position.y;
    this.x = position.x;
    this.y = position.y;
  }
}

export { IShape2D };
