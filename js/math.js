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