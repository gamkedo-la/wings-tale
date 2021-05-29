function randRange(min,max) {
	return min+Math.random()*(max-min);
}

// to go from -5 to "5 degrees left of player ship facing north"
function degToShipRad(degAng) {
	return ((degAng-90) * Math.PI/180.0);
}
