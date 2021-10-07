const ALIENSHIP_FRAMES = 0;
const ALIENSHIP_IMAGE_NAME = "alien ship_noturrets2";
const ALIENSHIP_TURRET_RELOAD = 30;
const ALIENSHIP_SHOT_BURST = 9;
const ALIENSHIP_SHOT_SPEED = 2;
const ALIENSHIP_SHOT_Y_OFFSET = -90;
const ALIENSHIP_TURRET_DIM = 20;
const ALIENSHIP_TURRET_FRAME = 1;

bossAlienshipClass.prototype = new moveDrawClass();

function bossAlienshipClass() {
  this.turretList = [];
  this.collList = [];
  this.collW = 100;
  this.collH = 15;

  this.xv = 2;
  this.yv = 0.5;
  this.image = ALIENSHIP_IMAGE_NAME;
  this.health = 100;

  this.bossStage = 0;

  this.reset = function () {
    this.x = 50;
    this.y = 120;
    surfaceList.length = 0;
    enemyList.length = 0;
    this.turretList = [];
    this.turretList.push(new bossAlienship_Turret_Class(0, -15));
    this.turretList.push(new bossAlienship_Turret_Class(-60, -38));
    this.turretList.push(new bossAlienship_Turret_Class(-85, -83));
    this.turretList.push(new bossAlienship_Turret_Class(60, -38));
    this.turretList.push(new bossAlienship_Turret_Class(85, -83));
    for (var i = 0; i < this.turretList.length; i++) {
      this.turretList[i].reset();
      this.turretList[i].reloadTime =
        ALIENSHIP_TURRET_RELOAD * ((i + 1) / this.turretList.length);

      // same number of elements as neck
      this.collList[i] = {
        useHealhOfObj: this.turretList[i], // used to check health or mark removal
        x: this.turretList[i].x,
        x: this.turretList[i].y,
        collW: this.turretList[i].collW,
        collH: this.turretList[i].collH,
        instance: this.turretList[i],
      };
    }
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

    if (this.collList != undefined) {
      moveList(this.turretList, this.collList);
      if (this.collList.length == 0) {
        if (this.bossStage == 0) {
          this.turretList = [];
          this.turretList.push(
            new bossAlienship_bossAlien_WeakPoint_Class(0, -50)
          );
          for (var i = 0; i < this.turretList.length; i++) {
            this.turretList[i].reset();
            this.turretList[i].reloadTime =
              ALIENSHIP_TURRET_RELOAD * ((i + 1) / this.turretList.length);

            // same number of elements as neck
            this.collList[i] = {
              useHealhOfObj: this.turretList[i], // used to check health or mark removal
              x: this.turretList[i].x,
              x: this.turretList[i].y,
              collW: this.turretList[i].collW,
              collH: this.turretList[i].collH,
              instance: this.turretList[i],
            };
          }
        } else {
          this.health = -1;
        }
        this.bossStage++;
        // this.collList = undefined;
      }
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

    for (var i = 0; i < this.turretList.length; i++) {
      // get position from parent
      this.turretList[i].x = this.x;
      this.turretList[i].y = this.y;

      this.turretList[i].draw();

      // note: next line counts on 1:1 list size and order for turretList and collList
      this.collList[i].x = this.turretList[i].collX;
      this.collList[i].y = this.turretList[i].collY;
    }

    if (debugDraw_colliders) {
      if (this.collList != undefined) {
        for (var i = 0; i < this.collList.length; i++) {
          drawColl(this.collList[i], "white");
        }
      }
    }
  };

  this.animate = function () {
    this.frame++;
    if (this.frame >= ALIENSHIP_FRAMES) {
      this.frame = 0;
    }
    for (var i = 0; i < this.turretList.length; i++) {
      this.turretList[i].animate();
    }
  };

  this.takeDamage = function () {
    //console.log("flashing alien ship boss on hit!");
    this.hitFlashFrames = HIT_FLASH_FRAMECOUNT;
    this.health -= 1;
  };
}

bossAlienship_Turret_Class.prototype = new moveDrawClass();

function bossAlienship_Turret_Class(offsetX, offsetY) {
  this.reloadTime = ALIENSHIP_TURRET_RELOAD;
  this.health = 30;
  this.offsetX = offsetX;
  this.offsetY = offsetY;
  // updated to the coord at the end of each frame
  this.collX = -100;
  this.collY = -100;
  this.collW = ALIENSHIP_TURRET_DIM;
  this.collH = ALIENSHIP_TURRET_DIM;

  this.reset = function () {
    this.x = GAME_W / 2;
    this.y = 0;
  };

  this.move = function () {
    // turret projectiles
    if (50 * Math.random() < 2) {
      new enemyShotClass(this.x + this.offsetX, this.y + 10 + this.offsetY);
    }
  };

  this.draw = function () {
    var offsetX = this.x + this.offsetX;
    var offsetY = this.y + this.offsetY;

    // put colliders at the head
    this.collX = offsetX;
    this.collY = offsetY;

    drawAnimFrame("alien ship_turret", offsetX, offsetY, 0, 20, 50); // no animations hooked up yet, tie to firing
    if (this.hitFlashFrames) {
      this.hitFlashFrames--;
      context.globalCompositeOperation = "lighter"; // brighten stuff up
      drawAnimFrame("alien ship_turret", offsetX, offsetY, 0, 20, 50); // no animations hooked up yet, tie to firing
      drawAnimFrame("alien ship_turret", offsetX, offsetY, 0, 20, 50); // no animations hooked up yet, tie to firing
      context.globalCompositeOperation = "source-over"; // restore to default
    }

    // Health bar
    drawBarAsPercentage(
      20,
      5,
      this.health,
      30,
      offsetX + 10,
      offsetY + 2,
      "green"
    );
  };

  this.animate = function () {
    this.frame++;
    if (this.frame >= ALIENSHIP_TURRET_FRAME) {
      this.frame = 0;
    }
  };

  this.takeDamage = function () {
    //console.log("flashing lava dragon boss on hit!");
    this.hitFlashFrames = HIT_FLASH_FRAMECOUNT;
  };
}

bossAlienship_bossAlien_WeakPoint_Class.prototype = new moveDrawClass();

function bossAlienship_bossAlien_WeakPoint_Class(offsetX, offsetY) {
  this.reloadTime = ALIENSHIP_TURRET_RELOAD;
  this.health = 50;
  this.offsetX = offsetX;
  this.offsetY = offsetY - 42;
  // updated to the coord at the end of each frame
  this.collX = -100;
  this.collY = -100;
  this.collW = 70;
  this.collH = 58;

  this.reset = function () {
    this.x = GAME_W / 2;
    this.y = 0;
  };

  this.move = function () {
    // Weakpoint projectiles
    if (this.reloadTime-- < 0) {
      this.reloadTime = ALIENSHIP_TURRET_RELOAD;
      for (var i = 0; i < ALIENSHIP_SHOT_BURST; i++) {
        new enemyShotClass(
          this.x + this.offsetX,
          this.y + this.offsetY,
          ALIENSHIP_SHOT_SPEED,
          i * ((Math.PI * 2) / ALIENSHIP_SHOT_BURST)
        );
      }
    }
    if (50 * Math.random() < 2) {
      new enemyShotClass(this.x + this.offsetX, this.y + 10 + this.offsetY);
    }
  };

  this.draw = function () {
    var offsetX = this.x + this.offsetX;
    var offsetY = this.y + this.offsetY;

    // put colliders at the head
    this.collX = offsetX;
    this.collY = offsetY;

    drawAnimFrame("alien ship_weakpoint", offsetX, offsetY, 0, 70, 58); // no animations hooked up yet, tie to firing
    if (this.hitFlashFrames) {
      this.hitFlashFrames--;
      context.globalCompositeOperation = "lighter"; // brighten stuff up
      drawAnimFrame("alien ship_weakpoint", offsetX, offsetY, 0, 70, 58); // no animations hooked up yet, tie to firing
      drawAnimFrame("alien ship_weakpoint", offsetX, offsetY, 0, 70, 58); // no animations hooked up yet, tie to firing
      context.globalCompositeOperation = "source-over"; // restore to default
    }
    // Health bar
    drawBarAsPercentage(
      50,
      5,
      this.health,
      100,
      offsetX - 25,
      offsetY + 80,
      "green"
    );
  };

  this.animate = function () {
    this.frame++;
    if (this.frame >= ALIENSHIP_TURRET_FRAME) {
      this.frame = 0;
    }
  };

  this.takeDamage = function () {
    //console.log("flashing lava dragon boss on hit!");
    this.hitFlashFrames = HIT_FLASH_FRAMECOUNT;
  };
}
