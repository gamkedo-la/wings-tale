const KEY_SPACE = 32;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_LEFT = 37;

function keyPush(evt) {
	switch(evt.keyCode) {
		case KEY_SPACE:
			shotList.push({x:px,y:py});
			break;
		case KEY_LEFT:
			px-=PLAYER_SPEED;
			break;
		case KEY_UP:
			py-=PLAYER_SPEED;
			break;
		case KEY_RIGHT:
			px+=PLAYER_SPEED;
			break;
		case KEY_DOWN:
			py+=PLAYER_SPEED;
			break;
	}
}