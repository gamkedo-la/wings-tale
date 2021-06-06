var levelProgressInPixels = 0;
var levelProgressRate = 0.6;
var bgDrawY = 0; // also used for drawing and collision of surface enemies
var currentLevelImageName = "level island"
var nDefenseOrbs = 33;
var debuggingDisplay = true;

let twoPlayerGame = true;

var playerList = [new playerClass(), new playerClass()];
var readyToReset = false; // to avoid calling reset() mid list iterations
var octopusBoss = new octopusClass();

var drawMoveList = []; // list of lists - note, drawn in this order, so should be filled closest to ground up towards sky last
var animateEachLists = []; // subset of draw/move lists for which each object has its own separate animation frame to update

const GAME_STATE_PLAY = 0;
const GAME_STATE_CONTROLS = 1;
var gameState = GAME_STATE_PLAY;

var gameMusic = {};

var bossFight = false;

window.onload = function() { // discord repo check
	setupCanvas();

	if(debug_showHiddenCanvas) {
		document.body.appendChild(canvas); // to debug hidden canvas
	}
	loadSounds();
	loadImages();
	gameMusic = playSound(sounds.secondReality, 1, 0, 0.5, true);
}

function loadingDoneSoStartGame() {
	createDepthSpawnReference();
	startDisplayIntervals();
	setInterval(spawnEnemy,140);
	inputSetup();
	initializeControlsMenu();
	reset();
}

function createDepthSpawnReference(){
	depthSpawnCanvas = document.createElement('canvas');
	depthSpawnContext = depthSpawnCanvas.getContext('2d');
	let img = images["depth map"];
	depthSpawnCanvas.width = img.width;
	depthSpawnCanvas.height = img.height; 
	depthSpawnContext.drawImage(img, 0, 0);
	depthSpawnData = depthSpawnContext.getImageData(0,0, img.width, img.height);
}

function animateSprites() {
	if (gameState != GAME_STATE_PLAY)
	{
		return;
	}

	for(var i=0;i<animateEachLists.length;i++) {
		animateList(animateEachLists[i]);
	}

	// share common animation frame, so no list call:
	animateShots();
	animateEnemyShots();
	animateSplodes();
}

function reset() {
	if(twoPlayerGame) {
		playerList = [new playerClass(),new playerClass()];
	} else {
		playerList = [new playerClass()];
	}
	assignKeyMapping();

	for(var i=0;i<playerList.length;i++) {
		playerList[i].reset();
	}
	levelProgressInPixels = 0

	for(var i=0;i<drawMoveList.length;i++) {
		drawMoveList[i].length = 0;
	}

	spawnSurfaceEnemies();
	rippleReset();

	// repacking this list since reset above emplied
	drawMoveList = [surfaceList,powerupList,shotGroundList,enemyList,enemyShotList,shotList,playerList,splodeList];

	// excludes lists which share a common animation frame to be in sync (ex. all shots show same animation frame at same time)
	animateEachLists = [playerList, enemyList, powerupList, surfaceList];

	gameMusic.sound.stop();
	gameMusic = playSound(sounds.secondReality, 1, 0, 0.3, true);
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

function stretchLowResCanvasToVisibleCanvas() {
	scaledCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height,
        					    0, 0, scaledCanvas.width, scaledCanvas.height);
}

function update() 
{

	if(readyToReset) 
	{
		reset();
		readyToReset = false;
	}

	context.clearRect(0,0, canvas.width,canvas.height);
	switch(gameState) {
		case GAME_STATE_CONTROLS:
			controlsMenu.draw();
			break;

		case GAME_STATE_PLAY:
			levelProgressInPixels += levelProgressRate;

			//testing out some real-time background effects here, meant to render before sprites are drawn

			for(var i=0;i<drawMoveList.length;i++) 
			{
				moveList(drawMoveList[i]);
			}

			listCollideExplode(shotList, enemyList, (SHOT_DIM+ENEMY_DIM)/2);

			for(var i=0;i<playerList.length;i++) {
				listCollideExplode(enemyList, playerList[i].defenseRingUnitList, (DEFENSE_RING_ORB_DIM+ENEMY_DIM)/2);
				listCollideExplode(enemyShotList, playerList[i].defenseRingUnitList, (ENEMY_SHOT_DIM + DEFENSE_RING_ORB_DIM)/2);
			}
			listCollideExplode(playerList, enemyList, (ENEMY_DIM + PLAYER_DIM) / 2, function (elementA,elementB) { elementA.reset(); } );
			listCollideExplode(playerList, enemyShotList, (SHOT_DIM + PLAYER_DIM) / 2, function (elementA,elementB) { elementA.reset(); } );
			listCollideExplode(playerList, powerupList, (POWERUP_H + PLAYER_DIM) / 2, function (elementA,elementB) { elementB.doEffect(elementA); } );

			drawBackground();
			drawRippleEffect();
			for(var i=0;i<drawMoveList.length;i++) 
			{
				drawList(drawMoveList[i]);
			}

			if(bossFight){
				octopusBoss.draw();
			}
			break;
	}

	// necessary to see what's on the low res canvas
	stretchLowResCanvasToVisibleCanvas();

	// debug text after stretch, mainly for sharpness, proportion, readability
	if(gameState == GAME_STATE_PLAY && debuggingDisplay) {
		gameDebugSharpText();
	}
}

function gameDebugSharpText() {
	scaledCtx.fillStyle = "white";
	scaledCtx.font = '10px Helvetica';
	// debugging list isn't growing, removed when expected etc.
	var debugLineY = 20;var debugLineSkip = 10;
	scaledCtx.fillText("DEBUG/TEMPORARY TEXT",20,debugLineY+=debugLineSkip);
	scaledCtx.fillText("check H for help",20,debugLineY+=debugLineSkip);
	scaledCtx.fillText("1-4,7-0: cheats",20,debugLineY+=debugLineSkip);

	// scaledCtx.fillStyle = 'white';
	scaledCtx.font = '15px Helvetica';
	scaledCtx.fillText("H for help", scaledCanvas.width - 90, scaledCanvas.height - 20);

	var percProgress = Math.floor( 100* levelProgressInPixels / (images[currentLevelImageName].height-GAME_H));
	if(percProgress>100) 
	{
		percProgress = 100;
		bossFight = true;
	}else{
		bossFight = false;
	}
	scaledCtx.fillText("Level progress: " + percProgress+"%",20,debugLineY+=debugLineSkip);
}