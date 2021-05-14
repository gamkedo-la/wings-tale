const PLAYER_DIM=12;
const PLAYER_SPEED=15;
var px, py;

function drawPlayer() {
	context.fillStyle="white";
	context.fillRect(px-PLAYER_DIM/2,py-PLAYER_DIM/2,PLAYER_DIM,PLAYER_DIM);
}