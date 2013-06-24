////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// openmir-ipad-util.js                                                       //
//                                                                            //
// Utilties for openmir apps on the iPad                                      //
//                                                                            //
// sness@sness.net - 2012 - GPLv3                                             //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

// One global settings object for the application
window.settings = {
    phonegapReady : false,
    mute: false
};

var currentDownButton = undefined;
var currentDownButtonWidth = undefined;

function bindClickButtons() {
}

//
// Standardized mouse/touch down/up events
//
// The iPad fires both a mousedown and touchdown event when the user
// touches the screen.  This standardizes it so it works on the web
// and the iPad.
$.event.special.xdown = {
    setup: function() {
        var isIOS = ((/iphone|ipad/gi).test(navigator.appVersion));
        var xdown = isIOS ? "touchstart" : "mousedown";
        $(this).bind(xdown + ".xdownEvent", function(event) {
            event.type = "xdown";
            $.event.handle.apply(this, [event]);
        });
    },
    teardown: function() {
        $(this).unbind(".xdownEvent");
    }
};

$.event.special.xup = {
    setup: function() {
        var isIOS = ((/iphone|ipad/gi).test(navigator.appVersion));
        var xup = isIOS ? "touchend" : "mouseup";
        $(this).bind(xup + ".xupEvent", function(event) {
            event.type = "xup";
            $.event.handle.apply(this, [event]);
        });
    },
    tearup: function() {
        $(this).unbind(".xupEvent");
    }
};

// Stop events from propagating
function preventBehavior(e) 
{ 
    e.preventDefault(); 
};

// Is PhoneGap loaded and ready?
function onDeviceReady() {
    window.settings.phonegapReady = true;
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

