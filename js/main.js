var levelProgressInPixels = 0;
var levelProgressRate = 0.6;
var bgDrawY = 0; // also used for drawing and collision of surface enemies
var currentLevelImageName = "level island"
var nDefenseOrbs = 3;

var p1 = new playerClass();
var readyToReset = false; // to avoid calling reset() mid list iterations

var drawMoveList = []; // list of lists - note, drawn in this order, so should be filled closest to ground up towards sky last

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
	animateList(enemyList);
	animateList(surfaceList);
	animateList(defenseRingUnitList);

	// share common animation frame, so no list call:
	animateShots();
	animateEnemyShots();
	animateSplodes();
}

function reset() {
	p1.reset();
	levelProgressInPixels = 0

	for(var i=0;i<drawMoveList.length;i++) {
		drawMoveList[i].length = 0;
	}

	resetDefenseRing();
	spawnSurfaceEnemies();
	rippleReset();

	// repacking this list since reset above emplied
	drawMoveList = [surfaceList,shotGroundList,shotList,enemyList,enemyShotList,splodeList,defenseRingUnitList];
}

function enemyShotToPlayerCollision() {
	for (var eShot = enemyShotList.length - 1; eShot >= 0; eShot--) {
		var dx1 = Math.abs(enemyShotList[eShot].x - p1.x);
		var dy1 = Math.abs(enemyShotList[eShot].y - p1.y);
		// var dx2 = Math.abs(enemyShotList[eShot].x - p2.x); // reserved for player 2
		// var dy2 = Math.abs(enemyShotList[eShot].y - p2.y); // reserved for player 2
		var dist1 = dx1+dy1; // no need to bring sqrt into this, but correct would be Math.sqrt(dx*dx+dy*dy);
		if(dist1 < (SHOT_DIM + PLAYER_DIM) / 2) {
			readyToReset = true;			
			break; // break since no more need to be tested
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
	fxContext.drawImage(images['depth map'], 0, bgDrawY, GAME_W, GAME_H, 0, 0, GAME_W, GAME_H);
	
    // note: these functions require the game to run on a web server
    // due to local file browser security - they will fail on file://
    // unless you change default browser security settings
    texture = context.getImageData(0, 0, GAME_W, GAME_H);
	ripple = context.getImageData(0, 0, GAME_W, GAME_H);
	depthTexture = fxContext.getImageData(0, 0, GAME_W, GAME_H);

	
}

function drawRippleEffect() {

	//dropAt(Math.random()*GAME_W << 0, Math.random()*GAME_H << 0);
	//dropAt(p1.x, p1.y)

	rippleNewFrame();
	
	context.putImageData(ripple, 0, 0);
	context.drawImage(canvas, -81*W_RATIO,-61*H_RATIO, GAME_W + (81*2*W_RATIO >> 0), GAME_H + (61*2*H_RATIO) >> 0);
	
	
}

function update() {
	if(readyToReset) {
		reset();
		readyToReset = false;
	}

	levelProgressInPixels += levelProgressRate;

		//testing out some real-time background effects here, meant to render before sprites are drawn

	for(var i=0;i<drawMoveList.length;i++) {
		moveList(drawMoveList[i]);
	}
	p1.move();

	listCollideExplode(shotList, enemyList, (SHOT_DIM+ENEMY_DIM)/2);
	listCollideExplode(defenseRingUnitList, enemyList, (DEFENSE_RING_ORB_DIM+ENEMY_DIM)/2);
	listCollideExplode(enemyShotList, defenseRingUnitList, (ENEMY_SHOT_DIM + DEFENSE_RING_ORB_DIM)/2);

	enemyShotToPlayerCollision();

	drawBackground();
	drawRippleEffect();
	for(var i=0;i<drawMoveList.length;i++) {
		drawList(drawMoveList[i]);
	}
	p1.draw();

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
