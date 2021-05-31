const audioCtx = new AudioContext();
const audioMaster = audioCtx.createGain();
audioMaster.connect(audioCtx.destination);

function playSound(buffer, playbackRate = 1, pan = 0, volume = .5, loop = false) {

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