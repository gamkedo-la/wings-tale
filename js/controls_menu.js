var controlsMenuIsOn = false;

function ControlsMenu()
{
	this.backgroundImage = "controls menu background";
	this.draw = function()
	{
		//context.drawImage(this.backgroundImage, 0,0, canvas.width,canvas.height);
		// context.fillStyle = 'black';
		// context.fillRect(0,0, canvas.width,canvas.height);
		
		//function drawAnimFrame(picName,atX,atY, whichFrame, frameW,frameH,optionalRow)
		drawAnimFrame(this.backgroundImage, 0,0, 0, 137,112);

		context.font = "20px Georgia";
		context.fillText("Hello World!", canvas.width/2, canvas.width/2);
		//console.log('should be drawing an image');
		
		// context.drawImage(this.backgroundImage,0,bgDrawY,GAME_W,GAME_H,
		// 									 0,0,GAME_W,GAME_H);
		//p1.draw();
	}
}

function initializeControlsMenu()
{
	controlsMenu = new ControlsMenu();
}