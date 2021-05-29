
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