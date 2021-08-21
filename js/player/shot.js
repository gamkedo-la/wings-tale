var shotList = [];
const SHOT_DIM = 4;
const SHOT_COLLISION_DIM = SHOT_DIM * 4;
const SHOT_SPEED = 6;
var playerShotCommonFrame = 0;
const PLAYER_SHOT_FRAMES = 2;
const LASER_SHOT_LENGTH = 60;

function animateShots() {
  // special case, not using animateList for shots so they all stay in sync
  playerShotCommonFrame++;
  if (playerShotCommonFrame >= PLAYER_SHOT_FRAMES) {
    playerShotCommonFrame = 0;
  }
}

shotClass.prototype = new moveDrawClass();

// px+4,py,SHOT_SPEED,5.0,pmx,pmy
function shotClass(
  startX,
  startY,
  totalSpeed,
  angle,
  momentumX,
  momentumY,
  shotLength = 2
) {
  this.ang = degToShipRad(angle);
  this.x = startX + Math.cos(this.ang) * 12; // for lateral spacing when there's a spread
  this.y = startY;
  this.xv = momentumX + Math.cos(this.ang) * totalSpeed;
  this.yv = momentumY + Math.sin(this.ang) * totalSpeed;
  this.shotLength = shotLength; // not counting front/back end caps. in case we want it to grow, shrink, etc.

  this.collW = SHOT_DIM;
  this.collH = SHOT_DIM*4;

  this.move = function () {
    this.x += this.xv;
    this.y += this.yv;
    if (this.y < 0 || this.x < 0 || this.x > GAME_W || this.y > GAME_H) {
      this.readyToRemove = true;
      // a bullet flying off screen resets the player's combo counter
      if (this.ownedByPlayer) this.ownedByPlayer.combo.reset();
    }
  };

  this.draw = function () {
    var length = 2 + this.shotLength;
    var shotPixelLength = (length * SHOT_DIM) / 2;
    for (var i = 0; i < length; i++) {
      var piece;
      if (i == 0) {
        piece = 0;
      } else if (i == length - 1) {
        piece = 3;
      } else {
        piece = playerShotCommonFrame % 2 == 0 ? 1 : 2;
      }
      drawAnimFrame(
        "player shot 2",
        this.x,
        this.y - shotPixelLength + i * SHOT_DIM,
        piece,
        SHOT_DIM,
        SHOT_DIM
      );
    }
  };
}
