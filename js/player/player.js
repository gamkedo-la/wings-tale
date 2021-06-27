const PLAYER_DIM = 20;
const PLAYER_FRAME_W = 21;
const PLAYER_FRAME_H = 20;
const PLAYER_FRAMES = 3;
const PLAYER_SPEED = 3;
const EDGE_MARGIN = PLAYER_DIM;
const INVULNERABLE_DURATION = 5;
const INVULNERABLE_DURATION_DECREMENT = 0.1;

var shotDegSpread = 3.7;
var bombDegSpread = 6;
const GHOST_DIST_MULT = 9;
const GHOST_MIN_MOVE_SPEED = 0.7;

const HOMING_POWERUP_FRAMES = 300;

playerClass.prototype = new moveDrawClass();

function playerClass() {
	// used for ghost player sources
	this.trailX = [];
	this.trailY = [];

	this.shotsNumber = 1;
	this.bombCount = 1;
	this.ghostCount = 0;
	this.homingBombFramesLeft = HOMING_POWERUP_FRAMES;

	this.invulnerableTimeLeft = 0;
	this.invulnerableBlinkToggle = false;

	this.frame=0;

	this.holdLeft=false;
	this.holdUp=false;
	this.holdRight=false;
	this.holdDown=false;
	this.holdFire=false;
	this.holdBomb=false;
	this.wasHoldingBomb=false; // to tell when state toggles, since not repeat fire

	this.defenseRingUnitList = [];

	this.reset = function() {
		if (this.invulnerableTimeLeft <= 0) {
			this.invulnerableTimeLeft = INVULNERABLE_DURATION;

			this.neverRemove = true; // respawn only

			this.readyToRemove = false;
			this.x=GAME_W/2;
			this.y=GAME_H-PLAYER_DIM*2;
			this.xv=this.yv=0;
			
			if(cheatKeepPowerupsOnDeath) {
				console.log("The cheat/debug feature KeepPowerupsOnDeath is on!");
			}
			else {
				this.shotsNumber = 1;
				this.bombCount = 1;
				this.ghostCount = 0;
				this.homingBombFramesLeft = HOMING_POWERUP_FRAMES;
			}

			resetDefenseRing(this);
		}
	}

	this.draw = function() {
		if (this.invulnerableTimeLeft > 0) {			
			if (Math.round(this.invulnerableTimeLeft * 10) % 4 == 0) {
				this.invulnerableBlinkToggle = !this.invulnerableBlinkToggle;
			}
		}

		if (this.invulnerableBlinkToggle || this.invulnerableTimeLeft < 0) {
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

			if (this.invulnerableTimeLeft > 0) {			
				return;
			}

			drawList(this.defenseRingUnitList);
		}

		if(this.homingBombFramesLeft>0) {
			drawFilledBar(this.x-10,this.y+10,20,5,this.homingBombFramesLeft/HOMING_POWERUP_FRAMES,"lime");
		}
	}

	this.move = function() {
		if(this.homingBombFramesLeft > 0) {
			this.homingBombFramesLeft--;
		}
		if (this.invulnerableTimeLeft > 0) {
			this.invulnerableTimeLeft -= INVULNERABLE_DURATION_DECREMENT;			
		}

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
					var newBomb = new shotGroundClass(fromX,fromY,SHOT_GROUND_SPEED,bombAngSpan+bombDegSpread*i,pmx,pmy, this.homingBombFramesLeft>0);
					shotGroundList.push(newBomb);
				}
			}

			if(this.holdFire) {
				var newShot, shotAngSpan = -(this.shotsNumber-1)*(shotDegSpread*0.5);
				playSound(sounds.playerShot);
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

		if (this.invulnerableTimeLeft > 0) {
			this.invulnerableTimeLeft -= INVULNERABLE_DURATION_DECREMENT;
			return;
		}

		moveList(this.defenseRingUnitList);
	}

	this.animate = function() {
		this.frame++;
		if(this.frame>=PLAYER_FRAMES) {
			this.frame = 0;
		}
		animateList(this.defenseRingUnitList);
	}

	// any AI specific variables
	this.AI_dir_right = true;
	this.AI_margin = 50;
	this.AI_powerup_chasing = null;
	this.AI_target = null;

	this.chaseAI = function(toX,toY) {

	}

	this.doAI = function() {
		this.holdFire = true; // always
		if(Math.random()<0.01) {
			this.holdBomb = !this.holdBomb;
		}
		if(this.AI_powerup_chasing != null) {
			this.holdDown = (this.y<this.AI_powerup_chasing.y-PLAYER_SPEED);
			this.holdUp = (this.y>this.AI_powerup_chasing.y+PLAYER_SPEED);

			this.holdLeft = (this.x>this.AI_powerup_chasing.x+PLAYER_SPEED);
			this.holdRight = (this.x<this.AI_powerup_chasing.x-PLAYER_SPEED);

			var dist = approxDist(this.x,this.y,this.AI_powerup_chasing.x,this.AI_powerup_chasing.y);
			if(dist>0.5*GAME_W || this.AI_powerup_chasing.readyToRemove || powerupList.length==0) {
				this.AI_powerup_chasing = null;
			}
		} else if(this.AI_target != null) {
			this.holdDown = (this.y<GAME_H*0.7);
			this.holdUp = (this.y>GAME_H*0.95);

			this.holdLeft = (this.x>this.AI_target.x+PLAYER_SPEED*3);
			this.holdRight = (this.x<this.AI_target.x-PLAYER_SPEED*3);
			if(this.AI_target.y > this.y || this.AI_target.readyToRemove || enemyList.length==0) {
				this.AI_target = null;
			}
		} else {
			this.holdDown = (this.y<GAME_H*0.75);
			this.holdUp = (this.y>GAME_H*0.9);
			if(this.AI_dir_right) {
				this.holdRight = true;
				this.holdLeft = !this.holdRight;
				if(this.x>GAME_W-this.AI_margin) {
					this.AI_dir_right = !this.AI_dir_right;
				}
			} else {
				this.holdRight = false;
				this.holdLeft = !this.holdRight;

				if(this.x<this.AI_margin) {
					this.AI_dir_right = !this.AI_dir_right;
				}
			}

			if(powerupList.length > 0) {
				this.AI_powerup_chasing = powerupList[0];
			} // end of powerup check
			else if(enemyList.length > 0) {
				this.AI_target = enemyList[0];
			} // end of powerup check

		} // end of AI wander case
	} // end of doAI function

} // end of player class