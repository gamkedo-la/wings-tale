var levelProgressInPixels = 0;
var levelProgressRate = 0.45;
var bgDrawY = 0; // also used for drawing and collision of surface enemies
var currentLevelImageName = "level island"
var nDefenseOrbs = 3;

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
}

function animateSprites() {
	p1.animate();
	animateEnemies();
	animateShots();
	animateEnemyShots();
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
	enemyShotList = [];
	splodeList = [];
	defenseRingUnitList = [];
	spawnSurfaceEnemies();
	for(var i = 0; i<nDefenseOrbs ; i++){
		spawnDefenseRingUnit();
	}
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

function enemyToShieldCollision() {
	for(var d=defenseRingUnitList.length-1;d>=0;d--) {
		if(defenseRingUnitList[d].readyToRemove) { // out of bounds or otherwise
			defenseRingUnitList.splice(d,1);
			continue;
		}
		for(var e=enemyList.length-1;e>=0;e--) {
			if(enemyList[e].readyToRemove) { // out of bounds or otherwise
				enemyList.splice(e,1);
				break;
			}
			var dx=Math.abs(enemyList[e].x-defenseRingUnitList[d].x);
			var dy=Math.abs(enemyList[e].y-defenseRingUnitList[d].y);
			var dist=dx+dy; // no need to bring sqrt into this, but correct would be Math.sqrt(dx*dx+dy*dy);
			if(dist< (DEFENSE_RING_ORB_DIM+ENEMY_DIM)/2) {
				
				//explode at impact site!
				newSplode = new splodeClass(enemyList[e].x,enemyList[e].y);
				splodeList.push(newSplode);

				//remove both the shot and the enemy
				enemyList.splice(e,1);
				defenseRingUnitList.splice(d,1);
				
				break; // break since don't compare against other enemies for this removed shot
			}
		} // enemies
	} // shots
} // end of function

function enemyShotToShieldCollision() {
	for(var d=defenseRingUnitList.length-1;d>=0;d--) {
		if(defenseRingUnitList[d].readyToRemove) { // out of bounds or otherwise
			defenseRingUnitList.splice(d,1);
			continue;
		}
		for(var e=enemyShotList.length-1;e>=0;e--) {
			if(enemyShotList[e].readyToRemove) { // out of bounds or otherwise
				enemyShotList.splice(e,1);
				break;
			}
			var dx=Math.abs(enemyShotList[e].x-defenseRingUnitList[d].x);
			var dy=Math.abs(enemyShotList[e].y-defenseRingUnitList[d].y);
			var dist=dx+dy; // no need to bring sqrt into this, but correct would be Math.sqrt(dx*dx+dy*dy);
			if(dist< (DEFENSE_RING_ORB_DIM+ENEMY_DIM)/2) {
				
				//explode at impact site!
				newSplode = new splodeClass(enemyShotList[e].x,enemyShotList[e].y);
				splodeList.push(newSplode);

				//remove both the shot and the enemy
				enemyShotList.splice(e,1);
				defenseRingUnitList.splice(d,1);
				
				break; // break since don't compare against other enemies for this removed shot
			}
		} // enemies
	} // shots
} // end of function

function enemyShotToPlayerCollision() {
	for (var eShot = enemyShotList.length - 1; eShot >= 0; eShot--) {
		if (enemyShotList[eShot].readyToRemove) {
			enemyShotList.splice(eShot, 1);
			continue;
		}

		var dx1 = Math.abs(enemyShotList[eShot].x - p1.x);
		var dy1 = Math.abs(enemyShotList[eShot].y - p1.y);
		// var dx2 = Math.abs(enemyShotList[eShot].x - p2.x); // reserved for player 2
		// var dy2 = Math.abs(enemyShotList[eShot].y - p2.y); // reserved for player 2
		var dist1 = dx1+dy1; // no need to bring sqrt into this, but correct would be Math.sqrt(dx*dx+dy*dy);
		if(dist1 < (SHOT_DIM + PLAYER_DIM) / 2) {
				
			reset() // hit the player
			
			break; // break since don't compare against other enemies for this removed shot
		}
	}
}

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
	texture = context.getImageData(0, 0, GAME_W, GAME_H);
	ripple = context.getImageData(0, 0, GAME_W, GAME_H);  

	
}

function drawRippleEffect() {

	//dropAt(Math.random()*GAME_W << 0, Math.random()*GAME_H << 0);
	dropAt(p1.x, p1.y)

	rippleNewFrame();
	
	context.putImageData(ripple, 0, 0);
	
	
}

function update() {
	levelProgressInPixels += levelProgressRate;

		//testing out some real-time background effects here, meant to render before sprites are drawn

	p1.move();
	moveShots();
	moveSplodes();
	moveSurfaceEnemies();
	moveEnemies();
	moveEnemyShots();
	moveDefenseRingUnits(p1.x, p1.y);

	enemyToShotCollision();
	enemyToShieldCollision();
	enemyShotToShieldCollision();
	enemyShotToPlayerCollision();
	splodeCleanup();

	drawBackground();
	drawRippleEffect();
	drawSurfaceEnemies();
	p1.draw();
	drawShots();
	drawEnemies();
	drawEnemyShots();
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