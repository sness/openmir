////////////////////////////////////////////////////////////////////////////////
//
// openmir-ipad-play.js
//
// (c) sness@sness.net (2013)
//

function runRaphael() {
    // Creates a canvas that covers the entire screen
    var paper = Raphael("main", "100%", "100%");

    // Creates a circle at x = 50, y = 40, with radius 10.
    var circle = paper.circle(200, 200, 100);

    // Sets the fill attribute of the circle to red (#f00)
    circle.attr("fill", "#f00");
    
    // Sets the stroke attribute of the circle to white
    circle.attr("stroke", "#000");

    // Sets the stroke attribute of the circle to white
    circle.attr("stroke", "#fff");

    // Add a function when the circle is clicked
    circle.mousedown(function() {
        $("#info").append("<br/>test");
    });

}

window.onload = function () {
	document.addEventListener("deviceready", onDeviceReady, false);
    document.addEventListener("touchmove", preventBehavior, false);

    // Make the shapes on the screen with Raphael.
    runRaphael();
};

