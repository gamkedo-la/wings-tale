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
	var newE = {startX:(0.025+Math.random()*0.95)*canvas.width,y:-ENEMY_DIM,
				frame:Math.floor(Math.random()*ENEMY_FRAMES), phaseOff:Math.random(),
				waveSize: randRange(ENEMY_WAVES_AMPLITUDE_MIN,ENEMY_WAVES_AMPLITUDE_MAX),
				freq: randRange(ENEMY_WAVES_FREQ_MIN,ENEMY_WAVES_FREQ_MAX),
				speed: randRange(ENEMY_SPEED_MIN,ENEMY_SPEED_MAX)};
	newE.x = newE.startX;
	enemyList.push(newE);
}

function drawEnemies() {
	for(var e=0;e<enemyList.length;e++) {
		drawAnimFrame("bug",enemyList[e].x,enemyList[e].y, enemyList[e].frame, ENEMY_DIM,ENEMY_DIM);
	}
}

function moveEnemies() {
	for(var e=0;e<enemyList.length;e++) {
		enemyList[e].x = enemyList[e].startX + enemyList[e].waveSize*
						 Math.cos(enemyList[e].phaseOff*Math.PI+enemyList[e].y*enemyList[e].freq);
		enemyList[e].y += enemyList[e].speed;
		var dx=Math.abs(enemyList[e].x-px);
		var dy=Math.abs(enemyList[e].y-py);
		var dist=dx+dy; // close enough instead of Math.sqrt(dx*dx+dy*dy);
		if(dist< (PLAYER_DIM+ENEMY_DIM)/2) {
			reset();
			break;
		}
		if(enemyList[e].y>GAME_H) {
			enemyList[e].readyToRemove = true;
		}
	}
}

function animateEnemies() {
	for(var e=0;e<enemyList.length;e++) {
		if(++enemyList[e].frame>=ENEMY_FRAMES) {
			enemyList[e].frame = 0;
		}
	}
}