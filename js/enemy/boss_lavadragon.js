const LAVA_NECK_FRAMES = 8;
const LAVA_NECK_JOINTS = 6;
const LAVA_NECK_JOINT_LEN = 34;

// how far it moves back and forth
const DRAGON_BACK_Y = -120;
const DRAGON_FRONT_Y = -35;
const DRAGON_MOVE_SPEED = 0.3;

const DRAGON_SHOT_SPEED = 0.5;
const DRAGON_SHOT_BURST = 7;
const DRAGON_SHOT_RELOAD = 120;
const DRAGON_SHOT_Y_OFFSET = 11; // where mouth is from center of head

bossLavaDragonClass.prototype = new moveDrawClass();
bossLavaDragon_Neck_Class.prototype = new moveDrawClass();

function bossLavaDragonClass() {
  this.neckList = [];
  this.rightNeck;
  this.yv = DRAGON_MOVE_SPEED;

  this.reset = function () {
    this.x = GAME_W / 2;
    this.y = DRAGON_BACK_Y;
    this.neckList = [];
    this.neckList.push(new bossLavaDragon_Neck_Class(0.0, Math.PI * 0.25));
    this.neckList.push(new bossLavaDragon_Neck_Class(0.1, Math.PI * -0.25));
    this.neckList.push(new bossLavaDragon_Neck_Class(-0.2, Math.PI * 0.125));
    for (var i = 0; i < this.neckList.length; i++) {
      this.neckList[i].reset();
      this.neckList[i].reloadTime =
        DRAGON_SHOT_RELOAD * ((i + 1) / this.neckList.length);
    }
  };

  this.move = function () {
    this.y += this.yv;
    if (this.y > DRAGON_FRONT_Y) {
      this.yv = -this.yv;
    }
    if (this.y < DRAGON_BACK_Y) {
      this.yv = -this.yv;
    }
  };

  this.draw = function () {
    for (var i = 0; i < this.neckList.length; i++) {
      // get position from parent
      this.neckList[i].x = this.x;
      this.neckList[i].y = this.y;

      this.neckList[i].draw();
    }
  };

  this.animate = function () {
    for (var i = 0; i < this.neckList.length; i++) {
      this.neckList[i].animate();
    }
  };
}

function bossLavaDragon_Neck_Class(baseAngOffset, jointOffset) {
  this.neckAngles;
  this.neckAnglesOsc; // oscillator
  this.reloadTime = DRAGON_SHOT_RELOAD;

  this.reset = function () {
    this.neckAngles = [];
    this.neckAnglesOsc = [];
    this.x = GAME_W / 2;
    this.y = 0;
    for (var i = 0; i < LAVA_NECK_JOINTS; i++) {
      this.neckAngles.push(baseAngOffset);
      this.neckAnglesOsc.push((i - LAVA_NECK_JOINTS / 2) * jointOffset);
    }
  };

  this.move = function () {};

  this.draw = function () {
    var offsetX = this.x;
    var offsetY = this.y;
    var offsetAng = Math.PI * 0.5; // downward
    for (var i = 0; i < this.neckAngles.length; i++) {
      drawAnimFrame("firedragon", offsetX, offsetY, this.frame, 28, 35);
      offsetAng += this.neckAngles[i];
      offsetX +=
        (Math.cos(offsetAng) * LAVA_NECK_JOINT_LEN) / RATIO_CIRCLE_TALLER;
      offsetY += Math.sin(offsetAng) * LAVA_NECK_JOINT_LEN;
    }
    drawAnimFrame("firedragon_head", offsetX, offsetY, 0, 28, 35); // no animations hooked up yet, tie to firing
    if (this.reloadTime-- < 0) {
      this.reloadTime = DRAGON_SHOT_RELOAD;
      for (var i = 0; i < DRAGON_SHOT_BURST; i++) {
        new enemyShotClass(
          offsetX,
          offsetY + DRAGON_SHOT_Y_OFFSET,
          DRAGON_SHOT_SPEED,
          i * ((Math.PI * 2) / DRAGON_SHOT_BURST)
        );
      }
    }
    for (var i = 0; i < LAVA_NECK_JOINTS; i++) {
      this.neckAngles[i] += 0.005 * Math.cos(this.neckAnglesOsc[i]);
      this.neckAnglesOsc[i] += 0.04 + Math.random() * 0.01;
    }
  };

  this.animate = function () {
    this.frame++;
    if (this.frame >= LAVA_NECK_FRAMES) {
      this.frame = 0;
    }
  };

  this.takeDamage = function () {};
}
