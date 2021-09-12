const MEGAFROG_FRAME_W = 400;
const MEGAFROG_FRAME_H = 360;

const MEGAFROG_BACK_Y = -180;
const MEGAFROG_FRONT_Y = 175;
const MEGAFROG_MOVE_SPEED = 4;

bossMegaFrogClass.prototype = new moveDrawClass();

function bossMegaFrogClass() {
  this.neckList = [];
  this.rightNeck;
  this.yv = MEGAFROG_MOVE_SPEED;

  this.collList = [];

  this.reset = function () {
    this.x = GAME_W / 2;
    this.y = MEGAFROG_BACK_Y;
    this.neckList = [];
  };

  this.move = function () {
    this.y += this.yv;
    if (this.y > MEGAFROG_FRONT_Y) {
      this.yv = 0.0;
    }
    if (this.y < MEGAFROG_BACK_Y) {
      this.yv = -this.yv;
    }

    moveList(this.neckList,this.collList);

    /*if(this.collList.length == 0) {
      this.health = -1;
      console.log("last head of fire dragon defeated!");
    }*/
  };

  this.draw = function () {
    drawAnimFrame("megafrog", this.x, this.y, this.frame, MEGAFROG_FRAME_W, MEGAFROG_FRAME_H);
    for (var i = 0; i < this.neckList.length; i++) {
      // get position from parent
      this.neckList[i].x = this.x;
      this.neckList[i].y = this.y;

      this.neckList[i].draw();
      
      // note: next line counts on 1:1 list size and order for neckList and collList
      this.collList[i].x = this.neckList[i].collX;
      this.collList[i].y = this.neckList[i].collY;
    }

    if(debugDraw_colliders) {
      for (var i = 0; i < this.collList.length; i++) {
        drawColl(this.collList[i],"white");
      }
    }
  };

  this.animate = function () {
    for (var i = 0; i < this.neckList.length; i++) {
      this.neckList[i].animate();
    }
  };
}
