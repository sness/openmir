// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "waveformPlugin",
        defaults = {
            lowHz : 0,
            highHz : 8000,
            spectrogramLengthSec : 5,
            windowLengthSec : 20,
            windowWidthPx : 1000,
            windowHeightPx : 200,
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options );

        this._defaults = defaults;
        this._name = pluginName;

        // Raphael paper element
        this._paper = null;

        // UI elements
        this._slider = null;
        this._spectrogram = null;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            var that = this;

            this.draw();
        },
        
        draw: function() {
            console.log("editorWaveformPlugin draw");
            if (this._paper) {
                this._paper.clear();
            }
            this.drawWaveform();
        },

        drawWaveform: function(i) {
            // var spectrogramUrl = this.options.spectrogramUrl
            // var startSec = this._spectrograms[i].startSec;
            // var endSec = this._spectrograms[i].endSec;
            // var lowHz = this.options.lowHz;
            // var highHz = this.options.highHz;
            // var winSize = this.options.winSize;
            // var contrast = "50";
            // var spectrogramOptions = "?startSec=" + startSec + "&endSec=" + endSec + "&contrast=" + contrast;
            // spectrogramOptions += "&spectrumtype=magnitude&width=500&height=200&lowHz=" + lowHz + "&highHz=" + highHz;
            // spectrogramOptions += "&winSize=" + winSize;
            
            // var url = spectrogramUrl + spectrogramOptions;
            // var startPx = startSec * this._windowPxPerSec;
            // this._spectrograms[i].image = this._paper.image(url,startPx,0,this._spectrogramWidthPx,this.options.windowHeightPx);
        },

    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );
