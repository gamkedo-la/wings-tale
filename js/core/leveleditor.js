var editorClicked = false;

function editorText() {
	var debugLineY = 20;
	var debugLineSkip = 10;
	var padding = 5;
  
	var editorLines = [
	  "Editor keys:",
	  "L: exit editor to play mode",
	  "O: output level to console",
	  "mouse click: select segment",
	  "mousewheel: scroll level view",
	  "Q/E: lower/higher spawn frequency"
	];
  
	scaledCtx.fillStyle = "#00000099";
	scaledCtx.fillRect(
	  20 - padding,
	  debugLineY - padding,
	  250 + padding * 2,
	  debugLineSkip * editorLines.length + padding * 2
	);
  
	scaledCtx.fillStyle = "white";
	scaledCtx.font = "10px Helvetica";
	for (var i = 0; i < editorLines.length; i++) {
	  scaledCtx.fillText(editorLines[i], 20, (debugLineY += debugLineSkip));
	}
  
	editorButtons(); // defined in leveleditor js
  }

function editorHandleClick() {
	if(mouseOverEditorButtonIdx != -1) {
      editButtons[mouseOverEditorButtonIdx].func();
  } else {
      editorClicked = true; // change selection
  }
}

function editPlay() {
  gameState = GAME_STATE_PLAY;
  dragMode = DRAG_MODE_NONE;
  reset();
  readyToReset = true;
}

function editExtra() {
  dragMode = DRAG_MODE_NONE;
  console.log("undefined button");
}

function editKind() {
	dragMode = DRAG_MODE_NONE;
	if(mouseOverLevData != -1) {
		levData[mouseOverLevData].kind++;
		if(levData[mouseOverLevData].kind>= ENEMY_KINDS) {
			levData[mouseOverLevData].kind=0;
		}
	}
}
function editAddLayer() {
	dragMode = DRAG_MODE_NONE;
	if(mouseOverLevData != -1) {
		levData.splice(mouseOverLevData, 0, JSON.parse(JSON.stringify(editorAddLevelRowWithNext)));
    updateSpawnPercRanges();
  }
}
function editDelete() {
	dragMode = DRAG_MODE_NONE;
	if(mouseOverLevData != -1) {
		levData.splice(mouseOverLevData, 1);
    updateSpawnPercRanges();
  }
}
function editInsert() {
	dragMode = DRAG_MODE_NONE;
	if(mouseOverLevData != -1) {
		levData.splice(mouseOverLevData, 0, JSON.parse(JSON.stringify(editorAddLevelRowNew)));
    updateSpawnPercRanges();
  }
}
function editDriftSelection(changeBy) {
	levData[mouseOverLevData].driftX += changeBy;
	if(levData[mouseOverLevData].percXMin+levData[mouseOverLevData].driftX < 0.0) {
		levData[mouseOverLevData].driftX = -levData[mouseOverLevData].percXMin;
	}
	if(levData[mouseOverLevData].percXMax+levData[mouseOverLevData].driftX > 1.0) {
		levData[mouseOverLevData].driftX = 1.0-levData[mouseOverLevData].percXMax;
	}
}
function editPanSelection(changeBy) {
	levData[mouseOverLevData].percXMin += changeBy;
    levData[mouseOverLevData].percXMax += changeBy;
	panBoundsFix();
}
function editWidthSelection(changeBy) {
	levData[mouseOverLevData].percXMin += changeBy;
	levData[mouseOverLevData].percXMax -= changeBy;
	if(levData[mouseOverLevData].percXMin > levData[mouseOverLevData].percXMax) { // no negative
		levData[mouseOverLevData].percXMax = levData[mouseOverLevData].percXMin;
	}
	panBoundsFix();
}
function panBoundsFix() {
	if(levData[mouseOverLevData].percXMin < 0.0) {
		editPanSelection(-levData[mouseOverLevData].percXMin);
	}
	if(levData[mouseOverLevData].percXMax > 1.0) {
		editPanSelection(1.0-levData[mouseOverLevData].percXMax);
	}
}
function editChangeDuration(changeBy) {
	if (mouseOverLevData == -1) {
		return;
	}
	var findValidNearestI = mouseOverLevData;
	while (findValidNearestI < levData.length && levData[findValidNearestI].percDuration == SPAWN_WITH_NEXT) {
		findValidNearestI++;
	}
	if (findValidNearestI < levData.length) {
		levData[findValidNearestI].percDuration += changeBy;
		if (levData[findValidNearestI].percDuration < 0.01) {
			levData[findValidNearestI].percDuration = 0.01;
		}
		updateSpawnPercRanges();
	}
}

// used for both draw and mouse overlap detection
var editButtonDim = 40;
var editButtonX = 50;
var editButtonY = SCALED_H-editButtonDim-20;
var mouseOverEditorButtonIdx = -1;
const DRAG_MODE_NONE = 0;
const DRAG_MODE_MOVE = 1;
const DRAG_MODE_DRIFT = 2;
var dragMode = DRAG_MODE_NONE;

const EDIT_BUTTON_NO_SELECTION = 1;
const EDIT_BUTTON_MOVE = 2;
const EDIT_BUTTON_DRIFT = 3;
var editButtons = [ // match to constants above for highlight when in drag modes
{name:"PLAY",func:editPlay},
{name:"OUT",func:printLevelSeq}, // 1 EDIT_BUTTON_NO_SELECTION
{name:"MOVE",func:editMove}, // 2 EDIT_BUTTON_MOVE
{name:"DRIFT",func:editDrift}, // 3 EDIT_BUTTON_DRIFT
{name:"KIND",func:editKind},
{name:"INSERT",func:editInsert},
{name:"DEL",func:editDelete},
{name:"LAYER",func:editAddLayer}
];

function editMove() {
	dragMode = DRAG_MODE_MOVE;
}
function editDrift() {
	dragMode = DRAG_MODE_DRIFT;
}

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
    } else if( (i==EDIT_BUTTON_MOVE && dragMode == DRAG_MODE_MOVE) || 
				(i==EDIT_BUTTON_DRIFT && dragMode == DRAG_MODE_DRIFT) ) {
    	scaledCtx.fillStyle = "green";
    } else if(i > EDIT_BUTTON_NO_SELECTION && mouseOverLevData == -1) {
    	scaledCtx.fillStyle = "#660000";
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

function editorKeyboard(keyCode) {
	var scootXBy = 0.05;
	var durationChange = 0.01;
	var findValidNearestI = 0;
	validGameKey = true;
	switch (keyCode) { // keys that require selection
		case KEY_LEFT:
			editPanSelection(-scootXBy);
			break;
		case KEY_RIGHT:
			editPanSelection(scootXBy);
			break;
		case KEY_MINUS:
			editDelete();
			break;
		case KEY_EQUALS:
			editAddLayer();
			break;
		case KEY_0:
			editInsert();
			break;
		case KEY_Q:
			levData[mouseOverLevData].ticksBetween += 1;
			break;
		case KEY_E:
			levData[mouseOverLevData].ticksBetween -= 1;
			if (levData[mouseOverLevData].ticksBetween < 0) {
				levData[mouseOverLevData].ticksBetween = 0;
			}
			break;
		default:
			validGameKey = false;
			break;
	}
	return validGameKey;
}
function editorDrag() {
	if(gameState != GAME_STATE_LEVEL_DEBUG) {
		return;
	}
	switch(dragMode) {
		case DRAG_MODE_MOVE:
			editPanSelection(dragX*0.0012);
			editWidthSelection(dragY*0.0003);
			break;
		case DRAG_MODE_DRIFT:
			editDriftSelection(dragX*0.00135);
			editChangeDuration(dragY*-0.00014);
			break;
	}
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
		if(dragMode == DRAG_MODE_NONE) {
			mouseOverLevData = newMousedOver;
		}
		editorClicked = false;
	}
}
