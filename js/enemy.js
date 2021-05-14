var enemyList=[];
const ENEMY_DIM=7;
const ENEMY_SPEED=2;

function spawnEnemy() {
	enemyList.push({x:(0.025+Math.random()*0.95)*canvas.width,y:0});
}

function drawEnemies() {
	context.fillStyle="red";
	for(var e=0;e<enemyList.length;e++) {
		context.fillRect(enemyList[e].x-ENEMY_DIM/2,enemyList[e].y-ENEMY_DIM/2,ENEMY_DIM,ENEMY_DIM);
	}
}

function moveEnemies() {
	for(var e=0;e<enemyList.length;e++) {
		enemyList[e].y += ENEMY_SPEED;
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