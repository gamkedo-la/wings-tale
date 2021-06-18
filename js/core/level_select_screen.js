var levelSelectScreen;

function LevelSelectScreen()
{
    this.draw = function()
    {
        var levX = 0;
        var levWid= images[levNames[0]].width;
        for(var i=0;i<levNames.length;i++) 
        {
            scaledCtx.drawImage(images[ levNames[i] ], levX, 0);
            
            scaledCtx.lineWidth = "6";
            scaledCtx.strokeStyle = "lime";
            scaledCtx.beginPath();
            scaledCtx.rect(levX,0,levWid,scaledCanvas.height);
            scaledCtx.stroke();
            levX+=levWid;
        }
        //level select header text
        scaledCtx.fillStyle = "black";
        scaledCtx.font = '10px Helvetica';
        var lineX = levX+6;
        var lineY = 50;
        var lineSkip = 10;
        scaledCtx.fillText("click",lineX,lineY+=lineSkip);
        scaledCtx.fillText("level",lineX,lineY+=lineSkip);
        scaledCtx.fillText("to",lineX,lineY+=lineSkip);
        scaledCtx.fillText("start",lineX,lineY+=lineSkip);
        //level select levels text
        scaledCtx.fillStyle = "white";
        scaledCtx.font = '30px Georgia';
        var lineX = 60
        var lineY = 500;
		var wordSpacing = 350;
        scaledCtx.fillText("Space",lineX+wordSpacing-65,lineY-=20);
		scaledCtx.fillStyle = "green";

        scaledCtx.fillText("Island",lineX+18,lineY);
		scaledCtx.fillStyle = "Red";

        scaledCtx.fillText("Moon",lineX+wordSpacing+200,lineY);
    }
}

function initializeLevelSelectScreen()
{
    levelSelectScreen = new LevelSelectScreen();
}