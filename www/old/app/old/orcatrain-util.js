////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// game.js                                                                    //
//                                                                            //
// a matching game for orca calls using phonegap on the ipad and iphone       //
//                                                                            //
// sness@sness.net - 2012 - GPLv3                                             //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

// One global settings object for the application
window.settings = {
  phonegapReady : false
};

//
// Standardized mouse/touch down/up events
//
// The iPad fires both a mousedown and touchdown event when the user
// touches the screen.  This standardizes it so it works on the web
// and the iPad.
$.event.special.myDown = {
    setup: function() {
        var isIOS = ((/iphone|ipad/gi).test(navigator.appVersion));
        var myDown = isIOS ? "touchstart" : "mousedown";
        $(this).bind(myDown + ".myDownEvent", function(event) {
            event.type = "myDown";
            $.event.handle.apply(this, [event]);
        });
    },
    teardown: function() {
        $(this).unbind(".myDownEvent");
    }
};

$.event.special.myUp = {
    setup: function() {
        var isIOS = ((/iphone|ipad/gi).test(navigator.appVersion));
        var myUp = isIOS ? "touchstart" : "mouseup";
        $(this).bind(myUp + ".myUpEvent", function(event) {
            event.type = "myUp";
            $.event.handle.apply(this, [event]);
        });
    },
    tearup: function() {
        $(this).unbind(".myUpEvent");
    }
};

// If you want to prevent dragging, uncomment this section
function preventBehavior(e) 
{ 
    e.preventDefault(); 
};

function onBodyLoad()
{		
	document.addEventListener("deviceready", onDeviceReady, false);
}

// Is PhoneGap loaded and ready?
function onDeviceReady() {
    window.settings.phonegapReady = true;
}

// Show the terms and conditions to the user only once per every time
// the app is loaded.
function termsAndConditions() {
    // Check to see if the user has agree to the terms and conditions
    // and only show it to them if they haven't.
    var terms = localStorage.getItem("terms");
    if (terms === "true") {
        return;
    } else {
        // Only go to the main page if we are on the terms and
        // conditions page.  Not when we are on the game page.
        $.mobile.changePage("index.html#terms");
    }
    
    $('#agree').click(function() {
        localStorage.setItem("terms", "true");
        var terms = localStorage.getItem("terms");
    });
}

// Randomly sort an array
function shuffle(array) {
    var tmp, current, top = array.length;

    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }

    return array;
}

// Play an audio file
function playAudio(filename) {
    playClick();

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

function playClick() {
    var filename = "assets/sounds/click.mp3";

    // If phonegap is loaded, play the audio with the Phonegap Media
    // object, otherwise fall back to HTML5 audio.
    if (window.settings.phonegapReady) {
        new Media("/matchgame/" + filename).play();
    } else {
	    var audio = new Audio();
	    audio.src = filename;
	    audio.play();
    }
}

