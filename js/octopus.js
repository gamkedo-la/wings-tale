const OCTOPUS_FRAMES = 0;
const OCTOPUS_IMAGE_NAME = "octopus";

function octopusClass() {
    this.frame=0;

    this.reset = function() {
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