var debug_showHiddenCanvas = false;

const GAME_W = 256;
const GAME_H = 240;

// note: 3:4 even though the game resolution isn't. same as on NES
const SCALED_W = 800;
const SCALED_H = 600;

var scaledCanvas, scaledCtx;
var canvas, context;

window.onload = function() {
	scaledCanvas = document.getElementById('showCanvas');
	scaledCanvas.width=SCALED_W;
	scaledCanvas.height=SCALED_H;
	scaledCtx=scaledCanvas.getContext("2d");
	
	canvas=document.createElement("canvas");
	canvas.width=GAME_W;
	canvas.height=GAME_H;
	context=canvas.getContext("2d");

	context.mozImageSmoothingEnabled = false;
	context.imageSmoothingEnabled = false;
	context.msImageSmoothingEnabled = false;
	scaledCtx.mozImageSmoothingEnabled = false;
	scaledCtx.imageSmoothingEnabled = false;
	scaledCtx.msImageSmoothingEnabled = false;

	if(debug_showHiddenCanvas) {
		document.body.appendChild(canvas); // to debug hidden canvas
	}
	setInterval(update,1000/30);
	setInterval(spawnEnemy,30);
	inputSetup();
	reset();
}

function reset() {
	px=GAME_W/2;
	py=GAME_H-PLAYER_DIM*2;
	shotList = [];
	enemyList = [];
}

function enemyToShotCollision() {
	for(var s=shotList.length-1;s>=0;s--) {
		if(shotList[s].readyToRemove) { // out of bounds or otherwise
			shotList.splice(s,1);
			continue;
		}
		for(var e=enemyList.length-1;e>=0;e--) {
			if(enemyList[e].readyToRemove) { // out of bounds or otherwise
				enemyList.splice(e,1);
				break;
			}
			var dx=Math.abs(enemyList[e].x-shotList[s].x);
			var dy=Math.abs(enemyList[e].y-shotList[s].y);
			var dist=dx+dy; // no need to bring sqrt into this, but correct would be Math.sqrt(dx*dx+dy*dy);
			if(dist< (SHOT_DIM+ENEMY_DIM)/2) {
				enemyList.splice(e,1);
				shotList.splice(s,1);
				break; // break since don't compare against other enemies for this removed shot
			}
		} // enemies
	} // shots
} // end of function

function update() {
	context.fillStyle="black";
	context.fillRect(0,0,canvas.width,canvas.height);
	
	movePlayer();
	moveShots();
	moveEnemies();

	enemyToShotCollision();

	drawPlayer();
	drawShots();
	drawEnemies();

	scaledCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height,
        					    0, 0, scaledCanvas.width, scaledCanvas.height);

	// text after stretch, for sharpness, proportion, readability
	scaledCtx.fillStyle = "white";
	// debugging list isn't growing, removed when expected etc.
	scaledCtx.fillText("Shots: " + shotList.length,20,20);
	scaledCtx.fillText("Enemies: " + enemyList.length,20,30);
}
