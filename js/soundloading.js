var sounds = [];

async function loadSounds() {
    startedLoading = true
    const soundList = [
        {sndName: "playerShot", theFile: "shoot-06.mp3"},
        {sndName: "splode", theFile: "shoot-01.mp3"},
        {sndName: "secondReality", theFile: "secondRealityCover-placeholderMusic.mp3"},
    ];

    soundsToLoad = soundList.length;

    for (let i = 0; i < soundList.length; i++) {
        sounds[soundList[i].sndName] = await beginLoadingSound(soundList[i].sndName, soundList[i].theFile);
    }
}

async function beginLoadingSound(sndName, fileName) {
    src = "sounds/" + fileName;
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    soundsToLoad--;
    return audioBuffer;
    
}