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
	var playerTarget;
	if(twoPlayerGame == false) {
		playerTarget = playerList[0];
	} else {
		var dist1 = approxDist(startX,startY,playerList[0].x,playerList[0].y)
		var dist2 = approxDist(startX,startY,playerList[1].x,playerList[1].y)
		playerTarget = (dist1 < dist2 ? playerList[0] : playerList[1]);
	}
	this.ang = Math.atan2((playerTarget.y - startY), (playerTarget.x - startX));
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