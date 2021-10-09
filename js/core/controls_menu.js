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
		context.fillText("Game Controls", canvas.width/2, 15);

		context.font = "10px Georgia";
		var lineSkip = 20;
		var lineY = 50;
		context.fillText("WASD: Move Player 1", canvas.width/2, lineY+=lineSkip);
		context.fillText("Arrow Keys: Move Player 2", canvas.width/2, lineY+=lineSkip);
		context.fillText("Space = Shoot Gun (Z for Player 1 in 2P)", canvas.width/2, lineY+=lineSkip);
		/*context.fillText("X = Throw Bomb (M for Player 1 if 2P)", canvas.width/2, lineY+=lineSkip);*/
		//lineY+=lineSkip
		//context.fillText("T = Two Player toggle", canvas.width/2, lineY+=lineSkip);
		context.fillText("L key = Level editor (WARNING: no way to save/export)", canvas.width/2, lineY+=lineSkip);
		context.fillText("Number Row Keys to use cheats. 4 resets cheats.", canvas.width/2, lineY+=lineSkip);
		context.fillText("Click to return to the main menu.", canvas.width/2,canvas.height - 5);
	}
}

function initializeControlsMenu()
{
	controlsMenu = new ControlsMenu();
}