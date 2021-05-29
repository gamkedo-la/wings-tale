
function drawList(whichList) {
	for(var i=0;i<whichList.length;i++) {
		whichList[i].draw();
	}
}

function moveList(whichList) {
	for(var i=whichList.length-1;i>=0;i--) {
		whichList[i].move();
		if (whichList[i].readyToRemove) {
			whichList.splice(i, 1);
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
function listCollideExplode(listA, listB, collisionRange, optionalResultFunction) {
	for(var a=0;a<listA.length;a++) {
		for(var b=0;b<listB.length;b++) {
			var dx=Math.abs(listA[a].x-listB[b].x);
			var dy=Math.abs(listA[a].y-listB[b].y);
			var dist=dx+dy; // no need to bring sqrt into this, but correct would be Math.sqrt(dx*dx+dy*dy);
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

function listCollideRangeOfPoint(listA, atX, atY, collisionRange, optionalResultFunction) {
	for(var a=0;a<listA.length;a++) {
		var dx=Math.abs(listA[a].x-atX);
		var dy=Math.abs(listA[a].y-atY);
		var dist=dx+dy; // no need to bring sqrt into this, but correct would be Math.sqrt(dx*dx+dy*dy);
		if(dist< collisionRange) {
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
	this.readyToRemove = false;
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