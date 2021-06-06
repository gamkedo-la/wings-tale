var enemyList=[];
const ENEMY_DIM = 7;
const ENEMY_FRAMES = 3;

const ENEMY_WAVES_AMPLITUDE_MIN = 15;
const ENEMY_WAVES_AMPLITUDE_MAX = 35;

const ENEMY_WAVES_FREQ_MIN = 0.02;
const ENEMY_WAVES_FREQ_MAX = 0.08;

const ENEMY_SPEED_MIN = 0.8;
const ENEMY_SPEED_MAX = 2.5;

var level1SpawnSeq = [
	{percDuration:0.05,driftX:0.5,percXMin:0.2,percXMax:0.3,speed:1.0,wave:10,ticksBetween:20},
	{percDuration:0.1,driftX:-0.76,percXMin:0.8,percXMax:0.9,speed:2.5,wave:25,ticksBetween:5},
	{percDuration:0.1,driftX:0.0,percXMin:0.2,percXMax:0.8,speed:0.5,wave:100,ticksBetween:30},
	{percDuration:0.1,driftX:0.8,percXMin:0.1,percXMax:0.3,speed:2.5,wave:5,ticksBetween:2},
	{percDuration:0.1,driftX:0.4,driftX:0.5,percXMin:0.1,percXMax:0.5,speed:1.5,wave:30,ticksBetween:40},
	{percDuration:0.1,driftX:0.0,percXMin:0.5,percXMax:0.5,speed:2,wave:50,ticksBetween:3},
	{percDuration:0.1,driftX:0.0,percXMin:0.1,percXMax:0.9,speed:3,wave:2,ticksBetween:0},
];
var levelNow = [];
var spawnSeqStep = 0; // which step of the spawner have we progressed to

function startLevel(whichLevel) {
	levelNow = JSON.parse(JSON.stringify(whichLevel)); // deep/clean copy since we'll modify it during loading
	var accumPerc = 0; // for recalculating percDuration per section into total up to that point
	for(var i=0; i<levelNow.length;i++) {
		accumPerc+=levelNow[i].percDuration;
		levelNow[i].percDuration = accumPerc;
	}	
}

var enemySpawnTickCount = 0;
var stepPerc = 0;
function spawnEnemyUpdate() {
	if (gameState != GAME_STATE_PLAY || levelProgressPerc >= 0.99)
	{
		return;
	}
	if(levelProgressPerc>levelNow[spawnSeqStep].percDuration && 
		spawnSeqStep<levelNow.length-1 ) { // so last one will go until end of stage

		spawnSeqStep++;
		// console.log("===="+spawnSeqStep + " at perc " +levelProgressPerc);
	}
	if(spawnSeqStep==0) {
		stepPerc = levelProgressPerc/levelNow[spawnSeqStep].percDuration;
	} else if(spawnSeqStep < levelNow.length) {
		stepPerc = (levelProgressPerc-levelNow[spawnSeqStep-1].percDuration)/
					(levelNow[spawnSeqStep].percDuration-levelNow[spawnSeqStep-1].percDuration); 
		if(stepPerc>1) { // ex. ran out of level description, so freeze it after drift
			stepPerc=1;
		}
	} else {
		stepPerc = 0;
	}
	// console.log("stepPerc is "+stepPerc);

	if(enemySpawnTickCount-- < 0) {
	
		enemySpawnTickCount=levelNow[spawnSeqStep].ticksBetween;
		enemyList.push(new enemyClass());
	}
}

enemyClass.prototype = new moveDrawClass();

 // note: so far, not yet a general enemy class, pretty specific to this enemy. we can generalize it when we add more types
function enemyClass() {
	this.startX = this.x = (levelNow[spawnSeqStep].driftX*stepPerc + levelNow[spawnSeqStep].percXMin+
		Math.random()*(levelNow[spawnSeqStep].percXMax-levelNow[spawnSeqStep].percXMin))*canvas.width;
	this.y = -ENEMY_DIM;
	this.frame = Math.floor(Math.random()*ENEMY_FRAMES);
	this.phaseOff = Math.random();
	this.waveSize = levelNow[spawnSeqStep].wave;
	this.freq = randRange(ENEMY_WAVES_FREQ_MIN,ENEMY_WAVES_FREQ_MAX);
	this.speed = levelNow[spawnSeqStep].speed;
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