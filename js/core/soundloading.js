var sounds = [];
var soundsToLoad;

async function loadSounds() {
    
    if (location.protocol=='file:') {
        console.log("not using a web server: unable to download sounds. ignoring.");
        return; // no sound if no web server
    }
    
    startedLoading = true
    const soundList = [
        {sndName: "Island_Song", theFile: "Island_Song.mp3"},
        {sndName: "playerShot", theFile: "shoot-06.mp3"},
        {sndName: "splode", theFile: "shoot-01.mp3"},
        {sndName: "splode1", theFile: "shoot-02.mp3"},
        {sndName: "splode2", theFile: "shoot-03.mp3"},
        {sndName: "splode3", theFile: "shoot-04.mp3"},
       
    ];

    soundsToLoad = soundList.length;

    for (let i = 0; i < soundList.length; i++) {
        sounds[soundList[i].sndName] = await beginLoadingSound(soundList[i].sndName, soundList[i].theFile);
        soundsToLoad--;   
    }
}

async function beginLoadingSound(sndName, fileName) {
    if (!audioCtx) {
        console.log("ERROR: beginLoadingSound has no audioCtx: "+fileName);
        return;
    }
    src = "sounds/" + fileName;
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    return audioBuffer;
}