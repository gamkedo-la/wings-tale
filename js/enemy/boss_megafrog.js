const MEGAFROG_FRAME_W = 400;
const MEGAFROG_FRAME_H = 360;

const MEGAFROG_BACK_Y = -180;
const MEGAFROG_FRONT_Y = 175;
const MEGAFROG_MOVE_SPEED = 4;

bossMegaFrogClass.prototype = new moveDrawClass();

function bossMegaFrogClass() {
  this.frogList = [new spaceFrogClass(GAME_W / 2, GAME_H / 2)];
  this.yv = MEGAFROG_MOVE_SPEED;
  this.frogSpawnTimerDefault = 90;
  this.frogSpawnTimer = this.frogSpawnTimerDefault;
  this.frogLocations = [
    // Center
    { x: GAME_W / 2, y: GAME_H / 2 },
    { x: GAME_W / 2, y: GAME_H / 2 - 40 },
    { x: GAME_W / 2, y: GAME_H / 2 - 80 },

    // Right side
    { x: GAME_W / 2 + 50, y: GAME_H / 2 - 18 },
    { x: GAME_W / 2 + 50, y: GAME_H / 2 - 58 },

    // Left side
    { x: GAME_W / 2 - 50, y: GAME_H / 2 - 18 },
    { x: GAME_W / 2 - 50, y: GAME_H / 2 - 58 },
  ];
  this.health = 3;
  this.collList = [];

  this.reset = function () {
    this.x = GAME_W / 2;
    this.frogSpawnTimer = this.frogSpawnTimerDefault;
    this.y = MEGAFROG_BACK_Y;
    this.frogList = [];
  };

  this.move = function () {
    this.y += this.yv;
    if (this.y > MEGAFROG_FRONT_Y) {
      this.yv = 0.0;
      this.frogSpawnTimer -= 1;
      console.log(this.frogSpawnTimer);
      this.spawnFrogs();
    }

    if (this.y < MEGAFROG_BACK_Y) {
      this.yv = -this.yv;
    }

    moveList(this.frogList, this.collList);

    // if (this.collList.length == 0) {
    //   this.health = -1;
    //   console.log("Defeated last small frog!");
    // }
  };

  this.spawnFrogs = function () {
    if (this.frogSpawnTimer <= 0 && this.frogList.length <= 7) {
      var spawnIndex = this.frogList.length > 0 ? this.frogList.length - 1 : 0;
      this.frogList.push(
        new spaceFrogClass(
          this.frogLocations[spawnIndex].x,
          this.frogLocations[spawnIndex].y
        )
      );

      for (var i = 0; i < this.frogList.length; i++) {
        this.collList[i] = {
          useHealhOfObj: this.frogList[i], // used to check health or mark removal
          x: this.frogList[i].x,
          y: this.frogList[i].y,
          collW: this.frogList[i].collW,
          collH: this.frogList[i].collH,
        };
      }

      this.frogSpawnTimer = this.frogSpawnTimerDefault;
    }
  };

  this.draw = function () {
    drawAnimFrame(
      "megafrog",
      this.x,
      this.y,
      this.frame,
      MEGAFROG_FRAME_W,
      MEGAFROG_FRAME_H
    );
    for (var i = 0; i < this.frogList.length; i++) {
      // get position from parent
      // this.frogList[i].x = this.x;
      // this.frogList[i].y = this.y;

      this.frogList[i].draw();

      // note: next line counts on 1:1 list size and order for frogList and collList
      this.collList[i].x = this.frogList[i].collX;
      this.collList[i].y = this.frogList[i].collY;
    }

    if (debugDraw_colliders) {
      for (var i = 0; i < this.collList.length; i++) {
        drawColl(this.collList[i], "white");
      }
    }
  };

  this.animate = function () {
    for (var i = 0; i < this.frogList.length; i++) {
      this.frogList[i].animate();
    }
  };
}
