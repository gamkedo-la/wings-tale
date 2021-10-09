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

		context.textAlign = 'center';
        context.font = "10px Georgia";
        var lineY = 145;
        var lineSkip = 40;
        
        if (titleframes%20<10) { // flash
            shadowText("Choose how many players to start", canvas.width/2, lineY, 'white');
        }
        
        // todo
        lineSkip /= 3;
        lineY+=lineSkip/2;
        var menuItems = ["1 Player","2 Players","Human+AI","Controls","Credits"];
        for(var i=0;i<menuItems.length;i++) {
            titleButtonHighlightIfMouseNear(menuItems[i], canvas.width*(i+1)/(menuItems.length+1), lineY+=lineSkip);
        }
    }
}

function titleButtonHighlightIfMouseNear(buttonText, centerX, centerY) {
    var dx = mouseX-centerX;
    var dy = mouseY-centerY;
    var mouseDist = Math.sqrt(dx*dx+dy*dy);
    var isMouseNear = mouseDist < 20;
    shadowText(buttonText, centerX, centerY, (isMouseNear ? "cyan" : "gray"));
}

function shadowText(showText, atX, atY, fgColor) {
    context.fillStyle = 'black';
    context.fillText(showText, atX+1, atY+1);
    context.fillStyle = fgColor;
    context.fillText(showText, atX, atY);
}

function initializeTitleScreen()
{
	titleScreen = new TitleScreen();
}