const PLAYER_DIM = 12;
const PLAYER_SPEED = 8;
const EDGE_MARGIN = PLAYER_DIM;
var px, py;

var holdLeft=false;
var holdUp=false;
var holdRight=false;
var holdDown=false;
var holdFire=false;

function drawPlayer() {
	context.fillStyle="white";
	context.fillRect(px-PLAYER_DIM/2,py-PLAYER_DIM/2,PLAYER_DIM,PLAYER_DIM);
}

function movePlayer() {
	// input handling
	if(holdUp) {
		py -= PLAYER_SPEED;
	}
	if(holdRight) {
		px += PLAYER_SPEED;
	}
	if(holdDown) {
		py += PLAYER_SPEED;
	}
	if(holdLeft) {
		px -= PLAYER_SPEED;
	}

	// bounds check
	if(px<EDGE_MARGIN) {
		px=EDGE_MARGIN;
	}
	if(px>=GAME_W-EDGE_MARGIN) {
		px=GAME_W-EDGE_MARGIN-1;
	}
	if(py<EDGE_MARGIN) {
		py=EDGE_MARGIN;
	}
	if(py>=GAME_H-EDGE_MARGIN) {
		py=GAME_H-EDGE_MARGIN-1;
	}


	if(holdFire) {
		shotList.push({x:px-4,y:py});
		shotList.push({x:px,y:py-1});
		shotList.push({x:px+4,y:py});
	}
}