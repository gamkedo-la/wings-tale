var splodeList=[];
const SPLODE_DIM=15;

var splodeCommonFrame = 0;
const SPLODE_FRAMES = 4;

function animateSplodes() {
	if(++splodeCommonFrame>=SPLODE_FRAMES) {
        //these die after 1 round of animation
		splodeCommonFrame = 0;
	}
}

function spawnSplode(atX, atY, delay=false) {
	var newSplode = new splodeClass(atX, atY);
	// SOUNDS.splode.play();
	if(delay){
		setTimeout(function(){
			if(gameState != GAME_STATE_ENDING || Math.random()<0.1) {
				playSound(sounds.splode);
			}
			splodeList.push(newSplode);
			dropRippleAt(atX, atY)
		}, Math.random()*250)
	} else {
		if(gameState != GAME_STATE_ENDING || Math.random()<0.1) {
			playSound(sounds.splode);
		}
		splodeList.push(newSplode);
		dropRippleAt(atX, atY)
	}
	
}

splodeClass.prototype = new moveDrawClass();

function splodeClass(x,y) {
    this.currFrame = 0;
	this.x = x;
	this.y = y;
	this.xv = 0; //level scroll speed maybe?
	this.yv = -1;


	this.move = function() {
        this.currFrame++;
		this.x += this.xv;
		this.y += this.yv;
		if(this.y<0 || this.x<0 || this.x>GAME_W || this.y>GAME_H) {
			this.readyToRemove = true;
		}
	}

	this.draw = function() {
		drawAnimFrame("splode",this.x,this.y, this.currFrame, SPLODE_DIM,SPLODE_DIM);
        if(this.currFrame == SPLODE_FRAMES){
            this.readyToRemove = true;
        }
	}
}