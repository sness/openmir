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
    // console.log("recording");
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

