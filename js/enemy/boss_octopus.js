const OCTOPUS_FRAMES = 0;
const OCTOPUS_IMAGE_NAME = "octopus";
const Y_OFFSET = 90;

bossOctopusClass.prototype = new moveDrawClass();

function bossOctopusClass() {
  this.defaultTentacleShotTimer = 15;
  this.defaultMainShotTImer = 90;
  this.tentacleShotTimer = this.defaultTentacleShotTimer;
  this.mainShotTimer = this.defaultMainShotTImer;
  this.tentacle_positions = [
    { x: 0, y: 16 + Y_OFFSET },
    { x: 8, y: 64 + Y_OFFSET },
    { x: 96, y: 148 + Y_OFFSET },
    { x: 144, y: 148 + Y_OFFSET },
    { x: 240, y: 16 + Y_OFFSET },
    { x: 240, y: 64 + Y_OFFSET },
  ];
  this.currentTentacle = 0;
  this.x = GAME_W / 2;
  this.y = 64;
  this.health = 250;
  this.collW = 64;
  this.collH = 256;
  this.readyToRemove = false;
  this.pos_x = 128;
  this.pos_y = 120 - 90;
  this.theta = 0;
  this.d_theta = Math.PI / (3 * 30);
  this.xrad = 30;
  this.yrad = 30;
  this.x_start = this.pos_x;
  this.y_start = this.pos_y;
  this.image = OCTOPUS_IMAGE_NAME;

  this.reset = function () {};

  this.move = function () {
    this.pos_x = this.x_start + this.xrad * Math.sin(this.theta + Math.PI / 2);
    this.pos_y = this.y_start + this.yrad * Math.sin(2 * this.theta);
    this.theta += this.d_theta;
    if (this.theta >= 2 * Math.PI) {
      this.theta -= 2 * Math.PI;
    }

    this.mainShotTimer -= 1;
    this.tentacleShotTimer -= 1;

    this.updateShootingPositions();

    if (this.tentacleShotTimer <= 0) {
      this.tentacleShotTimer = this.defaultTentacleShotTimer;
      this.shoot();
    }

    if (this.mainShotTimer <= 0) {
      this.mainShotTimer = this.defaultMainShotTImer;
      this.shootFromFace();
    }
  };

  this.updateShootingPositions = function () {
    this.tentacle_positions[0].x = this.pos_x - 128;
    this.tentacle_positions[0].y = this.pos_y - 104 + Y_OFFSET;

    this.tentacle_positions[1].x = this.pos_x - 120;
    this.tentacle_positions[1].y = this.pos_y - 56 + Y_OFFSET;

    this.tentacle_positions[2].x = this.pos_x - (128 - 96);
    this.tentacle_positions[2].y = this.pos_y + 28 + Y_OFFSET;

    this.tentacle_positions[3].x = this.pos_x + 20;
    this.tentacle_positions[3].y = this.pos_y + 28 + Y_OFFSET;

    this.tentacle_positions[4].x = this.pos_x + 120;
    this.tentacle_positions[4].y = this.pos_y - 104 + Y_OFFSET;

    this.tentacle_positions[5].x = this.pos_x + 120;
    this.tentacle_positions[5].y = this.pos_y - 56 + Y_OFFSET;

    this.x = this.pos_x;
    this.y = this.pos_y - 60;
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
    newShot1 = new shotClass(
      this.x - 16,
      this.y - 16 + Y_OFFSET,
      10,
      180,
      0,
      2,
      10,
      this
    );
    newShot2 = new shotClass(
      this.x,
      this.y + Y_OFFSET,
      10,
      180,
      0,
      2,
      10,
      this
    );
    newShot3 = new shotClass(
      this.x + 16,
      this.y - 16 + Y_OFFSET,
      10,
      180,
      0,
      2,
      10,
      this
    );
    enemyShotList.push(newShot1);
    enemyShotList.push(newShot2);
    enemyShotList.push(newShot3);
  };

  this.takeDamage = function () {
    //console.log("flashing octopus boss on hit!");
    //this.hitFlashFrames = HIT_FLASH_FRAMECOUNT; // unused as we replace images on this boss below

    this.health -= 1;
    this.image = OCTOPUS_IMAGE_NAME + "_damaged";

    setTimeout(
      function (boss) {
        boss.image = OCTOPUS_IMAGE_NAME;
      },
      30,
      this
    );
  };

  this.draw = function () {
    drawAnimFrame(this.image, this.pos_x, this.pos_y, this.frame, 256, 240);
  };

  this.animate = function () {
    this.frame++;
    if (this.frame >= OCTOPUS_FRAMES) {
      this.frame = 0;
    }
  };
}
