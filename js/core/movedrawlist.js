
function drawList(whichList) {
	for(var i=0;i<whichList.length;i++) {
		whichList[i].draw();
		if(debugDraw_colliders) {
			drawColl(whichList[i],"lime");
		}
	}
}

function moveList(whichList) {
	for(var i=whichList.length-1;i>=0;i--) {
		whichList[i].move();
		if (whichList[i].readyToRemove) {
			if(whichList[i].neverRemove) {
				whichList[i].readyToRemove = false;
			} else {
				whichList.splice(i, 1);
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

// explosion will be on center of B position, so make second list enemy etc. instead of shot
function listCollideExplode(listA, listB, optionalResultFunction) {
	for(var a=0;a<listA.length;a++) {
		for(var b=0;b<listB.length;b++) {
			var dist=approxDist(listA[a].x,listA[a].y,listB[b].x,listB[b].y);

			var collisionRange = (listA[a].collDim + listB[b].collDim)/2;

			if(dist< collisionRange) {
				//explode at impact site!
				spawnSplode(listB[b].x,listB[b].y);

				if (listA[a].readyToRemove == false &&
						listB[b].readyToRemove == false &&
						typeof optionalResultFunction !== 'undefined') {
					optionalResultFunction(listA[a],listB[b]);
				}
				
				//remove both
				listA[a].readyToRemove = true;
				listB[b].readyToRemove = true;
					
				break; // break since don't compare against any others for this removed one
			}
		} // listB
	} // listA
}

function listCollideRangeOfPoint(listA, atX, atY, pointRadius, optionalResultFunction) {
	for(var a=0;a<listA.length;a++) {
		var dist=approxDist(listA[a].x,listA[a].y,atX,atY);

		if(dist< listA[a].collDim/2+pointRadius) {
			spawnSplode(listA[a].x,listA[a].y);
			
			if (listA[a].readyToRemove == false && // prevent multiple hits to same target in frame from spawning powerups etc
					typeof optionalResultFunction !== 'undefined') {
				optionalResultFunction(listA[a]);
			}

			listA[a].readyToRemove = true;			
			// break; // NOTE: specifically no break, used for bomb etc. so same one could take out multiple!
		}
	} // listA
}

function moveDrawClass(startX,startY) {
	this.x = startX;
	this.y = startY;
	this.collDim = 20; // can override with separate collW and collH if not roundish
	this.readyToRemove = false;

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