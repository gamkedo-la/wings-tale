function randRange(min,max) {
	return min+Math.random()*(max-min);
}

function randAng() {
	return Math.random()*Math.PI*2.0;
}
// to go from -5 to "5 degrees left of player ship facing north"
function degToShipRad(degAng) {
	return ((degAng-90) * Math.PI/180.0);
}

function approxDist(x1,y1, x2,y2) {
	return Math.abs(x1-x2)+Math.abs(y1-y2);
}

function lerp(a, b, t){
	return a*(1-t)+b*t;
}

