const SURFACE_VOLCANO_W = 40;
const SURFACE_VOLCANO_H = 50;
const SURFACE_VOLCANO_FRAMES = 3;
const VOLCANO_SHOT_SPEED = 1;
const VOLCANO_SHOT_BURST = 13;
const VOLCANO_SHOT_RELOAD = 50; // frames

volcanoEnemyClass.prototype = new moveDrawClass();

function volcanoEnemyClass(startX,startY) {
	this.myKind = GROUND_KIND_VOLCANO; // used for level format data
	this.x = startX;
	this.origY = startY;
	this.y = 0;
	this.reloadTime = VOLCANO_SHOT_RELOAD;
	this.frame = Math.floor(Math.random()*SURFACE_VOLCANO_FRAMES);
	this.bombLockedOn = false; // used to keep upgraded split bombs from homing on same ground target
	
	this.collW = this.collH = 0;

	this.draw = function() {
		this.y = this.origY-bgDrawY;
		drawAnimFrame("volcano",this.x,this.y, this.frame, SURFACE_VOLCANO_W,SURFACE_VOLCANO_H);
	}

	this.move = function() {
		if(this.y < GAME_H) {
			if(this.reloadTime--<0) {
				this.reloadTime = VOLCANO_SHOT_RELOAD;
				for(var i=0;i<VOLCANO_SHOT_BURST;i++) {
					new enemyShotClass(this.x, this.y,VOLCANO_SHOT_SPEED,
						i*(Math.PI*2/(VOLCANO_SHOT_BURST)));
				}
			}
		}
		if(this.y > GAME_H + PIXEL_MARGIN_FOR_REMOVING) {
			this.readyToRemove = true;
		}
	}

	this.animate = function() {
		if(++this.frame >= SURFACE_VOLCANO_FRAMES) {
			this.frame = 0;
		}
	}
}