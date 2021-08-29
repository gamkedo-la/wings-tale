// todo: next 2 const values were named before other enemy kinds, should add _BUG_
const ENEMY_DIM = 7;
const ENEMY_FRAMES = 3;

const ENEMY_WAVES_AMPLITUDE_MIN = 15;
const ENEMY_WAVES_AMPLITUDE_MAX = 35;

const ENEMY_WAVES_FREQ = 0.04;
const ENEMY_WAVES_FREQ_MAX = 0.08;

const ENEMY_SPEED_MIN = 0.8;
const ENEMY_SPEED_MAX = 2.5;

enemyWaveBugClass.prototype = new moveDrawClass();

function enemyWaveBugClass(usingStep) {
	var centerX = 0.5*(Math.abs(usingStep.percXMax)+Math.abs(usingStep.percXMin));
	this.startX = this.x = (usingStep.driftX*stepPerc+centerX)*canvas.width;
	this.waveSize = GAME_W*Math.abs(usingStep.percXMax-usingStep.percXMin);//usingStep.wave;
	this.y = -ENEMY_DIM;
	this.frame = Math.floor(Math.random()*ENEMY_FRAMES);
	this.phaseOff = levelProgressInPixels/GAME_H;
	this.freq = ENEMY_WAVES_FREQ;
	this.speed = usingStep.speed;
	//this.health = 2;

	this.collW = this.collH = ENEMY_DIM;

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