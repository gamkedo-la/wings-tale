const KEY_SPACE = 32;

const KEY_A = 65;
const KEY_C = 67;
var cKeyFired = false;
const KEY_D = 68;
const KEY_M = 77;
const KEY_N = 78;
const KEY_S = 83;
const KEY_W = 87;
const KEY_X = 88;
const KEY_Z = 90;

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

let twoPlayerGame = false;

function keyPush(evt) {

			
	if (evt.keyCode === KEY_C)
	{
		if (!cKeyFired)
			{
				if (controlsMenuIsOn)
				{
					controlsMenuIsOn = false;
					playingGame = true;
					cKeyFired = false;
				}
				else if (!controlsMenuIsOn)
				{
					
					controlsMenuIsOn = true;
					playingGame = false;
					cKeyFired = false;
				}
			}
		return;
	}

	keyHoldUpdate(evt,true);
}
function keyRelease(evt) {
	switch(evt.keyCode)
	{
		case KEY_C: 
		cKeyFired = false;
		break;
	}
	keyHoldUpdate(evt,false);

}
function inputSetup() {
	document.addEventListener('keydown',keyPush);	
	document.addEventListener('keyup', keyRelease);	
}

function keyHoldUpdate(evt, setTo) {
	if (!twoPlayerGame) {
		singlePlayerKeyHold(evt, setTo)
	} else {
		twoPlayerKeyHold(evt, setTo)
	}
}

function singlePlayerKeyHold (evt, setTo) {
	var validGameKey = true;
	
	switch(evt.keyCode) {
		case KEY_X:
		case KEY_M:
			p1.holdBomb = setTo;
			break;
		case KEY_Z:
		case KEY_SPACE:
		case KEY_N:
			p1.holdFire = setTo;
			break;
		case KEY_LEFT:
		case KEY_A:
			p1.holdLeft = setTo;
			break;
		case KEY_UP:
		case KEY_W:
			p1.holdUp = setTo;
			break;
		case KEY_RIGHT:
		case KEY_D:
			p1.holdRight = setTo;
			break;
		case KEY_DOWN:
		case KEY_S:
			p1.holdDown = setTo;
			break;
		
		case KEY_PLUS:
			if (!setTo) {
				levelProgressInPixels += images[currentLevelImageName].height / 10;
			}
			break;
		case KEY_1:
		case KEY_7:
			if(setTo == false) { // key relase only, to avoid repeats
				p1.shotsNumber++;
				console.log("increasing player shot count");
			}
			break;
		case KEY_2:
		case KEY_8:
			if(setTo == false) {
				p1.bombCount++;
				console.log("increasing player bomb count");
			}
			break;
		case KEY_3:
		case KEY_9:
			if(setTo == false) {
				p1.ghostCount++;
				console.log("increasing player ghost count");
			}
			break;
		case KEY_4:
		case KEY_0:
			if(setTo == false) {
				p1.shotsNumber = 1;
				p1.bombCount = 1;
				p1.ghostCount = 0;
			}
			break;
		default:
			validGameKey = false;
			break;
	}
	if(validGameKey) {
		console.log("actually preventing default?");
		evt.preventDefault();
	}
}

function twoPlayerKeyHold (evt, setTo) {
	var validGameKey = true;
	switch(evt.keyCode) {
		case KEY_A:
			p2.holdLeft = setTo;
			break;
		case KEY_D:
			p2.holdRight = setTo;
			break;
		case KEY_M:
			p1.holdBomb = setTo;
			break;
		case KEY_N:
			p1.holdFire = setTo;
			break;
		case KEY_S:
			p2.holdDown = setTo;
			break;
		case KEY_W:
			p2.holdUp = setTo;
			break;
		case KEY_X:
			p2.holdBomb = setTo;
			break;
		case KEY_Z:
			p2.holdFire = setTo;
			break;
		case KEY_LEFT:
			p1.holdLeft = setTo;
			break;
		case KEY_UP:
			p1.holdUp = setTo;
			break;
		case KEY_RIGHT:
			p1.holdRight = setTo;
			break;
		case KEY_DOWN:
			p1.holdDown = setTo;
			break;
		case KEY_1:
			if(setTo == false) { // key relase only, to avoid repeats
				p1.shotsNumber++;
				console.log("increasing player 1 shot count");
			}
			break;
		case KEY_2:
			if(setTo == false) {
				p1.bombCount++;
				console.log("increasing player 1 bomb count");
			}
			break;
		case KEY_3:
			if(setTo == false) {
				p1.ghostCount++;
				console.log("increasing player 1 ghost count");
			}
			break;
		case KEY_4:
			if(setTo == false) {
				p1.shotsNumber = 1;
				p1.bombCount = 1;
				p1.ghostCount = 0;
			}
			break;

		case KEY_7:
			if(setTo == false) { // key relase only, to avoid repeats
				p2.shotsNumber++;
				console.log("increasing player 2 shot count");
			}
			break;
		case KEY_8:
			if(setTo == false) {
				p2.bombCount++;
				console.log("increasing player 2 bomb count");
			}
			break;
		case KEY_9:
			if(setTo == false) {
				p2.ghostCount++;
				console.log("increasing player 2 ghost count");
			}
			break;
		case KEY_0:
			if(setTo == false) {
				p2.shotsNumber = 1;
				p2.bombCount = 1;
				p2.ghostCount = 0;
			}
			break;


		default:
			validGameKey = false;
			break;
	}
	if(validGameKey) {
		evt.preventDefault();
	}
}