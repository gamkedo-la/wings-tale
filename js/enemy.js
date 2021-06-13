var enemyList=[];
const ENEMY_DIM = 7;
const ENEMY_FRAMES = 3;

const ENEMY_WAVES_AMPLITUDE_MIN = 15;
const ENEMY_WAVES_AMPLITUDE_MAX = 35;

const ENEMY_WAVES_FREQ_MIN = 0.02;
const ENEMY_WAVES_FREQ_MAX = 0.08;

const ENEMY_SPEED_MIN = 0.8;
const ENEMY_SPEED_MAX = 2.5;

var levData = [];
var spawnSeqStep = 0; // which step of the spawner have we progressed to

function startLevel(whichLevel) {
	levData = JSON.parse(JSON.stringify(whichLevel)); // deep/clean copy since we'll modify it during loading
	var accumPerc = 0; // for recalculating percDuration per section into total up to that point
	for(var i=0; i<levData.length;i++) {
		accumPerc+=levData[i].percDuration;
		levData[i].percDuration = accumPerc;
	}	
}

var enemySpawnTickCount = 0;
var stepPerc = 0;
function spawnEnemyUpdate() {
	if (gameState != GAME_STATE_PLAY || levelProgressPerc >= 0.99)
	{
		return;
	}
	if(levelProgressPerc>levData[spawnSeqStep].percDuration && 
		spawnSeqStep<levData.length-1 ) { // so last one will go until end of stage

		spawnSeqStep++;
		// console.log("===="+spawnSeqStep + " at perc " +levelProgressPerc);
	}
	if(spawnSeqStep==0) {
		stepPerc = levelProgressPerc/levData[spawnSeqStep].percDuration;
	} else if(spawnSeqStep < levData.length) {
		stepPerc = (levelProgressPerc-levData[spawnSeqStep-1].percDuration)/
					(levData[spawnSeqStep].percDuration-levData[spawnSeqStep-1].percDuration); 
		if(stepPerc>1) { // ex. ran out of level description, so freeze it after drift
			stepPerc=1;
		}
	} else {
		stepPerc = 0;
	}
	// console.log("stepPerc is "+stepPerc);

	if(enemySpawnTickCount-- < 0) {
	
		enemySpawnTickCount=levData[spawnSeqStep].ticksBetween;
		enemyList.push(new enemyClass());
	}
}

enemyClass.prototype = new moveDrawClass();

 // note: so far, not yet a general enemy class, pretty specific to this enemy. we can generalize it when we add more types
function enemyClass() {
	this.startX = this.x = (levData[spawnSeqStep].driftX*stepPerc + levData[spawnSeqStep].percXMin+
		Math.random()*(levData[spawnSeqStep].percXMax-levData[spawnSeqStep].percXMin))*canvas.width;
	this.y = -ENEMY_DIM;
	this.frame = Math.floor(Math.random()*ENEMY_FRAMES);
	this.phaseOff = Math.random();
	this.waveSize = levData[spawnSeqStep].wave;
	this.freq = randRange(ENEMY_WAVES_FREQ_MIN,ENEMY_WAVES_FREQ_MAX);
	this.speed = levData[spawnSeqStep].speed;
	this.readyToRemove = false;

	this.move = function() {
		this.x = this.startX + this.waveSize*
						 Math.cos(this.phaseOff*Math.PI+this.y*this.freq);
		this.y += this.speed;
		if(this.y>GAME_H) {
			this.readyToRemove = true;
		}
	}

	this.draw = function() {
		drawAnimFrame("bug",this.x,this.y, this.frame, ENEMY_DIM,ENEMY_DIM);
	}
	this.animate = function() {
		if(++this.frame>=ENEMY_FRAMES) {
			this.frame = 0;
		}
	}
}