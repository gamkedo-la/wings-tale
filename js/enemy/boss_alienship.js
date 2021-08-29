const ALIENSHIP_FRAMES = 0;
const ALIENSHIP_IMAGE_NAME = "alien ship";

bossAlienshipClass.prototype = new moveDrawClass();

function bossAlienshipClass() {
    this.xv=2;

    this.reset = function() {
        this.x=0;
        this.y=120;
    }

    this.move = function(){
        this.x += this.xv;
        if(this.x>GAME_W){
            this.xv = -this.xv;
        }
        if(this.x<0){
            this.xv = -this.xv;
        }
    }

    this.draw = function(){
        drawAnimFrame(ALIENSHIP_IMAGE_NAME, this.x, this.y, this.frame, 256, 240);

        if (50 * Math.random() < 1) {
            new enemyShotClass(this.x, this.y);
        }
        for(var i=0;i<ALIENSHIP_FRAMES;i++) {
            this.neckAngles[i] += 0.01*Math.cos(this.neckAnglesOsc[i]);
            this.neckAnglesOsc[i] += 0.04+Math.random()*0.01;
        }
    }

    this.animate = function() {
		this.frame++;
		if(this.frame>=ALIENSHIP_FRAMES) {
			this.frame = 0;
		}
	}

}