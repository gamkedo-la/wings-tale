const ENEMY_BUG = 0;
const ENEMY_SWOOP = 1;
const ENEMY_STALL_CHASE = 2;
const ENEMY_SHOCK = 3;
const ENEMY_DIMO = 4;
const ENEMY_SMALLALIEN = 5;
const ENEMY_FIRESNAKE = 6;
const ENEMY_KINDS = 7;
var enemySpawnDebugColor = ["lime","yellow","cyan","pink", "orange", "white", "black"];
var enemyEditorToPattern = [ // string used by level editor to show the graphic in spawn volumes
		"bug", // ENEMY_BUG = 0;
		"swoop", // ENEMY_SWOOP = 1;
		"stallchase", // ENEMY_STALL_CHASE = 2;
		"shockball", // ENEMY_SHOCK = 3;
		"dimo",	//ENEMY_DIM = 5
		"smallalien",	//ENEMY_SMALLALIEN = 6
		"fire snake",	//ENEMY_FIRESNAKE = 7
		// note: none needed for ENEMY_KINDS, that const is aENEMY_KINDS clue for editor to wrap cycling type
	];
// replaces strings in the array with usable pattern data for spawn boxes, only call once at start
function createEditorSpawnKindPatterns() {
	for(var i=0;i<ENEMY_KINDS;i++) {
		enemyEditorToPattern[i] = scaledCtx.createPattern(images[enemyEditorToPattern[i]], 'repeat');
	}	
}

const GROUND_KIND_TANK = 0;
const GROUND_KIND_TENTACLE = 1;
const GROUND_KIND_VOLCANO = 2;
const GROUND_KIND_SPACEFROG = 3;
const GROUND_KINDS = 4;

const SPAWN_WITH_NEXT = 0.0;
const NO_DEPTH_LOOKUP_DEFAULT_HEIGHT = 128;
const DEPTH_FOR_UNDERWATER = 3;
const DEPTH_FOR_GROUND = 60;

function depthAt(atX,atY) {
	let w = images[curDepthMap].width;
	let index = (atY>>0) * w + (atX>>0);
	return depthSpawnData?depthSpawnData.data[index*4+1]:NO_DEPTH_LOOKUP_DEFAULT_HEIGHT;
}

var islandSpawnSeq = [{"groundData":[{"groundKind":1,"x":28,"y":2400},{"groundKind":1,"x":80,"y":2245},{"groundKind":1,"x":232,"y":2130},{"groundKind":1,"x":67,"y":1926},{"groundKind":1,"x":240,"y":1854}]},{"percDuration":0.035659999999999824,"kind":0,"driftX":0.004349999999998867,"percXMin":0.697300000000001,"percXMax":0.697300000000001,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04027999999999988,"kind":0,"driftX":0.012449999999999926,"percXMin":0.3078000000000013,"percXMax":0.3102000000000015,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.06828,"kind":0,"driftX":0.005400000000000002,"percXMin":0.36970000000000086,"percXMax":0.6807000000000011,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.5308000000000009,"percXMax":0.5308000000000009,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":0,"driftX":0.000800000000001124,"percXMin":0.08829999999999817,"percXMax":0.3151000000000013,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.05596000000000003,"kind":0,"driftX":0.011399999999998318,"percXMin":0.735700000000001,"percXMax":0.9523,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04,"kind":0,"driftX":0,"percXMin":0.5281000000000002,"percXMax":0.5305000000000002,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.06520000000000016,"kind":1,"driftX":0.2749500000000009,"percXMin":0.6453999999999995,"percXMax":0.6453999999999995,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.06814000000000014,"kind":1,"driftX":-0.17819999999999991,"percXMin":0.46480000000000066,"percXMax":0.46560000000000024,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.03790000000000003,"kind":0,"driftX":0.008099999999999864,"percXMin":0.2125000000000003,"percXMax":0.7899000000000003,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.6018999999999988,"percXMax":0.6036999999999986,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04,"kind":0,"driftX":0,"percXMin":0.4159000000000023,"percXMax":0.41650000000000237,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0,"kind":0,"driftX":0,"percXMin":0.2196999999999999,"percXMax":0.8282999999999994,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":1,"driftX":0.14880000000000204,"percXMin":0.6849999999999996,"percXMax":0.6957999999999986,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.03860000000000004,"kind":1,"driftX":-0.1718499999999997,"percXMin":0.32199999999999895,"percXMax":0.34199999999999964,"speed":1,"wave":5,"ticksBetween":35},{"percDuration":0.04,"kind":0,"driftX":0,"percXMin":0.06249999999999963,"percXMax":0.947099999999998,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.018579999999999965,"kind":0,"driftX":-0.19480000000000017,"percXMin":0.4986999999999998,"percXMax":0.5445,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.02306000000000001,"kind":0,"driftX":0.15389999999999993,"percXMin":0.6259,"percXMax":0.6525000000000001,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.02390000000000002,"kind":0,"driftX":-0.1836000000000001,"percXMin":0.43359999999999915,"percXMax":0.4679999999999994,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.023759999999999955,"kind":1,"driftX":0.18090000000000006,"percXMin":0.7263999999999994,"percXMax":0.7320000000000012,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.03664,"kind":1,"driftX":-0.23220000000000018,"percXMin":0.3400000000000007,"percXMax":0.36720000000000114,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.023620000000000006,"kind":1,"driftX":-0.14850000000000016,"percXMin":0.3901,"percXMax":0.41309999999999997,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":-0.2780999999999998,"percXMin":0.3825999999999987,"percXMax":0.44699999999999945,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.015080000000000001,"kind":1,"driftX":0.35505000000000003,"percXMin":0.5223999999999999,"percXMax":0.6120000000000003,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":0.36625,"percXMin":0.5157999999999998,"percXMax":0.5873999999999997,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.020819999999999995,"kind":1,"driftX":-0.33924999999999983,"percXMin":0.3897999999999993,"percXMax":0.44459999999999994,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0,"kind":0,"driftX":-0.36585,"percXMin":0.43840000000000046,"percXMax":0.48240000000000066,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.02054000000000001,"kind":1,"driftX":0.3564,"percXMin":0.5730999999999995,"percXMax":0.5983000000000012,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.01154,"kind":0,"driftX":0.08519999999999994,"percXMin":0.7214999999999998,"percXMax":0.7813000000000017,"speed":2.5,"wave":25,"ticksBetween":35}];

var spaceSpawnSeq =
	[{"groundData":[{"groundKind":3,"x":50,"y":2900}]},{"percDuration":0.05,"kind":5,"driftX":0.5,"percXMin":0,"percXMax":0.3,"speed":1,"wave":5,"ticksBetween":10},{"percDuration":0.05,"kind":0,"driftX":-0.8,"percXMin":0.85,"percXMax":0.9,"speed":1,"wave":5,"ticksBetween":10}]
	;
var moonSpawnSeq = 
	[
	{"groundData":[
		{"groundKind":0,"x":120,"y":3650,"track":[{"x":0,"y":0},{"x":-70,"y":0},{"x":-80,"y":-40}]}
	]},{percDuration:0.5,kind:ENEMY_SWOOP,driftX:0.8,percXMin:0.1,percXMax:0.15,speed:1.0,wave:5,ticksBetween:2000},{percDuration:0.5,kind:ENEMY_BUG,driftX:-0.8,percXMin:0.85,percXMax:0.9,speed:1.0,wave:5,ticksBetween:2000},]
;
var lavaSpawnSeq = 
	[{"groundData":[{"groundKind":2,"x":63,"y":3688}]},{"percDuration":0.05,"kind":6,"driftX":0.9,"percXMin":0,"percXMax":0.4,"speed":1,"wave":5,"ticksBetween":15},{"percDuration":0.05,"kind":0,"driftX":-0.8,"percXMin":0.85,"percXMax":0.9,"speed":1,"wave":5,"ticksBetween":10}]
;

var levSeq = [islandSpawnSeq,
            spaceSpawnSeq,
            moonSpawnSeq,
            lavaSpawnSeq];

var levelProgressInPixels = 0;
var levelProgressPerc = 0; // gets updated based on levelProgressInPixels
var levelProgressRate = 0.6;
var bgDrawY = 0; // also used for drawing and collision of surface enemies

const LEVEL_ISLAND = 0;
const LEVEL_SPACE = 1;
const LEVEL_MOON = 2;
const LEVEL_LAVA = 3;
var levNow = 0;
var levNames = ['level island','level space','level moon','level lava'];
var currentLevelImageName = levNames[levNow];

var levData = [];
var spawnSeqStep = 0; // which step of the spawner have we progressed to
var sameTimeSpawnSteps = [];
var sameTimeSpawnTicks = [];
var spawnRanges = [];
var enemyList=[];

function spawnSpecificEnemyAtRandomPosition(enemy){
  var usingStep = {percDuration:randRange(0.01,0.10),kind:enemy,driftX:randRange(-1.0,1.0),percXMin:randRange(0.1,1.0),percXMax:randRange(0.1,1.0),speed:randRange(1.0,2.0),wave:randRange(1,10),ticksBetween:randRange(10,2000)};
  
  spawnKind(usingStep);
}

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
		case GROUND_KIND_VOLCANO:
			returnObj = new volcanoEnemyClass(atX,atY);
			break;
		case GROUND_KIND_SPACEFROG:
			returnObj = new spaceFrogClass(atX,atY);
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
	createDepthSpawnReference();

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
		stepPerc = 1.0+(levelProgressPerc-spawnRanges[spawnSeqStep])/
					(levData[spawnSeqStep].percDuration); 
	} else { // ex. ran out of level description, so freeze it after drift
		stepPerc = 1;
	}
	// console.log("stepPerc is "+stepPerc);

	if(enemySpawnTickCount-- < 0) {
		if(levData[spawnSeqStep] == undefined) {
			console.log("spawn error? crash avoided");
			return;
		}
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
		case ENEMY_DIMO:
			enemyList.push(new enemyDimoClass(usingStep));
			break;
		case ENEMY_SMALLALIEN:
			enemyList.push(new enemySmallAlienClass(usingStep));
			break;
		case ENEMY_FIRESNAKE:
			enemyList.push(new enemyFireSnakeClass(usingStep));
			break;
	}
}
