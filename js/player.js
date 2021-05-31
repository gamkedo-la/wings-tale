const PLAYER_DIM = 12;
const PLAYER_FRAME_W = 13;
const PLAYER_FRAME_H = 12;
const PLAYER_FRAMES = 3;
const PLAYER_SPEED = 3;
const EDGE_MARGIN = PLAYER_DIM;

var shotDegSpread = 3.7;
var bombDegSpread = 6;
const GHOST_DIST_MULT = 9;
const GHOST_MIN_MOVE_SPEED = 0.7;

function playerClass() {
	this.x; this.y;
	this.xv=0; this.yv=0;

	// used for ghost player sources
	this.trailX = [];
	this.trailY = [];

	this.shotsNumber = 1;
	this.bombCount = 1;
	this.ghostCount = 0;

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

		this.shotsNumber = 1;
		this.bombCount = 1;
		this.ghostCount = 0;
	}

	this.draw = function() {
		for(var i=0;i<this.ghostCount;i++) {
			var ghostIdx = (i+1)*GHOST_DIST_MULT;
			if(ghostIdx>=this.trailY.length) {
				ghostIdx=this.trailY.length-1;
			}
			fromX = this.trailX[ghostIdx];
			fromY = this.trailY[ghostIdx];

			drawAnimFrame("player",fromX, fromY, this.frame, PLAYER_FRAME_W,PLAYER_FRAME_H);
		}
		drawAnimFrame("player",this.x,this.y, this.frame, PLAYER_FRAME_W,PLAYER_FRAME_H);
		drawAnimFrame("bomb sight",this.x,this.y-APPROX_BOMB_RANGE, this.frame%2, BOMB_FRAME_W,BOMB_FRAME_H);
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

		if(Math.abs(this.xv)+Math.abs(this.yv) > GHOST_MIN_MOVE_SPEED) {
			this.trailX.unshift(this.x);
			this.trailY.unshift(this.y);
			while(this.trailX.length > this.ghostCount * GHOST_DIST_MULT) {
				this.trailX.pop();
			}
			while(this.trailY.length > this.ghostCount * GHOST_DIST_MULT) {
				this.trailY.pop();
			}
		}

		this.x += this.xv;
		this.y += this.yv;

		this.xv*=0.7;
		this.yv*=0.7;

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

		// pmx = partial momentum, which part of player speed should impact projectiles being shot or dropped
		var pmx = this.xv * 0.1;
		var pmy = this.yv * (this.yv > 0 ? 0.2 : 0.9);

		var ghostsLeft = this.ghostCount;
		var ghostIdx=0;
		var fromX = this.x;
		var fromY = this.y;
		do {
			if(this.holdBomb && this.wasHoldingBomb != this.holdBomb) {
				var bombAngSpan = -(this.bombCount-1)*(bombDegSpread*0.5);

				for(var i=0;i<this.bombCount;i++) {
					var newBomb = new shotGroundClass(fromX,fromY,SHOT_GROUND_SPEED,bombAngSpan+bombDegSpread*i,pmx,pmy);
					shotGroundList.push(newBomb);
				}
			}

			if(this.holdFire) {
				var newShot, shotAngSpan = -(this.shotsNumber-1)*(shotDegSpread*0.5);
				SOUNDS.playerShoot.play();
				for(var i=0;i<this.shotsNumber;i++) {
					newShot = new shotClass(fromX,fromY,SHOT_SPEED,shotAngSpan+shotDegSpread*i,pmx,pmy);
					shotList.push(newShot);
				}
			}

			ghostIdx+=GHOST_DIST_MULT;
			if(ghostIdx>=this.trailY.length) {
				ghostIdx=this.trailY.length-1;
			}
			fromX = this.trailX[ghostIdx];
			fromY = this.trailY[ghostIdx];
		} while(ghostsLeft-- > 0);

		this.wasHoldingBomb = this.holdBomb;
	}

	this.animate = function() {
		this.frame++;
		if(this.frame>=PLAYER_FRAMES) {
			this.frame = 0;
		}
	}
}