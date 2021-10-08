const LAVA_NECK_FRAMES = 8;
const LAVA_NECK_JOINTS = 6;
const LAVA_NECK_JOINT_LEN = 34;

const LAVA_HEAD_COLL_W = 20;
const LAVA_HEAD_COLL_H = 30;

// how far it moves back and forth
const DRAGON_BACK_Y = -120;
const DRAGON_FRONT_Y = -35;
const DRAGON_MOVE_SPEED = 0.3;

const DRAGON_SHOT_Y_OFFSET = 11; // where mouth is from center of head

// Changed from const to var so that they can be easily updated when heads are defeated
// Bad practice, I know
var DRAGON_SHOT_BURST = 7;
var DRAGON_SHOT_RELOAD = 120;
var DRAGON_SHOT_SPEED = 0.5;

bossLavaDragonClass.prototype = new moveDrawClass();

function bossLavaDragonClass() {
  this.neckList = [];
  this.rightNeck;
  this.yv = DRAGON_MOVE_SPEED;

  this.collList = [];

  this.reset = function () {
    this.x = GAME_W / 2;
    this.y = DRAGON_BACK_Y;
    surfaceList.length = 0;
    enemyList.length = 0;
    this.neckList = [];
    this.neckList.push(new bossLavaDragon_Neck_Class(0.0, Math.PI * 0.25));
    this.neckList.push(new bossLavaDragon_Neck_Class(0.1, Math.PI * -0.25));
    this.neckList.push(new bossLavaDragon_Neck_Class(-0.2, Math.PI * 0.125));
    for (var i = 0; i < this.neckList.length; i++) {
      this.neckList[i].reset();
      this.neckList[i].reloadTime =
        DRAGON_SHOT_RELOAD * ((i + 1) / this.neckList.length);

      // same number of elements as neck
      this.collList[i] = {
        useHealhOfObj: this.neckList[i], // used to check health or mark removal
        x: this.neckList[i].x,
        y: this.neckList[i].y,
        collW: this.neckList[i].collW,
        collH: this.neckList[i].collH,
        instance: this.neckList[i],
      };
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

    moveList(this.neckList, this.collList);

    // Dragon boss gets stronger and faster as more heads are defeated
    DRAGON_SHOT_RELOAD =
      (120 * (this.neckList.length / 3)) / (3 - this.neckList.length + 1);
    DRAGON_SHOT_BURST = 7 + (3 - this.neckList.length);
    DRAGON_SHOT_SPEED = 0.5 + (3 - this.neckList.length) * 0.25;

    if (this.collList.length == 0) {
      this.health = -1;
      console.log("last head of fire dragon defeated!");
    }
  };

  this.draw = function () {
    for (var i = 0; i < this.neckList.length; i++) {
      // get position from parent
      this.neckList[i].x = this.x;
      this.neckList[i].y = this.y;

      this.neckList[i].draw();

      // note: next line counts on 1:1 list size and order for neckList and collList
      this.collList[i].x = this.neckList[i].collX;
      this.collList[i].y = this.neckList[i].collY;
    }

    if (debugDraw_colliders) {
      for (var i = 0; i < this.collList.length; i++) {
        drawColl(this.collList[i], "white");
      }
    }
  };

  this.animate = function () {
    for (var i = 0; i < this.neckList.length; i++) {
      this.neckList[i].animate();
    }
  };
}

bossLavaDragon_Neck_Class.prototype = new moveDrawClass();

function bossLavaDragon_Neck_Class(baseAngOffset, jointOffset) {
  this.neckAngles;
  this.neckAnglesOsc; // oscillator
  this.reloadTime = DRAGON_SHOT_RELOAD;
  this.health = 100;

  // updated to the coord at the end of each neck
  this.collX = -100;
  this.collY = -100;
  this.collW = LAVA_HEAD_COLL_W;
  this.collH = LAVA_HEAD_COLL_H;

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
      if (this.hitFlashFrames) {
        // this.hitFlashFrames--;
        context.globalCompositeOperation = "lighter"; // brighten stuff up
        drawAnimFrame("firedragon", offsetX, offsetY, this.frame, 28, 35);
        drawAnimFrame("firedragon", offsetX, offsetY, this.frame, 28, 35);
        context.globalCompositeOperation = "source-over"; // restore to default
      }

      offsetAng += this.neckAngles[i];
      offsetX +=
        (Math.cos(offsetAng) * LAVA_NECK_JOINT_LEN) / RATIO_CIRCLE_TALLER;
      offsetY += Math.sin(offsetAng) * LAVA_NECK_JOINT_LEN;
    }

    // put colliders at the head
    this.collX = offsetX;
    this.collY = offsetY;

    drawAnimFrame("firedragon_head", offsetX, offsetY, 0, 28, 35); // no animations hooked up yet, tie to firing

    if (this.hitFlashFrames) {
      this.hitFlashFrames--;
      context.globalCompositeOperation = "lighter"; // brighten stuff up
      drawAnimFrame("firedragon_head", offsetX, offsetY, 0, 28, 35); // no animations hooked up yet, tie to firing
      drawAnimFrame("firedragon_head", offsetX, offsetY, 0, 28, 35); // no animations hooked up yet, tie to firing
      context.globalCompositeOperation = "source-over"; // restore to default
    }

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

    // Health bar
    drawBarWithText(
      50,
      10,
      this.health,
      100,
      offsetX - 12,
      offsetY + 20,
      "blue"
    );
  };

  this.animate = function () {
    this.frame++;
    if (this.frame >= LAVA_NECK_FRAMES) {
      this.frame = 0;
    }
  };

  this.takeDamage = function () {
    this.hitFlashFrames = HIT_FLASH_FRAMECOUNT;
  };
}
