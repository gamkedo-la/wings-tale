const ALIENSHIP_FRAMES = 0;
const ALIENSHIP_IMAGE_NAME = "alien ship";
const ALIENSHIP_TURRET_RELOAD = 15;
const ALIENSHIP_TURRET_DIM = 20;
const ALIENSHIP_TURRET_FRAME = 1;

bossAlienshipClass.prototype = new moveDrawClass();

function bossAlienshipClass() {
  this.turretList = [];
  this.collList = [];
  
  this.xv = 2;
  this.yv = .5;
  this.image = ALIENSHIP_IMAGE_NAME;
  this.health = 50;
  
  this.reset = function () {
    this.x = 50;
    this.y = 120;
    this.turretList = [];
    this.turretList.push(new bossAlienship_Turret_Class(0,10));
    this.turretList.push(new bossAlienship_Turret_Class(-60,-10));
    this.turretList.push(new bossAlienship_Turret_Class(-90,-55));
    this.turretList.push(new bossAlienship_Turret_Class(60,-10));
    this.turretList.push(new bossAlienship_Turret_Class(90,-55));
    for (var i = 0; i < this.turretList.length; i++) {
      this.turretList[i].reset();
      this.turretList[i].reloadTime =
      ALIENSHIP_TURRET_RELOAD * ((i + 1) / this.turretList.length);
      
      // same number of elements as neck
      this.collList[i] = 
          {useHealhOfObj:this.turretList[i], // used to check health or mark removal
            x:this.turretList[i].x,x:this.turretList[i].y,
            collW:this.turretList[i].collW,collH:this.turretList[i].collH};
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
    moveList(this.turretList,this.collList);
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

    if(debugDraw_colliders) {
      for (var i = 0; i < this.collList.length; i++) {
        drawColl(this.collList[i],"white");
      }
    }

    /*if (50 * Math.random() < 2) {
      new enemyShotClass(this.x , this.y + 10);
      new enemyShotClass(this.x - 60, this.y - 10);
      new enemyShotClass(this.x - 90, this.y - 55);
      new enemyShotClass(this.x + 60, this.y - 10);
      new enemyShotClass(this.x + 90, this.y - 55);
    }*/
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
    //this.hitFlashFrames = HIT_FLASH_FRAMECOUNT;
    this.health -= 1;
    this.image = ALIENSHIP_IMAGE_NAME + "_damaged";
    

    setTimeout(
      function (boss) {
        boss.image = ALIENSHIP_IMAGE_NAME;
      },
      3,
      this
    );
  };
}


bossAlienship_Turret_Class.prototype = new moveDrawClass();

function bossAlienship_Turret_Class(offsetX, offsetY) {
  this.reloadTime = ALIENSHIP_TURRET_RELOAD;
  this.health = 15;
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

    if (this.reloadTime-- < 0) {
      this.reloadTime = DRAGON_SHOT_RELOAD;
      for (var i = 0; i < DRAGON_SHOT_BURST; i++) {
        new enemyShotClass(
          this.x + this.offsetX,
          this.y + this.offsetY + DRAGON_SHOT_Y_OFFSET,
          DRAGON_SHOT_SPEED,
          i * ((Math.PI * 2) / DRAGON_SHOT_BURST)
        );
      }
    }

  };

  this.draw = function () {

      var offsetX = this.x + this.offsetX;
      var offsetY = this.y + this.offsetY;

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