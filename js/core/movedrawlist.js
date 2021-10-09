const PIXEL_MARGIN_FOR_REMOVING = 100;

function drawList(whichList) {
	for(var i=0;i<whichList.length;i++) {
		whichList[i].draw();
		if(debugDraw_colliders) {
			drawColl(whichList[i],"lime");
		}
	}
}

function moveList(whichList,
					optionalSyncList = undefined) { // for 1:1 list of collider data with bosses
	for(var i=whichList.length-1;i>=0;i--) {
		whichList[i].move();

		if(whichList[i].y > GAME_H + PIXEL_MARGIN_FOR_REMOVING) { // general scroll offscreen culling, to avoid blocking boss spawn
			whichList[i].readyToRemove = true;
		}

		if (whichList[i].readyToRemove) {
			if(whichList[i].neverRemove) {
				whichList[i].readyToRemove = false;
			} else {
				whichList.splice(i, 1);
				if(typeof optionalSyncList !== 'undefined') {
					optionalSyncList.splice(i, 1);
				}
			}
			continue;
		}
	}
}

function animateList(whichList) {
	for(var i=0;i<whichList.length;i++) {
		whichList[i].animate();
	}
}

function handleCollision(objA,objB,optionalResultFunction) {
	spawnSplode(objB.x,objB.y);

	if (objA.readyToRemove == false &&
			objB.readyToRemove == false &&
			typeof optionalResultFunction !== 'undefined') {
		optionalResultFunction(objA,objB);
	}

	checkForHealthToRemove(objA);
	checkForHealthToRemove(objB);
}

// explosion will be on center of B position, so make second list enemy etc. instead of shot
function listCollideExplode(listA, listB, optionalResultFunction) {
	for(var a=0;a<listA.length;a++) {
		for(var b=0;b<listB.length;b++) {
			if(boxOverLap(listA[a],listB[b])) {
				handleCollision(listA[a],listB[b],optionalResultFunction);					
				break; // break since don't compare against any others for this removed one
			}
		} // listB
	} // listA
}

// supposed collList for second list given (originally intended for bosses with multiple colliders)
function listCollideExplode_Sublist(listA, listBWithSublist, optionalResultFunction) {
	for(var a=0;a<listA.length;a++) {
		for(var b=0;b<listBWithSublist.length;b++) {
			if( typeof listBWithSublist[b].collList === 'undefined') { // no sublist? use normal function
				if(boxOverLap(listA[a],listBWithSublist[b])) {
					handleCollision(listA[a],listBWithSublist[b],optionalResultFunction);
				}
			} else {
				for(var c=0;c<listBWithSublist[b].collList.length;c++) {
					if(boxOverLap(listA[a],listBWithSublist[b].collList[c])) {
						handleCollision(listA[a],listBWithSublist[b].collList[c],optionalResultFunction);
						break; // break since don't compare against any others for this removed one
					}
				} // end of for collision sublist
			} // end of else for no collList
		} // listB
	} // listA
}

function listCollideRangeOfPoint(listA, atX, atY, pointRadius, optionalResultFunction) {
	for(var a=0;a<listA.length;a++) {
		var dist=approxDist(listA[a].x,listA[a].y,atX,atY);

		if(dist< listA[a].collW/2+pointRadius) {
			spawnSplode(listA[a].x,listA[a].y);
			
			if (listA[a].readyToRemove == false && // prevent multiple hits to same target in frame from spawning powerups etc
					typeof optionalResultFunction !== 'undefined') {
				optionalResultFunction(listA[a]);
			}

			//listA[a].readyToRemove = true;
			checkForHealthToRemove(listA[a]);			
			// break; // NOTE: specifically no break, used for bomb etc. so same one could take out multiple!
		}
	} // listA
}

function checkForHealthToRemove(listObject) {
	if(typeof listObject.useHealhOfObj !== 'undefined') { // collider for something separate?
		listObject.instance.hitFlashFrames = HIT_FLASH_FRAMECOUNT;
		if (--listObject.useHealhOfObj.health <= 0) {
			listObject.useHealhOfObj.readyToRemove = true;
		}
	} else {
		if (--listObject.health <= 0) {
			listObject.readyToRemove = true;
		}
	}
}

function moveDrawClass(startX,startY) {
    this.frame=0;
	this.x = startX;
	this.y = startY;
	this.collW = this.collH = 20;
	this.readyToRemove = false;
	this.health = 1;

	this.neverRemove = false; // overrides readyToRemove (used for players, respawn only)

	this.draw = function() {
		console.log("missing draw override");
	}
	this.move = function() {
		console.log("missing move override");
	}
	this.animate = function() {
		console.log("missing animate override");
	}
}