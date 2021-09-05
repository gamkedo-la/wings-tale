var mouseX = -1,
  mouseY = -1;
var unscaledMouseX = -1,
  unscaledMouseY = -1;
var mouseDragging = false;
var mouseNewDragStarted = false; // flips true for single frame of new drag
var dragX = 0,
  dragY = 0;
var cumulativeDrag = 0; // total amount of drag since button down, for click detection

const KEY_ENTER = 13;
const KEY_SPACE = 32;
const KEY_MINUS = 189;

const KEY_A = 65;
const KEY_C = 67;
const KEY_D = 68;
const KEY_E = 69;
const KEY_F = 70;
const KEY_G = 71;
const KEY_H = 72;
const KEY_J = 74;
const KEY_L = 76;
const KEY_M = 77;
const KEY_N = 78;
const KEY_O = 79;
const KEY_P = 80;
const KEY_Q = 81;
const KEY_R = 82;//toggle laser shot powerup cheat
const KEY_S = 83;
const KEY_T = 84;
const KEY_W = 87;
const KEY_X = 88;
const KEY_Z = 90;

// debug keys for now
const KEY_1 = 49;
const KEY_2 = 50;
const KEY_3 = 51;
const KEY_4 = 52;
const KEY_5 = 53;
const KEY_6 = 54;
const KEY_7 = 55;
const KEY_8 = 56;
const KEY_9 = 57;
const KEY_0 = 48;

const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_PLUS = 187;
const KEY_PLUS_FIREFOX = 61;

function inputPlayerClass() {
  // set to keycode by player
  this.bombKey;
  this.fireKey;
  this.leftKey;
  this.upKey;
  this.downKey;
  this.rightKey;
  this.cheatKeyShots;
  this.cheatKeyBomb;
  this.cheatKeyGhost;
  this.cheatKeyLaser;
  this.cheatKeyReset;
  this.cheatKeyNoDamage;
  this.cheatKeyMovement;
  this.cheatKeySpawnBug;
}

var inputList = [new inputPlayerClass(), new inputPlayerClass()];

function assignKeyMapping() {
  inputList[0].bombKey = KEY_M;
  inputList[0].fireKey = KEY_SPACE; // maybe N
  inputList[0].leftKey = KEY_LEFT;
  inputList[0].upKey = KEY_UP;
  inputList[0].downKey = KEY_DOWN;
  inputList[0].rightKey = KEY_RIGHT;
  inputList[0].cheatKeyShots = KEY_1;
  inputList[0].cheatKeyBomb = KEY_2;
  inputList[0].cheatKeyGhost = KEY_3;
  inputList[0].cheatKeyReset = KEY_4;
  inputList[0].cheatKeyLaser = KEY_R;
  inputList[0].cheatKeyMovement = KEY_P;
  inputList[0].cheatKeyNoDamage = KEY_6;
  inputList[0].cheatKeySpawnBug = KEY_J;

  inputList[1].bombKey = KEY_X;
  inputList[1].fireKey = KEY_Z;
  inputList[1].leftKey = KEY_A;
  inputList[1].upKey = KEY_W;
  inputList[1].downKey = KEY_S;
  inputList[1].rightKey = KEY_D;
  inputList[1].cheatKeyMovement = KEY_P;
  inputList[1].cheatKeyNoDamage = KEY_6;
  inputList[1].cheatKeyShots = KEY_7;
  inputList[1].cheatKeyBomb = KEY_8;
  inputList[1].cheatKeyGhost = KEY_9;
  inputList[1].cheatKeyReset = KEY_0;
  inputList[1].cheatKeySpawnBug = KEY_C;
}

function keyPush(evt) {
  keyHoldUpdate(evt, true);
}

function keyRelease(evt) {
  keyHoldUpdate(evt, false);
}

function mouseSetup() {
  document.addEventListener("mousedown", handleMouseClick);
  document.addEventListener("mouseup", handleMouseRelease);
  document.addEventListener("mousemove", mousemoved);
  document.addEventListener("wheel", editorWheel, false);
}

function inputSetup() {
  document.addEventListener("keydown", keyPush);
  document.addEventListener("keyup", keyRelease);
  mouseSetup();
}

function editorWheel(evt) {
  if (gameState != GAME_STATE_LEVEL_DEBUG) {
    return;
  }
  var scaleScrollFactor = 0.35; // deltaY is otherwise pretty aggressive, disorienting
  if (evt.deltaY < 0) {
    levelScrollUp(-evt.deltaY * scaleScrollFactor);
  } else {
    levelScrollDown(evt.deltaY * scaleScrollFactor);
  }
  // evt.preventDefault(); // can't, treated as passive event listener by browser
  return false;
}

function levelScrollDown(scrollByPx) {
  levelProgressInPixels -= scrollByPx;
  if (levelProgressInPixels < 0) {
    levelProgressInPixels = 0;
  }
}

function levelScrollUp(scrollByPx) {
  levelProgressInPixels += scrollByPx;
  if (levelProgressInPixels > images[currentLevelImageName].height - 1) {
    levelProgressInPixels = images[currentLevelImageName].height - 1;
  }
}

function keyHoldUpdate(evt, setTo) {
  var validGameKey = false;

  if (gameState == GAME_STATE_LEVEL_DEBUG) {
    if (setTo) {
      // no key holding on editor mode, just for simpler code & discrete input
      return false;
    }

    if (mouseOverLevData != -1) {
      // active selection?
      validGameKey = editorKeyboard(evt.keyCode);
    }

    return validGameKey; // skip the game keys below
  }

  validGameKey = playerKeyHold(evt, 0, 0, setTo);

  if (validGameKey == false) {
    if (twoPlayerGame && p2AI == false) {
      validGameKey = playerKeyHold(evt, 1, 1, setTo);
    } else {
      // let player 2 keys work for p1
      validGameKey = playerKeyHold(evt, 1, 0, setTo);
    }
  }

  if (validGameKey == false) {
    // not a player 1 or player 2 key? universal key checks here
    validGameKey = true; // assume true until we rule out otherwise
    switch (evt.keyCode) {
      case KEY_5:
        if (!setTo) {
          cheatKeepPowerupsOnDeath = !cheatKeepPowerupsOnDeath;
          console.log("cheatKeepPowerupsOnDeath: " + cheatKeepPowerupsOnDeath);
        }
        break;
      case KEY_T:
        if (!setTo) {
          twoPlayerGame = !twoPlayerGame;
          readyToReset = true;
        }
        break;
      case KEY_L:
        if (!setTo) {
          gameState = GAME_STATE_LEVEL_DEBUG;
          readyToReset = true;
        }
        break;
      case KEY_H:
        if (!setTo) {
          if (gameState == GAME_STATE_PLAY) {
            gameState = GAME_STATE_CONTROLS;
          } else {
            gameState = GAME_STATE_PLAY;
          }
        }
        break;
      case KEY_PLUS: // skip to boss cheat
      case KEY_PLUS_FIREFOX: // skip to boss cheat firefox plus key
        if (!setTo) {
          enemyList.length = 0; // remove other enemies. note: can't use = [];, referenced elsewhere
          enemyShotList.length = 0;
          levelProgressInPixels += images[currentLevelImageName].height;
        }
        break;
      default:
        validGameKey = false;
        break;
      case KEY_ENTER:
        if (!setTo) {
          if (gameState != GAME_STATE_TITLE) {
            return;
          } else {
            gameState = GAME_STATE_PLAY;
          }
        }
    }
  }

  if (validGameKey) {
    evt.preventDefault();
  }
}

// keyFrom is different from whichPlayer for easier time
// getting player 2 keys to work for p1 if not in 2 player mode
function playerKeyHold(evt, keyFrom, whichPlayer, setTo) {
  var validGameKey = true;

  if (evt.keyCode == inputList[keyFrom].bombKey) {
    playerList[whichPlayer].holdBomb = setTo;
  } else if (evt.keyCode == inputList[keyFrom].fireKey) {
    playerList[whichPlayer].holdFire = setTo;
  } else if (evt.keyCode == inputList[keyFrom].leftKey) {
    playerList[whichPlayer].holdLeft = setTo;
  } else if (evt.keyCode == inputList[keyFrom].upKey) {
    playerList[whichPlayer].holdUp = setTo;
  } else if (evt.keyCode == inputList[keyFrom].rightKey) {
    playerList[whichPlayer].holdRight = setTo;
  } else if (evt.keyCode == inputList[keyFrom].downKey) {
    playerList[whichPlayer].holdDown = setTo;
  } else if (evt.keyCode == inputList[keyFrom].cheatKeyShots) {
    if (setTo == false) {
      // key relase only
      playerList[whichPlayer].shotsNumber++;
      console.log("cheatKeyShots: Player " + (whichPlayer + 1) + " shotsNumber: " + playerList[whichPlayer].shotsNumber);
    }
  } else if (evt.keyCode == inputList[keyFrom].cheatKeyBomb) {
    if (setTo == false) {
      // key relase only
      playerList[whichPlayer].bombCount++;
      console.log("cheatKeyBomb: Player " + (whichPlayer + 1) + " bombCount: " + playerList[whichPlayer].bombCount);
    }
  } else if (evt.keyCode == inputList[keyFrom].cheatKeyGhost) {
    if (setTo == false) {
      // key relase only
      playerList[whichPlayer].ghostCount++;
      console.log("cheatKeyGhost: Player " + (whichPlayer + 1) + " ghostCount: " + playerList[whichPlayer].ghostCount);
    }
  } else if (evt.keyCode == inputList[keyFrom].cheatKeyNoDamage) {
    if (setTo == false) {
      // key relase only
      playerList[whichPlayer].invulnerableBlinkToggle = true;
      playerList[whichPlayer].cheatInvulnerable = true;
      console.log("cheatKeyNoDamage: Player " + (whichPlayer + 1) + " cheatInvulnerable: " + playerList[whichPlayer].cheatInvulnerable);
    }
  } else if (evt.keyCode == inputList[keyFrom].cheatKeyMovement) {
    if (setTo == false) {
      // key relase only
      playerList[whichPlayer].speed = 6;
      console.log("cheatKeyMovement: Player " + (whichPlayer + 1) + " speed: " + playerList[whichPlayer].speed);
    }
  } else if (evt.keyCode == inputList[keyFrom].cheatKeyReset) {
    if (setTo == false) {
      // key relase only
      playerList[whichPlayer].shotsNumber = 1;
      playerList[whichPlayer].bombCount = 1;
      playerList[whichPlayer].ghostCount = 0;
      playerList[whichPlayer].cheatInvulnerable = false;
      playerList[whichPlayer].speed = 3;
      console.log("cheatKeyReset!");
    }
  } else if (evt.keyCode == inputList[keyFrom].cheatKeySpawnBug) {
    if (setTo == false) {
      // key relase only
      spawnSpecificEnemyAtRandomPosition(ENEMY_BUG);
    }
    console.log("cheatKeySpawnBug!");
  } else if (evt.keyCode == inputList[keyFrom].cheatKeyLaser) {
    if (setTo == false)
    //key release only
    {
      playerList[whichPlayer].hasLaserPowerUp = !playerList[whichPlayer].hasLaserPowerUp;
      console.log("playerList[whichPlayer].hasLaserPowerUp? " + playerList[whichPlayer].hasLaserPowerUp);
    }
  } 
  else {
    validGameKey = false;
  }
  return validGameKey;
}

function mousemoved(evt) {
  var rect = scaledCanvas.getBoundingClientRect();
  var root = document.documentElement;

  // to calculate delta for drag inputs, initially being done for editor usage
  var wasUMX = unscaledMouseX;
  var wasUMY = unscaledMouseY;

  // account for the margins, canvas position on page, scroll amount, etc.
  unscaledMouseX = evt.clientX - rect.left - root.scrollLeft;
  unscaledMouseY = evt.clientY - rect.top - root.scrollTop;

  if(mouseNewDragStarted) {
    mouseNewDragStarted = false;
  }

  if (mouseDragging) {
    dragX = unscaledMouseX - wasUMX;
    dragY = unscaledMouseY - wasUMY;
    cumulativeDrag += Math.abs(dragX) + Math.abs(dragY);
    editorDrag();
  }
  mouseX = Math.floor((unscaledMouseX * GAME_W) / SCALED_W);
  mouseY = Math.floor((unscaledMouseY * GAME_H) / SCALED_H);

  if(gameState == GAME_STATE_LEVEL_SELECT) {
    handleLevelHover();
  }
}

function handleMouseRelease(evt) {
  mouseDragging = false;
  if (mouseOverEditorButtonIdx == -1 && cumulativeDrag < 5) {
    // clicked to deselect, rather than dragged to change
    dragMode = DRAG_MODE_NONE;
  }
  if (editorClicked && dragMode == DRAG_MODE_NONE) {
    // clicked empty space, not in drag mode, deselect
    mouseOverLevData = -1;
    editorClicked = false;
  }
  dragX = dragY = 0;
  cumulativeDrag = 0;
}

function handleMouseClick(evt) {
  if (!gameFirstClickedToStart) {
    initSounds();
  }
  if (gameState == GAME_STATE_LEVEL_DEBUG) {
    editorHandleClick();
    mouseDragging = true;
    mouseNewDragStarted = true;
    return;
  }
  setTimeout(function () {
    if (!gameFirstClickedToStart) {
      loadedAndClicked(evt);
    } else if (gameState == GAME_STATE_TITLE) {
      gameState = GAME_STATE_LEVEL_SELECT;
    } else if (gameState == GAME_STATE_LEVEL_SELECT) {
      levelSelectScreen.startHightlightedLevel();
    }
  }, 750);
}
