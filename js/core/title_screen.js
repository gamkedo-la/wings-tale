var titleScreen;

function TitleScreen()
{
    this.draw = function()
    {
        context.fillStyle = 'black';
		context.fillRect(0,0, canvas.width,canvas.height);

		context.fillStyle = 'white';
		context.textAlign = 'center';
		context.font = "15px Georgia";

        var lineSkip = 20;
		var lineY = 15;

		context.fillText("Wings Tale", canvas.width/2, 15);
        context.fillText("a woo oo!", canvas.width/2, lineY+=lineSkip);

        context.font = "10px Georgia";
		context.fillText("Click or press enter to start", canvas.width/2, lineY+=lineSkip*4);
    }
}

function initializeTitleScreen()
{
	titleScreen = new TitleScreen();
}