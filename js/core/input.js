var mouseX=-1, mouseY=-1;

const KEY_ENTER = 13;
const KEY_SPACE = 32;

const KEY_A = 65;
const KEY_C = 67;
const KEY_D = 68;
const KEY_M = 77;
const KEY_N = 78;
const KEY_S = 83;
const KEY_W = 87;
const KEY_X = 88;
const KEY_Z = 90;

const KEY_T = 84;

const KEY_H = 72;

// debug keys for now
const KEY_1 = 49;
const KEY_2 = 50;
const KEY_3 = 51;
const KEY_4 = 52;
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
}

var inputList = [new inputPlayerClass(),new inputPlayerClass()];

function assignKeyMapping() {
	inputList[0].bombKey = KEY_M;
	inputList[0].fireKey = KEY_SPACE; // maybe N
	inputList[0].leftKey = KEY_LEFT;
	inputList[0].upKey = KEY_UP;
	inputList[0].downKey = KEY_DOWN;
	inputList[0].rightKey = KEY_RIGHT;
	inputList[0].cheatKeyShots=KEY_1;
	inputList[0].cheatKeyBomb=KEY_2;
	inputList[0].cheatKeyGhost=KEY_3;
	inputList[0].cheatKeyReset=KEY_4;

	inputList[1].bombKey = KEY_X;
	inputList[1].fireKey = KEY_Z;
	inputList[1].leftKey = KEY_A;
	inputList[1].upKey = KEY_W;
	inputList[1].downKey = KEY_S;
	inputList[1].rightKey = KEY_D;
	inputList[1].cheatKeyShots=KEY_7;
	inputList[1].cheatKeyBomb=KEY_8;
	inputList[1].cheatKeyGhost=KEY_9;
	inputList[1].cheatKeyReset=KEY_0;
}

function keyPush(evt) {
	keyHoldUpdate(evt,true);
}
function keyRelease(evt) {
	keyHoldUpdate(evt,false);

}
function inputSetup() {
	document.addEventListener('keydown',keyPush);	
	document.addEventListener('keyup', keyRelease);	
	document.addEventListener("mousemove", mousemoved);
}

function keyHoldUpdate(evt, setTo) {
	var validGameKey = false;
	
	validGameKey = playerKeyHold(evt, 0,0, setTo);

	if (validGameKey == false) {
		if(twoPlayerGame && p2AI==false) {
			validGameKey = playerKeyHold(evt, 1,1, setTo);
		} else { // let player 2 keys work for p1
			validGameKey = playerKeyHold(evt, 1,0, setTo);
		}
	}

	if(validGameKey == false) { // not a player 1 or player 2 key? universal key checks here
		validGameKey = true; // assume true until we rule out otherwise
		switch(evt.keyCode) {
			case KEY_T:
				if (!setTo) {
					twoPlayerGame = !twoPlayerGame;
					readyToReset = true;
				}
				break;
			case KEY_H:
				if (!setTo) {
					if(gameState == GAME_STATE_PLAY) {
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
				if (!setTo)
				{
					if (gameState != GAME_STATE_TITLE)
					{
						return;
					}
					else
					{
						gameState = GAME_STATE_PLAY;
					}
				}
		}
	}

	if(validGameKey) {
		evt.preventDefault();
	}
}

// keyFrom is different from whichPlayer for easier time
// getting player 2 keys to work for p1 if not in 2 player mode 
function playerKeyHold (evt, keyFrom, whichPlayer, setTo) {
	var validGameKey = true;
	
	if(evt.keyCode == inputList[keyFrom].bombKey) {
		playerList[whichPlayer].holdBomb = setTo;
	} else if(evt.keyCode == inputList[keyFrom].fireKey) {
		playerList[whichPlayer].holdFire = setTo;
	} else if(evt.keyCode == inputList[keyFrom].leftKey) {
		playerList[whichPlayer].holdLeft = setTo;
	} else if(evt.keyCode == inputList[keyFrom].upKey) {
		playerList[whichPlayer].holdUp = setTo;
	} else if(evt.keyCode == inputList[keyFrom].rightKey) {
		playerList[whichPlayer].holdRight = setTo;
	} else if(evt.keyCode == inputList[keyFrom].downKey) {
		playerList[whichPlayer].holdDown = setTo;
	} else if(evt.keyCode == inputList[keyFrom].cheatKeyShots) {
		if(setTo == false) { // key relase only
			playerList[whichPlayer].shotsNumber++;
		}
	} else if(evt.keyCode == inputList[keyFrom].cheatKeyBomb) {
		if(setTo == false) { // key relase only
			playerList[whichPlayer].bombCount++;
		}
	} else if(evt.keyCode == inputList[keyFrom].cheatKeyGhost) {
		if(setTo == false) { // key relase only
			playerList[whichPlayer].ghostCount++;
		}
	} else if(evt.keyCode == inputList[keyFrom].cheatKeyReset) {
		if(setTo == false) { // key relase only
			playerList[whichPlayer].shotsNumber = 1;
			playerList[whichPlayer].bombCount = 1;
			playerList[whichPlayer].ghostCount = 0;
		}
	} else {
		validGameKey = false;
	}
	return validGameKey
}

function mousemoved(evt) {
	var rect = scaledCanvas.getBoundingClientRect();
	var root = document.documentElement;
  
	// account for the margins, canvas position on page, scroll amount, etc.
	mouseX = evt.clientX - rect.left - root.scrollLeft;
	mouseY = evt.clientY - rect.top - root.scrollTop;  
  }

function handleMouseClick(evt)
{
	if (!gameFirstClickedToStart)
	{
		loadedAndClicked(evt);
	}
	else if (gameState == GAME_STATE_TITLE)
	{
		gameState = GAME_STATE_LEVEL_SELECT;
	}
	else if (gameState == GAME_STATE_LEVEL_SELECT)
	{
		gameState = GAME_STATE_PLAY;
	}
}