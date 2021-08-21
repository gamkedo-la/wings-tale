const ALIENSHIP_FRAMES = 0;
const ALIENSHIP_IMAGE_NAME = "alien ship";

function alienshipClass() {
    this.frame=0;
    
    this.reset = function() {
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