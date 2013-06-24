// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "recordingViewerSpectrogramPlugin",
        defaults = {
            lowHz : 0,
            highHz : 8000,
            spectrogramLengthSec : 5,
            startSec : 0,
            endSec : 20,
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
            console.log("recordingViewerSpectrogramPlugin init");
            var that = this;

            this._windowLengthSec = this.options.endSec - this.options.startSec;
            this._windowPxPerSec = this.options.windowWidthPx / this._windowLengthSec;
            this._windowSecPerPx = this._windowLengthSec / this.options.windowWidthPx;
            this._recordingWidthPx = this._windowPxPerSec * this.options.recordingLengthSec;
            this._spectrogramWidthPx = this._windowPxPerSec * this.options.spectrogramLengthSec;

            this._scrollLeftPx = this.options.startSec * this._windowPxPerSec;
            
            $(this.element).append("<div id='showSpectrogramViewer'></div>");

            this._dragRectFill = {stroke : "none", fill: "#337", "fill-opacity": 0.3};

            var el = $("#showSpectrogramViewer")[0];
			this._paper = Raphael(el, this._recordingWidthPx, 220);

            this.buildSpectrogramArray();

            $('#showSpectrogramViewer').scroll($.throttle( 500, function() {
                that._scrollLeftPx = $('#showSpectrogramViewer').scrollLeft();
                that.updateVisibleSpectrograms();

                // TODO(sness) - These should be updated in a global location
                var startSec = that._windowSecPerPx * that._scrollLeftPx;
                var endSec = startSec + that._windowLengthSec;
                
                $(that.element).trigger('scrollEvent', [startSec, endSec]);

            }));

            $('#showSpectrogramViewer').on("mouseup", function(e) {
            });

            // $('#showSpectrogramViewer').on("mousedown", function(e) {
            //     if (that._currentClip && that._currentClip.active) {
            //         that._currentClip.active = false
            //         that.drawClip(that,that._currentClip);
            //     }

            //     if (!that._clipAction) {
            //         that._mousedragInitPx = e.offsetX;
            //         that._mousedragInitSec = e.offsetX * that._windowSecPerPx;
            //         if (that._dragRect) {
            //             that._dragRect.remove();
            //         }
            //         that._dragRect = that._paper.rect(that._mousedragInitPx,0.5,1,199).
            //             attr({stroke : "none", fill: "#000", "fill-opacity": 0.7});
            //    }
            // });

            $('#showSpectrogramViewer').on("mousemove", function(e) {
            });

            $(document).keypress(function(e) {
            });

            // The backspace/delete key needs to be handled separately
            // from other keys.
            $(document).keydown(function(e) {
            });

            // When a currentTimeSecEvent is received, change slider position
            $(this.element).on('currentTimeSecEvent', function(event, currentTimeSec) {
                that._currentSec = currentTimeSec;
                that.updateSlider();
            });

            // When a currentTimeSecEvent is received, change slider position
            $(this.element).on('startSecEvent', function(event, startSec, endSec) {
                that.options.startSec = startSec;
                that.options.endSec = endSec;
                that.draw();
            });

            // When a winSizeEvent is received, update the spectorgram
            $(this.element).on('winSizeEvent', function(event, winSize) {
                that.options.winSize = winSize;
                that.draw();
            });

            // Send a seekSecEvent on a double click
            $(this.element).dblclick(function(e) {
                var x = e.offsetX;
                var y = e.offsetY;
                var audioPosSec = ((that.options.lengthSec / (that.options.windowWidthPx)) * (x)) + that.options.startSec;
                $(that.element).trigger('seekSecEvent', [audioPosSec]);
            });

            // Send a currentTimeSecEvent on a click
            $(this.element).mousedown(function(e) {
                var x = e.offsetX;
                var y = e.offsetY;
                var audioPosSec = ((that.options.lengthSec / (that.options.windowWidthPx)) * (x)) + that.options.startSec;
                $(that.element).trigger('currentTimeSecEvent', [audioPosSec]);
            });

            this.draw();

            $('#showSpectrogramViewer').scrollLeft(this._scrollLeftPx);

        },
        
        buildSpectrogramArray: function() {

            this._spectrograms = [];

            var currentStartSec = 0;
            var currentEndSec = currentStartSec + this.options.spectrogramLengthSec;

            while(currentEndSec < this.options.recordingLengthSec) {

                var spectrogram = {
                    startSec : currentStartSec,
                    endSec : currentEndSec,
                    image : null
                }
            
                this._spectrograms.push(spectrogram);
                currentStartSec = currentEndSec;
                currentEndSec = currentEndSec + this.options.spectrogramLengthSec;
            }

        },

        drawSlider: function() {
            this._slider = this._paper.path("M0.5,0.5L0.5,200.5").
                translate(this.options.spectrogramXOffset,this.options.spectrogramYOffset).
                attr({stroke : "#00ff00"});
            
        },

        updateSlider: function() {
            var startSec = this.options.startSec;
            var sliderPosition = (this._currentSec - startSec) * this._windowPxPerSec;
            if (this._slider) {
                this._slider.transform("t" + sliderPosition + ",0");
            }
        },

        draw: function() {
            this.options.lengthSec = this.options.endSec - this.options.startSec;
            this.options.lengthHz = this.options.highHz - this.options.lowHz;
            this.options.pixelsPerSec = this.options.windowWidthPx / this.options.lengthSec;
            this.options.pixelsPerHz = this.options.windowHeightPx / this.options.lengthHz;

            this._paper.clear();
            this.updateVisibleSpectrograms();
            this.drawSlider();
        },

        updateVisibleSpectrograms: function() {
            var visibleStartSec = this._windowSecPerPx * this._scrollLeftPx;
            var visibleEndSec = visibleStartSec + this._windowLengthSec;

            var spectrogramLengthSec = this.options.spectrogramLengthSec;
            var startIndex = Math.floor(visibleStartSec / spectrogramLengthSec);
            var endIndex = Math.floor(visibleEndSec / spectrogramLengthSec - 0.0001);

            console.log("recordingViewerSpectrogramPlugin updateVisibleSpectrograms");
            for (var i = startIndex; i <= endIndex; i++) {
                if (this._spectrograms[i].image == null) {
                    this.drawSpectrogram(i);
                }
            }
        },

        drawSpectrogram: function(i) {

            var spectrogramUrl = this.options.spectrogramUrl
            var startSec = this._spectrograms[i].startSec;
            var endSec = this._spectrograms[i].endSec;
            var lowHz = this.options.lowHz;
            var highHz = this.options.highHz;
            var winSize = this.options.winSize;
            var contrast = "50";
            var spectrogramOptions = "?startSec=" + startSec + "&endSec=" + endSec + "&contrast=" + contrast;
            spectrogramOptions += "&spectrumtype=magnitude&width=500&height=200&lowHz=" + lowHz + "&highHz=" + highHz;
            spectrogramOptions += "&winSize=" + winSize;
            
            var url = spectrogramUrl + spectrogramOptions;
            var startPx = startSec * this._windowPxPerSec;
            this._spectrograms[i].image = this._paper.image(url,startPx,0,this._spectrogramWidthPx,this.options.windowHeightPx);

            // X-axis
            var label = startSec + "s";
            var a = this._paper.text(startPx,210.5  , label).attr({font: "12px Helvetica"});
            if (startSec == 0) {
                a.attr({'text-anchor': 'start'});
            }
            var a = this._paper.path("M" + startPx + ",200.5L" + startPx + ",205.5");
            var a = this._paper.path("M" + startPx + ",200.5L" + (startPx + this._spectrogramWidthPx) + ",200.5");

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
