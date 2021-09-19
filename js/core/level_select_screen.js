var levelSelectScreen;

function LevelSelectScreen() {
  this.mouseOverLevel = -1;

  this.startHightlightedLevel = function() {
    if(levelSelectScreen.mouseOverLevel != -1) {
      gameState = GAME_STATE_PLAY;
      levNow = levelSelectScreen.mouseOverLevel;
      currentLevelImageName = levNames[levNow];
      reset();
    }
  }

  this.draw = function () {
    // LEVEL MENU BACKGROUND
    scaledCtx.drawImage(
      images["level menu"],
      0,
      0,
      scaledCanvas.width,
      scaledCanvas.height
    );

    const MARGIN = 20; // spacing between UI elements

    //  ----- LEVEL SELECTIONS-----
    const LEVEL_SELECT_HEIGHT = scaledCanvas.height / 3;
    const LEVEL_SELECT_WIDTH = scaledCanvas.width / 4;
    const LEVEL_SELECT_X = (scaledCanvas.width - 2*(LEVEL_SELECT_WIDTH + MARGIN)) / 2;
    const LEVEL_SELECT_Y = 30;

    const level_selections = [
      "level menu island",
      "level menu space",
      "level menu moon",
      "level menu lava",
    ];
    const TEXT_HEIGHT = 18;
    const TEXT_WIDTH = 96;
    const TEXT_X_OFFSET = (LEVEL_SELECT_WIDTH-TEXT_WIDTH)/2;
    const TEXT_Y_OFFSET = LEVEL_SELECT_HEIGHT + MARGIN/2;

    const level_text = ["text island", "text space", "text moon", "text lava"];

    // Render level selections
    for (var i = 0; i < level_selections.length; i++) {
      var col = i%2;
      var row = Math.floor(i/2);

      LEVEL_RECTS[i] = {
        x: LEVEL_SELECT_X + (LEVEL_SELECT_WIDTH + MARGIN) * col,
        y: LEVEL_SELECT_Y + (LEVEL_SELECT_HEIGHT + MARGIN + TEXT_HEIGHT) * row,
        width: LEVEL_SELECT_WIDTH,
        height: LEVEL_SELECT_HEIGHT,
        name: level_selections[i],
      };

      scaledCtx.drawImage(
        images[level_selections[i]],
        LEVEL_RECTS[i].x,
        LEVEL_RECTS[i].y,
        LEVEL_RECTS[i].width,
        LEVEL_RECTS[i].height
      );
    }

    // Render level names
    for (var i = 0; i < level_text.length; i++) {
      scaledCtx.drawImage(
        images[level_text[i]],
        LEVEL_RECTS[i].x+TEXT_X_OFFSET,
        LEVEL_RECTS[i].y+TEXT_Y_OFFSET,
        TEXT_WIDTH,
        TEXT_HEIGHT
      );
    }

    if(noSoundDueToSafari) {
      micro_pixel_font("Safari browser detected (audio not supported)", 12, GAME_H-15);
      console.log("spam");
    }
  };
}

function initializeLevelSelectScreen() {
  levelSelectScreen = new LevelSelectScreen();
}

function handleLevelHover() {
  if (imagesLoaded == false) {
    // invalid unless loading finished
    return;
  }

  scaledCanvas.style.cursor = "initial";
  mouseOverLevel = -1;
  for (var i = 0; i < LEVEL_RECTS.length; i++) {
    if (
      unscaledMouseX >= LEVEL_RECTS[i].x &&
      unscaledMouseX <= LEVEL_RECTS[i].width + LEVEL_RECTS[i].x &&
      unscaledMouseY >= LEVEL_RECTS[i].y &&
      unscaledMouseY <= LEVEL_RECTS[i].height + LEVEL_RECTS[i].y
    ) {
      levelSelectScreen.mouseOverLevel = i;
      scaledCtx.drawImage(
        images[LEVEL_RECTS[i].name + " highlight"],
        LEVEL_RECTS[i].x,
        LEVEL_RECTS[i].y,
        LEVEL_RECTS[i].width,
        LEVEL_RECTS[i].height
      );
      scaledCanvas.style.cursor = "pointer";
    } else {
      scaledCtx.drawImage(
        images[LEVEL_RECTS[i].name],
        LEVEL_RECTS[i].x,
        LEVEL_RECTS[i].y,
        LEVEL_RECTS[i].width,
        LEVEL_RECTS[i].height
      );
    }
  }
}