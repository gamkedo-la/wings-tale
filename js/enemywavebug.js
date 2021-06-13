const ENEMY_DIM = 7;
const ENEMY_FRAMES = 3;

const ENEMY_WAVES_AMPLITUDE_MIN = 15;
const ENEMY_WAVES_AMPLITUDE_MAX = 35;

const ENEMY_WAVES_FREQ_MIN = 0.02;
const ENEMY_WAVES_FREQ_MAX = 0.08;

const ENEMY_SPEED_MIN = 0.8;
const ENEMY_SPEED_MAX = 2.5;

enemyWaveBugClass.prototype = new moveDrawClass();

function enemyWaveBugClass() {
	this.startX = this.x = (levData[spawnSeqStep].driftX*stepPerc + levData[spawnSeqStep].percXMin+
		Math.random()*(levData[spawnSeqStep].percXMax-levData[spawnSeqStep].percXMin))*canvas.width;
	this.y = -ENEMY_DIM;
	this.frame = Math.floor(Math.random()*ENEMY_FRAMES);
	this.phaseOff = Math.random();
	this.waveSize = levData[spawnSeqStep].wave;
	this.freq = randRange(ENEMY_WAVES_FREQ_MIN,ENEMY_WAVES_FREQ_MAX);
	this.speed = levData[spawnSeqStep].speed;

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