var shotList=[];
const SHOT_DIM=3;
const SHOT_SPEED=6;
var playerShotCommonFrame = 0;
const PLAYER_SHOT_FRAMES = 4;

function drawShots() {
	context.fillStyle="lime";
	for(var s=0;s<shotList.length;s++) {
		context.fillRect(shotList[s].x-SHOT_DIM/2,shotList[s].y-SHOT_DIM/2,SHOT_DIM,SHOT_DIM);
		drawAnimFrame("player shot",shotList[s].x,shotList[s].y, playerShotCommonFrame, SHOT_DIM,SHOT_DIM);
	}
}

function moveShots() {
	for(var s=0;s<shotList.length;s++) {
		shotList[s].x += shotList[s].xv;
		shotList[s].y += shotList[s].yv;
		if(shotList[s].y<0 || shotList[s].x<0 || shotList[s].x>GAME_W || shotList[s].y>GAME_H) {
			shotList[s].readyToRemove = true;
		}
	}
}

function animateShots() {
	if(++playerShotCommonFrame>=PLAYER_SHOT_FRAMES) {
		playerShotCommonFrame = 0;
	}
}