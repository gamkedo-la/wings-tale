
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

// note: for what it's worth, explosion side will be on center of B position, so make second list enemy etc. instead of shot
function listCollideExplode(listA, listB, collisionRange) {
	for(var a=0;a<listA.length;a++) {
		for(var b=0;b<listB.length;b++) {
			var dx=Math.abs(listA[a].x-listB[b].x);
			var dy=Math.abs(listA[a].y-listB[b].y);
			var dist=dx+dy; // no need to bring sqrt into this, but correct would be Math.sqrt(dx*dx+dy*dy);
			if(dist< collisionRange) {
				
				//explode at impact site!
				spawnSplode(listB[b].x,listB[b].y);

				//remove both
				listA[a].readyToRemove = true;
				listB[b].readyToRemove = true;
				
				break; // break since don't compare against any others for this removed one
			}
		} // listB
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