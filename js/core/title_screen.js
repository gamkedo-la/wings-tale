var titleScreen;


function TitleScreen()
{
    // decorative particles on the logo
    var titleframes = 0;
    var title_boom_x = 0;
    var title_boom_y = 0;
    var title_boom_n = 0;

    this.draw = function()
    {
        //console.log("title screen! "+canvas.width+'x'+canvas.height);
        //context.fillStyle = 'black';
		//context.fillRect(0,0, canvas.width,canvas.height);

        context.drawImage(images["level island"],0,-150+Math.sin(performance.now()/2500)*100);
        context.drawImage(images["titlescreen"],0,0);

        context.fillStyle = 'white';
		context.textAlign = 'center';
        context.font = "10px Georgia";
		
        var lineY = 100;
        var lineSkip = 20;
        context.fillText("Click or press enter to start", canvas.width/2, lineY+=lineSkip*4);

        // particles near the logo
        titleframes++;
        if (titleframes % 4 == 0) // slow down the anim
        {
            title_boom_n++;
            if (title_boom_n > SPLODE_FRAMES) {
                title_boom_x = 25+Math.random()*200;
                title_boom_y = 40+Math.random()*75;
                title_boom_n = 0;
            }
        }
        drawAnimFrame("splode",title_boom_x,title_boom_y,title_boom_n,SPLODE_DIM,SPLODE_DIM);

    }
}

function initializeTitleScreen()
{
	titleScreen = new TitleScreen();
}