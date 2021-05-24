var defenseRingUnitList=[];

const RING_ANG_SPEED=0.1;
const RADIUS = 12;
const RING_FRAME_W = 6;
const RING_FRAME_H = 6;
const RING_FRAMES = 4;
const DEFENSE_RING_ORB_DIM = 6;



function spawnDefenseRingUnit() {
	defenseRingUnitList.push(new defenseRingClass());
    console.log("Number of defense ring units: " + defenseRingUnitList.length);
}

function drawDefenseRingUnits() {
	for(var d=0;d<defenseRingUnitList.length;d++) {
		defenseRingUnitList[d].draw();
	}
}

function moveDefenseRingUnits(pPosX, pPosY) {
    for(var d=0;d<defenseRingUnitList.length;d++) {
		defenseRingUnitList[d].move(pPosX, pPosY, d);
	}
}

function animateDefenseRingUnits() {
    for(var d=0;d<defenseRingUnitList.length;d++) {
		defenseRingUnitList[d].animate();
	}
}

function resetDefenseRing(){
    defenseRingUnitList=[];
    for(var i = 0; i<nDefenseOrbs ; i++){
		spawnDefenseRingUnit();
	}
}

function defenseRingClass() {
    this.x; this.y;
	this.dfRingAngle = 0;
    this.frame = 0;
    this.readyToRemove = false;

    this.setPlayerPos = function(pPosX, pPosY){
        this.playerPosX = pPosX;
        this.playerPosY = pPosY;
    }
    
    this.draw = function(){
        //console.log(this.frame);
        drawAnimFrame("defense_ring_unit", this.x, this.y, this.frame, RING_FRAME_W, RING_FRAME_H);
    }

    this.move = function(pPosX, pPosY, offset){
        this.x = pPosX + RADIUS * Math.cos(this.dfRingAngle + (offset * (2*Math.PI / defenseRingUnitList.length )));
		this.y = pPosY + RADIUS * Math.sin(this.dfRingAngle + (offset * (2*Math.PI / defenseRingUnitList.length )));

		this.dfRingAngle+=RING_ANG_SPEED;
    }

    this.animate = function() {
		this.frame++;
		if(this.frame>=RING_FRAMES) {
			this.frame = 0;
		}
	}
}