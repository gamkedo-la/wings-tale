var powerupList = [];
const POWERUP_W = 10;
const POWERUP_H = 12;
const POWERUP_COLL_SIZE = 20;
const POWERUP_FRAMES = 2;
const POWER_UP_FRAME_DRAG = 4; // slow down animation framerate
const POWERUP_SPEED = 0.6; // speed of the powerup's movement

const MOVEMENT_POWERUP_SPEED = 4; // the player speed when boosted (3 is normal speed)

const POWER_UP_KIND_SHOTS = 0;
const POWER_UP_KIND_BOMB = 1;
const POWER_UP_KIND_GHOST = 2;
const POWERUP_KIND_LASER = 3;
const POWER_UP_KIND_MOVEMENT = 4;
const POWERUP_KINDS = 5;

var powerupDropOdds = [];

// first as whole numbers, proportional, which get converted to percentages
powerupDropOdds[POWER_UP_KIND_SHOTS] = 3;
powerupDropOdds[POWER_UP_KIND_BOMB] = 1;
powerupDropOdds[POWER_UP_KIND_GHOST] = 1;
powerupDropOdds[POWERUP_KIND_LASER] = 1;
powerupDropOdds[POWER_UP_KIND_MOVEMENT] = 2;

function SetupPowerupDropOdds() {
  var totalCount = 0;
  var cumulativeFloor = 0; // ex. if type 1 is 20% and type 2 is 10%, type 2 is 0.2+0.1=0.3
  for (var i = 0; i < powerupDropOdds.length; i++) {
    totalCount += powerupDropOdds[i];
  }

  for (var i = 0; i < powerupDropOdds.length; i++) {
    var beforeCumulative = powerupDropOdds[i];
    powerupDropOdds[i] = cumulativeFloor;
    cumulativeFloor += beforeCumulative / totalCount;
  }
  powerupDropOdds[powerupDropOdds.length] = 1.0; // extra element for remaining probability
}

function spawnNewPowerup(atX, atY, excludeList = []) {
  powerupList.push(new powerupClass(atX, atY, excludeList));
}

powerupClass.prototype = new moveDrawClass();

// note: not yet generalized for more than one kind of powerup
function powerupClass(atX, atY, excludeList = []) {
  this.x = atX;
  this.y = atY;
  this.frame = Math.floor(Math.random() * POWERUP_FRAMES);
  var typeDiceRoll = Math.random();

  for (var i = 0; i < powerupDropOdds.length; i++) {
    if (excludeList.includes(i)) {
      continue;
    }

    if (typeDiceRoll < powerupDropOdds[i + 1]) {
      // safe to use +1, has a 1.0 dummy end case
      this.kind = i;
      break; // quit the for-loop
    }
  }
  this.readyToRemove = false;

  this.collW = this.collH = POWERUP_COLL_SIZE;

  var ang = randAng();
  this.xv = Math.cos(ang) * POWERUP_SPEED;
  this.yv = Math.sin(ang) * POWERUP_SPEED;

  this.move = function () {
    this.x += this.xv;
    this.y += 1;
    if (this.y < 0 || this.x < 0 || this.x > GAME_W || this.y > GAME_H) {
      this.readyToRemove = true;
    }
  };

  this.doEffect = function (onPlayer) {
    switch (this.kind) {
      case POWER_UP_KIND_SHOTS:
        onPlayer.shotsNumber++;
        onPlayer.shotPowerTimer = onPlayer.powerTimerDefault;
        playerScore += 125;
        break;
      case POWER_UP_KIND_BOMB:
        onPlayer.bombCount += 1;
        onPlayer.bombPowerTimer = onPlayer.powerTimerDefault;
        playerScore += 500;
        break;
      case POWER_UP_KIND_GHOST:
        onPlayer.ghostCount += 1;
        onPlayer.ghostColors.push(getRandomInt(1, GHOST_COLOR_MAX));
        onPlayer.ghostPowerTimer = onPlayer.powerTimerDefault;
        playerScore += 1000;
        break;
      case POWER_UP_KIND_MOVEMENT:
        onPlayer.speed = MOVEMENT_POWERUP_SPEED;
        onPlayer.speedTrailsOn = true;
        onPlayer.speedPowerTimer = onPlayer.powerTimerDefault;
        playerScore += 1000;
        break;
      case POWERUP_KIND_LASER:
        onPlayer.hasLaserPowerUp = true;
        onPlayer.laserPowerTimer = onPlayer.powerTimerDefault;
        playerScore += 1000;
        break;
      default:
        console.log(
          "missing powerup definition in doEffect for kind: " + this.kind
        );
    }
  };

  this.draw = function () {
    drawAnimFrame(
      "powerup",
      this.x,
      this.y,
      Math.floor(this.frame / POWER_UP_FRAME_DRAG),
      POWERUP_W,
      POWERUP_H,
      0,
      this.kind
    );
  };
  this.animate = function () {
    if (++this.frame >= POWERUP_FRAMES * POWER_UP_FRAME_DRAG) {
      this.frame = 0;
    }
  };
}
