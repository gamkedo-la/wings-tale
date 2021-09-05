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

function actualDist(x1,y1, x2,y2) {
	var a = x1-x2;
	var b = y1-y2;
	return Math.sqrt(a*a+b*b);
}

function lerp(a, b, t){
	return a*(1-t)+b*t;
}

function pointInBox(x,y, // coordinate
				l,t,w,h){ // left, top, width, height
	return (x>l && y>t && x<l+w && y<t+h);
}

// note on arguments: not top-left and bottom right coords, but instead
// center coordinate of each and each object's full (not half) width and height
function boxOverLap(obj1,obj2){
	var x1 = obj1.x;
	var y1 = obj1.y;
	var w1 = obj1.collW;
	var h1 = obj1.collH;

	var x2 = obj2.x;
	var y2 = obj2.y;
	var w2 = obj2.collW;
	var h2 = obj2.collH;

	var l1=x1-w1/2;
	var r1=x1+w1/2;
	var t1=y1-h1/2;
	var b1=y1+h1/2;

	var l2=x2-w2/2;
	var r2=x2+w2/2;
	var t2=y2-h2/2;
	var b2=y2+h2/2;

	return (r1<l2 || // 1 is left of 2, or
			b1<t2 || // 1 is above 2
			l1>r2 || // 1 is right of 2
			t1>b2    // 1 is below 2
			) == false; // none of those conditions were met?
}