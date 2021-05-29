const KEY_SPACE = 32;

const KEY_Z = 90;
const KEY_X = 88;

// debug keys for now
const KEY_1 = 49;
const KEY_2 = 50;
const KEY_3 = 51;
const KEY_4 = 52;

const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_PLUS = 187;

function keyPush(evt) {
	keyHoldUpdate(evt,true);
}
function keyRelease(evt) {
	keyHoldUpdate(evt,false);
}
function inputSetup() {
	document.addEventListener('keydown',keyPush);	
	document.addEventListener('keyup', keyRelease);	
}

function keyHoldUpdate(evt, setTo) {
	var validGameKey = true;
	switch(evt.keyCode) {
		case KEY_X:
			p1.holdBomb = setTo;
			break;
		case KEY_Z:
		case KEY_SPACE:
			p1.holdFire = setTo;
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
		case KEY_PLUS:
			if (!setTo) {
				levelProgressInPixels += images[currentLevelImageName].height / 10;
			}
			break;
		case KEY_1:
			if(setTo == false) { // key relase only, to avoid repeats
				p1.shotsNumber++;
				console.log("increasing player shot count");
			}
			break;
		case KEY_2:
			if(setTo == false) {
				p1.bombCount++;
				console.log("increasing player bomb count");
			}
			break;
		case KEY_3:
			if(setTo == false) {
				p1.ghostCount++;
				console.log("increasing player ghost count");
			}
			break;
		case KEY_4:
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
		evt.preventDefault();
	}
}