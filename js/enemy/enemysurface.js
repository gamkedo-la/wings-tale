var surfaceList=[];
const SURFACE_ENEMY_DIM = 10;
const SURFACE_ENEMY_FRAMES = 2;
const ENEMY_SPAWN_TRY_COUNT = 60;

function spawnSurfaceEnemies() {
	
	for(let i = 0; i < ENEMY_SPAWN_TRY_COUNT; i++){
		let w = images[curDepthMap].width;
		let h = images[curDepthMap].height;
		let atX = Math.random() * w >> 0; //bitshift to get rid of float
		let atY = Math.random() * h >> 0;

		let index = atY * w + atX;
		//we could easily use another channel of this image and paint to place more specifically,
		//right now I just check if the depth map has green value greater than an arbitrary threshold
		//to make sure they don't spawn over water.  
		let canSpawnHere = depthSpawnData?depthSpawnData.data[index*4+1]:true;  //the green value at this pixel (if missing, assume yes)

		if(canSpawnHere > 60){ //definitely land
			surfaceList.push(new surfaceEnemyClass(atX,atY));
				
		}else if(canSpawnHere < 3) {  //in the water
			surfaceList.push(new tentacleClass(atX, atY));
		}

	}
	// surfaceList.push(new surfaceEnemyClass(201,259));
	// surfaceList.push(new surfaceEnemyClass(110,592));
	// surfaceList.push(new surfaceEnemyClass(58,744));
	// surfaceList.push(new surfaceEnemyClass(131,631));
	// surfaceList.push(new surfaceEnemyClass(151,731));
	// surfaceList.push(new surfaceEnemyClass(201,831));
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