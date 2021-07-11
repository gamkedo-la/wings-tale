var mouseX = -1,
  mouseY = -1;
var unscaledMouseX = -1,
  unscaledMouseY = -1;

const KEY_ENTER = 13;
const KEY_SPACE = 32;
const KEY_MINUS = 189;
const KEY_EQUALS = 187;

const KEY_A = 65;
const KEY_C = 67;
const KEY_D = 68;
const KEY_E = 69;
const KEY_H = 72;
const KEY_L = 76;
const KEY_M = 77;
const KEY_N = 78;
const KEY_O = 79;
const KEY_Q = 81;
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
  this.cheatKeyReset;
  this.cheatKeyNoDamage;
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
  inputList[0].cheatKeyNoDamage = KEY_6;

  inputList[1].bombKey = KEY_X;
  inputList[1].fireKey = KEY_Z;
  inputList[1].leftKey = KEY_A;
  inputList[1].upKey = KEY_W;
  inputList[1].downKey = KEY_S;
  inputList[1].rightKey = KEY_D;
  inputList[1].cheatKeyNoDamage = KEY_6;
  inputList[1].cheatKeyShots = KEY_7;
  inputList[1].cheatKeyBomb = KEY_8;
  inputList[1].cheatKeyGhost = KEY_9;
  inputList[1].cheatKeyReset = KEY_0;
}

function keyPush(evt) {
  keyHoldUpdate(evt, true);
}
function keyRelease(evt) {
  keyHoldUpdate(evt, false);
}
function inputSetup() {
  document.addEventListener("keydown", keyPush);
  document.addEventListener("keyup", keyRelease);
  document.addEventListener("mousemove", mousemoved);
}

function keyHoldUpdate(evt, setTo) {
  var validGameKey = false;

  if (gameState == GAME_STATE_LEVEL_DEBUG) {
    if(setTo) { // no key holding on editor mode, just for simpler code & discrete input
      return false;
    }
    if (evt.keyCode == KEY_DOWN) {
      levelProgressInPixels -= GAME_H * 0.3;
      if (levelProgressInPixels < 0) {
        levelProgressInPixels = 0;
      }
      validGameKey = true;
    } else if (evt.keyCode == KEY_UP) {
      levelProgressInPixels += GAME_H * 0.3;
      if (levelProgressInPixels > images[currentLevelImageName].height - 1) {
        levelProgressInPixels = images[currentLevelImageName].height - 1;
      }
      validGameKey = true;
    }

    if(mouseOverLevData!=-1) {
      var scootXBy = 0.05;
      var durationChange = 0.01;
      var findValidNearestI = 0;
      validGameKey = true;
      switch (evt.keyCode) {
        case KEY_1:
          levData[mouseOverLevData].kind = ENEMY_BUG;
          break;
        case KEY_2:
          levData[mouseOverLevData].kind = ENEMY_SWOOP;
          break;
        case KEY_3:
          levData[mouseOverLevData].kind = ENEMY_STALL_CHASE;
          break;
        case KEY_LEFT:
          levData[mouseOverLevData].percXMin -= scootXBy;
          levData[mouseOverLevData].percXMax -= scootXBy;
          break;
        case KEY_RIGHT:
          levData[mouseOverLevData].percXMin += scootXBy;
          levData[mouseOverLevData].percXMax += scootXBy;
          break;
        case KEY_MINUS:
          levData.splice(mouseOverLevData,1);
          updateSpawnPercRanges();
          break;
        case KEY_EQUALS:
          levData.splice(mouseOverLevData,0, JSON.parse(JSON.stringify(editorAddLevelRowWithNext)));
          updateSpawnPercRanges();
          break;
        case KEY_0:
          levData.splice(mouseOverLevData,0, JSON.parse(JSON.stringify(editorAddLevelRowNew)));
          updateSpawnPercRanges();
          break;
        case KEY_W:
          findValidNearestI = mouseOverLevData;
          while(findValidNearestI < levData.length && levData[findValidNearestI].percDuration == SPAWN_WITH_NEXT) {
            findValidNearestI++;
          }
          if(findValidNearestI < levData.length) {
            levData[findValidNearestI].percDuration += durationChange;
            updateSpawnPercRanges();
          }
          break;
        case KEY_S:
          findValidNearestI = mouseOverLevData;
          while(findValidNearestI < levData.length && levData[findValidNearestI].percDuration == SPAWN_WITH_NEXT) {
            findValidNearestI++;
          }
          if(findValidNearestI < levData.length) {
            levData[findValidNearestI].percDuration -= durationChange;
            if(levData[findValidNearestI].percDuration<0.01) {
              levData[findValidNearestI].percDuration = 0.01;
            }
            updateSpawnPercRanges();
          }
          break;
        case KEY_A:
          levData[mouseOverLevData].driftX -= scootXBy;
          break;
        case KEY_D:
          levData[mouseOverLevData].driftX += scootXBy;
          break;
        case KEY_Q:
          levData[mouseOverLevData].ticksBetween -= 1;
          if(levData[mouseOverLevData].ticksBetween<0) {
            levData[mouseOverLevData].ticksBetween=0;
          }
          break;
        case KEY_E:
          levData[mouseOverLevData].ticksBetween += 1;
          break;
        case KEY_L:
          gameState = GAME_STATE_PLAY;
          readyToReset = true;
          break;
        default:
          validGameKey = false;
          break;
      }
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
      case KEY_O:
        if (!setTo) {
          printLevelSeq();
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
      case KEY_PLUS:
        if (!setTo) {
          levelProgressInPixels += images[currentLevelImageName].height / 10;
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
    }
  } else if (evt.keyCode == inputList[keyFrom].cheatKeyBomb) {
    if (setTo == false) {
      // key relase only
      playerList[whichPlayer].bombCount++;
    }
  } else if (evt.keyCode == inputList[keyFrom].cheatKeyGhost) {
    if (setTo == false) {
      // key relase only
      playerList[whichPlayer].ghostCount++;
    }
  } else if (evt.keyCode == inputList[keyFrom].cheatKeyNoDamage) {
    if (setTo == false) {
      // key relase only
      playerList[whichPlayer].invulnerableBlinkToggle = true;
      playerList[whichPlayer].cheatInvulnerable = true;
    }
  } else if (evt.keyCode == inputList[keyFrom].cheatKeyReset) {
    if (setTo == false) {
      // key relase only
      playerList[whichPlayer].shotsNumber = 1;
      playerList[whichPlayer].bombCount = 1;
      playerList[whichPlayer].ghostCount = 0;
      playerList[whichPlayer].cheatInvulnerable = false;
    }
  } else {
    validGameKey = false;
  }
  return validGameKey;
}

function mousemoved(evt) {
  var rect = scaledCanvas.getBoundingClientRect();
  var root = document.documentElement;

  // account for the margins, canvas position on page, scroll amount, etc.
  unscaledMouseX = evt.clientX - rect.left - root.scrollLeft;
  unscaledMouseY = evt.clientY - rect.top - root.scrollTop;

  mouseX = Math.floor(unscaledMouseX * GAME_W / SCALED_W);
  mouseY = Math.floor(unscaledMouseY * GAME_H / SCALED_H);
}

function handleMouseClick(evt) {
  if(!gameFirstClickedToStart) {
    initSounds();
  }
  setTimeout(function(){
    if (!gameFirstClickedToStart) {
      loadedAndClicked(evt);
    } else if (gameState == GAME_STATE_TITLE) {
      gameState = GAME_STATE_LEVEL_SELECT;
    } else if (gameState == GAME_STATE_LEVEL_SELECT) {
      gameState = GAME_STATE_PLAY;
      var levWid = images[levNames[0]].width;
      levNow = Math.floor(unscaledMouseX / levWid);
      if (levNow >= levNames.length) {
        return;
      }
      currentLevelImageName = levNames[levNow];
    }
  }, 500 )
  
}
