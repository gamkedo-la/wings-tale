const OCTOPUS_FRAMES = 0;
const OCTOPUS_IMAGE_NAME = "octopus";

bossOctopusClass.prototype = new moveDrawClass();

function bossOctopusClass() {
  this.defaultTentacleShotTimer = 15;
  this.defaultMainShotTImer = 90;
  this.tentacleShotTimer = this.defaultTentacleShotTimer;
  this.mainShotTimer = this.defaultMainShotTImer;
  this.tentacle_positions = [
    { x: 0, y: 16 },
    { x: 8, y: 64 },
    { x: 96, y: 148 },
    { x: 144, y: 148 },
    { x: 240, y: 16 },
    { x: 240, y: 64 },
  ];
  this.currentTentacle = 0;
  this.x = GAME_W / 2;
  this.y = 64;
  this.health = 100;
  this.collW = this.collH = 64;
  this.readyToRemove = false;

  this.reset = function () {};

  this.move = function () {
    this.tentacleShotTimer -= 1;
    this.mainShotTimer -= 1;
    if (this.tentacleShotTimer <= 0) {
      this.tentacleShotTimer = this.defaultTentacleShotTimer;
      this.shoot();
    }

    if (this.mainShotTimer <= 0) {
      this.mainShotTimer = this.defaultMainShotTImer;
      this.shootFromFace();
    }
  };

  this.shoot = function () {
    var tentacle = this.tentacle_positions[this.currentTentacle];
    newShot = new enemyShotClass(tentacle.x, tentacle.y, ENEMY_SHOT_SPEED);
    enemyShotList.push(newShot);
    this.currentTentacle++;
    if (this.currentTentacle > this.tentacle_positions.length - 1) {
      this.currentTentacle = 0;
    }
  };

  this.shootFromFace = function () {
    newShot1 = new shotClass(this.x - 16, this.y - 16, 10, 180, 0, 2, 10, this);
    newShot2 = new shotClass(this.x, this.y, 10, 180, 0, 2, 10, this);
    newShot3 = new shotClass(this.x + 16, this.y - 16, 10, 180, 0, 2, 10, this);
    enemyShotList.push(newShot1);
    enemyShotList.push(newShot2);
    enemyShotList.push(newShot3);
  };

  this.draw = function () {
    drawAnimFrame(OCTOPUS_IMAGE_NAME, 128, 120, this.frame, 256, 240);
    // this.tentacle_positions.forEach((tentacle) => {
    //   context.fillRect(tentacle.x, tentacle.y, 16, 16);
    // });
  };

  this.animate = function () {
    this.frame++;
    if (this.frame >= OCTOPUS_FRAMES) {
      this.frame = 0;
    }
  };
}
