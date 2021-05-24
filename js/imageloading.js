var images = [];

function loadImages() {
    startedLoading = true
    const imageList = [
        {imgName: "player", theFile: "player.png"},
        {imgName: "player shot", theFile: "playershot.png"},
        {imgName: "enemy shot", theFile: "enemyshot.png"},
        {imgName: "splode", theFile: "splode.png"},
        {imgName: "bug", theFile: "enemybug.png"},
        {imgName: "turret", theFile: "enemyturret.png"},
        {imgName: "defense_ring_unit", theFile: "defense_ring_unit.png"},
        //{imgName: "level island", theFile: "level-islands.png"},
        {imgName: "level island", theFile: "islandLevelPaint.png"},
        {imgName: "depth map", theFile: "islandLevelDepth.png"},
    ];

    picsToLoad = imageList.length;

    for (let i = 0; i < imageList.length; i++) {
        beginLoadingImage(imageList[i].imgName, imageList[i].theFile);
    }
}

function beginLoadingImage(imgName, fileName) {
    const newImg = document.createElement("img");
    newImg.onload = function() {
        images[imgName] = newImg;
        picsToLoad--;
        if (picsToLoad <= 0) { // last image loaded?
            loadingDoneSoStartGame();
        }
    }
    newImg.src = "images/" + fileName;
}