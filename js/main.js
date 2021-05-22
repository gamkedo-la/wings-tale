var levelProgressInPixels = 0;
var levelProgressRate = 0.45;
var bgDrawY = 0; // also used for drawing and collision of surface enemies
var currentLevelImageName = "level island"

var p1 = new playerClass();

window.onload = function() { // discord repo check
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
	spawnDefenseRingUnit();
	spawnDefenseRingUnit();
	spawnDefenseRingUnit();
}

function animateSprites() {
	p1.animate();
	animateEnemies();
	animateShots();
	animateSplodes();
	animateSurfaceEnemies();
	animateDefenseRingUnits();
}

function reset() {
	p1.reset();
	levelProgressInPixels = 0
	shotList = [];
	enemyList = [];
	surfaceEnemyList = [];
	splodeList = [];
	spawnSurfaceEnemies();
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
				
				//explode at impact site!
				newSplode = new splodeClass(enemyList[e].x,enemyList[e].y);
				splodeList.push(newSplode);

				//remove both the shot and the enemy
				enemyList.splice(e,1);
				shotList.splice(s,1);
				
				break; // break since don't compare against other enemies for this removed shot
			}
		} // enemies
	} // shots
} // end of function

function splodeCleanup() {
	//splodes are marked ready to remove after they play animation once.
	for(var i=splodeList.length-1;i>=0;i--) {
		if(splodeList[i].readyToRemove) { // out of bounds or otherwise
			splodeList.splice(i,1);
			continue;
		}
	}
}

function drawBackground() {
	bgDrawY = (images[currentLevelImageName].height-GAME_H)-levelProgressInPixels;
	if(bgDrawY<0) {
		bgDrawY = 0;
	}

	context.drawImage(images[currentLevelImageName],0,bgDrawY,GAME_W,GAME_H,
											 0,0,GAME_W,GAME_H);
}

function update() {
	levelProgressInPixels += levelProgressRate;

	p1.move();
	moveShots();
	moveSplodes();
	moveSurfaceEnemies();
	moveEnemies();
	moveDefenseRingUnits(p1.x, p1.y);

	enemyToShotCollision();
	splodeCleanup();

	drawBackground();
	drawSurfaceEnemies();
	p1.draw();
	drawShots();
	drawEnemies();
	drawSplodes();
	drawDefenseRingUnits();

	scaledCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height,
        					    0, 0, scaledCanvas.width, scaledCanvas.height);

	// text after stretch, for sharpness, proportion, readability
	scaledCtx.fillStyle = "white";
	// debugging list isn't growing, removed when expected etc.
	var debugLineY = 20;var debugLineSkip = 10;
	scaledCtx.fillText("DEBUG/TEMPORARY TEXT",20,debugLineY+=debugLineSkip);
	scaledCtx.fillText("C key: upgrade player shot, now: "+p1.shotsNumber,20,debugLineY+=debugLineSkip);
	scaledCtx.fillText("V key: reset player shot",20,debugLineY+=debugLineSkip);
	var percProgress = Math.floor( 100* levelProgressInPixels / (images[currentLevelImageName].height-GAME_H));
	if(percProgress>100) {
		percProgress = 100;
	}
	scaledCtx.fillText("Level progress: " + percProgress+"%",20,debugLineY+=debugLineSkip);
}

function randRange(min,max) {
	return min+Math.random()*(max-min);
}