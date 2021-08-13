var images = [];

function loadImages() {
  startedLoading = true;
  const imageList = [
    { imgName: "player", theFile: "player01.png" },
    // {imgName: "player", theFile: "player.png"},
    { imgName: "player shot", theFile: "playershot.png" }, // original single flashing square
    { imgName: "player shot 2", theFile: "playershot2.png" }, // start,end,flashing middle frames for line
    { imgName: "player shot ground", theFile: "playershotground.png" },
    { imgName: "enemy shot", theFile: "enemyshot.png" },
    { imgName: "bomb sight", theFile: "bombsight.png" },
    { imgName: "splode", theFile: "splode.png" },
    { imgName: "bug", theFile: "enemybug.png" },
    { imgName: "swoop", theFile: "space-pineapple.png" },
    { imgName: "stallchase", theFile: "enemyaliendrone.png" },
    { imgName: "shockball", theFile: "enemyenergyspark.png" },
    { imgName: "octopus", theFile: "GiantOctopus.png" },
    { imgName: "tentacle", theFile: "tentacle.png" },
    { imgName: "alien ship", theFile: "AlienShip.png" },
    { imgName: "dimo", theFile: "enemyDimo.png" },
    { imgName: "powerup", theFile: "powerup.png" },
    { imgName: "turret", theFile: "enemyturret.png" },
    { imgName: "frog tank", theFile: "enemyspacefrog.png" },
    { imgName: "defense_ring_unit", theFile: "defense_ring_unit.png" },
    //{imgName: "level island", theFile: "level-islands.png"},

    { imgName: "level island", theFile: "islandLevelPaint.png" },
    { imgName: "depth map", theFile: "islandLevelDepth.png" },

    { imgName: "level space", theFile: "spaceLevelPaint.png" },
    { imgName: "depth space", theFile: "spaceLevelDepth.png" },

    { imgName: "level moon", theFile: "moonLevelPaint.png" },
    { imgName: "depth moon", theFile: "moonLevelDepth.png" },

    { imgName: "level lava", theFile: "lavaLevelPaint.png" },
    { imgName: "depth lava", theFile: "lavaLevelDepth.png" },

    { imgName: "level menu", theFile: "level-select-bg.png" },

    {
      imgName: "level menu island",
      theFile: "level-select-island-draft-2.png",
    },
    {
      imgName: "level menu island highlight",
      theFile: "level-select-island-highlight.png",
    },
    {
      imgName: "text island",
      theFile: "text-island.png",
    },

    {
      imgName: "level menu space",
      theFile: "level-select-space-draft-2.png",
    },
    {
      imgName: "level menu space highlight",
      theFile: "level-select-space-highlight.png",
    },
    {
      imgName: "text space",
      theFile: "text-space.png",
    },

    {
      imgName: "level menu moon",
      theFile: "level-select-moon-draft-2.png",
    },
    {
      imgName: "level menu moon highlight",
      theFile: "level-select-moon-highlight.png",
    },
    {
      imgName: "text moon",
      theFile: "text-moon.png",
    },

    {
      imgName: "level menu lava",
      theFile: "level-select-lava-draft-2.png",
    },
    {
      imgName: "level menu lava highlight",
      theFile: "level-select-lava-highlight.png",
    },
    {
      imgName: "text lava",
      theFile: "text-lava.png",
    },
 
    {
      imgName: "controls menu background",
      theFile: "controlsMenuBackground.png",
    },
  ];

  picsToLoad = imageList.length;

  for (let i = 0; i < imageList.length; i++) {
    beginLoadingImage(imageList[i].imgName, imageList[i].theFile);
  }
}

function beginLoadingImage(imgName, fileName) {
  const newImg = document.createElement("img");
  newImg.onload = function () {
    images[imgName] = newImg;
    picsToLoad--;
    if (picsToLoad <= 0) {
      // last image loaded?
      loadingDoneSoStartGame();
    }
  };
  newImg.src = "images/" + fileName;
}
