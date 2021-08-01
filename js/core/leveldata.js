const ENEMY_BUG = 0;
const ENEMY_SWOOP = 1;
const ENEMY_STALL_CHASE = 2;
const ENEMY_SHOCK = 3;
const ENEMY_KINDS = 4;
var enemySpawnDebugColor = ["lime","yellow","cyan","pink"];

const GROUND_KIND_TANK = 0;
const GROUND_KIND_TENTACLE = 1;
const GROUND_KINDS = 2;

const SPAWN_WITH_NEXT = 0.0;
const NO_DEPTH_LOOKUP_DEFAULT_HEIGHT = 128;
const DEPTH_FOR_UNDERWATER = 3;
const DEPTH_FOR_GROUND = 60;

function depthAt(atX,atY) {
	let w = images[curDepthMap].width;
	let index = (atY>>0) * w + (atX>>0);
	return depthSpawnData?depthSpawnData.data[index*4+1]:NO_DEPTH_LOOKUP_DEFAULT_HEIGHT;
}

var islandSpawnSeq =
[
	{"groundData":[
		{"groundKind":0,"x":120,"y":2900,"track":[{"x":0,"y":0},{"x":-70,"y":0},{"x":-80,"y":-40}]},
		{"groundKind":1,"x":228,"y":2950}
	]},
	{"percDuration":0.05,"kind":2,"driftX":0.3,"percXMin":0.3,"percXMax":0.4,"speed":3,"wave":10,"ticksBetween":20},{"percDuration":0,"kind":0,"driftX":-0.7,"percXMin":0.8,"percXMax":0.9,"speed":1,"wave":10,"ticksBetween":20},{"percDuration":0,"kind":1,"driftX":0,"percXMin":0.5,"percXMax":0.5,"speed":2.5,"wave":0,"ticksBetween":1},{"percDuration":0.02,"kind":0,"driftX":0.7,"percXMin":0.1,"percXMax":0.2,"speed":1,"wave":10,"ticksBetween":20},{"percDuration":0.05,"kind":1,"driftX":-0.76,"percXMin":0.8,"percXMax":0.9,"speed":2.5,"wave":25,"ticksBetween":5},{"percDuration":0.05,"kind":0,"driftX":0,"percXMin":0.2,"percXMax":0.8,"speed":0.5,"wave":100,"ticksBetween":30},{"percDuration":0,"kind":1,"driftX":-0.9,"percXMin":0.95,"percXMax":0.95,"speed":2.5,"wave":0,"ticksBetween":2},{"percDuration":0.07,"kind":0,"driftX":0.8,"percXMin":0.1,"percXMax":0.3,"speed":2.5,"wave":5,"ticksBetween":2},{"percDuration":0.1,"kind":0,"driftX":0.5,"percXMin":0.1,"percXMax":0.5,"speed":1.5,"wave":30,"ticksBetween":40},{"percDuration":0.1,"kind":0,"driftX":0,"percXMin":0.5,"percXMax":0.5,"speed":2,"wave":50,"ticksBetween":3},{"percDuration":0.1,"kind":0,"driftX":0,"percXMin":0.1,"percXMax":0.9,"speed":3,"wave":2,"ticksBetween":0}];

var spaceSpawnSeq = [
	{"groundData":[
		{"groundKind":0,"x":120,"y":2900,"track":[{"x":0,"y":0},{"x":-70,"y":0},{"x":-80,"y":-40}]}
	]},
	{percDuration:0.05,kind:ENEMY_SHOCK,driftX:0.8,percXMin:0.1,percXMax:0.15,speed:1.0,wave:5,ticksBetween:10},
	{percDuration:0.05,kind:ENEMY_BUG,driftX:-0.8,percXMin:0.85,percXMax:0.9,speed:1.0,wave:5,ticksBetween:10},
];

var moonSpawnSeq = [
	{"groundData":[
		{"groundKind":0,"x":120,"y":3650,"track":[{"x":0,"y":0},{"x":-70,"y":0},{"x":-80,"y":-40}]}
	]},
	{percDuration:0.5,kind:ENEMY_SWOOP,driftX:0.8,percXMin:0.1,percXMax:0.15,speed:1.0,wave:5,ticksBetween:2000},
	{percDuration:0.5,kind:ENEMY_BUG,driftX:-0.8,percXMin:0.85,percXMax:0.9,speed:1.0,wave:5,ticksBetween:2000},
];

var levSeq = [islandSpawnSeq,
            spaceSpawnSeq,
            moonSpawnSeq];

var levelProgressInPixels = 0;
var levelProgressPerc = 0; // gets updated based on levelProgressInPixels
var levelProgressRate = 0.6;
var bgDrawY = 0; // also used for drawing and collision of surface enemies

const LEVEL_ISLAND = 0;
const LEVEL_SPACE = 1;
const LEVEL_MOON = 2;
var levNow = 0;
var levNames = ['level island','level space','level moon'];
var currentLevelImageName = levNames[levNow];

var levData = [];
var spawnSeqStep = 0; // which step of the spawner have we progressed to
var sameTimeSpawnSteps = [];
var sameTimeSpawnTicks = [];
var spawnRanges = [];
var enemyList=[];

function JSONSurfaceSpawnData() {
	var groundJSON = {groundData:[]};
	for(var i=0;i<surfaceList.length;i++) {
		var nextGround = {groundKind:surfaceList[i].myKind,
			x: Math.floor(surfaceList[i].x),
			y: Math.floor(surfaceList[i].origY)};
		if(surfaceList[i].patrolWaypoints) {
			nextGround.track = [];
			for(var ii=0;ii<surfaceList[i].patrolWaypoints.length;ii++) {
				// console.log(surfaceList[i].patrolWaypoints[ii].y, nextGround.y);
				nextGround.track[ii] = 
					{x:Math.floor(surfaceList[i].patrolWaypoints[ii].x - nextGround.x),
						y:Math.floor(surfaceList[i].patrolWaypoints[ii].y - nextGround.y)};
			}
		}

		groundJSON.groundData.push( nextGround );
	}
	return groundJSON;
}

function groundTypeToObject(kind,atX,atY) {
	var returnObj = null;
	switch(kind) {
		case GROUND_KIND_TANK:
			returnObj = new surfaceEnemyClass(atX,atY);
			break;
		case GROUND_KIND_TENTACLE:
			returnObj = new tentacleClass(atX,atY);
			break;
		default:
			console.log("unrecognized ground type for value: "+kind);
			break;
	}
	return returnObj;
}

// note: should only be called right after making a fresh copy to levData, modifies it
function processAndRemoveGroundLevelData() {
	var levelSpawnData = levData[0].groundData;
	surfaceList = [];

	let w = images[curDepthMap].width;
	let h = images[curDepthMap].height;

	var nextSpawn;

	for(var i=0;i<levelSpawnData.length;i++) {
		nextSpawn = groundTypeToObject(levelSpawnData[i].groundKind,
										levelSpawnData[i].x,levelSpawnData[i].y);

		if(levelSpawnData[i].groundKind==GROUND_KIND_TANK) {
			nextSpawn.loadWaypoints(levelSpawnData[i].track);
		}
		surfaceList.push(nextSpawn);
	}

	levData.splice(0,1); // cut out the ground spawn data, it's different format, leaves just sky spawn behind for level/editor code
}

function startLevel(whichLevel) {
    spawnSeqStep = 0;

	levData = JSON.parse(JSON.stringify(whichLevel)); // deep/clean copy since we'll modify it during loading
	processAndRemoveGroundLevelData();

	updateSpawnPercRanges();	
}

function updateSpawnPercRanges() {
	var accumPerc = 0; // for recalculating percDuration per section into total up to that point
	spawnRanges = [];
	for(var i=0; i<levData.length;i++) {
		if(levData[i].percDuration != SPAWN_WITH_NEXT) {
			accumPerc+=levData[i].percDuration;
			spawnRanges[i] = accumPerc;
		} else {
			spawnRanges[i] = SPAWN_WITH_NEXT;
		}
	}
}

var enemySpawnTickCount = 0;
var stepPerc = 0;
function spawnEnemyUpdate() {
	if (gameState != GAME_STATE_PLAY || levelProgressPerc >= 0.99)
	{
		return;
	}
	
	if(levelProgressPerc>spawnRanges[spawnSeqStep] && 
		spawnSeqStep<levData.length-1 ) { // so last one will go until end of stage

		sameTimeSpawnSteps.length = 0;
		sameTimeSpawnTicks.length = 0;
		while(levData[spawnSeqStep].percDuration == SPAWN_WITH_NEXT &&
				spawnSeqStep < levData.length) {
			sameTimeSpawnSteps.push(levData[spawnSeqStep]);
			sameTimeSpawnTicks.push(0);
			spawnSeqStep++;
			if(spawnSeqStep == levData.length-1){
				console.log("LEVEL FORMAT ISSUE: shouldn't end on a SPAWN_WITH_NEXT percDuration");
			}
			// console.log("extra spawn track starting");
		}
		if(sameTimeSpawnSteps.length == 0){ // none being stacked? advance anyway
			spawnSeqStep++;
		}
		// console.log("===="+spawnSeqStep + " at perc " +levelProgressPerc);
	}
	if(spawnSeqStep==0) {
		stepPerc = levelProgressPerc/levData[spawnSeqStep].percDuration;
	} else if(spawnSeqStep < levData.length) {
		stepPerc = (levelProgressPerc-levData[spawnSeqStep-1].percDuration)/
					(levData[spawnSeqStep].percDuration-levData[spawnSeqStep-1].percDuration); 
		if(stepPerc>1) { // ex. ran out of level description, so freeze it after drift
			stepPerc=1;
		}
	} else {
		stepPerc = 0;
	}
	// console.log("stepPerc is "+stepPerc);

	if(enemySpawnTickCount-- < 0) {
		enemySpawnTickCount=levData[spawnSeqStep].ticksBetween;
		spawnKind(levData[spawnSeqStep]);
	}
	// code below could probably be merged with code above, but separate at first for overlapping spawn sets
	for(var i=0;i<sameTimeSpawnSteps.length;i++) {
		if(sameTimeSpawnTicks[i]-- < 0) {
			sameTimeSpawnTicks[i]=sameTimeSpawnSteps[i].ticksBetween;
			spawnKind(sameTimeSpawnSteps[i]);
		}
	}
} // end of spawnEnemyUpdate function

function spawnKind(usingStep) {
	switch(usingStep.kind) {
		case ENEMY_BUG:
			enemyList.push(new enemyWaveBugClass(usingStep));
			break;
		case ENEMY_SWOOP:
			enemyList.push(new enemySwoopAtClass(usingStep));
			break;
		case ENEMY_STALL_CHASE:
			enemyList.push(new enemyStallChaseClass(usingStep));
			break;
		case ENEMY_SHOCK:
			enemyList.push(new enemyShockBallClass(usingStep));
			break;
	}
}
