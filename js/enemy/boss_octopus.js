const OCTOPUS_FRAMES = 0;
const OCTOPUS_IMAGE_NAME = "octopus";

bossOctopusClass.prototype = new moveDrawClass();

function bossOctopusClass() {
    this.reset = function() {
    }

    this.move = function(){
    }

    this.draw = function(){
        drawAnimFrame(OCTOPUS_IMAGE_NAME, 128, 120, this.frame, 256, 240);
    }

    this.animate = function() {
		this.frame++;
		if(this.frame>=OCTOPUS_FRAMES) {
			this.frame = 0;
		}
	}

}