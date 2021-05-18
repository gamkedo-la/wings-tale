var enemyList=[];
const ENEMY_DIM = 7;
const ENEMY_FRAMES = 3;

const ENEMY_WAVES_AMPLITUDE_MIN = 15;
const ENEMY_WAVES_AMPLITUDE_MAX = 35;

const ENEMY_WAVES_FREQ_MIN = 0.02;
const ENEMY_WAVES_FREQ_MAX = 0.08;

const ENEMY_SPEED_MIN = 0.8;
const ENEMY_SPEED_MAX = 2.5;

function spawnEnemy() {
	enemyList.push(new enemyClass());
}

function drawEnemies() {
	for(var e=0;e<enemyList.length;e++) {
		enemyList[e].draw();
	}
}

function moveEnemies() {
	for(var e=0;e<enemyList.length;e++) {
		enemyList[e].move();
	}
}

function animateEnemies() {
	for(var e=0;e<enemyList.length;e++) {
		enemyList[e].animate();
	}
}

function enemyClass() {
	this.startX = this.x = (0.025+Math.random()*0.95)*canvas.width;
	this.y = -ENEMY_DIM;
	this.frame = Math.floor(Math.random()*ENEMY_FRAMES);
	this.phaseOff = Math.random();
	this.waveSize = randRange(ENEMY_WAVES_AMPLITUDE_MIN,ENEMY_WAVES_AMPLITUDE_MAX);
	this.freq = randRange(ENEMY_WAVES_FREQ_MIN,ENEMY_WAVES_FREQ_MAX);
	this.speed = randRange(ENEMY_SPEED_MIN,ENEMY_SPEED_MAX);
	this.readyToRemove = false;

	this.move = function() {
		this.x = this.startX + this.waveSize*
						 Math.cos(this.phaseOff*Math.PI+this.y*this.freq);
		this.y += this.speed;
		var dx=Math.abs(this.x-px);
		var dy=Math.abs(this.y-py);
		var dist=dx+dy; // close enough instead of Math.sqrt(dx*dx+dy*dy);
		if(this.y>GAME_H) {
			this.readyToRemove = true;
		}
		if(dist< (PLAYER_DIM+ENEMY_DIM)/2) {
			reset();
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