var levelSelectScreen;

function LevelSelectScreen() {
  this.draw = function () {
    // LEVEL MENU BACKGROUND
    scaledCtx.drawImage(
      images["level menu"],
      0,
      0,
      scaledCanvas.width,
      scaledCanvas.height
    );

    const MARGIN = 25; // spacing between UI elements

    //  ----- LEVEL SELECTIONS-----
    const LEVEL_SELECT_HEIGHT = scaledCanvas.height / 3;
    const LEVEL_SELECT_WIDTH = scaledCanvas.width / 4;
    const LEVEL_SELECT_Y = scaledCanvas.height / 3;
    const LEVEL_SELECT_X = scaledCanvas.width / 10;

    const level_selections = [
      "level menu island",
      "level menu space",
      "level menu moon",
    ];

    // Render level selections
    for (var i = 0; i < level_selections.length; i++) {
      scaledCtx.drawImage(
        images[level_selections[i]],
        LEVEL_SELECT_X + (LEVEL_SELECT_WIDTH + MARGIN) * i,
        LEVEL_SELECT_Y,
        LEVEL_SELECT_WIDTH,
        LEVEL_SELECT_HEIGHT
      );
    }

    //  ----- TEXT -----
    const TEXT_HEIGHT = 18;
    const TEXT_WIDTH = 96;
    const TEXT_X = LEVEL_SELECT_X + TEXT_WIDTH / 2;
    const TEXT_Y = LEVEL_SELECT_Y + LEVEL_SELECT_HEIGHT + MARGIN;

    const level_text = ["text island", "text space", "text moon"];

    // Render level names
    for (var i = 0; i < level_text.length; i++) {
      scaledCtx.drawImage(
        images[level_text[i]],
        TEXT_X + (LEVEL_SELECT_WIDTH + MARGIN) * i,
        TEXT_Y,
        TEXT_WIDTH,
        TEXT_HEIGHT
      );
    }
  };
}

function initializeLevelSelectScreen() {
  levelSelectScreen = new LevelSelectScreen();
}
