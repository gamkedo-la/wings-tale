var surfaceList=[];
const SURFACE_ENEMY_DIM = 10;
const SURFACE_ENEMY_FRAMES = 2;
const ENEMY_SPAWN_TRY_COUNT = 100;

function spawnSurfaceEnemies() {
	let w = images[curDepthMap].width;
	let h = images[curDepthMap].height;
	for(let i = 0; i < ENEMY_SPAWN_TRY_COUNT; i++){
		let atX = Math.random() * w >> 0; //bitshift to get rid of float
		let atY = Math.random() * h >> 0;

		//we could easily use another channel of this image and paint to place more specifically,
		//right now I just check if the depth map has green value greater than an arbitrary threshold
		//to make sure they don't spawn over water.  
		let canSpawnHere = depthAt(atX,atY);  //the green value at this pixel (if missing, assume yes)

		if(canSpawnHere > DEPTH_FOR_GROUND){ //definitely land
			surfaceList.push(new surfaceEnemyClass(atX,atY));
				
		}else if(canSpawnHere < DEPTH_FOR_UNDERWATER) {  //in the water
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
	this.bombLockedOn = false; // used to keep upgraded split bombs from homing on same ground target
	this.patrolWaypoints = [];
	var howManyWP = Math.floor(randRange(0,4));
	for(var i=0;i<howManyWP;i++) {
		var atX,atY;
		var triesBeforeAcceptingUnderwater = 50;
		for(var ii=0;ii<triesBeforeAcceptingUnderwater;ii++) {
			atX = startX+randRange(-60,60);
			atX = Math.max(atX,0);
			atX = Math.min(atX,GAME_W);
			atY = startY+randRange(-60,60);
			if(depthAt(atX,atY) > DEPTH_FOR_GROUND) {
				break;
			}
		}
		this.patrolWaypoints.push({x:atX,y:atY});
	}
	this.waypointIndex=0;
	this.speed = randRange(0.5,0.85);
	this.drawAngle = 0; // only used if doing waypoints

	this.draw = function() {
		this.y = this.origY-bgDrawY;
		drawAnimFrame("turret",this.x,this.y, this.frame, SURFACE_ENEMY_DIM,SURFACE_ENEMY_DIM, this.drawAngle);
	}

	this.move = function() {
		if(this.patrolWaypoints.length>0) {
			var currentWaypoint = this.patrolWaypoints[this.waypointIndex];
			var angTo = Math.atan2((currentWaypoint.y - this.origY), (currentWaypoint.x - this.x));
			this.drawAngle = angTo;
			this.x += Math.cos(angTo)*this.speed;
			this.origY += Math.sin(angTo)*this.speed;

			if ( approxDist(this.x,this.origY,currentWaypoint.x,currentWaypoint.y) < this.speed*4 ) {
				this.waypointIndex++;
				if(this.waypointIndex>=this.patrolWaypoints.length) {
					this.waypointIndex = 0;
				} // loop waypoint
			} // advance waypoint
		} // has waypoints?

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