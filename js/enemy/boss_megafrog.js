const MEGAFROG_FRAME_W = 400;
const MEGAFROG_FRAME_H = 360;

const MEGAFROG_BACK_Y = -180;
const MEGAFROG_FRONT_Y = 175;
const MEGAFROG_MOVE_SPEED = 4;

const MEGAFROG_SPAWN_PHASE = "MEGAFROG_SPAWN_PHASE";
const MEGAFROG_ATTACK_PHASE = "MEGAFROG_ATTACK_PHASE";

bossMegaFrogClass.prototype = new moveDrawClass();

function bossMegaFrogClass() {
  this.yv = MEGAFROG_MOVE_SPEED;
  this.xv = 0;
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
  this.health = 1;
  this.collList = [];
  this.collW = 256;
  this.collH = 64;
  this.phase = MEGAFROG_SPAWN_PHASE;
  this.attackPhaseTime = 400;
  this.attackTimer = this.attackPhaseTime;
  this.frogsDefeated = 0;
  this.prevSurfaceListLength = surfaceList.length;
  this.shotTimerDefault = 50;
  this.shotTimer = 50;
  this.shotCount = 50;

  this.reset = function () {
    this.x = GAME_W / 2;
    this.frogSpawnTimer = this.frogSpawnTimerDefault;
    this.remainingFrogsToSpawn = this.maxFrogSpawnCount;
    this.y = MEGAFROG_BACK_Y;
    this.phase = MEGAFROG_SPAWN_PHASE;
    this.attackTimer = this.attackPhaseTime;
    surfaceList.length = 0;
    enemyList.length = 0;
  };

  this.move = function () {
    switch (this.phase) {
      case MEGAFROG_SPAWN_PHASE:
        this.updatePosition();

        this.countFrogsDefeated();

        if (this.y > MEGAFROG_FRONT_Y) {
          this.yv = 0.0;
          this.frogSpawnTimer -= 1;
          this.spawnFrogs();
        }

        if (this.y < MEGAFROG_BACK_Y) {
          this.yv = -this.yv;
        }

        this.checkIfSpawnPhaseHasEnded();

        break;

      case MEGAFROG_ATTACK_PHASE:
        this.attackTimer -= 1;
        this.shotTimer -= 1;

        this.moveVertical();

        this.checkIfAttackPhaseHasEnded();

        this.attackAndSpawnEnemies();

        this.moveHorizontal();

        this.updatePosition();
        break;

      default:
        break;
    }
  };

  this.updatePosition = function () {
    this.y += this.yv;
    this.x += this.xv;
  };

  this.attackAndSpawnEnemies = function () {
    if (this.shotTimer <= 0) {
      this.attack();
    }

    if (this.shotCount <= 0) {
      this.shotCount = 50;
      this.shotTimer = this.shotTimerDefault;
    }
  };

  this.moveVertical = function () {
    if (this.y > MEGAFROG_FRONT_Y) {
      this.yv = -this.yv;
    }

    if (this.y < 0) {
      this.yv = 0;
    }
  };

  this.moveHorizontal = function () {
    if (this.attackPhaseTime - this.attackTimer === 40) {
      this.xv = 2;
    }

    if (this.x > 300 || this.x < 10) {
      this.xv = -this.xv;
    }
  };

  this.checkIfSpawnPhaseHasEnded = function () {
    if (this.remainingFrogsToSpawn <= 0 && surfaceList.length <= 0) {
      this.remainingFrogsToSpawn = this.maxFrogSpawnCount;
      this.maxFrogSpawnCount += 1;
      this.frogsDefeated = 0;
      this.phase = MEGAFROG_ATTACK_PHASE;
      this.yv = MEGAFROG_MOVE_SPEED;
    }
  };

  this.checkIfAttackPhaseHasEnded = function () {
    if (this.attackTimer <= 0 && this.x === GAME_W / 2) {
      this.phase = MEGAFROG_SPAWN_PHASE;
      this.yv = MEGAFROG_MOVE_SPEED;
      this.xv = 0;
      this.attackTimer = this.attackPhaseTime;
    }
  };

  this.countFrogsDefeated = function () {
    if (surfaceList.length < this.prevSurfaceListLength) {
      this.frogsDefeated += 1;
    }
    this.prevSurfaceList = surfaceList.length;
  };

  this.attack = function () {
    new enemyShotClass(
      this.x + 50 + Math.sin(this.shotCount + 90 * (Math.PI / 2)) * 6,
      this.y + 37,
      8,
      90
    );
    new enemyShotClass(
      this.x - 50 - Math.sin(this.shotCount + 90 * (Math.PI / 2)) * 6,
      this.y + 37,
      8,
      90
    );
    spawnSpecificEnemyAtRandomPosition(ENEMY_SHOCK);

    this.shotCount -= 1;
  };

  this.spawnFrogs = function () {
    if (
      this.frogSpawnTimer <= 0 &&
      surfaceList.length <= 7 &&
      this.remainingFrogsToSpawn > 0
    ) {
      var spawnLocation = this.getSpawnLocation();

      if (spawnLocation) {
        newFrog = new spaceFrogClass(spawnLocation.x, spawnLocation.y);
        surfaceList.push(newFrog);
        this.frogSpawnTimer = this.frogSpawnTimerDefault;
        this.remainingFrogsToSpawn -= 1;
      }
    }
  };

  this.getSpawnLocation = function () {
    var spawnIndex = getRandomInt(0, this.frogLocations.length - 1);
    let location = {
      x: this.frogLocations[spawnIndex].x,
      y: this.frogLocations[spawnIndex].y,
    };

    for (var i = 0; i < surfaceList.length; i++) {
      if (
        this.frogLocations[spawnIndex].x === surfaceList[i].x &&
        this.frogLocations[spawnIndex].y === surfaceList[i].y
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

    if (this.hitFlashFrames) {
      this.hitFlashFrames--;
      context.globalCompositeOperation = "lighter"; // brighten stuff up
      drawAnimFrame(
        "megafrog",
        this.x,
        this.y,
        this.frame,
        MEGAFROG_FRAME_W,
        MEGAFROG_FRAME_H
      );
      drawAnimFrame(
        "megafrog",
        this.x,
        this.y,
        this.frame,
        MEGAFROG_FRAME_W,
        MEGAFROG_FRAME_H
      );
      context.globalCompositeOperation = "source-over"; // restore to default
    }

    surfaceList.forEach(function (frog) {
      frog.draw();
    });
  };

  this.animate = function () {
    for (var i = 0; i < surfaceList.length; i++) {
      surfaceList[i].animate();
    }
  };

  this.takeDamage = function () {
    this.health -= 1;
    this.hitFlashFrames = HIT_FLASH_FRAMECOUNT;
  };
}
