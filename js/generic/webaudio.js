const audioCtx = new AudioContext();
const audioMaster = audioCtx.createGain();
// Create a compressor node
const compressor = audioCtx.createDynamicsCompressor();
compressor.threshold.setValueAtTime(-60, audioCtx.currentTime);
compressor.knee.setValueAtTime(50, audioCtx.currentTime);
compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
compressor.attack.setValueAtTime(0, audioCtx.currentTime);
compressor.release.setValueAtTime(0.25, audioCtx.currentTime);
audioMaster.connect(compressor);
compressor.connect(audioCtx.destination);

function playSound(buffer, playbackRate = 1, pan = 0, volume = .5, loop = false) {

    if (!buffer) return;
    
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