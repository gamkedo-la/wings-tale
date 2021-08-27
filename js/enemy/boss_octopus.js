const OCTOPUS_FRAMES = 0;
const OCTOPUS_IMAGE_NAME = "octopus";

bossOctopusClass.prototype = new moveDrawClass();

function bossOctopusClass() {
  this.defaultTentacleShotTimer = 15;
  this.defaultMainShotTImer = 45;
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
  this.x = GAME_W / 2;
  this.y = 64;
  this.health = 10;
  this.collW = this.collH = 64;
  this.readyToRemove = false;

  this.reset = function () {};

  this.move = function () {
    if (this.health <= 0) {
      return;
    }
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
    var tentacle =
      this.tentacle_positions[
        Math.floor(Math.random() * this.tentacle_positions.length)
      ];
    newShot = new enemyShotClass(tentacle.x, tentacle.y, ENEMY_SHOT_SPEED);
    enemyShotList.push(newShot);
  };

  this.shootFromFace = function () {
    newShot = new enemyShotClass(this.x, this.y, ENEMY_SHOT_SPEED);
    enemyShotList.push(newShot);
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
