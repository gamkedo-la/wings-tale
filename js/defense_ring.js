var defenseRingUnitList=[];

const RING_ANG_SPEED=2;
const RADIUS = 10;
const RING_FRAME_W = 6;
const RING_FRAME_H = 6;
const RING_FRAMES = 4;


function drawDefenseRingUnits() {
	
}

function moveDefenseRingUnits() {

}

function animateDefenseRingUnits() {

}

function defenseRingClass() {
    this.dfRingX; this.dfRingY;
	this.dfRingAngle = 0;
    this.frame = 0;
    
    this.draw = function(){
        drawAnimFrame("defense_ring_unit", this.dfRingX, this.dfRingY, this.frame, RING_FRAME_W, RING_FRAME_H);
    }

    this.move = function(playerPosX, playerPosY){
        this.dfRingX = playerPosX + RADIUS * Math.cos(this.dfRingAngle);
		this.dfRingY = playerPosY + RADIUS * Math.sin(this.dfRingAngle);

		this.dfRingAngle+=RING_ANG_SPEED;
    }

    this.animate = function() {
        console.log(this.frame);
		this.frame++;
		if(this.frame>=4) {
			this.frame = 0;
		}
	}
}