var defenseRingUnitList=[];

const RING_ANG_SPEED=0.1;
const RADIUS = 20;  //? Diameter?
const RING_FRAME_W = 6;
const RING_FRAME_H = 6;
const RING_FRAMES = 4;
const DEFENSE_RING_ORB_DIM = 6;

function spawnDefenseRingUnit(forPlayer) {
	forPlayer.defenseRingUnitList.push(new defenseRingClass(forPlayer,forPlayer.defenseRingUnitList.length));
}

function resetDefenseRing(forPlayer){
    forPlayer.defenseRingUnitList.length = 0;
    for(var i = 0; i<nDefenseOrbs ; i++){
        spawnDefenseRingUnit(forPlayer);
	}
}

defenseRingClass.prototype = new moveDrawClass();

function defenseRingClass(onPlayer, inPlace) {
    this.x; this.y;
    this.myPlayer = onPlayer;
    this.myPlace = inPlace;
	this.dfRingAngle = 0;
    this.frame = 0;
    this.readyToRemove = false;

    this.collDim = DEFENSE_RING_ORB_DIM;

    this.setPlayerPos = function(){
        this.playerPosX = this.myPlayer.x;
        this.playerPosY = this.myPlayer.x;
    }
    
    this.draw = function(){
        //console.log(this.frame);
        drawAnimFrame("defense_ring_unit", this.x, this.y, this.frame, RING_FRAME_W, RING_FRAME_H);
    }

    this.move = function(){
        this.x = this.myPlayer.x + RADIUS * Math.cos(this.dfRingAngle + (this.myPlace * (2*Math.PI / this.myPlayer.defenseRingUnitList.length )));
		this.y = this.myPlayer.y + RADIUS * Math.sin(this.dfRingAngle + (this.myPlace * (2*Math.PI / this.myPlayer.defenseRingUnitList.length )));

		this.dfRingAngle+=RING_ANG_SPEED;
    }

    this.animate = function() {
		this.frame++;
		if(this.frame>=RING_FRAMES) {
			this.frame = 0;
		}
	}
}