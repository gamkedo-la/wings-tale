const ENEMY_BUG = 0;
const ENEMY_SWOOP = 1;
const ENEMY_STALL_CHASE = 2;
var enemySpawnDebugColor = ["lime","yellow","cyan"];

const SPAWN_WITH_NEXT = 0.0;
const NO_DEPTH_LOOKUP_DEFAULT_HEIGHT = 128;
const DEPTH_FOR_UNDERWATER = 3;
const DEPTH_FOR_GROUND = 60;

function depthAt(atX,atY) {
	let w = images[curDepthMap].width;
	let index = (atY>>0) * w + (atX>>0);
	return depthSpawnData?depthSpawnData.data[index*4+1]:NO_DEPTH_LOOKUP_DEFAULT_HEIGHT;
}

// added on insert in editor, defined here to keep weird json syntax all in one place 
var editorAddLevelRowNew = {percDuration:0.04,kind:ENEMY_BUG,driftX:0.0,percXMin:0.4,percXMax:0.6,speed:1.0,wave:5,ticksBetween:10};
var editorAddLevelRowWithNext = JSON.parse(JSON.stringify(editorAddLevelRowNew)); // identical, but will replace...
editorAddLevelRowWithNext.percDuration = SPAWN_WITH_NEXT; // duration to stay with next one

var islandSpawnSeq =
[{"percDuration":0.05,"kind":2,"driftX":0.3,"percXMin":0.3,"percXMax":0.4,"speed":3,"wave":10,"ticksBetween":20},{"percDuration":0,"kind":0,"driftX":-0.7,"percXMin":0.8,"percXMax":0.9,"speed":1,"wave":10,"ticksBetween":20},{"percDuration":0,"kind":1,"driftX":0,"percXMin":0.5,"percXMax":0.5,"speed":2.5,"wave":0,"ticksBetween":1},{"percDuration":0.02,"kind":0,"driftX":0.7,"percXMin":0.1,"percXMax":0.2,"speed":1,"wave":10,"ticksBetween":20},{"percDuration":0.05,"kind":1,"driftX":-0.76,"percXMin":0.8,"percXMax":0.9,"speed":2.5,"wave":25,"ticksBetween":5},{"percDuration":0.05,"kind":0,"driftX":0,"percXMin":0.2,"percXMax":0.8,"speed":0.5,"wave":100,"ticksBetween":30},{"percDuration":0,"kind":1,"driftX":-0.9,"percXMin":0.95,"percXMax":0.95,"speed":2.5,"wave":0,"ticksBetween":2},{"percDuration":0.07,"kind":0,"driftX":0.8,"percXMin":0.1,"percXMax":0.3,"speed":2.5,"wave":5,"ticksBetween":2},{"percDuration":0.1,"kind":0,"driftX":0.5,"percXMin":0.1,"percXMax":0.5,"speed":1.5,"wave":30,"ticksBetween":40},{"percDuration":0.1,"kind":0,"driftX":0,"percXMin":0.5,"percXMax":0.5,"speed":2,"wave":50,"ticksBetween":3},{"percDuration":0.1,"kind":0,"driftX":0,"percXMin":0.1,"percXMax":0.9,"speed":3,"wave":2,"ticksBetween":0}];

var spaceSpawnSeq = [
	{percDuration:0.05,kind:ENEMY_SWOOP,driftX:0.8,percXMin:0.1,percXMax:0.15,speed:1.0,wave:5,ticksBetween:10},
	{percDuration:0.05,kind:ENEMY_BUG,driftX:-0.8,percXMin:0.85,percXMax:0.9,speed:1.0,wave:5,ticksBetween:10},
];

var moonSpawnSeq = [
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

function startLevel(whichLevel) {
    spawnSeqStep = 0;
	levData = JSON.parse(JSON.stringify(whichLevel)); // deep/clean copy since we'll modify it during loading
	
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

function printLevelSeq() {
	console.log( JSON.stringify(levSeq[levNow]) );
}

var mouseOverLevData=-1;

function drawLevelSpawnData() { // for level debug display (may become editable later)
	// stopping 1 from end to draw line forward to next data point
	var mapLength = images[currentLevelImageName].height;
	var frontEdge, backEdge;
	var prevNonSkipI = levData.length-1;
	frontEdge=backEdge=-bgDrawY;
	context.fillStyle = "white";
	var newMousedOver=-1;

	for(var i=levData.length-1; i>=0;i--) { // not bothering to cull, debug draw only
		if(spawnRanges[i] != SPAWN_WITH_NEXT) {
			// step back to find start of this block as previous block's percentage
			var nextLowerPercI = i-1;
			var nextPerc = 0;
			while(spawnRanges[nextLowerPercI] == SPAWN_WITH_NEXT) {
				nextLowerPercI--;
			}
			if(nextLowerPercI<0) {
				nextPerc=0;
			} else {
				nextPerc=spawnRanges[nextLowerPercI];
			}

			frontEdge = backEdge;
			backEdge = (1.0-nextPerc)*mapLength-bgDrawY;
			prevNonSkipI = i;
		}

		context.strokeStyle = enemySpawnDebugColor[levData[i].kind];

		var startXPercMin = levData[i].percXMin;
		var endXPercMin = startXPercMin+levData[i].driftX;
		var startXPercMax = levData[i].percXMax;
		var endXPercMax = startXPercMax+levData[i].driftX;

		if(mouseY>frontEdge && mouseY<backEdge && newMousedOver==-1) {
			var vertRange = backEdge-frontEdge;
			var percOverRange = (mouseY-frontEdge)/vertRange;
			var percOverRangeInv = 1.0-percOverRange;
			var leftX = Math.floor(GAME_W*(startXPercMin*percOverRange+endXPercMin*percOverRangeInv));
			var rightX = Math.floor(GAME_W*(startXPercMax*percOverRange+endXPercMax*percOverRangeInv));
			var extraMargin = 5; // otherwise super thin aren't selectable
			if(leftX - extraMargin < mouseX && mouseX < rightX + extraMargin) {
				newMousedOver = i;
			}
		}

		if(mouseOverLevData == i) { // exaggerate frequency dashes if selected
			context.lineWidth = "7";
		} else {
			context.lineWidth = "4"; // thick for spaced markers showing spawn density
		}

		if(levData[i].ticksBetween > 1) {
			context.setLineDash([1, levData[i].ticksBetween]);
		} else {
			context.setLineDash([]);
		}

		context.beginPath();
		context.moveTo(startXPercMin*GAME_W,backEdge);
		context.lineTo(endXPercMin*GAME_W,frontEdge);
		context.lineTo(endXPercMax*GAME_W,frontEdge);
		context.lineTo(startXPercMax*GAME_W,backEdge);
		context.closePath();
		context.stroke();
		if(mouseOverLevData == i) {  // exaggerate range box if selected
			context.globalAlpha = 0.2;
			context.fillStyle = "white";
			context.fill();
			context.globalAlpha = 1.0;
			context.lineWidth = "3"; // thicker to show selected
		} else {
			context.lineWidth = "1"; // thin for line drawing the min/max/drift edges
		}

		context.setLineDash([]);
		context.beginPath();
		context.moveTo(startXPercMin*GAME_W,backEdge);
		context.lineTo(endXPercMin*GAME_W,frontEdge);
		context.lineTo(endXPercMax*GAME_W,frontEdge);
		context.lineTo(startXPercMax*GAME_W,backEdge);
		context.closePath();
		context.stroke();

		context.fillText(i,levData[i].percXMin*GAME_W,backEdge);
	}
	if(newMousedOver != -1 && mouseOverLevData != newMousedOver) {
		mouseOverLevData = newMousedOver;
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
	}
}
