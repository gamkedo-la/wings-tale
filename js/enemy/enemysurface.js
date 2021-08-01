var surfaceList=[];
const SURFACE_ENEMY_DIM = 10;
const SURFACE_ENEMY_FRAMES = 2;
const ENEMY_SPAWN_TRY_COUNT = 100;

const GROUND_KIND_TANK = 0;
const GROUND_KIND_TENTACLE = 1;

function spawnSurfaceEnemies() {
	
	// was used for random gen in early stages, now replaced by level data

	/*
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
	*/

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
	
	this.loadWaypoints = function(wpData) {
		var howManyWP = wpData.length;

		for(var i=0;i<howManyWP;i++) {
			this.patrolWaypoints.push({x:this.x+wpData[i].x,y:this.origY+wpData[i].y});
		}
		if(this.patrolWaypoints.length>0) { // has rails? start on them
			this.x = this.patrolWaypoints[0].x;
			this.origY = this.patrolWaypoints[0].y;
		} else if(howManyWP==1) { // single point, so no waypoints
			this.patrolWaypoints = [];
		}		
	}

	this.waypointIndex=0;
	this.speed = randRange(0.5,0.85);
	this.drawAngle = 0; // only used if doing waypoints

	this.draw = function() {
		this.y = this.origY-bgDrawY;
		var heightHere = depthAt(this.x,this.origY);
		var heightScale = 0.8+0.9*(heightHere/255.0);
		if(debugDraw_surfacePaths && this.patrolWaypoints.length>0) {
			context.strokeStyle="gray";
			context.beginPath();
			context.moveTo(this.patrolWaypoints[0].x,this.patrolWaypoints[0].y-bgDrawY);
			for(var i=1;i<this.patrolWaypoints.length;i++) {
				context.lineTo(this.patrolWaypoints[i].x,this.patrolWaypoints[i].y-bgDrawY);
			}
			context.closePath();
			context.stroke();
		}
		drawAnimFrame("turret",this.x,this.y, this.frame, SURFACE_ENEMY_DIM,SURFACE_ENEMY_DIM,
				this.drawAngle,
				undefined, heightScale);
	}

	this.move = function() {
		if(this.patrolWaypoints.length>0) {
			var currentWaypoint = this.patrolWaypoints[this.waypointIndex];
			var angTo = Math.atan2((currentWaypoint.y - this.origY), (currentWaypoint.x - this.x));
			this.drawAngle = angTo;
			this.x += Math.cos(angTo)*this.speed;
			this.origY += Math.sin(angTo)*this.speed;

			if ( approxDist(this.x,this.origY,currentWaypoint.x,currentWaypoint.y) < 5 ) {
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