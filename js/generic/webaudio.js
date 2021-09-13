
// set only once the user interacts with the page
// to comply with browser "no autoplaying audio" rules
var audioCtx, audioMaster, compressor;

function initSounds() {
    //console.log("first click occurred! initializing webaudio.");
    // this must be run during the first click
    // and will cause a browser error if run earlier than that
    audioCtx = new AudioContext();
    audioMaster = audioCtx.createGain();
    // Create a compressor node
    compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-60, audioCtx.currentTime);
    compressor.knee.setValueAtTime(40, audioCtx.currentTime); // was 50, but this causes a warning message in the console about it being out of range 0..40
    compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
    compressor.attack.setValueAtTime(0, audioCtx.currentTime);
    compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
    audioMaster.connect(compressor);
    compressor.connect(audioCtx.destination);
    // finally we are allowed to run this safely
    loadSounds();
}

function playSound(buffer, playbackRate = 1, pan = 0, volume = .5, loop = false) {

    if (!buffer || !audioCtx) return;
    
    var source = audioCtx.createBufferSource();
    var gainNode = audioCtx.createGain();
    var panNode = audioCtx.createStereoPanner();
      
    source.buffer = buffer;
    source.connect(panNode);
    panNode.connect(gainNode);

    gainNode.connect(audioMaster);
  
    source.playbackRate.value = playbackRate;
    source.loop = loop;
    gainNode.gain.value = volume;
    panNode.pan.value = pan;
    source.start();
    return {volume: gainNode, sound: source};
  
  }