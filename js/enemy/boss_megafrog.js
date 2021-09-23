const MEGAFROG_FRAME_W = 400;
const MEGAFROG_FRAME_H = 360;

const MEGAFROG_BACK_Y = -180;
const MEGAFROG_FRONT_Y = 175;
const MEGAFROG_MOVE_SPEED = 4;

const MEGAFROG_SPAWN_PHASE = "MEGAFROG_SPAWN_PHASE";
const MEGAFROG_ATTACK_PHASE = "MEGAFROG_ATTACK_PHASE";

bossMegaFrogClass.prototype = new moveDrawClass();

function bossMegaFrogClass() {
  this.frogList = [new spaceFrogClass(GAME_W / 2, GAME_H / 2)];
  this.yv = MEGAFROG_MOVE_SPEED;
  this.frogSpawnTimerDefault = 20;
  this.frogSpawnTimer = this.frogSpawnTimerDefault;
  this.maxFrogSpawnCount = 10;
  this.remainingFrogsToSpawn = this.maxFrogSpawnCount;
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
  this.phase = MEGAFROG_SPAWN_PHASE;
  this.attackPhaseTime = 1000;
  this.attackTimer = this.attackPhaseTime;

  this.reset = function () {
    this.x = GAME_W / 2;
    this.frogSpawnTimer = this.frogSpawnTimerDefault;
    this.remainingFrogsToSpawn = this.maxFrogSpawnCount;
    this.y = MEGAFROG_BACK_Y;
    this.frogList = [];
    this.phase = MEGAFROG_SPAWN_PHASE;
    this.attackTimer = this.attackPhaseTime;
  };

  this.move = function () {
    console.log(this.phase);
    switch (this.phase) {
      case MEGAFROG_SPAWN_PHASE:
        this.y += this.yv;
        if (this.y > MEGAFROG_FRONT_Y) {
          this.yv = 0.0;
          this.frogSpawnTimer -= 1;
          this.spawnFrogs();
        }

        if (this.y < MEGAFROG_BACK_Y) {
          this.yv = -this.yv;
        }

        moveList(this.frogList, this.collList);

        if (this.remainingFrogsToSpawn <= 0 && this.collList.length === 0) {
          // this.remainingFrogsToSpawn = this.maxFrogSpawnCount;
          // this.maxFrogSpawnCount += 1;
          this.phase = MEGAFROG_ATTACK_PHASE;
          this.yv = MEGAFROG_MOVE_SPEED;
          console.log("Defeated last small frog!");
        }
        break;

      case MEGAFROG_ATTACK_PHASE:
        this.attackTimer -= 1;
        if (this.attackTimer <= 0) {
          this.phase = MEGAFROG_SPAWN_PHASE;
          this.attackTimer = this.attackPhaseTime;
        }

        this.y -= this.yv;
        if (this.y < MEGAFROG_BACK_Y) {
          this.yv = 0.0;
        }

        if (this.y > MEGAFROG_FRONT_Y) {
          this.yv = -this.yv;
        }
        break;

      default:
        break;
    }
  };

  this.spawnFrogs = function () {
    if (
      this.frogSpawnTimer <= 0 &&
      this.frogList.length <= 7 &&
      this.remainingFrogsToSpawn > 0
    ) {
      var spawnLocation = this.getSpawnLocation();

      if (spawnLocation) {
        this.frogList.push(
          new spaceFrogClass(spawnLocation.x, spawnLocation.y)
        );
        this.frogSpawnTimer = this.frogSpawnTimerDefault;
        this.remainingFrogsToSpawn -= 1;
      }

      for (var i = 0; i < this.frogList.length; i++) {
        this.collList[i] = {
          useHealhOfObj: this.frogList[i], // used to check health or mark removal
          x: this.frogList[i].x,
          y: this.frogList[i].y,
          collW: this.frogList[i].collW,
          collH: this.frogList[i].collH,
        };
      }
    }
  };

  this.getSpawnLocation = function () {
    var spawnIndex = getRandomInt(0, this.frogLocations.length - 1);
    let location = {
      x: this.frogLocations[spawnIndex].x,
      y: this.frogLocations[spawnIndex].y,
    };

    for (var i = 0; i < this.frogList.length; i++) {
      if (
        this.frogLocations[spawnIndex].x === this.frogList[i].x &&
        this.frogLocations[spawnIndex].y === this.frogList[i].y
      ) {
        location = undefined;
        continue;
      }

      location = {
        x: this.frogLocations[i].x,
        y: this.frogLocations[i].y,
      };
    }

    return location;
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
