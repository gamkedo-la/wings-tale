const PLAYER_DIM = 12;
const PLAYER_FRAME_W = 13;
const PLAYER_FRAME_H = 12;
const PLAYER_FRAMES = 3;
const PLAYER_SPEED = 3;
const EDGE_MARGIN = PLAYER_DIM;
const DFRING_RADIUS = 10;

function playerClass() {
	this.x; this.y;
	this.xv=0; this.yv=0;
	this.dfRingX; this.dfRingY;
	this.dfRingAngle = 0;
	this.dfRingAngularSpeed = 2;

	this.frame=0;

	this.holdLeft=false;
	this.holdUp=false;
	this.holdRight=false;
	this.holdDown=false;
	this.holdFire=false;
	this.holdBomb=false;
	this.wasHoldingBomb=false; // to tell when state toggles, since not repeat fire

	this.reset = function() {
		this.x=GAME_W/2;
		this.y=GAME_H-PLAYER_DIM*2;
		this.xv=this.yv=0;
	}

	this.draw = function() {
		drawAnimFrame("player",this.x,this.y, this.frame, PLAYER_FRAME_W,PLAYER_FRAME_H);
		drawAnimFrame("defense_ring_unit", this.dfRingX, this.dfRingY, this.frame, 6, 6);
	}

	this.move = function() {
		// input handling
		if(this.holdUp) {
			this.yv = -PLAYER_SPEED;
		}
		if(this.holdRight) {
			this.xv = PLAYER_SPEED;
		}
		if(this.holdDown) {
			this.yv = PLAYER_SPEED;
		}
		if(this.holdLeft) {
			this.xv = -PLAYER_SPEED;
		}

		this.x += this.xv;
		this.y += this.yv;

		this.xv*=0.7;
		this.yv*=0.7;

		this.dfRingX = this.x + DFRING_RADIUS * Math.cos(this.dfRingAngle);
		this.dfRingY = this.y + DFRING_RADIUS * Math.sin(this.dfRingAngle);

		this.dfRingAngle+=this.dfRingAngularSpeed;

		// bounds check
		if(this.x<EDGE_MARGIN) {
			this.x=EDGE_MARGIN;
		}
		if(this.x>=GAME_W-EDGE_MARGIN) {
			this.x=GAME_W-EDGE_MARGIN-1;
		}
		if(this.y<EDGE_MARGIN) {
			this.y=EDGE_MARGIN;
		}
		if(this.y>=GAME_H-EDGE_MARGIN) {
			this.y=GAME_H-EDGE_MARGIN-1;
		}


		if(this.holdBomb && this.wasHoldingBomb != this.holdBomb) {
			console.log("Not implemented: ground attack / drop bomb");
		}
		this.wasHoldingBomb = this.holdBomb;

		if(this.holdFire) {
			// pmx = partial momentum x, using part of current player speed to bunch up less
			var pmx = this.xv * 0.1;
			var pmy = this.yv * (this.yv > 0 ? 0.2 : 0.9);

			var newShot = new shotClass(this.x-4,this.y,SHOT_SPEED,-5.0,pmx,pmy);
			shotList.push(newShot);
			newShot = new shotClass(this.x,this.y-1,SHOT_SPEED,0.0,pmx,pmy);
			shotList.push(newShot);
			newShot = new shotClass(this.x+4,this.y,SHOT_SPEED,5.0,pmx,pmy);
			shotList.push(newShot);
		}
	}

	this.animate = function() {
		this.frame++;
		if(this.frame>=PLAYER_FRAMES) {
			this.frame = 0;
		}
	}
}