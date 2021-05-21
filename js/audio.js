
var musicVolume = 0.7;
var effectsVolume = 0.7;
var isMuted = false;
var firstGesture = false;
const VOLUME_INCREMENT = 0.05;


//define sounds



//--//sound classes-----------------------------------------------------------

function soundClass(fullFilenameWithPath) {

	var fileName = fullFilenameWithPath;
	var soundIndex = 0;
	var sounds = [new Audio(fileName)];

	this.play = function() {
		if(!sounds[soundIndex].paused) {
			sounds.splice(soundIndex, 0, new Audio(fileName));
		}

		sounds[soundIndex].currentTime = 0;
		sounds[soundIndex].volume = Math.pow(getRandomVolume() * effectsVolume * !isMuted, 2);
		sounds[soundIndex].play();

		soundIndex = (++soundIndex) % sounds.length;
	}

	this.stop = function() {
		for (var i in sounds) {
			sounds[i].pause();
		}

		sounds = [new Audio(fileName)];
		soundIndex = 0;
	}
}

function soundRandomClass(arrayOfFilenames) {
	var soundIndex = 0;
	var sounds = [''];

	for (var i = 0; i < arrayOfFilenames.length; i++) {
		sounds[i] = new Audio(arrayOfFilenames[i]);
		sounds[i+arrayOfFilenames.length] = new Audio(arrayOfFilenames[i]);
	}

	this.play = function() {
		soundIndex = rndInt(0, sounds.length - 1);
		if(!sounds[soundIndex].paused) {
			var startIndex = soundIndex;
			soundIndex++;
			while (!sounds[soundIndex].paused && startIndex != soundIndex) {
				if (soundIndex >= sounds.length) {
					soundIndex = 0;
				}
			}
		}

		sounds[soundIndex].currentTime = 0;
		sounds[soundIndex].volume = Math.pow(getRandomVolume() * effectsVolume * !isMuted, 2);
		sounds[soundIndex].play();
	}

	this.stop = function() {
		for (var i in sounds) {
			sounds[i].pause();
		}
	}
}

function soundLoopsClass(fullFilenameWithPath) {

	var fileName = fullFilenameWithPath;
	var sound = new Audio(fileName);
	sound.loop = true;

	this.play = function() {
		if (sound.paused) {
			sound.currentTime = 0;
			sound.volume = Math.pow(getRandomVolume() * effectsVolume * !isMuted, 2);
			sound.play();
		}
	}

	this.stop = function() {
		sound.pause();
	}
}

//--//sound functions---------------------------------------------------------
function getRandomVolume(){
	var min = 0.8;
	var max = 1;
	var randomVolume = Math.random() * (max - min) + min;
	return randomVolume.toFixed(2);
}

function toggleMute() {
	isMuted = !isMuted;
	backgroundMusic.setVolume(musicVolume);
}

function setMusicVolume(amount) {
	musicVolume = amount;
	if(musicVolume > 1.0) {
		musicVolume = 1.0;
	} else if (musicVolume < 0.0) {
		musicVolume = 0.0;
	}
	backgroundMusic.setVolume(musicVolume);
}

function turnMusicVolumeUp() {
	setMusicVolume(musicVolume + VOLUME_INCREMENT);
}

function turnMusicVolumeDown() {
	setMusicVolume(musicVolume - VOLUME_INCREMENT);
}

function setEffectsVolume(amount) {
	effectsVolume = amount;
	if(effectsVolume > 1.0) {
		effectsVolume = 1.0;
	} else if (effectsVolume < 0.0) {
		effectsVolume = 0.0;
	}
}

function turnEffectsVolumeUp() {
	setEffectsVolume(effectsVolume + VOLUME_INCREMENT);
}

function turnEffectsVolumeDown() {
	setEffectsVolume(effectsVolume - VOLUME_INCREMENT);
}

function setVolume(amount) {
	setMusicVolume(amount);
	setEffectsVolume(amount);
}

function turnVolumeUp() {
	turnMusicVolumeUp();
	turnEffectsVolumeUp();
}

function turnVolumeDown() {
	turnMusicVolumeDown();
	turnEffectsVolumeDown();
}