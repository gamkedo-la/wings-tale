var levelProgressInPixels = 0;
var levelProgressRate = 0.6;
var bgDrawY = 0; // also used for drawing and collision of surface enemies
var currentLevelImageName = "level island"
var nDefenseOrbs = 3;

var p1 = new playerClass();
var readyToReset = false; // to avoid calling reset() mid list iterations

var drawMoveList = []; // list of lists - note, drawn in this order, so should be filled closest to ground up towards sky last
var animateEachLists = []; // subset of draw/move lists for which each object has its own separate animation frame to update

var playingGame = true;

window.onload = function() { // discord repo check
	setupCanvas();

	if(debug_showHiddenCanvas) {
		document.body.appendChild(canvas); // to debug hidden canvas
	}
	loadSounds();
	loadImages();
}

function loadingDoneSoStartGame() {
	startDisplayIntervals();
	setInterval(spawnEnemy,140);
	inputSetup();
	initializeControlsMenu();
	reset();
}

function animateSprites() {
	if (!playingGame)
	{
		return;
	}

	p1.animate();
	for(var i=0;i<animateEachLists.length;i++) {
		animateList(animateEachLists[i]);
	}

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
	drawMoveList = [surfaceList,powerupList,shotGroundList,shotList,enemyList,enemyShotList,splodeList,defenseRingUnitList];

	// excludes lists which share a common animation frame to be in sync (ex. all shots show same animation frame at same time)
	animateEachLists = [enemyList, powerupList, surfaceList, defenseRingUnitList];
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

	rippleNewFrame();
	
	context.putImageData(ripple, 0, 0);
	context.drawImage(canvas, -PARALLAX_OFFSET_X*W_RATIO,
							  -PARALLAX_OFFSET_Y*H_RATIO,
							   GAME_W + (PARALLAX_OFFSET_X*2*W_RATIO >> 0),
							   GAME_H + (PARALLAX_OFFSET_Y*2*H_RATIO) >> 0);
	
	
}

function update() 
{

	if(readyToReset) 
	{
		reset();
		readyToReset = false;
	}

	context.clearRect(0,0, canvas.width,canvas.height);
	if (controlsMenuIsOn)
	{
		// console.log("update call to controls menu draw");
		// console.log("playingGame: " + playingGame);
		controlsMenu.draw();
		return;
	}	
	else if (playingGame)
	{
		levelProgressInPixels += levelProgressRate;

		//testing out some real-time background effects here, meant to render before sprites are drawn

		for(var i=0;i<drawMoveList.length;i++) 
		{
			moveList(drawMoveList[i]);
		}
		p1.move();

		listCollideExplode(shotList, enemyList, (SHOT_DIM+ENEMY_DIM)/2);
		listCollideExplode(defenseRingUnitList, enemyList, (DEFENSE_RING_ORB_DIM+ENEMY_DIM)/2);
		listCollideExplode(enemyShotList, defenseRingUnitList, (ENEMY_SHOT_DIM + DEFENSE_RING_ORB_DIM)/2);
		listCollideRangeOfPoint(enemyList, p1.x, p1.y, (ENEMY_DIM + PLAYER_DIM) / 2, function (listElement) { readyToReset = true; } );
		listCollideRangeOfPoint(enemyShotList, p1.x, p1.y, (SHOT_DIM + PLAYER_DIM) / 2, function (listElement) { readyToReset = true; } );
		listCollideRangeOfPoint(powerupList, p1.x, p1.y, (POWERUP_H + PLAYER_DIM) / 2, function (listElement) { listElement.doEffect(); } );

		drawBackground();
		drawRippleEffect();
		for(var i=0;i<drawMoveList.length;i++) 
		{
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
		scaledCtx.fillText("Space/Z key: hold to fire",20,debugLineY+=debugLineSkip);
		scaledCtx.fillText("X key: drop bomb",20,debugLineY+=debugLineSkip);
		scaledCtx.fillText("1-3 key: instant powerup cheat",20,debugLineY+=debugLineSkip);
		scaledCtx.fillText("4 key: reset powerups",20,debugLineY+=debugLineSkip);
		/*for(var i=0;i<p1.trailY.length;i++) {
			scaledCtx.fillText(""+p1.trailY[i],20,debugLineY+=debugLineSkip);
		}*/

		var percProgress = Math.floor( 100* levelProgressInPixels / (images[currentLevelImageName].height-GAME_H));
		if(percProgress>100) 
		{
			percProgress = 100;
		}
		scaledCtx.fillText("Level progress: " + percProgress+"%",20,debugLineY+=debugLineSkip);
	}
}
