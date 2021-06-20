const ENEMY_BUG = 0;
const ENEMY_SWOOP = 1;

const SPAWN_WITH_NEXT = 0.0;

var islandSpawnSeq = [
	{percDuration:SPAWN_WITH_NEXT,kind:ENEMY_BUG,driftX:-0.7,percXMin:0.8,percXMax:0.9,speed:1.0,wave:10,ticksBetween:20},
	{percDuration:SPAWN_WITH_NEXT,kind:ENEMY_SWOOP,driftX:0.0,percXMin:0.5,percXMax:0.5,speed:2.5,wave:0,ticksBetween:1},
	{percDuration:0.02,kind:ENEMY_BUG,driftX:0.7,percXMin:0.1,percXMax:0.2,speed:1.0,wave:10,ticksBetween:20},
	{percDuration:0.05,kind:ENEMY_SWOOP,driftX:-0.76,percXMin:0.8,percXMax:0.9,speed:2.5,wave:25,ticksBetween:5},
	{percDuration:0.05,kind:ENEMY_BUG,driftX:0.0,percXMin:0.2,percXMax:0.8,speed:0.5,wave:100,ticksBetween:30},
	{percDuration:SPAWN_WITH_NEXT,kind:ENEMY_SWOOP,driftX:-0.9,percXMin:0.95,percXMax:0.95,speed:2.5,wave:0,ticksBetween:2},
	{percDuration:0.07,kind:ENEMY_BUG,driftX:0.8,percXMin:0.1,percXMax:0.3,speed:2.5,wave:5,ticksBetween:2},
	{percDuration:0.1,kind:ENEMY_BUG,driftX:0.4,driftX:0.5,percXMin:0.1,percXMax:0.5,speed:1.5,wave:30,ticksBetween:40},
	{percDuration:0.1,kind:ENEMY_BUG,driftX:0.0,percXMin:0.5,percXMax:0.5,speed:2,wave:50,ticksBetween:3},
	{percDuration:0.1,kind:ENEMY_BUG,driftX:0.0,percXMin:0.1,percXMax:0.9,speed:3,wave:2,ticksBetween:0},
];

var spaceSpawnSeq = [
	{percDuration:0.05,kind:ENEMY_SWOOP,driftX:0.8,percXMin:0.1,percXMax:0.15,speed:1.0,wave:5,ticksBetween:10},
	{percDuration:0.05,kind:ENEMY_BUG,driftX:-0.8,percXMin:0.85,percXMax:0.9,speed:1.0,wave:5,ticksBetween:10},
];

var moonSpawnSeq = [
	{percDuration:0.05,kind:ENEMY_SWOOP,driftX:0.8,percXMin:0.1,percXMax:0.15,speed:1.0,wave:5,ticksBetween:10},
	{percDuration:0.05,kind:ENEMY_BUG,driftX:-0.8,percXMin:0.85,percXMax:0.9,speed:1.0,wave:5,ticksBetween:10},
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

var enemyList=[];

function startLevel(whichLevel) {
    spawnSeqStep = 0;
	levData = JSON.parse(JSON.stringify(whichLevel)); // deep/clean copy since we'll modify it during loading
	var accumPerc = 0; // for recalculating percDuration per section into total up to that point
	for(var i=0; i<levData.length;i++) {
		// special case value used to stack at same time, don't increment those to a cumulative total
		if(levData[i].percDuration != SPAWN_WITH_NEXT) {
			accumPerc+=levData[i].percDuration;
			levData[i].percDuration = accumPerc;
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
	if(levelProgressPerc>levData[spawnSeqStep].percDuration && 
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
	}
}
