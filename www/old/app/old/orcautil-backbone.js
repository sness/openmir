////////////////////////////////////////////////////////////////////////////////
//                                                                            //
// game.js                                                                    //
//                                                                            //
// a matching game for orca calls using phonegap on the ipad and iphone       //
//                                                                            //
// sness@sness.net - 2012 - GPLv3                                             //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

// If you want to prevent dragging, uncomment this section
function preventBehavior(e) 
{ 
    e.preventDefault(); 
};

document.addEventListener("touchmove", preventBehavior, false);

/* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
   see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
   for more details -jm */
/*
  function handleOpenURL(url)
  {
  // TODO: do something with the url passed in.
  }
*/

function onBodyLoad()
{		
	document.addEventListener("deviceready", onDeviceReady, false);
    // localStorage.setItem("name", "Hello World!");
}

/* When this function is called, PhoneGap has been initialized and is ready to roll */
/* If you are supporting your own protocol, the var invokeString will contain any arguments to the app launch.
   see http://iphonedevelopertips.com/cocoa/launching-your-own-application-via-a-custom-url-scheme.html
   for more details -jm */
function onDeviceReady()
{
	// do your thing!
	navigator.notification.alert("PhoneGap is working")
}


// One global settings object for the application
window.settings = {
  level : 1,
  phonegapReady : false
};

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

$(document).ready(function () {

    // Disable fancy page transitions
    $.mobile.defaultPageTransition = 'none';

    termsAndConditions();
});

//
// Utility functions
//

// Is PhoneGap loaded and ready?
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    window.settings.phonegapReady = true;
}

// Random order sorting
function randOrd(){
    return (Math.round(Math.random())-0.5); 
}

// Block the touchmove event on the iPad and iPhone
function blockMove() {
    event.preventDefault() ;
}

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

//
// Save a user event back to the database
//
function recordBaseUserEvent(eventType, e) {
    var uiLocations = findUiLocations();
    recordUserEvent({
        'level' : 'baseEvent',
        'name' : eventType,
        'pageX' : e.originalEvent.pageX,
        'pageY' : e.originalEvent.pageY,
        'ui' : uiLocations
    });
}


function recordUserEvent(userEvent) {
    userEvent['appName'] = window.appName;
    userEvent['timestamp'] = ISODateString(new Date());
    // userEvent['guid'] = guidCookie();
    // $.post('/log', JSON.stringify(userEvent));
}

//
// Date and time functions
//
function ISODateString(d) {
    function pad(n){return n<10 ? '0'+n : n}
    return d.getUTCFullYear()+'-'
        + pad(d.getUTCMonth()+1)+'-'
        + pad(d.getUTCDate())+'T'
        + pad(d.getUTCHours() + - 8)+':' // Converted to PST
        + pad(d.getUTCMinutes())+':'
        + pad(d.getUTCSeconds())+'Z'
}

//
// Make Ajax requests work with CSRF
//
// https://docs.djangoproject.com/en/dev/ref/contrib/csrf/#ajax
//
$(document).ajaxSend(function(event, xhr, settings) {

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});

//
// Find the absolute position of an HTML element
//
// http://www.quirksmode.org/js/findpos.html
//
function findPos(obj) {
    var curleft = curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return {
            'left' : curleft,
            'top' : curtop
        };
    }
    else return {};
};

//
// Find the locations of all user elements
//
function findUiLocations() {
    items = {};
    $("img").each( function(n) {
        var $this = $(this)[0];
        var item = findPos($this);
        item['width'] = $this.width;
        item['height'] = $this.height;
        item['id'] = $this.id;
        var name = $(this).attr('class') + "." + $this.id;
        items[name] = item;
    });
    return items;
}

function findGameElements() {
    items = [];
    $("img").each( function(n) {
        var name = $(this).attr('class') + "." + $(this)[0].id;
        items.push(name);
    });
    return items;
}


//
// GUID - Globally unique identifier for session
//
// http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
//
function guidCookie() {
    var cookie = new jecookie('guid');
    cookie.load();
    if (cookie.data.guid === undefined) {
        cookie.data.guid = guidGenerator();
        cookie.save();
    }
    return cookie.data.guid;
    
    // if (cookie.load()) {
    //     if (cookie.data.guid === undefined) {
    //         cookie.data.guid = guidGenerator();
    //         cookie.save();
    //     }
    //     return cookie.data.guid;
    // } else {
    //     cookie.data.guid = guidGenerator();
    //     cookie.save();
    //     return cookie.data.guid;
    // }
}


function guidGenerator() {
    var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}