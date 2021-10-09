var gameDevelopmentMode = true; //skip intro stuff

var debugDraw_colliders = false;

var nDefenseOrbs = 4; //33;
var debuggingDisplay = true;
var debugDraw_surfacePaths = true;

let twoPlayerGame = false;
let p2AI = true;

var playerList = [new playerClass(), new playerClass()];
var readyToReset = false; // to avoid calling reset() mid list iterations

var bossList = [];

var gamepads = new GamepadManager();

var playerScore = 0; // Player Score, Getting powerups adds to it.

// Starts at - 2 due to the increment function running twice at the start of a level.
var deathCount = -2; // Number of times player has "died" during a level.

var drawMoveList = []; // list of lists - note, drawn in this order, so should be filled closest to ground up towards sky last
var animateEachLists = []; // subset of draw/move lists for which each object has its own separate animation frame to update

var cheatKeepPowerupsOnDeath = false;

const GAME_STATE_PLAY = 0;
const GAME_STATE_CONTROLS = 1;
const GAME_STATE_TITLE = 2;
const GAME_STATE_LEVEL_SELECT = 3;
const GAME_STATE_LOADING_SPLASH = 4;
const GAME_STATE_LEVEL_DEBUG = 5;
const GAME_STATE_LEVEL_TRANSITION = 6;
const GAME_STATE_ENDING = 7;

const HIT_FLASH_FRAMECOUNT = 2; // enemy/boss flash after takeDamage

const LEVEL_RECTS = [{ x: 0, y: 0, width: 0, height: 0 }]; // Array of rectangles representing the levels in the level select menu

const LEVEL_TRANSITION_IN_MILLISECONDS = 5000;

var gameState;
if (!gameDevelopmentMode) {
  gameState = GAME_STATE_LOADING_SPLASH;
} else {
  gameState = GAME_STATE_LEVEL_SELECT;
}

var gameMusic = {};

var gameFirstClickedToStart = false;
var imagesLoaded = false;
var goingToNextLevel = false;

var curDepthMap = "depth island";

window.onload = function () {
  SetupPowerupDropOdds();
  setupCanvas();
  initializeLevelSelectScreen();
  initializeEndScreen();

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
      if (levelSelectScreen.mouseOverLevel != -1) {
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
      curDepthMap = "depth island";
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
    if (gameMusic && gameMusic.sound) {
      // can be null
      gameMusic.sound.stop();
    }
  } catch (e) {
    console.log(`${e}`);
  }
  try {
    if (levNow == LEVEL_ISLAND) {
      gameMusic = playSound(sounds.Island_Song, 1, 0, 0.5, true);
    } else if (levNow == LEVEL_SPACE) {
      gameMusic = playSound(sounds.Space_Song, 1, 0, 0.5, true);
    } else if (levNow == LEVEL_MOON) {
      gameMusic = playSound(sounds.Moon_Song, 1, 0, 0.5, true);
    } else if (levNow == LEVEL_LAVA) {
      gameMusic = playSound(sounds.Lava_Song, 1, 0, 0.5, true);
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
  enemySpawnTickCount = 0;
  sameTimeSpawnSteps.length = 0;
  sameTimeSpawnTicks.length = 0;

  // repacking this list since reset above emplied
  drawMoveList = [
    surfaceList,
    bossList,
    powerupList,
    shotGroundList,
    enemyList,
    shotList,
    enemyShotList,
    splodeList,
    playerList,
  ];

  // excludes lists which share a common animation frame to be in sync (ex. all shots show same animation frame at same time)
  animateEachLists = [
    playerList,
    enemyList,
    powerupList,
    surfaceList,
    bossList,
  ];
}

const LEVEL_BG_FRAMES = 4;
const BG_FRAME_TICK_DELAY = 10; // how many game logic ticks pass before background animation advances
var bgFrameDir = 1; // ping pongs back and forth, to ensure a loop and use half the frame data
var bgFrame = 0;
var ticksPerBGFrame = BG_FRAME_TICK_DELAY;

function drawBackground() {
  bgDrawY =
    images[currentLevelImageName].height - GAME_H - levelProgressInPixels;
  if (bgDrawY < 0) {
    bgDrawY = 0;
  }

  // currently only used by Lava and space stage, could also use for waves,moon... dust sparkle?
  if (levNow == LEVEL_LAVA || levNow == LEVEL_SPACE) {
    ticksPerBGFrame--;
    if (ticksPerBGFrame < 0) {
      bgFrame += bgFrameDir;
      ticksPerBGFrame = BG_FRAME_TICK_DELAY;

      if (bgFrame >= LEVEL_BG_FRAMES) {
        bgFrameDir = -1;
        bgFrame += bgFrameDir; // corrects for going too far, will spend two frames at end
      }
      if (bgFrame < 0) {
        bgFrameDir = 1;
        bgFrame += bgFrameDir; // corrects for going too far, will spend two frames at start
      }
    }
  } else {
    bgFrame = 0;
  }
  context.drawImage(
    images[currentLevelImageName],
    bgFrame * GAME_W,
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
      if (levelProgressPerc > 1.0) {
        levelProgressPerc = 1.0;

        if (
          bossList.length == 0 &&
          surfaceList.length === 0 &&
          enemyList.length === 0
        ) {
          var stageBoss;
          switch (levNow) {
            case LEVEL_ISLAND:
              stageBoss = new bossOctopusClass();
              break;
            case LEVEL_SPACE:
              stageBoss = new bossAlienshipClass();
              break;
            case LEVEL_MOON:
              stageBoss = new bossMegaFrogClass();
              break;
            case LEVEL_LAVA:
              stageBoss = new bossLavaDragonClass();
              break;
          }
          stageBoss.reset();
          bossList.push(stageBoss);
        }
      } else {
        levelProgressInPixels += levelProgressRate;
      }

      levelProgressPerc =
        levelProgressInPixels / images[currentLevelImageName].height;

      spawnEnemyUpdate();

      if (twoPlayerGame && p2AI) {
        playerList[1].doAI();
      }

      for (var i = 0; i < drawMoveList.length; i++) {
        moveList(drawMoveList[i]);
      }

      listCollideExplode(shotList, enemyList, function (at, to) {
        //console.log("shot hit!");
        if (at.ownedByPlayer) {
          at.ownedByPlayer.combo.add();
          // note: if the global playerScore gets refactored into
          // a property of the player class (to allow >1 player)
          // then this is a good place to increase the score
          // example: at.ownedByPlayer.score += 10;
          playerScore += 10; // FIXME - each enemy could have to.scoreEarned
        }

        // optionally flash just like bosses
        to.hitFlashFrames = HIT_FLASH_FRAMECOUNT;

        if (Math.random() < SKY_POWERUP_DROP_PERCENT) {
          spawnNewPowerup(at.x, to.y, [2, 3]);
        }
      });

      for (var i = 0; i < playerList.length; i++) {
        listCollideExplode(enemyList, playerList[i].defenseRingUnitList);
        listCollideExplode(enemyShotList, playerList[i].defenseRingUnitList);
      }
      listCollideExplode(playerList, enemyList, function (elementA, elementB) {
        elementA.reset();
      });
      listCollideExplode(
        playerList,
        enemyShotList,
        function (elementA, elementB) {
          elementA.reset();
        }
      );
      listCollideExplode(
        playerList,
        powerupList,
        function (elementA, elementB) {
          elementB.doEffect(elementA);
        }
      );

      listCollideExplode_Sublist(
        shotList,
        bossList,
        function (elementA, elementB) {
          elementB.takeDamage();
        }
      );

      drawBackground();
      drawRippleEffect();
      for (var i = 0; i < drawMoveList.length; i++) {
        drawList(drawMoveList[i]);
      }

      if (bossList[0]?.health <= 0) {
        bossList.splice(0, 1);
        levelProgressInPixels = 0;
        levelProgressPerc = 0.0;
        levNow++;
        currentLevelImageName = levNames[levNow];
        playerScore += 1000;
        reset();

        if (levNow == LEVEL_LAVA + 1) {
          playerScore += 1000;
          gameState = GAME_STATE_ENDING;
        } else {
          gameState = GAME_STATE_LEVEL_TRANSITION;
        }
      }

      break;
    case GAME_STATE_LEVEL_DEBUG:
      editorDraw();
      break;
    case GAME_STATE_LEVEL_TRANSITION:
      if (!goingToNextLevel) {
        drawLevelCompleteScreen(levNow);
      } else {
        drawLevelTransitionScreen(levNow);
      }

      // If the player is at the last level, switch back to the level select menu
      if (levNow > LEVEL_LAVA) {
        gameState = GAME_STATE_LEVEL_SELECT;
      }
      // Otherwise, transition to the next level
      else {
        setTimeout(function () {
          goingToNextLevel = true;
        }, LEVEL_TRANSITION_IN_MILLISECONDS / 2);

        setTimeout(function () {
          startLevel(levSeq[levNow]);
          gameState = GAME_STATE_PLAY;
          goingToNextLevel = false;
        }, LEVEL_TRANSITION_IN_MILLISECONDS);
      }
      break;
    case GAME_STATE_ENDING:
      endScreen.draw();
      break;
  }

  // necessary to see what's on the low res canvas
  stretchLowResCanvasToVisibleCanvas();

  // debug text after stretch, mainly for sharpness, proportion, readability
  // if (gameState == GAME_STATE_PLAY && debuggingDisplay) {
  //   gameDebugSharpText();
  // }
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
