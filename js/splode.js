var splodeList=[];
const SPLODE_DIM=15;

var splodeCommonFrame = 0;
const SPLODE_FRAMES = 4;

function drawSplodes() {
	for(var s=0;s<splodeList.length;s++) {
		splodeList[s].draw();
	}
}

function moveSplodes() {
	for(var s=0;s<splodeList.length;s++) {
		splodeList[s].move();
	}
}

function animateSplodes() {
	if(++splodeCommonFrame>=SPLODE_FRAMES) {
        //these die after 1 round of animation
		splodeCommonFrame = 0;
	}
}

function splodeClass(x,y) {
    this.currFrame = 0;
	this.x = x;
	this.y = y;
	this.xv = 0; //level scroll speed maybe?
	this.yv = -1;
	this.readyToRemove = false;

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