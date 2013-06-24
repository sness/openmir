//
// A variable to indicate the game is on the web, as opposed to being on the iPad
//
window.onWeb = true;

// Soundmagnager
soundManager.url = '/assets/flash/';
soundManager.debugMode = false;
window.soundManagerReady = false;

soundManager.onready(function() {
    window.soundManagerReady = true;
});