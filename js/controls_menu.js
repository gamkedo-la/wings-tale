var controlsMenu;

function ControlsMenu()
{
	this.backgroundImage = "controls menu background";
	this.draw = function()
	{
		// drawAnimFrame(this.backgroundImage, 0,0, 0, canvas.width,canvas.height);

		context.fillStyle = 'black';
		context.fillRect(0,0, canvas.width,canvas.height);

		context.fillStyle = 'white';
		context.textAlign = 'center';
		context.font = "15px Georgia";
		context.fillText("Controls Menu", canvas.width/2, 15);

		context.font = "10px Georgia";
		context.fillText("W/Up =  Move Up    A/Left = Move Left", canvas.width/2, 50);
		context.fillText("S/Down = Move Down    D/Right = Move Right", canvas.width/2, 70);
		context.fillText("Z/Spacebar/N = Shoot Gun", canvas.width/2,90);
		context.fillText("X/M = Throw Bomb", canvas.width/2, 110);

		context.fillText("Press C to return to the game.", canvas.width/2,canvas.height - 5);
	}
}

function initializeControlsMenu()
{
	controlsMenu = new ControlsMenu();
}