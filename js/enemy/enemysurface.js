var surfaceList=[];
const SURFACE_ENEMY_DIM = 16;
const SURFACE_ENEMY_FRAMES = 3;
const SURFACE_TURRET_DIM = 10;
const SURFACE_TURRET_FRAMES = 2;
const ENEMY_SPAWN_TRY_COUNT = 100;

function spawnSurfaceEnemies() {
	// TSC - comment to remove later
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
	this.myKind = GROUND_KIND_TANK; // used for level format data
	this.x = startX;
	this.origY = startY;
	this.y = 0;
	this.frame = Math.floor(Math.random()*SURFACE_ENEMY_FRAMES);
	this.bombLockedOn = false; // used to keep upgraded split bombs from homing on same ground target
	this.patrolWaypoints = [{x:startX+0,y:startY+0},
							{x:startX-50,y:startY-50},
							{x:startX+50,y:startY-50}]; // default, mainly shows up in editor
	
	this.loadWaypoints = function(wpData) {
		var howManyWP = wpData.length;
		this.patrolWaypoints = [];
		for(var i=0;i<howManyWP;i++) {
			this.patrolWaypoints.push({x:this.x+wpData[i].x,y:this.origY+wpData[i].y});
		}
		if(this.patrolWaypoints.length>1) { // has rails? start on them
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
		if(debugDraw_surfacePaths && this.patrolWaypoints.length>0 &&  gameState == GAME_STATE_LEVEL_DEBUG) {
			context.strokeStyle="gray";
			context.beginPath();
			context.moveTo(this.patrolWaypoints[0].x,this.patrolWaypoints[0].y-bgDrawY);
			for(var i=1;i<this.patrolWaypoints.length;i++) {
				context.lineTo(this.patrolWaypoints[i].x,this.patrolWaypoints[i].y-bgDrawY);
			}
			context.closePath();
			context.stroke();
		}
		if(this.patrolWaypoints.length>1) {
			drawAnimFrame("frog tank",this.x,this.y, this.frame, SURFACE_ENEMY_DIM,SURFACE_ENEMY_DIM,
				this.drawAngle,
				undefined, heightScale);
		} else {
			drawAnimFrame("turret",this.x,this.y, this.frame, SURFACE_TURRET_DIM,SURFACE_TURRET_DIM,
				this.drawAngle,
				undefined, heightScale);
		}
	}

	this.move = function() {
		if(this.patrolWaypoints.length>1) {
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

		if(this.y < GAME_H) {
			if (120 * Math.random() < 1) {
				new enemyShotClass(this.x, this.y);
			}
		}
	}

	this.animate = function() {
		var framesTotal;
		if(this.patrolWaypoints.length>0) {
			framesTotal = SURFACE_ENEMY_FRAMES;
		} else {
			framesTotal = SURFACE_TURRET_FRAMES;
		}
		if(++this.frame>=framesTotal) {
			this.frame = 0;
		}
	}
}