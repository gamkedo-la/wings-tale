var shotList=[];
const SHOT_DIM=4;
const SHOT_SPEED=7;

function drawShots() {
	for(var s=0;s<shotList.length;s++) {
		context.fillRect(shotList[s].x-SHOT_DIM/2,shotList[s].y-SHOT_DIM/2,SHOT_DIM,SHOT_DIM);
	}
}

function moveShots() {
	for(var s=0;s<shotList.length;s++) {
		shotList[s].y -= SHOT_SPEED;
	}
}