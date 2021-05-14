var images = [];

function loadImages() {
    startedLoading = true
    const imageList = [
        {imgName: "player", theFile: "player.png"},
        {imgName: "bug", theFile: "enemybug.png"},
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