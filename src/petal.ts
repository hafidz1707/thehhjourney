class Petal {
    x: number;
    y: number;
    rotation: number;
    speedX: number;
    speedY: number;
    rotationSpeed: number;
    size: number;
    img: HTMLImageElement;
  
    constructor(img: HTMLImageElement, canvasWidth: number, canvasHeight: number) {
      this.x = Math.random() * canvasWidth;
      this.y = Math.random() * canvasHeight - canvasHeight;
      this.rotation = Math.random() * 360;
      this.speedX = Math.random() * 1 - 0.5;
      this.speedY = Math.random() * 2 + 1;
      this.rotationSpeed = Math.random() * 2 - 1;
      this.size = Math.random() * 20 + 20;
      this.img = img;
    }
  
    update(canvasWidth: number, canvasHeight: number) {
      this.x += this.speedX;
      this.y += this.speedY;
      this.rotation += this.rotationSpeed;
  
      if (this.y > canvasHeight) {
        this.y = -this.size;
        this.x = Math.random() * canvasWidth;
      }
    }
  
    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation * Math.PI / 180);
      ctx.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    }
  }
  
  export default Petal;