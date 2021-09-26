const MOON_LAST_SPLIT_DIST = 145;

var endScreen;

function EndScreen()
{
	var moonX = 145;
	var moonY = 90;
	var moonSplit = 0;
	var splitRate = 0.01;
    this.draw = function()
    {
        context.fillStyle = 'black';
		context.fillRect(0,0, canvas.width,canvas.height);

		context.fillStyle = 'white';
		context.textAlign = 'center';
		context.font = "15px Georgia";

        var lineSkip = 20;
		var lineY = 140;

        context.font = "10px Georgia";
		context.fillText("At last! We've destroyed the Moon. Take that, Moon.", canvas.width/2, lineY+=lineSkip*4);

		moonSplit += splitRate;
		splitRate += 0.004;
		var moonApartPlusShake = moonSplit + (Math.random()*0.7);
		drawList(splodeList);
		drawAnimFrame("moon-tl", moonX-moonApartPlusShake,moonY-moonApartPlusShake, 0, 40,50, 0);
		drawAnimFrame("moon-tr", moonX+moonApartPlusShake,moonY-moonApartPlusShake, 0, 40,50, 0);
		drawAnimFrame("moon-br", moonX+moonApartPlusShake,moonY+moonApartPlusShake, 0, 40,50, 0);
		drawAnimFrame("moon-bl", moonX-moonApartPlusShake,moonY+moonApartPlusShake, 0, 40,50, 0);
		var randAng = Math.PI * 2.0 * Math.random();
		var randDist = 0.0+(20.0+moonApartPlusShake) * Math.random();
		spawnSplode(moonX+Math.cos(randAng)*randDist,moonY+Math.sin(randAng)*randDist);
		moveList(splodeList);
		animateSplodes();
		if(moonSplit > MOON_LAST_SPLIT_DIST) {
			gameState = GAME_STATE_LEVEL_SELECT;
		}
    }
}

function initializeEndScreen()
{
	endScreen = new EndScreen();
}