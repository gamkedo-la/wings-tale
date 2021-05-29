var defenseRingUnitList=[];

const RING_ANG_SPEED=0.1;
const RADIUS = 12;
const RING_FRAME_W = 6;
const RING_FRAME_H = 6;
const RING_FRAMES = 4;
const DEFENSE_RING_ORB_DIM = 6;

function spawnDefenseRingUnit() {
	defenseRingUnitList.push(new defenseRingClass(p1));
    console.log("Number of defense ring units: " + defenseRingUnitList.length);
}

function moveDefenseRingUnits() {
    for(var d=0;d<defenseRingUnitList.length;d++) {
		defenseRingUnitList[d].move(d);
	}
}
function resetDefenseRing(){
    defenseRingUnitList=[];
    for(var i = 0; i<nDefenseOrbs ; i++){
		spawnDefenseRingUnit();
	}
}

defenseRingClass.prototype = new moveDrawClass();

function defenseRingClass(onPlayer) {
    this.x; this.y;
    this.myPlayer = onPlayer;
	this.dfRingAngle = 0;
    this.frame = 0;
    this.readyToRemove = false;

    this.setPlayerPos = function(){
        this.playerPosX = this.myPlayer.x;
        this.playerPosY = this.myPlayer.x;
    }
    
    this.draw = function(){
        //console.log(this.frame);
        drawAnimFrame("defense_ring_unit", this.x, this.y, this.frame, RING_FRAME_W, RING_FRAME_H);
    }

    this.move = function(offset){
        this.x = this.myPlayer.x + RADIUS * Math.cos(this.dfRingAngle + (offset * (2*Math.PI / defenseRingUnitList.length )));
		this.y = this.myPlayer.y + RADIUS * Math.sin(this.dfRingAngle + (offset * (2*Math.PI / defenseRingUnitList.length )));

		this.dfRingAngle+=RING_ANG_SPEED;
    }

    this.animate = function() {
		this.frame++;
		if(this.frame>=RING_FRAMES) {
			this.frame = 0;
		}
	}
}