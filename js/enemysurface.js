var surfaceList=[];
const SURFACE_ENEMY_DIM = 10;
const SURFACE_ENEMY_FRAMES = 2;

function spawnSurfaceEnemies() {
	surfaceList.push(new surfaceEnemyClass(201,259));
	surfaceList.push(new surfaceEnemyClass(110,592));
	surfaceList.push(new surfaceEnemyClass(58,744));
	surfaceList.push(new surfaceEnemyClass(201,831));
}

function drawSurfaceEnemies() {
	for(var e=0;e<surfaceList.length;e++) {
		surfaceList[e].draw();
	}
}

function moveSurfaceEnemies() {
	for(var e=0;e<surfaceList.length;e++) {
		surfaceList[e].move();
	}
}


function animateSurfaceEnemies() {
	for(var e=0;e<surfaceList.length;e++) {
		surfaceList[e].animate();
	}
}

function surfaceEnemyClass(startX,startY) {
	this.x = startX;
	this.y = startY;
	this.frame = Math.random()*SURFACE_ENEMY_FRAMES;
	this.draw = function() {
		drawAnimFrame("turret",this.x,this.y-bgDrawY, this.frame, SURFACE_ENEMY_DIM,SURFACE_ENEMY_DIM);
	}

	this.move = function() {
		if(this.y>GAME_H) {
			this.readyToRemove = true;
		}
	}

	this.animate = function() {
		if(++this.frame>=SURFACE_ENEMY_FRAMES) {
			this.frame = 0;
		}
	}
}