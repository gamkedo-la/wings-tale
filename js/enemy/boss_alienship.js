const ALIENSHIP_FRAMES = 0;
const ALIENSHIP_IMAGE_NAME = "alien ship";

bossAlienshipClass.prototype = new moveDrawClass();

function bossAlienshipClass() {
  this.xv = 2;
  this.yv = .5;

  this.reset = function () {
    this.x = 50;
    this.y = 120;
  };

  this.move = function () {
    this.x += this.xv;
    if (this.x > GAME_W / 1.2) {
      this.xv = -this.xv;
    }
    if (this.x < 50 / 1.2) {
      this.xv = -this.xv;
    }
  
    this.y += this.yv;
    if (this.y > 120) {
      this.yv = -this.yv;
    }
    if (this.y < 70) {
      this.yv = -this.yv;
    }
  };

  
  this.draw = function () {
    drawAnimFrame(ALIENSHIP_IMAGE_NAME, this.x, this.y, this.frame, 256, 240);

    if (this.hitFlashFrames) {
        this.hitFlashFrames--;
        context.globalCompositeOperation = "lighter"; // brighten stuff up
        drawAnimFrame(ALIENSHIP_IMAGE_NAME, this.x, this.y, this.frame, 256, 240);
        drawAnimFrame(ALIENSHIP_IMAGE_NAME, this.x, this.y, this.frame, 256, 240);
        context.globalCompositeOperation = "source-over"; // restore to default
    }

    if (50 * Math.random() < 2) {
      new enemyShotClass(this.x , this.y + 10);
      new enemyShotClass(this.x - 60, this.y - 10);
      new enemyShotClass(this.x - 90, this.y - 55);
      new enemyShotClass(this.x + 60, this.y - 10);
      new enemyShotClass(this.x + 90, this.y - 55);
    }
    for (var i = 0; i < ALIENSHIP_FRAMES; i++) {
      this.neckAngles[i] += 0.01 * Math.cos(this.neckAnglesOsc[i]);
      this.neckAnglesOsc[i] += 0.04 + Math.random() * 0.01;
    }
  };

  this.animate = function () {
    this.frame++;
    if (this.frame >= ALIENSHIP_FRAMES) {
      this.frame = 0;
    }
  };

  this.takeDamage = function () {
    //console.log("flashing alien ship boss on hit!");
    this.hitFlashFrames = HIT_FLASH_FRAMECOUNT;
  };
}
