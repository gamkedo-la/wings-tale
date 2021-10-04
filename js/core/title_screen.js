var titleScreen;

function TitleScreen()
{
    this.draw = function()
    {
        //console.log("title screen! "+canvas.width+'x'+canvas.height);

        context.fillStyle = 'black';
		context.fillRect(0,0, canvas.width,canvas.height);

        context.drawImage(images["titlescreen"],0,0);

        context.fillStyle = 'white';
		context.textAlign = 'center';
        context.font = "10px Georgia";
		
        var lineY = 100;
        var lineSkip = 20;
        context.fillText("Click or press enter to start", canvas.width/2, lineY+=lineSkip*4);


    }
}

function initializeTitleScreen()
{
	titleScreen = new TitleScreen();
}