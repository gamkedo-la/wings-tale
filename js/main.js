var gameDevelopmentMode = true; //skip intro stuff

var nDefenseOrbs = 33;
var debuggingDisplay = true;
var debugDraw_surfacePaths = true;

let twoPlayerGame = false;
let p2AI = true;

var playerList = [new playerClass(), new playerClass()];
var readyToReset = false; // to avoid calling reset() mid list iterations
var octopusBoss = new octopusClass();

var playerScore = 0; // Player Score, Getting powerups adds to it.

var drawMoveList = []; // list of lists - note, drawn in this order, so should be filled closest to ground up towards sky last
var animateEachLists = []; // subset of draw/move lists for which each object has its own separate animation frame to update

var cheatKeepPowerupsOnDeath = false;

const GAME_STATE_PLAY = 0;
const GAME_STATE_CONTROLS = 1;
const GAME_STATE_TITLE = 2;
const GAME_STATE_LEVEL_SELECT = 3;
const GAME_STATE_LOADING_SPLASH = 4;
const GAME_STATE_LEVEL_DEBUG = 5;
var gameState;
if (!gameDevelopmentMode) {
  gameState = GAME_STATE_LOADING_SPLASH;
} else {
  gameState = GAME_STATE_LEVEL_SELECT;
}

var gameMusic = {};

var bossFight = false;

var gameFirstClickedToStart = false;
var imagesLoaded = false;

var curDepthMap = "depth map";

window.onload = function () {
  setupCanvas();

  if (cheatKeepPowerupsOnDeath) {
    console.log("The cheat/debug feature KeepPowerupsOnDeath is on!");
  }

  if (debug_showHiddenCanvas) {
    document.body.appendChild(canvas); // to debug hidden canvas
  }

  loadImages();

  document.addEventListener("mousedown", handleMouseClick);

  if (!gameDevelopmentMode) {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "white";
    context.textAlign = "center";
    context.font = "15px Georgia";
    context.fillText(
      "Loaded. Click to Start",
      canvas.width / 2,
      canvas.height / 2
    );
    stretchLowResCanvasToVisibleCanvas();
  } else {
  }

  // scaledCtx.fillStyle = "black";
  // scaledCtx.fillRect(0,0,scaledCanvas.width,scaledCanvas.height);
};

function loadingDoneSoStartGame() {
  imagesLoaded = true;

  if (gameDevelopmentMode) {
    console.log("scaledCtx: " + scaledCtx);
    console.log("images:" + images);
    //draw level select screen when in game dev mode
    var levX = 0;
    var levWid = images[levNames[0]].width;
    for (var i = 0; i < levNames.length; i++) {
      scaledCtx.drawImage(images[levNames[i]], levX, 0);

      scaledCtx.lineWidth = "6";
      scaledCtx.strokeStyle = "lime";
      scaledCtx.beginPath();
      scaledCtx.rect(levX, 0, levWid, scaledCanvas.height);
      scaledCtx.stroke();
      levX += levWid;
    }
    //level select screen header text
    scaledCtx.fillStyle = "black";
    scaledCtx.font = "10px Helvetica";
    var lineX = levX + 6;
    var lineY = 50;
    var lineSkip = 10;
    scaledCtx.fillText("click", lineX, (lineY += lineSkip));
    scaledCtx.fillText("level", lineX, (lineY += lineSkip));
    scaledCtx.fillText("to", lineX, (lineY += lineSkip));
    scaledCtx.fillText("start", lineX, (lineY += lineSkip));
    //level select levels text
    scaledCtx.fillStyle = "white";
    scaledCtx.font = "30px Georgia";
    var lineX = 60;
    var lineY = 500;
    var wordSpacing = 350;
    scaledCtx.fillText("Space", lineX + wordSpacing - 65, (lineY -= 20));
    scaledCtx.fillStyle = "green";

    scaledCtx.fillText("Island", lineX + 18, lineY);
    scaledCtx.fillStyle = "Red";

    scaledCtx.fillText("Moon", lineX + wordSpacing + 200, lineY);

    stretchLowResCanvasToVisibleCanvas();
  }
}

function loadedAndClicked(evt) {
  mousemoved(evt); // catch coordinate of even first click, for level select menu

  if (
    mouseX > 0 &&
    mouseX < images[levNames[0]].width * levNames.length &&
    mouseY > 0 &&
    mouseY < scaledCanvas.height
  ) {
    if (imagesLoaded == false) {
      // invalid unless loading finished
      return;
    }
    
    if (gameFirstClickedToStart) {
      // lock it from happening multiple times
      return;
    }

    gameFirstClickedToStart = true;

    
    createDepthSpawnReference();
    startDisplayIntervals();
    inputSetup();
    initializeTitleScreen();
    initializeLevelSelectScreen();
    initializeControlsMenu();
    reset();
    

    if (!gameDevelopmentMode) {
      gameState = GAME_STATE_TITLE;
    } else {
      gameState = GAME_STATE_PLAY;
      var levWid = images[levNames[0]].width;
      levNow = Math.floor(mouseX / levWid);
      if (levNow >= levNames.length) {
        return;
      }
      currentLevelImageName = levNames[levNow];
    }
  }
}

function createDepthSpawnReference() {
  depthSpawnCanvas = document.createElement("canvas");
  depthSpawnContext = depthSpawnCanvas.getContext("2d");
  let img = [];
  console.log("LevNow: ", levNow);
  switch (levNow) {
    case LEVEL_ISLAND:
      img = images["depth map"];
      curDepthMap = "depth map";
      break;
    case LEVEL_SPACE:
      img = images["depth map"];
      curDepthMap = "depth map";
      break;
    case LEVEL_MOON:
      img = images["depth moon"];
      curDepthMap = "depth moon";
      break;
  }
  depthSpawnCanvas.width = img.width;
  depthSpawnCanvas.height = img.height;
  depthSpawnContext.drawImage(img, 0, 0);
  try {
    depthSpawnData = depthSpawnContext.getImageData(
      0,
      0,
      img.width,
      img.height
    );
  } catch (e) {
    console.log(
      "unable to create depthSpawnData due to missing webserver. Ingoring."
    );
  }
}

function animateSprites() {
  if (gameState != GAME_STATE_PLAY) {
    return;
  }

  for (var i = 0; i < animateEachLists.length; i++) {
    animateList(animateEachLists[i]);
  }

  // share common animation frame, so no list call:
  animateShots();
  animateEnemyShots();
  animateSplodes();
}

function reset() {
  try{
    gameMusic.sound.stop();
  } catch(e){
    console.log(`${e}`)
  }
  try{
    gameMusic = playSound(sounds.Island_Song, 1, 0, 0.5, true);
  } catch(e){
    console.log(`${e}`)
  }

  startLevel(levSeq[levNow]);
  
  if (twoPlayerGame) {
    playerList = [new playerClass(), new playerClass()];
  } else {
    playerList = [new playerClass()];
  }
  assignKeyMapping();

  for (var i = 0; i < playerList.length; i++) {
    playerList[i].reset();
  }
  levelProgressInPixels = 0;

  for (var i = 0; i < drawMoveList.length; i++) {
    drawMoveList[i].length = 0;
  }

  if (levNow == LEVEL_ISLAND) {
    spawnSurfaceEnemies();
  }
  rippleReset();

  // repacking this list since reset above emplied
  drawMoveList = [
    surfaceList,
    powerupList,
    shotGroundList,
    enemyList,
    enemyShotList,
    shotList,
    playerList,
    splodeList,
  ];

  // excludes lists which share a common animation frame to be in sync (ex. all shots show same animation frame at same time)
  animateEachLists = [playerList, enemyList, powerupList, surfaceList];

}

function drawBackground() {
  bgDrawY =
    images[currentLevelImageName].height - GAME_H - levelProgressInPixels;
  if (bgDrawY < 0) {
    bgDrawY = 0;
  }
  context.drawImage(
    images[currentLevelImageName],
    0,
    bgDrawY,
    GAME_W,
    GAME_H,
    0,
    0,
    GAME_W,
    GAME_H
  );
  switch (levNow) {
    case LEVEL_ISLAND:
      fxContext.drawImage(
        images["depth map"],
        0,
        bgDrawY,
        GAME_W,
        GAME_H,
        0,
        0,
        GAME_W,
        GAME_H
      );
      break;
    case LEVEL_MOON:
      fxContext.drawImage(
        images["depth moon"],
        0,
        bgDrawY,
        GAME_W,
        GAME_H,
        0,
        0,
        GAME_W,
        GAME_H
      );
      break;
  }

  // note: these functions require the game to run on a web server
  // due to local file browser security - they will fail on file://
  // unless you change default browser security settings
  try {
    texture = context.getImageData(0, 0, GAME_W, GAME_H);
    ripple = context.getImageData(0, 0, GAME_W, GAME_H);
    depthTexture = fxContext.getImageData(0, 0, GAME_W, GAME_H);
  } catch (e) {
    if (!window.complained) {
      console.log("No webserver found: ripple/depth effects disabled.");
      window.complained = true;
    }
  }
}

function drawRippleEffect() {
  if (!ripple) return;

  rippleNewFrame();

  context.putImageData(ripple, 0, 0);
  // context.drawImage(canvas, -PARALLAX_OFFSET_X*W_RATIO,
  // 						  -PARALLAX_OFFSET_Y*H_RATIO,
  // 						   GAME_W + (PARALLAX_OFFSET_X*2*W_RATIO >> 0),
  // 						   GAME_H + (PARALLAX_OFFSET_Y*2*H_RATIO) >> 0);
}

function stretchLowResCanvasToVisibleCanvas() {
  scaledCtx.drawImage(
    canvas,
    0,
    0,
    canvas.width,
    canvas.height,
    0,
    0,
    scaledCanvas.width,
    scaledCanvas.height
  );
}

function update() {
  if (readyToReset) {
    reset();
    readyToReset = false;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  switch (gameState) {
    case GAME_STATE_TITLE:
      titleScreen.draw();
      break;

    case GAME_STATE_LEVEL_SELECT:
      levelSelectScreen.draw();
      console.log("Help me!");
      break;

    case GAME_STATE_CONTROLS:
      controlsMenu.draw();
      break;

    case GAME_STATE_PLAY:
      
      levelProgressInPixels += levelProgressRate;
      levelProgressPerc =
        levelProgressInPixels / images[currentLevelImageName].height;
      if (levelProgressPerc > 1.0) {
        levelProgressPerc = 1.0;
        bossFight = true;
      } else {
        bossFight = false;
      }
      spawnEnemyUpdate();

      if (twoPlayerGame && p2AI) {
        playerList[1].doAI();
      }

      for (var i = 0; i < drawMoveList.length; i++) {
        moveList(drawMoveList[i]);
      }

      listCollideExplode(
        shotList,
        enemyList,
        (SHOT_COLLISION_DIM + ENEMY_STALLCHASE_DIM) / 2,
        function (at, to) {
          if (Math.random() < SKY_POWERUP_DROP_PERCENT) {
            powerupList.push(new powerupClass(at.x, to.y));
          }
        }
      );

      for (var i = 0; i < playerList.length; i++) {
        listCollideExplode(
          enemyList,
          playerList[i].defenseRingUnitList,
          (DEFENSE_RING_ORB_DIM + ENEMY_DIM) / 2
        );
        listCollideExplode(
          enemyShotList,
          playerList[i].defenseRingUnitList,
          (ENEMY_SHOT_DIM + DEFENSE_RING_ORB_DIM) / 2
        );
      }
      listCollideExplode(
        playerList,
        enemyList,
        (ENEMY_DIM + PLAYER_DIM) / 2,
        function (elementA, elementB) {
          elementA.reset();
        }
      );
      listCollideExplode(
        playerList,
        enemyShotList,
        (SHOT_DIM + PLAYER_DIM) / 2,
        function (elementA, elementB) {
          elementA.reset();
        }
      );
      listCollideExplode(
        playerList,
        powerupList,
        (POWERUP_H + PLAYER_DIM) / 2,
        function (elementA, elementB) {
          elementB.doEffect(elementA);
        }
      );

      drawBackground();
      drawRippleEffect();
      for (var i = 0; i < drawMoveList.length; i++) {
        drawList(drawMoveList[i]);
      }

      if (bossFight) {
        octopusBoss.draw();
      }
      break;
    case GAME_STATE_LEVEL_DEBUG:
      drawBackground();
      drawLevelSpawnData();
      break;
  }

  // necessary to see what's on the low res canvas
  stretchLowResCanvasToVisibleCanvas();

  // debug text after stretch, mainly for sharpness, proportion, readability
  if (gameState == GAME_STATE_PLAY && debuggingDisplay) {
    gameDebugSharpText();
  }
  if (gameState == GAME_STATE_LEVEL_DEBUG) {
    editorText();
  }
}

function editorText() {
  var debugLineY = 20;
  var debugLineSkip = 10;
  var padding = 5;

  var editorLines = [
"Editor keys:",
"L: exit editor to play mode",
"O: output level to console",
"mouse: highlight segment",
"up/down: scroll level view",
"left/right: move highlighted segment",
"WASD: adjust drift or (not yet supported) time",
"Q/E: frequency up/down",
"1-3: enemy type for segment",
  ];

  scaledCtx.fillStyle = "#00000099";
  scaledCtx.fillRect(
    20 - padding,
    debugLineY - padding,
    250 + padding * 2,
    debugLineSkip * editorLines.length + padding * 2
  );

  scaledCtx.fillStyle = "white";
  scaledCtx.font = "10px Helvetica";
  for(var i=0;i<editorLines.length;i++) {
    scaledCtx.fillText(editorLines[i], 20, (debugLineY += debugLineSkip));
  }
}

function gameDebugSharpText() {
  var debugLineY = 20;
  var debugLineSkip = 10;
  var padding = 5;

  // Transparent background for debug text
  scaledCtx.fillStyle = "#00000099";
  scaledCtx.fillRect(
    20 - padding, // reposition the box further left to make room for padding
    debugLineY - padding, // reposition the box further up to make room for padding
    130 + padding * 2, // roughly the width of the longest string plus padding on both sides
    debugLineSkip * 8 + padding * 2 // the height of all 8 lines of text plus padding on top and bottom
  );

  scaledCtx.fillStyle = "white";
  scaledCtx.font = "10px Helvetica";
  // debugging list isn't growing, removed when expected etc.
  scaledCtx.fillText("DEBUG/TEMPORARY TEXT", 20, (debugLineY += debugLineSkip));
  scaledCtx.fillText("check H for help", 20, (debugLineY += debugLineSkip));
  scaledCtx.fillText("1-4,7-0: cheats", 20, (debugLineY += debugLineSkip));
  scaledCtx.fillText(
    "Score :" + playerScore,
    20,
    (debugLineY += debugLineSkip)
  );
  scaledCtx.fillText(
    "LEVEL STEP: " + spawnSeqStep,
    20,
    (debugLineY += debugLineSkip)
  );
  scaledCtx.fillText(
    "STEP PERC: " + Math.floor(stepPerc * 100) + "%",
    20,
    (debugLineY += debugLineSkip)
  );

  var percProgress = Math.floor(
    (100 * levelProgressInPixels) /
    (images[currentLevelImageName].height - GAME_H)
  );
  if (percProgress > 100) {
    percProgress = 100;
  }
  scaledCtx.fillText(
    "Level progress: " + percProgress + "%",
    20,
    (debugLineY += debugLineSkip)
  );

  scaledCtx.font = "15px Helvetica";
  scaledCtx.fillText(
    "H for help",
    scaledCanvas.width - 90,
    scaledCanvas.height - 20
  );
}
