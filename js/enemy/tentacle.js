tentacleClass.prototype = new moveDrawClass();

 // note: so far, not yet a general enemy class, pretty specific to this enemy. we can generalize it when we add more types
function tentacleClass(atX, atY) {
	this.myKind = GROUND_KIND_TENTACLE; // used for level format data
    this.frameDim = 16;
	this.origY = atY;
	this.x = atX;
	this.y = 0;
    this.xtip = 0;
    this.ytip = -50;
	this.drawEndY = 0;
    this.splatCount = 16;
	this.y = -ENEMY_DIM;
	this.readyToRemove = false;
	this.phaseOffset = Math.random();
	this.bombLockedOn = false; // used to keep upgraded split bombs from homing on same ground target

	this.move = function() {
		this.y = this.origY - bgDrawY;
		this.phaseOffset += 0.2;
		this.xtip = Math.cos(this.phaseOffset/3)*10;
		// if(this.y>GAME_H) {
		// 	this.readyToRemove = true;
		// }
	}

	this.draw = function() {
		if(gameState == GAME_STATE_LEVEL_DEBUG) {
			this.move(); // updates draw info for this object
		}
        for(let i = 0; i < this.splatCount; i++){
			this.xtip = this.xtip + Math.cos(i+this.phaseOffset)*3;
            drawX = lerp(this.x, this.x+this.xtip, i / this.splatCount);
			drawY = lerp(this.y, this.y+this.ytip, i / this.splatCount);
            drawAnimFrame("tentacle",drawX, drawY, i, this.frameDim, this.frameDim);
        }
		if(this.y > GAME_H + PIXEL_MARGIN_FOR_REMOVING) {
			this.readyToRemove = true;
		}
	}
	this.animate = function() {
		if(++this.frame>=ENEMY_FRAMES) {
			this.frame = 0;
		}
	}
}