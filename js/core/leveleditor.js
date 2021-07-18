var editorClicked = false;

function editorHandleClick() {
	if(mouseOverEditorButtonIdx != -1) {
      editButtons[mouseOverEditorButtonIdx].func();
  } else {
      editorClicked = true; // change selection
  }
}

function editPlay() {
	gameState = GAME_STATE_PLAY;
  reset();
  readyToReset = true;
}

function editExtra() {
  console.log("undefined button");
}

function editKind() {
	if(mouseOverLevData != -1) {
		levData[mouseOverLevData].kind++;
		if(levData[mouseOverLevData].kind>= ENEMY_KINDS) {
			levData[mouseOverLevData].kind=0;
		}
	}
}
function editAddLayer() {
	if(mouseOverLevData != -1) {
		levData.splice(mouseOverLevData, 0, JSON.parse(JSON.stringify(editorAddLevelRowWithNext)));
    updateSpawnPercRanges();
  }
}
function editDelete() {
	if(mouseOverLevData != -1) {
		levData.splice(mouseOverLevData, 1);
    updateSpawnPercRanges();
  }
}
function editInsert() {
	if(mouseOverLevData != -1) {
		levData.splice(mouseOverLevData, 0, JSON.parse(JSON.stringify(editorAddLevelRowNew)));
    updateSpawnPercRanges();
  }
}

// used for both draw and mouse overlap detection
var editButtonDim = 40;
var editButtonX = 50;
var editButtonY = SCALED_H-editButtonDim-20;
var mouseOverEditorButtonIdx = -1;
var editButtons = [
{name:"PLAY",func:editPlay},
{name:"OUT",func:printLevelSeq},
{name:"MOVE",func:editExtra},
{name:"DRIFT",func:editExtra},
{name:"TIME",func:editExtra},
{name:"FREQ",func:editExtra},
{name:"WIDTH",func:editExtra},
{name:"KIND",func:editKind},
{name:"INSERT",func:editInsert},
{name:"DEL",func:editDelete},
{name:"LAYER",func:editAddLayer}
];

function editorButtons() {
  scaledCtx.font = "10px Helvetica";
  scaledCtx.beginPath();
  scaledCtx.strokeStyle = "gray";

  mouseOverEditorButtonIdx = -1; // forget moused over editor option
  for (var i = 0; i < editButtons.length; i++) {
  	var buttonX = editButtonX+i*editButtonDim;
    if(pointInBox(unscaledMouseX, unscaledMouseY, buttonX,editButtonY,editButtonDim,editButtonDim)) {
    	mouseOverEditorButtonIdx = i;
    	scaledCtx.fillStyle = "gray";
    } else {
    	scaledCtx.fillStyle = "black";
	}
    scaledCtx.fillRect(buttonX, editButtonY,editButtonDim,editButtonDim);
    scaledCtx.rect(buttonX, editButtonY,editButtonDim,editButtonDim);
    scaledCtx.fillStyle = "white";
    scaledCtx.fillText(editButtons[i].name, buttonX+4, editButtonY+20);
  }

  scaledCtx.stroke();
}

// added on insert in editor, defined here to keep weird json syntax all in one place 
var editorAddLevelRowNew = {percDuration:0.04,kind:ENEMY_BUG,driftX:0.0,percXMin:0.4,percXMax:0.6,speed:1.0,wave:5,ticksBetween:10};
var editorAddLevelRowWithNext = JSON.parse(JSON.stringify(editorAddLevelRowNew)); // identical, but will replace...
editorAddLevelRowWithNext.percDuration = SPAWN_WITH_NEXT; // duration to stay with next one

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
	if(newMousedOver != -1 && mouseOverLevData != newMousedOver && editorClicked) {
		mouseOverLevData = newMousedOver;
		editorClicked = false;
	}
}
