// Play an audio file
function playAudio(filename) {
    // If phonegap is loaded, play the audio with the Phonegap Media
    // object, otherwise fall back to HTML5 audio.
    if (window.settings.phonegapReady) {
        if (window.lastAudio !== undefined) {
            window.lastAudio.pause();
        }

	    var audio = new Media("/" + filename);
        audio.play();
        window.lastAudio = audio;

    } else {
        if (window.lastAudio !== undefined) {
            window.lastAudio.pause();
        }

	    var audio = new Audio();
	    audio.src = filename;
	    audio.play();

        window.lastAudio = audio;
    }
}

function playClick() {
    var filename = "assets/sounds/click.mp3";

    // If phonegap is loaded, play the audio with the Phonegap Media
    // object, otherwise fall back to HTML5 audio.
    if (window.settings.phonegapReady) {
        new Media("/" + filename).play();
    } else {
	    var audio = new Audio();
	    audio.src = filename;
	    audio.play();
    }
}
