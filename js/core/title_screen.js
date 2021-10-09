var titleScreen;

var creditsSize = 13;

function TitleScreen()
{
    // decorative particles on the logo
    var titleframes = 0;
    var title_boom_x = 0;
    var title_boom_y = 0;
    var title_boom_n = 0;

    var showCredits = false;

    var menuItems = 
        [{label:"Solo Play", action: function() {twoPlayerGame = false; p2AI = false; gameState = GAME_STATE_LEVEL_SELECT;}},
         {label:"Co-Op Play", action: function() {twoPlayerGame = true; p2AI = false; gameState = GAME_STATE_LEVEL_SELECT;}},
         {label:"Co-Op with AI", action: function() {twoPlayerGame = true; p2AI = true; gameState = GAME_STATE_LEVEL_SELECT;}},
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

    this.drawCreditsIfOnCreditScreen = function() {
        if(showCredits==false) {
            return;
        }
        var lineX = 13;
        var lineY = 1;
        var lineSkip = creditsSize+1;
        scaledCtx.font = creditsSize+"px Helvetica";
        for(var i=0;i<creditsList.length;i++) {
            unscaledShadowText(creditsList[i], lineX, lineY+=lineSkip, "white");
        }
    }

    this.draw = function()
    {
        //console.log("title screen! "+canvas.width+'x'+canvas.height);
        //context.fillStyle = 'black';
		//context.fillRect(0,0, canvas.width,canvas.height);

        context.drawImage(images["level island"],0,-150+Math.sin(performance.now()/2500)*100);

        if(showCredits == false) {
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
        } // if showCredits is false
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

function unscaledShadowText(showText, atX, atY, fgColor) {
    scaledCtx.fillStyle = 'black';
    scaledCtx.fillText(showText, atX+2, atY+2);
    scaledCtx.fillStyle = fgColor;
    scaledCtx.fillText(showText, atX, atY);
}

function initializeTitleScreen()
{
	titleScreen = new TitleScreen();
}

var creditsList = [
"Chris DeLeon: Project lead, core gameplay, spawn system and related custom editor, crude underlying game engine (AABB collision, animation, graphics layers, entity management), lava dragon boss functionality, initial version of powerups, enemy AI, two player support, second player AI, ground waypoint patrols, stars/lava backgrounds (not including rocky crust), moon depth map (final), adjustable shot length code, additional integration and misc. bugfixing, background animation support (used for lava and space), volcano",
"Michael Monty Tanner: Level design (all stages), implementation for octopus boss and mega frog boss, level select stage art, powerup distribution authoring, level select hover effect, randomized player ghost colors, laser shot tuning, debug health cheat, level transitions after bosses, clearing of scene for boss fights, death counter for testing, shot visibility improvements, powerup decay timing, boss health bars, hit flash boss fixes, better player respawn, lava boss phase escalation",
"Ryan Malm: Parallax background heightmap effect, real-time distortion ripples, retro cluster explosions, higher detail player sprite, Island stage background, wiggling tentacles, better enemy bullet graphic, player soft reset, spawner bug fix, webaudio compressor, procedural ground unit spawn (used for testing during development)",
"Armando Navarrete: Level music (Space, Lava), space level boss (art, design, and code), player speed powerup feature, smaller alien enemy, multi-stage boss support",
"Christer \"McFunkypants\" Kaitila: Logo, combo system, pixel font, scoreboard animation, high score storage and display, gamepad support, hit flash for enemies and bosses, rocky crust for lava level, destroyable buildings, ripple tint, speed trail, title clouds/background/details, powerup timer bars, support for non-server testing",
"Justin Davis: Level music (Island, Moon), score system, music integration, powerups cheat, level selection text improvement",
"Randy Tan Shaoxian: Player graphic tilt while dodging, bomb sight dynamic prediction, player temporary invulnerability flash and related functionality, early level select menu fixes, debug cheat key implementation, help menu bug fixes",
"Sergio Ferrer: Octopus boss art, defensive ring feature plus related art, original boss spawn implementation",
"Jeff \"Axphin\" Hanlon: Moon stage background, alien drone, laser shot, sounds (shoot variations, splash, dive, croak), shadow clone powerup, original waves background test, midboss plane prototype (unused), moon depth map prototype, adjustable shot length art",
"Vaan Hope Khani: Various enemy sprites (Dimo, Azmo), surface track editor improvements, frog tank / turret automatic selection",
"Stebs: Controls help menu, laser powerup collision improvements, initial title screen, original loading screen, text for level select, laser testing cheat",
"Baris Koklu: Enemy health, spawning bugs fixed, ground culling fix, level switch issue repaired",
"Eddie Ward: Fire dragon head graphic, octopus boss laser source fixes, Firefox compatibility fix",
"Patrick McKeown: Ground space frog, early moon and space level editing",
"Ashleigh M.: Powerup art (multishot, extra bomb, shadow clone), swooping Pineapple enemy",
"Kyle Black: Explosion bug fix, different depth map per state",
"Cam Newton: Flying enemy spark, frog tank sprite, level editor access to segment spawn width adjustment",
"H Trayford: Player 2 controls, ground enemy fire, level debug skip functionality",
"Rodrigo Bonzerr Lopez: Fire snake sprite",
"Gabriel Cornish: Fire dragon head contrast improved",
"Jonathan Peterson: Alternative player 2 sprite",
"Abhishek @akhmin_ak: Intro story text",
"Michael \"Misha\" Fewkes: Initial sound functionality",
"Guillermo De Leon & Tim Chase: Practice commit",
" ",
"                                    Game developed by members in HomeTeamGameDev.com - come make games with us!",
"                                                                         Click anywhere to return to the title screen"
];

function lineWrapCredits() { // note: gets calling immediately after definition!
  const newCut = [];
  var maxLineChar = 134;
  var findEnd;

  for(let i = 0; i < creditsList.length; i++) {
    const currentLine = creditsList[i];
    for(let j = 0; j < currentLine.length; j++) {
      /*const aChar = currentLine[j];
      if(aChar === ":") {
        if(i !== 0) {
          newCut.push("\n");
        }

        newCut.push(currentLine.substring(0, j + 1));
        newCut.push(currentLine.substring(j + 2, currentLine.length));
        break;
      } else*/ if(j === currentLine.length - 1) {
        if((i === 0) || (i >= creditsList.length - 2)) {
          newCut.push(currentLine);
        } else {
          newCut.push(currentLine.substring(0, currentLine.length));
        }
      }
    }
  }

  const newerCut = [];
  for(var i=0;i<newCut.length;i++) {
    while(newCut[i].length > 0) {
      findEnd = maxLineChar;
      if(newCut[i].length > maxLineChar) {
        for(var ii=findEnd;ii>0;ii--) {
          if(newCut[i].charAt(ii) == " ") {
            findEnd=ii;
            break;
          }
        }
      }
      newerCut.push(newCut[i].substring(0, findEnd));
      newCut[i] = newCut[i].substring(findEnd, newCut[i].length);
    }
  }

  creditsList = newerCut;
}
lineWrapCredits(); // note: calling immediately as part of init, outside the function