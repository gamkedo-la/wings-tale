var surfaceList=[];
const SURFACE_ENEMY_DIM = 10;
const SURFACE_ENEMY_FRAMES = 2;

function spawnSurfaceEnemies() {
	surfaceList.push(new surfaceEnemyClass(201,259));
	surfaceList.push(new surfaceEnemyClass(110,592));
	surfaceList.push(new surfaceEnemyClass(58,744));
	surfaceList.push(new surfaceEnemyClass(131,631));
	surfaceList.push(new surfaceEnemyClass(151,731));
	surfaceList.push(new surfaceEnemyClass(201,831));
}

surfaceEnemyClass.prototype = new moveDrawClass();

function surfaceEnemyClass(startX,startY) {
	this.x = startX;
	this.origY = startY;
	this.y = 0;
	this.frame = Math.random()*SURFACE_ENEMY_FRAMES;

	this.draw = function() {
		this.y = this.origY-bgDrawY;
		drawAnimFrame("turret",this.x,this.y, this.frame, SURFACE_ENEMY_DIM,SURFACE_ENEMY_DIM);
	}

	this.move = function() {
		if(this.y > GAME_H) {
			this.readyToRemove = true;
		} else {
			if (120 * Math.random() < 1) {
				new enemyShotClass(this.x, this.y);
			}
		}
	}

	this.animate = function() {
		if(++this.frame>=SURFACE_ENEMY_FRAMES) {
			this.frame = 0;
		}
	}
}