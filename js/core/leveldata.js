const ENEMY_BUG = 0;
const ENEMY_SWOOP = 1;

var islandSpawnSeq = [
	{percDuration:0.05,kind:ENEMY_BUG,driftX:0.5,percXMin:0.2,percXMax:0.3,speed:1.0,wave:10,ticksBetween:20},
	{percDuration:0.1,kind:ENEMY_SWOOP,driftX:-0.76,percXMin:0.8,percXMax:0.9,speed:2.5,wave:25,ticksBetween:5},
	{percDuration:0.1,kind:ENEMY_BUG,driftX:0.0,percXMin:0.2,percXMax:0.8,speed:0.5,wave:100,ticksBetween:30},
	{percDuration:0.1,kind:ENEMY_BUG,driftX:0.8,percXMin:0.1,percXMax:0.3,speed:2.5,wave:5,ticksBetween:2},
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

var enemyList=[];

function startLevel(whichLevel) {
    spawnSeqStep = 0;
	levData = JSON.parse(JSON.stringify(whichLevel)); // deep/clean copy since we'll modify it during loading
	var accumPerc = 0; // for recalculating percDuration per section into total up to that point
	for(var i=0; i<levData.length;i++) {
		accumPerc+=levData[i].percDuration;
		levData[i].percDuration = accumPerc;
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

		spawnSeqStep++;
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
        switch(levData[spawnSeqStep].kind) {
            case ENEMY_BUG:
                enemyList.push(new enemyWaveBugClass());
                break;
            case ENEMY_SWOOP:
                enemyList.push(new enemySwoopAtClass());
                break;
        }
	}
}
