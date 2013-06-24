// Play an audio file
function playAudio(filename) {

    if (window.soundManagerReady) {
        // Don't play the click sound on an iOS device, it can only play
        // one sound per user click
        var isIOS = ((/iphone|ipad/gi).test(navigator.appVersion));
        if (!(window.onWeb && isIOS)) {
            playClick();
        }
        
        var mySound = soundManager.createSound({
            id: Math.floor((Math.random()*100000)+1),
            url: filename
        });
        
        mySound.play();
    }

    // if (window.settings.mute != true) {
        
    //     // If phonegap is loaded, play the audio with the Phonegap Media
    //     // object, otherwise fall back to HTML5 audio.
    //     if (window.settings.phonegapReady) {
	//         new Media("/" + filename).play();
    //     } else {
	//         var audio = new Audio();
	//         audio.src = filename;
	//         audio.play();
    //     }
    // }
}

function playClick() {
    var mySound = soundManager.createSound({
        id: Math.floor((Math.random()*100000)+1),
        url: "assets/sounds/click.mp3"
    });

    mySound.play();

    // var filename = ;

    // // If phonegap is loaded, play the audio with the Phonegap Media
    // // object, otherwise fall back to HTML5 audio.
    // if (window.settings.phonegapReady) {
    //     new Media("/" + filename).play();
    // } else {
	//     var audio = new Audio();
	//     audio.src = filename;
	//     audio.play();
    // }
}
