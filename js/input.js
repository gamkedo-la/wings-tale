const KEY_SPACE = 32;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_LEFT = 37;

function keyPush(evt) {
	console.log("down");
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
		case KEY_SPACE:
			holdFire = setTo;
			break;
		case KEY_LEFT:
			holdLeft = setTo;
			break;
		case KEY_UP:
			holdUp = setTo;
			break;
		case KEY_RIGHT:
			holdRight = setTo;
			break;
		case KEY_DOWN:
			holdDown = setTo;
			break;
		default:
			validGameKey = false;
			break;
	}
	if(validGameKey) {
		evt.preventDefault();
	}
}