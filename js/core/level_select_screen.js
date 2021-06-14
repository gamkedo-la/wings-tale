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
        scaledCtx.fillStyle = "white";
        scaledCtx.font = '10px Helvetica';
        var lineX = levX+6;
        var lineY = 50;
        var lineSkip = 10;
        scaledCtx.fillText("click",lineX,lineY+=lineSkip);
        scaledCtx.fillText("level",lineX,lineY+=lineSkip);
        scaledCtx.fillText("to",lineX,lineY+=lineSkip);
        scaledCtx.fillText("start",lineX,lineY+=lineSkip);
    }
}

function initializeLevelSelectScreen()
{
    levelSelectScreen = new LevelSelectScreen();
}