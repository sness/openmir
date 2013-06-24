$(function() {
    initTrimClip();
});


function initTrimClip() {
    console.log("initTrimClip");
    initTrimClipSlider();

    // // Make a new trimClip object for this recording
    // var trimClip1 = new trimClip('1');
    // trimClip1.debug();
}

function initTrimClipSlider() {
    $( "#trimClipContainer" ).slider({
        range: true,
        min: 0,
        max: 100,
        values: [ 0, 100 ],
        slide: function( event, ui ) {
            $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        }
    });
    $( "#amount" ).val( $( "#trimClip" ).slider( "values", 0 ) +
                        " - " + $( "#trimClip" ).slider( "values", 1 ) );

}
