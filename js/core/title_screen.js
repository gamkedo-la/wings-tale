var titleScreen;


function TitleScreen()
{
    // decorative particles on the logo
    var titleframes = 0;
    var title_boom_x = 0;
    var title_boom_y = 0;
    var title_boom_n = 0;

    var showCredits = false;

    var menuItems = 
        [{label:"1 Player", action: function() {twoPlayerGame = false; p2AI = false; gameState = GAME_STATE_LEVEL_SELECT;}},
         {label:"2 Players", action: function() {twoPlayerGame = true; p2AI = false; gameState = GAME_STATE_LEVEL_SELECT;}},
         {label:"Human+AI", action: function() {twoPlayerGame = true; p2AI = true; gameState = GAME_STATE_LEVEL_SELECT;}},
         {label:"Controls", action: function() {gameState = GAME_STATE_CONTROLS;}},
         {label:"Credits", action: function() {showCredits = true;}}];

    var titleMenuMouseOver = -1;

    this.titleMenuHandleClick = function() {
        if(showCredits) {
            playSound(sounds.playerShot);
            showCredits = false;
        } else if(titleMenuMouseOver != -1) {
            playSound(sounds.playerShot);
            menuItems[titleMenuMouseOver].action();
        }
    }

    this.draw = function()
    {
        //console.log("title screen! "+canvas.width+'x'+canvas.height);
        //context.fillStyle = 'black';
		//context.fillRect(0,0, canvas.width,canvas.height);

        context.drawImage(images["level island"],0,-150+Math.sin(performance.now()/2500)*100);

        if(showCredits) {
            var creditsList = ["bippity","boppity","boop","click 2 go back"];
            var lineX = 5;
            var lineY = 1;
            var lineSkip = 6;
            for(var i=0;i<creditsList.length;i++) {
                micro_pixel_font(creditsList[i], lineX, lineY+=lineSkip);
            }
        } else {
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
            
            titleMenuMouseOver = -1;
            for(var i=0;i<menuItems.length;i++) {
                if(titleButtonHighlightIfMouseNear(menuItems[i].label, canvas.width*(i+1)/(menuItems.length+1), lineY+=lineSkip)) {
                    titleMenuMouseOver = i;
                }
            }
        } // end of else/not showCredits
    } // end of title draw
} // end of title menu class

function titleButtonHighlightIfMouseNear(buttonText, centerX, centerY) {
    var dx = mouseX-centerX;
    var dy = mouseY-centerY;
    var mouseDist = Math.sqrt(dx*dx+dy*dy);
    var isMouseNear = mouseDist < 20;
    shadowText(buttonText, centerX, centerY, (isMouseNear ? "cyan" : "gray"));
    return isMouseNear;
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