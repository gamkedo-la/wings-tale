var levelProgressInPixels = 0;
var levelProgressRate = 0.45;

window.onload = function() {
	setupCanvas();

	if(debug_showHiddenCanvas) {
		document.body.appendChild(canvas); // to debug hidden canvas
	}
	loadImages();
}

function loadingDoneSoStartGame() {
	startDisplayIntervals();
	setInterval(spawnEnemy,30);
	inputSetup();
	reset();
}

function animateSprites() {
	animatePlayer();
	for(var e=0;e<enemyList.length;e++) {
		if(++enemyList[e].frame>=ENEMY_FRAMES) {
			enemyList[e].frame = 0;
		}
	}
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

function drawBackground() {
	//context.fillStyle="#006994";
	//context.fillRect(0,0,canvas.width,canvas.height);
	var bgDrawY = -(images["level_island"].height-GAME_H)+levelProgressInPixels;
	if(bgDrawY>0) {
		bgDrawY = 0;
	}
	context.drawImage(images["level_island"],0,bgDrawY);
}

function update() {
	levelProgressInPixels += levelProgressRate;

	movePlayer();
	moveShots();
	moveEnemies();

	enemyToShotCollision();

	drawBackground();
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

function randRange(min,max) {
	return min+Math.random()*(max-min);
}