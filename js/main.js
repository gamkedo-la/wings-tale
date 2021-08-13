var gameDevelopmentMode = true; //skip intro stuff

var nDefenseOrbs = 33;
var debuggingDisplay = true;
var debugDraw_surfacePaths = true;

let twoPlayerGame = false;
let p2AI = true;

var playerList = [new playerClass(), new playerClass()];
var readyToReset = false; // to avoid calling reset() mid list iterations
var octopusBoss = new octopusClass();
var alienshipBoss = new alienshipClass();

var gamepads = new GamepadManager();

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

const LEVEL_RECTS = [{ x: 0, y: 0, width: 0, height: 0 }]; // Array of rectangles representing the levels in the level select menu

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
  initializeLevelSelectScreen();

  if (cheatKeepPowerupsOnDeath) {
    console.log("The cheat/debug feature KeepPowerupsOnDeath is on!");
  }

  if (debug_showHiddenCanvas) {
    document.body.appendChild(canvas); // to debug hidden canvas
  }

  loadImages();

  inputSetup();

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
  }
  // scaledCtx.fillStyle = "black";
  // scaledCtx.fillRect(0,0,scaledCanvas.width,scaledCanvas.height);
};

function loadingDoneSoStartGame() {
  imagesLoaded = true;
  createEditorSpawnKindPatterns();

  if (gameDevelopmentMode) {
    levelSelectScreen.draw();
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

    startDisplayIntervals();
    initializeTitleScreen();
    initializeControlsMenu();

    scaledCanvas.style.cursor = "initial";

    if (!gameDevelopmentMode) {
      gameState = GAME_STATE_TITLE;
    } else {
      if(levelSelectScreen.mouseOverLevel != -1) {
        levelSelectScreen.startHightlightedLevel();
      } else {
        return;
      }
    }

    reset();
  }
}

function createDepthSpawnReference() {
  depthSpawnCanvas = document.createElement("canvas");
  depthSpawnContext = depthSpawnCanvas.getContext("2d");
  let img = [];
  switch (levNow) {
    case LEVEL_ISLAND:
      curDepthMap = "depth map";
      break;
    case LEVEL_SPACE:
      curDepthMap = "depth space";
      break;
    case LEVEL_MOON:
      curDepthMap = "depth moon";
      break;
    case LEVEL_LAVA:
      curDepthMap = "depth lava";
      break;
  }
  img = images[curDepthMap];
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
  // console.log("reached reset "+levNow);
  try {
    if (gameMusic && gameMusic.sound) { // can be null
      gameMusic.sound.stop();
    }
  } catch (e) {
    console.log(`${e}`);
  }
  try {
    if(levNow==LEVEL_ISLAND) {
       gameMusic = playSound(sounds.Island_Song, 1, 0, 0.5, true);
    }
    else if (levNow==LEVEL_SPACE) {
      gameMusic = playSound(sounds.Space_Song, 1, 0, 0.5, true);
    }
    else if (levNow==LEVEL_MOON) {
      gameMusic = playSound(sounds.Moon_Song, 1, 0, 0.5, true); 
    } else if (levNow==LEVEL_LAVA) {
      gameMusic = playSound(sounds.Moon_Song, 1, 0, 0.5, true);  // no separate song yet, reusing moon
    }

  } catch (e) {
    console.log(`${e}`);
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

  /*surfaceList = []; // now part of startLevel function since part of map data
  if (levNow == LEVEL_ISLAND) {
    spawnSurfaceEnemies();
  }*/
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
   fxContext.drawImage(
    images[curDepthMap],
    0,
    bgDrawY,
    GAME_W,
    GAME_H,
    0,
    0,
    GAME_W,
    GAME_H
  );

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
  gamepads.update();

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
          
          //console.log("shot hit!");
          if (at.ownedByPlayer) {
              at.ownedByPlayer.combo.add();
              // note: if the global playerScore gets refactored into
              // a property of the player class (to allow >1 player)
              // then this is a good place to increase the score
              // example: at.ownedByPlayer.score += 10;
              playerScore += 10; // FIXME - each enemy could have to.scoreEarned
          }

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
        if (levNow==LEVEL_ISLAND) {
        octopusBoss.draw();
        }
        else if (levNow==LEVEL_SPACE) {
        alienshipBoss.draw();
        }
        else if (levNow==LEVEL_MOON) {   // This code is for spawning moon stage boss, currently spawns alien ship
        alienshipBoss.draw();
        }
      }
      break;
    case GAME_STATE_LEVEL_DEBUG:
      editorDraw();
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

function gameDebugSharpText() {
  var debugLineY = 56;
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
