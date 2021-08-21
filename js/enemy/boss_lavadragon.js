bossLavaDragonClass.prototype = new moveDrawClass();

function bossLavaDragonClass() {
    this.reset = function() {
    }

    this.move = function(){
    }

    this.draw = function(){
        drawAnimFrame(ALIENSHIP_IMAGE_NAME, 128, 120, this.frame, 256, 240);
    }

    this.animate = function() {
		this.frame++;
		if(this.frame>=ALIENSHIP_FRAMES) {
			this.frame = 0;
		}
	}

}