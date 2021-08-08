var editorClicked = false;
var mouseOverLevData=-1;
var surfaceSelected = -1;
var surfaceWaypointSelected = -1;
var hideSkySpawnerLayer = false;

// used for both draw and mouse overlap detection
var editButtonDim = 40;
var editButtonX = 50;
var editButtonY = SCALED_H-editButtonDim-20;
var mouseOverEditorButtonIdx = -1;
const DRAG_MODE_NONE = 0;
const DRAG_MODE_MOVE = 1;
const DRAG_MODE_DRIFT = 2;
var dragMode = DRAG_MODE_NONE;

const EDIT_SPAWNTRACK_DRAGGING_DIM = 7;

const EDIT_BUTTON_NO_SELECTION = 2; // after this are red/unavailable with no selection
var editButtons = [ // match to constants above for highlight when in drag modes
{name:"PLAY",func:editPlay},
{name:"OUT",func:printLevelSeq},
{name:"LAYER",func:editChangeLayer},
//{name:"MOVE",func:editMove},
//{name:"DRIFT",func:editDrift},
{name:"KIND",func:editKind},
{name:"INSERT",func:editInsert},
{name:"DEL",func:editDelete},
{name:"EXTRA",func:editAddExtra}
];

// added on insert in editor, defined here to keep weird json syntax all in one place 
var editorAddLevelRowNew = {percDuration:0.04,kind:ENEMY_BUG,driftX:0.0,percXMin:0.4,percXMax:0.6,speed:1.0,wave:5,ticksBetween:10};
var editorAddLevelRowWithNext = JSON.parse(JSON.stringify(editorAddLevelRowNew)); // identical, but will replace...
editorAddLevelRowWithNext.percDuration = SPAWN_WITH_NEXT; // duration to stay with next one
var newMousedOver = -1;


function editorText() {
	var debugLineY = 20;
	var debugLineSkip = 10;
	var padding = 5;

	var editorLines = [
	"Editor keys:",
	"mouse click: select segment or surface unit",
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

function editorDraw() {
	drawBackground();
      drawList(surfaceList);
      if(surfaceSelected != -1) {
        drawBox(surfaceList[surfaceSelected].x,surfaceList[surfaceSelected].y,SURFACE_ENEMY_DIM,"pink");
        if(surfaceWaypointSelected != -1) {
          drawBox(surfaceList[surfaceSelected].patrolWaypoints[surfaceWaypointSelected].x,
            surfaceList[surfaceSelected].patrolWaypoints[surfaceWaypointSelected].y-bgDrawY,
            SURFACE_ENEMY_DIM/2,"lime");
        }
      }
	  if(hideSkySpawnerLayer == false) {
      	drawLevelSpawnData();
	  }
	  handleEditorClick();
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

function editKind() {
	dragMode = DRAG_MODE_NONE;
	if(surfaceSelected != -1) {
		surfaceWaypointSelected = -1; // avoid losing waypoint in kind change
		surfaceList[surfaceSelected].myKind++;
		if(surfaceList[surfaceSelected].myKind>= GROUND_KINDS) {
			surfaceList[surfaceSelected].myKind=0;
		}

		// have to regenerate it, since we use whole actual ground instances in the editor
		surfaceList[surfaceSelected] = groundTypeToObject(surfaceList[surfaceSelected].myKind,
			surfaceList[surfaceSelected].x,surfaceList[surfaceSelected].origY);

	} else if(mouseOverLevData != -1) {
		levData[mouseOverLevData].kind++;
		if(levData[mouseOverLevData].kind>= ENEMY_KINDS) {
			levData[mouseOverLevData].kind=0;
		}
	}
}

function editAddExtra() {
	dragMode = DRAG_MODE_NONE;
	if(mouseOverLevData != -1) {
		levData.splice(mouseOverLevData, 0, JSON.parse(JSON.stringify(editorAddLevelRowWithNext)));
		updateSpawnPercRanges();
  } else if(surfaceSelected != -1) {
  	editInsert();
  	console.log("intended for sky spawns, currently same as \"insert\" for ground");
  }
}
function editChangeLayer() {
	hideSkySpawnerLayer = !hideSkySpawnerLayer;
	mouseOverLevData = -1;
	surfaceWaypointSelected = -1;
}
function editDelete() {
	dragMode = DRAG_MODE_NONE;
	if(surfaceSelected != -1) {
		if(surfaceWaypointSelected > 0) { // -1 means none, 0 is root object
			surfaceList[surfaceSelected].patrolWaypoints.splice(surfaceWaypointSelected,1);
			surfaceWaypointSelected--;
		} else { // root selected, delete whole object
			surfaceList.splice(surfaceSelected, 1);
			surfaceSelected = -1;
			surfaceWaypointSelected = -1;
		}
	} else if(mouseOverLevData != -1) {
		levData.splice(mouseOverLevData, 1);
		mouseOverLevData = -1;
    	updateSpawnPercRanges();
	}
}
function editInsert() {
	dragMode = DRAG_MODE_NONE;
	if(surfaceSelected != -1) {
		if(surfaceWaypointSelected > 0) { // -1 means none, 0 is root object
			var thisPt = surfaceList[surfaceSelected].patrolWaypoints[surfaceWaypointSelected];
			surfaceList[surfaceSelected].patrolWaypoints.splice(surfaceWaypointSelected,0,
				{x:thisPt.x+20,y:thisPt.y-15});
				surfaceWaypointSelected++;
		} else { // root selected, spawn whole object
			var surfaceNewCopy = new tentacleClass( surfaceList[surfaceSelected].x+30,
													surfaceList[surfaceSelected].origY);
			surfaceList.push(surfaceNewCopy);
			surfaceWaypointSelected = -1; // avoid accidental selection of non-existent waypoint
			surfaceSelected = surfaceList.length-1;
		}
	} else if(mouseOverLevData != -1) {
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
    } else if(i > EDIT_BUTTON_NO_SELECTION && surfaceSelected == -1 && mouseOverLevData == -1) {
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
		case KEY_Q:
			if(mouseOverLevData != -1) {
				levData[mouseOverLevData].ticksBetween++;
			}
			break;
		case KEY_E:
			if(mouseOverLevData != -1) {
				levData[mouseOverLevData].ticksBetween--;
				if (levData[mouseOverLevData].ticksBetween < 0) {
					levData[mouseOverLevData].ticksBetween = 0;
				}
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
	// accounts close to stretch difference, note: not proportional since graphics stretch isn't, either
	var scaleDragPixelsX = 0.3;
	var scaleDragPixelsY = 0.4;
	switch(dragMode) {
		case DRAG_MODE_MOVE:
			if(surfaceSelected != -1) {
				// moving main body, no waypoints or first selected
				if(surfaceWaypointSelected == -1 || surfaceWaypointSelected == 0 || 
					surfaceList[surfaceSelected].patrolWaypoints == undefined) {
					surfaceList[surfaceSelected].x += dragX*scaleDragPixelsX;
					surfaceList[surfaceSelected].origY += dragY*scaleDragPixelsY;
					// if it has waypoints, keep 0,0 with it
					if(surfaceList[surfaceSelected].patrolWaypoints != undefined) {
						surfaceList[surfaceSelected].patrolWaypoints[0].x = surfaceList[surfaceSelected].x;
						surfaceList[surfaceSelected].patrolWaypoints[0].y = surfaceList[surfaceSelected].origY;
					}
				}
				if(surfaceWaypointSelected != -1) { // patrol point
					surfaceList[surfaceSelected].patrolWaypoints[surfaceWaypointSelected].x += dragX*scaleDragPixelsX;
					surfaceList[surfaceSelected].patrolWaypoints[surfaceWaypointSelected].y += dragY*scaleDragPixelsY;
				}
				
			} else if(mouseOverLevData != -1) {
				editPanSelection(dragX*0.0012);
				editWidthSelection(dragY*0.0003);
			}
			break;
		case DRAG_MODE_DRIFT:
			if(surfaceSelected != -1) {
				surfaceList[surfaceSelected].x += dragX*scaleDragPixelsX;
				surfaceList[surfaceSelected].origY += dragY*scaleDragPixelsY;
				// if it has waypoints, keep 0,0 with it
				if(surfaceList[surfaceSelected].patrolWaypoints != undefined) {
					surfaceList[surfaceSelected].patrolWaypoints[0].x = surfaceList[surfaceSelected].x;
					surfaceList[surfaceSelected].patrolWaypoints[0].y = surfaceList[surfaceSelected].origY;
					for(var i=1;i<surfaceList[surfaceSelected].patrolWaypoints.length;i++) {
						surfaceList[surfaceSelected].patrolWaypoints[i].x += dragX*scaleDragPixelsX;
						surfaceList[surfaceSelected].patrolWaypoints[i].y += dragY*scaleDragPixelsY;
					}
				}
			} else if(mouseOverLevData != -1) {
				editDriftSelection(dragX*0.00135);
				editChangeDuration(dragY*-0.00014);
			}
			break;
	}
}

function printLevelSeq() {
	var levelOut = JSON.parse(JSON.stringify(levData)); // deep/clean copy since we'll modify it during loading
	levelOut.unshift(JSONSurfaceSpawnData());	
	console.log( JSON.stringify(levelOut) );
}

function drawLevelSpawnData() { // for level debug display (may become editable later)
	// stopping 1 from end to draw line forward to next data point
	var mapLength = images[currentLevelImageName].height;
	var frontEdge, backEdge;
	var prevNonSkipI = levData.length-1;
	frontEdge=backEdge=-bgDrawY;
	context.fillStyle = "white";
	newMousedOver=-1;

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

		var minMarginThickness = 0.03; // necessary to see type of thinnest/zero band
		var startXPercMin = levData[i].percXMin-minMarginThickness;
		var endXPercMin = startXPercMin+levData[i].driftX;
		var startXPercMax = levData[i].percXMax+minMarginThickness;
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

		context.setLineDash([1, levData[i].ticksBetween+1]);

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
		context.fillStyle = enemyEditorToPattern[ levData[i].kind ];
		context.globalAlpha = 0.5;
		context.fill();
		context.globalAlpha = 1.0;

		var dragBoxCenterX = 0.5*(startXPercMin+startXPercMax)*GAME_W;
		var dragBoxCenterY = backEdge;
		context.fillStyle = "gray";
		if(approxDist(mouseX,mouseY, dragBoxCenterX,dragBoxCenterY) < EDIT_SPAWNTRACK_DRAGGING_DIM*1.5) {
			if(mouseNewDragStarted) {
				dragMode = DRAG_MODE_MOVE;
				mouseOverLevData = i;
			}
			context.fillStyle = "red";
		}
		context.fillRect(
			dragBoxCenterX-EDIT_SPAWNTRACK_DRAGGING_DIM/2,dragBoxCenterY-EDIT_SPAWNTRACK_DRAGGING_DIM/2,
			EDIT_SPAWNTRACK_DRAGGING_DIM,EDIT_SPAWNTRACK_DRAGGING_DIM
			);

		dragBoxCenterX = 0.5*(endXPercMin+endXPercMax)*GAME_W;
		dragBoxCenterY = frontEdge;		
		context.fillStyle = "lightgray";
		if(approxDist(mouseX,mouseY, dragBoxCenterX,dragBoxCenterY) < EDIT_SPAWNTRACK_DRAGGING_DIM/2) {
			if(mouseNewDragStarted) {
				dragMode = DRAG_MODE_DRIFT;
				mouseOverLevData = i;
			}
			context.fillStyle = "red";
		}
		context.fillRect(
			dragBoxCenterX-EDIT_SPAWNTRACK_DRAGGING_DIM/2,dragBoxCenterY-EDIT_SPAWNTRACK_DRAGGING_DIM/2,
			EDIT_SPAWNTRACK_DRAGGING_DIM,EDIT_SPAWNTRACK_DRAGGING_DIM
			);

		context.fillStyle = "white";
		context.fillText(i,levData[i].percXMin*GAME_W,backEdge);
	}
	
	context.lineWidth = "1"; // leave thin for other routines
}

function handleEditorClick() {
	if(editorClicked || (mouseNewDragStarted && mouseOverEditorButtonIdx == -1)) {
		surfaceWaypointSelected = -1;

		surfaceSelected = -1;
		if(newMousedOver != -1 && mouseOverLevData != newMousedOver && hideSkySpawnerLayer == false) {
			mouseOverLevData = newMousedOver;
		} else {
			for(var i=0;i<surfaceList.length;i++) {
				if(approxDist(mouseX,mouseY,surfaceList[i].x,surfaceList[i].y) < SURFACE_ENEMY_DIM) {
					surfaceSelected = i;
					dragMode = DRAG_MODE_DRIFT;
					mouseOverLevData = -1; // deselect spawn segment, surface selected instead
				}
				if(surfaceList[i].patrolWaypoints != undefined) { // does this one have waypoints ?
					// skip first in this loop, first waypoint is always root (detected above already)
					for(var ii=1;ii<surfaceList[i].patrolWaypoints.length;ii++) {
							if(approxDist(mouseX,mouseY,surfaceList[i].patrolWaypoints[ii].x,
											surfaceList[i].patrolWaypoints[ii].y-bgDrawY) < SURFACE_ENEMY_DIM) {
								surfaceSelected = i;
								surfaceWaypointSelected = ii;
								if(ii == 0) {
									dragMode = DRAG_MODE_DRIFT;
								} else {
									dragMode = DRAG_MODE_MOVE;
								} // end of check for root waypoint
							} // end of checking if mouse is close enough
						} // end of each patrol waypoint
				} // has waypoints?
			} // loop to find if surface element clicked
		} // not changing selected spawn segment

		editorClicked = false;
	}  // end of click for editor to handle
} // end of draw Level Spawner data 
