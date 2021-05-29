var enemyShotList = [];
const ENEMY_SHOT_DIM=3;
const ENEMY_SHOT_SPEED=3;
var enemyShotCommonFrame = 0;
const ENEMY_SHOT_FRAMES = 4;

function animateEnemyShots() {
	// special case, not using animateList for shots so they all stay in sync
	if(++enemyShotCommonFrame >= ENEMY_SHOT_FRAMES) {
		enemyShotCommonFrame = 0;
	}
}

enemyShotClass.prototype = new moveDrawClass();

function enemyShotClass(startX, startY, totalSpeed = ENEMY_SHOT_SPEED) {
	this.ang = Math.atan2((p1.y - startY), (p1.x - startX))
	this.x = startX;
	this.y = startY;
	this.xv = Math.cos(this.ang) * totalSpeed;
	this.yv = Math.sin(this.ang) * totalSpeed;
	this.readyToRemove = false;

	this.move = function() {
		this.x += this.xv;
		this.y += this.yv;
		if(this.y < 0 || this.x < 0 || this.x > GAME_W || this.y > GAME_H) {
			this.readyToRemove = true;
		}
	}

	this.draw = function() {
		drawAnimFrame("enemy shot", this.x, this.y, enemyShotCommonFrame, ENEMY_SHOT_DIM, ENEMY_SHOT_DIM);
	}

    enemyShotList.push(this)
}