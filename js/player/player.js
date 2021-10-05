const PLAYER_DIM = 20;
const PLAYER_FRAME_W = 21;
const PLAYER_FRAME_H = 20;
const PLAYER_COLLIDER_SIZE = 4;
const PLAYER_FRAMES = 3;
const PLAYER_ANGLE_MAX = 10;
const PLAYER_ANGLE_STEP = 2;
const EDGE_MARGIN = PLAYER_DIM;
const INVULNERABLE_DURATION = 10;
const INVULNERABLE_DURATION_DECREMENT = 0.1;

// press P or obtain speed powerup to test
const MIN_SPEED_FOR_SPEEDTRAILS = 3; // 3 is normal speed
const SPEEDTRAIL_PARTICLE_SIZE = 4; // size of starting puff
const SPEEDTRAIL_PARTICLE_POWER = 10; // 700 is like our explosions

const FRAMES_BETWEEN_PLAYER_SHOTS = 3;

const GROUND_POWERUP_DROP_PERCENT = 0.5;
const SKY_POWERUP_DROP_PERCENT = 0.1;

var shotDegSpread = 3.7;
var bombDegSpread = 6;
const GHOST_DIST_MULT = 9;
const GHOST_MIN_MOVE_SPEED = 0.7;
const GHOST_COLOR_MAX = 4;

const HOMING_POWERUP_FRAMES = 300;

playerClass.prototype = new moveDrawClass();

function playerClass() {
  // used for ghost player sources
  this.trailX = [];
  this.trailY = [];

  this.angle = 0;

  this.shotPowerTimer = 300;
  this.bombPowerTimer = 300;
  this.ghostPowerTimer = 300;
  this.laserPowerTimer = 300;
  this.speedPowerTimer = 300;

  this.shotsNumber = 1;
  this.bombCount = 1;
  this.ghostCount = 0;
  this.homingBombFramesLeft = HOMING_POWERUP_FRAMES;
  this.hasLaserPowerUp = false;
  this.speed = 3;

  this.invulnerableTimeLeft = 0;
  this.invulnerableBlinkToggle = false;
  this.cheatInvulnerable = false;

  this.frame = 0;

  this.reloadTime = 0;

  this.holdLeft = false;
  this.holdUp = false;
  this.holdRight = false;
  this.holdDown = false;
  this.holdFire = false;
  this.holdBomb = false;
  this.wasHoldingBomb = false; // to tell when state toggles, since not repeat fire

  this.defenseRingUnitList = [];

  this.combo = new comboCounter(); // "4x COMBO!" gui
  this.scoreUI = new score_gui();

  this.collW = this.collH = PLAYER_COLLIDER_SIZE;
  this.ghostColors = [];

  this.reset = function () {
    if (this.cheatInvulnerable) {
      return;
    }

    this.combo.reset();

    if (this.invulnerableTimeLeft <= 0) {
      this.invulnerableTimeLeft = INVULNERABLE_DURATION;

      deathCount += 1;
      console.log("DIED!", deathCount);

      this.neverRemove = true; // respawn only

      this.readyToRemove = false;
      this.x = GAME_W / 2;
      this.y = GAME_H - PLAYER_DIM * 2;
      this.xv = this.yv = 0;

      // Reset timers
      this.shotPowerTimer = 300;
      this.bombPowerTimer = 300;
      this.ghostPowerTimer = 300;
      this.laserPowerTimer = 300;
      this.speedPowerTimer = 300;

      if (cheatKeepPowerupsOnDeath) {
        console.log("The cheat/debug feature KeepPowerupsOnDeath is on!");
      } else {
        this.shotsNumber = 1;
        this.bombCount = 1;
        this.ghostCount = 0;
        this.ghostColors = [];
        this.homingBombFramesLeft = HOMING_POWERUP_FRAMES;
        this.hasLaserPowerUp = false;
        this.speedTrailsOn = false;
        this.speed = 3;
      }

      resetDefenseRing(this);
    }
  };

  this.drawSpeedTrails = function () {
    if (this.speed <= MIN_SPEED_FOR_SPEEDTRAILS) return;
    // distort the terrain below like a heatwave
    dropRippleAt(this.x, this.y, SPEEDTRAIL_PARTICLE_SIZE);
  };

  this.decrementPowerupTimers = function () {
    if (this.shotsNumber > 1) {
      console.log("SHOT: ", this.shotPowerTimer);
      this.shotPowerTimer -= 1;
      this.checkTimer("shotPowerTimer", () => {
        this.shotsNumber -= 1;
        if (this.shotsNumber < 1) {
          this.shotsNumber = 1;
        }
      });
    }

    if (this.hasLaserPowerUp) {
      console.log("LASER: ", this.laserPowerTimer);
      this.laserPowerTimer -= 1;
      this.checkTimer("laserPowerTimer", () => {
        this.hasLaserPowerUp = false;
      });
    }

    if (this.speed > 3) {
      console.log("SPEED: ", this.speedPowerTimer);
      this.speedPowerTimer -= 1;
      this.checkTimer("speedPowerTimer", () => {
        this.speed -= 1;
      });
    }

    if (this.bombCount > 1) {
      console.log("BOMB: ", this.bombPowerTimer);
      this.bombPowerTimer -= 1;
      this.checkTimer("bombPowerTimer", () => {
        this.bombCount -= 1;
      });
    }

    if (this.ghostCount > 0) {
      console.log("GHOST: ", this.ghostPowerTimer);
      this.ghostPowerTimer -= 1;
      this.checkTimer("ghostPowerTimer", () => {
        this.ghostCount -= 1;
      });
    }
  };

  this.checkTimer = function (timer, effect) {
    if (this[timer] <= 0) {
      effect(this);
      this[timer] = 225;
    }
  };

  this.draw = function () {
    this.combo.draw();
    this.drawSpeedTrails();

    // FIXME:
    // playerScore is a global but the game can have two players
    // therefore perhaps score should become a property of the player class
    this.scoreUI.draw(playerScore, 8, 8);

    if (this.invulnerableTimeLeft > 0) {
      if (Math.round(this.invulnerableTimeLeft * 10) % 4 == 0) {
        this.invulnerableBlinkToggle = !this.invulnerableBlinkToggle;
      }
    }

    if (this.invulnerableBlinkToggle || this.invulnerableTimeLeft < 0) {
      for (var i = 0; i < this.ghostCount; i++) {
        var ghostIdx = (i + 1) * GHOST_DIST_MULT;
        if (ghostIdx >= this.trailY.length) {
          ghostIdx = this.trailY.length - 1;
        }
        fromX = this.trailX[ghostIdx];
        fromY = this.trailY[ghostIdx];

        drawAnimFrame(
          "player_ghost_" + this.ghostColors[i],
          fromX,
          fromY,
          this.frame,
          PLAYER_FRAME_W,
          PLAYER_FRAME_H,
          (this.angle * Math.PI) / 180
        );
      }
      drawAnimFrame(
        "player",
        this.x,
        this.y,
        this.frame,
        PLAYER_FRAME_W,
        PLAYER_FRAME_H,
        (this.angle * Math.PI) / 180
      );

      drawAnimFrame(
        "bomb sight",
        this.x - this.angle * 4,
        this.y - APPROX_BOMB_RANGE,
        this.frame % 2,
        BOMB_FRAME_W,
        BOMB_FRAME_H
      );

      if (this.invulnerableTimeLeft > 0) {
        return;
      }

      drawList(this.defenseRingUnitList);
    }

    if (this.homingBombFramesLeft > 0) {
      drawFilledBar(
        this.x - 10,
        this.y + 10,
        20,
        5,
        this.homingBombFramesLeft / HOMING_POWERUP_FRAMES,
        "lime"
      );
    }
  };

  this.move = function () {
    if (this.homingBombFramesLeft > 0) {
      this.homingBombFramesLeft--;
    }
    if (this.invulnerableTimeLeft > 0) {
      this.invulnerableTimeLeft -= INVULNERABLE_DURATION_DECREMENT;
    }

    if (!(this.holdRight && this.holdLeft)) {
      if (this.angle > 0) {
        this.angle -= PLAYER_ANGLE_STEP / 2;
      }
      if (this.angle < 0) {
        this.angle += PLAYER_ANGLE_STEP / 2;
      }
    }

    // input handling
    if (this.holdUp) {
      this.yv = -this.speed;
    }
    if (this.holdRight) {
      this.xv = this.speed;
      this.angle += this.angle < PLAYER_ANGLE_MAX ? PLAYER_ANGLE_STEP : 0;
    }
    if (this.holdDown) {
      this.yv = this.speed;
    }
    if (this.holdLeft) {
      this.xv = -this.speed;
      this.angle -= this.angle > -PLAYER_ANGLE_MAX ? PLAYER_ANGLE_STEP : 0;
    }

    if (Math.abs(this.xv) + Math.abs(this.yv) > GHOST_MIN_MOVE_SPEED) {
      this.trailX.unshift(this.x);
      this.trailY.unshift(this.y);
      while (this.trailX.length > this.ghostCount * GHOST_DIST_MULT) {
        this.trailX.pop();
      }
      while (this.trailY.length > this.ghostCount * GHOST_DIST_MULT) {
        this.trailY.pop();
      }
    }

    this.x += this.xv;
    this.y += this.yv;

    this.xv *= 0.7;
    this.yv *= 0.7;

    // bounds check
    if (this.x < EDGE_MARGIN) {
      this.x = EDGE_MARGIN;
    }
    if (this.x >= GAME_W - EDGE_MARGIN) {
      this.x = GAME_W - EDGE_MARGIN - 1;
    }
    if (this.y < EDGE_MARGIN) {
      this.y = EDGE_MARGIN;
    }
    if (this.y >= GAME_H - EDGE_MARGIN) {
      this.y = GAME_H - EDGE_MARGIN - 1;
    }

    // pmx = partial momentum, which part of player speed should impact projectiles being shot or dropped
    var pmx = this.xv * 0.1;
    var pmy = this.yv * (this.yv > 0 ? 0.2 : 0.9);

    var ghostsLeft = this.ghostCount;
    var ghostIdx = 0;
    var fromX = this.x;
    var fromY = this.y;
    var readyToFire = this.reloadTime <= 0; // don't want ghosts to all affect reload
    if (readyToFire == false) {
      this.reloadTime--;
    }
    do {
      if (this.holdBomb && this.wasHoldingBomb != this.holdBomb) {
        var bombAngSpan = -(this.bombCount - 1) * (bombDegSpread * 0.5);

        for (var i = 0; i < this.bombCount; i++) {
          var newBomb = new shotGroundClass(
            fromX,
            fromY,
            SHOT_GROUND_SPEED,
            bombAngSpan + bombDegSpread * i,
            pmx,
            pmy,
            this.homingBombFramesLeft > 0
          );
          newBomb.ownedByPlayer = this; // so we know who shot it
          shotGroundList.push(newBomb);
        }
      }

      var extraLaserSpread = 3;

      if (this.holdFire) {
        if (readyToFire) {
          // doesn't need to reload
          var newShot,
            shotAngSpan =
              -(this.shotsNumber - 1) *
              (shotDegSpread * 0.5) *
              (this.hasLaserPowerUp ? extraLaserSpread : 1);
          playSound(sounds.playerShot);
          for (var i = 0; i < this.shotsNumber; i++) {
            newShot = new shotClass(
              fromX,
              this.hasLaserPowerUp ? fromY - LASER_SHOT_LENGTH * 2 : fromY,
              SHOT_SPEED,
              shotAngSpan +
                shotDegSpread *
                  i *
                  (this.hasLaserPowerUp ? extraLaserSpread : 1),
              pmx,
              pmy,
              this.hasLaserPowerUp ? LASER_SHOT_LENGTH : 2,
              this
            );
            newShot.ownedByPlayer = this; // so we know who shot it
            shotList.push(newShot);
          }
          this.reloadTime = FRAMES_BETWEEN_PLAYER_SHOTS;
        }
      }

      ghostIdx += GHOST_DIST_MULT;
      if (ghostIdx >= this.trailY.length) {
        ghostIdx = this.trailY.length - 1;
      }
      fromX = this.trailX[ghostIdx];
      fromY = this.trailY[ghostIdx];
    } while (ghostsLeft-- > 0);

    this.wasHoldingBomb = this.holdBomb;

    if (this.invulnerableTimeLeft > 0) {
      this.invulnerableTimeLeft -= INVULNERABLE_DURATION_DECREMENT;
      return;
    }

    this.decrementPowerupTimers();

    moveList(this.defenseRingUnitList);
  };

  this.animate = function () {
    this.frame++;
    if (this.frame >= PLAYER_FRAMES) {
      this.frame = 0;
    }
    animateList(this.defenseRingUnitList);
  };

  // any AI specific variables
  this.AI_dir_right = true;
  this.AI_margin = 50;
  this.AI_powerup_chasing = null;
  this.AI_target = null;

  this.chaseAI = function (toX, toY) {};

  this.doAI = function () {
    this.holdFire = true; // always
    if (Math.random() < 0.01) {
      this.holdBomb = !this.holdBomb;
    }
    if (this.AI_powerup_chasing != null) {
      this.holdDown = this.y < this.AI_powerup_chasing.y - this.speed;
      this.holdUp = this.y > this.AI_powerup_chasing.y + this.speed;

      this.holdLeft = this.x > this.AI_powerup_chasing.x + this.speed;
      this.holdRight = this.x < this.AI_powerup_chasing.x - this.speed;

      var dist = approxDist(
        this.x,
        this.y,
        this.AI_powerup_chasing.x,
        this.AI_powerup_chasing.y
      );
      if (
        dist > 0.5 * GAME_W ||
        this.AI_powerup_chasing.readyToRemove ||
        powerupList.length == 0
      ) {
        this.AI_powerup_chasing = null;
      }
    } else if (this.AI_target != null) {
      this.holdDown = this.y < GAME_H * 0.7;
      this.holdUp = this.y > GAME_H * 0.95;

      this.holdLeft = this.x > this.AI_target.x + this.speed * 3;
      this.holdRight = this.x < this.AI_target.x - this.speed * 3;
      if (
        this.AI_target.y > this.y ||
        this.AI_target.readyToRemove ||
        enemyList.length == 0
      ) {
        this.AI_target = null;
      }
    } else {
      this.holdDown = this.y < GAME_H * 0.75;
      this.holdUp = this.y > GAME_H * 0.9;
      if (this.AI_dir_right) {
        this.holdRight = true;
        this.holdLeft = !this.holdRight;
        if (this.x > GAME_W - this.AI_margin) {
          this.AI_dir_right = !this.AI_dir_right;
        }
      } else {
        this.holdRight = false;
        this.holdLeft = !this.holdRight;

        if (this.x < this.AI_margin) {
          this.AI_dir_right = !this.AI_dir_right;
        }
      }

      if (powerupList.length > 0) {
        this.AI_powerup_chasing = powerupList[0];
      } // end of powerup check
      else if (enemyList.length > 0) {
        this.AI_target = enemyList[0];
      } // end of powerup check
    } // end of AI wander case
  }; // end of doAI function
} // end of player class
